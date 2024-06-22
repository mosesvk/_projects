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
    benchmarkArray
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

const getFpaChartOptions = (
  data
) => {
  const totalAssetsArray = Object.values(data['totaAssets_Client']).map(item => item.value);
  console.log(totalAssetsArray);

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


  // return {
  //   colors: [
  //     window.chartColors.green,
  //     window.chartColors.blue,
  //     window.chartColors.red,
  //     window.chartColors.orange,
  //     window.chartColors.grey,
  //   ],
  //   series: [
  //     {
  //       name: 'Client',
  //       type: 'column',
  //       data: clientArray,
  //       style: {
  //         colors: [chartColors.labelColor],
  //       },
  //     },
  //     {
  //       name: '25%',
  //       type: 'line',
  //       data: peer25,
  //       visible: false,
  //     },
  //     {
  //       name: '50%',
  //       type: 'line',
  //       data: peerMid,
  //       visible: false,
  //     },
  //     {
  //       name: 'Avg',
  //       type: 'line',
  //       stacked: false,
  //       data: peerAvg,
  //       yaxis: 0,
  //       style: {
  //         colors: ['transparent'], // Set the line color to transparent
  //       },
  //       fill: {
  //         type: 'gradient',
  //         gradient: {
  //           shadeIntensity: 1,
  //           opacityFrom: 0.7,
  //           opacityTo: 0.9,
  //           stops: [0, 80, 80],
  //         },
  //       },
  //     },
  //    benchmarkArray.length > 0 && {
  //       name: 'Benchmark',
  //       type: 'line',
  //       data: benchmarkArray,
  //       visible: false,
  //     },
  //     {
  //       name: '75%',
  //       type: 'line',
  //       data: peer75,
  //       visible: false,
  //     },
  //   ],
  //   chart: {
  //     height: 350,
  //     type: 'line',
  //     stacked: false,
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     width: [2, 6, 4, 4, 4],
  //   },
  //   title: {
  //     text: '',
  //     align: 'left',
  //     offsetX: 110,
  //   },
  //   xaxis: {
  //     categories: selectedYearsArray,
  //     labels: {
  //       style: {
  //         colors: chartColors.labelColor,
  //         fontSize: '1rem',
  //       },
  //     },
  //   },
  //   yaxis: [
  //     {
  //       axisTicks: {
  //         show: true,
  //       },
  //       axisBorder: {
  //         show: true,
  //         color: chartColor,
  //       },
  //       labels: {
  //         formatter: yaxisLabelFormatter,
  //         style: {
  //           colors: chartColor,
  //           fontSize: '1.25rem',
  //         },
  //       },
  //       tooltip: {
  //         enabled: true,
  //       },
  //     },
  //   ],
  //   tooltip: {
  //     fixed: {
  //       enabled: true,
  //       position: 'topLeft',
  //       offsetY: 30,
  //       offsetX: 60,
  //     },
  //     y: {
  //       formatter: tooltipFormatter,
  //       title: {
  //         formatter: seriesName => `${seriesName}:`,
  //       },
  //     },
  //   },
  //   legend: {
  //     horizontalAlign: 'center',
  //     offsetX: 40,
  //     fontSize: '20px',
  //   },
  //   grid: {
  //     row: {
  //       colors: ['transparent'],
  //       opacity: 0.5,
  //       thickness: 4,
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       barHeight: '90%',
  //     },
  //   },
  // };
};
