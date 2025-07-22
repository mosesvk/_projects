// qbPrint.js - Performance Optimized Version

/**
 * Process multiple charts in parallel with optimized rendering
 * 
 * @param {Array} chartMappings - Array of chart ID and field ID mappings
 * @returns {Promise<Array>} - Results of chart processing
 */
async function processChartsInParallel(chartMappings) {
  // Create progress tracking elements
  const loadingModal = document.getElementById("loadingApiDiv");
  let progressBar, progressCount, progressText;
  
  if (loadingModal) {
    const progressContainer = document.createElement("div");
    progressContainer.id = "chart-progress-container";
    progressContainer.className = "mt-6 px-3 py-1 w-full";

    progressContainer.innerHTML = `
      <div class="w-full">
        <div class="flex justify-between mb-1 text-white">
          <span id="chart-progress-text" class="text-lg font-medium">Processing charts</span>
          <span id="chart-progress-count" class="text-lg font-medium">0/${chartMappings.length}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div id="chart-progress-bar" class="backgroundGreen h-2.5 rounded-full" style="width: 0%"></div>
        </div>
      </div>
    `;

    const loadingContent = loadingModal.querySelector("#loadingApiInnerDiv") || loadingModal;
    loadingContent.appendChild(progressContainer);
    
    progressBar = document.getElementById("chart-progress-bar");
    progressCount = document.getElementById("chart-progress-count");
    progressText = document.getElementById("chart-progress-text");
  }

  // Create a map to store results
  const resultsMap = new Map();
  let completedCount = 0;

  // Process charts in parallel but in batches to avoid overwhelming the browser
  const batchSize = 5; // Process 5 charts at a time
  const updateProgress = () => {
    completedCount++;
    
    if (progressBar) {
      const progressPercent = Math.floor((completedCount / chartMappings.length) * 100);
      progressBar.style.width = `${progressPercent}%`;
    }
    
    if (progressCount) {
      progressCount.textContent = `${completedCount}/${chartMappings.length}`;
    }
  };

  // Process a single chart optimally
  const processChart = async (chartId, fieldId) => {
    try {
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.warn(`Chart element not found: ${chartId}`);
        resultsMap.set(fieldId, null);
        updateProgress();
        return;
      }

      // Try to get a reference to the ApexCharts instance
      const chart = window[chartId] || (window.chartManager && window.chartManager.getChart(chartId));
      
      // Direct, optimized rendering based on chart type
      if (chart && typeof chart.dataURI === "function") {
        // Use ApexCharts' built-in export - faster than creating a new chart
        try {
          // Set temporary export options if possible
          const originalHeight = chart.w.globals.dom.Paper.node.parentNode.getAttribute('height');
          const originalWidth = chart.w.globals.dom.Paper.node.parentNode.getAttribute('width');
          
          // Temporarily increase chart size for better quality (if possible)
          chart.w.globals.dom.Paper.node.parentNode.setAttribute('height', '400');
          chart.w.globals.dom.Paper.node.parentNode.setAttribute('width', '900');
          
          // Get data URI directly from existing chart
          const uri = await chart.dataURI({ scale: 2 });
          
          // Restore original dimensions
          chart.w.globals.dom.Paper.node.parentNode.setAttribute('height', originalHeight);
          chart.w.globals.dom.Paper.node.parentNode.setAttribute('width', originalWidth);
          
          const base64String = uri.imgURI.split(",")[1];
          resultsMap.set(fieldId, base64String);
          updateProgress();
          return;
        } catch (directExportError) {
          console.log(`Direct export failed for ${chartId}, falling back to html2canvas`);
          // Fall back to html2canvas
        }
      }
      
      // HTML2Canvas fallback with optimized settings
      const originalHeight = chartElement.style.height;
      const originalOverflow = chartElement.style.overflow;
      const originalPosition = chartElement.style.position;
      
      // Set styles for capture
      chartElement.style.height = "auto";
      chartElement.style.overflow = "visible";
      
      // Fast html2canvas capture
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--chart-bg-color") || "#ffffff",
        logging: false, // Disable logging for performance
      });
      
      // Restore original styles
      chartElement.style.height = originalHeight;
      chartElement.style.overflow = originalOverflow;
      chartElement.style.position = originalPosition;
      
      // Get base64 string
      const base64String = canvas.toDataURL("image/png").split(",")[1];
      resultsMap.set(fieldId, base64String);
    } catch (error) {
      console.error(`Error processing chart ${chartId}:`, error);
      resultsMap.set(fieldId, null);
    }
    
    updateProgress();
  };

  // Process charts in batches
  for (let i = 0; i < chartMappings.length; i += batchSize) {
    const batch = chartMappings.slice(i, i + batchSize);
    
    // Process batch in parallel
    await Promise.all(
      batch.map(({ chartId, fieldId }) => processChart(chartId, fieldId))
    );
    
    // Small pause between batches to let browser breathe
    if (i + batchSize < chartMappings.length) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // Compile results in the same order as input
  const results = chartMappings.map(({ chartId, fieldId }) => ({
    chartId,
    fieldId,
    base64String: resultsMap.get(fieldId)
  }));

  // Update final progress
  if (progressBar) progressBar.style.width = "100%";
  if (progressCount) progressCount.textContent = `${chartMappings.length}/${chartMappings.length}`;
  if (progressText) progressText.textContent = "Processing complete!";

  return results;
}

