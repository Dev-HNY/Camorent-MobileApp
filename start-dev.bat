@echo off
echo.
echo ======================================
echo   Camorent Mobile App - Dev Server
echo ======================================
echo.
echo Choose your connection method:
echo.
echo [1] LAN - Same WiFi (Recommended - Fastest)
echo [2] Tunnel - Works anywhere (Slower but reliable)
echo [3] Localhost - Emulator only
echo [4] Clear cache and start
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Starting with LAN connection...
    echo Make sure your phone and computer are on the same WiFi!
    echo.
    call npm run start:lan
) else if "%choice%"=="2" (
    echo.
    echo Starting with Tunnel connection...
    echo This works from anywhere but may be slower.
    echo.
    call npm run start:tunnel
) else if "%choice%"=="3" (
    echo.
    echo Starting with Localhost...
    echo This only works with emulators/simulators!
    echo.
    call npm run start:localhost
) else if "%choice%"=="4" (
    echo.
    echo Clearing cache and starting...
    echo.
    call npm run start:clear
) else (
    echo.
    echo Invalid choice! Running default LAN mode...
    echo.
    call npm run start:lan
)

pause
