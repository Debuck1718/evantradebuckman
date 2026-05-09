@echo off
REM Website Deployment Script
REM This script prepares and validates the website for deployment

echo Starting website deployment preparation...

REM Check if all required files exist
if not exist "index.html" (
    echo ERROR: index.html not found!
    pause
    exit /b 1
)

if not exist "assets\css\styles.css" (
    echo ERROR: styles.css not found!
    pause
    exit /b 1
)

if not exist "assets\js\site.js" (
    echo ERROR: site.js not found!
    pause
    exit /b 1
)

REM Validate HTML files (basic check)
echo Validating HTML files...
for %%f in (*.html) do (
    echo Checking %%f
    REM Basic validation - check for common issues
    findstr /C:"<html" "%%f" >nul || echo WARNING: Missing <html> tag in %%f
    findstr /C:"</html>" "%%f" >nul || echo WARNING: Missing </html> tag in %%f
)

REM Check for broken links (basic)
echo Checking for obvious broken internal links...
for %%f in (*.html) do (
    for /f "tokens=*" %%l in ('findstr "href=" "%%f" ^| findstr "\.html"') do (
        for /f "tokens=2 delims==" %%u in ("%%l") do (
            set "url=%%u"
            setlocal enabledelayedexpansion
            set "url=!url:"=!"
            set "url=!url: =!"
            if "!url!" neq "" if not exist "!url!" if not "!url!"=="!url:#=!" (
                echo WARNING: Potential broken link in %%f: !url!
            )
            endlocal
        )
    )
)

REM Create deployment package
echo Creating deployment package...
set DEPLOY_DIR=deploy_%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%
mkdir "%DEPLOY_DIR%"

REM Copy files for deployment
xcopy /E /I /H /Y "." "%DEPLOY_DIR%" /EXCLUDE:deploy_exclude.txt

echo Deployment package created: %DEPLOY_DIR%
echo.
echo Ready for deployment! Upload the contents of %DEPLOY_DIR% to your web server.
echo.
echo Deployment checklist:
echo - [ ] Domain and hosting configured
echo - [ ] SSL certificate installed
echo - [ ] DNS records updated
echo - [ ] Google Analytics ID configured
echo - [ ] Contact forms tested
echo - [ ] All links working
echo.
pause