// system-connector.js - Updated to work with existing Api.js and chart components
class SystemConnector {
  constructor() {
    this.initialized = false;
    this.isLoading = false;
    this.chartsRendered = 0;
    this.totalExpectedCharts = 18; // Total number of charts in the system

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }

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
            enhancedInitializeChartDisplay();
          }, 1000);
        } catch (error) {
          console.error("Error in enhanced run button handler:", error);
        }
      };
    }
  }

  initialize() {
    if (this.initialized) return;

    console.log("Initializing System Connector");

    // Initialize the ApiService singleton if it doesn't exist
    if (!window.apiService) {
      window.apiService = new ApiService();
    }

    // Patch missing functions to ensure integration between components
    this.patchMissingFunctions();

    // Set up charts rendered event listener
    document.addEventListener("chartsRendered", () => {
      console.log("Charts rendered event received");
      if (typeof displayReportComponent === "function") {
        setTimeout(() => {
          displayReportComponent();
        }, 300);
      }
    });

    // Set up data processing complete listener
    document.addEventListener("dataProcessingComplete", () => {
      console.log("Data processing complete event received");
      setTimeout(() => {
        if (typeof enhancedInitializeChartDisplay === "function") {
          enhancedInitializeChartDisplay();
        } else if (typeof initializeChartDisplay === "function") {
          initializeChartDisplay();
        }
      }, 300);
    });

    // Wait a moment to ensure Flowbite is fully loaded before checking modals
    setTimeout(() => {
      if (typeof ensureAllModalsExist === "function") {
        ensureAllModalsExist();
      }
    }, 500);

    // Set up a single run button listener to prevent duplicates
    const originalHandleRunButtonClick =
      AppController.prototype.handleRunButtonClick;
    if (typeof originalHandleRunButtonClick === "function") {
      AppController.prototype.handleRunButtonClick = async function () {
        // Call the original method first
        await originalHandleRunButtonClick.call(this);

        // Then ensure chart display happens after data processing
        console.log(
          "Checking if charts need to be displayed after data processing"
        );

        // Give time for data processing to complete
        setTimeout(() => {
          // Try to initialize chart display
          if (
            typeof window.systemConnector === "object" &&
            typeof window.systemConnector.displayCharts === "function"
          ) {
            window.systemConnector.displayCharts();
          } else if (
            typeof window.enhancedInitializeChartDisplay === "function"
          ) {
            window.enhancedInitializeChartDisplay();
          } else if (typeof window.initializeChartDisplay === "function") {
            window.initializeChartDisplay();
          }
        }, 1000);
      };

      console.log(
        "Successfully hooked into AppController.handleRunButtonClick"
      );
    } else {
      console.warn(
        "Could not find AppController.handleRunButtonClick to hook into"
      );

      // Fall back to direct event listener as a backup
      const runButton = document.querySelector("#run");
      if (runButton) {
        runButton.addEventListener(
          "click",
          () => {
            setTimeout(() => this.displayCharts(), 1500);
          },
          { passive: true }
        );
      }
    }

    // Set up chart creation tracking for report component
    this.setupReliableReportLoading();

    // Consolidate utility functions to avoid duplication
    this.consolidateUtilityFunctions();

    // Ensure required global functions exist
    // this.checkRequiredFunctions();

    this.initialized = true;
    console.log("System Connector initialized");

    // Listen for data processing completion
    document.addEventListener("dataProcessingComplete", () => {
      console.log("Data processing complete event received in SystemConnector");

      // Schedule chart rendering
      setTimeout(() => {
        this.displayCharts();
      }, 300);
    });

    // Listen for chart rendered events
    document.addEventListener("chartsRendered", () => {
      console.log("Charts rendered event received in SystemConnector");

      // Update any UI that depends on charts being rendered
      if (typeof displayReportComponent === "function") {
        displayReportComponent();
      }
    });
  }

  patchMissingFunctions() {
    // Patch processApiData if missing
    if (typeof window.processApiData !== "function") {
      console.log("Patching missing processApiData function");
      window.processApiData = function (
        selectedYears,
        recordsPeer,
        recordsClient
      ) {
        console.log("Patched processApiData called");

        // Call processApiCalls if available
        if (typeof window.processApiCalls === "function") {
          return window.processApiCalls(
            selectedYears,
            recordsPeer,
            recordsClient
          );
        } else {
          console.warn(
            "processApiCalls function not found, using direct processor"
          );

          // Create a new DataStore instance if needed
          if (!window.dataStore) {
            window.dataStore = new DataStore();
          }

          // Create processor with the store
          const dataProcessor = new DataProcessor(window.dataStore);

          // Process all data categories
          dataProcessor.processAllData(
            selectedYears,
            recordsPeer,
            recordsClient
          );

          // Signal that data is ready
          document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

          return {
            cfiData: JSON.parse(localStorage.getItem("cfiData")),
            doeData: JSON.parse(localStorage.getItem("doeData")),
            financialAnalysisData: JSON.parse(
              localStorage.getItem("financialAnalysisData")
            ),
            financialPositionData: JSON.parse(
              localStorage.getItem("financialPositionData")
            ),
            financialStatementData: JSON.parse(
              localStorage.getItem("financialStatementData")
            ),
            revenueExpenseData: JSON.parse(
              localStorage.getItem("revenueExpenseData")
            ),
            debtEndowmentData: JSON.parse(
              localStorage.getItem("debtEndowmentData")
            ),
          };
        }
      };
    }

    // Ensure chart initialization function exists
    if (typeof window.initializeChartDisplay !== "function") {
      console.log("Patching missing initializeChartDisplay function");
      window.initializeChartDisplay = function () {
        console.log("Patched initializeChartDisplay called");

        if (
          window.displayComponents &&
          typeof window.displayComponents.displayAllComponents === "function"
        ) {
          window.displayComponents.displayAllComponents();
          return true;
        } else if (
          typeof displayCfiComponent === "function" &&
          typeof displayDoeComponent === "function" &&
          typeof displayFinancialAnalysisComponent === "function" &&
          typeof displayFinancialPositionComponent === "function" &&
          typeof displayFinancialStatementComponent === "function" &&
          typeof displayRevenueExpenseComponent === "function" &&
          typeof displayDebtEndowmentComponent === "function"
        ) {
          console.log("Using individual component display functions");
          displayCfiComponent();
          displayDoeComponent();
          displayFinancialAnalysisComponent();
          displayFinancialPositionComponent();
          displayFinancialStatementComponent();
          displayRevenueExpenseComponent();
          displayDebtEndowmentComponent();
          return true;
        }

        console.warn("No chart display functions available");
        return false;
      };
    }
  }

  setupReliableReportLoading() {
    // Create a custom event for when all charts are rendered
    const chartsRenderedEvent = new CustomEvent("chartsRendered");

    // Store original chart creation function
    const originalCreateChart = window.createChart;

    if (originalCreateChart) {
      // Override chart creation to track rendering
      window.createChart = (...args) => {
        // Call original function
        const result = originalCreateChart.apply(window, args);

        // Increment chart counter
        this.chartsRendered++;
        console.log(
          `Chart rendered: ${this.chartsRendered}/${this.totalExpectedCharts}`
        );

        // If all expected charts are rendered, dispatch the event
        if (this.chartsRendered >= this.totalExpectedCharts) {
          console.log("All charts rendered, triggering report display");
          document.dispatchEvent(chartsRenderedEvent);
          this.chartsRendered = 0; // Reset counter for future calls
        }

        return result;
      };
    }
  }

  consolidateUtilityFunctions() {
    // Initialize chartConfigFactory if it doesn't exist
    if (!window.chartConfigFactory) {
      window.chartConfigFactory = {
        createConfig: (type, params) => {
          // Basic chart configuration
          return {
            series: [{
              name: "Client",
              data: params.clientData || []
            }, {
              name: "Peer Average",
              data: params.peerData || []
            }],
            chart: {
              type: type === 'line' ? 'line' : 'bar',
              height: 350
            },
            // ... other basic chart configuration
          };
        }
      };
    }

    // Define chart manager if it doesn't exist
    if (!window.chartManager) {
      window.chartManager = {
        destroyAllCharts: () => {
          // List of all chart instances to destroy
          const chartInstances = [
            window.cfiRatio_chart,
            window.cfi_primaryReserveRatio_chart,
            window.cfi_netIncomeOperationsRatio_chart,
            window.cfi_returnOnNetAssets_chart,
            window.cfi_viabilityRatio_chart,
            window.doeOverall_chart,
            window.assets_chart,
            window.liabilities_chart,
            window.netAssets_chart,
            window.revenueAndSupport_chart,
            window.educationalProgramExpenses_chart,
            window.nonOperatingActivities_chart,
            window.changesInNetAssetsWithDR_chart,
            window.naturalExpenseCategories_chart,
            window.cashFlowsOperatingActivities_chart,
            window.cashFlowsInvestingActivities_chart,
            window.cashFlowsFinancingActivities_chart,
            window.propertyAndEquipment_chart,
            window.financialPosition_chart,
            window.assetToLiabilities_chart,
            window.currentRatio_chart,
            window.cashFlowsTrend_chart,
            window.ffa_chart,
            window.sourceOfIncomeClient_chart,
            window.sourceOfIncomePeer_chart,
            window.salariesBenefitsToTotalExpense_chart,
            window.salariesBenefitsPerNetTuition_chart,
            window.netEducationalExpensePerStudent_chart,
            window.annualTraditionalNetTuitionPerStudent_chart,
            window.tuitionDependency_chart,
            window.tuitionDiscountRate_chart,
            window.ltDebtPerTotalOperatingRevenue_chart,
            window.debtServiceCoverageRatio_chart,
            window.debtBurdenRatio_chart,
            window.endowmentOperatingBudget_chart,
            window.endowmentAssetsPerStudent_chart,
            window.debtAndEndowment_chart,
          ];

          // Destroy each chart if it exists
          chartInstances.forEach((chart) => {
            if (chart && typeof chart.destroy === "function") {
              chart.destroy();
            }
          });

          console.log("All charts destroyed");
        },

        // Add createEmptyChart function
        createEmptyChart: (chartId, mainName, title) => {
          const element = document.getElementById(chartId);
          if (!element) {
            console.warn(`Chart element ${chartId}_chart not found`);
            return;
          }

          // Clear any existing content
          element.innerHTML = "";

          // Create a simple message
          const message = document.createElement("div");
          message.className = "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400";
          message.innerHTML = `
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-lg font-medium">No data available</p>
              <p class="text-sm">Try adjusting your filters or selecting different years</p>
            </div>
          `;

          element.appendChild(message);
        },

        // Add createChart function
        createChart: (chartId, peerData, clientData, numType, fixedNum, mainName, wa, parsedData, benchmark, title, chartType) => {
          try {
            // Get chart element
            const chartElement = document.getElementById(chartId);
            if (!chartElement) {
              console.error(`Chart element #${chartId}_chart not found`);
              return;
            }

            // Clear existing chart
            chartElement.innerHTML = "";

            // Create chart configuration using chartConfigFactory
            const config = window.chartConfigFactory.createConfig(chartType || 'main', {
              dataPeer: peerData,
              dataClient: clientData,
              numType,
              fixedNum,
              mainName,
              wa,
              parsedData,
              benchmark,
              title, 
              chartId
            });

            // Create and render the chart
            const chart = new ApexCharts(chartElement, config);
            chart.render();

            // Store reference to chart
            window[`${chartId}_chart`] = chart;

            return chart;
          } catch (error) {
            console.error(`Error creating chart ${mainName}:`, error);
            window.chartManager.createEmptyChart(chartId, mainName, title);
          }
        },

        // Modify createChartFromParsedData to use the object's methods
        createChartFromParsedData: function(data, chartId, dataPeer, dataClient, numType, fixedNum, mainName, wa, parsedData, title, chartType) {
          try {
            if (!parsedData) {
              console.warn(`No data provided for chart ${mainName}`);
              this.createEmptyChart(chartId, mainName, title);
              return;
            }

            // Log the exact property names we're looking for
            console.log(`Looking for data with properties:`, {
              peerKey: `${mainName}_peerAverage_Peer`,
              clientKey: `${mainName}_Client`,
              alternateClientKey: `cfi_${mainName}_Client`
            });

            // More flexible data validation
            const clientData = dataClient || 
                              parsedData[`${mainName}_Client`] || 
                              parsedData[`cfi_${mainName}_Client`];
            
            const peerData = dataPeer || 
                             parsedData[`${mainName}_peerAverage_Peer`] || 
                             parsedData[`${mainName}_Peer`];

            console.log(`Chart ${mainName} Data:`, {
              clientData,
              peerData,
              rawParsedData: parsedData
            });

            if (!clientData && !peerData) {
              console.warn(`Missing peer and client data for chart ${mainName}`);
              this.createEmptyChart(chartId, mainName, title);
              return;
            }

            // Transform the data into the correct format
            const transformedClientData = this.transformClientData(clientData);
            const transformedPeerData = this.transformPeerData(peerData);

            this.createChart(
              chartId,
              transformedPeerData,
              transformedClientData,
              numType,
              fixedNum,
              mainName,
              wa,
              parsedData,
              null,
              title,
              chartType
            );
          } catch (error) {
            console.error(`Error creating chart from parsed data for ${mainName}:`, error);
            this.createEmptyChart(chartId, mainName, title);
          }
        },

        // Add helper methods for data transformation
        transformClientData: function(data) {
          if (!data) return null;
          
          // If data is an object with year properties
          if (typeof data === 'object' && !Array.isArray(data)) {
            return Object.entries(data)
              .sort(([yearA], [yearB]) => yearA - yearB)
              .map(([_, yearData]) => {
                if (yearData && yearData.value !== undefined) {
                  return parseFloat(yearData.value);
                }
                return null;
              });
          }
          
          return Array.isArray(data) ? data : null;
        },

        transformPeerData: function(data) {
          if (!data) return null;
          
          // If data is an object with year properties containing arrays
          if (typeof data === 'object' && !Array.isArray(data)) {
            return Object.entries(data)
              .sort(([yearA], [yearB]) => yearA - yearB)
              .map(([_, yearData]) => {
                if (Array.isArray(yearData)) {
                  // Calculate average of peer data array
                  const validValues = yearData.filter(v => v !== null && v !== undefined);
                  return validValues.length > 0 
                    ? validValues.reduce((sum, val) => sum + parseFloat(val), 0) / validValues.length 
                    : null;
                }
                return null;
              });
          }
          
          return Array.isArray(data) ? data : null;
        }
      };
    }
  }

  // Check and create any required global functions that might be missing
  checkRequiredFunctions() {
    // Check if getPeerAndClientChartDataArrays exists
    if (typeof window.getPeerAndClientChartDataArrays !== "function") {
      console.warn(
        "getPeerAndClientChartDataArrays function not found - creating fallback"
      );

      // Create a fallback implementation if it doesn't exist
      window.getPeerAndClientChartDataArrays = function (
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

            let avg = array.length
              ? array.reduce((sum, val) => sum + val, 0) / array.length
              : 0;
            let clientNum = dataClient[year]?.value
              ? Number(dataClient[year].value)
              : 0;

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

    // Define the unified data processing function
    window.processApiCalls = (years, recordsPeer, recordsClient) => {
      // console.log("Processing API data with unified function");

      // Clear existing data store or create a new one
      if (!window.dataStore) {
        window.dataStore = new DataStore();
      } else {
        // Reset the data store for new data
        window.dataStore.cfiData = {};
        window.dataStore.doeData = {};
        window.dataStore.financialAnalysisData = {};
        window.dataStore.financialPositionData = {};
        window.dataStore.financialStatementData = {};
        window.dataStore.revenueExpenseData = {};
        window.dataStore.debtEndowmentData = {};
      }

      // Create processor with the store
      const dataProcessor = new DataProcessor(window.dataStore);

      // Process all data categories
      dataProcessor.processAllData(years, recordsPeer, recordsClient);

      // Make processed data available globally
      window.processedData = {
        cfiData: JSON.parse(localStorage.getItem("cfiData")),
        doeData: JSON.parse(localStorage.getItem("doeData")),
        financialAnalysisData: JSON.parse(
          localStorage.getItem("financialAnalysisData")
        ),
        financialPositionData: JSON.parse(
          localStorage.getItem("financialPositionData")
        ),
        financialStatementData: JSON.parse(
          localStorage.getItem("financialStatementData")
        ),
        revenueExpenseData: JSON.parse(
          localStorage.getItem("revenueExpenseData")
        ),
        debtEndowmentData: JSON.parse(
          localStorage.getItem("debtEndowmentData")
        ),
      };

      // console.log("Data processing complete and available globally");

      // Signal that data is ready
      document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

      return window.processedData;
    };
  }

  async handleRunButtonClick() {
    console.log("Run button clicked");

    if (this.isLoading) return;

    try {
      this.isLoading = true;

      // Update button UI
      const runButton = document.querySelector("#run");
      if (runButton) {
        toggleButtonLoadingState(runButton);
      }

      // Show loading indicator
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("open", "api");
      }

      // Get selected years
      const selectedYears = this.getSelectedYears();
      this.saveSelectedYearsToLocalStorage(selectedYears);

      // Clear existing charts
      if (window.chartManager) {
        console.log("Destroying existing charts");
        window.chartManager.destroyAllCharts();
      }

      // Reset chart render counter
      this.chartsRendered = 0;

      // Fetch data using ApiService
      const apiService = window.apiService;
      if (!apiService) {
        throw new Error("ApiService not available");
      }

      apiService.clearRecords();

      // Fetch peer and client data
      console.log("Fetching data...");
      const recordsPeer = await apiService.getRecordsForPeer(selectedYears);
      const recordsClient = await apiService.getRecordsForClient(selectedYears);

      // Process data
      if (typeof window.processApiCalls === "function") {
        window.processApiCalls(selectedYears, recordsPeer, recordsClient);
      } else {
        throw new Error("Data processing function not found");
      }

      // Wait for data processing
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Display charts
      console.log("Displaying charts...");
      this.displayCharts();

      // Trigger charts rendered event
      setTimeout(() => {
        document.dispatchEvent(new Event("chartsRendered"));
      }, 500);

      // Update UI state
      if (runButton) {
        toggleButtonNormalState(runButton);
      }

      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }
    } catch (error) {
      console.error("Error in run button handler:", error);
      if (typeof createToastWarning === "function") {
        createToastWarning("Error processing data: " + error.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  getSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears || !selectedYears.length) {
      if (typeof createToastWarning === "function") {
        createToastWarning("Please select year(s) for data to appear");
      }
      throw new Error("No years selected");
    }

    return selectedYears;
  }

  saveSelectedYearsToLocalStorage(selectedYears) {
    if (Array.isArray(selectedYears)) {
      const sortedYears = [...selectedYears].sort((a, b) => a - b);
      localStorage.setItem("selectedYears", JSON.stringify(sortedYears));
    }
  }

  displayCharts() {
    try {
      if (!window.chartManager) {
        throw new Error("Chart manager not initialized");
      }

      const data = {
        cfiData: JSON.parse(localStorage.getItem("cfiData")),
        doeData: JSON.parse(localStorage.getItem("doeData")),
        financialAnalysisData: JSON.parse(localStorage.getItem("financialAnalysisData")),
        financialPositionData: JSON.parse(localStorage.getItem("financialPositionData")),
        financialStatementData: JSON.parse(localStorage.getItem("financialStatementData")),
        revenueExpenseData: JSON.parse(localStorage.getItem("revenueExpenseData")),
        debtEndowmentData: JSON.parse(localStorage.getItem("debtEndowmentData")),
      };

      // Add debugging
      console.log("Chart Data:", data);

      // CFI Charts
      if (data.cfiData) {
        // console.log("Creating CFI charts with data:", data.cfiData);
        

        window.chartManager.createChartFromParsedData(
          data.cfiData,
          "cfiRatio_chart",
          "cfiRatio_peerAverage_Peer",
          "cfiRatio_Client",
          "num",
          1,
          "cfiRatio",
          true,
          data.cfiData,
          "CFI Overall Ratio"
        );

        window.chartManager.createChartFromParsedData(
          data.cfiData,
          "cfi_primaryReserveRatio_chart",
          data.cfiData["primaryReserveRatio_peerAverage_Peer"],
          data.cfiData["cfi_primaryReserveRatio_Client"],
          "number",
          2,
          "cfi_primaryReserveRatio",
          true,
          data.cfiData,
          "CFI Primary Reserve Ratio"
        );

        window.chartManager.createChartFromParsedData(
          data.cfiData,
          "cfi_netIncomeOperationsRatio_chart",
          data.cfiData["netIncomeOperationsRatio_peerAverage_Peer"],
          data.cfiData["cfi_netIncomeOperationsRatio_Client"],
          "number",
          2,
          "cfi_netIncomeOperationsRatio",
          true,
          data.cfiData,
          "CFI Net Income Operations Ratio"
        );

        window.chartManager.createChartFromParsedData(
          data.cfiData,
          "cfi_returnOnNetAssets_chart",
          data.cfiData["returnOnNetAssets_peerAverage_Peer"],
          data.cfiData["cfi_returnOnNetAssets_Client"],
          "number",
          2,
          "cfi_returnOnNetAssets",
          true,
          data.cfiData,
          "CFI Return on Net Assets"
        );

        window.chartManager.createChartFromParsedData(
          data.cfiData,
          "cfi_viabilityRatio_chart",
          data.cfiData["viabilityRatio_peerAverage_Peer"],
          data.cfiData["cfi_viabilityRatio_Client"],
          "number",
          2,
          "cfi_viabilityRatio",
          true,
          data.cfiData,
          "CFI Viability Ratio"
        );
      }

      // DOE Charts
      if (data.doeData) {
        window.chartManager.createChartFromParsedData(
          data.doeData,
          "doeOverall_chart",
          data.doeData.compositeScore_Peer,
          data.doeData.compositeScore_Client,
          "number",
          1,
          "doeOverall",
          true,
          data.doeData,
          "DOE Overall Score"
        );
      }

      // Financial Position Charts
      if (data.financialPositionData) {
        window.chartManager.createChartFromParsedData(
          data.financialPositionData,
          "assets",
          data.financialPositionData.totalAssets_Peer,
          data.financialPositionData.totalAssets_Client,
          "dollar",
          0,
          "assets",
          false,
          data.financialPositionData,
          "Assets"
        );

        // Add other financial position charts...
      }

      // Continue for other categories...

      // Initialize modals after charts
      if (typeof ensureAllModalsExist === "function") {
        setTimeout(ensureAllModalsExist, 500);
      }

    } catch (error) {
      console.error("Error displaying charts:", error);
      if (typeof createToastWarning === "function") {
        createToastWarning("Error displaying charts: " + error.message);
      }
    }
  }

  createChartWithManager(chartId, data) {
    if (!window.chartManager) return;

    const chartConfig = {
      dataPeer: data[`${chartId}_Peer`],
      dataClient: data[`${chartId}_Client`],
      numType: this.getChartNumType(chartId),
      fixedNum: this.getChartFixedNum(chartId),
      mainName: chartId,
      wa: this.shouldUseWeightedAverage(chartId),
      parsedData: data,
      title: this.getChartTitle(chartId),
      chartType: this.getChartType(chartId),
    };

    window.chartManager.createChartFromParsedData(
      data,
      chartId,
      chartConfig.dataPeer,
      chartConfig.dataClient,
      chartConfig.numType,
      chartConfig.fixedNum,
      chartConfig.mainName,
      chartConfig.wa,
      null,
      chartConfig.title,
      chartConfig.chartType
    );
  }

  getChartNumType(chartId) {
    const numTypes = {
      cfi_netIncomeOperationsRatio: "percent",
      cfi_returnOnNetAssets: "percent",
      tuitionDiscountRate: "percent",
      salariesBenefitsToTotalExpense: "percent",
      debtServiceCoverageRatio: "percent",
      debtBurdenRatio: "percent",
      endowmentAssetsPerStudent: "dollar",
      endowmentOperatingBudget: "dollar",
      netEducationalExpensePerStudent: "dollar",
      annualTraditionalNetTuitionPerStudent: "dollar",
      salariesBenefitsPerNetTuition: "dollar",
      ltDebtPerTotalOperatingRevenue: "percent",
      assets: "dollar",
      liabilities: "dollar",
      netAssets: "dollar",
      revenueAndSupport: "dollar",
      educationalProgramExpenses: "dollar",
      nonOperatingActivities: "dollar",
      changesInNetAssetsWithDR: "dollar",
      naturalExpenseCategories: "dollar",
      cashFlowsOperatingActivities: "dollar",
      cashFlowsInvestingActivities: "dollar",
      cashFlowsFinancingActivities: "dollar",
      propertyAndEquipment: "dollar",
    };
    return numTypes[chartId] || "num";
  }

  getChartFixedNum(chartId) {
    const fixedNums = {
      cfiRatio: 1,
      cfi_primaryReserveRatio: 2,
      cfi_netIncomeOperationsRatio: 1,
      cfi_returnOnNetAssets: 1,
      cfi_viabilityRatio: 2,
      doeOverall: 1,
      currentRatio: 2,
      tuitionDependency: 1,
      tuitionDiscountRate: 1,
      salariesBenefitsToTotalExpense: 1,
      debtServiceCoverageRatio: 2,
      debtBurdenRatio: 2,
      endowmentAssetsPerStudent: 0,
      endowmentOperatingBudget: 0,
      netEducationalExpensePerStudent: 0,
      annualTraditionalNetTuitionPerStudent: 0,
      salariesBenefitsPerNetTuition: 0,
      ltDebtPerTotalOperatingRevenue: 1,
      assets: 0,
      liabilities: 0,
      netAssets: 0,
      revenueAndSupport: 0,
      educationalProgramExpenses: 0,
      nonOperatingActivities: 0,
      changesInNetAssetsWithDR: 0,
      naturalExpenseCategories: 0,
      cashFlowsOperatingActivities: 0,
      cashFlowsInvestingActivities: 0,
      cashFlowsFinancingActivities: 0,
      propertyAndEquipment: 0,
    };
    return fixedNums[chartId] || 0;
  }

  shouldUseWeightedAverage(chartId) {
    const weightedAverageCharts = [
      "currentRatio",
      "liquidity",
      "debtServiceCoverageRatio",
      "debtBurdenRatio",
      "tuitionDependency",
      "tuitionDiscountRate",
      "salariesBenefitsToTotalExpense",
      "endowmentOperatingBudget",
      "ltDebtPerTotalOperatingRevenue",
    ];
    return weightedAverageCharts.includes(chartId);
  }

  getChartTitle(chartId) {
    const titles = {
      cfiRatio: "CFI Overall Ratio",
      cfi_primaryReserveRatio: "CFI Primary Reserve Ratio",
      cfi_netIncomeOperationsRatio: "CFI Net Income Operations Ratio",
      cfi_returnOnNetAssets: "CFI Return on Net Assets",
      cfi_viabilityRatio: "CFI Viability Ratio",
      doeOverall: "US Department of Education Overall Composite Score",
      FinancialPosition: "Financial Position",
      assetToLiabilities: "Asset to Liabilities",
      sourceOfIncomeClient: "Source of Income - Client",
      sourceOfIncomePeer: "Source of Income - Peer",
      ffa: "Financial Flexibility Analysis",
      cashFlowsTrend: "Cash Flows Trend",
      currentRatio: "Current Ratio",
      liquidity: "Liquidity",
      assets: "Assets",
      liabilities: "Liabilities",
      netAssets: "Net Assets",
      revenueAndSupport: "Revenue and Support",
      educationalProgramExpenses: "Educational Program Expenses",
      nonOperatingActivities: "Non Operating Activities",
      changesInNetAssetsWithDR: "Changes in Net Assets with Donor Restrictions",
      naturalExpenseCategories: "Natural Expense Categories",
      cashFlowsOperatingActivities: "Cash Flows: Operating Activities",
      cashFlowsInvestingActivities: "Cash Flows: Investing Activities",
      cashFlowsFinancingActivities: "Cash Flows: Financing Activities",
      propertyAndEquipment: "Property and Equipment",
      salariesBenefitsToTotalExpense: "Salaries and Benefits to Total Expense",
      salariesBenefitsPerNetTuition: "Salaries and Benefits per Net Tuition",
      netEducationalExpensePerStudent: "Net Educational Expense per Student",
      annualTraditionalNetTuitionPerStudent:
        "Annual Traditional Net Tuition per Student",
      tuitionDependency: "Tuition Dependency",
      tuitionDiscountRate: "Tuition Discount Rate",
      ltDebtPerTotalOperatingRevenue:
        "Long-term Debt per Total Operating Revenue",
      debtServiceCoverageRatio: "Debt Service Coverage Ratio",
      debtBurdenRatio: "Debt Burden Ratio",
      endowmentAssetsPerStudent: "Endowment Assets per Student",
      endowmentOperatingBudget: "Endowment Operating Budget",
    };
    return titles[chartId] || chartId;
  }

  getChartType(chartId) {
    const chartTypes = {
      sourceOfIncomeClient: "pie",
      sourceOfIncomePeer: "pie",
      ffa: "rangeBar",
      salariesBenefitsToTotalExpense: "radialBar",
      salariesBenefitsPerNetTuition: "radialBar",
      ltDebtPerTotalOperatingRevenue: "radialBar",
      annualizedInvestmentReturn: "radialBar",
      debtServiceCoverageRatio: "hlineargauge",
      endowmentOperatingBudget: "hlineargauge",
      currentRatio: "line",
      tuitionDiscountRate: "line",
      tuitionDependency: "line",
      debtBurdenRatio: "line",
      endowmentAssetsPerStudent: "line",  
      endowmentOperatingBudget: "line",
    };
    return chartTypes[chartId] || "bar";
  }
}

// Function to ensure existing modals are properly initialized
function ensureAllModalsExist() {
  // console.log("Checking for existing modals to initialize");

  // Get all elements that could be modals (divs with IDs ending in _modal)
  const potentialModals = document.querySelectorAll('div[id$="_modal"]');

  potentialModals.forEach((modal) => {
    const modalId = modal.id;

    // Check if this modal has the required Flowbite attributes
    if (!modal.hasAttribute("data-modal-initialized")) {
      // console.log(`Initializing existing modal: ${modalId}`);

      // Find any buttons that should toggle this modal
      const toggleButtons = document.querySelectorAll(
        `[data-modal-toggle="${modalId}"]`
      );

      if (toggleButtons.length === 0) {
        console.log(`Warning: No toggle buttons found for modal ${modalId}`);
      }

      // Try to initialize the modal using Flowbite's modal API
      if (window.Flowbite && typeof window.Flowbite.initModals === "function") {
        try {
          window.Flowbite.initModals();
          console
            .log
            // `Successfully initialized modal ${modalId} via Flowbite.initModals`
            ();
        } catch (error) {
          console.error(`Error initializing modal ${modalId}:`, error);
        }
      } else if (typeof initFlowbite === "function") {
        try {
          initFlowbite();
          // console.log(`Successfully initialized all modals via initFlowbite`);
        } catch (error) {
          console.error(`Error initializing modals via initFlowbite:`, error);
        }
      } else if (
        window.flowbite &&
        typeof window.flowbite.initModals === "function"
      ) {
        try {
          window.flowbite.initModals();
          console
            .log
            // `Successfully initialized modal ${modalId} via flowbite.initModals`
            ();
        } catch (error) {
          console.error(`Error initializing modal ${modalId}:`, error);
        }
      } else {
        console.warn(
          `Unable to initialize modal ${modalId} - Flowbite API not found`
        );

        // Apply basic modal behavior as fallback
        toggleButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const isHidden = modal.classList.contains("hidden");
            if (isHidden) {
              modal.classList.remove("hidden");
              modal.classList.add("flex");
            } else {
              modal.classList.add("hidden");
              modal.classList.remove("flex");
            }
          });

          // Find close buttons within the modal
          const closeButtons = modal.querySelectorAll("[data-modal-hide]");
          closeButtons.forEach((closeBtn) => {
            closeBtn.addEventListener("click", () => {
              modal.classList.add("hidden");
              modal.classList.remove("flex");
            });
          });
        });
      }
    }
  });
}

