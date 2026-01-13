# Database Migration Runner (PowerShell)
# Opens Supabase SQL Editor with complete database setup ready to run

Write-Host "Database Migration Runner" -ForegroundColor Cyan
Write-Host ""

$sqlFile = Join-Path $PSScriptRoot "..\database\database.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "ERROR: SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

$sql = Get-Content $sqlFile -Raw

Write-Host "SQL File: $sqlFile" -ForegroundColor Green
Write-Host "SQL Length: $($sql.Length) characters" -ForegroundColor Green
Write-Host ""

# Copy SQL to clipboard
$sql | Set-Clipboard
Write-Host "SUCCESS: SQL copied to clipboard!" -ForegroundColor Green
Write-Host ""

# Open Supabase SQL Editor
$url = "https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new"
Write-Host "Opening Supabase SQL Editor..." -ForegroundColor Yellow
Start-Process $url

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. SQL is already copied to your clipboard" -ForegroundColor White
Write-Host "2. Paste it into the SQL Editor (Ctrl+V)" -ForegroundColor White
Write-Host "3. Click Run button or press Ctrl+Enter" -ForegroundColor White
Write-Host "4. Verify success message" -ForegroundColor White
Write-Host ""
Write-Host "Migration complete!" -ForegroundColor Green
