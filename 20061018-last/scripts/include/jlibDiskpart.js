// Step 0. Init Drives (move all removables and move/clean? existing partitions out of the way)
//
// Step 1. Determine Best PArtitioning Spec and Pre-install Build DP Answer File
// Step 2. Partition Disks, Format Disks, and Build Base Directories
// Step 3. Build Post Install Drive letter Realignment DP Answer File
//          - build anser file(s)? Just build answer file
//          

// Questions:
//  - should we build a seperate FIX script? - No Win2000 won't support WSH 5.6 at the time it is needed (WSH 5.6 (IE 6.0) need drives mapped correctly to install)
//  - Should be able to create an answer file to fix as behaviour is predictable (as we have done in the past)
//  - Actually you cannot predict the volume layout as this depends on the order the drivers are loaded in which is not predictable or controlable
//  - Script complete - now need to figure out how to install WSH 5.6 in 2000 within cmdlines and work immediately after install

// Issues:
//  1.  jDpSetDriveLettersAF - does not support Windows 2003 and probably later - (have to remove the existing letter before assigning a new letter)

  // 


  /*\
   * 	Function:	jDPSetDriveLettersAF
   *	Build Date:	2006-03-01
   *    Written by:	Richard Campbell
   *
   *	Inputs:		strDPAFName - Diskpart answer file used to store the drive movements
                    aVolumes - array of Volume numbers
                    aLetters - array of Letters
                    bPartition - boolean used to determine if we are moving partitions or removable volumes
   *	Outputs:	
   *
   *	Description: Function used to create a Diskpart answer file to move partition or removable 
   *                 volumes (depending on the bPartition flag)
   *                 
   *                 NOTE: requires an aVolumes created with jDiskGetVolumeInfoDP as only diskpart 
   *                 generated info can sync Volume numbers
   *
   *
   *    Called Functions:  
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jDPSetDriveLettersAF(strDPAFName, aVolumes, aLetters, bPartition)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var oDP = oFS.CreateTextFile(strDPAFName);
    var j = 0;


    for (var i = 0; i < aVolumes.length; i++)
    {
      if ( ( ! /partition/i.test(aVolumes[i]["type"]) && ( ! bPartition) ) ||
           ( /partition/i.test(aVolumes[i]["type"]) && (   bPartition) ) )
      {
        if ( j < aLetters.length )
        {
          oDP.WriteLine("select volume " + aVolumes[i]["number"]);
          oDP.WriteLine("remove all noerr");
          oDP.WriteLine("assign letter=" + aLetters[j].replace(":","") + " noerr");
          j++;
        }
        else
        {
          WScript.Echo("ERROR (jDPSetDriveLettersAF): Ran out of temporary assignable drives!!!");
          oDP.WriteLine("exit");
          oDP.Close();
          return (false);
        }
      }
    }
    oDP.WriteLine("exit");
    oDP.Close();
    return (true);
  }



  /*\
   * 	Function:	jDPMoveOutDrives
   *	Build Date:	2006-03-01
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXD - XML DOM containing variables
   *	Outputs:	
   *
   *	Description:	Prepare for partitioning and formating by moving drive letters for removable drives and disk partitions
   *
   *
   *    Called Functions:  jHelpReplaceVarsInStr, jDPSetDriveLettersAF, jDiskGetUnReservedLetters, 
   *                       jXMLGetSingleNodeValue, jShExec
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jDPMoveOutDrives(oXD)
  {
    var strArrayDelim = jXMLGetSingleNodeValue(oXD, "//VARIABLES/VARARRAYDELIM");
    var aRemovableLetters = jHelpReplaceVarsInStr(oXD, jXMLGetSingleNodeValue(oXD, "//REMOVABLELETTERS")).split(strArrayDelim);
    var aReservedLetters = jHelpReplaceVarsInStr(oXD, jXMLGetSingleNodeValue(oXD, "//RESERVEDLETTERS")).split(strArrayDelim);
    var aUnReservedLetters = jDiskGetUnReservedLetters(aReservedLetters);

    // Set the Diskpart tempfile filename (used within this procedure for gathering information or for drive letter alignment)
    var strTempDPFileName = jHelpReplaceVarsInStr(oXD, "__TEMP__\\dpdeterminespecs.txt");
    var aVolumes = jDiskGetVolumeInfoDP(strTempDPFileName);

    // Create Diskpart Answer File Drives 
    jDPSetDriveLettersAF(jHelpReplaceVarsInStr(oXD, "__DPMOREMDRV__"), aVolumes, aRemovableLetters, false);
    jDPSetDriveLettersAF(jHelpReplaceVarsInStr(oXD, "__DPMOPARTS__"), aVolumes, aUnReservedLetters, true);
    //jShExec("diskpart /s " + strTempDP);

  }


  /*\
   * 	Function:	jDPValidateAndBuildAF
   *	Build Date:	2006-03-01
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXD - XML DOM containing variables and partition specification
   *	Outputs:	
   *
   *	Description: Based on parition specification validate and create a pre-install dispart answer file and if needed
   *                 a format script
   *
   *
   *    Called Functions:  jHelpGetOSBuildNum, jHelpReplaceVarsInStr, jDiskGetLargestDrive, 
   *                       jDiskGetTotalSize, jXMLGetSingleNodeValue
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jDPValidateAndBuildAF(oXD)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var strTempDPFileName; 

    var aoDisksInfo;

    var oXNListPartSpec, oXNodeSize, oXNodeLetter;
    var iSize, iLargestDriveSize, lTotalSize, lTotalSpecSize, iSizeUndefinedParts
    var fMaxFillPercent;
    var aSpecLetters;

    var iCurrDiskNumber;
    var bOutOfDisks, bFillCurrentPartition;
    var strDiskPartAFName;
    var strPreDiskPartAF = "";
    var strPostDiskPartAF = "";
    var strFormatString = "";
    var fdAnswerFiles;  // File Descriptor for answer files

    var strOSBuildNum = jHelpGetOSBuildNum();


    var reAllocSize = /^(512|1024|2048|4096|8192|16K|32K|64K)$/i;
    var reFileSystem = /^(FAT|FAT32|NTFS)$/i;



    if ( oXD == null )
    {
      return (false);
    }


    //SET FILENAMES

    // Get the Diskpart answerfile filename
    oXNodeDiskPartAF = oXD.selectSingleNode("//PARTITIONSPEC/DISKPARTANSWERFILE");

    if ( oXNodeDiskPartAF != null )
    {
      strDiskPartAFName = jHelpReplaceVarsInStr(oXD, oXNodeDiskPartAF.text);
    }
    else
    {
      strDiskPartAFName = jHelpReplaceVarsInStr(oXD, "__TEMP__\\diskpartaf.txt");
    }

    // Set the Diskpart tempfile filename (used within this procedure for gathering information or for drive letter alignment)
    strTempDPFileName = jHelpReplaceVarsInStr(oXD, "__TEMP__\\dpdeterminespecs.txt");

//Dummied
//    strTempDPFileName = "diskpartoutput.txt";


    // Set formate temp file (if needed)
    if (  strOSBuildNum < 5834  )
    {
      strDiskFormatSFName = strDiskPartAFName + ".format";
    }


 


    // DETERMINE DRIVE SPECIFICATIONS

    aoDisksInfo = jDiskGetDiskInfoDP(strTempDPFileName);

    if ( (aoDisksInfo == null) || ( aoDisksInfo.length < 1 ) )
    {
      WScript.Echo ("ERROR: No drives found in system!!!");
      return (false);      
    }

    iLargestDrive = jDiskGetLargestDrive(aoDisksInfo);

    lTotalSize = jDiskGetTotalSize(aoDisksInfo);

    lTotalSpecSize = 0;

    iSizeUndefinedParts = 0; // set number of partitions with size set to undefined



    // MAX Fill Percent is used to determine the maximum size a partition can be

    oXNodeMaxFillPercent = oXD.selectSingleNode("//PARTITIONSPEC/MAXFILLPERCENT");


    if ( oXNodeMaxFillPercent != null )
    {
      if ( /^[0-9]{1,2}(\.[0-9]+)?\%?$/.test(oXNodeMaxFillPercent.text) )
      {
        fMaxFillPercent = oXNodeMaxFillPercent.text.replace(/(\.|\%)/g, "") / 100;
      }
      else if ( /0?\.([0-9]+)?\%/.test(oXNodeMaxFillPercent.text) )
      {
        fMaxFillPercent = oXNodeMaxFillPercent.text;
      }
    }

    if ( fMaxFillPercent == null )
    {
      fMaxFillPercent = 0.80;
    }

    





    // VERIFY PARTITION SPECIFICATION
    oXNListPartSpec = oXD.selectNodes("//PARTITIONSPEC/PARTITION");

    strReservedLetters = jHelpReplaceVarsInStr(oXD, "__RESERVEDLETTERS__");
    aSpecLetters = new Array();

    // initial Disk info
    iCurrDiskNumber = 0;
    bOutOfDisks = false;

    for(var i = 0; i < oXNListPartSpec.length; i++)
    { 
      // initialize run    
      bFillCurrentPartition = false;

      // Get Parameters
      oXNodeSize = jXMLSelectSingleNode(oXNListPartSpec.item(i), "SIZE");
      oXNodeLetter = jXMLSelectSingleNode(oXNListPartSpec.item(i), "LETTER");
      oXNodeAllocationSize = jXMLSelectSingleNode(oXNListPartSpec.item(i), "ALLOCATIONSIZE");
      oXNodeFileSystem = jXMLSelectSingleNode(oXNListPartSpec.item(i), "FILESYSTEM");
      oXNodeLabel = jXMLSelectSingleNode(oXNListPartSpec.item(i), "LABEL");
      oXNListDirectories = jXMLSelectNodes(oXNListPartSpec.item(i),"DIR");

      
      // Validate Size

      if ( (oXNodeSize == null) || ! /(\d+)|\*/.test(oXNodeSize.text) ) 
      {
        WScript.Echo ("ERROR: Invalid size " + oXNodeSize.text + " for Partition " + i + "!!!");
        return (false);
      }

      if ( /\*/.test(oXNodeSize.text) )
      {
        bFillCurrentPartition = true;    

        iSizeUndefinedParts++;   
      }
      else
      {
        // Validate that presently provided size will fit
        iSize = jDiskExpandSize(oXNodeSize.text, jXMLGetAttribute(oXNodeSize, "UNIT"));      
        
        // Verify that the current partition size is not bigger than largest partition
        if ( iSize > iLargestDrive["size"] ) 
        {
          WScript.Echo ("ERROR: Size specification " + iSize + " of Partition " + i + " is larger than largest drive in the system at " + iLargestDriveSize["size"] + " !!!");
          return (false);
        }

        // Fill the Current Drive with the Current Partition
        // If ( (current partition less than or equal to (the avail space * 2 - maxFill Percentage)) AND 
        //   (the avail Space after the new partition is created is less the drive size * ( 1 - maxFillPecentage) )   
        if ( (iSize <= (aoDisksInfo[iCurrDiskNumber]["free"] * (2 - fMaxFillPercent))) && 
             ( (aoDisksInfo[iCurrDiskNumber]["size"] * (1 - fMaxFillPercent)) >= (aoDisksInfo[iCurrDiskNumber]["free"] - iSize) ) )
        {
          bFillCurrentPartition = true;    
        }
        else
        {
          iStartNum = iCurrDiskNumber;
          bOutOfDisks = false;
          
          // See if we need to jump to the next disk
          while ( (iSize > aoDisksInfo[iCurrDiskNumber]["free"])&& ! bOutOfDisks )
          {
            if ( iCurrDiskNumber < (aoDisksInfo.length-1) )
              iCurrDiskNumber++; 
            else
              iCurrDiskNumber = 0;
            
            if ( iCurrDiskNumber == iStartNum )
              bOutOfDisks = true;
          }
        }
      }
      
      // See If anything flagged OutOfDisks
      if ( bOutOfDisks ) 
      {
        WScript.Echo ("ERROR: Partition Specification will not fit on present system! Ran out of space on disks!");
        return (false);
      }
     


      // Check Drive Letters

      if ( (oXNodeLetter == null) || ! /[a-z]/i.test(oXNodeLetter.text) ) 
      {
        WScript.Echo ("ERROR: Invalid " + oXNodeLetter.text + " letter for Partition " + i + "!!!");
        return (false);
      }


      if ( (new RegExp(oXNodeLetter.text, "i")).test(strReservedLetters) )
      {
        WScript.Echo ("ERROR: Partition " + i + "'s specified letter \"" + oXNodeLetter.text + "\" is reserved!!!");
        return (false);
      }


      // Verify that a letter is not used more than once
      for ( var j = 0; j < aSpecLetters.length; j++)
      {
        if ( oXNodeLetter.text == aSpecLetters[j] )
        {
          WScript.Echo ("ERROR: Partition " + i + "'s specified letter " + oXNodeLetter.text + " is the same letter as partition " + j + " with the letter " + aSpecLetters[j] + " !!!");
          return (false);
        }
      }


 

      // BUILD ANSWER FILES
      // Build Pre Install Diskpart answerfile
      strPreDiskPartAF += "select disk " + aoDisksInfo[iCurrDiskNumber]["number"] + "\n";
      
      // create partition
      if ( bFillCurrentPartition )
        strPreDiskPartAF += "create partition primary noerr\n";
      else
        strPreDiskPartAF += "create partition primary size=" + Math.round(iSize / CMEGA) + " noerr\n";
            
      // set drive letter
      strPreDiskPartAF += "assign letter=" + oXNodeLetter.text + "\n";
      
      // set partition active if first partition on disk
      if ( aoDisksInfo[iCurrDiskNumber]["size"] == aoDisksInfo[iCurrDiskNumber]["free"] )
        strPreDiskPartAF += "active\n";

      // if Build Version is 5384 or later format partition using Diskpart
      // Set Format Parameters (if Windows vista/Longhorn Beta2 then use diskpart to format the partition else use format)

      if ( strOSBuildNum >= 5834 )
        strFormatString += "format";
      else
        strFormatString += "format " + jHelpReplaceVarsInStr(oXD, oXNodeLetter.text);



      // Set Filesystem (if specified)
      if ( (oXNodeFileSystem != null) && ! reFileSystem.test(oXNodeFileSystem.text) )
      {
        if ( strOSBuildNum >= 5834 )
          strFormatString += " fs=" + oXNodeFileSystem.text;
        else
          strFormatString += " /fs:" + oXNodeFileSystem.text;
      }
      else
      {
        if ( strOSBuildNum >= 5834 )
          strFormatString += " fs=NTFS";
        else
          strFormatString += " /fs:NTFS";
      }

      // Set allocation size (if specified)
      if ( (oXNodeAllocationSize != null) && reAllocSize.test(oXNodeAllocationSize.text) )
      {
        if ( strOSBuildNum >= 5834 )
          strFormatString += " unit=" + oXNodeAllocationSize.text;
        else
          strFormatString += " /a:" + oXNodeAllocationSize.text;
      }
      

      // Set Label (if specified)
      if ( oXNodeLabel != null )
      {
        if ( strOSBuildNum >= 5834 )
          strFormatString += " label=\"" + jHelpReplaceVarsInStr(oXD, oXNodeLabel.text) + "\"";
        else
          strFormatString += " /v:\"" + jHelpReplaceVarsInStr(oXD, oXNodeLabel.text) + "\"";
      }


      if ( strOSBuildNum >= 5834 )
      {
        strFormatString += " quick noerr";
        strPreDiskPartAF += strFormatString;
      }
      else
      {
        strFormatString += " /q\n";
      }


      // Add in new partition info into the current partitions spec (required for post disk part AF gen)   
      oPartTemp = new Object();
      oPartTemp["otype"] = "partition";
      
      iPartitionIndex = jDiskGetLastPartition(aoDisksInfo[iCurrDiskNumber]["partitions"]);
      if ( iPartitionIndex == -1 )
        oPartTemp["number"] = 1;
      else
        oPartTemp["number"] = aoDisksInfo[iCurrDiskNumber]["partitions"][iPartitionIndex]["number"]+1;
        
      oPartTemp["index"] = parseInt(oPartTemp["number"]);

      if ( bFillCurrentPartition )
      else
        oPartTemp["size"] = iSize;

      oPartTemp["offset"] = aoDisksInfo[iCurrDiskNumber]["size"] - aoDisksInfo[iCurrDiskNumber]["free"];
      
      // First partition gets a 32KB offset due to partition table (32KB is assumed - This number can vary 
      // depending on Drive geometry so need to find better way to calc)
      if ( oPartTemp["number"] == 1 )
        oPartTemp["offset"] += 32 * CKILO;
        
      aoDisksInfo[iCurrDiskNumber]["partitions"].push(oPartTemp);



      // Update free space on present partition
      if ( bFillCurrentPartition )
      {
        aoDisksInfo[iCurrDiskNumber]["free"] = 0;

        if ( iCurrDiskNumber < (aoDisksInfo.length-1) )
          iCurrDiskNumber++; 
        else
          iCurrDiskNumber = 0;       
      }  
      else
      {
        aoDisksInfo[iCurrDiskNumber]["free"] = aoDisksInfo[iCurrDiskNumber]["size"] - iSize;
      }
      
      aSpecLetters.push(oXNodeLetter.text); 
    }

    // WRITE ANSWER FILES/SCRIPTS
    // Write pre-install Diskpart answerfile
    fdAnswerFiles = oFS.CreateTextFile(strDiskPartAFName, true);
    fdAnswerFiles.Write(strPreDiskPartAF);
    fdAnswerFiles.Close();  

