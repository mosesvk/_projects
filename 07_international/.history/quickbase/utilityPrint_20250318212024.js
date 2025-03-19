/**
 * Converts an SVG chart element to a PNG Base64 string
 * @param {HTMLElement} element - The DOM element containing the chart
 * @param {string} id - Identifier for the chart
 * @returns {Promise<string|null>} - Base64 encoded PNG or null if conversion fails
 */
async function svgToPngBase64(element, id) {
  if (!element) {
    console.error(`Element for ${id} is null or undefined`);
    return null;
  }

  try {
    // Let the UI update before capturing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Use html2canvas with optimized settings
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 2, // Higher quality
      backgroundColor: null, // Transparent background
      ignoreElements: (el) => el.classList.contains('no-export') // Skip elements with 'no-export' class
    });

    // Validate canvas was created
    if (!canvas) {
      throw new Error(`Canvas rendering failed for ${id}`);
    }

    // Get the base64 string from the canvas
    const dataUrl = canvas.toDataURL("image/png");
    const base64String = dataUrl.split(",")[1];

    if (!base64String) {
      throw new Error(`Failed to generate base64 string for ${id}`);
    }

    // Store the result in map_dataUri
    map_dataUri.set(id, base64String);
    return base64String;
  } catch (error) {
    console.error(`Error rendering chart ${id} to PNG:`, error);
    // Return null to indicate failure but allow process to continue
    return null;
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
    return '';
  }
  
  if (typeof val === 'object') {
    console.warn(`Invalid value type for field ${id}:`, typeof val);
    return '';
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
    return '';
  }
  return `<field fid='${id}' filename='chart.png'>${val}</field>`;
}

/**
 * Send record to Quickbase
 * @param {string} xml - XML payload to send
 * @returns {Promise<object>} - Response data
 */
async function sendToQuickbase(xml) {
  try {
    return await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 30000 // 30-second timeout
    });
  } catch (error) {
    const errorMessage = error.responseText || error.statusText || error.message || "Unknown error";
    console.error("Quickbase API error:", errorMessage);
    throw new Error(`Quickbase API error: ${errorMessage}`);
  }
}

/**
 * Process charts in batches to prevent UI blocking
 * @param {Array} chartMappings - Array of chart ID to field ID mappings
 * @param {number} batchSize - Number of charts to process in each batch
 * @returns {Promise<Array>} - Array of processed results
 */
async function processChartBatches(chartMappings, batchSize = 3) {
  const results = [];
  
  for (let i = 0; i < chartMappings.length; i += batchSize) {
    // Breathe between batches
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    
    const batch = chartMappings.slice(i, i + batchSize);
    const batchPromises = batch.map(async ({ chartId, fieldId }) => {
      try {
        const element = document.getElementById(chartId);
        if (!element) {
          console.warn(`Chart element '${chartId}' not found`);
          return { fieldId, base64String: null };
        }
        
        const idx = chartId.replace("_chart", "");
        const base64String = await svgToPngBase64(element, idx);
        return { fieldId, base64String };
      } catch (error) {
        console.error(`Error processing chart '${chartId}':`, error);
        return { fieldId, base64String: null };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Update progress indicator if available
    const progressElement = document.getElementById('uploadProgress');
    if (progressElement) {
      const progress = Math.min(100, Math.round((i + batchSize) / chartMappings.length * 100));
      progressElement.style.width = `${progress}%`;
      progressElement.setAttribute('aria-valuenow', progress);
    }
  }
  
  return results;
}

/**
 * Main function to print/upload charts to Quickbase
 */
async function mainPrint() {
  const printButton = document.getElementById('printButton');
  if (!printButton) {
    console.error("Print button not found");
    return;
  }
  
  // Store original button innerHTML to restore later
  const originalButtonContent = printButton.innerHTML;
  
  // Show content sections
  const sections = ['cashContent', 'netAssetsContent', 'incomeContent', 'expenseContent'];
  const hiddenSections = [];
  
  try {
    // Start the loading spinner
    toggleButtonLoadingState(printButton);
    
    // Show all content sections for rendering
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element && element.classList.contains('hidden')) {
        element.classList.remove('hidden');
        hiddenSections.push(element); // Track which ones we unhid
      }
    });

    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Define all chart IDs and their corresponding field IDs
    const chartMappings = [
      { chartId: "statementCashFlows_chart", fieldId: 8 },
      { chartId: "daysCashOnHand_chart", fieldId: 9 },
      { chartId: "daysExpensesInUnrestrictedNA_chart", fieldId: 10 },
      { chartId: "daysExpensesInUnrestrictedNA_excludingPPE_chart", fieldId: 11 },
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
      { chartId: "assetsWithoutPpeToLiabilitiesWithoutDebt_chart", fieldId: 28 },
      { chartId: "totalContributions_chart", fieldId: 29 },
      { chartId: "contributionsWithoutDR_chart", fieldId: 30 },
      { chartId: "functionalAllocation_chart", fieldId: 31 },
      { chartId: "costOfContributionsDetailView_chart", fieldId: 32 }
    ];

    // Filter out any charts that don't exist in the DOM
    const validChartMappings = chartMappings.filter(({ chartId }) => 
      document.getElementById(chartId) !== null
    );
    
    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }
    
    // Process charts in batches
    const results = await processChartBatches(validChartMappings, 3);
    
    // Build XML request with metadata and chart images
    let uploadXml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";
    
    // Add metadata first
    uploadXml += createFieldXml(171, ClientRid || '');
    uploadXml += createFieldXml(170, firmName || '');
    uploadXml += createFieldXml(169, uniqueClients?.size || 0);
    uploadXml += createFieldXml(163, sliderValue || 0);
    uploadXml += createFieldXml(164, sliderValue2 || 25000);
    
    // Add base64 images for charts
    results.forEach(result => {
      if (result && result.base64String) {
        uploadXml += createImageFieldXml(result.fieldId, result.base64String);
      }
    });
    
    uploadXml += "</qdbapi>";
    
    // Send to Quickbase
    const response = await sendToQuickbase(uploadXml);
    
    // Process response
    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();
    
    if (errorCode === "0") {
      const recordId = xmlResponse.find("qdbapi").find("rid").text();
      createToastSuccess(`Charts successfully uploaded to Quickbase. Record ID: ${recordId}`);
    } else {
      const errorText = xmlResponse.find("qdbapi").find("errtext").text() || 'Unknown error';
      throw new Error(`Quickbase returned error ${errorCode}: ${errorText}`);
    }
  } catch (error) {
    console.error("Error in mainPrint:", error);
    createToastWarning(`Error creating presentation: ${error.message || "Unknown error"}`);
  } finally {
    // Hide the sections we unhid
    hiddenSections.forEach(element => {
      element.classList.add('hidden');
    });
    
    // Restore button state
    printButton.innerHTML = originalButtonContent;
    printButton.disabled = false;
  }
}

// Print button event listener setup
function initPrintButton() {
  const printButton = document.getElementById('printBase64');
  if (!printButton) {
    console.error("Print button not found");
    return;
  }
  
  // Remove any existing event listeners (optional)
  printButton.replaceWith(printButton.cloneNode(true));
  
  // Get the fresh reference and add the listener
  const freshPrintButton = document.getElementById('printButton');
  freshPrintButton.addEventListener("click", () => {
    mainPrint();
  });
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', initPrintButton);