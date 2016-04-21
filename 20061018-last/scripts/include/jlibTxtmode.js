

  /*\
   * Function:	 jTMFindBootControllerOEMTxtModeDriverPaths
   * Build Date: 2006/10/02
   * Written by: Richard Campbell
   *
   * Inputs:  strStartPath		 - String - Path to get directory of
   * Outputs: aFoundPaths - Array Object - Array of all found directories that contain an "textmode.oem" file that contains the 
   *
   * Description:	Provides a list of all files and directories in a path - Functions similar to ms-dos dir or unix ls commands
   *
   * Version Info:	2.0.0	- 2005/05/01 - Fixed to check if path exists; return Array of strings instead of Array of objects
   *			1.0.0	- 2004/12    - original Version (named Dir) 
   *
  \*/

  function jTMFindControllerOEMTxtModeDriverPaths(strStartPath, strDeviceID)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var aFoundTxtsetupFiles = jFileFind(strStartPath, "txtsetup.oem");

    var strFoundPath;
    var aDeviceID;


    var fdCurrentFile;
    var i;
    var bKeepLooking = true;


    if ( (strDeviceID != null) && (aFoundTxtsetupFiles != null) )
    {
      aDeviceID = strDeviceID.split("&");

      // Try more specific deviceID string first if not found generalize serach string by removing revision and subversions (continuies until base vendor and device are left)
      while ( (aDeviceID.length > 1) && bKeepLooking)
      {
        i = 0;

        //Go through each file with the current DeviceID string
        while ( (aFoundTxtsetupFiles.length > i) && bKeepLooking )
        {
          if ( jFileFindString(aFoundTxtsetupFiles[i], aDeviceID.join("&")) )
          {
            fdCurrentFile = oFS.GetFile(aFoundTxtsetupFiles[i]);
            strFoundPath = fdCurrentFile.ParentFolder;
            bKeepLooking = false;
          }

          i++;
        }

        aDeviceID = aDeviceID.slice(0,-1);
      }
    }
    return (strFoundPath);
  }


  function jTMGetBootControllerPNPID(strComputerName)
  {
    var reDeviceID = null;
    var strBootControllerID = null, strFoundPNPID = null;
    var aFoundBootControllerID = null;

    reDeviceID = new RegExp("PCI\\\\VEN_[A-F0-9]+&DEV_[A-F0-9A-F]+[_&A-Z0-9]*","i");

    strBootControllerID = jDiskGetBootDiskControllerID(strComputerName);
    if ( strBootControllerID != null )
    {
      aFoundBootControllerID = strBootControllerID.match(reDeviceID);
      if ( aFoundBootControllerID != null )
      {
        strFoundPNPID = aFoundBootControllerID[0];
      }
    }

    return (strFoundPNPID);
  }

 

  function jTMGetControllerTAGs(oXNodeParent, asControllerPNPIDs)
  {
    var aDeviceID;
    var bKeepLooking = true;
    var strControllerTAG;
    var asTxtsetupTAGs = new Array();
    var oXNodePNPID = null, oXNodeSCSI = null, oXNodeOEMString = null;
    
    
    // validate provided data
    if ( oXNodeParent == null || asControllerPNPIDs == null || asControllerPNPIDs.constructor != Array )
    {
      return (null);
    }


    for (var i=0; i < asControllerPNPIDs.length; i++)
    {
      aDeviceID = asControllerPNPIDs[i].split("&");
      bKeepLooking = true;

      while ( (aDeviceID.length > 1) && bKeepLooking)
      {

        oXNodePNPID = jXMLSearchNodes(oXNodeParent, new RegExp(jHelpStrPrepRegExp(aDeviceID.join("&")), "i") );

        if ( oXNodePNPID != null )
        {
          strControllerTAG = oXNodePNPID.parentNode.getAttribute("NAME").split(".").pop().replace(/\s*/g,"");
          asTxtsetupTAGs.push(strControllerTAG);
          bKeepLooking = false;
        }

        aDeviceID = aDeviceID.slice(0,-1);
      }
    }

    return (asTxtsetupTAGs);
  }


  function jTMGetOSAFOEMStrings(oXNodeParent, asTxtsetupTAGs)
  {
    var oXNodeSCSI = null, aoXNodesOEMString = null;
    var aOEMStrings = new Array();
    var strTxtsetupTAGs = null;

    // validate provided data
    if ( oXNodeParent == null || asTxtsetupTAGs == null || asTxtsetupTAGs.constructor != Array )
    {
      return (null);
    }

    for (var i = 0; i < asTxtsetupTAGs.length; i++)
    {
      asTxtsetupTAGs[i] = jHelpStrPrepRegExp(asTxtsetupTAGs[i]);
    }

    strTxtsetupTAGs = "(" + asTxtsetupTAGs.join("|") + ")" ;


    // get the node of the SCSI controller strings section
    oXNodeSCSI = jXMLFindChildWithAttribute(oXNodeParent, "NAME", /^scsi$/i);

    if ( oXNodeSCSI != null )
    {
      // within the SCSI Controller section get the Key pair where the Key matches the PNPID TAG (note: the value is the OEM Txtmode string)
      aoXNodesOEMString = jXMLFindChildrenWithAttribute(oXNodeSCSI, "KEY", new RegExp("^" + strTxtsetupTAGs + "$", "i") );
      
      if (aoXNodesOEMString != null)
      {
        for (var i=0; i < aoXNodesOEMString.length; i++)
        {
          aOEMStrings.push(aoXNodesOEMString[i].getAttribute("VALUE").replace(/[^\"]*$/,""));
        }
      }
    }
    return (aOEMStrings);
  }

  function jTMGetFileList(oXNodeParent, asTxtsetupTAGs)
  {
    var aoXNodesFileSection = null;
    var oXNodeDiskSection = null;
    var oXNodeDiskCurrKeyVal = null;
    var oXNListFileSectionChildren = null;

    var aFileList = new Array();
    var aFileComponent, aDiskComponent = new Array(3);
    var strTxtsetupTAGs, strRawFileName, strDiskComponent, strDiskTAG, strDiskString;


    // validate provided data
    if ( oXNodeParent == null || asTxtsetupTAGs == null || asTxtsetupTAGs.constructor != Array )
    {
      return (null);
    }

    for (var i = 0; i < asTxtsetupTAGs.length; i++)
    {
      asTxtsetupTAGs[i] = jHelpStrPrepRegExp(asTxtsetupTAGs[i]);
    }

    strTxtsetupTAGs = "(" + asTxtsetupTAGs.join("|") + ")" ;


    // get the node of the section for the specified controller
    aoXNodesFileSection = jXMLFindChildrenWithAttribute(oXNodeParent, "NAME", new RegExp("^files\.scsi\." + strTxtsetupTAGs + "$", "i"));
    oXNodeDiskSection = jXMLFindChildWithAttribute(oXNodeParent, "NAME", new RegExp("^disks$", "i"));

    for (var i=0; i < aoXNodesFileSection.length; i++)
    {
      // get the files
      oXNListFileSectionChildren = aoXNodesFileSection[i].childNodes;

      for (var j=0; j < oXNListFileSectionChildren.length; j++)
      {
        aFileComponent = jXMLGetAttribute(oXNListFileSectionChildren.item(j), "VALUE").split(",");
        strRawFileName = aFileComponent[1].replace(/\s*/g,"");
        strDiskTAG = aFileComponent[0].replace(/\s*/g,"");

        oXNodeDiskCurrKeyVal = jXMLFindChildWithAttribute(oXNodeDiskSection, "KEY", new RegExp("^" + jHelpStrPrepRegExp(strDiskTAG) + "$", "i"));
        strDiskComponent = jXMLGetAttribute(oXNodeDiskCurrKeyVal, "VALUE").replace(/(^\s*\"[^\"]*\"\s*,[^,]*,\s*)|(\s*$)/g, "");

        if ( ! /^\\+$/.test(strDiskComponent) )
        {
          strRawFileName = strDiskComponent.replace(/^\\+/,"") + "\\" + strRawFileName;
        }

        aFileList.push(strRawFileName);
      }
      
    }

    return (aFileList);
  }


  function jTMGetDiskTAGs(oXNodeParent, asTxtsetupTAGs)
  {
    var aoXNodesFileSection = null;
    var oXNListFileSectionChildren = null;

    var asDiskTAGs = new Array();
    var aFileComponent;
    var strTxtsetupTAGs, strDiskTAG;
    var bFoundDiskTAG;
    var k = 0;


    // validate provided data
    if ( oXNodeParent == null || asTxtsetupTAGs == null || asTxtsetupTAGs.constructor != Array )
    {
      return (null);
    }

    for (var i = 0; i < asTxtsetupTAGs.length; i++)
    {
      asTxtsetupTAGs[i] = jHelpStrPrepRegExp(asTxtsetupTAGs[i]);
    }

    strTxtsetupTAGs = "(" + asTxtsetupTAGs.join("|") + ")" ;


    // get the node of the section for the specified controller
    aoXNodesFileSection = jXMLFindChildrenWithAttribute(oXNodeParent, "NAME", new RegExp("^files\.scsi\." + strTxtsetupTAGs + "$", "i"));

    for (var i=0; i < aoXNodesFileSection.length; i++)
    {
      // get the files
      oXNListFileSectionChildren = aoXNodesFileSection[i].childNodes;

      for (var j=0; j < oXNListFileSectionChildren.length; j++)
      {
        aFileComponent = jXMLGetAttribute(oXNListFileSectionChildren.item(j), "VALUE").split(",");
        strDiskTAG = aFileComponent[0].replace(/\s*/g,"");

        bFoundDiskTAG = false;
        k=0;

        while ( k < asDiskTAGs.length && ! bFoundDiskTAG )
        {
          if ( (new RegExp("^" + jHelpStrPrepRegExp(strDiskTAG) + "$", "i")).test(asDiskTAGs[k]) )
          {
            bFoundDiskTAG = true;
          }
          k++;
        }

        if ( ! bFoundDiskTAG )
        {
          asDiskTAGs.push(strDiskTAG);
        }
      }      
    }

    return (asDiskTAGs);
  }


  function jTMCleanTxtmodeData(oXNodeParent, asTxtsetupTAGs, asDiskTAGs)
  {
    var oXNodeCurrentSection = null, oXNodeCurrentKeyVal = null, oXNodeTemp = null;
    var strTxtsetupTAGs, strDiskTAGs, strCurrentSectionName, strCurrentKey, strDiskComponent, strCurrentFileExt;
    var reTxtsetupTAGs, reDiskTAGs, reSectionsToKeep, reSectionDisks, reDefaults, reSectionSCSI, reSectionFilesSCSI, reFileExtToRemove;

    // validate provided data
    if ( oXNodeParent == null || asTxtsetupTAGs == null || asTxtsetupTAGs.constructor != Array || asDiskTAGs == null || asDiskTAGs.constructor != Array)
    {
      return (false);
    }

    for (var i = 0; i < asTxtsetupTAGs.length; i++)
    {
      asTxtsetupTAGs[i] = jHelpStrPrepRegExp(asTxtsetupTAGs[i]);
    }

    strTxtsetupTAGs = "(" + asTxtsetupTAGs.join("|") + ")" ;

    for (var i = 0; i < asDiskTAGs.length; i++)
    {
      asDiskTAGs[i] = jHelpStrPrepRegExp(asDiskTAGs[i]);
    }

    strDiskTAGs = "(" + asDiskTAGs.join("|") + ")" ;


    reTxtsetupTAGs = new RegExp("^" + strTxtsetupTAGs + "$", "i");
    reDiskTAGs = new RegExp("^" + strDiskTAGs + "$", "i");
    reSectionsToKeep = new RegExp("^(disks|defaults|scsi|config\..*|((files|hardwareids)\.scsi\.)" + strTxtsetupTAGs + ")$", "i");
    reSectionDisks = new RegExp("^disks$", "i");
    reSectionDefaults = new RegExp("^defaults$", "i");
    reSectionSCSI = new RegExp("^scsi$", "i");
    reSectionFilesSCSI = new RegExp("^files\.scsi\." + strTxtsetupTAGs + "$", "i");
    reFileExtToRemove = new RegExp("^(exe|dll)$","i");

    oXNodeCurrentSection = oXNodeParent.firstChild;

    while ( oXNodeCurrentSection != null )
    {
      strCurrentSectionName = oXNodeCurrentSection.getAttribute("NAME");

      if ( ! reSectionsToKeep.test(strCurrentSectionName) )
      {
        oXNodeTemp = oXNodeCurrentSection.nextSibling;
        oXNodeParent.removeChild(oXNodeCurrentSection);
        oXNodeCurrentSection = oXNodeTemp;
      }

      // Clean up [disks] section remove all unneeded strings
      else if ( reSectionDisks.test(strCurrentSectionName) )
      { 
        oXNodeCurrentKeyVal = oXNodeCurrentSection.firstChild;
        while ( oXNodeCurrentKeyVal != null )
        {
          strCurrentKey = oXNodeCurrentKeyVal.getAttribute("KEY");
          if ( ! reDiskTAGs.test(strCurrentKey) )
          {
            oXNodeTemp = oXNodeCurrentKeyVal.nextSibling;
            oXNodeCurrentSection.removeChild(oXNodeCurrentKeyVal);
            oXNodeCurrentKeyVal = oXNodeTemp;
          }
          else
          {
            // Fix path to be only \
            strDiskComponent = oXNodeCurrentKeyVal.getAttribute("VALUE").replace(/[^,]*$/, " \\");
            oXNodeCurrentKeyVal.setAttribute("VALUE", strDiskComponent);

            oXNodeCurrentKeyVal = oXNodeCurrentKeyVal.nextSibling;
          }
        }
      }

      // Clean up [defaults] section fix defaults string
      else if ( reSectionDefaults.test(strCurrentSectionName) )
      { 
        if ( asTxtsetupTAGs.length > 0 )
        {
          oXNodeCurrentKeyVal = oXNodeCurrentSection.firstChild;
          while ( oXNodeCurrentKeyVal != null )
          {
            strCurrentKey = oXNodeCurrentKeyVal.getAttribute("KEY");
            if ( reSectionSCSI.test(strCurrentKey) )
            {
              oXNodeCurrentKeyVal.setAttribute("VALUE", asTxtsetupTAGs[0]);
            }

            oXNodeCurrentKeyVal = oXNodeCurrentKeyVal.nextSibling;
          }
        }
      }

      // Clean up [scsi] section remove all unneeded strings
      else if ( reSectionSCSI.test(strCurrentSectionName) )
      { 
        oXNodeCurrentKeyVal = oXNodeCurrentSection.firstChild;
        while ( oXNodeCurrentKeyVal != null )
        {
          strCurrentKey = oXNodeCurrentKeyVal.getAttribute("KEY");
          if ( ! reTxtsetupTAGs.test(strCurrentKey) )
          {
            oXNodeTemp = oXNodeCurrentKeyVal.nextSibling;
            oXNodeCurrentSection.removeChild(oXNodeCurrentKeyVal);
            oXNodeCurrentKeyVal = oXNodeTemp;
          }
          else
          {
            oXNodeCurrentKeyVal = oXNodeCurrentKeyVal.nextSibling;
          }
        }
      }

      // Remove all files that will not copy/load in text mode from file lists (exes, dlls, etc) - these files must be placed in the $$ dir to be copied into system32 folder
      else if ( reSectionFilesSCSI.test(strCurrentSectionName) )
      {
        oXNodeCurrentKeyVal = oXNodeCurrentSection.firstChild;

        while ( oXNodeCurrentKeyVal != null )
        {
          strCurrentFileExt = oXNodeCurrentKeyVal.getAttribute("VALUE");
          strCurrentFileExt = strCurrentFileExt.replace(/^[^,]*,/,"").replace(/,[^,]*$/,"").replace(/\s*/g,"").replace(/^[^\.]*\./,"");
          if ( reFileExtToRemove.test(strCurrentFileExt) )
          {
            oXNodeTemp = oXNodeCurrentKeyVal.nextSibling;
            oXNodeCurrentSection.removeChild(oXNodeCurrentKeyVal);
            oXNodeCurrentKeyVal = oXNodeTemp;
          }
          else
          {
            oXNodeCurrentKeyVal = oXNodeCurrentKeyVal.nextSibling;
          }
        }
      }

      if ( reSectionsToKeep.test(strCurrentSectionName) )
      {
        oXNodeCurrentSection = oXNodeCurrentSection.nextSibling;
      }
    }
  }

  function jTMCopyFiles(asFileList, strSourceBase, strDestinationBase)
  {
    var reFilesForSystem32 = /\.(exe|dll)$/;
    var asOSAFFileList = new Array("txtsetup.oem");

    if ( asFileList == null || asFileList.constructor != Array || strSourceBase == null || strDestinationBase == null )
    {
      return (null);
    }

    for ( var i = 0; i < asFileList.length; i++ )
    {
      if ( reFilesForSystem32.test(asFileList[i]) )
      {
        jFileRCopy(strSourceBase + "\\" + asFileList[i], strDestinationBase + "\\$$", true);
      }
      else
      {
        jFileRCopy(strSourceBase + "\\" + asFileList[i], strDestinationBase + "\\textmode", true);
        asOSAFFileList.push(asFileList[i].replace(/^\s*[^\\]*\s*\\/,""));
      }

    }

    return (asOSAFFileList); 
  }


  function jTMOSAFUpdate(oXD, asOSAFFileList, asOEMStrings)
  {
    var oXNodeOSAFMassStorageDrivers, oXNodeOSAFOEMBootFiles, oXNodeTemp;

    if ( oXD == null || asOSAFFileList == null || asOSAFFileList.constructor != Array || asOEMStrings == null || asOEMStrings.constructor == Array )
    {
      if ( asOSAFFileList == 0 || asOEMStrings.length == 0 )
      {
        return (null);
      }
    }

    oXNodeOSAFMassStorageDrivers = oXD.selectSingleNode("//MASSSTORAGEDRIVERS");
    oXNodeOSAFOEMBootFiles = oXD.selectSingleNode("//OEMBOOTFILES");

    if ( oXNodeOSAFMassStorageDrivers != null && oXNodeOSAFOEMBootFiles != null )
    {
      for (var i = 0; i < asOSAFFileList.length; i++)
      {
        oXNodeTemp = oXD.createElement("ENTRY");
        oXNodeTemp.setAttribute("TEXTNODE", "true");
        oXNodeTemp.text = asOSAFFileList[i];
        oXNodeOSAFOEMBootFiles.appendChild(oXNodeTemp);
      }

      for (var i = 0; i < asOEMStrings.length; i++)
      {
        oXNodeTemp = oXD.createElement("ENTRY");
        oXNodeTemp.setAttribute("TEXTNODEONLY", "true");
        oXNodeTemp.text = asOEMStrings[i] + " = \"OEM\"";
        oXNodeOSAFMassStorageDrivers.appendChild(oXNodeTemp);
      }
    }
  }

  function jTMProcessOEMDiskDrivers(oXD, strComputerName)
  {
    var strBootControllerPNPID, strTextsetupPath, strTxtmodeFolder;
    var oXNode;
    var asControllerTAGs, asOEMTextStrings, asDiskTAGs, aFileList;

    if ( oXD == null )
    {
      return (null);
    }

    strOEMPath = jFileFixPath(jHelpReplaceVarsInStr(oXD, "__OEMPATH__"));
    strBootControllerPNPID = jTMGetBootControllerPNPID(strComputerName);
    strTextsetupPath = jTMFindControllerOEMTxtModeDriverPaths(strOEMPath + "\\$1\\drivers", strBootControllerPNPID);

    if ( strTextsetupPath != undefined && strTextsetupPath != null )
    {
      oXNode = oXD.selectSingleNode("//SCRATCH");  


      jINI2XMLAF(strTextsetupPath + "\\txtsetup.oem", oXNode);
      asControllerTAGs = jTMGetControllerTAGs(oXNode, new Array(strBootControllerPNPID));
      asOEMTextStrings = jTMGetOSAFOEMStrings(oXNode, asControllerTAGs);
      asDiskTAGs = jTMGetDiskTAGs(oXNode, asControllerTAGs);
      aFileList = jTMGetFileList(oXNode, asControllerTAGs);
          

      jTMCleanTxtmodeData(oXNode, asControllerTAGs, asDiskTAGs);
      oXNode.setAttribute("FILENAME", strOEMPath + "\\textmode\\txtsetup.oem");
      jFileDel(oXNode.getAttribute("FILENAME"), true);
      jXMLAF2INIFile(oXNode);

      aFileList = jTMCopyFiles(aFileList, strTextsetupPath, strOEMPath);

      jTMOSAFUpdate(oXD, aFileList, asOEMTextStrings);

      jXMLCleanNode(oXNode);
    }
    else
    {
      WScript.Echo("No OEM boot drivers found");
    }

  }

