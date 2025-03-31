// print_base64.js

/**
 * Process charts with improved spacing for export
 * This function fixes the ReferenceError in apexChartsExportPrint
 * 
 * @param {Array} chartMappings - Array of chart ID and field ID mappings
 * @returns {Promise<Array>} - Results of chart processing
 */
async function processChartsWithSpacing(chartMappings) {
  console.log(`Processing ${chartMappings.length} charts for export`);
  
  const results = [];
  const startTime = performance.now();
  
  // Create progress modal if it doesn't exist
  let progressModal = document.getElementById('chart-progress-modal');
  if (!progressModal) {
    progressModal = document.createElement('div');
    progressModal.id = 'chart-progress-modal';
    progressModal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75';
    progressModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-full">
        <div class="mb-4 text-center">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Exporting Charts</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we process your charts</p>
        </div>
        <div class="mb-4">
          <div class="flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span id="chart-progress-text">Processing chart...</span>
            <span id="chart-progress-count">0/${chartMappings.length}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div id="chart-progress-bar" class="backgroundGreen h-2.5 rounded-full" style="width: 0%"></div>
          </div>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <p id="chart-current-name" class="truncate">Initializing...</p>
        </div>
      </div>
    `;
    document.body.appendChild(progressModal);
  } else {
    // Reset progress if modal exists
    document.getElementById('chart-progress-bar').style.width = '0%';
    document.getElementById('chart-progress-count').textContent = `0/${chartMappings.length}`;
    document.getElementById('chart-current-name').textContent = 'Initializing...';
    progressModal.classList.remove('hidden');
  }
  
  // Process charts sequentially to avoid overwhelming the browser
  for (let i = 0; i < chartMappings.length; i++) {
    const { chartId, fieldId } = chartMappings[i];
    try {
      const chartStartTime = performance.now();
      console.log(`Processing chart: ${chartId}...`);
      
      // Update progress UI
      const progressPercent = Math.floor((i / chartMappings.length) * 100);
      document.getElementById('chart-progress-bar').style.width = `${progressPercent}%`;
      document.getElementById('chart-progress-count').textContent = `${i}/${chartMappings.length}`;
      document.getElementById('chart-current-name').textContent = `Processing: ${chartId}`;
      document.getElementById('chart-progress-text').textContent = `Processing chart...`;
      
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.warn(`Chart element not found: ${chartId}`);
        results.push({ chartId, fieldId, base64String: null });
        continue;
      }
      
      // Use html2canvas to capture the chart
      const canvas = await html2canvas(chartElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color') || '#ffffff'
      });
      
      // Convert canvas to base64 PNG
      const base64String = canvas.toDataURL('image/png').split(',')[1];
      results.push({ chartId, fieldId, base64String });
      
      const chartEndTime = performance.now();
      console.log(`Chart ${chartId} processed in ${(chartEndTime - chartStartTime).toFixed(2)}ms`);
      
      // Small timeout to prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error(`Error processing chart ${chartId}:`, error);
      results.push({ chartId, fieldId, base64String: null });
    }
  }
  
  // Final progress update
  document.getElementById('chart-progress-bar').style.width = '100%';
  document.getElementById('chart-progress-count').textContent = `${chartMappings.length}/${chartMappings.length}`;
  document.getElementById('chart-progress-text').textContent = 'Processing complete!';
  document.getElementById('chart-current-name').textContent = 'All charts processed';
  
  // Remove the progress modal after a delay
  setTimeout(() => {
    const progressModal = document.getElementById('chart-progress-modal');
    if (progressModal) {
      progressModal.classList.add('hidden');
    }
  }, 1000);
  
  const endTime = performance.now();
  console.log(`All charts processed in ${(endTime - startTime).toFixed(2)}ms`);
  
  return results;
}

/**
 * Enhanced version of mainPrint using ApexCharts dataURI with better spacing
 */
async function apexChartsExportPrint() {
  const totalStartTime = performance.now();
  console.log("Starting chart export process...");

  showApiLoadingFunction("open", "print");

  const printButton = document.getElementById("printBase64");
  if (!printButton) {
    console.error("Print button not found");
    return;
  }

  // Store original button state to restore later
  const originalButtonContent = printButton.innerHTML;
  printButton.disabled = true;
  printButton.innerHTML = `
    <div class="flex items-center justify-center">
      <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C  47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
      <span class="font-medium">Exporting Charts...</span>
    </div>`;

  try {
    // Show all sections for rendering, if needed
    const showSectionsStartTime = performance.now();
    const sections = [
      "GeneralContent",
      "cashContent",
      "netAssetsContent",
      "incomeContent",
      "expenseContent",
    ];
    const hiddenSections = [];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element && element.classList.contains("hidden")) {
        element.classList.remove("hidden");
        hiddenSections.push(element); // Track which ones we unhid
      }
    });

    // Wait for DOM to update
    await new Promise((resolve) => setTimeout(resolve, 200));

    const showSectionsEndTime = performance.now();
    console.log(
      `Showing sections took ${(
        showSectionsEndTime - showSectionsStartTime
      ).toFixed(2)}ms`
    );

    // Define all chart IDs and their corresponding field IDs
    const chartMappings = [
      { chartId: "statementCashFlows_chart", fieldId: 8 },
      { chartId: "daysCashOnHand_chart", fieldId: 9 },
      { chartId: "daysExpensesInUnrestrictedNA_chart", fieldId: 10 },
      {
        chartId: "daysExpensesInUnrestrictedNA_excludingPPE_chart",
        fieldId: 11,
      },
      { chartId: "totalCoverageRatio_chart", fieldId: 12 },
      { chartId: "contributionsTrend_chart", fieldId: 13 },
      { chartId: "annualizedInvestmentReturn_chart", fieldId: 14 },
      { chartId: "functionalExpensePercent_program_chart", fieldId: 15 },
      { chartId: "functionalExpensePercent_administrative_chart", fieldId: 16 },
      { chartId: "functionalExpensePercent_fundraising_chart", fieldId: 17 },
      { chartId: "costOfContributions_chart", fieldId: 18 },
      { chartId: "netAssetBreakdown_chart", fieldId: 25 },
      { chartId: "changeInNetAssets_chart", fieldId: 26 },
      { chartId: "liquidityAssetsAvailableCover_chart", fieldId: 27 },
      {
        chartId: "assetsWithoutPpeToLiabilitiesWithoutDebt_chart",
        fieldId: 28,
      },
      { chartId: "totalContributions_chart", fieldId: 29 },
      { chartId: "contributionsWithoutDR_chart", fieldId: 30 },
      { chartId: "functionalAllocation_chart", fieldId: 31 },
      { chartId: "costOfContributionsDetailView_chart", fieldId: 32 },
    ];

    // Filter out any charts that don't exist in the DOM
    const filterStartTime = performance.now();
    const validChartMappings = chartMappings.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );
    const filterEndTime = performance.now();
    console.log(
      `Filtering chart mappings took ${(
        filterEndTime - filterStartTime
      ).toFixed(2)}ms`
    );

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    // Process charts with improved spacing
    const processingStartTime = performance.now();
    const results = await processChartsWithSpacing(validChartMappings);
    const processingEndTime = performance.now();
    console.log(
      `Processing all charts took ${(
        processingEndTime - processingStartTime
      ).toFixed(2)}ms`
    );

    // Count successful exports
    const successfulExports = results.filter(
      (r) => r.base64String !== null
    ).length;
    console.log(
      `Successfully exported ${successfulExports} of ${validChartMappings.length} charts`
    );

    // Create a results summary modal
    const summaryModal = document.createElement('div');
    summaryModal.id = 'chart-summary-modal';
    summaryModal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75';
    summaryModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-full">
        <div class="mb-4 text-center">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Export Summary</h3>
        </div>
        <div class="mb-4">
          <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-700 dark:text-green-400" role="alert">
            <div class="flex items-center justify-between">
              <span class="font-medium">Process completed!</span>
              <span>${(processingEndTime - processingStartTime).toFixed(2)}ms</span>
            </div>
            <div class="mt-2">Successfully exported ${successfulExports} of ${validChartMappings.length} charts</div>
          </div>
        </div>
        <div class="flex justify-end">
          <button id="close-summary-modal" type="button" class="px-4 py-2 backgroundBlue text-white text-sm font-medium rounded-lg">
            Continue
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(summaryModal);
    
    // Add event listener to close button
    document.getElementById('close-summary-modal').addEventListener('click', () => {
      document.getElementById('chart-summary-modal').remove();
    });
    
    // Auto close after 3 seconds
    setTimeout(() => {
      const modal = document.getElementById('chart-summary-modal');
      if (modal) modal.remove();
    }, 3000);

    if (successfulExports === 0) {
      throw new Error("No charts were successfully exported");
    }

    // Hide sections that were previously hidden
    hiddenSections.forEach((element) => {
      element.classList.add("hidden");
    });

    // Build XML request with metadata and chart images
    const xmlBuildStartTime = performance.now();
    let uploadXml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";

    // Add metadata first
    const selectedYears = getSelectedYearsFromLocalStorage()
    const uniqueClients = document.getElementById('uniqueClients').innerHTML

    uploadXml += createFieldXml(171, ClientRid);
    uploadXml += createFieldXml(7, firmName);
    uploadXml += createFieldXml(6, uniqueClients);
    uploadXml += createFieldXml(23, selectedYears[0]);
    uploadXml += createFieldXml(24, selectedYears[selectedYears.length - 1]);

    // Add base64 images for charts
    results.forEach((result) => {
      if (result && result.base64String) {
        uploadXml += createImageFieldXml(result.fieldId, result.base64String);
      }
    });

    uploadXml += "</qdbapi>";
    const xmlBuildEndTime = performance.now();
    console.log(
      `Building XML payload took ${(
        xmlBuildEndTime - xmlBuildStartTime
      ).toFixed(2)}ms, size: ${uploadXml.length} bytes`
    );

    // Send to Quickbase
    console.log("Sending data to Quickbase...");
    const sendStartTime = performance.now();
    const response = await sendToQuickbase(uploadXml);
    const sendEndTime = performance.now();
    console.log(
      `Sending data to Quickbase took ${(sendEndTime - sendStartTime).toFixed(
        2
      )}ms`
    );

    // Process response
    const responseStartTime = performance.now();
    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();
    const responseEndTime = performance.now();
    console.log(
      `Processing Quickbase response took ${(
        responseEndTime - responseStartTime
      ).toFixed(2)}ms`
    );

    showApiLoadingFunction("close", "print");

    if (errorCode === "0") {
      const recordId = xmlResponse.find("qdbapi").find("rid").text();
      createToastSuccess(
        `Charts successfully uploaded to Quickbase. Record ID: ${recordId}`
      );
    } else {
      const errorText =
        xmlResponse.find("qdbapi").find("errtext").text() || "Unknown error";
      throw new Error(`Quickbase returned error ${errorCode}: ${errorText}`);
    }
  } catch (error) {
    showApiLoadingFunction("close", "print");
    console.error("Error in apexChartsExportPrint:", error);
    createToastWarning(
      `Error creating presentation: ${error.message || "Unknown error"}`
    );
  } finally {
    // Restore button state
    printButton.disabled = false;
    printButton.innerHTML = originalButtonContent;

    // Clean up any remaining UI elements
    const progressModal = document.getElementById('chart-progress-modal');
    if (progressModal) progressModal.classList.add('hidden');

    const totalEndTime = performance.now();
    const totalTime = totalEndTime - totalStartTime;
    const totalTimeFormatted = new Date(totalTime)
      .toISOString()
      .substring(14, 23); // Format as MM:SS.sss

    console.log(`===============================================`);
    console.log(
      `TOTAL EXPORT PROCESS TIME: ${totalTimeFormatted} (${totalTime.toFixed(
        2
      )}ms)`
    );
    console.log(`===============================================`);
  }
}

/**
 * Create XML field entry for a value
 * @param {string|number} id - Field ID
 * @param {string|number} val - Value to upload
 * @returns {string} - XML field entry
 */
function createFieldXml(id, val) {
  if (val === null || val === undefined) {
    console.warn(`Skipping upload for field ${id} due to null/undefined value`);
    return "";
  }

  if (typeof val === "object") {
    console.warn(`Invalid value type for field ${id}:`, typeof val);
    return "";
  }

  return `<field fid='${id}'>${val}</field>`;
}

/**
 * Create XML field entry for an image
 * @param {string|number} id - Field ID
 * @param {string} val - Base64 image data
 * @returns {string} - XML field entry for image
 */
function createImageFieldXml(id, val) {
  if (!val) {
    console.warn(`Skipping image upload for field ${id} - missing data`);
    return "";
  }
  return `<field fid='${id}' filename='chart.png'>${val}</field>`;
}

/**
 * Send record to Quickbase
 * @param {string} xml - XML payload to send
 * @returns {Promise<object>} - Response data
 */
async function sendToQuickbase(xml) {
  const startTime = performance.now();
  try {
    const response = await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 60000, // 60-second timeout (increased from 30)
    });

    const endTime = performance.now();
    console.log(
      `Quickbase API call completed successfully in ${(
        endTime - startTime
      ).toFixed(2)}ms`
    );
    return response;
  } catch (error) {
    const endTime = performance.now();
    const errorMessage =
      error.responseText ||
      error.statusText ||
      error.message ||
      "Unknown error";
    console.error(
      `Quickbase API error after ${(endTime - startTime).toFixed(2)}ms:`,
      errorMessage
    );
    throw new Error(`Quickbase API error: ${errorMessage}`);
  }
}

/**
 * Initialize the ApexCharts export print functionality
 */
function initApexChartsPrintFunction() {
  const printButton = document.getElementById("printBase64");
  if (!printButton) {
    console.error(
      "Print button not found for ApexCharts export print functionality"
    );
    return;
  }

  // Remove existing event listeners
  const newPrintButton = printButton.cloneNode(true);
  printButton.parentNode.replaceChild(newPrintButton, printButton);

  // Add ApexCharts export print function
  newPrintButton.addEventListener("click", () => {
    apexChartsExportPrint();
  });

  console.log("ApexCharts export print functionality initialized");
}

// Initialize when document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApexChartsPrintFunction);
} else {
  initApexChartsPrintFunction();
}