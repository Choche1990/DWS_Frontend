@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Usa la PC donde ya ejecutas el servidor Digital.
  pause
  exit /b 1
)
echo Para actualizar el codigo, ejecuta git pull --ff-only con el servidor detenido.
echo Iniciando Digital en http://localhost:8080
echo Mantener esta ventana abierta mientras se usa la plataforma.
node server.js
pause
