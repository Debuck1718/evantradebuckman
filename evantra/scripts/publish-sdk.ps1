# Publishes the Evantra Identity SDK packages to npm.
#
# Run this AFTER you have logged in:
#
#   npm login
#   npm whoami
#   .\evantra\scripts\publish-sdk.ps1 -DryRun          # build + show tarball, no upload
#   .\evantra\scripts\publish-sdk.ps1 -Otp 123456      # real publish (2FA account)
#   .\evantra\scripts\publish-sdk.ps1                  # real publish (token w/ 2FA bypass)
#
# npm is invoked through cmd.exe. This avoids PowerShell turning npm's normal
# stderr output ("npm notice") into a terminating NativeCommandError, and gives
# a clean exit code we can branch on.

param(
    [switch]$DryRun,

    # One-time password from your authenticator, if your account requires 2FA
    # for publishes and you are not using a granular token with 2FA bypass.
    [string]$Otp
)

$ErrorActionPreference = "Stop"

# cmd.exe may not be resolvable by bare name in a minimal PATH; use the absolute path.
$cmdExe = Join-Path $env:SystemRoot "System32\cmd.exe"

# Locate the repo root (this script lives in <root>\evantra\scripts).
$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot   = Split-Path -Parent (Split-Path -Parent $scriptDir)
$evantraDir = Join-Path $repoRoot "evantra"
$packages   = @("packages\sdk", "packages\identity-react")

