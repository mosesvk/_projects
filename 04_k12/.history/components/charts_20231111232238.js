const getMainChartOptions = (dataPeer, dataClient, numType, fixedNum = 0) => {
  const chartColors = document.documentElement.classList.contains('dark')
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

  const chartColor = document.documentElement.classList.contains('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const formatNumber = (value) => value.toLocaleString();

  const {clientArray, peerAvg, peerMid, peerMin, peerMax} = getPeerAndClientChartDataArrays(selectedYearsArray, dataPeer, dataClient)

  console.log([clientArray, peerAvg, peerMid, peerMin, peerMax])

  const yaxisLabelFormatter = (value) => {
    if (numType === 'dollar') {
      return `$${formatNumber(value)}`;
    } else if (numType === 'percent') {
      return `${formatNumber(value)}%`;
    } else {
      return formatNumber(value);
    }
  };

  const tooltipFormatter = (value) => {
    const formattedValue = value.toLocaleString();
    if (numType === 'dollar') {
      return `$${formattedValue}`;
    } else if (numType === 'percent') {
      return `${formattedValue}%`;
    } else {
      return formattedValue;
    }
  };

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.orange,
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
        name: 'Avg',
        type: 'line',
        data: peerAvg,
        yaxis: 0,
      },
      {
        name: 'Mid',
        type: 'line',
        data: peerMid,
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
      width: [2, 6, 4],
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
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
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
