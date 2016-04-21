//  Need to copy the tSBBase.XML to the PRETEMPDRIVE and then reopen this file - first task - this allows for writes and setting variables - will XML read work in WinPE2005 on CD to RAM boot??
//  


  function jSBGetInternalVars()
  {
    // Have to use either WMI or Script56 to get Volume info as Ramdisk may not be identified yet
    var aVolumeInfo = jDiskGetVolumeInfo56();

    // Get RAMDISK Driver letter
    INTERNALVARS["RAMDISKLETTER"] = jDiskGetLetters(aVolumeInfo, "ramdisk", true);

    // Get Actual Removable Drives letters
    INTERNALVARS["REMOVABLEVOLUMES"] = jDiskGetLetters(aVolumeInfo, "removable|rom", true);

    //Set the default String Array Delim
    INTERNALVARS["STRARRAYDELIM"] = ",";
  }

  function jSBReplaceVarsInStr(oXD, strValue)
  {
     jSBGetInternalVars();

     return (jHelpReplaceVarsInStr(oXD, strValue));
  }

  /*\
   * 	Function:	jSBBootStrapXML
   *	Build Date:	
   *      Written by:	Richard Campbell
   *
   *	Inputs:		
   *	Outputs:	
   *
   *	Description:	
   *
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jSBBootStapXML(oXD)
  {
    var strXMLSrcPath, strPRETempPath, strDOMURL;


    if ( oXD != null)
    {
      strXMLSrcPath = jSBReplaceVarsInStr(oXD, jXMLGetSingleNodeValue(oXD, "//VARIABLES/XMLSRCPATH"));    
      strPRETempPath = jSBReplaceVarsInStr(oXD, jXMLGetSingleNodeValue(oXD, "//VARIABLES/PRETEMPPATH"));

      strDOMURL = oXD.url.replace(/\//g,"\\").replace(/^file:\\\\\\/,"");


      //First we will copy all files from the Boot XMLDOM in to the Temp Path
      jRCopy(strDOMURL.split("\\").slice(0,-1).join("\\"), strPRETempPath, true)

      //Next we will copy all files from the Path provided in the Boot XMLDOM (duplicate names are overwritten)
      jRCopy(strXMLSrcPath, strPRETempPath, true)


      //Reload the Boot XMLDOM from the new writable volume
      oXD = jXMLLoadDOM(strPRETempPath + "\\" + strDOMURL.split("\\").pop());
    }
  }



  /*\
   * 	Function:	jSBFindInstallSRCDir
   *	Build Date:	
   *      Written by:	Richard Campbell
   *
   *	Inputs:		
   *	Outputs:	
   *
   *	Description:	Returns the OS SRC Path (this may be vary depending on the version of WinPE in use)
   *
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jSBFindOSInstallSRCDir(oXD)
  {
    var oFS, oIntVars;
    var aOSSrc;
    var strArrayDelim, oOSSrc;

    oFS = new ActiveXObject("Scripting.FileSystemObject");

    strArrayDelim = jXMLGetSingleNodeValue(oXD, "//VARARRAYDELIM");

    if ( strArrayDelim != null )
    {
      strArrayDelim = ",";
    }


    oIntVars = jSBGetInternalVars();

    if ( (strArrayDelim == null) && (oIntVars["STRARRAYDELIM"] != undefined) )
      strArrayDelim = oIntVars["STRARRAYDELIM"];
    

    oOSSrc = jSBReplaceVarsInStr(oXD, jXMLGetSingleNodeValue(oXD, "//OSSRCPATH"));

    if (oOSSrc != null)
    {
      if ( oOSSrc.constructor != Array )
      {
        aOSSrc = oOSSrc.split(strArrayDelim);
      }
      else
      {
        aOSSrc = oOSSrc;
      }

      for ( var i = 0; i < aOSSrc.length; i++ )
      {
        if ( oFS.FolderExists(aOSSrc[i]) )
        {
          strOSSrc = aOSSrc[i];
          i = aOSSrc.length;
        } 
      }
    }

    return (strOSSrc);
  }


  /*\
   * 	Function:	jSBGetAvailOS
   *	Build Date:	200
   *      Written by:	Richard Campbell
   *
   *	Inputs:		oXD            - XML DOM Object - XML DOM where the BASE Configuration information is stored
   *	Outputs:	oAvailOSNodes  - XML Nodes Object -   
   *
   *	Description:	Checks to see what OS's are avail and asks user to select which OS to install
   *
   *	Version Info:
   *                    1.0.0   - 2005/12/30 - Complete rewrite to support XML input files
   *
  \*/

  function jSBGetAvailOS(oXD)
  {
    var aAvailOSNodes = new Array();
    var oSupportedOSNodeList = oXD.selectNodes("//OS");
    var strOSSrcDir = jSBFindOSInstallSRCDir(oXD);
    var aFileList;
    var reTemp;

    if ( strOSSrcDir == null )
      return null;
WScript.Echo ("HA1");
    aFileList = jDir(strOSSrcDir);
WScript.Echo ("HA2");
    
    // Find Avail Supported OSes
    if ( aFileList != null )
    {
      for (var i = 0; i < oSupportedOSNodeList.length; i++ )
      {
        reTemp = new RegExp(jXMLGetChildNodeValue(oSupportedOSNodeList.item(i), "NAME"), "i");
        for (var j = 0; j < aFileList.length; j++)
        {
          if ( reTemp.test(aFileList[j]) )
          {
            aAvailOSNodes = aAvailOSNodes.concat(oSupportedOSNodeList.item(i));
            j = aFileList.length;
          }
        }
      }
    }

    // Return the Node for the Selected OS
    return (aAvailOSNodes);
  }

  /*\
   * 	Function:	jSBGetOS2Install
   *	Build Date:	200
   *      Written by:	Richard Campbell
   *
   *	Inputs:		osPath		 - String - Path to directory where OS files are stored
   *	Outputs:	filelist or null - Array of strings - list of all files in the path provided including path information or null if path does not exist or dir empty
   *
   *	Description:	Checks to see what OS's are avail and asks user to select which OS to install
   *
   *	Version Info:
   *                    3.0.0   - 2005/12/30 - Complete rewrite to support XML input files
   *	                2.0.0   - 2005/05/01 - Complete rewrite allowing for much more expandible options including XP/Windows 2000 Pro selections and all Service Pack Support
   *			1.0.0   - 2004/12    - original Version (named GetOSVers) 
   *
  \*/

  function jSBPromptForOS2Install(oXD) 
  {
    var aAvailOSNodes = jSBGetAvailOS(oXD);
    var strInput;
    var bInputValid = false;

    while (! bInputValid)
    {
      WScript.Echo("Select OS to install");

      for (var i = 0; i < aAvailOSNodes.length; i++)
      {
        WScript.Echo ((i + 1) + ". " + jXMLGetChildNodeValue(aAvailOSNodes[i], "DESCRIPTION"));
      }

      WScript.Echo("Selection: ");
    
      strInput = WScript.StdIn.Readline();

      // if provided number and the number is within range of the menu accept input
      if (/^\d+$/.test(strInput))
      {
        if ( (strInput > 0) && (strInput < (aAvailOSNodes.length+1)) ) 
        {
          bInputValid = true;
        }
      }
    }

    return (aAvailOSNodes[strInput-1]);
  }



  function jSBBuildAssemblyXML(oXDBase)
  {
    // Create Output File
    var strAssemblyXMLFileName, strSystemClass;
    var oXDAssembly, oXNodeAssemblyRoot, oXNodeAssemblyChild, oXNodeOSType;

    strAssemblyXMLFileName = jSBReplaceVarsInStr(oXDBase, jXMLGetSingleNodeValue(oXDBase, "//ASSEMBLYXML"));
    if ( strAssemblyXMLFileName != null )
    {

      if ( strAssemblyXMLFileName.constructor == Array )
        strAssemblyXMLFileName = strAssemblyXMLFileName[0];

      oXDAssembly = jXMLCreateDocument("ASSEMBLY_ROOT");


      // Create Nodes
      oXNodeAssemblyRoot = oXDAssembly.selectSingleNode("//ASSEMBLY_ROOT"); 

      oXNodeAssemblyChild = oXDAssembly.createElement("VARIABLES");
      oXNodeAssemblyRoot.appendChild(oXNodeAssemblyChild);
    
      oXNodeAssemblyChild = oXDAssembly.createElement("OSSPECS");
      oXNodeAssemblyRoot.appendChild(oXNodeAssemblyChild);
    
      oXNodeAssemblyChild = oXDAssembly.createElement("PARTITIONSPEC");
      oXNodeAssemblyRoot.appendChild(oXNodeAssemblyChild);

      oXNodeAssemblyChild = oXDAssembly.createElement("OSANSWERFILE");
      oXNodeAssemblyRoot.appendChild(oXNodeAssemblyChild);

      oXNodeAssemblyChild = null;

      // Copy Vars???
      jXMLMergeNode(oXDBase.selectSingleNode("//VARIABLES"), oXDAssembly.selectSingleNode("//VARIABLES"), null);

/*      // Copy OS config
      oXNodeAssemblyChild = oXDAssembly.createElement("OSSPECS");
      oXNodeOSType = jSBPromptForOS2Install(oXDBase);
      jXMLMergeNode(oXNodeOSType, oXDAssembly.selectSingleNode("//OSSPECS"), null);

      // Merge in Base Configs
      // Partition Specs
      jXMLMergeNode(oXDBase.selectSingleNode("//SYSTEMCLASSSPECS/BASE/PARTITIONSPEC"), oXDAssembly.selectSingleNode("\\PARTITIONSPEC"), null);

      // OS Answer File
      jXMLMergeNode(oXDBase.selectSingleNode("//SYSTEMCLASSSPECS/BASE/OSANSWERFILE"), oXDAssembly.selectSingleNode("\\OSANSWERFILE"), null);

      // Apply System Class settings
      strSystemClass = jXMLGetChildNodeValue(oXNodeOSType, "SYSTEMCLASS");

      // Partition Specs
      jXMLMergeNode(oXDBase.selectSingleNode("//SYSTEMCLASSSPECS/" + strSystemClass + "/PARTITIONSPEC"), oXDAssembly.selectSingleNode("\\PARTITIONSPEC"), null);

      // OS Answer File
      jXMLMergeNode(oXDBase.selectSingleNode("//SYSTEMCLASSSPECS/" + strSystemClass + "/OSANSWERFILE"), oXDAssembly.selectSingleNode("\\OSANSWERFILE"), null);
*/
      oXDAssembly.save(strAssemblyXMLFileName);
    }
  }


  function jSBFindTXTModeOEMControllerStrings(strComputerName, strTXTModeFile)
  {
    var aPCIAdapters = jRegEnumKeys(strComputerName, HKLM, "SYSTEM\\CurrentControlSet\\Enum\\PCI");
    var aOEMSCSICards = new Array();

    var oXDTemp = jXMLCreateDocument("ROOT");
    var oXNodeRoot = oXDTemp.selectSingleNode("//ROOT");

    var strCurrentAdapter, strControllerCode, strControllerString;
    var reCurrentAdapter;
    var oXNodeFound, oXNodeSCSIStrings, oXNodeControllerString;

    var reString = /\".*\"/;

    jINI2XML(strTXTModeFile, oXNodeRoot, oXNodeControllerString);

    for (var i = 0; i < aPCIAdapters.length; i++)
    {
      oXNodeFound = null;
      strCurrentAdapter = aPCIAdapters[i];
      strCurrentAdapter = strCurrentAdapter.replace(/&REV_[0-9A-Fa-f]*/i,"");
      reCurrentAdapter =  new RegExp(strCurrentAdapter,"i");

      oXNodeFound = jXMLSearchNodes(oXNodeRoot, reCurrentAdapter);

      if ( oXNodeFound == null )
      {
        strCurrentAdapter = strCurrentAdapter.replace(/&SUBSYS_[0-9A-Fa-f]*/i,"");
        reCurrentAdapter =  new RegExp(strCurrentAdapter,"i");

        oXNodeFound = jXMLSearchNodes(oXNodeRoot, reCurrentAdapter);
      }

      if ( oXNodeFound != null )
      {
        strControllerCode = jXMLGetAttribute(oXNodeFound.parentNode, "NAME").replace(/^.*\./,"");
        oXNodeSCSIStrings = jXMLSelectSingleNodeAttribute(oXDTemp, "//INI_SECTION", "NAME", new RegExp("scsi",""));
        oXNodeControllerString = jXMLSearchNodes(oXNodeSCSIStrings, new RegExp(strControllerCode, "i"));

        strControllerString = jXMLGetAttribute(oXNodeControllerString, "VALUE");

        aControllerStrings = jHelpMatch(strControllerString, reString);

        if ( aControllerStrings.length > 0 )
        {
          aOEMSCSICards.push(aControllerStrings[0]); 
        }
      }
    }

    return (aOEMSCSICards);
  }
