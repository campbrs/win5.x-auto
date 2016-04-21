

  /*\
   *   Function:        jUpdateSecTemplate
   *   Version:         0.1
   *   Date:            12/04/2004
   *
   *   Input:		Path to update file
   *   Output:          
   *
   *   Description:     Updates the local policy security template with a provided template on a server
   *   
  \*/

  function jUpdateSecTemplate(sUpdateFileName) {
    var objWinCmd = new ActiveXObject("WScript.Shell");
    var objFS = new ActiveXObject("Scripting.FileSystemObject");

    var PROCENV = objWinCmd.Environment("PROCESS");
    var SYSTEMROOT = PROCENV("SYSTEMROOT");
    var sTemplateFileName = SYSTEMROOT + "\\inf\\sceregvl.inf";
    var sTemplateBUFileName = SYSTEMROOT + "\\inf\\sceregvl.orig";

    var f1;

    // Check to see if the new Template file exists 
    if ( objFS.FileExists(sUpdateFileName) ) {

      // Delete the backup file if it already exists
      if ( objFS.FileExists(sTemplateBUFileName)) {
        jDelFile(sTemplateBUFileName, true);
      }

      // Move/Rename the current Template File
      jRMove(sTemplateFileName, sTemplateBUFileName, true);

      // Replace the existing template
      jRCopy(sUpdateFileName, sTemplateFileName, true);

      // Reload the scecli.dll to intialize the new Template
      jShExec("regsvr32 /s scecli.dll");
    }
  }
