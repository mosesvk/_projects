// QuickbaseClient.js
// A JavaScript module to interact with Quickbase API
// Supports both local development (with mock data) and Quickbase deployment

class QuickbaseClient {
    /**
     * Initialize a new Quickbase client
     * @param {Object} config - Configuration object
     * @param {string} config.realmHostname - Quickbase realm hostname (e.g. "capincrouse.quickbase.com")
     * @param {string} config.userToken - Quickbase user token
     * @param {string} config.appId - Default app ID
     * @param {string} config.tableId - Default table ID
     * @param {boolean} config.useMockData - Whether to use mock data (for local development)
     */
    constructor(config) {
      this.realmHostname = config.realmHostname;
      this.userToken = config.userToken;
      this.appId = config.appId;
      this.tableId = config.tableId;
      this.isConnected = false;
      
      // Determine if we should use mock data (local dev) or real API calls (in Quickbase)
      this.useMockData = config.useMockData ?? !this.isRunningInQuickbase();
    }
    
    /**
     * Detect if the code is running inside Quickbase
     * @returns {boolean} - True if running inside Quickbase
     */
    isRunningInQuickbase() {
      // Quickbase's code page context includes properties we can check for
      return typeof qdb !== 'undefined' || 
             window.location.hostname.includes('quickbase.com');
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
        
        if (this.useMockData) {
          // Local development - simulate a successful connection
          console.log('Using mock data for local development.');
          console.log('This code will use real API calls when deployed to Quickbase code pages.');
          
          // Simulated successful response
          return {
            success: true,
            appInfo: {
              id: this.appId,
              name: "Quickbase Demo App",
              created: new Date().toISOString(),
              updated: new Date().toISOString()
            }
          };
        } else {
          // Running in Quickbase - use actual API
          console.log('Running in Quickbase - using real API.');
          
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
        console.log(`Querying records from table ${tableId}`);
        console.log('Fields selected:', select);
        
        if (this.useMockData) {
          // Local development - generate mock data
          console.log('Using mock data for local development');
          
          // Generate mock data based on which table is being queried
          let mockData;
          
          if (tableId.includes('CLIENT')) {
            // Mock data for client table
            mockData = this.generateMockClientData(select, top);
          } else {
            // Mock data for peer table
            mockData = this.generateMockPeerData(select, top);
          }
          
          return {
            data: mockData,
            fields: select.map(id => ({ id, label: `Field ${id}`, type: 'text' })),
            metadata: {
              totalRecords: mockData.length,
              numRecords: mockData.length,
              numFields: select.length,
              skip: skip
            }
          };
        } else {
          // Running in Quickbase - use actual API
          console.log('Running in Quickbase - using real API');
          
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
        }
      } catch (error) {
        console.error('Error querying records:', error);
        throw error;
      }
    }
    
    /**
     * Generate mock client data (used when CORS prevents actual API calls)
     * @param {Array} fieldIds - Array of field IDs to include
     * @param {number} count - Number of records to generate
     * @returns {Array} - Array of mock records
     */
    generateMockClientData(fieldIds, count) {
      const mockData = [];
      
      for (let i = 0; i < count; i++) {
        const record = {};
        
        fieldIds.forEach(fieldId => {
          record[fieldId] = {
            value: this.getMockValueForField(fieldId, 'client', i)
          };
        });
        
        mockData.push(record);
      }
      
      return mockData;
    }
    
    /**
     * Generate mock peer data (used when CORS prevents actual API calls)
     * @param {Array} fieldIds - Array of field IDs to include
     * @param {number} count - Number of records to generate
     * @returns {Array} - Array of mock records
     */
    generateMockPeerData(fieldIds, count) {
      const mockData = [];
      
      for (let i = 0; i < count; i++) {
        const record = {};
        
        fieldIds.forEach(fieldId => {
          record[fieldId] = {
            value: this.getMockValueForField(fieldId, 'peer', i)
          };
        });
        
        mockData.push(record);
      }
      
      return mockData;
    }
    
    /**
     * Get a mock value for a specific field
     * @param {number} fieldId - Field ID
     * @param {string} type - Data type ('client' or 'peer')
     * @param {number} index - Record index
     * @returns {any} - Mock value for the field
     */
    getMockValueForField(fieldId, type, index) {
      // Mock data for demonstration purposes
      const clientFieldData = {
        29: [`Client ${index + 1}`, `Organization ${index + 1}`, `Company ${index + 1}`],
        192: [100000, 250000, 500000, 1000000],
        157: ['Active', 'Pending', 'Inactive'],
        158: ['2023-01-15', '2023-03-22', '2023-06-10', '2023-09-05'],
        159: [true, false],
        160: ['Region A', 'Region B', 'Region C'],
        141: [1, 2, 3, 4, 5],
        142: ['johndoe@example.com', 'jane@example.com', 'contact@example.com'],
        143: ['123-456-7890', '987-654-3210']
      };
      
      const peerFieldData = {
        301: [`Peer ${index + 1}`, `Partner ${index + 1}`, `Alliance ${index + 1}`],
        59: [75000, 150000, 300000, 750000],
        60: ['2023-02-10', '2023-04-15', '2023-07-22', '2023-10-05'],
        62: ['Available', 'Limited', 'Unavailable'],
        63: ['Industry A', 'Industry B', 'Industry C'],
        64: [1, 2, 3, 4, 5],
        66: ['contact@partner.com', 'info@alliance.com'],
        261: ['555-123-4567', '555-987-6543']
      };
      
      // Choose the appropriate data source
      const fieldData = type === 'client' ? clientFieldData : peerFieldData;
      
      // If we have mock data for this field, return a random value
      if (fieldData[fieldId]) {
        const values = fieldData[fieldId];
        return values[Math.floor(Math.random() * values.length)];
      }
      
      // Default mock value based on field ID and record index
      return `Mock value for field ${fieldId} (record ${index + 1})`;
    }
}

// Add to window object for browser usage
window.QuickbaseClient = QuickbaseClient;