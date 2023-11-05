const getMainChartOptions = (dataPeer, dataClient) => {

  const clientArray = []
  let chartColor = '#3a464f';
  let peerAvg = [];
  let peerMid = [];
  let peerMin = [];
  let peerMax = [];

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


  let selectedYearsArray = getSelectedYearsFromLocalStorage();

  console.log('charts.js', selectedYearsArray)

  selectedYearsArray.forEach((year) => {
    console.log('in for each', year)
    const array = dataPeer[year];

    const avg = getAverageOfArray(array);
    const mid = getMidpointOfArray(array);
    const min = Math.min(...array);
    const max = Math.max(...array);

    peerAvg.push(avg);
    peerMid.push(mid);
    peerMin.push(min);
    peerMax.push(max);
    clientArray.push(dataClient[year][0])
  });

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
        data: clientArray
      },
      {
        name: 'Avg',
        type: 'line',
        data: peerAvg
      },
      {
        name: 'Mid',
        type: 'line',
        data: peerMid
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
      categories: selectedYearsArray
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
