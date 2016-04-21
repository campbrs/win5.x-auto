

/*\
 * 	Function:	genAFOSUnattendDiskCont
 *	Build Date:	2005/05/03
 *      Written by:	Richard Campbell
 *
 *	Inputs:		controllers			- Array of Strings - Containing the list of disk controllers
 *				textModeFilesPath	- String - path to the textmode drivers used to generate the files list
 *	Outputs:	Controller List	- Array of Strings - Contains a list of disk controllers in WinXP Driver Name formatwith TEXTMODE drivers in OS Answer File format
 *
 *	Description:	Uses an Array of Windows XP Controller Name strings of installed controllers to build the appropriate entries for
 *					the OS unattend answer file.
 *
 *	Version Info:	4.0.0	- 2005/05/07 - Split into two scripts similar to the NIC subroutines
 *							                - getDiskControllers - used to identify the disk controller only
 *											- genOSAFUnattendDiskCont - used to build the OS unattend answer file
 *                  3.0.0   - 2004/12    - WMI Support added (insted of using regread wsh command)
 *			        2.0.0	- 2004/11    - original jscript version
 *			        1.0.0	- 2004/10    - original batch version
 *
\*/

function genAFOSUnattendDiskCont(configObj) {
  var i;
  var needOEMDrivers = false;
  var cntrlType = 0;
  var textModeFiles;
  var massStrgConfig = new Array();
  
  // if there are configObj["diskControllers"]
  if (configObj["diskControllers"] != null) {
  
    // build text for MassStorageDrivers section
    massStrgConfig.push("[MassStorageDrivers]");
    for (i = 0; i < configObj["diskControllers"].length; i++) {

      // identify if controllers are of known type and require OEM drivers (logic is in place so a controller is not listed twice in the answer file - as this causes wierd results after installation)
      switch(configObj["diskControllers"][i]) {
        case "atapi":
          if (! (cntrlType & 1)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"IDE CD-ROM (ATAPI 1.2)/PCI IDE Controller\"=\"RETAIL\"");
              cntrlType += 1;
            }
            if (configObj["OSinfo"]["majorOSVer"] == "2003") {
              massStrgConfig.push("\"IDE CD-ROM (ATAPI 1.2)/PCI IDE Controller\"=\"RETAIL\"");
              cntrlType += 1;
            }
          }
          break;

        case "aic78xx":
          if (! (cntrlType & 2)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"Adaptec Ultra Family PCI SCSI Controller (2940UW, 3940UW, etc.)\"=\"OEM\"");
              cntrlType += 2;
              needOEMDrivers = true;
            }
          }
          break;

        case "2930U2":
          if (! (CntrlType & 4)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"Adaptec 2930U2 Ultra2 PCI SCSI Controller\"=\"OEM\"");
              cntrlType = cntrlType + 4;
              needOEMDrivers = true;
            }
          }
          break;

        case "aic78u2":
          if (! (cntrlType & 8)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"Adaptec Ultra2 Family PCI SCSI Controller (2940U2W, 3950U2D, etc.)\"=\"OEM\"");
              cntrlType = cntrlType + 8;
              needOEMDrivers = true;
            }
          }
          break;

        case "adf6u160":
          if (! (cntrlType & 16)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"Adaptec 19160 Ultra160 PCI SCSI Controller\"=\"OEM\"");
              cntrlType = cntrlType + 16;
              needOEMDrivers = true;
            }
          }
          break;

        case "adpu160m":
          if (! (cntrlType & 32)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"Adaptec Ultra160 Windows2000 FMS4.0 SP5\"=\"OEM\"");
              cntrlType = cntrlType + 32;
              needOEMDrivers = true;
            }
            if (configObj["OSinfo"]["majorOSVer"] == "2003") {
              massStrgConfig.push("\"Adaptec Ultra160 Windows2003 FMS4.0 SP5\"=\"OEM\"");
              cntrlType = cntrlType + 32;
              needOEMDrivers = true;
            }
          }
          break;
     
        case "dpti2o":
          if (! (cntrlType & 64)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"Adaptec I2O RAID Adapters for Windows 2000 & XP 32bit - Beta\"=\"OEM\"");
              cntrlType = cntrlType + 64;
              needOEMDrivers = true;
            }
          }
          break;

        case "perc2":
          if (! (cntrlType & 128)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"Dell PERC 2, 2/Si, 3/Si, 3/Di RAID Controllers\"=\"OEM\"");
              cntrlType = cntrlType + 128;
              needOEMDrivers = true;
            }
            if (configObj["OSinfo"]["majorOSVer"] == "2003") {
              massStrgConfig.push("\"Dell PERC 2, 2/Si, 3/Si, 3/Di RAID Controllers\"=\"OEM\"");
              cntrlType = cntrlType + 128;
              needOEMDrivers = true;
            }
          }
          break;

        case "mraid35x":
          if (! (cntrlType & 256)) {
            if (configObj["OSinfo"]["majorOSVer"] == "2000") {
              massStrgConfig.push("\"MegaRAID 2000 RAID Driver\"=\"OEM\"");
              massStrgConfig.push("\"DELL PERC RAID Products for Windows 2000\"=\"OEM\"");
              cntrlType = cntrlType + 256;
              needOEMDrivers = true;
            }
            if (configObj["OSinfo"]["majorOSVer"] == "2003") {
              massStrgConfig.push("\"DELL PERC RAID Products for Windows 2003 (x86)\"=\"OEM\"");
              cntrlType = cntrlType + 256;
              needOEMDrivers = true;
            }
          }
          break;
      }
    }
    
    // List the textmode drivers in the answer file if needed
    if ( needOEMDrivers ) {
      massStrgConfig.push("");
      massStrgConfig.push("[OEMBootFiles]");
      textModeFiles = dir(configObj["installParams"]["OSinstallSrcPath"] + "\\i386\\$OEM$\\textmode");
      for (i = 0; i < textModeFiles.length; i++) massStrgConfig.push(textModeFiles[i]);
      massStrgConfig.push("");
      
      // return the OEM Disk Files section if needed
      return (massTrgConfig);
    }
  }

  // else return null
  return (null);
}


