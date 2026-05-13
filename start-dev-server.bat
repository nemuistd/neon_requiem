@echo off
setlocal
cd /d "%~dp0"

echo Starting NEON REQUIEM local dev server...
where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js and try again.
  pause
  exit /b 1
)

call npm run dev
if errorlevel 1 pause

endlocal
