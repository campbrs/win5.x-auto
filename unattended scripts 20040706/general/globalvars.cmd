@ECHO OFF
rem
rem Load Global Vars
rem


set CURDATE=%date:~7,2%%date:~4,2%%date:~10,4%
	
set BaseDir1=%1
rem Load Static Varibles

set SrcDir1=NOTFOUND
rem  Get MAC Address and remove "-"'s
rem if using dir names with long filenames must set delims=NUL to prevent parsing of filenames with spaces
FOR /F "tokens=12 delims= " %%Z IN ('ipconfig /all ^| find "Physical"') DO FOR /F "tokens=1-6 delims=-" %%A IN ("%%Z") DO FOR /F "delims=" %%X IN ('dir /s /b "%BaseDir1%\*%%A%%B%%C%%D%%E%%F" 2^> NUL') DO (
	dir "%%X" > NUL
	IF ERRORLEVEL 0 (
		set SrcDir1=%%X
		set IT_HstDirName=%%~nX
		FOR /F "tokens=1 delims= " %%W IN ('echo %%~nX') DO set IT_Hostname=%%W
	)
)

IF "%SrcDir1%"=="NOTFOUND" (
	FOR /F "delims=" %%X IN ('dir /s /b "%BaseDir1%\*DEFAULT" 2^> NUL') DO set SrcDir1=%%X
	set IT_Hostname=DEFAULT
	set IT_HstDirName=DEFAULT
)

IF "%SrcDir1%"=="NOTFOUND" (
	set EXIT_NOW=YES
	echo Host information not found in unattend folders, exiting install!!!
	echo Make sure the MAC address on associated host folder matches the 
	echo systems MAC address.

	goto END
)

if %ParentScript%==PRE (
	call %BaseDir1%\general\getvars.cmd -s "%BaseDir1%\general\buildinfo.txt"
	call %BaseDir1%\general\getvars.cmd -s "%SrcDir1%\%IT_Hostname%-buildinfo.txt"
) else (
	call %BaseDir1%\general\getvars.cmd -rs "%BaseDir1%\general\buildinfo.txt"
	call %BaseDir1%\general\getvars.cmd -rs "%SrcDir1%\%IT_Hostname%-buildinfo.txt"
)



if %ParentScript%==PRE (

	if %IT_NumParts%==1 (
		set IT_ScratchMP=c:
		set IT_DataAppMP=c:
	)
	if %IT_NumParts%==2 (
		set IT_ScratchMP=s:
		set IT_DataAppMP=s:
	)
	if %IT_NumParts%==3 (
		set IT_ScratchMP=s:
		set IT_DataAppMP=t:
	)

	if "%IT_OUTPUT%"=="" (	
		set IT_OUTPUT=a:\%IT_Hostname%-install-%CURDATE%.log
	)

) else (

	if %IT_NumParts%==1 (
		set IT_ScratchMP=c:
		set IT_DataAppMP=c:
	)
	if %IT_NumParts%==2 (
		set IT_ScratchMP=d:
		set IT_DataAppMP=d:
	)
	if %IT_NumParts%==3 (
		set IT_ScratchMP=d:
		set IT_DataAppMP=e:
	)

	FOR /F "" %%A IN ('dir /s /b a:\%IT_Hostname%-install*') DO set IT_OUTPUT=%%A
	echo %IT_OUTPUT%

)

rem Scripts Shortcuts
set IT_InsShareScripts=%IT_InsShareMP%\scripts
set IT_TempInsScripts=%IT_OSMP%\tempinst\scripts
set IT_PreInsScripts=%IT_InsShareScripts%\general
set IT_PostInsScripts=%IT_TempInsScripts%\general

rem Cleanup - since getvars doesn't support nested Vars

set TempRoot=%IT_ScratchMP%\temp
set InsRoot=%IT_ScratchMP%\install
set DataRoot=%IT_DataAppMP%\data
set AppsRoot=%IT_DataAppMP%\apps
set ToolsRoot=%IT_DataAppMP%\tools
set ScriptsRoot=%IT_DataAppMP%\scripts
set LogsRoot=%IT_DataAppMP%\logs
set RegKey=HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment

set IT_OfficeRoot=%AppsRoot%\office %IT_OffVer%
set IT_OffMenuRoot=apps\office %IT_OffVer%

IF NOT %ParentScript%==PRE (
	REG ADD "%RegKey%" /v "IT_Hostname" /d "%IT_Hostname%" /f
	REG ADD "%RegKey%" /v "TEMP" /d "%TempRoot%" /f
	REG ADD "%RegKey%" /v "TMP" /d "%TempRoot%" /f
	REG ADD "%RegKey%" /v "InsRoot" /d "%InsRoot%" /f
	REG ADD "%RegKey%" /v "AppsRoot" /d "%AppsRoot%" /f
	REG ADD "%RegKey%" /v "DataRoot" /d "%DataRoot%" /f
	REG ADD "%RegKey%" /v "ScriptsRoot" /d "%ScriptsRoot%" /f
	REG ADD "%RegKey%" /v "LogsRoot" /d "%LogsRoot%" /f
	REG ADD "%RegKey%" /v "ToolsRoot" /d "%ToolsRoot%" /f
	REG ADD "%RegKey%" /v "IT_OUTPUT" /d "%IT_OUTPUT%" /f
	REG ADD "%RegKey%" /v "IT_InsShareScripts" /d "%IT_InsShareScripts%" /f
	REG ADD "%RegKey%" /v "IT_TempInsScripts" /d "%IT_TempInsScripts%" /f
	REG ADD "%RegKey%" /v "IT_PostInsScripts" /d "%IT_PostInsScripts%" /f
	REG ADD "%RegKey%" /v "IT_OfficeRoot" /d "%IT_OfficeRoot%" /f
	REG ADD "%RegKey%" /v "IT_OffMenuRoot" /d "%IT_OffMenuRoot%" /f
	REG ADD "%RegKey%" /v "IT_HstDirName" /d "%IT_HstDirName%" /f
)

set >> %IT_OUTPUT%

:END