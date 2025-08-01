// CreateCharts.js
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
  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#ebedf0",
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#6B7280",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains("dark")
    ? "#e3f0fa"
    : "#3a464f";

  const selectedYearsArray = getSelectedYearsFromLocalStorage() || [];

  // Validate that we have years selected
  if (!selectedYearsArray || selectedYearsArray.length === 0) {
    console.warn("No years selected for chart:", mainName);
    return null; // Return null to prevent chart creation
  }

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

  console.log("getMainChartOptions()", {
    selectedYearsArray,
    dataPeer,
    dataClient,
    fixedNum,
    numType,
    mainName,
    clientArray,
    peerAvg,
    peerMid,
    peer25,
    peer75,
  });

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
      name: "Avg",
      type: "line",
      data: peerAvg,
      yaxis: 0,
      style: {
        colors: ["transparent"], // Set the line color to transparent
      },
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
      name: "Midpoint",
      type: "line",
      data: peerMid,
      visible: false,
    },
    {
      name: "25th",
      type: "line",
      data: peer25,
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
      window.chartColors.red,
      window.chartColors.orange,
      window.chartColors.grey,
    ],
    series: series,
    chart: {
      height: 350,
      type: "line",
      stacked: false,
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
        foreColor: window.chartColors.green,
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#ffffff",
        opacity: 0.7,
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
            colors: chartColor,
            fontSize: "1.25rem",
          },
        align: chartId === "personnelToCashExpenditure_chart" || chartId === "benefitsToSalaries_chart" ? "left" : undefined,
        },
        tooltip: {
          enabled: true,
        },
      },
    ],
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
        opacity: 0.5,
        thickness: 4,
      },
    },
    plotOptions: {
      bar: {
        barHeight: "90%",
      },
    },
  };
};
