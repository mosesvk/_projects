// print_base64.js

const DEFAULT_CHART_WIDTH = 1100;
const DEFAULT_CHART_HEIGHT = 650; // Increased from 530 to accommodate legends
const CFI_COMPOSITE_WIDTH = 500;
const CFI_COMPOSITE_HEIGHT = 800;

/**
 * Get appropriate dimensions for a chart
 * @param {string} chartId - The ID of the chart
 * @returns {Object} - Object with width and height
 */
function getChartDimensions(chartId) {
  // CFI Composite chart needs special dimensions
  if (chartId === "cfiCompositeHtml_Chart") {
    return {
      width: CFI_COMPOSITE_WIDTH,
      height: CFI_COMPOSITE_HEIGHT,
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
    "ltDebtPerTotalOperatingRevenue_chart",
  ];

  if (smallerCharts.includes(chartId)) {
    return {
      width: Math.round(DEFAULT_CHART_WIDTH * 0.6), // 720px (60% of 1200px)
      height: DEFAULT_CHART_HEIGHT,
    };
  }

  // Default dimensions for all other charts
  return {
    width: DEFAULT_CHART_WIDTH,
    height: DEFAULT_CHART_HEIGHT,
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

    console.log(`Processing chart: ${chartId}...`);
    try {
      // Get the chart element and instance
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.warn(`Chart element not found: ${chartId}`);
        results.push({ chartId, fieldId, base64String: null });
        continue;
      }

      const chart = getChartInstance(chartId);
      console.log(`Chart instance for ${chartId}:`, chart);
      console.log(`Chart type for ${chartId}:`, typeof chart);
      console.log(
        `Chart has dataURI for ${chartId}:`,
        chart && typeof chart.dataURI === "function"
      );

      // If we have an ApexChart instance, use its export method
      if (chart && typeof chart.dataURI === "function") {
        const base64String = await exportApexChart(chart, chartId);
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

    // Deep clone the entire chart configuration
    const clonedConfig = JSON.parse(
      JSON.stringify({
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
        annotations: chartConfig.annotations || {},
        colors: chartConfig.colors || [],
        series: chartConfig.series || [],
        labels: chartConfig.labels || [],
      })
    );

    // Store chart type and parameters
    const chartType = getChartTypeFromId(chartId);

    // Get numType from chart globals (critical for formatter function)
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
    console.warn("Error saving chart state:", error);
    return null;
  }
}

// Helper function to determine chart type based on chart ID
function getChartTypeFromId(chartId) {
  const idToTypeMap = {
    cfiRatio_chart: "line",
    doeOverall_chart: "line",
    cfi_primaryReserveRatio_chart: "line",
    cfi_netIncomeOperationsRatio_chart: "line",
    cfi_returnOnNetAssets_chart: "line",
    cfi_viabilityRatio_chart: "line",
    FinancialPosition_chart: "bar",
    assetToLiabilities_chart: "bar",
    sourceOfIncomeClient_chart: "pie",
    sourceOfIncomePeer_chart: "pie",
    ffa_chart: "rangeBar",
    cashFlowsTrend_chart: "bar",
    currentRatio_chart: "line",
    salariesBenefitsToTotalExpense_chart: "radialBar",
    salariesBenefitsPerNetTuition_chart: "radialBar",
    netTuitionPerStudent_chart: "hlineargauge",
    debtBurdenRatio_chart: "radialBar",
    ltDebtPerTotalOperatingRevenue_chart: "radialBar",
    netEducationalExpensePerStudent_chart: "line",
    annualTraditionalNetTuitionPerStudent_chart: "line",
    tuitionDependency_chart: "line",
    tuitionDiscountRate_chart: "line",
    endowmentOperatingBudget_chart: "hlineargauge",
    endowmentAssetsPerStudent_chart: "line",
  };

  // Check for specific mapping
  if (idToTypeMap[chartId]) {
    return idToTypeMap[chartId];
  }

  // Fallback to infer from ID
  if (chartId.includes("_chart")) {
    return "main";
  }

  return "main"; // Default
}

/**
 * Restore complete chart state
 */
function restoreCompleteChartState(chart, originalState) {
  // console.log("RESTORE CHART STATE", { chart, originalState });
  try {
    if (
      !chart ||
      !originalState ||
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
    const chartType = originalState.chartType || getChartTypeFromId(chartId);

    // Use saved numType and fixedNum
    const numType =
      originalState.numType ||
      chart.w.globals.numType ||
      originalConfig.numType ||
      "number";
    const fixedNum =
      originalState.fixedNum !== undefined ? originalState.fixedNum : 0;

    // Different restoration logic based on chart type
    let restoredConfig;
    
    if (chartType === "radialBar") {
      // For radialBar charts, preserve the original configuration completely
      restoredConfig = {
        ...originalState.chartConfig,
        chart: {
          ...originalState.chartConfig.chart,
          animations: {
            enabled: true,
          },
        },
      };
    } else {
      // For other chart types, use the complex restoration logic
      restoredConfig = {
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
                if (value === null || value === undefined || value === 0) {
                  if (numType === "dollar") return "$0";
                  if (numType === "percent") return "0%";
                  return "0";
                }

                const isNegative = value < 0;
                const absValue = Math.abs(value);

                let formattedValue;
                if (absValue >= 1000000) {
                  // Remove decimal point for millions
                  const millions = absValue / 1000000;
                  formattedValue = `${Math.round(millions)}M`;
                } else if (absValue >= 1000) {
                  formattedValue = `${Math.round(absValue / 1000)}K`;
                } else {
                  formattedValue = Math.round(absValue).toString();
                }

                // Apply appropriate symbol based on numType
                if (numType === "dollar") {
                  return `${isNegative ? "-" : ""}$${formattedValue}`;
                } else if (numType === "percent") {
                  return `${isNegative ? "-" : ""}${formattedValue}%`;
                }
                return `${isNegative ? "-" : ""}${formattedValue}`;
              },
            },
          };
        }) : [],
      };
    }

    // First, ensure numType will be available in chart.w.globals
    if (chart.w.globals) {
      chart.w.globals.numType = numType;
    }

    // Apply the restored configuration
    if (chart.updateOptions) {
      chart.updateOptions(restoredConfig, true, true);
    }
  } catch (error) {
    console.warn("Error restoring chart state:", error);
  }
}

