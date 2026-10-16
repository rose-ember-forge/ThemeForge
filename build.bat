@echo off
rem ThemeForge demo builder.
rem
rem   build                  every theme in themes.txt, every variant
rem   build Meridian         every variant of one theme
rem   build Meridian dark    one variant
rem
rem PDFs go to build\demo-<Theme>-<variant>.pdf. latexmk remembers what each
rem PDF was made from, so a deck is only recompiled when demo.tex or the
rem theme it uses has changed. Running "build" after editing one theme only
rem rebuilds that theme's decks.

setlocal
pushd "%~dp0"

rem --- Settings: change these to match your folder layout ---
set "DECK=examples\demo.tex"
set "THEMEDIR=themes/"
set "OUTDIR=build"

set "ONLY_THEME=%~1"
set "ONLY_VARIANT=%~2"
set FAILS=0

for /f "usebackq eol=# tokens=1,*" %%A in ("themes.txt") do (
  if not defined ONLY_THEME (
    call :theme %%A %%B
  ) else if /i "%ONLY_THEME%"=="%%A" (
    call :theme %%A %%B
  )
)

echo.
if %FAILS%==0 (echo All done.) else (echo %FAILS% deck^(s^) failed. See the .log files in %OUTDIR%\)
popd
exit /b %FAILS%


rem --- :theme Name variant1 variant2 ... --------------------------------
:theme
set "T=%~1"
:nextvariant
shift
if "%~1"=="" exit /b
if not defined ONLY_VARIANT (
  call :compile %T% %~1
) else if /i "%ONLY_VARIANT%"=="%~1" (
  call :compile %T% %~1
)
goto nextvariant


rem --- :compile Name variant -------------------------------------------
:compile
set "OPTS=variant=%~2"
set "JOB=demo-%~1-%~2"
if "%~2"=="-" (
  set "OPTS="
  set "JOB=demo-%~1"
)
latexmk -pdf -silent -interaction=nonstopmode -halt-on-error ^
  -outdir=%OUTDIR% -jobname=%JOB% ^
  -usepretex="\makeatletter\def\input@path{{%THEMEDIR%}}\makeatother\def\ThemeName{%~1}\def\ThemeOptions{%OPTS%}" ^
  %DECK% >nul 2>&1
if errorlevel 1 (
  echo   FAILED  %JOB%
  set /a FAILS+=1
) else (
  echo   ok      %JOB%
)
exit /b
