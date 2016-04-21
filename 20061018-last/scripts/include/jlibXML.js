  // XML node type constants
  NODE_ELEMENT = 1;
  NODE_ATTRIBUTE = 2;
  NODE_TEXT = 3;
  NODE_CDATA_SECTION = 4;
  NODE_ENTITY_REFERENCE = 5;
  NODE_ENTITY = 6;
  NODE_PROCESSING_INSTRUCTION = 7;
  NODE_COMMENT = 8;
  NODE_DOCUMENT = 9;
  NODE_DOCUMENT_TYPE = 10;
  NODE_DOCUMENT_FRAGMENT = 11;
  NODE_NOTATION = 12;
  ATTRIB_ARRAY_DELIM = ";";
  ATTRIB_RANGE_DELIM = ":";


  /*\
   *    Function:     jXMLParseNode
   *    Build Date:   2005/05/03
   *    Written by:   Richard Campbell
   *
   *    Inputs:       oXD      -  XML DOM object
   *                  objXMLElement  -  XML Element to Parse
   *    Outputs:      
   *
   *    Description:   loads external configuration file and merges the data with   t
   *
   *    Reversion Info:
   *    1.0.0   - 2005/05/03 - initial hardcoded version
   *
  \*/

  function jXMLParseNode (objData, oXMLNode)
  {  

    if ( oXMLNode == null )
    {
      return (null);
    }
     
    // For all attributes in the elment capture them into the object
    for(var j = 0; j < oXMLNode.attributes.length; j++)
    {
      objData[oXMLNode.attributes.item(j).name] = oXMLNode.attributes.item(j).value;
    }

    if ( oXMLNode.hasChildNodes() )
    {
      for(var i = 0; i < oXMLNode.childNodes.length; i++)
      {
        switch (oXMLNode.childNodes.item(i).nodeType)
        {
          case NODE_ELEMENT :

            // if child is an element and the object does not exist create a new object for the child node
            if ( typeof(objData[oXMLNode.childNodes.item(i).baseName]) != "object" )
            {
              objData[oXMLNode.childNodes.item(i).baseName] = new Object();

              // Recursively trace into the element
              jXMLParseNode(objData[oXMLNode.childNodes.item(i).baseName], oXMLNode.childNodes.item(i));
            }

            // Handle multiple duplicate Elements by creating an Array
            else if ( objData[oXMLNode.childNodes.item(i).baseName].constructor != Array )
            {
              objData[oXMLNode.childNodes.item(i).baseName] = new Array(objData[oXMLNode.childNodes.item(i).baseName]);
              objData[oXMLNode.childNodes.item(i).baseName].push(new Object());

              // Recursively trace into the element
              jXMLParseNode(objData[oXMLNode.childNodes.item(i).baseName][objData[oXMLNode.childNodes.item(i).baseName].length-1], oXMLNode.childNodes.item(i));
            }
            else
            {
              objData[oXMLNode.childNodes.item(i).baseName].push(new Object());

              // Recursively trace into the element
              jXMLParseNode(objData[oXMLNode.childNodes.item(i).baseName][objData[oXMLNode.childNodes.item(i).baseName].length-1], oXMLNode.childNodes.item(i));
            }
            break;

          case NODE_TEXT :
            // if text capture the text into the parent object
            objData["text"] = oXMLNode.childNodes.item(i).text;
            break;
        }
      }
    }
  }

  /*\
   *    Function:     jXMLReadFile
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
   *    Deprecated - 2006/01 - Use jXMLParseNode(objParsedData, oXD.selectSingleNode(strParentElement));
   *    1.0.0   - 2005/05/03 - initial hardcoded version
   *
  \*/

  function jXMLReadFile (objParsedData, oXD, strParentElement)
  {
    jXMLParseNode(objParsedData, oXD.selectSingleNode(strParentElement));
  }



  function jXMLFixFormat(strInFileName, strOutFileName)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var ForReading = 1, ForWriting = 2;
    var fOutFile, fInFile;
  
    // if the source file does not exist then exit function
    if ( ! oFS.FileExists(strInFileName) )
    {
      WScript.Echo("ERROR (jXMLFixFormat) : The Original file does not exist!!");
      return null;
    }
  

    // if the destination path is invalid then exit the function
    if ( /\\/.test(strOutFileName) && ! oFS.FolderExists(strOutFileName.split("\\").slice(0,-1)) )
    {
      WScript.Echo("ERROR (jXMLFixFormat) : The destination file's path is invalid!!");
      return null;
    }

    fInFile = oFS.OpenTextFile(strInFileName, ForReading);

    fOutFile = oFS.CreateTextFile(strOutFileName);
    fOutFile.WriteLine("<?xml version=\"1.0\" ?>");
    fOutFile.WriteLine("<LOG>");

    while ( ! fInFile.AtEndOfStream )
    {
      fOutFile.WriteLine(fInFile.ReadLine().replace(/\n\s*\n/g,"\n"));
    }

    fOutFile.WriteLine("</LOG>");
    fOutFile.Close();

    fInFile.Close();
  }

  // see : http://msdn.microsoft.com/library/default.asp?url=/library/en-us/xmlsdk/html/4690e3d4-58f4-4594-b5e1-98856431a1fe.asp
  function jXMLLoadDOM(strFileName)
  {
    var oXD;

    try
    {
      oXD = jXMLMakeDOM(null);
      oXD.load(strFileName);

      if ( oXD.parseError.errorCode != 0 )
      {
        WScript.Echo("ERROR(jXMLReadFile): " + strFileName + " failed to load with an error code of " + oXD.parseError.errorCode);
        return (null);
      }
      return (oXD);
    }
    catch (e) 
    {
      WScript.Echo("ERROR (jXMLLoadDOM) : Exception Loading XML file " + strFileName + " : " + e.description);
      return (null);
    }

  }

  // see : http://msdn.microsoft.com/library/default.asp?url=/library/en-us/xmlsdk/html/4690e3d4-58f4-4594-b5e1-98856431a1fe.asp
  function jXMLMakeDOM(strProgID)
  {
   var oXD;

   if (strProgID == null)
   {
      strProgID = "MSXML2.DOMDocument.3.0";
   }

    try
    {
      oXD = new ActiveXObject(strProgID);

      //Set properties
      oXD.async = false;
      oXD.validateOnParse = false;
      oXD.resolveExternals = false;
    }
    catch (e)
    {
      WScript.Echo("ERROR (jXMLMakeDOM) : Exception Building DOM file : " + e.description);
    }

    return oXD;
  }

  function jXMLPrintNodeList(aNodes)
  {
    WScript.Echo("The Node List has " + aNodes.length + " values");
    for ( var i = 0; i < aNodes.length; i++)
    {
      WScript.Echo("Node " + i + "  has a Node name of " + aNodes[i].nodeName);
      if ( aNodes[i].firstChild.nodeType == NODE_TEXT )
        WScript.Echo("\tNode's Text:\t" + aNodes[i].firstChild.nodeValue);
      else
        WScript.Echo("\tXML:\n" + aNodes[i].xml);
    }
  }

  function jXMLConvertNodeList2StrArray(aNodes)
  {
    var aNodeValues = new Array(aNodes.length);

    for ( var i = 0; i < aNodes.length; i++)
    {
      if ( aNodes[i].firstChild.nodeType == NODE_TEXT )
        aNodeValues = aNodeValues.concat(aNodes[i].firstChild.nodeValue);
      else
        aNodeValues = aNodeValues.concat(aNodes[i].xml);
    }
    return (aNodesValues);
  }


  function jXMLGetSingleNodeValue(oXD, strPath)
  {
    var oNode = oXD.selectSingleNode(strPath);

    if ( oNode != null )
      return oNode.firstChild.nodeValue;
    else
      return null;
  }

  function jXMLGetChildNodeValue(oXNode, strNodeName)
  {
    var oXChildrenNodeList = oXNode.childNodes;
    var strChildNodeValue = "";
    var reNodeName = new RegExp(jHelpStrPrepRegExp(strNodeName),"i");

    for (var i = 0; i < oXChildrenNodeList.length; i++)
    {
      if ( reNodeName.test(oXChildrenNodeList.item(i).nodeName) )
      {
        strChildNodeValue = oXChildrenNodeList.item(i).text;
        i = oXChildrenNodeList.length;
      }
    }

    return (strChildNodeValue);
  }

  function jXMLCloneNode(oXNodeSrc)
  {
    return (oXNodeSrc.cloneNode(true));
  }

  function jXMLGetAttribute(oXNode, strAttributeName)
  {
    var strCurrAttributeName = null;
    var strCurrAttributeValue = null;
    var reAttributeName = new RegExp("^" + jHelpStrPrepRegExp(strAttributeName) + "$", "i");

    var oXAttributeList = oXNode.attributes;

    if ( oXAttributeList != null )
    {
      for (var i=0; i < oXAttributeList.length; i++)
      {
        strCurrAttributeName = oXAttributeList.item(i).nodeName;
        strCurrAttributeValue = oXAttributeList.item(i).nodeValue;

        if ( reAttributeName.test(strCurrAttributeName) )
        {
          i = oXAttributeList.length
        }
        else
        {
          strCurrAttributeName = null;
          strCurrAttributeValue = null;
        }
      }
    }

    return (strCurrAttributeValue);   
  }

  function jXMLGetChildNodebyIndex(oXNode, strNodeName, strIndex)
  {
    var strCurrNodeName = null;
    var strCurrIndex;

    var oXNodeIndexed = null;

    var reNodeName = new RegExp("^" + jHelpStrPrepRegExp(strNodeName) + "$", "i");

    var oXNodeChildList = oXNode.childNodes;

    if ( oXNodeChildList != null )
    {
      for (var i=0; i < oXNodeChildList.length; i++)
      {
        strCurrNodeName = oXNodeChildList.item(i).nodeName;

        strCurrIndex = jXMLGetAttribute(oXNodeChildList.item(i), "INDEX");

        if ( reNodeName.test(strCurrNodeName) && (strCurrIndex != null) && (strCurrIndex == strIndex) )
        {
          oXNodeIndexed = oXNodeChildList.item(i);
          i = oXNodeChildList.length;
        }

      }
    }

    return (oXNodeIndexed);   
  }



  /*\
   * 	Function:	jXMLMergeNode
   *	Build Date:	2005-12-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNodeSrc - XML Node Object - Source Node
   *	      		oXNodeDst - XML Node Object - Destination Node
   *                    oAttributeIgnoreList - Array or String Object - Items to ignore when comparing the attributes
   *	Outputs:	
   *
   *	Description:    Merge's source Node with Destination Node and updates Attributes on Destination node
   *                    Recursive
   *                    
   *
   *    Called Functions: jXMLAttributesCompare, jXMLMergeNode, jXMLMergeAttributes
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLMergeNode(oXNodeSrc, oXNodeDst, oAttributeIgnoreList)
  {

    var oXNodeListSrcChildren = null;
    var oXNodeSrcCurr;
    var oXNodeListDstChildren = null;
    var oXNodeDstCurr;
    var bMatchFound;

    // Get all Children for Src node
    if ( oXNodeSrc.hasChildNodes )
    {
      oXNodeListSrcChildren = oXNodeSrc.childNodes;
    }

    if ( oXNodeDst.hasChildNodes )
    {
      oXNodeListDstChildren = oXNodeDst.childNodes;
    }

    if ( oXNodeListSrcChildren != null )
    {
      for (var i = 0; i < oXNodeListSrcChildren.length; i++)
      {
        oXNodeSrcCurr = oXNodeListSrcChildren.item(i);

        bMatchFound = false;

        if ( oXNodeListDstChildren != null )
        {
          for (var j = 0; j < oXNodeListDstChildren.length; j++)
          {
            oXNodeDstCurr = oXNodeListDstChildren.item(j);


            if ( (oXNodeSrcCurr.nodeType == oXNodeDstCurr.nodeType) &&
                 (oXNodeSrcCurr.nodeName == oXNodeDstCurr.nodeName) &&
                 (jXMLAttributesCompare(oXNodeSrcCurr, oXNodeDstCurr, oAttributeIgnoreList)) )
            {
              switch ( oXNodeSrcCurr.nodeType )
              {
                 case NODE_ELEMENT :
                   jXMLMergeNode(oXNodeSrcCurr, oXNodeDstCurr, oAttributeIgnoreList);
                   jXMLMergeAttributes(oXNodeSrcCurr, oXNodeDstCurr);
                   break;

                 case NODE_TEXT :
                   oXNodeDstCurr.nodeValue = oXNodeSrcCurr.nodeValue;
                   break;
              }

              bMatchFound = true;
              j = oXNodeListDstChildren.length;
            }
          }
        }

        if ( ! bMatchFound )
        {
          oXNodeDst.appendChild(oXNodeSrcCurr);
        }
      }
    }
  }

  /*\
   * 	Function:	jXMLSortNodeChildren
   *	Build Date:	2005-12-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node Object - Parent Node
   *	Outputs:	
   *
   *	Description:    Sorts all same level Nodes by the "INDEX"attribute (updates parent node)
   *                    Recursive - all children are sorted as well
   *                    
   *
   *    Called Functions: jHelpStr2Num, jXMLSortNodeChildren
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLSortNodeChildren(oXNode)
  {
    var oXNodeListChildren = null;
    var numIndex_i, numIndex_j;
    
    if ( oXNode.hasChildNodes )
    {
      oXNodeListChildren = oXNode.childNodes;

      for (var i = 0; i < oXNodeListChildren.length; i++)
      {
        numIndex_i = jHelpStr2Num(jXMLGetAttribute(oXNodeListChildren.item(i), "INDEX"));

        // Sort children recursively
        if ( oXNodeListChildren.item(i).nodeType == NODE_ELEMENT )
        {
          jXMLSortNodeChildren(oXNodeListChildren.item(i));
        }

        for (var j = i; j < oXNodeListChildren.length; j++)
        {
          numIndex_j = jHelpStr2Num(jXMLGetAttribute(oXNodeListChildren.item(j), "INDEX"));

          if ( (oXNodeListChildren.item(i).nodeType == oXNodeListChildren.item(j).nodeType) &&
               (oXNodeListChildren.item(i).nodeName >= oXNodeListChildren.item(j).nodeName) )
          {
            if ( ( (numIndex_i != null) && (numIndex_j != null) && (numIndex_i >= numIndex_j) ) ||
                 ( (numIndex_i == null) && (numIndex_j == null) ) || 
                 ( (numIndex_i == null) && (numIndex_j != null) ) )
            {
              oXNode.insertBefore(oXNode.removeChild(oXNodeListChildren.item(j)), oXNodeListChildren.item(i));              
            }
          }
        }
      }
    }
  }


  /*\
   * 	Function:	jXMLAttributesCompare
   *	Build Date:	2005-12-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode1 - XML Node Object - Node 1
   *	      		oXNode2 - XML Node Object - Node 2
   *	      		oIgnoreList - Array or String Object - Items to ignore when comparing the attributes
   *	Outputs:	true|false - depending if the attributes match or not
   *
   *	Description:    Compares the names and values (although appears pretty limited) of attributes between 2 nodes
   *                    
   *
   *    Called Functions: jXMLGetAttribute
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLAttributesCompare(oXNode1, oXNode2, oIgnoreList)
  {
    var bSuccess = true;
    var oXAttributeList1, oXAttributeList2;
    var reAttributeCurrName;

    if ( oIgnoreList == null )
    {
      oIgnoreList = "";
    }

    if ( oIgnoreList.constructor == Array )
    {
      oIgnoreList = oIgnoreList.join(ATTRIB_ARRAY_DELIM);
    }
        

    if ( (oXNode1.nodeType == NODE_ELEMENT) && (oXNode2.nodeType == NODE_ELEMENT) )
    {
      oXAttributeList1 = oXNode1.attributes;
      oXAttributeList2 = oXNode2.attributes;

      for ( var i = 0; i < oXAttributeList1.length; i++ )
      {
        reAttributeCurrName = new RegExp("(^|" + ATTRIB_ARRAY_DELIM + ")" + oXAttributeList1.item(i).nodeName + "($|" + ATTRIB_ARRAY_DELIM + ")","i")

        if ( ! reAttributeCurrName.test(oIgnoreList) )
        {
          strAttributeVal2 = jXMLGetAttribute(oXNode2, oXAttributeList1.item(i).nodeName);

          if ( (strAttributeVal2 == null) || (oXAttributeList1.item(i).nodeValue != strAttributeVal2) )
          {
            bSuccess = false;
            i = oXAttributeList1.item(i).length;
          }
          oIgnoreList = oIgnoreList + ATTRIB_ARRAY_DELIM + oXAttributeList1.item(i).nodeName;
        }
      }

      if ( bSuccess )
      { 
        for ( var i = 0; i < oXAttributeList2.length; i++ )
        {
          reAttributeCurrName = new RegExp("(^|" + ATTRIB_ARRAY_DELIM + ")" + oXAttributeList1.item(i).nodeName + "($|" + ATTRIB_ARRAY_DELIM + ")","i")

          if ( ! reAttributeCurrName.test(oIgnoreList) )
          {
            bSuccess = false;
            i = oXAttributeList1.item(i).length;
          }
        }
      }      
    }

    return (bSuccess);
  }


  /*\
   * 	Function:	jXMLMergeAttributes
   *	Build Date:	2005-12-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNodeSrc - XML Node Object - Source Node
   *	      		oXNodeDst - XML Node Object - Destination Node
   *	Outputs:	
   *
   *	Description:    Merge's source Node with Destination Node and updates Attributes on Destination node
   *                    
   *
   *    Called Functions: jXMLGetAttribute
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLMergeAttributes(oXNodeSrc, oXNodeDst)
  {
    var oXAttributeListSrc, oXAttributeListDst, oXAttributeCurrSrc;
    var strAttributeValDst;

    if ( (oXNodeSrc.nodeType == NODE_ELEMENT) && (oXNodeDst.nodeType == NODE_ELEMENT) )
    {
      oXAttributeListSrc = oXNodeSrc.attributes;
      oXAttributeListDst = oXNodeDst.attributes;

      for ( var i = 0; i < oXAttributeListSrc.length; i++ )
      {
        oXAttributeCurrSrc = oXAttributeListSrc.item(i);
        strAttributeValDst = jXMLGetAttribute(oXNodeDst, oXAttributeCurrSrc.nodeName);

        if ( (strAttributeValDst == null) || (oXAttributeCurrSrc.nodeValue != strAttributeValDst) )
        {
          oXNodeDst.setAttribute(oXAttributeCurrSrc.nodeName, oXAttributeCurrSrc.nodeValue);
        }
      }
    }
  }


  /*\
   * 	Function:	jXMLCreateDocument
   *	Build Date:	2005-12-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		strRootElementName - String - Root Element Name of the new document
   *	Outputs:	oXD - XML DOM Object - New XML Document
   *
   *	Description:    Creates a new XML Document
   *                    
   *
   *    Called Functions:
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLCreateDocument(strRootElementName)
  {
    var oXD, oXNode;

    try
    {
      oXD = jXMLMakeDOM(null);
      oXNode = oXD.createProcessingInstruction("xml", "version='1.0'");  
      oXD.appendChild(oXNode);
      oXNode = null;

      oXNode = oXD.createElement(strRootElementName);
      oXD.appendChild(oXNode);
      oXNode = null;
    }
    catch (e)
    {
      WScript.Echo("ERROR (jXMLCreateDocument) : Exception Building DOM file : " + strDocumentName + " : " + e.description);
    }

    return (oXD);
  }


  /*\
   * 	Function:	jXMLSearchNodes
   *	Build Date:	2006-03-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNodeParent - Node Object - Provided a parent node to search on.
   *                    reSearch - Regular Expression Object - used to test against
   *	Outputs:	Node Object of Node where match is found or null if no match is found
   *
   *	Description:    Provided a parent node checks to see if Node name matches the Node Name provided.
   *                    Returns node object for first node found with name
   *                    Recursive function.
   *                    
   *
   *    Called Functions:  jXMLSearchNodes 
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLSearchNodes(oXNodeParent, reSearch)
  {
    var oXNListChildren, oXNListAttributes, oXNodeReturned;

    if (oXNodeParent == null)
    {
      return null;
    }

    // Test current Node Name against the provided Regular Expression
    if ( reSearch.test(oXNodeParent.nodeName) )
    {
      return oXNodeParent;
    }

    // Test Attribute Values on the provided Regular Expression
    oXNListAttributes = oXNodeParent.attributes;

    if ( oXNListAttributes != null )
    {
       for (var i = 0; i < oXNListAttributes.length; i++)
       {
         if ( reSearch.test(oXNListAttributes.item(i).nodeValue) )
         {
           return oXNodeParent;
         }
       }
    }

    // Recurse through Element Child Nodes
    oXNListChildren = oXNodeParent.childNodes;

    if ( oXNListChildren != null )
    {
       for (var i = 0; i < oXNListChildren.length; i++)
       {
         if ( oXNListChildren.item(i).nodeType == NODE_ELEMENT )
         {
           oXNodeReturned = jXMLSearchNodes(oXNListChildren.item(i), reSearch);

           if ( oXNodeReturned != null )
           {
             return oXNodeReturned;
           }
         }
       }
    }

    // Test Node Text
    // must be performed last as this will parse the node's xml (including all children and attributes) as text and overrule any of the above
    if ( reSearch.test(oXNodeParent.text) )
    {
      return oXNodeParent;
    }

    return null;
  }



  /*\
   * 	Function:	jXMLSelectSingleNodeAttribute
   *	Build Date:	2006-03-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXD - XML DOM Object
   *                    strNodePath - String - Node path to search on
   *                    strAttributeName - String - Attribute Name to search for
   *                    reAttributeValue - Regulare Expression object - to match on Attribute Value
   *	Outputs:	Node Object - Node where match is found or null if no match is found
   *
   *	Description:    Searches for a specific Attribute with a specific value
   *                    
   *
   *    Called Functions:  jXMLGetAttribute 
   * 
   *	Version Info:   1.1.0   - replaced selectnodes with direct node passed and a selection of the childnodes 10/09/06 - also renamed from selectsinglenodeattribute to findchildattribute
   *                    1.0.0   - Original version used DOM object and search path to find start nodelist
                        
   *
  \*/

  function jXMLFindChildWithAttribute(oXNodeParent, strAttributeName, reAttributeValue)
  {
    var oXNList = oXNodeParent.childNodes;

    var strAttributeValue;

    for ( var i = 0; i < oXNList.length; i++ )
    {
      strAttributeValue = jXMLGetAttribute(oXNList.item(i), strAttributeName);

      if ( (strAttributeValue != null) && reAttributeValue.test(strAttributeValue) )
      {
        return (oXNList.item(i));
      }
    }
    return null;
  }


  /*\
   * 	Function:	jXMLSelectSingleNodeAttribute
   *	Build Date:	2006-03-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXD - XML DOM Object
   *                    strNodePath - String - Node path to search on
   *                    strAttributeName - String - Attribute Name to search for
   *                    reAttributeValue - Regulare Expression object - to match on Attribute Value
   *	Outputs:	Node Object - Node where match is found or null if no match is found
   *
   *	Description:    Searches for a specific Attribute with a specific value
   *                    
   *
   *    Called Functions:  jXMLGetAttribute 
   * 
   *	Version Info:   1.1.0   - replaced selectnodes with direct node passed and a selection of the childnodes 10/09/06 - also renamed from selectsinglenodeattribute to findchildattribute
   *                    1.0.0   - Original version used DOM object and search path to find start nodelist
                        
   *
  \*/

  function jXMLFindChildrenWithAttribute(oXNodeParent, strAttributeName, reAttributeValue)
  {
    var oXNList = oXNodeParent.childNodes;
    var aNodes = new Array();

    var strAttributeValue;

    for ( var i = 0; i < oXNList.length; i++ )
    {
      strAttributeValue = jXMLGetAttribute(oXNList.item(i), strAttributeName);

      if ( (strAttributeValue != null) && reAttributeValue.test(strAttributeValue) )
      {
        aNodes.push(oXNList.item(i));
      }
    }

    return aNodes;
  }


  /*\
   * 	Function:	jXMLSelectSingleNode
   *	Build Date:	2006-03-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNodeParent - XML Node (Parent Node) 
   *                    strNodeName - Name of to select
   *	Outputs:	Node Object
   *
   *	Description:    Provided a parent node checks to see if Node name matches the Node Name provided.
   *                    Returns node object for first node found with name
   *                     
   *                    Replaces MSXML 3.0 selectSingleNode - allowing you to provide a start node to search on instead of always using the base DOM
   *
   *    Called Functions:  jXMLSelectNodes 
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLSelectSingleNode(oXNodeParent, strNodeName)
  {
    var oXNListChildren, oXNodeReturned;

    if (oXNodeParent == null)
    {
      return null;
    }

    if ( oXNodeParent.nodeName == strNodeName )
    {
      return oXNodeParent;
    }

    oXNListChildren = oXNodeParent.childNodes;

    if ( oXNListChildren != null )
    {
       for (var i = 0; i < oXNListChildren.length; i++)
       {
         if ( oXNListChildren.item(i).nodeType == NODE_ELEMENT )
         {
           oXNodeReturned = jXMLSelectSingleNode(oXNListChildren.item(i), strNodeName);

           if ( oXNodeReturned != null )
           {
             return oXNodeReturned;
           }
         }
       }
    }

    return null;
  }


  /*\
   * 	Function:	jXMLSelectNodes
   *	Build Date:	2006-03-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNodeParent - XML Node (Parent Node) 
   *                    strNodeName - Name of to select
   *                    aFoundNodes - Array of Node Objects that have been found with the matching name
   *	Outputs:	
   *
   *	Description:    Seed function to below jXMLSelectNodes (creates array and used to kick off search)
   *                    Provided a parent node checks to see if Node name matches the Node Name provided.
   *                    Function is recursive and will call itself to search all child nodes.
   * 
   *                    Replaces MSXML 3.0 selectNodes - allowing you to provide a start node to search on instead of always using the base DOM
   *
   *    Called Functions:  jXMLSelectNodes 
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLSelectNodes(oXNodeParent, strNodeName)
  {
    var oXNListChildren, oXNodeReturned;

    var aFoundNodes = new Array();

    if (oXNodeParent == null)
    {
      return null;
    }

    if ( oXNodeParent.nodeName == strNodeName )
    {
      return aFoundNodes.push(oXNodeParent);
    }

    oXNListChildren = oXNodeParent.childNodes;

    if ( oXNListChildren != null )
    {
      for (var i = 0; i < oXNListChildren.length; i++)
      {
        if ( oXNListChildren.item(i).nodeType == NODE_ELEMENT )
        {
          aFoundNodes = jXMLSelectNodes(oXNListChildren.item(i), strNodeName, aFoundNodes);
        }
      }
    }

    return aFoundNodes;
  }


  /*\
   * 	Function:	jXMLSelectNodes
   *	Build Date:	2006-03-??
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNodeParent - XML Node (Parent Node) 
   *                    strNodeName - Name of to select
   *                    aFoundNodes - Array of Node Objects that have been found with the matching name
   *	Outputs:	
   *
   *	Description:    Provided a parent node checks to see if Node name matches the Node Name provided.
   *                    Function is recursive and will call itself to search all child nodes.
   *                    ALWAYS USE THE ABOVE PREVIOUS jXMLSelectNodes TO BEGIN THE SEARCH
   * 
   *                    Replaces MSXML 3.0 selectNodes - allowing you to provide a start node to search on instead of always using the base DOM
   *
   *    Called Functions:  jXMLSelectNodes 
   * 
   *	Version Info:
   *                    1.0.0   - 
   *
  \*/

  function jXMLSelectNodes(oXNodeParent, strNodeName, aFoundNodes)
  {
    var oXNListChildren, oXNListAttributes, oXNodeReturned;

    if (oXNodeParent == null)
    {
      return null;
    }

    if ( oXNodeParent.nodeName == strNodeName )
    {
      aFoundNodes.push(oXNodeParent);
    }

    oXNListChildren = oXNodeParent.childNodes;

    if ( oXNListChildren != null )
    {
      for (var i = 0; i < oXNListChildren.length; i++)
      {
        if ( oXNListChildren.item(i).nodeType == NODE_ELEMENT )
        {
          aFoundNodes = jXMLSelectNodes(oXNListChildren.item(i), strNodeName, aFoundNodes);
        }
      }
    }

    return aFoundNodes;
  }


  /*\
   * 	Function:	jXMLReduceChildNodes
   *	Build Date:	2006-08-13
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNodeParent - XML Node (Parent Node) 
   *                    strAttributeName - Name of attribute to reduce upon (case insensitive)
   *                    strAttributeValue - string Value to check on (if missing node is removed) (note can be one of many in a ATTRIB_ARRAY_DELIM deliminted array)
   *	Outputs:	
   *
   *	Description:    Provided a parent node all child nodes with the provided attribute name and value (can be inclusive of an value array) if value is missing it is removed.
   *                    If the negative of the value is found then the node is removed.
   *                    If the attribute does not exist the node is not removed.
   *                    Function is recursive and will call itself on all non-removed nodes.
   *
   *
   *    Called Functions:  jXMLGetAttribute, jXMLReduceChildNodes 
   * 
   *	Version Info:
   *                    1.1.0   - 20060820 - Added Numeric range support
   *                    1.0.0   - 20060813 - First working version
   *
  \*/

  function jXMLReduceChildNodes(oXNodeParent, strAttributeName, strAttributeValue)
  {
    var oXNListChildren;

    var strMatchedAttributeValue;

    var aFoundNodes = new Array();
    
    var aNumberRanges;
    
    var numHighValue, numLowValue;
    
    var reAttributeValue = new RegExp("(^|" + ATTRIB_ARRAY_DELIM + ")" + strAttributeValue +  "(" + ATTRIB_ARRAY_DELIM + "|$)","i");

    var reNegAttributeValue = new RegExp("(^|" + ATTRIB_ARRAY_DELIM + ")\\-" + strAttributeValue +  "(" + ATTRIB_ARRAY_DELIM + "|$)","i");
    
    var reRangedNumberValue = new RegExp("(^|" + ATTRIB_ARRAY_DELIM + ")\\d*\\" + ATTRIB_RANGE_DELIM +  "\\d*(" + ATTRIB_ARRAY_DELIM + "|$)","i");

    var bFoundInRange = false;

    if (oXNodeParent == null)
    {
      return null;
    }

    oXNListChildren = oXNodeParent.childNodes;

    if ( oXNListChildren != null )
    {
      for (var i = 0; i < oXNListChildren.length; i++)
      {
        if ( oXNListChildren.item(i).nodeType == NODE_ELEMENT )
        {   
          strMatchedAttributeValue = jXMLGetAttribute(oXNListChildren.item(i), strAttributeName);
          
          bFoundInRange = false;
          
          // Handle a Ranged Attribute Value if a valid Attribute is found and the value to is being searched for is a number
          if ( (strMatchedAttributeValue != null) && 
               /^\d+$/.test(strAttributeValue) &&
               reRangedNumberValue.test(strMatchedAttributeValue) )
          {
            aNumberRanges = strMatchedAttributeValue.split(ATTRIB_ARRAY_DELIM);
           
            for (var j=0; j < aNumberRanges.length; j++)
            {
              if ( reRangedNumberValue.test(aNumberRanges[j]) )
              {
                numLowValue = null;
                numHighValue = null;

                // Handle Ranges with no lower number defined
                if ( /^:$/.test(aNumberRanges[j]) )
                {
                  numLowValue = Number.MIN_VALUE;
                  numHighValue = Number.MAX_VALUE;
                }

                // Handle Ranges with no lower number defined
                else if ( /^:\d+$/.test(aNumberRanges[j]) )
                {
                  numLowValue = Number.MIN_VALUE;
                  numHighValue = aNumberRanges[j].replace(ATTRIB_RANGE_DELIM, "");
                }
              
                // Handle Ranges with no upper number defined
                else if ( /:$/.test(aNumberRanges[j]) )
                {
                  numLowValue = aNumberRanges[j].replace(ATTRIB_RANGE_DELIM, "");
                  numHighValue = Number.MAX_VALUE;
                }
              
                else
                {
                  numLowValue = aNumberRanges[j].split(ATTRIB_RANGE_DELIM)[0];
                  numHighValue = aNumberRanges[j].split(ATTRIB_RANGE_DELIM)[1];
                }

                // convert ranges into array of hish and low values
                if ( (numLowValue <= strAttributeValue) &&
                     (strAttributeValue <= numHighValue) )
                {
                  bFoundInRange = true;
                  j = aNumberRanges.length;
                }
              }
            }
          }
    
          // if a matching attribute was found and 
          //    it is not found in a range and
          //   (
          //     the searched for attributes value is not found in the matching attributes value(s) 
          //   or
          //     the searched for attributes value negatition (vlue preceeded by a -) is found in the matching attributes value(s)
          //   )
          // then delete the node
          if ( (strMatchedAttributeValue != null) &&
               ! (bFoundInRange) &&
               (! reAttributeValue.test(strMatchedAttributeValue) ||
                reNegAttributeValue.test(strMatchedAttributeValue) ) )
          {
            oXNodeParent.removeChild(oXNListChildren.item(i--));
          }
           // else recurse into child
          else
          {
            jXMLReduceChildNodes(oXNListChildren.item(i), strAttributeName, strAttributeValue);
          }
        }
      }
    }
    return (null);
  }

  /*\
   * 	Function:	jXMLEF2INIFile
   *	Build Date:	2006-09-10
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node (Parent Node)
   *	Outputs:	
   *
   *	Description:  Writes or appends to an existing INI file - XML in Element Format
   *
   *
   *    Called Functions:  jXMLSelectSingleNode, jXMLSelectNodes, jHelpReplaceVarsInStr 
   * 
   *	Version Info:   
   *                    1.1.0   - 20061014 - Added support for "TEXTONLYNODE"s
   *                    1.0.0   - 20060910 - First working version
   *
  \*/

  function jXMLEF2INIFile(oXNode)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    
    var oXD = oXNode.ownerDocument;

    var oXNodeFileContents = jXMLSelectSingleNode(oXNode, "FILECONTENTS");

    var oFile = oFS.OpenTextFile(jHelpReplaceVarsInStr(oXD, jXMLSelectSingleNode(oXNode, "FILENAME").text), 8, true);

    var oXNListChildren1, oXNListChildren2;

    var strTextOnly;
    
    if ( (oXNodeFileContents != null) && (oXNodeFileContents.nodeType == NODE_ELEMENT) )
    {
      oXNListChildren1 = oXNodeFileContents.childNodes;

      if ( oXNListChildren1 != null )
      {
        for (var i = 0; i < oXNListChildren1.length; i++)
        {
          if ( oXNListChildren1.item(i).nodeType == NODE_ELEMENT )
          {
            oFile.WriteLine("[" + oXNListChildren1.item(i).nodeName + "]");
            oXNListChildren2 = oXNListChildren1.item(i).childNodes;         
          
            if ( oXNListChildren2 != null )
            {
              for (var j = 0; j < oXNListChildren2.length; j++)
              {
                if ( oXNListChildren2.item(j).nodeType == NODE_ELEMENT )
                {
                  strTextOnly = oXNListChildren2.item(j).getAttribute("TEXTNODEONLY");
                  if ( /true/i.test(strTextOnly) )
                  {
                    oFile.WriteLine(oXNListChildren2.item(j).text);
                  }
                  else
                  {
                    oFile.WriteLine(oXNListChildren2.item(j).nodeName + "=" + oXNListChildren2.item(j).text);
                  }
                }
              }
            }         
            oFile.WriteLine();
          }
        }
      }
    }

    oFile.Close();        
  }
  


  /*\
   * 	Function:	jXMLAF2INIFile
   *	Build Date:	2006-10-11
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node (Parent Node)
   *	Outputs:	
   *
   *	Description:  Writes or appends to an existing INI file - XML in Attribute Format (harder to read but allows a way to get around XML Element name limitations)
   *
   *
   *    Called Functions:  jXMLSelectSingleNode, jXMLSelectNodes, jHelpReplaceVarsInStr 
   * 
   *	Version Info:
   *                    1.0.0   - 20061011 - First working version - Only sections and kvp's supported (no comments, no single item lines)
   *
  \*/

  function jXMLAF2INIFile(oXNodeParent)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");

    if ( oXNodeParent == null ) return null;

    var oXD = oXNodeParent.ownerDocument;

    var oFile = oFS.OpenTextFile(jHelpReplaceVarsInStr(oXD, oXNodeParent.getAttribute("FILENAME")), 8, true);


    var oXNListChildren1, oXNListChildren2;
    
    if ( oXNodeParent.nodeType == NODE_ELEMENT )
    {
      oXNListChildren1 = oXNodeParent.childNodes;

      if ( oXNListChildren1 != null )
      {
        for (var i = 0; i < oXNListChildren1.length; i++)
        {
          if ( oXNListChildren1.item(i).nodeType == NODE_ELEMENT )
          {
            oFile.WriteLine("[" + oXNListChildren1.item(i).getAttribute("NAME") + "]");
            oXNListChildren2 = oXNListChildren1.item(i).childNodes;         
          
            if ( oXNListChildren2 != null )
            {
              for (var j = 0; j < oXNListChildren2.length; j++)
              {
                if ( oXNListChildren2.item(j).nodeType == NODE_ELEMENT )
                {
                  oFile.WriteLine(oXNListChildren2.item(j).getAttribute("KEY") + "=" + oXNListChildren2.item(j).getAttribute("VALUE"));
                }
              }
            }         
            oFile.WriteLine();
          }
        }
      }
    }

    oFile.Close();        
  }
  
    
  /*\
   * 	Function:	jXML2FlatFile
   *	Build Date:	2006-09-10
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node (Parent Node)
   *	Outputs:	
   *
   *	Description:  Writes or appends to an existing flat file
   *
   *
   *    Called Functions:  jXMLSelectSingleNode, jXMLSelectNodes, jHelpReplaceVarsInStr 
   * 
   *	Version Info:
   *                    1.0.0   - 20060910 - First working version
   *
  \*/

  function jXML2FlatFile(oXNode)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var oXD = oXNode.ownerDocument;
    var aXNodesFileContents = jXMLSelectNodes(jXMLSelectSingleNode(oXNode, "FILECONTENTS"), "LINE");
    var oFile = oFS.OpenTextFile(jHelpReplaceVarsInStr(oXD, jXMLSelectSingleNode(oXNode, "FILENAME").text), 8, true);
        
    for ( var i = 0; i < aXNodesFileContents.length; i++ )
    {
      oFile.WriteLine(aXNodesFileContents[i]);
    }
    
    oFile.close();
  }


  /*\
   * 	Function:	jXMLDelNode
   *	Build Date:	2006-10-13
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node to Delete
   *	Outputs:	bSuccess - True if node deleted; False if node not deleted
   *
   *	Description:    Deletes the specified Node if parent exists.
   *
   *
   *    Called Functions:  
   * 
   *	Version Info:
   *                    1.0.0   - 20061013 - First working version
   *
  \*/

  function jXMLDelNode(oXNode)
  {
    var bSuccess = false;
    var oXNodeParent;

    if (oXNode != null)
    {
      oXNodeParent = oXNode.parentNode;
      if ( oXNodeParent != null )
      {
        oXNodeParent.removeChild(oXNode);
        bSuccess = true;
      }
    }

    return (bSuccess);
  }

  /*\
   * 	Function:	jXMLDelChildren
   *	Build Date:	2006-10-13
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node Parent of children to delete
   *	Outputs:	bSuccess - True if deleted any children; False if no children deleted
   *
   *	Description:    Deletes all Children of the specified node
   *
   *
   *    Called Functions:  
   * 
   *	Version Info:
   *                    1.0.0   - 20061013 - First working version
   *
  \*/

  function jXMLDelChildren(oXNode)
  {
    var bSuccess = false;
    var oXNListChildren;

    if (oXNode != null)
    {
      oXNListChildren = oXNode.childNodes;

      if ( oXNListChildren != null )
      {
        while (oXNListChildren.length > 0)
        {
          oXNode.removeChild(oXNListChildren.item(0));
          bSuccess = true;
        }
      }
    }

    return (bSuccess);
  }


  /*\
   * 	Function:	jXMLDelAttributes
   *	Build Date:	2006-10-13
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node with attributes to delete
   *	Outputs:	bSuccess - True if deleted any attributes; False if no attributes deleted
   *
   *	Description:    Deletes the all attributes for the specified node
   *
   *
   *    Called Functions:  
   * 
   *	Version Info:
   *                    1.0.0   - 20061013 - First working version
   *
  \*/

  function jXMLDelAttributes(oXNode)
  {
    var bSuccess = false;
    var oXAttributes;

    if (oXNode != null)
    {
      oXAttributes = oXNode.attributes;

      if ( oXAttributes != null )
      {
        while (oXAttributes.length > 0)
        {
          oXNode.removeAttributeNode(oXAttributes.item(0));
          bSuccess = true;
        }
      }
    }

    return (bSuccess);
  }


  /*\
   * 	Function:	jXMLCleanNode
   *	Build Date:	2006-10-13
   *    Written by:	Richard Campbell
   *
   *	Inputs:		oXNode - XML Node to Clean
   *	Outputs:	bSuccess - True if deleted any attributes; False if no attributes deleted
   *
   *	Description:    Deletes all children and attributes of the specified node
   *
   *
   *    Called Functions:  
   * 
   *	Version Info:
   *                    1.0.0   - 20061013 - First working version
   *
  \*/

  function jXMLCleanNode(oXNode)
  {
    return (jXMLDelChildren(oXNode) && jXMLDelAttributes(oXNode));
  }