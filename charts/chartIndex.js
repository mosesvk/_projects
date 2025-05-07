// chartIndex.js
// Main entry point for the chart system
// This file orchestrates chart creation and display

/**
 * Initialize system when DOM is ready
 *
 * This ensures all DOM elements are available before attaching event listeners
 * and initializing chart-related functionality.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Register global event listeners for charts
  registerChartSystemEvents();
  
  // Ensure required utility functions are available
  ensureRequiredUtilitiesExist();
});

/**
 * Ensure all required utility functions exist with fallbacks if needed
 */
function ensureRequiredUtilitiesExist() {
  // Ensure getSelectedYearsFromLocalStorage exists
  if (typeof window.getSelectedYearsFromLocalStorage !== 'function') {
    console.warn('getSelectedYearsFromLocalStorage is not defined, creating fallback');
    window.getSelectedYearsFromLocalStorage = function() {
      try {
        // Try to get from localStorage
        const yearsString = localStorage.getItem('selectedYears');
        if (yearsString) {
          const years = JSON.parse(yearsString);
          if (Array.isArray(years) && years.length > 0) {
            return years;
          }
        }
        
        // If not in localStorage, try to get from any existing charts data
        if (typeof chartManager !== 'undefined' && chartManager.charts) {
          // Extract years from first chart with categories
          for (const chartId in chartManager.charts) {
            const chart = chartManager.charts[chartId];
            if (chart && chart.config && chart.config.xaxis && chart.config.xaxis.categories) {
              return chart.config.xaxis.categories;
            }
          }
        }
        
        // Default to last 4 years
        const currentYear = new Date().getFullYear();
        return [
          (currentYear - 3).toString(),
          (currentYear - 2).toString(),
          (currentYear - 1).toString(),
          currentYear.toString()
        ];
      } catch (error) {
        console.error('Error in getSelectedYearsFromLocalStorage fallback:', error);
        // Ultimate fallback
        return ['2021', '2022', '2023', '2024'];
      }
    };
  }
  
  // Ensure firmName is defined
  if (typeof window.firmName === 'undefined') {
    window.firmName = "Client";
  }
  
  // Ensure styleNumber is defined
  if (typeof window.styleNumber !== 'function') {
    window.styleNumber = function(value, type, decimals = 2) {
      if (!value && value !== 0) return "";
      try {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return "";
        
        if (type === 'dollar') return '$' + numValue.toFixed(decimals);
        if (type === 'percent') return numValue.toFixed(decimals) + '%';
        return numValue.toFixed(decimals);
      } catch (e) {
        return value.toString();
      }
    };
  }
  
  console.log("Utility functions verified and available");
}

/**
 * Register core chart system event listeners
 *
 * This function centralizes all event listeners for the chart system,
 * avoiding duplicate listeners for the same elements.
 */
