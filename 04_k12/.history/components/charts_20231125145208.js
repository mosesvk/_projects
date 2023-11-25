const getMainChartOptions = (dataPeer, dataClient, numType, fixedNum = 0) => {

  // console.log('getMainChartOptions()')

  const chartColors = document.documentElement.classList.contains('dark')
    ? {
        borderColor: '#374151',
        labelColor: '#ebedf0',
        opacityFrom: 0,
        opacityTo: 0.15
      }
    : {
        borderColor: '#F3F4F6',
        labelColor: '#6B7280',
        opacityFrom: 0.45,
        opacityTo: 0
      };

  const chartColor = document.documentElement.classList.contains('dark')
    ? '#e3f0fa'
    : '#3a464f';

  const selectedYearsArray = getSelectedYearsFromLocalStorage();

  const formatNumber = (value) => value.toLocaleString();

  // console.log(selectedYearsArray, dataPeer, dataClient, fixedNum);

  ({ clientArray, peerAvg, peerMid, peerMin, peerMax } =
    getPeerAndClientChartDataArrays(selectedYearsArray, dataPeer, dataClient, fixedNum));


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
    if (!value) return 
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
      window.chartColors.red
    ],
    series: [
      {
        name: 'Client',
        type: 'column',
        data: clientArray,
        style: {
          colors: [chartColors.labelColor]
        }
      },
      {
        name: 'Avg',
        type: 'line',
        data: peerAvg,
        yaxis: 0
      },
      {
        name: 'Midpoint',
        type: 'line',
        data: peerMid,
        visible: false
      },
      {
        name: 'Min',
        type: 'line',
        data: peerMin,
        visible: false
      },
      {
        name: 'Max',
        type: 'line',
        data: peerMax,
        visible: false
      }
    ],
    chart: {
      height: 350,
      type: 'line',
      stacked: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [2, 6, 4, 4, 4]
    },
    title: {
      text: '',
      align: 'left',
      offsetX: 110
    },
    xaxis: {
      categories: selectedYearsArray,
      labels: {
        style: {
          colors: chartColors.labelColor,
          fontSize: '1rem'
        }
      }
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: chartColor
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColor,
            fontSize: '1.25rem'
          }
        },
        tooltip: {
          enabled: true
        }
      }
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topLeft',
        offsetY: 30,
        offsetX: 60
      },
      y: {
        formatter: tooltipFormatter,
        title: {
          formatter: (seriesName) => `${seriesName}:`
        }
      }
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 1-0, 
    },
    grid: {
      row: {
        colors: ['transparent'],
        opacity: 0.5,
        thickness: 4
      }
    },
    plotOptions: {
      bar: {
        barHeight: '90%'
      }
    }
  };
};



