const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  benchmark
) => {
  // console.log('-----')
  // console.log('getMainChartOptions()',)

  const chartColors = document.documentElement.classList.contains ('dark')
    ? {
        borderColor: '#374151',
        labelColor: '#ebedf0',
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: '#F3F4F6',
        labelColor: '#6B7280',
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains ('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const selectedYearsArray = getSelectedYearsFromLocalStorage ();

  const formatNumber = value => value.toLocaleString ();

  // console.log(selectedYearsArray, dataPeer, dataClient, fixedNum);

  ({
    clientArray,
    peerAvg,
    peerMid,
    peer25,
    peer75,
    benchmarkArray,
  } = getPeerAndClientChartDataArrays (
    selectedYearsArray,
    dataPeer,
    dataClient,
    fixedNum,
    mainName,
    benchmark
  ));

  // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 })

  const yaxisLabelFormatter = value => {
    if (numType === 'dollar') {
      return `$${formatNumber (value)}`;
    } else if (numType === 'percent') {
      return `${formatNumber (value)}%`;
    } else {
      return formatNumber (value);
    }
  };

  const tooltipFormatter = value => {
    if (!value) return;
    const formattedValue = value.toLocaleString ();
    if (numType === 'dollar') {
      return `$${formattedValue}`;
    } else if (numType === 'percent') {
      return `${formattedValue}%`;
    } else {
      return formattedValue;
    }
  };

  // console.log({mainName, benchmark});

  // if (mainName == 'cfi_primaryReserveRatio') console.log({ series })

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
        name: 'Client',
        type: 'column',
        data: clientArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: '25%',
        type: 'line',
        data: peer25,
        visible: false,
      },
      {
        name: '50%',
        type: 'line',
        data: peerMid,
        visible: false,
      },
      {
        name: 'Avg',
        type: 'line',
        stacked: false,
        data: peerAvg,
        yaxis: 0,
        style: {
          colors: ['transparent'], // Set the line color to transparent
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 80, 80],
          },
        },
      },
      benchmarkArray.length > 0 && {
        name: 'Benchmark',
        type: 'line',
        data: benchmarkArray,
        visible: false,
      },
      {
        name: '75%',
        type: 'line',
        data: peer75,
        visible: false,
      },
    ],
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 6, 4, 4, 4],
    },
    title: {
      text: '',
      align: 'left',
      offsetX: 110,
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: '1rem',
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
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColor,
            fontSize: '1rem',
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
        position: 'topLeft',
        offsetY: 30,
        offsetX: 60,
      },
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: seriesName => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,
      fontSize: '20px',
    },
    grid: {
      row: {
        colors: ['transparent'],
        opacity: 0.5,
        thickness: 4,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '90%',
      },
    },
  };
};

