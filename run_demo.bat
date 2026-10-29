@echo off
echo ===================================================
echo GauSSCol 3D Gaussian Splatting Web UI (Local Runner)
echo ===================================================
echo Opening http://localhost:8000 in your browser...
start http://localhost:8000
echo.
echo Running local web server on port 8000. Press CTRL+C to stop.
python -m http.server 8000
