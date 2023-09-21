@echo off
setlocal enabledelayedexpansion

set "portToFind=3000"

for /f "tokens=5" %%a in ('netstat -a -n -o ^| findstr :%portToFind%') do (
    set "pid=%%a"
    taskkill /F /PID !pid!
)

endlocal
