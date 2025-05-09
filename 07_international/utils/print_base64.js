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

      const chart = chartManager.getChart(chartId) || window[chartId];

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
    // This is critical for all formatters to work properly
    if (chart.w.globals) {
      chart.w.globals.numType = numType;
    }

    // For chart types that we know are working correctly, preserve their restoration logic
    if (
      chartType === "line" ||
      chartType === "cashFlow" ||
      chartType === "netAssetBreakdown"
    ) {
      // Use the working restoration logic for these chart types
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
        chart: {
          ...originalState.chartConfig.chart,
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
      };
    } else {
      console.log("restoredConfig", {
        chart,
        chartGlobals: chart.w.globals,
        config: originalState.chartConfig,
      });

      // Basic restored config without yaxis (will add it specifically for each chart type)
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
        chart: {
          ...originalState.chartConfig.chart,
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
      };

      // Create a formatter that can access chart.w.globals
      const yaxisFormatter = createFormatterWithGlobals(numType, fixedNum);

      // Handle each chart type specifically
      if (chartType === "main") {
        // Main chart type - Ensure we use an array with a single object for yaxis
        restoredConfig.yaxis = [
          {
            axisTicks: { show: true },
            axisBorder: {
              show: true,
              color:
                originalState.chartConfig.yaxis[0]?.axisBorder?.color ||
                "#3a464f",
            },
            labels: {
              formatter: yaxisFormatter,
              style: {
                colors:
                  originalState.chartConfig.yaxis[0]?.labels?.style?.colors ||
                  "#3a464f",
                fontSize:
                  originalState.chartConfig.yaxis[0]?.labels?.style?.fontSize ||
                  "1.25rem",
              },
            },
            tooltip: { enabled: true },
          },
        ];
      } else if (chartType === "functionalAllocation") {
        // Functional allocation chart - Uses percent formatting
        restoredConfig.yaxis = {
          max: 100,
          labels: {
            formatter: function (value) {
              return `${value}%`; // Direct percent formatter
            },
            style: {
              colors:
                originalState.chartConfig.yaxis?.labels?.style?.colors ||
                "#3a464f",
              fontSize:
                originalState.chartConfig.yaxis?.labels?.style?.fontSize ||
                "1.25rem",
            },
          },
        };
      } else if (chartType === "costOfContributions") {
        // Cost of contributions chart - Handle multiple axes
        if (Array.isArray(originalState.chartConfig.yaxis)) {
          restoredConfig.yaxis = originalState.chartConfig.yaxis.map(
            (axis, index) => {
              // Different handling for different axes
              if (index < 2) {
                // First two axes (0 and 1) are dollar values
                return {
                  ...axis,
                  labels: {
                    ...axis.labels,
                    formatter: function (value) {
                      if (value === null || value === undefined || value === 0)
                        return "$0";

                      const isNegative = value < 0;
                      const absValue = Math.abs(value);

                      let formattedValue;
                      if (absValue >= 1000000) {
                        formattedValue = `${(absValue / 1000000).toFixed(1)}M`;
                      } else if (absValue >= 1000) {
                        formattedValue = `${(absValue / 1000).toFixed(0)}K`;
                      } else {
                        formattedValue = absValue.toFixed(fixedNum);
                      }

                      return `${isNegative ? "-" : ""}$${formattedValue}`;
                    },
                    style: {
                      ...axis.labels?.style,
                      colors: axis.labels?.style?.colors || "#3a464f",
                    },
                  },
                };
              } else if (index === 2 || index === 3) {
                // Third and fourth axes (2 and 3) are ratios
                return {
                  ...axis,
                  labels: {
                    ...axis.labels,
                    formatter: function (value) {
                      if (value === null || value === undefined || value === 0)
                        return "0.00";

                      const isNegative = value < 0;
                      const absValue = Math.abs(value);
                      return `${isNegative ? "-" : ""}${absValue.toFixed(2)}`;
                    },
                    style: {
                      ...axis.labels?.style,
                      colors: axis.labels?.style?.colors || "#3a464f",
                    },
                  },
                };
              } else {
                // Any other axes
                return {
                  ...axis,
                  labels: {
                    ...axis.labels,
                    formatter: yaxisFormatter,
                    style: {
                      ...axis.labels?.style,
                      colors: axis.labels?.style?.colors || "#3a464f",
                    },
                  },
                };
              }
            }
          );
        } else {
          // Fallback for single yaxis
          restoredConfig.yaxis = {
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
          };
        }
      }
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
      formattedValue = `${(absValue / 1000000).toFixed(1)}M`;
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
async function exportApexChart(chart) {
  try {
    if (!chart || !chart.w || !chart.w.globals || !chart.w.globals.dom) {
      throw new Error("Invalid chart instance");
    }

    // Create a fixed-size container
    const fixedContainer = document.createElement("div");
    fixedContainer.style.position = "absolute";
    fixedContainer.style.left = "-9999px";
    fixedContainer.style.width = `${DEFAULT_CHART_WIDTH}px`;
    fixedContainer.style.height = `${DEFAULT_CHART_HEIGHT}px`;
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
    chartElement.style.width = `${DEFAULT_CHART_WIDTH}px`;
    chartElement.style.height = `${DEFAULT_CHART_HEIGHT}px`;
    chartElement.style.position = "absolute";
    chartElement.style.transform = "none";

    // Force exact dimensions for export
    const paperNode = chart.w.globals.dom.Paper.node;
    paperNode.setAttribute("width", DEFAULT_CHART_WIDTH.toString());
    paperNode.setAttribute("height", DEFAULT_CHART_HEIGHT.toString());
    paperNode.style.width = `${DEFAULT_CHART_WIDTH}px`;
    paperNode.style.height = `${DEFAULT_CHART_HEIGHT}px`;
    paperNode.setAttribute(
      "viewBox",
      `0 0 ${DEFAULT_CHART_WIDTH} ${DEFAULT_CHART_HEIGHT}`
    );
    paperNode.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Get chart info
    const chartId = originalState.chartId || chart.w.globals.chartID;
    const mainName = originalState.mainName || chartId.replace("_chart", "");
    const chartType = originalState.chartType || getChartTypeFromId(chartId);
    const numType = originalState.numType || "number";
    const fixedNum = originalState.fixedNum || 0;

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

    // For chart types that we know are working correctly, preserve their export logic
    if (
      chartType === "line" ||
      chartType === "cashFlow" ||
      chartType === "netAssetBreakdown"
    ) {
      // Keep original yaxis for working chart types
      exportOptions = {
        ...baseExportOptions,
        yaxis: originalState.chartConfig.yaxis,
      };
    } else {
      // Create a formatter that can access chart.w.globals
      const yaxisFormatter = createFormatterWithGlobals(numType, fixedNum);

      // Handle each chart type specifically
      if (chartType === "main") {
        // Main chart type - Ensure we use an array with a single object for yaxis
        exportOptions = {
          ...baseExportOptions,
          yaxis: [
            {
              axisTicks: { show: true },
              axisBorder: {
                show: true,
                color:
                  originalState.chartConfig.yaxis[0]?.axisBorder?.color ||
                  "#3a464f",
              },
              labels: {
                formatter: yaxisFormatter,
                style: {
                  colors:
                    originalState.chartConfig.yaxis[0]?.labels?.style?.colors ||
                    "#3a464f",
                  fontSize:
                    originalState.chartConfig.yaxis[0]?.labels?.style
                      ?.fontSize || "1.25rem",
                },
              },
              tooltip: { enabled: true },
            },
          ],
        };
      } else if (chartType === "functionalAllocation") {
        // Functional allocation chart - Uses percent formatting
        exportOptions = {
          ...baseExportOptions,
          yaxis: {
            max: 100,
            labels: {
              formatter: function (value) {
                return `${value}%`; // Direct percent formatter
              },
              style: {
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
      } else if (chartType === "costOfContributions") {
        // Cost of contributions chart - Handle multiple axes
        if (Array.isArray(originalState.chartConfig.yaxis)) {
          exportOptions = {
            ...baseExportOptions,
            yaxis: originalState.chartConfig.yaxis.map((axis, index) => {
              // Different handling for different axes
              if (index < 2) {
                // First two axes (0 and 1) are dollar values
                return {
                  ...axis,
                  labels: {
                    ...axis.labels,
                    formatter: function (value) {
                      if (value === null || value === undefined || value === 0)
                        return "$0";

                      const isNegative = value < 0;
                      const absValue = Math.abs(value);

                      let formattedValue;
                      if (absValue >= 1000000) {
                        formattedValue = `${(absValue / 1000000).toFixed(1)}M`;
                      } else if (absValue >= 1000) {
                        formattedValue = `${(absValue / 1000).toFixed(0)}K`;
                      } else {
                        formattedValue = absValue.toFixed(fixedNum);
                      }

                      return `${isNegative ? "-" : ""}$${formattedValue}`;
                    },
                    style: {
                      ...axis.labels?.style,
                      colors: axis.labels?.style?.colors || "#3a464f",
                    },
                  },
                };
              } else if (index === 2 || index === 3) {
                // Third and fourth axes (2 and 3) are ratios
                return {
                  ...axis,
                  labels: {
                    ...axis.labels,
                    formatter: function (value) {
                      if (value === null || value === undefined || value === 0)
                        return "0.00";

                      const isNegative = value < 0;
                      const absValue = Math.abs(value);
                      return `${isNegative ? "-" : ""}${absValue.toFixed(2)}`;
                    },
                    style: {
                      ...axis.labels?.style,
                      colors: axis.labels?.style?.colors || "#3a464f",
                    },
                  },
                };
              } else {
                // Any other axes
                return {
                  ...axis,
                  labels: {
                    ...axis.labels,
                    formatter: yaxisFormatter,
                    style: {
                      ...axis.labels?.style,
                      colors: axis.labels?.style?.colors || "#3a464f",
                    },
                  },
                };
              }
            }),
          };
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
        // Default for other chart types
        exportOptions = baseExportOptions;
      }
    }

    // Update chart with export options
    chart.updateOptions(exportOptions, false, false);

    // Let the chart update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use ApexCharts' dataURI method with explicit dimensions
    const uri = await chart.dataURI({
      width: DEFAULT_CHART_WIDTH,
      height: DEFAULT_CHART_HEIGHT,
      scale: 2, // Higher resolution
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

    return uri.imgURI.split(",")[1];
  } catch (error) {
    console.error("Error in exportApexChart:", error);
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
  // container.style.left = '-9999px';
  container.style.width = `${DEFAULT_CHART_WIDTH}px`;
  container.style.height = `${DEFAULT_CHART_HEIGHT}px`;

  // Clone the chart element into the container
  const clone = chartElement.cloneNode(true);
  clone.style.width = `${DEFAULT_CHART_WIDTH}px`;
  clone.style.height = `${DEFAULT_CHART_HEIGHT}px`;
  container.appendChild(clone);
  document.body.appendChild(container);

  // Find and adjust any SVG elements
  const svgElements = clone.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    svg.setAttribute("width", DEFAULT_CHART_WIDTH.toString());
    svg.setAttribute("height", DEFAULT_CHART_HEIGHT.toString());
    svg.style.width = `${DEFAULT_CHART_WIDTH}px`;
    svg.style.height = `${DEFAULT_CHART_HEIGHT}px`;
    svg.setAttribute(
      "viewBox",
      `0 0 ${DEFAULT_CHART_WIDTH} ${DEFAULT_CHART_HEIGHT}`
    );
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  try {
    // Wait for layout updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use html2canvas with fixed dimensions
    const canvas = await html2canvas(clone, {
      scale: 2,
      width: DEFAULT_CHART_WIDTH,
      height: DEFAULT_CHART_HEIGHT,
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
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C  47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
      <span class="font-medium">Exporting Charts...</span>
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

    // Define chart mappings
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
  const uniqueClients = document.getElementById("uniqueClients").innerHTML;

  uploadXml += createFieldXml(171, ClientRid);
  uploadXml += createFieldXml(7, firmName);
  uploadXml += createFieldXml(6, uniqueClients);
  uploadXml += createFieldXml(23, selectedYears[selectedYears.length - 1]);
  uploadXml += createFieldXml(24, window.monthYearEnd);
  uploadXml += createFieldXml(36, sliderValue);
  uploadXml += createFieldXml(37, sliderValue2);
  uploadXml += createFieldXml(38, missionValue);
  uploadXml += createFieldXml(39, missionValue2);
  uploadXml += createFieldXml(60, assetsValue);
  uploadXml += createFieldXml(58, assetsValue2);
  uploadXml += createFieldXml(56, revenueValue);
  uploadXml += createFieldXml(54, revenueValue2);
  uploadXml += createFieldXml(
    40,
    Array.from(window.selectedAreas_Array).join(";")
  );
  uploadXml += createFieldXml(
    41,
    Array.from(window.selectedTypes_Array).join(";")
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
      url: "https://capincrouse.quickbase.com/db/bumq5qw5e?a=API_AddRecord",
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
