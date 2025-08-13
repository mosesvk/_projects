/**
 * FusionCharts Example - Matching ApexCharts Structure
 * This example demonstrates how to create FusionCharts that match the structure
 * and styling of the ApexCharts implementation in CreateCharts.js
 */

// Sample data structure matching CreateCharts.js format
const sampleData = {
  selectedYears: ['2019', '2020', '2021', '2022', '2023'],
  clientData: [45.2, 52.8, 48.9, 61.3, 58.7], // Client bar data
  peer25: [42.1, 45.3, 47.8, 49.2, 51.5],     // 25th percentile line
  peerAvg: [48.5, 51.2, 53.7, 55.8, 57.3],    // Average line
  peer50: [49.2, 52.1, 54.3, 56.1, 58.2],     // 50th percentile line
  peer75: [55.8, 58.4, 60.1, 62.7, 64.9],     // 75th percentile line
  benchmarks: [40, 55] // Two benchmark values (lower and higher)
};

/**
 * Get chart colors based on current theme
 * @returns {Object} Color configuration object
 */
function getChartColors() {
  const isDarkMode = document.documentElement.classList.contains("dark");
  
  return isDarkMode ? {
    // Dark mode colors
    backgroundColor: "#1F2937",
    canvasBgColor: "#374151",
    captionColor: "#F9FAFB",
    labelColor: "#D1D5DB",
    axisColor: "#6B7280",
    gridColor: "#4B5563",
    clientBarColor: "#10B981", // Green
    peerLineColor: "#3B82F6",  // Blue
    benchmarkColor: "#F59E0B", // Amber
    benchmarkColor2: "#EF4444" // Red
  } : {
    // Light mode colors
    backgroundColor: "#FFFFFF",
    canvasBgColor: "#F9FAFB",
    captionColor: "#111827",
    labelColor: "#6B7280",
    axisColor: "#3A464F",
    gridColor: "#E5E7EB",
    clientBarColor: "#10B981", // Green
    peerLineColor: "#3B82F6",  // Blue
    benchmarkColor: "#F59E0B", // Amber
    benchmarkColor2: "#EF4444" // Red
  };
}

/**
 * Format number for display based on type
 * @param {number} value - The value to format
 * @param {string} numType - The number type ('dollar', 'percent', 'num')
 * @returns {string} Formatted value
 */
function formatNumber(value, numType = 'num') {
  let formattedValue = value.toLocaleString();
  
  if (numType === "dollar") {
    return `$${formattedValue}`;
  } else if (numType === "percent") {
    return `${formattedValue}%`;
  }
  return formattedValue;
}

/**
 * Create FusionCharts configuration matching ApexCharts structure
 * @param {Object} data - Chart data object
 * @param {string} chartId - Unique chart identifier
 * @param {string} title - Chart title
 * @param {string} numType - Number type for formatting
 * @returns {Object} FusionCharts configuration
 */
