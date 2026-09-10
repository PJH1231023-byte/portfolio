@echo off
start "" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0Start-Game.ps1"
exit /b
