===================================================================
=            Adaptec Ultra320 Family Manager Set v3.00            =
=                                                                 =
=     README for Microsoft Windows 2000/XP/Server2003             =
===================================================================

---------------------------
Changes for current release
---------------------------

PH3.0_MS_V98S10 July-25-2006 

Fixed Event 15 in Win2003 eventlog and pop-up error when running NTBackup 
with PV 120T DDS4 autoloader, which caused NTBackup to fail.(Ported fixes from FMS4.0SP5S3)
Fileversion changed to 7.0.0.4

PH3.0_MS_V98S7	MAY-05-2005
Recompiled for Windows 64bit


PH3.0_MS_V98S7	OCT-05-2004
To enable 4 word pause pre and post CRC, fixing problem when U320
Rev B chip can not see InforTrend/nStor box.


PH3.0_MS_V98S4  FEB-17-2004
contains the following fixes for Win2k/XP/W2k3 driver:
- Fix for Sense Data truncated if SenseLenght greater than 0x12.
- Fix for unsolicited RequestSense not being sent to the target.
- Enabled MemRdLn to fix event 9 on some system.
- Fix for event 9 when performing heavy IO  on some system that uses 
rev. A4 chip.
- Fix for slow performance on Channel B when loading driver using F6 method,
on 29320 HBA.

------------------------------------------------------------------

The following information is available in this file:

   1. Supported Hardware
   2. Version History
   3. Installation Instructions
   4. Command Line Options
   5. Additional Notes
   6. Disk Structure


1. Supported Hardware

   The following Adaptec SCSI Host Adapters are supported by these 
   Windows drivers.

   Ultra320 Controller       Description
   ----------------------------------------------------------------
   Adaptec SCSI Card 29320ALP Single Channel 64-bit PCI-X 133MHz to
                              Ultra320 SCSI Card (Low Profile)
   Adaptec SCSI Card 29320A   Single Channel 64-bit PCI-X 133MHz to
                              Ultra320 SCSI Card
   AIC-7901B                  Single Channel 64-bit PCI-X 133MHz to Ultra320
                              SCSI ASIC   
   Adaptec SCSI Card 39320A   Dual Channel 64-bit PCI-X 133MHz to
                              Ultra320 SCSI Card
   AIC-7902B                  Dual Channel 64-bit PCI-X 133MHz to Ultra320
                              SCSI ASIC
   Adaptec SCSI Card 39320    Dual Channel 64-bit PCI-X 133MHz to
                              Ultra320 SCSI Card (one external 
                              68-pin, two internal 68-pin)
   Adaptec SCSI Card 39320D   Dual Channel 64-bit PCI-X 133MHz to
                              Ultra320 SCSI Card (two external VHDC
                              and one internal 68-pin)
   HPQ 39320D                 Dual Channel 64-bit PCI-X 133MHz to
                              Ultra320 SCSI Card (two external VHDC
                              and one internal 68-pin)
   Adaptec SCSI Card 29320    Single Channel 64-bit PCI-X 133MHz to
                              Ultra320 SCSI Card (one external 
                              68-pin, two internal 68-pin, one
                              internal 50-pin)
   Adaptec SCSI Card 29320LP  Single Channel 64-bit Low Profile
                              PCI-X 133MHz to Ultra320 SCSI Card
                              (One external VHDC, one internal
                              68-pin)
   AIC-7901A                  Single Channel 64-bit PCI-X 133MHz to 
                              Ultra320 SCSI ASIC
   AIC-7902A4                 Dual Channel 64-bit PCI-X 133MHz to 
                              Ultra320 SCSI ASIC


