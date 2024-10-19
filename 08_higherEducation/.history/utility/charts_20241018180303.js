const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  benchmark,
  title
) => {
  // console.log('getMainChartOptions()',{ dataPeer, dataClient, numType, fixedNum, mainName, benchmark, title });

  const selectedYearsArray = getSelectedYearsFromLocalStorage();
  let leng = selectedYearsArray.length;

  const formatNumber = (value) => value.toLocaleString();

  // console.log(selectedYearsArray, dataPeer, dataClient, fixedNum);

  ({ clientArray, peerAvg, peerMid, peer25, peer75, benchmarkArray } =
    getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      benchmark,
      numType
    ));

  // if (mainName == "cfiRatio")
  // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#ebedf0",
        backgroundColor: "#000000",
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#000000",
        backgroundColor: "#ffffff",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains("dark")
    ? "#e3f0fa"
    : "#000000";

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

  // console.log({mainName, benchmark});

  // if (mainName == 'cfi_primaryReserveRatio') console.log({ series })\

  let yaxisAnnotation;

  if (mainName == "cfiRatio") {
    cfiRatio_annotation = [
      {
        id: "annotation",
        y: benchmark,
        borderColor: chartColors.labelColor,
        strokeDashArray: 0,
        width: "200%",
        offsetX: -180,
        label: {
          text: "Benchmark",
          borderColor: "transparent",
          borderWidth: 0,
          position: "top",
          offsetX: -70,
          style: {
            background: "transparent",
            color: chartColors.labelColor,
            fontSize: "18px",
            fontWeight: 600,
          },
        },
      },
    ];
    yaxisAnnotation = cfiRatio_annotation;
  } else if (mainName == "cfi_primaryReserveRatio") {
    cfi_primaryReserveRatio_annotation = [
      {
        id: "annotation",
        y: benchmark,
        borderColor: chartColors.labelColor,
        strokeDashArray: 0,
        width: "200%",
        offsetX: -180,
        label: {
          text: "Benchmark",
          borderColor: "transparent",
          borderWidth: 0,
          position: "top",
          offsetX: -70,
          style: {
            background: "transparent",
            color: chartColors.labelColor,
            fontSize: "18px",
            fontWeight: 600,
          },
        },
      },
    ];
    yaxisAnnotation = cfi_primaryReserveRatio_annotation;
  } else if (mainName == "cfi_netIncomeOperationsRatio") {
    cfi_netIncomeOperationsRatio_annotation = [
      {
        id: "annotation",
        y: benchmark,
        borderColor: chartColors.labelColor,
        strokeDashArray: 0,
        width: "200%",
        offsetX: -180,
        label: {
          text: "Benchmark",
          borderColor: "transparent",
          borderWidth: 0,
          position: "top",
          offsetX: -70,
          style: {
            background: "transparent",
            color: chartColors.labelColor,
            fontSize: "18px",
            fontWeight: 600,
          },
        },
      },
    ];
    yaxisAnnotation = cfi_netIncomeOperationsRatio_annotation;
  } else if (mainName == "cfi_returnOnNetAssets") {
    cfi_returnOnNetAssets_annotation = [
      {
        id: "annotation",
        y: benchmark,
        borderColor: chartColors.labelColor,
        strokeDashArray: 0,
        width: "200%",
        offsetX: -180,
        label: {
          text: "Benchmark",
          borderColor: "transparent",
          borderWidth: 0,
          position: "top",
          offsetX: -70,
          style: {
            background: "transparent",
            color: chartColors.labelColor,
            fontSize: "18px",
            fontWeight: 600,
          },
        },
      },
    ];
    yaxisAnnotation = cfi_returnOnNetAssets_annotation;
  } else {
    // cfi_viabilityRatio
    cfi_viabilityRatio_annotation = [
      {
        id: "annotation",
        y: benchmark,
        borderColor: chartColors.labelColor,
        strokeDashArray: 0,
        width: "200%",
        offsetX: -180,
        label: {
          text: "Benchmark",
          borderColor: "transparent",
          borderWidth: 0,
          position: "top",
          offsetX: -70,
          style: {
            background: "transparent",
            color: chartColors.labelColor,
            fontSize: "18px",
            fontWeight: 600,
          },
        },
      },
    ];
    yaxisAnnotation = cfi_viabilityRatio_annotation;
  }

  return {
    colors: [
      window.chartColors.cfi25,
      window.chartColors.cfi50,
      window.chartColors.cfiAvg,
      window.chartColors.cfi75,
      window.chartColors.cfiClient,
    ],
    series: [
      {
        name: "25th",
        type: "line",
        data: peer25,
      },
      {
        name: "50th",
        type: "line",
        data: peerMid,
      },
      {
        name: "Avg",
        type: "line",
        data: peerAvg,
      },
      {
        name: "75th",
        type: "line",
        data: peer75,
      },
      {
        name: clientName,
        type: "column",
        data: clientArray,
      },
    ],
    chart: {
      id: mainName,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 550,
      type: "line",
    },
    stroke: {
      // width: [5, 7, 5],
      // curve: 'straight',
      dashArray: [0, 0, 5],
    },
    title: {
      text: title,
      align: "center",
      style: {
        color: chartColors.labelColor,
        fontSize: "1.5rem",
      },
      offsetY: 30,
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
          color: chartColors.labelColor,
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColors.labelColor,
            fontSize: "1rem",
          },
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      fixed: {
        enabled: true,
        position: "topLeft",
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
      position: "top",
      fontSize: "20px",
      offsetY: -5,
    },
    annotations: {
      yaxis: yaxisAnnotation,
    },
    markers: {
      size: 0,
    },
  };
};

const getFSchartOptions = (
  data,
  client,
  color,
  numType,
  title,
  chartId,
  tableDataClass
) => {
  // console.log({ data, client, color, numType, title, chartId });

  const clientString = client.replace("_Client", "");

  const firstKey = Object.keys(data)[0];
  const yearsDataFinancialStatment_Array = Object.keys(data[firstKey]);
  // console.log({yearsDataFinancialStatment_Array});

  // console.log({ clientString });
  const clientArray = getValuesInChronologicalOrder(data[client]);
  const tableHeaderData = document.getElementById(
    `${clientString}_yearSelectData`
  );
  const tableHeaderYear = document.getElementById(`${clientString}_yearSelect`);
  // console.log({ tableHeaderData, tableHeaderYear });
  let year = yearsData_Array[yearsData_Array.length - 1];
  const totalNum = Number(clientArray[clientArray.length - 1]);

  tableHeaderData.textContent = totalNum.toLocaleString();
  tableHeaderYear.textContent = year;

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

  processFinancialData(
    data,
    tableDataClass,
    yearsDataFinancialStatment_Array[
      yearsDataFinancialStatment_Array.length - 1
    ],
    clientString
  );

  return {
    colors: [color],
    series: [
      {
        name: clientName,
        type: "column",
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
    ],
    chart: {
      toolbar: {
        tools: {
          download: false,
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
      events: {
        dataPointSelection: function (event, chartContext, opts) {
          const index = opts.dataPointIndex;
          // console.log({ chart, index, opts, year: yearsData_Array[index] });
          processFinancialData(
            data,
            tableDataClass,
            yearsDataFinancialStatment_Array[index],
            clientString
          );
        },
      },
    },
    stroke: {
      width: 4,
    },
    xaxis: {
      categories: yearsDataFinancialStatment_Array.sort((a, b) => a - b),
      labels: {
        rotate: -45,
        rotateAlways: true,
        offsetY: 5,
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
          show: false,
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

const getFpaChartOptions = (data) => {
  // console.log(data);

  const totalAssetsArray = Object.values(data["totalAssets_Client"])
    .map((item) => item.value)
    .reverse();
  const totalLiabilitiesArray = Object.values(data["totalLiabilities_Client"])
    .map((item) => item.value)
    .reverse();
  const netPositionArray = Object.values(data["netPosition_Client"])
    .map((item) => item.value)
    .reverse();

  // console.log({ totalAssetsArray, totalLiabilitiesArray, netPositionArray });

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const tableHeader = document.getElementById("row_fpa_tableHeader");
  const assetsRow = document.getElementById("row_fpa_assets");
  const liabilitiesRow = document.getElementById("row_fpa_liabilities");
  const netPositionRow = document.getElementById("row_fpa_netPosition");

  // Clear existing table content before appending
  tableHeader.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide"></th>`;
  assetsRow.innerHTML = `<th scope="row" class="px-6 py-2 font-meddium text-gray-900 whitespace-nowrap dark:text-white">Assets</th>`;
  liabilitiesRow.innerHTML = `<th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Liabilities</th>`;
  netPositionRow.innerHTML = `<th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Net Position</th>`;

  // Loop through selected years and populate the table
  selectedYearsArray.forEach((year, index) => {
    const assetValue = `${formatCurrency(totalAssetsArray[index])}`;
    const liabilitiesValue = `${formatCurrency(totalLiabilitiesArray[index])}`;
    const netPositionValue = `${formatCurrency(netPositionArray[index])}`;

    // Add year to table header
    tableHeader.innerHTML += `
    <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
  `;

    // Add corresponding asset data
    assetsRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${
        totalAssetsArray[index] ? assetValue : "-"
      } <!-- Fallback in case data is missing -->
    </th>
  `;

    // Add corresponding liabilities data
    liabilitiesRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${
        totalLiabilitiesArray[index] ? liabilitiesValue : "-"
      } <!-- Fallback in case data is missing -->
    </th>
  `;

    // Add corresponding net position data
    netPositionRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${
        netPositionArray[index] ? netPositionValue : "-"
      } <!-- Fallback in case data is missing -->
    </th>
  `;
  });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#3A464F",
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

  // console.log(selectedYearsArray, dataPeer, dataClient, fixedNum);
  // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 })

  const yaxisLabelFormatter = (value) => {
    if (value >= 1000000) {
      return `$${Math.round(value / 1000000)}M`;
    }
    return `$${formatNumber(value)}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    return `$${formattedValue}`;
  };

  // console.log({mainName, benchmark});

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.grey,
      window.chartColors.red,
      window.chartColors.orange,
    ],
    series: [
      {
        name: "Total Assets",
        type: "bar",
        data: totalAssetsArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: "Total Liabilities",
        group: "column",
        data: totalLiabilitiesArray,
        style: {
          colors: [chartColors.grey],
        },
      },
      {
        name: "Net Position",
        group: "column",
        data: netPositionArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
    ],
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColor,
          fontSize: "1.5rem",
        },
      },
    },
    title: {
      text: "Financial Position Analysis: Assets, Liabiliites, and Net Position",
      position: "top",
      align: "center",
      style: {
        fontSize: "20px",
        color: chartColor,
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
      y: {
        formatter: tooltipFormatter,
      },
    },
    legend: {
      horizontalAlign: "center",
      offsetX: 40,
      fontSize: "20px",
      color: chartColor,
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

const getAtlChartOptions = (data) => {
  const clientArray = new Array();
  const peerArray = new Array();
  const benchmarkArray = new Array();

  const selectedYearsArray = getSelectedYearsFromLocalStorage();
  const totalAssetsClient = data["totalAssets_Client"];
  const totalLiabilitiesClient = data["totalLiabilities_Client"];

  const totalAssetsPeer = data["totalAssets_Peer"];
  const totalLiabilitiesPeer = data["totalLiabilities_Peer"];

  // console.log ({
  //   totalAssetsClient,
  //   totalLiabilitiesClient,
  //   totalAssetsPeer,
  //   totalLiabilitiesPeer,
  // });

  selectedYearsArray.forEach((year) => {
    clientValue =
      Number(totalAssetsClient[year].value) /
      Number(totalLiabilitiesClient[year].value);
    clientArray.push(clientValue.toFixed(2));

    peerValue =
      getAverageOfArray(totalAssetsPeer[year]) /
      getAverageOfArray(totalLiabilitiesPeer[year]);
    peerArray.push(peerValue.toFixed(2));
    benchmarkArray.push(1);
  });

  const minNum = Math.min(...clientArray, ...peerArray, ...benchmarkArray);
  const maxNum = Math.max(...clientArray, ...peerArray, ...benchmarkArray);
  // console.log ({minNum, maxNum});

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

  // console.log ({clientArray, peerArray, benchmarkArray});

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.black,
    ],
    series: [
      {
        name: clientName,
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: "Peer Avg",
        data: peerArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: "Benchmark",
        data: benchmarkArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
    ],
    chart: {
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 450,
      width: "100%",
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      curve: "straight",
    },
    title: {
      text: "Asset to Liability Ratio",
      align: "top",
      style: {
        color: chartColor,
      },
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1.5rem",
        },
      },
    },
    yaxis: {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: chartColor,
      },
      labels: {
        formatter: (value) => Math.round(value),
        style: {
          colors: chartColor,
          fontSize: "1.25rem",
        },
      },
      tooltip: {
        enabled: true,
      },
      stepSize: 5,
    },
    tooltip: {
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

const getSourcesOfIncomeClientChartOptions = (data) => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  // console.log({ data });

  const tuitionValue = Number(
    data["si_revenueTuitionAndFees_Client"][selectedYearsArray[0]].value
  );
  const auxiliaryValue = Number(
    data["si_revenueAuxiliaryActivities_Client"][selectedYearsArray[0]].value
  );
  const contributionsValue =
    Number(
      data["si_revenueContributions_Client"][selectedYearsArray[0]].value
    ) +
    Number(
      data["si_revenueContributionsLargeOneTimeGifts_Client"][
        selectedYearsArray[0]
      ].value
    );
  const investmentsValue = Number(
    data["si_revenueInvestmentIncome_Client"][selectedYearsArray[0]].value
  );
  const otherValue =
    Number(data["si_revenueOther_Client"][selectedYearsArray[0]].value) +
    Number(
      data["si_revenueEndowmentSpendingAppropriation_Client"][
        selectedYearsArray[0]
      ].value
    );

  // console.log({
  //   tuitionValue,
  //   auxiliaryValue,
  //   contributionsValue,
  //   investmentsValue,
  //   otherValue,
  // });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#1f2937",
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#ffffff",
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

  const chartData = [
    tuitionValue,
    auxiliaryValue,
    contributionsValue,
    investmentsValue,
    otherValue,
  ];

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.grey,
      window.chartColors.red,
      window.chartColors.orange,
    ],
    series: chartData,
    chart: {
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 450,
      type: "pie",
    },
    labels: ["Tuition", "Auxiliary", "Contributions", "Investments", "Other"],
    title: {
      text: "Sources of Income",
      align: "top",
      style: {
        color: chartColor,
        fontSize: "20px",
      },
    },
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: chartColor,
        },
      },
    },
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: "center",
      position: "bottom",
      fontSize: "20px",
    },
  };
};

