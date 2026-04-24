# setup.ps1
$ErrorActionPreference = 'SilentlyContinue'
$ServerPath = ".\retab-server"
$ClientPath = ".\retab-client"

Write-Host "Checking for NVM..."
if (!(Get-Command nvm -ErrorAction SilentlyContinue)) {
    Write-Host "NVM not found. Installing automatically..."
    winget install -e --id CoreyButler.NVMforWindows --accept-package-agreements --accept-source-agreements
    exit
}

Write-Host "Setting up Node.js 24."
nvm install 24
nvm use 24

Write-Host "`nChecking for Docker..."
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker not found. Installing automatically..." -ForegroundColor Red
    winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
    exit
}

docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nDocker is not running. Open 'Docker Desktop' from your Start Menu." -ForegroundColor Red
    while ($LASTEXITCODE -ne 0) {
        Start-Sleep -Seconds 3
        docker info > $null 2>&1
    }
}

if (!(Test-Path "$ServerPath\node_modules")) {
    Write-Host "`nInstalling server dependencies..."
    Push-Location $ServerPath; npm install; Pop-Location
}
if (!(Test-Path "$ClientPath\node_modules")) {
    Write-Host "Installing client dependencies..."
    Push-Location $ClientPath; npm install; Pop-Location
}

$ContainerExists = docker ps -a -q -f name=retab-mysql
if (!$ContainerExists) {
    Write-Host "`nCreating database..."
    docker run --name retab-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=retab_db -p 3307:3306 -d mysql:latest
    Start-Sleep -Seconds 15
    Push-Location $ServerPath
    npx prisma migrate deploy
    npx prisma db seed
    Pop-Location
}

if (!(Test-Path "$ClientPath\dist")) {
    Write-Host "`nBuilding the application..."
    Push-Location $ClientPath
    npm run build
    Pop-Location
}

Write-Host "`nEverything is ready! Launching ReTab..." -ForegroundColor Green
Push-Location $ServerPath
npm run prod