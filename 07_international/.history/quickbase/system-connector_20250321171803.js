// system-connector.js - Updated to work with existing qbApi.js and chart components
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
    
    // Ensure required global functions exist
    this.checkRequiredFunctions();
    
    this.initialized = true;
    console.log('System Connector initialized');
  }
  
  // Check and create any required global functions that might be missing
  checkRequiredFunctions() {
    // Check if getPeerAndClientChartDataArrays exists
    if (typeof window.getPeerAndClientChartDataArrays !== 'function') {
      console.warn('getPeerAndClientChartDataArrays function not found - creating fallback');
      
      // Create a fallback implementation if it doesn't exist
      window.getPeerAndClientChartDataArrays = function(
        years,
        dataPeer,
        dataClient,
        fixedNum,
        mainName,
        numType,
        wa
      ) {
        const peerAvg = [];
        const peerMid = [];
        const peer25 = [];
        const peer75 = [];
        const clientArray = [];
        
        // Simplified implementation - see chart-utility.js for full version
        years.forEach((year) => {
          if (dataPeer && dataClient) {
            const dataArray = dataPeer[year] || [];
            const array = dataArray.map((item) => Number(item || 0));
            
            let avg = array.length ? array.reduce((sum, val) => sum + val, 0) / array.length : 0;
            let clientNum = dataClient[year]?.value ? Number(dataClient[year].value) : 0;
            
            if (numType === "percent") {
              avg *= 100;
              clientNum *= 100;
            }
            
            peerAvg.push(avg);
            peerMid.push(avg); // Simplified
            peer25.push(avg * 0.75); // Simplified
            peer75.push(avg * 1.25); // Simplified
            clientArray.push(clientNum);
          } else {
            peerAvg.push(0);
            peerMid.push(0);
            peer25.push(0);
            peer75.push(0);
            clientArray.push(0);
          }
        });
        
        return { clientArray, peerAvg, peerMid, peer25, peer75 };
      };
    }
    
    // Check if getSeriesData exists
    if (typeof window.getSeriesData !== 'function') {
      console.warn('getSeriesData function not found - creating fallback');
      
      // Create a fallback implementation if it doesn't exist
      window.getSeriesData = function(years, operatingData, investingData, financingData, totalData) {
        const operatingValues = [];
        const investingValues = [];
        const financingValues = [];
        const totalValues = [];
        
        years.forEach(year => {
          operatingValues.push(operatingData && operatingData[year] ? Number(operatingData[year].value) : 0);
          investingValues.push(investingData && investingData[year] ? Number(investingData[year].value) : 0);
          financingValues.push(financingData && financingData[year] ? Number(financingData[year].value) : 0);
          totalValues.push(totalData && totalData[year] ? Number(totalData[year].value) : 0);
        });
        
        return [
          { name: 'Operating', data: operatingValues },
          { name: 'Investing', data: investingValues },
          { name: 'Financing', data: financingValues },
          { name: 'Total', data: totalValues }
        ];
      };
    }
  }
  
  async handleRunButtonClick() {
    // Prevent multiple simultaneous requests
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      
      // Make sure required functions exist
      this.checkRequiredFunctions();
      
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
      
      // Clear existing charts
      if (window.chartManager && typeof chartManager.destroyAllCharts === 'function') {
        chartManager.destroyAllCharts();
      }
      
      // Use existing ApiService if available, or try to create a new one
      const apiService = window.apiService || (window.ApiService ? new ApiService() : null);
      
      if (!apiService) {
        throw new Error("ApiService not available");
      }
      
      // Clear any existing record data
      apiService.clearRecords();
      
      // Fetch data from API
      const recordsPeer = await apiService.getRecordsForPeer(selectedYears);
      if (typeof countUniqueClients === 'function') {
        countUniqueClients(recordsPeer);
      }
      
      const recordsClient = await apiService.getRecordsForClient(selectedYears);
      
      // Process data using the processApiCalls function
      if (typeof window.processApiCalls !== 'function') {
        throw new Error("processApiCalls function not available");
      }
      
      window.processApiCalls(selectedYears, recordsPeer, recordsClient);
      
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
        createToastWarning('Error processing data: ' + error.message);
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
  
  // Display charts
  displayCharts() {
    try {
      // First try to use the displayComponents from chartDisplayComponents.js
      if (window.displayComponents && typeof displayComponents.displayAllComponents === 'function') {
        displayComponents.displayAllComponents();
      } 
      // Then try the individual display functions from your utility.js
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
      } else {
        console.error("Chart display functions not found");
      }
    } catch (error) {
      console.error("Error displaying charts:", error);
      if (typeof createToastWarning === 'function') {
        createToastWarning("Error displaying charts: " + error.message);
      }
    }
  }
}

// Create a singleton instance
window.systemConnector = new SystemConnector();