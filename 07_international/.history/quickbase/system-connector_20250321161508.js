// Enhanced SystemConnector for the International dashboard
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
    
    // Initialize the DataProcessor and DataStore if they don't exist
    if (!window.dataStore) {
      window.dataStore = new DataStore();
    }
    
    if (!window.dataProcessor && window.DataProcessor) {
      window.dataProcessor = new DataProcessor(window.dataStore);
    }
    
    this.initialized = true;
    console.log('System Connector initialized');
  }
  
  async handleRunButtonClick() {
    // Prevent multiple simultaneous requests
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      
      // Update button UI to show loading
      const runButton = document.querySelector('#run');
      if (runButton && typeof toggleButtonLoadingState === 'function') {
        toggleButtonLoadingState(runButton);
      }
      
      // Show loading indicator
      if (typeof showApiLoadingFunction === 'function') {
        showApiLoadingFunction('open', 'api');
      }
      
      // Get selected years
      const selectedYears = this.getSelectedYears();
      this.saveSelectedYearsToLocalStorage(selectedYears);
      
      // Clear existing records and charts
      this.clearExistingData();
      
      // Create ApiService if it doesn't exist
      const apiService = new ApiService();
      
      // Fetch data from API
      const recordsPeer = await apiService.getRecordsForPeer(selectedYears);
      if (typeof countUniqueClients === 'function') {
        countUniqueClients(recordsPeer);
      }
      
      const recordsClient = await apiService.getRecordsForClient(selectedYears);
      
      // Process data 
      const result = this.processData(selectedYears, recordsPeer, recordsClient);
      if (!result) {
        throw new Error("Data processing failed");
      }
      
      // Display charts
      this.displayCharts();
      
      // Update button UI to show normal state
      if (runButton && typeof toggleButtonNormalState === 'function') {
        toggleButtonNormalState(runButton);
      }
      
      // Hide loading indicator
      if (typeof showApiLoadingFunction === 'function') {
        showApiLoadingFunction('close');
      }
      
      console.log('Data processing and chart rendering complete');
    } catch (error) {
      console.error('Error in run button handler:', error);
      
      // Update button UI to show normal state even on error
      const runButton = document.querySelector('#run');
      if (runButton && typeof toggleButtonNormalState === 'function') {
        toggleButtonNormalState(runButton);
      }
      
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
      if (typeof createToastWarning === 'function') {
        createToastWarning("Please select year(s) for data to appear");
      }
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
    
    // Clear data store if it exists
    if (window.dataStore && typeof window.dataStore.clear === 'function') {
      window.dataStore.clear();
    }
  }
  
  // Process data using the appropriate function
  processData(years, recordsPeer, recordsClient) {
    // Check if processApiCalls exists in window scope
    if (typeof window.processApiCalls === 'function') {
      return window.processApiCalls(years, recordsPeer, recordsClient);
    } 
    // Fallback to dataProcessor if it exists
    else if (window.dataProcessor && typeof window.dataProcessor.processAllData === 'function') {
      window.dataProcessor.processAllData(years, recordsPeer, recordsClient);
      return true;
    }
    // Last resort, try to use DataProcessor class directly
    else if (typeof DataProcessor === 'function' && window.dataStore) {
      const processor = new DataProcessor(window.dataStore);
      processor.processAllData(years, recordsPeer, recordsClient);
      return true;
    }
    
    // If we get here, we couldn't find any way to process the data
    console.error("No data processing method found");
    return false;
  }
  
  // Display charts
  displayCharts() {
    // First, try to use chart display functions from chartDisplayComponents.js
    if (window.displayComponents && typeof displayComponents.displayAllComponents === 'function') {
      displayComponents.displayAllComponents();
    } 
    // Then try the individual component display functions
    else if (typeof displayGeneralComponent === 'function' &&
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
    }
    // If direct chartManager access is available
    else if (window.chartManager) {
      console.log("Using chartManager directly to initialize display");
      if (typeof initializeChartDisplay === 'function') {
        initializeChartDisplay();
      }
    } else {
      console.error("No chart display functions found");
    }
  }
}

// Create a singleton instance
window.systemConnector = new SystemConnector();