@echo off
cd /d "%~dp0"
start "墨游 · 3003" /min cmd /c node server.mjs
timeout /t 2 /nobreak >nul
start "" "http://localhost:3003/"
