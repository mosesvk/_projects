# QuickBase Auto-Deploy for International Project

This deployment script automatically uploads your local files to QuickBase code pages when they are modified. It uses the page mappings defined in `docs/quickbase/qbFields.md`.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with your QuickBase credentials:

```env
# QuickBase Configuration for International Project
QUICKBASE_REALM=capincrouse.quickbase.com
QUICKBASE_USER_TOKEN=your_user_token_here
QUICKBASE_APP_TOKEN=your_app_token_here
QUICKBASE_APP_ID=bps9da9i5
```

### 3. Get Your Credentials

- **QUICKBASE_USER_TOKEN**: Get from Account Settings > My Preferences > User Token
- **QUICKBASE_APP_TOKEN**: Find in your `Index.html` file (look for `apptoken`)
- **QUICKBASE_APP_ID**: `bps9da9i5` (from the International project URL)

## Usage

### Start File Watching

```bash
npm run deploy
```

This will:
- Start watching all relevant project files
- Automatically upload changes to QuickBase
- Display mapping information and status updates

### Manual Upload

You can also run the script once to check configuration:

```bash
node qb-deploy.js
```

## File Mappings

The script uses the following mappings from `qbFields.md`:

| Local File | QuickBase Page ID | Description |
|------------|-------------------|-------------|
| `Index.html` | 162 | Main HTML page |
| `Api.js` | 163 | API functions |
| `utility/Utility.js` | 164 | Utility functions |
| `components/Header.js` | 165 | Header component |
| `utility/UiManagement.js` | 166 | UI management |
| `components/Report.js` | 167 | Main reporting |
| `utility/WeightedAverages.js` | 168 | Weighted averages |
| `utils/print_base64.js` | 182 | Base64 printing |
| `charts/chartSystem.js` | 194 | Chart system core |
| `charts/chartConfigFactory.js` | 195 | Chart configuration |
| `charts/chartManager.js` | 196 | Chart management |
| `charts/chartDisplayComponents.js` | 197 | Chart components |
| `charts/chartIndex.js` | 198 | Chart index |

## Features

- **File Watching**: Automatically detects file changes
- **Debounced Uploads**: Prevents multiple rapid uploads
- **Path Flexibility**: Handles both root and `src/` directory structures
- **Error Handling**: Comprehensive error reporting and validation
- **Page Verification**: Checks that target pages exist and are correct type
- **Security**: Automatically converts HTTP to HTTPS in uploaded content

## Troubleshooting

### Configuration Issues
- Ensure your `.env` file exists and contains all required variables
- Verify your user token has appropriate permissions
- Check that the app token matches your QuickBase application

### Upload Failures
- Verify page IDs exist in QuickBase
- Ensure pages are type '1' (HTML pages)
- Check network connectivity and QuickBase service status

### File Watching Issues
- Make sure files exist in the expected locations
- Check file permissions
- Verify the file patterns in the watch configuration

## Dependencies

- `axios`: HTTP client for QuickBase API calls
- `chokidar`: File system watcher
- `dotenv`: Environment variable management
- `xml2js`: XML parsing and building for QuickBase API

## Notes

- The script creates QuickBase-friendly page names by prefixing with `intl_`
- Mixed content (HTTP URLs) is automatically converted to HTTPS
- File changes are debounced by 2 seconds to prevent rapid-fire uploads
- The script gracefully handles shutdown with Ctrl+C