// Modified formatter to get numType from chart.w.globals if not provided
function createFormatterWithGlobals(numType, fixedNum) {
  return function (value) {
    // Try to get numType from chart globals if available and not provided as parameter
    // This is critical because ApexCharts doesn't pass numType to the formatter
    if (this && this.w && this.w.globals && this.w.globals.numType) {
      numType = this.w.globals.numType;
    }

    if (value === null || value === undefined || value === 0) {
      if (numType === "dollar") return "$0";
      if (numType === "percent") return "0%";
      return "0";
    }

    const isNegative = value < 0;
    const absValue = Math.abs(value);

    let formattedValue;
    if (absValue >= 1000000) {
      // Check if the division has a fractional part
      const millions = absValue / 1000000;
      const isWholeNumber = millions === Math.floor(millions);
      formattedValue = isWholeNumber
        ? `${Math.floor(millions)}M`
        : `${millions.toFixed(1)}M`;
    } else if (absValue >= 1000) {
      formattedValue = `${(absValue / 1000).toFixed(0)}K`;
    } else {
      formattedValue = absValue.toFixed(fixedNum);
    }

    if (numType === "dollar") {
      return `${isNegative ? "-" : ""}$${formattedValue}`;
    } else if (numType === "percent") {
      return `${isNegative ? "-" : ""}${formattedValue}%`;
    } else {
      return `${isNegative ? "-" : ""}${formattedValue}`;
    }
  };
}

