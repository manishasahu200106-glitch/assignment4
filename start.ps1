Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting MERN Blog Application on http://localhost:5000" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "[1/3] Installing backend dependencies..." -ForegroundColor Yellow
    npm --prefix backend install
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "[2/3] Installing frontend dependencies..." -ForegroundColor Yellow
    npm --prefix frontend install
}

if (-not (Test-Path "frontend\dist")) {
    Write-Host "[3/3] Building frontend production bundle..." -ForegroundColor Yellow
    npm --prefix frontend run build
}

Start-Process "http://localhost:5000"
Write-Host "Server is running live. Press Ctrl+C to stop." -ForegroundColor Green
node backend\src\server.js
