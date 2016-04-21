
  /*\
   *   Function:     jIISPathExists
   *   Version:	     0.1
   *   Date:         8/30/2005
   *
   *
   *   Inputs:	     ADSI Path
   *   Outputs:      true or false - depending on if IIS is installed
   *
   *   Description: Checks to see if the IIS ADSI Path exists
   *                Side-effect: if just a server name is specified then IIS itself is checked
   *                
  \*/

  function jIISPathExists(sADSIPath)
  {
    var oIISServer;

    try
    {
      oIISServer = GetObject(sADSIPath);
      return true;
    }
    catch (sException)
    {
      return false;
    }
  }

  /*\
   *   Function:     jIISGetHomeDir
   *   Version:	     0.1
   *   Date:         8/30/2005
   *
   *
   *   Inputs:	     ADSI Path
   *   Outputs:      String of the Home Directory
   *
   *   Description: Returns the Home directory of the specified Virtual Directory path or Site path
   *                
  \*/

  function jIISGetHomeDir(sADSIPath) 
  {
    var oIISWebService = GetObject(sADSIPath);

    return oIISWebService.Path;
  }


  /*\
   *   Function:     jChangeIISLogs
   *   Version:	     0.2
   *   Date:         5/11/2005
   *
   *
   *   Inputs:	     Server Name, Path to log file directory, OS Build Version
   *   Outputs:
   *
   *   Description: Enables logging for all FTP, Web, and SMTP sites and sets
   *                the path to store the log files to the provided local path.
  \*/

  function jChangeIISLogs(sServerName, sLogFileDirectory, sOSBuildVer) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var e = new Enumerator(GetObject("IIS://" + sServerName));
    var IIsLogModuleObj;

    // logging Formats
    // Identify the Clsids of each logging module
    var sNCSA = "NCSA Common Log File Format"; 
    IIsLogModuleObj = GetObject("IIS://" + sServerName + "/Logging/" + sNCSA);
    var sClsidNCSA = IIsLogModuleObj.LogModuleId; 

    var sIIS = "Microsoft IIS Log File Format"; 
    IIsLogModuleObj = GetObject("IIS://" + sServerName + "/Logging/" + sIIS);
    var sClsidIIS = IIsLogModuleObj.LogModuleId;

    var sW3C = "W3C Extended Log File Format";
    IIsLogModuleObj = GetObject("IIS://" + sServerName + "/Logging/" + sW3C);
    var sClsidW3C = IIsLogModuleObj.LogModuleId;

    var sLogFileFormat = sClsidW3C;


    for(; ! e.atEnd(); e.moveNext()) {
      x = e.item();

      if ((x.Name == "W3SVC") || (x.Name == "MSFTPSVC") || (x.Name == "SmtpSvc")) {
        var f = new Enumerator(GetObject("IIS://" + sServerName + "/" + x.Name));



        for(; ! f.atEnd(); f.moveNext()) {
          y = f.item();
          if ((y.Class == "IIsFtpServer") || (y.Class == "IIsWebServer") || (y.Class == "IIsSmtpServer")) {

            // Enable logging
            y.LogType = 1;

            // set the log file format
            y.LogPluginClsid = sLogFileFormat;

            // set the logfile directory
            if ( ( sLogFileDirectory != null ) && ( oFS.FolderExists(sLogFileDirectory) ) )
              y.LogFileDirectory = sLogFileDirectory;

            // set extended logging parameters
            // Log File Extended Logging Bitmask
            // See following website for bitmasks:
            // http://msdn.microsoft.com/library/default.asp?url=/library/en-us/iissdk/html/4f4de2c6-7151-4a01-ac2d-3545869c7625.asp
            // Log: Everything - Date, Time, Client IP, username, service name, server name, server IP, server port, 
            //      method, uri stem, uri query, protocol status, win32 status, bytes sent, bytes recieved, time taken, \
            //      protocol version, host, user agent, cookie, referer

            y.LogExtFileDate = true;
            y.LogExtFileTime = true;
            y.LogExtFileClientIp = true;
            y.LogExtFileUserName = true;
            y.LogExtFileSiteName = true;
            y.LogExtFileComputerName = true;
            y.LogExtFileServerIp = true;
            y.LogExtFileMethod = true;
            y.LogExtFileUriStem = true;
            y.LogExtFileUriQuery = true;
            y.LogExtFileHttpStatus = true;
            y.LogExtFileWin32Status = true;
            y.LogExtFileBytesSent = true;
            y.LogExtFileBytesRecv = true;
            y.LogExtFileTimeTaken = true;
            y.LogExtFileServerPort = true;
            y.LogExtFileUserAgent = true;
            y.LogExtFileCookie = true;
            y.LogExtFileReferer = true;
            y.LogExtFileProtocolVersion = true;
            y.LogExtFileHost = true;

            if ( sOSBuildVer >= "3790" )
              y.LogExtFileHttpSubStatus = true;
  
            y.SetInfo();
          }
        }
      }
    }
  }

  /*\
   *   Function:        jDeleteAllVirtualDirs
   *   Version:		0.2
   *   Date:		5/27/2005
   *
   *
   *   sInputs:		ADSI IIS metabase Root Virtual Directory Path
   *   Outputs:
   *
   *   Description:	To delete all Web directories and virtual directories for an IIS Web Site
   *			starting at the provided root.
   *
   *   Verison History:	0.2	5/27/2007 - Changed name from DeleteVirtualDirs to DeleteAllVirtualDirs
   *			0.1	1/11/2005 - Original code
   *
  \*/

  function jDeleteAllVirtualDirs(VDPath) {
    var d = GetObject(VDPath);
    var e = new Enumerator(d);
    var aA = new Array();
    var aB = new Array();
    var x;

    // for each object under the passed Virtul Directory path
    for(; ! e.atEnd(); e.moveNext()) {
      x = e.item();

      // add the Class and Name into an Array if the object is a Virtual or Web Directory
      if ((x.Class == "IIsWebVirtualDir") || (x.Class == "IIsWebDirectory")) {
        aA.push(x.Class);
        aB.push(x.Name);
      }
    }

    // If found virtual or web directories; delete them
    if (aA != null)
      for (i = 0; i < aA.length; i++)
        d.Delete(aA[i],aB[i]);
  }


  /*\
   *   Function:        jDeleteVirtualDir
   *   Version:		0.1
   *   Date:		5/27/2005
   *
   *
   *   sInputs:		ADSI IIS metabase Virtual Directory Path
   *   Outputs:
   *
   *   Description:	To delete a specified Web directory or virtual directory
   *
   *   Verison History:	0.1	5/27/2007 - Original Code
   *
  \*/

  function jDeleteVirtualDir(VDPath)
  {
    if ( jIISPathExists(VDPath) )
    {
      var oChild = GetObject(VDPath);
      var oParent = GetObject(VDPath.split("/").slice(0,-1).join("/"));

      // if the object is a Virtual or Web Directory delete it
      if ((oChild.Class == "IIsWebVirtualDir") || (oChild.Class == "IIsWebDirectory"))
        oParent.Delete(oChild.Class,oChild.Name)
    }
  }


  /*\
   *   Function:        jBuildIISfileAnswerFile
   *   Version:		0.1
   *   Date:		1/11/2005
   *
   *
   *   Inputs:		Answer File Name(with path), Arguments Object
   *   Outputs:		
   *
   *   Description:	Builds either UNINSTALL or INSTALL answer file for use with sysocmgr.exe
   *			(the command line Windows Optional Components Manager (add/remove Windows
   *			Components - in the control panel).  The answer file is based on Arguments passed
   *			into the host script.
  \*/


  function jBuildIISfileAnswerFile(strAnswerFileName, strInstallPath, boolUninstall) {
    var objFS = new ActiveXObject("Scripting.FileSystemObject");

    var fileAnswerFile = objFS.CreateTextFile(strAnswerFileName);
  
    fileAnswerFile.WriteLine("[Components]");

    if ( boolUninstall ) fileAnswerFile.WriteLine("aspnet = off");
    else fileAnswerFile.WriteLine("aspnet = on");

    fileAnswerFile.WriteLine("BitsServerExtensionsISAPI = off");
    fileAnswerFile.WriteLine("BitsServerExtensionsManager = off");

    // Do not install unless needed - Installs windows Sharepoint Services (WSS)
    if ( boolUninstall ) fileAnswerFile.WriteLine("fp_extensions = off");
    else fileAnswerFile.WriteLine("fp_extensions = off");

    fileAnswerFile.WriteLine("fp_vdir_deploy = off");
    fileAnswerFile.WriteLine("iisdbg = off");

    if ( boolUninstall ) fileAnswerFile.WriteLine("iis_asp = off");
    else fileAnswerFile.WriteLine("iis_asp = on");

    if ( boolUninstall ) fileAnswerFile.WriteLine("iis_common = off");
    else fileAnswerFile.WriteLine("iis_common = on");

    if ( boolUninstall ) fileAnswerFile.WriteLine("iis_ftp = off");
    else fileAnswerFile.WriteLine("iis_ftp = on");

    if ( boolUninstall ) fileAnswerFile.WriteLine("iis_inetmgr = off");
    else fileAnswerFile.WriteLine("iis_inetmgr = on");

    fileAnswerFile.WriteLine("iis_internetdataconnector = off");
    fileAnswerFile.WriteLine("iis_nntp = off");
    fileAnswerFile.WriteLine("iis_nntp_docs = off");

    if ( boolUninstall ) fileAnswerFile.WriteLine("iis_serversideincludes = off");
    else fileAnswerFile.WriteLine("iis_serversideincludes = on");

    if ( boolUninstall ) fileAnswerFile.WriteLine("iis_smtp = off");
    else fileAnswerFile.WriteLine("iis_smtp = on");

    fileAnswerFile.WriteLine("iis_smtp_docs = off");
    fileAnswerFile.WriteLine("iis_webadmin = off");
    fileAnswerFile.WriteLine("iis_webdav = off");

    if ( boolUninstall ) fileAnswerFile.WriteLine("iis_www = off");
    else fileAnswerFile.WriteLine("iis_www = on");

    fileAnswerFile.WriteLine("iis_www_vdir_scripts = off");

    // Do not install unless needed - Installs windows Sharepoint Services (WSS)
    // The WSS Indexing Service Puts additional unneeded load on server
    if ( boolUninstall ) fileAnswerFile.WriteLine("indexsrv_system = off");
    else fileAnswerFile.WriteLine("indexsrv_system = off");

    fileAnswerFile.WriteLine("inetprint = off");
    fileAnswerFile.WriteLine("netcis = off");
  
    fileAnswerFile.WriteLine("[InternetServer]");
    if ( strInstallPath != null )
    {
      fileAnswerFile.WriteLine("pathftproot = " + strInstallPath + "\\ftp");
      fileAnswerFile.WriteLine("pathwwwroot = " + strInstallPath + "\\http");
    }

    fileAnswerFile.Close();
  }


  /*\
   *  Function:		jHardenIIS
   *  Version:		0.1
   *  Date:		9/1/2005
   *
   *  sInput:           objConfig - standard config object used to pass the Log Dir, Scripts Dir, and Whether to keep the all Virtual Directories
   *  Output:		
   *
   *  Description:	Function to harden IIS
   *  
  \*/

  function jHardenIIS(objConfig)
  {
    var objWinCmd = new ActiveXObject("WScript.Shell");
    var PROCENV = objWinCmd.Environment("PROCESS");
    var strSYSTEMROOT = PROCENV("SYSTEMROOT");
    var strTDTag = jHelpGetTimeDateTag();


    jPrint(objConfig, "Performing IIS Hardening...");
    if ( ! jIISPathExists("IIS://localhost") )
    {
       jPrint(objConfig, "IIS Not Installed so no IIS Hardening will be performed!!!\n");
       return (false);
    }

    // Backup the metabase
    jPrint(objConfig, "Backing up the IIS Metabase...");
    vIISBackupMetabase("localhost", "MBBU_" + strTDTag);
    jPrint(objConfig, "The existing IIS Metabase has been backed up to:\n  MBBU_" + strTDTag); 

    jPrint(objConfig, "Hardening IIS...");

    // Set up IIS Logs
    if ( (objConfig["LOGPath"] != null) || (objConfig["LOGPath"] != undefined) )
    {
      jMKDirs(Array(objConfig["LOGPath"]));
      jChangeIISLogs("localhost", objConfig["LOGPath"], objConfig["OSBuildVer"]);
    }

    // Set the Application Extensions Script Maps (uses VBScript due to a limitation in JScript)
    vHardenScriptMaps("IIS://localhost/W3SVC", strSYSTEMROOT + "\\system32\\inetsrv\\asp.dll");

    // Cleanup the default Web Site if it exists
    if ( jIISPathExists("IIS://localhost/W3SVC/1/ROOT") )
    {

      // Get the OS path for the Default Web Site and the ROOT IIS installation path (always on dir above the DWS)
      sIISDWSPath = jIISGetHomeDir("IIS://localhost/W3SVC/1/ROOT");
      sIISROOTPath = sIISDWSPath.split("\\").slice(0,-1).join("\\");

      // Remove unneeded default Directories, files and Virtual directories

      // Windows 2000 Specific Hardening
      if ( objConfig["OSBuildVer"] == "2195" )
      {
        // Move IIS Admin Scripts to the Script Path if provided
        if ( objConfig["SCRPTPath"] != null )
        {
          jRMove(sIISROOTPath + "\\AdminScripts", objConfig["SCRPTPath"], true);
        }

// FIX        // Currently we are going to delete all Virt Dirs
        jDeleteAllVirtualDirs("IIS://localhost/W3SVC/1/ROOT");

        // Delete the IISSamples folder
        jRMDir(sIISROOTPath + "\\iissamples", true);
 
        // Delete the IISScripts folder
        jRMDir(sIISROOTPath + "\\scripts", true);

        // Remove all files and folders under the base folder for the default web site
        jCleanDir(sIISDWSPath + "\\*");
      }

      // Windows XP Specific Hardening
      else if ( objConfig["OSBuildVer"] == "2600" )
      {
        // Move IIS Admin Scripts to the Script Path if provided
        if ( objConfig["SCRPTPath"] != null )
        {
          jRMove(sIISROOTPath + "\\AdminScripts", objConfig["SCRPTPath"], true);
        }

// FIX        // Currently we are going to delete all Virt Dirs
        jDeleteAllVirtualDirs("IIS://localhost/W3SVC/1/ROOT");

        // Delete the IISSamples folder
        jRMDir(sIISROOTPath + "\\iissamples", true);
 
        // Delete the IISScripts folder
        jRMDir(sIISROOTPath + "\\scripts", true);

        // Remove all files and folders under the base folder for the default web site
        jCleanDir(sIISDWSPath + "\\*");
      }

      // Windows 2003 Specific Hardening
      else if ( objConfig["OSBuildVer"] == "3790" )
      {
 
        //Enable ASP ISAPI Extension
        vConfigISAPIExtension("IIS://localhost/W3SVC", "ASP", "Enable");

        // Move IIS Admin Scripts to the Script Path if provided
        if ( (objConfig["SCRPTPath"] != null) || (objConfig["SCRPTPath"] != undefined) )
        {
          jRMove(sIISROOTPath + "\\AdminScripts", objConfig["SCRPTPath"], true);
        }

        // Delete unneeded Default Virtual directories
        jDeleteVirtualDir("IIS://localhost/W3SVC/1/ROOT/tsweb");
        jDeleteVirtualDir("IIS://localhost/W3SVC/1/ROOT/Printers");
        jDeleteVirtualDir("IIS://localhost/W3SVC/1/ROOT/aspnet_client");

        // Delete default folders
        jRMDir(sIISDWSPath + "\\aspnet_client", true);

        // Delete all files in the base folder for the default web site
        jDelFile (sIISDWSPath + "\\iisstart.htm", true);
        jDelFile (sIISDWSPath + "\\pagerror.gif", true);
      } 
    }
    jPrint(objConfig, "Finished Hardening IIS...\n");
    return (true);
  }



  /*\
   *   Function:    jBuildBigIPASP
   *   Version:     0.1
   *   Date:        1/11/2005
   *
   *
   *   Inputs:     Destination Folder
   *   Outputs:
   *
   *   Description: Builds various ASP files into the provided destination folder
  \*/

  function jBuildBigIPASP(strDestinationFolder) {
    var objFS = new ActiveXObject("Scripting.FileSystemObject");

    var fileBigIPHB;

    if ( objFS.FolderExists(strDestinationFolder) )
    {
      fileBigIPHB = objFS.CreateTextFile(strDestinationFolder + "\\bigip_hb.asp");
      fileBigIPHB.WriteLine("<html>");
      fileBigIPHB.WriteLine("<head>");
      fileBigIPHB.WriteLine("<title>IIS Heartbeat</title>");
      fileBigIPHB.WriteLine("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\">");
      fileBigIPHB.WriteLine("</head>");
      fileBigIPHB.WriteLine("<body bgcolor=\"#FFFFFF\" text=\"#000000\">");
      fileBigIPHB.WriteLine("<table width=\"744\" border=0 cellspacing=0 cellpadding=0>");
      fileBigIPHB.WriteLine("  <tr>");
      fileBigIPHB.WriteLine("    <td class=greytext align=left valign=\"top\" colspan=\"2\">");
      fileBigIPHB.WriteLine("      <table width=\"696\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
      fileBigIPHB.WriteLine("        <tr>");
      fileBigIPHB.WriteLine("          <td width=\"703\"><b><font face=\"Verdana, Arial, Helvetica, sans-serif, Arial Unicode MS\" size=\"3\" color=\"335687\">IIS Heartbeat</font></b></td>");
      fileBigIPHB.WriteLine("        </tr>");
      fileBigIPHB.WriteLine("      </table>");
      fileBigIPHB.WriteLine("    </td>");
      fileBigIPHB.WriteLine("  </tr>");
      fileBigIPHB.WriteLine("</table>");
      fileBigIPHB.WriteLine("</body>");
      fileBigIPHB.WriteLine("</html>");
      fileBigIPHB.Close();
    }
  }



  /*\
   *   Function:    jBuildTestInfoASP
   *   Version:     0.1
   *   Date:        1/11/2005
   *
   *
   *   Inputs:     Destination Folder
   *   Outputs:
   *
   *   Description: Builds various ASP files into the provided destination folder
  \*/

  function jBuildTestInfoASP(strDestinationFolder) {
    var objFS = new ActiveXObject("Scripting.FileSystemObject");

    var fileTESTINFO;

    if ( objFS.FolderExists(strDestinationFolder) )
    {
      fileTESTINFO = objFS.CreateTextFile(strDestinationFolder + "\\testinfo.asp");
      fileTESTINFO.WriteLine("<%@ LANGUAGE=\"VBScript\" %>");
      fileTESTINFO.WriteLine("<HTML>");
      fileTESTINFO.WriteLine("<HEAD>");
      fileTESTINFO.WriteLine("<META NAME=\"GENERATOR\" Content=\"Microsoft Visual Studio 6.0\">");
      fileTESTINFO.WriteLine("</HEAD>");
      fileTESTINFO.WriteLine("<BODY>");
      fileTESTINFO.WriteLine("<table>");
      fileTESTINFO.WriteLine("<%");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>&nbsp;</td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td><b>TEST INFORMATION</b></td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>&nbsp;</td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td><b>CLIENT INFO</b></td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>client web browser information = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"HTTP_USER_AGENT\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>client hostame = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"REMOTE_NAME\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>client IP = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"REMOTE_ADDR\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>&nbsp;</td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td><b>SERVER INFO</b></td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>web server = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"HTTP_HOST\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>web server IP (local)  = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"LOCAL_ADDR\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>web server port (local) = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"SERVER_PORT\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>&nbsp;</td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td><b>CONNECTION INFO</b></td></tr>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>requested URL = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"URL\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>request method = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"REQUEST_METHOD\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>http Language = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"HTTP_ACCEPT_LANGUAGE\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>http connection type = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"HTTP_CONNECTION\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("Response.Write(\"<tr><td>allows http encoding = </td>\")");
      fileTESTINFO.WriteLine("Response.Write(\"<td>\" & Request.ServerVariables(\"HTTP_ACCEPT_ENCODING\") & \"</td></tr>\" & vbLF)");
      fileTESTINFO.WriteLine("%>");
      fileTESTINFO.WriteLine("<table>");
      fileTESTINFO.WriteLine("</BODY>");
      fileTESTINFO.WriteLine("</HTML>");
      fileTESTINFO.Close();
    }
  }