const getChartInstance = (chartId) => {
  console.log(`Getting chart instance for ${chartId}`);

  // Get the chart instance from the global scope
  // This matches the pattern used in the main application
  const chartMap = {
    cfiRatio_chart: cfiRatio_chart,
    doeOverall_chart: doeOverall_chart,
    cfi_primaryReserveRatio_chart: cfi_primaryReserveRatio_chart,
    cfi_netIncomeOperationsRatio_chart: cfi_netIncomeOperationsRatio_chart,
    cfi_returnOnNetAssets_chart: cfi_returnOnNetAssets_chart,
    cfi_viabilityRatio_chart: cfi_viabilityRatio_chart,
    FinancialPosition_chart: FinancialPosition_chart,
    assetToLiabilities_chart: assetToLiabilities_chart,
    sourceOfIncomeClient_chart: sourceOfIncomeClient_chart,
    sourceOfIncomePeer_chart: sourceOfIncomePeer_chart,
    ffa_chart: ffa_chart,
    cashFlowsTrend_chart: cashFlowsTrend_chart,
    currentRatio_chart: currentRatio_chart,
    salariesBenefitsToTotalExpense_chart: salariesBenefitsToTotalExpense_chart,
    salariesBenefitsPerNetTuition_chart: salariesBenefitsPerNetTuition_chart,
    netEducationalExpensePerStudent_chart:
      netEducationalExpensePerStudent_chart,
    annualTraditionalNetTuitionPerStudent_chart:
      annualTraditionalNetTuitionPerStudent_chart,
    tuitionDependency_chart: tuitionDependency_chart,
    tuitionDiscountRate_chart: tuitionDiscountRate_chart,
    ltDebtPerTotalOperatingRevenue_chart: ltDebtPerTotalOperatingRevenue_chart,
    debtServiceCoverageRatio_chart: debtServiceCoverageRatio_chart,
    debtBurdenRatio_chart: debtBurdenRatio_chart,
    endowmentOperatingBudget_chart: endowmentOperatingBudget_chart,
    endowmentAssetsPerStudent_chart: endowmentAssetsPerStudent_chart,
  };

  const chart = chartMap[chartId] || null;
  console.log(`Returning chart for ${chartId}:`, chart);
  return chart;
};

