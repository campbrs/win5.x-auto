NORMAL=0;        // Normal file. No attributes are set.
READONLY=1;      // Read-only file. Attribute is read/write.
HIDDEN=2;        // Hidden file. Attribute is read/write.
SYSTEM=4;        // System file. Attribute is read/write.
VOLUME=8;        // Disk drive volume label. Attribute is read-only.
DIRECTORY=16;    // Folder or directory. Attribute is read-only.
ARCHIVE=32;      // File has changed since last backup. Attribute is read/write.
ALIAS=64;        // Link or shortcut. Attribute is read-only.
COMPRESSED=128;  // Compressed file. Attribute is read-only.

ForReading=1;
ForWriting=2;
ForAppending=8;
TristateUseDefault = -2;
TristateTrue = -1;
TristateFalse = 0;


  /*\
   * 	Function:	jFileDir
   *	Build Date:	2005/05/01
   *      Written by:	Richard Campbell
   *
   *	Inputs:		path		 - String - Path to get directory of
   *	Outputs:	contents         - Array Object - List of all files and directories in the provided path
   *
   *	Description:	Provides a list of all files and directories in a path - Functions similar to ms-dos dir or unix ls commands
   *
   *	Version Info:	2.0.0	- 2005/05/01 - Fixed to check if path exists; return Array of strings instead of Array of objects
   *			1.0.0	- 2004/12    - original Version (named Dir) 
   *
  \*/

  function jFileDir(strPath) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var aWildcardFileList;
    var re_strSourceBaseName;

    var boolSrcIsWildcard = false;
    var strPath2Use;

    var contents = new Array();
    var colFiles;
    var colSubFolders;
    var strTemp;

    if ( strPath == null )
    {
//      WScript.Echo("ERROR(jFileDir): The provided path is null!!"); 
      return (null);
    }


    // initialize some variables
    strPathParent = oFS.GetParentFolderName(strPath);

    strPathBaseName = oFS.GetBaseName(strPath);

    re_strSourceBaseName = new RegExp("", "i");

    // determine if a wild card was used
    boolSrcIsWildcard = (/.*\*.*/.test(strPath) && oFS.FolderExists(strPathParent));

    // initialize the wildcard variables and determine if the Parent folder should be
    // used (i.e. when a wild card was provided). Or the actual provided path
    if ( boolSrcIsWildcard )
    {
      strPath2Use = strPathParent;
      strPathBaseName = strPath.split("\\").pop().replace(/\./g,"\\.").replace(/\*/g,".*");
      re_strSourceBaseName = new RegExp("^" + strPathBaseName, "i");
    }
    else
    {
      strPath2Use = strPath;
    }

    if ( oFS.FolderExists(strPath2Use) ) 
    {
      colFiles = new Enumerator(oFS.GetFolder(strPath2Use).Files);
      colSubFolders = new Enumerator(oFS.GetFolder(strPath2Use).SubFolders);

      for(;!colFiles.atEnd();colFiles.moveNext())
      {
        strTemp = "";
        strTemp += colFiles.item();
        if ( (boolSrcIsWildcard && re_strSourceBaseName.test(strTemp.split("\\").pop())) || ! boolSrcIsWildcard )
          contents.push(strTemp);
      }

      for(;!colSubFolders.atEnd();colSubFolders.moveNext()) 
      {
        strTemp = "";
        strTemp += colSubFolders.item();
        if ( (boolSrcIsWildcard && re_strSourceBaseName.test(strTemp.split("\\").pop())) || ! boolSrcIsWildcard )
          contents.push(strTemp);
      }

      return (contents);
    }
    return (null);
  }

  /*\
   *  Function:		jFileMKDirs
   *  Version:		0.1
   *  Date:		11/04/2004
   *  
   *  Input:		String Array of paths to create
   *  Output: 
   *  
   *  Description:	Creates that last directory in a provided path (path needs to 
   *                    include drive letters).  Currently does not include recursion 
   *                    to create beyond the last directory in the path.
   *     
  \*/

  function jFileMKDirs(aDIR) {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    if ( aDIR != null )
    { 
      for (var i = 0; i < aDIR.length; i++) 
      {
        if ( ! oFS.FolderExists(aDIR[i]) ) 
        {
         oFS.CreateFolder(aDIR[i]);
        }
      }
    }
  }

  /*\
   *  Function:		jFileRMDir
   *  Version:		0.1
   *  Date:		9/01/2005
   *  
   *  Input:		strFolderName - Folder Name to delete
   *                    boolForce - true = delete folder even if read only; false = don't delete if read only
   *  Output: 
   *  
   *  Description:	Deletes the provided folder and all files/folders included
   *     
  \*/

  function jFileRMDir(strFolderName, boolForce) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    if ((strFolderName != null) && oFS.FolderExists(strFolderName) )
      oFS.DeleteFolder(strFolderName, boolForce);
  }

  /*\
   *  Function:		jFileDel
   *  Version:		0.1
   *  Date:		9/01/2005
   *  
   *  Input:		strFileName - Folder Name to delete
   *                    boolForce - true = delete file even if read only; false = don't delete if read only
   *  Output: 
   *  
   *  Description:	Deletes the provided file
   *     
  \*/

  function jFileDel (strFileName, boolForce) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    if ( (strFileName != null) && oFS.FileExists(strFileName) )
      oFS.DeleteFile(strFileName, boolForce);
  }

  /*\
   *  Function:		jFileCleanDir
   *  Version:		0.1
   *  Date:		9/01/2005
   *  
   *  Input:		strFolderName - Folder Name to delete
   *                    boolForce - true = delete files/folders even if read only; false = don't delete if read only files/folders
   *  Output: 
   *  
   *  Description:	Deletes all files and folders in the provided folder
   *     
  \*/

  function jFileCleanDir(strFolderName, boolForce) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    if ( (strFolderName != null) && oFS.FolderExists(strFolderName) )
    {
      // Delete all files in the folder
      oFS.DeleteFile(strFolderName + "\\*", boolForce);

      // Delete all folders in the folder
      oFS.DeleteFolder(strFolderName + "\\*", boolForce);
    }
  }


  /*\
   *  Function:		jFileRCopy
   *  Version:		0.1
   *  Date:		9/01/2005
   *  
   *  Input:		strSource - Source File, Folder, or wildcard
   *                    strDestination -  Destination Folder
   *                    bOverwrite - true = overwrite files in destination; false = don't overwrite files in destination
   *  Output: 
   *  
   *  Description:	Copys the provided File, Folder, or Wildcard to the provided destination
   *     
  \*/

  function jFileRCopy(strSource, strDestination, bOverwrite) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var strSourceParent, strDestinationParent, strSourceBaseName;
    var aWildcardFileList;
    var reSrcPath;

    var boolSrcIsWildcard = false;
    var boolSrcIsFolder = false;
    var boolSrcIsFile = false;
    var boolDstIsFolder = false;
    var boolDstIsFile = false;

    // ERROR HANDLEING SECTION


    // Handle Error Type 0001 - Check to see if parameters are valid
    if ( (strSource == null) || (strDestination == null) )
    {
//      WScript.Echo("ERROR(jRCopy:001): Passed parameters are invalid!!");
      return (1);
    }


    strSourceParent = jFileFixPath(oFS.GetParentFolderName(strSource));
    strSourceBaseName = strSource.split("\\").pop().replace("*","");
    strDestinationParent = jFileFixPath(oFS.GetParentFolderName(strDestination));
    reSrcPath = new RegExp("^" + jHelpStrPrepRegExp(strSource));

    boolSrcIsWildcard = (/\*/.test(strSource) && oFS.FolderExists(strSourceParent));
    if ( ! boolSrcIsWildcard )
    {
      boolSrcIsFolder = oFS.FolderExists(strSource);
      boolSrcIsFile = oFS.FileExists(strSource);

    }

    boolDstIsExistingFolder = oFS.FolderExists(strDestination);
    boolDstIsExistingFile = oFS.FileExists(strDestination);


    // Handle Error Type 0101 - If Source is unknown return false
    if ( ! (boolSrcIsWildcard || boolSrcIsFolder || boolSrcIsFile) )
    {
//      WScript.Echo("ERROR(jRCopy:0101): Source \"" + strSource + "\" is of unknown type or does not exist!!!");
      return (101);
    }

    // Handle Error Type 0102 - Destination = Parent of Source
    if ( ( boolSrcIsFile || boolSrcIsFolder ) && (strDestination == strSource) )
    {
//      WScript.Echo("ERROR(jRCopy:0102): Source is same as destination!  Cannot copy onto itself!!");
      return (102);
    }

    // Handle Error Type 0103 - Destination = Parent of Source
    if ( ( boolSrcIsFile || boolSrcIsWildcard ) && (strDestination == strSourceParent) )
    {
//      WScript.Echo("ERROR(jRCopy:0103): Source Parent Folder is same as destination!  Cannot copy onto itself!!");
      return (103);
    }

    // Handle Error Type 0104 - Destination Folder is subset of Source Folder
    if ( boolSrcIsFolder && reSrcPath.test(strDestination) )
    {
//      WScript.Echo("ERROR(jRCopy:0104): Source Folder is a subset of the destination!!!");
      return (104);
    }

    // Handle Error Type 0105 - Source is Wildcard or Folder and Destination is a file
    if ( ( boolSrcIsFolder || boolSrcIsWildcard ) && oFS.FileExists(strDestination) )
    {
//      WScript.Echo("ERROR(jRCopy:0105): Source is a wildcard or folder - Cannot copy to a file!!");
      return (105);
    }


    // If destination is folder and missing trailing \ add the trailing \
    if ( boolDstIsExistingFolder && ! /\\\s*$/.test(strDestination) )
    {
      strDestination += "\\";   
    }


    // if overwrite set all destination files/folders to not be Read Only or Hidden
    if ( bOverwrite )
      jFileSetAttribute(strDestination, READONLY + HIDDEN, false, true);


    // Copy the Source to the Destination

    // Create the parent Destination folder if it does not exist
    if (! oFS.FolderExists(strDestinationParent) )
      jFileMKDirs(Array(strDestinationParent));

    // if the Source is a file
    if ( boolSrcIsFile )
    {
      // Copy the file
      oFS.CopyFile(strSource, strDestination, bOverwrite);
    }
    else if ( boolSrcIsFolder )
    {
      // Copy the folder
      oFS.CopyFolder(strSource, strDestination, bOverwrite);
    }
    else if ( boolSrcIsWildcard )
    {
      aWildcardFileList = jFileDir(strSourceParent);      

      if ( aWildcardFileList != null )
      {
        for (var i = 0; i < aWildcardFileList.length; i++)
        {
          // if file copy file
          if ( oFS.FileExists(aWildcardFileList[i]) )
          {
            oFS.CopyFile(aWildcardFileList[i], strDestination, bOverwrite);      
          }
          // if folder copy folder
          else if ( oFS.FolderExists(aWildcardFileList[i]) )
          {
            oFS.CopyFolder(aWildcardFileList[i], strDestination, bOverwrite);      
          }
        }
      }
    }

    // Return Success
    return(0);
  }

  

  /*\
   *  Function:		jFileRMove
   *  Version:		0.1
   *  Date:		9/01/2005
   *  
   *  Input:		strSource - Source File, Folder, or wildcard
   *                    strDestination -  Destination Folder
   *                    bOverwrite - true = overwrite files in destination; false = don't overwrite files in destination
   *  Output: 
   *  
   *  Description:	Moves the provided File, Folder, or Wildcard to the provided destination
   *     
  \*/

  function jFileRMove(strSource, strDestination, bOverwrite) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var strSourceParent, strDestinationParent, strSourceBaseName;
    var aWildcardFileList;
    var reSrcPath;

    var boolSrcIsWildcard = false;
    var boolSrcIsFolder = false;
    var boolSrcIsFile = false;
    var boolDstIsFolder = false;
    var boolDstIsFile = false;

    // ERROR HANDLEING SECTION

    // Handle Error Type 0001 - Check to see if parameters are valid
    if ( (strSource == null) || (strDestination == null) )
    {
//      WScript.Echo("ERROR(jRMove:001): Passed parameters are invalid!!");
      return (1);
    }

    strSourceParent = jFileFixPath(oFS.GetParentFolderName(strSource));
    strSourceBaseName = strSource.split("\\").pop().replace("*","");
    strDestinationParent = jFileFixPath(oFS.GetParentFolderName(strDestination));
    reSrcPath = new RegExp("^" + jHelpStrPrepRegExp(strSource));

    boolSrcIsWildcard = (/\*/.test(strSource) && oFS.FolderExists(strSourceParent));
    if ( ! boolSrcIsWildcard )
    {
      boolSrcIsFolder = oFS.FolderExists(strSource);
      boolSrcIsFile = oFS.FileExists(strSource);
    }

    boolDstIsExistingFolder = oFS.FolderExists(strDestination);
    boolDstIsExistingFile = oFS.FileExists(strDestination);

    // Handle Error Type 0101 - If Source is unknown return false
    if ( ! (boolSrcIsWildcard || boolSrcIsFolder || boolSrcIsFile) )
    {
//      WScript.Echo("ERROR(jRMove:0101): Source \"" + strSource + "\" is of unknown type or does not exist!!!");
      return (101);
    }

    // Handle Error Type 0102 - Destination = Parent of Source
    if ( ( boolSrcIsFile || boolSrcIsFolder ) && (strDestination == strSource) )
    {
//      WScript.Echo("ERROR(jRMove:0102): Source is same as destination!  Cannot move onto itself!!");
      return (102);
    }

    // Handle Error Type 0103 - Destination = Parent of Source
    if ( ( boolSrcIsFile || boolSrcIsWildcard ) && (strDestination == strSourceParent) )
    {
//      WScript.Echo("ERROR(jRMove:0103): Source Parent Folder is same as destination!  Cannot move onto itself!!");
      return (103);
    }

    // Handle Error Type 0104 - Destination Folder is subset of Source Folder
    if ( boolSrcIsFolder && reSrcPath.test(strDestination) )
    {
//      WScript.Echo("ERROR(jRMove:0104): Source Folder is a subset of the destination!!!");
      return (104);
    }

    // Handle Error Type 0105 - Source is Wildcard or Folder and Destination is a file
    if ( ( boolSrcIsFolder || boolSrcIsWildcard ) && oFS.FileExists(strDestination) )
    {
//      WScript.Echo("ERROR(jRMove:0105): Source is a wildcard or folder - Cannot move to a file!!");
      return (105);
    }


    // if overwrite set all destination files/folders to not be Read Only or Hidden
    if ( bOverwrite )
      jFileSetAttribute(strDestination, READONLY + HIDDEN, false, true);


    // Move the Source to the Destination

    // Create the parent Destination folder if it does not exist
    if (! oFS.FolderExists(strDestinationParent) )
      jFileMKDirs(Array(strDestinationParent));

    // if the Source is a file
    if ( boolSrcIsFile )
    {
      // Move the file
      oFS.CopyFile(strSource, strDestination, bOverwrite);
      oFS.DeleteFile(strSource, true);
    }
    else if ( boolSrcIsFolder )
    {
      // Move the folder
      oFS.CopyFolder(strSource, strDestination, bOverwrite);
      oFS.DeleteFolder(strSource, true);
    }

    // if source is a wildcard
    else if ( boolSrcIsWildcard )
    {
      aWildcardFileList = jFileDir(strSourceParent);      

      if ( aWildcardFileList != null )
      {
        for (var i = 0; i < aWildcardFileList.length; i++)
        {
          // if file move file
          if ( oFS.FileExists(aWildcardFileList[i]) )
          {
            oFS.CopyFile(aWildcardFileList[i], strDestination, bOverwrite);
            oFS.DeleteFile(aWildcardFileList[i], true);
          }
          // if folder move folder
          else if ( oFS.FolderExists(aWildcardFileList[i]) )
          {
            oFS.CopyFolder(aWildcardFileList[i], strDestination, bOverwrite);      
            oFS.DeleteFolder(aWildcardFileList[i], true);
          }
        }
      }
    }

    // Return Success
    return(0);
  }



  /*\
   *    Function:     jFileUnRAR
   *    Build Date:   2005/09/03
   *    Written by:   Richard Campbell
   *
   *    Inputs:       strSource - Source File
   *                  strDestination - Destination path
   *    Outputs:
   *
   *    Description:  Uses UNIX Utils unrar.exe to unrar the source RAR file into destination path
   *
   *	Version Info: 1.1.1   2005/09/03  Moved to jlibfile Library and defined all vars locally
   *                  1.1.0   2005/05/07  Commented original code
   *                  1.0.0   2004/11/??  Developed in jscript used to hardcode DHCP network config into Static network config
   *
  \*/

  function jFileUnRAR(strSource, strDestination) {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    if ( oFS.FileExists(strSource) ) 
    {
      jShExec("cmd /c start /wait /min unrar x " + strSource + " " + strDestination);
    }
  }

  /*\
   *    Function:	jFileXCopy
   *    Build Date:	2005/05
   *    Written by:	Richard Campbell
   *
   *	Inputs:		strSource - source file (with complete path) or directory
   *                    strDestination - destination directory
   *	Outputs:
   *
   *	Description:    Uses the Windows xcopy command to copy files from the provided source to
   *                    the provided destination
   *
   *	Version Info:	1.1.1   - 2005/09/04 - migrated to jlibfile and moved all vars to local
   *                    1.1.0	- 2005/05/07 - Commented original code
   *			1.0.0	- 2004/11/?? - developed in jscript used to hardcode DHCP network
   *                                           config into Static network config
   *
  \*/

  function jFileXCopy(strSource, strDestination)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    if ( oFS.FileExists(strSource) || oFS.FolderExists(strSource) ) 
    {
       jShExec("xcopy /e /i /q /h /r /y " + strSource + " " + strDestination);
    }
  }

  /*\
   *    Function:	jFileXCopyUnRAR
   *    Build Date:	2005/05
   *    Written by:	Richard Campbell
   *
   *	Inputs:		strSource - source file (with complete path) or directory
   *                    strDestination - destination directory
   *	Outputs:
   *
   *	Description:	Checks to see if the file is a RAR file if so unrar it to the new location, if not xcopy the files into the new location
   *
   *	Version Info:	1.1.1   - 2005/09/04 - migrated to jlibfile and moved all vars to local
   *	                1.1.0	- 2005/05/07 - Commented original code
   *			1.0.0	- 2004/11/?? - developed in jscript used to hardcode DHCP network config into Static network config
   *
  \*/

  function jFileXCopyUnRAR(strSource, strDestination)
  {
    // if a RAR file unrar
    if ( /\.rar$/.test(strSource) )
    {
      jUnRAR(strSource, strDestination);
    } 
    else if ( fso.FileExists(strSource + ".rar") ) 
    {
      jFileUnRAR(strSource + ".rar", strDestination);
    } 
    else 
    {
      jFileXCopy(strSource, strDestination);
    }
  }

  /*\
   *    Function:	jFileRCopyUnRAR
   *    Build Date:	2005/05
   *    Written by:	Richard Campbell
   *
   *	Inputs:		strSource - source file (with complete path) or directory
   *                    strDestination - destination directory
   *	Outputs:
   *
   *	Description:	Checks to see if the file is a RAR file if so unrar it to the new location, if not xcopy the files into the new location
   *
   *	Version Info:	1.1.1   - 2005/09/04 - migrated to jlibfile and moved all vars to local
   *	                1.1.0	- 2005/05/07 - Commented original code
   *			1.0.0	- 2004/11/?? - developed in jscript used to hardcode DHCP network config into Static network config
   *
  \*/

  function jFileRCopyUnRAR(strSource, strDestination)
  {
    // if a RAR file unrar
    if ( /\.rar$/.test(strSource) )
    {
      jFileUnRAR(strSource, strDestination);
    } 
    else if ( fso.FileExists(strSource + ".rar") ) 
    {
      jFileUnRAR(strSource + ".rar", strDestination);
    } 
    else 
    {
      jFileRCopy(strSource, strDestination, true);
    }
  }

  /*\
   *  Function:		jFileFixPath
   *  Version:		0.1
   *  Date:		2005/09/10
   *  
   *  Input:		strInPath
   *                    
   *  Output:           a Hopefully fixed script path
   *  
   *  Description:      Validates a path and if not valid attempts to fix
   *     
  \*/

  function jFileFixPath(strInPath) 
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var strScriptPath = WScript.ScriptFullName.split("\\").slice(0,-1).join("\\");
    var strFixedPath = strInPath;

    // if path is not defined, null, or empty make it the path of the parent script
    if ( (typeof(strInPath) == undefined) || (strInPath == null) || (strInPath == "") )
    {
      strFixedPath = strScriptPath;
    }

    // if path is not absolute make it so based on the path of the parent script
    if ( ! /^([a-zA-Z]\:)/.test(strInPath) )
    {
      strFixedPath = strScriptPath + "\\" + strInPath;
    }

    //Fix .. refernces
    while ( /\.\./.test(strFixedPath) )
    {
      strFixedPath = strFixedPath.replace(/[^\\]*\\\.\./, "");
    }
    strFixedPath = strFixedPath.replace(/\\\\/, "\\");


    // anything else return what was passed
    return (strFixedPath);
  }


  /*\
   *  Function:		jFileFind
   *  Version:		0.1
   *  Date:		2005/11/21
   *  
   *  Input:		strSearchPath, strSearchString
   *                    
   *  Output:           array of found files and/or directories
   *  
   *  Description:      Searchs for a matching filename or directory name in the provided directory and 
   *                    returns an array of all files found with the search string
   *     
  \*/

  function jFileFind (strSearchPath, strSearchString)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var reSearch = new RegExp(strSearchString,"i");

    var aDirContents = jFileDir(strSearchPath);
    var aFoundItems = new Array();
    var aTemp;

    if (aDirContents != null )
    {
      for (var i = 0; i < aDirContents.length; i++)
      {

        // if String found the save location
        if ( reSearch.test(aDirContents[i].split("\\").pop()) )
        {
          aFoundItems = aFoundItems.concat(aDirContents[i]);
        }

        // If Item is a folder then traverse
        if ( oFS.FolderExists(aDirContents[i]) )
        {

          aTemp = jFileFind(aDirContents[i], strSearchString);
          if ( aTemp.length > 0 )
          {
            aFoundItems = aFoundItems.concat(aTemp);
          }
        }
      }
    }

    return (aFoundItems.sort()); 
  }


  /*\
   *    Function:	jFileUADiff
   *    Build Date:	2005/12
   *    Written by:	Richard Campbell
   *
   *	Inputs:		strFileName1 - File to Compare
   *                    strFileName2 - File to Compare
   *	Outputs:
   *
   *	Description:    Uses the Unix Tools diff command to compare to ASCII files against one another and 
   *                    returns a two lists of differences (1 list of differences 
   *    
   *
   *	Version Info:	1.0.0	- 2005/12/20 - Developed to assist with Log file parsing
   *                                           
  \*/

  function jFileUADiff(strFileName1, strFileName2)
  {
    var oWinCmd = new ActiveXObject("WScript.Shell");
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var oExec;
    var strTemp;
    var strDiff1FileName = strFileName1 + ".diff";
    var strDiff2FileName = strFileName2 + ".diff";
    var fDiff1, fDiff2;
    var regexFile1 = /^>\s/;
    var regexFile2 = /^<\s/;

    // Write the Differences File
    if ( ! oFS.FolderExists(strDiff1FileName) && ! oFS.FolderExists(strDiff2FileName) ) 
    {
      jFileDel(strDiff1FileName, true);
      jFileDel(strDiff2FileName, true);

      fDiff1 = oFS.CreateTextFile(strDiff1FileName, true);
      fDiff2 = oFS.CreateTextFile(strDiff2FileName, true);

      try
      {
        oExec = oWinCmd.Exec("diff -a " + strFileName1 + " " + strFileName2);
        while (oExec.Status == 0)
        {
          while ( ! oExec.StdOut.AtEndOfStream )
          {
            strTemp = oExec.StdOut.ReadLine();

            if ( regexFile1.test(strTemp) )
            {
              fDiff1.WriteLine(strTemp.replace(regexFile1, ""));
            }
            else if ( regexFile2.test(strTemp) )
            {
              fDiff2.WriteLine(strTemp.replace(regexFile2, ""));
            }
          }

          WScript.Sleep(10);
        }
      }
      catch (strException)
      {
        WScript.Echo ("ERROR: External System Command (" + command + ") Failed to Execute!!");
        WScript.Echo ("Exception Generated: " + strException);
      }

      fDiff1.close();
      fDiff2.close();
    }
    else
    {
      return null;  
    }
  }


  /*\
   *    Function:	jFileTouch
   *    Build Date:	2005/12
   *    Written by:	Richard Campbell
   *
   *	Inputs:		strFileName
   *	Outputs:
   *
   *	Description:    Creates a Zero byte file with the provided filename as long as the file or folder does not already exist
   *
   *	Version Info:	1.0.0	- 2005/12/20 - original version
   *
  \*/

  function jFileTouch(strFileName)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var fOne;

    if ( ! oFS.FileExists(strFileName) && ! oFS.FolderExists(strFileName) ) 
    {
      fOne = oFS.CreateTextFile(strFileName, true);
      fOne.close();
    }
  }


  function jFileSetAttribute(strPath, cAttribute, bEnable, bRecursive)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var fHandle;

    var aFileList;
    var rePath, strPathParent;

    var bPathIsWildcard = false;
    var bPathIsFolder = false;
    var bPathIsFile = false;

    // ERROR HANDLEING SECTION

    // Handle Error Type 0001 - Check to see if parameters are valid
    if ( (strPath == null) || (cAttribute == null) )
    {
//      WScript.Echo("ERROR(jFileSetAttribute:001): Passed parameters are invalid!!");
      return (1);
    }

    strPathParent = jFileFixPath(oFS.GetParentFolderName(strPath));
    rePath = new RegExp("^" + jHelpStrPrepRegExp(strPath));

    bPathIsWildcard = (/\*/.test(strPath) && oFS.FolderExists(strPathParent));
    if ( ! bPathIsWildcard )
    {
      bPathIsFolder = oFS.FolderExists(strPath);
      bPathIsFile = oFS.FileExists(strPath);
    }

    // Handle Error Type 0101 - If Source is unknown return false
    if ( ! (bPathIsWildcard || bPathIsFolder || bPathIsFile) )
    {
//      WScript.Echo("ERROR(jFileSetAttribute:0101): Source \"" + strPath + "\" is of unknown type or does not exist!!!");
      return (101);
    }

    // Set the Attributes of the Path

    // if the Path is a file
    if ( bPathIsFile )
    {
      fHandle = oFS.GetFile(strPath);

// WScript.Echo("File " + strPath + " Attributes are " + fHandle.attributes);

      if ( bEnable )
        fHandle.attributes = fHandle.attributes | cAttribute;
      else
        fHandle.attributes = fHandle.attributes & ~cAttribute;
// WScript.Echo("File " + strPath + " Attributes are " + fHandle.attributes);
    }

    // If the Path is a folder
    else if ( bPathIsFolder )
    {
      fHandle = oFS.GetFolder(strPath);
// WScript.Echo("Folder " + strPath + " Attributes are " + fHandle.attributes);
      if ( bEnable )
        fHandle.attributes = fHandle.attributes | cAttribute;
      else
        fHandle.attributes = fHandle.attributes & ~cAttribute;
// WScript.Echo("Folder " + strPath + " Attributes are " + fHandle.attributes);

      // Recursively traverse folder
      if ( bRecursive )
      {
        aFileList = jFileDir(strPath);      
        for (var i = 0; i < aFileList.length; i++)       
          jFileSetAttribute(aFileList[i], cAttribute, bEnable, bRecursive);
      }
    }

    // if source is a wildcard
    else if ( bPathIsWildcard )
    {
      aFileList = jFileDir(strPathParent);      

      if ( aFileList != null )
      {
        for (var i = 0; i < aFileList.length; i++)
          jFileSetAttribute(FileList[i], cAttribute, bEnable, bRecursive);              
      }
    }

    fHandle = null;
    // Return Success
    return(0);
  }
    

  function jFileFindString(strFileName, strSearch)
  {
    var bFoundString = false;
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var fdFile, tsFile;
    var strCurrentLine = null;
    var reSearch = new RegExp( jHelpStrPrepRegExp(strSearch), "" );

    if ( (strFileName != null) && oFS.FileExists(strFileName) )
    {
      fdFile = oFS.GetFile(strFileName);
      tsFile = fdFile.OpenAsTextStream(ForReading);
      
      while ( ! tsFile.AtEndOfStream && ! bFoundString)
      {
        if ( reSearch.test( tsFile.ReadLine() ) )
        {
          bFoundString = true;
        }
      } 
    }
    return bFoundString;
  }

  /*\
   *  Function:		jFileListRCopy
   *  Version:		0.1
   *  Date:		2005/10/13
   *  
   *  Input:		asSource - Source Files, Folders, or wildcards
   *                    strDestination -  Destination Folder
   *                    bOverwrite - true = overwrite files in destination; false = don't overwrite files in destination
   *  Output: 
   *  
   *  Description:	Copys the provided File, Folder, or Wildcard to the provided destination
   *     
  \*/

  function jFileListRCopy(asSource, strDestination, bOverwrite) 
  {
    if ( asSource == null || asSource.constructor != Array )
    {
      return (false);
    }

    for (var i = 0; i < asSource.length; i++)
    {
      jFileRCopy(asSource[i], strDestination, bOverwrite);
    }

    return (true);
  }

