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

  // console.log(mainName, { clientArray, peerAvg, peerMid, peer25, peer75, dataPeer });

  const yaxisLabelFormatter = (value) => {
    if (numType === "dollar") {
      // return `$${formatNumber(value)}`;
      if (!value && value !== 0) return "$0";
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      }
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
  // Determine theme-based colors
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

  // Get data arrays for client and peer groups
  let clientArray = [],
    peerAvg = [],
    peerMid = [],
    peer25 = [],
    peer75 = [];

  try {
    // Safely get chart data arrays, handling potential data gaps
    const result = getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      numType,
      wa
    );

    clientArray = result.clientArray || [];
    peerAvg = result.peerAvg || [];
    peerMid = result.peerMid || [];
    peer25 = result.peer25 || [];
    peer75 = result.peer75 || [];
  } catch (error) {
    console.error(`Error getting chart data for ${mainName}:`, error);
    // Provide fallback empty arrays if error occurs
    clientArray = selectedYearsArray.map(() => null);
    peerAvg = selectedYearsArray.map(() => null);
    peerMid = selectedYearsArray.map(() => null);
    peer25 = selectedYearsArray.map(() => null);
    peer75 = selectedYearsArray.map(() => null);
  }

  // Update modal with data if available
  selectedYearsArray.forEach((year, index) => {
    const tableModalRow = document.getElementById(`${mainName}_modal_${year}`);

    if (tableModalRow) {
      // Only add data to modal row if it exists
      if (clientArray.length > index) {
        addClientDataToModalRow(
          tableModalRow,
          clientArray[index],
          numType,
          fixedNum,
          mainName
        );
      }

      if (peerAvg.length > index) {
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
    }
  });

  // Formatters for different number types
  const yaxisLabelFormatter = (value) => {
    if (value === null || value === undefined) return "";

    if (numType === "dollar") {
      return `$${formatNumber(value)}`;
    } else if (numType === "percent") {
      return `${formatNumber(value)}%`;
    } else {
      return formatNumber(value);
    }
  };

  const tooltipFormatter = (value) => {
    if (value === null || value === undefined) return "";

    const formattedValue = value.toLocaleString();
    if (numType === "dollar") {
      return `$${formattedValue}`;
    } else if (numType === "percent") {
      return `${formattedValue}%`;
    } else {
      return formattedValue;
    }
  };

  const dataLabelFormatter = (value) => {
    if (value === null || value === undefined) return "";

    const formattedValue = value.toLocaleString();
    if (numType === "dollar") {
      return `$${formattedValue}`;
    } else if (numType === "percent") {
      return `${value.toFixed(fixedNum)}%`;
    } else {
      return value.toFixed(fixedNum);
    }
  };

  // Build series array dynamically based on available data
  const series = [];

  // Only add client data if it has valid values
  if (
    clientArray.length > 0 &&
    clientArray.some((val) => val !== null && val !== 0)
  ) {
    series.push({
      name: firmName || "Client",
      type: "line",
      data: clientArray,
      style: {
        colors: [chartColors.labelColor],
      },
    });
  }

  // Only add peer average data if it has valid values and is not all zeros
  const hasPeerData =
    peerAvg.length > 0 && peerAvg.some((val) => val !== null && val !== 0);
  if (hasPeerData) {
    series.push({
      name: "Peer Avg",
      type: "line",
      data: peerAvg,
      yaxis: 0,
    });
  }

  // Calculate yaxis min/max dynamically based on data
  const allValues = [...clientArray, ...peerAvg].filter(
    (val) => val !== null && val !== undefined
  );
  const minValue = allValues.length > 0 ? Math.min(...allValues) * 0.9 : 0; // 10% below min
  const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.1 : 100; // 10% above max

  // Chart configuration
  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.black,
    ],
    series: series,
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      title: {
        text: title || mainName,
        align: "top",
        style: {
          color: chartColor,
          fontSize: "20px",
        },
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    dataLabels: {
      enabled: series.length > 0,
      formatter: dataLabelFormatter,
      textAnchor: "middle",
      offsetY: -10,
      style: {
        fontSize: "12px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: chartColors.borderColor,
        opacity: 0.9,
      },
    },
    stroke: {
      width: series.map(() => 3), // Equal width for all series
      curve: "smooth",
      dashArray: series.map((s, i) => (i === 1 ? 5 : 0)), // Dash the peer average line
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
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
      axisBorder: {
        show: true,
        color: chartColors.borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: chartColors.borderColor,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: minValue,
      max: maxValue,
      forceNiceScale: true,
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
          fontSize: "1rem",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      followCursor: false,
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
      show: series.length > 1,
      position: "top",
      horizontalAlign: "center",
      offsetX: 40,
      fontSize: "16px",
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        radius: 12,
        offsetX: 0,
        offsetY: 0,
      },
    },
    grid: {
      borderColor: chartColors.borderColor,
      row: {
        colors: ["transparent"],
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    noData: {
      text: "No data available",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: chartColor,
        fontSize: "16px",
        fontFamily: "Helvetica, Arial, sans-serif",
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

  // console.log({ data, financeData, investingData, operatingData, totalData });

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

  const formatNumber = (value) => `${Math.round(value)}%`;

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
    return `${value}%`;
  };

  const tooltipFormatter = (value) => {
    if (!value && value !== 0) return;
    const formattedValue = value.toLocaleString();
    return `${formattedValue}%`;
  };

  const seriesColors = [
    window.chartColors.green,
    window.chartColors.blue,
    window.chartColors.red,
    window.chartColors.orange,
  ];

  return {
    colors: seriesColors,
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
      enabledOnSeries: [3],
      offsetY: -20,
      formatter: formatNumber,
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: "#000000",
      },
    },
    stroke: {
      width: [0, 0, 0, 4], // Width for each series, last one is the line
      curve: "smooth",
    },
    markers: {
      size: [0, 0, 0, 5], // Size for each series, only show for line
      colors: window.chartColors.orange,
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1rem",
        },
      },
      tickAmount: 5,
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
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
      shared: true,
      intersect: false,
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
      padding: {
        top: 10,
      },
    },
    annotations: {
      yaxis: [
        {
          y: 80, // Recommended benchmark for program expenses (80%)
          borderColor: "#00E396",
          label: {
            borderColor: "#00E396",
            style: {
              color: "#fff",
              background: "#00E396",
            },
          },
        },
      ],
    },
  };
};

const getCostOfContributionsDetailViewOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 2,
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

  // Safely get fundraising expenses data with null checks
  const fundraisingExpensesData = [];
  selectedYearsArray.forEach((year) => {
    // Use direct client data instead of trying to access nested arrays
    if (
      parsedData["fundraisingExpense_Client"] &&
      parsedData["fundraisingExpense_Client"][year] &&
      parsedData["fundraisingExpense_Client"][year].value
    ) {
      fundraisingExpensesData.push(
        Number(parsedData["fundraisingExpense_Client"][year].value)
      );
    } else {
      fundraisingExpensesData.push(0);
    }
  });

  // Get total contributions data with proper null checks
  const totalContributionsData = [];
  selectedYearsArray.forEach((year) => {
    if (
      parsedData["contributionsWithAndWithoutSum_Client"] &&
      parsedData["contributionsWithAndWithoutSum_Client"][year] &&
      parsedData["contributionsWithAndWithoutSum_Client"][year].value
    ) {
      totalContributionsData.push(
        Number(parsedData["contributionsWithAndWithoutSum_Client"][year].value)
      );
    } else {
      totalContributionsData.push(0);
    }
  });

  // Get client and peer cost of contributions ratio with null checking
  let costOfContributionsClient = [];
  let costOfContributionsPeer = [];

  try {
    const result = getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum,
      "costOfContributions",
      "dollar",
      wa
    );

    costOfContributionsClient = result.clientArray || [];
    costOfContributionsPeer = result.peerAvg || [];
  } catch (error) {
    console.error("Error getting chart data arrays:", error);
    // Provide fallback empty arrays
    costOfContributionsClient = selectedYearsArray.map(() => 0);
    costOfContributionsPeer = selectedYearsArray.map(() => 0);
  }

  // Format numbers for display
  const formatLargeNumber = (value) => {
    if (!value && value !== 0) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }

    return `$${value.toFixed(2)}`;
  };

  const formatRatio = (value) => {
    if (!value && value !== 0) return "$0.00";
    return `$${value.toFixed(2)}`;
  };

  // Update modal with data - check if tableModalRow exists first
  selectedYearsArray.forEach((year, index) => {
    const tableModalRow = document.getElementById(`${mainName}_modal_${year}`);
    if (tableModalRow) {
      // Add fundraising expenses data
      addClientDataToModalRow(
        tableModalRow,
        fundraisingExpensesData[index],
        "dollar",
        0,
        "Fundraising Expenses"
      );

      // Add total contributions data
      addClientDataToModalRow(
        tableModalRow,
        totalContributionsData[index],
        "dollar",
        0,
        "Total Contributions"
      );

      // Add client cost ratio
      addClientDataToModalRow(
        tableModalRow,
        costOfContributionsClient[index],
        "dollar",
        2,
        firmName || "Client"
      );

      // Add peer average cost ratio
      addPeerDataToModalRow(
        tableModalRow,
        costOfContributionsPeer[index],
        0,
        0,
        0,
        "Peer Average",
        parsedData,
        wa
      );
    }
  });

  // console.log({
  //   mainName,
  //   fundraisingExpensesData,
  //   totalContributionsData,
  //   costOfContributionsClient,
  //   costOfContributionsPeer,
  //   dataPeer,
  //   dataClient,
  // });

  // Calculate dynamic min and max for dollar values (left y-axis)
  const allDollarValues = [
    ...fundraisingExpensesData,
    ...totalContributionsData,
  ].filter((v) => !isNaN(v) && v !== null);

  const minDollarValue = Math.min(...allDollarValues);
  const maxDollarValue = Math.max(...allDollarValues);

  // Round max dollar value to nearest million or 100k depending on size
  let roundedMaxDollar;
  if (maxDollarValue >= 1000000) {
    // If over 1M, round to nearest million
    roundedMaxDollar = Math.ceil(maxDollarValue / 1000000) * 1000000;
  } else {
    // If under 1M, round to nearest 100k
    roundedMaxDollar = Math.ceil(maxDollarValue / 100000) * 100000;
  }

  // For min dollar value, typically we want to start from 0 for financial charts
  const roundedMinDollar = 0;

  // Calculate dynamic min and max for ratio values (right y-axis)
  const allRatioValues = [
    ...costOfContributionsClient,
    ...costOfContributionsPeer,
  ].filter((v) => !isNaN(v) && v !== null);

  const minRatioValue = Math.min(...allRatioValues);
  const maxRatioValue = Math.max(...allRatioValues);

  // Round min ratio to nearest 0.5 (downward)
  const roundedMinRatio = Math.floor(minRatioValue * 2) / 2;

  // Round max ratio to nearest 0.5 (upward)
  const roundedMaxRatio = Math.ceil(maxRatioValue * 2) / 2;
  // Ensure we have valid min/max values with fallbacks
  const safeMinDollarValue =
    !isFinite(minDollarValue) || minDollarValue < 0 ? 0 : minDollarValue;
  const safeMaxDollarValue =
    !isFinite(maxDollarValue) || maxDollarValue <= 0 ? 1000000 : maxDollarValue;
  const safeMinRatioValue =
    !isFinite(minRatioValue) || minRatioValue < 0 ? 0 : minRatioValue;
  const safeMaxRatioValue =
    !isFinite(maxRatioValue) || maxRatioValue <= 0 ? 0.3 : maxRatioValue;

  const seriesColors = [
    window.chartColors.blue, // Fundraising expenses
    window.chartColors.green, // Total contributions
    window.chartColors.red, // Client cost ratio
    window.chartColors.grey, // Peer average ratio
  ];

  return {
    colors: seriesColors,
    series: [
      {
        name: "Fundraising Expenses",
        type: "column",
        data: fundraisingExpensesData,
        yaxis: 0,
      },
      {
        name: "Total Contributions",
        type: "column",
        data: totalContributionsData,
        yaxis: 0,
      },
      {
        name: firmName || "Client",
        type: "line",
        data: costOfContributionsClient,
        yaxis: 1,
      },
      {
        name: "Peer Average",
        type: "line",
        data: costOfContributionsPeer,
        yaxis: 1,
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
      enabled: true,
      offsetY: -20,
      formatter: formatLargeNumber,
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: seriesColors,
      },
      background: {
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
      width: [0, 0, 3, 3], // Width for each series
      curve: "smooth",
    },
    markers: {
      size: [0, 0, 4, 4], // Size for each series
      colors: [null, null, window.chartColors.red, window.chartColors.grey],
      strokeWidth: 2,
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
        labels: {
          formatter: function (value) {
            return formatLargeNumber(value);
          },
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        },
        min: safeMinDollarValue,
        max: safeMaxDollarValue,
        tickAmount: 5,
      },
      {
        labels: {
          formatter: function (value) {
            return formatRatio(value);
          },
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        },
        opposite: true,
        min: safeMinRatioValue,
        max: safeMaxRatioValue,
        tickAmount: 5,
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value, { seriesIndex }) {
          if (value === null || value === undefined) return "";
          if (seriesIndex <= 1) {
            // Format for bar charts (dollar values)
            return `$${value.toLocaleString()}`;
          } else {
            // Format for line charts (ratios)
            return `$${value.toFixed(2)}`;
          }
        },
      },
    },
    legend: {
      horizontalAlign: "center",
      offsetX: 40,
      fontSize: "20px",
    },
    grid: {
      padding: {
        top: 5,
        right: 5,
        left: 5,
      },
    },
  };
};

