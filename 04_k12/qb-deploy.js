require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const axios = require('axios');
const xml2js = require('xml2js');

// Configuration - All code pages for 04_k12 project
const config = {
  // Quickbase API Configuration
  realm: process.env.QUICKBASE_REALM || 'capincrouse.quickbase.com', 
  userToken: process.env.QUICKBASE_USER_TOKEN, 
  appToken: process.env.QUICKBASE_APP_TOKEN, 
  appId: process.env.QUICKBASE_APP_ID, // App ID from your URL
  
  // Page Configuration - Mapping based on pageFields.md
  pageMapping: {
    'index.html': '134',           // k12_main.html -> Code Page 134
    'api.js': '136',               // k12_api.js -> Code Page 136
    'Header.js': '137',            // k12_Header.js -> Code Page 137
    'chartDisplay.js': '138',      // k12_displayCharts.js -> Code Page 138
    'Report.js': '139',            // k12_Report.js -> Code Page 139
    '_uiManagement.js': '140',     // k12_uiManagement.js -> Code Page 140
    'charts.js': '141',            // k12_charts.js -> Code Page 141
    '_utility.js': '135',          // k12_utility.js -> Code Page 135
    '_utilityWeightedAverages.js': '142', // k12_utilityWeightedAverages.js -> Code Page 142
    '_utilityPrint.js': '180',     // k12_utilityPrint.js -> Code Page 180
    '_utilityPrintBase64.js': '222', // k12_utilityPrintBase64.js -> Code Page 222 (Print Presentation base64 → bumq5tt67)
  },
  
  // Default page ID (fallback)
  defaultPageId: '134',
  
  // File watching configuration
  watchFiles: [
    'src/index.html',
    'src/api.js',
    'src/components/**/*.js',
    'src/_utility/**/*.js'
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
  createXMLRequest(fileContent, fileName, pageId) {
    // Fix mixed content by converting HTTP to HTTPS
    const fixedContent = fileContent.replace(/http:\/\//g, 'https://');
    
    const request = {
      qdbapi: {
        $: {
          version: '1.0'
        },
        action: 'API_AddReplaceDBPage',
        pageid: pageId,
        pagename: fileName,
        pagetype: '1', // 1 = XSL stylesheets or HTML pages (per API docs)
        pagebody: fixedContent
      }
    };
    
    return this.builder.buildObject(request);
  }

  // Check page details to understand what type of page it is
  async checkPageDetails(pageId) {
    try {
      console.log(`🔍 Checking details for page ${pageId}...`);
      
      const request = {
        qdbapi: {
          $: {
            version: '1.0'
          },
          action: 'API_GetDBPage',
          pageid: pageId
        }
      };
      
      const xmlRequest = this.builder.buildObject(request);
      
      const response = await axios.post(
        `https://${config.realm}/db/${config.appId}`,
        xmlRequest,
        {
          headers: {
            'Content-Type': 'text/xml',
            'QUICKBASE-ACTION': 'API_GetDBPage',
            'Authorization': `QB-USER-TOKEN ${config.userToken}`,
            'QB-APP-TOKEN': config.appToken
          }
        }
      );

      const result = await xml2js.parseStringPromise(response.data);
      
      if (result.qdbapi && result.qdbapi.errcode && result.qdbapi.errcode[0] === '0') {
        console.log(`✅ Page ${pageId} details retrieved successfully`);
        console.log(`📋 Page name: ${result.qdbapi.pagename ? result.qdbapi.pagename[0] : 'N/A'}`);
        console.log(`📋 Page type: ${result.qdbapi.pagetype ? result.qdbapi.pagetype[0] : 'N/A'}`);
        console.log(`📋 Page description: ${result.qdbapi.pagedescription ? result.qdbapi.pagedescription[0] : 'N/A'}`);
        
        // Check if this is a code page
        const pageType = result.qdbapi.pagetype ? result.qdbapi.pagetype[0] : '';
        if (pageType !== '1') {
          console.log(`⚠️  Warning - Page ${pageId} is type '${pageType}', not '1' (HTML page)`);
          console.log(`💡 You may need to create a new HTML page or use a different page ID`);
        }
      } else {
        console.error(`❌ Failed to get page details:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
      }
      
    } catch (error) {
      console.error(`❌ Error checking page details:`, error.message);
    }
  }

  // Create a new HTML page for testing
  async createHTMLPage(pageName) {
    try {
      console.log(`🔨 Creating new HTML page: ${pageName}...`);
      
      const request = {
        qdbapi: {
          $: {
            version: '1.0'
          },
          action: 'API_AddDBPage',
          pagename: pageName,
          pagetype: '1', // 1 = XSL stylesheets or HTML pages
          pagedescription: 'HTML page for auto-deployment'
        }
      };
      
      const xmlRequest = this.builder.buildObject(request);
      
      const response = await axios.post(
        `https://${config.realm}/db/${config.appId}`,
        xmlRequest,
        {
          headers: {
            'Content-Type': 'text/xml',
            'QUICKBASE-ACTION': 'API_AddDBPage',
            'Authorization': `QB-USER-TOKEN ${config.userToken}`,
            'QB-APP-TOKEN': config.appToken
          }
        }
      );

      const result = await xml2js.parseStringPromise(response.data);
      
      if (result.qdbapi && result.qdbapi.errcode && result.qdbapi.errcode[0] === '0') {
        const newPageId = result.qdbapi.pageID ? result.qdbapi.pageID[0] : 'unknown';
        console.log(`✅ Successfully created HTML page: ${pageName}`);
        console.log(`📋 New page ID: ${newPageId}`);
        console.log(`🔗 Page URL: https://${config.realm}/nav/app/${config.appId}/action/pageedit?pageID=${newPageId}`);
        return newPageId;
      } else {
        console.error(`❌ Failed to create HTML page:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
        return null;
      }
      
    } catch (error) {
      console.error(`❌ Error creating HTML page:`, error.message);
      return null;
    }
  }

  // Upload file to Quickbase
  async uploadToQuickbase(filePath) {
    try {
      console.log(`📤 Uploading ${filePath} to Quickbase...`);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      // Determine which page to upload to based on file mapping
      const targetPageId = config.pageMapping[fileName] || config.defaultPageId;
      
      console.log(`🎯 Routing ${fileName} to page ${targetPageId}`);
      console.log(`🔗 API URL: https://${config.realm}/db/${config.appId}`);
      
      // Create XML request
      const xmlRequest = this.createXMLRequest(fileContent, fileName, targetPageId);
      
      // Make API call
      const response = await axios.post(
        `https://${config.realm}/db/${config.appId}`,
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
      
      if (result.qdbapi && result.qdbapi.errcode && result.qdbapi.errcode[0] === '0') {
        console.log(`✅ Successfully uploaded ${fileName} to Quickbase!`);
        console.log(`🔗 Page URL: https://${config.realm}/nav/app/${config.appId}/action/pageedit?pageID=${targetPageId}`);
        console.log(`📋 Page ID returned: ${result.qdbapi.pageID ? result.qdbapi.pageID[0] : 'N/A'}`);
      } else {
        console.error(`❌ Failed to upload ${fileName}:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
        if (result.qdbapi && result.qdbapi.errtext) {
          console.error(`📋 Error details:`, result.qdbapi.errtext[0]);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error uploading ${filePath}:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
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
  async startWatching() {
    console.log('🚀 Starting Quickbase Auto-Deploy for 04_k12 project...');
    console.log('📁 Watching files:', config.watchFiles.join(', '));
    console.log('⏱️  Debounce delay:', config.debounceDelay + 'ms');
    console.log('');

    // Display page mapping
    console.log('📋 Page Mapping Configuration (based on pageFields.md):');
    Object.entries(config.pageMapping).forEach(([fileName, pageId]) => {
      console.log(`   ${fileName} → Page ${pageId}`);
    });
    console.log('');

    // Check all pages to verify they exist and are the right type
    console.log('🔍 Verifying page configurations...');
    for (const [fileName, pageId] of Object.entries(config.pageMapping)) {
      await this.checkPageDetails(pageId);
    }
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
    const required = ['userToken', 'appToken', 'appId'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
      console.error('❌ Configuration error: Please set the following environment variables in .env file:');
      missing.forEach(key => {
        const envVar = key === 'userToken' ? 'QUICKBASE_USER_TOKEN' : 
                      key === 'appToken' ? 'QUICKBASE_APP_TOKEN' : 
                      key === 'appId' ? 'QUICKBASE_APP_ID' : key;
        console.error(`   - ${envVar}`);
      });
      console.error('');
      console.error('📝 How to get these values:');
      console.error('   - QUICKBASE_USER_TOKEN: Your Quickbase user token (from Account Settings > My Preferences)');
      console.error('   - QUICKBASE_APP_TOKEN: Your Quickbase app token (from your Index.html)');
      console.error('   - QUICKBASE_APP_ID: Your Quickbase app ID (from the URL)');
      console.error('');
      console.error('💡 Make sure your .env file exists and contains these variables.');
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
