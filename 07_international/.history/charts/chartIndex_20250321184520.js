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
  console.log('Chart system events registered');
}

/**
 * Initialize chart display with fresh data
 * 
 * This function prepares and renders all charts based on the
 * parsed data from localStorage. It can be called directly or 
 * by the AppController after data is refreshed.
 */
function initializeChartDisplay() {
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
    
    console.log('Chart display initialized successfully');
    
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