const getSourcesOfIncomePeerChartOptions = (data) => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const tuitionValue = getAverageOfArray(
    data["revenueTuitionAndFees_Peer"][selectedYearsArray[0]]
  );
  const auxiliaryValue = getAverageOfArray(
    data["revenueAuxiliaryActivities_Peer"][selectedYearsArray[0]]
  );
  const contributionsValue = getAverageOfArray(
    data["revenueContributions_Peer"][selectedYearsArray[0]]
  );
  const investmentsValue = getAverageOfArray(
    data["revenueInvestmentIncome_Peer"][selectedYearsArray[0]]
  );
  const otherValue = getAverageOfArray(
    data["revenueOther_Peer"][selectedYearsArray[0]]
  );

  // console.log ({
  //   tuitionValue,
  //   auxiliaryValue,
  //   contributionsValue,
  //   investmentsValue,
  //   otherValue,
  // });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#1f2937",
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#ffffff",
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

  // console.log ({clientArray, peerArray, benchmarkArray});

  const chartData = [
    tuitionValue,
    auxiliaryValue,
    contributionsValue,
    investmentsValue,
    otherValue,
  ];

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.grey,
      window.chartColors.red,
      window.chartColors.orange,
    ],
    series: chartData,
    chart: {
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 450,
      width: "100%",
      type: "pie",
    },
    labels: ["Tuition", "Auxiliary", "Contributions", "Investments", "Other"],
    title: {
      text: "Peer Average Sources of Income",
      align: "top",
      style: {
        color: chartColor,
        fontSize: "20px",
      },
    },
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: chartColor,
        },
      },
    },
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: "center",
      position: "bottom",
      fontSize: "20px",
    },
  };
};

