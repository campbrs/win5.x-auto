


Option Explicit



  '
  '   Function:     vIISBackupMetabase
  '   Version:	     0.1
  '   Date:         8/30/2005
  '
  '
  '   Inputs:	     strServername - name of server on which to backup the metabase
  '                 strBackupName - location where to backup the metabase to
  '   Outputs:
  '
  '   Description: Backs up the metabase to the specified file
  '                
  '

  Sub vIISBackupMetabase(strServername, strBackupName)
    Dim lngBackupVersion, lngBackupFlags
    Dim objIISServer

    ' Use the next available version number.
    lngBackupVersion = &HFFFFFFFF

    ' 
    lngBackupFlags = 0


    Set objIISServer = GetObject("IIS://" & strServername)


    objIISServer.Backup strBackupName, lngBackupVersion, lngBackupFlags

  End Sub


  '
  '    Script Type: VBScript SubRoutine
  '    Name:        vHardenScriptMaps       
  '    Version:     0.1
  '    Date:        2005-08-26
  '    Description: Replaces Server Side Include IIS Application Mappings
  '                 with the provided ISAPI DLL for the provide ADSI PAth.
  '
  '    Inputs:      strADSIPath - ADSI Path of the Web Service, Virtual Server, or Virtual Directory
  '                 strISAPIDLL - isapdi dll with full path (i.e. c:\windows\system32\inetsrv\asp.dll)
  '  

  sub vHardenScriptMaps(strADSIPath, strISAPIDLL)
    Dim aryScriptMaps
    Dim aryNewScriptMaps()
    Dim aryCurrScriptMap
    Dim objIIsWebService
    Dim i
    Dim j
 
    Set objIIsWebService = GetObject(strADSIPath)

    aryScriptMaps = objIIsWebService.Get("ScriptMaps")

    j = 0
    For i = 0 To UBound(aryScriptMaps)
      aryCurrScriptMap = Split(aryScriptMaps(i), ",")

      Select Case aryCurrScriptMap(0)

        ' Set the ISAPI DLL for items that use ssinc.dll
        Case ".shtm",".shtml",".stm"
          aryCurrScriptMap(1) = strISAPIDLL
      End Select

      ' expand the new Script Maps Array
      ReDim Preserve aryNewScriptMaps(j)
      aryNewScriptMaps(j) = Join(aryCurrScriptMap,",")
      j = j + 1
    Next

    ' Store the new ScriptMaps
    objIIsWebService.Put "ScriptMaps", aryNewScriptMaps

    ' Set the metabase
    objIIsWebService.SetInfo

    Set objIIsWebService = nothing

  End Sub     


  '
  '    Script Type: VBScript SubRoutine
  '    Name:        vConfigISAPIExtension       
  '    Version:     0.1
  '    Date:        2005-08-29
  '    Description: Enables the ISAPI ASP Web Service if disabled allowing ASP pages to be served
  '
  '    Inputs:      sADSIPath - ADSI Path of the Web Service, Virtual Server, or Virtual Directory
  '                 sISAPIExt - Name of the ISAPI Web Service

  Sub vConfigISAPIExtension(sADSIPath, sISAPIExt, sSetting)
    Dim objIIsWebService

    Set objIIsWebService = GetObject(sADSIPath)

    If sSetting = "Enable" Or sSetting = "enable" Then
      objIIsWebService.EnableWebServiceExtension sISAPIExt
    ElseIf sSetting = "Disable" Or sSetting = "disable" Then
      objIIsWebService.DisableWebServiceExtension sISAPIExt
    End If

    ' Set the metabase
    objIIsWebService.SetInfo

    ' clean the object
    Set objIIsWebService = nothing
  End Sub     
