@echo off
REM This script starts all MFE servers and the host shell in separate terminal windows
REM Ensures all Node processes are running before starting the host
REM NOTE: Each remote takes 5-10 seconds to fully boot, host checks with retries

echo.
echo ===================================
echo CTMS Microfrontend Platform Startup
echo ===================================
echo.
echo Starting all 4 servers: 3 MFEs + Host shell
echo Press CTRL+C in any terminal to stop that server
echo All servers log to their respective terminal windows
echo.

timeout /t 2

REM Start mfe-dashboard on port 5001
echo [1/4] Launching mfe-dashboard on port 5001...
start "MFE-Dashboard (5001)" cmd /k "cd C:\Users\cp813\Desktop\mfe-dashboard && npm run dev"
timeout /t 5

REM Start mfe_admin on port 5002
echo [2/4] Launching mfe_admin on port 5002...
start "MFE-Admin (5002)" cmd /k "cd C:\Users\cp813\Desktop\mfe_admin && npm run dev"
timeout /t 5

REM Start mfe_user_profile on port 5003
echo [3/4] Launching mfe_user_profile on port 5003...
start "MFE-User Profile (5003)" cmd /k "cd C:\Users\cp813\Desktop\mfe_user_profile && npm run dev"
timeout /t 5

REM Start host shell (thmc2) on port 5000
echo [4/4] Launching host shell (thmc2) on port 5000...
echo Waiting additional 3 seconds for all MFEs to fully initialize...
timeout /t 3
start "CTMS Host Shell (5000)" cmd /k "cd C:\Users\cp813\Desktop\thmc2 && npm run dev"

echo.
echo ===================================
echo All servers should be running now!
echo ===================================
echo.
echo Access the application:
echo   Host Shell:    http://localhost:5000
echo   Dashboard MFE: http://localhost:5001
echo   Admin MFE:     http://localhost:5002
echo   User Profile:  http://localhost:5003
echo.
echo IMPORTANT:
echo - Each server takes 5-10 seconds to boot
echo - Browser may need refresh if "Unable to load" errors appear
echo - Check browser console (F12) for detailed error logs
echo - Check terminal windows for server startup messages
echo.
echo Press any key to close this window...
pause