function createFusionChartConfig(data, chartId, title, numType = 'num') {
  const colors = getChartColors();
  const isDarkMode = document.documentElement.classList.contains("dark");
  
  // Prepare categories (years)
  const categories = data.selectedYears.map(year => ({ label: year }));
  
  // Prepare datasets
  const datasets = [
    {
      seriesname: "Client Data",
      data: data.clientData.map(value => ({ value: value.toString() })),
      color: colors.clientBarColor,
      renderAs: "column"
    },
    {
      seriesname: "25th Percentile",
      data: data.peer25.map(value => ({ value: value.toString() })),
      color: colors.peerLineColor,
      renderAs: "line",
      visible: "0" // Hidden by default like in ApexCharts
    },
    {
      seriesname: "Average",
      data: data.peerAvg.map(value => ({ value: value.toString() })),
      color: colors.peerLineColor,
      renderAs: "line",
      visible: "1"
    },
    {
      seriesname: "50th Percentile",
      data: data.peer50.map(value => ({ value: value.toString() })),
      color: colors.peerLineColor,
      renderAs: "line",
      visible: "0" // Hidden by default
    },
    {
      seriesname: "75th Percentile",
      data: data.peer75.map(value => ({ value: value.toString() })),
      color: colors.peerLineColor,
      renderAs: "line",
      visible: "0" // Hidden by default
    }
  ];
  
  // Prepare benchmark trendlines
  const trendlines = [];
  if (data.benchmarks && data.benchmarks.length > 0) {
    data.benchmarks.forEach((benchmark, index) => {
      trendlines.push({
        line: [{
          startvalue: benchmark.toString(),
          color: index === 0 ? colors.benchmarkColor : colors.benchmarkColor2,
          displayvalue: index === 0 ? "Benchmark - Lower" : "Benchmark - Higher",
          valueOnRight: "1",
          thickness: "2",
          showBelow: "1",
          tooltext: `Benchmark ${index + 1}: ${formatNumber(benchmark, numType)}`
        }]
      });
    });
  }
  
  return {
    type: 'mscombi2d',
    renderAt: chartId,
    width: '100%',
    height: '350',
    dataFormat: 'json',
    dataSource: {
      chart: {
        theme: isDarkMode ? "fusion" : "fusion",
        caption: title,
        xAxisName: "Year",
        yAxisName: "Value",
        numberPrefix: numType === "dollar" ? "$" : "",
        numberSuffix: numType === "percent" ? "%" : "",
        plotFillAlpha: "80",
        divLineIsDashed: "1",
        divLineDashLen: "4",
        divLineGapLen: "2",
        canvasBgColor: colors.canvasBgColor,
        bgColor: colors.backgroundColor,
        captionColor: colors.captionColor,
        xAxisNameColor: colors.labelColor,
        yAxisNameColor: colors.labelColor,
        labelColor: colors.labelColor,
        divLineColor: colors.gridColor,
        showBorder: "0",
        showCanvasBorder: "0",
        showAxisLines: "1",
        axisLineColor: colors.axisColor,
        showValues: "1",
        showDataLabels: "1",
        dataLabelColor: "#FFFFFF",
        dataLabelFontSize: "12",
        dataLabelFontBold: "1",
        dataLabelBgColor: colors.clientBarColor,
        dataLabelBgAlpha: "80",
        dataLabelBorderRadius: "4",
        dataLabelBorderPadding: "4",
        legendBgColor: colors.backgroundColor,
        legendBorderColor: colors.axisColor,
        legendBorderThickness: "1",
        legendBorderAlpha: "30",
        legendShadow: "0",
        legendAllowDrag: "1",
        legendScrollBgColor: colors.backgroundColor,
        scrollColor: colors.axisColor,
        flatScrollBars: "1",
        scrollShowButtons: "0",
        scrollHeight: "10",
        connectNullData: "0",
        showAlternateHGridColor: "0",
        showPlotBorder: "0",
        paletteColors: `${colors.clientBarColor},${colors.peerLineColor},${colors.peerLineColor},${colors.peerLineColor},${colors.peerLineColor}`,
        useEllipsesWhenOverflow: "1",
        rotateValues: "0",
        placeValuesInside: "0",
        formatNumber: "1",
        formatNumberScale: "1",
        decimalSeparator: ".",
        thousandSeparator: ",",
        defaultNumberScale: "",
        numberScaleUnit: "K,M,B,T",
        numberScaleValue: "1000,1000,1000,1000",
        forceDecimals: "0",
        decimalPrecision: "2",
        divLineDecimalPrecision: "0",
        limitsDecimalPrecision: "0",
        yAxisValueDecimals: "0",
        xAxisValueDecimals: "0",
        toolTipColor: colors.backgroundColor,
        toolTipBorderThickness: "0",
        toolTipBgColor: colors.backgroundColor,
        toolTipBgAlpha: "80",
        toolTipBorderColor: colors.axisColor,
        toolTipBorderAlpha: "30",
        toolTipSepChar: " - ",
        useEllipsesWhenOverflow: "1",
        rotateValues: "0",
        placeValuesInside: "0",
        formatNumber: "1",
        formatNumberScale: "1",
        decimalSeparator: ".",
        thousandSeparator: ",",
        defaultNumberScale: "",
        numberScaleUnit: "K,M,B,T",
        numberScaleValue: "1000,1000,1000,1000",
        forceDecimals: "0",
        decimalPrecision: "2",
        divLineDecimalPrecision: "0",
        limitsDecimalPrecision: "0",
        yAxisValueDecimals: "0",
        xAxisValueDecimals: "0"
      },
      categories: [{
        category: categories
      }],
      dataset: datasets,
      trendlines: trendlines
    }
  };
}

// Initialize FusionCharts when document is ready
FusionCharts.ready(function() {
  // Create the chart configuration
  const chartConfig = createFusionChartConfig(
    sampleData,
    'chart-container',
    'Financial Performance Comparison',
    'num'
  );
  
  // Create and render the chart
  const revenueChart = new FusionCharts(chartConfig);
  revenueChart.render();
  
  // Add theme toggle functionality (matching your existing theme system)
  function updateChartTheme() {
    const newConfig = createFusionChartConfig(
      sampleData,
      'chart-container',
      'Financial Performance Comparison',
      'num'
    );
    revenueChart.setJSONData(newConfig.dataSource);
  }
  
  // Listen for theme changes (if you have a theme toggle)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        updateChartTheme();
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

/**
 * Utility function to create chart with custom data
 * @param {Object} data - Chart data
 * @param {string} containerId - Container element ID
 * @param {string} title - Chart title
 * @param {string} numType - Number type
 * @returns {Object} FusionCharts instance
 */
function createCustomFusionChart(data, containerId, title, numType = 'num') {
  const chartConfig = createFusionChartConfig(data, containerId, title, numType);
  const chart = new FusionCharts(chartConfig);
  chart.render();
  return chart;
}

// Export functions for use in other modules
window.createCustomFusionChart = createCustomFusionChart;
window.formatNumber = formatNumber;
window.getChartColors = getChartColors;
