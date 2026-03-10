/**
 * Resolves the label to show for the client series (firmName or clientName, fallback "Client").
 * @returns {string}
 */
const getClientChartLabel = () => {
  if (typeof firmName !== "undefined" && firmName != null) {
    return firmName instanceof HTMLElement ? firmName.textContent : String(firmName);
  }
  const firmEl = document.getElementById("firmName");
  return firmEl && firmEl.textContent ? firmEl.textContent : "Client";
};

const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  name
) => {
  // console.log('getMainChartOptions()')

  const clientLabel = getClientChartLabel();

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

  /**
   * Use years that have either peer OR client data so charts
   * still render client bars when peer data is missing for a year.
   * Peer arrays are treated as empty for those years and rendered as 0.
   */
  const yearsToShow = Array.isArray(selectedYearsArray)
    ? selectedYearsArray.filter((year) => {
        const hasPeerData = !!(dataPeer && dataPeer[year]);
        const hasClientData =
          !!(
            dataClient &&
            dataClient[year] &&
            dataClient[year].value !== undefined &&
            dataClient[year].value !== null &&
            dataClient[year].value !== ""
          );

        return hasPeerData || hasClientData;
      })
    : [];

  const formatNumber = (value) => {
    if (value == null || isNaN(value)) return "";
    return value.toLocaleString();
  };

  const formatNumberWithFixed = (value) => {
    if (value == null || isNaN(value)) return "";
    const num = Number(value);
    if (typeof fixedNum === "number" && fixedNum > 0) {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: fixedNum,
        maximumFractionDigits: fixedNum,
      });
    }
    return num.toLocaleString();
  };

  // console.log(selectedYearsArray, dataPeer, dataClient, fixedNum);

  ({ clientArray, peerAvg, peerMid, peer25, peer75 } =
    getPeerAndClientChartDataArrays(
      yearsToShow,
      dataPeer,
      dataClient,
      fixedNum,
      numType
    ));

  // console.log({clientArray})



  const yaxisLabelFormatter = (value) => {
    if (numType === "dollar") {
      return `$${formatNumberWithFixed(value)}`;
    } else if (numType === "percent") {
      return `${formatNumberWithFixed(value)}%`;
    } else {
      return formatNumberWithFixed(value);
    }
  };

  const tooltipFormatter = (value) => {
    if (value == null || isNaN(value)) return;
    const formattedValue = formatNumberWithFixed(value);
    if (numType === "dollar") {
      return `$${formattedValue}`;
    } else if (numType === "percent") {
      return `${formattedValue}%`;
    } else {
      return formattedValue;
    }
  };

  const series = [
    {
      name: clientLabel,
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
      name: "25%",
      type: "line",
      data: peer25,
      visible: false,
    },
    {
      name: "50%",
      type: "line",
      data: peerMid,
      visible: false,
    },
    {
      name: "75%",
      type: "line",
      data: peer75,
      visible: false,
    },
  ]

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
      height: 350,
      type: "line",
      stacked: false,
      zoom: {
        enabled: false,
      },
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
    },
    dataLabels: {
      enabled: false,
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
      categories: yearsToShow,
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