2. Version History
   (v3.00, June 2003) Added support for additional SCSI 
   products: ASC-29320A/ASC-29320ALP and AIC-7901B.  Also added StorPort drivers
   and AMD64 for Windows 2003. 

   (v2.00, April 2003) Added support for one additional SCSI 
   product: ASC-39320A.

   (V1.30, January 2003) Added Server 2003 support and combination of 
    all drivers NT4/2000/XP/XP IA64/Server 2003/Server 2003 IA64

   (V1.20, November 2002) Added support for AIC-7902B ASIC.

   (V1.10, August 2002) Added support for four additional SCSI
   products: ASC-39320, ASC-29320, ASC-29320LP, AIC-7901.

   (V1.00, May 2002) This is the initial release of the 
   Ultra320 FMS.  
   
   The following is a list of supported features:

   2.1. Software/Hardware Features
        - Support for the SPI-4 "Ultra320" standard:
          - 320MB/s transfer rates
          - Packetized SCSI Protocol at 160MB/s and 320MB/s
          - Quick Arbitration Selection (QAS)
          - Domain Validation
          - Initiator Mode
          - Support for the PCI-X standard up to 133MHz
          - Support for the PCI v2.2 standard

   2.2. Operating System Support:
        - Microsoft Windows 2000 
        - Microsoft Windows XP 
        - Microsoft Windows Server 2003 
        - LME/PAE support (Windows 2000 and Server 2003 only)
        - ACPI Power Management (Win2000 and WinXP only)

     Refer to the User's Guide for more details on this.