const getNetAssetBreakdownOptions = (
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

  // Get net assets without donor restrictions data
  const netAssetsWithoutDRData = [];
  selectedYearsArray.forEach((year) => {
    if (
      parsedData["netAssetsWithoutDonorRestrictions_Client"] &&
      parsedData["netAssetsWithoutDonorRestrictions_Client"][year] &&
      parsedData["netAssetsWithoutDonorRestrictions_Client"][year].value
    ) {
      netAssetsWithoutDRData.push(
        Number(
          parsedData["netAssetsWithoutDonorRestrictions_Client"][year].value
        )
      );
    } else {
      netAssetsWithoutDRData.push(0);
    }
  });

  // Get net assets with donor restrictions data
  const netAssetsWithDRData = [];
  selectedYearsArray.forEach((year) => {
    if (
      parsedData["netAssetsWithDonorRestrictionsSum_Client"] &&
      parsedData["netAssetsWithDonorRestrictionsSum_Client"][year] &&
      parsedData["netAssetsWithDonorRestrictionsSum_Client"][year].value
    ) {
      netAssetsWithDRData.push(
        Number(
          parsedData["netAssetsWithDonorRestrictionsSum_Client"][year].value
        )
      );
    } else {
      netAssetsWithDRData.push(0);
    }
  });

  // Calculate total net assets for percentage calculation
  const totalNetAssets = netAssetsWithoutDRData.map(
    (val, idx) => val + (netAssetsWithDRData[idx] || 0)
  );

  // Calculate percentages for display in data labels
  const netAssetsWithoutDRPercentage = netAssetsWithoutDRData.map((val, idx) =>
    totalNetAssets[idx] ? Math.round((val / totalNetAssets[idx]) * 100) : 0
  );

  const netAssetsWithDRPercentage = netAssetsWithDRData.map((val, idx) =>
    totalNetAssets[idx] ? Math.round((val / totalNetAssets[idx]) * 100) : 0
  );

  // Format numbers for display
  const formatLargeNumber = (value) => {
    if (!value && value !== 0) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

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

  // Update modal with data
  selectedYearsArray.forEach((year, index) => {
    const tableModalRow = document.getElementById(`${mainName}_modal_${year}`);
    if (tableModalRow) {
      // Add net assets without donor restrictions data
      addClientDataToModalRow(
        tableModalRow,
        netAssetsWithoutDRData[index],
        "dollar",
        1,
        "Without Donor Restrictions"
      );

      // Add net assets with donor restrictions data
      addClientDataToModalRow(
        tableModalRow,
        netAssetsWithDRData[index],
        "dollar",
        1,
        "With Donor Restrictions"
      );

      // Add total net assets
      addClientDataToModalRow(
        tableModalRow,
        totalNetAssets[index],
        "dollar",
        0,
        "Total Net Assets"
      );
    }
  });

  // Define series colors
  const seriesColors = [
    window.chartColors.blue, // Without donor restrictions
    window.chartColors.green, // With donor restrictions
  ];

  // console.log({mainName, netAssetsWithoutDRData, netAssetsWithDRData, dataPeer, dataClient, parsedData});

  return {
    colors: seriesColors,
    series: [
      {
        name: "Without Donor Restrictions",
        data: netAssetsWithoutDRData,
      },
      {
        name: "With Donor Restrictions",
        data: netAssetsWithDRData,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: false, // Explicitly set to false to ensure bars are not stacked
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%", // Slightly narrower columns to avoid overlap
        endingShape: "rounded",
        dataLabels: {
          position: "top", // Position labels at the top of bars
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      formatter: formatLargeNumber,
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: seriesColors,
      },
      background: {
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
      width: 2,
      colors: ["#fff"], // White border for better visual separation
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return formatLargeNumber(value);
        },
        style: {
          colors: chartColor,
          fontSize: "14px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return `${formatLargeNumber(value)}`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "16px",
    },
    grid: {
      borderColor: chartColors.borderColor,
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
