const getMainChartOptions = (data) => {
  let mainChartColors = {};
  let chartColor = '#3a464f';
  let peerAvg = []
  let peerMid = []
  let peerMin = []
  let peerMax = []


  if (document.documentElement.classList.contains('dark')) {
    mainChartColors = {
      borderColor: '#374151',
      labelColor: '#9CA3AF',
      opacityFrom: 0,
      opacityTo: 0.15
    };

    chartColor = '#e3f0fa';
  } else {
    mainChartColors = {
      borderColor: '#F3F4F6',
      labelColor: '#6B7280',
      opacityFrom: 0.45,
      opacityTo: 0
    };
  }

  console.log(data)

  selectedYears_Array.forEach(year => {
    const array = data[year]
    const avg = getAverageOfArray(array)
    const mid = getMidpointOfArray(array)
    const min = Math.min(...array)
    const max = Math.max(...array)

    peerAvg.push(avg)
    peerMid.push(mid)
    peerMin.push(min)
    peerMax.push(max)
  })

  return {
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.orange
    ],
    series: [
      {
        name: 'Cashflow',
        type: 'column',
        data: [18, 23, 21, 20]
      },
      {
        name: 'Avg',
        type: 'line',
        data: [2, 2.9, 1.7, 1.6, 2.4]
      },
      {
        name: 'Mid',
        type: 'line',
        data: [2.5, 3.1, 1.9, 1.9, 3.4]
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
      width: [4, 6, 4]
    },
    title: {
      text: '',
      align: 'left',
      offsetX: 110
    },
    xaxis: {
      categories: selectedYears_Array
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
          style: {
            colors: chartColor,
            fontSize: '1.25rem' // Set the desired font size here
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
        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60
      }
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40
    },
    grid: {
      row: {
        colors: ['transparent'], // Remove horizontal gridlines by setting them to transparent
        opacity: 0.5, // Adjust the opacity of the horizontal gridlines
        thickness: 4
      }
    }
  };
};





