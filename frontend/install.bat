@echo off
REM CareMind Frontend - Quick Install Script for Windows

echo.
echo 🏥 CareMind Frontend - Installation Script
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo ⚙️  Creating .env.local...
    copy .env.example .env.local
    echo ✅ .env.local created
    echo.
)

echo 🚀 Setup complete!
echo.
echo Next steps:
echo   1. npm run dev     - Start development server
echo   2. Open http://localhost:5173 in your browser
echo.
echo Other commands:
echo   npm run build      - Build for production
echo   npm run preview    - Preview production build
echo   npm run lint       - Run linter
echo.
echo Happy coding! 💻
echo.
pause
