@echo off
echo.
echo ================================
echo  Demarrage de DevConnect
echo ================================
echo.

echo [1/2] Demarrage du backend (port 3000)...
start "DevConnect Backend" cmd /k "cd devconnect-backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Demarrage du frontend (port 8080)...
start "DevConnect Frontend" cmd /k "cd devconnect-frontend && npm run dev"

echo.
echo ================================
echo  DevConnect est pret !
echo ================================
echo   Frontend: http://localhost:8080
echo   Backend:  http://localhost:3000
echo.
echo Fermez les fenetres pour arreter les serveurs
echo.
pause
