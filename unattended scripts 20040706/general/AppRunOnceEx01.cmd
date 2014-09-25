@echo off
SET KEY=HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnceEx

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Beginning AppRunOnceEx01 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

rem General Applications
REG ADD %KEY%\001 /VE /D "Application Install Initialize - Map Network Drive..." /F 2>> %IT_OUTPUT%
REG ADD %KEY%\001 /V 010 /D "net use %IT_InsShareMP% %IT_InsShare% %IT_InsSharePWD% /user:%IT_InsShareUID%" /F 2>> %IT_OUTPUT%


IF %IT_APP_ADBE% == 1 (
	REG ADD %KEY%\130 /VE /D "Adobe Reader 6" /F 2>> %IT_OUTPUT%
	REG ADD %KEY%\130 /V 010 /D "msiexec /i %IT_InsShareMP%\apps\GN\ADOBE_RDR_6_0\AR6.msi /qb-!" /F 2>> %IT_OUTPUT%
)


IF %IT_APP_7ZIP% == 1 (
	REG ADD %KEY%\135 /VE /D "7-Zip Install" /f
	REG ADD %KEY%\135 /V 010 /D "cmd /c %IT_InsShareMP%\apps\GN\7_ZIP\7z313.exe -y /Q" /f
)

IF %IT_APP_WRAR% == 1 (
	REG ADD %KEY%\136 /VE /D "WinRAR Install" /f
	REG ADD %KEY%\136 /V 010 /D "cmd /c %IT_InsShareMP%\apps\GN\WINRAR\wrar320.exe /s" /f
)

IF %IT_APP_JAVA% == 1 (
	REG ADD %KEY%\137 /VE /D "Sun Java2 1.4.2 " /f
	REG ADD %KEY%\137 /V 010 /D "cmd /c %IT_InsShareMP%\apps\ws\JAVA\j2re-1_4_2_03-windows-i586-p.exe /s /v\"/qn ADDLOCAL=jrecore IEXPLORER=1\"" /f
)

IF %IT_APP_PERL% == 1 (
	REG ADD %KEY%\138 /VE /D "ActivePerl 5.21" /f
	REG ADD %KEY%\138 /V 010 /D "cmd /c %IT_InsShareMP%\apps\GN\ACTIVEPERL\activeperl.exe /s /a /s /sms /f1%IT_InsShareMP%\scripts\apps\gn\activeperl.iss" /f
)

rem Office Install Declare Vars
IF %IT_APP_OFFC% == 1 (
	set OffSDir=%IT_InsShareMP%\scripts\apps\MS_OFFICE

	rem Office Vars
	set OffMST=MS_OFFICE_%IT_OffVer%_PRO_FULL.MST
	set OffSetupSrc=%IT_InsShareMP%\apps\ws\MS_OFFICE_%IT_OffVer%_PRO
	set OffSetupInstall=%InsRoot%\apps\MS_OFFICE_%IT_OffVer%_PRO

   IF %IT_OffVer% == 2003 (
	rem Visio Vars
	set OffVMST=MS_OFFICE_%IT_OffVer%_VISIO.MST
	set OffVSetupSrc=%IT_InsShareMP%\apps\ws\MS_OFFICE_%IT_OffVer%_VISIO
	set OffVSetupInstall=%InsRoot%\apps\MS_OFFICE_%IT_OffVer%_VISIO

	rem Project Vars
	set OffPMST=MS_OFFICE_%IT_OffVer%_PROJECT.MST
	set OffPSetupSrc=%IT_InsShareMP%\apps\ws\MS_OFFICE_%IT_OffVer%_PROJECT
	set OffPSetupInstall=%InsRoot%\apps\MS_OFFICE_%IT_OffVer%_PROJECT


	rem Front Page Vars
	set OffFPMST=MS_OFFICE_%IT_OffVer%_FP.MST
	set OffFPSetupSrc=%IT_InsShareMP%\apps\ws\MS_OFFICE_%IT_OffVer%_FP
	set OffFPSetupInstall=%InsRoot%\apps\MS_OFFICE_%IT_OffVer%_FP
   )
)