const getFfaChartOptions = (data) => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage();
  currentYear = selectedYearsArray[selectedYearsArray.length - 1];

  const revenueTuitionAndFeesClient = Number(
    data["ffa_revenueTuitionAndFees_Client"][currentYear].value
  );
  const revenueSchoolServicesClient = Number(
    data["ffa_revenueScholarshipsAndFinancialAid_Client"][currentYear].value
  );
  const ScholarshipAndFinancialAidClient =
    revenueTuitionAndFeesClient + revenueSchoolServicesClient;

  const totalRevenueContributionsClient = Number(
    data["ffa_totalRevenueContributions_Client"][currentYear].value
  );
  const unrestrictedGiftsClient =
    ScholarshipAndFinancialAidClient + totalRevenueContributionsClient;

  const revenueAuxiliaryActivitiesClient = Number(
    data["ffa_revenueAuxiliaryActivities_Client"][currentYear].value
  );
  const revenueOtherClient = Number(
    data["ffa_revenueOther_Client"][currentYear].value
  );

  const auxiliaryAndOtherClient =
    unrestrictedGiftsClient +
    revenueAuxiliaryActivitiesClient +
    revenueOtherClient;

  const changeInNetAssetsWithDRClient = Number(
    data["ffa_changeInNetAssetsWithDR_Client"][currentYear].value
  );
  const netChangeRestrictedInPerpetuityClient = Number(
    data["ffa_netChangeRestrictedInPerpetuity_Client"][currentYear].value
  );

  const restrictedGiftsClient =
    auxiliaryAndOtherClient +
    (changeInNetAssetsWithDRClient + netChangeRestrictedInPerpetuityClient);

  const employeeBenefitsClient = Number(
    data["ffa_employeeBenefits_Client"][currentYear].value
  );
  const salariesAndWagesClient = Number(
    data["ffa_salariesAndWages_Client"][currentYear].value
  );

  const compensationAndBenefitsClient =
    restrictedGiftsClient - (salariesAndWagesClient + employeeBenefitsClient);

  const servicesSuppliesOtherClient = Number(
    data["ffa_servicesSuppliesOther_Client"][currentYear].value
  );
  const occupancyUtilitiesAndMaintenanceClient = Number(
    data["ffa_occupancyUtilitiesAndMaintenance_Client"][currentYear].value
  );
  const incomeExpenseSurplusDefecitClient = Number(
    data["ffa_incomeExpenseSurplusDefecit_Client"][currentYear].value
  );
  const interestClient = Number(data["ffa_interest_Client"][currentYear].value);

  const generalExpenseClient =
    compensationAndBenefitsClient -
    (servicesSuppliesOtherClient +
      occupancyUtilitiesAndMaintenanceClient +
      incomeExpenseSurplusDefecitClient +
      interestClient);

  const surplusDefecitClient = 0 + generalExpenseClient;

  const surplusDefecitColor =
    surplusDefecitClient > 0
      ? window.chartColors.green
      : window.chartColors.red;
  const surplusDefecitLabel = surplusDefecitClient > 0 ? "Surplus" : "Deficit";

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#F3F4F6",
        labelColor: "#ffffff",
        opacityFrom: 0.45,
        opacityTo: 0,
      }
    : {
        borderColor: "#374151",
        labelColor: "#1d2a46",
        opacityFrom: 0,
        opacityTo: 0.15,
      };

  const chartColor = document.documentElement.classList.contains("dark")
    ? "#e3f0fa"
    : "#3a464f";

  const formatNumber = (value) => value.toLocaleString();

  const yaxisLabelFormatter = (value) => {
    // return `$${formatNumber(value)}`;
    return `${value / 1000000}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    return `$${formattedValue}`;
  };

  // console.log ({clientArray, peerArray, benchmarkArray});

  return {
    series: [
      {
        data: [
          {
            x: "Tuition & Fees",
            y: [0, revenueTuitionAndFeesClient],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Scholarship & Financial Aid",
            y: [revenueTuitionAndFeesClient, ScholarshipAndFinancialAidClient],
            fillColor: window.chartColors.yellow,
          },
          {
            x: "Unrestricted Gifts",
            y: [ScholarshipAndFinancialAidClient, unrestrictedGiftsClient],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Auxiliary & Other",
            y: [unrestrictedGiftsClient, auxiliaryAndOtherClient],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Gifts & Other Restricted",
            y: [auxiliaryAndOtherClient, restrictedGiftsClient],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Compensation & Benefits",
            y: [restrictedGiftsClient, compensationAndBenefitsClient],
            fillColor: window.chartColors.yellow,
          },
          {
            x: "General Expense",
            y: [compensationAndBenefitsClient, generalExpenseClient],
            fillColor: window.chartColors.yellow,
          },
          {
            x: surplusDefecitLabel,
            y: [0, surplusDefecitClient],
            fillColor: surplusDefecitColor,
          },
        ],
      },
    ],
    chart: {
      id: "FinancialPosition",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 500,
      width: "100%",
      type: "rangeBar",
    },
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    title: {
      text: "Financial Flow Analysis: Overview of Income and Expenses",
      position: "top",
      align: "center",
      style: {
        fontSize: "20px",
        color: chartColor,
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1rem",
        },
        rotate: -45, // Adjust the rotation angle as needed
        minHeight: 150,
        offsetY: 5,
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
    legend: {
      horizontalAlign: "center",
      position: "top",
      fontSize: "20px",
    },
  };
};

const getCashFlowTrendChartOptions = (data) => {
  // console.log(data);

  const financeData = data["cft_FinancingActivities_Client"];
  const investingData = data["cft_InvestingActivities_Client"];
  const operatingData = data["cft_OperatingActivities_Client"];
  const totalData = data["cft_TotalActivities_Client"];

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const seriesData = selectedYearsArray.map((year) => {
    const operatingVal = Number(operatingData[year]?.value) || 0;
    const investingVal = Number(investingData[year]?.value) || 0;
    const financeVal = Number(financeData[year]?.value) || 0;
    const totalVal = Number(totalData[year]?.value) || 0;

    const chartData = [operatingVal, investingVal, financeVal, totalVal];

    return {
      name: year.toString(),
      data: chartData,
    };
  });

  const tableHeaderRow = document.getElementById(
    "row_cashFlowTrend_tableHeader"
  );
  const operatingRow = document.getElementById("row_cashFlowTrend_operating");
  const investingRow = document.getElementById("row_cashFlowTrend_investing");
  const financingRow = document.getElementById("row_cashFlowTrend_financing");
  const totalRow = document.getElementById("row_cashFlowTrend_total");

  // Clear existing table content before appending
  tableHeaderRow.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Client</th>`;
  operatingRow.innerHTML = `<th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Operating</th>`;
  investingRow.innerHTML = `<th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Investing</th>`;
  financingRow.innerHTML = `<th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Financing</th>`;
  totalRow.innerHTML = `<th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Total</th>`;

  // Loop through selected years and populate the table
  selectedYearsArray.forEach((year, index) => {
    const operatingValue = `${formatCurrency(operatingData[year]?.value)}`;
    const investingValue = `${formatCurrency(investingData[year]?.value)}`;
    const financingValue = `${formatCurrency(financeData[year]?.value)}`;
    const totalValue = `${formatCurrency(totalData[year]?.value)}`;

    // Add year to table header
    tableHeaderRow.innerHTML += `
    <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
  `;

    // Add corresponding operating data
    operatingRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${
        operatingData[year]?.value ? operatingValue : "-"
      } <!-- Fallback in case data is missing -->
    </th>
  `;

    // Add corresponding investing data
    investingRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${
        investingData[year]?.value ? investingValue : "-"
      } <!-- Fallback in case data is missing -->
    </th>
  `;

    // Add corresponding financing data
    financingRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${
        financeData[year]?.value ? financingValue : "-"
      } <!-- Fallback in case data is missing -->
    </th>
  `;

    // Add corresponding total data
    totalRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${
        totalData[index] ? totalValue : "-"
      } <!-- Fallback in case data is missing -->
    </th>
  `;
  });

  // console.log(seriesData);

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
    if (value >= 1000000 || value <= -1000000) {
      return `$${Math.round(value / 1000000)}M`;
    }
    return `$${formatNumber(value)}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    return `$${formattedValue}`;
  };

  return {
    colors: ["#3E859C", "#D58611", "#8F1F2B", "#608827"],
    series: seriesData,
    chart: {
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Cash Flows Trend",
      position: "top",
      align: "center",
      style: {
        fontSize: "20px",
      },
    },
    xaxis: {
      categories: ["Operating", "Investing", "Financing", "Total"],
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1rem",
        },
      },
      position: "top",
    },
    yaxis: {
      // stepSize: yaxisTickStepSize,
      tickAmount: 6,
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
      position: "bottom",
      fontSize: "20px",
      showForSingleSeries: true,
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

const getCurrentRatioChartOptions = (data) => {
  // console.log({ chartData: data });

  const firstKey = Object.keys(data)[0];
  const yearsDataCurrentRatio_Array = Object.keys(data[firstKey]);
  // Filter out keys not in yearsDataCurrentRatio_Array
  Object.keys(data.currentRatio_Peer).forEach((key) => {
    if (!yearsDataCurrentRatio_Array.includes(key)) {
      delete data.currentRatio_Peer[key];
    }
  });

  const cashAndCashEquivalentsArray = Object.values(
    data["cashAndCashEquivalents_Client"]
  ).map((item) => Number(item.value));
  const accountsReceivableArray = Object.values(
    data["accountsReceivable_Client"]
  ).map((item) => Number(item.value));
  const studentLoansAndOtherReceivablesArray = Object.values(
    data["studentLoansAndOtherReceivables_Client"]
  ).map((item) => Number(item.value));
  const contributionsReceivableArray = Object.values(
    data["contributionsReceivable_Client"]
  ).map((item) => Number(item.value));
  const prepaidExpensesArray = Object.values(
    data["prepaidExpensesAndOtherAssets_Client"]
  ).map((item) => Number(item.value));
  const currentAssetsArray = cashAndCashEquivalentsArray.map(
    (_, index) =>
      cashAndCashEquivalentsArray[index] +
      accountsReceivableArray[index] +
      studentLoansAndOtherReceivablesArray[index] +
      contributionsReceivableArray[index] +
      prepaidExpensesArray[index]
  );

  const accountsPayableArray = Object.values(
    data["accountsPayable_Client"]
  ).map((item) => Number(item.value));
  const deferredRevenueArray = Object.values(
    data["deferredRevenue_Client"]
  ).map((item) => Number(item.value));
  const postRetirementBenefitObligationsArray = Object.values(
    data["postRetirementHealthBenefits_Client"]
  ).map((item) => Number(item.value));

  const annuityObligationsArray = Object.values(
    data["annuityObligations_Client"]
  ).map((item) => Number(item.value));
  const otherLiabilitiesArray = Object.values(
    data["deferredRevenue_Client"]
  ).map((item) => Number(item.value));

  const currentLiabilitiesArray = accountsPayableArray.map(
    (_, index) =>
      accountsPayableArray[index] +
      deferredRevenueArray[index] +
      postRetirementBenefitObligationsArray[index] +
      annuityObligationsArray[index] +
      otherLiabilitiesArray[index]
  );

  const currentRatioArray = currentAssetsArray.map((asset, index) => {
    const liability = currentLiabilitiesArray[index];
    const ratio = asset / liability;

    return liability !== 0 ? ratio.toFixed(1) : 0; // Avoid division by zero
  });

  const peerAvgCurrentRatioArray = Object.keys(data.currentRatio_Peer).map(
    (key) => {
      const values = data.currentRatio_Peer[key];
      const avg = getAverageOfArray(values);

      return avg.toFixed(1);
    }
  );

  const peerAvgCurrentAssetsArray = Object.keys(data.currentAssets_Peer).map(
    (key) => {
      const values = data.currentAssets_Peer[key];
      const avg = getAverageOfArray(values);

      return avg.toFixed(1);
    }
  );

  const peerAvgCurrentLiabilitiesArray = Object.keys(
    data.currentLiabilities_Peer
  ).map((key) => {
    const values = data.currentLiabilities_Peer[key];
    const avg = getAverageOfArray(values);

    return avg.toFixed(1);
  });

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  // Clear and populate the current ratio client table
  const tableHeaderClient = document.getElementById(
    "row_currentRatio_tableHeader"
  );
  const ratioRow = document.getElementById("row_currentRatio_ratio");
  const currentAssetsRow = document.getElementById(
    "row_currentRatio_currentAssets"
  );
  const cashCashEquivalentsRow = document.getElementById(
    "row_currentRatio_cashCashEquivalents"
  );
  const accountsReceivableRow = document.getElementById(
    "row_currentRatio_accountsReceivable"
  );
  const studentLoansRow = document.getElementById(
    "row_currentRatio_studentLoansAndOtherReceivables"
  );
  const contributionsReceivableRow = document.getElementById(
    "row_currentRatio_contributionsReceivable"
  );
  const prepaidExpensesRow = document.getElementById(
    "row_currentRatio_prepaidExpensesAndOtherAssets"
  );
  const currentLiabilitiesRow = document.getElementById(
    "row_currentRatio_currentLiabilities"
  );
  const accountsPayableRow = document.getElementById(
    "row_currentRatio_accountsPayableAndAccruedLiabilities"
  );
  const deferredRevenueRow = document.getElementById(
    "row_currentRatio_deferredRevenue"
  );
  const postRetirementBenefitObligationsRow = document.getElementById(
    "row_currentRatio_postRetirementBenefits"
  );
  const annuityObligationsRow = document.getElementById(
    "row_currentRatio_AnnuityObligations"
  );
  const otherLiabilitiesRow = document.getElementById(
    "row_currentRatio_otherLiabilities"
  );
  const tableHeaderPeer = document.getElementById(
    "row_currentRatioPeer_tableHeader"
  );
  const peerAvgCurrentRatioRow = document.getElementById(
    "row_currentRatioPeer_ratio"
  );
  const peerAvgCurrentAssetsRow = document.getElementById(
    "row_currentRatioPeer_currentAssets"
  );
  const peerAvgCurrentLiabilitiesRow = document.getElementById(
    "row_currentRatioPeer_currentLiabilities"
  );

  // Clear existing content before appending
  tableHeaderClient.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Client</th>`;
  ratioRow.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Current Ratio</th>`;
  currentAssetsRow.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Current Assets</th>`;
  cashCashEquivalentsRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Cash and Cash Equivalents</th>`;
  accountsReceivableRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Accounts Receivable</th>`;
  studentLoansRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Student Loans and Other Receivables</th>`;
  contributionsReceivableRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Contributions Receivable</th>`;
  prepaidExpensesRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Prepaid Expenses and Other Assets</th>`;
  currentLiabilitiesRow.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Current Liabilities</th>`;
  accountsPayableRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Accounts Payable and Accrued Liabilities</th>`;
  deferredRevenueRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Deferred Revenue</th>`;
  postRetirementBenefitObligationsRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Post Retirement Benefit Obligations</th>`;
  annuityObligationsRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Annuity Obligations</th>`;
  otherLiabilitiesRow.innerHTML = `<th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">Other Liabilities</th>`;
  tableHeaderPeer.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Peer</th>`;
  peerAvgCurrentRatioRow.innerHTML = `<th scope="col" class="px-6 py-3 text-lg tracking-wide">Current Ratio</th>`;
  peerAvgCurrentAssetsRow.innerHTML = `<th scope="col" class="px-6 py-3 text-lg tracking-wide">Current Assets</th>`;
  peerAvgCurrentLiabilitiesRow.innerHTML = `<th scope="col" class="px-6 py-3 text-lg tracking-wide">Current Liabilities</th>`;

  // Loop through and populate data for each selected year
  selectedYearsArray.forEach((year, index) => {
    // Add year to table header
    tableHeaderClient.innerHTML += `
    <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
    `;
    tableHeaderPeer.innerHTML += `
    <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
    `;

    // Populate ratio row
    ratioRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${currentRatioArray[index] || "-"}
    </th>
  `;

    // Populate current assets row
    currentAssetsRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-extrabold text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(currentAssetsArray[index])}
    </th>
  `;

    // Populate cash and cash equivalents row
    cashCashEquivalentsRow.innerHTML += `
    <th scope="row" class="px-8 py-2 font-extrabold text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(cashAndCashEquivalentsArray[index])}
    </th>
  `;

    // Populate accounts receivable row
    accountsReceivableRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(accountsReceivableArray[index])}
    </th>
  `;

    // Populate student loans and other receivables row
    studentLoansRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(studentLoansAndOtherReceivablesArray[index])}
    </th>
  `;

    // Populate contributions receivable row
    contributionsReceivableRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(contributionsReceivableArray[index])}
    </th>
  `;

    // Populate prepaid expenses row
    prepaidExpensesRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(prepaidExpensesArray[index])}
    </th>
  `;

    // Populate current liabilities row
    currentLiabilitiesRow.innerHTML += `
    <th scope="row" class="px-6 py-2 font-extrabold text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(currentLiabilitiesArray[index])}
    </th>
  `;

    // Populate accounts payable row
    accountsPayableRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(accountsPayableArray[index])}
    </th>
  `;

    // Populate deferred revenue row
    deferredRevenueRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(deferredRevenueArray[index])}
    </th>
  `;

    // populate post retirement benefit obligations row
    postRetirementBenefitObligationsRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(postRetirementBenefitObligationsArray[index])}
    </th>
    `;

    // populate annuity obligations row
    annuityObligationsRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(annuityObligationsArray[index])}
    </th>
    `;

    // populate other liabilities row
    otherLiabilitiesRow.innerHTML += `
    <th scope="row" class="px-8 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(otherLiabilitiesArray[index])}
    </th>
    `;

    // Populate peer average client ratio row
    peerAvgCurrentRatioRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${peerAvgCurrentRatioArray[index] || "-"}
    </th>
  `;

    // Populate peer average current assets row
    peerAvgCurrentAssetsRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(peerAvgCurrentAssetsArray[index])}
      </th>
    `;

    // Populate peer average current liabilities row
    peerAvgCurrentLiabilitiesRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(peerAvgCurrentLiabilitiesArray[index])}
      </th>
    `;
  });

  const formatNumber = (value) => value.toLocaleString();

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#3A464F",
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

  const yaxisLabelFormatter = (value) => {
    if (value >= 1000000) {
      return `${Math.round(value / 1000000)}M`;
    }
    return `${formatNumber(value)}`;
  };
  const yaxisLabelFormatter2 = (value) => {
    return `${Math.round(value)}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    let formattedValue = value.toLocaleString();
    if (formattedValue.length === 1) formattedValue += ".0";

    if (value < 10) {
      return `${formattedValue}`;
    } else {
      return `$${formattedValue}`;
    }
  };

  // console.log({mainName, benchmark});

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.red,
      window.chartColors.blue,
      window.chartColors.grey,
    ],
    series: [
      {
        name: "Current Assets",
        type: "column",
        data: currentAssetsArray,
      },
      {
        name: "Current Liabilities",
        type: "column",
        data: currentLiabilitiesArray,
      },
      {
        name: "Current Ratio",
        type: "line",
        data: currentRatioArray,
      },
      {
        name: "Peer Avg",
        type: "line",
        data: peerAvgCurrentRatioArray,
      },
    ],
    chart: {
      height: 550,
      type: "line",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    title: {
      text: "Current Ratio",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColor,
        fontSize: "1.5rem",
      },
    },
    yaxis: [
      {
        axisBorder: {
          show: true,
          color: window.chartColors.green,
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: window.chartColors.green,
            fontSize: "1.25rem",
          },
        },
        // title: {
        //   text: "Assets",
        //   style: {
        //     color: window.chartColors.green,
        //   },
        // }
      },
      {
        show: false,
        // opposite: true,
        // axisBorder: {
        //   show: false,
        //   color: window.chartColors.red,
        // },
        // labels: {
        //   formatter: yaxisLabelFormatter,
        //   style: {
        //     colors: window.chartColors.red,
        //     fontSize: "1.25rem",
        //   },
        // },
        // title: {
        //   text: "Liabilities",
        //   style: {
        //     color: window.chartColors.red,
        //   },
        // }
      },
      {
        opposite: true,
        stepSize: 1,
        axisBorder: {
          show: true,
          color: chartColor,
        },
        labels: {
          formatter: yaxisLabelFormatter2,
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        },
        // title: {
        //   text: "Ratio",
        //   style: {
        //     color: chartColor,
        //   },
        // }
      },
    ],
    xaxis: {
      categories: yearsDataCurrentRatio_Array.sort((a, b) => a - b),
      labels: {
        style: {
          colors: chartColor,
          fontSize: "1.5rem",
        },
      },
    },
    legend: {
      position: "top",
      fontSize: "20px",
      offsetY: -10,
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

const getLiquidityChartOptions = (data) => {
  // console.log({ chartData: data });

  const firstKey = Object.keys(data)[0];
  const yearsDataLiquidity_Array = Object.keys(data[firstKey]);
  // Filter out keys not in yearsDataLiquidity_Array
  Object.keys(data.liquidity_Peer).forEach((key) => {
    if (!yearsDataLiquidity_Array.includes(key)) {
      delete data.liquidity_Peer[key];
    }
  });

  const liquidityClientArray = Object.values(data["fasbLiquidity_Client"]).map(
    (item) => Number(item.value)
  );
  const accountsReceivableArray = Object.values(
    data["quasiEndowment_Client"]
  ).map((item) => Number(item.value));
  const studentLoansAndOtherReceivablesArray = Object.values(
    data["lineOfCredit_Client"]
  ).map((item) => Number(item.value));

  // getAverageOfArray

  const peerAvgArray = Object.keys(data.liquidity_Peer).map((key) => {
    const values = data.liquidity_Peer[key];
    const avg = getAverageOfArray(values);

    return avg.toFixed(1);
  });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#3A464F",
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
  // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 })

  const yaxisLabelFormatter = (value) => {
    return `$${formatNumber(value)}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    let formattedValue = value.toLocaleString();
    if (formattedValue.length === 1) formattedValue += ".0";

    if (value < 10) {
      return `${formattedValue}`;
    } else {
      return `$${formattedValue}`;
    }
  };

  // console.log({mainName, benchmark});

  return {
    colors: ["#003366", "#66B2FF", "#66CCCC", "#FFAD5C"],
    series: [
      {
        name: "FASB Liquidity",
        group: "column",
        data: liquidityClientArray,
      },
      {
        name: "Quasi Endowment",
        group: "column",
        data: accountsReceivableArray,
      },
      {
        name: "Line of Credit Available",
        group: "column",
        data: studentLoansAndOtherReceivablesArray,
      },
      {
        name: "Peer Average",
        type: "bar",
        data: peerAvgArray,
      },
    ],
    chart: {
      height: 450,
      type: "bar",
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1.5rem",
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
      y: {
        formatter: tooltipFormatter,
      },
    },
    title: {
      text: "CapinCrouse Liquidity",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColor,
        fontSize: "1.5rem",
      },
    },
    legend: {
      position: "top",
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
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shade: 'light',
    //     type: "verticle",
    //     shadeIntensity: 0.5,
    //     inverseColors: true,
    //     opacityFrom: [0.2, 0.4, 0.6],
    //     opacityTo: 1,
    //   }
    // }
  };
};

