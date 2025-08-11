// CreateCharts.js

// Centralized benchmark mapping for all fields.
// Returns either an array with two values [low, high],
// a single-value array [threshold], or null when no numeric benchmark applies.
// Titles for lines are handled in the chart renderer as
// "Benchmark - lower end" and "Benchmark - higher end" when two values are present,
// or simply "Benchmark" for a single value.
// Note: Values are defined based on business guidance in todo_Aug11.md and DisplayCharts copy.
window.getBenchmarksForField = function getBenchmarksForField(fieldName) {
  const map = {
    // Demo
    attendeesToStaff: [65, 90],

    // Cash
    daysExpendableNetAssets: [30, 60],
    daysOperatingCash: [40, 80],
    availableDaysOfCashFlow: [120, 180],
    liquidityRatio: [5],
    netCashAvailability: null,

    // Debt
    debtToContributionsWithout: [2],
    currentRatio: [2],
    mandatoryDebtServiceToContributionsWithout: [15, 20],
    debtPerGivingUnit: null,
    debtCoverage: [1.15],

    // Income
    netIncomeRatio: [0], // positive is good
    contributionsWithoutDonorPerGivingUnit: null,
    totalContributionsPerGivingUnit: null,
    totalContributionsPerAverageAdultAttendee: [2000, 3000],
    contributionsWithoutDonorPerAverageAdultAttendee: null,

    // Expense
    benefitsToSalaries: null,
    salariesBenefitsIncludingOutsourcedEmployees: null,
    personnelToCashExpenditure: [40, 55],
    mandatoryDebtServiceToCashExpenditure: [15],
    personnelIncludingToTotalCashExpenditures: null,
    totalGlobalAndLocalOutreachExpenses: [10, 25],
    facilitiesExpenseToTotalCashExpenditures_lessThanTen: [20, 30],
    facilitiesExpenseToTotalCashExpenditures_greaterThanTen: [20, 30],

    // Additional
    informationTechnologyCostPerFTE: null,
  };

  return Object.prototype.hasOwnProperty.call(map, fieldName)
    ? map[fieldName]
    : null;
};
const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  benchmark,
  title,
  chartId
) => {
  const isDarkMode = document.documentElement.classList.contains("dark");
  const chartColors = isDarkMode
    ? {
        borderColor: "#6B7280",      // Lighter border for dark mode
        labelColor: "#F9FAFB",       // Lighter label color for dark mode
        lineColor: "#E5E7EB",        // Lighter line color for dark mode
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#6B7280",
        lineColor: "#3a464f",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = isDarkMode
    ? "#E5E7EB"                      // Lighter axis color for dark mode
    : "#3a464f";

  const selectedYearsArray = getSelectedYearsFromLocalStorage() || [];

  // Validate that we have years selected
  if (!selectedYearsArray || selectedYearsArray.length === 0) {
    console.warn("No years selected for chart:", mainName);
    return null; // Return null to prevent chart creation
  }

  // Initialize annotation variables
  let yaxisAnnotation;
  let yaxisMax;
  let previousData;

  // Chart events for annotation positioning
  const chartEvents = {
    beforeMount: function (chartContext, config) {
      // First, wait for the chart and annotations to be rendered
      setTimeout(() => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        // Get the first grid line to use as reference
        const gridLine = chartElement.querySelector(
          `.apexcharts-gridlines-horizontal line`
        );
        if (!gridLine) return;

        // Get the annotation line (y-axis annotation)
        const annotationLine = chartElement.querySelector(
          `.apexcharts-yaxis-annotations line`
        );
        if (!annotationLine) return;

        // Get the exact x1 and x2 values from the grid line
        const x1 = gridLine.getAttribute("x1");
        const x2 = gridLine.getAttribute("x2");

        // Set the annotation line to match exactly
        annotationLine.setAttribute("x1", x1);
        annotationLine.setAttribute("x2", x2);

        // Ensure all annotation lines extend fully across the chart
        const allAnnotationLines = chartElement.querySelectorAll(
          `.apexcharts-yaxis-annotations line`
        );
        allAnnotationLines.forEach((line) => {
          line.setAttribute("x1", x1);
          line.setAttribute("x2", x2);
        });

        // Adjust annotation label positioning to stay close to y-axis
        const annotationLabels = chartElement.querySelectorAll(
          `.apexcharts-yaxis-annotations .apexcharts-annotation-label`
        );
        annotationLabels.forEach((label) => {
          // Position labels directly adjacent to the y-axis line
          label.style.left = `${parseInt(x1) -70}px`;
        });

        // console.log(`Updated annotation line: x1=${x1}, x2=${x2}`);
      }, 200); // Extra delay to ensure annotations are rendered
    },
    updated: function (chartContext, config) {
      // First, wait for the chart and annotations to be rendered
      const chartElement = document.getElementById(chartId);
      if (!chartElement) return;

      if (chartId === "cfiRatio_chart") {
      }

      // Get the first grid line to use as reference
      const gridLine = chartElement.querySelector(
        `.apexcharts-gridlines-horizontal line`
      );
      if (!gridLine) return;

      // Get the annotation line (y-axis annotation)
      const annotationLine = chartElement.querySelector(
        `.apexcharts-yaxis-annotations line`
      );
      const yaxis = chartElement.querySelector(`.apexcharts-yaxis`);
      if (!annotationLine) return;

      // Get the exact x1 and x2 values from the grid line
      const x1 = gridLine.getAttribute("x1");
      const x2 = gridLine.getAttribute("x2");

      // Set the annotation line to match exactly
      annotationLine.setAttribute("x1", x1);
      annotationLine.setAttribute("x2", x2);

      // Ensure all annotation lines extend fully across the chart
      const allAnnotationLines = chartElement.querySelectorAll(
        `.apexcharts-yaxis-annotations line`
      );
      allAnnotationLines.forEach((line) => {
        line.setAttribute("x1", x1);
        line.setAttribute("x2", x2);
      });

      // Adjust annotation label positioning to stay close to y-axis
      const annotationLabels = chartElement.querySelectorAll(
        `.apexcharts-yaxis-annotations .apexcharts-annotation-label`
      );
      annotationLabels.forEach((label) => {
        // Position labels directly adjacent to the y-axis line
        label.style.left = `${parseInt(x1) - 70}px`;
      });
    },
  };

  // Calculate dynamic offset based on selected years length
  const selectedYearsLength = selectedYearsArray.length;
  let dynamicOffsetX;

  switch (selectedYearsLength) {
    case 1:
      dynamicOffsetX = 30;
      break;
    case 3:
    case 2:
      dynamicOffsetX = -120;
      break;
    case 5:
    case 4:
      dynamicOffsetX = -75;
      break;
    case 6:
      dynamicOffsetX = -40;
      break;
    case 7:
      dynamicOffsetX = -10;
      break;
    case 8:
      dynamicOffsetX = 0;
      break;
    case 9:
      dynamicOffsetX = 20;
      break;
    case 10:
      dynamicOffsetX = 30;
      break;
    case 11:
      dynamicOffsetX = 40;
    default:
      dynamicOffsetX = 50;
  }

  // Adjust offset for better y-axis label positioning
  // Use a smaller, more consistent offset that stays close to the y-axis
  const yaxisLabelOffsetX = -60;

  const formatNumber = (value) => value.toLocaleString();

  ({ clientArray, peerAvg, peerMid, peer25, peer75 } =
    getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      benchmark,
      numType
    ));

  // Set up annotations based on mainName and benchmark (only if benchmark is provided)
  if (benchmark !== undefined && benchmark !== null) {
    // Benchmark is always an array with 1 or 2 values
    if (Array.isArray(benchmark)) {
      // Create annotation lines for each benchmark value (1 or 2 lines)
      const benchmarkAnnotations = benchmark.map((value, index) => ({
        id: `annotation_${index}`,
        y: value,
        borderColor: chartColors.labelColor,
        strokeDashArray: 0,
        label: {
          text: benchmark.length === 1 ? "Benchmark" : `Benchmark ${index + 1}`,
          borderColor: isDarkMode ? "#374151" : "#ffffff",
          borderWidth: 1,
          position: "left",
          offsetX: yaxisLabelOffsetX,
          style: {
            background: isDarkMode ? "#1F2937" : window.chartColors.green,
            color: chartColors.labelColor,
            fontSize: "16px",
            fontWeight: 600,
            padding: "4px",
            borderRadius: "2px",
            opacity: isDarkMode ? 0.9 : 0.7,
          },
        },
      }));
      yaxisAnnotation = benchmarkAnnotations;
      yaxisMax = Math.round(Math.max(...clientArray, ...benchmark) + 2);
      previousData = clientArray;
    }
  }

  const yaxisLabelFormatter = (value) => {
    let formattedValue;
    let suffix = '';
    
    if (value >= 10000000) {
      // Round to nearest 10M for values >= 10M
      formattedValue = `${Math.round(value / 10000000) * 10}M`;
    } else if (value >= 1000000) {
      // Round to nearest 1M for values >= 1M
      formattedValue = `${Math.round(value / 1000000)}M`;
    } else if (value >= 10000) {
      // Round to nearest 10K for values >= 10K
      formattedValue = `${Math.round(value / 10000) * 10}K`;
    } else if (value >= 1000) {
      // Round to nearest 1K for values >= 1K
      formattedValue = `${Math.round(value / 1000)}K`;
    } else {
      formattedValue = formatNumber(value);
    }
    
    // Apply prefix/suffix based on numType
    if (numType === "dollar") {
      return `$${formattedValue}`;
    } else if (numType === "percent") {
      return `${formattedValue}%`;
    } else {
      return formattedValue; // "num" or "number" - no prefix/suffix
    }
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    if (numType === "dollar") {
      return `$${formattedValue}`;
    } else if (numType === "percent") {
      return `${formattedValue}%`;
    } else {
      return formattedValue;
    }
  };

  // console.log("getMainChartOptions()", {
  //   selectedYearsArray,
  //   dataPeer,
  //   dataClient,
  //   fixedNum,
  //   numType,
  //   mainName,
  //   clientArray,
  //   peerAvg,
  //   peerMid,
  //   peer25,
  //   peer75,
  // });

  // clientArray should already contain clean numeric values from getPeerAndClientChartDataArrays

  const series = [
    {
      name: firmName,
      type: "column",
      data: clientArray,
      style: {
        colors: [chartColors.labelColor],
      },
    },
    {
      name: "25th",
      type: "line",
      data: peer25,
      visible: false,
    },
    {
      name: "Avg",
      type: "line",
      data: peerAvg,
      yaxis: 0,
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 80, 80],
        },
      },
    },
    {
      name: "50th",
      type: "line",
      data: peerMid,
      visible: false,
    },
    {
      name: "75th",
      type: "line",
      data: peer75,
      visible: false,
    },
  ];

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.orange,
      window.chartColors.yellow,
      window.chartColors.purple,
    ],
    series: series,
    chart: {
      toolbar: {
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 350,
      type: "line",
      stacked: false,
      events: chartEvents,
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      offsetY: -20,
      formatter: tooltipFormatter,
      style: {
        fontSize: "20px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      background: {
        enabled: true,
        foreColor: isDarkMode ? "#1F2937" : window.chartColors.green,
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: isDarkMode ? "#374151" : "#ffffff",
        opacity: isDarkMode ? 0.9 : 0.7,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.45,
        },
      },
    },
    stroke: {
      width: [2, 3, 4, 4, 4],
      dashArray: series.map((s, i) => (i === 1 ? 4 : 0)),
    },
    title: {
      text: "",
      align: "left",
      offsetX: 110,
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1rem",
        },
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: chartColor,
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColors.labelColor,
            fontSize: "1.25rem",
          },
        align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
        },
        tooltip: {
          enabled: true,
        },
        max: yaxisMax,
      },
    ],
    annotations: {
      yaxis: yaxisAnnotation,
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: "center",
      offsetX: 40,
      fontSize: "20px",
    },
    grid: {
      row: {
        colors: ["transparent"],
        opacity: isDarkMode ? 0.3 : 0.5,
        thickness: 4,
      },
      borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
    },
    plotOptions: {
      bar: {
        barHeight: "90%",
      },
    },
  };
};
