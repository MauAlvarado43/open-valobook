@echo off
echo ========================================
echo Building OpenValoBook Electron App
echo ========================================
echo.
echo Step 1: Building Next.js static export...
call npm run build
echo.
echo Step 2: Packaging Electron application...
call npm run electron:dist
echo.
echo ========================================
echo Build complete!
echo Executable files are in /dist folder
echo ========================================
pause
