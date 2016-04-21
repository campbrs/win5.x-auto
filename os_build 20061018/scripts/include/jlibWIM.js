  

  function jWIMInfo2XML(oXNode, strWIMFileName)
  {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var oXD1, oXD2, oXNodeWIM;
    var strWIMInfoXML, strCurrentLine;

    if ( oXNode == null || strWIMFileName == null )
    {
      return (null);
    }

    if ( ! oFS.FileExists(strWIMFileName) )
    {
      WScript.Echo("ERROR (jWIMInfo2XML): " + strWIMFileName + " File does not exist!!");
    }

    oXD1 = oXNode.ownerDocument;

    var strWIMTempFile = jHelpReplaceVarsInStr(oXD1, "__WIMTEMPFILE__");

    jHelpShExec("cmd /c imagex.exe /XML /INFO " + strWIMFileName + " > " + strWIMTempFile);

    oXD2 = jXMLLoadDOM(strWIMTempFile);

    if ( oXD2 != null )
    {
      oXNodeWIM = oXD2.selectSingleNode("//WIM");
      oXNodeWIM.setAttribute("FILENAME", strWIMFileName);
    
      oXNode.appendChild(oXNodeWIM.cloneNode(true));
    }
    else
    {
      WScript.Echo("ERROR (jWIMInfo2XML): Unable to load XML!!!");
    }
  }

/*

  Updates the description strings within the WIM XML elements (the copied elements not the elements within the WIM file)
 
  If Vista/LH (if Windows XML tag exists)
  {
    parse XML elements to add items such as SP, Arch, License info, etc into description (allowing user to pick correct version of Vista/LH)
  }
  else
    Do nothing as the custom description should already contain the appropriate detail level (possibly not)

DON't BURN CYCLES HERE UNTIL Win2000/XP/2003 SUPPORT FINISHED AS THE VISTA IMAGES WILL NEED TO BE HANDLED WITH A DIFFERENT APPROACH

*/

  function jWIMExpandDescriptionStrings(oXD)
  {

  }


