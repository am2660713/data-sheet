# MongoDB Installation Script for Windows
# This script downloads and installs MongoDB Community Edition

$ErrorActionPreference = "Stop"

$version = "8.0"
$msiPath = "$env:TEMP\mongodb-$version-windows-x86_64.msi"
$installDir = "C:\Program Files\MongoDB\Server\$version"

# Check if MongoDB is already installed
if (Test-Path "$installDir\bin\mongod.exe") {
    Write-Host "MongoDB $version is already installed at $installDir"
    exit 0
}

# Download MongoDB
Write-Host "Downloading MongoDB Community Edition $version..."
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-$version-signed.msi" -OutFile $msiPath -UseBasicParsing
} catch {
    # Try alternative download method
    Write-Host "Trying alternative download..."
    Invoke-WebRequest -Uri "https://repo.mongodb.org/win32/x86_64/mongodb-win32-x86_64-$version.zip" -OutFile "$env:TEMP\mongodb.zip" -UseBasicParsing
    # Extract if downloaded
    if (Test-Path "$env:TEMP\mongodb.zip") {
        Expand-Archive -Path "$env:TEMP\mongodb.zip" -DestinationPath "C:\Program Files\MongoDB\Server" -Force
        Rename-Item -Path "C:\Program Files\MongoDB\Server\mongodb-win32-x86_64-$version" -NewName "$version"
        Write-Host "MongoDB extracted successfully"
        exit 0
    }
    Write-Host "Failed to download MongoDB. Please install manually from https://www.mongodb.com/try/download/community"
    exit 1
}

# Install MongoDB
Write-Host "Installing MongoDB..."
Start-Process -FilePath "msiexec.exe" -ArgumentList "/quiet /i `"$msiPath`" INSTALLDIR=`"$installDir`"" -Wait

# Create data directory
$dataDir = "C:\Program Files\MongoDB\Server\$version\data\db"
if (!(Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force
}

Write-Host "MongoDB installed successfully at $installDir"