const getSalariesAndBenefitsToTotalExpenseChartOptions = (data) => {
  // console.log({ data });

  // Get number for chart
  const mostRecentYear = Math.max(
    ...Object.keys(data["salariesAndBenefitsToTotalExpense_Client"])
  );

  const salariesAndBenefitsToTotalExpense = Number(
    data["salariesAndBenefitsToTotalExpense_Client"][mostRecentYear].value
  );
  const clientPercent = Math.round(salariesAndBenefitsToTotalExpense * 100);

  // Salaries and Benefits
  const salariesAndWages = Number(
    data["salariesAndWages_Client"][mostRecentYear].value
  );
  const employeeBenefits = Number(
    data["employeeBenefits_Client"][mostRecentYear].value
  );
  const salariesAndBenefits = salariesAndWages + employeeBenefits;

  // Total Expenses
  const totalExpenses = Number(
    data["totalFunctionalExpenses_Client"][mostRecentYear].value
  );

  // numbers for data table
  const tableHeaderRow = document.getElementById(
    "row_salariesBenefitsToTotalExpense_tableHeader"
  );
  const salariesBenefitsToTotalExpenseRow = document.getElementById(
    "row_salariesBenefitsToTotalExpense_main"
  );
  const salariesAndBenefitsRow = document.getElementById(
    "row_salariesBenefitsToTotalExpense_salariesBenefits"
  );
  const totalExpensesRow = document.getElementById(
    "row_salariesBenefitsToTotalExpense_totalExpenses"
  );

  // Clear existing content before appending
  tableHeaderRow.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Client</th>`;
  salariesBenefitsToTotalExpenseRow.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Salaries & Benefits to Total Expense</th>`;
  salariesAndBenefitsRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Salaries & Benefits</th>`;
  totalExpensesRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Total Expenses</th>`;

  // Add year to table header
  tableHeaderRow.innerHTML += `
    <th scope="col" class="px-6 py-3 text-lg tracking-wide">${mostRecentYear}</th>
  `;
  // Populate salaries and benefits to total expense row
  salariesBenefitsToTotalExpenseRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${clientPercent}%
    </th>
  `;
  // Populate salaries and benefits row
  salariesAndBenefitsRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(salariesAndBenefits)}
    </th>
  `;
  // Populate total expenses row
  totalExpensesRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(totalExpenses)}
    </th>
  `;

  // console.log({ clientPercent });

  const chartColor =
    clientPercent <= 60
      ? window.chartColors.green
      : clientPercent <= 80
      ? window.chartColors.orange
      : window.chartColors.red;

  // console.log({ chartColor });

  const textArray = [
    "Current Ratio Exceeds Target Goal: Reduce to below 70%",
    "Current Ratio Far Exceeds Target Goal: Reduce to below 70%",
    "Current Ratio is within Target Goal: below 70%",
  ];

  const textLabel =
    clientPercent <= 60
      ? textArray[2]
      : clientPercent <= 80
      ? textArray[0]
      : textArray[1];

  return {
    series: [clientPercent],
    chart: {
      height: 350,
      type: "radialBar",
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: "16px",
            color: chartColor,
            offsetY: 120,
          },
          value: {
            fontSize: "100px",
            fontWeight: "700",
            color: chartColor,
            formatter: function (val) {
              return val + "%";
            },
            offsetY: -10,
          },
        },
      },
    },
    fill: {
      colors: [chartColor],
    },
    stroke: {
      dashArray: 4,
      style: {
        color: chartColor,
      },
    },
    labels: [textLabel],
  };
};

const getAverageEmployeeSalaryChartOptions = (data) => {
  // console.log({ data });

  const namesArray = [
    "president",
    "chiefAcademic",
    "chiefFinance",
    "chiefEnrollment",
    "chiefDevelopment",
    "chiefOps",
    "dirFinance",
    "dirHr",
    "dirIt",
    "dirPhysPlant",
    "controller",
    "busMgr",
    "bursar",
    "budgetDir",
    "dirAcct",
    "srAcct",
    "nonSrAcct",
    "stuAcctMgr",
    "otherBusOffice",
    "adminAsst",
  ];

  const axisNameArray = [
    "President",
    "Chief Academic Officer",
    "Chief Financial Officer",
    "Chief Enrollment Officer",
    "Chief Development Officer",
    "Chief Operations Officer",
    "Director of Financial Aid",
    "Director of HR",
    "Director of IT",
    "Director of Physical Plant",
    "Controller",
    "Business Manager",
    "Bursar",
    "Budget Director",
    "Director of Accounting",
    "Senior Accountant",
    "Non Senior Accountant",
    "Student Accounts Manager",
    "Other Business Office Staff",
    "Admin Assistant",
  ];

  let clientArray = [];
  let peerArray = [];

  const mostRecentYear = Math.max(...Object.keys(data["adminAsst_Client"]));

  namesArray.map((name, index) => {
    const peerData = data[`${name}_Peer`][mostRecentYear];
    const peerAvg = getAverageOfArray(peerData);
    peerArray.push(peerAvg);

    const clientData = Number(data[`${name}_Client`][mostRecentYear].value);
    // clientArray.push(Math.round(clientData));
    clientArray.push(index % 2 === 0 ? peerAvg + 1000 : peerAvg + 4000);
  });

  function createArrayObjectForAvgEmployeeSalary(
    axisNameArray,
    clientArray,
    peerArray
  ) {
    return axisNameArray.map((name, index) => ({
      x: name,
      y: clientArray[index],
      goals: [
        {
          name: "Expected",
          value: peerArray[index],
          strokeWidth: 5,
          strokeHeight: 10,
          strokeColor: window.chartColors.green,
        },
      ],
    }));
  }

  const seriesData = createArrayObjectForAvgEmployeeSalary(
    axisNameArray,
    clientArray,
    peerArray
  );

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#3A464F",
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

  // console.log({ seriesData });

  return {
    series: [
      {
        name: "Actual",
        data: seriesData,
      },
    ],
    chart: {
      height: 750,
      width: "90%",
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: [window.chartColors.blue],
    dataLabels: {
      formatter: function (val, opt) {},
    },
    title: {
      text: "Average Employee Salary",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColor,
        fontSize: "1.5rem",
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: "top",
      customLegendItems: ["Client", "Peer"],
      markers: {
        fillColors: [window.chartColors.blue, window.chartColors.green],
      },
    },
    yaxis: {
      labels: {
        align: "right",
        style: {
          colors: chartColor,
          fontSize: "1rem",
          fontWeight: "600",
        },
        maxWidth: 650,
        offsetX: 10,
      },
      stepSize: 50,
    },
    xaxis: {
      labels: {
        style: {
          colors: chartColor,
          fontSize: "1.5rem",
        },
        formatter: function (val) {
          const num = parseInt(val, 10);
          if (isNaN(num)) {
            return "Invalid input";
          }
          if (num >= 1000) {
            return `${Math.floor(num / 1000)}k`;
          }
          return val;
        },
      },
    },
  };
};

const getSalariesAndBenefitsPerNetTuitionChartOptions = (data) => {
  // console.log({ data });

  const mostRecentYear = Math.max(
    ...Object.keys(data["employeeBenefits_Client"])
  );

  const num = Number(
    data["salariesAndBenefitsPerNetTuition_Client"][mostRecentYear].value
  );
  const clientPercent = Math.round(num * 100);

  // Salaries and Benefits
  const salariesAndWages = Number(
    data["salariesAndWages_Client"][mostRecentYear].value
  );
  const employeeBenefits = Number(
    data["employeeBenefits_Client"][mostRecentYear].value
  );
  const salariesAndBenefits = salariesAndWages + employeeBenefits;

  // Net Tuition
  const netTuitionAndFees = Number(
    data["netTuitionAndFees_Client"][mostRecentYear].value
  );

  // numbers for data table
  const tableHeaderRow = document.getElementById(
    "row_salariesBenefitsPerNetTuition_tableHeader"
  );
  const salariesBenefitsPerNetTuitionRow = document.getElementById(
    "row_salariesBenefitsPerNetTuition_main"
  );
  const salariesAndBenefitsRow = document.getElementById(
    "row_salariesBenefitsPerNetTuition_salariesBenefits"
  );
  const netTuitionRow = document.getElementById(
    "row_salariesBenefitsPerNetTuition_netTuitionRevenue"
  );

  // Clear existing content before appending
  tableHeaderRow.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Client</th>`;
  salariesBenefitsPerNetTuitionRow.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Salaries & Benefits to Total Expense</th>`;
  salariesAndBenefitsRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Salaries & Benefits</th>`;
  netTuitionRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Total Net Tuition</th>`;

  // Add year to table header
  tableHeaderRow.innerHTML += `
    <th scope="col" class="px-6 py-3 text-lg tracking-wide">${mostRecentYear}</th>
  `;
  // Populate salaries and benefits to total expense row
  salariesBenefitsPerNetTuitionRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${clientPercent}%
    </th>
  `;
  // Populate salaries and benefits row
  salariesAndBenefitsRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(salariesAndBenefits)}
    </th>
  `;
  // Populate total expenses row
  netTuitionRow.innerHTML += `
    <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
      ${formatCurrency(netTuitionAndFees)}
    </th>
  `;

  // console.log({ mostRecentYear, numerator, denominator, clientPercent });

  const chartColor =
    clientPercent <= 60
      ? window.chartColors.green
      : clientPercent <= 80
      ? window.chartColors.orange
      : window.chartColors.red;

  // console.log({ chartColor });

  const textArray = [
    "Current Ratio Exceeds Target Goal: Reduce to below 70%",
    "Current Ratio Far Exceeds Target Goal: Reduce to below 70%",
    "Current Ratio is within Target Goal: below 70%",
  ];

  const textLabel =
    clientPercent <= 60
      ? textArray[2]
      : clientPercent <= 80
      ? textArray[0]
      : textArray[1];

  return {
    series: [clientPercent],
    chart: {
      height: 350,
      type: "radialBar",
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: "16px",
            color: chartColor,
            offsetY: 120,
          },
          value: {
            fontSize: "100px",
            fontWeight: "700",
            color: chartColor,
            formatter: function (val) {
              return val + "%";
            },
            offsetY: -10,
          },
        },
      },
    },
    fill: {
      colors: [chartColor],
    },
    stroke: {
      dashArray: 4,
      style: {
        color: chartColor,
      },
    },
    labels: [textLabel],
  };
};

const getAdminCostsPerStudentChartOptions = (data) => {
  console.log({ data });

  const mostRecentYear = Math.max(...Object.keys(data["healthAdminAsst_Peer"]));

  const selectedYearsArray = getSelectedYearsFromLocalStorage();
  let clientArray = [];
  let peerAvgArray = [];
  let peer25Array = [];
  let peer50Array = [];
  let peer75Array = [];
  let peerArray = [];

  selectedYearsArray.map((year) => {
    peerArray = [];
    const array = data["salAdminAsst_Peer"][year];
    array.map((item, idx) => {
      const salAdminAsst = Number(data.salAdminAsst_Peer[year][idx]);
      const ficaAdminAsst = Number(data.ficaAdminAsst_Peer[year][idx]);
      const healthAdminAsst = Number(data.healthAdminAsst_Peer[year][idx]);
      const disabilityAdminAsst = Number(
        data.disabilityAdminAsst_Peer[year][idx]
      );
      const retirementAdminAsst = Number(
        data.retirementAdminAsst_Peer[year][idx]
      );
      const housingAdminAsst = Number(data.housingAdminAsst_Peer[year][idx]);
      const otherAdminAsst = Number(data.otherAdminAsst_Peer[year][idx]);
      const totalStudentFTE = Number(data.totalStudentFte_Peer[year][idx]);
      const totalStudentUHC = Number(data.totalStudentUhc_Peer[year][idx]);

      const peerNum =
        (salAdminAsst +
          ficaAdminAsst +
          healthAdminAsst +
          disabilityAdminAsst +
          retirementAdminAsst +
          housingAdminAsst +
          otherAdminAsst) /
        (totalStudentFTE + totalStudentUHC);

      peerArray.push(Math.round(peerNum));
    });

    const clientData =
      Number(data["adminCostsPerStudent_Client"][year].value) * 100;
    clientArray.push(clientData);

    const peerAvg = getWeightedAverageOfArray(
      data,
      "adminCostsPerStudent",
      year
    );
    peerAvgArray.push(Math.round(peerAvg * 100));

    const peer25 = get25thPercentileOfArray(peerArray);
    peer25Array.push(Math.round(peer25));

    const peer50 = getMidpointOfArray(peerArray);
    peer50Array.push(Math.round(peer50));

    const peer75 = get75thPercentileOfArray(peerArray);
    peer75Array.push(Math.round(peer75));
  });

  // console.log({
  //   clientArray,
  //   peerAvgArray,
  //   peerArray,
  //   peer25Array,
  //   peer50Array,
  //   peer75Array,
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
        labelColor: "#000000",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains("dark")
    ? "#e3f0fa"
    : "#000000";

  const yaxisLabelFormatter = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return "Invalid input";
    }
    return `${val}%`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    return `${formattedValue}%`;
  };

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.red,
      window.chartColors.yellow,
      window.chartColors.blue,
      window.chartColors.purple,
    ],
    series: [
      {
        name: clientName,
        type: "column",
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: "25th",
        type: "line",
        data: peer25Array,
      },
      {
        name: "50th",
        type: "line",
        data: peer50Array,
      },
      {
        name: "Avg",
        type: "line",
        data: peerAvgArray,
      },
      {
        name: "75th",
        type: "line",
        data: peer75Array,
      },
    ],
    chart: {
      id: "adminCostsPerStudent",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 550,
      type: "line",
      stacked: false,
    },
    stroke: {
      width: 4,
    },
    title: {
      text: "Admin Costs Per Student",
      position: "top",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColors.labelColor,
        fontSize: "1.5rem",
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
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: chartColors.labelColor,
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColors.labelColor,
            fontSize: "1rem",
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
      position: "top",
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

const getMapChartOptions = (data) => {
  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create("avgScoresUsMap_chart", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_usaLow;

  // Set projection
  chart.projection = new am4maps.projections.AlbersUsa();

  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries.heatRules.push({
    property: "fill",
    target: polygonSeries.mapPolygons.template,
    min: chart.colors.getIndex(1).brighten(1),
    max: chart.colors.getIndex(1).brighten(-0.3),
    logarithmic: true,
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries.useGeodata = true;

  // Set heatmap values for each state
  polygonSeries.data = [
    {
      id: "US-AL",
      value: 444710,
    },
    {
      id: "US-AK",
      value: 626932,
    },
    {
      id: "US-AZ",
      value: 5130632,
    },
    {
      id: "US-AR",
      value: 2673400,
    },
    {
      id: "US-CA",
      value: 33871648,
    },
    {
      id: "US-CO",
      value: 4301261,
    },
    {
      id: "US-CT",
      value: 3405565,
    },
    {
      id: "US-DE",
      value: 783600,
    },
    {
      id: "US-FL",
      value: 15982378,
    },
    {
      id: "US-GA",
      value: 8186453,
    },
    {
      id: "US-HI",
      value: 1211537,
    },
    {
      id: "US-ID",
      value: 1293953,
    },
    {
      id: "US-IL",
      value: 12419293,
    },
    {
      id: "US-IN",
      value: 6080485,
    },
    {
      id: "US-IA",
      value: 2926324,
    },
    {
      id: "US-KS",
      value: 2688418,
    },
    {
      id: "US-KY",
      value: 4041769,
    },
    {
      id: "US-LA",
      value: 4468976,
    },
    {
      id: "US-ME",
      value: 1274923,
    },
    {
      id: "US-MD",
      value: 5296486,
    },
    {
      id: "US-MA",
      value: 6349097,
    },
    {
      id: "US-MI",
      value: 9938444,
    },
    {
      id: "US-MN",
      value: 4919479,
    },
    {
      id: "US-MS",
      value: 2844658,
    },
    {
      id: "US-MO",
      value: 5595211,
    },
    {
      id: "US-MT",
      value: 902195,
    },
    {
      id: "US-NE",
      value: 1711263,
    },
    {
      id: "US-NV",
      value: 1998257,
    },
    {
      id: "US-NH",
      value: 1235786,
    },
    {
      id: "US-NJ",
      value: 8414350,
    },
    {
      id: "US-NM",
      value: 1819046,
    },
    {
      id: "US-NY",
      value: 18976457,
    },
    {
      id: "US-NC",
      value: 8049313,
    },
    {
      id: "US-ND",
      value: 642200,
    },
    {
      id: "US-OH",
      value: 11353140,
    },
    {
      id: "US-OK",
      value: 3450654,
    },
    {
      id: "US-OR",
      value: 3421399,
    },
    {
      id: "US-PA",
      value: 12281054,
    },
    {
      id: "US-RI",
      value: 1048319,
    },
    {
      id: "US-SC",
      value: 4012012,
    },
    {
      id: "US-SD",
      value: 754844,
    },
    {
      id: "US-TN",
      value: 5689283,
    },
    {
      id: "US-TX",
      value: 20851820,
    },
    {
      id: "US-UT",
      value: 2233169,
    },
    {
      id: "US-VT",
      value: 608827,
    },
    {
      id: "US-VA",
      value: 7078515,
    },
    {
      id: "US-WA",
      value: 5894121,
    },
    {
      id: "US-WV",
      value: 1808344,
    },
    {
      id: "US-WI",
      value: 5363675,
    },
    {
      id: "US-WY",
      value: 493782,
    },
  ];

  // Set up heat legend
  let heatLegend = chart.createChild(am4maps.HeatLegend);
  heatLegend.series = polygonSeries;
  heatLegend.align = "right";
  heatLegend.valign = "bottom";
  heatLegend.height = am4core.percent(80);
  heatLegend.orientation = "vertical";
  heatLegend.valign = "middle";
  heatLegend.marginRight = am4core.percent(4);
  heatLegend.valueAxis.renderer.opposite = true;
  heatLegend.valueAxis.renderer.dx = -25;
  heatLegend.valueAxis.strictMinMax = false;
  heatLegend.valueAxis.fontSize = 9;
  heatLegend.valueAxis.logarithmic = true;

  // Configure series tooltip
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}: {value}";
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#dc5c3c");

  // heat legend behavior
  polygonSeries.mapPolygons.template.events.on("over", function (event) {
    handleHover(event.target);
  });

  polygonSeries.mapPolygons.template.events.on("hit", function (event) {
    handleHover(event.target);
  });

  function handleHover(column) {
    if (!isNaN(column.dataItem.value)) {
      heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
    } else {
      heatLegend.valueAxis.hideTooltip();
    }
  }

  polygonSeries.mapPolygons.template.events.on("out", function (event) {
    heatLegend.valueAxis.hideTooltip();
  });
};

const getNetEducationalExpensePerStudentChartOptions = (data) => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  let peerAvgArray = [];
  let peer25Array = [];
  let peer50Array = [];
  let peer75Array = [];

  const tableHeaderRow = document.getElementById(
    "row_netEducationalExpensePerStudent_tableHeader"
  );
  const netEducationalExpensePerStudentRow = document.getElementById(
    "row_netEducationalExpensePerStudent_main"
  );
  const netEducationalExpenseRow = document.getElementById(
    "row_netEducationalExpensePerStudent_netEducationalExpense"
  );
  const totalFullTimeStudentsRow = document.getElementById(
    "row_netEducationalExpensePerStudent_totalFullTimeStudents"
  );

  // Clear existing content before appending
  tableHeaderRow.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Client</th>`;
  netEducationalExpensePerStudentRow.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Net Educational Expense Per Student</th>`;
  netEducationalExpenseRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Net Educational Expense</th>`;
  totalFullTimeStudentsRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Total Full-Time Students</th>`;

  selectedYearsArray.map((year) => {
    const clientData = Number(data.ratio_Client[year].value);
    clientArray.push(clientData);

    const peerAvg = getAverageOfArray(data.ratio_Peer[year]);
    peerAvgArray.push(Math.round(peerAvg));

    const peer25 = get25thPercentileOfArray(peerAvgArray);
    peer25Array.push(Math.round(peer25));

    const peer50 = getMidpointOfArray(peerAvgArray);
    peer50Array.push(Math.round(peer50));

    const peer75 = get75thPercentileOfArray(peerAvgArray);
    peer75Array.push(Math.round(peer75));

    const netEducationalExpense = Number(
      data.netEducationalExpenses_Client[year].value
    );
    const totalStudents = Number(data.totalStudents_Client[year].value);

    // Add year to table header
    tableHeaderRow.innerHTML += `
      <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
    `;
    // Populate net educational expense per student row
    netEducationalExpensePerStudentRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(clientData)}
      </th>
    `;
    // Populate net educational expense row
    netEducationalExpenseRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(netEducationalExpense)}
      </th>
    `;
    // Populate total full-time students row
    totalFullTimeStudentsRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${totalStudents}
      </th>
    `;
  });

  let netEducationalExpensesArray = [];
  let totalStudentsArray = [];

  selectedYearsArray.map((year) => {
    netEducationalExpensesArray.push(
      Number(data.netEducationalExpenses_Client[year].value)
    );
    totalStudentsArray.push(Number(data.totalStudents_Client[year].value));
  });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#ebedf0",
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#000000",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains("dark")
    ? "#e3f0fa"
    : "#000000";

  const yaxisLabelFormatter = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return "Invalid input";
    }
    if (num >= 1000000) {
      return `${Math.floor(num / 1000000)}M`;
    }
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return val;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    return `$${formattedValue}`;
  };

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.red,
      window.chartColors.orange,
      window.chartColors.blue,
      window.chartColors.purple,
    ],
    series: [
      {
        name: clientName,
        type: "column",
        data: clientArray,
      },
      {
        name: "25th",
        type: "line",
        data: peer25Array,
      },
      {
        name: "50th",
        type: "line",
        data: peer50Array,
      },
      {
        name: "Avg",
        type: "line",
        data: peerAvgArray,
      },
      {
        name: "75th",
        type: "line",
        data: peer75Array,
      },
    ],
    chart: {
      id: "netEducationalExpensePerStudent",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 550,
      type: "line",
    },
    stroke: {
      width: 4,
    },
    title: {
      text: "Net Educational Expense Per Student",
      position: "top",
      align: "center",
      offsetY: 20,
      style: {
        color: chartColors.labelColor,
        fontSize: "1.25rem",
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
    },
    yaxis: {
      tickAmount: 5,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: chartColors.labelColor,
      },
      labels: {
        formatter: yaxisLabelFormatter,
        style: {
          colors: chartColors.labelColor,
          fontSize: "1rem",
        },
      },
      tooltip: {
        enabled: true,
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
      position: "top",
      fontSize: "20px",
      offsetY: -5,
    },
    plotOptions: {
      bar: {
        barHeight: "90%",
      },
    },
  };
};

