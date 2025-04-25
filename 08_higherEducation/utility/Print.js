// print_base64.js

// Default chart dimensions
const DEFAULT_CHART_WIDTH = 1200;
const DEFAULT_CHART_HEIGHT = 530;
const CFI_COMPOSITE_WIDTH = 500;
const CFI_COMPOSITE_HEIGHT = 800;

/**
 * Get chart dimensions based on chart ID
 * @param {string} chartId - The ID of the chart
 * @returns {Object} - Object containing width and height
 */
function getChartDimensions(chartId) {
  if (chartId === "cfiCompositeHtml_Chart") {
    return {
      width: CFI_COMPOSITE_WIDTH,
      height: CFI_COMPOSITE_HEIGHT
    };
  }
  return {
    width: DEFAULT_CHART_WIDTH,
    height: DEFAULT_CHART_HEIGHT
  };
}

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
      // Get the chart element and instance
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.warn(`Chart element not found: ${chartId}`);
        results.push({ chartId, fieldId, base64String: null });
        continue;
      }

      const chart = getChartInstance(chartId);

      // If we have an ApexChart instance, try its export method first
      if (chart && typeof chart.dataURI === "function") {
        const base64String = await exportApexChart(chart);
        if (base64String) {
          results.push({ chartId, fieldId, base64String });
          continue;
        }
        // Silently fall back to html2canvas if ApexCharts export fails
      }

      // Use html2canvas as fallback
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
  switch (chartId) {
    case "cfiRatio_chart":
      return cfiRatio_chart;
    case "doeOverall_chart":
      return doeOverall_chart;
    case "cfi_primaryReserveRatio_chart":
      return cfi_primaryReserveRatio_chart;
    case "cfi_netIncomeOperationsRatio_chart":
      return cfi_netIncomeOperationsRatio_chart;
    case "cfi_returnOnNetAssets_chart":
      return cfi_returnOnNetAssets_chart;
    case "cfi_viabilityRatio_chart":
      return cfi_viabilityRatio_chart;
    case "FinancialPosition_chart":
      return FinancialPosition_chart;
    case "assetToLiabilities_chart":
      return assetToLiabilities_chart;
    case "sourceOfIncomeClient_chart":
      return sourceOfIncomeClient_chart;
    case "sourceOfIncomePeer_chart":
      return sourceOfIncomePeer_chart;
    case "ffa_chart":
      return ffa_chart;
    case "cashFlowsTrend_chart":
      return cashFlowsTrend_chart;
    case "currentRatio_chart":
      return currentRatio_chart;
    case "salariesBenefitsToTotalExpense_chart":
      return salariesBenefitsToTotalExpense_chart;
    case "salariesBenefitsPerNetTuition_chart":
      return salariesBenefitsPerNetTuition_chart;
    case "netEducationalExpensePerStudent_chart":
      return netEducationalExpensePerStudent_chart;
    case "annualTraditionalNetTuitionPerStudent_chart":
      return annualTraditionalNetTuitionPerStudent_chart;
    case "tuitionDependency_chart":
      return tuitionDependency_chart;
    case "tuitionDiscountRate_chart":
      return tuitionDiscountRate_chart;
    case "ltDebtPerTotalOperatingRevenue_chart":
      return ltDebtPerTotalOperatingRevenue_chart;
    case "debtServiceCoverageRatio_chart":
      return debtServiceCoverageRatio_chart;
    case "debtBurdenRatio_chart":
      return debtBurdenRatio_chart;
    case "endowmentOperatingBudget_chart":
      return endowmentOperatingBudget_chart;
    case "endowmentAssetsPerStudent_chart":
      return endowmentAssetsPerStudent_chart;
    case "doeOverall_chart":
      return doeOverall_chart;
    case "cfiCompositeHtml_Chart":
      return cfiCompositeHtml_Chart;

    // For the remaining charts in chartMappings that aren't explicitly declared,
    // we'll try to access them from the window object or from a chartManager if available
    default:
      // Try different methods to get the chart
      return null;
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

    // Get chart dimensions based on chart ID
    const dimensions = getChartDimensions(chart.w.globals.chartID);

    // Set fixed dimensions for both SVG element and viewBox
    await configureChartForExport(chart, dimensions.width, dimensions.height);

    // Let the chart update
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Use ApexCharts' dataURI method with explicit dimensions
    const uri = await chart.dataURI({
      width: dimensions.width,
      height: dimensions.height,
      scale: 2, // Higher resolution
    });

    // Restore original state
    restoreChartState(chart, originalState);

    return uri.imgURI.split(",")[1];
  } catch (error) {
    // Don't log the error, just return null to trigger fallback
    return null;
  }
}

/**
 * Save current chart state for later restoration
 */
