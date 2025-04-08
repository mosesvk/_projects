// api.js
// Centralized API management for Quickbase data extraction

class QuickbaseDataStore {
    constructor() {
        // Initialize data stores for different tables
        this.internationalClientData = [];
        this.internationalPeerData = [];
    }

    // Setter methods for data
    setData(type, data) {
        switch(type) {
            case 'client':
                this.internationalClientData = data;
                break;
            case 'peer':
                this.internationalPeerData = data;
                break;
            default:
                throw new Error(`Invalid data type: ${type}`);
        }
    }

    // Getter methods for data
    getData(type) {
        switch(type) {
            case 'client':
                return this.internationalClientData;
            case 'peer':
                return this.internationalPeerData;
            default:
                throw new Error(`Invalid data type: ${type}`);
        }
    }
}

class QuickbaseApiManager {
    constructor(config) {
        // Initialize QuickbaseClient with provided configuration
        this.client = new QuickbaseClient(config);
        this.dataStore = new QuickbaseDataStore();
    }

    /**
     * Extract data from a specific table with dynamic configuration
     * @param {Object} options - Configuration options for data extraction
     * @param {string} options.type - Type of data ('client' or 'peer')
     * @param {string} options.tableId - Quickbase table ID
     * @param {Array<number>} options.selectIds - Array of field IDs to select
     * @param {string} [options.where] - Optional where clause for filtering
     * @param {number} [options.top=10] - Number of records to retrieve
     * @returns {Promise<Array>} Extracted data
     */
    async extractData(options) {
        const {
            type, 
            tableId, 
            selectIds, 
            where = '', 
            top = 10
        } = options;

        // Validate input
        if (!['client', 'peer'].includes(type)) {
            throw new Error(`Invalid data type: ${type}. Must be 'client' or 'peer'.`);
        }

        if (!tableId) {
            throw new Error('Table ID is required');
        }

        if (!Array.isArray(selectIds) || selectIds.length === 0) {
            throw new Error('Select IDs must be a non-empty array');
        }

        try {
            // Prepare query options
            const queryOptions = {
                tableId: tableId,
                select: selectIds,
                top: top
            };

            // Add where clause if provided
            if (where) {
                queryOptions.where = where;
            }

            // Execute query
            const extractedData = await this.client.queryRecords(queryOptions);

            // Store the data in the dataStore
            this.dataStore.setData(type, extractedData.data);

            return extractedData.data;
        } catch (error) {
            console.error(`Error extracting ${type} data:`, error);
            throw error;
        }
    }

    /**
     * Extract data from International Client Table (legacy method for backward compatibility)
     * @returns {Promise<Array>} Extracted client data
     */
    async extractInternationalClientData() {
        return this.extractData({
            type: 'client',
            tableId: 'bsz5d5eva',
            selectIds: [29, 192, 157, 158, 159, 160, 141, 142, 143],
            where: '29=2605',
            top: 5
        });
    }

    /**
     * Extract data from International Peer Table (legacy method for backward compatibility)
     * @returns {Promise<Array>} Extracted peer data
     */
    async extractInternationalPeerData() {
        return this.extractData({
            type: 'peer',
            tableId: 'bs2bkir3i',
            selectIds: [301, 59, 60, 62, 63, 64, 66, 261],
            top: 10
        });
    }

    /**
     * Retrieve the centralized data store
     * @returns {QuickbaseDataStore} The data store instance
     */
    getDataStore() {
        return this.dataStore;
    }

    /**
     * Perform initial data extraction for both tables
     * @returns {Promise<Object>} Results of data extraction
     */
    async initializeData() {
        try {
            const clientData = await this.extractInternationalClientData();
            const peerData = await this.extractInternationalPeerData();

            return {
                clientData,
                peerData
            };
        } catch (error) {
            console.error('Error initializing data:', error);
            throw error;
        }
    }
}

// Export the classes for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        QuickbaseApiManager, 
        QuickbaseDataStore 
    };
} else if (typeof window !== 'undefined') {
    // Add to window object when in browser
    window.QuickbaseApiManager = QuickbaseApiManager;
    window.QuickbaseDataStore = QuickbaseDataStore;
}