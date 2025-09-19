@echo off
REM Imoya Flow Setup Script for Windows

echo 🌬️  Setting up Imoya Flow...

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ pnpm is not installed. Please install pnpm first:
    echo npm install -g pnpm
    pause
    exit /b 1
)

REM Check if Node.js version is 20+
for /f "tokens=1 delims=v" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=1 delims=." %%i in ("%NODE_VERSION%") do set NODE_MAJOR=%%i
if %NODE_MAJOR% LSS 20 (
    echo ❌ Node.js version 20+ is required. Current version: 
    node -v
    pause
    exit /b 1
)

echo ✅ Node.js version detected
echo ✅ pnpm version detected

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Check if Docker is available
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🐳 Starting PostgreSQL with Docker...
    docker compose up -d
    
    REM Wait for database to be ready
    echo ⏳ Waiting for database to be ready...
    timeout /t 5 /nobreak >nul
) else (
    echo ⚠️  Docker not found. Please make sure PostgreSQL is running locally.
)

REM Setup environment
echo ⚙️  Setting up environment...
if not exist .env (
    copy env.example .env
    echo 📝 Created .env file from template. Please update with your settings.
)

REM Setup database
echo 🗄️  Setting up database...
cd apps\backend
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma:seed

echo 🎉 Setup complete!
echo.
echo To start development:
echo   pnpm dev
echo.
echo This will start:
echo   - Backend API on http://localhost:4000
echo   - Frontend app on http://localhost:3000
echo.
echo Happy coding! 🚀
pause