3. Installation Instructions

   This section describes installing an Ultra320 SCSI host adapter.
   There are many different installation scenarios; please be sure
   to select the right one for you.

   3.1. Installing Windows 2000 with an Ultra320 SCSI Controller

        1) Start your system with the Windows 2000 Boot CD-ROM 
           in the CD-ROM drive. Note: When using a CD-ROM drive 
           to install Windows 2000 from the bootable CD-ROM, make 
           sure Bootable CD-ROM support is enabled. This is done 
           through the System BIOS Setup Utility.
        2) Press F6 when this message is displayed:
           
        "Press F6 if you need to install third-party SCSI drivers"
      
        3) When prompted, press "S" to supply the new driver.
        4) Insert the Adaptec Ultra320 FMS driver disk when the
           setup prompts you to insert the manufacturer supplied
           disk into drive A, and press Enter.
        5) The screen displays the adapter drivers supported on the
           disk.  Select "Adaptec Ultra320 SCSI Cards (Win2000)"
           and continue with the rest of the Windows 2000 
           installation. 
        6) Your system will reboot once more to finish setting up 
           Windows 2000. 

   3.5. Installing the Driver when Windows 2000 is Already 
        Installed
        
        1) Start Windows 2000. Windows 2000 will automatically 
           discover the new hardware and start the Found New 
           Hardware Wizard to guide you through the device driver 
           installation.
        2) At the Welcome to the Found New Hardware Wizard window, 
           select Next.
        3) On the Install Hardware Device Drivers screen, select 
           Display a list of the known drivers for this device, and
           click Next.
        4) Select the Have Disk button. You will be prompted to 
           insert the manufacturer supplied disk. Insert the 
           Adaptec Ultra320 FMS driver disk in your disk drive and
           enter the following path, then click OK.

           a:\Win32bit

        5) Select the Adaptec Ultra320 driver from the list, then
           click the Next button.
        6) Click the Next button again to confirm the installation 
           of the driver. You may be prompted with this warning 
           message: "The software you are about to install does not
           contain a Microsoft digital signature ..." Ignore the 
           warning and click Yes to continue the installation.
        7) When the driver is copied on the hard drive, click 
           Finish.
        8) You will be prompted to restart the computer. Select 
           Yes.

   3.6. Updating the driver under Windows 2000

        Follow these instructions only if Windows 2000 is already
        installed. 

        1) Right-click on "My Computer" and choose Properties from 
           the menu. Click on the "Hardware" tab and click on the 
           "Device Manager..." button.
        2) Under "SCSI and RAID controllers", click on the "+" sign
           (on the left). This will display the current SCSI 
           adapters installed.  Right-click on the device you wish
           to update and select Properties. 
        3) Click on the "Driver" tab and click on the "Update 
           Driver..." button. The Upgrade Device Driver Wizard will
           start. Click Next.   
        4) Make sure the "Search for a suitable driver for my
           device (recommended)" option is selected and click Next.
        5) Make sure the only selection that is checked is "Specify
           a location". Insert the Adaptec Ultra320 FMS driver disk
           into the disk drive and click Next. 
        6) At the "Copy manufacturer's files from" text box, type 
           "a:\Win32bit", and click OK.
        7) Choose a driver from the "Adaptec" provider that best
           fits your adapter and click Next. 
        8) Windows 2000 may state that a Digital Signature was not
           found for this driver. Click Yes. 
        9) If you are asked to enter in the path for the driver, 
           type "a:\Win32bit".
       10) Click Finish. You may be required to reboot your system
           at this point. 

     NOTE: If your SCSI card is a dual channel adapter (such as the
     39320), be sure to update both references in the Device 
     Manager before rebooting.


   3.7. Changing SCSI Boot Controllers in Windows 2000

        1) With the existing controller still installed, install 
           the Ultra320 controller into your system. Do not attach
           any devices to it at this time.
        2) Boot up the operating system. Install the driver for the
           Adaptec Ultra320 Adapter (see Section 3.5).
        3) Shut down Windows 2000. Turn off your system if
           necessary.
        4) Switch the bootable hard drive from the old SCSI 
           controller to the Ultra320 controller and boot up your
           computer.

   3.8. Installing Windows XP (32-bit) with an Ultra320 SCSI
        Controller

        1) Start your system with the Windows XP Boot CD-ROM in the
           CD-ROM drive. 

        NOTE: When using a CD-ROM drive to install Windows XP from
              the bootable CD-ROM, make sure Bootable CD-ROM 
              support is enabled. This is done through the System
              BIOS Setup Utility.

        2) Press F6 when this message is displayed:
           
           "Press F6 if you need to install third-party SCSI 
            drivers"

        3) When prompted, press "S" to supply the new driver.     
        4) Insert the Adaptec Ultra320 FMS driver disk when the
           setup prompts you to insert the manufacturer supplied
           disk into drive A, and then continue.
        5) The screen displays the adapter drivers supported on the
           disk. Select "Adaptec Ultra320 SCSI Cards (Win 2000/Win XP/
           Server 2003 IA-32)" and press enter. Continue with the
           rest of the Windows installation. 
        6) Your system will reboot once more to finish setting up 
           the operating system.

   3.9. Installing Windows XP 64-bit Edition with an Ultra320 SCSI 
        Controller

        1) Start your system with the Windows XP Boot CD-ROM in the
           CD-ROM drive. Be sure to choose the CD-ROM boot option 
           if working with an EFI BIOS.

        2) Press F6 when this message is displayed:
           
           "Press F6 if you need to install third-party SCSI 
            drivers"

        3) When prompted, press "S" to supply the new driver.
        4) Insert the Adaptec Ultra320 FMS driver disk when the
           setup prompts you to insert the manufacturer supplied
           disk into drive A, and then continue.
        5) The screen displays the adapter drivers supported on the
           disk. Select "Adaptec Ultra320 SCSI Cards 
           (Windows XP/2003 64bit)" and press enter. 
           Continue with the rest of the Windows installation. 
        6) Your system will reboot once more to finish setting up 
           the operating system.

        NOTE: When booting on an IA-64 system with an EFI BIOS, be
              sure to choose the "Microsoft Windows XP 64-Bit
              Edition" option to continue installing the operating
              system.

  3.10. Installing the Driver when Windows XP is Already Installed

        1) Physically install the Ultra320 adapter and boot up the
           system. Windows will automatically discover the new
           hardware and start the Found New Hardware Wizard.
        2) Choose the "Install from a list or specific location"
           option and click Next.
        3) Insert the Adaptec Ultra320 FMS driver disk into the 
           floppy drive, check the "Include this location in the
           search" option, type in "a:\Win32bit" and click Next.
           If you are installing on a 64-bit  system, type in 
           "a:\Win64bit" and click next.
        4) At this point you may be prompted with a warning message
           that the driver has not passed Windows Logo testing. 
           Ignore this message if it appears and click "Continue
           Anyway".
        5) When the driver is copied on the hard drive, click 
           Finish.
        6) You may be required to restart the computer at this
           point.
        7) If you are installing a dual channel adapter, the Found
           New Hardware Wizard will restart. Choose the option 
           "Install the software automatically" and follow the 
           instructions.  Again, you may be required to restart 
           your computer.

  3.11. Updating the driver under Windows XP

        Follow these instructions only if Windows XP is already
        installed. 

        1) Click the Start button on the Windows XP task bar, and 
           point to Control Panel.
        2) Click the Control Panel. If you are in Category View, 
           click on "Performance and Maintenance". 
        3) Click on System; click on the "Hardware" tab and click
           on the "Device Manager" button.
        4) Under "SCSI and RAID controllers", click on the "+" sign
           (on the left). This will display the current SCSI 
           adapters installed.  Right-click on the device you wish
           to update and click Properties. 
        5) Click on the "Driver" tab and click on the "Update 
           Driver..." button. The Hardware Update Wizard will
           start.
        6) Make sure the option "Install from a list or specific 
           location (Advanced)" is selected and click the "Next"
           button.  
        7) Make sure the option "Don't search. I will choose the
           driver to install." is selected and click the "Next"
           button. 
        8) Click the "Have Disk..." button and insert the Adaptec
           Ultra320 FMS driver disk into the disk drive.
        9) At the "Copy manufacturer's files from" text box, type 
           "a:\Win32bit" (or a:\Win64bit for 64-bit system) 
           and click the "OK" button.  
       10) Click the "Next" button. 
       11) Windows XP may state that the software "..... has not 
           passed Windows Logo testing...". Click the "Continue
           Anyway" button.
       12) Click the "Finish" button. You may be required to reboot
           your system at this point.

     NOTE: If your SCSI card is a dual channel adapter (such as the
     39320), be sure to update both references in the Device 
     Manager before rebooting.


  3.12. Changing SCSI Boot Controllers in Windows XP

        1) With the existing controller still installed, install 
           the Ultra320 controller into your system. Do not attach
           any devices to it at this time.
        2) Boot up the operating system. Install the driver for the
           Adaptec Ultra320 Adapter (see Section 3.10).
        3) Shut down Windows XP. Turn off your system if necessary.
        4) Switch the bootable hard drive from the old SCSI 
           controller to the Ultra320 controller and boot up your
           computer.

  3.13. Installing Windows Server 2003 (32-bit) with an Ultra320 SCSI
        Controller

        1) Start your system with the Windows Server 2003 Boot CD-ROM 
           in the CD-ROM drive. 

        NOTE: When using a CD-ROM drive to install Windows Server 2003 
              from the bootable CD-ROM, make sure Bootable CD-ROM 
              support is enabled. This is done through the System
              BIOS Setup Utility.

        2) Press F6 when this message is displayed:
           
           "Press F6 if you need to install third-party SCSI 
            drivers"

        3) When prompted, press "S" to supply the new driver.     
        4) Insert the Adaptec Ultra320 FMS driver disk when the
           setup prompts you to insert the manufacturer supplied
           disk into drive A, and then continue.
        5) The screen displays the adapter drivers supported on the
           disk. Select "Adaptec Ultra320 SCSI Cards 
           (Wi 2000/Win XP/Server 2003 IA-32)" and press enter. 
           Continue with the rest of the Windows installation. 
        6) Your system will reboot once more to finish setting up 
           the operating system.

  3.14. Installing Windows Server 2003 x64 Edition with 
        an Ultra320 SCSI Controller

        1) Start your system with the Windows Server 2003 Boot CD-ROM 
           in the CD-ROM drive. Be sure to choose the CD-ROM boot option 
           if working with an EFI BIOS.

        2) Press F6 when this message is displayed:
           
           "Press F6 if you need to install third-party SCSI 
            drivers"

        3) When prompted, press "S" to supply the new driver.
        4) Insert the Adaptec Ultra320 FMS driver disk when the
           setup prompts you to insert the manufacturer supplied
           disk into drive A, and then continue.
        5) The screen displays the adapter drivers supported on the
           disk. Select "Adaptec Ultra320 SCSI Cards 
           (Windows XP/2003 64bit)" and press enter. 
           Continue with the rest of the Windows installation. 
        6) Your system will reboot once more to finish setting up 
           the operating system.

        NOTE: When booting on an IA-64 system with an EFI BIOS, be
              sure to choose the "Microsoft Windows Server 2003 64-Bit
              Edition" option to continue installing the operating
              system.

  3.15. Installing the Driver when Windows Server 2003 is Already 
        Installed

        1) Physically install the Ultra320 adapter and boot up the
           system. Windows will automatically discover the new
           hardware and start the Found New Hardware Wizard.
        2) Choose the "Install from a list or specific location"
           option and click Next.
        3) Insert the Adaptec Ultra320 FMS driver disk into the 
           floppy drive, check the "Include this location in the
           search" option, type in "a:\Win32bit" and click Next.
           If you are installing on a 64-bit system, type in 
           "a:\Win64bit" and click next.
        4) At this point you may be prompted with a warning message
           that the driver has not passed Windows Logo testing. 
           Ignore this message if it appears and click "Continue
           Anyway".
        5) When the driver is copied on the hard drive, click 
           Finish.
        6) You may be required to restart the computer at this
           point.
        7) If you are installing a dual channel adapter, the Found
           New Hardware Wizard will restart. Choose the option 
           "Install the software automatically" and follow the 
           instructions.  Again, you may be required to restart 
           your computer.

  3.16. Updating the driver under Windows Server 2003

        Follow these instructions only if Windows Server 2003 is 
        already installed. 

        1) Click the Start button on the Windows Server 2003 task bar, 
           and point to Control Panel.
        2) Click on System; click on the "Hardware" tab and click
           on the "Device Manager" button.
        3) Under "SCSI and RAID controllers", click on the "+" sign
           (on the left). This will display the current SCSI 
           adapters installed.  Right-click on the device you wish
           to update and click Properties. 
        4) Click on the "Driver" tab and click on the "Update 
           Driver..." button. The Hardware Update Wizard will
           start.
        5) Make sure the option "Install from a list or specific 
           location (Advanced)" is selected and click the "Next"
           button.  
        6) Make sure the option "Don't search. I will choose the
           driver to install." is selected and click the "Next"
           button. 
        7) Click the "Have Disk..." button and insert the Adaptec
           Ultra320 FMS driver disk into the disk drive.
        8) At the "Copy manufacturer's files from" text box, type 
           "a:\Win32bit" (or a:\Win64bit for 64-bit system) 
           and click the "OK" button.  
        9) Click the "Next" button. 
       10) Windows Server 2003 may state that the software "..... has not 
           passed Windows Logo testing...". Click the "Continue
           Anyway" button.
       11) Click the "Finish" button. You may be required to reboot
           your system at this point.

     NOTE: If your SCSI card is a dual channel adapter (such as the
     39320), be sure to update both references in the Device 
     Manager before rebooting.


  3.17. Changing SCSI Boot Controllers in Windows Server 2003

        1) With the existing controller still installed, install 
           the Ultra320 controller into your system. Do not attach
           any devices to it at this time.
        2) Boot up the operating system. Install the driver for the
           Adaptec Ultra320 Adapter (see Section 3.16).
        3) Shut down Windows Server 2003. Turn off your system if necessary.
        4) Switch the bootable hard drive from the old SCSI 
           controller to the Ultra320 controller and boot up your
           computer.