WScript.Echo (strPreDiskPartAF);

    // Write Format Script
    if ( strOSBuildNum < 5834 )
    {
      fdAnswerFiles = oFS.CreateTextFile(strDiskFormatSFName, true);
      fdAnswerFiles.Write(strFormatString);
      fdAnswerFiles.Close();  

WScript.Echo (strFormatString);

    }

    WScript.Echo ("Validated Partition Specification.");
    strPreDiskPartAF += "exit\n";
   
    return (true);
  }


  /*\
   * 	Function:	jDPBuildDisks
   *	Build Date:	2006-08-0
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXD - XML DOM containing variables and partition specification
   *	Outputs:	
   *
   *	Description: Using the answer files created in jDPValidateAndBuildAF function and the directories defineded
   *                 in the partition specification - partition, format, and create directories
   *
   *
   *    Called Functions:  jHelpGetOSBuildNum, jHelpReplaceVarsInStr, jXMLSelectNodes 
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jDPBuildDisks(oXD)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var fdAnswerFiles;
    var strDiskFormatSFName, strDiskPartAF;
    
    var aoDisksInfo;
    var oXNListPartSpec, oXNListDirectories, oXNode;

    var strOSBuildNum = jHelpGetOSBuildNum();


    //SET FILENAMES

    // Get the Diskpart answerfile filename
    oXNodeDiskPartAF = oXD.selectSingleNode("//PARTITIONSPEC/DISKPARTANSWERFILE");

    if ( oXNodeDiskPartAF != null )
    {
      strDiskPartAFName = jHelpReplaceVarsInStr(oXD, oXNodeDiskPartAF.text);
    }
    else
    {
      strDiskPartAFName = jHelpReplaceVarsInStr(oXD, "__TEMP__\\diskpartaf.txt");
    }

    // Set formate temp file (if needed)
    if (  strOSBuildNum < 5834  )
    {
      strDiskFormatSFName = strDiskPartAFName + ".format";
    }


    // PARTITION AND FORMAT DRIVES
    jShExec("diskpart /s " + strDiskPartAFName);

    // If required format the drives(diskpart supports formating in at least build 5834 and latter)
    fdAnswerFiles = fso.OpenTextFile(strDiskFormatSFName, 1);
    
    while ( ! fdAnswerFiles.AtEndOfStream )
    {
      jShExec( fdAnswerFiles.ReadLine() );
    }



    // CREATE DIRECTORIES
    oXNListPartSpec = oXD.selectNodes("//PARTITIONSPEC/PARTITION");

    for(var i = 0; i < oXNListPartSpec.length; i++)
    {
      oXNListDirectories = jXMLSelectNodes(oXNListPartSpec.item(i),"DIR");

      for(var j = 0; j < oXNListDirectories.length; j++)
      {
        jMKDirs(new Array(jHelpReplaceVarsInStr(oXD, oXNListDirectories.item(j).text)));
      }
    }
  }

  function jDPBuildPostInstallSeedFile(oXD)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var strRemovableLetters;
    var aoDisksInfo;

    var fdAnswerFiles, fdLetterFiles;    
    
    // DETERMINE CURRENT DRIVE SPECIFICATIONS

    aoDisksInfo = jDiskGetDiskInfoDP(jHelpReplaceVarsInStr(oXD, "__TEMP__\\dpdeterminespecs.txt"));

    if ( (aoDisksInfo == null) || ( aoDisksInfo.length < 1 ) )
    {
      WScript.Echo ("ERROR: No drives found in system!!!");
      return (null);      
    }
    
    strRemovableLetters = jXMLGetSingleNodeValue("//PARTITIONSPEC/REMOVABLELETTERS");

    if ( (strRemovableLetters == null) || ! /^([c-z];)*[c-z]$/i.test(strRemovableLetters) )
    {
      strRemovableLetters = "r;s;t;u;v";
    }
        
    for (var i = 0; i < aoDisksInfo.length; i++)
    {
      if (aoDisksInfo[i]["partitions"].length > 0)
      {
        for (var j = 0; j < aoDisksInfo[i]["partitions"].length; j++)
        {
          if ( aoDisksInfo[i]["partitions"][j].Exists("letter") && (aoDisksInfo[i]["partitions"][j]["letter"] != null) )
          {
            // Create Letter File for current partition
            fdLetterFiles = oFS.CreateTextFile(aoDisksInfo[i]["partitions"][j]["letter"] + ":\\letter.txt", true);
            fdLetterFiles.WriteLine(aoDisksInfo[i]["partitions"][j]["letter"]);
            fdLetterFiles.Close();
          }
        }
      }
    }    
    return (strRemovableLetters);
  }
  
  function jDPPOSTFixPartitions(strRemovableLetters)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    
    var strCurrLine, strDiskpartScript, strLetter;
    var fdAnswerFiles, fdLetterFiles;
    var aoVolumes;
    
    var strDPTempFileName = "dpdeterminespecs.txt";
        
       
    if ( strRemovableLetters == null )
      strRemovableLetters = "r;s;t;v;u";
      
    // Get current volumes spec
    aoVolumes = jDiskGetVolumeInfoDP(strDPTempFileName);
    
    // Move Removable volumes (using seed file info)
    jDPSetDriveLettersAF(strDPTempFileName, aoVolumes, strRemovableLetters.split(";"), false);
    
//    jShExec("diskpart /s " + strDPTempFileName);

    // find unused letters
    aoVolumes = jDiskGetVolumeInfoDP(strDPTempFileName);
    
    asUnusedLetters = jDiskGetUnReservedLetters(jDiskGetLetters(aoVolumes, "partition|remov|rom", false));  

    // Move Partition volumes
    jDPSetDriveLettersAF(strDPTempFileName, aoVolumes, asUnusedLetters, true);

//    jShExec("diskpart /s " + strDPTempFileName);

    // Re Letter parts as specified in letter files
    aoVolumes = jDiskGetVolumeInfoDP(strDPTempFileName);
    
    for (var i = 0; i < aoVolumes.length; i++)
    {
      if ( /partition/i.test(aoVolumes[i]["type"]) && /^[c-z]$/i.test(aoVolumes[i]["letter"]) )
      {
        fdLetterFiles = oFS.OpenTextFile(aoVolumes[i]["letter"] + ":\\letter.txt", ForReading);
        strLetter = fdLetterFiles.ReadLine();
        fdLetterFiles.Close();
      //  fdLetterFiles = oFS.GetFile(aoVolumes[i]["letter"] + ":\\letter.txt");
      //  fdLetterFiles.Delete();
      
        if ( ! (new RegExp(strLetter,"i")).test(aoVolumes[i]["letter"]) )
        {
          strDiskpartScript += "select volume " + aoVolumes[i]["number"] + "\n";
          strDiskpartScript += "remove all noerr\n";
          strDiskpartScript += "assign letter=" + strLetter + " noerr\n");         
        }
      }
    }
    
    fdAnswerFiles = oFS.CreateTextFile(strDPTempFileName, true);
    fdAnswerFiles.Write(strDiskpartScript);
    fdAnswerFiles.Close();   
    
//    jShExec("diskpart /s " + strDPTempFileName);
    
  }
  
