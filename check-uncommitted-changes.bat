@echo off
REM Check for uncommitted changes before build/deploy
REM This script warns about uncommitted changes but allows the process to continue

echo Checking for uncommitted changes...
echo.

REM Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo Not a git repository. Skipping check.
    exit /b 0
)

REM Create temp files for checking changes
git diff --name-only > temp_unstaged.txt
git diff --cached --name-only > temp_staged.txt
git ls-files --others --exclude-standard > temp_untracked.txt

REM Check if any of the files have content
set HAS_CHANGES=0

for /f %%i in ("temp_unstaged.txt") do if %%~zi gtr 0 set HAS_CHANGES=1
for /f %%i in ("temp_staged.txt") do if %%~zi gtr 0 set HAS_CHANGES=1
for /f %%i in ("temp_untracked.txt") do if %%~zi gtr 0 set HAS_CHANGES=1

if %HAS_CHANGES%==1 (
    echo WARNING: Uncommitted changes detected
    echo.
    
    for /f %%i in ("temp_unstaged.txt") do if %%~zi gtr 0 (
        echo Unstaged changes:
        type temp_unstaged.txt | findstr /r "^" | findstr /v "^$"
        echo.
    )
    
    for /f %%i in ("temp_staged.txt") do if %%~zi gtr 0 (
        echo Staged changes:
        type temp_staged.txt | findstr /r "^" | findstr /v "^$"
        echo.
    )
    
    for /f %%i in ("temp_untracked.txt") do if %%~zi gtr 0 (
        echo Untracked files:
        type temp_untracked.txt | findstr /r "^" | findstr /v "^$"
        echo.
    )
    
    echo Proceeding with build, but consider committing your changes.
    echo.
) else (
    echo No uncommitted changes detected
    echo.
)

REM Clean up temp files
del temp_unstaged.txt temp_staged.txt temp_untracked.txt >nul 2>&1

exit /b 0
