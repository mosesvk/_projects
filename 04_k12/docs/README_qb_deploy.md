# Quickbase Auto-Deploy for 04_k12 Project

This project includes an automated deployment script that watches for file changes and automatically uploads them to the corresponding Quickbase code pages.

## Overview

The `qb-deploy.js` script monitors your source files and automatically deploys them to Quickbase when changes are detected. It maps each file to its corresponding Quickbase page ID based on the `docs/pageFields.md` configuration.

## Page Mapping

Based on `docs/pageFields.md`, the following files are mapped to Quickbase pages:

| File | Quickbase Page ID | Description |
|------|------------------|-------------|
| `index.html` | 134 | k12_main.html |
| `api.js` | 136 | k12_api.js |
| `Header.js` | 137 | k12_Header.js |
| `chartDisplay.js` | 138 | k12_displayCharts.js |
| `Report.js` | 139 | k12_Report.js |
| `_uiManagement.js` | 140 | k12_uiManagement.js |
| `charts.js` | 141 | k12_charts.js |
| `_utility.js` | 135 | k12_utility.js |
| `_utilityWeightedAverages.js` | 142 | k12_utilityWeightedAverages.js |
| `_utilityPrint.js` | 180 | k12_utilityPrint.js |

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Quickbase API Configuration
QUICKBASE_REALM=capincrouse.quickbase.com
QUICKBASE_USER_TOKEN=your_user_token_here
QUICKBASE_APP_TOKEN=your_app_token_here
QUICKBASE_APP_ID=your_app_id_here
```

#### How to get these values:

- **QUICKBASE_REALM**: Your Quickbase domain (usually your company domain)
- **QUICKBASE_USER_TOKEN**: Your personal user token from Account Settings > My Preferences
- **QUICKBASE_APP_TOKEN**: Your app token from your app's settings or Index.html
- **QUICKBASE_APP_ID**: Your app ID from the URL (https://your-realm.quickbase.com/db/APP_ID)

### 3. Start Auto-Deploy

```bash
npm start
# or
npm run dev
# or
npm run deploy
```

## How It Works

1. **File Watching**: The script watches the following directories for changes:
   - `src/index.html`
   - `src/api.js`
   - `src/components/**/*.js`
   - `src/utility/**/*.js`

2. **Automatic Upload**: When a file is modified, it's automatically uploaded to the corresponding Quickbase page using the `API_AddReplaceDBPage` endpoint.

3. **Debouncing**: Changes are debounced with a 2-second delay to prevent multiple rapid uploads.

4. **Page Verification**: On startup, the script verifies that all configured pages exist and are of the correct type.

## Features

- **Automatic File Routing**: Files are automatically routed to the correct Quickbase page based on their filename
- **Real-time Deployment**: Changes are deployed immediately when files are saved
- **Error Handling**: Comprehensive error handling and logging for debugging
- **Page Validation**: Verifies page configurations on startup
- **HTTPS Conversion**: Automatically converts HTTP URLs to HTTPS to prevent mixed content issues

## Troubleshooting

### Common Issues

1. **Configuration Errors**: Ensure all environment variables are set correctly in your `.env` file
2. **Permission Errors**: Verify your Quickbase user token has permission to modify the specified pages
3. **Page Type Errors**: Ensure the target pages are HTML pages (type 1) in Quickbase
4. **Network Issues**: Check your internet connection and Quickbase service status

### Debug Mode

The script provides detailed logging for all operations. Check the console output for:
- Page verification results
- File upload status
- Error details
- API response information

## File Structure

```
04_k12/
├── qb-deploy.js          # Main deployment script
├── package.json          # Dependencies and scripts
├── README_qb_deploy.md   # This documentation
├── .env                  # Environment variables (create this)
├── src/                  # Source files being watched
│   ├── index.html
│   ├── api.js
│   ├── components/
│   └── utility/
└── docs/
    └── pageFields.md     # Page ID mapping reference
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your Quickbase tokens secure and rotate them regularly
- The script only uploads files to pages you have permission to modify

## Support

For issues or questions about the deployment script, check:
1. Console output for error messages
2. Quickbase API documentation
3. Your Quickbase permissions and settings
