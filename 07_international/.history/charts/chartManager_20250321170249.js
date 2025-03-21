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
      parsedData
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

  // Handle modal updates for standard charts
  updateModal(mainName, peerData, clientData, parsedData) {
    // Get the selected years from local storage
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || !selectedYears.length) return;

    // Find the modal element
    const modal = document.getElementById(`${mainName}_modal`);
    if (!modal) return;

    // Find the table header row
    const headerRow = modal.querySelector(`#${mainName}_modal_row`);
    if (!headerRow) return;

    let tableHead = headerRow.parentElement;

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
        operatingData[year]?.value,
        investingData[year]?.value,
        financingData[year]?.value,
        totalData[year]?.value
      );
      tableHead.appendChild(row);
    });
  }

  // Helper method to add standard modal columns
  _addStandardModalColumns(headerRow) {
    const columns = [
      { text: "year", className: "px-6 py-3" },
      { text: "client", className: "px-6 py-3" },
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
    const yearCell = document.createElement("th");
    yearCell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
    yearCell.scope = "row";
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
      td.scope = "row";
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
