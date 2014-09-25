@echo off
rem
rem WinPE preinstall script v1.9
rem 01/24/04
rem Richard Campbell
rem

IF NOT "%1"=="y" goto end
IF "%IT_OUTPUT%" == "" set IT_OUTPUT=con

goto main

:defaultdir
  echo PRE : %Date% : %Time% : Beginning Base Directory Structure Creation... >> %IT_OUTPUT%

  mkdir "%TempRoot%" 2>> %IT_OUTPUT%

  mkdir "%IT_OSMP%\tempinst" 2>> %IT_OUTPUT%
  mkdir "%IT_OSMP%\tempinst\temp" 2>> %IT_OUTPUT%

  mkdir "%InsRoot%" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\drivers" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\drivers\video" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\drivers\nic" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\drivers\scsiraid" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\drivers\system" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\os" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\apps" 2>> %IT_OUTPUT%
  mkdir "%InsRoot%\tools" 2>> %IT_OUTPUT%

  mkdir "%AppsRoot%" 2>> %IT_OUTPUT%

  mkdir "%DataRoot%" 2>> %IT_OUTPUT%
  mkdir "%DataRoot%\backup" 2>> %IT_OUTPUT%
  mkdir "%DataRoot%\backup\archive" 2>> %IT_OUTPUT%
  mkdir "%DataRoot%\downloads" 2>> %IT_OUTPUT%

  mkdir "%LogsRoot%" 2>> %IT_OUTPUT%

  mkdir "%ScriptsRoot%" 2>> %IT_OUTPUT%
  mkdir "%ScriptsRoot%\backup" 2>> %IT_OUTPUT%
  mkdir "%ScriptsRoot%\system" 2>> %IT_OUTPUT%
  mkdir "%ScriptsRoot%\osbuild" 2>> %IT_OUTPUT%

  mkdir "%ToolsRoot%" 2>> %IT_OUTPUT%
  mkdir "%ToolsRoot%\system" 2>> %IT_OUTPUT%
  mkdir "%ToolsRoot%\security" 2>> %IT_OUTPUT%
  mkdir "%ToolsRoot%\debug" 2>> %IT_OUTPUT%

  echo PRE : %Date% : %Time% : Ending Base Directory Structure Creation... >> %IT_OUTPUT%
goto return_defaultdir

:diskpartinit
  IF "%IT_NumParts%" == "" (
	echo no partitions defined exiting
	echo no partitions defined exiting >> %IT_OUTPUT%
	goto end
  )


  echo. >> %IT_OUTPUT%
  echo PRE : %Date% : %Time% : Beginning Diskpartinit Script... >> %IT_OUTPUT%
  echo. >> %IT_OUTPUT%

  IF "%TEMP%" == "" set TEMP=a:\
  set DiskPartTemp=%TEMP%\diskparttemp.txt


  rem Figure out number of usable drives
  echo list disk > %DiskPartTemp%
  echo exit >> %DiskPartTemp%

  FOR /F "" %%A IN ('diskpart /s %DiskPartTemp% ^| find /C "Online"') DO set NumDrives=%%A

  IF %NumDrives% EQU 0 (
	echo No usable Harddrives found!!! >> %IT_OUTPUT%
	goto END
  ) ELSE (
	echo %NumDrives% usable HardDrive^(s^) Found >> %IT_OUTPUT%
  )

  IF %IT_NumParts% GEQ 1 (
	IF %IT_NumParts% LEQ 3 (
		goto %IT_NumParts%_Partitions
	) ELSE (
		echo Number of Partitions must be between 1 and 3
		goto END
	)
  ) ELSE (
		echo Number of Partitions must be between 1 and 3
		goto END
  )

  :1_Partitions
  IF %NumDrives% GEQ 1 (
	echo select disk 0 > %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	IF "%IT_DiskPart1Size%"=="" (
		echo create partition primary noerr >> %DiskPartTemp%
	) ELSE (
		echo create partition primary size=%IT_DiskPart1Size%000 noerr >> %DiskPartTemp%
	)
	echo assign letter=c >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo exit  >> %DiskPartTemp%
  )
  goto Parts_Done

  :2_Partitions
  IF %NumDrives% EQU 1 (
	echo select disk 0 > %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary size=%IT_DiskPart1Size%000 noerr >> %DiskPartTemp%
	echo assign letter=c >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo create partition extended noerr >> %DiskPartTemp%
	IF "%IT_DiskPart2Size%"=="" (
		echo create partition logical noerr >> %DiskPartTemp%
	) ELSE (
		echo create partition logical size=%IT_DiskPart2Size%000 noerr >> %DiskPartTemp%
	)
	echo assign letter=s >> %DiskPartTemp%
	echo exit  >> %DiskPartTemp%
  )
  IF %NumDrives% EQU 2 (
	echo select disk 0 > %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary noerr >> %DiskPartTemp%
	echo assign letter=c >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo select disk 1 >> %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary noerr >> %DiskPartTemp%
	echo assign letter=s >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo exit  >> %DiskPartTemp%
  )
  goto Parts_Done

