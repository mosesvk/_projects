// ChartConfigFactory.js
// Factory for creating chart configurations

chartColors = {
  green: "#83b240",
  blue: "#326eaa",
  grey: "#c9cbcf",
  red: "#ff6384",
  orange: "#CD5A2C",
  yellow: "#EDAB20",
  purple: "#723682",
  grey: "#6c757d",
  black: "#000000",
};

class ChartConfigFactory {
  constructor() {
    // Cache for chart colors based on theme
    this.themeColors = null;
    this.updateThemeColors();

    // Add event listener to update modals when chart options are applied
    document.addEventListener("chartOptionsApplied", (event) => {
      const { chartId, mainName, options } = event.detail;
      if (options.dataPeer && options.dataClient && options.parsedData) {
        this.updateModalFromChartOptions(mainName, options);
      }
    });
  }

  // In chartConfigFactory.js - Add this new method to handle modal updates

  updateModalFromChartOptions(mainName, options) {
    const { dataPeer, dataClient, parsedData, numType, fixedNum, wa } = options;

    // Get the selected years
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || !selectedYears.length) {
      console.warn(`No selected years found for modal ${mainName}`);
      return;
    }

    // Find the modal
    const modal = document.getElementById(`${mainName}_modal`);
    if (!modal) return;

    // Find the header row
    const headerRow = modal.querySelector(`#${mainName}_modal_row`);
    if (!headerRow) return;

    // Get the table head
    let tableHead = headerRow.parentElement;

    // Clear existing rows
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling;
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add standard column headers
    this._addModalColumns(headerRow);

    // Get the chart data - use the exact same data processing as the charts
    const chartData = getPeerAndClientChartDataArrays(
      selectedYears,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      numType,
      wa,
      false, // Don't force refresh as the chart already did this
      parsedData
    );

