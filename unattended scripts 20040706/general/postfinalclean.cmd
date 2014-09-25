@echo off
rem
rem postfinalclean 1.0
rem 01/24/04
rem


echo. >> %IT_OUTPUT%
echo POST : %Date% : %Time% : Beginning RunOnceEx Final Cleanup... >> %IT_OUTPUT%

echo. >> %IT_OUTPUT%
echo Temp Environment Varibles Cleanup >> %IT_OUTPUT%
call %IT_InsShareMP%\scripts\general\regclean.cmd "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "IT_"
call %IT_InsShareMP%\scripts\general\regclean.cmd "HKLM\SYSTEM\ControlSet001\Control\Session Manager\Environment" "IT_"
call %IT_InsShareMP%\scripts\general\regclean.cmd "HKLM\SYSTEM\ControlSet002\Control\Session Manager\Environment" "IT_"

echo. >> %IT_OUTPUT%
echo Install Cleanup >> %IT_OUTPUT%


echo. >> %IT_OUTPUT%
echo Delete %systemdrive%\tempinst
rmdir /s /q %systemdrive%\tempinst 2>> %IT_OUTPUT%

echo POST : %Date% : %Time% : Ending RunOnceEx Final Cleanup... >> %IT_OUTPUT%
set

cmd 

pause

echo. >> %IT_OUTPUT%
echo Copy Log file to network >> %IT_OUTPUT%
xcopy /i /q /h /r /y "%IT_OUTPUT%" "%IT_InsShareMP%\temp"

echo del /q /f %IT_OUTPUT%

exit