const getTuitionDependencyChartOptions = (data) => {
  // console.log({ data });

  let clientRatioArray = [];
  let peerRatioArray = [];
  let netTuitionAndFeesArray = [];
  let operatingRevenueArray = [];

  const tableHeaderRowClient = document.getElementById("row_tuitionDependency_tableHeader");
  const ratioRowClient = document.getElementById("row_tuitionDependency_ratio");
  const netTuitionAndFeesRowClient = document.getElementById("row_tuitionDependency_netTuitionAndFees");
  const operatingRevenueRowClient = document.getElementById("row_tuitionDependency_operatingRevenue");
  const tableHeaderRowPeer = document.getElementById("row_tuitionDependency_tableHeader");
  const ratioRowPeer = document.getElementById("row_tuitionDependency_ratio");
  const netTuitionAndFeesRowPeer = document.getElementById("row_tuitionDependency_netTuitionAndFees");
  const operatingRevenueRowPeer = document.getElementById("row_tuitionDependency_operatingRevenue");

  // Clear existing content before appending
  tableHeaderRowClient.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Client</th>`;
  ratioRowClient.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Tuition Dependency</th>`;
  netTuitionAndFeesRowClient.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Net Tuition and Fees</th>`;
  operatingRevenueRowClient.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Operating Revenue</th>`;
  tableHeaderRowPeer.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Peer</th>`;
  ratioRowPeer.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Tuition Dependency</th>`;
  netTuitionAndFeesRowPeer.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Net Tuition and Fees</th>`;
  operatingRevenueRowPeer.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Operating
  Revenue</th>`;


  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  selectedYearsArray.map((year) => {
    const ratioClient = Math.round(Number(data.ratio_Client[year].value) * 100);
    clientRatioArray.push(ratioClient);

    const netTuitionAndFeesClient = Math.round(Number(data.netTuitionAndFees_Client[year].value));
    netTuitionAndFeesArray.push(netTuitionAndFeesClient);

    const operatingRevenuesSupportAndReleaseClient = Math.round(
      Number(data.operatingRevenuesSupportAndRelease_Client[year].value)
    );
    operatingRevenueArray.push(operatingRevenuesSupportAndReleaseClient);

    const ratioPeer = Math.round(getAverageOfArray(data.ratio_Peer[year], 100));
    peerRatioArray.push(ratioPeer);
    const netTuitionAndFeesPeer = Math.round(getAverageOfArray(data.netTuitionAndFees_Peer[year]));
    const operatingRevenuesSupportAndReleasePeer = Math.round(
      getAverageOfArray(data.operatingRevenuesSupportAndRelease_Peer[year])
    );

    console.log({ratioPeer, netTuitionAndFeesPeer, operatingRevenuesSupportAndReleasePeer});


    // Add year to table header
    tableHeaderRowClient.innerHTML += `
      <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
    `;
    // Populate ratio row
    ratioRowClient.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${ratioClient}%
      </th>
    `;
    // Populate net tuition and fees row
    netTuitionAndFeesRowClient.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(netTuitionAndFeesClient)}
      </th>
    `;
    // Populate operating revenue row
    operatingRevenueRowClient.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(operatingRevenuesSupportAndReleaseClient)}
      </th>
    `;
    // Add year to table header
    tableHeaderRowPeer.innerHTML += `
      <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
    `;
    // Populate ratio row
    ratioRowPeer.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${ratioPeer}%
      </th>
    `;
    // Populate net tuition and fees row
    netTuitionAndFeesRowPeer.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(netTuitionAndFeesPeer)}
      </th>
    `;
    // Populate operating revenue row
    operatingRevenueRowPeer.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(operatingRevenuesSupportAndReleasePeer)}
      </th>
    `;



  });

  // console.log({
  //   clientRatioArray,
  //   peerRatioArray,
  //   netTuitionAndFeesArray,
  //   operatingRevenueArray,
  // });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#3A464F",
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

  const yaxisLabelFormatter = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return "Invalid input";
    }
    if (num >= 1000000) {
      return `${Math.floor(num / 1000000)}M`;
    }
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return val;
  };
  const yaxisLabelFormatter2 = (value) => {
    return `${value}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    let formattedValue = value.toLocaleString();
    if (formattedValue.length === 1) formattedValue += ".0";

    if (value < 10) {
      return `${formattedValue}`;
    } else {
      return `$${formattedValue}`;
    }
  };

  // console.log({mainName, benchmark});

  return {
    colors: [
      window.chartColors.blue,
      window.chartColors.teal,
      window.chartColors.green,
      window.chartColors.grey,
    ],
    series: [
      {
        name: "Net Tuition and Fees",
        type: "column",
        data: netTuitionAndFeesArray,
      },
      {
        name: "Operating Revenue",
        type: "column",
        data: operatingRevenueArray,
      },
      {
        name: "Client Ratio",
        type: "line",
        data: clientRatioArray,
      },
      {
        name: "Peer Ratio",
        type: "line",
        data: peerRatioArray,
      },
    ],
    chart: {
      height: 550,
      type: "line",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    title: {
      text: "Tuition Dependency",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColor,
        fontSize: "1.5rem",
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
      },
      {
        show: false,
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: chartColor,
        },
        labels: {
          formatter: yaxisLabelFormatter2,
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        },
      },
    ],
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColor,
          fontSize: "1.5rem",
        },
      },
    },
    legend: {
      position: "top",
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

const getTuitionDiscountRateChartOptions = (data) => {
  // console.log({ data });

  let clientRatioArray = [];
  let peerRatioArray = [];
  let scholarshipArray = [];
  let tuitionFeesArray = [];

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  selectedYearsArray.map((year) => {
    let num = Math.round(Number(data.ratio_Client[year].value) * 100);
    clientRatioArray.push(num);

    num = Math.round(getAverageOfArray(data.ratio_Peer[year]) * 100);
    peerRatioArray.push(num);

    num = Math.round(
      Number(data.revenueScholarshipsAndFinanancialAid_Client[year].value)
    );
    scholarshipArray.push(num);

    num = Math.round(Number(data.revenueTuitionAndFees_Client[year].value));
    tuitionFeesArray.push(num);
  });

  // console.log({
  //   clientRatioArray,
  //   peerRatioArray,
  //   scholarshipArray,
  //   tuitionFeesArray,
  // });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#3A464F",
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

  const yaxisLabelFormatter = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return "Invalid input";
    }
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return val;
  };
  const yaxisLabelFormatter2 = (value) => {
    return `${value}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    let formattedValue = value.toLocaleString();
    if (formattedValue.length === 1) formattedValue += ".0";

    if (value < 10) {
      return `${formattedValue}`;
    } else {
      return `$${formattedValue}`;
    }
  };

  // console.log({mainName, benchmark});

  return {
    colors: [
      window.chartColors.blue,
      window.chartColors.teal,
      window.chartColors.green,
      window.chartColors.grey,
    ],
    series: [
      {
        name: "Current Assets",
        type: "column",
        data: scholarshipArray,
      },
      {
        name: "Current Liabilities",
        type: "column",
        data: tuitionFeesArray,
      },
      {
        name: "Current Ratio",
        type: "line",
        data: clientRatioArray,
      },
      {
        name: "Peer Avg",
        type: "line",
        data: peerRatioArray,
      },
    ],
    chart: {
      height: 550,
      type: "line",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    title: {
      text: "Tuition Discount Rate",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColor,
        fontSize: "1.5rem",
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
      },
      {
        show: false,
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: chartColor,
        },
        labels: {
          formatter: yaxisLabelFormatter2,
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        },
      },
    ],
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColor,
          fontSize: "1.5rem",
        },
      },
    },
    legend: {
      position: "top",
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

// Linear Gauge Chart

const getAnualTraditionalNetTuitionPerStudentChartOptions = (data) => {
  console.log({
    name: "getAnualTraditionalNetTuitionPerStudentChartOptions()",
    data,
  });

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const tableHeaderRow = document.getElementById(
    "row_annualTraditionalNetTuitionPerStudent_tableHeader"
  );
  const annualTraditionalNetTuitionPerStudentRow = document.getElementById(
    "row_annualTraditionalNetTuitionPerStudent_main"
  );
  const netTuitionRevenueRow = document.getElementById(
    "row_annualTraditionalNetTuitionPerStudent_netTuitionRevenue"
  );
  const totalFullTimeStudentsRow = document.getElementById(
    "row_annualTraditionalNetTuitionPerStudent_totalFullTimeStudents"
  );

  // Clear existing content before appending
  tableHeaderRow.innerHTML = `<th scope="col" class="px-2 py-1 text-lg tracking-wide">Client</th>`;
  annualTraditionalNetTuitionPerStudentRow.innerHTML = `<th scope="row" class="px-6 py-2 text-xl text-gray-900 whitespace-nowrap dark:text-white">Net Tuition per Student</th>`;
  netTuitionRevenueRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Net Tuition and Fees</th>`;
  totalFullTimeStudentsRow.innerHTML = `<th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">Total Full-Time Students</th>`;

  selectedYearsArray.map((year) => {
    const clientData = Number(data.ratio_Client[year].value);
    const netTuitionAndFees = Number(data.netTuitionAndFees_Client[year].value);
    const totalStudents = Number(data.totalStudents_Client[year].value);

    // Add year to table header
    tableHeaderRow.innerHTML += `
      <th scope="col" class="px-6 py-3 text-lg tracking-wide">${year}</th>
    `;
    // Populate salaries and benefits per net tuition revenue row
    annualTraditionalNetTuitionPerStudentRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(clientData)}
      </th>
    `;

    // Populate net tuition revenue row
    netTuitionRevenueRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${formatCurrency(netTuitionAndFees)}
      </th>
    `;

    // Populate total full-time students row
    totalFullTimeStudentsRow.innerHTML += `
      <th scope="row" class="px-6 py-2 text-gray-900 whitespace-nowrap dark:text-white">
        ${totalStudents}
      </th>
    `;
  });

  const value = clientData;
  const benchmark = 1400;
  const text =
    value > benchmark
      ? `Within Range of Benchmark: ${benchmark}%`
      : `Below Benchmark: ${benchmark}%`;

  const backgroundColor = value > benchmark ? "#54ba4a" : "#cf3636";

  var chartObj = new FusionCharts({
    type: "hlineargauge",
    renderAt: "annualTraditionalNetTuitionPerStudent_chart",
    width: "800",
    height: "200",
    dataFormat: "json",
    dataSource: {
      chart: {
        theme: "fusion",
        caption: "Annual Traditional Net Tuition per Student",
        subcaption: "",
        lowerLimit: "0",
        upperLimit: value + 5000,
        numberSuffix: "",
        valueAbovePointer: "0",
        chartBottomMargin: "50",
        valueFontSize: "14",
        valueFontBold: "6",
      },
      colorRange: {
        color: [
          {
            minValue: "0",
            maxValue: "35",
            code: "#EF707E",
          },
          {
            minValue: "35",
            maxValue: "70",
            code: "#FFE381",
          },
          {
            minValue: "70",
            maxValue: "100",
            code: "#BBE97A",
          },
        ],
      },
      pointers: {
        pointer: [
          {
            value: value,
          },
        ],
      },
      trendPoints: {
        point: [
          {
            startValue: benchmark,
            color: "#171616",
            dashed: "1",
            dashlen: "5",
            dashgap: "3",
            thickness: "3",
            displayValue: "Benchmark",
          },
        ],
      },
      annotations: {
        origw: "400",
        origh: "190",
        autoscale: "1",
        groups: [
          {
            id: "range",
            items: [
              {
                id: "rangeBg",
                type: "rectangle",
                x: "$chartCenterX-115",
                y: "$chartEndY-35",
                tox: "$chartCenterX +115",
                toy: "$chartEndY-15",
                fillcolor: backgroundColor,
              },
              {
                id: "rangeText",
                type: "Text",
                fontSize: "14",
                fillcolor: "#ffffff",
                text: text,
                x: "$chartCenterX",
                y: "$chartEndY-25",
              },
            ],
          },
        ],
      },
    },
  });

  chartObj.render();
};

