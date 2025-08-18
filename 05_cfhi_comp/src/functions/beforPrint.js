// print_base64.js

const DEFAULT_CHART_WIDTH = 1100;
const DEFAULT_CHART_HEIGHT = 530;

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
                
      const chart = window[chartId];



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
      await new Promise((resolve) => setTimeout(resolve, 50));
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
    
    console.log(`🔍 [STATE DEBUG] Saving state for ${chartId}:`, {
      hasPaperNode: !!paperNode,
      hasChartConfig: !!chartConfig,
      mainName: mainName,
      hasLegend: !!chartConfig.legend,
      legendConfig: chartConfig.legend,
      hasSeries: !!chartConfig.series,
      seriesCount: chartConfig.series?.length,
      seriesNames: chartConfig.series?.map(s => s.name),
      hasAnnotations: !!chartConfig.annotations,
      annotationsCount: chartConfig.annotations?.yaxis?.length,
    });

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

    // For costOfContributions chart, save the exact y-axis configuration
    let yaxisConfig = null;
    if (
      chartType === "costOfContributions" &&
      Array.isArray(chartConfig.yaxis)
    ) {
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
    netAssetBreakdown_chart: "netAssetBreakdown",
    changeInNetAssets_chart: "line",
    statementCashFlows_chart: "cashFlow",
    functionalAllocation_chart: "functionalAllocation",
    costOfContributions_chart: "costOfContributions",
    costOfContributionsDetailView_chart: "costOfContributions",
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

    // First, ensure numType will be available in chart.w.globals
    if (chart.w.globals) {
      chart.w.globals.numType = numType;
    }

    // For costOfContributions chart, use the saved y-axis configuration
    if (chartType === "costOfContributions") {
      // First, get the original y-axis configuration
      const originalYAxis = originalState.chartConfig.yaxis;

      // console.log("CHARTTYPE==costOfContributions", {
      //   originalState,
      //   originalYAxis,
      // });

      restoredConfig = {
        ...originalState.chartConfig,
        yaxis: [
          // First y-axis (dollar values)
          {
            ...originalYAxis[0],
            labels: {
              ...originalYAxis[0].labels,
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
                } else if (absValue < 1 && absValue > 0) {
                  formattedValue = absValue.toFixed(2);
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
          },
          // Second y-axis (hidden)
          {
            ...originalYAxis[1],
          },
          // Third y-axis (ratio values)
          {
            ...originalYAxis[2],
            labels: {
              ...originalYAxis[2].labels,
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
                } else if (absValue < 1 && absValue > 0) {
                  formattedValue = absValue.toFixed(2);
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
              style: {
                ...originalYAxis[2].labels?.style,
                colors: originalYAxis[2]?.labels?.style?.colors || "#3a464f",
                fontSize: "1.25rem",
              },
            },
          },
          // Fourth y-axis (hidden)
          {
            ...originalYAxis[3],
          },
        ],
      };
    } else {
      // Use existing restoration logic for other chart types
      // Handle both array and single object yaxis configurations
      const originalYAxis = originalState.chartConfig.yaxis;
      const isYAxisArray = Array.isArray(originalYAxis);
      
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
        yaxis: isYAxisArray
          ? originalState.chartConfig.yaxis.map((axis) => {
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
            })
          : {
              ...originalState.chartConfig.yaxis,
              labels: {
                ...originalState.chartConfig.yaxis?.labels,
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
            },
      };
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

/**
 * Export an ApexChart with fixed dimensions
 *
 * @param {Object} chart - ApexChart instance
 * @returns {Promise<string>} - Base64 encoded image or null if failed
 */
async function exportApexChart(chart, chartId) {
  // Calculate export dimensions at the very beginning
  const exportWidth = DEFAULT_CHART_WIDTH - 40; // Account for padding
  const exportHeight = DEFAULT_CHART_HEIGHT - 170; // Account for padding and legend (increased from 120 to 170)
  
  console.log(`🔍 [EXPORT DEBUG] Starting export for ${chartId}`);
  console.log(`🔍 [EXPORT DEBUG] Chart instance:`, {
    hasChart: !!chart,
    hasGlobals: !!chart?.w?.globals,
    hasDom: !!chart?.w?.globals?.dom,
    chartId: chart?.w?.globals?.chartID,
  });
  
  try {
    // Check for different possible chart structures
    if (!chart) {
      throw new Error("Chart instance is null or undefined");
    }
    
    if (!chart.w) {
      throw new Error("Chart missing 'w' property");
    }
    
    // Try different ways to access the chart element
    let chartElementToUse = null;
    let chartGlobals = chart.w.globals || chart.w;
    
    if (chartGlobals.dom && chartGlobals.dom.Paper && chartGlobals.dom.Paper.node) {
      chartElementToUse = chartGlobals.dom.Paper.node.parentNode;
    } else if (chart.el) {
      chartElementToUse = chart.el;
    } else if (chart.w.dom && chart.w.dom.Paper && chart.w.dom.Paper.node) {
      chartElementToUse = chart.w.dom.Paper.node.parentNode;
    }
    
    if (!chartElementToUse) {
      throw new Error("Chart element not found - tried multiple access methods");
    }

    // Create a fixed-size container
    const fixedContainer = document.createElement("div");
    fixedContainer.style.position = "absolute";
    fixedContainer.style.left = "-9999px";
    fixedContainer.style.width = `${DEFAULT_CHART_WIDTH}px`;
    fixedContainer.style.height = `${DEFAULT_CHART_HEIGHT}px`;
    fixedContainer.style.backgroundColor = "#ffffff";
    fixedContainer.style.overflow = "visible"; // Change from hidden to visible
    fixedContainer.style.padding = "20px"; // Add padding
    document.body.appendChild(fixedContainer);

    // Use the chart element we found
    const chartElement = chartElementToUse;

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
    
    console.log(`🔍 [EXPORT DEBUG] Original state for ${chartId}:`, {
      chartId: originalState.chartId,
      chartType: originalState.chartType,
      mainName: originalState.mainName,
      numType: originalState.numType,
      fixedNum: originalState.fixedNum,
      hasLegend: !!originalState.chartConfig.legend,
      legendConfig: originalState.chartConfig.legend,
      hasSeries: !!originalState.chartConfig.series,
      seriesCount: originalState.chartConfig.series?.length,
      seriesNames: originalState.chartConfig.series?.map(s => s.name),
      hasAnnotations: !!originalState.chartConfig.annotations,
      annotationsCount: originalState.chartConfig.annotations?.yaxis?.length,
    });

    // Move chart to fixed container
    const originalParent = chartElement.parentElement;
    fixedContainer.innerHTML = "";
    fixedContainer.appendChild(chartElement);

    // Set fixed dimensions with extra space for labels and y-axis
    const chartWidth = DEFAULT_CHART_WIDTH - 20; // Reduced padding to give more space for y-axis labels
    const chartHeight = DEFAULT_CHART_HEIGHT - 170; // Account for padding and legend
    
    // Create a larger container to ensure legend is captured
    const exportContainer = document.createElement("div");
    exportContainer.style.width = `${DEFAULT_CHART_WIDTH}px`;
    exportContainer.style.height = `${DEFAULT_CHART_HEIGHT + 100}px`; // Extra height for legend
    exportContainer.style.position = "absolute";
    exportContainer.style.left = "-9999px";
    exportContainer.style.top = "0";
    exportContainer.style.overflow = "visible";
    exportContainer.style.backgroundColor = "white";
    
    // Position chart within the larger container
    chartElement.style.width = `${chartWidth}px`;
    chartElement.style.height = `${chartHeight}px`;
    chartElement.style.position = "absolute";
    chartElement.style.left = "0";
    chartElement.style.top = "0";
    
    // Add chart to the export container
    exportContainer.appendChild(chartElement);
    document.body.appendChild(exportContainer);
    
    // Debug export container setup
    console.log(`🔍 [EXPORT DEBUG] Container setup for ${chartId}:`, {
      exportContainerWidth: exportContainer.style.width,
      exportContainerHeight: exportContainer.style.height,
      chartElementWidth: chartElement.style.width,
      chartElementHeight: chartElement.style.height,
      chartElementPosition: chartElement.style.position,
      chartElementLeft: chartElement.style.left,
      chartElementTop: chartElement.style.top,
      exportContainerPosition: exportContainer.style.position,
      exportContainerLeft: exportContainer.style.left,
      exportContainerTop: exportContainer.style.top,
      exportContainerOverflow: exportContainer.style.overflow,
      exportContainerBackground: exportContainer.style.backgroundColor,
    });

    // Force exact dimensions for export
    const paperNode = chart.w.globals.dom.Paper.node;
    paperNode.setAttribute("width", chartWidth.toString());
    paperNode.setAttribute("height", chartHeight.toString());
    paperNode.style.width = `${chartWidth}px`;
    paperNode.style.height = `${chartHeight}px`;
    paperNode.setAttribute(
      "viewBox",
      `0 0 ${chartWidth} ${chartHeight}`
    );
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
        width: DEFAULT_CHART_WIDTH,
        height: DEFAULT_CHART_HEIGHT,
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        // Ensure consistent layout regardless of annotations
        parentHeightOffset: 0,
        offsetX: 0,
        offsetY: 0,
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
      // Let original legend configuration handle everything
    };
    
    console.log(`🔍 [EXPORT DEBUG] Base export options for ${chartId}:`, {
      hasLegend: !!baseExportOptions.legend,
      legendConfig: baseExportOptions.legend,
      hasSeries: !!baseExportOptions.series,
      seriesCount: baseExportOptions.series?.length,
      seriesNames: baseExportOptions.series?.map(s => s.name),
      hasAnnotations: !!baseExportOptions.annotations,
      annotationsCount: baseExportOptions.annotations?.yaxis?.length,
    });

    // Different export options based on chart type
    let exportOptions;
    // Create a formatter that can access chart.w.globals
    const yaxisFormatter = createFormatterWithGlobals(numType, fixedNum);

    // Handle each chart type specifically
    if (chartId === "costOfContributionsDetailView_chart") {
      // Cost of contributions chart - Handle multiple axes
      if (Array.isArray(originalState.chartConfig.yaxis)) {
        // Get the min and max values for ratio axes
        const safeMinRatioValue = originalState.chartConfig.yaxis[2]?.min || 0;
        const safeMaxRatioValue =
          originalState.chartConfig.yaxis[2]?.max || 0.12;

        exportOptions = {
          ...baseExportOptions,
          yaxis: [
            // First y-axis (dollar values)
            {
              ...originalState.chartConfig.yaxis[0],
              labels: {
                ...originalState.chartConfig.yaxis[0].labels,
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
                    const millions = absValue / 1000000;
                    const isWholeNumber = millions === Math.floor(millions);
                    formattedValue = isWholeNumber
                      ? `${Math.floor(millions)}M`
                      : `${millions.toFixed(1)}M`;
                  } else if (absValue >= 1000) {
                    formattedValue = `${(absValue / 1000).toFixed(0)}K`;
                  } else {
                    formattedValue = absValue.toFixed(2);
                  }

                  return `${isNegative ? "-" : ""}$${formattedValue}`;
                },
              },
            },
            // Second y-axis (hidden)
            {
              ...originalState.chartConfig.yaxis[1],
            },
            // Third y-axis (ratio values)
            {
              ...originalState.chartConfig.yaxis[2],
              labels: {
                ...originalState.chartConfig.yaxis[2].labels,
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
                  } else if (absValue < 1 && absValue > 0) {
                    formattedValue = absValue.toFixed(2);
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
                style: {
                  ...originalState.chartConfig.yaxis[2].labels?.style,
                  colors:
                    originalState.chartConfig.yaxis[2]?.labels?.style?.colors ||
                    "#3a464f",
                  fontSize: "1.25rem",
                },
              },
              min: safeMinRatioValue,
              max: safeMaxRatioValue,
              tickAmount: 5,
              show: true,
              opposite: true,
              axisBorder: {
                show: true,
                color:
                  originalState.chartConfig.yaxis[2]?.axisBorder?.color ||
                  "#3a464f",
              },
              axisTicks: {
                show: true,
                color:
                  originalState.chartConfig.yaxis[2]?.axisTicks?.color ||
                  "#3a464f",
              },
            },
            // Fourth y-axis (hidden)
            {
              ...originalState.chartConfig.yaxis[3],
            },
          ],
        };

        console.log("export ApexChart CHARTTYPE==costOfContributions", {
          exportOptions,
        });
      } else {
        // Fallback for single yaxis
        exportOptions = {
          ...baseExportOptions,
          yaxis: {
            ...originalState.chartConfig.yaxis,
            labels: {
              ...originalState.chartConfig.yaxis?.labels,
              formatter: yaxisFormatter,
              style: {
                ...originalState.chartConfig.yaxis?.labels?.style,
                colors:
                  originalState.chartConfig.yaxis?.labels?.style?.colors ||
                  "#3a464f",
                fontSize:
                  originalState.chartConfig.yaxis?.labels?.style?.fontSize ||
                  "1.25rem",
              },
            },
          },
        };
      }
    } else if (chartId === "costOfContributions_chart") {
      if (Array.isArray(originalState.chartConfig.yaxis)) {
        // Get the min and max values for ratio axes
        const safeMinRatioValue = originalState.chartConfig.yaxis?.min || 0;
        const safeMaxRatioValue =
          originalState.chartConfig.yaxis?.max || 0.12;

        exportOptions = {
          ...baseExportOptions,
          yaxis: [
            {
              ...originalState.chartConfig.yaxis,
              labels: {
                ...originalState.chartConfig.yaxis.labels,
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
                  } else if (absValue < 1 && absValue > 0) {
                    formattedValue = absValue.toFixed(2);
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
                style: {
                  ...originalState.chartConfig.yaxis.labels?.style,
                  colors:
                    originalState.chartConfig.yaxis?.labels?.style?.colors ||
                    "#3a464f",
                  fontSize: "1.25rem",
                },
              },
              min: safeMinRatioValue,
              max: safeMaxRatioValue,
              tickAmount: 5,
              show: true,
              axisBorder: {
                show: true,
                color:
                  originalState.chartConfig.yaxis?.axisBorder?.color ||
                  "#3a464f",
              },
              axisTicks: {
                show: true,
                color:
                  originalState.chartConfig.yaxis?.axisTicks?.color ||
                  "#3a464f",
              },
            },
          ],
        };

        console.log("export ApexChart CHARTTYPE==costOfContributions", {
          exportOptions,
        });
      } else {
        // Fallback for single yaxis
        exportOptions = {
          ...baseExportOptions,
          yaxis: {
            ...originalState.chartConfig.yaxis,
            labels: {
              ...originalState.chartConfig.yaxis?.labels,
              formatter: yaxisFormatter,
              style: {
                ...originalState.chartConfig.yaxis?.labels?.style,
                colors:
                  originalState.chartConfig.yaxis?.labels?.style?.colors ||
                  "#3a464f",
                fontSize:
                  originalState.chartConfig.yaxis?.labels?.style?.fontSize ||
                  "1.25rem",
              },
            },
          },
        };
      }
    } else {
      // Main chart type - Ensure we use an array with a single object for yaxis
      // Handle both array and single object yaxis configurations
      const yaxisConfig = Array.isArray(originalState.chartConfig.yaxis) 
        ? originalState.chartConfig.yaxis[0] 
        : originalState.chartConfig.yaxis;

      exportOptions = {
        ...baseExportOptions,
        yaxis: [
          {
            axisTicks: { show: true },
            axisBorder: {
              show: true,
              color: yaxisConfig?.axisBorder?.color || "#3a464f",
            },
            labels: {
              formatter: yaxisFormatter,
              style: {
                colors: yaxisConfig?.labels?.style?.colors || "#3a464f",
                fontSize: yaxisConfig?.labels?.style?.fontSize || "1.25rem",
              },
            },
            tooltip: { enabled: true },
            // Preserve any existing yaxis configuration
            ...(yaxisConfig?.min !== undefined && { min: yaxisConfig.min }),
            ...(yaxisConfig?.max !== undefined && { max: yaxisConfig.max }),
            ...(yaxisConfig?.tickAmount !== undefined && { tickAmount: yaxisConfig.tickAmount }),
          },
        ],
      };
    }

    // Update chart with export options
    chart.updateOptions(exportOptions, false, false);
    
    console.log(`🔍 [EXPORT DEBUG] Final export options for ${chartId}:`, {
      hasLegend: !!exportOptions.legend,
      legendConfig: exportOptions.legend,
      hasSeries: !!exportOptions.series,
      seriesCount: exportOptions.series?.length,
      seriesNames: exportOptions.series?.map(s => s.name),
      hasAnnotations: !!exportOptions.annotations,
      annotationsCount: exportOptions.annotations?.yaxis?.length,
    });
    
    // Special handling for debt charts with single annotations
    if (chartId.includes('debt') && exportOptions.annotations?.yaxis?.length === 1) {
      console.log(`🔍 [EXPORT DEBUG] Applying special legend fix for debt chart: ${chartId}`);
      
      // Force legend to be visible and properly positioned
      chart.updateOptions({
        legend: {
          show: true,
          showForNullSeries: true,
          showForZeroSeries: true,
          position: "bottom",
          horizontalAlign: "center",
          offsetX: 40,
          offsetY: 4,
          fontSize: "20px",
          floating: false,
          inverseOrder: false,
          customLegendItems: [],
          clusterGroupedSeries: true,
          clusterGroupedSeriesOrientation: "vertical",
          labels: {
            useSeriesColors: false
          },
          markers: {
            size: 7,
            strokeWidth: 1,
            offsetX: 0,
            offsetY: 0
          },
          itemMargin: {
            horizontal: 5,
            vertical: 4
          },
          onItemClick: {
            toggleDataSeries: true
          },
          onItemHover: {
            highlightDataSeries: true
          }
        },
        // Ensure all series are visible in legend even if not visible on chart
        series: exportOptions.series.map(series => ({
          ...series,
          showInLegend: true,
          showForNullSeries: true,
          showForZeroSeries: true
        }))
      }, false, false);
      
      // Wait a bit longer for debt charts to ensure legend is rendered
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Let the chart update with minimal timeout
    const updateTimeout = 100;
    await new Promise((resolve) => setTimeout(resolve, updateTimeout));

    // Use ApexCharts' dataURI method with explicit dimensions
    console.log(`🔍 [EXPORT DEBUG] Calling dataURI for ${chartId} with dimensions:`, {
      width: exportWidth,
      height: exportHeight,
      scale: 2,
      chartElementWidth: chartElement.style.width,
      chartElementHeight: chartElement.style.height,
      exportContainerWidth: exportContainer.style.width,
      exportContainerHeight: exportContainer.style.height,
    });
    
    const uri = await chart.dataURI({
      width: exportWidth,
      height: exportHeight,
      scale: 2, // Higher resolution
    });
    
    console.log(`🔍 [EXPORT DEBUG] dataURI result for ${chartId}:`, {
      hasUri: !!uri,
      hasImgURI: !!uri?.imgURI,
      uriLength: uri?.imgURI?.length,
      uriType: uri?.imgURI?.substring(0, 30) + "...",
    });

    // Restore chart to original position
    if (originalParent) {
      originalParent.appendChild(chartElement);
    }
    Object.assign(chartElement.style, originalStyles);

    // Restore complete chart state
    restoreCompleteChartState(chart, originalState);

    // Clean up the containers
    if (fixedContainer.parentNode) {
      document.body.removeChild(fixedContainer);
    }
    if (exportContainer.parentNode) {
      document.body.removeChild(exportContainer);
    }

    return uri.imgURI.split(",")[1];
  } catch (error) {
    console.error("Error in exportApexChart:", error);
    
    // Clean up on error
    try {
      if (fixedContainer && fixedContainer.parentNode) {
        document.body.removeChild(fixedContainer);
      }
      if (exportContainer && exportContainer.parentNode) {
        document.body.removeChild(exportContainer);
      }
    } catch (cleanupError) {
      console.warn("Error during cleanup:", cleanupError);
    }
    
    return null;
    }
}

/**
 * Fallback to html2canvas for export
 */
async function exportWithHtml2Canvas(chartElement) {
  // Create a clone container with fixed dimensions
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = `${DEFAULT_CHART_WIDTH}px`;
  container.style.height = `${DEFAULT_CHART_HEIGHT}px`;
  container.style.backgroundColor = "#ffffff";
  container.style.overflow = "visible"; // Change from hidden to visible
  container.style.padding = "20px"; // Add padding

  // Clone the chart element into the container
  const clone = chartElement.cloneNode(true);
  const chartWidth = DEFAULT_CHART_WIDTH - 40; // Account for padding
  const chartHeight = DEFAULT_CHART_HEIGHT - 170; // Account for padding and legend (increased from 120 to 170)
  
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
    svg.setAttribute(
      "viewBox",
      `0 0 ${chartWidth} ${chartHeight}`
    );
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  // Find and adjust any canvas elements
  const canvasElements = clone.querySelectorAll("canvas");
  canvasElements.forEach((canvas) => {
    canvas.style.width = `${chartWidth}px`;
    canvas.style.height = `${chartHeight}px`;
  });

  try {
    // Wait for layout updates
    const layoutTimeout = 100;
    await new Promise((resolve) => setTimeout(resolve, layoutTimeout));

    // Use html2canvas with fixed dimensions
    const canvas = await html2canvas(clone, {
      scale: 2,
      width: chartWidth,
      height: chartHeight,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      removeContainer: false,
      foreignObjectRendering: true,
    });

    const base64String = canvas.toDataURL("image/png").split(",")[1];

    // Clean up
    if (container.parentNode) {
      document.body.removeChild(container);
    }

    return base64String;
    } catch (error) {
    console.error("Error in html2canvas export:", error);
    
    // Clean up on error
    try {
      if (container.parentNode) {
        document.body.removeChild(container);
      }
    } catch (cleanupError) {
      console.warn("Error during html2canvas cleanup:", cleanupError);
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
    <div class=\"w-full\">
      <div class=\"flex justify-between mb-1 text-white\">
        <span id=\"chart-progress-text\" class=\"text-lg font-medium\">Processing charts</span>
        <span id=\"chart-progress-count\" class=\"text-lg font-medium\">0/${totalCharts}</span>
      </div>
      <div class=\"w-full bg-gray-700 rounded-full h-2.5 mt-2\">
        <div id=\"chart-progress-bar\" class=\"backgroundGreen h-2.5 rounded-full\" style=\"width: 0%\"></div>
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
    <div class=\"flex items-center justify-center\">
      <svg aria-hidden=\"true\" role=\"status\" class=\"inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin\" viewBox=\"0 0 100 101\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
        <path d=\"M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z\" fill=\"#E5E7EB\"/>
        <path d=\"M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C  47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z\" fill=\"currentColor\"/>
      </svg>
      <span class=\"font-medium\">Exporting Charts...</span>
    </div>`;

  try {
    // Unhide any hidden sections to ensure all charts are available
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
        hiddenSections.push(element);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Define chart mappings (updated to CFHI Base64 field IDs)
    const chartMappings = [
      { chartId: "givingUnits_chart", fieldId: 11 },
      { chartId: "attendeesToStaff_chart", fieldId: 12 },
      { chartId: "daysExpendableNetAssets_chart", fieldId: 13 },
      { chartId: "daysOperatingCash_chart", fieldId: 14 },
      { chartId: "availableDaysOfCashFlow_chart", fieldId: 15 },
      { chartId: "liquidityRatio_chart", fieldId: 16 },
      { chartId: "netCashAvailability_chart", fieldId: 17 },
      { chartId: "debtToContributionsWithout_chart", fieldId: 18 },
      { chartId: "currentRatio_chart", fieldId: 19 },
      { chartId: "mandatoryDebtServiceToContributionsWithout_chart", fieldId: 20 },
      { chartId: "debtPerGivingUnit_chart", fieldId: 21 },
      { chartId: "debtCoverage_chart", fieldId: 22 },
      { chartId: "netIncomeRatio_chart", fieldId: 23 },
      { chartId: "contributionsWithoutDonorPerGivingUnit_chart", fieldId: 24 },
      { chartId: "totalContributionsPerGivingUnit_chart", fieldId: 25 },
      { chartId: "benefitsToSalaries_chart", fieldId: 26 },
      { chartId: "salariesBenefitsIncludingOutsourcedEmployees_chart", fieldId: 27 },
      { chartId: "personnelToCashExpenditure_chart", fieldId: 28 },
      { chartId: "cashExpendituresPerGivingUnit_chart", fieldId: 29 },
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
    if (response.success) {
      const xmlResponse = $(response.response);
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
    } else {
      showApiLoadingFunction("close", "print");
      throw new Error(response.error || "Quickbase upload failed");
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

  uploadXml += createFieldXml(30, firmName);
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
    console.warn(`Skipping upload for field ${id} due to null/undefined value`);
    return "";
  }

  if (typeof val === "object") {
    console.warn(`Invalid value type for field ${id}:`, typeof val);
    return "";
  }

  const safeVal = String(val)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  return `<field fid='${id}'>${safeVal}</field>`;
}

/**
 * Create XML field entry for an image
 * @param {string|number} id - Field ID
 * @param {string} val - Base64 image data (with or without data URI prefix)
 * @returns {string} - XML field entry for image
 */
function createImageFieldXml(id, val) {
  if (!val) {
    console.warn(`Skipping image upload for field ${id} - missing data`);
    return "";
  }
  const base64Only = val.includes(",") ? val.split(",")[1] : val;
  return `<field fid='${id}' filename='chart.png'>${base64Only}</field>`;
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
      timeout: 60000, // 60-second timeout
    });

    return { success: true, response };
    } catch (error) {
    const errorMessage =
      error.responseText ||
      error.statusText ||
      error.message ||
      "Unknown error";
    return { success: false, error: `Quickbase API error: ${errorMessage}` };
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

    // console.log("ApexCharts export print functionality initialized");
}

/**
 * Test function to verify chart export functionality
 * This can be called from the browser console to test specific charts
 */
window.testChartExport = async function(chartId) {
  console.log(`🔍 [TEST] Testing chart export for: ${chartId}`);
  
  const chart = window[chartId];
  const chartElement = document.getElementById(chartId);
  
  if (!chart) {
    console.error(`❌ Chart instance not found for: ${chartId}`);
    return null;
  }
  
  if (!chartElement) {
    console.error(`❌ Chart element not found for: ${chartId}`);
    return null;
  }
  
  console.log(`🔍 [TEST] Chart state for ${chartId}:`, {
    hasGlobals: !!chart.w?.globals,
    hasDom: !!chart.w?.globals?.dom,
    hasPaper: !!chart.w?.globals?.dom?.Paper,
    chartWidth: chart.w?.globals?.svgWidth,
    chartHeight: chart.w?.globals?.svgHeight,
    elementDimensions: {
      width: chartElement.offsetWidth,
      height: chartElement.offsetHeight,
      clientWidth: chartElement.clientWidth,
      clientHeight: chartElement.clientHeight
    },
    // Add chart configuration details
    chartConfig: {
      hasLegend: !!chart.w?.config?.legend,
      legendConfig: chart.w?.config?.legend,
      hasSeries: !!chart.w?.config?.series,
      seriesCount: chart.w?.config?.series?.length,
      seriesNames: chart.w?.config?.series?.map(s => s.name),
      hasAnnotations: !!chart.w?.config?.annotations,
      annotationsCount: chart.w?.config?.annotations?.yaxis?.length,
    }
  });
  
  try {
    const result = await exportApexChart(chart, chartId);
    if (result) {
      console.log(`✅ Successfully exported ${chartId}`);
      return result;
    } else {
      console.log(`❌ Failed to export ${chartId} with ApexCharts, trying html2canvas...`);
      const fallbackResult = await exportWithHtml2Canvas(chartElement);
      if (fallbackResult) {
        console.log(`✅ Successfully exported ${chartId} with html2canvas`);
        return fallbackResult;
      } else {
        console.error(`❌ Failed to export ${chartId} with both methods`);
        return null;
      }
    }
  } catch (error) {
    console.error(`Error testing chart export for ${chartId}:`, error);
    return null;
  }
};

/**
 * Comprehensive test function to check for cutting off issues
 * This can be called from the browser console to test the debt charts
 */
window.testDebtChartsCutoff = async function() {
  const debtCharts = [
    "debtToContributionsWithout_chart",
    "currentRatio_chart", 
    "mandatoryDebtServiceToContributionsWithout_chart",
    "debtPerGivingUnit_chart",
    "debtCoverage_chart"
  ];
  
  console.log("Testing debt charts for cutting off issues...");
  
  for (const chartId of debtCharts) {
    console.log(`\n--- Testing ${chartId} for cutting off ---`);
    
    const chart = window[chartId];
    const chartElement = document.getElementById(chartId);
    
    if (!chart) {
      console.error(`❌ Chart instance not found for: ${chartId}`);
      continue;
    }
    
    if (!chartElement) {
      console.error(`❌ Chart element not found for: ${chartId}`);
      continue;
    }
    
    // Check chart dimensions and configuration
    console.log(`Chart configuration for ${chartId}:`, {
      chartHeight: chart.w?.config?.chart?.height,
      chartWidth: chart.w?.config?.chart?.width,
      chartType: chart.w?.config?.chart?.type,
      xaxisLabels: {
        rotate: chart.w?.config?.xaxis?.labels?.rotate,
        maxHeight: chart.w?.config?.xaxis?.labels?.maxHeight,
        offsetY: chart.w?.config?.xaxis?.labels?.offsetY,
      },
      dataLabels: {
        offsetY: chart.w?.config?.dataLabels?.offsetY,
        fontSize: chart.w?.config?.dataLabels?.style?.fontSize,
      },
      grid: {
        padding: chart.w?.config?.grid?.padding,
      },
      legend: {
        position: chart.w?.config?.legend?.position,
        offsetY: chart.w?.config?.legend?.offsetY,
      }
    });
    
    // Check element dimensions
    console.log(`Element dimensions for ${chartId}:`, {
      offsetWidth: chartElement.offsetWidth,
      offsetHeight: chartElement.offsetHeight,
      clientWidth: chartElement.clientWidth,
      clientHeight: chartElement.clientHeight,
      scrollWidth: chartElement.scrollWidth,
      scrollHeight: chartElement.scrollHeight,
    });
    
    // Check for visible elements that might be cut off
    const svgElement = chartElement.querySelector('svg');
    if (svgElement) {
      console.log(`SVG dimensions for ${chartId}:`, {
        width: svgElement.getAttribute('width'),
        height: svgElement.getAttribute('height'),
        viewBox: svgElement.getAttribute('viewBox'),
        styleWidth: svgElement.style.width,
        styleHeight: svgElement.style.height,
      });
    }
    
    // Check for X-axis labels
    const xAxisLabels = chartElement.querySelectorAll('.apexcharts-xaxis-label');
    console.log(`X-axis labels for ${chartId}:`, {
      count: xAxisLabels.length,
      visible: Array.from(xAxisLabels).map(label => ({
        text: label.textContent,
        visible: label.style.display !== 'none',
        transform: label.getAttribute('transform'),
      }))
    });
    
    // Check for data labels
    const dataLabels = chartElement.querySelectorAll('.apexcharts-datalabel');
    console.log(`Data labels for ${chartId}:`, {
      count: dataLabels.length,
      visible: Array.from(dataLabels).map(label => ({
        text: label.textContent,
        visible: label.style.display !== 'none',
        transform: label.getAttribute('transform'),
      }))
    });
    
    // Check for legend
    const legend = chartElement.querySelector('.apexcharts-legend');
    console.log(`Legend for ${chartId}:`, {
      exists: !!legend,
      visible: legend ? legend.style.display !== 'none' : false,
      position: legend ? legend.getAttribute('style') : null,
      items: legend ? legend.querySelectorAll('.apexcharts-legend-series').length : 0,
    });
    
    // Check legend items
    const legendItems = chartElement.querySelectorAll('.apexcharts-legend-series');
    console.log(`Legend items for ${chartId}:`, {
      count: legendItems.length,
      items: Array.from(legendItems).map(item => ({
        text: item.querySelector('.apexcharts-legend-text')?.textContent,
        visible: item.style.display !== 'none',
        marker: item.querySelector('.apexcharts-legend-marker')?.style.backgroundColor,
      }))
    });
    
    try {
      console.log(`Attempting export for ${chartId}...`);
      const result = await exportApexChart(chart, chartId);
      if (result) {
        console.log(`✅ Successfully exported ${chartId}`);
        
        // Create a test image to verify the export
        const img = new Image();
        img.onload = function() {
          console.log(`Export image dimensions for ${chartId}:`, {
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            });
};

// Function to debug export process for multiple charts and compare
window.debugAllExportProcesses = function() {
  console.log("🔍 [EXPORT DEBUG] Starting debug for all chart export processes...");
  
  const chartIds = [
    "debtToContributionsWithout_chart", // Debt chart (problematic)
    "givingUnits_chart", // Demo chart (working)
    "daysExpendableNetAssets_chart" // Cash chart (working)
  ];
  
  const debugPromises = chartIds.map(chartId => {
    return new Promise((resolve) => {
      setTimeout(() => {
        debugExportProcess(chartId);
        resolve(chartId);
      }, 1000); // Delay between each chart to avoid conflicts
    });
  });
  
  Promise.all(debugPromises).then(() => {
    console.log("🔍 [EXPORT DEBUG] All export debug processes completed");
  });
};

// Simple test function for export debugging
window.testExportDebug = function(chartId) {
  console.log(`🔍 [EXPORT DEBUG] Testing export for: ${chartId}`);
  
  const chart = window[chartId];
  if (!chart) {
    console.error(`❌ Chart not found: ${chartId}`);
    return;
  }
  
  const chartElement = chart.w.globals.dom.baseEl;
  console.log(`🔍 [EXPORT DEBUG] Chart element info for ${chartId}:`, {
    width: chartElement.style.width,
    height: chartElement.style.height,
    position: chartElement.style.position,
    left: chartElement.style.left,
    top: chartElement.style.top,
    parent: chartElement.parentElement?.tagName,
    parentWidth: chartElement.parentElement?.style.width,
    parentHeight: chartElement.parentElement?.style.height,
  });
  
  // Test the export
  exportApexChart(chartId).then((result) => {
    console.log(`🔍 [EXPORT DEBUG] Export result for ${chartId}:`, {
      hasResult: !!result,
      resultLength: result?.length,
      resultType: typeof result,
    });
  }).catch((error) => {
    console.error(`❌ [EXPORT DEBUG] Export failed for ${chartId}:`, error);
  });
};
        img.src = 'data:image/png;base64,' + result;
        
      } else {
        console.log(`❌ Failed to export ${chartId} with ApexCharts, trying html2canvas...`);
        const fallbackResult = await exportWithHtml2Canvas(chartElement);
        if (fallbackResult) {
          console.log(`✅ Successfully exported ${chartId} with html2canvas`);
        } else {
          console.error(`❌ Failed to export ${chartId} with both methods`);
        }
      }
    } catch (error) {
      console.error(`Error testing chart export for ${chartId}:`, error);
    }
  }
  
  console.log("\n--- Debt charts cutoff test complete ---");
  console.log("Check the console output above for any cutting off issues.");
};

/**
 * Test function specifically for legend visibility in debt charts
 * This can be called from the browser console to test legend issues
 */
window.testDebtChartsLegend = async function() {
  const debtCharts = [
    "debtToContributionsWithout_chart",
    "currentRatio_chart", 
    "mandatoryDebtServiceToContributionsWithout_chart",
    "debtPerGivingUnit_chart",
    "debtCoverage_chart"
  ];
  
  console.log("Testing debt charts legend visibility...");
  
  for (const chartId of debtCharts) {
    console.log(`\n--- Testing legend for ${chartId} ---`);
    
    const chart = window[chartId];
    const chartElement = document.getElementById(chartId);
    
    if (!chart) {
      console.error(`❌ Chart instance not found for: ${chartId}`);
      continue;
    }
    
    if (!chartElement) {
      console.error(`❌ Chart element not found for: ${chartId}`);
      continue;
    }
    
    // Check legend configuration
    console.log(`Legend configuration for ${chartId}:`, {
      show: chart.w?.config?.legend?.show,
      position: chart.w?.config?.legend?.position,
      horizontalAlign: chart.w?.config?.legend?.horizontalAlign,
      offsetX: chart.w?.config?.legend?.offsetX,
      fontSize: chart.w?.config?.legend?.fontSize,
      height: chart.w?.config?.legend?.height,
      showForNullSeries: chart.w?.config?.legend?.showForNullSeries,
      showForZeroSeries: chart.w?.config?.legend?.showForZeroSeries,
    });
    
    // Check for legend element
    const legend = chartElement.querySelector('.apexcharts-legend');
    if (legend) {
      console.log(`Legend element found for ${chartId}:`, {
        display: legend.style.display,
        visibility: legend.style.visibility,
        position: legend.style.position,
        top: legend.style.top,
        bottom: legend.style.bottom,
        left: legend.style.left,
        right: legend.style.right,
        width: legend.style.width,
        height: legend.style.height,
        transform: legend.getAttribute('transform'),
        classList: Array.from(legend.classList),
      });
      
      // Check legend items
      const legendItems = legend.querySelectorAll('.apexcharts-legend-series');
      console.log(`Legend items for ${chartId}:`, {
        count: legendItems.length,
        items: Array.from(legendItems).map((item, index) => ({
          index,
          text: item.querySelector('.apexcharts-legend-text')?.textContent,
          visible: item.style.display !== 'none',
          marker: item.querySelector('.apexcharts-legend-marker')?.style.backgroundColor,
          style: {
            display: item.style.display,
            visibility: item.style.visibility,
            position: item.style.position,
          }
        }))
      });
    } else {
      console.error(`❌ Legend element not found for ${chartId}`);
    }
    
    // Check if legend is within visible area
    if (legend) {
      const rect = legend.getBoundingClientRect();
      const chartRect = chartElement.getBoundingClientRect();
      
      console.log(`Legend positioning for ${chartId}:`, {
        legendRect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        },
        chartRect: {
          top: chartRect.top,
          bottom: chartRect.bottom,
          left: chartRect.left,
          right: chartRect.right,
          width: chartRect.width,
          height: chartRect.height,
        },
        isVisible: {
          withinChart: rect.top >= chartRect.top && rect.bottom <= chartRect.bottom,
          withinViewport: rect.top >= 0 && rect.bottom <= window.innerHeight,
        }
      });
    }
  }
  
  console.log("\n--- Debt charts legend test complete ---");
};

/**
 * Compare working chart with debt charts to identify differences
 * This can be called from the browser console to compare configurations
 */
window.compareChartConfigs = function() {
  const workingChart = window.attendeesToStaff_chart;
  const debtCharts = [
    "debtToContributionsWithout_chart",
    "currentRatio_chart", 
    "mandatoryDebtServiceToContributionsWithout_chart",
    "debtPerGivingUnit_chart",
    "debtCoverage_chart"
  ];
  
  console.log("Comparing working chart with debt charts...");
  
  if (!workingChart) {
    console.error("❌ Working chart (attendeesToStaff_chart) not found");
    return;
  }
  
  console.log("Working chart configuration:", {
    legend: workingChart.w?.config?.legend,
    series: workingChart.w?.config?.series?.length,
    chart: {
      height: workingChart.w?.config?.chart?.height,
      type: workingChart.w?.config?.chart?.type,
    },
    dataLabels: workingChart.w?.config?.dataLabels,
    grid: workingChart.w?.config?.grid,
  });
  
  debtCharts.forEach(chartId => {
    const chart = window[chartId];
    if (!chart) {
      console.error(`❌ Chart ${chartId} not found`);
      return;
    }
    
    console.log(`\n--- ${chartId} configuration ---`);
    console.log({
      legend: chart.w?.config?.legend,
      series: chart.w?.config?.series?.length,
      chart: {
        height: chart.w?.config?.chart?.height,
        type: chart.w?.config?.chart?.type,
      },
      dataLabels: chart.w?.config?.dataLabels,
      grid: chart.w?.config?.grid,
    });
    
    // Check for legend element
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      const legend = chartElement.querySelector('.apexcharts-legend');
      console.log(`Legend element for ${chartId}:`, {
        exists: !!legend,
        visible: legend ? legend.style.display !== 'none' : false,
        items: legend ? legend.querySelectorAll('.apexcharts-legend-series').length : 0,
      });
    }
  });
  
  console.log("\n--- Comparison complete ---");
};

// Initialize when document is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApexChartsPrintFunction);
} else {
    initApexChartsPrintFunction();
}

// Simple test function for export debugging
window.testExportDebug = function(chartId) {
  console.log(`🔍 [EXPORT DEBUG] Testing export for: ${chartId}`);
  
  const chart = window[chartId];
  if (!chart) {
    console.error(`❌ Chart not found: ${chartId}`);
    return;
  }
  
  const chartElement = chart.w.globals.dom.baseEl;
  console.log(`🔍 [EXPORT DEBUG] Chart element info for ${chartId}:`, {
    width: chartElement.style.width,
    height: chartElement.style.height,
    position: chartElement.style.position,
    left: chartElement.style.left,
    top: chartElement.style.top,
    parent: chartElement.parentElement?.tagName,
    parentWidth: chartElement.parentElement?.style.width,
    parentHeight: chartElement.parentElement?.style.height,
  });
  
  // Test the export
  exportApexChart(chartId).then((result) => {
    console.log(`🔍 [EXPORT DEBUG] Export result for ${chartId}:`, {
      hasResult: !!result,
      resultLength: result?.length,
      resultType: typeof result,
    });
  }).catch((error) => {
    console.error(`❌ [EXPORT DEBUG] Export failed for ${chartId}:`, error);
  });
};

// Quick test functions for debugging
window.testDebtChart = function() {
  console.log("🔍 Testing debt chart export...");
  testExportDebug("debtToContributionsWithout_chart");
};

window.testDemoChart = function() {
  console.log("🔍 Testing demo chart export...");
  testExportDebug("givingUnits_chart");
};

window.testCashChart = function() {
  console.log("🔍 Testing cash chart export...");
  testExportDebug("daysExpendableNetAssets_chart");
};

window.compareChartConfigs = function() {
  console.log("🔍 [COMPARE] Comparing chart configurations...");
  
  const debtChart = window.debtToContributionsWithout_chart;
  const demoChart = window.givingUnits_chart;
  const cashChart = window.daysExpendableNetAssets_chart;
  
  const comparisonData = {
    timestamp: new Date().toISOString(),
    debtChart: {
      hasLegend: !!debtChart?.w?.config?.legend,
      legendConfig: debtChart?.w?.config?.legend,
      hasSeries: !!debtChart?.w?.config?.series,
      seriesCount: debtChart?.w?.config?.series?.length,
      seriesNames: debtChart?.w?.config?.series?.map(s => s.name),
      hasAnnotations: !!debtChart?.w?.config?.annotations,
      annotationsCount: debtChart?.w?.config?.annotations?.yaxis?.length,
      fullConfig: debtChart?.w?.config,
    },
    demoChart: {
      hasLegend: !!demoChart?.w?.config?.legend,
      legendConfig: demoChart?.w?.config?.legend,
      hasSeries: !!demoChart?.w?.config?.series,
      seriesCount: demoChart?.w?.config?.series?.length,
      seriesNames: demoChart?.w?.config?.series?.map(s => s.name),
      hasAnnotations: !!demoChart?.w?.config?.annotations,
      annotationsCount: demoChart?.w?.config?.annotations?.yaxis?.length,
      fullConfig: demoChart?.w?.config,
    },
    cashChart: {
      hasLegend: !!cashChart?.w?.config?.legend,
      legendConfig: cashChart?.w?.config?.legend,
      hasSeries: !!cashChart?.w?.config?.series,
      seriesCount: cashChart?.w?.config?.series?.length,
      seriesNames: cashChart?.w?.config?.series?.map(s => s.name),
      hasAnnotations: !!cashChart?.w?.config?.annotations,
      annotationsCount: cashChart?.w?.config?.annotations?.yaxis?.length,
      fullConfig: cashChart?.w?.config,
    }
  };
  
  console.log("🔍 [COMPARE] Comparison data:", comparisonData);
  
  // Save to JSON file
  saveDebugLogsToFile("chart_comparison.json", comparisonData);
  
  return comparisonData;
};

// Function to save debug logs to JSON file
window.saveDebugLogsToFile = function(filename, data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log(`📁 Debug logs saved to ${filename}`);
};

// Function to collect all debug logs and save to file
window.collectAllDebugLogs = function() {
  console.log("🔍 [COLLECT] Collecting all debug logs...");
  
  const allLogs = {
    timestamp: new Date().toISOString(),
    charts: {},
    comparison: null
  };
  
  // Collect data for each chart type
  const chartIds = [
    "debtToContributionsWithout_chart",
    "currentRatio_chart", 
    "mandatoryDebtServiceToContributionsWithout_chart",
    "debtPerGivingUnit_chart",
    "debtCoverage_chart",
    "givingUnits_chart",
    "attendeesToStaff_chart",
    "daysExpendableNetAssets_chart",
    "daysOperatingCash_chart",
    "availableDaysOfCashFlow_chart",
    "liquidityRatio_chart",
    "netCashAvailability_chart"
  ];
  
  chartIds.forEach(chartId => {
    const chart = window[chartId];
    if (chart) {
      allLogs.charts[chartId] = {
        hasChart: !!chart,
        hasGlobals: !!chart?.w?.globals,
        hasDom: !!chart?.w?.globals?.dom,
        chartId: chart?.w?.globals?.chartID,
        config: {
          hasLegend: !!chart?.w?.config?.legend,
          legendConfig: chart?.w?.config?.legend,
          hasSeries: !!chart?.w?.config?.series,
          seriesCount: chart?.w?.config?.series?.length,
          seriesNames: chart?.w?.config?.series?.map(s => s.name),
          hasAnnotations: !!chart?.w?.config?.annotations,
          annotationsCount: chart?.w?.config?.annotations?.yaxis?.length,
          fullConfig: chart?.w?.config,
        }
      };
    }
  });
  
  // Add comparison data
  allLogs.comparison = compareChartConfigs();
  
  // Save to file
  saveDebugLogsToFile("all_debug_logs.json", allLogs);
  
  return allLogs;
};

// Comprehensive export debug function
window.debugExportProcess = function(chartId) {
  console.log(`🔍 [EXPORT DEBUG] Starting comprehensive debug for: ${chartId}`);
  const chart = window.chartInstances[chartId];
  if (!chart) {
    console.error(`❌ [EXPORT DEBUG] Chart not found: ${chartId}`);
    return;
  }
  
  // Capture chart state before export
  const chartElement = chart.w.globals.dom.baseEl;
  const originalState = saveCompleteChartState(chart, chartId);
  
  console.log(`🔍 [EXPORT DEBUG] Pre-export state for ${chartId}:`, {
    chartId: originalState.chartId,
    chartType: originalState.chartType,
    mainName: originalState.mainName,
    numType: originalState.numType,
    fixedNum: originalState.fixedNum,
    hasLegend: !!originalState.chartConfig.legend,
    legendConfig: originalState.chartConfig.legend,
    hasSeries: !!originalState.chartConfig.series,
    seriesCount: originalState.chartConfig.series?.length,
    seriesNames: originalState.chartConfig.series?.map(s => s.name),
    hasAnnotations: !!originalState.chartConfig.annotations,
    annotationsCount: originalState.chartConfig.annotations?.yaxis?.length,
    chartElementWidth: chartElement.style.width,
    chartElementHeight: chartElement.style.height,
    chartElementPosition: chartElement.style.position,
    chartElementLeft: chartElement.style.left,
    chartElementTop: chartElement.style.top,
    chartElementParent: chartElement.parentElement?.tagName,
    chartElementParentWidth: chartElement.parentElement?.style.width,
    chartElementParentHeight: chartElement.parentElement?.style.height,
  });
  
  // Test export and capture results
  exportApexChart(chartId).then((result) => {
    console.log(`🔍 [EXPORT DEBUG] Export result for ${chartId}:`, {
      hasResult: !!result,
      resultLength: result?.length,
      resultType: typeof result,
      resultPreview: result?.substring(0, 50) + "...",
    });
    
    // Save debug data to file
    const debugData = {
      timestamp: new Date().toISOString(),
      chartId: chartId,
      preExportState: originalState,
      exportResult: {
        hasResult: !!result,
        resultLength: result?.length,
        resultType: typeof result,
      },
      chartElement: {
        width: chartElement.style.width,
        height: chartElement.style.height,
        position: chartElement.style.position,
        left: chartElement.style.left,
        top: chartElement.style.top,
        parent: chartElement.parentElement?.tagName,
        parentWidth: chartElement.parentElement?.style.width,
        parentHeight: chartElement.parentElement?.style.height,
      }
    };
    
    saveDebugLogsToFile(`export_debug_${chartId}.json`, debugData);
    console.log(`🔍 [EXPORT DEBUG] Debug data saved to export_debug_${chartId}.json`);
    
  }).catch((error) => {
    console.error(`❌ [EXPORT DEBUG] Export failed for ${chartId}:`, error);
  });
};

// Enhanced test function for export debugging
window.debugChartExport = function(chartId) {
  console.log(`🔍 [EXPORT DEBUG] Testing export for: ${chartId}`);
  
  // Try different ways to access the chart
  let chart = window[chartId];
  if (!chart) {
    chart = window.chartInstances?.[chartId];
  }
  if (!chart) {
    chart = document.querySelector(`#${chartId}`)?.__apexcharts__;
  }
  if (!chart) {
    chart = ApexCharts.getChartByID(chartId);
  }
  
  if (!chart) {
    console.error(`❌ Chart not found: ${chartId}`);
    console.log(`🔍 [EXPORT DEBUG] Available chart instances:`, {
      windowKeys: Object.keys(window).filter(key => key.includes('chart')),
      chartInstances: window.chartInstances,
      apexCharts: window.ApexCharts,
    });
    return;
  }
  
  console.log(`🔍 [EXPORT DEBUG] Chart found:`, {
    chartType: typeof chart,
    hasGlobals: !!chart?.w?.globals,
    hasDom: !!chart?.w?.globals?.dom,
    chartId: chart?.w?.globals?.chartID,
    hasConfig: !!chart?.w?.config,
  });
  
  const chartElement = chart.w?.globals?.dom?.baseEl;
  if (!chartElement) {
    console.error(`❌ Chart element not found for: ${chartId}`);
    return;
  }
  
  console.log(`🔍 [EXPORT DEBUG] Chart element info for ${chartId}:`, {
    width: chartElement.style.width,
    height: chartElement.style.height,
    position: chartElement.style.position,
    left: chartElement.style.left,
    top: chartElement.style.top,
    parent: chartElement.parentElement?.tagName,
    parentWidth: chartElement.parentElement?.style.width,
    parentHeight: chartElement.parentElement?.style.height,
  });
  
  // Test the export
  exportApexChart(chartId).then((result) => {
    console.log(`🔍 [EXPORT DEBUG] Export result for ${chartId}:`, {
      hasResult: !!result,
      resultLength: result?.length,
      resultType: typeof result,
    });
  }).catch((error) => {
    console.error(`❌ [EXPORT DEBUG] Export failed for ${chartId}:`, error);
  });
};

// Updated test functions
window.testDebtChart = function() {
  console.log("🔍 Testing debt chart export...");
  debugChartExport("debtToContributionsWithout_chart");
};

window.testDemoChart = function() {
  console.log("🔍 Testing demo chart export...");
  debugChartExport("givingUnits_chart");
};

window.testCashChart = function() {
  console.log("🔍 Testing cash chart export...");
  debugChartExport("daysExpendableNetAssets_chart");
};

// Fixed debug function that properly calls exportApexChart
window.debugChartExportFixed = function(chartId) {
  console.log(`🔍 [EXPORT DEBUG] Testing export for: ${chartId}`);
  
  // Try different ways to access the chart
  let chart = window[chartId];
  if (!chart) {
    chart = window.chartInstances?.[chartId];
  }
  if (!chart) {
    chart = document.querySelector(`#${chartId}`)?.__apexcharts__;
  }
  if (!chart) {
    chart = ApexCharts.getChartByID(chartId);
  }
  
  if (!chart) {
    console.error(`❌ Chart not found: ${chartId}`);
    console.log(`🔍 [EXPORT DEBUG] Available chart instances:`, {
      windowKeys: Object.keys(window).filter(key => key.includes('chart')),
      chartInstances: window.chartInstances,
      apexCharts: window.ApexCharts,
    });
    return;
  }
  
  console.log(`🔍 [EXPORT DEBUG] Chart found:`, {
    chartType: typeof chart,
    hasGlobals: !!chart?.w?.globals,
    hasDom: !!chart?.w?.globals?.dom,
    chartId: chart?.w?.globals?.chartID,
    hasConfig: !!chart?.w?.config,
    hasW: !!chart?.w,
    hasEl: !!chart?.el,
  });
  
  // Test the export with the actual chart instance
  exportApexChart(chart, chartId).then((result) => {
    console.log(`🔍 [EXPORT DEBUG] Export result for ${chartId}:`, {
      hasResult: !!result,
      resultLength: result?.length,
      resultType: typeof result,
    });
  }).catch((error) => {
    console.error(`❌ [EXPORT DEBUG] Export failed for ${chartId}:`, error);
  });
};

// Updated test functions using the fixed debug function
window.testDebtChartFixed = function() {
  console.log("🔍 Testing debt chart export (fixed)...");
  debugChartExportFixed("debtToContributionsWithout_chart");
};

window.testDemoChartFixed = function() {
  console.log("🔍 Testing demo chart export (fixed)...");
  debugChartExportFixed("givingUnits_chart");
};

window.testCashChartFixed = function() {
  console.log("🔍 Testing cash chart export (fixed)...");
  debugChartExportFixed("daysExpendableNetAssets_chart");
};