4. Command Line Options

   4.1. Adaptec SCSI Driver Parameters

        WARNING: ALTERING OR ADDING THESE DRIVER PARAMETERS
                 INCORRECTLY CAN RENDER YOUR SYSTEM INOPERABLE.
                 USE THEM WITH CAUTION. 

        Follow the instructions below to enter the registry values
        that affect the configuration information for Adaptec SCSI
        Card drivers. All SCSI Cards supported by the installed
        driver are affected by the values you enter here.

        Each driver has its own "key" reference. In this example,
        the Ultra320 key is used (adpu320). To enter 
        driver-specific parameters, follow these steps: 

        1) Select Run from the Start button.
        2) Type "regedt32" and press Enter.
        3) Open the registry list to the following location: 

           HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\
           adpu320\Parameters\Device\
   
           If the \Parameters\Device\ keys already exist, skip to
           step 6 below to begin entering parameters. If the keys
           do not yet exist, you will need to create them by 
           continuing with step 4.
        4) Click on the adpu320 key. Select the Add Key from the
           Edit menu; Type "Parameters" in the Key Name edit box.
           Leave the Class edit box blank.
        5) Click on the Parameters key. Select the Add Key from the
           Edit menu; Type "Device" in the Key Name edit box. Leave
           the Class edit box blank. To specify a certain host 
           adapter, append Device with the number of the host 
           adapter. For example, type "Device0" for the first host
           adapter, "Device1" for the second, etc. If you omit the
           host adapter number, the configuration information
           applies to all supported host adapters.
        6) Click on the Device key. Select Add Value from the Edit
           menu; type "DriverParameters" in the Value Name edit 
           box. Enter the Data Type and press Enter. A String 
           Editor text box appears. Enter valid parameters in the
           text box. When entering multiple parameters, each
           parameter must be separated by a space. To enter 
           additional values, repeat step 6. 
   
     Note: Changes made with the Registry Editor do not take effect
           until you shut down and then restart your system.

   ----------------------------------------------------------------
            Option: /MAXTAGS=[value]
        Definition: Specifies a tagged command queue depth per
                    target.
         Data Type: REG_SZ
   Possible Values: 1-255
     Default Value: 32
   ----------------------------------------------------------------
            Option: /INSTRUMENTATION
        Definition: Enables instrumentation support in the driver.
         Data Type: REG_SZ
   Possible Values: N/A
     Default Value: N/A
   ----------------------------------------------------------------
            Option: /INSTR_ERRLOG_Z=[value]
        Definition: Specifies the length of the instrumentation 
                    error log.
         Data Type: REG_SZ
   Possible Values: 0-127
     Default Value: 32
   ----------------------------------------------------------------
            Option: /RDSTRM
        Definition: Enables read streaming to be negotiated for all
                    drives.
         Data Type: REG_SZ
   Possible Values: N/A
     Default Value: Off
   ----------------------------------------------------------------
            Option: /MAXIMUMSGLIST=[value]
        Definition: Sets the maximum transfer size for an 
                    individual command. The formula is:
                    TRANSFER SIZE = PAGE_SIZE * (number of 
                    elements -1)
         Data Type: REG_SZ
   Possible Values: 2-255
     Default Value: 65
   ----------------------------------------------------------------

   4.2. Windows SCSI Driver Parameters

        WARNING: ALTERING OR ADDING THESE DRIVER PARAMETERS
                 INCORRECTLY CAN RENDER YOUR SYSTEM INOPERABLE.
                 USE THEM WITH CAUTION. 

        Follow the instructions below to enter the registry values
        that affect how the Windows SCSI manager interprets the
        generic configuration information of SCSI device drivers. 
        All SCSI Cards supported by the installed driver are 
        affected by the values you enter here.

        Follow the instructions below to enter the registry values
        that affect the configuration information for Adaptec SCSI
        Card drivers. All SCSI Cards supported by the installed
        driver are affected by the values you enter here.

        Each driver has its own "key" reference. In this example,
        the Ultra320 key is used (adpu320). To enter Windows
        parameters, follow these steps: 

        1) Select Run from the start button.
        2) Type "regedt32" and press Enter.
        3) Open the registry list to the following location: 

           HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\
           adpu320\Parameters\Device\
   
           If the \Parameters\Device\ keys already exist, skip to
           step 6 below to begin entering parameters. If the keys
           do not yet exist, you will need to create them by 
           continuing with step 4.
        4) Click on the adpu320 key. Select the Add Key from the
           Edit menu; Type "Parameters" in the Key Name edit box.
           Leave the Class edit box blank.
        5) Click on the Parameters key. Select the Add Key from the
           Edit menu; Type "Device" in the Key Name edit box. Leave
           the Class edit box blank. To specify a certain host 
           adapter, append Device with the number of the host 
           adapter. For example, type "Device0" for the first host
           adapter, "Device1" for the second, etc. If you omit the
           host adapter number, the configuration information
           applies to all supported host adapters.
        6) Click on the Device key. Select Add Value from the Edit
           menu. In the Value Name edit box, enter one of the valid
           parameter values. Make sure to enter the appropriate
           Data Type for the value. To enter additional values, 
           repeat step 6. 
   
     Note: Changes made with the Registry Editor do not take effect
           until you shut down and then restart your system.

   ----------------------------------------------------------------
            Option: MaximumLogicalUnit
        Definition: This command allows the user to specify how
                    many LUNs the SCSI bus scans for during system
                    initialization.
         Data Type: REG_DWORD
   Possible Values: 0-8 (Windows NT 4), 0-32 (Windows 2000/XP/Server 2003)
     Default Value: 8 (Windows NT 4), 32 (Windows 2000/XP/Server 2003)
   ----------------------------------------------------------------
            Option: NumberOfRequests
        Definition: Specifies the maximum number of outstanding or 
                    concurrent requests that can be delivered to 
                    the SCSI adapter.
         Data Type: REG_DWORD
   Possible Values: 16-512
     Default Value: 255
   ----------------------------------------------------------------
            Option: DisableTaggedQueuing
        Definition: If present, tells the SCSI adapter to 
                    disable tagged queuing for all devices.
         Data Type: REG_DWORD
   Possible Values: N/A
     Default Value: N/A
   ----------------------------------------------------------------
            Option: DisableDisconnects
        Definition: If present, tells the SCSI adapter not to
                    allow any target device disconnect privileges 
                    for I/O.
         Data Type: REG_DWORD
   Possible Values: N/A
     Default Value: N/A
   ----------------------------------------------------------------
            Option: DisableMultipleRequests
        Definition: Limits the number of commands to each logical
                    unit to one.
         Data Type: REG_DWORD
   Possible Values: N/A
     Default Value: N/A
   ----------------------------------------------------------------