// Make sure all modal rows exist
function ensureModalsHaveRows() {
  // console.log("Ensuring all modals have proper row structure");

  // List of all expected modals
  const modalIds = [
    "cfiRatio",
    "cfi_primaryReserveRatio",
    "cfi_netIncomeOperationsRatio",
    "cfi_returnOnNetAssets",
    "cfi_viabilityRatio",
    "doeOverall",
    "assets",
    "liabilities",
    "netAssets",
    "revenueAndSupport",
    "educationalProgramExpenses",
    "nonOperatingActivities",
    "changesInNetAssetsWithDR",
    "naturalExpenseCategories",
    "cashFlowsOperatingActivities",
    "cashFlowsInvestingActivities",
    "cashFlowsFinancingActivities",
    "propertyAndEquipment",
    "financialPosition",
    "assetToLiabilities",
    "currentRatio",
    "cashFlowsTrend",
    "ffa",
    "sourceOfIncomeClient",
    "sourceOfIncomePeer",
    "salariesBenefitsToTotalExpense",
    "salariesBenefitsPerNetTuition",
    "netEducationalExpensePerStudent",
    "annualTraditionalNetTuitionPerStudent",
    "tuitionDependency",
    "tuitionDiscountRate",
    "ltDebtPerTotalOperatingRevenue",
    "debtServiceCoverageRatio",
    "debtBurdenRatio",
    "endowmentOperatingBudget",
    "endowmentAssetsPerStudent",
    "debtAndEndowment",
  ];

  modalIds.forEach((id) => {
    const modalSelector = `#${id}_modal`;
    const modal = document.querySelector(modalSelector);

    if (modal) {
      // Check if row exists
      const rowId = `${id}_modal_row`;
      let row = modal.querySelector(`#${rowId}`);

      // If row doesn't exist, find the table and create it
      if (!row) {
        const table = modal.querySelector("table");
        if (table) {
          const thead = table.querySelector("thead");
          if (thead) {
            // Check if there's any row we can use
            const existingRow = thead.querySelector("tr");
            if (existingRow) {
              // Set the ID on the existing row
              existingRow.id = rowId;
              // console.log(`Set ID on existing row for modal ${id}`);
            } else {
              // Create a new row with proper ID
              row = document.createElement("tr");
              row.id = rowId;
              thead.appendChild(row);
              // console.log(`Created new row for modal ${id}`);
            }
          }
        }
      }
    }
  });
}

// Create a singleton instance
window.systemConnector = new SystemConnector();

// Add event listeners for DOM ready
document.addEventListener("DOMContentLoaded", ensureModalsHaveRows);
