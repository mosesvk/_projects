# Quickbase Auto-Deploy

Automatically deploy your local files to Quickbase using the `API_AddReplaceDBPage` API call. This script watches your local files and uploads them to Quickbase whenever they change.

## Features

- 🔄 **File Watching**: Automatically detects when files are saved
- ⚡ **Debounced Uploads**: Prevents multiple rapid uploads
- 📤 **Quickbase Integration**: Uses the official Quickbase XML API
- 🎯 **Targeted Deployment**: Uploads specific files to specific page IDs
- 📊 **Real-time Logging**: See upload status and errors in real-time

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with your Quickbase credentials:

```bash
cp .env.example .env
```

Then edit `.env` and add your actual values:

```env
# Quickbase API Configuration
QUICKBASE_REALM=capincrouse.quickbase.com
QUICKBASE_USER_TOKEN=your-user-token-here
QUICKBASE_APP_TOKEN=your-app-token-here
QUICKBASE_APP_ID=your-app-id-here
```

### 3. Get Your Quickbase Credentials

#### Realm
- Your Quickbase realm is in the URL: `https://yourcompany.quickbase.com`
- Use: `yourcompany.quickbase.com`

#### User Token
1. Log into Quickbase
2. Go to **Account Settings** > **My Preferences**
3. Scroll to **User Token** section
4. Copy your user token

#### App Token
- Found in your `Index.html` file (already configured)
- Example: `bpat4pgu9t69yby5gbemdbej52j`

#### App ID
- Found in your Quickbase URL: `https://yourcompany.quickbase.com/db/bps9da9i5`
- The app ID is `bps9da9i5` (after `/db/`)

#### Page IDs
- Each file maps to a specific page ID (143-151)
- These are configured in the script and don't need to be changed

## Usage

### Start the Auto-Deploy Script

```bash
npm start
```

or

```bash
node qb-deploy.js
```

### How It Works

1. **File Watching**: The script watches your specified files for changes
2. **Debouncing**: When a file changes, it waits 2 seconds before uploading (prevents rapid uploads)
3. **Upload**: Reads the file content and sends it to Quickbase via `API_AddReplaceDBPage`
4. **Feedback**: Shows success/error messages in the console

### Example Output

```
🚀 Starting Quickbase Auto-Deploy...
📁 Watching files: Index.html, Api.js, components/**/*.js, content/**/*.js, functions/**/*.js
⏱️  Debounce delay: 2000ms

👀 File watcher is active. Make changes to your files to trigger uploads.
Press Ctrl+C to stop watching.

📝 File changed: Index.html
📤 Uploading Index.html to Quickbase...
✅ Successfully uploaded Index.html to Quickbase!
🔗 Page URL: https://yourcompany.quickbase.com/db/br8rqi6bk?a=dr&rid=123
```

## API Details

The script uses the Quickbase XML API with the `API_AddReplaceDBPage` call:

```xml
<qdbapi version="1.0">
  <action>API_AddReplaceDBPage</action>
  <pageid>your-page-id</pageid>
  <pagename>filename.html</pagename>
  <pagetype>html</pagetype>
  <pagecontent>file content here</pagecontent>
</qdbapi>
```

## Customization

### Watch Different Files

Modify the `watchFiles` array in the config:

```javascript
watchFiles: [
  'dashboard.html',
  'styles.css',
  'script.js',
  'assets/**/*'
]
```

### Change Debounce Delay

Adjust the `debounceDelay` (in milliseconds):

```javascript
debounceDelay: 5000  // Wait 5 seconds after last change
```

### Upload to Multiple Pages

You can modify the script to upload different files to different pages by adding page-specific logic.

## Troubleshooting

### Configuration Errors
- Ensure all required fields are set in the config
- Verify your Quickbase credentials are correct
- Check that the page ID exists and you have permission to modify it

### API Errors
- Verify your user token has the necessary permissions
- Check that the app token is valid
- Ensure the page ID is correct

### File Watching Issues
- Make sure the file paths in `watchFiles` are correct
- Check file permissions
- Verify the files exist in the expected locations

## Security Notes

- ✅ **Environment Variables**: All sensitive credentials are stored in `.env` file
- ✅ **Git Ignored**: The `.env` file is excluded from version control
- ✅ **Example File**: Use `.env.example` as a template for setup
- ⚠️ **Never commit `.env`**: Make sure your `.env` file is never pushed to GitHub

## Stopping the Script

Press `Ctrl+C` to gracefully stop the file watcher and exit the script.
