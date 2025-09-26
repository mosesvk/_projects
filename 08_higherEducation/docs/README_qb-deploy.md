# Quickbase Auto-Deploy Tool

This tool automatically deploys your code files to Quickbase code pages when you make changes to your files.

## Setup Instructions

### 1. Install Dependencies
The dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory with your Quickbase credentials:

```env
# Quickbase Configuration
QUICKBASE_REALM=capincrouse.quickbase.com
QUICKBASE_USER_TOKEN=your_user_token_here
QUICKBASE_APP_TOKEN=your_app_token_here
QUICKBASE_APP_ID=your_app_id_here
```

### 3. How to Get Your Quickbase Credentials

**QUICKBASE_REALM**: Your Quickbase realm (e.g., `capincrouse.quickbase.com`)

**QUICKBASE_USER_TOKEN**: 
1. Go to your Quickbase account
2. Click on your profile picture → Account Settings
3. Go to "My Preferences"
4. Copy your User Token

**QUICKBASE_APP_TOKEN**:
1. Go to your Quickbase app
2. Open any code page (like your Index.html)
3. Look for a line like: `qb.appToken = "your_app_token_here";`
4. Copy the app token value

**QUICKBASE_APP_ID**:
1. Go to your Quickbase app
2. Look at the URL: `https://realm.quickbase.com/db/APP_ID`
3. Copy the APP_ID part

### 4. Page Mapping Configuration

The tool is configured to map your files to the following Quickbase pages:

| File | Page ID | Quickbase Page Name |
|------|---------|-------------------|
| `index.html` | 183 | higherEd_index.html |
| `Api.js` | 184 | higherEd_api.js |
| `Utility.js` | 185 | higherEd_utility.js |
| `Header.js` | 186 | higherEd_header.js |
| `uiManagement.js` | 187 | higherEd_uiManagement.js |
| `DisplayCharts.js` | 188 | higherEd_displayCharts.js |
| `charts.js` | 189 | higherEd_charts.js |
| `Report.js` | 190 | higherEd_report.js |
| `Print.js` | 191 | higherEd_print.js |
| `WeightedAverages.js` | 192 | higherEd_weightedAvg.js |
| `test.html` | 193 | higherEd_test.html |
| `chartSystem.js` | 208 | higherEd_chartSystem.js |
| `chartConfigFactory.js` | 209 | higherEd_chartConfigFactory.js |
| `chartManager.js` | 210 | higherEd_chartManager.js |
| `chartDisplay.js` | 211 | higherEd_chartDisplay.js |
| `systemConnector.js` | 212 | higherEd_systemConnector.js |

### 5. Running the Tool

Start the auto-deploy tool:
```bash
npm start
```

Or run directly:
```bash
node qb-deploy.js
```

### 6. How It Works

1. The tool watches for changes in your files
2. When a file is modified, it automatically uploads it to the corresponding Quickbase page
3. It includes a 2-second debounce to prevent multiple rapid uploads
4. You'll see console output showing the upload progress

### 7. Watched Files

The tool watches these file patterns:
- `index.html`
- `Api.js`
- `Header.js`
- `components/**/*.js`
- `utility/**/*.js`
- `data/**/*.js`

### 8. Troubleshooting

**Error: "Configuration error"**
- Make sure your `.env` file exists and contains all required variables
- Check that your credentials are correct

**Error: "Failed to upload"**
- Verify the page ID exists in your Quickbase app
- Check that the page is a code page (type 1)
- Ensure your user token has permission to edit the page

**Files not being watched**
- Check that the file paths in the configuration match your actual file structure
- Make sure the files exist in the expected locations

### 9. Stopping the Tool

Press `Ctrl+C` to stop the file watcher and exit the tool.
