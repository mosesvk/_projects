const getMainChartOptions = (
    dataPeer,
    dataClient,
    numType,
    fixedNum = 0,
    mainName,
    benchmark,
    title,
    chartId
  ) => {
    // console.log('getMainChartOptions()',{ dataPeer, dataClient, numType, fixedNum, mainName, benchmark, title });
    // if (mainName == "doeOverall")
    // console.log({   dataPeer,
    //   dataClient,
    //   numType,
    //   fixedNum,
    //   mainName,
    //   benchmark,
    //   title,
    //   chartId });
  
    const selectedYearsArray = getSelectedYearsFromLocalStorage();
  
    // console.log('MAIN', {selectedYearsArray})
  
    const formatNumber = (value) => value.toLocaleString();
  
    ({ clientArray, peerAvg, peerMid, peer25, peer75, benchmarkArray } =
      getPeerAndClientChartDataArrays(
        selectedYearsArray,
        dataPeer,
        dataClient,
        fixedNum,
        mainName,
        benchmark,
        numType
      ));
  
    // if (mainName == "doeOverall")
    // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 });
  
    const chartColors = document.documentElement.classList.contains("dark")
      ? {
          borderColor: "#374151",
          labelColor: "#ebedf0",
          backgroundColor: "#000000",
          opacityFrom: 0,
          opacityTo: 0.15,
        }
      : {
          borderColor: "#F3F4F6",
          labelColor: "#000000",
          backgroundColor: "#ffffff",
          opacityFrom: 0.45,
          opacityTo: 0,
        };
  
    const chartColor = document.documentElement.classList.contains("dark")
      ? "#e3f0fa"
      : "#000000";
  
    const yaxisLabelFormatter = (value) => {
      if (numType === "dollar") {
        return `$${formatNumber(value)}`;
      } else if (numType === "percent") {
        return `${formatNumber(value)}%`;
      } else {
        return formatNumber(value);
      }
    };
  
    const tooltipFormatter = (value) => {
      if (!value) return;
      const formattedValue = value.toLocaleString();
      if (numType === "dollar") {
        return `$${formattedValue}`;
      } else if (numType === "percent") {
        return `${formattedValue}%`;
      } else {
        return formattedValue;
      }
    };
  
    // console.log({mainName, benchmark});
  
    // if (mainName == "cfi_netIncomeOperationsRatio")
    //   console.log({ dataClient, clientArray, fixedNum });
  
    let yaxisAnnotation;
  
  
    const chartEvents = {
      beforeMount: function (chartContext, config) {
        // First, wait for the chart and annotations to be rendered
        setTimeout(() => {
          const chartElement = document.getElementById(chartId);
          if (!chartElement) return;
  
          // Get the first grid line to use as reference
          const gridLine = chartElement.querySelector(
            `.apexcharts-gridlines-horizontal line`
          );
          if (!gridLine) return;
  
          // Get the annotation line (y-axis annotation)
          const annotationLine = chartElement.querySelector(
            `.apexcharts-yaxis-annotations line`
          );
          if (!annotationLine) return;
  
          // Get the exact x1 and x2 values from the grid line
          const x1 = gridLine.getAttribute("x1");
          const x2 = gridLine.getAttribute("x2");
  
          // Set the annotation line to match exactly
          annotationLine.setAttribute("x1", x1);
          annotationLine.setAttribute("x2", x2);
  
          // console.log(`Updated annotation line: x1=${x1}, x2=${x2}`);
        }, 200); // Extra delay to ensure annotations are rendered
      },
      updated: function (chartContext, config) {
        // First, wait for the chart and annotations to be rendered
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;
  
        if (chartId === "cfiRatio_chart") {
        }
  
        // Get the first grid line to use as reference
        const gridLine = chartElement.querySelector(
          `.apexcharts-gridlines-horizontal line`
        );
        if (!gridLine) return;
  
        // Get the annotation line (y-axis annotation)
        const annotationLine = chartElement.querySelector(
          `.apexcharts-yaxis-annotations line`
        );
        const yaxis = chartElement.querySelector(`.apexcharts-yaxis`);
        if (!annotationLine) return;
  
        // Get the exact x1 and x2 values from the grid line
        const x1 = gridLine.getAttribute("x1");
        const x2 = gridLine.getAttribute("x2");
  
        // Set the annotation line to match exactly
        annotationLine.setAttribute("x1", x1);
        annotationLine.setAttribute("x2", x2);
      },
    };
  
    const selectedYearsLength = selectedYearsArray.length;
    let dynamicOffsetX;
  
    switch (selectedYearsLength) {
      case 1:
        dynamicOffsetX = 30;
        break;
      case 3:
      case 2:
        dynamicOffsetX = -120;
        break;
      case 5:
      case 4:
        dynamicOffsetX = -75;
        break;
      case 6:
        dynamicOffsetX = -40;
        break;
      case 7:
        dynamicOffsetX = -10;
        break;
      case 8:
        dynamicOffsetX = 0;
        break;
      case 9:
        dynamicOffsetX = 20;
        break;
      case 10:
        dynamicOffsetX = 30;
        break;
      case 11:
        dynamicOffsetX = 40;
      default:
        dynamicOffsetX = 50;
    }
  
    if (mainName == "cfiRatio") {
      cfiRatio_annotation = [
        {
          id: "annotation",
          y: benchmark,
          borderColor: chartColors.labelColor,
          strokeDashArray: 0,
          label: {
            text: "Benchmark",
            borderColor: "transparent",
            borderWidth: 0,
            offsetX: dynamicOffsetX,
            position: "left",
            style: {
              background: "transparent",
              color: chartColors.labelColor,
              fontSize: "18px",
              fontWeight: 600,
            },
          },
        },
      ];
      yaxisAnnotation = cfiRatio_annotation;
      yaxisMax = 10;
      previousData = clientArray;
    } else if (mainName == "doeOverall") {
      const data = JSON.parse(localStorage.doeData);
      doeOverall_annotation = [
        {
          id: "annotation",
          y: benchmark,
          borderColor: chartColors.labelColor,
          strokeDashArray: 0,
          label: {
            text: "Benchmark",
            borderColor: "transparent",
            borderWidth: 0,
            offsetX: dynamicOffsetX,
            position: "left",
            style: {
              background: "transparent",
              color: chartColors.labelColor,
              fontSize: "18px",
              fontWeight: 600,
            },
          },
        },
      ];
      yaxisAnnotation = doeOverall_annotation;
      yaxisMax = Math.round(Math.max(...clientArray) + 2);
      previousData = clientArray;
  
      // console.log('doeOverall', data)
      // console.log({ selectedYearsArray });
  
      // Sort in ascending order
      selectedYearsArray.sort((a, b) => a - b);
      // console.log({ selectedYearsArray });
  
      // Sort in descending order
      const reverseYears = [...selectedYearsArray].sort((a, b) => b - a);
      // console.log({ reverseYears });
  
      reverseYears.forEach((year) => {
        const doeOverall_Client = Number(
          data.doeOverall_Client[year].value
        ).toFixed(1);
        const doePrimaryReserveRatio_Client = Number(
          data.doePrimaryReserveRatio_Client[year].value
        ).toFixed(2);
        const doePrimaryReserveStrengthFactor_Client = Number(
          data.doePrimaryReserveStrengthFactor_Client[year].value
        ).toFixed(1);
        const doePrimaryReserveOverallWeight_Client = 0.4;
        const doePrimaryReserveRatioWeighted_Client = Number(
          data.doePrimaryReserveRatioWeighted_Client[year].value
        ).toFixed(1);
        const doeEquityRatio_Client = Number(
          data.doeEquityRatio_Client[year].value
        ).toFixed(2);
        const doeEquityStrengthFactor_Client = Number(
          data.doeEquityStrengthFactor_Client[year].value
        ).toFixed(1);
        const doeEquityOverallWeight_Client = 0.4;
        const doeEquityRatioWeighted_Client = Number(
          data.doeEquityRatioWeighted_Client[year].value
        ).toFixed(1);
        const doeNetIncomeRatio_Client = Number(
          data.doeNetIncomeRatio_Client[year].value
        ).toFixed(2);
        const doeNetIncomeStrengthFactor_Client = Number(
          data.doeNetIncomeStrengthFactor_Client[year].value
        ).toFixed(1);
        const doeNetIncomeOverallWeight_Client = 0.2;
        const doeNetIncomeRatioWeighted_Client = Number(
          data.doeNetIncomeRatioWeighted_Client[year].value
        ).toFixed(1);
  
        const tableHTML = `
          <div class="flex my-6">
            <p class="text-2xl font-bold mr-4">${year}</p>
            <div id="doeClientTable_${year}" class="flex flex-col my-6">
              <div class="overflow-x-auto rounded-lg">
                <div class="inline-block min-w-full align-middle">
                  <div class="relative overflow-x-auto shadow-md">
                    <table class="w-full text-lg text-left text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-white uppercase backgroundGreen opacity-75">
                        <tr id="row_doeOverall_tableHeader">
                          <th scope="col" class="px-6 py-3 text-lg tracking-wide border-2 border-white dark:border-gray-800">Title</th>
                          <th scope="col" class="px-6 py-3 text-lg tracking-wide border-2 border-white dark:border-gray-800">Ratio</th>
                          <th scope="col" class="px-6 py-3 text-lg tracking-wide border-2 border-white dark:border-gray-800">Strength</th>
                          <th scope="col" class="px-6 py-3 text-lg tracking-wide border-2 border-white dark:border-gray-800">Weight</th>
                          <th scope="col" class="px-6 py-3 text-lg tracking-wide border-2 border-white dark:border-gray-800">Weighted</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr id="row_doeOverall_primaryReserveRatio" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">Primary Reserve Ratio</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doePrimaryReserveRatio_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doePrimaryReserveStrengthFactor_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doePrimaryReserveOverallWeight_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doePrimaryReserveRatioWeighted_Client}</th>
                        </tr>
                        <tr id="row_equityRatio" class="backgroundOffGreen border-b dark:bg-gray-700 dark:border-gray-700">
                          <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">Equity Ratio</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeEquityRatio_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeEquityStrengthFactor_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeEquityOverallWeight_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeEquityRatioWeighted_Client}</th>
                        </tr>
                        <tr id="row_doeOverall_netIncomeRatio" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">Net Income Ratio</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeNetIncomeRatio_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeNetIncomeStrengthFactor_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeNetIncomeOverallWeight_Client}</th>
                          <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-2 border-white dark:border-gray-800">${doeNetIncomeRatioWeighted_Client}</th>
                        </tr>
                      </tbody>
                      <tfoot class="text-xs text-white uppercase backgroundGreen opacity-75">
                        <th scope="col" class="px-4 py-2 text-lg tracking-wide border-2 border-white dark:border-gray-800"></th>
                        <th scope="col" class="px-4 py-2 text-lg tracking-wide border-2 border-white dark:border-gray-800"></th>
                        <th scope="col" class="px-4 py-2 text-lg tracking-wide border-2 border-white dark:border-gray-800"></th>
                        <th scope="col" class="px-4 py-2 text-lg tracking-wide border-2 border-white dark:border-gray-800">Overall Composite Score</th>
                        <th scope="col" class="px-4 py-2 text-lg tracking-wide border-2 border-white dark:border-gray-800">${doeOverall_Client}</th>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
  
        // Assuming you have a container element to append the generated HTML
        document.getElementById("doeClientTable").innerHTML += tableHTML;
      });
  
      // console.log(mainName, { clientArray });
    } else if (mainName == "cfi_primaryReserveRatio") {
      // console.log({'primaryReserve': selectedYearsArray})
      cfi_primaryReserveRatio_annotation = [
        {
          id: "annotation",
          y: benchmark,
          borderColor: chartColors.labelColor,
          strokeDashArray: 0,
          label: {
            text: "Benchmark",
            borderColor: "transparent",
            borderWidth: 0,
            position: "top",
            offsetX: dynamicOffsetX,
            style: {
              background: "transparent",
              color: chartColors.labelColor,
              fontSize: "18px",
              fontWeight: 600,
            },
          },
        },
      ];
      yaxisAnnotation = cfi_primaryReserveRatio_annotation;
      yaxisMax = Math.round(Math.max(...clientArray) + 2);
      previousData = clientArray;
    } else if (mainName == "cfi_netIncomeOperationsRatio") {
      // console.log("cfi_netIncomeOperationsRatio", {
      //   dataPeer,
      //   dataClient,
      //   peerAvg,
      //   fixedNum,
      //   mainName,
      //   benchmark,
      //   numType,
      // });
  
      cfi_netIncomeOperationsRatio_annotation = [
        {
          id: "annotation",
          y: benchmark,
          borderColor: chartColors.labelColor,
          strokeDashArray: 0,
          label: {
            text: "Benchmark",
            borderColor: "transparent",
            borderWidth: 0,
            position: "top",
            offsetX: dynamicOffsetX,
            style: {
              background: "transparent",
              color: chartColors.labelColor,
              fontSize: "18px",
              fontWeight: 600,
            },
          },
        },
      ];
      yaxisAnnotation = cfi_netIncomeOperationsRatio_annotation;
      yaxisMax = Math.round(Math.max(...clientArray) + 5);
      previousData = clientArray;
    } else if (mainName == "cfi_returnOnNetAssets") {
      cfi_returnOnNetAssets_annotation = [
        {
          id: "annotation",
          y: benchmark,
          borderColor: chartColors.labelColor,
          strokeDashArray: 0,
          label: {
            text: "Benchmark",
            borderColor: "transparent",
            borderWidth: 0,
            position: "top",
            offsetX: dynamicOffsetX,
            style: {
              background: "transparent",
              color: chartColors.labelColor,
              fontSize: "18px",
              fontWeight: 600,
            },
          },
        },
      ];
      yaxisAnnotation = cfi_returnOnNetAssets_annotation;
      yaxisMax = Math.round(Math.max(...clientArray) + 5);
      previousData = clientArray;
    } else if (mainName == "cfi_viabilityRatio") {
      // cfi_viabilityRatio
      cfi_viabilityRatio_annotation = [
        {
          id: "annotation",
          y: benchmark,
          borderColor: chartColors.labelColor,
          strokeDashArray: 0,
          label: {
            text: "Benchmark",
            borderColor: "transparent",
            borderWidth: 0,
            position: "top",
            offsetX: dynamicOffsetX,
            style: {
              background: "transparent",
              color: chartColors.labelColor,
              fontSize: "18px",
              fontWeight: 600,
            },
          },
        },
      ];
      yaxisAnnotation = cfi_viabilityRatio_annotation;
      yaxisMax = Math.round(Math.max(...clientArray) + 2);
      previousData = clientArray;
    } else {
      return;
    }
  
    const series = [
      {
        name: firmName,
        type: "column",
        data: clientArray,
      },
      {
        name: "Avg",
        type: "line",
        data: peerAvg,
      },
      {
        name: "25th",
        type: "line",
        data: peer25,
      },
      {
        name: "50th",
        type: "line",
        data: peerMid,
      },
      {
        name: "75th",
        type: "line",
        data: peer75,
      },
    ];
  
    return {
      colors: [
        window.chartColors.green,
        window.chartColors.blue,
        window.chartColors.orange,
        window.chartColors.yellow,
        window.chartColors.purple,
      ],
      series: series,
      chart: {
        toolbar: {
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
        height: 550,
        type: "line",
        zoom: {
          enabled: false,
        },
        events: chartEvents,
      },
      stroke: {
        width: [2, 3, 4, 4, 4],
        dashArray: series.map((s, i) => (i === 1 ? 4 : 0)),
      },
      title: {
        text: title,
        align: "center",
        style: {
          color: chartColor,
          fontSize: "1.5rem",
        },
        margin: 5,
        offsetY: 30,
      },
      xaxis: {
        categories: selectedYearsArray,
        labels: {
          style: {
            colors: chartColors.labelColor,
            fontSize: "1rem",
          },
        },
      },
      yaxis: {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: chartColors.labelColor,
        },
        labels: {
          formatter: yaxisLabelFormatter,
          style: {
            colors: chartColors,
            fontSize: "1rem",
          },
        },
        ...(mainName === "cfiRatio"
          ? {
              min: -4,
              max: 10,
            }
          : mainName === "doeOverall"
          ? {
              max: Math.round(Math.max(...clientArray) + 1),
            }
          : {}),
      },
      tooltip: {
        shared: true,
        intersect: false,
        fixed: {
          enabled: true,
          position: "topLeft",
        },
        y: {
          formatter: (val) => {
            let formatVal = formatDecimal(val, fixedNum);
            if (numType == "percent") return `${formatVal}%`;
            return `${formatVal}`;
          },
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
        },
      },
      legend: {
        position: "bottom",
        fontSize: "20px",
        height: 80,
        showForNullSeries: false,
        showForZeroSeries: false,
      },
      annotations: {
        yaxis: yaxisAnnotation,
      },
      markers: {
        size: 0,
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        offsetY: -20,
        formatter: (val) => {
          let formatVal = formatDecimal(val, fixedNum);
          if (numType == "percent") return `${formatVal}%`;
          return `${formatVal}`;
        },
        style: {
          fontSize: "20px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: ["#ffffff"],
        },
        background: {
          enabled: true,
          foreColor: window.chartColors.green,
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: "#ffffff",
          opacity: 0.7,
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: "#000",
            opacity: 0.45,
          },
        },
      },
    };
  };