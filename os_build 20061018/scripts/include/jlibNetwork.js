

  /*\
   *     Function:    jNetGetNICConfig
   *    Build Date:    2005/05/02
   *      Written by:    Richard Campbell
   *
   *    Inputs:        String - computername to get nic config from
   *    Outputs:       Array of Objects - contains each nics configuration
   *
   *    Description:    Uses WMI to retrieve all NIC configs in the system.
   *
   *    Version Info:  1.2.0    - 2005/09/13 - moved custom static routes out of getNICConfig and into setNICALParams  
   *                   1.1.0    - 2005/05/02 - moved Static Route support into NIC object and away from global vars; commented code
   *                   1.0.0    - 2005/01    - original Version
   *
  \*/
  
  function jNetGetNICConfig(strComputerName) {
    var NetConfig = new Enumerator(GetObject("winmgmts:{impersonationLevel=impersonate,authenticationLevel=pktPrivacy}!\\\\" + strComputerName + "\\root\\cimv2").ExecQuery("select * from Win32_NetworkAdapterConfiguration where IPEnabled = true"));
 
    var aNic = new Array();
    var oNic;
    var i = 0;

    for(;!NetConfig.atEnd();NetConfig.moveNext()) {
      oNic = new Object();
  
      // LOAD VALUES INTO ELEMENT OF NIC OBJECT ARRAY
  
      oNic["ArpAlwaysSourceRoute"] = NetConfig.item().ArpAlwaysSourceRoute;
      oNic["ArpUseEtherSNAP"] = NetConfig.item().ArpUseEtherSNAP;
      oNic["Caption"] = NetConfig.item().Caption;
      oNic["DatabasePath"] = NetConfig.item().DatabasePath;
      oNic["DeadGWDetectEnabled"] = NetConfig.item().DeadGWDetectEnabled;
      oNic["DefaultIPGateway"] = (NetConfig.item().DefaultIPGateway != null) ? VBArray(NetConfig.item().DefaultIPGateway).toArray() : null;
      oNic["DefaultTOS"] = NetConfig.item().DefaultTOS;
      oNic["DefaultTTL"] = NetConfig.item().DefaultTTL;
      oNic["Description"] = NetConfig.item().Description;
      oNic["DHCPEnabled"] = NetConfig.item().DHCPEnabled;
      oNic["DHCPLeaseExpires"] = NetConfig.item().DHCPLeaseExpires;
      oNic["DHCPLeaseObtained"] = NetConfig.item().DHCPLeaseObtained;
      oNic["DHCPServer"] = NetConfig.item().DHCPServer;
      oNic["DNSDomain"] = NetConfig.item().DNSDomain;
      oNic["DNSDomainSuffixSearchOrder"] = (NetConfig.item().DNSDomainSuffixSearchOrder != null) ? VBArray(NetConfig.item().DNSDomainSuffixSearchOrder).toArray() : null;
      oNic["DNSEnabledForWINSResolution"] =   NetConfig.item().DNSEnabledForWINSResolution;
      oNic["DNSHostName"] = NetConfig.item().DNSHostName;
      oNic["DNSServerSearchOrder"] = (NetConfig.item().DNSServerSearchOrder != null) ? VBArray(NetConfig.item().DNSServerSearchOrder).toArray() : null;
      oNic["DomainDNSRegistrationEnabled"] =   NetConfig.item().DomainDNSRegistrationEnabled;
      oNic["ForwardBufferMemory"] = NetConfig.item().ForwardBufferMemory;
      oNic["FullDNSRegistrationEnabled"] =     NetConfig.item().FullDNSRegistrationEnabled;
      oNic["GatewayCostMetric"] = (NetConfig.item().GatewayCostMetric != null) ? VBArray(NetConfig.item().GatewayCostMetric).toArray() : null;
      oNic["IGMPLevel"] = NetConfig.item().IGMPLevel;
      oNic["Index"] = NetConfig.item().Index;
      oNic["InterfaceIndex"] = NetConfig.item().InterfaceIndex;
      oNic["IPAddress"] = (NetConfig.item().IPAddress != null) ? VBArray(NetConfig.item().IPAddress).toArray() : null;
      oNic["IPConnectionMetric"] = NetConfig.item().IPConnectionMetric;
      oNic["IPEnabled"] = NetConfig.item().IPEnabled;
      oNic["IPFilterSecurityEnabled"] =     NetConfig.item().IPFilterSecurityEnabled;
      oNic["IPPortSecurityEnabled"] =   NetConfig.item().IPPortSecurityEnabled;
      oNic["IPSecPermitIPProtocols"] = (NetConfig.item().IPSecPermitIPProtocols != null) ? VBArray(NetConfig.item().IPSecPermitIPProtocols).toArray() : null;
      oNic["IPSecPermitTCPPorts"] = (NetConfig.item().IPSecPermitTCPPorts != null) ? VBArray(NetConfig.item().IPSecPermitTCPPorts).toArray() : null;
      oNic["IPSecPermitUDPPorts"] = (NetConfig.item().IPSecPermitUDPPorts != null) ? VBArray(NetConfig.item().IPSecPermitUDPPorts).toArray() : null;
      oNic["IPSubnet"] = (NetConfig.item().IPSubnet != null) ? VBArray(NetConfig.item().IPSubnet).toArray() : null;
      oNic["IPUseZeroBroadcast"] = NetConfig.item().IPUseZeroBroadcast;
      oNic["KeepAliveInterval"] = NetConfig.item().KeepAliveInterval;
      oNic["KeepAliveTime"] = NetConfig.item().KeepAliveTime;
      oNic["MACAddress"] = NetConfig.item().MACAddress;
      oNic["MTU"] = NetConfig.item().MTU;
      oNic["NumForwardPackets"] = NetConfig.item().NumForwardPackets;
      oNic["PMTUBHDetectEnabled"] = NetConfig.item().PMTUBHDetectEnabled;
      oNic["PMTUDiscoveryEnabled"] = NetConfig.item().PMTUDiscoveryEnabled;
      oNic["ServiceName"] = NetConfig.item().ServiceName;
      oNic["SettingID"] = NetConfig.item().SettingID;
      oNic["TcpipNetbiosOptions"] = NetConfig.item().TcpipNetbiosOptions;
      oNic["TcpMaxConnectRetransmissions"] =   NetConfig.item().TcpMaxConnectRetransmissions;
      oNic["TcpMaxDataRetransmissions"] =   NetConfig.item().TcpMaxDataRetransmissions;
      oNic["TcpNumConnections"] = NetConfig.item().TcpNumConnections;
      oNic["TcpUseRFC1122UrgentPointer"] =     NetConfig.item().TcpUseRFC1122UrgentPointer;
      oNic["TcpWindowSize"] = NetConfig.item().TcpWindowSize;
      oNic["WINSEnableLMHostsLookup"] =     NetConfig.item().WINSEnableLMHostsLookup;
      oNic["WINSHostLookupFile"] = NetConfig.item().WINSHostLookupFile;
      oNic["WINSPrimaryServer"] = NetConfig.item().WINSPrimaryServer;
      oNic["WINSScopeID"] = NetConfig.item().WINSScopeID;
      oNic["WINSSecondaryServer"] = NetConfig.item().WINSSecondaryServer;
  
      oNic["ConnectionName"] = "NIC" + i++;
      
      aNic.push(oNic);
    }
  
    return (aNic);
  }
    
  /*\
   *     Function:    getFQDN
   *    Version:    2.0.1
   *    Build Date:    2005/05/02
   *      Written by:    Richard Campbell
   *
   *    Inputs:        nic         - Array of Objects - Contains all installed NIC's in system's configurations
   *    Outputs:    FQDN2        - String - Fully Qualified Domain Name
   *
   *    Description:    Determines FQDN by through reverse DNS lookups by first using default routing to locate DNS 
   *                      server, then various known static routes to locate DNS server, and then if still can't resolve the IP to
   *                        name the user is prompted to enter in the FQDN   manually.
   *
   *    Version Info:    2.0.1    - 2005/05/02 - Commenting, code cleanup, NIC     object persistent route support
   *            2.0.0    - 2005/02    - Complete overhaul allowing for setting   known static routes to get a connection to the DNS server
   *            1.0.0   - 2004/11    - basic version allowing simple NS lookup   and then if not known prompt user for FQDN
   *
  \*/
  
  function jNetGetFQDN(nic) {
    var IPAddress = null;
    var rName = null;
    var FQDN = null;
    var FQDN2 = null;
    var re2 = /\S+$/;
    var i, j, octets;
      var pRoute;
  
    // try and find what the FQDN is through reverse NS lookups using various     routes
    for (i = 0; i < nic.length; i++)
    {
      FQDN = null;
  
      // if the current adapter has an IP address lets try and determine it's     FQDN
      if (nic[i]["IPAddress"] != null)
        {
  
        // See if we can get the FQDN through a simple reverse Lookup
        rName = jShExec("cmd /c nslookup " + nic[i]["IPAddress"][0] + " 2> NUL |   find \"Name:\"");
        FQDN = rName.StdOut.Readline().match(re2);
  
        // if FQDN is still not known and we are in known environment (Denver     Production, Test, or Alpha) try known static routes for alt paths to DNS Server     and then a reverse lookup
        if ((FQDN == null) && (nic[i]["PersistentRoutes"] != null))
        {
          for (j = 0; j < nic[i]["PersistentRoutes"].length; j++)
          {
            // if FQDN still not known try Static Route j
            if (FQDN == null) 
            {
              pRoute = nic[i]["PersistentRoutes"][j].split(",");
              jShExec("cmd /c route add " + pRoute[0] + " mask " + pRoute[1] + "   " + pRoute[2] + " metric " + pRoute[3]);
              rName = jShExec("cmd /c nslookup " + nic[i]["IPAddress"][0] + " 2>   NUL | find \"Name:\"");
              FQDN = rName.StdOut.Readline().match(re2);
              jShExec("cmd /c route delete " + pRoute[0] + " mask " + pRoute[1]);
            }
          }
  
          rName = jShExec("cmd /c nslookup " + nic[i]["IPAddress"][0] + " 2> NUL     | find \"Name:\"");
          FQDN = rName.StdOut.Readline().match(re2);
        }  
    
  
        // if FQDN is still not known check and see if default gateway is known     and DNS servers are set
        if ((FQDN == null) && (nic[i]["DNSServerSearchOrder"] != null) &&   (nic[i]["DefaultIPGateway"] != null)) {
          for (j = 0; j < nic[i]["DNSServerSearchOrder"].length; j++) 
            {
  
            // if FQDN still not known - set static route to default gateway for     DNS servers and try again and then remove the static route
            if (FQDN == null) 
            {
              jShExec("cmd /c route add " + nic[i]["DNSServerSearchOrder"][j] + "     mask 255.255.255.255 " + nic[i]["DefaultIPGateway"][0]);
              rName = jShExec("cmd /c nslookup " + nic[i]["IPAddress"][0] + " 2>   NUL | find \"Name:\"");
              FQDN = rName.StdOut.Readline().match(re2);
              jShExec("cmd /c route delete " + nic[i]["DNSServerSearchOrder"][j]     + " mask 255.255.255.255");
            }
          }
        }
  
        //  if FQDN found then print it out and terminate loop
        if (FQDN != null) 
        {
        // WScript.echo ("FQDN: " + FQDN);
          FQDN2 = FQDN[0];
          i = nic.length;
        }
      }
    }
  
    return (FQDN2);
  }           


  /*\
   *     Function:    setNICALParams
   *     Build Date:    2005/09/13
   *     Written by:    Richard Campbell
   *
   *    Inputs:        Array of Objects - to set the environment specifics on
   *    Outputs:    
   *
   *    Description:   Custom code for setting connection names (per VLAN) and static routes for AL Denver Production, Test, and Alpha environments
   *
   *    Version Info:    1.1.0    - 2005/05/02 - moved Static Route support into     NIC object and away from global vars; commented code
   *            1.0.0    - 2005/01    - original Version
   *
  \*/
  
  function jNetSetNICALParams(arrayObjNIC)
  {
    var re_a = /^(172\.16)/;
    var re_b = /^(172\.17)/;
    var re_c = /^(172\.18)/;
    var i;

    var octets = new Array();
    var octets0_1;

    for (i = 0; i < arrayObjNIC.length; i++)
    {
      if (arrayObjNIC[i]["IPAddress"] != null)
      {
          octets = arrayObjNIC[i]["IPAddress"][0].split(".");
          octets0_1 = octets.slice(0,2).join(".");

          // if Known Environment customize NIC Names, DNS Search Suffixes, and     Static Routes
          if (re_a.test(octets0_1) || re_b.test(octets0_1) ||   re_c.test(octets0_1)) 
          {
            // Set up connection name
            if ((octets[2] == 1) && ((octets[3] > 0) && (octets[3] < 32)))
            {
              ConnectionName = "vlan150";
            }
            if ((octets[2] == 1) && ((octets[3] > 32) && (octets[3] < 64)))
            {
              ConnectionName = "vlan160";
  
              PersistentRoutes = Array(octets0_1+ "1.0,255.255.255.0," + octets0_1 + ".1.33,1",
                                       octets0_1+ "2.0,255.255.255.0," + octets0_1 + ".1.33,1");
            }
            if ((octets[2] == 1) && ((octets[3] > 64) && (octets[3] < 128)))
            {
              ConnectionName = "vlan170";
            }
            if ((octets[2] == 1) && ((octets[3] > 128) && (octets[3] < 256)))
            {
              ConnectionName = "vlan60";
  
              PersistentRoutes = Array(octets0_1+ "1.0,255.255.255.0," + octets0_1     + ".1.129,1",
                                       octets0_1+ "2.0,255.255.255.0," + octets0_1   + ".1.129,1");
            }
            if ((octets[2] == 2) && ((octets[3] > 0) && (octets[3] < 64)))
            {
              ConnectionName = "vlan70";
            }
            if ((octets[2] == 2) && ((octets[3] > 64) && (octets[3] < 128)))
            {
              ConnectionName = "vlan80";
            }
            if ((octets[2] == 2) && ((octets[3] > 128) && (octets[3] < 192)))
            {
              ConnectionName = "vlan10";
            }
            if ((octets[2] == 2) && ((octets[3] > 192) && (octets[3] < 224)))
            {
              ConnectionName = "vlan120";
              SYS_ST_RT_RTR = octets0_1 + ".2.193";
              PersistentRoutes = Array(octets0_1+ "1.0,255.255.255.0," + octets0_1     + ".2.193,1",
                                       octets0_1+ "2.0,255.255.255.0," + octets0_1   + ".2.193,1");
            }
            if ((octets[2] == 5) && ((octets[3] > 0) && (octets[3] < 128)))
            {
              ConnectionName = "vlan40";
            }
            if ((octets[2] == 5) && ((octets[3] > 128) && (octets[3] < 256)))
            {
              ConnectionName = "vlan50";
            }
            if ((octets[2] == 158) && ((octets[3] > 64) && (octets[3] < 80)))
            {
              ConnectionName = "vlan110";
            }
            if ((octets[2] == 158) && ((octets[3] > 80) && (octets[3] < 96)))
            {
              ConnectionName = "vlan210";
            }
    
  
            // Set up Domain Name Suffix Search Order
            if (re_a.test(octets0_1)) 
              DNSDomainSuffixSearchOrder = Array(“domain1.com",
                                                 “domain2.com",
                                                 “domain3.com");
  
            if (re_b.test(octets0_1) || re_c.test(octets0_1)) 
              DNSDomainSuffixSearchOrder = Array(“domain1.com",
                                                 “domain2.com",
                                                 “domain3.com");
          }
      }
    }
  }


  function jNetGetNICRegPaths(strComputerName, strSearchValueName, strSearchValueValue, cSearchValueType)
  {
    var strSubKeyName = "SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002BE10318}";
    var aNICPaths = new Array();

    var aAllNICs = jRegEnumKeys(strComputerName, HKLM, strSubKeyName);

    for (var i = 0; i < aAllNICs.length; i++)
    {
      if ( (strSearchValueName == null) ||
           (strSearchValueValue == null) || 
           (cSearchValueType == null) || 
           (jRegGetValue(strComputerName, HKLM, strSubKeyName + "\\" +  aAllNICs[i], strSearchValueName, cSearchValueType) == strSearchValueValue) )
        aNICPaths.push(strSubKeyName + "\\" +  aAllNICs[i]);
    }

    return ( aNICPaths );
  }


  function jNetGetNICSSIDs(strComputerName, strSearchValueName, strSearchValueValue, cSearchValueType)
  {
    var aNICRegPaths = jGetNICRegPaths(strComputerName, strSearchValueName, strSearchValueValue, cSearchValueType);
    var aNICSSIDs = new Array();
    var strSSIDValue;

    for (var i = 0; i < aNICRegPaths.length; i++)
    {
      strSSIDValue = jRegGetValue(strComputerName, HKLM, aNICRegPaths[i], "NetCfgInstanceId", REG_SZ);
      if ( strSSIDValue != null )
        aNICSSIDs.push( strSSIDValue );
    }

    return ( aNICSSIDs );
  }


  function jNetSetNICSMTU(strComputerName, aNICSSIDs, iMTU)
  {
    var bSuccess = false;
    var strSubKeyName = "SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces";

    if ( (aNICSSIDs != null) && (aNICSSIDs.length > 0) )
    {
      for ( var i = 0; i < aNICSSIDs.length; i++ )
      {
        jRegSetValue(strComputerName, HKLM, strSubKeyName + "\\" +  aNICSSIDs[i], "MTU", REG_DWORD, iMTU);
        if ( jRegGetValue(strComputerName, HKLM, strSubKeyName + "\\" +  aNICSSIDs[i], "MTU", REG_DWORD) == iMTU )
          bSuccess = true;
        else
          bSuccess = false;
      }
    }

    return (bSuccess);
  }


  // Only works on WinXP and Windows 2003 only as leveraging netsh command
  // Needs jlibHelper:

  function jNetTestTCPPort(strComputerName, numPort)
  {
     var strExecOutput;
     var reFoundPort;
     var strSearchPort = "Server appears to be running on port(s) [" + numPort + "]";

     strExecOutput = jShExec("netsh diag connect iphost " + strComputerName + " " + numPort).StdOut.ReadAll();
     reFoundPort = new RegExp(jStrPrepRegExp(strSearchPort), "");

     return reFoundPort.test(strExecOutput);
  }
  
    function jNetGetPersistentRoutes(strComputerName)
    {
      var oRegValues = jRegEnumValuesSimplistic(strComputerName, HKLM, "SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\PersistentRoutes");
      var reRegistryIPv4PersistentRoute = /((\d{1,3}\.){3}\d{1,3}\,){3}\d+/;
      var oPersistentRoute, aPersistentRoute;
      var aPersistentRoutes = new Array();
      
      
      for (var strValueNames in oRegValues)
      {
        if ( reRegistryIPv4PersistentRoute.test(strValueNames) )
        {
          aPersistentRoute = strValueNames.split(",");
          oPersistentRoute = new Object();
          oPersistentRoute["NetworkNumber"] = aPersistentRoute[0];
          oPersistentRoute["NetworkMask"] = aPersistentRoute[1];
          oPersistentRoute["Gateway"] = aPersistentRoute[2];
          oPersistentRoute["Metric"] = aPersistentRoute[3];
          aPersistentRoutes.push(oPersistentRoute);

        }
      }
      
      return (aPersistentRoutes);
    }