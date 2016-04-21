@echo off
SET KEY=HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnceEx

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Beginning HFRunOnceEx01 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

rem Set default as this is last hotfix script
set CONT_HF=NO

REG ADD %KEY%\001 /VE /D "Post OS Install Registry Changes" /F 2>> %IT_OUTPUT%
REG ADD %KEY%\001 /V 010 /D "REG ADD \"HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Setup\" /V \"SourcePath\" /D \"%InsRoot%\os\%IT_OSDir%\" /F" /F 2>> %IT_OUTPUT%
REG ADD %KEY%\001 /V 020 /D "REG ADD \"HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Setup\" /V \"ServicePackSourcePath\" /D \"%InsRoot%\os\%IT_OSDir%\" /F" /F 2>> %IT_OUTPUT%

rem echo testing REG KEY ADD
rem REG QUERY %KEY% /s
rem pause


IF %IT_OSVer% == 2000 (
	rem Windows 2000 Hotfixes
	REG ADD %KEY%\111 /VE /D "Windows 2000 Hotfixes" /f
	REG ADD %KEY%\111 /V 010 /D "%systemdrive%\tempinst\win2000_sp5\Windows2000-KB329115-x86-ENU.exe -u -z -q -n -o" /f
	REG ADD %KEY%\111 /V 020 /D "%systemdrive%\tempinst\win2000_sp5\Windows2000-KB823559-x86-ENU.exe -u -z -q -n -o" /f

	rem Internet Explorer 6.0 Updates
	REG ADD %KEY%\112 /VE /D "Internet Explorer 6.0 Hotfixes" /f
 	REG ADD %KEY%\112 /V 010 /D "%systemdrive%\tempinst\MS_IE_6\WindowsIE6-KB330994-x86-ENU.exe /Q:A /R:N" /f
 	REG ADD %KEY%\112 /V 020 /D "%systemdrive%\tempinst\MS_IE_6\WindowsIE6-KB824145-x86-ENU.exe /Q:A /R:N" /f
 	REG ADD %KEY%\112 /V 030 /D "%systemdrive%\tempinst\MS_IE_6\WindowsIE6-KB832894-x86-ENU.exe /Q:A /R:N" /f
 	REG ADD %KEY%\112 /V 040 /D "%systemdrive%\tempinst\MS_IE_6\WindowsIE6-KB831167-x86-ENU.exe /Q:A /R:N" /f


	IF %IT_APP_WMP9% == 1 (
		rem Windows Media Player 9
		REG ADD %KEY%\113 /VE /D "Windows Media Player 9" /F 2>> %IT_OUTPUT%
		REG ADD %KEY%\113 /V 010 /D "%systemdrive%\tempinst\MS_WMP_9\Windows2000-WMP9-x86-ENU.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%
	)

	rem .NET Framework
	REG ADD %KEY%\121 /VE /D ".NET Framework 1.1" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\121 /V 010 /D "msiexec /i %systemdrive%\tempinst\MS_NET_FW_1_1\netfx.msi /qb-!" /F 2>> %IT_OUTPUT%

	rem MS Journal Viewer Framework
	REG ADD %KEY%\122 /VE /D "Windows Journal Viewer" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\122 /V 010 /D "msiexec /i %systemdrive%\tempinst\MS_JV\MSWJV.msi /qb-!" /F 2>> %IT_OUTPUT%


	rem Set to run another hotfix script
	set CONT_HF=YES
)

IF %IT_OSVer% == XP (
	regedit /s "%systemdrive%\tempinst\winxp_reg_tweaks.reg" 2>> %IT_OUTPUT%"

	rem Windows XP Hotfixes
	REG ADD %KEY%\111 /VE /D "Windows XP Hotfixes" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\111 /V 010 /D "%systemdrive%\tempinst\WINXP_SP2\WindowsXP-KB327405-x86-ENU.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\111 /V 020 /D "%systemdrive%\tempinst\WINXP_SP2\WindowsXP-KB817778-x86-ENU.exe -u -z -q -n -o" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\111 /V 030 /D "%systemdrive%\tempinst\WINXP_SP2\WindowsXP-KB822603-x86-ENU.exe -u -z -q -n -o" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\111 /V 040 /D "%systemdrive%\tempinst\WINXP_SP2\WindowsXP-KB816093-x86-JVM.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%

	REG ADD %KEY%\112 /VE /D "Internet Explorer 6.0 Hotfixes" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\112 /V 010 /D "%systemdrive%\tempinst\MS_IE_6\WindowsXP-IE6-KB832894.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\112 /V 020 /D "%systemdrive%\tempinst\MS_IE_6\WindowsXP-IE6-KB831167.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%


	IF %IT_APP_WMP9% == 1 (
		rem Windows Media Player 9
		REG ADD %KEY%\113 /VE /D "Windows Media Player 9" /F 2>> %IT_OUTPUT%
		REG ADD %KEY%\113 /V 010 /D "%systemdrive%\tempinst\MS_WMP_9_MM_2\WindowsXP-WMP9-MM2-ENU.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%
	)

	rem Microsoft Messenger 4.7
	REG ADD %KEY%\114 /VE /D "Microsoft Messenger 4.7" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\114 /V 010 /D "%systemdrive%\tempinst\MS_MSG_4_7\WindowsXP-MSG-47-ENU.exe /Q:A /R:N" /F 2>> %IT_OUTPUT%

	rem HighMAT CD Writing Support 
	REG ADD %KEY%\115 /VE /D "HighMAT CD Writing Support" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\115 /V 010 /D "%systemdrive%\tempinst\WINXP_SP2\HMTCDWizard_enu.exe /qb-!" /F 2>> %IT_OUTPUT%

	rem .NET Framework
	REG ADD %KEY%\121 /VE /D ".NET Framework 1.1" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\121 /V 010 /D "msiexec /i %systemdrive%\tempinst\MS_NET_FW_1_1\netfx.msi /qb-!" /F 2>> %IT_OUTPUT%

	rem MS Journal Viewer Framework
	REG ADD %KEY%\122 /VE /D "Windows Journal Viewer" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\122 /V 010 /D "msiexec /i %systemdrive%\tempinst\MS_JV\MSWJV.msi /qb-!" /F 2>> %IT_OUTPUT%

	rem Set to run another hotfix script
	set CONT_HF=YES
)


IF %IT_OSVer% == 2003 (

	rem Set not to run another hotfix script
	set CONT_HF=NO
)


IF %CONT_HF% == YES (
	REG ADD %KEY%\254 /VE /D "Seed Next HotFix Script and Reboot..." /f
	REG ADD %KEY%\254 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\HFRunOnceEx02.cmd" /F 2>> %IT_OUTPUT% 
) ELSE (
  IF %IT_AppRunOnceTerm% == 0 (
	REG ADD %KEY%\254 /VE /D "Cleanup and Reboot..." /f
	REG ADD %KEY%\254 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\postfinalclean.cmd" /F 2>> %IT_OUTPUT%
  ) ELSE (
	REG ADD %KEY%\254 /VE /D "Seed App Install Script and Reboot..." /f
	REG ADD %KEY%\254 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\AppRunOnceEx01.cmd" /F 2>> %IT_OUTPUT% 
  )
)

IF %IT_OSVer% == 2000 (
	REG ADD %KEY%\254 /V 020 /D "cmd /c shutdown.exe /r /l /t:10 /c" /F 2>> %IT_OUTPUT%
) ELSE (
	REG ADD %KEY%\254 /V 020 /D "cmd /c shutdown.exe -r -f -t 10" /F 2>> %IT_OUTPUT%
)


echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Finished HFRunOnceEx01 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