/*

 prints Descriptions from a parent node of a list of WIMs and asks for user input to select based on description

 returns the node of the selected image

*/


  function jWIMPrintAvailImages(oXD)
  {
    var oXNListDescriptions, oXNode = null;
    var strInput;
    var bSelectionInvalid = true;

    if ( oXD != null )
    {
      oXNListDescriptions = oXD.selectNodes("//WIM/IMAGE/DESCRIPTION");

      if ( oXNListDescriptions != null )
      {
        while ( bSelectionInvalid )
        {
          WScript.Echo("Select OS to install");

          for ( var i = 0; i < oXNListDescriptions.length; i++ )
          {
            WScript.Echo ( (i+1) + ". " + oXNListDescriptions.item(i).text );
          }

          WScript.Echo("Selection: ");

          strInput = WScript.StdIn.Readline();

          // if provided number and the number is within range of the menu accept input
          if (/^\d+$/.test(strInput) && (strInput > 0) && (strInput <= oXNListDescriptions.length) )
          {
            oXNode = oXNListDescriptions.item(strInput-1).parentNode;
            bSelectionInvalid = false;
          }
          else
          {
            WScript.Echo("ERROR: Input Invalid or out of range!!");
          }
        }
      }
    }

    return oXNode;
  }

  function jWIMConvertCustomFlags2Elements(oXNode)
  {
    var oXNodeWindows, oXNodeTemp1, oXNodeTemp2;
    var asFlag;    

    if ( oXNode != null )
    {
      oXD = oXNode.ownerDocument;
      oXNodeWindows = jXMLSelectSingleNode(oXNode, "WINDOWS");

      // <major-ver>.<minor-ver>.<build>.<sp-build>.<arch>.<language>.<license-type>.<productkey>.<image-class>.<image-type>.<answerfile-type>.<systemroot>
      asFlag = jXMLSelectSingleNode(oXNode, "FLAGS").text.split(".");


      if ( oXNodeWindows == null && asFlag.length > 11 )
      {
        // Create the Windows Node
        oXNodeWindows = oXD.createElement("WINDOWS");
        oXNode.appendChild(oXNodeWindows);

        // Create ARCH Node
        oXNodeTemp1 = oXD.createElement("ARCH");
        oXNodeTemp1.text = asFlag[4];
        oXNodeWindows.appendChild(oXNodeTemp1);

        // Create PRODUCTNAME Node
        oXNodeTemp1 = oXD.createElement("PRODUCTNAME");
        oXNodeTemp1.text = "Microsoft® Windows® Operating System";
        oXNodeWindows.appendChild(oXNodeTemp1);

        // Create PRODUCTTYPE Node
        oXNodeTemp1 = oXD.createElement("PRODUCTTYPE");
        oXNodeTemp1.text = "WinNT";
        oXNodeWindows.appendChild(oXNodeTemp1);

        // Create PRODUCTSUITE Node
        oXNodeTemp1 = oXD.createElement("PRODUCTSUITE");
        oXNodeWindows.appendChild(oXNodeTemp1);

        // Create PRODUCTKEY Node
        oXNodeTemp1 = oXD.createElement("LICENSETYPE");
        oXNodeTemp1.text = asFlag[6];
        oXNodeWindows.appendChild(oXNodeTemp1);
 
        // Create PRODUCTKEY Node
        oXNodeTemp1 = oXD.createElement("PRODUCTKEY");
        oXNodeTemp1.text = asFlag[7];
        oXNodeWindows.appendChild(oXNodeTemp1);
 
        // Create IMAGECLASS Node
        oXNodeTemp1 = oXD.createElement("IMAGECLASS");
        oXNodeTemp1.text = asFlag[8];
        oXNodeWindows.appendChild(oXNodeTemp1);
 
        // Create IMAGETYPE Node
        oXNodeTemp1 = oXD.createElement("IMAGETYPE");
        oXNodeTemp1.text = asFlag[9];
        oXNodeWindows.appendChild(oXNodeTemp1);
 
        // Create ANSWERFILETYPE Node
        oXNodeTemp1 = oXD.createElement("ANSWERFILETYPE");
        oXNodeTemp1.text = asFlag[10];
        oXNodeWindows.appendChild(oXNodeTemp1);
 
        // Create SYSTEMROOT Node
        oXNodeTemp1 = oXD.createElement("SYSTEMROOT");
        oXNodeTemp1.text = asFlag[11];
        oXNodeWindows.appendChild(oXNodeTemp1);
 
        // Create LANGUAGES Node
        oXNodeTemp1 = oXD.createElement("LANGUAGES");
        oXNodeWindows.appendChild(oXNodeTemp1);
        oXNodeTemp2 = oXD.createElement("LANGUAGE");
        oXNodeTemp2.text = asFlag[5];
        oXNodeTemp1.appendChild(oXNodeTemp2);
        oXNodeTemp2 = oXD.createElement("DEFAULT");
        oXNodeTemp2.text = asFlag[5];
        oXNodeTemp1.appendChild(oXNodeTemp2);
 
        // Create VERSION Node
        oXNodeTemp1 = oXD.createElement("VERSION");
        oXNodeWindows.appendChild(oXNodeTemp1);
        oXNodeTemp2 = oXD.createElement("MAJOR");
        oXNodeTemp2.text = asFlag[0];
        oXNodeTemp1.appendChild(oXNodeTemp2);
        oXNodeTemp2 = oXD.createElement("MINOR");
        oXNodeTemp2.text = asFlag[1];
        oXNodeTemp1.appendChild(oXNodeTemp2);
        oXNodeTemp2 = oXD.createElement("BUILD");
        oXNodeTemp2.text = asFlag[2];
        oXNodeTemp1.appendChild(oXNodeTemp2);
        oXNodeTemp2 = oXD.createElement("SPBUILD");
        oXNodeTemp2.text = asFlag[3];
        oXNodeTemp1.appendChild(oXNodeTemp2);

      }
      else
      {
        // Add in Vista/LH specific code to add in additional info here - may be able to integrate with above
      }
    }
  }