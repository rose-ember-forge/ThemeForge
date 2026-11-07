@echo off
rem ThemeForge screenshot maker.
rem
rem   screenshots                every theme in themes.txt, every variant
rem   screenshots Meridian       every variant of one theme
rem
rem Turns pages of build\demo-<Theme>-<variant>.pdf into
rem docs\themes\<Theme>\img\<Theme>-<variant>[-<label>].png, 1280 px wide.
rem Run build first so the PDFs are current.

setlocal
pushd "%~dp0"

rem --- Settings ---------------------------------------------------------
rem Pages to capture, as label:page. The label ends the file name and is
rem what goes in data-slide="..." on the theme page. "title" is special:
rem it gets no label, so the title slide is just <Theme>-<variant>.png.
rem demo.tex is shared, so these numbers are the same for every theme.
set "PAGES=title:1 divider:3 math:4 lists:5 tables:8 figures:9 standout:10 refs:12"
set "WIDTH=1280"
set "PDFDIR=build"

set "ONLY_THEME=%~1"
set MADE=0
set FAILS=0

for /f "usebackq eol=# tokens=1,*" %%A in ("themes.txt") do (
  if not defined ONLY_THEME (
    call :theme %%A %%B
  ) else if /i "%ONLY_THEME%"=="%%A" (
    call :theme %%A %%B
  )
)

echo.
echo %MADE% images made, %FAILS% problem(s).
popd
exit /b %FAILS%


rem --- :theme Name variant1 variant2 ... --------------------------------
:theme
set "T=%~1"
if not exist "docs\themes\%T%\img" mkdir "docs\themes\%T%\img"
:nextvariant
shift
if "%~1"=="" exit /b
call :variant %T% %~1
goto nextvariant


rem --- :variant Name variant -------------------------------------------
:variant
rem Same naming as build.bat: "-" means the theme has no variant option.
set "NAME=%~1-%~2"
if "%~2"=="-" set "NAME=%~1"
set "PDF=%PDFDIR%\demo-%NAME%.pdf"
if not exist "%PDF%" (
  echo   missing  %PDF%  ^(run build first^)
  set /a FAILS+=1
  exit /b
)
for %%P in (%PAGES%) do call :page %~1 %%P
echo   ok       %NAME%
exit /b


rem --- :page Name label:page -------------------------------------------
:page
for /f "tokens=1,2 delims=:" %%L in ("%~2") do (
  set "LABEL=%%L"
  set "NUM=%%M"
)
set "OUT=docs\themes\%~1\img\%NAME%-%LABEL%"
if "%LABEL%"=="title" set "OUT=docs\themes\%~1\img\%NAME%"
pdftoppm -png -f %NUM% -l %NUM% -singlefile -scale-to %WIDTH% "%PDF%" "%OUT%"
if errorlevel 1 (
  echo   FAILED   %OUT%.png
  set /a FAILS+=1
) else (
  set /a MADE+=1
)
exit /b
