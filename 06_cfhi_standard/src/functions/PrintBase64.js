// print_base64.js - Print charts as base64 images for Standard project

const DEFAULT_CHART_WIDTH = 1000;
const DEFAULT_CHART_HEIGHT = 600;

/**
 * Get appropriate dimensions for a chart
 * @param {string} chartId - The ID of the chart
 * @returns {Object} - Object with width and height
 */
function getChartDimensions(chartId) {
  // All charts use the same dimensions since they're all line charts
  return {
    width: DEFAULT_CHART_WIDTH,
    height: DEFAULT_CHART_HEIGHT,
  };
}

/**
 * Process charts with fixed dimensions
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

      // If we have an ApexChart instance, use its export method
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
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error processing chart ${chartId}:`, error);
      results.push({ chartId, fieldId, base64String: null });
    }
  }

  completeProgressUI(chartMappings.length);
  return results;
}

/**
 * Save complete chart state including all configurations
 */
function saveCompleteChartState(chart) {
  try {
    const paperNode = chart.w.globals.dom.Paper.node;
    const chartConfig = chart.w.config;
    const chartId = chart.w.globals.chartID;
    const mainName = chartId.replace("_chart", "");

    // Store chart type and parameters
    const chartType = "line"; // All charts are line charts

    // Create base configuration object
    const baseConfig = {
      chart: chartConfig.chart || {},
      dataLabels: chartConfig.dataLabels || {},
      markers: chartConfig.markers || {},
      title: chartConfig.title || {},
      subtitle: chartConfig.subtitle || {},
      xaxis: chartConfig.xaxis || {},
      yaxis: chartConfig.yaxis || {},
      tooltip: chartConfig.tooltip || {},
      legend: chartConfig.legend || {},
      grid: chartConfig.grid || {},
      stroke: chartConfig.stroke || {},
      plotOptions: chartConfig.plotOptions || {},
      annotations: chartConfig.annotations || {},
      colors: chartConfig.colors || [],
      series: chartConfig.series || [],
      labels: chartConfig.labels || [],
    };

    // Deep clone the entire chart configuration
    const clonedConfig = JSON.parse(JSON.stringify(baseConfig));

    // Get numType from chart globals
    const numType = chart.w.globals.numType || chartConfig.numType || "number";
    const fixedNum = chartConfig.dataLabels?.formatter
      ?.toString()
      .includes("fixedNum")
      ? parseInt(
          chartConfig.dataLabels.formatter
            .toString()
            .match(/fixedNum\s*=\s*(\d+)/)?.[1] || 0
        )
      : chartConfig.dataLabels?.fixedNum || 0;

    let yaxisConfig;
    if (Array.isArray(chartConfig.yaxis)) {
      yaxisConfig = chartConfig.yaxis.map((axis) => ({
        ...axis,
        labels: {
          ...axis.labels,
          formatter: axis.labels?.formatter?.toString(),
          style: axis.labels?.style || {},
          align: axis.labels?.align,
        },
        axisBorder: axis.axisBorder || {},
        axisTicks: axis.axisTicks || {},
      }));
    } else {
      // Handle single y-axis object
      yaxisConfig = [{
        ...chartConfig.yaxis,
        labels: {
          ...chartConfig.yaxis?.labels,
          formatter: chartConfig.yaxis?.labels?.formatter?.toString(),
          style: chartConfig.yaxis?.labels?.style || {},
          align: chartConfig.yaxis?.labels?.align,
        },
        axisBorder: chartConfig.yaxis?.axisBorder || {},
        axisTicks: chartConfig.yaxis?.axisTicks || {},
      }];
    }

    // Save everything we'll need for proper restoration
    const originalConfig = {
      chartId: chartId,
      chartType: chartType,
      mainName: mainName,
      svgAttributes: {
        width: paperNode.getAttribute("width"),
        height: paperNode.getAttribute("height"),
        viewBox: paperNode.getAttribute("viewBox"),
        styleWidth: paperNode.style.width,
        styleHeight: paperNode.style.height,
        preserveAspectRatio: paperNode.getAttribute("preserveAspectRatio"),
      },
      chartConfig: clonedConfig,
      dimensions: {
        width: chart.w.globals.svgWidth,
        height: chart.w.globals.svgHeight,
      },
      xaxisConfig: {
        categories: chartConfig.xaxis?.categories || [],
        labels: chartConfig.xaxis?.labels || {},
        type: chartConfig.xaxis?.type || "category",
        tickPlacement: chartConfig.xaxis?.tickPlacement || "between",
        axisBorder: chartConfig.xaxis?.axisBorder || {},
        crosshairs: chartConfig.xaxis?.crosshairs || {},
      },
      numType: numType,
      fixedNum: fixedNum,
      isYAxisArray: Array.isArray(chartConfig.yaxis),
      yaxisConfig: yaxisConfig,
    };
    return originalConfig;
  } catch (error) {
    return null;
  }
}

