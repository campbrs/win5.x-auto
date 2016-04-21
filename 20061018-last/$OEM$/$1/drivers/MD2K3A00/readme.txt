
Copyright 2004, Dell, Inc.

************
Criticality:
************ 
2 = Recommended = Dell recommends applying this update during your next scheduled update cycle.  The update contains feature enhancements or changes that will help keep your system software current and compatible with other system modules (firmware, BIOS, drivers and software).

********************
Title / Description:
********************
LSI 1020/1030 SCSI Controller Driver Set for Windows 2003 Server family, Dell version A00 (LSI v1.09.11). Release date: 03/10/04

Additional Version Information:

.INF (& Device Manager) version
DriverVer= 1.9.11.0
Date: 10/8/2003

File Properties - 
File Version: 1.09.11.00 built by: WinDDK
Internal Name: SYMMPI-1.09.11.00(server2003 32-bit)
Product Version: 1.09.11.00

*************************************
Compatibility / Minimum Requirements:
*************************************
This release includes the LSI 1020/1030 Ultra320 SCSI drivers for Windows 2003 Server Family; Driver v1.09.11

WHQL certification:  	__X_ Yes	___ No		___ Not Applicable
MID #s:
802497 (1020)
805668 (1030)

*********************
Release Highlights:
*********************

This driver is an update to the native (in-box) driver included in Windows 2003 (v5.2.3790.0/1.08.18.00). It specifically fixes an issue wherein event log messages (error event 11 & error event 15) may be reported when disk queue depth is exceeded by the driver. There is no data loss associated with this issue.

Changes applicable to MPT IO 1020/1030 solutions since native (1.08.18) Windows 2003 driver:
_________________________________

• Added I/O throttling per device to avoid overrunning device queue depths (eliminate multiple Queue Full returns and Event 11/15 errors in event log).

*************
Installation:
*************
Download
1. Click Download Now, to download the file.
2. If the Export Compliance Disclaimer window appears, click Yes, I Accept this Agreement.
3. When the File Download window appears, click Save and click OK. The Save In: window appears.
4. From the Save In: field, click the down arrow then click to select Desktop and click Save.  The file will download to your desktop.
5. If the Download Complete window appears, click Close.  The file icon appears on your desktop.

Diskette Creation
1. Insert a floppy diskette into the floppy drive.
2. Double-click the new icon on the desktop.  The Self-Extractor window appears.
3. Specify the floppy drive as the location to upzip the files.
4. Click on the unzip button to extract files.

IMPORTANT NOTE: If you are running Open Manage Array Manager v3.2 or higher under Windows 2003, to avoid a potential Blue Screen, prior to updating the driver you will need to:
1. Disable the SCSI subsystem provider in the Array Manager Utilities before upgrading the driver. Please refer to the Array Manager documentation for details on how to do this. 
2. Once the SCSI provider is disabled, you should then navigate to the \WINDOWS\SYSTEM32\DRIVERS folder and temporarily rename ASPI32.SYS to ASPI32.XXX, then reboot the system before proceeding with the upgrade. 
3. Following the upgrade, you will need to reboot again before re-naming ASPI32.SYS back to its' original name, then finally re-enabling the SCSI provider.

Updating the driver on an Existing Windows 2003 Server

*NOTE: You must be logged on as Administrator or have administrative privileges to perform these steps:
1. Copy files extracted above to formatted floppy disk
2. From the desktop, right-click the My Computer icon.
3. Left-click Manage.
4. Click Device Manager.
5. Double-click SCSI and RAID controllers (A List of all currently installed SCSI controllers appears) - in the case of a dual channel controller, there will be two devices listed (one for each channel).The driver will have to be updated separately for each channel.
6. Double-click the appropriate SCSI controller (such as 'LSI Logic 1020/1030 Ultra320 SCSI Adapter'). 
7. Select the Driver tab.
8. Select Update Driver. (The Hardware Update Wizard appears).
9. Choose 'Install from a list of specific locations" and click Next.
10. Choose 'Don't Search. I will choose the driver to install"
11. Click Next. 
12. Click 'Have Disk' button. (The 'Install from Disk' dialog appears).
13. Insert the driver diskette created above. (Skip this step if installing driver from location on hard drive)
14. Click 'Browse' button (Locate File dialog appears).
15. Use pull-down box to find floppy drive or location on hard drive where you previously extracted files.
16. Once the correct path appears in the dropdown box, 'symmpi.inf' should appear in 'File Name' box - if not, select it.
17. Click 'Open' button ('Install From Disk' dialog reappears with correct path displayed).
18. Click 'OK' (Upgrade Device Driver Wizard reappears).
19. Choose 'LSI Logic 1020/1030 Ultra320 SCSI Adapter'
20. Click 'Next'
21. Click 'Next' again to confirm choice and upgrade driver
22. Close Wizard by clicking Finish
23. Close Properties Dialog for device.
24. Do not reboot system yet if prompted to do so.
25. Repeat steps 5-23 for second channel after Device Manager refreshes.
26. Reboot System to complete upgrade.

Known Limitations: 
None