:3_Partitions
  IF %NumDrives% EQU 1 (
	echo select disk 0 > %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary size=%IT_DiskPart1Size%000 noerr >> %DiskPartTemp%
	echo assign letter=c >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo create partition extended noerr >> %DiskPartTemp%
	echo create partition logical size=%IT_DiskPart2Size%000 noerr >> %DiskPartTemp%
	echo assign letter=s >> %DiskPartTemp%
	echo create partition logical noerr >> %DiskPartTemp%
	echo assign letter=t >> %DiskPartTemp%
	echo exit >> %DiskPartTemp%
  )
  IF %NumDrives% EQU 2 (
	echo select disk 0 > %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary size=%IT_DiskPart1Size%000 noerr >> %DiskPartTemp%
	echo assign letter=c >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo create partition extended noerr >> %DiskPartTemp%
	echo create partition logical noerr >> %DiskPartTemp%
	echo assign letter=s >> %DiskPartTemp%
	echo select disk 1 >> %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary noerr >> %DiskPartTemp%
	echo assign letter=t >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo exit  >> %DiskPartTemp%
  )
  IF %NumDrives% GEQ 3 (
	echo select disk 0 > %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary noerr >> %DiskPartTemp%
	echo assign letter=c >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo select disk 1 >> %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary noerr >> %DiskPartTemp%
	echo assign letter=s >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo select disk 2 >> %DiskPartTemp%
	echo clean >> %DiskPartTemp%
	echo create partition primary noerr >> %DiskPartTemp%
	echo assign letter=t >> %DiskPartTemp%
	echo active >> %DiskPartTemp%
	echo exit  >> %DiskPartTemp%
  )
  goto Parts_Done


  :Parts_Done
  echo. >> %IT_OUTPUT%
  echo Partitioning %IT_NumParts% partitions across %NumDrives% >> %IT_OUTPUT%
  diskpart /s %DiskPartTemp% 2>> %IT_OUTPUT%

  echo. >> %IT_OUTPUT%
  echo PRE : %Date% : %Time% : Finished Diskpartinit Script... >> %IT_OUTPUT%
  echo. >> %IT_OUTPUT%
goto return_diskpartinit




:main
echo. >> %IT_OUTPUT%
echo PRE : %Date% : %Time% : Beginning Preinstall Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT%

echo. >> %IT_OUTPUT%
echo setup partitions %IT_OSMP%, %IT_ScratchMP%, %IT_DataMP%  -  %IT_ScratchMP% and %IT_DataMP% will be reassigned after OS installation >> %IT_OUTPUT%
echo. >> %IT_OUTPUT%
goto diskpartinit
:return_diskpartinit

echo. >> %IT_OUTPUT%
echo Unattended/unconditional format of c: with NTFS And a vol label of "os" >> %IT_OUTPUT%
format %IT_OSMP% /q /y /fs:ntfs /v:os 2>> %IT_OUTPUT%

if %IT_NumParts%==3 (
	format %IT_ScratchMP% /q /y /fs:ntfs /v:scratch 2>> %IT_OUTPUT%
)

format %IT_DataAppMP% /q /y /fs:ntfs /v:apps-data 2>> %IT_OUTPUT%

