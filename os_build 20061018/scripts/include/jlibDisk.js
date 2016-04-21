CTERA = 1099511627776;
CGIGA = 1073741824;
CMEGA = 1048576;
CKILO = 1024

  function jDiskExpandSize(iSize, strUnitOfMeasure)
  {
    if ( /^KB$/i.test(strUnitOfMeasure) )
      return (iSize * CKILO);

    if ( /^MB$/i.test(strUnitOfMeasure) )
      return (iSize * CMEGA);
        
    if ( /^GB$/i.test(strUnitOfMeasure) )
      return (iSize * CGIGA);

    if ( /^TB$/i.test(strUnitOfMeasure) )
      return (iSize * CTERA);

    return (iSize);
  }


  function jDiskGetNumHardDisksWMI(ComputerName) {
  var HardDiskConfiguration = new Enumerator(GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + ComputerName + "\\root\\cimv2").ExecQuery("select * from Win32_DiskDrive"));
    var i = 0;

    for(;!HardDiskConfiguration.atEnd();HardDiskConfiguration.moveNext()) i++;

    return i;
  }

  function jDiskGetDiskInfoDP(strTempFile)
  {
    var oFS, oTestDP, oExec;
    var oDiskTemp, aTempSize;
    var aDisks = new Array();
    var reWhtSpcG = /\s+/g;
    var strDiskpartOL;

    // List the Disks
    oFS = new ActiveXObject("Scripting.FileSystemObject");
    oTestDP = fso.CreateTextFile(strTempFile);
    oTestDP.WriteLine("list disk");
    oTestDP.WriteLine("exit");
    oTestDP.Close();

    oExec = ShExec("diskpart /s " + strTempFile);

    while( ! oExec.StdOut.AtEndOfStream )
    {
      strDiskpartOL = oExec.StdOut.ReadLine();
      if ( /Disk\s+\d+/.test(strDiskpartOL) )
      {
        oDiskTemp = new Object();

        oDiskTemp["otype"] = "disk";
        oDiskTemp["number"] = strDiskpartOL.slice(7,10).replace(reWhtSpcG,"");
        oDiskTemp["index"] = parseInt(oDiskTemp["number"]);
        oDiskTemp["status"] = strDiskpartOL.slice(12,22).replace(reWhtSpcG,"");

        // Set size
        aTempSize = ("" + strDiskpartOL.slice(24,31).replace(/^\s*/,"").replace(",","")).split(/\s+/);
        oDiskTemp["size"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);

        // Set free
        aTempSize = ("" + strDiskpartOL.slice(33,40).replace(/^\s*/,"").replace(",","")).split(/\s+/);
        oDiskTemp["free"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);

        oDiskTemp["dynamic"] = strDiskpartOL.slice(42,45).replace(reWhtSpcG,"");
        oDiskTemp["gpt"] = strDiskpartOL.slice(47,50).replace(reWhtSpcG,"");
        oDiskTemp["mediatype"] = "Fixed hard disk media";
        oDiskTemp["medialoaded"] = true;
        oDiskTemp["partitions"] = null;
        oDiskTemp["deviceid"] = null;
        oDiskTemp["interfacetype"] = null;
        oDiskTemp["manufacturer"] = null;
        oDiskTemp["modelnumber"] = null;
        oDiskTemp["pnpdeviceid"] = null;

        oDiskTemp["partitions"] = new Array();

        // Capture Partition Information
        oTestDP = fso.CreateTextFile(strTempFile);
        oTestDP.WriteLine("select disk " + oDiskTemp["number"]);
        oTestDP.WriteLine("list partition");
        oTestDP.WriteLine("exit");
        oTestDP.Close();
        
        oExec2 = ShExec("diskpart /s " + strTempFile);

        while( ! oExec2.StdOut.AtEndOfStream )
        {
          strDiskpartOL = oExec2.StdOut.ReadLine();
          if ( /Partition\s+\d+/.test(strDiskpartOL) )
          {
            oPartTemp = new Object();

            oPartTemp["otype"] = "partition";
            oPartTemp["number"] = strDiskpartOL.slice(12,15).replace(reWhtSpcG,"");
            oPartTemp["index"] = parseInt(oPartTemp["number"]);
            oPartTemp["type"] = strDiskpartOL.slice(18,33).replace(reWhtSpcG,"");

            // Set size
            aTempSize = ("" + strDiskpartOL.slice(36,42).replace(/^\s*/,"").replace(",","")).split(/\s+/);
            oPartTemp["size"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);

            // Set offset
            aTempSize = ("" + strDiskpartOL.slice(45,51).replace(/^\s*/,"").replace(",","")).split(/\s+/);
            oPartTemp["offset"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);
            
            // Capture Detailed Partition Information
            oTestDP = fso.CreateTextFile(strTempFile);
            oTestDP.WriteLine("select disk " + oDiskTemp["number"]);
            oTestDP.WriteLine("select partition " + oPartTemp["number"]);
            oTestDP.WriteLine("detail partition");
            oTestDP.WriteLine("exit");
            oTestDP.Close();
        
            oExec3 = ShExec("diskpart /s " + strTempFile);

            while( ! oExec3.StdOut.AtEndOfStream )
            {
              strDiskpartOL = oExec3.StdOut.ReadLine();

              // What is the numeric type? 
              if ( /^Type\s*:/.test(strDiskpartOL) ) 
                oPartTemp["type_numeric"] = strDiskpartOL.slice(8,9);

              // is this partition hidden? 
              if ( /^Hidden\s*:/.test(strDiskpartOL) )
                oPartTemp["hidden"] = /No/i.test(strDiskpartOL) ? false : true;

              // is this partition active? 
              if ( /^Active\s*:/.test(strDiskpartOL) )
                oPartTemp["active"] = /No/i.test(strDiskpartOL) ? false : true;

              // Gather any volume information this should be a 1:1 relationship
              if ( /Volume\s+\d+/.test(strDiskpartOL) )
              {
                oPartTemp["volumenumber"] = strDiskpartOL.slice(9,12).replace(reWhtSpcG,"");
                oPartTemp["volumeindex"] = parseInt(oPartTemp["volumenumber"]);
                oPartTemp["letter"] = strDiskpartOL.slice(14,17).replace(reWhtSpcG,"").toLowerCase();
                oPartTemp["label"] = "" + strDiskpartOL.slice(19,30).replace(reWhtSpcG,"");
                oPartTemp["filesystem"] = "" + strDiskpartOL.slice(32,37).replace(reWhtSpcG,"");               
                oPartTemp["status"] = ( /Healthy/.test(strDiskpartOL.slice(60,69)) && (oPartTemp["filesystem"] != "") ) ? true : false;
                oPartTemp["info"] = "" + strDiskpartOL.slice(71,79).replace(reWhtSpcG,"");
              }

            }

            aDisks["partitions"].push(aPartTemp);
          }
        }

        aDisks.push(oDiskTemp);
      }
    }

    return (jOBJSortArrayByIndex(aDisks));  
  }


  function jDiskGetDiskInfoDPDummyFile(strDummyFile)
  {
    var oFS, fTestDP, fTestDP2, oExec;
    var oDiskTemp, aTempSize;
    var aDisks = new Array();
    var reTemp1 = /Disk\s+\d+/;
    var reTemp2 = /Partition\s+\d+/;
    var reWhtSpcG = /\s+/g;
    var strDiskpartOL;

    var ForReading = 1;


    // List the Disks
    oFS = new ActiveXObject("Scripting.FileSystemObject");
    fTestDP = oFS.OpenTextFile(strDummyFile, ForReading, false);

    while( ! fTestDP.AtEndOfStream )
    {
      strDiskpartOL = fTestDP.ReadLine();
      if ( reTemp1.test(strDiskpartOL) )
      {
        oDiskTemp = new Object();

        oDiskTemp["otype"] = "disk";
        oDiskTemp["number"] = strDiskpartOL.slice(7,10).replace(reWhtSpcG,"");
        oDiskTemp["index"] = parseInt(oDiskTemp["number"]);
        oDiskTemp["status"] = strDiskpartOL.slice(12,22).replace(reWhtSpcG,"");

        // Set size
        aTempSize = ("" + strDiskpartOL.slice(24,31).replace(/^\s*/,"").replace(",","")).split(/\s+/);
        oDiskTemp["size"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);

        // Set free
        aTempSize = ("" + strDiskpartOL.slice(33,40).replace(/^\s*/,"").replace(",","")).split(/\s+/);
        oDiskTemp["free"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);

        oDiskTemp["dynamic"] = strDiskpartOL.slice(42,45).replace(reWhtSpcG,"");
        oDiskTemp["gpt"] = strDiskpartOL.slice(47,50).replace(reWhtSpcG,"");
        oDiskTemp["mediatype"] = "Fixed hard disk media";
        oDiskTemp["medialoaded"] = true;
        oDiskTemp["partitions"] = null;
        oDiskTemp["deviceid"] = null;
        oDiskTemp["interfacetype"] = null;
        oDiskTemp["manufacturer"] = null;
        oDiskTemp["modelnumber"] = null;
        oDiskTemp["pnpdeviceid"] = null;

        oDiskTemp["partitions"] = new Array();

        // Capture Partition Information
        fTestDP2 = oFS.OpenTextFile(strDummyFile + ".pf." + oDiskTemp["number"] + ".txt", ForReading, false);
        
        while( ! fTestDP2.AtEndOfStream )
        {
          strDiskpartOL = fTestDP2.ReadLine();
          if ( reTemp2.test(strDiskpartOL) )
          {
            oPartTemp = new Object();

            oPartTemp["otype"] = "partition";
            oPartTemp["number"] = strDiskpartOL.slice(12,15).replace(reWhtSpcG,"");
            oPartTemp["index"] = parseInt(oPartTemp["number"]);
            oPartTemp["type"] = strDiskpartOL.slice(18,33).replace(reWhtSpcG,"");

            // Set size
            aTempSize = ("" + strDiskpartOL.slice(36,42).replace(/^\s*/,"").replace(",","")).split(/\s+/);
            oPartTemp["size"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);

            // Set offset
            aTempSize = ("" + strDiskpartOL.slice(45,51).replace(/^\s*/,"").replace(",","")).split(/\s+/);
            oPartTemp["offset"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);
            
            aDisks["partitions"].push(aPartTemp);
          }
        }

        aDisks.push(oDiskTemp);
      }
    }

    fTestDP.Close();
    return (jOBJSortArrayByIndex(aDisks));  
  }

  function jDiskGetDiskInfoWMI(strComputerName)
  {
    var enumDisks = new Enumerator(GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + strComputerName + "\\root\\cimv2").ExecQuery("select * from Win32_DiskDrive"));
    var oDiskTemp;
    var aDisks = new Array();

    for(;!enumDisks.atEnd();enumDisks.moveNext())
    {
      oDiskTemp = new Object();

      oDiskTemp["otype"] = "disk";
      oDiskTemp["number"] = enumDisks.item().Index;
      oDiskTemp["index"] = enumDisks.item().Index;
      oDiskTemp["status"] = enumDisks.item().Status;
      oDiskTemp["size"] = enumDisks.item().Size;
      oDiskTemp["free"] = null;
      oDiskTemp["dynamic"] = null;
      oDiskTemp["gpt"] = null;
      oDiskTemp["mediatype"] = enumDisks.item().MediaType.replace(/\s+/g, " ");
      oDiskTemp["medialoaded"] = enumDisks.item().MediaLoaded;
      oDiskTemp["partitions"] = enumDisks.item().Partitions;
      oDiskTemp["deviceid"] = enumDisks.item().DeviceID;
      oDiskTemp["interfacetype"] = enumDisks.item().InterfaceType;
      oDiskTemp["manufacturer"] = enumDisks.item().Manufacturer;
      oDiskTemp["modelnumber"] = enumDisks.item().ModelNumber;
      oDiskTemp["pnpdeviceid"] = enumDisks.item().PNPDeviceID;

      oDiskTemp["Availability"] = enumDisks.item().Availability;
      oDiskTemp["BytesPerSector"] = enumDisks.item().BytesPerSector;
      oDiskTemp["Capabilities"] = (enumDisks.item().Capabilities != null) ? VBArray(enumDisks.item().Capabilities).toArray() : null;
      oDiskTemp["CapabilityDescriptions"] = (enumDisks.item().CapabilityDescriptions != null) ? VBArray(enumDisks.item().CapabilityDescriptions).toArray() : null;
      oDiskTemp["Caption"] = enumDisks.item().Caption;
      oDiskTemp["CompressionMethod"] = enumDisks.item().CompressionMethod;
      oDiskTemp["ConfigManagerErrorCode"] = enumDisks.item().ConfigManagerErrorCode;
      oDiskTemp["ConfigManagerUserConfig"] = enumDisks.item().ConfigManagerUserConfig;
      oDiskTemp["CreationClassName"] = enumDisks.item().CreationClassName;
      oDiskTemp["DefaultBlockSize"] = enumDisks.item().DefaultBlockSize;
      oDiskTemp["Description"] = enumDisks.item().Description;
      oDiskTemp["DeviceID"] = enumDisks.item().DeviceID;
      oDiskTemp["ErrorCleared"] = enumDisks.item().ErrorCleared;
      oDiskTemp["ErrorDescription"] = enumDisks.item().ErrorDescription;
      oDiskTemp["ErrorMethodology"] = enumDisks.item().ErrorMethodology;
      oDiskTemp["Index"] = enumDisks.item().Index;
      oDiskTemp["InstallDate"] = enumDisks.item().InstallDate;
      oDiskTemp["InterfaceType"] = enumDisks.item().InterfaceType;
      oDiskTemp["LastErrorCode"] = enumDisks.item().LastErrorCode;
      oDiskTemp["Manufacturer"] = enumDisks.item().Manufacturer;
      oDiskTemp["MaxBlockSize"] = enumDisks.item().MaxBlockSize;
      oDiskTemp["MaxMediaSize"] = enumDisks.item().MaxMediaSize;
      oDiskTemp["MediaLoaded"] = enumDisks.item().MediaLoaded;
      oDiskTemp["MediaType"] = enumDisks.item().MediaType;
      oDiskTemp["MinBlockSize"] = enumDisks.item().MinBlockSize;
      oDiskTemp["Model"] = enumDisks.item().Model;
      oDiskTemp["Name"] = enumDisks.item().Name;
      oDiskTemp["NeedsCleaning"] = enumDisks.item().NeedsCleaning;
      oDiskTemp["NumberOfMediaSupported"] = enumDisks.item().NumberOfMediaSupported;
      oDiskTemp["Partitions"] = enumDisks.item().Partitions;
      oDiskTemp["PNPDeviceID"] = enumDisks.item().PNPDeviceID;
      oDiskTemp["PowerManagementCapabilities"] = (enumDisks.item().PowerManagementCapabilities != null) ? VBArray(enumDisks.item().PowerManagementCapabilities).toArray() : null;
      oDiskTemp["PowerManagementSupported"] = enumDisks.item().PowerManagementSupported;
      oDiskTemp["SCSIBus"] = enumDisks.item().SCSIBus;
      oDiskTemp["SCSILogicalUnit"] = enumDisks.item().SCSILogicalUnit;
      oDiskTemp["SCSIPort"] = enumDisks.item().SCSIPort;
      oDiskTemp["SCSITargetId"] = enumDisks.item().SCSITargetId;
      oDiskTemp["SectorsPerTrack"] = enumDisks.item().SectorsPerTrack;
      oDiskTemp["Signature"] = enumDisks.item().Signature;
      oDiskTemp["Size"] = enumDisks.item().Size;
      oDiskTemp["Status"] = enumDisks.item().Status;
      oDiskTemp["StatusInfo"] = enumDisks.item().StatusInfo;
      oDiskTemp["SystemCreationClassName"] = enumDisks.item().SystemCreationClassName;
      oDiskTemp["SystemName"] = enumDisks.item().SystemName;
      oDiskTemp["TotalCylinders"] = enumDisks.item().TotalCylinders;
      oDiskTemp["TotalHeads"] = enumDisks.item().TotalHeads;
      oDiskTemp["TotalSectors"] = enumDisks.item().TotalSectors;
      oDiskTemp["TotalTracks"] = enumDisks.item().TotalTracks;
      oDiskTemp["TracksPerCylinder"] = enumDisks.item().TracksPerCylinder;

      aDisks.push(oDiskTemp);
    }

    return (jOBJSortArrayByIndex(aDisks));  
  }



  function jDiskGetVolumeInfoDP(strTempFile)
  {
    var oFS, oTestDP, oExec;
    var oVolumeTemp;
    var aVolumes = new Array();
    var reWhtSpcG = /\s*/g;
    var strDiskpartOL;
    var aTempSize;

    // List the Disks
    oFS = new ActiveXObject("Scripting.FileSystemObject");
    oTestDP = oFS.CreateTextFile(strTempFile);
    oTestDP.WriteLine("list volume");
    oTestDP.WriteLine("exit");
    oTestDP.Close();

    oExec = jShExec("diskpart /s " + strTempFile);


    while( ! oExec.StdOut.AtEndOfStream )
    {
      strDiskpartOL = oExec.StdOut.ReadLine();
      if ( /Volume\s+\d+/.test(strDiskpartOL) )
      {
        oVolumeTemp = new Object();

        oVolumeTemp["otype"] = "volume";
        oVolumeTemp["number"] = strDiskpartOL.slice(9,12).replace(reWhtSpcG,"");
        oVolumeTemp["index"] = parseInt(oVolumeTemp["number"]);
        oVolumeTemp["letter"] = strDiskpartOL.slice(14,17).replace(reWhtSpcG,"").toLowerCase();
        oVolumeTemp["label"] = "" + strDiskpartOL.slice(19,30).replace(reWhtSpcG,"");
        oVolumeTemp["filesystem"] = "" + strDiskpartOL.slice(32,37).replace(reWhtSpcG,"");
        oVolumeTemp["type"] = "" + strDiskpartOL.slice(39,49).replace(reWhtSpcG,"");

        // Set size
        aTempSize = ("" + strDiskpartOL.slice(51,58).replace(/^\s*/,"").replace(",","")).split(/\s+/);

        oVolumeTemp["size"] = jDiskExpandSize(aTempSize[0], aTempSize[1]);

        oVolumeTemp["free"] = null;
        oVolumeTemp["status"] = ( /Healthy/.test(strDiskpartOL.slice(60,69)) && (oVolumeTemp["filesystem"] != "") ) ? true : false;
        oVolumeTemp["info"] = "" + strDiskpartOL.slice(71,79).replace(reWhtSpcG,"");
        oVolumeTemp["deviceid"] = null;
        oVolumeTemp["pnpdeviceid"] = null;
        oVolumeTemp["serialnumber"] = null;

        aVolumes.push(oVolumeTemp);
      }
    }

    return (jOBJSortArrayByIndex(aVolumes));  
  }


  // Only works in Windows 2003 and later
  function jDiskGetVolumeInfoWMI(strComputerName)
  {
    var enumVolumes = new Enumerator(GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + strComputerName + "\\root\\cimv2").ExecQuery("select * from Win32_Volume"));
    var oVolumeTemp;
    var aVolumes = new Array();
    var iIndex = 0;

    for(;!enumVolumes.atEnd();enumVolumes.moveNext())
    {
      oVolumeTemp = new Object();

      oVolumeTemp["otype"] = "volume";
      oVolumeTemp["number"] = null;
      oVolumeTemp["index"] = iIndex++;
      oVolumeTemp["letter"] = enumVolumes.item().DriveLetter.replace(":","").toLowerCase();
      oVolumeTemp["label"] = enumVolumes.item().Label;
      oVolumeTemp["filesystem"] = enumVolumes.item().FileSystem;
      oVolumeTemp["type"] = enumVolumes.item().DriveType;
      oVolumeTemp["size"] = enumVolumes.item().Capacity;
      oVolumeTemp["free"] = enumVolumes.item().FreeSpace;

      if ( (enumVolumes.item().Status = "OK") && (oVolumeTemp["filesystem"] != null) ) 
        oVolumeTemp["status"] = true;
      else
        oVolumeTemp["status"] = false;

      oVolumeTemp["info"] = enumVolumes.item().StatusInfo;
      oVolumeTemp["deviceid"] = enumVolumes.item().DeviceID;
      oVolumeTemp["pnpdeviceid"] = enumVolumes.item().PNPDeviceID;
      oVolumeTemp["serialnumber"] = enumVolumes.item().SerialNumber;
      
      oVolumeTemp["Access"] = enumVolumes.item().Access;
      oVolumeTemp["Availability"] = enumVolumes.item().Availability;
      oVolumeTemp["BlockSize"] = enumVolumes.item().BlockSize;
      oVolumeTemp["Caption"] = enumVolumes.item().Caption;
      oVolumeTemp["ConfigManagerErrorCode"] = enumVolumes.item().ConfigManagerErrorCode;
      oVolumeTemp["ConfigManagerUserConfig"] = enumVolumes.item().ConfigManagerUserConfig;
      oVolumeTemp["CreationClassName"] = enumVolumes.item().CreationClassName;
      oVolumeTemp["Description"] = enumVolumes.item().Description;
      oVolumeTemp["ErrorCleared"] = enumVolumes.item().ErrorCleared;
      oVolumeTemp["ErrorDescription"] = enumVolumes.item().ErrorDescription;
      oVolumeTemp["ErrorMethodology"] = enumVolumes.item().ErrorMethodology;
      oVolumeTemp["InstallDate"] = enumVolumes.item().InstallDate;
      oVolumeTemp["LastErrorCode"] = enumVolumes.item().LastErrorCode;
      oVolumeTemp["Name"] = enumVolumes.item().Name;
      oVolumeTemp["NumberOfBlocks"] = enumVolumes.item().NumberOfBlocks;
      oVolumeTemp["PNPDeviceID"] = enumVolumes.item().PNPDeviceID;
      oVolumeTemp["PowerManagementSupported"] = enumVolumes.item().PowerManagementSupported;
      oVolumeTemp["Purpose"] = enumVolumes.item().Purpose;
      oVolumeTemp["Status"] = enumVolumes.item().Status;
      oVolumeTemp["StatusInfo"] = enumVolumes.item().StatusInfo;
      oVolumeTemp["SystemCreationClassName"] = enumVolumes.item().SystemCreationClassName;
      oVolumeTemp["SystemName"] = enumVolumes.item().SystemName;
      oVolumeTemp["DeviceID"] = enumVolumes.item().DeviceID;
      oVolumeTemp["Capacity"] = enumVolumes.item().Capacity;
      oVolumeTemp["Compressed"] = enumVolumes.item().Compressed;
      oVolumeTemp["DriveLetter"] = enumVolumes.item().DriveLetter;
      oVolumeTemp["DriveType"] = enumVolumes.item().DriveType;
      oVolumeTemp["FileSystem"] = enumVolumes.item().FileSystem;
      oVolumeTemp["FreeSpace"] = enumVolumes.item().FreeSpace;
      oVolumeTemp["IndexingEnabled"] = enumVolumes.item().IndexingEnabled;
      oVolumeTemp["DirtyBitSet"] = enumVolumes.item().DirtyBitSet;
      oVolumeTemp["Label"] = enumVolumes.item().Label;
      oVolumeTemp["MaximumFileNameLength"] = enumVolumes.item().MaximumFileNameLength;
      oVolumeTemp["Automount"] = enumVolumes.item().Automount;
      oVolumeTemp["QuotasEnabled"] = enumVolumes.item().QuotasEnabled;
      oVolumeTemp["QuotasIncomplete"] = enumVolumes.item().QuotasIncomplete;
      oVolumeTemp["QuotasRebuilding"] = enumVolumes.item().QuotasRebuilding;
      oVolumeTemp["SerialNumber"] = enumVolumes.item().SerialNumber;
      oVolumeTemp["SupportsDiskQuotas"] = enumVolumes.item().SupportsDiskQuotas;
      oVolumeTemp["SupportsFileBasedCompression"] = enumVolumes.item().SupportsFileBasedCompression;




      aVolumes.push(oVolumeTemp);
    }

    return (jOBJSortArrayByIndex(aVolumes));  
  }


  function jDiskGetVolumeInfo56()
  {
    var oFS;
    var oVolumeTemp, oDrive;
    var aVolumes = new Array();
    var iIndex = 0;

    // List the Disks
    oFS = new ActiveXObject("Scripting.FileSystemObject");

    for (var i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++)
    {

      if ( oFS.DriveExists(String.fromCharCode(i)) )
      {
        oDrive = oFS.GetDrive(String.fromCharCode(i));

        oVolumeTemp = new Object();

        oVolumeTemp["otype"] = "volume";
        oVolumeTemp["number"] = null;
        oVolumeTemp["index"] = iIndex++;
        oVolumeTemp["letter"] = String.fromCharCode(i);

        switch (oDrive.DriveType)
        {
          case 0  : 
            oVolumeTemp["type"] = "unknown";
            break;
          case 1  : 
            oVolumeTemp["type"] = "removable";
            break;
          case 2  :
            oVolumeTemp["type"] = "partition";
            break;
          case 3  :
            oVolumeTemp["type"] = "network";
            break;
          case 4  :
            oVolumeTemp["type"] = "cd-rom";
            break;
          case 5  :
            oVolumeTemp["type"] = "ramdisk";
            break;
          default :
            oVolumeTemp["type"] = "unknown";
        }

        oVolumeTemp["status"] = oDrive.IsReady;

        if ( oVolumeTemp["status"] )
        {
          oVolumeTemp["label"] = oDrive.VolumeName;
          oVolumeTemp["filesystem"] = oDrive.FileSystem;
          oVolumeTemp["free"] = oDrive.FreeSpace;
          oVolumeTemp["size"] = oDrive.TotalSize;
          oVolumeTemp["serialnumber"] =  oDrive.SerialNumber;

          // Force type of ramdisk if MS-RAMDRIVE
          if ( /MS\-RAMDRIVE/.test(oVolumeTemp["label"]) )
            oVolumeTemp["type"] = "ramdisk";
        }
        else
        {
          oVolumeTemp["label"] = null;
          oVolumeTemp["filesystem"] = null;
          oVolumeTemp["free"] = null;
          oVolumeTemp["size"] = null;
          oVolumeTemp["serialnumber"] =  null;
        }

        oVolumeTemp["info"] = null;
        oVolumeTemp["deviceid"] = null;
        oVolumeTemp["pnpdeviceid"] = null;


        aVolumes.push(oVolumeTemp);
      }
    }

    return (jOBJSortArrayByIndex(aVolumes));  
  }





  function jDiskGetLetters(aVolumes, strPartType, bCheckReady)
  {
    var aFoundLetters = new Array();
    var rePartType = new RegExp(strPartType,"i");

    for (var i = 0; i < aVolumes.length; i++)
    {
      if ( (aVolumes[i]["letter"] != "") && rePartType.test(aVolumes[i]["type"]) )
        if ( ! (bCheckReady && ! aVolumes[i]["status"]) )
          aFoundLetters.push(aVolumes[i]["letter"]);
    }
    return (aFoundLetters);      
  }

  function jDiskGetUnReservedLetters(aReserved)
  {
    var reUsedLetters = new RegExp(aReserved.join("|"),"i");
    var aUnusedLetters = new Array();

    for (var i = "c".charCodeAt(0); i <= "z".charCodeAt(0); i++)
    {
      if (! reUsedLetters.test(String.fromCharCode(i)) )
      {
        aUnusedLetters.push(String.fromCharCode(i));
      }
    }
    return (aUnusedLetters);
  }



  function jDiskGetLargestDrive(aDisks)
  {
    var iLargest = 0;

    if ( (aDisks != null) && (aDisks.constructor == Array) )
    {
      for (var i = 0; i < aDisks.length; i++)
      {
        if ( aDisks[i]["size"] > aDisks[iLargest]["size"] )
        {
          iLargest = i;
        }
      }
    }

    return (iLargest);
  }


  function jDiskGetTotalSize(aDisks)
  {
    var lTotalSize = 0;

    if ( (aDisks != null) && (aDisks.constructor == Array) )
    {
      for (var i = 0; i < aDisks.length; i++)
      {
        lTotalSize += aDisks[i]["size"];
      }
    }

    return (lTotalSize);
  }


  function jDiskGetLastPartition(aPartitions)
  {
    var iLastPartIndex = -1;

    if ( (aPartitions != null) && (aPartitions.constructor == Array) && (aPartitions.length > 0) )
    {
      iLastPartIndex = 0;
      for (var i = 0; i < aPartitions.length; i++)
      {
        if ( aDisks[i]["number"] > aPartitions[iLastPartIndex]["number"] )
        {
          iLastPartIndex = i;
        }
      }
    }

    return (iLargest);
  }

  function jDiskGetBootDiskControllerID(strComputerName)
  {
    var oWMIService = GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + strComputerName + "\\root\\cimv2");

    var eBootPartition = new Enumerator(oWMIService.ExecQuery("select * from Win32_DiskPartition where BootPartition=true"));

    var reControllerID = /^PCI\\VEN_.*/;

    var bRun;

    var strPNPDeviceID;

    var strBootControllerPNPDeviceID = null;

    var eBootDisk, eBootController;

    
    if (!eBootPartition.atEnd())
    {
      eBootDisk = new Enumerator(oWMIService.ExecQuery("associators of {Win32_DiskPartition.DeviceID=\"" + eBootPartition.item().DeviceID + "\"} where AssocClass=Win32_DiskDriveToDiskPartition Role=Dependent"));
   
      if (!eBootDisk.atEnd())
      {
        strPNPDeviceID = eBootDisk.item().PNPDeviceID;
        strControllerType = eBootDisk.item().InterfaceType;

        bRun = true;

        // Cycle through each controller until we get to the boot controller (recursive in operation via loop)

        while ( ! reControllerID.test(strPNPDeviceID) && bRun)
        {

          eBootController = new Enumerator(oWMIService.ExecQuery("associators of {Win32_PnPEntity.DeviceID=\"" + strPNPDeviceID.replace(/\\/g,"\\\\") + "\"} where AssocClass=Win32_" + strControllerType + "ControllerDevice Role=Dependent"));

          if (!eBootController.atEnd())
          {
            strPNPDeviceID = eBootController.item().DeviceID;
          }
          else
          {
            bRun = false;
          }
        }

        if ( bRun )
        {
          strBootControllerPNPDeviceID = strPNPDeviceID;
        }
      }
    }

    return strBootControllerPNPDeviceID;
  }





