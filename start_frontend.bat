@echo off
echo Starting Ninetube Frontend Server...
echo.
echo Starting Python HTTP server on http://localhost:8000
echo This serves the HTML, CSS, and JS files
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause