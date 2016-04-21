


  function jLogConvertTXT2TXT(strTXTInFileName, strTXTInDelim, strColumnNames, strTXTOutFileName, strTXTOutDelim)
  {
    var oLogQuery, oInputFormat, oRecordSet, strQuery;
    var oTemp, oError, aColumnName, aRecordData, fOutFile;

    var oFS = new ActiveXObject("Scripting.FileSystemObject");
  
    // determine a replacement string if delimeter is found
    var strReplaceChar;

    if ( ! /\+/.test(strTXTOutDelim) )
      strReplaceChar = "+";
    if ( ! /\-/.test(strTXTOutDelim) )
      strReplaceChar = "-";
    if ( ! /\=/.test(strTXTOutDelim) )
      strReplaceChar = "=";


    // Validate the XML file
    if ( ! oFS.FileExists(strTXTInFileName) )
    {
      return null;
    }
  
    oLogQuery = new ActiveXObject("MSUtil.LogQuery");

    // Create Input Format object
    oInputFormat = new ActiveXObject("MSUtil.LogQuery.TextLineInputFormat");

  
    // Create query text
    strQuery = "SELECT * FROM " + strTXTInFileName;

    // Execute query and receive a LogRecordSet
    oRecordSet = oLogQuery.Execute( strQuery, oInputFormat );

    fOutFile = oFS.CreateTextFile(strTXTOutFileName, true);    

    // Get Entry Names and create objects
    aColumnName = new strColumnNames.split(",");
    for ( var i = 0; i < aColumnName.length; i++ )
    {
      aColumnName[i] = aColumName[i].replace(strTXTOutDelim, strReplaceChar);
    }
  
    fOutFile.WriteLine(aColumnName.join(strTXTOutDelim));

    // Visit all records
    while( !oRecordSet.atEnd() )
    {
      // Get a record
      oRecord = oRecordSet.getRecord();

      // Get field value
      aRecordData = new Array(oRecord.getValue( 0 ).split(strTXTInDelim));
      for ( var i = 0; i < aRecordData.length; i++ )
      {
        aRecordData[i] = aRecordData[i].replace(strTXTOutDelim, strReplaceChar);
      }

      fOutFile.WriteLine(aRecordData.join(strTXTOutDelim));

      // Advance LogRecordSet to next record
      oRecordSet.moveNext();
    }

    // Close LogRecordSet
    oRecordSet.close();

    // Close the Output Text File
    fOutFile.close();
  }

  function jLogConvertXML2TXT(strXMLFileName, strXMLRootPath, strTXTFileName, strTXTDelim)
  {
    var oLogQuery, oXMLInputFormat, oRecordSet, strQuery;
    var oTemp, oError, aColumnName, aRecordData, fOutFile;

    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var oXD = new ActiveXObject("Msxml2.DOMDocument.3.0");

    var reTXTDelim = new RegExp(strTXTDelim, "g");

    var bValid = false;

    var numErrorMask = 0;
  
    var strXMLTempFileName = strXMLFileName + ".temp";

    // determine a replacement string if delimeter is found
    var strReplaceChar;

    if ( ! /\-/.test(strTXTDelim) )
      strReplaceChar = "-";
    else if ( ! /\+/.test(strTXTDelim) )
      strReplaceChar = "+";
    else if ( ! /\=/.test(strTXTDelim) )
      strReplaceChar = "=";


    // Validate the XML file
    if ( ! oFS.FileExists(strXMLFileName) )
    {
      return null;
    }

    oXD.async = false;

    while ( ! bValid )
    {

      oXD.load(strXMLFileName);  

      oError = oXD.validate();

      switch (oError.errorCode)
      {
        case 0 :
          bValid = true;
          break; 

        // if XML document validate failed because the root element had not associated DTD/Schema - ignore this error
        case -1072897500 :
          bValid = true;
          break; 

        // if XML document does not contain exactly one root node then fix the document (0xC00CE223)
        case -1072897501 :

          // if error encountered once then fix; if encountered more than once then exit 
          if ( ! (numErrorMask & 1 ) )
          {
            jXMLFixFormat(strXMLFileName, strXMLTempFileName);
            strXMLFileName = strXMLTempFileName;
            strXMLRootPath = "/LOG" + strXMLRootPath;
            numErrorMask += 1;
          }
          else
          {
            WScript.Echo ("ERROR (jLogConvertXML2TXT) : XML Validation failed attempted fix to the XML format failed!!!");
            return null;
          }
          break;

        // if additional XML fixes are developed see 
        default :
          WScript.Echo ("ERROR (jLogConvertXML2TXT) : XML Validation failed with an error code of " + oError.errorCode + " !!!");
          return null;
      }
    }
  
    oLogQuery = new ActiveXObject("MSUtil.LogQuery");

    // Create Input Format object
    oXMLInputFormat = new ActiveXObject("MSUtil.LogQuery.XMLInputFormat");

  
    // Create query text
    strQuery = "SELECT * FROM " + strXMLFileName + "#" + strXMLRootPath;

    // Execute query and receive a LogRecordSet
    oRecordSet = oLogQuery.Execute( strQuery, oXMLInputFormat );

    fOutFile = oFS.CreateTextFile(strTXTFileName, true);

    aColumnName = new Array(oRecordSet.getColumnCount());

    // Get Entry Names and create objects
    for( var i = 0; i < oRecordSet.getColumnCount(); i++ )
    {
      aColumnName[i] = oRecordSet.getColumnName( i ).replace(reTXTDelim, strReplaceChar);
    }

    fOutFile.WriteLine(aColumnName.join(strTXTDelim));

    // Visit all records
    while( ! oRecordSet.atEnd() )
    {
      // Get a record
      oRecord = oRecordSet.getRecord();

      // Get field value
      aRecordData = new Array(aColumnName.length);

      for ( var i = 0; i < aColumnName.length; i++ )
      {
        aRecordData[i] = (oRecord.getValue( i ) + "").replace(reTXTDelim, strReplaceChar);
      }

      fOutFile.WriteLine(aRecordData.join(strTXTDelim));

      // Advance LogRecordSet to next record
      oRecordSet.moveNext();
    }

    // Close LogRecordSet
    oRecordSet.close();

    // Close the Output Text File
    fOutFile.close();
  }
