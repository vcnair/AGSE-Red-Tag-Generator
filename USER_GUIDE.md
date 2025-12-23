# AGSE Red Tag Generator - User Guide

<div align="center">
  <img src="https://github.com/user-attachments/assets/c2ef2c58-de3e-4df9-94af-089acab44f9e" alt="AGSE Red Tag Generator Main Screen" width="800"/>
  <p><em>The AGSE Red Tag Generator main interface</em></p>
</div>

## Table of Contents

1. [What is the AGSE Red Tag Generator?](#what-is-the-agse-red-tag-generator)
2. [Purpose and Benefits](#purpose-and-benefits)
3. [Getting Started](#getting-started)
4. [Interface Overview](#interface-overview)
5. [Step-by-Step Usage Guide](#step-by-step-usage-guide)
6. [Features in Detail](#features-in-detail)
7. [Data Management](#data-management)
8. [PDF Red Tag Output](#pdf-red-tag-output)
9. [Tips and Best Practices](#tips-and-best-practices)
10. [Troubleshooting](#troubleshooting)
11. [FAQ](#faq)

---

## What is the AGSE Red Tag Generator?

The **AGSE Red Tag Generator** is a specialized quality control tool designed for manufacturing and quality assurance operations. It automates the creation of professional, ISO-compliant red tags (hold tags) for non-conforming materials and rejected parts.

### Key Features at a Glance

- 🔍 **Instant NCR Lookup**: Search and retrieve Non-Conformance Reports (NCRs/NCMRs) instantly
- 📊 **Browse Database**: View and filter through all quality records in a comprehensive table
- 📄 **PDF Generation**: Create print-ready 4x6" red tags with QR codes for traceability
- 🔄 **Live Data Mode**: Optional real-time synchronization with master data sources
- 📱 **Modern Interface**: Clean, intuitive design optimized for shop floor and quality lab use
- 🔐 **ISO Compliant**: Meets ISO 9001 and AS9100 traceability standards

---

## Purpose and Benefits

### Why Use This Tool?

**Traditional Process (Manual):**
- Quality inspectors had to manually write red tags
- Time-consuming data entry
- Risk of human error or illegible handwriting
- Difficult to track and audit
- No digital traceability

**With AGSE Red Tag Generator:**
- ✅ Generate professional tags in seconds
- ✅ Eliminate handwriting errors
- ✅ Automatic data population from NCR database
- ✅ QR codes for instant digital traceability
- ✅ Consistent formatting and compliance
- ✅ Searchable history and quick reprints

### Who Should Use This Tool?

- **Quality Inspectors**: Primary users who identify non-conformances
- **Quality Managers**: For reviewing and reprinting tags
- **Production Supervisors**: To understand rejected material status
- **Receiving Inspection**: For tagging incoming rejected materials
- **Warehouse Staff**: For properly labeling and segregating hold items

---

## Getting Started

### System Requirements

- **Web Browser**: Modern browser (Chrome, Edge, Firefox, Safari)
- **Internet Connection**: Required for initial load and live mode (optional)
- **No Installation Needed**: Runs entirely in your web browser

### Accessing the Application

1. Open your web browser
2. Navigate to the application URL (provided by your organization)
3. The application loads automatically with your NCR database

**Initial Screen Indicators:**
- Top right shows "**1715 NCR Records**" (or your database count)
- Shows "**Active Data: CSV Auto-loaded**" indicating data is ready
- Left panel shows controls for data import and search

---

## Interface Overview

<div align="center">
  <img src="https://github.com/user-attachments/assets/c2ef2c58-de3e-4df9-94af-089acab44f9e" alt="Interface Overview" width="800"/>
</div>

### Header Bar

Located at the top of the screen:

- **AGSE Red Tag Logo**: Identifies the application
- **Quality Operations v1.3**: Current version number
- **Record Count**: Shows total NCR records available (e.g., "1715 NCR Records")
- **Data Source Indicator**: 
  - "Active Data: CSV Auto-loaded" - Using local/uploaded data
  - "LIVE MODE" (green) - Real-time synchronization active
  - "Demo Environment" - Using demo data

### Left Control Panel

Three main sections in order of use:

#### 1. Import Log Section
- **Enable Live Mode** button: Activate real-time data synchronization
- **Sync Master CSV** button: Upload a new CSV data file
- **Refresh Now** button: Manually refresh data (appears when in Live Mode)

#### 2. Identify NCMR Section
- **Search Box**: Enter NCMR/NCR numbers to find records
- **Search Button**: Execute the search (magnifying glass icon)

#### 3. Recent History Section
- Displays your 10 most recent searches
- Click any entry to quickly reload that record
- Shows timestamp of each search

### Main Display Area

The right side of the screen shows:

- **System Idle State**: When no record is selected, displays a placeholder
- **Record Details**: When a record is found, shows the complete red tag preview
- **Browse Table**: When searching with empty field, shows all records

---

## Step-by-Step Usage Guide

### Basic Workflow: Finding and Printing a Red Tag

#### Step 1: Search for an NCMR

<div align="center">
  <img src="https://github.com/user-attachments/assets/c2ef2c58-de3e-4df9-94af-089acab44f9e" alt="Search for NCMR" width="600"/>
</div>

1. Locate the **"2. Identify NCMR"** section in the left panel
2. Click in the search box labeled `NCMR # (e.g. 14962)`
3. Type the NCMR number (examples: `14962`, `0014962`, `13815`)
   - You can include or omit leading zeros
   - The system handles both formats
4. Press **Enter** or click the red **Search button** (magnifying glass icon)
5. Wait for results (usually instant)

**What Happens:**
- System searches the database
- If found: Record displays in the main area
- If not found: Red error message appears with suggestions

---

#### Step 2: Review the Record Details

<div align="center">
  <img src="https://github.com/user-attachments/assets/de22cb2e-0afe-4c96-8301-467b93c6c2d6" alt="Record Details" width="700"/>
</div>

Once a record loads, you'll see a detailed preview organized as follows:

**Red Header Section:**
- 🔴 **"REJECTED / HOLD"** title in bold white text
- **ISO Traceable** badge (compliance indicator)
- **Priority** badge (if marked urgent)
- **NCMR Number** displayed prominently (e.g., "0014962")

**Key Information Grid:**
- **Status**: Priority status (Standard/Urgent)
- **Discovery**: Where the issue was found (e.g., "Subassembly")
- **Flagged**: Date and time the NC was identified
- **Part Number**: The affected part number
- **Quantity**: Number of defective parts
- **Inspector**: Inspector stamp number who flagged it
- **PO Ref**: Purchase order reference
- **Job No**: Job or GL number
- **Defect**: Type of defect (e.g., "Dimensional")

**Additional Details:**
- **Part Description**: Full description of the part (e.g., "MOUNTING PLATE")
- **Disposition Path**: 
  - ✅ Shows disposition decision (RWK = Rework, Scrap, Mixed, etc.)
  - WOR number if rework is required
- **Inspector Actions/Logic**: Comments and notes from the inspector

**Action Buttons:**
- 🔴 **Generate 4x6 Label**: Creates and downloads the PDF red tag
- 🖨️ **Audit View**: Opens browser print dialog for documentation

---

#### Step 3: Generate the Red Tag PDF

1. Review all information for accuracy
2. Click the large red **"Generate 4x6 Label"** button
3. Wait for PDF generation (1-2 seconds)
4. The PDF automatically downloads to your browser's download folder

**PDF File Details:**
- Filename: `RedTag_[NCMR]_[timestamp].pdf`
- Size: 4 inches × 6 inches (standard label size)
- Format: High-resolution, print-ready PDF
- Contents:
  - Red header with "REJECTED" text
  - All key information from the record
  - QR code for digital traceability
  - ISO compliance markers
  - Timestamp for audit trail

---

#### Step 4: Print the Red Tag

1. Open the downloaded PDF file
2. **Printer Settings:**
   - Paper size: **4" × 6"** (label stock)
   - Orientation: Portrait
   - Scale: 100% (actual size)
   - Print quality: High quality or Best
3. For thermal printers:
   - Use high-contrast thermal label stock
   - Set to "Label" mode
   - Adjust darkness for QR code clarity
4. Print and affix to the non-conforming material

---

### Alternative Workflow: Browsing All Records

<div align="center">
  <img src="https://github.com/user-attachments/assets/91f02550-0f00-4bde-88fc-3d694ef7696d" alt="Browse All Records" width="800"/>
</div>

#### When to Browse Instead of Search

- You don't have a specific NCMR number
- You want to review multiple recent NCRs
- You need to find records by part number or description
- You're auditing a specific discovery area or disposition type

#### How to Browse Records

1. **Open the Table Modal:**
   - Leave the NCMR search box **empty**
   - Click the red **Search button**
   - OR: Simply press Enter with an empty search box

2. **Browse NCR Records Modal Opens:**
   - Shows all 1,715 records (or your database count)
   - Displays 20 records per page
   - Six columns: NCMR, Date, Part No., Description, Area, Status

3. **Filter Records:**
   - Use the search box at the top: "Filter by NCMR, Part No., Description..."
   - Type any keyword (part number, description, area, disposition)
   - Results update instantly as you type
   - Example searches:
     - `MOUNTING` - finds all mounting plates
     - `RWK` - shows all rework dispositions
     - `Scrap` - displays scrapped items
     - `Receiving` - shows receiving inspection NCRs
     - `13825` - finds specific NCMR

4. **Navigate Pages:**
   - **◄ Previous** / **Next ►** buttons at bottom
   - Page indicator shows: "Page 1 of 86"
   - Record count shows: "Showing 1 - 20 of 1715"

5. **Select a Record:**
   - Click any row in the table
   - The modal closes
   - Selected record displays in the main area
   - Ready to generate the red tag

#### Table Column Definitions

| Column | Description | Example |
|--------|-------------|---------|
| **NCMR** | Non-Conformance Report number | 0013815 |
| **Date** | Date the NCR was created | 10/17/2024 |
| **Part No.** | Part number of defective item | 11C3323P06 |
| **Description** | Part description | THREADED ROD |
| **Area** | Discovery location | Receiving Inspection |
| **Status** | Disposition decision | RWK, Scrap, Mixed |

#### Status Badge Colors

- 🟡 **Yellow (RWK)**: Rework required
- 🔴 **Red (Scrap)**: Item to be scrapped
- 🟣 **Purple (Mixed)**: Mixed disposition
- ⚪ **Gray (Pending)**: No disposition yet

---

## Features in Detail

### 1. Recent History Tracking

**Purpose:** Quick access to recently viewed NCRs for reprinting or review.

**How It Works:**
- Automatically saves your last 10 searches
- Persists even after closing browser
- Shows NCMR number and time accessed
- Click any entry to instantly reload that record

**Use Cases:**
- Reprinting damaged labels
- Reviewing related NCRs in sequence
- Comparing similar non-conformances
- Training new inspectors on recent examples

**Managing History:**
- History is stored locally in your browser
- Clears when you clear browser data
- Not shared between devices
- Each user has their own history

---

### 2. Live Data Mode

**Purpose:** Enable real-time synchronization with your master NCR database (SharePoint, network drive, etc.).

**When to Use Live Mode:**
- You need the absolute latest NCR data
- Multiple users are adding NCRs simultaneously
- You want automatic updates without manual CSV uploads

**How to Enable Live Mode:**

1. Click **"Enable Live Mode"** button in the Import Log section
2. Button changes to green: **"LIVE MODE Active"**
3. System automatically:
   - Fetches latest data from the configured source
   - Updates record count
   - Displays last sync time
   - Sets up auto-refresh (default: every 5 minutes)

**Live Mode Indicators:**
- 🟢 **Green "LIVE MODE"** badge in header
- **WiFi icon** next to status
- **Last sync time** displays (e.g., "2:14 PM")
- **Record count updates** automatically

**Manual Refresh:**
- Click **"Refresh Now"** button (appears below Live Mode toggle)
- Forces immediate data fetch
- Useful after you know a new NCR was just created

**Disabling Live Mode:**
- Click the **"LIVE MODE Active"** button again
- Returns to local data mode
- Stops auto-refresh
- Conserves network bandwidth

**Technical Note:** Live Mode requires proper configuration of Power Automate or similar data sync service. See `docs/POWER_AUTOMATE_SETUP.md` for IT setup instructions.

---

### 3. CSV Data Upload

**Purpose:** Update the NCR database with a new CSV export from your quality management system.

**When to Use:**
- You received an updated NCR export
- Live Mode is not configured
- You're working offline
- You want to test with custom data

**How to Upload a CSV:**

1. Prepare your CSV file:
   - Must include required columns (NCMR, Date, Part No., etc.)
   - Use UTF-8 encoding
   - No special characters in column headers
   - See format specification below

2. Click **"Sync Master CSV"** button in Import Log section
3. File picker dialog opens
4. Select your CSV file
5. Wait for processing (usually 1-2 seconds)
6. Success message displays: "Success: Loaded [count] records"
7. Record count updates in header

**Required CSV Columns:**

The CSV file must contain these columns (exact names, case-sensitive):

- `NCMR` - NCR/NCMR number (required)
- `DATE` - Date of record
- `Date NC was Flagged` - Date the non-conformance was flagged
- `Time NC was Flagged` - Time the non-conformance was flagged
- `Priority Status` - Standard/Urgent
- `Discovery Area` - Where the issue was discovered
- `Part No.` - Part number
- `Part Description` - Description of the part
- `QTY of Defected Parts` - Quantity of defective parts
- `Purchase Order No.` - Purchase order reference
- `Source Simplified` - Simplified source
- `Source` - Full source name
- `Job No. or GL No.` - Job or GL number
- `Type of Defect` - Type of defect
- `Issuing Inspector Stamp No.` - Inspector ID
- `Disposition` - Disposition status (RWK, Scrap, etc.)
- `Containment Required? (Y/N)` - Containment requirement
- `Containment Completed?` - Containment completion status
- `RTV Status` - Return to vendor status
- `Scrap Cost` - Cost of scrap
- `Rework WOR No.` - Work order number for rework
- `Actions / Comments` - Additional notes
- `Date Dispositioned in Global Shop` - Disposition date
- `Date Closed` - Closure date

**Example CSV (first 3 rows):**

```csv
NCMR,DATE,Date NC was Flagged,Time NC was Flagged,Priority Status,Discovery Area,Part No.,Part Description,QTY of Defected Parts,Purchase Order No.,Source Simplified,Source,Job No. or GL No.,Type of Defect,Issuing Inspector Stamp No.,Disposition,Containment Required? (Y/N),Containment Completed?,RTV Status,Scrap Cost,Rework WOR No.,Actions / Comments,Date Dispositioned in Global Shop,Date Closed
0014962,8/27/2025,8/27/2025,7:30:00 AM,Standard,Subassembly,AM-2079-1400,MOUNTING PLATE,8,118650,Internal,AGSE Manufacturing,1220,Dimensional,110,RWK,N,N/A,N/A,$0,R15183,Released to Stores,8/28/2025,8/29/2025
0013815,10/17/2024,10/17/2024,9:15:00 AM,Standard,Receiving Inspection,11C3323P06,THREADED ROD,50,125489,Vendor,Acme Fasteners,1145,Thread Damage,105,RWK,Y,Yes,N/A,$0,R15001,Vendor rework required,10/18/2024,10/25/2024
```

**CSV Upload Errors:**

| Error Message | Solution |
|---------------|----------|
| "Empty or invalid CSV file" | Ensure file contains data and valid headers |
| "Parse Error: ..." | Check for special characters, fix formatting |
| "Loaded 0 records" | Verify column names match exactly |

---

### 4. Print and Audit View

**Generate 4x6 Label Button:**
- Primary action for creating the physical red tag
- Downloads a professionally formatted PDF
- Optimized for 4×6 inch thermal label printers
- Includes QR code for digital twin traceability

**Audit View Button:**
- Opens browser print dialog
- Prints standard 8.5×11 inch paper format
- Includes all record details
- Useful for documentation and filing
- No QR code (audit copy only)

---

## Data Management

### Automatic Data Loading

When you first open the application:

1. **Automatic CSV Load:**
   - System looks for `/public/data/ncr-data.csv`
   - Automatically loads this file on startup
   - No manual action required
   - Simulates a production environment

2. **Data Source Indicator:**
   - "Active Data: CSV Auto-loaded" = Default data loaded
   - "1715 NCR Records" = Number of records available

3. **Ready to Use:**
   - Search functionality immediately active
   - Browse feature immediately available
   - No setup needed

### Data Persistence

**Local Storage:**
- Recent search history saved in browser
- Custom uploaded CSV data saved in memory
- Persists across page refreshes
- Cleared when browser cache is cleared

**Live Mode Data:**
- Fetched from external source on demand
- Auto-refreshes periodically
- Not permanently stored locally
- Always uses latest data from master source

### Data Security

- All data processing happens in your browser
- No data sent to external servers (except in Live Mode to your configured source)
- CSV files processed locally
- Secure HTTPS connection recommended

---

## PDF Red Tag Output

### What's Included on the Red Tag

**Header Section (Red Background):**
- Large, bold "REJECTED" text
- "NON-CONFORMANCE HOLD TAG" subtitle
- ISO compliance badges
- NCMR number in large font

**Body Section:**
- **Primary Information:**
  - Part Number
  - Part Description
  - Quantity of defective parts
  - Discovery Area
  - Date and Time flagged
  - Priority Status
  
- **Tracking Information:**
  - Inspector Stamp Number
  - Purchase Order Number
  - Job/GL Number
  - Type of Defect
  
- **Disposition Section:**
  - Disposition decision (RWK/Scrap/etc.)
  - Rework WOR number (if applicable)
  - Inspector actions/comments

**Footer Section:**
- QR Code (links to digital twin record)
- Unique timestamp
- Compliance markers
- Optimized for thermal printing note

### QR Code Functionality

Each red tag includes a unique QR code that contains:

- NCMR number
- Timestamp of generation
- Direct link to digital record (if configured)

**Scanning the QR Code:**
- Use any smartphone QR scanner
- Instantly retrieves the NCR details
- Provides audit trail
- Enables mobile access to quality records

### Printing Best Practices

**For Thermal Label Printers:**
1. Use high-quality thermal label stock (4×6 inches)
2. Set printer to highest quality/darkness
3. Ensure QR code prints clearly (test scan before mass printing)
4. Use "Label" mode, not "Receipt" mode
5. Adjust darkness if QR code doesn't scan properly

**For Standard Printers:**
1. Use label sheets with 4×6 inch labels
2. Print in color for best visibility (red header)
3. Or use black & white with high contrast
4. Check scaling is set to 100% (actual size)
5. Use heavy label stock for durability

**Quality Checks:**
- Print one test label first
- Verify QR code scans correctly
- Check all text is legible
- Ensure no information is cut off
- Verify red header prints correctly

---

## Tips and Best Practices

### For Quality Inspectors

1. **Keep History Clean:**
   - Search for NCRs as you need them
   - Use Recent History for quick reprints
   - Don't search repeatedly for the same NCMR

2. **Verify Before Printing:**
   - Always review the record details
   - Confirm part number matches physical part
   - Check disposition is appropriate
   - Ensure all data is complete

3. **Handle Urgent NCRs:**
   - Look for "Priority" badge in header
   - These appear in red/black badge
   - Print and apply these tags immediately
   - Follow escalation procedures for urgent items

4. **Use Browse for Audits:**
   - Filter by discovery area to review section performance
   - Filter by disposition to track rework vs. scrap rates
   - Filter by date range (via CSV export) for reporting

### For Quality Managers

1. **Data Management:**
   - Schedule regular CSV updates (daily or weekly)
   - Or configure Live Mode for real-time updates
   - Keep master database current

2. **Training:**
   - Show new inspectors the browse feature
   - Demonstrate search with/without leading zeros
   - Practice printing on scrap labels first

3. **Standardization:**
   - Ensure all inspectors use the tool consistently
   - Audit printed tags for compliance
   - Review recent history for unusual patterns

### For IT Administrators

1. **Initial Setup:**
   - Place `ncr-data.csv` in `/public/data/` directory
   - Configure CORS if using Live Mode
   - Set up Power Automate for auto-sync (see docs)

2. **Maintenance:**
   - Monitor CSV file size (large files may slow loading)
   - Archive old NCRs to keep database performant
   - Test Live Mode connectivity regularly

3. **Support:**
   - Provide users with CSV export procedures
   - Document your organization's NCR numbering system
   - Create quick reference guides for common tasks

---

## Troubleshooting

### Search Issues

**Problem: "NCMR not found" error**

*Possible Causes & Solutions:*

1. **NCMR doesn't exist in database:**
   - Verify the NCMR number is correct
   - Check if it's been entered in the quality system yet
   - Wait and try again if recently created

2. **Leading zeros mismatch:**
   - Try with leading zeros: `0014962`
   - Try without leading zeros: `14962`
   - System should handle both, but try both formats

3. **Old data loaded:**
   - Upload a fresh CSV with "Sync Master CSV"
   - Or enable Live Mode to get latest data
   - Refresh the page

**Problem: Search is slow**

*Solutions:*
- Check your internet connection
- Large CSV files (>5000 records) may slow search
- Consider archiving old closed NCRs
- Try refreshing the page

---

### Data Loading Issues

**Problem: "Empty or invalid CSV file" message**

*Solutions:*
1. Open CSV in text editor to verify format
2. Check that column headers match exactly (case-sensitive)
3. Ensure file is UTF-8 encoded
4. Remove any special characters from headers
5. Verify at least one data row exists

**Problem: Some records don't display correctly**

*Solutions:*
1. Check for special characters in the data (quotes, commas, newlines)
2. Ensure dates are formatted consistently
3. Verify required fields (NCMR, Part No.) are populated
4. Re-export CSV from quality system with correct settings

**Problem: Record count shows 0**

*Solutions:*
1. Refresh the page
2. Upload a CSV manually
3. Check browser console for errors (F12)
4. Verify CSV file exists at `/public/data/ncr-data.csv`

---

### PDF Generation Issues

**Problem: PDF downloads but is blank or corrupted**

*Solutions:*
1. Update your browser to the latest version
2. Try a different browser (Chrome, Edge, Firefox)
3. Check browser console for errors (F12)
4. Disable browser extensions temporarily
5. Ensure pop-ups are allowed for the site

**Problem: QR code doesn't scan**

*Solutions:*
1. Print at higher quality/darkness setting
2. Use better quality label stock
3. Ensure printer resolution is adequate (300 DPI minimum)
4. Clean printer head
5. Generate PDF again and try new print

**Problem: Red tag prints too small or large**

*Solutions:*
1. Check printer settings: should be 4×6 inches
2. Set scale to 100% (actual size)
3. Disable "Fit to page" option
4. Use "Actual size" or "Custom scale: 100%"
5. Verify label stock is actually 4×6 inches

---

### Live Mode Issues

**Problem: "Failed to enable LIVE mode" error**

*Solutions:*
1. Check internet connection
2. Verify Live Mode is configured (IT administrator task)
3. Check if data source URL is accessible
4. Try refreshing the page and enabling again
5. Fall back to CSV upload method

**Problem: Live Mode enabled but data not updating**

*Solutions:*
1. Click "Refresh Now" to manually trigger update
2. Check last sync time in header
3. Verify Power Automate flow is running (IT check)
4. Check data source for new records
5. Disable and re-enable Live Mode

---

### Browser Compatibility

**Supported Browsers:**
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge (recommended)
- ✅ Mozilla Firefox
- ✅ Safari (Mac)

**Not Recommended:**
- ❌ Internet Explorer (not supported)
- ❌ Very old browser versions

**If you experience issues:**
1. Update browser to latest version
2. Clear browser cache and cookies
3. Try incognito/private mode
4. Try a different browser

---

## FAQ

### General Questions

**Q: Do I need to install anything?**  
A: No. The application runs entirely in your web browser. Just navigate to the URL and start using it.

**Q: Can I use this on my phone or tablet?**  
A: The interface is optimized for desktop/laptop screens. Mobile devices will work but the experience is best on larger screens, especially for browsing the table.

**Q: Is my data secure?**  
A: Yes. All data processing happens locally in your browser. No NCR data is sent to external servers (except to your configured data source in Live Mode).

**Q: Can multiple people use this at the same time?**  
A: Yes. Each user has their own session. With Live Mode enabled, everyone sees the same latest data.

---

### Data and Search Questions

**Q: How often should I update the CSV?**  
A: It depends on your NCR creation rate:
- High volume (>10 NCRs/day): Use Live Mode or update daily
- Medium volume (2-10 NCRs/day): Update 2-3 times per week
- Low volume (<2 NCRs/day): Weekly updates are fine

**Q: What happens to my Recent History when I update the CSV?**  
A: Recent History is preserved. It's stored separately from the NCR database.

**Q: Can I search by part number instead of NCMR?**  
A: Use the Browse feature (search with empty NCMR field), then filter by part number in the table.

**Q: Does the system support wildcards in search?**  
A: The NCMR search is exact match. Use the Browse table filter for partial matches.

**Q: Why are some NCMRs shown with leading zeros and others without?**  
A: It depends on how they're stored in your source data. The system handles both formats in searches.

---

### Printing Questions

**Q: What printer should I use?**  
A: Any printer that supports 4×6 inch labels. Thermal label printers (like Zebra, Brother) work best for shop floor use.

**Q: Can I print multiple copies?**  
A: Yes. Generate the PDF once, then print multiple copies from your PDF viewer's print dialog.

**Q: The QR code prints but won't scan. What's wrong?**  
A: Increase printer darkness/quality setting. Ensure minimum 300 DPI resolution. Clean printer head. Try higher quality label stock.

**Q: Can I print on regular paper instead of labels?**  
A: Yes, but you'll need to cut the paper to 4×6 inches or scale accordingly. The "Audit View" option is better for standard paper.

**Q: Can I customize the red tag layout?**  
A: The layout is standardized for ISO compliance. Contact your IT administrator if custom layouts are required for your organization.

---

### Technical Questions

**Q: What is Live Mode and how do I set it up?**  
A: Live Mode syncs data automatically from your master source (SharePoint, etc.). Setup requires IT configuration. See `docs/POWER_AUTOMATE_SETUP.md` for instructions.

**Q: Where is the data stored?**  
A: Default data is in `/public/data/ncr-data.csv`. Uploaded CSVs are stored in browser memory. Live Mode fetches from your configured external source.

**Q: What happens if I clear my browser cache?**  
A: You'll lose Recent History and any manually uploaded CSV data. Default data will reload automatically.

**Q: Can this integrate with our quality management system?**  
A: Yes, via CSV export or Live Mode setup. Contact your IT administrator to configure automatic data sync.

**Q: Is there an API for integration?**  
A: The application is designed as a standalone tool. Data integration is via CSV files or Live Mode configuration.

---

### Administrative Questions

**Q: How do I add new users?**  
A: Simply share the application URL. No user accounts or permissions needed.

**Q: Can I restrict access to certain users?**  
A: Access control should be configured at the web server level by your IT department.

**Q: How do I backup the data?**  
A: Keep backups of your master CSV file. The application doesn't store data permanently.

**Q: Can I export the recent searches or audit trail?**  
A: Recent History is stored locally per user. For audit trails, use your quality management system's reporting features.

**Q: What happens if the application is updated?**  
A: Updates are transparent. Refresh your browser to get the latest version. Your data and history are preserved.

---

## Support and Feedback

### Getting Help

1. **Check this User Guide**: Most questions are answered here
2. **Contact Your Quality Manager**: For process-specific questions
3. **Contact IT Support**: For technical issues or Live Mode setup
4. **GitHub Issues**: Report bugs at the repository (if you have access)

### Reporting Issues

When reporting problems, include:

- Browser name and version
- Operating system
- What you were trying to do
- Exact error message (if any)
- Screenshot (if helpful)
- Steps to reproduce the problem

### Providing Feedback

We welcome feedback on:

- Usability improvements
- Feature requests
- Interface clarity
- Documentation gaps
- Bug reports

---

## Version Information

**Current Version**: v1.3.0  
**Document Version**: 1.0  
**Last Updated**: December 23, 2025  
**Maintained By**: AGSE Quality Operations Team

---

## Appendix: Quick Reference Card

### 🔍 Search for NCMR
1. Type NCMR in search box
2. Click search button or press Enter
3. Review record
4. Click "Generate 4x6 Label"
5. Print PDF

### 📊 Browse All Records
1. Leave search box empty
2. Click search button
3. Use filter to narrow results
4. Click any row to select
5. Generate PDF

### 🔄 Update Data (CSV)
1. Click "Sync Master CSV"
2. Select CSV file
3. Wait for "Success" message
4. Record count updates

### 📡 Enable Live Mode
1. Click "Enable Live Mode"
2. Wait for connection
3. Verify green "LIVE MODE" badge
4. Use "Refresh Now" for manual updates

### 🖨️ Print Red Tag
1. Open downloaded PDF
2. Set printer to 4×6 inches
3. Use 100% scale
4. Print high quality
5. Test QR code scan

---

## Document End

For the most current information and updates, refer to the repository README.md and technical documentation in the `/docs` folder.

**Questions?** Contact your Quality Manager or IT Support team.

---

*AGSE Quality Assurance Infrastructure • Secure Tool v1.3.0*
