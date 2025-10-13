// system-connector.js - Updated to work with existing Api.js and chart components
class SystemConnector {
  constructor() {
    this.initialized = false;
    this.isLoading = false;
    this.chartsRendered = 0;
    this.totalExpectedCharts = 18; // Adjust this number based on actual charts

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

    // Set up report link event handler
    const reportLink = document.getElementById("reportLink");
    // if (reportLink) {
    //   reportLink.addEventListener("click", function () {
    //     console.log("Report link clicked");
    //     if (typeof displayReportComponent === "function") {
    //       displayReportComponent();
    //     } else {
    //       console.error("displayReportComponent function not found");
    //     }
    //   });
    // }

    // Set up charts rendered event listener
    document.addEventListener("chartsRendered", () => {
      // console.log("Charts rendered event received");
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
    this.checkRequiredFunctions();

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
      // console.log("Charts rendered event received in SystemConnector");

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
            generalData: JSON.parse(localStorage.getItem("generalData")),
            cashData: JSON.parse(localStorage.getItem("cashData")),
            assetData: JSON.parse(localStorage.getItem("assetData")),
            incomeData: JSON.parse(localStorage.getItem("incomeData")),
            expenseData: JSON.parse(localStorage.getItem("expenseData")),
            miscData: JSON.parse(localStorage.getItem("miscData")),
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
          typeof displayGeneralComponent === "function" &&
          typeof displayCashComponent === "function" &&
          typeof displayIncomeComponent === "function" &&
          typeof displayExpenseComponent === "function"
        ) {
          console.log("Using individual component display functions");
          displayGeneralComponent();
          displayCashComponent();
          displayIncomeComponent();
          displayExpenseComponent();
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
    // Define chart manager if it doesn't exist
    if (!window.chartManager) {
      window.chartManager = {
        destroyAllCharts: () => {
          // List of all chart instances to destroy
          const chartInstances = [
            window.daysCashOnHand_chart,
            window.daysExpensesInUnrestrictedNA_chart,
            window.daysExpensesInUnrestrictedNA_excludingPPE_chart,
            window.liquidityAssetsAvailableCover_chart,
            window.totalCoverageRatio_chart,
            window.assetsWithoutPpeToLiabilitiesWithoutDebt_chart,
            window.contributionsTrend_chart,
            window.annualizedInvestmentReturn_chart,
            window.functionalExpensePercent_program_chart,
            window.functionalExpensePercent_administrative_chart,
            window.functionalExpensePercent_fundraising_chart,
            window.costOfContributionsDetailView_chart,
            window.costOfContributions_chart,
            window.functionalAllocation_chart,
            window.netAssetBreakdown_chart,
            window.changeInNetAssets_chart,
            window.totalContributions_chart,
            window.contributionsWithoutDR_chart,
          ];

          // Destroy each chart if it exists
          chartInstances.forEach((chart) => {
            if (chart && typeof chart.destroy === "function") {
              chart.destroy();
            }
          });

          console.log("All charts destroyed");
        },
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

    // Check if getSeriesData exists
    if (typeof window.getSeriesData !== "function") {
      console.warn("getSeriesData function not found - creating fallback");

      // Create a fallback implementation if it doesn't exist
      window.getSeriesData = function (
        years,
        operatingData,
        investingData,
        financingData,
        totalData
      ) {
        const operatingValues = [];
        const investingValues = [];
        const financingValues = [];
        const totalValues = [];

        years.forEach((year) => {
          operatingValues.push(
            operatingData && operatingData[year]
              ? Number(operatingData[year].value)
              : 0
          );
          investingValues.push(
            investingData && investingData[year]
              ? Number(investingData[year].value)
              : 0
          );
          financingValues.push(
            financingData && financingData[year]
              ? Number(financingData[year].value)
              : 0
          );
          totalValues.push(
            totalData && totalData[year] ? Number(totalData[year].value) : 0
          );
        });

        return [
          { name: "Operating", data: operatingValues },
          { name: "Investing", data: investingValues },
          { name: "Financing", data: financingValues },
          { name: "Total", data: totalValues },
        ];
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
        window.dataStore.generalData = {};
        window.dataStore.cashData = {};
        window.dataStore.assetData = {};
        window.dataStore.incomeData = {};
        window.dataStore.expenseData = {};
        window.dataStore.miscData = {};
      }

      // Create processor with the store
      const dataProcessor = new DataProcessor(window.dataStore);

      // Process all data categories
      dataProcessor.processAllData(years, recordsPeer, recordsClient);

      // Make processed data available globally
      window.processedData = {
        generalData: JSON.parse(localStorage.getItem("generalData")),
        cashData: JSON.parse(localStorage.getItem("cashData")),
        assetData: JSON.parse(localStorage.getItem("assetData")),
        incomeData: JSON.parse(localStorage.getItem("incomeData")),
        expenseData: JSON.parse(localStorage.getItem("expenseData")),
        miscData: JSON.parse(localStorage.getItem("miscData")),
      };

      // console.log("Data processing complete and available globally");

      // Signal that data is ready
      document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

      return window.processedData;
    };
  }

  async handleRunButtonClick() {
    console.log("system-connector runButton called");

    // Prevent multiple simultaneous requests
    if (this.isLoading) return;

    try {
      this.isLoading = true;

      // Make sure required functions exist
      this.checkRequiredFunctions();

      // Update button UI to show loading
      const runButton = document.querySelector("#run");
      if (runButton && typeof toggleButtonLoadingState === "function") {
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
      if (
        window.chartManager &&
        typeof chartManager.destroyAllCharts === "function"
      ) {
        console.log("Destroying existing charts");
        chartManager.destroyAllCharts();
      }

      // Reset chart render counter
      this.chartsRendered = 0;

      // Use existing ApiService
      const apiService = window.apiService;

      if (!apiService) {
        throw new Error("ApiService not available");
      }

      // Clear any existing record data
      apiService.clearRecords();

      // Fetch data from API
      console.log("Fetching peer data...");
      const recordsPeer = await apiService.getRecordsForPeer(selectedYears);
      if (typeof countUniqueClients === "function") {
        countUniqueClients(recordsPeer);
      }

      console.log("Fetching client data...");
      const recordsClient = await apiService.getRecordsForClient(selectedYears);

      // Process data using the unified function
      console.log("Processing API data...");
      if (typeof window.processApiCalls === "function") {
        window.processApiCalls(selectedYears, recordsPeer, recordsClient);
      } else {
        throw new Error("processApiCalls function not found");
      }

      // Explicitly wait for a moment to ensure data is fully processed
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Display charts
      console.log("Displaying charts...");
      this.displayCharts();

      // Dispatch event that charts are rendered
      setTimeout(() => {
        document.dispatchEvent(new Event("chartsRendered"));
      }, 500);

      // Update button UI to show normal state
      if (runButton && typeof toggleButtonNormalState === "function") {
        toggleButtonNormalState(runButton);
      }

      // Hide loading indicator
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }

      console.log("Data processing and chart rendering complete");
    } catch (error) {
      console.error("Error in run button handler:", error);

      // Update button UI to show normal state even on error
      const runButton = document.querySelector("#run");
      if (runButton && typeof toggleButtonNormalState === "function") {
        toggleButtonNormalState(runButton);
      }

      // Hide loading indicator even on error
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }

      // Display error message to user
      if (typeof createToastWarning === "function") {
        createToastWarning("Error processing data: " + error.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Get and validate selected years
  getSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears || !selectedYears.length) {
      if (typeof createToastWarning === "function") {
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

  // Display charts with improved flow
  displayCharts() {
    try {
      // First try to use enhancedInitializeChartDisplay from chartIndex.js
      if (typeof window.enhancedInitializeChartDisplay === "function") {
        console.log("Using enhancedInitializeChartDisplay");
        window.enhancedInitializeChartDisplay();
        return;
      }
      // Then try initializeChartDisplay
      else if (typeof window.initializeChartDisplay === "function") {
        console.log("Using initializeChartDisplay");
        window.initializeChartDisplay();
        return;
      }
      // Then try to use the displayComponents from chartDisplayComponents.js
      else if (
        window.displayComponents &&
        typeof displayComponents.displayAllComponents === "function"
      ) {
        console.log("Using displayComponents.displayAllComponents");
        displayComponents.displayAllComponents();
      }
      // Then try the individual display functions
      else if (
        typeof displayGeneralComponent === "function" &&
        typeof displayCashComponent === "function" &&
        typeof displayIncomeComponent === "function" &&
        typeof displayExpenseComponent === "function"
      ) {
        console.log("Displaying individual components");
        displayGeneralComponent();
        displayCashComponent();
        displayIncomeComponent();
        displayExpenseComponent();

        // Explicitly call displayReportComponent after delay to ensure data is processed
        setTimeout(() => {
          if (typeof displayReportComponent === "function") {
            console.log("Calling displayReportComponent after delay");
            displayReportComponent();
          } else {
            console.warn("displayReportComponent function not available");
          }

          // Re-initialize modals after charts have been displayed
          if (typeof ensureAllModalsExist === "function") {
            ensureAllModalsExist();
          }
        }, 1000);
      } else {
        console.error("Chart display functions not found");
        throw new Error("No chart display functions available");
      }
    } catch (error) {
      console.error("Error displaying charts:", error);
      if (typeof createToastWarning === "function") {
        createToastWarning("Error displaying charts: " + error.message);
      }
    }
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
    "daysCashOnHand",
    "daysExpensesInUnrestrictedNA",
    "daysExpensesInUnrestrictedNA_excludingPPE",
    "liquidityAssetsAvailableCover",
    "totalCoverageRatio",
    "totalContributions",
    "contributionsWithoutDR",
    "contributionsTrend",
    "annualizedInvestmentReturn",
    "functionalExpensePercent_program",
    "functionalExpensePercent_administrative",
    "functionalExpensePercent_fundraising",
    "costOfContributions",
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
