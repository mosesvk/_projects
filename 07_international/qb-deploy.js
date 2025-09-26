require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const axios = require('axios');
const xml2js = require('xml2js');

/**
 * QuickBase Auto-Deploy Configuration for International Project
 * 
 * This script automatically deploys local files to QuickBase code pages
 * when files are modified. Page mappings are based on qbFields.md documentation.
 */
const config = {
  // Quickbase API Configuration
  realm: process.env.QUICKBASE_REALM || 'capincrouse.quickbase.com', 
  userToken: process.env.QUICKBASE_USER_TOKEN, 
  appToken: process.env.QUICKBASE_APP_TOKEN, 
  appId: process.env.QUICKBASE_APP_ID, // App ID: bps9da9i5 (from URL structure)
  
  // Page Configuration - Based on qbFields.md mapping
  // Local file path → QuickBase page ID
  pageMapping: {
    // Main HTML page
    'Index.html': '162', // intl_main.html
    'src/Index.html': '162', // intl_main.html (alternative path)
    
    // API and Core Components
    'Api.js': '163', // intl_api.js
    'src/Api.js': '163', // intl_api.js
    'Connector.js': '199', // System connector (inferred from HTML)
    'src/Connector.js': '199', // System connector
    
    // Utility Files
    'utility/Utility.js': '164', // intl_utility.js
    'src/utility/Utility.js': '164', // intl_utility.js
    'utility/UiManagement.js': '166', // intl_uiManagement.js
    'src/utility/UiManagement.js': '166', // intl_uiManagement.js
    'utility/WeightedAverages.js': '168', // intl_weightedAverage.js
    'src/utility/WeightedAverages.js': '168', // intl_weightedAverage.js
    
    // Header and Components
    'components/Header.js': '165', // intl_header.js
    'src/components/Header.js': '165', // intl_header.js
    'components/Report.js': '167', // intl_report_main.js
    'src/components/Report.js': '167', // intl_report_main.js
    
    // Chart System Files
    'charts/chartSystem.js': '194', // intl_chartSystem.js
    'src/charts/chartSystem.js': '194', // intl_chartSystem.js
    'charts/chartConfigFactory.js': '195', // intl_chartConfigFactory.js
    'src/charts/chartConfigFactory.js': '195', // intl_chartConfigFactory.js
    'charts/chartManager.js': '196', // intl_chartManager.js
    'src/charts/chartManager.js': '196', // intl_chartManager.js
    'charts/chartDisplayComponents.js': '197', // intl_chartDisplayComponents.js
    'src/charts/chartDisplayComponents.js': '197', // intl_chartDisplayComponents.js
    'charts/chartIndex.js': '198', // intl_chartIndex.js
    'src/charts/chartIndex.js': '198', // intl_chartIndex.js
    
    // Utility and Print Files
    'utils/print_base64.js': '182', // intl_print_base64.js
    'src/utils/print_base64.js': '182', // intl_print_base64.js
    'utils/print_excel.js': '201', // printExcel.js (from HTML references)
    'src/utils/print_excel.js': '201', // printExcel.js
    
    // Public HTML
    'public/Public.html': '162', // Alternative main page (could be separate if needed)
  },
  
  // Default page ID (fallback to main HTML page)
  defaultPageId: '162',
  
  // File watching configuration - Watch all relevant project files
  watchFiles: [
    // Root level files
    'Index.html',
    'Api.js', 
    'Connector.js',
    
    // Source directory files
    'src/Index.html',
    'src/Api.js',
    'src/Connector.js',
    'src/components/**/*.js',
    'src/utility/**/*.js',
    'src/charts/**/*.js',
    'src/utils/**/*.js',
    
    // Legacy paths (if files exist in root)
    'components/**/*.js',
    'utility/**/*.js', 
    'charts/**/*.js',
    'utils/**/*.js',
    
    // Public files
    'public/**/*.html'
  ],
  
  // Debounce delay (ms) to prevent multiple rapid uploads
  debounceDelay: 2000
};

/**
 * QuickBase Deployer Class
 * Handles file watching and deployment to QuickBase code pages
 */
class QuickbaseDeployer {
  constructor() {
    this.debounceTimer = null;
    this.builder = new xml2js.Builder();
  }