echo. >> %IT_OUTPUT%
echo Build the directories on the new volumes >> %IT_OUTPUT%
goto defaultdir
:return_defaultdir


set OSSetupInstall=%InsRoot%\os\%IT_OSDir%
set OSSetupSrc=%IT_InsShareMP%\os\%IT_OSDir%
set $OEM$SetupSrc=%IT_InsShareMP%\os\WIN%IT_OSVer%_$OEM$

echo. >> %IT_OUTPUT%
echo Update Scripts on floppy >> %IT_OUTPUT%
xcopy /i /q /h /r /y %IT_InsShareMP%\scripts\general\floppy.cmd a:\ 2>> %IT_OUTPUT%
xcopy /i /q /h /r /y %IT_InsShareMP%\scripts\general\getvars.cmd a:\ 2>> %IT_OUTPUT%
xcopy /i /q /h /r /y %IT_InsShareMP%\scripts\general\buildinfo.txt a:\ 2>> %IT_OUTPUT%
xcopy /i /q /h /r /y "%IT_InsShareScripts%\hosts\%IT_HstDirName%\%IT_Hostname%-winbom.ini" a:\winbom.ini 2>> %IT_OUTPUT%

echo. >> %IT_OUTPUT%
echo Copy OS files from %OSSetupSrc% to %OSSetupInstall% drive >> %IT_OUTPUT%
xcopy /e /i /q /h /r /y "%OSSetupSrc%" "%OSSetupInstall%" 2>> %IT_OUTPUT%

echo Copy $OEM$ OS files from %$OEM$SetupSrc% to %OSSetupInstall%\i386 drive >> %IT_OUTPUT%
xcopy /e /i /q /h /r /y "%$OEM$SetupSrc%\$OEM$_default\*" "%OSSetupInstall%\i386\$OEM$" 2>> %IT_OUTPUT%

echo Copy Install Scripts from %InsShareScripts% to %TempInsScripts% drive >> %IT_OUTPUT%
xcopy /e /i /q /h /r /y "%IT_PreInsScripts%" "%IT_PostInsScripts%" 2>> %IT_OUTPUT%

echo Copy Host Specfic from %InsShareScripts% to %TempInsScripts% drive >> %IT_OUTPUT%
xcopy /e /i /q /h /r /y "%IT_InsShareScripts%\hosts\%IT_HstDirName%" "%IT_TempInsScripts%\hosts\%IT_HstDirName%" 2>> %IT_OUTPUT%

if "%IT_$OEM$HostSpcfc%" NEQ "" (
   echo. >> %IT_OUTPUT%
   echo Copy Host Specific $OEM$ files from %$OEM$SetupSrc%\%IT_$OEM$HostSpcfc% to %OSSetupInstall%\i386\$OEM$ >> %IT_OUTPUT%
   xcopy /e /i /q /h /y "%$OEM$SetupSrc%\%IT_$OEM$HostSpcfc%" "%OSSetupInstall%\i386\$OEM$" 2>> %IT_OUTPUT%
)

set UnattendAnswerFile=%IT_TempInsScripts%\hosts\%IT_HstDirName%\%IT_Hostname%-unattend%IT_OSVer%.txt

echo. >> %IT_OUTPUT%
echo Run appropriate installer parameters >> %IT_OUTPUT%

if %IT_OSVer%==2000 (
	rem Run Windows 2000 Install
	%OSSetupInstall%\i386\winnt32.exe /s:%OSSetupInstall%\i386 /syspart:c: /tempdrive:c: /noreboot /unattend:"%UnattendAnswerFile%" /makelocalsource 2>> %IT_OUTPUT%
) else (
	rem Run Windows 2003/XP Install
	%OSSetupInstall%\i386\winnt32.exe /s:%OSSetupInstall%\i386 /syspart:c: /tempdrive:c: /dudisable /unattend:"%UnattendAnswerFile%" /makelocalsource 2>> %IT_OUTPUT%
)


echo. >> %IT_OUTPUT%
echo PRE : %Date% : %Time% : Ending Preinstall Script... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT%

EXIT

:end
