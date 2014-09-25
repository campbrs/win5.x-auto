@echo off
rem Registry Clean 2.0
rem 2/10/04
rem 
rem Provided a Key and leading tag delete values based off tag
rem
rem Syntax:	regclean arg1 arg2
rem
rem		arg1 = Registry Key to remove Values from
rem		arg2 = Tag or beginning characters of Values to remove
rem

IF "%IT_OUTPUT%" == "" set IT_OUTPUT=con

set RegKey1=%~1
set tag1=%~2

echo. >> %IT_OUTPUT%
echo REGCLEAN : %Date% : %Time% : Beginning Registry Cleanup... >> %IT_OUTPUT%


rem set RegKey1=HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment

FOR /F "tokens=1 delims=	 " %%A IN ('REG QUERY "%RegKey1%" ^| find "%tag1%"') DO (
	echo REG DELETE "%RegKey1%" /V "%%A" /f >> %IT_OUTPUT%
	REG DELETE "%RegKey1%" /V "%%A" /f 2>> %IT_OUTPUT%
)

echo. >> %IT_OUTPUT%
echo REGCLEAN : %Date% : %Time% : Finished Registry Cleanup... >> %IT_OUTPUT%