/*\
 * 	Function:	genAFOSUnattendNIC
 *	Version:	1.0.1
 *	Build Date:	2005/05/01
 *      Written by:	Richard Campbell
 *
 *	Inputs:		NIC		- Array if object - contains the network card configurations
 *	Outputs:	NICConfig	- String - Networking portion of the OS Unattended Answer File
 *
 *	Description:	Builds the Network configuration portion of the OS Unattended Answer File
 *
 *	Version Info:	1.0.1   - 2005/05	- Commented and removed disable bindings section
 *			1.0.0	- 2005/01	- original version named NICConfig
 *
\*/

  function jOSAFnicINI(oXNodeAF, aNics) {
    var i, j;
    var strDNSSuffixSearchOrder = null;
    var aAdapterSections = new Array();
    
    var reNoIP = /0\.0\.0\.0|169\.254(\.\d{1,3}){2}/;
    
    var oXNodeNetAdapters, oXNodeSection, oXNodeEntry;    

    var oXD = oXDNodeAF.ownerDocument;

    // if there are known NICs 
    if ( (aNics != null) && (aNics.length > 0) )
    {
      j = 0;

      // set up individual network adapter specific params sections
      for ( i = 0; i < aNics.length; i++ )
      { 
        if ( (aNics[j]["IPAddress"] != null) && reNoIP.test(aNics[j]["IPAddress"]) )
        {
          // Set up the NetAdapters NIC value
          oXNodeSection = oXD.selectSingleNode("//OSANSWERFILE/NETADAPTERS");
          oXNodeEntry = oXNodeSection.appendChild.createElement("NIC");
          oXNodeEntry.text = "params.NIC" + j;
        
          // Set up the NIC specific items
          oXNodeSection  = oXNodeAF.appendChild.createElement("params.NIC" + j);
          oXNodeEntry = oXNodeSection.appendChild.createElement("ConnectionName");
          oXNodeEntry.text = "\"" + aNics[j]["ConnectionName"] + "\"";
          oXNodeEntry = oXNodeParamsNIC.appendChild.createElement("NetCardAddress");
          oXNodeEntry.text = "0x" + aNics[j]["MACAddress"].split(":").join("");

          // set up network adapter specific TCPIP params sections
          oXNodeSection  = oXNodeAF.appendChild.createElement("params.MS_TCPIP.NIC" + j);
          oXNodeEntry = oXNodeSection.appendChild.createElement("SpecificTo");
          oXNodeEntry.text = "NIC" + j;
          oXNodeEntry = oXNodeSection.appendChild.createElement("IPAddress");
          oXNodeEntry.text = aNics[j]["IPAddress"].join(",");
          oXNodeEntry = oXNodeSection.appendChild.createElement("SubnetMask");
          oXNodeEntry.text = aNics[j]["IPSubnet"].join(",");
          oXNodeEntry = oXNodeSection.appendChild.createElement("SubnetMask");
          oXNodeEntry.text = aNics[j]["IPSubnet"].join(",");
          
          if ( aNics[j]["DefaultIPGateway"] != null )
          {
            oXNodeEntry = oXNodeSection.appendChild.createElement("DefaultGateway");
            oXNodeEntry.text = aNics[j]["DefaultIPGateway"].join(",");        
          }
          
          if (aNics[j]["ConnectionName"] != "vlan50")
          {
          
            if (aNics[j]["DNSServerSearchOrder"] != null)
            {
              oXNodeEntry = oXNodeSection.appendChild.createElement("DNSServerSearchOrder");
              oXNodeEntry.text = aNics[j]["DNSServerSearchOrder"].join(",");
            }
            
            if (nic[i]["DNSDomain"] != null)
            {
              oXNodeEntry = oXNodeSection.appendChild.createElement("DNSDomain");
              oXNodeEntry.text = aNics[j]["DNSDomain"].join(",");
            }

            oXNodeEntry = oXNodeSection.appendChild.createElement("EnableAdapterDomainNameRegistration");
            oXNodeEntry.text = "yes";

            oXNodeEntry = oXNodeSection.appendChild.createElement("DisableDynamicUpdate");
            oXNodeEntry.text = "no";
          }
          else
          {
            // vlan 50 interfaces should not register there connections with DNS

            oXNodeEntry = oXNodeSection.appendChild.createElement("EnableAdapterDomainNameRegistration");
            oXNodeEntry.text = "no";

            oXNodeEntry = oXNodeSection.appendChild.createElement("DisableDynamicUpdate");
            oXNodeEntry.text = "yes";          
          }

          oXNodeEntry = oXNodeSection.appendChild.createElement("DHCP");
          oXNodeEntry.text = "no";          

          oXNodeEntry = oXNodeSection.appendChild.createElement("WINS");
          oXNodeEntry.text = "no";          

          oXNodeEntry = oXNodeSection.appendChild.createElement("NetBIOSOptions");
          oXNodeEntry.text = "2";
          
          // Load Netbindings
          oXNodeSection = oXD.selectSingleNode("//OSANSWERFILE/NETBINDINGS");
          oXNodeEntry = oXNodeSection.appendChild.createElement("enable");
          oXNodeEntry.text = "MS_MSClient,MS_TCPIP,NIC" + j;
          
          aAdapterSections.push("params.MS_TCPIP.NIC" + j);
           
          if (aNic[j]["DNSDomainSuffixSearchOrder"] != null) strDNSSuffixSearchOrder = aNic[j]["DNSDomainSuffixSearchOrder"].join(",");
          
          j++;
        }
      }
    }


    // set dynamic variables within the  params.TCPIP section
    // Set the adapter sections
    if ( aAdapterSections.length > 0 )
    {
      oXNodeEntry = oXD.selectSingleNode("//OSANSWERFILE/params.MS_TCPIP/AdapterSections");
      oXNodeEntry.text = aAdapterSections.join(",");
    }

    // Set the DNS Search Suffix if found
    if ( strDNSSuffixSearchOrder != null )
    {
      oXNodeEntry = oXD.selectSingleNode("//OSANSWERFILE/params.MS_TCPIP/DNSSuffixSearchOrder");
      oXNodeEntry.text = strDNSSuffixSearchOrder;
    }
  }


