@echo off
echo Setting up Python environment for CareMind...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo Python found, proceeding with setup...
echo.

REM Run the setup script
python setup.py

echo.
echo Setup complete! You can now run:
echo   python backend/main.py
echo.
pause