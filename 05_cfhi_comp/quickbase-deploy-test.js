const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const axios = require('axios');
const xml2js = require('xml2js');

// Test Configuration - Single page for testing
const config = {
  // Quickbase API Configuration
  realm: 'capincrouse.quickbase.com', 
  userToken: 'b59mcm_dp5d_0_cefk3nbh83jxu8ie9qrbfbri4b', 
  appToken: 'bpat4pgu9t69yby5gbemdbej52j', 
  appId: 'bps9da9i5', // App ID from your URL
  
  // Test page configuration
  testPageId: '217', // The code page you just created
  
  // File watching configuration - test with just one file first
  watchFiles: [
    'Index.html' // Start with just the main file for testing
  ],
  
  // Debounce delay (ms) to prevent multiple rapid uploads
  debounceDelay: 2000
};

class QuickbaseTestDeployer {
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
        pagebody: `<![CDATA[${fixedContent}]]>` // Use pagebody with CDATA wrapper
      }
    };
    
    return this.builder.buildObject(request);
  }

  // Check page details to understand what type of page it is
  async checkPageDetails(pageId) {
    try {
      console.log(`🔍 TEST: Checking details for page ${pageId}...`);
      
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
        console.log(`✅ TEST: Page ${pageId} details retrieved successfully`);
        console.log(`📋 TEST: Page name: ${result.qdbapi.pagename ? result.qdbapi.pagename[0] : 'N/A'}`);
        console.log(`📋 TEST: Page type: ${result.qdbapi.pagetype ? result.qdbapi.pagetype[0] : 'N/A'}`);
        console.log(`📋 TEST: Page description: ${result.qdbapi.pagedescription ? result.qdbapi.pagedescription[0] : 'N/A'}`);
        
        // Check if this is a code page
        const pageType = result.qdbapi.pagetype ? result.qdbapi.pagetype[0] : '';
        if (pageType !== 'code') {
          console.log(`⚠️  TEST: Warning - Page ${pageId} is type '${pageType}', not 'code'`);
          console.log(`💡 TEST: You may need to create a new code page or use a different page ID`);
        }
      } else {
        console.error(`❌ TEST: Failed to get page details:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
      }
      
    } catch (error) {
      console.error(`❌ TEST: Error checking page details:`, error.message);
    }
  }

  // Create a new code page for testing
  async createCodePage(pageName) {
    try {
      console.log(`🔨 TEST: Creating new code page: ${pageName}...`);
      
      const request = {
        qdbapi: {
          $: {
            version: '1.0'
          },
          action: 'API_AddDBPage',
          pagename: pageName,
          pagetype: '1', // 1 = XSL stylesheets or HTML pages
          pagedescription: 'Test code page for auto-deployment'
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
        console.log(`✅ TEST: Successfully created code page: ${pageName}`);
        console.log(`📋 TEST: New page ID: ${newPageId}`);
        console.log(`🔗 TEST: Page URL: https://${config.realm}/nav/app/${config.appId}/action/pageedit?pageID=${newPageId}`);
        return newPageId;
      } else {
        console.error(`❌ TEST: Failed to create code page:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
        return null;
      }
      
    } catch (error) {
      console.error(`❌ TEST: Error creating code page:`, error.message);
      return null;
    }
  }

  // Upload file to Quickbase
  async uploadToQuickbase(filePath) {
    try {
      console.log(`🧪 TEST: Uploading ${filePath} to Quickbase...`);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      console.log(`🎯 TEST: Routing ${fileName} to page ${config.testPageId}`);
      console.log(`🔗 TEST: API URL: https://${config.realm}/db/${config.appId}`);
      
      // Create XML request
      const xmlRequest = this.createXMLRequest(fileContent, fileName, config.testPageId);
      
      // Log the XML request for debugging
      console.log(`📋 TEST: XML Request:`);
      console.log(xmlRequest);
      console.log('');
      
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
      
      console.log(`📋 TEST: Response:`, JSON.stringify(result, null, 2));
      
      if (result.qdbapi && result.qdbapi.errcode && result.qdbapi.errcode[0] === '0') {
        console.log(`✅ TEST: Successfully uploaded ${fileName} to Quickbase!`);
        console.log(`🔗 TEST: Page URL: https://${config.realm}/nav/app/${config.appId}/action/pageedit?pageID=${config.testPageId}`);
        console.log(`📋 TEST: Page ID returned: ${result.qdbapi.pageID ? result.qdbapi.pageID[0] : 'N/A'}`);
      } else {
        console.error(`❌ TEST: Failed to upload ${fileName}:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
        if (result.qdbapi && result.qdbapi.errtext) {
          console.error(`📋 TEST: Error details:`, result.qdbapi.errtext[0]);
        }
      }
      
    } catch (error) {
      console.error(`❌ TEST: Error uploading ${filePath}:`, error.message);
      if (error.response) {
        console.error('TEST: Response status:', error.response.status);
        console.error('TEST: Response data:', error.response.data);
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
    console.log('🧪 Starting Quickbase TEST Auto-Deploy...');
    console.log('📁 TEST: Watching files:', config.watchFiles.join(', '));
    console.log('🎯 TEST: Target page ID:', config.testPageId);
    console.log('⏱️  TEST: Debounce delay:', config.debounceDelay + 'ms');
    console.log('');

    // First, check what type of page we're working with
    await this.checkPageDetails(config.testPageId);
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
        console.log(`📄 TEST: File added: ${filePath}`);
        this.debouncedUpload(filePath);
      })
      .on('change', (filePath) => {
        console.log(`📝 TEST: File changed: ${filePath}`);
        this.debouncedUpload(filePath);
      })
      .on('unlink', (filePath) => {
        console.log(`🗑️  TEST: File removed: ${filePath}`);
      })
      .on('error', (error) => {
        console.error('❌ TEST: Watcher error:', error);
      });

    console.log('👀 TEST: File watcher is active. Make changes to Index.html to trigger test uploads.');
    console.log('Press Ctrl+C to stop watching.');
  }

  // Validate configuration
  validateConfig() {
    const required = ['realm', 'userToken', 'testPageId'];
    const missing = required.filter(key => !config[key] || config[key].includes('your-'));
    
    if (missing.length > 0) {
      console.error('❌ TEST: Configuration error: Please set the following values in the config object:');
      missing.forEach(key => console.error(`   - ${key}`));
      console.error('');
      console.error('📝 TEST: How to get these values:');
      console.error('   - realm: Your Quickbase realm (e.g., capincrouse.quickbase.com)');
      console.error('   - userToken: Your Quickbase user token (from Account Settings > My Preferences)');
      console.error('   - testPageId: The ID of the test page you want to replace');
      return false;
    }
    
    console.log('📋 TEST: Configuration:');
    console.log(`   App ID: ${config.appId}`);
    console.log(`   Test Page ID: ${config.testPageId}`);
    console.log(`   Watching: ${config.watchFiles.join(', ')}`);
    console.log('');
    
    return true;
  }
}

// Main execution
async function main() {
  const deployer = new QuickbaseTestDeployer();
  
  if (!deployer.validateConfig()) {
    process.exit(1);
  }
  
  deployer.startWatching();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 TEST: Stopping Quickbase Test Auto-Deploy...');
  process.exit(0);
});

// Run the script
main().catch(console.error);