const getFpaChartOptions = data => {
  // console.log(data);

  const totalAssetsArray = Object.values (data['totalAssets_Client'])
    .map (item => item.value)
    .reverse ();
  const totalLiabilitiesArray = Object.values (data['totalLiabilities_Client'])
    .map (item => item.value)
    .reverse ();
  const netPositionArray = Object.values (data['netPosition_Client'])
    .map (item => item.value)
    .reverse ();

  const chartColors = document.documentElement.classList.contains ('dark')
    ? {
        borderColor: '#374151',
        labelColor: '#3A464F',
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: '#F3F4F6',
        labelColor: '#6B7280',
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains ('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const selectedYearsArray = getSelectedYearsFromLocalStorage ();

  const formatNumber = value => value.toLocaleString ();

  // console.log(selectedYearsArray, dataPeer, dataClient, fixedNum);
  // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 })

  const yaxisLabelFormatter = value => {
    return `$${formatNumber (value)}`;
  };

  const tooltipFormatter = value => {
    if (!value) return;
    const formattedValue = value.toLocaleString ();
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
        name: 'Total Assets',
        type: 'bar',
        data: totalAssetsArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: 'Total Liabilities',
        group: 'column',
        data: totalLiabilitiesArray,
        style: {
          colors: [chartColors.grey],
        },
      },
      {
        name: 'Net Position',
        group: 'column',
        data: netPositionArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
    ],
    chart: {
      height: 350,
      type: 'bar',
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
      text: 'CLIENT',
      align: 'left',
      offsetX: 110,
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: '1.5rem',
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
            fontSize: '1.25rem',
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
          formatter: seriesName => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,
      fontSize: '20px',
    },
    grid: {
      row: {
        colors: ['transparent'],
        opacity: 0.5,
        thickness: 4,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '90%',
      },
    },
  };
};

const getAtlChartOptions = data => {
  const clientArray = new Array ();
  const peerArray = new Array ();
  const benchmarkArray = new Array ();

  const selectedYearsArray = getSelectedYearsFromLocalStorage ();
  const totalAssetsClient = data['totalAssets_Client'];
  const totalLiabilitiesClient = data['totalLiabilities_Client'];

  const totalAssetsPeer = data['totalAssets_Peer'];
  const totalLiabilitiesPeer = data['totalLiabilities_Peer'];

  console.log ({
    totalAssetsClient,
    totalLiabilitiesClient,
    totalAssetsPeer,
    totalLiabilitiesPeer,
  });

  selectedYearsArray.forEach (year => {
    clientValue =
      Number (totalAssetsClient[year].value) /
      Number (totalLiabilitiesClient[year].value);
    clientArray.push (Math.round (clientValue));

    peerValue =
      getAverageOfArray (totalAssetsPeer[year]) /
      getAverageOfArray (totalLiabilitiesPeer[year]);
    peerArray.push (Math.round (peerValue));
    benchmarkArray.push (1);
  });

  const minNum = Math.min (...clientArray, ...peerArray, ...benchmarkArray);
  const maxNum = Math.max (...clientArray, ...peerArray, ...benchmarkArray);
  console.log ({minNum, maxNum});

  const chartColors = document.documentElement.classList.contains ('dark')
    ? {
        borderColor: '#374151',
        labelColor: '#ebedf0',
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: '#F3F4F6',
        labelColor: '#6B7280',
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  const chartColor = document.documentElement.classList.contains ('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const formatNumber = value => value.toLocaleString ();

  const yaxisLabelFormatter = value => {
    return `$${formatNumber (value)}`;
  };

  const tooltipFormatter = value => {
    if (!value) return;
    const formattedValue = value.toLocaleString ();
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
        name: 'Peer Avg',
        data: peerArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
      {
        name: 'Benchmark',
        data: benchmarkArray,
        style: {
          colors: [chartColors.labelColor],
        },
      },
    ],
    chart: {
      height: 450,
      width: '100%',
      type: 'line',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      curve: 'straight',
    },
    title: {
      text: 'Asset to Liability Ratio',
      align: 'top',
      style: {
        color: chartColor,
      }
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: '1.5rem',
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
            fontSize: '1.25rem',
          },
        },
        tooltip: {
          enabled: true,
        },
        ticks: {
          interval: 2
        },
        min: minNum - 1,
        max: maxNum + 1,
      },
    ],
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: seriesName => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,
      fontSize: '20px',
    },
    grid: {
      row: {
        colors: ['transparent'],
        opacity: 0.5,
        thickness: 4,
      },
    },
  };
};

