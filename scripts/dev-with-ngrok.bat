@echo off
REM ============================================================
REM EASE YOUR NEEDS - Development Server with Ngrok
REM ============================================================
REM This script:
REM 1. Starts Next.js dev server on port 3000
REM 2. Starts ngrok tunnel to expose localhost
REM 3. Updates Xendit webhook URL via API
REM ============================================================

echo.
echo ========================================
echo  Ease Your Needs - Dev + Ngrok Setup
echo ========================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ngrok not found!
    echo.
    echo Install ngrok first:
    echo   1. Download from: https://ngrok.com/download
    echo   2. Extract and add to PATH
    echo   3. Run: ngrok config add-authtoken YOUR_TOKEN
    echo.
    pause
    exit /b 1
)

REM Check if dev server is already running
echo [1/4] Checking if dev server is running...
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Dev server already running on port 3000
) else (
    echo [INFO] Starting Next.js dev server...
    echo.
    echo NOTE: This will open in a new window. Wait for it to be ready.
    echo.
    start "Next.js Dev Server" cmd /k "npm run dev"
    echo [WAIT] Waiting 10 seconds for dev server to start...
    timeout /t 10 /nobreak >nul
)

echo.
echo [2/4] Starting ngrok tunnel...
echo.

REM Start ngrok in background
start "Ngrok Tunnel" cmd /k "ngrok http 3000 --log=stdout"

echo [WAIT] Waiting 5 seconds for ngrok to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Getting ngrok public URL...
echo.

REM Get ngrok URL from API
for /f "tokens=*" %%i in ('curl -s http://127.0.0.1:4040/api/tunnels 2^>nul ^| findstr "public_url"') do set NGROK_URL=%%i

if "%NGROK_URL%"=="" (
    echo [WARN] Could not auto-detect ngrok URL
    echo.
    echo Please check the ngrok window for your public URL.
    echo It should look like: https://xxxx-xx-xx-xx-xx.ngrok-free.app
    echo.
    set /p NGROK_URL="Enter ngrok URL manually: "
) else (
    REM Clean up the JSON output
    set NGROK_URL=%NGROK_URL:"public_url": "=%
    set NGROK_URL=%NGROK_URL:",=%
    set NGROK_URL=%NGROK_URL: =%
)

echo [OK] Ngrok URL: %NGROK_URL%
echo.

REM Construct webhook URL
set WEBHOOK_URL=%NGROK_URL%/api/webhooks/xendit

echo [4/4] Webhook URL ready:
echo.
echo   %WEBHOOK_URL%
echo.
echo ========================================
echo  NEXT STEPS:
echo ========================================
echo.
echo  1. Go to Xendit Dashboard: https://dashboard.xendit.co
echo  2. Navigate to: Settings ^> Webhooks
echo  3. Add/Update webhook URL:
echo.
echo     %WEBHOOK_URL%
echo.
echo  4. Select events: invoice.paid, invoice.expired, invoice.failed
echo  5. Test payment with Xendit sandbox
echo.
echo ========================================
echo  IMPORTANT:
echo ========================================
echo.
echo  - Ngrok URL changes EVERY TIME you restart
echo  - You MUST update Xendit webhook URL each time
echo  - Keep both windows (Next.js + ngrok) open
echo  - Press Ctrl+C in both windows to stop
echo.
echo ========================================
echo.

pause
