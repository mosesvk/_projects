// system-connector.js - Updated to work with existing qbApi.js and chart components
class SystemConnector {
  constructor() {
    this.initialized = false;
    this.isLoading = false;

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }
  }

  initialize() {
    if (this.initialized) return;

    // Set up a single run button listener to prevent duplicates
    const runButton = document.querySelector("#run");
    if (runButton) {
      // Replace the button to remove any existing listeners
      const newRunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newRunButton, runButton);

      // Add the unified listener
      newRunButton.addEventListener("click", () => this.handleRunButtonClick());
    }

    // Ensure required global functions exist
    this.checkRequiredFunctions();

    this.initialized = true;
    console.log("System Connector initialized");
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
  }

  async handleRunButtonClick() {
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
        chartManager.destroyAllCharts();
      }

      // Use existing ApiService if available, or try to create a new one
      const apiService =
        window.apiService || (window.ApiService ? new ApiService() : null);

      if (!apiService) {
        throw new Error("ApiService not available");
      }

      // Clear any existing record data
      apiService.clearRecords();

      // Fetch data from API
      const recordsPeer = await apiService.getRecordsForPeer(selectedYears);
      if (typeof countUniqueClients === "function") {
        countUniqueClients(recordsPeer);
      }

      const recordsClient = await apiService.getRecordsForClient(selectedYears);

      // Process data using the processApiCalls function
      if (typeof window.processApiCalls !== "function") {
        throw new Error("processApiCalls function not available");
      }

      window.processApiCalls(selectedYears, recordsPeer, recordsClient);

      // Display charts
      this.displayCharts();

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

  // Display charts
  displayCharts() {
    try {
      // First try to use the displayComponents from chartDisplayComponents.js
      if (window.displayComponents && typeof displayComponents.displayAllComponents === 'function') {
        displayComponents.displayAllComponents();
      } 
      // Then try the individual display functions
      else if (typeof displayGeneralComponent === 'function' &&
               typeof displayCashComponent === 'function' &&
               typeof displayIncomeComponent === 'function' &&
               typeof displayExpenseComponent === 'function') {
        
        displayGeneralComponent();
        displayCashComponent();
        displayIncomeComponent();
        displayExpenseComponent();
        
        // Explicitly call displayReportComponent after delay to ensure data is processed
        setTimeout(() => {
          if (typeof displayReportComponent === 'function') {
            console.log("Calling displayReportComponent after delay");
            displayReportComponent();
          }
          
          // Re-initialize modals after charts have been displayed
          ensureAllModalsExist();
        }, 500);
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

  initialize() {
    if (this.initialized) return;

    // Ensure all modals exist
    ensureAllModalsExist();

    // Set up a single run button listener to prevent duplicates
    const runButton = document.querySelector("#run");
    if (runButton) {
      // Replace the button to remove any existing listeners
      const newRunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newRunButton, runButton);

      // Add the unified listener
      newRunButton.addEventListener("click", () => this.handleRunButtonClick());
    }

    // Ensure required global functions exist
    this.checkRequiredFunctions();

    this.initialized = true;
    console.log("System Connector initialized");
  }
}

function ensureAllModalsExist() {
  // List of all expected modal names
  const modalNames = [
    "daysCashOnHand",
    "daysExpensesInUnrestrictedNA",
    "daysExpensesInUnrestrictedNA_excludingPPE",
    "liquidityAssetsAvailableCover",
    "totalCoverageRatio",
    "assetsWithoutPpeToLiabilitiesWithoutDebt",
    "contributionsTrend",
    "annualizedInvestmentReturn",
    "functionalExpensePercent_program",
    "functionalExpensePercent_administrative",
    "functionalExpensePercent_fundraising",
    "costOfContributionsDetailView",
    "costOfContributions",
    "functionalAllocation",
    "netAssetBreakdown",
    "changeInNetAssets",
    "totalContributions",
    "contributionsWithoutDR",
    "cashFlowsTrend",
  ];

  modalNames.forEach((name) => {
    const modalId = `${name}_modal`;
    let modal = document.getElementById(modalId);

    if (!modal) {
      console.log(`Creating missing modal container for ${name}`);

      // Create modal container with proper Flowbite modal classes
      modal = document.createElement("div");
      modal.id = modalId;
      modal.className =
        "hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full";
      modal.setAttribute("tabindex", "-1");
      modal.setAttribute("aria-hidden", "true");

      // Create the modal content structure according to Flowbite
      const modalContent = `
        <div class="relative p-4 w-full max-w-fit md:max-w-4xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <div data-accordion="collapse" data-active-classes="dark:bg-gray-800 colorBlue dark:text-white">
              <div class="rounded-t-lg backgroundGreen dark:border dark:border-2 px-5 py-2 flex">
                <h1 class="text-white font-bold text-center self-center">${name
                  .replace(/([A-Z])/g, " $1")
                  .replace(/_/g, " ")}</h1>
                <button type="button" class="text-white font-extrabold bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="${modalId}">
                  <svg class="w-3 h-3 font-bold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              
              <h2 id="${name}-heading-1">
                <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#${name}-body-1" aria-expanded="true" aria-controls="${name}-body-1">
                  <span>Support Data</span>
                  <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                  </svg>
                </button>
              </h2>
              
              <div id="${name}-body-1" class="hidden" aria-labelledby="${name}-heading-1">
                <div class="border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                  <div class="flex flex-col">
                    <div class="overflow-x-auto">
                      <div class="inline-block min-w-full align-middle">
                        <div class="relative overflow-x-auto shadow-md">
                          <table class="w-full text-lg text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-sm colorBlue uppercase backgroundGrey dark:bg-gray-700">
                              <tr id="${name}_modal_row"></tr>
                            </thead>
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 id="${name}-heading-2">
                <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right border border-b-0 border-gray-200 dark:border-gray-600 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3 text-gray-500 dark:text-gray-400" data-accordion-target="#${name}-body-2" aria-expanded="false" aria-controls="${name}-body-2">
                  <span>What does this mean?</span>
                  <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                  </svg>
                </button>
              </h2>
              
              <div id="${name}-body-2" class="hidden" aria-labelledby="${name}-heading-2">
                <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <p class="mb-2 text-gray-500 dark:text-gray-400">
                    Explanation for ${name} metric.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      modal.innerHTML = modalContent;

      // Add to document - try to find a dedicated modal container, or append to body
      const modalContainer =
        document.querySelector("#modalContainer") || document.body;
      modalContainer.appendChild(modal);

      // After adding to DOM, re-initialize any Flowbite components
      if (typeof initFlowbite === "function") {
        initFlowbite();
      } else if (
        window.flowbite &&
        typeof window.flowbite.initModals === "function"
      ) {
        window.flowbite.initModals();
      }
    }
  });
}

// Create a singleton instance
window.systemConnector = new SystemConnector();
