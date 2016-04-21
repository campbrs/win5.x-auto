  /*\
   *    Function:     jINIWriteFile
   *    Build Date:   2005/09/10
   *    Written by:   Richard Campbell
   *
   *    Inputs:       fileINI    -  INI File to write to
   *                  objData    - 
   *    Outputs:      objXML            -  object containing the data from the XML file
   *                      to build the various answer files, etc
   *
   *    Description:   
   *
   *    Reversion Info:
   *    1.0.0   - 2005/05/03 - initial hardcoded version
   *
  \*/

  function jINIParseObject (fileINI, objData)
  {
    var aryObjectNames = new Array();

    if ( typeof(objData) == "object" )
    {
      for (var strProperty in objData)
      {
        // if object store the name for processing later
        if ( typeof(objData[strProperty]) == "object" )
        {
          aryObjectNames.push(strProperty);
        }
        // if string or number the write the name value pair to the file
        else if ( ( typeof(objData[strProperty]) == "string" ) || ( typeof(objData[strProperty]) == "number" ) )
        {
          fileINI.WriteLine("  " + strProperty + " = " + objData[strProperty]);   
        }
      }
    }

    // process objects last
    for (var i = 0; i < aryObjectNames.length; i++)
    {
          // write the object name
          fileINI.WriteLine("[" + aryObjectNames[i] + "]" );

          // recursively parse the object
          jINIParseObject(fileINI, objData[aryObjectNames[i]]);
    }
  }


  /*\
   *    Function:     jINIWriteFile
   *    Build Date:   2005/05/03
   *    Written by:   Richard Campbell
   *
   *    Inputs:       strXMLFileName    -  XML File to read with full path
   *    Outputs:      objXML            -  object containing the data from the XML file
   *                      to build the various answer files, etc
   *
   *    Description:   loads external configuration file and merges the data with   t
   *
   *    Reversion Info:
   *    1.0.0   - 2005/05/03 - initial hardcoded version
   *
  \*/

  function jINIWriteFile (objINIFileData)
  {
    var objFS = new ActiveXObject("Scripting.FileSystemObject");

    var fileINI;

    objINIFileData["FilePath"] = jFixPath(objINIFileData["FilePath"]);
    if ( objFS.FolderExists( objINIFileData["FilePath"] )  && ( objINIFileData["FileName"] != null ) )
    {
        fileINI = objFS.CreateTextFile(objINIFileData["FilePath"] + objINIFileData["FileName"]);

        jINIParseObject(fileINI, objINIFileData["FileContents"]);

        fileINI.close();
    }
  }


  function jINI2XMLAF(strINIFileName, oXNodeParent)
  {
    var strCurrentLine, strSectionName, strKey, strValue;
    var aKeyValue;
    var fINI, tsINI;
    var oXNodeCurrSection = null, oNodeCurrKey = null;
    var oXD = null;

    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var ForReading = 1, ForWriting = 2, ForAppending = 8;
    var TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0;

    var reLTWS           = new RegExp("(^\\s+)|(\\s+$)","g");
    var reEIBrackets     = new RegExp("(^.*\\[)|(\\].*$)","g");

    var reINIComment     = new RegExp("(;|#).*$","");
    var reINISectionName = new RegExp("\\[.*\\]","");
    var reINIKeyValue    = new RegExp("^.*=.*$","");
    var reINIText        = new RegExp("^.*=.*$","");

    if ( oXNodeParent != null )
    {
      oXD = oXNodeParent.ownerDocument;

      // store the filename      
      oXNodeParent.setAttribute("FILENAME", strINIFileName);

      fINI = oFS.GetFile(strINIFileName);

      tsINI = fINI.OpenAsTextStream(ForReading, TristateUseDefault);

      while ( ! tsINI.AtEndOfStream )
      {
        strCurrentLine = tsINI.ReadLine();

        // Yank comments - if there is ever a need to convert comments add here
        if ( reINIComment.test(strCurrentLine) )
        {
          strCurrentLine = strCurrentLine.replace(reINIComment, "");
        }

        // if line is a section
        if ( reINISectionName.test(strCurrentLine) )
        {
          oXNodeCurrSection = oXD.createElement("INI_SECTION");
          oXNodeCurrSection.setAttribute("NAME", strCurrentLine.replace(reEIBrackets, ""));
          oXNodeParent.appendChild(oXNodeCurrSection);           
        }
        else if ( reINIKeyValue.test(strCurrentLine) && (oXNodeCurrSection != null) )
        {
          aKeyValue = strCurrentLine.split("=");
          oXNodeCurrKey = oXD.createElement("INI_KEYVAL");
          oXNodeCurrKey.setAttribute("KEY", aKeyValue[0].replace(reLTWS,""));
          oXNodeCurrKey.setAttribute("VALUE", aKeyValue[1].replace(reLTWS,""));
//          oXNodeCurrKey.text = aKeyValue[1].replace(reLTWS,"");
          oXNodeCurrSection.appendChild(oXNodeCurrKey);           
        }
        else if ( (strCurrentLine != "")  && (oXNodeCurrSection != null) )
        {
          oXNodeCurrSection.text += strCurrentLine;
        }
      }
      tsINI.Close();
    }
  }


  function jINI2OBJRaw(strINIFileName)
  {
    var strCurrentLine, strSectionName, strKey, strValue;
    var aKeyValue;
    var fINI, tsINI;
    var oBject, strCurrentSection = "";

   
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    var ForReading = 1, ForWriting = 2, ForAppending = 8;
    var TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0;

    var reLTWS           = new RegExp("(^\\s+)|(\\s+$)","g");
    var reEIBrackets     = new RegExp("(^.*\\[)|(\\].*$)","g");

    var reINIComment     = new RegExp("(;|#).*$","");
    var reINISectionName = new RegExp("\\[.*\\]","");

    fINI = oFS.GetFile(strINIFileName);

    tsINI = fINI.OpenAsTextStream(ForReading, TristateUseDefault);

    oBject = new Object();


    while ( ! tsINI.AtEndOfStream )
    {
      strCurrentLine = tsINI.ReadLine();

      // Yank comments - if there is ever a need to convert comments add here
      if ( reINIComment.test(strCurrentLine) )
      {
        strCurrentLine = strCurrentLine.replace(reINIComment, "");
      }

      // if line is a section
      if ( reINISectionName.test(strCurrentLine) )
      {
        strCurrentSection = strCurrentLine.replace(reEIBrackets, "");
        oBject[strCurrentSection] = "";
      }
      else if ( ! /^\S*$/.test(strCurrentLine) )
      {
        oBject[strCurrentSection] += strCurrentLine + "\n";
      }
    }
    tsINI.Close();

    return oBject;
  }

  