function saveChartState(chart) {
  const paperNode = chart.w.globals.dom.Paper.node;

  // Save basic SVG attributes
  const state = {
    width: paperNode.getAttribute("width"),
    height: paperNode.getAttribute("height"),
    viewBox: paperNode.getAttribute("viewBox"),
    styleWidth: paperNode.style.width,
    styleHeight: paperNode.style.height,
    preserveAspectRatio: paperNode.getAttribute("preserveAspectRatio"),
  };

  // Save radialBar specific options if it's a radialBar chart
  if (chart.w.config.chart && chart.w.config.chart.type === 'radialBar') {
    state.radialBar = {
      plotOptions: chart.w.config.plotOptions,
      dataLabels: chart.w.config.dataLabels
    };
  }

  if (chart.w.config.annotations && chart.w.config.annotations.yaxis) {
    state.annotations = JSON.parse(JSON.stringify(chart.w.config.annotations));
  }

  if (chart.w.config.title) {
    state.title = JSON.parse(JSON.stringify(chart.w.config.title));
  }

  return state;
}

/**
 * Configure chart for consistent export
 */
async function configureChartForExport(chart, width, height) {
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
  
  let updatedOptions = {
    chart: {
      width: width,
      height: height,
      animations: {
        enabled: false // Disable animations during export
      }
    },
    markers: {
      size: 4,
      strokeWidth: 1,
      hover: {
        size: 4
      }
    },
    dataLabels: {
      style: {
        fontSize: '12px'
      }
    },
    title: {
      text: '',
      style: {
        fontSize: '0px',
        opacity: 0
      }
    }
  };

  // For radialBar charts, preserve the configuration but adjust value font size
  if (chart.w.config.chart && chart.w.config.chart.type === 'radialBar') {
    // Deep clone the plotOptions to avoid modifying the original
    const plotOptions = JSON.parse(JSON.stringify(chart.w.config.plotOptions));
    

    // Only adjust the value font size
    if (plotOptions.radialBar?.dataLabels?.value) {
      console.log('radialBar before', plotOptions.radialBar.dataLabels);
      
      plotOptions.radialBar.dataLabels.value.fontSize = '14px';
      console.log('radialBar after', plotOptions.radialBar.dataLabels);
    }

    updatedOptions = {
      ...updatedOptions,
      plotOptions: plotOptions,
      fill: chart.w.config.fill,
      stroke: chart.w.config.stroke,
      labels: chart.w.config.labels
    };
  }

  // Check if the chart has yaxis annotations and update their styling
  if (chart.w.config.annotations && chart.w.config.annotations.yaxis) {
    const updatedAnnotations = JSON.parse(JSON.stringify(chart.w.config.annotations));

    if (Array.isArray(updatedAnnotations.yaxis)) {
      updatedAnnotations.yaxis.forEach((annotation) => {
        if (annotation.label) {
          annotation.label.style = annotation.label.style || {};
          annotation.label.style.fontSize = "12px";
          annotation.label.style.fontWeight = 400;
          annotation.label.offsetX = 0;
          annotation.label.position = "left";
        }
      });
    }

    updatedOptions.annotations = updatedAnnotations;
  }

  // Force chart to redraw with new dimensions and styles
  if (chart.updateOptions) {
    chart.updateOptions(updatedOptions, false, true);
  }

  // Add a small delay to ensure the chart has time to properly resize
  return new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Restore chart to original state including annotations and title
 */
function restoreChartState(chart, originalState) {
  const paperNode = chart.w.globals.dom.Paper.node;

  // Restore SVG element attributes
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
    paperNode.setAttribute("preserveAspectRatio", originalState.preserveAspectRatio);
  } else {
    paperNode.removeAttribute("preserveAspectRatio");
  }

  // Prepare options for restoration
  const restoreOptions = {
    chart: {
      width: parseInt(originalState.width),
      height: parseInt(originalState.height),
    }
  };

  // Restore radialBar specific options if they were saved
  if (originalState.radialBar) {
    restoreOptions.plotOptions = originalState.radialBar.plotOptions;
    restoreOptions.dataLabels = originalState.radialBar.dataLabels;
  }

  // Restore annotations if they were saved
  if (originalState.annotations) {
    restoreOptions.annotations = originalState.annotations;
  }
  
  // Restore title if it was saved
  if (originalState.title) {
    restoreOptions.title = originalState.title;
  }

  // Force chart to redraw with original dimensions, annotations, and title
  if (chart.updateOptions) {
    chart.updateOptions(restoreOptions, false, true);
  }
}

/**
 * Fallback to html2canvas for export
 */
