/**
 * QuickBase Report Integration
 * Focused on ensuring XML data contains all client and peer data with correct field IDs
 */
const QuickBaseReportIntegration = (() => {
  // Track XML data building state
  let xmlDataBuilding = false;
  let fieldDataMap = new Map();
  
  /**
   * Initialize the QuickBase integration
   */
  function initialize() {
    // Find the report button
    const generateReportsBtn = document.getElementById('generateReports');
    
    if (generateReportsBtn) {
      // Replace button to remove existing listeners
      const newButton = generateReportsBtn.cloneNode(true);
      generateReportsBtn.parentNode.replaceChild(newButton, generateReportsBtn);
      
      // Add our handler
      newButton.addEventListener('click', handleGenerateReportClick);
    }
    
    // Add report link event handler if not already handled
    const reportLink = document.getElementById('reportLink');
    if (reportLink) {
      reportLink.addEventListener('click', function(e) {
        // Don't interrupt if there's another handler
        if (e.defaultPrevented) return;
        
        // Show the report tab
        showReportsTab();
        
        // Check if data is ready
        if (!isDataReady()) {
          console.warn("No data loaded yet. Run the query first.");
          if (typeof createToastWarning === 'function') {
            createToastWarning("Please select years and run the query to load data first.");
          }
          return;
        }
        
        // Generate report
        generateReport();
      });
    }
  }
  
  /**
   * Check if data is ready
   * @returns {boolean} True if data is ready
   */
  function isDataReady() {
    return localStorage.getItem('generalData') !== null;
  }
  
  /**
   * Show the reports tab
   */
  function showReportsTab() {
    // Hide all content tabs
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.add("hidden");
    });

    // Show the reports tab
    const reportsTab = document.getElementById("reportsContent");
    if (reportsTab) {
      reportsTab.classList.remove("hidden");
    }

    // Update active state on sidebar links
    document.querySelectorAll("#sidebar button").forEach((button) => {
      button.classList.remove("active", "bg-gray-300", "dark:bg-gray-700");
    });

    // Set the reports link as active
    const reportsLink = document.getElementById("reportLink");
    if (reportsLink) {
      reportsLink.classList.add("active", "bg-gray-300", "dark:bg-gray-700");
    }
  }
  
  /**
   * Generate report without automatic triggering
   */
  function generateReport() {
    console.log("Generating report...");
    
    // Use the existing displayReportComponent function
    if (typeof window.displayReportComponent === 'function') {
      try {
        window.displayReportComponent();
        console.log("Report generated successfully");
      } catch (error) {
        console.error("Error generating report:", error);
        if (typeof createToastWarning === 'function') {
          createToastWarning("Error generating report: " + error.message);
        }
      }
    } else {
      console.error("Display report component function not available");
    }
  }
  
  /**
   * Handle click on generate reports button
   * @param {Event} event - Click event
   */
  function handleGenerateReportClick(event) {
    const button = event.target.closest('button');
    if (!button) return;
    
    // Show loading state if we have the function
    if (typeof toggleButtonLoadingState === 'function') {
      toggleButtonLoadingState(button);
    } else {
      // Basic fallback
      button.disabled = true;
      button.textContent = 'Generating...';
    }
    
    // Make sure data is available
    if (!isDataReady()) {
      console.error("No data available for Excel report");
      if (typeof createToastWarning === 'function') {
        createToastWarning("No data available. Please select years and run the report first.");
      }
      
      // Restore button state
      if (typeof toggleButtonNormalState === 'function') {
        toggleButtonNormalState(button);
      } else {
        button.disabled = false;
        button.textContent = 'Generate Reports';
      }
      
      return;
    }
    
    // Generate Excel report with delay to ensure UI updates
    setTimeout(() => {
      if (typeof window.createPrintExcel === 'function') {
        // Make sure we prepare all XML data before sending
        prepareAllFieldData();
        
        window.createPrintExcel()
          .then(result => {
            console.log("QuickBase report generated:", result);
            
            // Restore button state
            if (typeof toggleButtonNormalState === 'function') {
              toggleButtonNormalState(button);
            } else {
              button.disabled = false;
              button.textContent = 'Generate Reports';
            }
          })
          .catch(error => {
            console.error("Error generating QuickBase report:", error);
            if (typeof createToastWarning === 'function') {
              createToastWarning("Error generating Excel report: " + error.message);
            }
            
            // Restore button state
            if (typeof toggleButtonNormalState === 'function') {
              toggleButtonNormalState(button);
            } else {
              button.disabled = false;
              button.textContent = 'Generate Reports';
            }
          });
      } else {
        console.error("Excel report generator not available");
        if (typeof createToastWarning === 'function') {
          createToastWarning("Excel report generator not available");
        }
        
        // Restore button state
        if (typeof toggleButtonNormalState === 'function') {
          toggleButtonNormalState(button);
        } else {
          button.disabled = false;
          button.textContent = 'Generate Reports';
        }
      }
    }, 300);
  }
  
  /**
   * Prepare all field data for QuickBase export
   * This ensures all metrics are included in the XML payload
   */
  function prepareAllFieldData() {
    if (xmlDataBuilding) return;
    xmlDataBuilding = true;
    
    console.log("Preparing all field data for QuickBase export");
    
    try {
      // Get all data from localStorage
      const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
      const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
      const assetData = JSON.parse(localStorage.getItem("assetData") || "{}");
      const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
      const expenseData = JSON.parse(localStorage.getItem("expenseData") || "{}");
      const miscData = JSON.parse(localStorage.getItem("miscData") || "{}");
      
      // Define the field ID mappings
      // Format: [metricName, dataType, decimals, weightedAvg, null, fieldIds, begin, end]
      const fieldMappings = [
        // General data
        ["itExpenses", "dollar", 0, null, null, [6, 44, 82, 120], "begin", null],
        
        // Cash data
        ["daysCashOnHand", "num", 0, "wa", null, [7, 45, 83, 121], null, null],
        ["daysExpensesInUnrestrictedNA", "num", 0, "wa", null, [8, 46, 84, 122], null, null],
        ["daysExpensesInUnrestrictedNA_excludingPPE", "num", 0, "wa", null, [9, 47, 85, 123], null, null],
        ["daysExpensesInNAwithDR", "num", 0, "wa", null, [10, 48, 86, 124], null, null],
        ["daysExpensesInNAwithDR_excludingPPE", "num", 0, "wa", null, [11, 49, 87, 125], null, null],
        ["liquidityFundsAvailable", "num", 1, "wa", null, [12, 50, 88, 126], null, null],
        ["financialAssetsAvailableFY", "dollar", 2, "wa", null, [13, 51, 89, 127], null, null],
        ["daysFinancialAssetsOnHand", "num", 0, "wa", null, [14, 52, 90, 128], null, null],
        ["currentRatio", "num", 1, "wa", null, [15, 53, 91, 129], null, null],
        ["totalCoverageRatio", "num", 1, "wa", null, [16, 54, 92, 130], null, null],
        ["cashFlowsTrendFinancing", "dollar", 0, null, null, [17, 55, 93, 131], null, null],
        ["cashFlowsTrendInvesting", "dollar", 0, null, null, [18, 56, 94, 132], null, null],
        ["cashFlowsTrendOperating", "dollar", 0, null, null, [19, 57, 95, 133], null, null],
        
        // Asset data
        ["percentWithDR", "percent", 0, "wa", null, [20, 58, 96, 134], null, null],
        ["percentWithoutDR_excludingPPE", "percent", 0, "wa", null, [21, 59, 97, 135], null, null],
        ["percentWithoutDR", "percent", 0, "wa", null, [22, 60, 98, 136], null, null],
        
        // Income data
        ["netIncomeRatio", "num", 2, "wa", null, [23, 61, 99, 137], null, null],
        ["contributionsTrend_basedOnNumberOfDonors", "percent", 0, "wa", null, [24, 62, 100, 138], null, null],
        ["contributionsTrend", "percent", 0, null, null, [25, 63, 101, 139], null, null],
        ["contributionsPercentWithoutDR", "percent", 0, "wa", null, [26, 64, 102, 140], null, null],
        ["contributionsPercentWithDR", "percent", 0, "wa", null, [27, 65, 103, 141], null, null],
        ["contributionsPerGivingUnit", "dollar", 0, "wa", null, [28, 66, 104, 142], null, null],
        ["contributionsPerMissionaryUnit", "dollar", 0, "wa", null, [29, 67, 105, 143], null, null],
        ["contributionsPerFullTimeEquivalent", "dollar", 0, "wa", null, [30, 68, 106, 144], null, null],
        ["fundraisingAsPercentOfContributions", "percent", 1, "wa", null, [31, 69, 107, 145], null, null],
        ["annualizedInvestmentReturn", "percent", 0, null, null, [32, 70, 108, 146], null, null],
        
        // Expense data
        ["functionalExpensePercent_program", "percent", 0, "wa", null, [33, 71, 109, 147], null, null],
        ["functionalExpensePercent_administrative", "percent", 0, "wa", null, [34, 72, 110, 148], null, null],
        ["functionalExpensePercent_fundraising", "percent", 0, "wa", null, [35, 73, 111, 149], null, null],
        ["costOfContributions", "dollar", 2, "wa", null, [37, 75, 113, 151], null, null],
        ["expensesPerGivingUnit", "dollar", 0, "wa", null, [38, 76, 114, 152], null, null],
        ["expensesPerMissionaryUnit", "dollar", 0, "wa", null, [39, 77, 115, 153], null, null],
        ["expensesPerFullTimeEquivalent", "dollar", 0, "wa", null, [40, 78, 116, 154], null, null],
        ["salariesAndBenefitsAsPercentOfTotalExpenses", "percent", 0, "wa", null, [41, 79, 117, 155], null, null],
        ["salariesAndBenefitsPerFTE", "dollar", 0, "wa", null, [42, 80, 118, 156], null, null],
        
        // Misc data
        ["percentageAssessmentOnRestrictedGifts", "percent", 0, "wa", null, [43, 81, 119, 157], null, "end"]
      ];
      
      // Process each mapping
      fieldMappings.forEach(mapping => {
        const [metricName, dataType, decimals, weightedAvg, callback, fieldIds, begin, end] = mapping;
        
        // Skip if no field IDs (can't upload to QuickBase without them)
        if (!fieldIds) return;
        
        // Determine which dataset contains this metric
        let dataObject = null;
        let peerData = null;
        let clientData = null;
        
        // Check each data object for this metric
        if (generalData[`${metricName}_Peer`]) {
          dataObject = generalData;
        } else if (cashData[`${metricName}_Peer`]) {
          dataObject = cashData;
        } else if (assetData[`${metricName}_Peer`]) {
          dataObject = assetData;
        } else if (incomeData[`${metricName}_Peer`]) {
          dataObject = incomeData;
        } else if (expenseData[`${metricName}_Peer`]) {
          dataObject = expenseData;
        } else if (miscData[`${metricName}_Peer`]) {
          dataObject = miscData;
        }
        
        // Skip if data not found
        if (!dataObject) {
          console.warn(`No data found for metric: ${metricName}`);
          return;
        }
        
        // Get peer and client data
        peerData = dataObject[`${metricName}_Peer`];
        clientData = dataObject[`${metricName}_Client`];
        
        // Calculate statistics for QuickBase
        let avg = 0, median = 0, q1 = 0, q3 = 0;
        
        // Calculate weighted average if requested
        if (weightedAvg === "wa" && typeof getWeightedAverageOfArray === "function") {
          try {
            avg = getWeightedAverageOfArray(dataObject, metricName, null);
          } catch (error) {
            console.error(`Error calculating weighted average for ${metricName}:`, error);
            // Fall back to regular average
            if (peerData["total"] && Array.isArray(peerData["total"])) {
              avg = getAverageOfArray(peerData["total"], metricName) || 0;
            }
          }
        } else if (peerData["total"] && Array.isArray(peerData["total"])) {
          // Use regular average if not using weighted average
          avg = getAverageOfArray(peerData["total"], metricName) || 0;
        }
        
        // Calculate percentiles
        if (peerData["total"] && Array.isArray(peerData["total"])) {
          if (typeof calculatePercentiles === "function") {
            try {
              [q1, median, q3] = calculatePercentiles(
                peerData["total"],
                dataType,
                decimals
              );
            } catch (error) {
              console.warn(`Error calculating percentiles for ${metricName}:`, error);
              // Fallback calculation
              q1 = get25thPercentileOfArray(peerData["total"], metricName) || 0;
              median = getMidpointOfArray(peerData["total"], metricName) || 0;
              q3 = get75thPercentileOfArray(peerData["total"], metricName) || 0;
            }
          } else {
            // Fallback without calculatePercentiles function
            q1 = get25thPercentileOfArray(peerData["total"], metricName) || 0;
            median = getMidpointOfArray(peerData["total"], metricName) || 0;
            q3 = get75thPercentileOfArray(peerData["total"], metricName) || 0;
          }
        }
        
        // Store data for use in field printing
        fieldDataMap.set(metricName, {
          avg,
          median,
          q1,
          q3,
          fieldIds,
          begin,
          end,
          peerData,
          clientData,
          dataObject
        });
        
        // Send data to QuickBase
        if (typeof window.createFileForPrint === 'function') {
          window.createFileForPrint(
            metricName,
            fieldIds,
            begin === "begin",
            end === "end",
            avg,
            median,
            q1,
            q3,
            peerData,
            dataObject
          );
        }
      });
      
      xmlDataBuilding = false;
      console.log("All field data prepared for QuickBase export");
    } catch (error) {
      console.error("Error preparing field data:", error);
      xmlDataBuilding = false;
    }
  }
  
  /**
   * Override the default createFileForPrint to ensure data is captured correctly
   */
  function enhanceCreateFileForPrint() {
    // Store the original function
    const originalCreateFileForPrint = window.createFileForPrint;
    
    // Replace with enhanced version
    window.createFileForPrint = function(name, fIdArray, begin, end, avg, mid, min, max, peer, data) {
      console.log(`Creating file for print: ${name}`);
      
      // Always make sure values are numbers
      avg = typeof avg === 'number' ? avg : parseFloat(avg) || 0;
      mid = typeof mid === 'number' ? mid : parseFloat(mid) || 0;
      min = typeof min === 'number' ? min : parseFloat(min) || 0;
      max = typeof max === 'number' ? max : parseFloat(max) || 0;
      
      // Store the values for debugging
      fieldDataMap.set(name, {
        avg,
        mid,
        min,
        max,
        fIdArray,
        begin,
        end
      });
      
      // Call the original function
      if (typeof originalCreateFileForPrint === 'function') {
        return originalCreateFileForPrint(name, fIdArray, begin, end, avg, mid, min, max, peer, data);
      }
    };
  }
  
  // Return the public API
  return {
    initialize,
    prepareAllFieldData,
    enhanceCreateFileForPrint,
    getFieldDataMap: () => fieldDataMap
  };
})();

// Initialize the component
document.addEventListener("DOMContentLoaded", () => {
  QuickBaseReportIntegration.initialize();
  QuickBaseReportIntegration.enhanceCreateFileForPrint();
  
  // Make available globally
  window.QuickBaseReportIntegration = QuickBaseReportIntegration;
});