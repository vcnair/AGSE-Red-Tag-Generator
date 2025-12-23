<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AGSE Red Tag Generator

A professional quality control tool for generating ISO-compliant red tags (hold tags) for non-conforming materials. Streamlines the NCR (Non-Conformance Report) workflow with instant lookups, automated PDF generation, and digital traceability.

## 📚 Documentation

- **[User Guide](USER_GUIDE.md)** - Comprehensive guide for end users with visual walkthrough, step-by-step instructions, and troubleshooting
- **[Power Automate Setup](docs/POWER_AUTOMATE_SETUP.md)** - IT guide for configuring Live Mode with SharePoint integration

## Quick Start

View your app in AI Studio: https://ai.studio/apps/drive/1UhKEc4cQfxJamXyDmetiUVJ8pm4IQ9Yq

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Using Raw CSV Data

The app automatically loads NCR data from a CSV file on startup, simulating a real production environment. This allows you to test the application with your own data before connecting to a live data source.

### Default CSV Location

Place your CSV file at: `public/data/ncr-data.csv`

The app will automatically load this file when it starts. The CSV should have the following columns:

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

### Other Data Loading Options

1. **Manual CSV Upload**: Use the "Sync Master CSV" button to upload a different CSV file at runtime
2. **Live Mode**: Enable Live Mode to automatically refresh data from the CSV file periodically

### Example CSV

See `public/data/ncr-data.csv` for an example of the expected format.
