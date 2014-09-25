@echo off
rem
rem regload.cmd - derived from and will supercede getvars.cmd
rem
rem Given a file with vars in <name>=<value> format sets environemental var <name> = <value>
rem		and then rights var to registry
rem caveats:	1. Enviroment vars within the file are not supported!!!! 
rem 		2. no spaces or tabs around = supported 
rem 		3. lines with ; in them are ignored
rem		Needs to be rewritten in more robust lang to fix caveats
rem 

set RegKey=

rem remove quotes if found from passed var
set Flags=%~1
set VarsFile=%~2
set RegKey=%~3

IF "%RegKey%"=="" set RegKey=HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment

rem = must be first list delim for it to work as delim
FOR /F "tokens=1,2 delims==" %%A IN ('type "%varsFile%" ^| find "=" ^| find /V ";"') DO (
	FOR /F "" %%L IN ('echo %Flags% ^| find "s"') DO IF %%L == %Flags% set %%A=%%B
	FOR /F "" %%L IN ('echo %Flags% ^| find "r"') DO IF %%L == %Flags% REG ADD "%RegKey%" /V "%%A" /D "%%B" /F
)
