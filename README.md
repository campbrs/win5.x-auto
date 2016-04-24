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
 - the last beta version 5.0 BETA 2
    - October 2006
    - wscript based
    - CD/DVD install
    - Windows PE 2006 or Vista WAIK
    - XML config file

Revision History (1.0 - 4.6.2)
Supports:
  - Windows 2003 Server, Standard Edition and Enterprise Edition (no reason Web Edition would not also work)
  - Windows 2000 Server and Advanced Server


Version 4.6.2 (10/31/2005)
- Changed C: drive size back to 6GB
- New Drivers (both to WinPE and 2003): PERC5; New Intel Chipset drivers; Broadcom Extreme II Drivers
- Disabled hardening; now copies hardening script to e:\scripts\security to be run after install manually

Version 4.6.1 (05/02/2005)
- Changed C: drive size to 16GB

Version 4.6 (11/07/2005)
- Added SP1 Support for Windows 2003
- Added post SP1 patches through August 2005
- Updated ramdisk driver with Microsoft Compiled driver and inf (NO Floppy is required again); the home compiled driver would not work in Dell 2850

Version 4.5.5 (11/02/2005)
- Updated Disk partitioning to intellegently identifiy removable media devices and assign to R:, S:, T: (instead of assuming only one of these devices is installed - caused problems with Dell DRAC 4 cards)
- Updated Disk partitioning to identify first Hard disk using diskpart instead of assuming it is always Disk 0 (caused problems with Dell DRAC 4 cards)
- Floppy Disk Required for this Interim Release!!!
- Fixed Dell PERC 2/DC 3/DC 4/DC 4e/DC Textmode Drivers in Windows PE 2004 as XP section of the INF was stubbed out (copied 2003 section settings to XP section - LSI supports XP and Dell does not)

Version 4.5.1 (08/19/2005)
- Windows 2000 Only Updates
   - Added in security updates through August 2005
   - Includes January 2005 Windows 2000 Hardening

Version 4.5 (03/15/2005)
- Finished fixing network autoconfiguration
  - Adds to domain
  - names interfaces based on environment to appropriate VLANs
  - if VLAN with no DNS then disables DNS registration, DNS entries, etc.
- removed Audio and Video drivers from WIN2003_$OEM$.rar as they are never used and take up LOTs of space

Version 4.4 (03/08/2005)
- Fixed most network autoconfiguration
- Added audit capaiblities to hardening script

Version 4.3 (02/28/2005)
Includes:
- Update to Windows 2003 Hardening Templates (not hardening)
- All OS Patches through Feb 05
- New Textmode drivers:
    - Adaptec U160 Textmode Drivers
    - Dell PERC 2/Si 3/Si 2/Di 3/Di Textmode Drivers
    - Dell PERC 2/DC 3/DC 4/DC 4e/DC Textmode Drivers
    - Adaptec U320 Textmode Drivers (not enabled)
    - Adaptec U320 RAID Textmode Drivers (not enabled)

Version 4.2 (01/28/2005)
Includes:
- FINAL Windows 2003 Hardening
- Updates to Textmode drivers

Version 4.1 (01/21/2005)
Includes:
- All OS Patches through Jan 05
- Updates to Textmode drivers

Version 4.0 (01/04/2005)
Includes:
- Migration to Windows PE 2004
- WMI Support Added
- All OS Patches through Dec 05
- Updates to Textmode drivers

Version 3.1 (12/12/2004)
Includes:
- added xCopy, Unrar, xCopyUnrar Functions
- 
Version 3.0 (11/30/2004)
Includes:
- First Release using complete MS WSH Languages (JScript, VBScript)
- Added OS Patch Support
- Added Hardening Support

Version 2.4 (11/01/2004)
Includes:
- Added MS WSH Script support (first VBScript used to install IIS)
 
Version 2.3 (10/17/2004)
Includes:
- First offical AB CD release 
- Added RAMdisk Support (Previous versions required a floppy disk for scratch space)

Version 2.2 (10/08/2004)
Includes:
- First beta AB CD release (Previous versions where experimental and Network based)

Version 2.1 (Approx 04/04)
Includes:
- Added Win2K Textmode HDD driver support

Version 2.0 (Approx 03/04) 
Includes:
- Major script overhaul to allow for multiple OS's - Support for Windows 2000 added

Version 1.1 (Approx 12/03)
Includes:
- Added Network Autoconfiguration support (DHCP, DNS)

Version 1.0 (Approx 11/03)
Includes:
- First AB release supports only Win2k3
- All in MS Batch
- Based on Windows PE 1.1