/**
 * Export an ApexChart with fixed dimensions
 *
 * @param {Object} chart - ApexChart instance
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

    // Create a fixed-size container
    const fixedContainer = document.createElement("div");
    fixedContainer.style.position = "absolute";
    fixedContainer.style.left = "-9999px";
    fixedContainer.style.width = `${chartWidth}px`;
    fixedContainer.style.height = `${chartHeight}px`;
    fixedContainer.style.backgroundColor = "#ffffff";
    fixedContainer.style.overflow = "hidden";
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

    // Set fixed dimensions
    chartElement.style.width = `${chartWidth}px`;
    chartElement.style.height = `${chartHeight}px`;
    chartElement.style.position = "absolute";
    chartElement.style.transform = "none";

    // Force exact dimensions for export
    const paperNode = chart.w.globals.dom.Paper.node;
    paperNode.setAttribute("width", chartWidth.toString());
    paperNode.setAttribute("height", chartHeight.toString());
    paperNode.style.width = `${chartWidth}px`;
    paperNode.style.height = `${chartHeight}px`;
    paperNode.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    paperNode.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Get chart info
    const mainName = originalState.mainName || chartId.replace("_chart", "");
    const chartType = originalState.chartType || getChartTypeFromId(chartId);
    const numType = originalState.numType || "number";
    const fixedNum = originalState.fixedNum || 0;

    console.log("export ApexChart", {
      chart,
      numType,
      fixedNum,
      chartId,
      chartType,
      mainName,
    });

    // Ensure numType is set in globals
    if (chart.w.globals) {
      chart.w.globals.numType = numType;
    }

    // Base export options
    const baseExportOptions = {
      ...originalState.chartConfig,
      chart: {
        ...originalState.chartConfig.chart,
        width: chartWidth,
        height: chartHeight,
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        events: {
          ...originalState.chartConfig.chart?.events,
          mounted: function (chartContext) {
            chartContext.w.globals.numType = numType;

            // Call original mounted event if it exists
            if (originalState.chartConfig.chart?.events?.mounted) {
              originalState.chartConfig.chart.events.mounted.call(
                this,
                chartContext
              );
            }
          },
        },
      },
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
    };

    // Different export options based on chart type
    let exportOptions;
    
    // For radialBar charts, use simpler configuration to preserve original styling
    if (chartType === "radialBar") {
      exportOptions = {
        ...baseExportOptions,
        chart: {
          ...baseExportOptions.chart,
          width: chartWidth,
          height: chartHeight,
          animations: {
            enabled: false,
          },
          background: '#ffffff'
        },
        // Preserve original radialBar configuration
        plotOptions: originalState.chartConfig.plotOptions,
        fill: originalState.chartConfig.fill,
        stroke: originalState.chartConfig.stroke,
        labels: originalState.chartConfig.labels,
      };
    } else {
      // Handle multiple y-axes properly for other chart types
      let yaxisConfig;
      if (Array.isArray(originalState.chartConfig.yaxis)) {
        // Multiple y-axes - preserve the original structure
        yaxisConfig = originalState.chartConfig.yaxis.map((axis, index) => {
          // Create a formatter that can access chart.w.globals
          const yaxisFormatter = createFormatterWithGlobals(numType, fixedNum);
          
          return {
            ...axis,
            axisTicks: { show: true },
            axisBorder: {
              show: axis.axisBorder?.show !== false,
              color: axis.axisBorder?.color || "#3a464f",
            },
            labels: {
              ...axis.labels,
              formatter: axis.labels?.formatter ? 
                // If there's an existing formatter, try to preserve it
                (typeof axis.labels.formatter === 'function' ? axis.labels.formatter : yaxisFormatter) :
                yaxisFormatter,
              style: {
                colors: axis.labels?.style?.colors || "#3a464f",
                fontSize: axis.labels?.style?.fontSize || "1.25rem",
                ...axis.labels?.style,
              },
            },
            tooltip: { enabled: true },
            // Preserve other important properties
            opposite: axis.opposite || false,
            seriesName: axis.seriesName,
            min: axis.min,
            max: axis.max,
            show: axis.show !== false,
          };
        });
      } else {
        // Single y-axis - create array with single object
        const yaxisFormatter = createFormatterWithGlobals(numType, fixedNum);
        yaxisConfig = [
          {
            axisTicks: { show: true },
            axisBorder: {
              show: true,
              color:
                originalState.chartConfig.yaxis?.axisBorder?.color ||
                "#3a464f",
            },
            labels: {
              formatter: yaxisFormatter,
              style: {
                colors:
                  originalState.chartConfig.yaxis?.labels?.style?.colors ||
                  "#3a464f",
                fontSize:
                  originalState.chartConfig.yaxis?.labels?.style?.fontSize ||
                  "1.25rem",
              },
            },
            tooltip: { enabled: true },
          },
        ];
      }

      exportOptions = {
        ...baseExportOptions,
        yaxis: yaxisConfig,
      };
    }

    console.log(`Final export options for ${chartId}:`, exportOptions);

    // For radialBar charts, don't update options to preserve original styling
    if (chartType !== "radialBar") {
      // Update chart with export options
      chart.updateOptions(exportOptions, false, false);
    }

    // Let the chart update
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Use ApexCharts' dataURI method with explicit dimensions
    const uri = await chart.dataURI({
      width: chartWidth,
      height: chartHeight,
      scale: 1, // Reduced resolution to avoid size issues
    });

    console.log(
      `Chart ${chartId} exported successfully, URI length: ${uri.imgURI.length}`
    );

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
    console.log(`Base64 string length for ${chartId}: ${base64String.length}`);

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
  // Get chart ID from the element
  const chartId = chartElement.id;
  const dimensions = getChartDimensions(chartId);
  const { width: chartWidth, height: chartHeight } = dimensions;

  // Create a clone container with fixed dimensions
  const container = document.createElement("div");
  container.style.position = "absolute";
  // container.style.left = '-9999px';
  container.style.width = `${chartWidth}px`;
  container.style.height = `${chartHeight}px`;

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
      scale: 1, // Reduced resolution to avoid size issues
      width: chartWidth,
      height: chartHeight,
      useCORS: true,
      allowTaint: true,
      backgroundColor:
        getComputedStyle(document.documentElement).getPropertyValue(
          "--chart-bg-color"
        ) || "#ffffff",
    });

    const dataURL = canvas.toDataURL("image/png");
    const base64String = dataURL.split(",")[1];

    console.log(
      `html2canvas export for ${chartElement.id}: dataURL length: ${dataURL.length}, base64 length: ${base64String.length}`
    );

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
      "DoeContent",
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

    // Define chart mappings
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
    console.log("Checking DOM elements for charts:");
    chartMappings.forEach(({ chartId }) => {
      const element = document.getElementById(chartId);
      console.log(`${chartId}:`, element ? "EXISTS" : "MISSING");
    });

    const validChartMappings = chartMappings.filter(
      ({ chartId }) => document.getElementById(chartId) !== null
    );

    if (validChartMappings.length === 0) {
      throw new Error("No valid charts found to upload");
    }

    console.log(
      "Valid chart mappings:",
      validChartMappings.map((m) => m.chartId)
    );

    // Process charts with fixed dimensions
    const results = await processChartsWithSpacing(validChartMappings);

    console.log(
      "Export results:",
      results.map((r) => ({
        chartId: r.chartId,
        success: r.base64String !== null,
        base64Length: r.base64String ? r.base64String.length : 0,
      }))
    );

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

  const selectedYears = getSelectedYearsFromLocalStorage();

  console.log("Adding basic fields to XML...");
  console.log("Field 31 (firmName):", firmName);
  uploadXml += createFieldXml(31, firmName);

  // Check if uniqueClientSize exists before using it
  if (typeof window.uniqueClientSize !== "undefined") {
    console.log("Field 32 (uniqueClientSize):", window.uniqueClientSize);
    uploadXml += createFieldXml(32, window.uniqueClientSize);
  }

  console.log(
    "Field 94 (selectedYears):",
    selectedYears[selectedYears.length - 1]
  );
  uploadXml += createFieldXml(94, selectedYears[selectedYears.length - 1]);
  console.log("Field 69 (monthYearEnd):", window.monthYearEnd);
  uploadXml += createFieldXml(69, window.monthYearEnd);
  console.log("Field 89 (sliderValue):", sliderValue);
  uploadXml += createFieldXml(89, sliderValue);
  console.log("Field 90 (sliderValue2):", sliderValue2);
  uploadXml += createFieldXml(90, sliderValue2);

  // Optimize array joins by checking if arrays exist first
  console.log(
    "Field 91 (selectedSeminaries):",
    window.selectedSeminaries_Array
      ? Array.from(window.selectedSeminaries_Array).join(", ")
      : ""
  );
  uploadXml += createFieldXml(
    91,
    window.selectedSeminaries_Array
      ? Array.from(window.selectedSeminaries_Array).join(", ")
      : ""
  );
  console.log(
    "Field 93 (selectedRegionals):",
    window.selectedRegionals_Array
      ? Array.from(window.selectedRegionals_Array).join(", ")
      : ""
  );
  uploadXml += createFieldXml(
    93,
    window.selectedRegionals_Array
      ? Array.from(window.selectedRegionals_Array).join(", ")
      : ""
  );
  console.log(
    "Field 64 (selectedRegions):",
    window.selectedRegions_Array
      ? Array.from(window.selectedRegions_Array).join(", ")
      : ""
  );
  uploadXml += createFieldXml(
    64,
    window.selectedRegions_Array
      ? Array.from(window.selectedRegions_Array).join(", ")
      : ""
  );
  console.log(
    "Field 65 (selectedStates):",
    window.selectedStates_Array
      ? Array.from(window.selectedStates_Array).join(", ")
      : ""
  );
  uploadXml += createFieldXml(
    65,
    window.selectedStates_Array
      ? Array.from(window.selectedStates_Array).join(", ")
      : ""
  );
  console.log(
    "Field 66 (selectedMemberships):",
    window.selectedMemberships_Array
      ? Array.from(window.selectedMemberships_Array).join(", ")
      : ""
  );
  uploadXml += createFieldXml(
    66,
    window.selectedMemberships_Array
      ? Array.from(window.selectedMemberships_Array).join(", ")
      : ""
  );
  console.log(
    "Field 67 (selectedTypes):",
    window.selectedTypes_Array
      ? Array.from(window.selectedTypes_Array).join(", ")
      : ""
  );
  uploadXml += createFieldXml(
    67,
    window.selectedTypes_Array
      ? Array.from(window.selectedTypes_Array).join(", ")
      : ""
  );
  console.log(
    "Field 68 (selectedAthletics):",
    window.selectedAthletics_Array
      ? Array.from(window.selectedAthletics_Array).join(", ")
      : ""
  );
  uploadXml += createFieldXml(
    68,
    window.selectedAthletics_Array
      ? Array.from(window.selectedAthletics_Array).join(", ")
      : ""
  );

  // Add each selected year to corresponding fields (73, 74, 75)
  selectedYears.forEach((year, index) => {
    if (index < 8) {
      // Only process up to 8 years
      uploadXml += createFieldXml(73 + index, year);
      uploadXml += createFieldXml(
        81 + index,
        window.uniqueClientsPerYearMap[year]
      );

      // Check if clientsByYear exists and has the year data before accessing it
      if (
        window.clientsByYear &&
        typeof window.clientsByYear.get === "function"
      ) {
        const yearData = window.clientsByYear.get(String(year));
        if (yearData && yearData.size) {
          uploadXml += createFieldXml(81 + index, yearData.size);
        }
      }
    }
  });

  // Add base64 images for charts
  console.log(
    "Processing results for XML upload:",
    results.map((r) => ({
      chartId: r.chartId,
      fieldId: r.fieldId,
      hasData: !!r.base64String,
    }))
  );

  results.forEach((result) => {
    if (result && result.base64String) {
      // Validate base64 string before adding to XML
      if (/^[A-Za-z0-9+/]*={0,2}$/.test(result.base64String)) {
        console.log(
          `Adding chart ${result.chartId} to XML for field ${result.fieldId}`
        );
        try {
          const imageXml = createImageFieldXml(
            result.fieldId,
            result.base64String
          );
          uploadXml += imageXml;
          console.log(`Successfully added XML for ${result.chartId}`);
        } catch (error) {
          console.error(`Error creating XML for ${result.chartId}:`, error);
        }
      } else {
        console.warn(`Skipping chart ${result.chartId} - invalid base64 data`);
      }
    } else {
      console.warn(`Skipping chart ${result.chartId} - no base64 data`);
    }
  });

  uploadXml += "</qdbapi>";
  console.log(`Final XML length: ${uploadXml.length} characters`);

  // Check if source of income charts are in the XML
  const sourceOfIncomeClientInXml =
    uploadXml.includes("sourceOfIncomeClient_chart") ||
    uploadXml.includes("fid='14'");
  const sourceOfIncomePeerInXml =
    uploadXml.includes("sourceOfIncomePeer_chart") ||
    uploadXml.includes("fid='15'");
  console.log(
    `sourceOfIncomeClient_chart in XML: ${sourceOfIncomeClientInXml}`
  );
  console.log(`sourceOfIncomePeer_chart in XML: ${sourceOfIncomePeerInXml}`);

  // Debug: Check XML structure around the error position
  if (uploadXml.length > 1282) {
    console.log("XML around position 1282:", uploadXml.substring(1270, 1300));
    console.log("Character at position 1282:", uploadXml.charAt(1281));
    console.log("Character code at position 1282:", uploadXml.charCodeAt(1281));
  }

  // Validate XML structure
  try {
    // Simple validation - check for unescaped characters
    if (uploadXml.includes("&") && !uploadXml.includes("&amp;")) {
      console.warn("Found unescaped & character in XML");
    }
    if (uploadXml.includes("<") && !uploadXml.includes("&lt;")) {
      console.warn("Found unescaped < character in XML");
    }
    if (uploadXml.includes(">") && !uploadXml.includes("&gt;")) {
      console.warn("Found unescaped > character in XML");
    }
  } catch (error) {
    console.error("Error validating XML:", error);
  }

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
    console.warn(`Skipping image upload for field ${id} - missing data`);
    return "";
  }

  // Check base64 string length (Quickbase has limits)
  if (val.length > 1000000) {
    // 1MB limit
    console.warn(
      `Base64 string too long for field ${id} (${val.length} chars), skipping`
    );
    return "";
  }

  // Validate base64 string
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(val)) {
    console.warn(`Invalid base64 string for field ${id}, skipping`);
    return "";
  }

  // Escape XML special characters in the base64 string
  const escapedVal = val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  console.log(`Creating XML field for ${id}, base64 length: ${val.length}`);
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
