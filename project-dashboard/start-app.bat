@echo off
REM Project Dashboard Startup Script
echo ========================================
echo Starting Project Dashboard Application
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0"

REM Check if MongoDB is running (try to connect)
echo Checking MongoDB status...
net start | findstr MongoDB >nul
if %errorlevel% neq 0 (
    echo MongoDB is NOT running!
    echo Please start MongoDB first by running: start-mongodb.bat
    echo Or install MongoDB if not installed: install-mongodb.ps1
    echo.
    pause
    exit /b 1
)
echo MongoDB is running.
echo.

REM Start the backend server in a new window
echo Starting backend server (Port 3001)...
start "Backend Server" cmd /k "node server.js"

REM Wait a moment for server to start
timeout /t 2 /nobreak >nul

REM Start the frontend dev server
echo Starting frontend development server...
echo.
echo The application will open at: http://localhost:5173
echo.
echo Backend API: http://localhost:3001
echo.
npm run dev
