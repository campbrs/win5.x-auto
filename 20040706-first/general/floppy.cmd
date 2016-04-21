@echo off

rem 
rem floppy.cmd
rem
rem Called from WinPE
rem 

echo Warning: You are about to wipe the current machine, all data will be lost!
echo Press Y to continue....
set /p QUERY=

if %QUERY% EQU Y goto MAIN
if %QUERY% EQU y goto MAIN
goto END

:MAIN
set ParentScript=PRE
set EXIT_NOW=NO

rem delete old log
del /f /q a:\*.log


call a:\getvars.cmd -s "a:\buildinfo.txt"
if %EXIT_NOW% EQU YES goto END

echo Map Network Share to pull down OS files
net use %IT_InsShareMP% %IT_InsShare% /user:%IT_InsShareUID%

call %IT_InsShareMP%\scripts\general\globalvars %IT_InsShareMP%\scripts
if %EXIT_NOW% EQU YES goto END

call %IT_InsShareMP%\scripts\general\preinstall.cmd y

:END
