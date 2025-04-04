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

    // Special case for annualizedInvestmentReturn
    const isAnnualizedInvestmentReturn =
      mainName === "annualizedInvestmentReturn";
    const dataType = isAnnualizedInvestmentReturn
      ? "num"
      : numType || "num";

    // Get the chart data - use the exact same data processing as the charts
    const chartData = getPeerAndClientChartDataArrays(
      selectedYears,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      dataType,
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
          console.log("updateModalFromChartOptions", {
            chartData: chartData.peerAvg,
            dataType,
            wa,
            fixedNum,
          });
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

      // Format the value
      let formattedValue;
      if (!isNaN(numValue) && typeof styleNumber === "function") {
        console.log('dataType', dataType);
        
        const styleType = dataType == "number" ? "num" : dataType;
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
        formattedValue = styleNumber(numValue, dataType, fixedNum);
      } else {
        formattedValue = numValue.toFixed(fixedNum || 2);
      }

      if (value != Math.floor)console.log("_addPeerDataCell()", { row, value, formattedValue, numValue, dataType, fixedNum });



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
    const refreshedData = parseStoredData(
      getStoredData(`${mainName.split("_")[0]}Data`)
    );

    if (refreshedData) {
      // Update dataPeer and dataClient with fresh data if available
      if (refreshedData[`${mainName}_Peer`]) {
        dataPeer = refreshedData[`${mainName}_Peer`];
      }
      if (refreshedData[`${mainName}_Client`]) {
        dataClient = refreshedData[`${mainName}_Client`];
      }
    }

    // Special case flags
    const isAnnualizedInvestmentReturn =
      mainName === "annualizedInvestmentReturn";
    const isCostOfContributions = mainName === "costOfContributions";

    const selectedYearsArray = getSelectedYearsFromLocalStorage();

    // Get chart data with explicit data refresh
    const chartData = getPeerAndClientChartDataArrays(
      selectedYearsArray,
      dataPeer,
      dataClient,
      fixedNum,
      mainName,
      isAnnualizedInvestmentReturn ? "num" : numType,
      wa,
      true, // Add a force refresh parameter
      parsedData
    );

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

    if (numType === "percent" && !isAnnualizedInvestmentReturn) {
      // For annualizedInvestmentReturn we're already handling this elsewhere
      clientArray = clientArray.map(val => 
        val !== null && val !== undefined ? parseFloat(val) * 100 : val);
      peerAvg = peerAvg.map(val => 
        val !== null && val !== undefined ? parseFloat(val) * 100 : val);
      peerMid = peerMid.map(val => 
        val !== null && val !== undefined ? parseFloat(val) * 100 : val);
      peer25 = peer25.map(val => 
        val !== null && val !== undefined ? parseFloat(val) * 100 : val);
      peer75 = peer75.map(val => 
        val !== null && val !== undefined ? parseFloat(val) * 100 : val);
    } else if (isAnnualizedInvestmentReturn) {
      // For annualizedInvestmentReturn, multiply client array by 100
      clientArray = clientArray.map(val => 
        val !== null && val !== undefined ? parseFloat(val) * 100 : val);
    }

    // if (mainName == 'daysCashOnHand')
    //   console.log(
    //     mainName,
    //     clientArray,
    //     peerAvg,
    //     peerMid,
    //     peer25,
    //     peer75,
    //     dataPeer,
    //     fixedNum,
    //     numType
    //   );

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
        },
      },
      tooltip: { enabled: true },
    };

    // NEW: Add special yaxis configuration for costOfContributions
    if (isCostOfContributions) {
      // Calculate appropriate max value for costOfContributions
      // Collect all values to find max
      const allValues = [...clientArray, ...peerAvg].filter(
        (val) => val !== null && val !== undefined
      );

      const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0.2;
      // Set a minimum max value of 0.2 for better visibility of small values
      const adjustedMaxValue = Math.max(maxValue * 1.2, 0.2);

      // Apply specific yaxis configuration for costOfContributions
      yaxisConfig = {
        ...yaxisConfig,
        min: 0,
        max: adjustedMaxValue,
        tickAmount: 5,
      };
    }

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

    // Return complete chart configuration
    return {
      colors: this.themeColors.seriesColors,
      series: series,
      chart: {
        height: 400,
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
        },
        padding: {
          bottom: 20,
        },
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        offsetY: -20,
        formatter: function (value) {
          // NEW: Special formatting for costOfContributions
          if (isCostOfContributions) {
            return `$${value.toFixed(2)}`;
          }
          return formatters.formatLargeNumber(value);
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
        fixed: {
          enabled: true,
          position: "topLeft",
          offsetY: 30,
          offsetX: 60,
        },
        y: {
          formatter: function (value, { seriesIndex }) {
            // NEW: Special tooltip formatting for costOfContributions
            if (isCostOfContributions) {
              return `$${value.toFixed(2)}`;
            }
            return formatters.tooltipFormatter(value);
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
        show: false,
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
    // if (mainName == 'changeInNetAssets') {
    //   console.log('createLineChartConfig() changeInNetAssets', {
    //     dataPeer,
    //     dataClient,
    //     parsedData
    //   });

    // }

    const selectedYearsArray = getSelectedYearsFromLocalStorage();
    let clientArray = [],
      peerAvg = [],
      peerMid = [],
      peer25 = [],
      peer75 = [];

    try {
      // Special case for annualizedInvestmentReturn chart
      const dataProcessingType =
        mainName === "annualizedInvestmentReturn" ? "num" : numType;

      // Use the modified data type for data processing
      const result = getPeerAndClientChartDataArrays(
        selectedYearsArray,
        dataPeer,
        dataClient,
        fixedNum,
        mainName,
        dataProcessingType, // Use special handling for annualizedInvestmentReturn
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

    // Create formatters based on number type but with special case for annualizedInvestmentReturn
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
    const minValue = allValues.length > 0 ? Math.min(...allValues) * 0.9 : 0;
    const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.1 : 100;

    return {
      colors: [
        window.chartColors.green,
        window.chartColors.blue,
        window.chartColors.black,
      ],
      series: series,
      chart: {
        height: 400,
        type: "line",
        toolbar: {
          show: false,
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

          // Special handling for annualizedInvestmentReturn
          if (mainName === "annualizedInvestmentReturn") {
            // Return value directly with % sign - it's already the correct percentage
            return `${value.toFixed(fixedNum)}%`;
          }

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
      yaxis: {
        min: minValue,
        max: maxValue,
        forceNiceScale: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: this.themeColors.chartColor,
        },
        labels: {
          formatter: function (value) {
            if (value === null || value === undefined || value === 0) {
              return numType === "dollar" ? "$0" : "0";
            }

            if (numType === "percent") {
              // Return the value directly with % sign without multiplying by 100
              return `${value.toFixed(1)}%`;
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
              // Round to nearest 1,000,000
              roundedValue = Math.round(absValue / 1000000) * 1000000;
            } else {
              // For larger values, round to nearest 10,000,000
              roundedValue = Math.round(absValue / 10000000) * 10000000;
            }

            // Apply sign and format
            roundedValue = isNegative ? -roundedValue : roundedValue;

            // Format based on data type
            if (numType === "dollar") {
              if (Math.abs(roundedValue) >= 1000000) {
                return `$${(roundedValue / 1000000).toFixed(1)}M`;
              } else if (Math.abs(roundedValue) >= 1000) {
                return `$${(roundedValue / 1000).toFixed(0)}K`;
              }
              return `$${roundedValue}`;
            } else if (numType === "percent") {
              return `${roundedValue}%`;
            } else {
              if (Math.abs(roundedValue) >= 1000000) {
                return `${(roundedValue / 1000000).toFixed(1)}M`;
              } else if (Math.abs(roundedValue) >= 1000) {
                return `${(roundedValue / 1000).toFixed(0)}K`;
              }
              return roundedValue.toString();
            }
          },
          style: {
            colors: this.themeColors.chartColor,
            fontSize: "1.25rem",
          },
        },
        tooltip: {
          enabled: true,
        },
      },
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
          formatter: function (value) {
            if (value === null || value === undefined) return "";

            // Special handling for annualizedInvestmentReturn
            if (mainName === "annualizedInvestmentReturn") {
              return `${value.toFixed(fixedNum)}%`;
            }

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
          title: {
            formatter: (seriesName) => `${seriesName}:`,
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
        height: 400,
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
            colors: this.themeColors.chartColors.labelColor,
            fontSize: "1rem",
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
          },
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
        show: false,
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
          weightedAvg *= 100;
          programPeerAvg[index] = isNaN(weightedAvg)
            ? null
            : parseFloat(weightedAvg.toFixed(2));

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

      // console.log({
      //   programClientArray,
      //   adminClientArray,
      //   fundraisingClientArray,
      //   programPeerAvg,
      // });

      // Define series colors
      const seriesColors = [
        window.chartColors.blue,
        window.chartColors.orange,
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
          height: 400,
          type: "bar",
          stacked: true,
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
          },
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
      };
    } catch (error) {
      console.error("Error generating chart options:", error);
      return {
        series: [],
        chart: {
          height: 400,
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
    numType,
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

    // Create formatters
    const formatLargeNumber = (value) => {
      if (!value && value !== 0) return "$0";
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return `${value.toFixed(2)}`;
    };

    const formatRatio = (value) => {
      if (!value && value !== 0) return "$0.00";
      return `${value.toFixed(2)}`;
    };

    // Calculate dynamic axis limits
    const allDollarValues = [
      ...fundraisingExpensesData,
      ...totalContributionsData,
    ].filter((v) => !isNaN(v) && v !== null);

    const safeMinDollarValue = 0;
    const safeMaxDollarValue =
      allDollarValues.length > 0 ? Math.max(...allDollarValues) * 1.5 : 1000000;

    const allRatioValues = [
      ...costOfContributionsClient,
      ...costOfContributionsPeer,
    ].filter((v) => !isNaN(v) && v !== null);

    const safeMinRatioValue = 0;
    const safeMaxRatioValue =
      allRatioValues.length > 0 ? Math.max(...allRatioValues) * 1.5 : 0.3;

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
          name: "Fundr. Exp.",
          type: "column",
          data: fundraisingExpensesData,
          yAxisIndex: 0,
        },
        {
          name: "Total Contr.",
          type: "column",
          data: totalContributionsData,
          yAxisIndex: 0,
        },
        {
          name: "Client",
          type: "line",
          data: costOfContributionsClient,
          yAxisIndex: 1,
        },
        {
          name: "Peer Avg",
          type: "line",
          data: costOfContributionsPeer,
          yAxisIndex: 1,
        },
      ],
      chart: {
        height: 400,
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
        },
        padding: {
          bottom: 20,
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
              return formatLargeNumber(value);
            },
            style: {
              colors: this.themeColors.chartColor,
              fontSize: "1.25rem",
            },
          },
          min: safeMinDollarValue,
          max: safeMaxDollarValue,
          tickAmount: 5,
        },
        {
          labels: {
            formatter: function (value) {
              return formatRatio(value);
            },
            style: {
              colors: this.themeColors.chartColor,
              fontSize: "1.25rem",
            },
          },
          opposite: true,
          min: safeMinRatioValue,
          max: safeMaxRatioValue,
          tickAmount: 5,
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (value, { seriesIndex }) {
            if (value === null || value === undefined) return "";
            if (seriesIndex <= 1) {
              // Format for bar charts (dollar values)
              return `${value.toLocaleString()}`;
            } else {
              // Format for line charts (ratios)
              return `${value.toFixed(2)}`;
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
        height: 400,
        type: "bar",
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
            colors: this.themeColors.chartColors.labelColor,
            fontSize: "1rem",
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
        },
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
        },
      },
    };
  }

  // Helper to create formatters based on number type
  _createFormatters(numType, mainName) {
    const self = this; // Capture 'this' reference to use inside formatters
    const isCostOfContributions = mainName === "costOfContributions";

    return {
      yaxisLabelFormatter: (value) => {
        if (value === null || value === undefined || value === 0) {
          return numType === "dollar" ? "$0" : "0";
        }

        // Special handling for costOfContributions
        if (isCostOfContributions) {
          // For cost of contributions, always show 2 decimal places for small values
          return `$${value.toFixed(2)}`;
        }

        // Use the custom rounding helper with isYAxis=true
        return self._roundValueByMagnitude(value, numType, true);
      },

      tooltipFormatter: (value) => {
        if (value === null || value === undefined) return "";

        // Special handling for costOfContributions
        if (isCostOfContributions) {
          // For cost of contributions, show as "$ per dollar raised"
          return `$${value.toFixed(2)} per dollar raised`;
        }

        // Use the custom rounding helper with isYAxis=false
        return self._roundValueByMagnitude(value, numType, false);
      },

      formatLargeNumber: (value) => {
        if (value === null || value === undefined || value === 0) {
          return numType === "dollar" ? "$0" : "0";
        }

        // Special handling for costOfContributions
        if (isCostOfContributions) {
          // For cost of contributions, always show 2 decimal places
          return `$${value.toFixed(2)}`;
        }

        // Use the custom rounding helper with isYAxis=false
        return self._roundValueByMagnitude(value, numType, false);
      },

      dataLabelFormatter: (value) => {
        if (value === null || value === undefined) return "";

        // Special handling for costOfContributions
        if (isCostOfContributions) {
          // For cost of contributions, always show 2 decimal places
          return `$${value.toFixed(2)}`;
        }

        // Use the custom rounding helper with isYAxis=false
        return self._roundValueByMagnitude(value, numType, false);
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
      return numType === "dollar" ? "$0" : "0";
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
      // Round to nearest 1,000,000
      roundedValue = Math.round(absValue / 1000000) * 1000000;
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
