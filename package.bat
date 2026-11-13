@echo off
rem ThemeForge release packager.
rem
rem   package                  one zip per theme in themes.txt
rem   package Meridian         just one theme
rem
rem Makes build\release\ThemeForge-<Theme>.zip, holding a folder
rem ThemeForge-<Theme>\ with the theme's .sty, its README if it has one,
rem and the LICENSE. These are the files you attach to a GitHub release;
rem the site's Download buttons point at them by name.

setlocal
pushd "%~dp0"

set "OUTDIR=build\release"
set "ONLY_THEME=%~1"
set FAILS=0

if not exist "%OUTDIR%" mkdir "%OUTDIR%"

for /f "usebackq eol=# tokens=1" %%A in ("themes.txt") do (
  if not defined ONLY_THEME (
    call :pack %%A
  ) else if /i "%ONLY_THEME%"=="%%A" (
    call :pack %%A
  )
)

echo.
if %FAILS%==0 (echo All done. Zips are in %OUTDIR%\) else (echo %FAILS% theme^(s^) failed.)
popd
exit /b %FAILS%


rem --- :pack Name -------------------------------------------------------
:pack
set "T=%~1"
set "STAGE=%OUTDIR%\ThemeForge-%T%"
set "ZIP=%OUTDIR%\ThemeForge-%T%.zip"

if not exist "themes\%T%\beamertheme%T%.sty" (
  echo   missing  themes\%T%\beamertheme%T%.sty
  set /a FAILS+=1
  exit /b
)

rem Start from an empty folder, so files you've since removed don't linger.
if exist "%STAGE%" rmdir /s /q "%STAGE%"
if exist "%ZIP%" del "%ZIP%"
mkdir "%STAGE%"

copy /y "themes\%T%\beamertheme%T%.sty" "%STAGE%\" >nul
if exist "themes\%T%\README.md" copy /y "themes\%T%\README.md" "%STAGE%\" >nul
copy /y "LICENSE" "%STAGE%\" >nul

rem Windows has no zip command, but PowerShell does. Zipping the folder
rem itself (not its contents) means people unzip to one tidy folder.
powershell -NoProfile -Command "Compress-Archive -Path '%STAGE%' -DestinationPath '%ZIP%'"
if errorlevel 1 (
  echo   FAILED   %ZIP%
  set /a FAILS+=1
) else (
  echo   ok       %ZIP%
)
rmdir /s /q "%STAGE%"
exit /b