rem Office Install
IF %IT_APP_OFFC% == 1 (
	REG ADD %KEY%\133 /VE /D "Office Install" /f
	REG ADD %KEY%\133 /V 010 /T REG_EXPAND_SZ /D "cmd /c echo OFFICE : %%date%% : %%time%% : Beginning Office %IT_OffVer% Install... >> %IT_OUTPUT%" /f
	REG ADD %KEY%\133 /V 030 /D "cmd /c xcopy /e /i /q /h /r /y \"%OffSetupSrc%\" \"%OffSetupInstall%\" 2>> %IT_OUTPUT%" /F
	REG ADD %KEY%\133 /V 035 /D "cmd /c %OffSetupInstall%\setup.exe USERNAME=\"%IT_UsrName%\" TRANSFORMS=\"%OffSDir%\%OffMST%\" /qb- 2>> %IT_OUTPUT%" /F

   IF %IT_OffVer% == 2003 (
	REG ADD %KEY%\133 /V 040 /D "cmd /c xcopy /e /i /q /h /r /y \"%OffVSetupSrc%\" \"%OffVSetupInstall%\" 2>> %IT_OUTPUT%" /F
	REG ADD %KEY%\133 /V 045 /D "cmd /c %OffVSetupInstall%\setup.exe USERNAME=\"%IT_UsrName%\" TRANSFORMS=\"%OffSDir%\%OffVMST%\" /qb- 2>> %IT_OUTPUT%" /F
	REG ADD %KEY%\133 /V 050 /D "cmd /c xcopy /e /i /q /h /r /y \"%OffPSetupSrc%\" \"%OffPSetupInstall%\" 2>> %IT_OUTPUT%" /F
	REG ADD %KEY%\133 /V 055 /D "cmd /c %OffPSetupInstall%\setup.exe USERNAME=\"%IT_UsrName%\" TRANSFORMS=\"%OffSDir%\%OffPMST%\" /qb- 2>> %IT_OUTPUT%" /F
	REG ADD %KEY%\133 /V 060 /D "cmd /c xcopy /e /i /q /h /r /y \"%OffFPSetupSrc%\" \"%OffFPSetupInstall%\" 2>> %IT_OUTPUT%" /F
	REG ADD %KEY%\133 /V 065 /D "cmd /c %OffFPSetupInstall%\setup.exe USERNAME=\"%IT_UsrName%\" TRANSFORMS=\"%OffSDir%\%OffFPMST%\" /qb- 2>> %IT_OUTPUT%" /F
   )

	REG ADD %KEY%\133 /V 254 /T REG_EXPAND_SZ /D "cmd /c echo OFFICE : %%date%% : %%time%% : Finished Office %IT_OffVer% Install... >> %IT_OUTPUT%" /f

)

IF %IT_APP_ADAW% == 1 (
	REG ADD %KEY%\139 /VE /D "Ad-Aware 6" /f
	REG ADD %KEY%\139 /V 010 /D "cmd /c %IT_InsShareMP%\apps\ws\AD_AWARE\aaw6.exe /s" /F
)

IF %IT_APP_VTPC% == 1 (
	REG ADD %KEY%\134 /VE /D "Microsoft Virtual PC 2004" /f
	REG ADD %KEY%\134 /V 010 /D "msiexec /i \"%IT_InsShareMP%\apps\ws\MS_VIRT_PC_2004\VPC2004.msi\" /qn INSTALLDIR=\"%AppsRoot%\virtualpc 2004\" USERNAME=\"%IT_UsrName%\"" /f
)

rem Personal Applications

IF %IT_APP_TORR% == 1 (
	REG ADD %KEY%\151 /VE /D "BitTorrent 3.3 IE Plugin" /f
	REG ADD %KEY%\151 /V 010 /D "cmd /c %IT_InsShareMP%\apps\ws\BITTORRENT\bittorrent-3.3.exe /S" /f
)

IF %IT_APP_TRIL% == 1 (
	REG ADD %KEY%\152 /VE /D "Trillian Install" /f
	REG ADD %KEY%\152 /V 010 /D "cmd /c echo TRILLIAN : ^%date^% : ^%time^% : Beginning TRILLIAN Install... >> %IT_OUTPUT%" /f
	REG ADD %KEY%\152 /V 020 /D "cmd /c xcopy /e /i /q /h /r /y \"%IT_InsShareMP%\apps\ws\TRILLIAN\" \"%AppsRoot%\trillian\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\152 /V 030 /D "cmd /c regedit /s \"%AppsRoot%\trillian\trillian.reg\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\152 /V 254 /D "cmd /c echo TRILLIAN : ^%date^% : ^%time^% : Finished TRILLIAN Install... >> %IT_OUTPUT%" /f

)

