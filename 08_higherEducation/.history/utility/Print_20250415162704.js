// print_base64.js

/**
 * Process charts with fixed dimensions regardless of screen resolution
 *
 * @param {Array} chartMappings - Array of chart ID and field ID mappings
 * @returns {Promise<Array>} - Results of chart processing
 */
async function processChartsWithSpacing(chartMappings) {
  const results = [];
  setupProgressUI(chartMappings.length);

  for (let i = 0; i < chartMappings.length; i++) {
    const { chartId, fieldId } = chartMappings[i];
    updateProgressUI(i, chartMappings.length);

    try {
      console.log(`Processing chart: ${chartId}...`);

      // Get the chart element and instance
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.warn(`Chart element not found: ${chartId}`);
        results.push({ chartId, fieldId, base64String: null });
        continue;
      }

      // const chart = chartManager.getChart(chartId) || window[chartId];
      const chart = getChartInstance(chartId);

      // If we have an ApexChart instance, use its export method
      if (chart && typeof chart.dataURI === "function") {
        const base64String = await exportApexChart(chart);
        if (base64String) {
          results.push({ chartId, fieldId, base64String });
          continue;
        }
      }

      console.warn("fallback to html2canvas");

      // Fallback to html2canvas
      const base64String = await exportWithHtml2Canvas(chartElement);
      results.push({ chartId, fieldId, base64String });

      // Prevent UI freezing
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Error processing chart ${chartId}:`, error);
      results.push({ chartId, fieldId, base64String: null });
    }
  }

  completeProgressUI(chartMappings.length);
  return results;
}

const getChartInstance = (chartId) => {
  // The charts that are explicitly declared in your codebase
  switch(chartId) {
    case "cfiRatio_chart": return cfiRatio_chart;
    case "doeOverall_chart": return doeOverall_chart;
    case "cfi_primaryReserveRatio_chart": return cfi_primaryReserveRatio_chart;
    case "cfi_netIncomeOperationsRatio_chart": return cfi_netIncomeOperationsRatio_chart;
    case "cfi_returnOnNetAssets_chart": return cfi_returnOnNetAssets_chart;
    case "cfi_viabilityRatio_chart": return cfi_viabilityRatio_chart;
    case "FinancialPosition_chart": return FinancialPosition_chart;
    case "assetToLiabilities_chart": return assetToLiabilities_chart;
    case "sourceOfIncomeClient_chart": return sourceOfIncomeClient_chart;
    case "sourceOfIncomePeer_chart": return sourceOfIncomePeer_chart;
    case "ffa_chart": return ffa_chart;
    case "cashFlowsTrend_chart": return cashFlowsTrend_chart;
    case "currentRatio_chart": return currentRatio_chart;
    
    // For the remaining charts in chartMappings that aren't explicitly declared,
    // we'll try to access them from the window object or from a chartManager if available
    default:
      // Try different methods to get the chart
      return window[chartId] || 
             (window.chartManager ? window.chartManager.getChart(chartId) : null) || 
             null;
  }
};


/**
 * Export an ApexChart with fixed dimensions
 *
 * @param {Object} chart - ApexChart instance
 * @returns {Promise<string>} - Base64 encoded image or null if failed
 */
async function exportApexChart(chart) {
  try {
    // Wait for rendering to complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Store original chart state
    const originalState = saveChartState(chart);

    // Set fixed dimensions for both SVG element and viewBox
    configureChartForExport(chart, 900, 530);

    // Let the chart update
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Use ApexCharts' dataURI method with explicit dimensions
    const uri = await chart.dataURI({
      width: 900,
      height: 530,
      scale: 2, // Higher resolution
    });

    // Restore original state
    restoreChartState(chart, originalState);

    return uri.imgURI.split(",")[1];
  } catch (error) {
    console.error("Error in exportApexChart:", error);
    return null;
  }
}

/**
 * Save current chart state for later restoration
 */
function saveChartState(chart) {
  const paperNode = chart.w.globals.dom.Paper.node;
  return {
    width: paperNode.getAttribute("width"),
    height: paperNode.getAttribute("height"),
    viewBox: paperNode.getAttribute("viewBox"),
    styleWidth: paperNode.style.width,
    styleHeight: paperNode.style.height,
    preserveAspectRatio: paperNode.getAttribute("preserveAspectRatio"),
  };
}

/**
 * Configure chart for consistent export
 */
function configureChartForExport(chart, width, height) {
  const paperNode = chart.w.globals.dom.Paper.node;

  // Set SVG element dimensions
  paperNode.setAttribute("width", width.toString());
  paperNode.setAttribute("height", height.toString());
  paperNode.style.width = `${width}px`;
  paperNode.style.height = `${height}px`;

  // Set viewBox to match dimensions exactly
  paperNode.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // Ensure aspect ratio is preserved and content is centered
  paperNode.setAttribute("preserveAspectRatio", "xMidYMid meet");

  // Force chart to redraw with new dimensions
  if (chart.updateOptions) {
    chart.updateOptions(
      {
        chart: {
          width: width,
          height: height,
        },
      },
      false,
      false
    );
  }
}

/**
 * Restore chart to original state
 */
function restoreChartState(chart, originalState) {
  const paperNode = chart.w.globals.dom.Paper.node;

  paperNode.setAttribute("width", originalState.width);
  paperNode.setAttribute("height", originalState.height);
  paperNode.style.width = originalState.styleWidth;
  paperNode.style.height = originalState.styleHeight;

  if (originalState.viewBox) {
    paperNode.setAttribute("viewBox", originalState.viewBox);
  } else {
    paperNode.removeAttribute("viewBox");
  }

  if (originalState.preserveAspectRatio) {
    paperNode.setAttribute(
      "preserveAspectRatio",
      originalState.preserveAspectRatio
    );
  } else {
    paperNode.removeAttribute("preserveAspectRatio");
  }

  // Force chart to redraw with original dimensions
  if (chart.updateOptions) {
    chart.updateOptions(
      {
        chart: {
          width: parseInt(originalState.width),
          height: parseInt(originalState.height),
        },
      },
      false,
      false
    );
  }
}

/**
 * Fallback to html2canvas for export
 */
async function exportWithHtml2Canvas(chartElement) {
  // Create a clone container with fixed dimensions
  const container = document.createElement("div");
  container.style.position = "absolute";
  // container.style.left = '-9999px';
  container.style.width = "900px";
  container.style.height = "530px";

  // Clone the chart element into the container
  const clone = chartElement.cloneNode(true);
  clone.style.width = "900px";
  clone.style.height = "530px";
  container.appendChild(clone);
  document.body.appendChild(container);

  // Find and adjust any SVG elements
  const svgElements = clone.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    svg.setAttribute("width", "900");
    svg.setAttribute("height", "530");
    svg.style.width = "900px";
    svg.style.height = "530px";
    svg.setAttribute("viewBox", "0 0 900 530");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  try {
    // Wait for layout updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use html2canvas with fixed dimensions
    const canvas = await html2canvas(clone, {
      scale: 2,
      width: 900,
      height: 530,
      useCORS: true,
      allowTaint: true,
      backgroundColor:
        getComputedStyle(document.documentElement).getPropertyValue(
          "--chart-bg-color"
        ) || "#ffffff",
    });

    const base64String = canvas.toDataURL("image/png").split(",")[1];

    // Clean up
    document.body.removeChild(container);

    return base64String;
  } catch (error) {
    console.error("Error in html2canvas export:", error);
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    return null;
  }
}

/**
 * Set up progress UI
 */
function setupProgressUI(totalCharts) {
  const loadingModal = document.getElementById("loadingApiDiv");
  if (!loadingModal) return;

  const progressContainer = document.createElement("div");
  progressContainer.id = "chart-progress-container";
  progressContainer.className = "mt-6 px-3 py-1 w-full";

  progressContainer.innerHTML = `
    <div class="w-full">
      <div class="flex justify-between mb-1 text-white">
        <span id="chart-progress-text" class="text-lg font-medium">Processing charts</span>
        <span id="chart-progress-count" class="text-lg font-medium">0/${totalCharts}</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2.5 mt-2">
        <div id="chart-progress-bar" class="backgroundGreen h-2.5 rounded-full" style="width: 0%"></div>
      </div>
    </div>
  `;

  const loadingContent =
    loadingModal.querySelector("#loadingApiInnerDiv") || loadingModal;
  loadingContent.appendChild(progressContainer);
}

/**
 * Update progress UI
 */
function updateProgressUI(current, total) {
  const progressBar = document.getElementById("chart-progress-bar");
  const progressCount = document.getElementById("chart-progress-count");
  const progressText = document.getElementById("chart-progress-text");

  if (progressBar) {
    const progressPercent = Math.floor((current / total) * 100);
    progressBar.style.width = `${progressPercent}%`;
  }

  if (progressCount) {
    progressCount.textContent = `${current}/${total}`;
  }

  if (progressText) {
    progressText.textContent = "Processing charts...";
  }
}

/**
 * Complete progress UI
 */
function completeProgressUI(total) {
  const progressBar = document.getElementById("chart-progress-bar");
  const progressCount = document.getElementById("chart-progress-count");
  const progressText = document.getElementById("chart-progress-text");

  if (progressBar) {
    progressBar.style.width = "100%";
  }

  if (progressCount) {
    progressCount.textContent = `${total}/${total}`;
  }

  if (progressText) {
    progressText.textContent = "Processing complete!";
  }
}

/**
 * Enhanced version of mainPrint using ApexCharts dataURI with fixed dimensions
 */
async function apexChartsExportPrint() {
  showApiLoadingFunction("open", "print");

  const printButton = document.getElementById("printCharts");
  if (!printButton) {
    console.error("Print button not found");
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
    // Unhide any hidden sections to ensure all charts are available
    const sections = [
      "FinancialPositionContent",
      "RevenueAndExpenseContent",
      "DebtAndEndowmentContent",
      "CfiRatioContent",
    ];
    const hiddenSections = [];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element && element.classList.contains("hidden")) {
        element.classList.remove("hidden");
        hiddenSections.push(element);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

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


    // Filter out any charts that don't exist in the DOM
    const validChartMappings = chartMappings.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    // Process charts with fixed dimensions
    const results = await processChartsWithSpacing(validChartMappings);

    // Count successful exports
    const successfulExports = results.filter(
      (r) => r.base64String !== null
    ).length;

    if (successfulExports === 0) {
      throw new Error("No charts were successfully exported");
    }

    // Hide sections that were previously hidden
    hiddenSections.forEach((element) => {
      element.classList.add("hidden");
    });

    // Build XML for upload
    const uploadXml = buildUploadXml(results);

    // Send to Quickbase
    const response = await sendToQuickbase(uploadXml);

    // Process the response
    const xmlResponse = $(response);
    const errorCode = xmlResponse.find("qdbapi").find("errcode").text();
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

    // Remove progress tracking container
    const progressContainer = document.getElementById(
      "chart-progress-container"
    );
    if (progressContainer && progressContainer.parentNode) {
      progressContainer.parentNode.removeChild(progressContainer);
    }
  }
}

/**
 * Build XML for Quickbase upload
 */
function buildUploadXml(results) {
  let uploadXml = "<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>";

  // Add metadata
  const selectedYears = getSelectedYearsFromLocalStorage();

  uploadXml += createFieldXml(31, window.firmName);
  uploadXml += createFieldXml(32, window.uniqueClientSize);
  uploadXml += createFieldXml(76, selectedYears[selectedYears.length - 1]);
  uploadXml += createFieldXml(69, window.monthYearEnd);
  uploadXml += createFieldXml(
    64,
    Array.from(selectedRegions_Array).join(', ')
  );
  uploadXml += createFieldXml(
    65,
    Array.from(selectedStates_Array).join(', ')
  );
  uploadXml += createFieldXml(
    66,
    Array.from(selectedMemberships_Array).join(', ')
  );
  uploadXml += createFieldXml(
    67,
    Array.from(selectedTypes_Array).join(', ')
  );
  uploadXml += createFieldXml(
    68,
    Array.from(selectedAthletics_Array).join(', ')
  );


  // Add base64 images for charts
  results.forEach((result) => {
    if (result && result.base64String) {
      uploadXml += createImageFieldXml(result.fieldId, result.base64String);
    }
  });

  uploadXml += "</qdbapi>";
  return uploadXml;
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
  try {
    const response = await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/buk93bd7x?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 60000, // 60-second timeout (increased from 30)
    });

    return response;
  } catch (error) {
    const errorMessage =
      error.responseText ||
      error.statusText ||
      error.message ||
      "Unknown error";
    throw new Error(`Quickbase API error: ${errorMessage}`);
  }
}

/**
 * Initialize the ApexCharts export print functionality
 */
function initApexChartsPrintFunction() {
  const printButton = document.getElementById("printCharts");
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