async function exportWithHtml2Canvas(chartElement) {
  // Get chart dimensions based on chart ID
  const dimensions = getChartDimensions(chartElement.id);

  // Create a clone container with fixed dimensions
  const container = document.createElement("div");
  container.style.position = "absolute";
  // container.style.left = '-9999px';
  container.style.width = `${dimensions.width}px`;
  container.style.height = `${dimensions.height}px`;

  // Clone the chart element into the container
  const clone = chartElement.cloneNode(true);
  clone.style.width = `${dimensions.width}px`;
  clone.style.height = `${dimensions.height}px`;
  container.appendChild(clone);
  document.body.appendChild(container);

  // Find and adjust any SVG elements
  const svgElements = clone.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    svg.setAttribute("width", dimensions.width.toString());
    svg.setAttribute("height", dimensions.height.toString());
    svg.style.width = `${dimensions.width}px`;
    svg.style.height = `${dimensions.height}px`;
    svg.setAttribute("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  try {
    // Wait for layout updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use html2canvas with fixed dimensions
    const canvas = await html2canvas(clone, {
      scale: 2,
      width: dimensions.width,
      height: dimensions.height,
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
      "DoeContent"
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
      { chartId: "endowmentAssetsPerStudent_chart", fieldId: 30 },
      { chartId: "doeOverall_chart", fieldId: 71 },
      { chartId: "cfiCompositeHtml_Chart", fieldId: 72 },
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
  let uploadXml = '<?xml version="1.0" encoding="UTF-8"?>\n<qdbapi><apptoken>c3qhvhmcgbwze7hwbiavcm3hnmc</apptoken>';

  // Add metadata
  const selectedYears = getSelectedYearsFromLocalStorage();

  uploadXml += createFieldXml(31, firmName);
  uploadXml += createFieldXml(32, window.uniqueClientSize);
  uploadXml += createFieldXml(94, selectedYears[selectedYears.length - 1]);
  uploadXml += createFieldXml(69, window.monthYearEnd);
  uploadXml += createFieldXml(89, sliderValue);
  uploadXml += createFieldXml(90, sliderValue2);
  uploadXml += createFieldXml(91, Array.from(selectedSeminaries_Array).join(", "));
  uploadXml += createFieldXml(93, Array.from(selectedRegionals_Array).join(", "));
  uploadXml += createFieldXml(64, Array.from(selectedRegions_Array).join(", "));
  uploadXml += createFieldXml(65, Array.from(selectedStates_Array).join(", "));
  uploadXml += createFieldXml(66, Array.from(selectedMemberships_Array).join(", "));
  uploadXml += createFieldXml(67, Array.from(selectedTypes_Array).join(", "));
  uploadXml += createFieldXml(68, Array.from(selectedAthletics_Array).join(", "));

  // Add each selected year to corresponding fields (73, 74, 75)
  selectedYears.forEach((year, index) => {
    if (index < 8) {  // Only process up to 8 years
      uploadXml += createFieldXml(73 + index, year);
      uploadXml += createFieldXml(81 + index, window.clientsByYear.get(String(year)).size);
    }
  });

  // Add base64 images for charts
  results.forEach((result) => {
    if (result && result.base64String) {
      uploadXml += createImageFieldXml(result.fieldId, result.base64String);
    }
  });

  uploadXml += "</qdbapi>";
  return uploadXml;
}

function createImageFieldXml(id, val) {
  if (!val) {
    console.warn(`Skipping image upload for field ${id} - missing data`);
    return "";
  }
  
  // Wrap the base64 data in CDATA to prevent XML parsing issues
  return `<field fid='${id}' filename='chart.png'><![CDATA[${val}]]></field>`;
}

function createFieldXml(id, val) {
  if (val === null || val === undefined) {
    console.warn(`Skipping upload for field ${id} due to null/undefined value`);
    return "";
  }

  if (typeof val === "object") {
    console.warn(`Invalid value type for field ${id}:`, typeof val);
    return "";
  }

  // Escape special characters for regular fields
  const escapedVal = String(val).replace(/[<>&'"]/g, function(c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
  });

  return `<field fid='${id}'>${escapedVal}</field>`;
}

/**
 * Send record to Quickbase
 * @param {string} xml - XML payload to send
 * @returns {Promise<object>} - Response data
 */
async function sendToQuickbase(xml) {
  try {
    console.log('Sending request to Quickbase...');
    
    const response = await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/buk93bd7x?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 60000, // 60-second timeout
      headers: {
        'QUICKBASE-ACTION': 'API_AddRecord'
      },
      beforeSend: function(xhr) {
        console.log('Request headers:', xhr.getAllResponseHeaders());
      },
      success: function(data, status, xhr) {
        console.log('Response headers:', xhr.getAllResponseHeaders());
        console.log('Response data:', data);
      },
      error: function(xhr, status, error) {
        console.error('Detailed error information:');
        console.error('Status:', status);
        console.error('Error:', error);
        console.error('Response Text:', xhr.responseText);
        console.error('Status Code:', xhr.status);
        console.error('Status Text:', xhr.statusText);
      }
    });

    // Log the raw response for debugging
    console.log('Raw response:', response);

    // Check if we got a valid XML response
    if (!response || !$(response).find('qdbapi').length) {
      throw new Error('Invalid response format from Quickbase');
    }

    return response;
  } catch (error) {
    console.error('Full error object:', error);
    
    let errorMessage = 'Unknown error';
    
    if (error.responseText) {
      try {
        // Try to parse the error response as XML
        const errorXml = $(error.responseText);
        const errtext = errorXml.find('errtext').text();
        const errcode = errorXml.find('errcode').text();
        errorMessage = errtext || error.responseText;
        if (errcode) {
          errorMessage = `Error code ${errcode}: ${errorMessage}`;
        }
      } catch (e) {
        // If XML parsing fails, use the raw response text
        errorMessage = error.responseText;
      }
    } else if (error.statusText) {
      errorMessage = error.statusText;
    } else if (error.message) {
      errorMessage = error.message;
    }

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
