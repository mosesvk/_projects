// chartIndex.js
// Main entry point for the chart system

// Import dependencies
// Note: These would typically be handled with import statements,
// but in a browser environment without a bundler, these are likely
// already included via script tags

// Initialize system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Register global event listeners
    registerChartEventListeners();
  });
  
  // Initialize chart data display when user clicks run
  function initializeChartDisplay() {
    try {
      // Clear any existing charts
      chartManager.destroyAllCharts();
      
      // Display all chart components
      displayComponents.displayAllComponents();
      
      console.log('Chart display initialized successfully');
    } catch (error) {
      console.error('Error initializing chart display:', error);
    }
  }
  
  // Register event listeners for chart interactions
  function registerChartEventListeners() {
    // Run button event listener
    const runButton = document.querySelector('#run');
    if (runButton) {
      runButton.addEventListener('click', async () => {
        try {
          // Show loading indicator
          if (typeof showApiLoadingFunction === 'function') {
            showApiLoadingFunction('open', 'api');
          }
          
          // Process the selected years
          const selectedYears = processSelectedYears();
          saveSelectedYearsToLocalStorage(selectedYears);
          
          // Get records for peer and client
          const recordsPeer = await getRecordsForPeer(selectedYears, "<qdbapi>");
          countUniqueClients(recordsPeer);
          
          const recordsClient = await getRecordsForClient(selectedYears, "<qdbapi>");
          
          // Process API calls
          processApiCalls(selectedYears, recordsPeer, recordsClient);
          
          // Initialize chart display
          initializeChartDisplay();
          
          // Hide loading indicator
          if (typeof showApiLoadingFunction === 'function') {
            showApiLoadingFunction('close');
          }
        } catch (err) {
          console.error('Error processing data:', err);
          
          // Hide loading indicator even on error
          if (typeof showApiLoadingFunction === 'function') {
            showApiLoadingFunction('close');
          }
        }
      });
    }
    
    // Dark mode toggle event handler
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        // This will trigger our chart theme updates via the 'dark-mode' event
        const darkModeEvent = new Event('dark-mode');
        document.dispatchEvent(darkModeEvent);
      });
    }
  }
  
  // Export chart-related functions for global use
  window.chartSystem = {
    displayComponents,
    chartManager,
    chartConfigFactory,
    initializeChartDisplay
  };