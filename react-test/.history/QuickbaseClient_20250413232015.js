// QuickbaseClient.js
// A JavaScript module to interact with Quickbase API
// Modified for browser usage with React

class QuickbaseClient {
    /**
     * Initialize a new Quickbase client
     * @param {Object} config - Configuration object
     * @param {string} config.realmHostname - Quickbase realm hostname (e.g. "capincrouse.quickbase.com")
     * @param {string} config.userToken - Quickbase user token
     * @param {string} config.appId - Default app ID
     * @param {string} config.tableId - Default table ID
     */
    constructor(config) {
      this.realmHostname = config.realmHostname;
      this.userToken = config.userToken;
      this.appId = config.appId;
      this.tableId = config.tableId;
      this.isConnected = false;
    }
  
    /**
     * Get the headers required for Quickbase API requests
     * @returns {Object} - Headers object
     */
    getHeaders() {
      return {
        'QB-Realm-Hostname': this.realmHostname,
        'Authorization': `QB-USER-TOKEN ${this.userToken}`,
        'Content-Type': 'application/json'
      };
    }
  
    /**
     * Test the connection to Quickbase
     * @returns {Promise<Object>} - Connection test result
     */
    async testConnection() {
      try {
        console.log(`Testing connection to ${this.realmHostname}...`);
        const response = await fetch(`https://api.quickbase.com/v1/apps/${this.appId}`, {
          method: 'GET',
          headers: this.getHeaders()
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Connection failed',
            description: errorData.description || ''
          };
        }
  
        const appInfo = await response.json();
        this.isConnected = true;
        console.log('Connection successful!');
        
        return {
          success: true,
          appInfo: appInfo
        };
      } catch (error) {
        console.error('Connection failed:', error.message);
        this.isConnected = false;
        
        return {
          success: false,
          error: error
        };
      }
    }
  
    /**
     * Get tables for an app
     * @param {string} [appId=this.appId] - App ID to get tables for
     * @returns {Promise<Array>} - Array of tables
     */
    async getTables(appId = this.appId) {
      try {
        const response = await fetch(`https://api.quickbase.com/v1/tables?appId=${appId}`, {
          method: 'GET',
          headers: this.getHeaders()
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Failed to get tables',
            description: errorData.description || ''
          };
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error getting tables:', error);
        throw error;
      }
    }
  
    /**
     * Query records from a table
     * @param {Object} options - Query options
     * @param {string} [options.tableId=this.tableId] - Table ID to query
     * @param {Array} [options.select=[]] - Fields to select (empty for all)
     * @param {string} [options.where=''] - Where clause
     * @param {number} [options.skip=0] - Number of records to skip
     * @param {number} [options.top=100] - Maximum number of records to return
     * @returns {Promise<Object>} - Query results
     */
    async queryRecords(options = {}) {
      const tableId = options.tableId || this.tableId;
      const select = options.select || [];
      const where = options.where || '';
      const skip = options.skip || 0;
      const top = options.top || 100;
  
      try {
        const queryOptions = {
          from: tableId,
          select: select,
          options: {
            skip: skip,
            top: top
          }
        };
  
        // Add where clause if provided
        if (where) {
          queryOptions.where = where;
        }
  
        const response = await fetch('https://api.quickbase.com/v1/records/query', {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(queryOptions)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Failed to query records',
            description: errorData.description || ''
          };
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error querying records:', error);
        throw error;
      }
    }
}

// Add to window object for browser usage
window.QuickbaseClient = QuickbaseClient;