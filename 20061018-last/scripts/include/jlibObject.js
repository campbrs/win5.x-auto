

  function jOBJ2XML(oXNParent, oInput)
  {
    var oXD = oXNParent.ownerDocument;
    var oXNCurrChild;
    var oXNParentsParent = oXNParent.parentNode;
    var strParentName = oXNParentsParent.nodeName;
    var oXAttrib;
    var strArrayElementName;
    
    if ( oInput == null )
    {
      oXNParent.text = "";
    }
    else
    {
      switch (oInput.constructor)
      {
        case Object   :
          for (var strKeyName in oInput)
          {
            jOBJ2XML( oXNParent.appendChild(oXD.createElement(strKeyName)), oInput[strKeyName] );
          }
          break;
        
        case Array    :
          for (var i = 0; i < oInput.length; i++)
          {          
            if ( i == 0 )
            {
              oXNParent.setAttribute("INDEX", i);
              strArrayElementName = oXNParent.nodeName;
              jOBJ2XML( oXNParent, oInput[i] );
            }
            else
            {
              oXNCurrChild = oXD.createElement(strArrayElementName);
              oXNCurrChild.setAttribute("INDEX", i);
              jOBJ2XML( oXNParentsParent.appendChild(oXNCurrChild), oInput[i] );
            }
          }
          break;
        
        case String   :
          oXNParent.text = oInput;
          break;
        
        case Number   :
          oXNParent.text = oInput;      
          break;
          
        case Boolean  :
           if (oInput)
           {
             oXNParent.text = "true";
           }
           else
           {
             oXNParent.text = "false";
           }
           break;
      }
    }
  }
  
  
  
  /*\
   *    Function:     jOBJSortArrayByIndex
   *    Build Date:   2005/09/29
   *    Written by:   Richard Campbell
   *
   *    Inputs:       arrayObjects
   *                  objXMLElement  -  XML Element to Parse
   *    Outputs:      
   *
   *    Description:   loads external configuration file and merges the data with   t
   *
   *    Reversion Info:
   *    1.0.1   - 2005/10/31 - Fixed Code to output a new Array instead of true/false
   *    1.0.0   - 2005/09/29 - initial hardcoded version
   *
  \*/

  function jOBJSortArrayByIndex (aObjects)
  {  
    var objectTemp;

    if ( aObjects.constructor != Array )
    {
      WScript.Echo ("ERROR(jCOSortByIndex): Array not passed to function!!!");
      return (false);
    }

    // perform an Insertion Sort to move the lowest index to the first element in the array
    // items with no index get moved to the end of the array
    for (var i = 0; i < aObjects.length; i++)
    {
      for (var j = (i + 1); j < aObjects.length; j++)
      {

        // if the current testing item is an object and has an index the sort item
        if ( (typeof(aObjects[j]) == "object") &&  ( typeof(aObjects[j]["index"]) == "number" ) )
        {

          // if the current ordered index (i) is not an object or has no index or the index is greater than the current tested index (j) then swap them
          if ( (typeof(aObjects[i]) != "object") || (typeof(aObjects[i]["index"]) != "number") || (aObjects[j]["index"] < aObjects[i]["index"]) )
          {
            objectTemp  = aObjects[i];
            aObjects[i] = aObjects[j];
            aObjects[j] = objectTemp;
          }     
        }
      }      
    }

    return (aObjects);
  }

  function jOBJPrint(strOKeyName, oInput, strFormatChar, numDepth)
  {
    var strPreString = strFormatChar;
    
    if ( (oInput == null) || (oInput == undefined) )
    {
      return (false);
    }
    
    
    for ( var i = 0; i < numDepth; i++)
    {
      strPreString += strFormatChar;
    }
    numDepth++;

    switch (oInput.constructor)
    {

      case Object :
        WScript.Echo(strPreString + strOKeyName + " : ");
        for(var strKey in oInput)
          jOBJPrint(strKey, oInput[strKey], strFormatChar, numDepth);
        break;

      case Array :
        WScript.Echo(strPreString + strOKeyName + " : ");
        for (var i = 0; i < oInput.length; i++)
          jOBJPrint(i, oInput[i], strFormatChar, numDepth);
        break;

      default :
        WScript.Echo (strPreString + strOKeyName + " : " + oInput);
        break;    
    }

    return (true);
  }