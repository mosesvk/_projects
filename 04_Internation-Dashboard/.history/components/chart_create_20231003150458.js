window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(51, 204, 51)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};



const peerLabel = {
avg: 'Peer Avg',
mid: 'Peer Mid',
min: 'Peer Min',
max: 'Peer Max'
}


const createChart = (id, type, title, subtitle, chartTitle, min, max) => {

    // Chart Title --------------------------------------------------->
   if (!chartTitle) chartTitle = null


   // type -----------------------------------------------> 
   let position_integer = function(value, index, values) {
                           return value.toLocaleString()
                            }

   let position_percent = function(value, index, values) {
                           return value.toLocaleString() + '%'
                             }// barLabelPosition_percent

   let position_dollar = function(value, index, values) {
                           return '$' + value.toLocaleString()
                           }// barLabelPosition_percent




   // show Subtitle if inserted -----------------------------------------------> 
   let showSub;
   if (subtitle) {
       showSub = {
           display: true, 
           text: subtitle, 
           font: {
               size: 26
           } 
       }
   } else {
       showSub = null
   }



   // min and max for Background Colors ------------------------------------------>
   let minNum, maxNum
   if (!min) minNum = 0
   if (!max) maxNum = 0 	



   const plugin = {
         id: 'bgColorArea',
         beforeDraw(chart) {
               const {ctx, chartArea: {left, top, width, bottom}, scales: {x, y}} = chart;
               const endTop = y.getPixelForValue(maxNum);
               const endMid = y.getPixelForValue(minNum);

               ctx.save();

               ctx.fillStyle = 'white';
               ctx.fillRect(left, top, width, endTop - top);
               ctx.fillStyle = 'white';
               ctx.fillRect(left, endTop, width, endMid - endTop);
               ctx.fillStyle = 'white';
               ctx.fillRect(left, endMid, width, bottom - endMid);
               ctx.restore();
         } //beforeDraw
   }; //plugin

       
       
// MAIN CHART ----------------------------------------------------------------------------------------------->
   
ctx = document.getElementById(id).getContext('2d')

return new Chart(ctx, {
   type: 'bar',
title: title,
   data: {
       labels: selectedYearArray,
       datasets: [
   {
       type: 'bar',
       label: 'Client',
              data: '',
               backgroundColor: [
                 '#83b240a3'
               ],
              borderColor: [
                       '#83b240'
               ],
                  borderWidth: 3,
       datalabels: {
           anchor: 'end',
           align: 'end',
           labels: {
               title: {
                   color: '#83b240',
               },
               backgroundColor: 'white'
           },
           font: {
               size: 28
           },
           formatter: (type == 'percent') ? position_percent : (type == 'dollar') ? position_dollar : position_integer
       } 
   }, { 
       type: 'line',
       label: peerLabel.avg,
       data:'',
       fill: false,
         borderColor: '#326eaa',
       borderWidth: 9,
       datalabels: {
           display: false
       }
       }, {
       type: 'line',
       label: peerLabel.mid,
       data:'',
       fill: false,
       hidden: true, 
         borderColor: '#edab20',
       borderWidth: 9,
       datalabels: {
           display: false
       }
   }, {
       type: 'line',
       label: peerLabel.min,
       data: '',
       fill: false,
       hidden: true,
         borderColor: '#CD5A2c',
       borderWidth: 9,
       datalabels: {
           display: false
       }
   }, {
       type: 'line',
       label: peerLabel.max,
       data: '',
       fill: false,
       hidden: true,
         borderColor: '#00808d',
       borderWidth: 9,
       datalabels: {
           display: false
       }
   }
   ] //datasets
   }, // data
plugins: [plugin],
  options: {
   plugins: {
       title: {
           display: true, 
           text: title,
           fullSize: true,
           font: {
               weight: 'bold',
               size: 35
           },
           backdropPadding: {
               x: 0,
               y: 2
           }
       }, 
       subtitle: showSub,
       legend: {
           labels: {
               usePointStyle: true,
               font: {
                   size: 20
               }
           }
       },
       backgrounds: {
           hbars: [{
                       from: 0,
                       to: 0,
                       color: "#c7e7c6ad"
           }, {
                       from: 0,
                       to: 0,
                       color: "#FEFCB3"
           }, {
                       from: 0,
                       to: 0,
                       color: "#F5AB96"
           }]
       },
                   backgroundRules: [{
                       backgroundColor: window.chartColors.green, 
                       yAxisSegement: 6
                   }, {
                       backgroundColor: window.chartColors.grey,
                       yAxisSegement: 12
                   }, {
                       backgroundColor: window.chartColors.red,
                       yAxisSegement: Infinity
                   }]
   }, // options>plugins
   scales: {
       y: {
           grace: '50%', 
           ticks: {
               font: {
                   size: 20
               },
                           callback: (type == 'percent') ? position_percent : (type == 'dollar') ? position_dollar : position_integer
           },
           grid: {
               borderWidth: 7,
               lineWidth: 5

           }
       }, 
       x: {
           ticks: {
               font: {
                   size: 25,
                   weight: 800
               },
           }, 
           grid: {
               borderWidth: 5
           }
       }, 
   }
   },  // options

}) //return new Chart

} // createChart



