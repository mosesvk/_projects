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

### 2. Configure Quickbase Settings

Edit `quickbase-deploy.js` and update the configuration:

```javascript
const config = {
  // Quickbase API Configuration
  realm: 'your-realm.quickbase.com',        // Your Quickbase realm
  userToken: 'your-user-token',             // Your Quickbase user token
  appToken: 'bpat4pgu9t69yby5gbemdbej52j', // Already set from your Index.html
  
  // Page Configuration
  pageId: 'your-page-id',                   // The page ID to replace
  
  // File watching configuration
  watchFiles: [
    'Index.html',
    'Api.js',
    'components/**/*.js',
    'content/**/*.js',
    'functions/**/*.js'
  ],
  
  debounceDelay: 2000
};
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

#### Page ID
1. Navigate to the page you want to replace in Quickbase
2. Look at the URL: `https://yourcompany.quickbase.com/db/br8rqi6bk?a=dr&rid=123`
3. The page ID is the number after `rid=` (e.g., `123`)

## Usage

### Start the Auto-Deploy Script

```bash
npm start
```

or

```bash
node quickbase-deploy.js
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

- Keep your user token secure and don't commit it to version control
- Consider using environment variables for sensitive data
- The app token from your Index.html is already public, so it's safe to include

## Stopping the Script

Press `Ctrl+C` to gracefully stop the file watcher and exit the script.
