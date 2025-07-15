// print_base64.js

// Default chart dimensions - increased to prevent cutoff
const DEFAULT_CHART_WIDTH = 1400;
const DEFAULT_CHART_HEIGHT = 600;
const CFI_COMPOSITE_WIDTH = 600;
const CFI_COMPOSITE_HEIGHT = 900;

/**
 * Get chart dimensions based on chart ID
 * @param {string} chartId - The ID of the chart
 * @returns {Object} - Object containing width and height
 */
function getChartDimensions(chartId) {
  // CFI Composite chart needs special dimensions
  if (chartId === "cfiCompositeHtml_Chart") {
    return {
      width: CFI_COMPOSITE_WIDTH,
      height: CFI_COMPOSITE_HEIGHT
    };
  }
  
  // Smaller charts that don't need full width - use 60% of default width
  const smallerCharts = [
    "sourceOfIncomeClient_chart",
    "sourceOfIncomePeer_chart", 
    "salariesBenefitsToTotalExpense_chart",
    "salariesBenefitsPerNetTuition_chart",
    "netTuitionPerStudent_chart",
    "debtBurdenRatio_chart",
    "ltDebtPerTotalOperatingRevenue_chart"
  ];
  
  if (smallerCharts.includes(chartId)) {
    return {
      width: Math.round(DEFAULT_CHART_WIDTH * 0.6), // 840px (60% of 1400px)
      height: DEFAULT_CHART_HEIGHT
    };
  }
  
  // Default dimensions for all other charts
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

      // If we have an ApexChart instance, use its export method first
      if (chart && typeof chart.dataURI === "function") {
        const base64String = await exportApexChart(chart, chartId);
        if (base64String) {
          results.push({ chartId, fieldId, base64String });
          continue;
        }
      }

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
  // Use direct access like intl_print.js for better performance
  return chartId || null;
};

/**
 * Export an ApexChart with fixed dimensions
 *
 * @param {Object} chart - ApexChart instance
 * @param {string} chartId - Chart ID for reference
 * @returns {Promise<string>} - Base64 encoded image or null if failed
 */