/**
 * Restore complete chart state
 */
function restoreCompleteChartState(chart, originalState) {
  try {
    if (!chart || !originalState) {
      return;
    }

    if (
      !chart.w ||
      !chart.w.globals ||
      !chart.w.globals.dom
    ) {
      return;
    }

    const paperNode = chart.w.globals.dom.Paper.node;
    // Restore SVG attributes
    const { svgAttributes } = originalState;
    paperNode.setAttribute("width", svgAttributes.width);
    paperNode.setAttribute("height", svgAttributes.height);
    paperNode.style.width = svgAttributes.styleWidth;
    paperNode.style.height = svgAttributes.styleHeight;
    paperNode.setAttribute("viewBox", svgAttributes.viewBox);
    paperNode.setAttribute(
      "preserveAspectRatio",
      svgAttributes.preserveAspectRatio
    );

    // Get the original chart configuration
    const originalConfig = chart.w.config;
    const chartId = originalState.chartId || chart.w.globals.chartID;
    const mainName = originalState.mainName || chartId.replace("_chart", "");
    const chartType = originalState.chartType || "line";

    // Use saved numType and fixedNum
    const numType =
      originalState.numType ||
      chart.w.globals.numType ||
      originalConfig.numType ||
      "number";
    const fixedNum =
      originalState.fixedNum !== undefined ? originalState.fixedNum : 0;

    // For line charts, use the complex restoration logic
    const restoredConfig = {
      ...originalState.chartConfig,
      xaxis: {
        ...originalState.xaxisConfig,
        categories: originalState.xaxisConfig.categories,
        labels: {
          ...originalState.xaxisConfig.labels,
          style: {
            ...originalState.xaxisConfig.labels.style,
            colors:
              originalState.chartConfig.xaxis?.labels?.style?.colors ||
              "#3a464f",
          },
        },
      },
      yaxis: originalState.yaxisConfig ? originalState.yaxisConfig.map((axis) => {
        return {
          ...axis,
          labels: {
            ...axis.labels,
            formatter: function (value) {
              let formattedValue;
              
              // Handle very large numbers (millions and billions)
              if (value >= 100000000) {
                // Round to nearest 10M for values >= 100M
                formattedValue = `${Math.round(value / 10000000) * 10}M`;
              } else if (value >= 1000000) {
                // Round to nearest 5M for values between 1M and 100M
                formattedValue = `${Math.round(value / 5000000) * 5}M`;
              } else if (value >= 10000) {
                // Round to nearest 10K for values >= 10K
                formattedValue = `${Math.round(value / 10000) * 10}K`;
              } else if (value >= 1000) {
                // Round to nearest 1K for values >= 1K
                formattedValue = `${Math.round(value / 1000)}K`;
              } else if (value >= 100) {
                // Round to nearest 100 for values between 100 and 1000
                formattedValue = Math.round(value / 100) * 100;
              } else if (value >= 10) {
                // Round to nearest 10 for values between 10 and 100
                formattedValue = Math.round(value / 10) * 10;
              } else if (value >= 1) {
                // Round to nearest 1 for values between 1 and 10
                formattedValue = Math.round(value);
              } else if (value >= 0.1) {
                // For values between 0.1 and 1, use 0.05 increments
                formattedValue = Math.round(value * 20) / 20;
              } else if (value >= 0.01) {
                // For values between 0.01 and 0.1, use 0.02 increments
                formattedValue = Math.round(value * 50) / 50;
              } else {
                // For very small values, round to nearest 0.01
                formattedValue = Math.round(value * 100) / 100;
              }
              
              // Apply prefix/suffix based on numType
              if (numType === "dollar") {
                if (formattedValue >= 1 && formattedValue < 100) {
                  formattedValue = Math.round(formattedValue);
                }
                return `$${formattedValue}`;
              } else if (numType === "percent") {
                if (value >= 1 && value < 100) {
                  formattedValue = Math.round(value * 2) / 2;
                } else if (value >= 0.1 && value < 1) {
                  formattedValue = Math.round(value * 20) / 20;
                }
                return `${formattedValue}%`;
              } else {
                return formattedValue;
              }
            },
            align: axis.labels?.align,
          },
        };
      }) : [],
      annotations: originalState.chartConfig.annotations || {},
    };

    // First, ensure numType will be available in chart.w.globals
    if (chart.w.globals) {
      chart.w.globals.numType = numType;
    }

    // Apply the restored configuration
    if (chart.updateOptions) {
      chart.updateOptions(restoredConfig, true, true);
    }

  } catch (error) {
    // Silently handle restoration errors
  }
}

