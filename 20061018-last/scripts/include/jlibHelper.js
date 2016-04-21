CRULER = "0123456789012345678901234567890123456789012345678901234567890123456789";
var INTERNALVARS = new Object();

  /*\
   *   Function:        jHelpStrPrepRegExp
   *   Version:         0.1
   *   Date:            11/04/2004
   *
   *   Input:           String
   *   Output:          String - prepared for use in a Regular Expressing
   *
   *   Description:     Preprares a string to be used in a Regular Expression
   *   
  \*/

  function jHelpStrPrepRegExp(strString) 
  {
     if ( (strString != null) && (strString.constructor == String) )
       return strString.replace(/\\/g,"\\\\")
                       .replace(/\!/g,"\\\!")
                       .replace(/\?/g,"\\\?")
                       .replace(/\$/g,"\\\$")
                       .replace(/\^/g,"\\\^")
                       .replace(/\./g,"\\\.")
                       .replace(/\*/g,"\\\*")
                       .replace(/\+/g,"\\\+")
                       .replace(/\(/g,"\\\(")
                       .replace(/\)/g,"\\\)")
                       .replace(/\[/g,"\\\[")
                       .replace(/\]/g,"\\\]");
     else
       return strString;
  }

  function jHelpMatch(strToMatch, reToMatchAgainst)
  {
    var aMatches = null;

    if ( (strToMatch != null) && (reMatchAgainst != null) )
      aMatches = strToMatch.match(reToMatchAgainst);

    if ( aMatches == null )
    {
      aMatches = new Array("");
    }

    return (aMatches)
  }

  /*\
   *   Function:        jAddLDZero
   *   Version:         0.1
   *   Date:            11/04/2004
   *
   *   Input:           number(int)
   *   Output:          number(String) pre-pended with a 0
   *
   *   Description:     Adds a 0 to a number - many functions return numbers without a prepended 0.  This 
   *                    function prepends a 0 to a number where one is needed to correctly format output
   *                    text, such when printing out time/date values.
   *   
  \*/

  function jHelpAddLDZero(number) {
     if (number < 10) return ("0" + number);
     else return ("" + number);
  }

  /*\
   *   Function:        jHelpStr2Num
   *   Version:         0.1
   *   Date:            2006/02/23
   *
   *   Input:           string
   *   Output:          number
   *
   *   Description:     Converts a String to a number
   *   
  \*/

  function jHelpStr2Num(strInput)
  {
     var numOutput;

     if ( strInput != null )
     {
       if ( /^\d+$/.test(strInput) )
       {
         numOutput = new Number(strInput);
       }
       else
       {
         numOutput = strInput;
       }
     }

     return (numOutput);
  }

  /*\
   *   Function:        jHelpShExec
   *   Version:         0.1
   *   Date:            11/04/2004
   *
   *   Input:           command
   *   Output:          returns an execute object containing STDOUT, STDERR, etc from the executed command
   * 
   *   Description:     Executes a "cmd" command and waits till execution is complete be for returning the result
   *   
  \*/

  function jHelpShExec(strCommand) {
    var oWinCmd = new ActiveXObject("WScript.Shell");

    var oExec;

    try
    {
      oExec = oWinCmd.Exec(strCommand);
      while (oExec.Status == 0) WScript.Sleep(100);
    }
    catch (strException)
    {
      WScript.Echo ("ERROR: External System Command (" + strCommand + ") Failed to Execute!!");
      WScript.Echo ("Exception Generated: " + strException);
    }

    return(oExec);
  }


  /*\
   *   Function:        jHelpExecStdOut2String
   *   Version:         0.1
   *   Date:            20061015
   *
   *   Input:           oExec - 
   *   Output:          returns an execute object containing STDOUT, STDERR, etc from the executed command
   * 
   *   Description:     Executes a "cmd" command and waits till execution is complete be for returning the result
   *   
  \*/

  function jHelpExecStdOut2String(oExec)
  {
    if ( oExec == null )
    {
      return (null);
    }

    return oExec.StdOut.ReadAll();
  }



  /*\
   *   Function:        jHelpShExecRoot
   *   Version:         0.1
   *   Date:            11/04/2004
   *
   *   Input:           command
   *   Output:          
   *
   *   Description:     Activates a an already created cmd window and runs the provided command in this window
   *   
  \*/

  function jHelpShExecRoot(command) {
    var oWinCmd = new ActiveXObject("WScript.Shell");

    oWinCmd.AppActivate("cmd");
    oWinCmd.SendKeys(command + "~");
  }
 


  /*\
   *    Function:     jReplaceVars
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

  function jReplaceVars (objConfig, strStartPoint)
  {
    var arrayStartPoint = strStartPoint.split(",");
    var arrayVarLocation;
    var objData = objConfig;
    var objData2 = objConfig;
    var regexpData;

    for (var i = 0; i < arrayStartPoint.length; i++)
    {
      if ( typeof(objData) == "object" )
      {
        objData = objData[arrayStartPoint[i]];
      }
      else
      {
        return (false);
      }
    }

    for (var strPropertyX in objData)
    {
      // if object store the name for processing later
      if ( typeof(objData[strPropertyX]) == "object" )
      {
        jReplaceVars(objConfig, strStartPoint + "strPropertyX");
      }
      // if string or number the write the name value pair to the file
      else if ( ( typeof(objData[strPropertyX]) == "string" ) || ( typeof(objData[strPropertyX]) == "number" ) )
      {

        // scan the current string or number and replace all variables with all values
        for (var strPropertyY in objConfig["varindex"])
        {
          regexpData = new RegExp(strPropertyY,"g");

          // map the var path to the actual value
          objData2 = objConfig;
          arrayVarLocation = objConfig["varindex"][strPropertyY].split(",");
          for (var i = 0; i < arrayStartPoint.length; i++)
          {
            objData2 = objData2[arrayStartPoint[i]];
          }

          // replace the variable with the value
          objData[strPropertyX] = objData[strPropertyX].replace(regexpData, objData2); 
        }
      }
    }
  }

  function jHelpGetTimeDateTag()
  {
    var objDate  = new Date();
    var Year     = objDate.getFullYear();
    var Months   = jHelpAddLDZero((objDate.getMonth()+1));
    var Days     = jHelpAddLDZero(objDate.getDate());
    var Hours    = jHelpAddLDZero(objDate.getHours());
    var Minutes  = jHelpAddLDZero(objDate.getMinutes());
    var Seconds  = jHelpAddLDZero(objDate.getSeconds());

    return(Year + Months + Days + Hours + Minutes + Seconds);
  }


  function jHelpSpliceArray(aSource, numStart, numDelCount, aElements)
  {
    var aReplaced = aSource.splice(numStart, numDelCount);

    for (var i=0; i < aElements.length; i++)
    {
      aSource.splice((numStart+i), 0, aElements[i]);
    }

    return aReplaced;
  }

  function jHelpReplaceVarsInStr(oXD, oINTVARs, strValue)
  {
     return jHelpReplaceVarsInStr(oXD, oINTVARs, strValue, null);
  }


  function jHelpReplaceInternalVars(strVarName)
  {
    if ( (INTERNALVARS != undefined) && (INTERNALVARS[strVarName] != undefined) )
    {
      return (INTERNALVARS[strVarName]);
    }
    else
    {
      return (strVarName);
    }
  }




  function jHelpReplaceVarsInStr(oXD, oValue)
  {
     return jHelpReplaceVarsInStr(oXD, oValue, null);
  }

  function jHelpReplaceVarsInStr(oXD, oValue, aVarPath)
  {
    var strCurrVarName, oCurrVarValue, strCurrValue;
    var reVAR, reVARDELIM, reVARPATHCurr;
    var aAllVARs, aValue, aValueTemp;
    var bReturnArray = false;

    var oWinCmd = new ActiveXObject("WScript.Shell");
    var PROCENV = oWinCmd.Environment("PROCESS");


    var strArrayDelim = jXMLGetSingleNodeValue(oXD, "//VARARRAYDELIM");
    var strVARDELIM = jXMLGetSingleNodeValue(oXD, "//VARDELIM");

    if (strArrayDelim == null)
      strArrayDelim = ",";

    if ( oValue == null )
      return null;

    switch (oValue.constructor)
    {
      case String :
        aValue = oValue.split(strArrayDelim);
        bReturnArray = false;
        break;

      case Array :
        aValue = oValue;
        bReturnArray = true;
        break;

      default :
        return oValue;
        break;
    }


    // Recursive Loop Prevention recording the Varible path in aVarPath (i.e. if I have already handled this var in the path then bail)

    // init Varible Path if need
    if ( aVarPath == null )
    {
      aVarPath = new Array();
    }

    switch (aVarPath.constructor)
    {
      case String :
        aVarPath = aVarPath.split(strArrayDelim);
        break;

      case Array :
        break;

      default :
        aVarPath = new Array();
        break;
    }

    for ( var i = 0; i < aVarPath.length; i++ )
    {
      reVARPATHCurr = new RegExp(jHelpStrPrepRegExp(aVarPath[i]),"");
      if ( reVARPATHCurr.test(aValue.join(strArrayDelim)) )
      {
        return null;
      }
    }

// WScript.Echo(" : " + aVarPath.join("->") + " : " + aValue);



   if ( strVARDELIM != null )
   {
      for (var h=0; h < aValue.length; h++)
      {
        strCurrValue = aValue[h];

    
        reVAR = new RegExp(jHelpStrPrepRegExp(strVARDELIM) + "\\S\+" + jHelpStrPrepRegExp(strVARDELIM), "gi");
        reVARDELIM = new RegExp(jHelpStrPrepRegExp(strVARDELIM),"gi");
        aAllVARs = aValue[h].match(reVAR);

        // Replace all internal defined vars
        if ( aAllVARs != null )
        {
          for ( var i = 0; i < aAllVARs.length; i++ )
          {
            aVarPath.push(aAllVARs[i]);
            strCurrVarName = aAllVARs[i].replace(reVARDELIM,"");

            oCurrVarValue = aAllVARs[i];

            // Replace XML Vars
            if ( (oCurrVarValue == null) || (oCurrVarValue == aAllVARs[i]) || (oCurrVarValue == "") )
            {
              oCurrVarValue = jHelpReplaceVarsInStr(oXD, jXMLGetSingleNodeValue(oXD, "//" + strCurrVarName), aVarPath);;
            }

            // Replace with SystemVars
            if ( (oCurrVarValue == null) || (oCurrVarValue == aAllVARs[i]) || (oCurrVarValue == "") )
            {
              oCurrVarValue = jHelpReplaceVarsInStr(oXD, PROCENV(strCurrVarName), aVarPath);
            }

            // Replace with Internal Vars
            if ( (oCurrVarValue == null) || (oCurrVarValue == aAllVARs[i]) || (oCurrVarValue == "") )
            {
              oCurrVarValue = jHelpReplaceVarsInStr(oXD, jHelpReplaceInternalVars(strCurrVarName), aVarPath);
            }

            if ( oCurrVarValue.constructor == Array )
            {
              bReturnArray = true;
              aValueTemp = new Array();

              for (var k=0; k < oCurrVarValue.length; k++)
              {
                aValueTemp.push(strCurrValue.replace(aAllVARs[i], oCurrVarValue[k]));
              }
//WScript.Echo("Current Value = " + aValueTemp);
 
              jHelpSpliceArray(aValue, h, 1, aValueTemp);
              h = h + aValueTemp.length - 1;
            }
            else
            {
              aValue[h] = strCurrValue.replace(aAllVARs[i], oCurrVarValue);
//WScript.Echo("Current Value = " + aValue[h]);
            }
          }
        }
      }
    }

    if (! bReturnArray )
    {
      return aValue.join(strArrayDelim);
    }
    else
    {
      return aValue;
    }
  }


  function jHelpGetOSBuildNum()
  {
    var oWinCmd = new ActiveXObject("WScript.Shell");
    var strOSBuildNum = oWinCmd.RegRead("HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentBuildNumber");

    oWinCmd = null;

    // 2000 = 2195; XP = 2600; 2003 = 3790; Vista/Longhorn Betas = 4002+ (beta2 = 5384)
    return (strOSBuildNum);

  }
  