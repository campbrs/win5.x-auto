# win5.x-auto
Legacy Windows 5.x Autobuild Scripts

These scripts where developed between October 2003 and October 2006 to build Windows 2000, XP, and 2003 (Windows NT version 5.X).  Only the first version and a last beta version are placed here.

All versions leverage versions of Windows PE starting with version 1.1 and ending with the Windows Vista WAIK.

These scripts where originally written in BATCH and then converted to Windows jscript and finally Windows wscript.

The scripts are designed to perform preinstall tasks (partitioning, directory creation, building answer files, seeding later stages, etc), OS installation, and Post installation tasks (patching, additional application installation, adding to domain, cleanup, etc).

The versions represented here are:
 - the first version that could be found
    - written January-March 2004 timeframe
    - BATCH based
    - network install - as source files are on network share
    - Windows PE 1.1
    - INF like config files
 - the last beta version
    - October 2006
    - wscript based
    - CD/DVD install
    - Windows PE 2006 or Vista WAIK
    - XML config file




