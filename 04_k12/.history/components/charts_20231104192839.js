const getMainChartOptions = (dataPeer, dataClient) => {

  const clientArray = []
  let chartColor = '#3a464f';
  let peerAvg = [];
  let peerMid = [];
  let peerMin = [];
  let peerMax = [];
  let mainChartColors

  if (document.documentElement.classList.contains('dark')) {
    mainChartColors = {
      borderColor: '#374151',
      labelColor: '#ebedf0',
      opacityFrom: 0,
      opacityTo: 0.15
    }

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


  selectedYearsArray.forEach((year) => {
    // Check if the dataPeer array for the selected year exists
    if (dataPeer[year]) {
      const array = dataPeer[year];
  
      const avg = getAverageOfArray(array);
      const mid = getMidpointOfArray(array);
      const min = Math.min(...array);
      const max = Math.max(...array);
  
      peerAvg.push(avg);
      peerMid.push(mid);
      peerMin.push(min);
      peerMax.push(max);
      clientArray.push(dataClient[year][0]);
    } else {
      // Handle the case when dataPeer for the year is not defined
      // You can add error handling or default values as needed
      console.error(`Data for year ${year} is undefined in dataPeer`);
    }
  });
  
  return {
    plotOptions: {
      bar: {
        barHeight: "90%", // Adjust the bar height percentage as needed
      },
    },
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.orange
    ],
    series: [
      {
        name: 'Cashflow',
        type: 'column',
        data: clientArray,
        style: {
          colors: [mainChartColors.labelColor]
        }
      },
      {
        name: 'Avg',
        type: 'line',
        data: peerAvg,
        yaxis: 0
      },
      {
        name: 'Mid',
        type: 'line',
        data: peerMid,
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
      width: [2, 6, 4]
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
          colors: mainChartColors.labelColor
        }
      }, 
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
        },

      }
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topLeft',
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
        colors: ['transparent'],
        opacity: 0.5,
        thickness: 4
      }
    }
  };
  
};
