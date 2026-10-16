@echo off
cd /d "C:\Users\shash\OneDrive\Desktop\Projects\SSS\startupsync-frontend"
echo Installing dependencies...
call node -e "require('child_process').execSync('npm install', {stdio: 'inherit', shell: 'cmd.exe'})"
if %errorlevel% equ 0 (
    echo.
    echo Dependencies installed successfully!
    echo Starting development server...
    call node node_modules/react-scripts/bin/react-scripts.js start
) else (
    echo Installation failed
)
pause
