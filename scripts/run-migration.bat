@echo off
REM Emergency Requests Migration Runner (Batch)
REM Opens Supabase SQL Editor with migration ready to run

echo.
echo 🚀 Emergency Requests Migration Runner
echo.

cd /d "%~dp0\.."
set SQL_FILE=database\emergency_requests.sql

if not exist "%SQL_FILE%" (
    echo ❌ SQL file not found: %SQL_FILE%
    pause
    exit /b 1
)

echo 📋 SQL File: %SQL_FILE%
echo.

REM Open SQL file in default editor and Supabase SQL Editor
start "" "https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new"
timeout /t 2 /nobreak >nul
start "" "%SQL_FILE%"

echo.
echo 📝 Next Steps:
echo 1. Copy all SQL from the opened file
echo 2. Paste it into the Supabase SQL Editor (Ctrl+V)
echo 3. Click 'Run' button or press Ctrl+Enter
echo 4. Verify success message
echo.
echo ✅ Ready to migrate!
echo.
pause

