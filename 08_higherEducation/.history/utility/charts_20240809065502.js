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

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

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

  // if (mainName == "cfi_netIncomeOperationsRatio")
  //   console.log({ clientArray, peerAvg, peerMid, peer25, peer75 });

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

  // if (mainName == 'cfi_primaryReserveRatio') console.log({ series })

  return {
    colors: [
      window.chartColors.blue,
      window.chartColors.red,
      window.chartColors.orange,
      window.chartColors.purple,
      window.chartColors.green,
      window.chartColors.black,
    ],
    series: [
      {
        name: "Avg",
        type: "line",
        data: peerAvg,
      },
      {
        name: "25%",
        type: "line",
        data: peer25,
      },
      {
        name: "50%",
        type: "line",
        data: peerMid,
      },
      {
        name: "75%",
        type: "line",
        data: peer75,
      },
      {
        name: clientName,
        type: "column",
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      benchmarkArray.length > 0 && {
        name: "Benchmark",
        type: "line",
        data: benchmarkArray,
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
      stacked: false,
    },
    stroke: {
      width: 4,
    },
    title: {
      text: title,
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
    annotations: {
      yaxis: [
        {
          y: benchmark,
          label: {
            text: "Benchmark",
            style: {
              color: chartColors.black,
            },
          },
        },
      ],
    },
    plotOptions: {
      bar: {
        barHeight: "90%",
      },
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
  // if (chartId == "#assets_chart")
  //   console.log({ data, client, color, numType, title, chartId });

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
    title: {
      text: "CLIENT",
      align: "left",
      offsetX: 110,
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
    clientArray.push(Math.round(clientValue));

    peerValue =
      getAverageOfArray(totalAssetsPeer[year]) /
      getAverageOfArray(totalLiabilitiesPeer[year]);
    peerArray.push(Math.round(peerValue));
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
          formatter: (value) => Math.round(value),
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        },
        tooltip: {
          enabled: true,
        },
        stepSize: 1,
        min: minNum - 1,
        max: maxNum + 1,
      },
    ],
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

const getSoiClientChartOptions = (data) => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const tuitionValue =
    data["si_revenueTuitionAndFees_Client"][selectedYearsArray[0]].value;
  const auxiliaryValue =
    data["si_revenueAuxiliaryActivities_Client"][selectedYearsArray[0]].value;
  const contributionsValue =
    data["si_revenueContributions_Client"][selectedYearsArray[0]].value +
    data["si_revenueContributionsLargeOneTimeGifts_Client"][
      selectedYearsArray[0]
    ].value;
  const investmentsValue =
    data["si_revenueInvestmentIncome_Client"][selectedYearsArray[0]].value;
  const otherValue =
    data["si_revenueOther_Client"][selectedYearsArray[0]].value +
    data["si_revenueEndowmentSpendingAppropriation_Client"][
      selectedYearsArray[0]
    ].value;

  // console.log ({
  //   tuitionValue,
  //   auxiliaryValue,
  //   contributionsValue,
  //   investmentsValue,
  //   otherValue,
  // });

  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#F3F4F6",
        labelColor: "#6B7280",
        opacityFrom: 0.45,
        opacityTo: 0,
      }
    : {
        borderColor: "#374151",
        labelColor: "#ebedf0",
        opacityFrom: 0,
        opacityTo: 0.15,
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

  // console.log({ clientArray, peerArray, benchmarkArray });

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
    series: [221, 111, 121, 111, 300, 312],
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
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    title: {
      text: "CLIENT",
      align: "top",
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
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

const getSoiPeerChartOptions = (data) => {
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
        borderColor: "#F3F4F6",
        labelColor: "#6B7280",
        opacityFrom: 0.45,
        opacityTo: 0,
      }
    : {
        borderColor: "#374151",
        labelColor: "#ebedf0",
        opacityFrom: 0,
        opacityTo: 0.15,
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

  // [tuitionValue, auxiliaryValue, contributionsValue, investmentsValue, otherValue]

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.grey,
      window.chartColors.red,
      window.chartColors.orange,
    ],
    series: [233, 555, 222, 222, 124],
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
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    title: {
      text: "PEER",
      align: "top",
      color: chartColor,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
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
    data["ffa_revenueScholarshipsAndFinancialAid_Client"][currentYear].value *
      -1
  );
  const ScholarshipAndFinancialAidClient =
    revenueTuitionAndFeesClient - revenueSchoolServicesClient;

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
  const revenueInvestmentIncomeClient = Number(
    data["ffa_revenueInvestmentIncome_Client"][currentYear].value
  );
  const revenueEndowmentSpendingAppropriationClient = Number(
    data["ffa_revenueEndowmentSpendingAppropriation_Client"][currentYear].value
  );
  const auxiliaryAndOtherClient =
    unrestrictedGiftsClient +
    (revenueAuxiliaryActivitiesClient +
      revenueOtherClient +
      revenueInvestmentIncomeClient +
      revenueEndowmentSpendingAppropriationClient);

  const contributionsClient = Number(
    data["ffa_contributions_Client"][currentYear].value
  );
  const restrictedGiftsClient = auxiliaryAndOtherClient + contributionsClient;

  // console.log('data', data);

  const salariesAndWagesClient = Number(
    data["ffa_salariesAndWages_Client"][currentYear].value
  );
  const employeeBenefitsClient = Number(
    data["ffa_employeeBenefits_Client"][currentYear].value
  );
  // console.log({
  //   salariesAndWagesClient,
  //   employeeBenefitsClient,
  //   addition: salariesAndWagesClient + employeeBenefitsClient,
  //   currentYear
  // });

  const compensationAndBenefitsClient =
    restrictedGiftsClient - (salariesAndWagesClient + employeeBenefitsClient);

  const servicesSuppliesAndOtherClient = Number(
    data["ffa_servicesSuppliesAndOther_Client"][currentYear].value
  );
  const occupancyUtilitiesAndMaintenanceClient = Number(
    data["ffa_occupancyUtilitiesAndMaintenance_Client"][currentYear].value
  );
  const depreciationAndAmortizationClient = Number(
    data["ffa_depreciationAndAmortization_Client"][currentYear].value
  );
  const interestClient = Number(data["ffa_interest_Client"][currentYear].value);
  const incomeExpenseSurplusDefecitClient = Number(
    data["ffa_incomeExpenseSurplusDefecit_Client"][currentYear].value
  );
  const generalExpenseClient =
    compensationAndBenefitsClient -
    (servicesSuppliesAndOtherClient +
      occupancyUtilitiesAndMaintenanceClient +
      depreciationAndAmortizationClient +
      interestClient +
      incomeExpenseSurplusDefecitClient);

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

  // [tuitionValue, auxiliaryValue, contributionsValue, investmentsValue, otherValue]
  // [          {
  //   x: "Tuition & Fees",
  //   y: [0, revenueTuitionAndFeesClient],
  //   fillColor: window.chartColors.teal,
  // },
  // {
  //   x: "Scholarship & Financial Aid",
  //   y: [revenueTuitionAndFeesClient, ScholarshipAndFinancialAidClient],
  //   fillColor: window.chartColors.yellow,
  // },
  // {
  //   x: "Unrestricted Gifts",
  //   y: [ScholarshipAndFinancialAidClient, unrestrictedGiftsClient],
  //   fillColor: window.chartColors.teal,
  // },
  // {
  //   x: "Auxiliary & Other",
  //   y: [unrestrictedGiftsClient, auxiliaryAndOtherClient],
  //   fillColor: window.chartColors.teal,
  // },
  // {
  //   x: "Restricted Gifts",
  //   y: [auxiliaryAndOtherClient, restrictedGiftsClient],
  //   fillColor: window.chartColors.teal,
  // },
  // {
  //   x: "Compensation & Benefits",
  //   y: [restrictedGiftsClient, compensationAndBenefitsClient],
  //   fillColor: window.chartColors.yellow,
  // },
  // {
  //   x: "General Expense",
  //   y: [compensationAndBenefitsClient, generalExpenseClient],
  //   fillColor: window.chartColors.yellow,
  // },
  // {
  //   x: surplusDefecitLabel,
  //   y: [generalExpenseClient, surplusDefecitClient],
  //   fillColor: surplusDefecitColor,
  // },]

  return {
    series: [
      {
        data: [
          {
            x: "Tuition & Fees",
            y: [0, 500],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Scholarship & Financial Aid",
            y: [500, 450],
            fillColor: window.chartColors.yellow,
          },
          {
            x: "Unrestricted Gifts",
            y: [450, 550],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Auxiliary & Other",
            y: [550, 700],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Restricted Gifts",
            y: [700, 75],
            fillColor: window.chartColors.teal,
          },
          {
            x: "Compensation & Benefits",
            y: [750, 900],
            fillColor: window.chartColors.yellow,
          },
          {
            x: "General Expense",
            y: [900, 800],
            fillColor: window.chartColors.yellow,
          },
          {
            x: surplusDefecitLabel,
            y: [0, 800],
            fillColor: surplusDefecitColor,
          },
        ],
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
      position: "bottom",
      fontSize: "20px",
    },
  };
};

const getCashFlowTrendChartOptions = (data) => {
  // console.log(data);

  const financeData = data["cft_FinancingActivities_Client"];
  const investingData = data["cft_InvestingActivities_Client"];

  const operatingData = data["cft_OperatingActivities_Client"];

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const seriesData = selectedYearsArray.map((year) => {
    const operatingVal = operatingData[year]?.value || 0;
    const investingVal = investingData[year]?.value || 0;
    const financeVal = financeData[year]?.value || 0;

    const data = [operatingVal, investingVal, financeVal];

    return {
      name: year.toString(),
      data: data,
    };
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
      categories: ["Operating", "Investing", "Financing"],
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: "1rem",
        },
        position: "top",
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

const getCurrentRatioChartOptions = (data) => {
  // console.log({ chartData: data });

  const firstKey = Object.keys(data)[0];
  const yearsDataCurrentRatio_Array = Object.keys(data[firstKey]);

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

  const currentLiabilitiesArray = accountsPayableArray.map(
    (_, index) =>
      (accountsPayableArray[index] + deferredRevenueArray[index]) * -1
  );

  const currentRatioArray = currentAssetsArray.map((asset, index) => {
    const liability = currentLiabilitiesArray[index] * -1;
    console.log(liability);

    return liability !== 0 ? asset / liability : 0; // Avoid division by zero
  });

  console.log({
    currentAssetsArray,
    currentLiabilitiesArray,
    currentRatioArray,
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
    const formattedValue = value.toLocaleString();
    return `$${formattedValue}`;
  };

  // console.log({mainName, benchmark});

  console.log('hit');
  

  return {
    series: [
      {
        name: "Current Assets",
        type: "column",
        data: currentAssetsArray,
        style: {
          colors: [chartColors.green],
        },
      },
      {
        name: "Current Liabilities",
        type: "column",
        data: currentLiabilitiesArray,
        style: {
          colors: [chartColors.pinkFinancing],
        }
      },
      {
        name: "Current Ratio",
        type: "line",
        data: currentRatioArray,
        style: {
          colors: [chartColors.pinkFinancing],
        }
      },
    ],
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
        }
      } , 
      {
        show: false
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
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColor,
            fontSize: "1.25rem",
          },
        }
      }
    ],
    chart: {
      height: 350,
      type: "line",
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    title: {
      text: 'Current Ratio',
      align: "center",
      margin: 10,
      offsetY: 20,
      style: {
        color: chartColor,
        fontSize: "1.5rem",
      },
    },
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



