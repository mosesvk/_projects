const getMainChartOptions = () => {
  let mainChartColors = {};

  if (document.documentElement.classList.contains('dark')) {
    mainChartColors = {
      borderColor: '#374151',
      labelColor: '#9CA3AF',
      opacityFrom: 0,
      opacityTo: 0.15
    };
  } else {
    mainChartColors = {
      borderColor: '#F3F4F6',
      labelColor: '#6B7280',
      opacityFrom: 0.45,
      opacityTo: 0
    };
  }

  return {
    series: [
      {
        name: 'Cashflow',
        type: 'column',
        data: [1.1, 3, 2.1, 3.4, 2.1]
      },
      {
        name: 'Revenue',
        type: 'line',
        data: [2, 2.9, 1.7, 1.6, 2.4]
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
      width: [1, 1, 4]
    },
    title: {
      text: '',
      align: 'left',
      offsetX: 110
    },
    xaxis: {
      categories: [2015, 2016, 2017, 2018, 2019, 2020],
      labels: {
        style: {
          fontSize: '1.5rem', // Set the desired font size here
        },
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: '#008FFB'
        },
        labels: {
          style: {
            colors: '#008FFB'
          }
        },
        title: {
          text: 'Income (thousand crores)',
          style: {
            color: '#008FFB'
          }
        },
        tooltip: {
          enabled: true
        }
      },
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
    }
  };
};

if (document.getElementById('main-chart')) {
  const chart = new ApexCharts(
    document.getElementById('main-chart'),
    getMainChartOptions()
  );

  console.log(chart.ctx)
  chart.render();

  // init again when toggling dark mode
  document.addEventListener('dark-mode', function () {
    chart.updateOptions(getMainChartOptions());
  });
}