async function exportApexChart(chart, chartId) {
  try {
    if (!chart || !chart.w || !chart.w.globals || !chart.w.globals.dom) {
      throw new Error("Invalid chart instance");
    }

    // Get chart dimensions based on chart ID
    const dimensions = getChartDimensions(chartId);

    // Create a completely isolated fixed-size container with padding
    const fixedContainer = document.createElement("div");
    fixedContainer.style.position = "fixed";
    fixedContainer.style.top = "-9999px";
    fixedContainer.style.left = "-9999px";
    fixedContainer.style.width = `${dimensions.width + 100}px`; // Add 100px padding
    fixedContainer.style.height = `${dimensions.height + 100}px`; // Add 100px padding
    fixedContainer.style.backgroundColor = "#ffffff";
    fixedContainer.style.overflow = "visible"; // Changed from hidden to visible
    fixedContainer.style.zIndex = "-9999";
    fixedContainer.style.transform = "none";
    fixedContainer.style.transformOrigin = "0 0";
    fixedContainer.style.padding = "50px"; // Add padding to prevent cutoff
    document.body.appendChild(fixedContainer);

    // Get the chart element
    const chartElement = chart.w.globals.dom.Paper.node.parentNode;
    if (!chartElement) {
      throw new Error("Chart element not found");
    }

    // Store original styles and parent
    const originalStyles = {
      width: chartElement.style.width,
      height: chartElement.style.height,
      position: chartElement.style.position,
      transform: chartElement.style.transform,
      top: chartElement.style.top,
      left: chartElement.style.left,
    };
    const originalParent = chartElement.parentElement;

    // Save complete chart state
    const originalState = saveChartState(chart);
    if (!originalState) {
      throw new Error("Failed to save chart state");
    }

    // Move chart to fixed container and set absolute dimensions
    fixedContainer.innerHTML = "";
    fixedContainer.appendChild(chartElement);
    
    // Force chart element to exact dimensions with padding offset
    chartElement.style.width = `${dimensions.width}px`;
    chartElement.style.height = `${dimensions.height}px`;
    chartElement.style.position = "absolute";
    chartElement.style.top = "50px"; // Account for container padding
    chartElement.style.left = "50px"; // Account for container padding
    chartElement.style.transform = "none";
    chartElement.style.transformOrigin = "0 0";

    // Force exact dimensions for SVG export
    const paperNode = chart.w.globals.dom.Paper.node;
    paperNode.setAttribute("width", dimensions.width.toString());
    paperNode.setAttribute("height", dimensions.height.toString());
    paperNode.style.width = `${dimensions.width}px`;
    paperNode.style.height = `${dimensions.height}px`;
    paperNode.style.position = "absolute";
    paperNode.style.top = "50px"; // Account for container padding
    paperNode.style.left = "50px"; // Account for container padding
    paperNode.setAttribute("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);
    paperNode.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Configure chart for export with absolute dimensions
    await configureChartForExport(chart, dimensions.width, dimensions.height);

    // Force a complete redraw with new dimensions
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Use ApexCharts' dataURI method with explicit dimensions
    const uri = await chart.dataURI({
      width: dimensions.width,
      height: dimensions.height,
      scale: 2, // Higher resolution
    });

    // Restore chart to original position
    if (originalParent) {
      originalParent.appendChild(chartElement);
    }
    Object.assign(chartElement.style, originalStyles);

    // Restore complete chart state
    restoreChartState(chart, originalState);

    // Clean up the fixed container
    if (fixedContainer.parentNode) {
      document.body.removeChild(fixedContainer);
    }

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
  try {
    // Check if this is a valid ApexCharts instance
    if (!chart || !chart.w || !chart.w.globals || !chart.w.globals.dom || !chart.w.globals.dom.Paper) {
      return null;
    }

    const paperNode = chart.w.globals.dom.Paper.node;
    const chartConfig = chart.w.config;

    // Save basic SVG attributes and chart configuration
    const state = {
      // SVG attributes
      width: paperNode.getAttribute("width"),
      height: paperNode.getAttribute("height"),
      viewBox: paperNode.getAttribute("viewBox"),
      styleWidth: paperNode.style.width,
      styleHeight: paperNode.style.height,
      preserveAspectRatio: paperNode.getAttribute("preserveAspectRatio"),
    };

    // Safely clone chart configuration
    try {
      if (chartConfig) {
        state.config = JSON.parse(JSON.stringify({
          chart: chartConfig.chart || {},
          dataLabels: chartConfig.dataLabels || {},
          markers: chartConfig.markers || {},
          title: chartConfig.title || {},
          xaxis: chartConfig.xaxis || {},
          yaxis: chartConfig.yaxis || {},
          tooltip: chartConfig.tooltip || {},
          legend: chartConfig.legend || {},
          grid: chartConfig.grid || {},
          stroke: chartConfig.stroke || {},
          fill: chartConfig.fill || {},
          plotOptions: chartConfig.plotOptions || {},
          annotations: chartConfig.annotations || {}
        }));
      }
    } catch (e) {
      console.warn('Error cloning chart config:', e);
    }

    return state;
  } catch (e) {
    console.warn('Error saving chart state:', e);
    return null;
  }
}

/**
 * Configure chart for consistent export
 */
async function configureChartForExport(chart, width, height) {
  const paperNode = chart.w.globals.dom.Paper.node;
  
  // Force SVG element to exact dimensions with no scaling
  paperNode.setAttribute("width", width.toString());
  paperNode.setAttribute("height", height.toString());
  paperNode.style.width = `${width}px`;
  paperNode.style.height = `${height}px`;
  paperNode.style.position = 'absolute';
  paperNode.style.left = '0px';
  paperNode.style.top = '0px';
  paperNode.style.transform = 'none';
  paperNode.style.transformOrigin = '0 0';

  // Set viewBox to match dimensions exactly
  paperNode.setAttribute("viewBox", `0 0 ${width} ${height}`);
  paperNode.setAttribute("preserveAspectRatio", "xMidYMid meet");
  
  // Update chart configuration with fixed dimensions
  let updatedOptions = {
    chart: {
      width: width,
      height: height,
      animations: {
        enabled: false
      },
      background: '#ffffff',
      redraw: true,
      redrawOnWindowResize: false,
      redrawOnParentResize: false
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
      style: {
        fontSize: '20px'
      }
    },
    xaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    }
  };

  // Force chart to redraw with new dimensions and styles
  if (chart.updateOptions) {
    await chart.updateOptions(updatedOptions, false, true);
  }

  // Ensure chart dimensions are locked
  if (chart.w && chart.w.globals) {
    chart.w.globals.svgWidth = width;
    chart.w.globals.svgHeight = height;
    chart.w.globals.dom.baseEl.style.width = `${width}px`;
    chart.w.globals.dom.baseEl.style.height = `${height}px`;
  }

  return new Promise(resolve => setTimeout(resolve, 100));
}

/**d
 * Restore chart to original state including annotations and title
 */
async function restoreChartState(chart, originalState) {
  try {
    // Check if we have valid inputs
    if (!chart || !originalState || !chart.w || !chart.w.globals || !chart.w.globals.dom) {
      return;
    }

    const paperNode = chart.w.globals.dom.Paper.node;

    // Restore SVG element attributes
    if (paperNode) {
      paperNode.setAttribute("width", originalState.width || '100%');
      paperNode.setAttribute("height", originalState.height || '100%');
      paperNode.style.width = originalState.styleWidth || '100%';
      paperNode.style.height = originalState.styleHeight || '100%';

      if (originalState.viewBox) {
        paperNode.setAttribute("viewBox", originalState.viewBox);
      }
      if (originalState.preserveAspectRatio) {
        paperNode.setAttribute("preserveAspectRatio", originalState.preserveAspectRatio);
      }
    }

    // Restore chart configuration if available
    if (originalState.config && chart.updateOptions) {
      try {
        await new Promise((resolve) => {
          chart.updateOptions(originalState.config, true, true);
          setTimeout(resolve, 100);
        });
      } catch (e) {
        console.warn('Error updating chart options:', e);
      }
    }
  } catch (e) {
    console.warn('Error restoring chart state:', e);
  }
}

/**
 * Fallback to html2canvas for export
 */
async function exportWithHtml2Canvas(chartElement) {
  // Get chart dimensions based on chart ID
  const dimensions = getChartDimensions(chartElement.id);
  
  // Create a completely isolated container with fixed dimensions and padding
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = `${dimensions.width + 100}px`; // Add 100px padding
  container.style.height = `${dimensions.height + 100}px`; // Add 100px padding
  container.style.backgroundColor = "#ffffff";
  container.style.overflow = "visible"; // Changed from hidden to visible
  container.style.zIndex = "-9999";
  container.style.transform = "none";
  container.style.transformOrigin = "0 0";
  container.style.padding = "50px"; // Add padding to prevent cutoff
  document.body.appendChild(container);

  // Clone the chart element into the container
  const clone = chartElement.cloneNode(true);
  clone.style.width = `${dimensions.width}px`;
  clone.style.height = `${dimensions.height}px`;
  clone.style.position = "absolute";
  clone.style.top = "50px"; // Account for container padding
  clone.style.left = "50px"; // Account for container padding
  clone.style.transform = "none";
  clone.style.transformOrigin = "0 0";
  container.appendChild(clone);

  // Find and adjust any SVG elements to exact dimensions
  const svgElements = clone.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    svg.setAttribute("width", dimensions.width.toString());
    svg.setAttribute("height", dimensions.height.toString());
    svg.style.width = `${dimensions.width}px`;
    svg.style.height = `${dimensions.height}px`;
    svg.style.position = "absolute";
    svg.style.top = "50px"; // Account for container padding
    svg.style.left = "50px"; // Account for container padding
    svg.style.transform = "none";
    svg.style.transformOrigin = "0 0";
    svg.setAttribute("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  try {
    // Wait for layout updates
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Use html2canvas with fixed dimensions
    const canvas = await html2canvas(clone, {
      scale: 2,
      width: dimensions.width,
      height: dimensions.height,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      removeContainer: false
    });

    const base64String = canvas.toDataURL("image/png").split(",")[1];

    // Clean up
    if (container.parentNode) {
      document.body.removeChild(container);
    }

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
  
  // Check if uniqueClientSize exists before using it
  if (typeof window.uniqueClientSize !== 'undefined') {
    uploadXml += createFieldXml(32, window.uniqueClientSize);
  }
  
  uploadXml += createFieldXml(94, selectedYears[selectedYears.length - 1]);
  uploadXml += createFieldXml(69, window.monthYearEnd);
  uploadXml += createFieldXml(89, sliderValue);
  uploadXml += createFieldXml(90, sliderValue2);
  
  // Optimize array joins by checking if arrays exist first
  uploadXml += createFieldXml(91, window.selectedSeminaries_Array ? Array.from(window.selectedSeminaries_Array).join(", ") : "");
  uploadXml += createFieldXml(93, window.selectedRegionals_Array ? Array.from(window.selectedRegionals_Array).join(", ") : "");
  uploadXml += createFieldXml(64, window.selectedRegions_Array ? Array.from(window.selectedRegions_Array).join(", ") : "");
  uploadXml += createFieldXml(65, window.selectedStates_Array ? Array.from(window.selectedStates_Array).join(", ") : "");
  uploadXml += createFieldXml(66, window.selectedMemberships_Array ? Array.from(window.selectedMemberships_Array).join(", ") : "");
  uploadXml += createFieldXml(67, window.selectedTypes_Array ? Array.from(window.selectedTypes_Array).join(", ") : "");
  uploadXml += createFieldXml(68, window.selectedAthletics_Array ? Array.from(window.selectedAthletics_Array).join(", ") : "");

  // Add each selected year to corresponding fields (73, 74, 75)
  selectedYears.forEach((year, index) => {
    if (index < 8) {  // Only process up to 8 years
      uploadXml += createFieldXml(73 + index, year);
      uploadXml += createFieldXml(81 + index, window.uniqueClientsPerYearMap[year]);
      
      // Check if clientsByYear exists and has the year data before accessing it
      if (window.clientsByYear && typeof window.clientsByYear.get === 'function') {
        const yearData = window.clientsByYear.get(String(year));
        if (yearData && yearData.size) {
          uploadXml += createFieldXml(81 + index, yearData.size);
        }
      }
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
  
  // Simplified field creation without CDATA for better performance
  return `<field fid='${id}' filename='chart.png'>${val}</field>`;
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
    const response = await $.ajax({
      type: "POST",
      contentType: "text/xml",
      url: "https://capincrouse.quickbase.com/db/buk93bd7x?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 60000, // 60-second timeout
    });

    // Check if we got a valid XML response
    if (!response || !$(response).find('qdbapi').length) {
      throw new Error('Invalid response format from Quickbase');
    }

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