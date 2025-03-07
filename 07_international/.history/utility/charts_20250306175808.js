const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  wa,
  parsedData
) => {
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
      mainName,
      numType,
      wa
    ));

  selectedYearsArray.forEach((year, index) => {
    const tableModalRow = document.getElementById(`${mainName}_modal_${year}`);
    // console.log("tableModalRow", `${mainName}_modal_${year}`, tableModalRow);

    if (tableModalRow) {
      addClientDataToModalRow(
        tableModalRow,
        clientArray[index],
        numType,
        fixedNum,
        mainName
      );
      addPeerDataToModalRow(
        tableModalRow,
        peerAvg[index],
        peerMid[index],
        peer25[index],
        peer75[index],
        mainName,
        parsedData,
        wa
      );
    }
  });

  // console.log(mainName, { clientArray, peerAvg, peerMid, peer25, peer75 });

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
    ],
    chart: {
      height: 350,
      type: "line",
      stacked: false,
      toolbar: {
        show: false, // Hide the toolbar
      },
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
    toolbar: {
      show: false,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
      },
    },
  };
};

const getLineChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  wa,
  parsedData,
  benchmark,
  title
) => {
  // console.log('-----')
  // console.log("getLineChartOptions()");
  // console.log({ mainName });

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
      mainName,
      numType,
      wa
    ));

  selectedYearsArray.forEach((year, index) => {
    const tableModalRow = document.getElementById(`${mainName}_modal_${year}`);
    // console.log("tableModalRow", `${mainName}_modal_${year}`, tableModalRow);

    if (tableModalRow) {
      addClientDataToModalRow(
        tableModalRow,
        clientArray[index],
        numType,
        fixedNum,
        mainName
      );
      addPeerDataToModalRow(
        tableModalRow,
        peerAvg[index],
        peerMid[index],
        peer25[index],
        peer75[index],
        mainName,
        parsedData,
        wa
      );
    }
  });

  // console.log(mainName, { clientArray, peerAvg, peerMid, peer25, peer75 });

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

  // let yaxisAnnotation;
  // let yaxisMax;
  // let previousData = [];

  // if (mainName == "assetsWithoutPpeToLiabilitiesWithoutDebt") {
  //   assetsWithoutPpeToLiabilitiesWithoutDebt_annotation = [
  //     {
  //       id: "annotation",
  //       y: benchmark,
  //       borderColor: chartColors.labelColor,
  //       strokeDashArray: 0,
  //       width: "200%",
  //       offsetX: -180,
  //       label: {
  //         text: "Benchmark",
  //         borderColor: "transparent",
  //         borderWidth: 0,
  //         position: "top",
  //         offsetX: -70,
  //         style: {
  //           background: "transparent",
  //           color: chartColors.labelColor,
  //           fontSize: "18px",
  //           fontWeight: 600,
  //         },
  //       },
  //     },
  //   ];
  //   yaxisAnnotation = assetsWithoutPpeToLiabilitiesWithoutDebt_annotation;
  //   yaxisMax = Math.round(Math.max(...clientArray) + 2);
  //   previousData = clientArray;
  // }

  const dataLabelFormatter = (value) => {
    // 2. Handle zero values properly
    if (value === 0 || value) {
      const formattedValue = value.toLocaleString();
      if (numType === "dollar") {
        return `$${formattedValue}`;
      } else {
        return `${Number(value).toFixed(2)}`;
      }
    }
    return ""; // Return empty string for null/undefined
  };

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.black,
    ],
    series: [
      {
        name: firmName,
        type: "line",
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: "Peer Avg",
        type: "line",
        stacked: false,
        data: peerAvg,
        yaxis: 0,
      },
    ],
    chart: {
      height: 350,
      toolbar: {
        show: false,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
      // 3. Move title here to avoid duplication
      title: {
        text: title,
        align: "top",
        style: {
          color: chartColor,
          fontSize: "20px",
        },
      },
    },
    dataLabels: {
      // 4. Add enabled:true
      enabled: true,
      formatter: dataLabelFormatter,
      textAnchor: "end",
      offsetY: -10,
    },
    stroke: {
      width: [2, 6, 4, 4, 4],
    },
    xaxis: {
      type: "category",
      categories: selectedYearsArray,
      tickPlacement: "between",
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
    // 5. Remove duplicate toolbar and title
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

  console.log({ data, financeData, investingData, operatingData, totalData });

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const seriesData = getSeriesData(
    selectedYearsArray,
    operatingData,
    investingData,
    financeData,
    totalData
  );

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
    toolbar: {
      show: false,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
      },
    },
  };
};

const createFunctionalAllocationChart = (parseData) => {
  if (!parseData) return;

  // Get selected years
  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  // Prepare data arrays
  const programData = [];
  const adminData = [];
  const fundraisingData = [];
  const peerProgramAvg = [];

  // For each year, get the client data for each category and peer avg for program
  selectedYearsArray.forEach((year) => {
    // Program data
    programData.push(
      parseData.functionalExpensePercent_program_Client[year]
        ? parseData.functionalExpensePercent_program_Client[year].value * 100
        : 0
    );

    // Admin data
    adminData.push(
      parseData.functionalExpensePercent_administrative_Client[year]
        ? parseData.functionalExpensePercent_administrative_Client[year].value *
            100
        : 0
    );

    // Fundraising data
    fundraisingData.push(
      parseData.functionalExpensePercent_fundraising_Client[year]
        ? parseData.functionalExpensePercent_fundraising_Client[year].value *
            100
        : 0
    );

    // Peer program average - from existing peer data
    if (
      parseData.functionalExpensePercent_program_Peer &&
      parseData.functionalExpensePercent_program_Peer[year]
    ) {
      const peerArray = parseData.functionalExpensePercent_program_Peer[year];
      const avg = getAverageOfArray(peerArray);
      peerProgramAvg.push(avg * 100);
    } else {
      peerProgramAvg.push(0);
    }
  });

  // Update the modal with data
  updateModal("functionalAllocation", null, null, parseData);

  // Chart options for a mixed bar/line chart showing all three types
  const chartOptions = {
    colors: [
      window.chartColors.green, // Program
      window.chartColors.blue, // Admin
      window.chartColors.red, // Fundraising
      window.chartColors.orange, // Peer avg
    ],
    series: [
      {
        name: "Program",
        type: "column",
        data: programData,
      },
      {
        name: "Administrative",
        type: "column",
        data: adminData,
      },
      {
        name: "Fundraising",
        type: "column",
        data: fundraisingData,
      },
      {
        name: "Peer Program Avg",
        type: "line",
        data: peerProgramAvg,
      },
    ],
    chart: {
      height: 350,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [1, 1, 1, 4],
    },
    title: {
      text: "",
      align: "left",
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: document.documentElement.classList.contains("dark")
            ? "#ebedf0"
            : "#6B7280",
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
          color: document.documentElement.classList.contains("dark")
            ? "#e3f0fa"
            : "#3a464f",
        },
        labels: {
          formatter: (value) => `${value.toFixed(0)}%`,
          style: {
            colors: document.documentElement.classList.contains("dark")
              ? "#e3f0fa"
              : "#3a464f",
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
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
    legend: {
      horizontalAlign: "center",
      offsetX: 40,
      fontSize: "20px",
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
      },
    },
  };

  // Render chart
  functionalAllocation_chart = new ApexCharts(
    document.getElementById("functionalAllocation_chart"),
    chartOptions
  );
  functionalAllocation_chart.render();

  // Update on dark mode toggle
  document.addEventListener("dark-mode", function () {
    functionalAllocation_chart.updateOptions(chartOptions);
  });
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