/*\
 * 	Function:	genAFOSUnattend
 *	Version:	3.0.0
 *	Build Date:	2005/05/03
 *      Written by:	Richard Campbell
 *
 *	Inputs:		configObj - Configuration Object - Configuration Object that contains all configuration parameters
 *	Outputs:	
 *
 *	Description:	Builds the OS Unattended Answer File
 *
 *	Version Info:	3.0.0   - 2005/05	- Commented and cleaned up
 *			2.0.0	- 2004/11	- JScript version named BuildUnattend
 *			1.0.0	- 2004/10	- Original Batch version
 *
\*/


  function jOSAFBuildUnattend(oXD)
  {
    var oXNodeAF = oXD.selectSingleNode("//OSANSWERFILE");   
    var oXNodeAFType = jXMLSelectSingleNode(oXNodeAF, "FILETYPE");

    if ( /ini/i.test(oXNodeAFType.text) )
    {
        jOSAFBuildUnattendINI(oXNodeAF);
    }
    else if ( /xml/i.test(oXNodeAFType.text) )
    {
        jOSAFBuildUnattendXML(oXNodeAF);       
    }
  }
  
  function jOSAFBuildUnattendINI(oXNode)
  {
    var oXNodeContent = jXMLSelectSingleNode(oXNode, "FILECONTENTS");   
    
    // load NIC Config
    jOSAFnicINI(oXNodeContent, jNetGetNICConfig("localhost"));
    
    // load OEM Disk Config
    
    // save AF
    jXML2INIFile(oXNode);
  }

  function jOSAFBuildCmdlines(oXD)
  {
    var oXNodeCmdlines = oXD.selectSingleNode("//CMDLINES");
    var oXNodeContent = jXMLSelectSingleNode(oXNodeCmdlines, "FILECONTENTS");   


    // Inject any Persistent routes
    var aPersistentRoutes = jNetGetPersistentRoutes("localhost");
    var oXNodeNew;
       
    for ( var i = 0; i < aPersistentRoutes.length; i++)
    {
      oXNodeNew = oXD.createElement("LINE");
      oXNodeNew.setAttribute("INDEX", (i+10));
      oXNodeNew.text = "\"route -p add " + aPersistentRoutes[i]["NetworkNumber"] + " mask " + aPersistentRoutes[i]["SubnetMask"] + " " + aPersistentRoutes[i]["Gateway"] + " " + aPersistentRoutes[i]["Metric"] + "\"";
      oXNodeContent.appendChild(oXNodeNew);
    }
    
    //  Sort the nodes on index
    jXMLSortNodeChildren(oXNodeContent);
    
    // Build the Linear File
    jXML2FlatFile(oXNodeCmdlines);
  }
  
  function jOSAFBuildRunOnce(oXD)
  { 
    var oXNodeListRunOnce = oXD.selectNodes("//RUNONCE");
    
    for ( var i = 0; i < oXNodeListRunOnce.length; i++)
    {
      // Build the Linear File
      jXML2FlatFile(oXNodeListRunOnce.item(i));      
    }
  }
  