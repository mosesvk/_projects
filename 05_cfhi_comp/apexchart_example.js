FusionCharts.ready(function() {
  // Static data matching CreateCharts.js structure
  const staticData = {
    selectedYears: ['2019', '2020', '2021', '2022', '2023'],
    clientData: [45.2, 52.8, 48.9, 61.3, 58.7], // Client bar data
    peer25: [42.1, 45.3, 47.8, 49.2, 51.5],     // 25th percentile line
    peerAvg: [48.5, 51.2, 53.7, 55.8, 57.3],    // Average line
    peer50: [49.2, 52.1, 54.3, 56.1, 58.2],     // 50th percentile line
    peer75: [55.8, 58.4, 60.1, 62.7, 64.9],     // 75th percentile line
    benchmarks: [40, 55] // Two benchmark values
  };

  // Prepare categories (years)
  const categories = staticData.selectedYears.map(year => ({ label: year }));
  
  // Prepare datasets
  const datasets = [
    {
      seriesname: "Client Data",
      data: staticData.clientData.map(value => ({ value: value.toString() })),
      color: "#10B981", // Green
      renderAs: "column"
    },
    {
      seriesname: "25th Percentile",
      data: staticData.peer25.map(value => ({ value: value.toString() })),
      color: "#3B82F6", // Blue
      renderAs: "line",
      visible: "0" // Hidden by default
    },
    {
      seriesname: "Average",
      data: staticData.peerAvg.map(value => ({ value: value.toString() })),
      color: "#3B82F6", // Blue
      renderAs: "line",
      visible: "1"
    },
    {
      seriesname: "50th Percentile",
      data: staticData.peer50.map(value => ({ value: value.toString() })),
      color: "#3B82F6", // Blue
      renderAs: "line",
      visible: "0" // Hidden by default
    },
    {
      seriesname: "75th Percentile",
      data: staticData.peer75.map(value => ({ value: value.toString() })),
      color: "#3B82F6", // Blue
      renderAs: "line",
      visible: "0" // Hidden by default
    }
  ];
  
  // Prepare benchmark trendlines
  const trendlines = [
    {
      line: [{
        startvalue: "40",
        color: "#F59E0B", // Amber
        displayvalue: "Benchmark - Lower",
        valueOnRight: "1",
        thickness: "2",
        showBelow: "1",
        tooltext: "Benchmark 1: 40"
      }]
    },
    {
      line: [{
        startvalue: "55",
        color: "#EF4444", // Red
        displayvalue: "Benchmark - Higher",
        valueOnRight: "1",
        thickness: "2",
        showBelow: "1",
        tooltext: "Benchmark 2: 55"
      }]
    }
  ];

  // Create FusionCharts instance
  var revenueChart = new FusionCharts({
    type: 'mscombi2d',
    renderAt: 'chart-container',
    width: '100%',
    height: '350',
    dataFormat: 'json',
    dataSource: {
      chart: {
        theme: "fusion",
        caption: "Financial Performance Comparison",
        xAxisName: "Year",
        yAxisName: "Value",
        plotFillAlpha: "80",
        divLineIsDashed: "1",
        divLineDashLen: "4",
        divLineGapLen: "2",
        showBorder: "0",
        showCanvasBorder: "0",
        showAxisLines: "1",
        showValues: "1",
        showDataLabels: "1",
        dataLabelColor: "#FFFFFF",
        dataLabelFontSize: "12",
        dataLabelFontBold: "1",
        dataLabelBgColor: "#10B981",
        dataLabelBgAlpha: "80",
        dataLabelBorderRadius: "4",
        dataLabelBorderPadding: "4",
        legendBgColor: "#FFFFFF",
        legendBorderColor: "#E5E7EB",
        legendBorderThickness: "1",
        legendBorderAlpha: "30",
        legendShadow: "0",
        legendAllowDrag: "1",
        connectNullData: "0",
        showAlternateHGridColor: "0",
        showPlotBorder: "0",
        paletteColors: "#10B981,#3B82F6,#3B82F6,#3B82F6,#3B82F6",
        useEllipsesWhenOverflow: "1",
        rotateValues: "0",
        placeValuesInside: "0",
        formatNumber: "1",
        formatNumberScale: "1",
        decimalSeparator: ".",
        thousandSeparator: ",",
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
  });

  revenueChart.render();
});
