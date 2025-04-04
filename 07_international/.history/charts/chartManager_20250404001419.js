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
    chart,
    peer,
    client,
    type,
    fixedNum,
    mainName,
    wa,
    benchmark,
    title,
    chartType
  ) {
    try {
      if (!parsedData) {
        console.warn(`No data provided for chart ${mainName}`);
        // Create an empty placeholder chart instead of failing
        this.createEmptyChart(chart, mainName, title);
        return;
      }

      // Check if required data exists
      if (!parsedData[client]) {
        // console.warn(`Missing peer or client data for chart ${mainName}`);
        // Create an empty placeholder chart
        this.createEmptyChart(chart, mainName, title);
        return;
      }

      // Original implementation...
      this.updateModal(
        mainName,
        parsedData[peer],
        parsedData[client],
        parsedData,
        type,
        fixedNum,
        wa
      );
      this.createChart(
        chart,
        peer,
        client,
        type,
        fixedNum,
        mainName,
        wa,
        parsedData,
        benchmark,
        title,
        chartType
      );
    } catch (error) {
      console.error(
        `Error creating chart from parsed data for ${mainName}:`,
        error
      );
      // Create an empty placeholder chart on error
      this.createEmptyChart(chart, mainName, title);
    }
  }

  // Add this new method to create empty charts as fallbacks
  createEmptyChart(chartId, mainName, title) {
    const element = document.getElementById(chartId);
    if (!element) {
      console.warn(`Chart element ${chartId} not found`);
      return;
    }

    // Clear any existing content
    element.innerHTML = "";

    // Create a simple message
    const message = document.createElement("div");
    message.className =
      "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400";
    message.innerHTML = `
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-lg font-medium">No data available</p>
        <p class="text-sm">Try adjusting your filters or selecting different years</p>
      </div>
    `;

    element.appendChild(message);
  }

  ensureModalExists(mainName) {
    const modalId = `${mainName}_modal`;
    const modal = document.getElementById(modalId);

    // If the modal doesn't exist, just log a warning and return
    if (!modal) {
      // console.log(`Modal for ${mainName} does not exist and won't be created`);
      return;
    }

    // Modal exists, check if it has the table and header row structure
    let table = modal.querySelector("table");
    if (!table) {
      // console.log(
      //   `Modal for ${mainName} exists but has no table - skipping updates`
      // );
      return;
    }

    let thead = table.querySelector("thead");
    if (!thead) {
      // console.log(
      //   `Modal for ${mainName} exists but has no thead - skipping updates`
      // );
      return;
    }

    let headerRow = thead.querySelector(`#${mainName}_modal_row`);
    if (!headerRow) {
      // console.log(
      //   `Modal for ${mainName} exists but has no header row - creating one`
      // );
      headerRow = document.createElement("tr");
      headerRow.id = `${mainName}_modal_row`;
      thead.appendChild(headerRow);
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
    const testName = "contributionsWithoutDR";
    if (mainName == testName) {
      console.log("chartmanager.createChart", {
        dataPeer,
        dataClient,
        parsedData,
      });
    }

    // Get chart element and clear it
    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      console.error(`Chart element with ID "${chartId}" not found`);
      return;
    }
    chartElement.innerHTML = "";

    // Store chart ID for url mapping
    if (typeof dataUrLObj !== "undefined") {
      dataUrLObj[mainName] = chartId;
    }

    // Log the chart creation with weighted average info
    // console.log(`Creating chart ${chartId} for ${mainName}`, {
    //   weightedAverage,
    //   chartType,
    //   dataType,
    // });

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
      weightedAverage, // Store weighted average setting
      dataPeer, // Store data references
      dataClient,
      parsedData,
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

  // Enhanced modal update method with weighted average support
  updateModal(mainName, peerData, clientData, parsedData, type, fixedNum, wa) {
    if (mainName == testName) {
      console.log({
        peerData,
        clientData,
        parsedData,
        type,
        fixedNum,
        wa,
      });
    }

    // Get the selected years from local storage
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || !selectedYears.length) {
      console.warn(`No selected years found for modal ${mainName}`);
      return;
    }

    // Find the modal element
    const modalSelector = `#${mainName}_modal`;
    const modal = document.querySelector(modalSelector);

    if (!modal) {
      // console.warn(`Modal element with selector "${modalSelector}" not found`);
      return;
    }

    // Find the table header row with more flexible selector
    const rowSelector = `#${mainName}_modal_row`;
    let headerRow = modal.querySelector(rowSelector);

    if (!headerRow) {
      console.warn(
        `Header row with selector "${rowSelector}" not found in modal ${modalSelector}`
      );
      // Try a more generic approach to find the table row
      headerRow = modal.querySelector('tr[id$="_modal_row"]');
      if (!headerRow) {
        console.error(
          `Could not find any appropriate row in modal ${modalSelector}`
        );
        return;
      }
    }

    // Clear and populate the modal content
    this.populateModalContent(
      headerRow,
      selectedYears,
      clientData,
      peerData,
      parsedData,
      type,
      fixedNum,
      wa, 
      mainName
    );
  }

  populateModalContent(
    headerRow,
    selectedYears,
    clientData,
    peerData,
    parsedData,
    type,
    fixedNum,
    wa,
    mainName
  ) {

    if (mainName == testName){
      console.log({
        parsedData, 
        clientData,
        peer, 
        type, 
        fixedNum,
        wa
      });
      
    }

    let tableHead = headerRow.parentElement;

    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling;
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add columns (year, client, avg, 25%, 50%, 75%)
    this._addModalColumns(headerRow);

    // Get the main name from the header row ID
    const mainName = headerRow.id.replace("_row", "");

    // Special case flag for annualizedInvestmentReturn chart
    const isAnnualizedInvestmentReturn =
      mainName === "annualizedInvestmentReturn";

    // Process data type appropriately
    const dataProcessingType = isAnnualizedInvestmentReturn
      ? "number"
      : type || "number";

    // Add data rows for each year
    selectedYears.forEach((year) => {
      const yearRow = this._createYearRow(mainName, year);
      tableHead.appendChild(yearRow);

      // Now add client data to this row if available
      if (clientData && clientData[year]) {
        // Format client data according to the data type
        this._addClientDataToModalRow(
          yearRow,
          clientData[year].value,
          dataProcessingType,
          fixedNum || 2
        );
      } else {
        // Add empty cell if no client data
        this._addEmptyCell(yearRow);
      }

      // Add peer data if available
      if (peerData && peerData[year]) {
        // If we're using weighted average and the function exists
        if (
          wa === "wa" &&
          typeof getWeightedAverageOfArray === "function" &&
          parsedData
        ) {
          try {
            // Calculate weighted average for this specific chart and year
            const weightedAvg = getWeightedAverageOfArray(
              parsedData,
              mainName,
              year
            );

            // For other percentiles, use regular calculations
            const peerValues = peerData[year];
            const peerMid = Array.isArray(peerValues)
              ? getMidpointOfArray(peerValues, mainName)
              : 0;
            const peer25 = Array.isArray(peerValues)
              ? get25thPercentileOfArray(peerValues, mainName)
              : 0;
            const peer75 = Array.isArray(peerValues)
              ? get75thPercentileOfArray(peerValues, mainName)
              : 0;

            // Add the peer data to the row with appropriate formatting
            this._addPeerDataToModalRow(
              yearRow,
              weightedAvg,
              peerMid,
              peer25,
              peer75,
              dataProcessingType,
              fixedNum
            );
          } catch (error) {
            console.error(
              `Error calculating weighted average for ${mainName}:`,
              error
            );

            // Fall back to regular statistics
            const peerValues = peerData[year];
            const peerAvg = Array.isArray(peerValues)
              ? getAverageOfArray(peerValues)
              : 0;
            const peerMid = Array.isArray(peerValues)
              ? getMidpointOfArray(peerValues, mainName)
              : 0;
            const peer25 = Array.isArray(peerValues)
              ? get25thPercentileOfArray(peerValues, mainName)
              : 0;
            const peer75 = Array.isArray(peerValues)
              ? get75thPercentileOfArray(peerValues, mainName)
              : 0;

            // Add the peer data to the row
            addPeerDataToModalRow(
              yearRow,
              peerAvg,
              peerMid,
              peer25,
              peer75,
              dataProcessingType,
              fixedNum
            );
          }
        } else {
          // Use regular statistics without weighted average
          const peerValues = peerData[year];
          const peerAvg = Array.isArray(peerValues)
            ? getAverageOfArray(peerValues)
            : 0;
          const peerMid = Array.isArray(peerValues)
            ? getMidpointOfArray(peerValues, mainName)
            : 0;
          const peer25 = Array.isArray(peerValues)
            ? get25thPercentileOfArray(peerValues, mainName)
            : 0;
          const peer75 = Array.isArray(peerValues)
            ? get75thPercentileOfArray(peerValues, mainName)
            : 0;

          // For percentage type, multiply values by 100
          let multiplier =
            dataProcessingType === "percent" && !isAnnualizedInvestmentReturn
              ? 100
              : 1;

          // Add the peer data to the row
          addPeerDataToModalRow(
            yearRow,
            peerAvg * multiplier,
            peerMid * multiplier,
            peer25 * multiplier,
            peer75 * multiplier,
            dataProcessingType,
            fixedNum
          );
        }
      } else {
        // Add empty cells for peer data if none available
        for (let i = 0; i < 4; i++) {
          this._addEmptyCell(yearRow);
        }
      }
    });
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
    // console.log({
    //   row, avgValue, dataType, fixedNum
    // });

    // Create and add the average value cell
    const avgCell = createPeerDataCell(row, avgValue, dataType, fixedNum);

    // Create and add the 25th percentile cell
    const p25Cell = createPeerDataCell(row, p25Value, dataType, fixedNum);

    // Create and add the median cell
    const midCell = createPeerDataCell(row, midValue, dataType, fixedNum);

    // Create and add the 75th percentile cell
    const p75Cell = createPeerDataCell(row, p75Value, dataType, fixedNum);
  }

  _addClientDataToModalRow(yearRow, clientValue, type, fixedNum) {
    // console.log(`Adding client data to row: ${yearRow.id}`, {
    //   clientValue,
    //   type,
    //   fixedNum,
    // });
  
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  
    // Format the value
    const formattedValue =
      clientValue !== undefined && clientValue !== null
        ? styleNumber(clientValue, type, fixedNum)
        : "-";
  
    cell.textContent = formattedValue;
    yearRow.appendChild(cell);
  
    return cell;
  }

  createPeerDataCell(row, value, dataType, fixedNum) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";

    if (value !== undefined && value !== null) {
      // Make sure value is a number before formatting
      const numValue = parseFloat(value);

      // Format the value based on type using styleNumber
      let formattedValue;
      if (!isNaN(numValue) && typeof styleNumber === "function") {
        // Force the type parameter to match expected format in styleNumber
        let typeParam = dataType;
        if (dataType === "number") typeParam = "num"; // Convert "number" to "num" for styleNumber

        formattedValue = styleNumber(numValue, typeParam, fixedNum);
      } else {
        // Fallback if value is not a number or styleNumber is not available
        formattedValue = value.toFixed(fixedNum || 2);
      }

      cell.textContent = formattedValue;

      // Apply color formatting for negative values
      if (numValue < 0) {
        cell.classList.remove("text-gray-900", "dark:text-white");
        cell.classList.add("text-red-500", "dark:text-red-400");
      }
    } else {
      cell.textContent = "-";
    }

    row.appendChild(cell);
    return cell;
  }

  // Helper method to add columns to modal
  _addModalColumns(headerRow) {
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

  // Helper method to create a year row for modal
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

  // Helper method to add client data to row
  _addClientDataToRow(row, value, dataType, fixedNum) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";

    if (value !== undefined && value !== null) {
      // Format the value based on type
      const formattedValue =
        typeof styleNumber === "function"
          ? styleNumber(value, dataType, fixedNum)
          : value;

      cell.textContent = formattedValue;
    } else {
      cell.textContent = "-";
    }

    row.appendChild(cell);
  }

  // Helper method to add peer data to row with weighted average support
  _addPeerDataToModalRow(
    row,
    avgValue,
    midValue,
    p25Value,
    p75Value,
    dataType,
    fixedNum
  ) {
    // Create and add the average value cell
    this._createPeerDataCell(row, avgValue, dataType, fixedNum);
  
    // Create and add the 25th percentile cell  
    this._createPeerDataCell(row, p25Value, dataType, fixedNum);
  
    // Create and add the median cell
    this._createPeerDataCell(row, midValue, dataType, fixedNum);
  
    // Create and add the 75th percentile cell
    this._createPeerDataCell(row, p75Value, dataType, fixedNum);
  }
  
  // Make sure the _createPeerDataCell method uses styleNumber properly
  _createPeerDataCell(row, value, dataType, fixedNum) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  
    if (value !== undefined && value !== null) {
      // Make sure value is a number before formatting
      const numValue = parseFloat(value);
  
      // Format the value based on type using styleNumber
      let formattedValue;
      if (!isNaN(numValue) && typeof styleNumber === "function") {
        // Use styleNumber directly with the proper parameters
        formattedValue = styleNumber(numValue, dataType, fixedNum);
      } else {
        // Fallback if value is not a number or styleNumber is not available
        formattedValue = value.toFixed(fixedNum || 2);
      }
  
      cell.textContent = formattedValue;
  
      // Apply color formatting for negative values
      if (numValue < 0) {
        cell.classList.remove("text-gray-900", "dark:text-white");
        cell.classList.add("text-red-500", "dark:text-red-400");
      }
    } else {
      cell.textContent = "-";
    }
  
    row.appendChild(cell);
    return cell;
  }

  // Add an empty cell to a row
  _addEmptyCell(row) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
    cell.textContent = "-";
    row.appendChild(cell);
  }

  // Helper to calculate average from an array
  _calculateAverage(array) {
    if (!array || array.length === 0) return 0;

    // Convert all values to numbers
    const numbers = array.map((val) => Number(val) || 0);

    // Calculate sum
    const sum = numbers.reduce((acc, val) => acc + val, 0);

    // Return average
    return sum / numbers.length;
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

  updateChartOptions(chartId, newOptions) {
    const chart = this.getChart(chartId);
    if (chart) {
      chart.updateOptions(newOptions);
      this.charts[chartId].config = newOptions;

      // Add this new code to trigger modal updates
      const chartInfo = this.charts[chartId];
      if (chartInfo && chartInfo.name) {
        const mainName = chartInfo.name;

        // Update corresponding modal if the function exists
        if (typeof updateModal === "function") {
          // Get the data from the options or retrieve it from localStorage
          const dataPeer =
            newOptions.dataPeer ||
            (chartInfo.dataPeer ? chartInfo.dataPeer : null);
          const dataClient =
            newOptions.dataClient ||
            (chartInfo.dataClient ? chartInfo.dataClient : null);

          // Get stored data if available
          const category = this._getCategoryFromMainName(mainName);
          let parsedData = newOptions.parsedData;
          if (!parsedData && category) {
            const storedData = localStorage.getItem(category);
            if (storedData) {
              parsedData = JSON.parse(storedData);
            }
          }

          // Update the modal with current data
          if (dataPeer || dataClient) {
            console.log(`Updating modal for ${mainName} after chart update`);
            updateModal(mainName, dataPeer, dataClient, parsedData);
          }
        }
      }
    }
  }

  // Add this helper method to determine data category from chart name
  _getCategoryFromMainName(mainName) {
    // Map chart names to data categories
    const categoryMappings = {
      // Cash flow charts
      cashFlowsTrend: "cashData",
      daysCashOnHand: "cashData",
      daysExpensesInUnrestrictedNA: "cashData",
      daysExpensesInUnrestrictedNA_excludingPPE: "cashData",
      liquidityAssetsAvailableCover: "cashData",
      totalCoverageRatio: "cashData",
      assetsWithoutPpeToLiabilitiesWithoutDebt: "cashData",

      // Income charts
      contributionsTrend: "incomeData",
      annualizedInvestmentReturn: "incomeData",
      totalContributions: "incomeData",
      contributionsWithoutDR: "incomeData",

      // Expense charts
      functionalExpensePercent_program: "expenseData",
      functionalExpensePercent_administrative: "expenseData",
      functionalExpensePercent_fundraising: "expenseData",
      costOfContributions: "expenseData",
      costOfContributionsDetailView: "expenseData",
      functionalAllocation: "expenseData",

      // General charts
      netAssetBreakdown: "generalData",
      changeInNetAssets: "generalData",
    };

    return categoryMappings[mainName] || null;
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
