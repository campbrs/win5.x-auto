@echo off
SET KEY=HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnceEx

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Beginning HFRunOnceEx02 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

rem Set default as this is last hotfix script
set CONT_HF=NO



rem OS Specific Patches and Hotfixes

IF %IT_OSVer% == 2000 (
	rem Windows 2000 Hotfixes

	rem Internet Explorer 6.0 Updates

	rem Windows Media Player 9 Updates
	REG ADD %KEY%\113 /VE /D "Windows Media Player 9 Hotfixes" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\113 /V 010 /D "%systemdrive%\tempinst\MS_WMP_9\WindowsMedia-KB819639-x86-ENU.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\113 /V 020 /D "%systemdrive%\tempinst\MS_WMP_9\WindowsMedia-KB828026-x86-ENU.exe -u -z -q -n -o" /F 2>> %IT_OUTPUT%

	rem Set not to run another hotfix script
	set CONT_HF=YES
)

IF %IT_OSVer% == XP (
	rem Windows Media Player 9 Updates
	REG ADD %KEY%\113 /VE /D "Windows Media Player 9 Updates" /f
	REG ADD %KEY%\113 /V 010 /D "%systemdrive%\tempinst\MS_WMP_9\WindowsMedia9-KB819639-x86-ENU.exe /Q:A /R:N" /f
	REG ADD %KEY%\113 /V 020 /D "%systemdrive%\tempinst\MS_WMP_9\WindowsMedia-KB828026-x86-ENU.exe /quiet /norestart /o /n" /f
	REG ADD %KEY%\113 /V 030 /D "%systemdrive%\tempinst\MS_WMP_9\WindowsXP-WMP9-CODECS.exe /Q:A /R:N" /f
	rem Set not to run another hotfix script
	set CONT_HF=NO
)

IF %IT_OSVer% == 2003 (
	rem Set not to run another hotfix script
	set CONT_HF=NO
)



IF %CONT_HF% == YES (
	REG ADD %KEY%\253 /VE /D "Seed Next HotFix Script and Reboot..." /f
	REG ADD %KEY%\253 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\HFRunOnceEx03.cmd" /f 
) ELSE (
  IF %IT_AppRunOnceTerm% == 0 (
	REG ADD %KEY%\253 /VE /D "Cleanup and Reboot..." /f
	REG ADD %KEY%\253 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\postfinalclean.cmd" /F 2>> %IT_OUTPUT%
  ) ELSE (
	REG ADD %KEY%\253 /VE /D "Seed App Install Script and Reboot..." /f
	REG ADD %KEY%\253 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\AppRunOnceEx01.cmd" /F 2>> %IT_OUTPUT% 
  )
)

IF %IT_OSVer% == 2000 (
	REG ADD %KEY%\253 /V 020 /D "cmd /c shutdown.exe /r /l /t:10 /c" /f
) ELSE (
	REG ADD %KEY%\253 /V 020 /D "cmd /c shutdown.exe -r -f -t 10" /f
)

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Finished HFRunOnceEx02 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

EXIT

