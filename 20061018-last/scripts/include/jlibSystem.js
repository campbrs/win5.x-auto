
  


  /*\
   * 	Function:	jGetVirtMemRange
   *	Build Date:	2005/05/03
   *      Written by:	Richard Campbell
   *
   *	Inputs:		ComputerName	- String - computername to get Physical Memory settings from
   *                      Multiplier	- Float - Multiplier of physical memory to determine max Virt Mem Size
   *	Outputs:	Array		- 2 element Array - start of Virtual memory range and end of virtual memory size
   *
   *	Description:	Uses WMI to retrive the physical memory and then returns the virtual memory range, which
   *			is between (physical memory + 16MB) through (physical memory * multiplier)
   *
   *	Version Info:	1.1.0	- 2005/05/03 - commented
   *			1.0.0	- 2005/01    - original Version
   *
  \*/

  function jSysGetLogicalMemorySize(strComputerName)
  {
    var enumLogicalMemoryConfiguration = new Enumerator(GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + strComputerName + "\\root\\cimv2").ExecQuery("select * from Win32_LogicalMemoryConfiguration"));


    return (parseInt(enumLogicalMemoryConfiguration.item().TotalPhysicalMemory));
  }

  function jSysGetPhysicalMemorySpec(strComputerName)
  {
    var enumPMSpec = new Enumerator(GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + strComputerName + "\\root\\cimv2").ExecQuery("select * from Win32_PhysicalMemory"));
    var i = 0;

    var aPMSpec = new Array();

    for(;!enumPMSpec.atEnd();enumPMSpec.moveNext())
    {
      aPMSpec[i] = new Object();

      aPMSpec[i]["BankLabel"] = enumPMSpec.item().BankLabel;
      aPMSpec[i]["Capacity"] = enumPMSpec.item().Capacity;
      aPMSpec[i]["Caption"] = enumPMSpec.item().Caption;
      aPMSpec[i]["CreationClassName"] = enumPMSpec.item().CreationClassName;
      aPMSpec[i]["DataWidth"] = enumPMSpec.item().DataWidth;
      aPMSpec[i]["Description"] = enumPMSpec.item().Description;
      aPMSpec[i]["DeviceLocator"] = enumPMSpec.item().DeviceLocator;
      aPMSpec[i]["FormFactor"] = enumPMSpec.item().FormFactor;
      aPMSpec[i]["HotSwappable"] = enumPMSpec.item().HotSwappable;
      aPMSpec[i]["InstallDate"] = enumPMSpec.item().InstallDate;
      aPMSpec[i]["InterleaveDataDepth"] = enumPMSpec.item().InterleaveDataDepth;
      aPMSpec[i]["InterleavePosition"] = enumPMSpec.item().InterleavePosition;
      aPMSpec[i]["Manufacturer"] = enumPMSpec.item().Manufacturer;
      aPMSpec[i]["MemoryType"] = enumPMSpec.item().MemoryType;
      aPMSpec[i]["Model"] = enumPMSpec.item().Model;
      aPMSpec[i]["Name"] = enumPMSpec.item().Name;
      aPMSpec[i]["OtherIdentifyingInfo"] = enumPMSpec.item().OtherIdentifyingInfo;
      aPMSpec[i]["PartNumber"] = enumPMSpec.item().PartNumber;
      aPMSpec[i]["PositionInRow"] = enumPMSpec.item().PositionInRow;
      aPMSpec[i]["PoweredOn"] = enumPMSpec.item().PoweredOn;
      aPMSpec[i]["Removable"] = enumPMSpec.item().Removable;
      aPMSpec[i]["Replaceable"] = enumPMSpec.item().Replaceable;
      aPMSpec[i]["SerialNumber"] = enumPMSpec.item().SerialNumber;
      aPMSpec[i]["SKU"] = enumPMSpec.item().SKU;
      aPMSpec[i]["Speed"] = enumPMSpec.item().Speed;
      aPMSpec[i]["Status"] = enumPMSpec.item().Status;
      aPMSpec[i]["Tag"] = enumPMSpec.item().Tag;
      aPMSpec[i]["TotalWidth"] = enumPMSpec.item().TotalWidth;
      aPMSpec[i]["TypeDetail"] = enumPMSpec.item().TypeDetail;
      aPMSpec[i]["Version"] = enumPMSpec.item().Version;
      
      i++;      
    }

    return (aPMSpec);
  }

  function jSysGetProcessorSpec(strComputerName)
  {
    var enumProcSpec = new Enumerator(GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + strComputerName + "\\root\\cimv2").ExecQuery("select * from Win32_Processor"));
    var i = 0;
    
    var aPowerManagementCapabilities;

    var aProcSpec = new Array();

    for(;!enumProcSpec.atEnd();enumProcSpec.moveNext())
    {
      aProcSpec[i] = new Object();
      
      if (enumProcSpec.item().PowerManagementCapabilities != null) aPowerManagementCapabilities = VBArray(enumProcSpec.item().PowerManagementCapabilities).toArray();

      aProcSpec[i]["AddressWidth"] = enumProcSpec.item().AddressWidth;
      aProcSpec[i]["Architecture"] = enumProcSpec.item().Architecture;
      aProcSpec[i]["Availability"] = enumProcSpec.item().Availability;
      aProcSpec[i]["Caption"] = enumProcSpec.item().Caption;
      aProcSpec[i]["ConfigManagerErrorCode"] = enumProcSpec.item().ConfigManagerErrorCode;
      aProcSpec[i]["ConfigManagerUserConfig"] = enumProcSpec.item().ConfigManagerUserConfig;
      aProcSpec[i]["CpuStatus"] = enumProcSpec.item().CpuStatus;
      aProcSpec[i]["CreationClassName"] = enumProcSpec.item().CreationClassName;
      aProcSpec[i]["CurrentClockSpeed"] = enumProcSpec.item().CurrentClockSpeed;
      aProcSpec[i]["CurrentVoltage"] = enumProcSpec.item().CurrentVoltage;
      aProcSpec[i]["DataWidth"] = enumProcSpec.item().DataWidth;
      aProcSpec[i]["Description"] = enumProcSpec.item().Description;
      aProcSpec[i]["DeviceID"] = enumProcSpec.item().DeviceID;
      aProcSpec[i]["ErrorCleared"] = enumProcSpec.item().ErrorCleared;
      aProcSpec[i]["ErrorDescription"] = enumProcSpec.item().ErrorDescription;
      aProcSpec[i]["ExtClock"] = enumProcSpec.item().ExtClock;
      aProcSpec[i]["Family"] = enumProcSpec.item().Family;
      aProcSpec[i]["InstallDate"] = enumProcSpec.item().InstallDate;
      aProcSpec[i]["L2CacheSize"] = enumProcSpec.item().L2CacheSize;
      aProcSpec[i]["L2CacheSpeed"] = enumProcSpec.item().L2CacheSpeed;
      aProcSpec[i]["L3CacheSize"] = enumProcSpec.item().L3CacheSize;
      aProcSpec[i]["L3CacheSpeed"] = enumProcSpec.item().L3CacheSpeed;
      aProcSpec[i]["LastErrorCode"] = enumProcSpec.item().LastErrorCode;
      aProcSpec[i]["Level"] = enumProcSpec.item().Level;
      aProcSpec[i]["LoadPercentage"] = enumProcSpec.item().LoadPercentage;
      aProcSpec[i]["Manufacturer"] = enumProcSpec.item().Manufacturer;
      aProcSpec[i]["MaxClockSpeed"] = enumProcSpec.item().MaxClockSpeed;
      aProcSpec[i]["Name"] = enumProcSpec.item().Name;
      aProcSpec[i]["NumberOfCores"] = enumProcSpec.item().NumberOfCores;
      aProcSpec[i]["NumberOfLogicalProcessors"] = enumProcSpec.item().NumberOfLogicalProcessors;
      aProcSpec[i]["OtherFamilyDescription"] = enumProcSpec.item().OtherFamilyDescription;
      aProcSpec[i]["PNPDeviceID"] = enumProcSpec.item().PNPDeviceID;
      aProcSpec[i]["PowerManagementCapabilities"] = aPowerManagementCapabilities;
      aProcSpec[i]["PowerManagementSupported"] = enumProcSpec.item().PowerManagementSupported;
      aProcSpec[i]["ProcessorId"] = enumProcSpec.item().ProcessorId;
      aProcSpec[i]["ProcessorType"] = enumProcSpec.item().ProcessorType;
      aProcSpec[i]["Revision"] = enumProcSpec.item().Revision;
      aProcSpec[i]["Role"] = enumProcSpec.item().Role;
      aProcSpec[i]["SocketDesignation"] = enumProcSpec.item().SocketDesignation;
      aProcSpec[i]["Status"] = enumProcSpec.item().Status;
      aProcSpec[i]["StatusInfo"] = enumProcSpec.item().StatusInfo;
      aProcSpec[i]["Stepping"] = enumProcSpec.item().Stepping;
      aProcSpec[i]["SystemCreationClassName"] = enumProcSpec.item().SystemCreationClassName;
      aProcSpec[i]["SystemName"] = enumProcSpec.item().SystemName;
      aProcSpec[i]["UniqueId"] = enumProcSpec.item().UniqueId;
      aProcSpec[i]["UpgradeMethod"] = enumProcSpec.item().UpgradeMethod;
      aProcSpec[i]["Version"] = enumProcSpec.item().Version;
      aProcSpec[i]["VoltageCaps"] = enumProcSpec.item().VoltageCaps;
      
      i++;      
    }

    return (aProcSpec);
  }
