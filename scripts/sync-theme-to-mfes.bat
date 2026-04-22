@echo off
REM Cross-Repository Theme Sync Script for Windows
REM Synchronizes theme changes from main repo to all connected micro frontends
REM
REM Usage:
REM   sync-theme-to-mfes.bat
REM   sync-theme-to-mfes.bat --help

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "MFE_CONFIG=%PROJECT_ROOT%\.mfe-config.json"
set "TEMP_DIR=%PROJECT_ROOT%\.tmp-theme-sync"

echo.
echo 🎨 Cross-Repository Theme Sync Script
echo ====================================
echo.

REM Check if .mfe-config.json exists
if not exist "%MFE_CONFIG%" (
    echo ❌ Error: .mfe-config.json not found
    echo.
    echo Please run: npm run sync:setup
    echo.
    exit /b 1
)

REM Clean up old temp directory
if exist "%TEMP_DIR%" (
    echo 🧹 Cleaning previous sync data...
    rmdir /s /q "%TEMP_DIR%" >nul 2>&1
)

mkdir "%TEMP_DIR%"

REM Build theme bundle
echo.
echo 📦 Building theme bundle...
cd /d "%PROJECT_ROOT%"
call npm run theme:build-bundle
if errorlevel 1 (
    echo ❌ Theme build failed
    exit /b 1
)

REM Get theme version
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set "THEME_VERSION=%%i"
echo ✅ Theme version: %THEME_VERSION%

REM Parse MFE list and sync to each
echo.
echo 🔄 Syncing theme to micro frontends...
echo.

REM Note: For Windows batch, we need to iterate through MFEs
REM This is a simplified version - for production, use PowerShell or Node.js

call :syncMFE "mfe-dashboard" "https://github.com/Mohitsagar236/mfe-dashboard.git" "develop"
call :syncMFE "mfe-admin" "https://github.com/Mohitsagar236/mfe_admin.git" "develop"
call :syncMFE "mfe-user-profile" "https://github.com/Mohitsagar236/mfe_user_profile.git" "develop"

REM Cleanup
echo.
echo 🧹 Cleaning up temporary files...
rmdir /s /q "%TEMP_DIR%" >nul 2>&1

echo.
echo ✅ Theme sync complete!
echo.
echo 📋 Summary:
echo   Version: %THEME_VERSION%
echo   Timestamp: %date% %time%
echo.
echo 📖 Next steps:
echo   1. Review changes in each MFE repository
echo   2. Create pull requests if changes exist
echo   3. Merge and deploy updates
echo.

exit /b 0

:syncMFE
setlocal enabledelayedexpansion
set "MFE_NAME=%~1"
set "REPO_URL=%~2"
set "REPO_BRANCH=%~3"

echo 📤 Syncing theme to %MFE_NAME%...

set "MFE_DIR=%TEMP_DIR%\%MFE_NAME%"

REM Clone or update repo
if exist "%MFE_DIR%" (
    echo   Updating existing clone...
    cd /d "%MFE_DIR%"
    git fetch origin >nul 2>&1
    git checkout %REPO_BRANCH% >nul 2>&1
    git pull origin %REPO_BRANCH% >nul 2>&1
) else (
    echo   Cloning %MFE_NAME%...
    cd /d "%TEMP_DIR%"
    git clone --depth 1 --branch %REPO_BRANCH% "%REPO_URL%" "%MFE_NAME%" >nul 2>&1
    if errorlevel 1 (
        echo   ⚠️  Failed to clone %MFE_NAME%
        exit /b 0
    )
)

REM Copy theme files
set "THEME_DEST=%MFE_DIR%\src\theme-shared"
if not exist "%THEME_DEST%" mkdir "%THEME_DEST%"

echo   Copying theme files...
xcopy /E /I /Y "%PROJECT_ROOT%\src\theme" "%THEME_DEST%\" >nul 2>&1
copy /Y "%PROJECT_ROOT%\tailwind.config.js" "%THEME_DEST%\" >nul 2>&1

REM Create version file
(
    echo.
    echo /**
    echo  * Auto-generated theme version file
    echo  * Last synced: !date! !time!
    echo  */
    echo.
    echo export const THEME_METADATA = {
    echo   version: '%THEME_VERSION%',
    echo   syncedAt: '!date!T!time!Z',
    echo   syncedBy: 'Windows Sync Script'
    echo } as const;
    echo.
    echo export const THEME_VERSION = THEME_METADATA.version;
) > "%THEME_DEST%\version.ts"

REM Commit and push if changes exist
cd /d "%MFE_DIR%"

git config user.name "Theme Sync Bot"
git config user.email "theme-sync@ctms.dev"
git add src\theme-shared\ >nul 2>&1

REM Check if there are changes
for /f %%A in ('git diff --cached --name-only') do (
    echo   Committing changes...
    git commit -m "chore(theme): sync theme updates from @ctms/theme@%THEME_VERSION%" >nul 2>&1
    
    echo   Pushing to origin/%REPO_BRANCH%...
    git push origin %REPO_BRANCH% >nul 2>&1
    
    if errorlevel 1 (
        echo   ⚠️  Push failed - may require branch protection or authentication
    ) else (
        echo   ✓ Theme synced to %MFE_NAME%
    )
    exit /b 0
)

echo   ✓ No theme changes in %MFE_NAME%

exit /b 0