const getChartInstance = (chartId) => {
  // Get the chart instance from the global scope - Standard project charts
  const chartMap = {
    givingUnits_chart: window.givingUnits_chart,
    contributionsWithoutDonorExcludingLargeGifts_chart: window.contributionsWithoutDonorExcludingLargeGifts_chart,
    daysOperatingCash_chart: window.daysOperatingCash_chart,
    netCashAvailability_chart: window.netCashAvailability_chart,
    debtToContributionsWithout_chart: window.debtToContributionsWithout_chart,
    debtPerGivingUnit_chart: window.debtPerGivingUnit_chart,
    contributionsWithoutDonorPerGivingUnit_chart: window.contributionsWithoutDonorPerGivingUnit_chart,
    totalContributionsPerGivingUnit_chart: window.totalContributionsPerGivingUnit_chart,
    cashExpendituresPerGivingUnit_chart: window.cashExpendituresPerGivingUnit_chart,
  };

  const chart = chartMap[chartId] || null;
  return chart;
};

/**
 * Export an ApexChart with fixed dimensions
 *
 * @param {Object} chart - ApexChart instance
 * @param {string} chartId - Chart ID
 * @returns {Promise<string>} - Base64 encoded image or null if failed
 */
async function exportApexChart(chart, chartId) {
  try {
    if (!chart || !chart.w || !chart.w.globals || !chart.w.globals.dom) {
      throw new Error("Invalid chart instance");
    }

    // Get appropriate dimensions for this chart
    const dimensions = getChartDimensions(chartId);
    const { width: chartWidth, height: chartHeight } = dimensions;

    // Create a fixed-size container with extra space for legends and labels
    const fixedContainer = document.createElement("div");
    fixedContainer.style.position = "absolute";
    fixedContainer.style.left = "-9999px";
    
    const extraWidth = 100;
    
    fixedContainer.style.width = `${chartWidth + extraWidth}px`;
    fixedContainer.style.height = `${chartHeight + 100}px`;
    fixedContainer.style.backgroundColor = "#ffffff";
    fixedContainer.style.overflow = "visible";
    document.body.appendChild(fixedContainer);

    // Get the chart element
    const chartElement = chart.w.globals.dom.Paper.node.parentNode;
    if (!chartElement) {
      throw new Error("Chart element not found");
    }

    // Store original styles
    const originalStyles = {
      width: chartElement.style.width,
      height: chartElement.style.height,
      position: chartElement.style.position,
      transform: chartElement.style.transform,
    };

    // Save complete chart state
    const originalState = saveCompleteChartState(chart);
    if (!originalState) {
      throw new Error("Failed to save chart state");
    }

    // Move chart to fixed container
    const originalParent = chartElement.parentElement;
    fixedContainer.innerHTML = "";
    fixedContainer.appendChild(chartElement);

    // Set fixed dimensions with padding for legends and labels
    chartElement.style.width = `${chartWidth}px`;
    chartElement.style.height = `${chartHeight}px`;
    chartElement.style.position = "absolute";
    chartElement.style.left = "50px";
    chartElement.style.top = "20px";
    chartElement.style.transform = "none";

    // Force exact dimensions for export
    const paperNode = chart.w.globals.dom.Paper.node;
    paperNode.setAttribute("width", chartWidth.toString());
    paperNode.setAttribute("height", chartHeight.toString());
    paperNode.style.width = `${chartWidth}px`;
    paperNode.style.height = `${chartHeight}px`;
    paperNode.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    paperNode.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Remove chart titles for print export
    if (chart.updateOptions) {
      const updateConfig = {
        title: {
          text: ""
        },
        subtitle: {
          text: ""
        }
      };
      
      await chart.updateOptions(updateConfig, false, true);
    }

    // Simple configuration - only set basic properties
    let updatedOptions = {
      chart: {
        width: chartWidth,
        height: chartHeight,
        animations: {
          enabled: false
        },
        background: '#ffffff'
      }
    };

    // Force chart to redraw with new dimensions and styles
    if (chart.updateOptions) {
      await chart.updateOptions(updatedOptions, false, true);
    }

    // Let the chart update
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Use ApexCharts' dataURI method with explicit dimensions
    const uri = await chart.dataURI({
      width: chartWidth + extraWidth,
      height: chartHeight + 100,
      scale: 1,
    });

    // Restore chart to original position
    if (originalParent) {
      originalParent.appendChild(chartElement);
    }
    Object.assign(chartElement.style, originalStyles);

    // Restore complete chart state
    restoreCompleteChartState(chart, originalState);

    // Clean up the fixed container
    if (fixedContainer.parentNode) {
      document.body.removeChild(fixedContainer);
    }
    
    const base64String = uri.imgURI.split(",")[1];
    return base64String;
  } catch (error) {
    console.error("Error in exportApexChart:", error);
    return null;
  }
}