rem Server Applications

rem IIS Install
IF %IT_APP_MIIS% == 1 (
	REG ADD %KEY%\201 /VE /D "IIS Install" /f
	REG ADD %KEY%\201 /V 010 /T REG_EXPAND_SZ /D "cmd /c echo IIS : %%date%% : %%time%% : Beginning IIS Install... >> %IT_OUTPUT%" /f
	REG ADD %KEY%\201 /V 020 /D "cmd /c mkdir \"%DataRoot%\iis\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\201 /V 021 /D "cmd /c mkdir \"%DataRoot%\roots\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\201 /V 022 /D "cmd /c mkdir \"%DataRoot%\roots\default web site\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\201 /V 023 /D "cmd /c mkdir \"%LogsRoot%\iis\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\201 /V 020 /D "cmd /c sysocmgr /i:%windir%\inf\sysoc.inf /u:\"%systemdrive%\tempinst\scripts\hosts\%IT_HstDirName%\%IT_Hostname%-iisinstall.txt\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\201 /V 030 /D "cmd /c xcopy  /i /q /r /y \"%IT_InsShareMP%\scripts\apps\MS_IIS\*.asp\" \"%DataRoot%\roots\default web site\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\201 /V 254 /T REG_EXPAND_SZ /D "cmd /c echo IIS : %%date%% : %%time%% : Finished IIS Install... >> %IT_OUTPUT%" /f
)

rem SQL Install
IF %IT_APP_MSQL% == 1 (
	REG ADD %KEY%\202 /VE /D "SQL %IT_SQLVer% %IT_SQLType% Server Install" /f
	REG ADD %KEY%\202 /V 010 /T REG_EXPAND_SZ /D "cmd /c echo SQL : %%date%% : %%time%% : Beginning SQL %IT_SQLVer% Install... >> %IT_OUTPUT%" /f
	REG ADD %KEY%\202 /V 020 /D "cmd /c %IT_InsShareMP%\apps\srv\MS_SQL_%IT_SQLVer%_%IT_SQLType%\x86\setup\setupsql.exe -s -m -SMS -f1 \"%IT_InsShareMP%\scripts\apps\MS_SQL\MS_SQL_%IT_SQLVer%_%IT_SQLType%.iss\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\202 /V 030 /D "cmd /c net stop MSSQLServerADHelper 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\202 /V 031 /D "cmd /c net stop SQLSERVERAGENT 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\202 /V 032 /D "cmd /c net stop MSSQLSERVER 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\202 /V 040 /D "cmd /c %IT_InsShareMP%\apps\srv\MS_SQL_%IT_SQLVer%_%IT_SQLSPVer%\x86\setup\setupsql.exe k=SMS -s -m -SMS -f1 \"%IT_InsShareMP%\scripts\apps\MS_SQL\MS_SQL_%IT_SQLVer%_%IT_SQLSPVer%.iss\" 2>> %IT_OUTPUT%" /f
	REG ADD %KEY%\202 /V 254 /T REG_EXPAND_SZ /D "cmd /c echo SQL : %%date%% : %%time%% : Finished SQL %IT_SQLVer% Install... >> %IT_OUTPUT%" /f
)

IF %IT_AppRunOnceTerm% == 1 (
	REG ADD %KEY%\244 /VE /D "Cleanup and Reboot..." /f
	REG ADD %KEY%\244 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\postfinalclean.cmd" /f
) ELSE (
	REG ADD %KEY%\244 /VE /D "Seed Next App Install Script and Reboot..." /f
	REG ADD %KEY%\244 /V 010 /D "cmd /c %systemdrive%\tempinst\scripts\general\AppRunOnceEx02.cmd" /f 
)

echo. >> %IT_OUTPUT% 
echo Release Network share >> %IT_OUTPUT% 
REG ADD %KEY%\244 /V 020 /D "net use %IT_InsShareMP% /delete" /F 2>> %IT_OUTPUT%


IF %IT_OSVer% == 2000 (
	REG ADD %KEY%\244 /V 030 /D "cmd /c shutdown.exe /r /l /t:10 /c" /f
) ELSE (
	REG ADD %KEY%\244 /V 030 /D "cmd /c shutdown.exe -r -f -t 10" /f
)

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Finished AppRunOnceEx01 Seed Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 



EXIT

