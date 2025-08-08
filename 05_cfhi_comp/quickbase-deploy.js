const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const axios = require('axios');
const xml2js = require('xml2js');

// Configuration
const config = {
  // Quickbase API Configuration
  realm: 'your-realm.quickbase.com', // Replace with your Quickbase realm
  userToken: 'your-user-token', // Replace with your Quickbase user token
  appToken: 'bpat4pgu9t69yby5gbemdbej52j', // From your Index.html
  
  // Page Configuration
  pageId: 'your-page-id', // Replace with your Quickbase page ID
  
  // File watching configuration
  watchFiles: [
    'Index.html',
    'Api.js',
    'components/**/*.js',
    'content/**/*.js',
    'functions/**/*.js'
  ],
  
  // Debounce delay (ms) to prevent multiple rapid uploads
  debounceDelay: 2000
};

class QuickbaseDeployer {
  constructor() {
    this.debounceTimer = null;
    this.builder = new xml2js.Builder();
  }

  // Create XML request for API_AddReplaceDBPage
  createXMLRequest(fileContent, fileName) {
    const request = {
      qdbapi: {
        $: {
          version: '1.0'
        },
        action: 'API_AddReplaceDBPage',
        pageid: config.pageId,
        pagename: fileName,
        pagetype: 'html',
        pagecontent: fileContent
      }
    };
    
    return this.builder.buildObject(request);
  }

  // Upload file to Quickbase
  async uploadToQuickbase(filePath) {
    try {
      console.log(`📤 Uploading ${filePath} to Quickbase...`);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      // Create XML request
      const xmlRequest = this.createXMLRequest(fileContent, fileName);
      
      // Make API call
      const response = await axios.post(
        `https://${config.realm}/db/${config.pageId}`,
        xmlRequest,
        {
          headers: {
            'Content-Type': 'text/xml',
            'QUICKBASE-ACTION': 'API_AddReplaceDBPage',
            'Authorization': `QB-USER-TOKEN ${config.userToken}`,
            'QB-APP-TOKEN': config.appToken
          }
        }
      );

      // Parse response
      const result = await xml2js.parseStringPromise(response.data);
      
      if (result.qdbapi && result.qdbapi.actionresult && result.qdbapi.actionresult[0] === '0') {
        console.log(`✅ Successfully uploaded ${fileName} to Quickbase!`);
        console.log(`🔗 Page URL: https://${config.realm}/db/${config.pageId}?a=dr&rid=${config.pageId}`);
      } else {
        console.error(`❌ Failed to upload ${fileName}:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
      }
      
    } catch (error) {
      console.error(`❌ Error uploading ${filePath}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  }

  // Debounced upload function
  debouncedUpload(filePath) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.uploadToQuickbase(filePath);
    }, config.debounceDelay);
  }

  // Start watching files
  startWatching() {
    console.log('🚀 Starting Quickbase Auto-Deploy...');
    console.log('📁 Watching files:', config.watchFiles.join(', '));
    console.log('⏱️  Debounce delay:', config.debounceDelay + 'ms');
    console.log('');

    const watcher = chokidar.watch(config.watchFiles, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    });

    watcher
      .on('add', (filePath) => {
        console.log(`📄 File added: ${filePath}`);
        this.debouncedUpload(filePath);
      })
      .on('change', (filePath) => {
        console.log(`📝 File changed: ${filePath}`);
        this.debouncedUpload(filePath);
      })
      .on('unlink', (filePath) => {
        console.log(`🗑️  File removed: ${filePath}`);
      })
      .on('error', (error) => {
        console.error('❌ Watcher error:', error);
      });

    console.log('👀 File watcher is active. Make changes to your files to trigger uploads.');
    console.log('Press Ctrl+C to stop watching.');
  }

  // Validate configuration
  validateConfig() {
    const required = ['realm', 'userToken', 'pageId'];
    const missing = required.filter(key => !config[key] || config[key].includes('your-'));
    
    if (missing.length > 0) {
      console.error('❌ Configuration error: Please set the following values in the config object:');
      missing.forEach(key => console.error(`   - ${key}`));
      console.error('');
      console.error('📝 How to get these values:');
      console.error('   - realm: Your Quickbase realm (e.g., yourcompany.quickbase.com)');
      console.error('   - userToken: Your Quickbase user token (from Account Settings > My Preferences)');
      console.error('   - pageId: The ID of the page you want to replace (from the page URL)');
      return false;
    }
    
    return true;
  }
}

// Main execution
async function main() {
  const deployer = new QuickbaseDeployer();
  
  if (!deployer.validateConfig()) {
    process.exit(1);
  }
  
  deployer.startWatching();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping Quickbase Auto-Deploy...');
  process.exit(0);
});

// Run the script
main().catch(console.error);
