@echo off
REM Start MongoDB script
echo Starting MongoDB...

REM Try to find MongoDB in default installation location
set MONGO_PATH=C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe

if exist "%MONGO_PATH%" (
    echo Found MongoDB at %MONGO_PATH%
    echo Starting MongoDB server...
    start "MongoDB" "%MONGO_PATH%" --dbpath "C:\Program Files\MongoDB\Server\8.0\data\db"
) else (
    echo MongoDB not found at default location.
    echo Please ensure MongoDB is installed.
    echo Download from: https://www.mongodb.com/try/download/community
    pause
)
