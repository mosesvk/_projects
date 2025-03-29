/**
 * Report Component - QuickBase Integration Patch
 * 
 * This patch modifies the Report Component to ensure proper integration with QuickBase
 * by focusing on generating the correct XML data string with all client and peer data.
 */
(function() {
    // Store original displayReportComponent function
    const originalDisplayReportComponent = window.displayReportComponent;
    
    // Enhanced version that ensures XML data is prepared
    window.displayReportComponent = function() {
      console.log("Running enhanced displayReportComponent with QuickBase integration");
      
      // Call original function
      if (typeof originalDisplayReportComponent === 'function') {
        originalDisplayReportComponent();
      }
      
      // Ensure QuickBase data is prepared
      prepareQuickBaseData();
      
      // Show the generate reports button
      const generateReportsBtn = document.getElementById('generateReports');
      if (generateReportsBtn) {
        generateReportsBtn.classList.remove('hidden');
      }
    };
    
    /**
     * Prepare all data for QuickBase export
     */
    function prepareQuickBaseData() {
      console.log("Preparing QuickBase data");
      
      // If QuickBaseReportIntegration is available, use it
      if (window.QuickBaseReportIntegration && typeof window.QuickBaseReportIntegration.prepareAllFieldData === 'function') {
        window.QuickBaseReportIntegration.prepareAllFieldData();
        return;
      }
      
      // Otherwise, manually prepare all field data for each category
      const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
      const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
      const assetData = JSON.parse(localStorage.getItem("assetData") || "{}");
      const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
      const expenseData = JSON.parse(localStorage.getItem("expenseData") || "{}");
      const miscData = JSON.parse(localStorage.getItem("miscData") || "{}");
      
      // Define processMetric function to handle each metric
      function processMetric(data, metricName, fieldIds, weightedAvg, begin, end) {
        if (!data || !data[`${metricName}_Peer`]) return;
        
        const peerData = data[`${metricName}_Peer`];
        const clientData = data[`${metricName}_Client`];
        
        // Calculate statistics
        let avg, mid, min, max;
        
        // Use weighted average if requested
        if (weightedAvg === "wa" && typeof getWeightedAverageOfArray === "function") {
          avg = getWeightedAverageOfArray(data, metricName, null);
        } else if (peerData["total"] && Array.isArray(peerData["total"])) {
          avg = getAverageOfArray(peerData["total"], metricName);
        }
        
        // Calculate percentiles
        if (peerData["total"] && Array.isArray(peerData["total"])) {
          mid = getMidpointOfArray(peerData["total"], metricName);
          min = get25thPercentileOfArray(peerData["total"], metricName);
          max = get75thPercentileOfArray(peerData["total"], metricName);
        }
        
        // Send to QuickBase
        if (typeof createFileForPrint === 'function' && fieldIds) {
          createFileForPrint(
            metricName,
            fieldIds,
            begin === "begin",
            end === "end",
            avg,
            mid,
            min,
            max,
            peerData,
            data
          );
        }
      }
      
      // Process each metric for each category
      
      // General data
      processMetric(generalData, "itExpenses", [6, 44, 82, 120], null, "begin", null);
      
      // Cash data
      processMetric(cashData, "daysCashOnHand", [7, 45, 83, 121], "wa", null, null);
      processMetric(cashData, "daysExpensesInUnrestrictedNA", [8, 46, 84, 122], "wa", null, null);
      processMetric(cashData, "daysExpensesInUnrestrictedNA_excludingPPE", [9, 47, 85, 123], "wa", null, null);
      processMetric(cashData, "daysExpensesInNAwithDR", [10, 48, 86, 124], "wa", null, null);
      processMetric(cashData, "daysExpensesInNAwithDR_excludingPPE", [11, 49, 87, 125], "wa", null, null);
      processMetric(cashData, "liquidityFundsAvailable", [12, 50, 88, 126], "wa", null, null);
      processMetric(cashData, "financialAssetsAvailableFY", [13, 51, 89, 127], "wa", null, null);
      processMetric(cashData, "daysFinancialAssetsOnHand", [14, 52, 90, 128], "wa", null, null);
      processMetric(cashData, "currentRatio", [15, 53, 91, 129], "wa", null, null);
      processMetric(cashData, "totalCoverageRatio", [16, 54, 92, 130], "wa", null, null);
      processMetric(cashData, "cashFlowsTrendFinancing", [17, 55, 93, 131], null, null, null);
      processMetric(cashData, "cashFlowsTrendInvesting", [18, 56, 94, 132], null, null, null);
      processMetric(cashData, "cashFlowsTrendOperating", [19, 57, 95, 133], null, null, null);
      
      // Asset data
      processMetric(assetData, "percentWithDR", [20, 58, 96, 134], "wa", null, null);
      processMetric(assetData, "percentWithoutDR_excludingPPE", [21, 59, 97, 135], "wa", null, null);
      processMetric(assetData, "percentWithoutDR", [22, 60, 98, 136], "wa", null, null);
      
      // Income data
      processMetric(incomeData, "netIncomeRatio", [23, 61, 99, 137], "wa", null, null);
      processMetric(incomeData, "contributionsTrend_basedOnNumberOfDonors", [24, 62, 100, 138], "wa", null, null);
      processMetric(incomeData, "contributionsTrend", [25, 63, 101, 139], null, null, null);
      processMetric(incomeData, "contributionsPercentWithoutDR", [26, 64, 102, 140], "wa", null, null);
      processMetric(incomeData, "contributionsPercentWithDR", [27, 65, 103, 141], "wa", null, null);
      processMetric(incomeData, "contributionsPerGivingUnit", [28, 66, 104, 142], "wa", null, null);
      processMetric(incomeData, "contributionsPerMissionaryUnit", [29, 67, 105, 143], "wa", null, null);
      processMetric(incomeData, "contributionsPerFullTimeEquivalent", [30, 68, 106, 144], "wa", null, null);
      processMetric(incomeData, "fundraisingAsPercentOfContributions", [31, 69, 107, 145], "wa", null, null);
      processMetric(incomeData, "annualizedInvestmentReturn", [32, 70, 108, 146], null, null, null);
      
      // Expense data
      processMetric(expenseData, "functionalExpensePercent_program", [33, 71, 109, 147], "wa", null, null);
      processMetric(expenseData, "functionalExpensePercent_administrative", [34, 72, 110, 148], "wa", null, null);
      processMetric(expenseData, "functionalExpensePercent_fundraising", [35, 73, 111, 149], "wa", null, null);
      processMetric(expenseData, "costOfContributions", [37, 75, 113, 151], "wa", null, null);
      processMetric(expenseData, "expensesPerGivingUnit", [38, 76, 114, 152], "wa", null, null);
      processMetric(expenseData, "expensesPerMissionaryUnit", [39, 77, 115, 153], "wa", null, null);
      processMetric(expenseData, "expensesPerFullTimeEquivalent", [40, 78, 116, 154], "wa", null, null);
      processMetric(expenseData, "salariesAndBenefitsAsPercentOfTotalExpenses", [41, 79, 117, 155], "wa", null, null);
      processMetric(expenseData, "salariesAndBenefitsPerFTE", [42, 80, 118, 156], "wa", null, null);
      
      // Misc data
      processMetric(miscData, "percentageAssessmentOnRestrictedGifts", [43, 81, 119, 157], "wa", null, "end");
    }
    
    // Enhance createPrintExcel function if it exists
    if (typeof window.createPrintExcel === 'function') {
      const originalCreatePrintExcel = window.createPrintExcel;
      
      window.createPrintExcel = function() {
        console.log("Running enhanced createPrintExcel");
        
        // Ensure data is prepared before generating Excel
        prepareQuickBaseData();
        
        // Call original function
        return originalCreatePrintExcel();
      };
    }
    
    // Fix event listeners for Report tab
    document.addEventListener("DOMContentLoaded", function() {
      // Modify the report link behavior
      const reportLink = document.getElementById("reportLink");
      if (reportLink) {
        reportLink.addEventListener("click", function(event) {
          // Don't run if event was already handled
          if (event.defaultPrevented) return;
          
          // Show the reports tab
          const reportsTab = document.getElementById("reportsContent");
          if (reportsTab) {
            // Hide all content tabs
            document.querySelectorAll(".tab-content").forEach((tab) => {
              tab.classList.add("hidden");
            });
            
            // Show reports tab
            reportsTab.classList.remove("hidden");
          }
          
          // Set active state
          document.querySelectorAll("#sidebar button").forEach((button) => {
            button.classList.remove("active", "bg-gray-300", "dark:bg-gray-700");
          });
          
          // Set report link as active
          reportLink.classList.add("active", "bg-gray-300", "dark:bg-gray-700");
          
          // Check if data is available
          if (!localStorage.getItem("generalData")) {
            console.warn("No data available for report generation");
            if (typeof createToastWarning === 'function') {
              createToastWarning("Please select years and run the report first.");
            }
            return;
          }
          
          // Generate report after data is verified
          if (typeof window.displayReportComponent === 'function') {
            window.displayReportComponent();
          }
        });
      }
      
      // Fix generate reports button behavior
      const generateReportsBtn = document.getElementById("generateReports");
      if (generateReportsBtn) {
        generateReportsBtn.addEventListener("click", function() {
          // Ensure data is prepared
          prepareQuickBaseData();
          
          // Show loading state
          if (typeof toggleButtonLoadingState === 'function') {
            toggleButtonLoadingState(generateReportsBtn);
          } else {
            generateReportsBtn.disabled = true;
            generateReportsBtn.innerText = "Generating...";
          }
          
          // Call createPrintExcel with slight delay
          setTimeout(() => {
            if (typeof window.createPrintExcel === 'function') {
              window.createPrintExcel()
                .then(() => {
                  // Restore button state
                  if (typeof toggleButtonNormalState === 'function') {
                    toggleButtonNormalState(generateReportsBtn);
                  } else {
                    generateReportsBtn.disabled = false;
                    generateReportsBtn.innerText = "Generate Reports";
                  }
                })
                .catch(error => {
                  console.error("Error generating Excel report:", error);
                  if (typeof createToastWarning === 'function') {
                    createToastWarning("Error generating Excel report: " + error.message);
                  }
                  
                  // Restore button state
                  if (typeof toggleButtonNormalState === 'function') {
                    toggleButtonNormalState(generateReportsBtn);
                  } else {
                    generateReportsBtn.disabled = false;
                    generateReportsBtn.innerText = "Generate Reports";
                  }
                });
            }
          }, 300);
        });
      }
    });
    
    // Patch the chartSystem.js file - remove automatic report triggering
    document.addEventListener("chartsRendered", function(event) {
      // Do NOT automatically trigger report generation here
      console.log("Charts rendered event received - NOT auto-generating report");
      
      // Instead, just make the report tab ready
      const reportLink = document.getElementById("reportLink");
      if (reportLink) {
        reportLink.classList.remove("disabled");
      }
    });
    
    console.log("Report Component QuickBase patch applied successfully");
  })();