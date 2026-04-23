# Start-ReTab.ps1
$ErrorActionPreference = 'SilentlyContinue'
$ServerPath = ".\retab-server"
$ClientPath = ".\retab-client"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ReTab Auto-Setup & Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Installing automatically..." -ForegroundColor Red
    winget install -e --id OpenJS.NodeJS --accept-package-agreements --accept-source-agreements
    Write-Host "`n[SUCCESS] Node.js installed. Please close this window and run the launcher again." -ForegroundColor Green
    Pause
    exit
}

# 2. Check for Docker
Write-Host "Checking for Docker..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker not found. Installing automatically..." -ForegroundColor Red
    winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
    Write-Host "`n[ACTION REQUIRED] Docker installed! You must REBOOT your computer, open 'Docker Desktop' from your start menu to finish setup, and then run this launcher again." -ForegroundColor Magenta
    Pause
    exit
}

# 3. Check if Docker Engine is actually running
Write-Host "Checking Docker Engine..." -ForegroundColor Yellow
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[WAITING] Docker is not running. Please open 'Docker Desktop' from your Start Menu." -ForegroundColor Red
    Write-Host "Waiting for Docker to start (this can take a minute)..." -ForegroundColor Yellow
    while ($LASTEXITCODE -ne 0) {
        Start-Sleep -Seconds 3
        docker info > $null 2>&1
    }
}
Write-Host "Docker is ready!" -ForegroundColor Green

# 4. Install Node Dependencies (First run check)
if (!(Test-Path "$ServerPath\node_modules")) {
    Write-Host "`nFirst time setup: Installing server dependencies (this takes a moment)..." -ForegroundColor Yellow
    Push-Location $ServerPath
    npm install
    Pop-Location
}
if (!(Test-Path "$ClientPath\node_modules")) {
    Write-Host "First time setup: Installing client dependencies (this takes a moment)..." -ForegroundColor Yellow
    Push-Location $ClientPath
    npm install
    Pop-Location
}

# 5. Database Container Setup
Write-Host "`nChecking database..." -ForegroundColor Yellow
$ContainerExists = docker ps -a -q -f name=retab-mysql
if (!$ContainerExists) {
    Write-Host "First time setup: Creating MySQL database container..." -ForegroundColor Yellow
    docker run --name retab-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=retab_db -p 3307:3306 -d mysql:latest
    
    Write-Host "Waiting 15 seconds for database to wake up..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15

    Write-Host "Building database tables and injecting user..." -ForegroundColor Yellow
    Push-Location $ServerPath
    npx prisma migrate deploy
    npx prisma db seed
    Pop-Location
}

# 6. Launch the App
Write-Host "`nEverything is ready! Launching ReTab..." -ForegroundColor Green
Push-Location $ServerPath
npm run dev