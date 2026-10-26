@echo off

cd /d "%~dp0"

echo Starting Backend...
start "Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --reload"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 5 /nobreak >nul

start http://localhost:5173

echo.
echo ====================================
echo AI Job Application Agent Started
echo ====================================
pause