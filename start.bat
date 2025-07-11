@echo off
echo 🚀 Starting Wayne Enterprises Business Intelligence Dashboard...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
pip install -r requirements.txt

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Start backend in background
echo 🔧 Starting FastAPI backend...
start "Wayne Backend" cmd /k "cd backend && python main.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting Next.js frontend...
start "Wayne Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ Wayne Enterprises Dashboard is starting up!
echo.
echo 📊 Dashboard: http://localhost:3000
echo 🔧 API Docs: http://localhost:8000/docs
echo 📈 API: http://localhost:8000
echo.
echo Both services are running in separate windows.
echo Close those windows to stop the services.
echo.
pause 