const getDebtServiceCoverageChartOptions = (data) => {
  const value = 8;
  const benchmark = 4;
  const text =
    value > 4
      ? `Within Range of Benchmark: ${benchmark}%`
      : `Below Benchmark: ${benchmark}%`;

  const backgroundColor = value > 4 ? "#54ba4a" : "#cf3636";

  var chartObj = new FusionCharts({
    type: "hlineargauge",
    renderAt: "debtServiceCoverageRatio_chart",
    width: "800",
    height: "200",
    dataFormat: "json",
    dataSource: {
      chart: {
        theme: "fusion",
        caption: "Debt Service Coverage Ratio",
        subcaption: "",
        lowerLimit: "0",
        upperLimit: "10",
        numberSuffix: "",
        valueAbovePointer: "0",
        chartBottomMargin: "50",
        valueFontSize: "14",
        valueFontBold: "6",
      },
      colorRange: {
        color: [
          {
            minValue: "0",
            maxValue: "4",
            code: "#EF707E",
          },
          {
            minValue: "4",
            maxValue: "8",
            code: "#FFE381",
          },
          {
            minValue: "8",
            maxValue: "12",
            code: "#BBE97A",
          },
        ],
      },
      pointers: {
        pointer: [
          {
            value: value,
          },
        ],
      },
      trendPoints: {
        point: [
          {
            startValue: benchmark,
            color: "#171616",
            dashed: "1",
            dashlen: "5",
            dashgap: "3",
            thickness: "3",
            displayValue: "Benchmark",
          },
        ],
      },
      annotations: {
        origw: "400",
        origh: "190",
        autoscale: "1",
        groups: [
          {
            id: "range",
            items: [
              {
                id: "rangeBg",
                type: "rectangle",
                x: "$chartCenterX-115",
                y: "$chartEndY-35",
                tox: "$chartCenterX +115",
                toy: "$chartEndY-15",
                fillcolor: backgroundColor,
              },
              {
                id: "rangeText",
                type: "Text",
                fontSize: "14",
                fillcolor: "#ffffff",
                text: text,
                x: "$chartCenterX",
                y: "$chartEndY-25",
              },
            ],
          },
        ],
      },
    },
  });

  chartObj.render();
};

