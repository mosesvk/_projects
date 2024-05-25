const getMainChartOptions = (dataPeer, dataClient, numType, fixedNum = 0, mainName) => {
  // console.log('-----')
  // console.log('getMainChartOptions()')

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

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const formatNumber = (value) => value.toLocaleString();

  // console.log(selectedYearsArray, dataPeer, dataClient, fixedNum);

  ({ clientArray, peerAvg, peerMid, peer25, peer75 } =
    getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum, 
      mainName
    ));

  // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 })

  const yaxisLabelFormatter = (value) => {
    if (numType === "dollar") {
      return `$${formatNumber(value)}`;
    } else if (numType === "percent") {
      return `${formatNumber(value)}%`;
    } else {
      return formatNumber(value);
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

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.red,
      window.chartColors.orange,
      window.chartColors.grey,
    ],
    series: [
      {
        name: "Client",
        type: "column",
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: "Avg",
        type: "line",
        stacked: false,
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
        name: "25%",
        type: "line",
        data: peer25,
        visible: false,
      },
      {
        name: "75%",
        type: "line",
        data: peer75,
        visible: false,
      },
    ],
    chart: {
      height: 350,
      type: "line",
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 6, 4, 4, 4],
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

const getCashFlowChartOptions = (
  data,
  [financing, investing, operating, total]
) => {
  // console.log(data);

  const financeData = data[`${financing}_Client`];
  const investingData = data[`${investing}_Client`];
  const operatingData = data[`${operating}_Client`];
  const totalData = data[`${total}_Client`];

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const seriesData = getSeriesData(
    selectedYearsArray,
    operatingData,
    investingData,
    financeData,
    totalData
  );

  // console.log({
  //   finance: financeData,
  //   investing: investingData,
  //   operating: operatingData,
  //   total: totalData,
  // });

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

  const formatNumber = (value) => value.toLocaleString();

  const yaxisLabelFormatter = (value) => {
    return `$${formatNumber(value)}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    return `$${formattedValue}`;
  };

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.red,
      window.chartColors.orange,
      window.chartColors.grey,
    ],
    series: seriesData,
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    title: {
      text: "",
      align: "left",
      offsetX: 110,
    },
    xaxis: {
      categories: ["Operating", "Investing", "Financing", "Total"],
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

function getSeriesData(
  selectedYearsArray,
  operatingData,
  investingData,
  financingData,
  totalData
) {
  return selectedYearsArray.map((year) => {
    const data = [
      operatingData[year]?.value || 0,
      investingData[year]?.value || 0,
      financingData[year]?.value || 0,
      totalData[year]?.value || 0,
    ];

    return {
      name: year.toString(),
      data: data,
    };
  });
}
