# Power Automate Setup Guide for LIVE Data Mode

This guide walks you through setting up a Power Automate flow to automatically sync your SharePoint NCR Log to the GitHub repository, enabling LIVE data mode in the AGSE Red Tag Generator.

## Overview

The Power Automate flow will:
1. Monitor the SharePoint NCR Log Excel file for changes
2. Extract data from the Excel table
3. Convert it to CSV format
4. Update the `/data/ncr-data.csv` file in your GitHub repository

## Prerequisites

- Microsoft 365 account with access to Power Automate
- Access to the SharePoint NCR Log file
- GitHub repository admin access (`vcnair/AGSE-Red-Tag-Generator`)
- GitHub Personal Access Token with repository write permissions

## Part 1: Create GitHub Personal Access Token

### Step 1: Navigate to GitHub Settings
1. Go to [GitHub.com](https://github.com) and sign in
2. Click your profile picture → **Settings**
3. Scroll down and click **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**

### Step 2: Generate New Token
1. Click **Generate new token** → **Generate new token (classic)**
2. Give your token a descriptive name: `Power Automate NCR Sync`
3. Set expiration: Choose appropriate duration (recommend: 90 days or 1 year)
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`

### Step 3: Save Your Token
1. Click **Generate token** at the bottom
2. **IMPORTANT**: Copy the token immediately and save it securely
3. You won't be able to see it again!
4. Store it in a password manager or secure note

## Part 2: Create Power Automate Flow

### Step 1: Create New Flow
1. Go to [Power Automate](https://make.powerautomate.com)
2. Click **+ Create** → **Automated cloud flow**
3. Name: `NCR Log to GitHub Sync`
4. Skip trigger selection (we'll add it manually)
5. Click **Create**

### Step 2: Add Trigger

**Option A: Scheduled Trigger (Recommended)**
1. Click **+ New step**
2. Search for and select **Recurrence**
3. Set **Interval**: `5`
4. Set **Frequency**: `Minute`

**Option B: On File Modification (Advanced)**
1. Click **+ New step**
2. Search for and select **SharePoint** → **When a file is created or modified (properties only)**
3. **Site Address**: Select your SharePoint site
4. **Library Name**: `Documents` (or wherever the NCR Log is stored)
5. Add condition to filter for your specific file

### Step 3: Get Excel File Content
1. Click **+ New step**
2. Search for and select **SharePoint** → **Get file content**
3. **Site Address**: `https://o365agsecorp.sharepoint.com/sites/QualityControlLogs`
4. **File Identifier**: Click folder icon and navigate to:
   - `Shared Documents` → `NCR Log.xlsx`

### Step 4: List Rows in Excel Table
1. Click **+ New step**
2. Search for and select **Excel Online (Business)** → **List rows present in a table**
3. **Location**: `SharePoint Site - QualityControlLogs`
4. **Document Library**: `Documents`
5. **File**: Use dynamic content from previous step (file content)
6. **Table**: Select your NCR data table (e.g., `Table1` or the actual table name)

### Step 5: Convert to CSV Format
1. Click **+ New step**
2. Search for and select **Data Operation** → **Create CSV table**
3. **From**: Use dynamic content → **value** (from List rows step)
4. Click **Advanced options**
5. **Columns**: Select **Automatic**
6. **Include headers**: Select **Yes**

### Step 6: Get Current File SHA from GitHub
This step retrieves the current file's SHA, which GitHub requires for updates.

1. Click **+ New step**
2. Search for and select **HTTP**
3. Configure:
   - **Method**: `GET`
   - **URI**: 
     ```
     https://api.github.com/repos/vcnair/AGSE-Red-Tag-Generator/contents/data/ncr-data.csv
     ```
   - **Headers**:
     - `Accept`: `application/vnd.github.v3+json`
     - `Authorization`: `token YOUR_GITHUB_TOKEN_HERE`
     - `User-Agent`: `PowerAutomate-NCR-Sync`

4. Click **+ New step**
5. Add **Parse JSON** action
6. **Content**: Body from HTTP GET request
7. **Schema**: Use this schema:
   ```json
   {
     "type": "object",
     "properties": {
       "name": { "type": "string" },
       "path": { "type": "string" },
       "sha": { "type": "string" },
       "size": { "type": "integer" },
       "content": { "type": "string" }
     }
   }
   ```

### Step 7: Convert CSV to Base64
GitHub API requires base64-encoded content.

1. Click **+ New step**
2. Add **Compose** action
3. **Inputs**: 
   ```
   base64(body('Create_CSV_table'))
   ```

### Step 8: Update File in GitHub
1. Click **+ New step**
2. Search for and select **HTTP**
3. Configure:
   - **Method**: `PUT`
   - **URI**: 
     ```
     https://api.github.com/repos/vcnair/AGSE-Red-Tag-Generator/contents/data/ncr-data.csv
     ```
   - **Headers**:
     - `Accept`: `application/vnd.github.v3+json`
     - `Authorization`: `token YOUR_GITHUB_TOKEN_HERE`
     - `Content-Type`: `application/json`
     - `User-Agent`: `PowerAutomate-NCR-Sync`
   
   - **Body**: 
     ```json
     {
       "message": "Auto-update NCR data from SharePoint - @{utcNow()}",
       "content": "@{outputs('Compose')}",
       "sha": "@{body('Parse_JSON')?['sha']}"
     }
     ```

### Step 9: Handle First-Time Setup
When the file doesn't exist yet (first run), the GET request will fail. Add error handling:

1. Click on the **HTTP GET** step (Step 6)
2. Click **⋮** (three dots) → **Configure run after**
3. Add: **✅ is successful** AND **✅ has failed**
4. Click **Done**

5. Add a **Condition** action after Parse JSON:
   - **If yes**: Continue with Update (Step 8) - file exists
   - **If no**: Create file for first time
   
   - Condition: `@equals(outputs('HTTP_GET')?['statusCode'], 200)`

6. In the **If no** branch, add HTTP PUT without SHA:
   - Same as Step 8, but remove `"sha"` property from body:
     ```json
     {
       "message": "Initial NCR data sync from SharePoint",
       "content": "@{outputs('Compose')}"
     }
     ```

### Step 10: Save and Test
1. Click **Save** in the top right
2. Click **Test** → **Manually**
3. Click **Test** again to run
4. Monitor each step for success
5. Check your GitHub repository for the updated file

## Alternative: Using GitHub Connector

Instead of HTTP actions, you can use the GitHub connector (if available in your region):

1. Add **GitHub** connector steps
2. Search for **Update a file** action
3. Configure with your repository details
4. This approach handles base64 encoding and SHA automatically

**Note**: The GitHub connector may not be available in all Power Automate plans or regions.

## Part 3: Verify Integration

### In Power Automate:
1. Check the **Flow run history** for successful executions
2. Verify runs occur every 5 minutes (or per your schedule)
3. Check for any errors in the run details

### In GitHub:
1. Navigate to your repository: `vcnair/AGSE-Red-Tag-Generator`
2. Open `/data/ncr-data.csv`
3. Check commit history for automated updates
4. Verify the commit messages include timestamps

### In the App:
1. Open the AGSE Red Tag Generator app
2. Click **Enable Live Mode**
3. Verify:
   - Record count matches your SharePoint data
   - Last sync timestamp appears in header
   - Search functionality works with live data
4. Wait 5 minutes and check for automatic refresh

## Troubleshooting

### Issue: "404 Not Found" on GET request
**Solution**: The file doesn't exist yet. 
- Make sure you've created `/data/ncr-data.csv` in your repository
- Or configure the flow to handle 404 and create the file

### Issue: "422 Unprocessable Entity" on PUT request
**Solution**: SHA mismatch or missing SHA.
- Ensure you're getting the latest SHA before each update
- Check that the SHA from GET is correctly passed to PUT
- For first-time creation, omit the SHA field

### Issue: "401 Unauthorized"
**Solution**: GitHub token issue.
- Verify your Personal Access Token is correct
- Check token hasn't expired
- Ensure token has `repo` scope enabled

### Issue: CSV data is empty or malformed
**Solution**: Excel table configuration.
- Verify the Excel table name in "List rows" step
- Check that all columns are properly named
- Ensure no blank rows in Excel table

### Issue: Flow runs but file doesn't update
**Solution**: Check the response from GitHub API.
- Add a **Parse JSON** or **Compose** step after PUT
- Inspect the response body for errors
- Verify base64 encoding is correct

### Issue: App shows "Failed to fetch data"
**Solution**: Check CSV file format.
- Open the CSV in GitHub and verify structure
- Ensure headers match expected column names
- Check for special characters or encoding issues

### Issue: Auto-refresh not working in app
**Solution**: Browser console debugging.
- Open browser DevTools (F12)
- Check Console for errors
- Verify network requests to `/data/ncr-data.csv` succeed
- Check CORS headers if using custom domain

## Best Practices

1. **Token Security**:
   - Never commit tokens to code
   - Rotate tokens periodically (every 90 days)
   - Use minimum required permissions

2. **Flow Optimization**:
   - Don't set refresh interval too low (respect API limits)
   - Add error notifications (send email on failure)
   - Log successful runs to a SharePoint list for auditing

3. **Data Quality**:
   - Validate data in SharePoint before sync
   - Use Excel table formatting (not just ranges)
   - Keep column names consistent

4. **Monitoring**:
   - Set up flow failure alerts
   - Periodically review run history
   - Monitor GitHub commit history

## Advanced Configuration

### Custom Refresh Interval
Edit the app's `.env.local` file:
```env
LIVE_DATA_REFRESH_INTERVAL=600000  # 10 minutes in milliseconds
```

### Custom Data Path
If you want to use a different CSV location:
```env
LIVE_DATA_PATH=/data/custom-ncr-data.csv
```

### Multiple Environments
Create separate flows for staging/production:
- Use branches: `main` (production) and `staging`
- Update the repository branch in GitHub API URL
- Use different schedules (e.g., 5 min for staging, 15 min for prod)

## Support

For issues with:
- **Power Automate**: Contact your IT admin or Microsoft Support
- **GitHub API**: See [GitHub API Documentation](https://docs.github.com/rest)
- **App Issues**: Create an issue in the GitHub repository

## Additional Resources

- [Power Automate Documentation](https://learn.microsoft.com/power-automate/)
- [GitHub REST API Reference](https://docs.github.com/rest/repos/contents)
- [SharePoint Connector Reference](https://learn.microsoft.com/connectors/sharepointonline/)
- [Excel Online Connector](https://learn.microsoft.com/connectors/excelonlinebusiness/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-23  
**Maintained by**: AGSE Quality Operations Team
