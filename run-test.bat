@echo off
echo ========================================
echo Student Management System Test
echo ========================================
echo.
echo Running test, please wait...
echo.

cd /d %~dp0

REM Create test results directory
if not exist test-results mkdir test-results

REM Run test script
node test-automation.js

echo.
echo Test completed.
echo.
pause