# Run an npm command in a directory and return its exit code.
# Output is streamed to the console; we only care about success/failure.
function Invoke-Npm {
    param(
        [Parameter(Mandatory)][string]$Dir,
        [Parameter(Mandatory)][string[]]$Args
    )

    Push-Location $Dir
    try {
        # npm/cmd write normal notices to stderr; collect it instead of aborting.
        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        # Do NOT pipe this through a cmdlet. In PowerShell, $LASTEXITCODE after
        # a pipeline is the exit code of the LAST command in that pipeline, so
        # `... | Out-Host` makes $LASTEXITCODE Out-Host's always-successful code
        # and every npm failure looks like a success. Capture to a temp file
        # instead, then replay it: no pipeline, so $LASTEXITCODE stays cmd.exe's.
        $logFile = [System.IO.Path]::GetTempFileName()
        try {
            & $cmdExe /d /c "npm $($Args -join ' ') > `"$logFile`" 2>&1"
            $code = $LASTEXITCODE
            Get-Content -LiteralPath $logFile | ForEach-Object { Write-Host $_ }
        }
        finally {
            Remove-Item -LiteralPath $logFile -Force -ErrorAction SilentlyContinue
        }
        $ErrorActionPreference = $prevEap

        return $code
    }
    finally {
        Pop-Location
    }
}

# Capture npm output as a string (used for values we need to read).
function Get-NpmOutput {
    param(
        [Parameter(Mandatory)][string]$Dir,
        [Parameter(Mandatory)][string[]]$Args
    )

    Push-Location $Dir
    try {
        # npm/cmd write normal notices to stderr; collect it instead of aborting.
        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        $out = (& $cmdExe /d /c "npm $($Args -join ' ')" 2>&1 | Out-String)
        $code = $LASTEXITCODE
        $ErrorActionPreference = $prevEap

        return [pscustomobject]@{
            Output   = $out.Trim()
            ExitCode = $code
        }
    }
    finally {
        Pop-Location
    }
}

# True when the current npm user can publish to the given org scope.
function Test-OrgAccess {
    param([Parameter(Mandatory)][string]$Org)

    $result = Get-NpmOutput -Dir $repoRoot -Args @("org", "ls", $Org)

    return ($result.ExitCode -eq 0) -and ($result.Output -notmatch "error")
}

Write-Host "==> Evantra Identity SDK publish" -ForegroundColor Cyan

$publishScope = "@evantra-identity"

# 1. Auth check ---------------------------------------------------------------
$auth = Get-NpmOutput -Dir $repoRoot -Args @("whoami")
if ($auth.ExitCode -ne 0 -or [string]::IsNullOrWhiteSpace($auth.Output)) {
    Write-Host "Not logged in to npm. Run 'npm login' first, then re-run this script." -ForegroundColor Red
    exit 1
}

$whoami = $auth.Output
Write-Host "Authenticated as: $whoami"

if (-not (Test-OrgAccess -Org "evantra-identity")) {
    Write-Host "Warning: these packages publish to the '$publishScope' scope." -ForegroundColor Yellow
    Write-Host "         '$whoami' must own that org or be a member with publish rights." -ForegroundColor Yellow
}

# 2. Build + verify each package ---------------------------------------------
foreach ($pkg in $packages) {
    $dir  = Join-Path $evantraDir $pkg
    $name = (Get-Content (Join-Path $dir "package.json") -Raw | ConvertFrom-Json).name

    Write-Host "`n==> $name" -ForegroundColor Cyan

    Write-Host "Building..."
    if ((Invoke-Npm -Dir $dir -Args @("run", "build")) -ne 0) {
        Write-Host "Build failed for $name." -ForegroundColor Red
        exit 1
    }

    Write-Host "Tarball contents:"
    $pack = Get-NpmOutput -Dir $dir -Args @("pack", "--dry-run")
    if ($pack.ExitCode -ne 0) {
        Write-Host "Pack failed for $name." -ForegroundColor Red
        Write-Host $pack.Output
        exit 1
    }
    $pack.Output -split "`n" |
        Select-String "npm notice" |
        ForEach-Object { Write-Host ("  " + $_.Line.Trim()) }
}

if ($DryRun) {
    Write-Host "`nDry run complete. Nothing was uploaded." -ForegroundColor Yellow
    exit 0
}

# 3. Publish ------------------------------------------------------------------
foreach ($pkg in $packages) {
    $dir  = Join-Path $evantraDir $pkg
    $name = (Get-Content (Join-Path $dir "package.json") -Raw | ConvertFrom-Json).name

    Write-Host "`n==> Publishing $name" -ForegroundColor Cyan

    # publishConfig.access is "public", so no --access flag is required.
    $publishArgs = @("publish")
    if ($Otp) {
        $publishArgs += "--otp=$Otp"
    }

    if ((Invoke-Npm -Dir $dir -Args $publishArgs) -ne 0) {
        Write-Host "Publish failed for $name." -ForegroundColor Red
        if (-not $Otp) {
            Write-Host "Two-factor authentication is required. Re-run and pass a current" -ForegroundColor Yellow
            Write-Host "authenticator code as:   -Otp 123456" -ForegroundColor Yellow
        }
        else {
            Write-Host "The OTP may have expired; codes are only valid briefly. Get a fresh one and retry." -ForegroundColor Yellow
        }
        exit 1
    }
}

# 4. Verify -------------------------------------------------------------------
# A publish that reported success but did not land on the registry is still a
# failed release, so this step decides the script's exit code rather than just
# printing a red line and continuing (which is how a silent failure used to
# look like a successful run).
Write-Host "`n==> Verifying on the registry" -ForegroundColor Cyan
$verified = 0
foreach ($pkg in $packages) {
    $dir  = Join-Path $evantraDir $pkg
    $name = (Get-Content (Join-Path $dir "package.json") -Raw | ConvertFrom-Json).name
    $want = (Get-Content (Join-Path $dir "package.json") -Raw | ConvertFrom-Json).version

    $view = Get-NpmOutput -Dir $repoRoot -Args @("view", $name, "version")
    if ($view.ExitCode -eq 0 -and $view.Output.Trim() -eq $want) {
        Write-Host ("  " + $name + "@" + $view.Output + " is live") -ForegroundColor Green
        $verified++
    }
    elseif ($view.ExitCode -eq 0) {
        Write-Host ("  " + $name + " shows " + $view.Output + " but package.json says " + $want) -ForegroundColor Red
    }
    else {
        # A 404 here is often just registry read lag; the package can still be
        # live. Ask the user to confirm in the browser before treating it as
        # fatal, but do NOT report the run as successful.
        Write-Host ("  " + $name + "@" + $want + " - not visible on the registry yet") -ForegroundColor Red
        Write-Host ("    The publish may still have succeeded; the registry read path lags." + " Check https://www.npmjs.com/package/" + $name) -ForegroundColor Yellow
    }
}

if ($verified -ne $packages.Count) {
    Write-Host "`nNot every package was confirmed on the registry. See above." -ForegroundColor Red
    exit 1
}

Write-Host "`nDone. Consumers can now run:" -ForegroundColor Green
Write-Host "  npm install @evantra-identity/sdk @evantra-identity/react"