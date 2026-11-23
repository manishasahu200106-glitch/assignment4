@echo off
TITLE MERN Blog App - Localhost 24/7 Server
echo ========================================================
echo Starting MERN Blog Application on http://localhost:5000
echo ========================================================

cd /d "%~dp0"

IF NOT EXIST "backend\node_modules" (
    echo [1/3] Installing backend dependencies...
    cd backend && npm install && cd ..
)

IF NOT EXIST "frontend\node_modules" (
    echo [2/3] Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

IF NOT EXIST "frontend\dist" (
    echo [3/3] Building frontend production bundle...
    cd frontend && npm run build && cd ..
)

echo Starting Server...
start "" "http://localhost:5000"
node backend\src\server.js
pause