const getEndowmentOperatingChartOptions = (data) => {
  const value = 175;
  const benchmark = 150;
  const text =
    value > 150
      ? `Within Range of Benchmark: ${benchmark}%`
      : `Below Benchmark: ${benchmark}%`;

  const backgroundColor = value > 70 ? "#54ba4a" : "#cf3636";

  var chartObj = new FusionCharts({
    type: "hlineargauge",
    renderAt: "endowmentOperatingBudget_chart",
    width: "800",
    height: "200",
    dataFormat: "json",
    dataSource: {
      chart: {
        theme: "fusion",
        caption: clientName,
        subcaption: "Endowment Assets per Student",
        lowerLimit: "0",
        upperLimit: "250",
        numberSuffix: "",
        valueAbovePointer: "0",
        chartBottomMargin: "50",
        valueFontSize: "14",
        valueFontBold: "6",
      },
      colorRange: {
        color: [
          {
            minValue: "0",
            maxValue: "75",
            code: "#EF707E",
          },
          {
            minValue: "75",
            maxValue: "150",
            code: "#FFE381",
          },
          {
            minValue: "150",
            maxValue: "250",
            code: "#BBE97A",
          },
        ],
      },
      pointers: {
        pointer: [
          {
            value: value,
          },
        ],
      },
      trendPoints: {
        point: [
          {
            startValue: benchmark,
            color: "#171616",
            dashed: "1",
            dashlen: "5",
            dashgap: "3",
            thickness: "3",
            displayValue: "Benchmark",
          },
        ],
      },
      annotations: {
        origw: "400",
        origh: "190",
        autoscale: "1",
        groups: [
          {
            id: "range",
            items: [
              {
                id: "rangeBg",
                type: "rectangle",
                x: "$chartCenterX-115",
                y: "$chartEndY-35",
                tox: "$chartCenterX +115",
                toy: "$chartEndY-15",
                fillcolor: backgroundColor,
              },
              {
                id: "rangeText",
                type: "Text",
                fontSize: "14",
                fillcolor: "#ffffff",
                text: text,
                x: "$chartCenterX",
                y: "$chartEndY-25",
              },
            ],
          },
        ],
      },
    },
  });

  chartObj.render();
};

// ltDebtPerTotalOperatingRevenue_chart

