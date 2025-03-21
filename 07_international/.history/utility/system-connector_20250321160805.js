// system-connector.js
// This file orchestrates the interactions between qbApi.js and chartIndex.js
// ensuring proper data flow and event handling

/**
 * SystemConnector Class
 *
 * Handles the coordination between data fetching, processing, and chart rendering
 * to ensure consistent application behavior and proper loading states.
 */
class SystemConnector {
  constructor() {
    // Setup flag to track initialization status
    this.initialized = false;

    // Track loading state
    this.isLoading = false;

    // Initialize the connector when the DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }
  }

  /**
   * Initialize the connector
   * Set up event listeners and connections between components
   */
  initialize() {
    if (this.initialized) return;

    // Connect run button to data flow if not already handled
    const runButton = document.querySelector("#run");
    if (runButton) {
      // Remove any existing listeners to prevent duplicates
      const newRunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newRunButton, runButton);

      // Add a single unified listener
      newRunButton.addEventListener("click", () => this.handleRunButtonClick());
    }

    // Mark as initialized
    this.initialized = true;
    console.log("System Connector initialized");
  }

  /**
   * Handle Run Button Click
   *
   * Centralized handler that coordinates:
   * 1. Loading indicators
   * 2. Data fetching
   * 3. Data processing
   * 4. Chart rendering
   */
  async handleRunButtonClick() {
    // Prevent multiple simultaneous requests
    if (this.isLoading) return;

    try {
      this.isLoading = true;

      // Show loading indicator
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("open", "api");
      }

      // Get selected years
      const selectedYears = this.getSelectedYears();

      // Process data - use appController directly if available
      if (window.appController) {
        // Use the AppController to handle data fetching and processing
        await this.processDataWithAppController(selectedYears);
      } else {
        // Legacy approach as fallback
        await this.processDataLegacy(selectedYears);
      }

      // Display charts after data is processed
      if (window.initializeChartDisplay) {
        window.initializeChartDisplay();
      } else if (window.displayComponents) {
        window.displayComponents.displayAllComponents();
      }

      // Hide loading indicator
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }

      console.log("Data processing and chart rendering complete");
    } catch (error) {
      console.error("Error in run button handler:", error);

      // Hide loading indicator even on error
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }

      // Display error message to user
      if (typeof createToastWarning === "function") {
        createToastWarning("Error processing data. Please try again.");
      }
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get and validate selected years
   */
  getSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears || !selectedYears.length) {
      createToastWarning("Please select year(s) for data to appear");
      throw new Error("No years selected.");
    }

    return selectedYears;
  }

  /**
   * Process data using the AppController
   */
  async processDataWithAppController(selectedYears) {
    // Clear existing data
    appController.dataStore.clear();
    appController.apiService.clear();

    // Save selected years to localStorage
    appController.saveSelectedYearsToLocalStorage(selectedYears);

    // Fetch peer and client records
    const recordsPeer = await appController.apiService.getRecordsForPeer(
      selectedYears
    );
    countUniqueClients(recordsPeer);

    const recordsClient = await appController.apiService.getRecordsForClient(
      selectedYears
    );

    // Process data
    appController.dataProcessor.processAllData(
      selectedYears,
      recordsPeer,
      recordsClient
    );
  }

  /**
   * Legacy data processing approach
   * For backward compatibility with older implementations
   */
  async processDataLegacy(selectedYears) {
    // Implement a fallback method that uses the appController methods
    console.warn("Using legacy data processing approach");

    if (window.appController && appController.apiService) {
      // Use appController methods if available
      const recordsPeer = await appController.apiService.getRecordsForPeer(
        selectedYears
      );
      if (recordsPeer) {
        countUniqueClients(recordsPeer);
      }

      const recordsClient = await appController.apiService.getRecordsForClient(
        selectedYears
      );

      appController.dataProcessor.processAllData(
        selectedYears,
        recordsPeer,
        recordsClient
      );
    } else {
      // If we really can't find any way to process data, throw error
      console.error("No data processing methods available");
      throw new Error("Data processing methods not available");
    }
  }
}

// Create a singleton instance
window.systemConnector = new SystemConnector();

// Export the connector for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SystemConnector };
}