const getSoiClientChartOptions = data => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage ();

  const tuitionValue =
    data['si_revenueTuitionAndFees_Client'][selectedYearsArray[0]].value;
  const auxiliaryValue =
    data['si_revenueAuxiliaryActivities_Client'][selectedYearsArray[0]].value;
  const contributionsValue =
    data['si_revenueContributions_Client'][selectedYearsArray[0]].value;
  const investmentsValue =
    data['si_revenueInvestmentIncome_Client'][selectedYearsArray[0]].value;
  const otherValue =
    data['si_revenueOther_Client'][selectedYearsArray[0]].value;

  // console.log ({
  //   tuitionValue,
  //   auxiliaryValue,
  //   contributionsValue,
  //   investmentsValue,
  //   otherValue,
  // });

  const chartColors = document.documentElement.classList.contains ('dark')
    ? {
        borderColor: '#F3F4F6',
        labelColor: '#6B7280',
        opacityFrom: 0.45,
        opacityTo: 0,
      }
    : {
        borderColor: '#374151',
        labelColor: '#ebedf0',
        opacityFrom: 0,
        opacityTo: 0.15,
      };

  const chartColor = document.documentElement.classList.contains ('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const formatNumber = value => value.toLocaleString ();

  const yaxisLabelFormatter = value => {
    return `$${formatNumber (value)}`;
  };

  const tooltipFormatter = value => {
    if (!value) return;
    const formattedValue = value.toLocaleString ();
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
      height: 450,
      type: 'pie',
    },
    labels: ['Tuition', 'Auxiliary', 'Contributions', 'Investments', 'Other'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    title: {
      text: 'CLIENT',
      align: 'top',
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
          formatter: seriesName => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: 'center',
      position: 'bottom',
      fontSize: '20px',
    },
  };
};

const getSoiPeerChartOptions = data => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage ();

  const tuitionValue = getAverageOfArray (
    data['revenueTuitionAndFees_Peer'][selectedYearsArray[0]]
  );
  const auxiliaryValue = getAverageOfArray (
    data['revenueAuxiliaryActivities_Peer'][selectedYearsArray[0]]
  );
  const contributionsValue = getAverageOfArray (
    data['revenueContributions_Peer'][selectedYearsArray[0]]
  );
  const investmentsValue = getAverageOfArray (
    data['revenueInvestmentIncome_Peer'][selectedYearsArray[0]]
  );
  const otherValue = getAverageOfArray (
    data['revenueOther_Peer'][selectedYearsArray[0]]
  );

  // console.log ({
  //   tuitionValue,
  //   auxiliaryValue,
  //   contributionsValue,
  //   investmentsValue,
  //   otherValue,
  // });

  const chartColors = document.documentElement.classList.contains ('dark')
    ? {
        borderColor: '#F3F4F6',
        labelColor: '#6B7280',
        opacityFrom: 0.45,
        opacityTo: 0,
      }
    : {
        borderColor: '#374151',
        labelColor: '#ebedf0',
        opacityFrom: 0,
        opacityTo: 0.15,
      };

  const chartColor = document.documentElement.classList.contains ('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const formatNumber = value => value.toLocaleString ();

  const yaxisLabelFormatter = value => {
    return `$${formatNumber (value)}`;
  };

  const tooltipFormatter = value => {
    if (!value) return;
    const formattedValue = value.toLocaleString ();
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
      height: 450,
      width: '100%',
      type: 'pie',
    },
    labels: ['Tuition', 'Auxiliary', 'Contributions', 'Investments', 'Other'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    stroke: {
      width: 5,
      colors: chartColors.labelColor,
    },
    title: {
      text: 'PEER',
      align: 'top',
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
          formatter: seriesName => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: 'center',
      position: 'bottom',
      fontSize: '20px',
    },
  };
};

