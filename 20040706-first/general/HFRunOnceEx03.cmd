@echo off
SET KEY=HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnceEx

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Beginning HFRunOnceEx03 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

rem Set default as this is last hotfix script
set CONT_HF=NO


IF %IT_OSVer% == 2000 (
	rem Internet Explorer 6.0 Updates
	REG ADD %KEY%\112 /VE /D "Internet Explorer 6.0 Hotfixes" /f
	REG ADD %KEY%\112 /V 010 /D "%systemdrive%\tempinst\win2000_sp5\Windows2000-js56-814078-x86-ENU.exe /Q /R:N" /f

	rem Set not to run another hotfix script
	set CONT_HF=NO
)

IF %IT_OSVer% == XP (
	rem Set not to run another hotfix script
	set CONT_HF=NO
)

IF %IT_OSVer% == 2003 (
	rem Set not to run another hotfix script
	set CONT_HF=NO
)

IF %IT_AppRunOnceTerm% == 0 (
	REG ADD %KEY%\252 /VE /D "Cleanup and Reboot..." /f
	REG ADD %KEY%\252 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\postfinalclean.cmd" /F 2>> %IT_OUTPUT%
) ELSE (
	REG ADD %KEY%\252 /VE /D "Seed App Install Script and Reboot..." /f
	REG ADD %KEY%\252 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\AppRunOnceEx01.cmd" /F 2>> %IT_OUTPUT% 
)

IF %IT_OSVer% EQU 2000 (
	REG ADD %KEY%\252 /V 020 /D "cmd /c shutdown.exe /r /l /t:10 /c" /f
) ELSE (
	REG ADD %KEY%\252 /V 020 /D "cmd /c shutdown.exe -r -f -t 10" /f
)

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Finished HFRunOnceEx03 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 


EXIT

