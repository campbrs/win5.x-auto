[InstallShield Silent]
Version=v3.00.000
File=Response File
[Application]
Name=ActivePerl
Version=521
Company=ActiveState
[DlgOrder]
Dlg0=SdWelcome-0
Count=10
Dlg1=SdLicense-0
Dlg2=SdLicense-1
Dlg3=SdAskDestPath-0
Dlg4=SdComponentDialog2-0
Dlg5=SdAskOptions-0
Dlg6=SdAskOptions-1
Dlg7=SdSelectFolder-0
Dlg8=SdStartCopy-0
Dlg9=AskYesNo-0
[SdWelcome-0]
Result=1
[SdLicense-0]
Result=1
[SdLicense-1]
Result=1
[SdAskDestPath-0]
szDir=d:\apps\perl
Result=1
[SdComponentDialog2-0]
Component-type=string
Component-count=5
Component-0=Perl
Component-1=Perl for ISAPI
Component-2=PerlScript
Component-3=Online Help and Documentation
Component-4=Example Files
Result=1
[SdAskOptions-0]
Component-type=string
Component-count=3
Component-0=Add the Perl bin directory to your path
Component-1=Associate '.pl' with Perl.exe in Explorer
Component-2=Associate '.pl' with Perl.exe for your Web server(s)
Result=1
[SdAskOptions-1]
Component-type=string
Component-count=1
Component-0=Map .plx to PerlIS.dll
Result=1
[SdSelectFolder-0]
szFolder=ActivePerl
Result=1
[SdStartCopy-0]
Result=1
[AskYesNo-0]
Result=0
