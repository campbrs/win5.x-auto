  // Define Constants

  // Base Keys
  HKCR=0x80000000;      //HKEY_CLASSES_ROOT
  HKCU=0x80000001;      //HKEY_CURRENT_USER
  HKLM=0x80000002;      //HKEY_LOCAL_MACHINE
  HKU=0x80000003;       //HKEY_USERS
  HKCC=0x80000005;      //HKEY_CURRENT_CONFIG

  // Value Types
  REG_SZ=1;
  REG_EXPAND_SZ=2;
  REG_BINARY=3;
  REG_DWORD=4;
  REG_DWORD_BIG_ENDIAN=5;
  REG_LINK=6;
  REG_MULTI_SZ=7;
  REG_RESOURCE_LIST=8;
  REG_FULL_RESOURCE_DESCRIPTOR=9;
  REG_RESOURCE_REQUIREMENTS_LIST=10;
  REG_QWORD=11;


  function jRegType2Str(numType)
  {
    if ( (numType == null) || (numType.constructor!= Number) )
      return numType;
     
    switch (numType)
    {
      case REG_SZ :
        return "REG_SZ";
        break;

      case REG_EXPAND_SZ :
        return "REG_EXPAND_SZ";
        break;

      case REG_BINARY :
        return "REG_BINARY";
        break;

      case REG_DWORD :
        return "REG_DWORD";
        break;

      case REG_DWORD_BIG_ENDIAN :
        return "REG_DWORD_BIG_ENDIAN";
        break;

      case REG_LINK :
        return "REG_LINK";
        break;

      case REG_MULTI_SZ :
        return "REG_MULTI_SZ";
        break;

      case REG_RESOURCE_LIST :
        return "REG_RESOURCE_LIST";
        break;

      case REG_FULL_RESOURCE_DESCRIPTOR :
        return "REG_FULL_RESOURCE_DESCRIPTOR";
        break;

      case REG_RESOURCE_REQUIREMENTS_LIST :
        return "REG_RESOURCE_REQUIREMENTS_LIST";
        break;

      case REG_QWORD :
        return "REG_QWORD";
        break;

      default:
        return numType;
    }
  }

  function jRegType2Num(strType)
  {
    if ( (numType == null) || (numType.constructor!= String) )
      return strType;
     
    switch (strType)
    {
      case "REG_SZ" :
        return REG_SZ;
        break;

      case "REG_EXPAND_SZ" :
        return REG_EXPAND_SZ;
        break;

      case "REG_BINARY" :
        return REG_BINARY;
        break;

      case "REG_DWORD" :
        return REG_DWORD;
        break;

      case "REG_DWORD_BIG_ENDIAN" :
        return REG_DWORD_BIG_ENDIAN;
        break;

      case "REG_LINK" :
        return REG_LINK;
        break;

      case "REG_MULTI_SZ" :
        return REG_MULTI_SZ;
        break;

      case "REG_RESOURCE_LIST" :
        return REG_RESOURCE_LIST;
        break;

      case "REG_FULL_RESOURCE_DESCRIPTOR" :
        return REG_FULL_RESOURCE_DESCRIPTOR;
        break;

      case "REG_RESOURCE_REQUIREMENTS_LIST" :
        return REG_RESOURCE_REQUIREMENTS_LIST;
        break;

      case "REG_QWORD" :
        return REG_QWORD;
        break;

      default:
        return numType;
    }
  }

  /*\
   * 	Function:	enumRegKey
   *	Build Date:	2005/05
   *  Written by:	Richard Campbell
   *
   *	Inputs:		wmiService			- WMI Service object - Parent WMI Object
   *              hDefKey				- Hex Integer - code for base Registry Key (i.e HKLM = 0x80000002, etc) - define this as consts at beginning of script
   *				sKeyName			- String - name of key 
   *	Outputs:	Sub Key Names		- Array of Strings - Array of Sub Keys from the provided Key
   *
   *	Description:	Returns a list of all sub keys of a provided key
   *
   *	Version Info:	1.2.0	- 2005/05/07 - Commented original code
   *	                1.1.0	- 2005/05/07 - Commented original code
   *			1.0.0	- 2004/11    - developed in jscript used to hardcode DHCP network config into Static network config
   *
  \*/

  function jRegEnumKeys(strComputerName, cBaseKey, strSubKeyName) 
  {
    var oReg, oMethod, oInParam, oOutParam;
    var aKeys = null;

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");
    oMethod = oReg.Methods_.Item("EnumKey");

    oInParam = oMethod.InParameters.SpawnInstance_();
    oInParam.hDefKey = cBaseKey;
    oInParam.sSubKeyName = strSubKeyName;
    oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

    if ( oOutParam.sNames != null )
      aKeys = oOutParam.sNames.toArray();

    // Clean up
    oOutParam = null;
    oInParam = null;
    oMethod = null;
    oReg = null;

    return aKeys;
  }

  /*\
   * 	Function:	jRegGetValue
   *	Build Date:	2005/05
   *  Written by:	Richard Campbell
   *
   *	Inputs:		wmiService			- WMI Service object - Parent WMI Object
   *              methodName			- String - name of WMI Rgistry method we would like to use (i.e. GetMultiString, GetStringValue, etc)
   *              hDefKey				- Hex Integer - code for base Registry Key (i.e HKLM = 0x80000002, etc) - define this as consts at beginning of script
   *				sKeyName			- String - name of key 
   *				sValueName			- String - name of Value to get
   *	Outputs:	Multiple			- Varies - Returns the Value of the specified registery entry either an unsigned Integer, a String, or an Array of Strings
   *
   *	Description:	Gets the Value from the defined Key
   *
   *	Version Info:	1.1.0	- 2005/05/07 - Commented original code
   *			        1.0.0	- 2004/11    - developed in jscript used to hardcode DHCP network config into Static network config
   *
  \*/

  function jRegGetValue(strComputerName, cBaseKey, strSubKeyName, strValueName, cType) 
  {
    var oReg, oMethod, oInParam, oOutParam;

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");

    switch(cType)
    {
      case REG_SZ :
        oMethod = oReg.Methods_.Item("GetStringValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        return oOutParam.sValue;
        break;

      case REG_EXPAND_SZ :
        oMethod = oReg.Methods_.Item("GetExpandedStringValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        return oOutParam.sValue;
        break;

      case REG_BINARY :
        oMethod = oReg.Methods_.Item("GetBinaryValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        if ( oOutParam.uValue != null )
          return oOutParam.uValue.toArray();
        break;

      case REG_DWORD :
        oMethod = oReg.Methods_.Item("GetDWORDValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        return oOutParam.uValue;
        break;

      case REG_DWORD_BIG_ENDIAN :
        oMethod = oReg.Methods_.Item("GetDWORDValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        return oOutParam.uValue;
        break;

      case REG_LINK :
        break;

      case REG_MULTI_SZ :
        oMethod = oReg.Methods_.Item("GetMultiStringValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        if ( oOutParam.sValue != null )
          return oOutParam.sValue.toArray();
        break;

      case REG_RESOURCE_LIST :
        break;

      case REG_FULL_RESOURCE_DESCRIPTOR :
        break;

      case REG_RESOURCE_REQUIREMENTS_LIST :
        break;

      case REG_QWORD :
        oMethod = oReg.Methods_.Item("GetQWORDValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        return oOutParam.uValue;
        break;

      default :
    }

    return null;
  }

  /*\
   * 	Function:	jRegEnumValues
   *	Build Date:	2005/10
   *  Written by:	Richard Campbell
   *
   *	Inputs:		wmiService			- WMI Service object - Parent WMI Object
   *              hDefKey				- Hex Integer - code for base Registry Key (i.e HKLM = 0x80000002, etc) - define this as consts at beginning of script
   *				sKeyName			- String - name of key 
   *	Outputs:	Sub Key Names		- Array of Strings - Array of Sub Keys from the provided Key
   *
   *	Description:	Returns a list of all sub keys of a provided key
   *
   *	Version Info:	1.2.0	- 2005/05/07 - Commented original code
   *	                1.1.0	- 2005/05/07 - Commented original code
   *			1.0.0	- 2004/11    - developed in jscript used to hardcode DHCP network config into Static network config
   *
  \*/

  function jRegEnumValues(strComputerName, cBaseKey, strSubKeyName) 
  {
    var oReg, oMethod, oInParam, oOutParam;
    var aNames, aTypes, aValues;
    var oTemp;
    var aEnumData = new Array();

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");
    oMethod = oReg.Methods_.Item("EnumValues");

    oInParam = oMethod.InParameters.SpawnInstance_();
    oInParam.hDefKey = cBaseKey;
    oInParam.sSubKeyName = strSubKeyName;
    oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

    if ( oOutParam.sNames == null )
      return null;

    aNames = oOutParam.sNames.toArray();
    aTypes = oOutParam.Types.toArray();

    for (var i = 0; i < aNames.length; i++)
    {
      oTemp = new Object();
      oTemp["Name"] = aNames[i];
      oTemp["Type"] = aTypes[i];
      oTemp["Value"] = jRegGetValue(strComputerName, cBaseKey, strSubKeyName, aNames[i], aTypes[i]);

      aEnumData.push(oTemp);
    }

    // Clean up
    oTemp = null;
    aNames = null;
    aTypes = null;
    oOutParam = null;
    oInParam = null;
    oMethod = null;
    oReg = null;

    return aEnumData;
  }

  /*\
   * 	Function:	jRegEnumValuesSimplistic
   *	Build Date:	2006/03
   *    Written by:	Richard Campbell
   *
   *	Inputs:
   *	Outputs:
   *
   *	Description:    Similar to jRegEnumValues - but type info is not stored and not in
   *
   *	Version Info:
   *
  \*/

  function jRegEnumValuesSimplistic(strComputerName, cBaseKey, strSubKeyName) 
  {
    var oReg, oMethod, oInParam, oOutParam;
    var aNames, aTypes, aValues;
    var oEnumValues;

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");
    oMethod = oReg.Methods_.Item("EnumValues");

    oInParam = oMethod.InParameters.SpawnInstance_();
    oInParam.hDefKey = cBaseKey;
    oInParam.sSubKeyName = strSubKeyName;
    oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

    if ( oOutParam.sNames == null )
      return null;

    aNames = oOutParam.sNames.toArray();
    aTypes = oOutParam.Types.toArray();

    oEnumValues = new Object();

    for (var i = 0; i < aNames.length; i++)
    {
      oEnumValues[aNames[i]] = jRegGetValue(strComputerName, cBaseKey, strSubKeyName, aNames[i], aTypes[i]);
    }

    // Clean up
    aNames = null;
    aTypes = null;
    oOutParam = null;
    oInParam = null;
    oMethod = null;
    oReg = null;

    return oEnumValues;
  }


  /*\
   * 	Function:	jRegEnumValues
   *	Build Date:	2005/10
   *  Written by:	Richard Campbell
   *
   *	Inputs:		wmiService			- WMI Service object - Parent WMI Object
   *              hDefKey				- Hex Integer - code for base Registry Key (i.e HKLM = 0x80000002, etc) - define this as consts at beginning of script
   *				sKeyName			- String - name of key 
   *	Outputs:	Sub Key Names		- Array of Strings - Array of Sub Keys from the provided Key
   *
   *	Description:	Returns a list of all sub keys of a provided key
   *
   *	Version Info:	1.2.0	- 2005/05/07 - Commented original code
   *	                1.1.0	- 2005/05/07 - Commented original code
   *			1.0.0	- 2004/11    - developed in jscript used to hardcode DHCP network config into Static network config
   *
  \*/

  function jRegSearch(strComputerName, cBaseKey, strSubKeyName, strSearch)
  {
    var aKeys, aValues;
    var strFound = null;
    var regSearch = new RegExp(strSearch,"i");

    aValues = jRegEnumValues(strComputerName, cBaseKey, strSubKeyName);

    if (aValues != null)
    {
      for (var i = 0; i < aValues.length; i++)
      {
        if ( regSearch.test(aValues[i]["Value"]) || regSearch.test(aValues[i]["Name"]) )
        {
          return (strSubKeyName + "\\" + aValues[i]["Name"]);
        }
      }
    }

    aKeys = jRegEnumKeys(strComputerName, cBaseKey, strSubKeyName);

    if (aKeys != null)
    {
      for (var i = 0; i < aKeys.length; i++)
      {
        if ( regSearch.test(aKeys[i]) )
        {
          return (strSubKeyName + "\\" + aKeys[i]);
        }
        else
        {
          strFound = jRegSearch(strComputerName, cBaseKey, (strSubKeyName + "\\" + aKeys[i]), strSearch);
        }
        if ( strFound != null )
        {
          return (strFound);
        }
      }
    }
    return (null);
  }


  function jRegSetValue(strComputerName, cBaseKey, strSubKeyName, strValueName, cType, xValue)
  {
    var oReg, oMethod, oInParam, oOutParam = null;

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");

    switch(cType)
    {
      case REG_SZ :
        oMethod = oReg.Methods_.Item("SetStringValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oInParam.sValue = xValue;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        break;

      case REG_EXPAND_SZ :
        oMethod = oReg.Methods_.Item("SetExpandedStringValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oInParam.sValue = xValue;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        break;

      case REG_BINARY :
        oMethod = oReg.Methods_.Item("SetBinaryValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oInParam.uValue = xValue.split(",");
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        break;

      case REG_DWORD :
        oMethod = oReg.Methods_.Item("SetDWORDValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oInParam.uValue = xValue;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        break;

      case REG_DWORD_BIG_ENDIAN :
        oMethod = oReg.Methods_.Item("SetDWORDValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oInParam.uValue = xValue;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        break;

      case REG_LINK :
        break;

      case REG_MULTI_SZ :
        oMethod = oReg.Methods_.Item("SetMultiStringValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oInParam.sValue = xValue.split(",");
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        break;

      case REG_RESOURCE_LIST :
        break;

      case REG_FULL_RESOURCE_DESCRIPTOR :
        break;

      case REG_RESOURCE_REQUIREMENTS_LIST :
        break;

      case REG_QWORD :
        oMethod = oReg.Methods_.Item("SetQWORDValue");
        oInParam = oMethod.InParameters.SpawnInstance_();
        oInParam.hDefKey = cBaseKey;
        oInParam.sSubKeyName = strSubKeyName;
        oInParam.sValueName = strValueName;
        oInParam.uValue = xValue;
        oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);
        break;

      default :
    }

    // Clean up
    oInParam = null;
    oMethod = null;
    oReg = null;

    return oOutParam;
  }

  function jRegCreateKey(strComputerName, cBaseKey, strSubKeyName)
  {
    var oReg, oMethod, oInParam, oOutParam;
    var oOutput;

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");

    oMethod = oReg.Methods_.Item("CreateKey");
    oInParam = oMethod.InParameters.SpawnInstance_();
    oInParam.hDefKey = cBaseKey;
    oInParam.sSubKeyName = strSubKeyName;
    oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

    // Clean up
    oInParam = null;
    oMethod = null;
    oReg = null;

    return oOutParam;
  }

  function jRegDeleteKey(strComputerName, cBaseKey, strSubKeyName)
  {
    var oReg, oMethod, oInParam, oOutParam;

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");

    oMethod = oReg.Methods_.Item("DeleteKey");
    oInParam = oMethod.InParameters.SpawnInstance_();
    oInParam.hDefKey = cBaseKey;
    oInParam.sSubKeyName = strSubKeyName;
    oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

    // Clean up
    oInParam = null;
    oMethod = null;
    oReg = null;

    return oOutParam;
  }

  function jRegDeleteValue(strComputerName, cBaseKey, strSubKeyName, strValueName)
  {
    var oReg, oMethod, oInParam, oOutParam;
    var oOutput;

    oReg=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + strComputerName + "\\root\\default:StdRegProv");

    oMethod = oReg.Methods_.Item("DeleteValue");
    oInParam = oMethod.InParameters.SpawnInstance_();
    oInParam.hDefKey = cBaseKey;
    oInParam.sSubKeyName = strSubKeyName;
    oInParam.sValueName = strValueName;
    oOutParam = oReg.ExecMethod_(oMethod.Name, oInParam);

    // Clean up
    oInParam = null;
    oMethod = null;
    oReg = null;

    return oOutParam;
  }

  function jReg2XML(strComputerName, cBaseKey, strSubKeyName, oXNodeParent)
  {
    var aKeys, aValues;
    var oXD = oXNodeParent.ownerDocument;
    var oXNodeChild;
    

    aValues = jRegEnumValues(strComputerName, cBaseKey, strSubKeyName);

    if (aValues != null)
    {
      for (var i = 0; i < aValues.length; i++)
      {
        if ( aValues[i]["Value"] == null )
        {
          oXNodeChild = oXD.createElement("REG_VALUE");
          oXNodeChild.setAttribute("NAME", aValues[i]["Name"]);
          oXNodeChild.setAttribute("TYPE", jRegType2Str(aValues[i]["Type"]));
          oXNodeChild.text = "";
          oXNodeParent.appendChild(oXNodeChild);
          oXNodeChild = null;
        }
        else if ( aValues[i]["Value"].constructor == Array )
        {
          for (var j = 0; j < aValues[i]["Value"].length; j++)
          {
            oXNodeChild = oXD.createElement("REG_VALUE");
            oXNodeChild.setAttribute("NAME", aValues[i]["Name"]);
            oXNodeChild.setAttribute("TYPE", jRegType2Str(aValues[i]["Type"]));
            oXNodeChild.setAttribute("INDEX", j);
            oXNodeChild.text = aValues[i]["Value"][j];
            oXNodeParent.appendChild(oXNodeChild);
            oXNodeChild = null;    
          }
        }
        else
        {
          oXNodeChild = oXD.createElement("REG_VALUE");
          oXNodeChild.setAttribute("NAME", aValues[i]["Name"]);
          oXNodeChild.setAttribute("TYPE", jRegType2Str(aValues[i]["Type"]));
          oXNodeChild.text = aValues[i]["Value"];
          oXNodeParent.appendChild(oXNodeChild);
          oXNodeChild = null;
        }
      }
    }

    aKeys = jRegEnumKeys(strComputerName, cBaseKey, strSubKeyName);

    if (aKeys != null)
    {
      for (var i = 0; i < aKeys.length; i++)
      {
        oXNodeChild = oXD.createElement("REG_KEY");
        oXNodeChild.setAttribute("NAME", aKeys[i]);
        oXNodeParent.appendChild(oXNodeChild);
        jReg2XML(strComputerName, cBaseKey, strSubKeyName + "\\" + aKeys[i], oXNodeChild);
        oXNodeChild = null;
      }
    }

    // Clean up
    aKeys = null;
    aValues = null;
  }

  function jRegTestObject()
  {
    var strComputerName = "localhost";
    var cBaseKey = HKLM;

    // create test keys
    jRegCreateKey(strComputerName, cBaseKey, "SOFTWARE\\testkey");
    jRegCreateKey(strComputerName, cBaseKey, "SOFTWARE\\testkey\\test1");
    jRegCreateKey(strComputerName, cBaseKey, "SOFTWARE\\testkey\\test1\\test1.1");
    jRegCreateKey(strComputerName, cBaseKey, "SOFTWARE\\testkey\\test2");

    // Create Test Values
    jRegSetValue(strComputerName, cBaseKey, "SOFTWARE\\testkey", "t1", REG_SZ, "Word");
    jRegSetValue(strComputerName, cBaseKey, "SOFTWARE\\testkey", "t2", REG_EXPAND_SZ, "To %path%");
    jRegSetValue(strComputerName, cBaseKey, "SOFTWARE\\testkey", "t3", REG_MULTI_SZ, "test1,test2,test3");
    jRegSetValue(strComputerName, cBaseKey, "SOFTWARE\\testkey", "t4", REG_DWORD, 256);
    jRegSetValue(strComputerName, cBaseKey, "SOFTWARE\\testkey", "t5", REG_BINARY, "13,8");

    jRegSetValue(strComputerName, cBaseKey, "SOFTWARE\\testkey\\test2", "t1", REG_SZ, "Word");

    // Search for key
    if ( jRegSearch("localhost", HKLM, "SOFTWARE\\testkey", "test1.1") != "SOFTWARE\\testkey\\test1\\test1.1" )
    {
      WScript.Echo ("ERROR (jlibRegistry:jRegTestObject) : Failed to find key!!");
      return false;
    }

    // Search for Value Name
    if ( jRegSearch("localhost", HKLM, "SOFTWARE\\testkey", "t1") != "SOFTWARE\\testkey\\t1" )
    {
      WScript.Echo ("ERROR (jlibRegistry:jRegTestObject) : Failed to find value name!!");
      return false;
    }

    // Search for Value
    if ( jRegSearch("localhost", HKLM, "SOFTWARE\\testkey", "Word") != "SOFTWARE\\testkey\\t1" )
    {
      WScript.Echo ("ERROR (jlibRegistry:jRegTestObject) : Failed to find value!!");
      return false;
    }

    // Delete Value
    jRegDeleteValue(strComputerName, cBaseKey, "SOFTWARE\\testkey", "t1");

    if ( jRegGetValue(strComputerName, cBaseKey, "SOFTWARE\\testkey", "t1", REG_SZ) == "Word" )
    {
      WScript.Echo ("ERROR (jlibRegistry:jRegTestObject) : Failed to delete value!!");
      return false;
    }


    // Delete Keys
    jRegDeleteKey(strComputerName, cBaseKey, "SOFTWARE\\testkey\\test2");
    jRegDeleteKey(strComputerName, cBaseKey, "SOFTWARE\\testkey\\test1\\test1.1");
    jRegDeleteKey(strComputerName, cBaseKey, "SOFTWARE\\testkey\\test1");
    jRegDeleteKey(strComputerName, cBaseKey, "SOFTWARE\\testkey");

    WScript.Echo ("jlibRegistry PASSED ALL INTERNAL TESTS!!!");
    return true;

  }


// jRegTestObject();




