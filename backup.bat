@echo off
REM Website Backup Script
REM This script creates a timestamped backup of the website files

set TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=backups\%TIMESTAMP%

echo Creating backup: %BACKUP_DIR%

REM Create backup directory
mkdir "%BACKUP_DIR%"

REM Copy all website files (excluding node_modules, .git, etc.)
xcopy /E /I /H /Y "." "%BACKUP_DIR%" /EXCLUDE:backup_exclude.txt

echo Backup completed: %BACKUP_DIR%
echo.
echo Backup contents:
dir "%BACKUP_DIR%" /b
pause