/**
 * Fallback to html2canvas for export
 */
async function exportWithHtml2Canvas(chartElement) {
  const chartId = chartElement.id;
  const dimensions = getChartDimensions(chartId);
  const { width: chartWidth, height: chartHeight } = dimensions;

  // Create a clone container with fixed dimensions
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = `${chartWidth}px`;
  container.style.height = `${chartHeight}px`;
  container.style.backgroundColor = "#ffffff";
  container.style.overflow = "hidden";

  // Clone the chart element into the container
  const clone = chartElement.cloneNode(true);
  clone.style.width = `${chartWidth}px`;
  clone.style.height = `${chartHeight}px`;
  container.appendChild(clone);
  document.body.appendChild(container);

  // Find and adjust any SVG elements
  const svgElements = clone.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    svg.setAttribute("width", chartWidth.toString());
    svg.setAttribute("height", chartHeight.toString());
    svg.style.width = `${chartWidth}px`;
    svg.style.height = `${chartHeight}px`;
    svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  try {
    // Wait for layout updates
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Use html2canvas with fixed dimensions
    const canvas = await html2canvas(clone, {
      scale: 1,
      width: chartWidth,
      height: chartHeight,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const dataURL = canvas.toDataURL("image/png");
    const base64String = dataURL.split(",")[1];

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

  const printButton = document.getElementById("printBase64");
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
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
      <span class="font-medium">Exporting Charts...</span>
    </div>`;

  try {
    // Unhide any hidden sections to ensure all charts are available
    const sections = [
      "generalContent",
      "cashContent", 
      "debtContent",
      "incomeContent",
      "expenseContent",
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

    // Define chart mappings for Standard project (9 charts)
    const chartMappings = [
      { chartId: "givingUnits_chart", fieldId: 11 },
      { chartId: "contributionsWithoutDonorExcludingLargeGifts_chart", fieldId: 12 },
      { chartId: "daysOperatingCash_chart", fieldId: 13 },
      { chartId: "netCashAvailability_chart", fieldId: 14 },
      { chartId: "debtToContributionsWithout_chart", fieldId: 15 },
      { chartId: "debtPerGivingUnit_chart", fieldId: 16 },
      { chartId: "contributionsWithoutDonorPerGivingUnit_chart", fieldId: 17 },
      { chartId: "totalContributionsPerGivingUnit_chart", fieldId: 18 },
      { chartId: "cashExpendituresPerGivingUnit_chart", fieldId: 19 },
    ];

    // Filter out any charts that don't exist in the DOM
    const validChartMappings = chartMappings.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    // Process charts with fixed dimensions
    const results = await processChartsWithSpacing(chartMappings);

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
  let uploadXml = "<qdbapi><apptoken>bbkmdcurd2sd5cpqvf58dsabq2q</apptoken>";

  // Add metadata
  const selectedYears = getSelectedYearsFromLocalStorage() || [];
  const uniqueClients = document.getElementById("uniqueClients")?.innerHTML || 0;
  const sliderValue = window.sliderValue || 0;
  const sliderValue2 = window.sliderValue2 || 0;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.toLocaleString("en-US", { month: "long" });

  uploadXml += createFieldXml(30, window.firmName || "");
  uploadXml += createFieldXml(31, uniqueClients);
  uploadXml += createFieldXml(33, Array.from(window.selectedSites_Array || []).join(";"));
  uploadXml += createFieldXml(34, Array.from(window.selectedRegions_Array || []).join(";"));
  uploadXml += createFieldXml(36, window.monthYearEnd || "");
  uploadXml += createFieldXml(35, currentYear);
  uploadXml += createFieldXml(32, currentMonth);

  // Years 1-8
  const yearFids = [37, 38, 39, 40, 41, 42, 43, 44];
  for (let i = 0; i < Math.min(selectedYears.length, yearFids.length); i++) {
    uploadXml += createFieldXml(yearFids[i], selectedYears[i]);
  }

  // Year Counts 1-8 (mapped from window.peerRecordMapPerYear)
  const yearCountFids = [45, 46, 47, 48, 49, 50, 51, 52];
  const peerYearCountMap =
    window.peerRecordMapPerYear instanceof Map
      ? window.peerRecordMapPerYear
      : new Map();
  for (let i = 0; i < Math.min(selectedYears.length, yearCountFids.length); i++) {
    const yearKey = String(selectedYears[i]);
    const yearCount = peerYearCountMap.has(yearKey)
      ? peerYearCountMap.get(yearKey)
      : 0;
    uploadXml += createFieldXml(yearCountFids[i], yearCount);
  }

  uploadXml += createFieldXml(53, sliderValue);
  uploadXml += createFieldXml(54, sliderValue2);

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
    return "";
  }

  if (typeof val === "object") {
    return "";
  }

  // Escape XML special characters in the field value
  const escapedVal = String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  return `<field fid='${id}'>${escapedVal}</field>`;
}

/**
 * Create XML field entry for an image
 * @param {string|number} id - Field ID
 * @param {string} val - Base64 image data
 * @returns {string} - XML field entry for image
 */
function createImageFieldXml(id, val) {
  if (!val) {
    return "";
  }

  // Check base64 string length (Quickbase has limits)
  if (val.length > 1000000) {
    return "";
  }

  // Validate base64 string
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(val)) {
    return "";
  }

  // Escape XML special characters in the base64 string
  const escapedVal = val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  return `<field fid='${id}' filename='chart.png'>${escapedVal}</field>`;
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
      url: "https://capincrouse.quickbase.com/db/bvcr2chqi?a=API_AddRecord",
      dataType: "xml",
      processData: false,
      data: xml,
      timeout: 60000,
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
}

// Initialize when document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApexChartsPrintFunction);
} else {
  initApexChartsPrintFunction();
}