const getFfaChartOptions = data => {
  const selectedYearsArray = getSelectedYearsFromLocalStorage ();
  currentYear = selectedYearsArray[0];

  const revenueTuitionAndFeesClient = Number (
    data['ffa_revenueTuitionAndFees_Client'][currentYear].value
  );
  const revenueSchoolServicesClient = Number (
    data['ffa_revenueScholarshipsAndFinancialAid_Client'][currentYear].value
  );
  const totalRevenueContributionsClient = Number (
    data['ffa_totalRevenueContributions_Client'][currentYear].value
  );

  const revenueAuxiliaryActivitiesClient = Number (
    data['ffa_revenueAuxiliaryActivities_Client'][currentYear].value
  );
  const revenueOtherClient = Number (
    data['ffa_revenueOther_Client'][currentYear].value
  );
  const revenueInvestmentIncomeClient = Number (
    data['ffa_revenueInvestmentIncome_Client'][currentYear].value
  );
  const revenueEndowmentSpendingAppropriationClient = Number (
    data['ffa_revenueEndowmentSpendingAppropriation_Client'][currentYear].value
  );
  const auxiliaryAndOtherClient =
    revenueAuxiliaryActivitiesClient +
    revenueOtherClient +
    revenueInvestmentIncomeClient +
    revenueEndowmentSpendingAppropriationClient;

  const contributionsClient = Number (
    data['ffa_contributions_Client'][currentYear].value
  );

  const salariesAndWagesClient = Number (
    data['ffa_salariesAndWages_Client'][currentYear].value
  );
  const employeeBenefitsClient = Number (
    data['ffa_employeeBenefits_Client'][currentYear].value
  );
  const compensationAndBenefitsClient =
    salariesAndWagesClient + employeeBenefitsClient;

  const servicesSuppliesAndOtherClient = Number (
    data['ffa_servicesSuppliesAndOther_Client'][currentYear].value
  );
  const occupancyUtilitiesAndMaintenanceClient = Number (
    data['ffa_occupancyUtilitiesAndMaintenance_Client'][currentYear].value
  );
  const depreciationAndAmortizationClient = Number (
    data['ffa_depreciationAndAmortization_Client'][currentYear].value
  );
  const interestClient = Number (
    data['ffa_interest_Client'][currentYear].value
  );
  const incomeExpenseSurplusDefecitClient = Number (
    data['ffa_incomeExpenseSurplusDefecit_Client'][currentYear].value
  );
  const generalExpenseClient =
    servicesSuppliesAndOtherClient +
    occupancyUtilitiesAndMaintenanceClient +
    depreciationAndAmortizationClient +
    interestClient +
    incomeExpenseSurplusDefecitClient;

  const dashboardSurplusDefecit_Client = Number (
    data['dashboardSurplusDefecit_Client'][currentYear].value
  );

  const chartColors = document.documentElement.classList.contains ('dark')
    ? {
        borderColor: '#F3F4F6',
        labelColor: '#ffffff',
        opacityFrom: 0.45,
        opacityTo: 0,
      }
    : {
        borderColor: '#374151',
        labelColor: '#1d2a46',
        opacityFrom: 0,
        opacityTo: 0.15,
      };

  const chartColor = document.documentElement.classList.contains ('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const formatNumber = value => value.toLocaleString ();

  const yaxisLabelFormatter = value => {
    return `$${formatNumber (value)}`;
  };

  const tooltipFormatter = value => {
    if (!value) return;
    const formattedValue = value.toLocaleString ();
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
    series: [
      {
        data: [
          {x: 'Tuition & Fees', y: [1, 5]},
          {x: 'Scholarship & Financial Aid', y: [4, 6]},
          {x: 'Unrestricted Gifts', y: [5, 8]},
          {x: 'Auxiliary & Other', y: [3, 11]},
          {x: 'Restricted Gifts', y: [2, 4]},
          {x: 'Compensation & Benefits', y: [1, 3]},
          {x: 'General Expense', y: [5, 8]},
          {x: 'Surplus/Deficit', y: [9, 11]},
        ],
      },
    ],
    chart: {
      height: 500,
      width: '100%',
      type: 'rangeBar',
    },
    dataLabels: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
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
    tooltip: {
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: seriesName => `${seriesName}:`,
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: '1rem',
        },
        rotate: -45, // Adjust the rotation angle as needed
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
            fontSize: '1.25rem',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    ],
    legend: {
      horizontalAlign: 'center',
      position: 'bottom',
      fontSize: '20px',
    },
  };
};