    // Add data rows for each year
    selectedYears.forEach((year, index) => {
      const yearRow = this._createModalYearRow(mainName, year);
      tableHead.appendChild(yearRow);

      // Add client data
      if (chartData.clientArray && chartData.clientArray[index] !== undefined) {
        this._addClientDataToModalRow(
          yearRow,
          chartData.clientArray[index],
          numType,
          fixedNum
        );
      } else {
        this._addEmptyCell(yearRow);
      }

      // Add peer data
      if (chartData.peerAvg && chartData.peerAvg[index] !== undefined) {
        if (mainName == testName) {
          // console.log("updateModalFromChartOptions", {
          //   chartData: chartData.peerAvg,
          //   dataType,
          //   wa,
          //   fixedNum,
          // });
        }

        this._addPeerDataToModalRow(
          yearRow,
          chartData.peerAvg[index],
          chartData.peerMid[index],
          chartData.peer25[index],
          chartData.peer75[index],
          numType,
          fixedNum
        );
      } else {
        // Add empty cells if no peer data
        for (let i = 0; i < 4; i++) {
          this._addEmptyCell(yearRow);
        }
      }
    });
  }

  // Add helper methods for modal creation
  _addModalColumns(headerRow) {
    const columns = ["Year", "Client", "Avg", "25%", "50%", "75%"];
    columns.forEach((text) => {
      const th = document.createElement("th");
      th.className = "px-6 py-3";
      th.textContent = text;
      headerRow.appendChild(th);
    });
  }

  _createModalYearRow(mainName, year) {
    const row = document.createElement("tr");
    row.className =
      "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
    row.id = `${mainName}_modal_${year}`;

    // Add year cell
    const yearCell = document.createElement("td");
    yearCell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
    yearCell.textContent = year;
    row.appendChild(yearCell);

    return row;
  }

  _addClientDataToModalRow(row, value, dataType, fixedNum) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";

    if (value !== undefined && value !== null) {
      // Get the numeric value
      const numValue = typeof value === "number" ? value : parseFloat(value);

      // Format the valued
      let formattedValue;
      if (!isNaN(numValue) && typeof styleNumber === "function") {
        const styleType = dataType == "number" ? "num" : dataType;
        // console.log({dataType, styleType});
        formattedValue = styleNumber(numValue, styleType, fixedNum);
      } else {
        formattedValue = numValue.toFixed(fixedNum || 2);
      }

      cell.textContent = formattedValue;

      // Apply color for negative values
      if (numValue < 0) {
        cell.classList.remove("text-gray-900", "dark:text-white");
        cell.classList.add("text-red-500", "dark:text-red-400");
      }
    } else {
      cell.textContent = "-";
    }

    row.appendChild(cell);
  }

  _addPeerDataToModalRow(
    row,
    avgValue,
    midValue,
    p25Value,
    p75Value,
    dataType,
    fixedNum
  ) {
    // Add each peer data point
    this._addPeerDataCell(row, avgValue, dataType, fixedNum);
    this._addPeerDataCell(row, p25Value, dataType, fixedNum);
    this._addPeerDataCell(row, midValue, dataType, fixedNum);
    this._addPeerDataCell(row, p75Value, dataType, fixedNum);
  }

  _addPeerDataCell(row, value, dataType, fixedNum) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";

    if (value !== undefined && value !== null) {
      // Get the numeric value
      const numValue = typeof value === "number" ? value : parseFloat(value);

      // Format the value
      let formattedValue;
      if (!isNaN(numValue) && typeof styleNumber === "function") {
        const styleType = dataType == "number" ? "num" : dataType;

        formattedValue = styleNumber(numValue, styleType, fixedNum);
      } else {
        formattedValue = numValue.toFixed(fixedNum || 2);
      }

      // if (value != Math.floor)console.log("_addPeerDataCell()", { row, value, formattedValue, numValue, dataType, fixedNum });

      cell.textContent = formattedValue;

      // Apply color for negative values
      if (numValue < 0) {
        cell.classList.remove("text-gray-900", "dark:text-white");
        cell.classList.add("text-red-500", "dark:text-red-400");
      }
    } else {
      cell.textContent = "-";
    }

    row.appendChild(cell);
  }

  _addEmptyCell(row) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
    cell.textContent = "-";
    row.appendChild(cell);
  }

  // Get theme-based colors
  updateThemeColors() {
    const isDarkMode = document.documentElement.classList.contains("dark");

    this.themeColors = {
      chartColors: isDarkMode
        ? {
            borderColor: "#374151",
            labelColor: "#ebedf0",
            opacityFrom: 0,
            opacityTo: 0.15,
          }
        : {
            borderColor: "#F3F4F6",
            labelColor: "#6B7280",
            opacityFrom: 0.45,
            opacityTo: 0,
          },
      chartColor: isDarkMode ? "#e3f0fa" : "#3a464f",
      seriesColors: [
        window.chartColors.green,
        window.chartColors.blue,
        window.chartColors.orange,
        window.chartColors.yellow,
        window.chartColors.purple,
      ],
    };
  }

  // Create chart configuration based on chart type
  createConfig(type, params) {
    this.updateThemeColors();

    // Route to appropriate configuration method based on chart type
    switch (type) {
      case "main":
        return this.createMainChartConfig(params);
      case "line":
        return this.createLineChartConfig(params);
      case "cashFlow":
        return this.createCashFlowChartConfig(params);
      case "functionalAllocation":
        return this.createFunctionalAllocationConfig(params);
      case "costOfContributions":
        return this.createCostOfContributionsConfig(params);
      case "netAssetBreakdown":
        return this.createNetAssetBreakdownConfig(params);
      default:
        console.error(`Unknown chart type: ${type}`);
        return null;
    }
  }

  // Configuration for standard main charts
  createMainChartConfig({
    dataPeer,
    dataClient,
    numType,
    fixedNum = 0,
    mainName,
    wa,
    parsedData,
  }) {
    // Get latest data from localStorage
    // const refreshedData = parseStoredData(
    //   getStoredData(`${mainName.split("_")[0]}Data`)
    // );

    // if (refreshedData) {
    //   // Update dataPeer and dataClient with fresh data if available
    //   if (refreshedData[`${mainName}_Peer`]) {
    //     dataPeer = refreshedData[`${mainName}_Peer`];
    //   }
    //   if (refreshedData[`${mainName}_Client`]) {
    //     dataClient = refreshedData[`${mainName}_Client`];
    //   }
    // }

    // Special case flags
    // const isAnnualizedInvestmentReturn =
    //   mainName === "annualizedInvestmentReturn";
    // const isCostOfContributions = mainName === "costOfContributions";
    const selectedYearsArray = getSelectedYearsFromLocalStorage();

    // Get chart data with explicit data refresh
    const chartData = getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      numType,
      wa,
      true, // Add a force refresh parameter
      parsedData
    );

    // console.log('createMainChartConfig', {
    //   dataPeer,
    //   dataClient,
    //   numType,
    //   fixedNum,
    //   mainName,
    //   wa,
    //   parsedData,
    // });
    

    // Update the corresponding modal with the same data
    this.updateModalFromChartOptions(mainName, {
      dataPeer,
      dataClient,
      parsedData,
      numType,
      fixedNum,
      wa,
    });

    let clientArray = chartData.clientArray;
    let peerAvg = chartData.peerAvg;
    let peerMid = chartData.peerMid;
    let peer25 = chartData.peer25;
    let peer75 = chartData.peer75;

    // console.log("createMainChart", {
    //   mainName,
    //   chartData,
    //   numType,
    //   fixedNum,
    //   clientArray,
    //   peerAvg,
    // });

    if (numType === "percent") {
      clientArray = clientArray.map((val) =>
        val !== null && val !== undefined ? parseFloat(val) * 100 : val
      );
      peerAvg = peerAvg.map((val) =>
        val !== null && val !== undefined ? parseFloat(val) * 100 : val
      );
      peerMid = peerMid.map((val) =>
        val !== null && val !== undefined ? parseFloat(val) * 100 : val
      );
      peer25 = peer25.map((val) =>
        val !== null && val !== undefined ? parseFloat(val) * 100 : val
      );
      peer75 = peer75.map((val) =>
        val !== null && val !== undefined ? parseFloat(val) * 100 : val
      );
    }

    // Create formatters based on number type
    const formatters = this._createFormatters(numType, mainName); // Pass mainName to formatters

    // NEW: For costOfContributions, ensure we have appropriate Y-axis min/max
    let yaxisConfig = {
      axisTicks: { show: true },
      axisBorder: { show: true, color: this.themeColors.chartColor },
      labels: {
        formatter: formatters.yaxisLabelFormatter,
        style: {
          colors: this.themeColors.chartColor,
          fontSize: "1.25rem",
        }
      },
      tooltip: { enabled: true }
    };


    const series = [
      {
        name: "Client",
        type: "column",
        data: clientArray,
        style: {
          colors: [this.themeColors.chartColors.labelColor],
        },
      },
      {
        name: "Avg",
        type: "line",
        stacked: false,
        data: peerAvg,
        yaxis: 0,
      },
      {
        name: "25%",
        type: "line",
        data: peer25,
        visible: false,
      },
      {
        name: "50%",
        type: "line",
        data: peerMid,
        visible: false,
      },
      {
        name: "75%",
        type: "line",
        data: peer75,
        visible: false,
      },
    ];

    // Store numType in chart's global state
    const chartConfig = {
      colors: this.themeColors.seriesColors,
      series: series,
      chart: {
        height: 550,
        type: "line",
        stacked: false,
        zoom: {
          enabled: false,
        },
        padding: {
          bottom: 20,
        },
        // Add numType to chart's global state
        events: {
          mounted: function(chart) {
            chart.w.globals.numType = numType;
          }
        }
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        offsetY: -20,
        formatter: function (value) {
          // Special formatting for costOfContributions


          // Round numeric values to nearest integer when fixedNum is 0
          if (numType === "number" && fixedNum === 0) {
            return Math.round(value).toString(); // This will round 51.5567224361063 to "52"
          } else if (value > 10000) {
            return formatters.formatLargeNumber(value);
          } else {
            if (numType === "percent") {
              // For percentages, round to the specified number of decimal places
              return `${parseFloat(value).toFixed(fixedNum)}%`;
            } else {
              // For all other cases, apply the specified decimal places
              return parseFloat(value).toFixed(fixedNum);
            }
          }
        },
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: this.themeColors.seriesColors,
        },
        background: {
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
      stroke: {
        width: [2, 3, 4, 4, 4],
        dashArray: series.map((s, i) => (i === 1 ? 4 : 0)),
      },
      title: {
        text: "",
        align: "left",
        offsetX: 110,
      },
      xaxis: {
        categories: selectedYearsArray,
        labels: {
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
          },
        },
      },
      yaxis: [yaxisConfig], // NEW: Use our configurable yaxis
      tooltip: {
        enabled: true,
        fixed: {
          enabled: true,
          position: "topLeft",
          offsetY: 30,
          offsetX: 60,
        },
        y: {
          formatter: function (value) {
        

            
            if (value > 10000) {
              return formatters.tooltipFormatter(value);
            } else {
              if (numType == "percent") {
                return `${value.toFixed(fixedNum)}%`;
              } else if (numType == "dollar") {
                return styleNumber(value, "dollar", fixedNum);
              } else {
                // Handle the case for "number" type with values <= 10000
                return styleNumber(value, "num", fixedNum);
              }
            }
          },
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
        },
      },
      legend: {
        horizontalAlign: "center",
        offsetX: 20,
        fontSize: "20px",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
          thickness: 4,
        },
        padding: {
          bottom: 20,
        },
      },
      plotOptions: {
        bar: {
          barHeight: "90%",
        },
      },
      toolbar: {
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    };

    return chartConfig;
  }

  /**
   * Calculate nice rounded y-axis limits and tick amount for evenly spaced ticks
   * @param {number} minValue - Minimum data value
   * @param {number} maxValue - Maximum data value
   * @param {number} tickCount - Desired number of ticks (default: 5)
   * @returns {Object} Object with rounded min, max, and tickAmount
   */
  _calculateNiceYAxisTicks(minValue, maxValue, tickCount = 5) {
    if (minValue === maxValue) {
      return { min: minValue - 1, max: maxValue + 1, tickAmount: tickCount };
    }

    const range = maxValue - minValue;
    const absMax = Math.max(Math.abs(minValue), Math.abs(maxValue));
    
    // Calculate nice step size using the range
    const rawStep = range / (tickCount - 1);
    const stepMagnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalizedStep = rawStep / stepMagnitude;
    
    // Round to nice step values (1, 2, 5, 10, 20, 50, etc.)
    let niceStep;
    if (normalizedStep <= 1) {
      niceStep = 1 * stepMagnitude;
    } else if (normalizedStep <= 2) {
      niceStep = 2 * stepMagnitude;
    } else if (normalizedStep <= 5) {
      niceStep = 5 * stepMagnitude;
    } else {
      niceStep = 10 * stepMagnitude;
    }

    // Round min down and max up to nice values that align with the step
    const niceMin = Math.floor(minValue / niceStep) * niceStep;
    const niceMax = Math.ceil(maxValue / niceStep) * niceStep;
    
    // Calculate actual tick amount based on nice step
    // Note: ApexCharts tickAmount = number of intervals (not number of labels)
    // So if we want 6 labels, we need tickAmount = 5
    const numIntervals = Math.round((niceMax - niceMin) / niceStep);
    
    return {
      min: niceMin,
      max: niceMax,
      tickAmount: Math.min(Math.max(numIntervals, tickCount - 1), 6) // Number of intervals, cap at 6
    };
  }

  // Configuration for line charts
  createLineChartConfig({
    dataPeer,
    dataClient,
    numType,
    fixedNum = 0,
    mainName,
    wa,
    parsedData,
    benchmark,
    title,
  }) {
    const selectedYearsArray = getSelectedYearsFromLocalStorage();
    let clientArray = [],
      peerAvg = [],
      peerMid = [],
      peer25 = [],
      peer75 = [];

    try {
      // Use the modified data type for data processing
      const result = getPeerAndClientChartDataArrays(
        selectedYearsArray,
        dataPeer,
        dataClient,
        fixedNum,
        mainName,
        numType, 
        wa,
        true,
        parsedData
      );

      clientArray = result.clientArray || [];
      peerAvg = result.peerAvg || [];
      peerMid = result.peerMid || [];
      peer25 = result.peer25 || [];
      peer75 = result.peer75 || [];
    } catch (error) {
      console.error(`Error getting chart data for ${mainName}:`, error);
      clientArray = selectedYearsArray.map(() => null);
      peerAvg = selectedYearsArray.map(() => null);
      peerMid = selectedYearsArray.map(() => null);
      peer25 = selectedYearsArray.map(() => null);
      peer75 = selectedYearsArray.map(() => null);
    }

    // Create formatters based on number type
    const formatters = this._createFormatters(numType);

    // Build series array based on available data
    const series = [];

    // Only add client data if it has valid values
    if (
      clientArray.length > 0 &&
      clientArray.some((val) => val !== null && val !== 0)
    ) {
      series.push({
        name: firmName || "Client",
        type: "line",
        data: clientArray,
        style: {
          colors: [this.themeColors.chartColors.labelColor],
        },
      });
    }

    // Only add peer average data if it has valid values
    const hasPeerData =
      peerAvg.length > 0 && peerAvg.some((val) => val !== null && val !== 0);
    if (hasPeerData) {
      series.push({
        name: "Peer Avg",
        type: "line",
        data: peerAvg,
        yaxis: 0,
      });
    }

    // Calculate dynamic axis limits
    const allValues = [...clientArray, ...peerAvg].filter(
      (val) => val !== null && val !== undefined
    );
    let minValue = allValues.length > 0 ? (Math.min(...allValues) > 0 ? 0 : Math.min(...allValues)) : 0;
    let maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;
    
    // Add padding for better visualization
    const padding = allValues.length > 0 ? (maxValue - minValue) * 0.1 : 0;
    minValue = minValue - padding;
    maxValue = maxValue + padding;

    // Configure y-axis
    let yAxisConfig = {
      min: minValue,
      max: maxValue,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: this.themeColors.chartColor,
      },
      labels: {
        formatter: function(val) {
          // For all charts, use simple rounding
          if (val === null || val === undefined || val === 0) {
            return numType === "dollar" ? "$0" : numType === "percent" ? "0%" : "0";
          }
          
          // Round based on magnitude
          if (Math.abs(val) >= 1000000) {
            // For millions, show with 1 decimal place
            const roundedVal = Math.round(val / 100000) / 10;
            return numType === "dollar" ? `$${roundedVal}M` : 
                   numType === "percent" ? `${roundedVal}%` : `${roundedVal}M`;
          } else if (Math.abs(val) >= 1000) {
            // For thousands, round to nearest thousand
            const roundedVal = Math.round(val / 1000);
            return numType === "dollar" ? `$${roundedVal}K` : 
                   numType === "percent" ? `${roundedVal}%` : `${roundedVal}K`;
          } else {
            // For small numbers, round to integers
            const roundedVal = Math.round(val);
            return numType === "dollar" ? `$${roundedVal}` : 
                   numType === "percent" ? `${roundedVal}%` : `${roundedVal}`;
          }
        },
        style: {
          colors: this.themeColors.chartColor,
          fontSize: "1.25rem",
        }
      },
      tooltip: {
        enabled: true,
      }
    };

    // Special case for changeInNetAssets and liquidityAssetsAvailableCover charts - ensure evenly spaced, rounded ticks
    if (mainName === "changeInNetAssets" || mainName === "liquidityAssetsAvailableCover") {
      const niceTicks = this._calculateNiceYAxisTicks(minValue, maxValue, 5);
      yAxisConfig = {
        min: niceTicks.min,
        max: niceTicks.max,
        tickAmount: niceTicks.tickAmount,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: this.themeColors.chartColor,
        },
        labels: {
          formatter: function(val) {
            if (val === null || val === undefined || val === 0) {
              return numType === "dollar" ? "$0" : numType === "percent" ? "0%" : "0";
            }
            
            // Round to clean values for display
            if (Math.abs(val) >= 1000000) {
              // Round to whole millions for cleaner display
              const roundedVal = Math.round(val / 1000000);
              return numType === "dollar" ? `$${roundedVal}M` : 
                     numType === "percent" ? `${roundedVal}%` : `${roundedVal}M`;
            } else if (Math.abs(val) >= 1000) {
              // Round to whole thousands
              const roundedVal = Math.round(val / 1000);
              return numType === "dollar" ? `$${roundedVal}K` : 
                     numType === "percent" ? `${roundedVal}%` : `${roundedVal}K`;
            } else {
              // Round to integers
              const roundedVal = Math.round(val);
              return numType === "dollar" ? `$${roundedVal}` : 
                     numType === "percent" ? `${roundedVal}%` : `${roundedVal}`;
            }
          },
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
          }
        },
        tooltip: {
          enabled: true,
        }
      };
    }

    // Special case for assetsWithoutPpeToLiabilitiesWithoutDebt chart - ensure evenly spaced, clean ticks
    if (mainName === "assetsWithoutPpeToLiabilitiesWithoutDebt") {
      const niceTicks = this._calculateNiceYAxisTicks(minValue, maxValue, 5);
      yAxisConfig = {
        min: niceTicks.min,
        max: niceTicks.max,
        tickAmount: niceTicks.tickAmount,
        labels: {
          formatter: function(val) {
            // For this special chart, always use integer values
            if (val === null || val === undefined || val === 0) {
              return "0";
            }
            
            // Always round to integers
            return Math.round(val).toString();
          },
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
          }
        },
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: this.themeColors.chartColor
        },
        tooltip: {
          enabled: true
        }
      };
    }

    return {
      colors: [
        window.chartColors.green,
        window.chartColors.blue,
        window.chartColors.black,
      ],
      series: series,
      chart: {
        height: 550,
        type: "line",
        // Add numType to chart's global state
        events: {
          mounted: function(chart) {
            chart.w.globals.numType = numType;
          }
        },
        title: {
          text: title || mainName,
          align: "top",
          style: {
            color: this.themeColors.chartColor,
            fontSize: "20px",
          },
        },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
        padding: {
          bottom: 20,
        },
      },
      dataLabels: {
        enabled: series.length > 0,
        formatter: function (value) {
          if (value === null || value === undefined) return "";
          // Format the value based on data type with exact decimal places
          if (numType === "dollar") {
            // For dollar type, add $ prefix and format with fixedNum decimal places
            if (Math.abs(value) >= 1000000) {
              return `$${(value / 1000000).toFixed(fixedNum)}M`;
            } else if (Math.abs(value) >= 1000) {
              return `$${(value / 1000).toFixed(fixedNum)}K`;
            }
            return `$${value.toFixed(fixedNum)}`;
          } else if (numType === "percent") {
            // For percent type, format with fixedNum decimal places and add % suffix
            return `${value.toFixed(fixedNum)}%`;
          } else {
            // For regular numbers, just format with fixedNum decimal places
            if (Math.abs(value) >= 1000000) {
              return `${(value / 1000000).toFixed(fixedNum)}M`;
            } else if (Math.abs(value) >= 1000) {
              return `${(value / 1000).toFixed(fixedNum)}K`;
            }
            return value.toFixed(fixedNum);
          }
        },
        textAnchor: "middle",
        offsetY: -10,
        style: {
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: this.themeColors.chartColors.borderColor,
          opacity: 0.9,
        },
      },
      stroke: {
        width: series.map(() => 3),
        curve: "smooth",
        dashArray: series.map((s, i) => (i === 1 ? 5 : 0)),
      },
      markers: {
        size: 5,
        hover: {
          size: 7,
        },
      },
      xaxis: {
        type: "category",
        categories: selectedYearsArray,
        tickPlacement: "between",
        labels: {
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
          },
        },
        axisBorder: {
          show: true,
          color: this.themeColors.chartColors.borderColor,
        },
        crosshairs: {
          show: true,
          position: "back",
          stroke: {
            color: this.themeColors.chartColors.borderColor,
            width: 1,
            dashArray: 3,
          },
        },
      },
      yaxis: yAxisConfig,
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        followCursor: false,
        fixed: {
          enabled: true,
          position: "topLeft",
          offsetY: 30,
          offsetX: 60,
        },
        y: {
          formatter: function (value, { seriesIndex }) {
            if (value === null || value === undefined) return "";
            if (seriesIndex <= 1) {
              // Format for bar charts (dollar values)
              return `$${value.toLocaleString()}`;
            } else {
              // Format for line charts (ratios)
              return `$${value.toFixed(2)}`;
            }
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "20px",
      },
      grid: {
        borderColor: this.themeColors.chartColors.borderColor,
        row: {
          colors: ["transparent"],
          opacity: 0.5,
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          bottom: 20,
        },
      },
      noData: {
        text: "No data available",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: this.themeColors.chartColor,
          fontSize: "16px",
          fontFamily: "Helvetica, Arial, sans-serif",
        },
      },
      toolbar: {
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    };
  }

  // Configuration for cash flow charts
  createCashFlowChartConfig({
    data,
    financing,
    investing,
    operating,
    total,
    seriesData, // Accept seriesData parameter
  }) {
    // If seriesData is not provided, we'll use empty series
    const chartSeries = seriesData || [];

    // Get selected years array for categories
    const selectedYearsArray = getSelectedYearsFromLocalStorage();

    // Create formatters for cash flow
    const formatters = this._createCashFlowFormatters();

    return {
      colors: this.themeColors.seriesColors,
      series: chartSeries,
      chart: {
        type: "bar",
        height: 550,
        zoom: {
          enabled: false,
        },
        // Add numType to chart's global state
        events: {
          mounted: function(chart) {
            chart.w.globals.numType = 'dollar';
          }
        },
        padding: {
          bottom: 20,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: selectedYearsArray,
        labels: {
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
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
            color: this.themeColors.chartColor,
          },
          labels: {
            // Use yaxis formatter instead of regular formatter
            formatter: formatters.yaxisFormatter,
            style: {
              colors: this.themeColors.chartColor,
              fontSize: "1.25rem",
            },
          },
          tooltip: {
            enabled: true,
          }
        },
      ],
      tooltip: {
        y: {
          formatter: formatters.tooltipFormatter,
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
        },
      },
      legend: {
        horizontalAlign: "center",
        fontSize: "20px",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
        },
        padding: {
          bottom: 20,
        },
      },
      toolbar: {
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    };
  }

  // Configuration for functional allocation charts
  createFunctionalAllocationConfig({
    dataPeer,
    dataClient,
    numType,
    fixedNum = 0,
    mainName,
    wa,
    parsedData,
  }) {
    const selectedYearsArray = getSelectedYearsFromLocalStorage() || [];

    if (!Array.isArray(selectedYearsArray) || selectedYearsArray.length === 0) {
      return { noData: { text: "No years selected" } };
    }

    const functionalExpensePercent_program_weightedAverage = (
      data,
      name,
      year
    ) => {
      // [02.03Exp - 01 Program Expenses]
      // /
      // [02.03Exp - 05 Total Expenses]

      const programExpenses = year
        ? getSumOfArray(data.programExpenses[name][year])
        : getSumOfArray(data.programExpenses[name]["total"]);

      const totalExpenses = year
        ? getSumOfArray(data.totalExpenses[name][year])
        : getSumOfArray(data.totalExpenses[name]["total"]);

      return totalExpenses > 0 ? programExpenses / totalExpenses : 0;
    };

    try {
      if (!parsedData) {
        throw new Error("No data available");
      }

      // Extract and process data
      const years = selectedYearsArray.length;
      let programClientArray = new Array(years).fill(null);
      let adminClientArray = new Array(years).fill(null);
      let fundraisingClientArray = new Array(years).fill(null);
      let programPeerAvg = new Array(years).fill(null);

      // Process program expenses data
      if (parsedData["functionalExpensePercent_program_Client"]) {
        selectedYearsArray.forEach((year, index) => {
          if (parsedData["functionalExpensePercent_program_Client"][year]) {
            const value = parseFloat(
              parsedData["functionalExpensePercent_program_Client"][year]
                .value * 100
            );
            programClientArray[index] = isNaN(value) ? null : Math.round(value);
          }
        });
      }

      // Process admin expenses data
      if (parsedData["functionalExpensePercent_administrative_Client"]) {
        selectedYearsArray.forEach((year, index) => {
          if (
            parsedData["functionalExpensePercent_administrative_Client"][year]
          ) {
            const value = parseFloat(
              parsedData["functionalExpensePercent_administrative_Client"][year]
                .value * 100
            );
            adminClientArray[index] = isNaN(value) ? null : Math.round(value);
          }
        });
      }

      // Process fundraising expenses data
      if (parsedData["functionalExpensePercent_fundraising_Client"]) {
        selectedYearsArray.forEach((year, index) => {
          if (parsedData["functionalExpensePercent_fundraising_Client"][year]) {
            const value = parseFloat(
              parsedData["functionalExpensePercent_fundraising_Client"][year]
                .value * 100
            );
            fundraisingClientArray[index] = isNaN(value)
              ? null
              : Math.round(value);
          }
        });
      }

      // Calculate peer average for program expenses - always use weighted average
      selectedYearsArray.forEach((year, index) => {
        try {
          // Calculate weighted average for the specific year
          let weightedAvg = functionalExpensePercent_program_weightedAverage(
            parsedData,
            "functionalExpensePercent_program",
            year
          );

          // Convert to percentage and format
          // Use Math.round() to match the rounding behavior in functionalExpensePercent_program_chart
          // which uses toFixed(0) for fixedNum=0, ensuring both charts display the same value
          weightedAvg *= 100;
          programPeerAvg[index] = isNaN(weightedAvg)
            ? null
            : Math.round(weightedAvg);

          // console.log(
          //   `Using weighted average for ${year}: ${programPeerAvg[index]}%`
          // );
        } catch (error) {
          // Instead of falling back to regular average, propagate the error
          console.error(
            `Error calculating weighted average for ${year}:`,
            error
          );
          throw new Error(
            `Failed to calculate weighted average for year ${year}: ${error.message}`
          );
        }
      });

      // console.log("createFunctionalAllocationConfig", {
      //   programClientArray,
      //   adminClientArray,
      //   fundraisingClientArray,
      //   programPeerAvg,
      // });

      // Define series colors
      const seriesColors = [
        window.chartColors.blue,
        window.chartColors.yellow,
        window.chartColors.red,
        window.chartColors.black,
      ];

      return {
        colors: seriesColors,
        series: [
          {
            name: "Program Expenses",
            type: "column",
            data: programClientArray,
          },
          {
            name: "Administrative Expenses",
            type: "column",
            data: adminClientArray,
          },
          {
            name: "Fundraising Expenses",
            type: "column",
            data: fundraisingClientArray,
          },
          {
            name: "Peer Average Program Expense",
            type: "line",
            data: programPeerAvg,
          },
        ],
        chart: {
          height: 550,
          type: "bar",
          stacked: true,
          zoom: {
            enabled: false,
          },
          // Add numType to chart's global state
          events: {
            mounted: function(chart) {
              chart.w.globals.numType = 'percent';
            }
          },
          toolbar: {
            show: false,
          },
          padding: {
            bottom: 20,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        xaxis: {
          categories: selectedYearsArray,
          labels: {
            style: {
              colors: this.themeColors.chartColors.labelColor,
              fontSize: "1rem",
            },
          },
        },
        yaxis: {
          max: 100,
          labels: {
            formatter: (value) => `${value}%`,
            style: {
              colors: this.themeColors.chartColor,
              fontSize: "1.25rem",
            },
          }
        },
        legend: {
          horizontalAlign: "center",
          fontSize: "20px",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [3],
          offsetY: -20,
          formatter: (value) => `${value}%`,
          style: {
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            colors: seriesColors,
          },
          background: {
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
        stroke: {
          width: [0, 0, 0, 4],
        },
        markers: {
          size: [0, 0, 0, 5],
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: (value) =>
              value ? `${value.toLocaleString()}%` : "N/A",
          },
        },
        toolbar: {
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
        },
      };
    } catch (error) {
      console.error("Error generating chart options:", error);
      return {
        series: [],
        chart: {
          height: 550,
          type: "bar",
          padding: {
            bottom: 20,
          },
        },
        noData: {
          text: "Error loading chart data",
        },
      };
    }
  }

  // Configuration for cost of contributions detail view
  createCostOfContributionsConfig({
    dataPeer,
    dataClient,
    numType = 'dollar',
    fixedNum = 2,
    mainName,
    wa,
    parsedData,
  }) {
    const selectedYearsArray = getSelectedYearsFromLocalStorage();

    // Extract fundraising expenses data
    const fundraisingExpensesData = [];
    selectedYearsArray.forEach((year) => {
      if (
        parsedData["fundraisingExpense_Client"] &&
        parsedData["fundraisingExpense_Client"][year] &&
        parsedData["fundraisingExpense_Client"][year].value
      ) {
        fundraisingExpensesData.push(
          Number(parsedData["fundraisingExpense_Client"][year].value)
        );
      } else {
        fundraisingExpensesData.push(0);
      }
    });

    // Extract total contributions data
    const totalContributionsData = [];
    selectedYearsArray.forEach((year) => {
      if (
        parsedData["contributionsWithAndWithoutSum_Client"] &&
        parsedData["contributionsWithAndWithoutSum_Client"][year] &&
        parsedData["contributionsWithAndWithoutSum_Client"][year].value
      ) {
        totalContributionsData.push(
          Number(
            parsedData["contributionsWithAndWithoutSum_Client"][year].value
          )
        );
      } else {
        totalContributionsData.push(0);
      }
    });

    // Get client and peer cost of contributions ratio
    let costOfContributionsClient = [];
    let costOfContributionsPeer = [];

    try {
      const result = getPeerAndClientChartDataArrays(
        selectedYearsArray,
        dataPeer,
        dataClient,
        fixedNum,
        "costOfContributions",
        "dollar",
        wa,
        true,
        parsedData
      );

      costOfContributionsClient = result.clientArray || [];
      costOfContributionsPeer = result.peerAvg || [];
    } catch (error) {
      console.error("Error getting chart data arrays:", error);
      costOfContributionsClient = selectedYearsArray.map(() => 0);
      costOfContributionsPeer = selectedYearsArray.map(() => 0);
    }

    // Calculate dynamic axis limits with evenly spaced ticks
    const allDollarValues = [
      ...fundraisingExpensesData,
      ...totalContributionsData,
    ].filter((v) => !isNaN(v) && v !== null);

    // Use the nice y-axis ticks calculation for clean, evenly spaced intervals
    const minDollarValue = allDollarValues.length > 0 ? Math.min(0, Math.min(...allDollarValues)) : 0;
    const maxDollarValue = allDollarValues.length > 0 ? Math.max(...allDollarValues) : 1000000;
    const dollarAxisTicks = this._calculateNiceYAxisTicks(minDollarValue, maxDollarValue, 5);
    
    const safeMinDollarValue = dollarAxisTicks.min;
    const safeMaxDollarValue = dollarAxisTicks.max;
    const dollarTickAmount = dollarAxisTicks.tickAmount;

    const allRatioValues = [
      ...costOfContributionsClient,
      ...costOfContributionsPeer,
    ].filter((v) => !isNaN(v) && v !== null);

    // Use nice y-axis ticks calculation for clean, evenly spaced ratio intervals
    const minRatioValue = allRatioValues.length > 0 ? Math.min(0, Math.min(...allRatioValues)) : 0;
    const maxRatioValue = allRatioValues.length > 0 ? Math.max(...allRatioValues) : 0.1;
    const ratioAxisTicks = this._calculateNiceYAxisTicks(minRatioValue, maxRatioValue, 5);
    
    const safeMinRatioValue = ratioAxisTicks.min;
    const safeMaxRatioValue = ratioAxisTicks.max;
    const ratioTickAmount = ratioAxisTicks.tickAmount;

    // Store axis values in chart's global state for persistence (including tickAmount for proper restoration)
    const axisValues = {
      dollarAxis: {
        min: safeMinDollarValue,
        max: safeMaxDollarValue,
        tickAmount: dollarTickAmount
      },
      ratioAxis: {
        min: safeMinRatioValue,
        max: safeMaxRatioValue,
        tickAmount: ratioTickAmount
      }
    };

    const seriesColors = [
      window.chartColors.blue, // Fundraising expenses
      window.chartColors.green, // Total contributions
      window.chartColors.red, // Client cost ratio
      window.chartColors.grey, // Peer average ratio
    ];

    return {
      colors: seriesColors,
      series: [
        {
          name: "Fundraising Expenses",
          type: "column",
          data: fundraisingExpensesData,
          yAxisIndex: 0
        },
        {
          name: "Total Contributions",
          type: "column",
          data: totalContributionsData,
          yAxisIndex: 0
        },
        {
          name: firmName,
          type: "line",
          data: costOfContributionsClient,
          yAxisIndex: 2
        },
        {
          name: "Peer Average",
          type: "line",
          data: costOfContributionsPeer,
          yAxisIndex: 2
        },
      ],
      chart: {
        height: 550,
        type: "bar",
        stacked: false,
        zoom: {
          enabled: false,
        },
        events: {
          mounted: function(chart) {
            // Store axis values in chart's global state
            chart.w.globals.axisValues = axisValues;
            chart.w.globals.numType = numType;
          },
          // Note: Removed updated event - y-axis restoration is now handled by print_base64.js
        },
        toolbar: {
          show: false,
        },
        padding: {
          bottom: 20,
          top: 40,
          left: 10,
          right: 10,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          distributed: false,
          dataLabels: {
            position: 'top',
            maxItems: 100,
            hideOverflowingLabels: false,
            orientation: 'horizontal',
          },
        }
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1, 2, 3],
        offsetY: -25,
        offsetX: 0,
        textAnchor: 'middle',
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: seriesColors,
        },
        formatter: function(value, { seriesIndex, dataPointIndex }) {
          // For bar series, ALWAYS return a formatted value - never empty string
          if (seriesIndex === 0 || seriesIndex === 1) {
            // Bar series - always show label
            if (value === null || value === undefined) {
              return "$0";
            }
            if (value === 0) {
              return "$0";
            }
            
            const isNegative = value < 0;
            const absValue = Math.abs(value);
            
            let formattedValue;
            if (absValue >= 1000000) {
              const millions = absValue / 1000000;
              const isWholeNumber = millions === Math.floor(millions);
              formattedValue = isWholeNumber ? `${Math.floor(millions)}M` : `${millions.toFixed(1)}M`;
            } else if (absValue >= 1000) {
              formattedValue = `${(absValue / 1000).toFixed(0)}K`;
            } else {
              formattedValue = absValue.toFixed(2);
            }
            
            return `${isNegative ? "-" : ""}$${formattedValue}`;
          } else {
            // Line series
            if (value === null || value === undefined) {
              return "";
            }
            if (value === 0) {
              return "$0";
            }
            
            const isNegative = value < 0;
            const absValue = Math.abs(value);
            
            let formattedValue;
            if (absValue >= 1000000) {
              const millions = absValue / 1000000;
              const isWholeNumber = millions === Math.floor(millions);
              formattedValue = isWholeNumber ? `${Math.floor(millions)}M` : `${millions.toFixed(1)}M`;
            } else if (absValue >= 1000) {
              formattedValue = `${(absValue / 1000).toFixed(0)}K`;
            } else {
              formattedValue = absValue.toFixed(2);
            }
            
            return `${isNegative ? "-" : ""}$${formattedValue}`;
          }
        },
        background: {
          enabled: true,
          padding: 4,
          borderRadius: 2,
          borderWidth: 0,
          opacity: 0.9,
        },
      },
      stroke: {
        width: [0, 0, 3, 3], // Width for each series
        curve: "smooth",
      },
      markers: {
        size: [0, 0, 4, 4], // Size for each series
        colors: [null, null, window.chartColors.red, window.chartColors.grey],
        strokeWidth: 2,
      },
      xaxis: {
        categories: selectedYearsArray,
        labels: {
          style: {
            colors: this.themeColors.chartColors.labelColor,
            fontSize: "1rem",
          },
        },
      },
      yaxis: [
        {
          labels: {
            formatter: function (value) {
              if (value === null || value === undefined || value === 0) return "$0";
              
              const isNegative = value < 0;
              const absValue = Math.abs(value);
              
              let formattedValue;
              if (absValue >= 1000000) {
                const millions = absValue / 1000000;
                const isWholeNumber = millions === Math.floor(millions);
                formattedValue = isWholeNumber ? `${Math.floor(millions)}M` : `${millions.toFixed(1)}M`;
              } else if (absValue >= 1000) {
                formattedValue = `${(absValue / 1000).toFixed(0)}K`;
              } else {
                formattedValue = absValue.toFixed(2);
              }
              
              return `${isNegative ? "-" : ""}$${formattedValue}`;
            },
            style: {
              colors: this.themeColors.chartColor,
              fontSize: "1.25rem",
            },
          },
          min: safeMinDollarValue,
          max: safeMaxDollarValue,
          tickAmount: dollarTickAmount,
        },
        {
          show: false,
          min: safeMinDollarValue,
          max: safeMaxDollarValue,
          tickAmount: dollarTickAmount
        },
        {
          labels: {
            formatter: function (value) {
              if (value === null || value === undefined || value === 0) return "$0.00";
              
              const isNegative = value < 0;
              const absValue = Math.abs(value);
              
              return `${isNegative ? "-" : ""}$${absValue.toFixed(2)}`;
            },
            style: {
              colors: this.themeColors.chartColor,
              fontSize: "1.25rem",
            },
          },
          opposite: true,
          min: safeMinRatioValue,
          max: safeMaxRatioValue,
          tickAmount: ratioTickAmount
        },
        {
          show: false,
          min: safeMinRatioValue,
          max: safeMaxRatioValue,
          tickAmount: ratioTickAmount
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (value, { seriesIndex }) {
            if (value === null || value === undefined) return "";
            if (seriesIndex <= 1) {
              // Format for bar charts (dollar values)
              return `$${value.toLocaleString()}`;
            } else {
              // Format for line charts (ratios)
              return `$${value.toFixed(2)}`;
            }
          },
        },
      },
      legend: {
        position: "bottom",
        fontSize: "20px",
        horizontalAlign: "center", // Ensures horizontal alignment
        itemMargin: {
          horizontal: 15, // Add horizontal spacing between items
          vertical: 5, // Reduce vertical spacing
        },
        formatter: function (seriesName, opts) {
          // Optionally use shorter names if needed
          return seriesName;
        },
      },
      grid: {
        padding: {
          bottom: 20,
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      toolbar: {
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    };
  }

  // Configuration for net asset breakdown charts
  createNetAssetBreakdownConfig({
    dataPeer,
    dataClient,
    numType,
    fixedNum = 0,
    mainName,
    wa,
    parsedData,
  }) {
    const selectedYearsArray = getSelectedYearsFromLocalStorage();

    // Extract net assets without donor restrictions data
    const netAssetsWithoutDRData = [];
    selectedYearsArray.forEach((year) => {
      if (
        parsedData["netAssetsWithoutDonorRestrictions_Client"] &&
        parsedData["netAssetsWithoutDonorRestrictions_Client"][year] &&
        parsedData["netAssetsWithoutDonorRestrictions_Client"][year].value
      ) {
        netAssetsWithoutDRData.push(
          Number(
            parsedData["netAssetsWithoutDonorRestrictions_Client"][year].value
          )
        );
      } else {
        netAssetsWithoutDRData.push(0);
      }
    });

    // Extract net assets with donor restrictions data
    const netAssetsWithDRData = [];
    selectedYearsArray.forEach((year) => {
      if (
        parsedData["netAssetsWithDonorRestrictionsSum_Client"] &&
        parsedData["netAssetsWithDonorRestrictionsSum_Client"][year] &&
        parsedData["netAssetsWithDonorRestrictionsSum_Client"][year].value
      ) {
        netAssetsWithDRData.push(
          Number(
            parsedData["netAssetsWithDonorRestrictionsSum_Client"][year].value
          )
        );
      } else {
        netAssetsWithDRData.push(0);
      }
    });

    // Calculate total net assets for percentage calculation
    const totalNetAssets = netAssetsWithoutDRData.map(
      (val, idx) => val + (netAssetsWithDRData[idx] || 0)
    );

    // Format numbers for display
    const formatLargeNumber = (value) => {
      if (!value && value !== 0) return "$0";
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return `${value.toFixed(0)}`;
    };

    const formatters = this._createFormatters(numType);

    // Define series colors
    const seriesColors = [
      window.chartColors.blue, // Without donor restrictions
      window.chartColors.green, // With donor restrictions
    ];

    return {
      colors: seriesColors,
      series: [
        {
          name: "Without Donor Restrictions",
          data: netAssetsWithoutDRData,
        },
        {
          name: "With Donor Restrictions",
          data: netAssetsWithDRData,
        },
      ],
      chart: {
        height: 550,
        type: "bar",
        zoom: {
          enabled: false,
        },
        // Add numType to chart's global state
        events: {
          mounted: function(chart) {
            chart.w.globals.numType = numType;
          }
        },
        padding: {
          bottom: 20,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%", // Reduced column width to allow more space between bars
          barHeight: "80%",
          dataLabels: {
            position: "top",
          },
          // Ensure bars are grouped with space between them
          endingShape: "rounded",
          borderRadius: 2,
        },
      },
      states: {
        hover: {
          filter: {
            type: "lighten",
            value: 0.1,
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        formatter: formatLargeNumber,
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: seriesColors,
        },
        background: {
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
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"], // White borders between bars for better separation
      },
      xaxis: {
        categories: selectedYearsArray,
        labels: {
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: formatters.yaxisLabelFormatter,
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
          },
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return `${formatLargeNumber(value)}`;
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "20px",
      },
      grid: {
        padding: {
          bottom: 20,
          left: 60, // Match chart padding to prevent label clipping
          top: 20, // Add top padding for labels
        },
      },
      toolbar: {
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    };
  }

  // Helper to create formatters based on number type
  _createFormatters(numType, mainName) {
    const self = this; // Capture 'this' reference to use inside formatters

    return {
      yaxisLabelFormatter: function(value) {
        // Get numType from chart context if available
        if (this && this.w && this.w.globals && this.w.globals.numType) {
          numType = this.w.globals.numType;
        }
        
        if (value === null || value === undefined || value === 0) {
          return numType === "dollar" ? "$0" : numType === "percent" ? "0%" : "0";
        }

        // Handle values between 0 and 1 with 2 decimal places
        if (Math.abs(value) < 1 && Math.abs(value) > 0) {
          const formattedValue = value.toFixed(2);
          return numType === "dollar" ? `$${formattedValue}` 
                : numType === "percent" ? `${formattedValue}%` 
                : formattedValue;
        }

        // Use the custom rounding helper with isYAxis=true for larger values
        return self._roundValueByMagnitude(value, numType, true);
      },

      tooltipFormatter: function(value) {
        // Get numType from chart context if available
        if (this && this.w && this.w.globals && this.w.globals.numType) {
          numType = this.w.globals.numType;
        }
        
        if (value === null || value === undefined) return "";

        // Use the custom rounding helper with isYAxis=false
        return self._roundValueByMagnitude(value, numType, false);
      },

      formatLargeNumber: function(value) {
        // Get numType from chart context if available
        if (this && this.w && this.w.globals && this.w.globals.numType) {
          numType = this.w.globals.numType;
        }
        
        if (value === null || value === undefined || value === 0) {
          return numType === "dollar" ? "$0" : numType === "percent" ? "0%" : "0";
        }

        // Use the custom rounding helper with isYAxis=false
        return self._roundValueByMagnitude(value, numType, false);
      },

      dataLabelFormatter: function(value) {
        // Get numType from chart context if available
        if (this && this.w && this.w.globals && this.w.globals.numType) {
          numType = this.w.globals.numType;
        }
        
        if (value === null || value === undefined) return "";

        // Use the custom rounding helper with isYAxis=false
        if (value > 10000) {
          return self._roundValueByMagnitude(value, numType, false);
        } else {
          return value;
        }
      },
    };
  }

  // Helper to create cash flow specific formatters
  _createCashFlowFormatters() {
    const self = this; // Capture 'this' to use inside formatters

    return {
      formatLargeNumber: (value) => {
        if (value === null || value === undefined) return "$0";

        // Handle negative values
        const isNegative = value < 0;
        const absValue = Math.abs(value);

        let formattedValue;
        if (absValue >= 1000000) {
          formattedValue = `${(absValue / 1000000).toFixed(1)}M`;
        } else if (absValue >= 1000) {
          formattedValue = `${(absValue / 1000).toFixed(0)}K`;
        } else {
          formattedValue = `${absValue.toFixed(0)}`;
        }

        return isNegative ? `-${formattedValue}` : formattedValue;
      },

      // Y-axis formatter version (without toFixed for numbers > 1)
      yaxisFormatter: (value) => {
        if (value === null || value === undefined) return "$0";

        // Handle negative values
        const isNegative = value < 0;
        const absValue = Math.abs(value);

        let formattedValue;
        if (absValue >= 1000000) {
          formattedValue =
            absValue > 1
              ? `$${absValue / 1000000}M`
              : `$${(absValue / 1000000).toFixed(1)}M`;
        } else if (absValue >= 1000) {
          formattedValue =
            absValue > 1
              ? `$${absValue / 1000}K`
              : `$${(absValue / 1000).toFixed(0)}K`;
        } else {
          formattedValue = `$${absValue.toFixed(0)}`;
        }

        return isNegative ? `-${formattedValue}` : formattedValue;
      },

      tooltipFormatter: (value) => {
        if (!value) return;
        const formattedValue = value.toLocaleString();
        return `${formattedValue}`;
      },
    };
  }

  // Handles custom rounding based on value magnitude
  _roundValueByMagnitude(value, numType, isYAxis = false) {
    if (value === null || value === undefined || value === 0) {
      return numType === "dollar" ? "$0" : numType === "percent" ? "0%" : "0";
    }

    // Handle negative values
    const isNegative = value < 0;
    const absValue = Math.abs(value);

    // Apply custom rounding based on magnitude
    let roundedValue;
    if (absValue < 100) {
      // Round to nearest whole number
      roundedValue = Math.round(absValue);
    } else if (absValue < 1000) {
      // Round to nearest 10
      roundedValue = Math.round(absValue / 10) * 10;
    } else if (absValue < 10000) {
      // Round to nearest 100
      roundedValue = Math.round(absValue / 100) * 100;
    } else if (absValue < 100000) {
      // Round to nearest 1,000
      roundedValue = Math.round(absValue / 1000) * 1000;
    } else if (absValue < 1000000) {
      // Round to nearest 10,000
      roundedValue = Math.round(absValue / 10000) * 10000;
    } else if (absValue < 10000000) {
      // Round to nearest 100,000
      roundedValue = Math.round(absValue / 100000) * 100000;
    } else if (absValue < 100000000) {
      // Round to nearest 100,000 (0.1M) for values >= 10M to preserve decimal precision
      roundedValue = Math.round(absValue / 100000) * 100000;
    } else {
      // For larger values, round to nearest 10,000,000
      roundedValue = Math.round(absValue / 10000000) * 10000000;
    }

    // Apply sign
    roundedValue = isNegative ? -roundedValue : roundedValue;

    // Format based on data type
    if (numType === "dollar") {
      if (Math.abs(roundedValue) >= 1000000) {
        // Don't apply toFixed for yaxis labels when number > 1
        return isYAxis && Math.abs(roundedValue) > 1
          ? `$${roundedValue / 1000000}M`
          : `$${(roundedValue / 1000000).toFixed(1)}M`;
      } else if (Math.abs(roundedValue) >= 1000) {
        // Don't apply toFixed for yaxis labels when number > 1
        return isYAxis && Math.abs(roundedValue) > 1
          ? `$${roundedValue / 1000}K`
          : `$${(roundedValue / 1000).toFixed(0)}K`;
      }
      return `$${roundedValue}`;
    } else if (numType === "percent") {
      return `${roundedValue}%`;
    } else {
      if (Math.abs(roundedValue) >= 1000000) {
        // Don't apply toFixed for yaxis labels when number > 1
        return isYAxis && Math.abs(roundedValue) > 1
          ? `${roundedValue / 1000000}M`
          : `${(roundedValue / 1000000).toFixed(1)}M`;
      } else if (Math.abs(roundedValue) >= 1000) {
        // Don't apply toFixed for yaxis labels when number > 1
        return isYAxis && Math.abs(roundedValue) > 1
          ? `${roundedValue / 1000}K`
          : `${(roundedValue / 1000).toFixed(0)}K`;
      }
      return roundedValue.toString();
    }
  }
}

// Export a singleton instance
const chartConfigFactory = new ChartConfigFactory();
