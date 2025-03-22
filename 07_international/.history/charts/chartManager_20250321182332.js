// ChartManager.js
// Main entry point for chart creation and management

class ChartManager {
  constructor() {
    // Initialize chart registry
    this.charts = {};

    // Reference to UI elements for modals
    this.modals = {};
  }

  // Create chart from parsed data
  createChartFromParsedData(
    parsedData,
    chartId,
    peerDataKey,
    clientDataKey,
    dataType,
    fixedNum,
    mainName,
    weightedAverage,
    benchmark,
    title,
    chartType
  ) {
    if (!parsedData) {
      console.error("No data provided for chart creation");
      return;
    }

    if (mainName) {
      this.ensureModalExists(mainName);
    }

    // Update modal with chart data
    this.updateModal(
      mainName,
      parsedData[peerDataKey],
      parsedData[clientDataKey],
      parsedData,
      dataType,
      fixedNum
    );

    // Create the chart
    this.createChart(
      chartId,
      parsedData[peerDataKey],
      parsedData[clientDataKey],
      dataType,
      fixedNum,
      mainName,
      weightedAverage,
      parsedData,
      benchmark,
      title,
      chartType
    );
  }

  ensureModalExists(mainName) {
    const modalId = `${mainName}_modal`;
    let modal = document.getElementById(modalId);

    if (!modal) {
      console.log(`Creating missing modal for ${mainName}`);

      // Create modal container
      modal = document.createElement("div");
      modal.id = modalId;
      modal.className = "modal";

      // Create table structure
      const table = document.createElement("table");
      table.className =
        "w-full text-sm text-left text-gray-500 dark:text-gray-400";

      // Create thead and the header row
      const thead = document.createElement("thead");
      thead.className =
        "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400";

      const headerRow = document.createElement("tr");
      headerRow.id = `${mainName}_modal_row`;

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create tbody
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);

      modal.appendChild(table);

      // Add to document - adjust selector as needed for your app structure
      const modalContainer =
        document.querySelector("#modalContainer") || document.body;
      modalContainer.appendChild(modal);
    }
  }

  // Create and configure a chart
  createChart(
    chartId,
    dataPeer,
    dataClient,
    dataType,
    fixedNum,
    mainName,
    weightedAverage,
    parsedData,
    benchmark,
    title,
    chartType
  ) {
    // Get chart element and clear it
    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      console.error(`Chart element with ID "${chartId}" not found`);
      return;
    }
    chartElement.innerHTML = "";

    // Store chart ID for url mapping
    if (dataUrLObj) {
      dataUrLObj[mainName] = chartId;
    }

    // Determine chart configuration type
    let configType;
    if (mainName === "functionalAllocation") {
      configType = "functionalAllocation";
    } else if (mainName === "costOfContributionsDetailView") {
      configType = "costOfContributions";
    } else if (mainName === "netAssetBreakdown") {
      configType = "netAssetBreakdown";
    } else if (chartType === "line") {
      configType = "line";
    } else {
      configType = "main";
    }

    // Get chart configuration from factory
    const chartConfig = chartConfigFactory.createConfig(configType, {
      dataPeer,
      dataClient,
      numType: dataType,
      fixedNum,
      mainName,
      wa: weightedAverage,
      parsedData,
      benchmark,
      title,
      data: parsedData, // For cash flow charts
      financing: "cashFlowsTrendFinancing", // For cash flow charts
      investing: "cashFlowsTrendInvesting", // For cash flow charts
      operating: "cashFlowsTrendOperating", // For cash flow charts
      total: "cashFlowsTrendTotal", // For cash flow charts
    });

    // Create chart instance
    const chart = this._createAndRenderChart(chartId, chartConfig);

    // Store chart for reference
    this.charts[chartId] = {
      instance: chart,
      config: chartConfig,
      type: configType,
      name: mainName,
    };

    return chart;
  }

  // Create a cash flow chart
  createCashFlowChart(chartId, data, cashFlowKeys) {
    const [financing, investing, operating, total] = cashFlowKeys;

    const financeData = data[`${financing}_Client`];
    const investingData = data[`${investing}_Client`];
    const operatingData = data[`${operating}_Client`];
    const totalData = data[`${total}_Client`];

    const selectedYearsArray = getSelectedYearsFromLocalStorage();

    // Use the getSeriesData function to generate series data
    const seriesData = getSeriesData(
      selectedYearsArray,
      operatingData,
      investingData,
      financeData,
      totalData
    );

    const chartConfig = chartConfigFactory.createConfig("cashFlow", {
      data,
      financing: cashFlowKeys[0],
      investing: cashFlowKeys[1],
      operating: cashFlowKeys[2],
      total: cashFlowKeys[3],
      seriesData, // Add the series data to the config params
    });

    const chart = this._createAndRenderChart(chartId, chartConfig);

    this.charts[chartId] = {
      instance: chart,
      config: chartConfig,
      type: "cashFlow",
      name: "cashFlow",
    };

    // Update corresponding modal
    this.updateCashFlowModal("cashFlowsTrend", data, cashFlowKeys);

    return chart;
  }

  updateModal(mainName, peerData, clientData, parsedData, dataType, fixedNum) {
    console.log(`Updating modal for ${mainName}`, { 
      peerData: peerData ? "Found" : "Not found", 
      clientData: clientData ? "Found" : "Not found" 
    });
    
    // Get the selected years from local storage
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || !selectedYears.length) {
      console.warn(`No selected years found for modal ${mainName}`);
      return;
    }
  
    // Find the modal element - if it doesn't exist, just return (don't create it)
    const modal = document.getElementById(`${mainName}_modal`);
    if (!modal) {
      // Skip modals that don't exist already
      console.log(`Skipping modal update for ${mainName} as it doesn't exist`);
      return;
    }
  
    // Find the table header row
    let headerRow = modal.querySelector(`#${mainName}_modal_row`);
    if (!headerRow) {
      console.log(`Skipping modal update for ${mainName} as it doesn't have a header row`);
      return;
    }
  
    let tableHead = headerRow.parentElement;
    if (!tableHead) {
      console.log(`Skipping modal update for ${mainName} as header row doesn't have a parent`);
      return;
    }
  
    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling;
    }
  
    // Clear existing header content
    headerRow.innerHTML = "";
  
    // Add column headers
    this._addStandardModalColumns(headerRow);
  
    // Add a row for each selected year
    selectedYears.forEach((year) => {
      const yearRow = this._createYearRow(mainName, year);
      tableHead.appendChild(yearRow);
  
      // Add client data for this year
      if (clientData && clientData[year]) {
        const clientValue = clientData[year].value;
        const clientCell = document.createElement("td");
        clientCell.className =
          "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
        
        if (typeof styleNumber === 'function') {
          clientCell.textContent = styleNumber(clientValue, dataType || "number", fixedNum || 0);
        } else {
          // Fallback if styleNumber is unavailable
          clientCell.textContent = clientValue;
        }
        yearRow.appendChild(clientCell);
      } else {
        // Add empty cell if no client data
        const emptyCell = document.createElement("td");
        emptyCell.className =
          "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
        emptyCell.textContent = "-";
        yearRow.appendChild(emptyCell);
      }
  
      // Add peer data for this year
      if (peerData && peerData[year]) {
        const peerArray = peerData[year];
        if (Array.isArray(peerArray)) {
          const avg = typeof getAverageOfArray === 'function' ? getAverageOfArray(peerArray) : 0;
          const median = typeof getMidpointOfArray === 'function' ? getMidpointOfArray(peerArray) : 0;
          const q25 = typeof get25thPercentileOfArray === 'function' ? get25thPercentileOfArray(peerArray) : 0;
          const q75 = typeof get75thPercentileOfArray === 'function' ? get75thPercentileOfArray(peerArray) : 0;
  
          // Add avg cell
          const avgCell = document.createElement("td");
          avgCell.className =
            "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
          
          if (typeof styleNumber === 'function') {
            avgCell.textContent = styleNumber(avg, dataType || "number", fixedNum || 0);
          } else {
            avgCell.textContent = avg;
          }
          yearRow.appendChild(avgCell);
  
          // Add 25th percentile cell
          const q25Cell = document.createElement("td");
          q25Cell.className =
            "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
          
          if (typeof styleNumber === 'function') {
            q25Cell.textContent = styleNumber(q25, dataType || "number", fixedNum || 0);
          } else {
            q25Cell.textContent = q25;
          }
          yearRow.appendChild(q25Cell);
  
          // Add median cell
          const medianCell = document.createElement("td");
          medianCell.className =
            "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
          
          if (typeof styleNumber === 'function') {
            medianCell.textContent = styleNumber(median, dataType || "number", fixedNum || 0);
          } else {
            medianCell.textContent = median;
          }
          yearRow.appendChild(medianCell);
  
          // Add 75th percentile cell
          const q75Cell = document.createElement("td");
          q75Cell.className =
            "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
          
          if (typeof styleNumber === 'function') {
            q75Cell.textContent = styleNumber(q75, dataType || "number", fixedNum || 0);
          } else {
            q75Cell.textContent = q75;
          }
          yearRow.appendChild(q75Cell);
        } else {
          // Add empty cells if peer data isn't an array
          for (let i = 0; i < 4; i++) {
            const emptyCell = document.createElement("td");
            emptyCell.className =
              "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
            emptyCell.textContent = "-";
            yearRow.appendChild(emptyCell);
          }
        }
      } else {
        // Add empty cells if no peer data
        for (let i = 0; i < 4; i++) {
          const emptyCell = document.createElement("td");
          emptyCell.className =
            "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
          emptyCell.textContent = "-";
          yearRow.appendChild(emptyCell);
        }
      }
    });
  }
  // Handle specialized modal updates for cash flow charts
  updateCashFlowModal(
    mainName,
    data,
    [financing, investing, operating, total]
  ) {
    const financingData = data[`${financing}_Client`];
    const investingData = data[`${investing}_Client`];
    const operatingData = data[`${operating}_Client`];
    const totalData = data[`${total}_Client`];
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || !selectedYears.length) return;

    // Find the modal element
    const modal = document.getElementById(`${mainName}_modal`);
    if (!modal) return;

    // Find the table header row
    const headerRow = modal.querySelector(`#${mainName}_modal_row`);
    if (!headerRow) return;

    let tableHead = headerRow.parentElement;

    // Clear existing rows
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling;
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add cash flow specific column headers
    this._addCashFlowModalColumns(headerRow);

    // Add data rows for each year
    selectedYears.forEach((year) => {
      const row = this._createCashFlowDataRow(
        mainName,
        year,
        operatingData[year]?.value || 0,
        investingData[year]?.value || 0,
        financingData[year]?.value || 0,
        totalData[year]?.value || 0
      );
      tableHead.appendChild(row);
    });
  }

  // Helper method to add standard modal columns
  _addStandardModalColumns(headerRow) {
    const columns = [
      { text: "Year", className: "px-6 py-3" },
      { text: "Client", className: "px-6 py-3" },
      { text: "Avg", className: "px-6 py-3" },
      { text: "25%", className: "px-6 py-3" },
      { text: "50%", className: "px-6 py-3" },
      { text: "75%", className: "px-6 py-3" },
    ];

    columns.forEach((column) => {
      const th = document.createElement("th");
      th.className = column.className;
      th.textContent = column.text;
      headerRow.appendChild(th);
    });
  }

  // Helper method to add cash flow specific modal columns
  _addCashFlowModalColumns(headerRow) {
    const columns = [
      { text: "Year", className: "px-6 py-3" },
      { text: "Operating", className: "px-6 py-3" },
      { text: "Investing", className: "px-6 py-3" },
      { text: "Financing", className: "px-6 py-3" },
      { text: "Total", className: "px-6 py-3" },
    ];

    columns.forEach((column) => {
      const th = document.createElement("th");
      th.className = column.className;
      th.textContent = column.text;
      headerRow.appendChild(th);
    });
  }

  // Helper method to create a year row for standard modals
  _createYearRow(mainName, year) {
    const yearRow = document.createElement("tr");
    yearRow.className =
      "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
    yearRow.id = `${mainName}_modal_${year}`;

    // Create year cell
    const yearCell = document.createElement("td");
    yearCell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
    yearCell.textContent = year;

    // Append the year cell to the row
    yearRow.appendChild(yearCell);

    return yearRow;
  }

  // Helper method to create a cash flow data row
  _createCashFlowDataRow(
    mainName,
    year,
    operatingValue,
    investingValue,
    financingValue,
    totalValue
  ) {
    const row = document.createElement("tr");
    row.className =
      "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
    row.id = `${mainName}_modal_${year}`;

    const cellClass =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";

    // Create and append cells
    const cells = [
      { value: year, format: null },
      { value: operatingValue || 0, format: "dollar" },
      { value: investingValue || 0, format: "dollar" },
      { value: financingValue || 0, format: "dollar" },
      { value: totalValue || 0, format: "dollar" },
    ];

    cells.forEach((cell) => {
      const td = document.createElement("td");
      td.className = cellClass;
      td.textContent = cell.format
        ? styleNumber(cell.value, cell.format)
        : cell.value;
      row.appendChild(td);
    });

    return row;
  }

  // Internal method to create and render chart
  _createAndRenderChart(chartId, config) {
    const chart = new ApexCharts(document.getElementById(chartId), config);
    chart.render();

    // Add event listener for dark mode changes
    document.addEventListener("dark-mode", function () {
      chart.updateOptions(config);
    });

    return chart;
  }

  // Get a chart instance by ID
  getChart(chartId) {
    return this.charts[chartId]?.instance;
  }

  // Update a chart's options
  updateChartOptions(chartId, newOptions) {
    const chart = this.getChart(chartId);
    if (chart) {
      chart.updateOptions(newOptions);
      this.charts[chartId].config = newOptions;
    }
  }

  // Destroy all charts (cleanup)
  destroyAllCharts() {
    Object.values(this.charts).forEach((chartData) => {
      if (
        chartData.instance &&
        typeof chartData.instance.destroy === "function"
      ) {
        chartData.instance.destroy();
      }
    });
    this.charts = {};
  }
}

// Create and export singleton instance
const chartManager = new ChartManager();