  /**
   * Create XML request for API_AddReplaceDBPage
   * @param {string} fileContent - Content of the file to upload
   * @param {string} fileName - Name of the file
   * @param {string} pageId - QuickBase page ID
   * @returns {string} XML request string
   */
  createXMLRequest(fileContent, fileName, pageId) {
    // Fix mixed content by converting HTTP to HTTPS for security
    const fixedContent = fileContent.replace(/http:\/\//g, 'https://');
    
    const request = {
      qdbapi: {
        $: {
          version: '1.0'
        },
        action: 'API_AddReplaceDBPage',
        pageid: pageId,
        pagename: fileName.replace(/^src\//, 'intl_').replace(/\//g, '_'), // Create QB-friendly names
        pagetype: '1', // 1 = XSL stylesheets or HTML pages (per API docs)
        pagebody: fixedContent
      }
    };
    
    return this.builder.buildObject(request);
  }

  /**
   * Check page details to understand what type of page it is
   * @param {string} pageId - QuickBase page ID to check
   */
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

  /**
   * Create a new HTML page for testing
   * @param {string} pageName - Name for the new page
   * @returns {string|null} New page ID or null if failed
   */
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
          pagedescription: 'HTML page for International project auto-deployment'
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

  /**
   * Upload file to QuickBase
   * @param {string} filePath - Path to the file to upload
   */
  async uploadToQuickbase(filePath) {
    try {
      console.log(`📤 Uploading ${filePath} to Quickbase...`);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Determine which page to upload to based on file mapping
      // Try exact match first, then try normalized path
      let targetPageId = config.pageMapping[relativePath];
      
      if (!targetPageId) {
        // Try alternative path formats
        const normalizedPath = relativePath.replace(/\\/g, '/'); // Handle Windows paths
        targetPageId = config.pageMapping[normalizedPath] || config.defaultPageId;
      }
      
      console.log(`🎯 Routing ${relativePath} to page ${targetPageId}`);
      console.log(`🔗 API URL: https://${config.realm}/db/${config.appId}`);
      
      // Create XML request
      const xmlRequest = this.createXMLRequest(fileContent, relativePath, targetPageId);
      
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
        console.log(`✅ Successfully uploaded ${relativePath} to Quickbase!`);
        console.log(`🔗 Page URL: https://${config.realm}/nav/app/${config.appId}/action/pageedit?pageID=${targetPageId}`);
        console.log(`📋 Page ID returned: ${result.qdbapi.pageID ? result.qdbapi.pageID[0] : 'N/A'}`);
      } else {
        console.error(`❌ Failed to upload ${relativePath}:`, result.qdbapi ? result.qdbapi.errtext : 'Unknown error');
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

  /**
   * Debounced upload function to prevent rapid-fire uploads
   * @param {string} filePath - Path to the file to upload
   */
  debouncedUpload(filePath) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.uploadToQuickbase(filePath);
    }, config.debounceDelay);
  }

  /**
   * Start watching files for changes
   */
  async startWatching() {
    console.log('🚀 Starting Quickbase Auto-Deploy for International Project...');
    console.log('📁 Watching files:', config.watchFiles.join(', '));
    console.log('⏱️  Debounce delay:', config.debounceDelay + 'ms');
    console.log('');

    // Display page mapping
    console.log('📋 Page Mapping Configuration (from qbFields.md):');
    Object.entries(config.pageMapping).forEach(([filePath, pageId]) => {
      console.log(`   ${filePath} → Page ${pageId}`);
    });
    console.log('');

    // Check a few key pages to verify they exist and are the right type
    console.log('🔍 Verifying key page configurations...');
    const keyPages = ['162', '163', '164', '165', '194', '195', '196', '197', '198'];
    for (const pageId of keyPages) {
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

  /**
   * Validate configuration before starting
   * @returns {boolean} True if configuration is valid
   */
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
      console.error('📝 How to get these values for International Project:');
      console.error('   - QUICKBASE_USER_TOKEN: Your Quickbase user token (from Account Settings > My Preferences)');
      console.error('   - QUICKBASE_APP_TOKEN: Your Quickbase app token (from your Index.html - look for apptoken)');
      console.error('   - QUICKBASE_APP_ID: bps9da9i5 (from the QuickBase URL structure)');
      console.error('');
      console.error('💡 Create a .env file in the project root with these variables.');
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
