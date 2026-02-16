@echo off
echo.
echo ==========================================
echo   Install Camorent Dev App on Phone
echo ==========================================
echo.
echo This will build and install the development app on your phone.
echo You only need to do this ONCE (or when updating native code).
echo.
echo Choose your platform:
echo.
echo [1] Android - Install on Android phone/emulator
echo [2] iOS - Install on iPhone/simulator
echo [3] Both - Install on both platforms
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Building for Android...
    echo Make sure your Android phone is connected via USB with USB debugging enabled!
    echo Or make sure Android emulator is running.
    echo.
    pause
    call npm run android:dev
) else if "%choice%"=="2" (
    echo.
    echo Building for iOS...
    echo Make sure you have Xcode installed and iOS simulator running!
    echo.
    pause
    call npm run ios:dev
) else if "%choice%"=="3" (
    echo.
    echo Building for both platforms...
    echo.
    pause
    echo Building Android...
    call npm run android:dev
    echo.
    echo Building iOS...
    call npm run ios:dev
) else (
    echo.
    echo Invalid choice!
    pause
    exit
)

echo.
echo ==========================================
echo   Installation Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Run start-dev.bat to start the development server
echo 2. Open the "Camorent" app on your phone
echo 3. Start coding and see changes in real-time!
echo.
pause
