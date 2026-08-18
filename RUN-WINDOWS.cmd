@echo off
title Sakinah
cd /d "%~dp0"
if not exist node_modules (
  echo Installing Sakinah dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Check internet connection and Node.js installation.
    pause
    exit /b 1
  )
)
echo Starting Sakinah...
start "" http://localhost:5173
call npm run dev
