@echo off
echo Starting Ninetube Dual Server Architecture...
echo.
echo This will start both servers:
echo - Flask Backend API on http://localhost:5000
echo - Frontend Static Server on http://localhost:8000
echo.
echo Installing Flask requirements...
pip install -r requirements.txt
echo.

start "Ninetube Backend API" cmd /k "echo Flask Backend running on http://localhost:5000 && python app.py"
timeout /t 3 /nobreak > nul
start "Ninetube Frontend" cmd /k "echo Frontend server running on http://localhost:8000 && python -m http.server 8000"

echo.
echo Both servers are starting in separate windows:
echo - Backend API: http://localhost:5000
echo - Frontend: http://localhost:8000
echo.
echo Open your browser and go to: http://localhost:8000
echo.
pause