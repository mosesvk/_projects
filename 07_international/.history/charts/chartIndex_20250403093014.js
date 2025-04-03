// chartIndex.js
// Main entry point for the chart system
// This file orchestrates chart creation and display

/**
 * Initialize system when DOM is ready
 * 
 * This ensures all DOM elements are available before attaching event listeners
 * and initializing chart-related functionality.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Register global event listeners for charts
  registerChartSystemEvents();
});

/**
 * Register core chart system event listeners
 * 
 * This function centralizes all event listeners for the chart system,
 * avoiding duplicate listeners for the same elements.
 */
function registerChartSystemEvents() {
  // Dark mode toggle event listener
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      // Dispatch dark-mode event for charts to respond to
      const darkModeEvent = new Event('dark-mode');
      document.dispatchEvent(darkModeEvent);
    });
  }
  
  // Only attach chart-specific events - the run button is handled by AppController
  // console.log('Chart system events registered');
}

/**
 * Initialize chart display with fresh data
 * 
 * This function prepares and renders all charts based on the
 * parsed data from localStorage. It can be called directly or 
 * by the AppController after data is refreshed.
 */
function initializeChartDisplay() {
  console.log("Initialize chart initialization called");

  try {
    // Clear any existing charts to prevent duplicates or stale data
    if (chartManager && chartManager.destroyAllCharts) {
      chartManager.destroyAllCharts();
    }
    
    // Display all chart components using the display components module
    if (displayComponents && displayComponents.displayAllComponents) {
      displayComponents.displayAllComponents();
    }
    
    // Update global chart references for backward compatibility
    updateGlobalChartReferences();
    
    // console.log('Chart display initialized successfully');
    
    // Dispatch event that charts are rendered (other components may listen for this)
    document.dispatchEvent(new Event('chartsRendered'));
  } catch (error) {
    console.error('Error initializing chart display:', error);
  }
}

/**
 * Update global chart references to maintain compatibility
 * 
 * This ensures that legacy code can still access chart instances through
 * global variables like daysCashOnHand_chart, etc.
 */
function updateGlobalChartReferences() {
  const chartIds = [
    'daysCashOnHand_chart',
    'daysExpensesInUnrestrictedNA_chart',
    'daysExpensesInUnrestrictedNA_excludingPPE_chart',
    'liquidityAssetsAvailableCover_chart',
    'totalCoverageRatio_chart',
    'assetsWithoutPpeToLiabilitiesWithoutDebt_chart',
    'contributionsTrend_chart',
    'annualizedInvestmentReturn_chart',
    'functionalExpensePercent_program_chart',
    'functionalExpensePercent_administrative_chart',
    'functionalExpensePercent_fundraising_chart',
    'costOfContributionsDetailView_chart',
    'costOfContributions_chart',
    'functionalAllocation_chart',
    'netAssetBreakdown_chart',
    'changeInNetAssets_chart',
    'totalContributions_chart',
    'contributionsWithoutDR_chart',
    'statementCashFlows_chart'
  ];
  
  chartIds.forEach(id => {
    if (chartManager && chartManager.getChart) {
      const chart = chartManager.getChart(id);
      if (chart) {
        window[id] = chart;
      }
    }
  });
}


// Enhanced chart initialization function
function enhancedInitializeChartDisplay() {
  console.log("Enhanced chart initialization called");
  
  try {
    // Clear any existing charts to prevent duplicates or stale data
    if (chartManager && chartManager.destroyAllCharts) {
      console.log("Clearing existing charts");
      chartManager.destroyAllCharts();
    }
    
    // Check if parsed data exists in localStorage
    const hasData = ['generalData', 'cashData', 'assetData', 'incomeData', 'expenseData']
      .every(category => {
        const data = localStorage.getItem(category);
        return data && data !== "{}" && data !== "null";
      });
    
    if (!hasData) {
      console.warn("No data available for charts, cannot initialize");
      return false;
    }
    
    console.log("Displaying all chart components");
    
    // Display all chart components using the display components module
    if (displayComponents && displayComponents.displayAllComponents) {
      displayComponents.displayAllComponents();
    } else {
      // Fallback to individual component display
      console.log("Using individual component display");
      if (typeof displayGeneralComponent === "function") displayGeneralComponent();
      if (typeof displayCashComponent === "function") displayCashComponent();
      if (typeof displayIncomeComponent === "function") displayIncomeComponent();
      if (typeof displayExpenseComponent === "function") displayExpenseComponent();
    }
    
    // Update global chart references for backward compatibility
    if (typeof updateGlobalChartReferences === "function") {
      updateGlobalChartReferences();
    }
    
    console.log("Chart display initialized successfully");
    
    // Dispatch event that charts are rendered (other components may listen for this)
    document.dispatchEvent(new Event('chartsRendered'));
    
    return true;
  } catch (error) {
    console.error("Error initializing chart display:", error);
    return false;
  }
}

// Override the original window.initializeChartDisplay function
window.initializeChartDisplay = enhancedInitializeChartDisplay;

// Add a data processing listener to trigger chart rendering when data is loaded
document.addEventListener('dataProcessingComplete', function() {
  console.log("Data processing complete event received - initializing charts");
  setTimeout(() => {
    enhancedInitializeChartDisplay();
  }, 300); // Small delay to ensure data is fully processed
});

// Add a fix for the SystemConnector's data processing
if (window.systemConnector) {
  const originalHandleRunButtonClick = SystemConnector.prototype.handleRunButtonClick;
  
  SystemConnector.prototype.handleRunButtonClick = async function() {
    console.log("Enhanced run button handler in SystemConnector");
    
    try {
      // Call original method
      await originalHandleRunButtonClick.call(this);
      
      // Ensure chart initialization happens after data processing
      console.log("Checking for chart display after data processing");
      
      setTimeout(() => {
        // Force chart display initialization
        enhancedInitializeChartDisplay();
      }, 1000);
    } catch (error) {
      console.error("Error in enhanced run button handler:", error);
    }
  };
}

// Export chart-related functions for global use
window.chartSystem = {
  displayComponents,
  chartManager,
  chartConfigFactory,
  initializeChartDisplay,
  updateGlobalChartReferences
};

// Make key functions available globally for backward compatibility
window.initializeChartDisplay = initializeChartDisplay;
window.registerChartEventListeners = registerChartSystemEvents;