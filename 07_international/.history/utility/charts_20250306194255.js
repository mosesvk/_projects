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

const getFunctionalAllocationChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  wa,
  parsedData
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

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const formatNumber = (value) => value.toLocaleString();

  // Get data for program expenses
  const { clientArray: programClientArray, peerAvg: programPeerAvg } =
    getPeerAndClientChartDataArrays(
      selectedYearsArray,
      parsedData["functionalExpensePercent_program_Peer"],
      parsedData["functionalExpensePercent_program_Client"],
      fixedNum,
      "functionalExpensePercent_program",
      numType,
      wa
    );

  // Get data for administrative expenses
  const { clientArray: adminClientArray } = getPeerAndClientChartDataArrays(
    selectedYearsArray,
    parsedData["functionalExpensePercent_administrative_Peer"],
    parsedData["functionalExpensePercent_administrative_Client"],
    fixedNum,
    "functionalExpensePercent_administrative",
    numType,
    wa
  );

  // Get data for fundraising expenses
  const { clientArray: fundraisingClientArray } =
    getPeerAndClientChartDataArrays(
      selectedYearsArray,
      parsedData["functionalExpensePercent_fundraising_Peer"],
      parsedData["functionalExpensePercent_fundraising_Client"],
      fixedNum,
      "functionalExpensePercent_fundraising",
      numType,
      wa
    );

  // Update modal with data
  selectedYearsArray.forEach((year, index) => {
    const tableModalRow = document.getElementById(`${mainName}_modal_${year}`);
    if (tableModalRow) {
      // Add data for program expenses
      addClientDataToModalRow(
        tableModalRow,
        programClientArray[index],
        numType,
        fixedNum,
        "Program"
      );

      // Add data for administrative expenses
      addClientDataToModalRow(
        tableModalRow,
        adminClientArray[index],
        numType,
        fixedNum,
        "Administrative"
      );

      // Add data for fundraising expenses
      addClientDataToModalRow(
        tableModalRow,
        fundraisingClientArray[index],
        numType,
        fixedNum,
        "Fundraising"
      );

      // Add peer average for program expenses
      addPeerDataToModalRow(
        tableModalRow,
        programPeerAvg[index],
        0,
        0,
        0,
        "Program Peer Avg",
        parsedData,
        wa
      );
    }
  });

  const yaxisLabelFormatter = (value) => {
    return `${formatNumber(value)}%`;
  };

  const tooltipFormatter = (value) => {
    if (!value && value !== 0) return;
    const formattedValue = value.toLocaleString();
    return `${formattedValue}%`;
  };

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.red,
      window.chartColors.orange,
    ],
    series: [
      {
        name: "Program Expenses",
        type: "column",
        data: programClientArray,
      },
      {
        name: "Administrative Expenses",
        type: "column",
        data: adminClientArray,
      },
      {
        name: "Fundraising Expenses",
        type: "column",
        data: fundraisingClientArray,
      },
      {
        name: "Peer Average Program Expense",
        type: "line",
        data: programPeerAvg,
      },
    ],
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: "center",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(0) + "%";
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      width: [0, 0, 0, 4],
      curve: "smooth",
    },
    title: {
      text: "Functional Expense Allocation",
      align: "left",
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
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 10,
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
        opacity: 0.5,
        thickness: 4,
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