const getLtDebtPerTotalOperatingRevenueChartOptions = (data) => {
  // console.log({ data });

  const mostRecentYear = Math.max(
    ...Object.keys(data["longTermDebtForLongTermPurpose_Client"])
  );

  const num = Number(
    data["longTermDebtForLongTermPurpose_Client"][mostRecentYear].value
  );
  const clientPercent = Math.round(num * 100);

  // console.log({ clientPercent });

  const chartColor =
    clientPercent <= 60
      ? window.chartColors.green
      : clientPercent <= 80
      ? window.chartColors.orange
      : window.chartColors.red;

  // console.log({ chartColor });

  const textArray = [
    "Current Ratio Exceeds Target Goal: Reduce to below 50%",
    "Current Ratio Far Exceeds Target Goal: Reduce to below 50%",
    "Current Ratio is within Target Goal: below 50%",
  ];

  const textLabel =
    clientPercent <= 60
      ? textArray[2]
      : clientPercent <= 80
      ? textArray[0]
      : textArray[1];

  return {
    series: [clientPercent],
    chart: {
      height: 350,
      type: "radialBar",
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: "16px",
            color: chartColor,
            offsetY: 120,
          },
          value: {
            fontSize: "100px",
            fontWeight: "700",
            color: chartColor,
            formatter: function (val) {
              return val + "%";
            },
            offsetY: -10,
          },
        },
      },
    },
    fill: {
      colors: [chartColor],
    },
    stroke: {
      dashArray: 4,
      style: {
        color: chartColor,
      },
    },
    labels: [textLabel],
  };
};

const getDebtBurdenRatioChartOptions = (data) => {
  // console.log({ data });

  let clientRatioArray = [];
  let peerRatioArray = [];
  let debtServiceArray = [];
  let operationalExpenseArray = [];

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  selectedYearsArray.map((year) => {
    const debtServiceClientNum = Number(data.debtService_Client[year].value);
    const operationalExpenseClientNum = Number(
      data.operationalExpense_Client[year].value
    );
    const clientRatioNum = debtServiceClientNum / operationalExpenseClientNum;

    const debtServicePeerNum = getSumOfArray(data.debtService_Peer[year]);
    const operationalExpensePeerNum = getSumOfArray(
      data.operationalExpense_Peer[year]
    );
    const peerRatioNum = debtServicePeerNum / operationalExpensePeerNum;

    let num = Math.round(clientRatioNum * 100);
    clientRatioArray.push(num);

    num = Math.round(peerRatioNum * 100);
    peerRatioArray.push(num);

    num = Math.round(Number(data.debtService_Client[year].value));
    debtServiceArray.push(num);

    num = Math.round(Number(data.operationalExpense_Client[year].value));
    operationalExpenseArray.push(num);
  });

  // console.log({
  //   clientRatioArray,
  //   peerRatioArray,
  //   debtServiceArray,
  //   operationalExpenseArray,
  // });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#3A464F",
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

  const yaxisLabelFormatter = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return "Invalid input";
    }
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return val;
  };
  const yaxisLabelFormatter2 = (value) => {
    return `${value}`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    let formattedValue = value.toLocaleString();
    if (formattedValue.length === 1) formattedValue += ".0";

    if (value < 10) {
      return `${formattedValue}`;
    } else {
      return `$${formattedValue}`;
    }
  };

  // console.log({mainName, benchmark});

  return {
    colors: [
      window.chartColors.blue,
      window.chartColors.teal,
      window.chartColors.green,
      window.chartColors.grey,
    ],
    series: [
      {
        name: "Debt Service",
        type: "column",
        data: debtServiceArray,
      },
      {
        name: "Operating Expense",
        type: "column",
        data: operationalExpenseArray,
      },
      {
        name: "Client Ratio",
        type: "line",
        data: clientRatioArray,
      },
      {
        name: "Peer Ratio",
        type: "line",
        data: peerRatioArray,
      },
    ],
    chart: {
      height: 550,
      type: "line",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    title: {
      text: "Debt Burden Ratio",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColor,
        fontSize: "1.5rem",
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
      },
      {
        show: false,
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: chartColor,
        },
        labels: {
          formatter: yaxisLabelFormatter2,
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        },
      },
    ],
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColor,
          fontSize: "1.5rem",
        },
      },
    },
    legend: {
      position: "top",
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

const getEndowmentAssetsPerStudentMapOptions = (data) => {
  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create(
    "endowmentAssetsPerStudentMAP_chart",
    am4maps.MapChart
  );

  // Set map definition
  chart.geodata = am4geodata_usaLow;

  // Set projection
  chart.projection = new am4maps.projections.AlbersUsa();

  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries.heatRules.push({
    property: "fill",
    target: polygonSeries.mapPolygons.template,
    min: chart.colors.getIndex(1).brighten(1),
    max: chart.colors.getIndex(1).brighten(-0.3),
    logarithmic: true,
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries.useGeodata = true;

  // Set heatmap values for each state
  polygonSeries.data = [
    {
      id: "US-AL",
      value: 444710,
    },
    {
      id: "US-AK",
      value: 626932,
    },
    {
      id: "US-AZ",
      value: 5130632,
    },
    {
      id: "US-AR",
      value: 2673400,
    },
    {
      id: "US-CA",
      value: 33871648,
    },
    {
      id: "US-CO",
      value: 4301261,
    },
    {
      id: "US-CT",
      value: 3405565,
    },
    {
      id: "US-DE",
      value: 783600,
    },
    {
      id: "US-FL",
      value: 15982378,
    },
    {
      id: "US-GA",
      value: 8186453,
    },
    {
      id: "US-HI",
      value: 1211537,
    },
    {
      id: "US-ID",
      value: 1293953,
    },
    {
      id: "US-IL",
      value: 12419293,
    },
    {
      id: "US-IN",
      value: 6080485,
    },
    {
      id: "US-IA",
      value: 2926324,
    },
    {
      id: "US-KS",
      value: 2688418,
    },
    {
      id: "US-KY",
      value: 4041769,
    },
    {
      id: "US-LA",
      value: 4468976,
    },
    {
      id: "US-ME",
      value: 1274923,
    },
    {
      id: "US-MD",
      value: 5296486,
    },
    {
      id: "US-MA",
      value: 6349097,
    },
    {
      id: "US-MI",
      value: 9938444,
    },
    {
      id: "US-MN",
      value: 4919479,
    },
    {
      id: "US-MS",
      value: 2844658,
    },
    {
      id: "US-MO",
      value: 5595211,
    },
    {
      id: "US-MT",
      value: 902195,
    },
    {
      id: "US-NE",
      value: 1711263,
    },
    {
      id: "US-NV",
      value: 1998257,
    },
    {
      id: "US-NH",
      value: 1235786,
    },
    {
      id: "US-NJ",
      value: 8414350,
    },
    {
      id: "US-NM",
      value: 1819046,
    },
    {
      id: "US-NY",
      value: 18976457,
    },
    {
      id: "US-NC",
      value: 8049313,
    },
    {
      id: "US-ND",
      value: 642200,
    },
    {
      id: "US-OH",
      value: 11353140,
    },
    {
      id: "US-OK",
      value: 3450654,
    },
    {
      id: "US-OR",
      value: 3421399,
    },
    {
      id: "US-PA",
      value: 12281054,
    },
    {
      id: "US-RI",
      value: 1048319,
    },
    {
      id: "US-SC",
      value: 4012012,
    },
    {
      id: "US-SD",
      value: 754844,
    },
    {
      id: "US-TN",
      value: 5689283,
    },
    {
      id: "US-TX",
      value: 20851820,
    },
    {
      id: "US-UT",
      value: 2233169,
    },
    {
      id: "US-VT",
      value: 608827,
    },
    {
      id: "US-VA",
      value: 7078515,
    },
    {
      id: "US-WA",
      value: 5894121,
    },
    {
      id: "US-WV",
      value: 1808344,
    },
    {
      id: "US-WI",
      value: 5363675,
    },
    {
      id: "US-WY",
      value: 493782,
    },
  ];

  // Set up heat legend
  let heatLegend = chart.createChild(am4maps.HeatLegend);
  heatLegend.series = polygonSeries;
  heatLegend.align = "right";
  heatLegend.valign = "bottom";
  heatLegend.height = am4core.percent(80);
  heatLegend.orientation = "vertical";
  heatLegend.valign = "middle";
  heatLegend.marginRight = am4core.percent(4);
  heatLegend.valueAxis.renderer.opposite = true;
  heatLegend.valueAxis.renderer.dx = -25;
  heatLegend.valueAxis.strictMinMax = false;
  heatLegend.valueAxis.fontSize = 9;
  heatLegend.valueAxis.logarithmic = true;

  // Configure series tooltip
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}: {value}";
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#dc5c3c");

  // heat legend behavior
  polygonSeries.mapPolygons.template.events.on("over", function (event) {
    handleHover(event.target);
  });

  polygonSeries.mapPolygons.template.events.on("hit", function (event) {
    handleHover(event.target);
  });

  function handleHover(column) {
    if (!isNaN(column.dataItem.value)) {
      heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
    } else {
      heatLegend.valueAxis.hideTooltip();
    }
  }

  polygonSeries.mapPolygons.template.events.on("out", function (event) {
    heatLegend.valueAxis.hideTooltip();
  });
};

const getEndowmentAssetsPerStudentChartOptions = (data) => {
  // console.log({ data });

  const mostRecentYear = Math.max(...Object.keys(data["endowmentSize_Client"]));

  const selectedYearsArray = getSelectedYearsFromLocalStorage();
  let clientArray = [];
  let peerArray = [];

  selectedYearsArray.map((year) => {
    const endowmentSizeClient = Number(data.endowmentSize_Client[year].value);
    const totalStudentFteClient = Number(
      data.totalStudentFte_Client[year].value
    );
    const clientRatio = endowmentSizeClient / totalStudentFteClient;

    const endowmentSizePeer = getSumOfArray(data.endowmentSize_Peer[year]);
    const totalStudentFtePeer = getSumOfArray(data.totalStudentFte_Peer[year]);
    // console.log({endowmentSizePeer, totalStudentFtePeer, endowmentSizeClient, totalStudentFteClient});

    const peerRatio = endowmentSizePeer / totalStudentFtePeer;

    // console.log({clientRatio, peerRatio});

    const clientData = isNaN(clientRatio) ? clientRatio * 100 : 0;
    clientArray.push(clientData);

    const peerData = isNaN(peerRatio) ? peerRatio * 100 : 0;
    peerArray.push(peerData);
  });

  // console.log({
  //   clientArray,
  //   peerArray,
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
        labelColor: "#000000",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains("dark")
    ? "#e3f0fa"
    : "#000000";

  const yaxisLabelFormatter = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return "Invalid input";
    }
    return `${val}%`;
  };

  const tooltipFormatter = (value) => {
    if (!value) return;
    const formattedValue = value.toLocaleString();
    return `${formattedValue}%`;
  };

  return {
    colors: [
      window.chartColors.blue,
      window.chartColors.green,
      window.chartColors.red,
      window.chartColors.orange,
      window.chartColors.purple,
    ],
    series: [
      {
        name: clientName,
        type: "column",
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: "Peer Ratio",
        type: "line",
        data: peerArray,
      },
    ],
    chart: {
      id: "adminCostsPerStudent",
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 550,
      type: "line",
      stacked: false,
    },
    stroke: {
      width: 4,
    },
    title: {
      text: "Endowment Assets per Student",
      position: "top",
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColors.labelColor,
        fontSize: "1.5rem",
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
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: chartColors.labelColor,
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColors.labelColor,
            fontSize: "1rem",
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
      position: "top",
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