/**
 * Optimized XML creation for Quickbase
 * @param {Array} results - Chart processing results with base64 data
 * @param {Object} metadata - Additional data to include
 * @returns {string} - Complete XML payload
 */
function createQuickbaseXml(results, metadata) {
  // Start with header
  let xml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";
  
  // Add metadata
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== null && value !== undefined) {
      xml += `<field fid='${key}'>${value}</field>`;
    }
  }
  
  // Add chart images
  for (const { fieldId, base64String } of results) {
    if (base64String) {
      xml += `<field fid='${fieldId}' filename='chart.png'>${base64String}</field>`;
    }
  }
  
  // Close XML
  xml += "</qdbapi>";
  
  return xml;
}

/**
 * Send data to Quickbase with optimized settings
 * @param {string} xml - XML payload
 * @returns {Promise<object>} - Response
 */
async function sendToQuickbase(xml) {
  try {
    return await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/buk93bd7x?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 90000, // Increased timeout for large payloads
    });
  } catch (error) {
    const errorMessage = error.responseText || error.statusText || error.message || "Unknown error";
    throw new Error(`Quickbase API error: ${errorMessage}`);
  }
}

/**
 * Optimized and faster chart export function
 */
async function fastChartExport() {
  showApiLoadingFunction("open", "print");

  const printButton = document.getElementById("printCharts");
  if (!printButton) {
    console.error("Print button not found");
    showApiLoadingFunction("close", "print");
    return;
  }

  // Update button state
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
    // Show all content sections for chart rendering
    const sections = [
      "FinancialPositionContent",
      "RevenueAndExpenseContent",
      "DebtAndEndowmentContent"
    ];
    
    const hiddenSections = [];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element && element.classList.contains("hidden")) {
        element.classList.remove("hidden");
        hiddenSections.push(element);
      }
    });

    // Very brief wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 10));

    // Define chart mappings - preserved from original qbPrint.js
    const chartMappings = [
      { chartId: "cfiRatio_chart", fieldId: 6 },
      { chartId: "cfi_primaryReserveRatio_chart", fieldId: 7 },
      { chartId: "cfi_netIncomeOperationsRatio_chart", fieldId: 8 },
      { chartId: "cfi_returnOnNetAssets_chart", fieldId: 10 },
      { chartId: "cfi_viabilityRatio_chart", fieldId: 11 },
      { chartId: "FinancialPosition_chart", fieldId: 12 },
      { chartId: "assetToLiabilities_chart", fieldId: 13 },
      { chartId: "sourceOfIncomeClient_chart", fieldId: 14 },
      { chartId: "sourceOfIncomePeer_chart", fieldId: 15 },
      { chartId: "ffa_chart", fieldId: 16 },
      { chartId: "cashFlowsTrend_chart", fieldId: 17 },
      { chartId: "currentRatio_chart", fieldId: 18 },
      { chartId: "salariesBenefitsToTotalExpense_chart", fieldId: 19 },
      { chartId: "salariesBenefitsPerNetTuition_chart", fieldId: 20 },
      { chartId: "netEducationalExpensePerStudent_chart", fieldId: 22 },
      { chartId: "annualTraditionalNetTuitionPerStudent_chart", fieldId: 23 },
      { chartId: "tuitionDependency_chart", fieldId: 24 },
      { chartId: "tuitionDiscountRate_chart", fieldId: 25 },
      { chartId: "ltDebtPerTotalOperatingRevenue_chart", fieldId: 26 },
      { chartId: "debtServiceCoverageRatio_chart", fieldId: 27 },
      { chartId: "debtBurdenRatio_chart", fieldId: 28 },
      { chartId: "endowmentOperatingBudget_chart", fieldId: 29 },
      { chartId: "endowmentAssetsPerStudent_chart", fieldId: 30 }
    ];

    // Filter to only include charts that exist in the DOM
    const validChartMappings = chartMappings.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    // Process charts in parallel with optimized rendering
    console.time("Chart Processing");
    const results = await processChartsInParallel(validChartMappings);
    console.timeEnd("Chart Processing");

    // Count successful exports
    const successfulExports = results.filter(r => r.base64String !== null).length;
    console.log(`Successfully exported ${successfulExports} of ${validChartMappings.length} charts`);

    if (successfulExports === 0) {
      throw new Error("No charts were successfully exported");
    }

    // Hide sections that were previously hidden
    hiddenSections.forEach(element => {
      element.classList.add("hidden");
    });

    // Create XML - optimized for memory usage
    console.time("XML Creation");
    const metadata = {
      31: clientName,
      32: uniqueClients.size
    };
    
    const xml = createQuickbaseXml(results, metadata);
    console.timeEnd("XML Creation");

    // Send to Quickbase
    console.time("Quickbase Upload");
    const response = await sendToQuickbase(xml);
    console.timeEnd("Quickbase Upload");
    
    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();
    
    if (errorCode === "0") {
      const recordId = xmlResponse.find("qdbapi").find("rid").text();
      createToastSuccess(`Charts successfully uploaded to Quickbase. Record ID: ${recordId}`);
    } else {
      const errorText = xmlResponse.find("qdbapi").find("errtext").text() || "Unknown error";
      throw new Error(`Quickbase returned error ${errorCode}: ${errorText}`);
    }
  } catch (error) {
    console.error("Error in fastChartExport:", error);
    createToastWarning(`Error creating presentation: ${error.message || "Unknown error"}`);
  } finally {
    // Restore button state
    printButton.disabled = false;
    printButton.innerHTML = originalButtonContent;

    // Remove progress tracking container
    const progressContainer = document.getElementById("chart-progress-container");
    if (progressContainer && progressContainer.parentNode) {
      progressContainer.parentNode.removeChild(progressContainer);
    }
    
    showApiLoadingFunction("close", "print");
  }
}

/**
 * Initialize optimized export functionality
 */
function initOptimizedExport() {
  const printButton = document.getElementById("printCharts");
  if (!printButton) {
    console.error("Print button not found for optimized export");
    return;
  }

  // Remove existing event listeners
  const newPrintButton = printButton.cloneNode(true);
  printButton.parentNode.replaceChild(newPrintButton, printButton);

  // Add optimized export function
  newPrintButton.addEventListener("click", fastChartExport);
  
  console.log("Optimized chart export functionality initialized");
}

// Initialize when document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOptimizedExport);
} else {
  initOptimizedExport();
}