5. Additional Notes

   5.1. Operating System or Technology Limitations

        5.1.1. Multi-initiator configurations are supported with
               Ultra160 and previous generation hard drives:

               Current generation Ultra320 hard drives do not 
               support this configuration.

        5.1.2. An Event 9 in the Event Viewer may occur with a 
               DLT 7000 or 8000 tape device:

               If this occurs, install the registry fix 
               (MAXIO64K.REG) located on this diskette.

        5.1.3. Ultra320 hard disk drive support

               Adaptec only supports Ultra320 hard drives that have
               the latest firmware available. Please check with
               your hard drive manufacturer to ensure you have the
               latest version.


6. Disk Structure

   \MAXIO64K.REG            - A Windows NT4/2000/XP registry fix
                              for DLT 7000/8000 tape devices (see
                              5.1.2.)
   \README.TXT              - Contains latest technical info and
                              basic driver install procedures for
                              Windows 2000/XP and Server 2003
   \TXTSETUP.OEM            - Reference file for fresh 
                              installations of Windows 2000/XP
                              and Server 2003
   \U320DSK1                - Reference file for standard 
                              installations of Windows 2000/XP
                              and Server 2003
   
   \WIN32BIT\ADPU320.SYS    - Ultra320 SCSI driver for Windows 2000,
                              XP and Server 2003
   \WIN32BIT\ADPU320.INF    - Information file for ADPU320.SYS
   \WIN32BIT\ADPU320.CAT    - Digital Signature for ADPU320.SYS

   \WIN64BIT\ADPU320.SYS    - Ultra320 SCSI driver for Windows XP 
                                    and Server 2003 (x64 Editions)
   \WIN64BIT\ADPU320.INF    - Information file for ADPU320.SYS
   \WIN64BIT\ADPU320.CAT    - Digital Signature for ADPU320.SYS
   
   

-------------------------------------------------------------------

(c) 2006 Adaptec, Inc. All Rights Reserved.

This software contains the valuable trade secrets of Adaptec or its 
licensors. The software is protected under international copyright laws 
and treaties. This software may only be used in accordance with the 
terms of its accompanying license agreement.

No part of this publication may be reproduced, stored in a retrieval
system, or transmitted in any form or by any means, electronic,
mechanical, photocopying, recording or otherwise, without prior
written consent of Adaptec, Inc.,
691 South Milpitas Blvd., Milpitas, CA 95035


