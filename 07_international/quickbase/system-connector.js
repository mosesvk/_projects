// system-connector.js - Simplified version
class SystemConnector {
  constructor() {
    this.initialized = false;
    this.isLoading = false;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }
  
  initialize() {
    if (this.initialized) return;
    
    // Set up a single run button listener to prevent duplicates
    const runButton = document.querySelector('#run');
    if (runButton) {
      // Replace the button to remove any existing listeners
      const newRunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newRunButton, runButton);
      
      // Add the unified listener
      newRunButton.addEventListener('click', () => this.handleRunButtonClick());
    }
    
    this.initialized = true;
    console.log('System Connector initialized');
  }
  
  async handleRunButtonClick() {
    // Prevent multiple simultaneous requests
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      
      // Show loading indicator
      if (typeof showApiLoadingFunction === 'function') {
        showApiLoadingFunction('open', 'api');
      }
      
      // Get selected years
      const selectedYears = this.getSelectedYears();
      this.saveSelectedYearsToLocalStorage(selectedYears);
      
      // Clear existing records and charts
      this.clearExistingData();
      
      // Directly call API functions
      const recordsPeer = await this.getRecordsForPeer(selectedYears);
      if (typeof countUniqueClients === 'function') {
        countUniqueClients(recordsPeer);
      }
      
      const recordsClient = await this.getRecordsForClient(selectedYears);
      
      // Process data
      this.processData(selectedYears, recordsPeer, recordsClient);
      
      // Display charts
      this.displayCharts();
      
      // Hide loading indicator
      if (typeof showApiLoadingFunction === 'function') {
        showApiLoadingFunction('close');
      }
      
      console.log('Data processing and chart rendering complete');
    } catch (error) {
      console.error('Error in run button handler:', error);
      
      // Hide loading indicator even on error
      if (typeof showApiLoadingFunction === 'function') {
        showApiLoadingFunction('close');
      }
      
      // Display error message to user
      if (typeof createToastWarning === 'function') {
        createToastWarning('Error processing data. Please try again.');
      }
    } finally {
      this.isLoading = false;
    }
  }
  
  // Get and validate selected years
  getSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears || !selectedYears.length) {
      createToastWarning("Please select year(s) for data to appear");
      throw new Error("No years selected.");
    }

    return selectedYears;
  }
  
  // Save selected years to localStorage
  saveSelectedYearsToLocalStorage(selectedYears) {
    if (Array.isArray(selectedYears)) {
      const sortedYears = [...selectedYears].sort((a, b) => a - b);
      localStorage.setItem("selectedYears", JSON.stringify(sortedYears));
    }
  }
  
  // Clear existing data
  clearExistingData() {
    // Clear chart instances if chartManager exists
    if (window.chartManager && typeof chartManager.destroyAllCharts === 'function') {
      chartManager.destroyAllCharts();
    }
    
    // Clear localStorage data
    localStorage.removeItem("generalData");
    localStorage.removeItem("cashData");
    localStorage.removeItem("assetData");
    localStorage.removeItem("incomeData");
    localStorage.removeItem("expenseData");
    localStorage.removeItem("miscData");
  }
  
  // Use existing global API functions
  async getRecordsForPeer(years) {
    // Use the existing global function if available
    if (typeof window.getRecordsForPeer === 'function') {
      return window.getRecordsForPeer(years);
    }
    
    // Otherwise use jQuery directly - this assumes peerData is defined globally
    if (typeof peerData !== 'undefined') {
      const dataStr = "<qdbapi>";
      let allRecords = [];
      
      // Fetch data for each year
      for (const year of years) {
        const regionQuery = this.getRegionQuery(selectedRegions_Array);
        const typeQuery = this.getTypeQuery(selectedTypes_Array);
        
        const apiCallPeerData = {
          act: "API_DoQuery",
          query: `(${regionQuery}) AND (${typeQuery}) AND {301.EX.${year}}`,
          clist: "301.59.60.62.63.64.66.261.302.262.303.211.227.231.118.263.304.197.264.305.198.199.265.306.209.208.220.266.307.195.196.267.308.251.268.309.269.310.219.205.228.270.311.274.312.198.199.209.275.313.197.208.220.209.276.314.277.315.240.241.206.207.280.316.200.201.281.317.282.318.239.283.319.238.284.320.225.285.321.204.287.322.202.227.288.323.203.289.324.204.290.325.242.291.326.204.200.201.292.327.227.239.293.328.238.294.329.225.295.330.215.225.296.331.297.332.250.201.298.333.222.231.122.344.334.306.347.343.346.244.205.341.342.344.345.348.351.352.256.353.354."
        };
        
        try {
          const xml = await $.get(peerData, apiCallPeerData);
          const recordsForPeer = $("record", xml).toArray();
          allRecords = [...allRecords, ...recordsForPeer];
        } catch (error) {
          console.error("Error fetching peer data for year", year, error);
        }
      }
      
      // Return the records
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataStr + "</qdbapi>", "text/xml");
      return allRecords.length > 0 ? allRecords : xmlDoc.querySelectorAll("record");
    }
    
    throw new Error("No method available to fetch peer records");
  }
  
  async getRecordsForClient(years) {
    // Use the existing global function if available
    if (typeof window.getRecordsForClient === 'function') {
      return window.getRecordsForClient(years);
    }
    
    // Otherwise use jQuery directly - this assumes clientData is defined globally
    if (typeof clientData !== 'undefined') {
      const dataStr = "<qdbapi>";
      let allRecords = [];
      
      // Fetch data for each year
      for (const year of years) {
        const apiCallClientData = {
          act: "API_DoQuery",
          query: `{192.EX.${year}} AND {29.EX.${ClientRid}}`,
          clist: "29.192.157.158.159.160.141.142.143.144.145.146.147.148.149.185.186.187.212.189.188.150.161.162.163.164.165.166.167.168.169.170.171.172.42.173.174.175.176.177.178.179.180.181.182.183.184.31.213.42.217.25.193.222.221.218.15.21"
        };
        
        try {
          const xml = await $.get(clientData, apiCallClientData);
          const recordsForClient = $("record", xml).toArray();
          allRecords = [...allRecords, ...recordsForClient];
        } catch (error) {
          console.error("Error fetching client data for year", year, error);
        }
      }
      
      // Return the records
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataStr + "</qdbapi>", "text/xml");
      return allRecords.length > 0 ? allRecords : xmlDoc.querySelectorAll("record");
    }
    
    throw new Error("No method available to fetch client records");
  }
  
  // Process data using the original functions if available
  processData(years, recordsPeer, recordsClient) {
    if (typeof processApiCalls === 'function') {
      processApiCalls(years, recordsPeer, recordsClient);
    } else {
      console.error("processApiCalls function not found");
      throw new Error("Data processing function not available");
    }
  }
  
  // Display charts
  displayCharts() {
    if (typeof displayGeneralComponent === 'function' &&
        typeof displayCashComponent === 'function' &&
        typeof displayIncomeComponent === 'function' &&
        typeof displayExpenseComponent === 'function') {
      
      displayGeneralComponent();
      displayCashComponent();
      displayIncomeComponent();
      displayExpenseComponent();
      
      if (typeof displayReportComponent === 'function') {
        displayReportComponent();
      }
      
    } else if (window.displayComponents && typeof displayComponents.displayAllComponents === 'function') {
      displayComponents.displayAllComponents();
    } else {
      console.error("Chart display functions not found");
    }
  }
  
  // Helper methods
  getRegionQuery(selectedRegions) {
    const regionConditions = Array.from(selectedRegions)
      .map((region) => `{122.EX.${region}}`)
      .join(" OR ");
    return regionConditions ? `(${regionConditions})` : '({122.EX.""})'; // Default empty condition
  }

  getTypeQuery(selectedTypes) {
    const typeConditions = Array.from(selectedTypes)
      .map((type) => `{334.EX.${type}}`)
      .join(" OR ");
    return typeConditions ? `(${typeConditions})` : '({334.EX.""})'; // Default empty condition
  }
}

// Create a singleton instance
window.systemConnector = new SystemConnector();