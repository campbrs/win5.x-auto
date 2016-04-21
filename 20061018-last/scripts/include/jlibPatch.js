

  function jPatchFromScript(PatchScript) {
    var oFS = new ActiveXObject("Scripting.FileSystemObject");
    var PFArr = PatchScript.split("\\");
    var PatchFile = PFArr.pop();
    var PatchPath = PFArr.join("\\");
    var cmd, cmdline, fullcmd, fullcmdline;


    var reStartPrefix          = /^\s*start\s+\/wait\s+/;
    var reRemark               = /^\s*rem\s+.*$|^\s*$/;
    var reNotWhiteSpacePrefix  = /^\S+/;
    var reChangeDir            = /%CD%|%cd%/;
    var reCmdBatchFile         = /.*\.(cmd|bat)$/i;


    if ( oFS.FileExists(PatchScript) && reCmdBatchFile.test(PatchScript) ) {
      var filePatchScript = oFS.OpenTextFile(PatchScript, 1, false);

      while (! filePatchScript.AtEndOfStream) {

        cmdline = filePatchScript.ReadLine().replace(reStartPrefix,"");
        cmdline = cmdline.replace(reChangeDir, PatchPath);

        cmd = cmdline.match(reNotWhiteSpacePrefix);

        fullcmdline = PatchPath + "\\" + cmdline;
        fullcmd = PatchPath + "\\" + cmd;

        if (! reRemark.test(cmdline)) {
          if (oFS.FileExists(fullcmd)) {
            jShExec(fullcmdline);
          } else {
            jShExec(cmdline);
          }
        }
      }
      filePatchScript.Close();
    }

  }