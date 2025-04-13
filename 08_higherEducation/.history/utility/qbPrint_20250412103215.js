// qbPrint.js - Ultra-Robust Version

/**
 * Streamlined chart processing with minimal overhead
 * 
 * @param {Array} chartMappings - Array of chart ID and field ID mappings
 * @returns {Promise<Array>} - Results of chart processing
 */
async function robustChartProcessing(chartMappings) {
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

  // Process charts in smaller batches to prevent browser overload
  const results = [];
  const batchSize = 3; // Process 3 charts at a time
  let completedCount = 0;
  
  // Process charts in batches
  for (let i = 0; i < chartMappings.length; i += batchSize) {
    const batch = chartMappings.slice(i, Math.min(i + batchSize, chartMappings.length));
    
    // Process this batch in parallel
    const batchPromises = batch.map(async ({ chartId, fieldId }) => {
      try {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) {
          console.warn(`Chart element not found: ${chartId}`);
          return { chartId, fieldId, base64String: null };
        }
        
        // Simple, direct capture of what's rendered in the DOM
        const canvas = await html2canvas(chartElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        
        // Get base64 string
        const base64String = canvas.toDataURL("image/png", 0.9).split(",")[1];
        return { chartId, fieldId, base64String };
      } catch (error) {
        console.error(`Error processing chart ${chartId}:`, error);
        return { chartId, fieldId, base64String: null };
      }
    });
    
    // Wait for all charts in this batch to finish
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Update progress
    completedCount += batch.length;
    if (progressBar) {
      const progressPercent = Math.floor((completedCount / chartMappings.length) * 100);
      progressBar.style.width = `${progressPercent}%`;
    }
    
    if (progressCount) {
      progressCount.textContent = `${completedCount}/${chartMappings.length}`;
    }
    
    // Small pause between batches to let the browser breathe
    if (i + batchSize < chartMappings.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Update final progress
  if (progressBar) progressBar.style.width = "100%";
  if (progressCount) progressCount.textContent = `${chartMappings.length}/${chartMappings.length}`;
  if (progressText) progressText.textContent = "Processing complete!";

  return results;
}

/**
 * Create optimized XML and handle large uploads safely
 * @param {Array} results - Chart processing results
 * @param {Object} metadata - Additional fields
 * @returns {string} - XML payload
 */
function createQuickbaseXml(results, metadata) {
  const parts = ["<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>"];
  
  // Add metadata
  Object.entries(metadata).forEach(([key, value]) => {
    if (value != null) {
      parts.push(`<field fid='${key}'>${value}</field>`);
    }
  });
  
  // Add chart images
  results.forEach(({ fieldId, base64String }) => {
    if (base64String) {
      parts.push(`<field fid='${fieldId}' filename='chart.png'>${base64String}</field>`);
    }
  });
  
  parts.push("</qdbapi>");
  return parts.join('');
}

/**
 * Send data to Quickbase with robust error handling
 * @param {string} xml - XML payload
 * @returns {Promise<object>} - Response
 */
async function sendToQuickbaseRobust(xml) {
  // Split into smaller payloads if needed (30MB limit for QuickBase)
  const maxSize = 25 * 1024 * 1024; // 25MB to be safe
  
  if (xml.length > maxSize) {
    throw new Error("Data payload exceeds QuickBase size limit. Please try processing fewer charts at once.");
  }
  
  // Try the API call with retries
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      console.log(`API attempt ${attempts + 1} of ${maxAttempts}`);
      
      return await $.ajax({
        type: "POST",
        contentType: "text/xml",
        url: "https://capincrouse.quickbase.com/db/buk93bd7x?a=API_AddRecord",
        dataType: "xml",
        processData: false,
        data: xml,
        timeout: 600,
      });
    } catch (error) {
      attempts++;
      console.error(`API attempt ${attempts} failed:`, error);
      
      if (attempts >= maxAttempts) {
        throw new Error(`QuickBase API failed after ${maxAttempts} attempts: ${error.statusText || error.message || "Unknown error"}`);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 500 * attempts));
    }
  }
}

/**
 * Robust chart export and upload
 */
async function robustChartExport() {
  console.time("Total Export Process");
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

    // Brief wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Chart mappings from the original qbPrint.js
    // Fix typo in original - netEducationalExpensePerStudent_chart had a typo in the original qbPrint.js
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
      { chartId: "netEducationalExpensePerStudent_chart", fieldId: 22 }, // Fixed from typo in original
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

    // Process charts in smaller batches
    console.time("Chart Processing");
    const results = await robustChartProcessing(validChartMappings);
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

    // Create XML
    console.time("XML Creation");
    const metadata = {
      31: clientName,
      32: uniqueClients.size
    };
    
    const xml = createQuickbaseXml(results, metadata);
    console.timeEnd("XML Creation");

    // Send to Quickbase with retries
    console.time("Quickbase Upload");
    
    // Update progress text to show we're now uploading
    const progressText = document.getElementById("chart-progress-text");
    if (progressText) {
      progressText.textContent = "Uploading to Quickbase...";
    }
    
    const response = await sendToQuickbaseRobust(xml);
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
    
    console.timeEnd("Total Export Process");
  } catch (error) {
    console.error("Error in robustChartExport:", error);
    createToastWarning(`Error creating presentation: ${error.message || "Unknown error"}`);
    console.timeEnd("Total Export Process");
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
 * Initialize robust export functionality
 */
function initRobustExport() {
  const printButton = document.getElementById("printCharts");
  if (!printButton) {
    console.error("Print button not found for robust export");
    return;
  }

  // Remove existing event listeners
  const newPrintButton = printButton.cloneNode(true);
  printButton.parentNode.replaceChild(newPrintButton, printButton);

  // Add robust export function
  newPrintButton.addEventListener("click", robustChartExport);
  
  console.log("Robust chart export functionality initialized");
}

// Initialize when document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRobustExport);
} else {
  initRobustExport();
}