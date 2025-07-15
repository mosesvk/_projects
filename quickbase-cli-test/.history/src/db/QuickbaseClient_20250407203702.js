// quickbase-client.js
// A JavaScript module to interact with Quickbase API

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
     * Get app information
     * @param {string} [appId=this.appId] - App ID to get info for
     * @returns {Promise<Object>} - App information
     */
    async getApp(appId = this.appId) {
      try {
        const response = await fetch(`https://api.quickbase.com/v1/apps/${appId}`, {
          method: 'GET',
          headers: this.getHeaders()
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Failed to get app info',
            description: errorData.description || ''
          };
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error getting app info:', error);
        throw error;
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
     * Get fields for a table
     * @param {string} [tableId=this.tableId] - Table ID to get fields for
     * @returns {Promise<Array>} - Array of fields
     */
    async getFields(tableId = this.tableId) {
      try {
        const response = await fetch(`https://api.quickbase.com/v1/fields?tableId=${tableId}`, {
          method: 'GET',
          headers: this.getHeaders()
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Failed to get fields',
            description: errorData.description || ''
          };
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error getting fields:', error);
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
  
    /**
     * Create records in a table
     * @param {Object} options - Create options
     * @param {string} [options.tableId=this.tableId] - Table ID to add records to
     * @param {Array} options.data - Array of records to create
     * @returns {Promise<Object>} - Create results
     */
    async createRecords(options = {}) {
      const tableId = options.tableId || this.tableId;
      const data = options.data || [];
  
      if (!data.length) {
        throw new Error('No data provided for creating records');
      }
  
      try {
        const response = await fetch('https://api.quickbase.com/v1/records', {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            to: tableId,
            data: data
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Failed to create records',
            description: errorData.description || ''
          };
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error creating records:', error);
        throw error;
      }
    }
  
    /**
     * Update records in a table
     * @param {Object} options - Update options
     * @param {string} [options.tableId=this.tableId] - Table ID to update records in
     * @param {Array} options.data - Array of records to update
     * @returns {Promise<Object>} - Update results
     */
    async updateRecords(options = {}) {
      const tableId = options.tableId || this.tableId;
      const data = options.data || [];
  
      if (!data.length) {
        throw new Error('No data provided for updating records');
      }
  
      try {
        const response = await fetch('https://api.quickbase.com/v1/records', {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            to: tableId,
            data: data
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Failed to update records',
            description: errorData.description || ''
          };
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error updating records:', error);
        throw error;
      }
    }
  
    /**
     * Delete records from a table
     * @param {Object} options - Delete options
     * @param {string} [options.tableId=this.tableId] - Table ID to delete records from
     * @param {string} options.where - Where clause to identify records to delete
     * @returns {Promise<Object>} - Delete results
     */
    async deleteRecords(options = {}) {
      const tableId = options.tableId || this.tableId;
      const where = options.where;
  
      if (!where) {
        throw new Error('Where clause is required for deleting records');
      }
  
      try {
        const response = await fetch('https://api.quickbase.com/v1/records', {
          method: 'DELETE',
          headers: this.getHeaders(),
          body: JSON.stringify({
            from: tableId,
            where: where
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            status: response.status,
            message: errorData.message || 'Failed to delete records',
            description: errorData.description || ''
          };
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error deleting records:', error);
        throw error;
      }
    }
  }
  
  // Example usage of the QuickbaseClient class
  async function quickbaseCliExample() {
    // Create a client instance
    const qb = new QuickbaseClient({
      realmHostname: 'capincrouse.quickbase.com',
      userToken: 'YOUR_USER_TOKEN', // Replace with your token
      appId: 'bps9da9i5',
      tableId: 'bs2bkir3i'
    });
  
    try {
      // Test connection
      const connectionTest = await qb.testConnection();
      if (!connectionTest.success) {
        console.error('Connection failed:', connectionTest.error);
        return;
      }
  
      console.log('App Info:', connectionTest.appInfo);
  
      // Get tables
      const tables = await qb.getTables();
      console.log(`App has ${tables.length} tables:`, tables.map(t => t.name));
  
      // Get fields for the table
      const fields = await qb.getFields();
      console.log(`Table has ${fields.length} fields`);
  
      // Query records
      const records = await qb.queryRecords({
        top: 10 // Limit to 10 records
      });
      
      console.log(`Retrieved ${records.data.length} records`);
      
      // Process the records as needed
      if (records.data && records.data.length > 0) {
        console.log('First record:', records.data[0]);
      }
  
      return {
        success: true,
        tables: tables,
        fields: fields,
        records: records
      };
    } catch (error) {
      console.error('Error in Quickbase CLI example:', error);
      return {
        success: false,
        error: error
      };
    }
  }
  
  // Don't run automatically when used as a module
  if (typeof window !== 'undefined' && window.document && window.document.querySelector('#runExample')) {
    document.querySelector('#runExample').addEventListener('click', async () => {
      const result = await quickbaseCliExample();
      console.log('Example completed:', result);
    });
  }
  
  // Export the class for module usage
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuickbaseClient };
  } else if (typeof window !== 'undefined') {
    // Add to window object when in browser
    window.QuickbaseClient = QuickbaseClient;
  }