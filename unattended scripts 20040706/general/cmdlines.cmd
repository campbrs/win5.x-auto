@echo off
rem Environment Vars/Some Hotfixes to Install During OS Setup
goto main

:diskpartcu
  set DiskPartTemp=%TEMP%\diskparttemp.txt

  rem Figure out number of usable drives
  echo list disk > %DiskPartTemp%
  echo exit >> %DiskPartTemp%


  FOR /F "" %%A IN ('diskpart /s %DiskPartTemp% ^| find /C "Online"') DO set NumDrives=%%A

  rem Set CD-ROM drive letter to r
  echo select volume 0 > %DiskPartTemp%
  echo assign letter=r >> %DiskPartTemp%

  IF %NumDrives% EQU 0 (
	echo No usable Harddrives found!!! >> %IT_OUTPUT%
	goto END
  ) ELSE (
	echo %NumDrives% usable HardDrive^(s^) Found >> %IT_OUTPUT%
  )

  IF %NumDrives% EQU 1 (
	echo select disk 0 >> %DiskPartTemp%
	echo select partition 3 >> %DiskPartTemp%
	echo assign letter=d >> %DiskPartTemp%
	echo select partition 4 >> %DiskPartTemp%
	echo assign letter=e >> %DiskPartTemp%
	echo exit >> %DiskPartTemp%
  )

  IF %NumDrives% EQU 2 (
	echo select disk 0 >> %DiskPartTemp%
	echo select partition 3 >> %DiskPartTemp%
	echo assign letter=d >> %DiskPartTemp%
	echo select disk 1 >> %DiskPartTemp%
	echo select partition 1 >> %DiskPartTemp%
	echo assign letter=e >> %DiskPartTemp%
	echo exit >> %DiskPartTemp%
  )
 
  IF %NumDrives% GEQ 3 (
	echo select disk 1 >> %DiskPartTemp%
	echo select partition 1 >> %DiskPartTemp%
	echo assign letter=d >> %DiskPartTemp%
	echo select disk 2 >> %DiskPartTemp%
	echo select partition 1 >> %DiskPartTemp%
	echo assign letter=e >> %DiskPartTemp%
	echo exit >> %DiskPartTemp%
  )

  diskpart /s %DiskPartTemp% 2>> %IT_OUTPUT%
goto return_diskpartcu

:routeadd

  set router_ip=0

  FOR /F "tokens=15 delims= " %%X IN ('ipconfig ^| find "IP Address"' ) DO FOR /F "tokens=1,2 delims=." %%A IN ('echo %%X') DO (              
    IF %%A.%%B EQU 172.30 (
       set NETWORK_NUM=%%A.%%B
    ) ELSE (
       IF %%A.%%B EQU 192.168 (
          set NETWORK_NUM=%%A.%%B
       ) ELSE (
          echo %%A.%%B Not in production or test environment no routes needed >> %IT_OUTPUT%
          goto return_routeadd
       )
    )
  )

  FOR /F "tokens=3 delims=: " %%X IN ('ipconfig /all ^| find "VLAN"' ) DO (              
    IF %%X EQU VLAN60 set router_ip=%NETWORK_NUM%.1.129
    IF %%X EQU VLAN120 set router_ip=%NETWORK_NUM%.2.193
    IF %%X EQU VLAN160 set router_ip=%NETWORK_NUM%.1.33
    IF %%X EQU VLAN260 set router_ip=%NETWORK_NUM%.158.33
  )

  IF %router_ip% EQU 0 goto return_routeadd

  route -p add %NETWORK_NUM%.1.0 mask 255.255.255.0 %router_ip% 2>> %IT_OUTPUT%
  route -p add %NETWORK_NUM%.2.0 mask 255.255.255.0 %router_ip% 2>> %IT_OUTPUT%
  route -p add %NETWORK_NUM%.158.0 mask 255.255.255.0 %router_ip% 2>> %IT_OUTPUT%

goto return_routeadd


:main
set ParentScript=POST

rem Environment Vars
call %systemdrive%\tempinst\scripts\general\globalvars.cmd %systemdrive%\tempinst\scripts

rem Set TEMP folders
set TEMP=%systemdrive%\tempinst\temp
set TMP=%systemdrive%\tempinst\temp

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Begin Pre-LOGIN GUI Initialize... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 


echo. >> %IT_OUTPUT% 
echo Pre-Login script vars... >> %IT_OUTPUT%
set >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

echo. >> %IT_OUTPUT% 
echo %ParentScript% : %Date% : %Time% : Beginning Pre-LOGIN GUI Initialize... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

echo. >> %IT_OUTPUT% 
echo Add routes >> %IT_OUTPUT% 
goto routeadd
:return_routeadd
echo Finished adding routes >> %IT_OUTPUT% 

echo. >> %IT_OUTPUT% 
echo Cleanup OS settings >> %IT_OUTPUT%


echo. >> %IT_OUTPUT% 
echo Move partitions temp secondary partitions and set cdrom letter >> %IT_OUTPUT%
goto diskpartcu
:return_diskpartcu

echo. >> %IT_OUTPUT% 
echo Hotfixes >> %IT_OUTPUT%

IF %IT_DIRECTX% == 1 (
	start /wait %systemdrive%\tempinst\MS_DIRECTX_9_0b\directx90b_opk.exe 2>> %IT_OUTPUT%

	rem Attempt to install nvidia drivers
	rem start /wait %systemdrive%\tempinst\drivers\video\53.03_winxp2k_english_whql.exe  /s /a /s /sms /f1"%systemdrive%\nvidia\win2kxp\53.03\setup.iss" 2>> %IT_OUTPUT%
)


IF %IT_OSVer% == 2000 (
	start /wait %systemdrive%\tempinst\WIN2000_SP5\ENU_Q832483_MDAC_x86.EXE /T:%TEMP% /C:"%TEMP%\dahotfix.exe /q /n" /Q 2>> %IT_OUTPUT%
)

IF %IT_OSVer% == XP (
	start /wait %systemdrive%\tempinst\WINXP_SP2\ENU_Q832483_MDAC_x86.EXE /T:%TEMP% /C:"%TEMP%\dahotfix.exe /q /n" /Q 2>> %IT_OUTPUT%
)

IF %IT_OSVer% == 2003 (
	start /wait %systemdrive%\tempinst\WIN2003_SP1\ENU_Q832483_MDAC_x86.EXE /T:%TEMP% /C:"%TEMP%\dahotfix.exe /q /n" /Q 2>> %IT_OUTPUT%
)


echo Setup post reboot OS GUI installs (after os install) >> %IT_OUTPUT% 
call %systemdrive%\tempinst\scripts\general\HFRunOnceEx01.cmd

echo. >> %IT_OUTPUT% 
echo POST : %Date% : %Time% : Finished Pre-LOGIN GUI Initialize... >> %IT_OUTPUT%
echo. >> %IT_OUTPUT% 

EXIT
