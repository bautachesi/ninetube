@echo off
echo Starting Ninetube Backend Server...
echo.
echo Installing required packages...
pip install -r requirements.txt
echo.
echo Starting Flask API server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python app.py
pause