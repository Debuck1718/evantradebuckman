# Rebuilds the distributable SDK tarballs in evantra/dist-artifacts/.
#
# Use this whenever the SDK source changes and you want to hand a fresh
# build to developers before the npm release is unblocked.
#
#   .\evantra\scripts\build-artifacts.ps1
#
# Then commit evantra/dist-artifacts/ and/or attach the .tgz files to a
# GitHub Release.

$ErrorActionPreference = "Stop"

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot   = Split-Path -Parent (Split-Path -Parent $scriptDir)
$evantraDir = Join-Path $repoRoot "evantra"
$outDir     = Join-Path $evantraDir "dist-artifacts"
$packages   = @("packages\sdk", "packages\identity-react")

# cmd.exe may not be resolvable by bare name in a minimal PATH.
$cmdExe = Join-Path $env:SystemRoot "System32\cmd.exe"

function Invoke-Npm {
    param(
        [Parameter(Mandatory)][string]$Dir,
        [Parameter(Mandatory)][string[]]$Args
    )

    Push-Location $Dir
    try {
        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        & $cmdExe /d /c "npm $($Args -join ' ')" | Out-Host
        $code = $LASTEXITCODE
        $ErrorActionPreference = $prevEap
        return $code
    }
    finally {
        Pop-Location
    }
}

Write-Host "==> Building Evantra Identity SDK artifacts" -ForegroundColor Cyan

New-Item -ItemType Directory -Path $outDir -Force | Out-Null

foreach ($pkg in $packages) {
    $dir  = Join-Path $evantraDir $pkg
    $name = (Get-Content (Join-Path $dir "package.json") -Raw | ConvertFrom-Json).name

    Write-Host "`n==> $name" -ForegroundColor Cyan

    Write-Host "Building..."
    if ((Invoke-Npm -Dir $dir -Args @("run", "build")) -ne 0) {
        Write-Host "Build failed for $name." -ForegroundColor Red
        exit 1
    }

    Write-Host "Packing..."
    if ((Invoke-Npm -Dir $dir -Args @("pack", "--pack-destination", $outDir)) -ne 0) {
        Write-Host "Pack failed for $name." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n==> Artifacts in $outDir" -ForegroundColor Cyan
Get-ChildItem $outDir -Filter *.tgz | ForEach-Object {
    Write-Host ("  " + $_.Name + "  (" + [math]::Round($_.Length / 1KB, 1) + " kB)")
}

Write-Host "`nConsumers install with:" -ForegroundColor Green
Write-Host "  npm install ./evantra/dist-artifacts/evantra-identity-sdk-0.1.0.tgz"
Write-Host "  npm install ./evantra/dist-artifacts/evantra-identity-react-0.1.0.tgz"
Write-Host "`nNext: commit evantra/dist-artifacts/, or attach the .tgz files to a GitHub Release."