function registerChartSystemEvents() {
  // Dark mode toggle event listener
  const darkModeToggle = document.querySelector("#dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      // Dispatch dark-mode event for charts to respond to
      const darkModeEvent = new Event("dark-mode");
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
  console.log("Chart initialization called");

  try {
    // Clear any existing charts to prevent duplicates or stale data
    if (chartManager && chartManager.destroyAllCharts) {
      console.log("Clearing existing charts");
      chartManager.destroyAllCharts();
    }

    // Check if parsed data exists in localStorage
    const hasData = [
      "cfiData",
      "doeData",
      "financialAnalysisData",
      "financialPositionData",
      "financialStatementData",
      "revenueExpenseData",
      "debtEndowmentData"
    ].every((category) => {
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
      if (typeof displayCfiComponent === "function") displayCfiComponent();
      if (typeof displayDoeComponent === "function") displayDoeComponent();
      if (typeof displayFinancialAnalysisComponent === "function")
        displayFinancialAnalysisComponent();
      if (typeof displayFinancialPositionComponent === "function")
        displayFinancialPositionComponent();
      if (typeof displayFinancialStatementComponent === "function")
        displayFinancialStatementComponent();
      if (typeof displayRevenueExpenseComponent === "function")
        displayRevenueExpenseComponent();
      if (typeof displayDebtEndowmentComponent === "function")
        displayDebtEndowmentComponent();
    }

    // Update global chart references for backward compatibility
    updateGlobalChartReferences();

    console.log("Chart display initialized successfully");

    // Dispatch event that charts are rendered (other components may listen for this)
    document.dispatchEvent(new Event("chartsRendered"));

    return true;
  } catch (error) {
    console.error("Error initializing chart display:", error);
    return false;
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
    "cfiRatio_chart",
    // "cfi_primaryReserveRatio_chart",
    // "cfi_netIncomeOperationsRatio_chart",
    // "cfi_returnOnNetAssets_chart",
    // "cfi_viabilityRatio_chart",
    // "doeOverall_chart",
    // "assets_chart",
    // "liabilities_chart",
    // "netAssets_chart",
    // "revenueAndSupport_chart",
    // "educationalProgramExpenses_chart",
    // "nonOperatingActivities_chart",
    // "changesInNetAssetsWithDR_chart",
    // "naturalExpenseCategories_chart",
    // "cashFlowsInvestingActivities_chart",
    // "cashFlowsFinancingActivities_chart",
    // "cashFlowsOperatingActivities_chart",
    // "propertyAndEquipment_chart",
    // "FinancialPosition_chart",
    // "assetToLiabilities_chart",
    // "currentRatio_chart",
    // "liquidityRatio_chart",
    // "cashFlowTrend_chart",
    // "ffa_chart",
    // "sourcesOfIncomeClient_chart",
    // "sourcesOfIncomePeer_chart",
    // "salariesBenefitsToTotalExpenses_chart",
    // "averageEmployeeSalary_chart",
    // "salariesBenefitsPerNetTuition_chart",
    // "adminCostsPerStudent_chart",
    // "avgScoresUsMap_chart",
    // "netEducationalExpensePerStudent_chart",
    // "annualTraditionalNetTuitionPerStudent_chart",
    // "tuitionDependency_chart",
    // "tuitionDiscountRate_chart",
    // "ltDebtPerTotalOperatingRevenue_chart",
    // "debtServiceCoverageRatio_chart",
    // "debtBurdenRatio_chart",
    // "endowmentOperatingBudget_chart",
    // "endowmentOperatingBudgetMAP_chart",
    // "endowmentAssetsPerStudent_chart",
  ];

  chartIds.forEach((id) => {
    if (chartManager && chartManager.getChart) {
      const chart = chartManager.getChart(id);
      if (chart) {
        window[id] = chart;
      }
    }
  });
}

// Listen for chart changes and update modals
function synchronizeChartAndModalData() {
  document.addEventListener("chartOptionsApplied", function (event) {
    // Get details about which chart was updated
    const { chartId, mainName, options } = event.detail;

    // Update the corresponding modal
    if (
      typeof updateModal === "function" &&
      options.dataPeer &&
      options.dataClient
    ) {
      updateModal(
        mainName,
        options.dataPeer,
        options.dataClient,
        options.parsedData
      );
    }
  });
}

// Call this function to start listening
synchronizeChartAndModalData();

// Add a data processing listener to trigger chart rendering when data is loaded
document.addEventListener("dataProcessingComplete", function () {
  console.log("Data processing complete event received - initializing charts");
  setTimeout(() => {
    enhancedInitializeChartDisplay();
  }, 300); // Small delay to ensure data is fully processed
});

// Add a fix for the SystemConnector's data processing
if (window.systemConnector) {
  const originalHandleRunButtonClick =
    SystemConnector.prototype.handleRunButtonClick;

  SystemConnector.prototype.handleRunButtonClick = async function () {
    console.log("Enhanced run button handler in SystemConnector");

    try {
      // Call original method
      await originalHandleRunButtonClick.call(this);

      // Ensure chart initialization happens after data processing
      console.log("Checking for chart display after data processing");

      setTimeout(() => {
        // Force chart display initialization
        initializeChartDisplay();
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
  updateGlobalChartReferences,
};

// Add a utility function to debug and fix the cfiRatio chart
window.debugCfiRatioChart = function() {
  console.log("Debugging CFI Ratio Chart");
  
  try {
    // Check if the chart element exists
    const chartElement = document.getElementById("cfiRatio_chart");
    if (!chartElement) {
      console.error("cfiRatio_chart element does not exist in the DOM");
      return;
    }
    
    console.log("Chart element exists:", chartElement);
    
    // Check if we have necessary data
    const cfiData = localStorage.getItem("cfiData");
    if (!cfiData) {
      console.error("No cfiData found in localStorage");
      
      // Create some sample data
      const sampleData = {
        cfiRatio_Client: {
          "2021": { value: 2.5 },
          "2022": { value: 3.1 },
          "2023": { value: 2.8 },
          "2024": { value: 3.2 }
        },
        cfiRatio_peerAverage_Peer: {
          "2021": [2.1, 2.3, 2.5, 2.7],
          "2022": [2.4, 2.6, 2.8, 3.0],
          "2023": [2.2, 2.4, 2.6, 2.8],
          "2024": [2.5, 2.7, 2.9, 3.1]
        }
      };
      
      localStorage.setItem("cfiData", JSON.stringify(sampleData));
      console.log("Added sample cfiData to localStorage");
    }
    
    // Parse the data
    const parsedData = typeof parseStoredData === 'function' 
      ? parseStoredData(cfiData) 
      : JSON.parse(cfiData);
    
    console.log("CFI Data:", parsedData);
    
    // Ensure chart manager exists
    if (!window.chartManager) {
      console.error("chartManager is not defined");
      if (typeof ChartManager === 'function') {
        window.chartManager = new ChartManager();
        console.log("Created new chart manager instance");
      } else {
        console.error("ChartManager class not found");
        return;
      }
    }
    
    // Clear the element and create chart directly
    chartElement.innerHTML = "";
    console.log("Cleared chart element");
    
    // Create chart
    const chart = window.chartManager.createChartFromParsedData(
      parsedData,
      "cfiRatio_chart",
      "cfiRatio_peerAverage_Peer",
      "cfiRatio_Client",
      "num",
      1,
      "cfiRatio",
      false,
      "CFI Overall Ratio (Debug)",
      "line"
    );
    
    console.log("Chart creation attempted");
    
    if (chart) {
      console.log("Chart created successfully:", chart);
    } else {
      console.warn("Chart creation returned null, trying direct config");
      
      // Try with direct config
      const directConfig = {
        series: [
          {
            name: "Client",
            type: "column",
            data: [2.5, 3.1, 2.8, 3.2]
          },
          {
            name: "Peer Average",
            type: "line",
            data: [2.4, 2.7, 2.5, 2.8]
          }
        ],
        chart: {
          height: 550,
          type: "line",
          toolbar: {
            show: false
          }
        },
        stroke: {
          width: [2, 3]
        },
        title: {
          text: "CFI Overall Ratio (Debug Direct)",
          align: "center"
        },
        xaxis: {
          categories: ["2021", "2022", "2023", "2024"]
        },
        yaxis: {
          min: -4,
          max: 10,
          tickAmount: 7
        },
        annotations: {
          yaxis: [{
            y: -4,
            borderColor: '#ff6384',
            label: {
              text: 'Critical',
              style: {
                color: '#fff',
                background: '#ff6384'
              }
            }
          }, {
            y: 0,
            borderColor: '#EDAB20',
            label: {
              text: 'Caution',
              style: {
                color: '#fff',
                background: '#EDAB20'
              }
            }
          }, {
            y: 3,
            borderColor: '#83b240',
            label: {
              text: 'Good',
              style: {
                color: '#fff',
                background: '#83b240'
              }
            }
          }]
        }
      };
      
      try {
        const directChart = new ApexCharts(chartElement, directConfig);
        directChart.render();
        console.log("Direct chart created");
      } catch (error) {
        console.error("Error creating direct chart:", error);
      }
    }
    
    return "CFI Ratio chart debugging complete";
  } catch (error) {
    console.error("Error in debugCfiRatioChart:", error);
    return `Error: ${error.message}`;
  }
};

// Make key functions available globally for backward compatibility
window.initializeChartDisplay = initializeChartDisplay;
window.registerChartEventListeners = registerChartSystemEvents;
