window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(51, 204, 51)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

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
    colors: [
      window.chartColors.green,
      window.chartColors.blue,
      window.chartColors.orange
    ],
    series: [
      {
        name: 'Cashflow',
        type: 'column',
        data: [1.1, 3, 2.1, 3.4, 2.1]
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
      categories: [2015, 2016, 2017, 2018, 2019, 2020]
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
            colors: '#008FFB',
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
        opacity: 0.5 // Adjust the opacity of the horizontal gridlines
      },
      column: {
        width: 2, // Set the width of the vertical gridlines to make them thicker
        colors: ['#008FFB'] // Customize the color of the vertical gridlines
      }
    }
  };
};

if (document.getElementById('main-chart')) {
  const chart = new ApexCharts(
    document.getElementById('main-chart'),
    getMainChartOptions()
  );

  console.log(chart.ctx);
  chart.render();

  // init again when toggling dark mode
  document.addEventListener('dark-mode', function () {
    chart.updateOptions(getMainChartOptions());
  });
}
