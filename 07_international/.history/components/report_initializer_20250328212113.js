/**
 * QuickBase Report Initializer
 *
 * This script initializes all components required for the QuickBase report integration
 * and attaches them to the appropriate event listeners.
 */
(function () {
  // Configuration
  const CONFIG = {
    debug: true, // Set to false in production
    validateXml: true, // Set to true to validate XML before sending
    patchAutoReport: true, // Set to true to remove automatic report triggering
    useValidator: true, // Set to true to use the validator
  };

  // Log message with prefix
  function log(message, type = "info") {
    if (!CONFIG.debug && type === "debug") return;

    const prefix = "[QuickBase Init]";

    switch (type) {
      case "error":
        console.error(`${prefix} ${message}`);
        break;
      case "warn":
        console.warn(`${prefix} ${message}`);
        break;
      case "debug":
        console.log(`${prefix} (DEBUG) ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Initialize all QuickBase report components
   */
  function initialize() {
    log("Initializing QuickBase Report integration");

    // Add a function to check for required functions
    function checkRequiredFunctions() {
      if (typeof window.createPrintExcel === "function") {
        log("All required functions are available");
        completeInitialization();
      } else {
        // Try again after a short delay
        log("Waiting for createPrintExcel to become available...");
        setTimeout(checkRequiredFunctions, 100);
      }
    }

    // Move the initialization logic to this function
    function completeInitialization() {
      // Apply patches to report component to prevent automatic triggering
      if (CONFIG.patchAutoReport) {
        patchAutomaticReportTrigger();
      }

      // Initialize validator if needed
      if (CONFIG.useValidator) {
        initializeValidator();
      }

      // Modify the report link handler
      patchReportLinkHandler();

      // Enhance the QuickBase integration
      enhanceQuickBaseIntegration();

      // Attach event listeners
      attachEventListeners();

      log("QuickBase Report integration initialized successfully");
    }

    // Start checking for required functions
    checkRequiredFunctions();
  }

  /**
   * Patch automatic report triggering
   */
  function patchAutomaticReportTrigger() {
    log("Patching automatic report trigger");

    // Remove existing chartsRendered event handlers that trigger reports
    const existingHandlers = window._chartRenderedHandlers || [];
    if (existingHandlers.length > 0) {
      existingHandlers.forEach((handler) => {
        document.removeEventListener("chartsRendered", handler);
      });
      log(
        `Removed ${existingHandlers.length} existing chartsRendered handlers`
      );
    }

    // Store new handlers
    window._chartRenderedHandlers = [];

    // Add our custom handler
    const customHandler = function (e) {
      log("Charts rendered event received - NOT auto-generating report");

      // Signal that charts are ready, but don't generate report
      const reportLink = document.getElementById("reportLink");
      if (reportLink) {
        reportLink.classList.remove("disabled");
        reportLink.setAttribute("data-charts-ready", "true");
      }
    };

    // Add and store handler
    document.addEventListener("chartsRendered", customHandler);
    window._chartRenderedHandlers.push(customHandler);

    log("Automatic report trigger patched successfully");
  }

  /**
   * Initialize validator
   */
  function initializeValidator() {
    log("Initializing validator");

    if (window.QuickBaseValidator) {
      if (CONFIG.validateXml) {
        // Intercept printToExcel to validate XML
        window.QuickBaseValidator.interceptPrintToExcel();
      }

      // Run other validators
      window.QuickBaseValidator.validateUploadToFile();

      log("Validator initialized successfully");
    } else {
      log("QuickBaseValidator not available", "warn");
    }
  }

  /**
   * Patch report link handler
   */
  function patchReportLinkHandler() {
    log("Patching report link handler");

    const reportLink = document.getElementById("reportLink");
    if (!reportLink) {
      log("Report link not found in DOM", "warn");
      return;
    }

    // Remove existing click handlers by cloning
    const newReportLink = reportLink.cloneNode(true);
    reportLink.parentNode.replaceChild(newReportLink, reportLink);

    // Add new click handler
    newReportLink.addEventListener("click", function (e) {
      log("Report link clicked");

      // Show report tab first
      showReportTab();

      // Check if data is available
      if (!isDataReady()) {
        log("No data available for report", "warn");
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "Please select years and run the query to load data first."
          );
        }
        return;
      }

      // Generate report
      generateReport();
    });

    log("Report link handler patched successfully");
  }

  /**
   * Enhance QuickBase integration
   */
  function enhanceQuickBaseIntegration() {
    log('Enhancing QuickBase integration');
    
    // Delay enhancements until createPrintExcel is available
    if (typeof window.createPrintExcel !== 'function') {
      log('createPrintExcel not available yet, waiting...');
      setTimeout(enhanceQuickBaseIntegration, 100);
      return;
    }
  
    // Now safe to enhance createFileForPrint
    if (typeof window.createFileForPrint === 'function') {
      const originalCreateFileForPrint = window.createFileForPrint;
      
      window.createFileForPrint = function(name, fIdArray, begin, end, avg, mid, min, max, peer, data) {
        log(`Creating file for print: ${name} with field IDs: ${fIdArray}`);
        
        // Ensure values are numbers
        avg = typeof avg === 'number' ? avg : parseFloat(avg) || 0;
        mid = typeof mid === 'number' ? mid : parseFloat(mid) || 0;
        min = typeof min === 'number' ? min : parseFloat(min) || 0;
        max = typeof max === 'number' ? max : parseFloat(max) || 0;
        
        // Call original function
        return originalCreateFileForPrint(name, fIdArray, begin, end, avg, mid, min, max, peer, data);
      };
      
      log('createFileForPrint enhanced successfully');
    } else {
      log('createFileForPrint not available', 'warn');
    }
    
    // Enhance createPrintExcel (now we're sure it exists)
    const originalCreatePrintExcel = window.createPrintExcel;
    
    window.createPrintExcel = function() {
      log('Creating print Excel');
      
      // Ensure data is prepared
      prepareAllFieldData();
      
      // Call original function
      return originalCreatePrintExcel();
    };
    
    log('createPrintExcel enhanced successfully');
  }

  /**
   * Prepare all field data for QuickBase export
   */
  function prepareAllFieldData() {
    log("Preparing all field data for QuickBase export");

    // If QuickBaseReportIntegration is available, use it
    if (
      window.QuickBaseReportIntegration &&
      typeof window.QuickBaseReportIntegration.prepareAllFieldData ===
        "function"
    ) {
      window.QuickBaseReportIntegration.prepareAllFieldData();
      return;
    }

    // If the function is not available, create it
    // (Implementation is in QuickBase Report Integration artifact)
    log("prepareAllFieldData function not available", "warn");
  }

  /**
   * Check if data is ready
   */
  function isDataReady() {
    return localStorage.getItem("generalData") !== null;
  }

  /**
   * Show report tab
   */
  function showReportTab() {
    // Hide all content tabs
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.add("hidden");
    });

    // Show reports tab
    const reportsTab = document.getElementById("reportsContent");
    if (reportsTab) {
      reportsTab.classList.remove("hidden");
    }

    // Update active state on sidebar links
    document.querySelectorAll("#sidebar button").forEach((button) => {
      button.classList.remove("active", "bg-gray-300", "dark:bg-gray-700");
    });

    // Set reports link as active
    const reportsLink = document.getElementById("reportLink");
    if (reportsLink) {
      reportsLink.classList.add("active", "bg-gray-300", "dark:bg-gray-700");
    }
  }

  /**
   * Generate report
   */
  function generateReport() {
    log("Generating report");

    if (typeof window.displayReportComponent === "function") {
      try {
        window.displayReportComponent();
        log("Report generated successfully");

        // Show generate reports button
        const generateReportsBtn = document.getElementById("generateReports");
        if (generateReportsBtn) {
          generateReportsBtn.classList.remove("hidden");
        }
      } catch (error) {
        log(`Error generating report: ${error.message}`, "error");
        if (typeof createToastWarning === "function") {
          createToastWarning(`Error generating report: ${error.message}`);
        }
      }
    } else {
      log("displayReportComponent function not available", "warn");
    }
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    log("Attaching event listeners");

    // Generate reports button
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      // Remove existing listeners
      const newButton = generateReportsBtn.cloneNode(true);
      generateReportsBtn.parentNode.replaceChild(newButton, generateReportsBtn);

      // Add new listener
      newButton.addEventListener("click", handleGenerateReportsClick);
      log("Generate reports button event listener attached");
    } else {
      log("Generate reports button not found in DOM", "warn");
    }

    log("Event listeners attached successfully");
  }

  /**
   * Handle generate reports button click
   */
  function handleGenerateReportsClick() {
    log("Generate reports button clicked");

    const button = document.getElementById("generateReports");
    if (!button) return;

    // Show loading state
    if (typeof toggleButtonLoadingState === "function") {
      toggleButtonLoadingState(button);
    } else {
      button.disabled = true;
      button.textContent = "Generating...";
    }

    // Ensure data is prepared
    prepareAllFieldData();

    // Generate Excel report
    setTimeout(() => {
      if (typeof window.createPrintExcel === "function") {
        window
          .createPrintExcel()
          .then(() => {
            log("Excel report generated successfully");

            // Restore button state
            if (typeof toggleButtonNormalState === "function") {
              toggleButtonNormalState(button);
            } else {
              button.disabled = false;
              button.textContent = "Generate Reports";
            }
          })
          .catch((error) => {
            log(`Error generating Excel report: ${error.message}`, "error");
            if (typeof createToastWarning === "function") {
              createToastWarning(
                `Error generating Excel report: ${error.message}`
              );
            }

            // Restore button state
            if (typeof toggleButtonNormalState === "function") {
              toggleButtonNormalState(button);
            } else {
              button.disabled = false;
              button.textContent = "Generate Reports";
            }
          });
      } else {
        log("createPrintExcel function not available", "warn");
        if (typeof createToastWarning === "function") {
          createToastWarning("Excel report generator not available");
        }

        // Restore button state
        if (typeof toggleButtonNormalState === "function") {
          toggleButtonNormalState(button);
        } else {
          button.disabled = false;
          button.textContent = "Generate Reports";
        }
      }
    }, 300);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
