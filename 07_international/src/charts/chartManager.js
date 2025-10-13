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

    // Ensure numType is set in chart globals for all chart types
    if (!chartConfig.chart.events) {
      chartConfig.chart.events = {};
    }
    
    // Create or modify mounted event to ensure numType is set
    const originalMounted = chartConfig.chart.events.mounted;
    chartConfig.chart.events.mounted = function(chartContext) {
      // Ensure numType is set in chart globals
      if (chartContext && chartContext.w && chartContext.w.globals) {
        chartContext.w.globals.numType = dataType;
        // console.log(`Chart ${chartId} mounted with numType: ${dataType}`);
      }
      
      // Call original mounted event if it exists
      if (typeof originalMounted === 'function') {
        originalMounted.call(this, chartContext);
      }
    };

    // Create chart instance
    const chart = this._createAndRenderChart(chartId, chartConfig);
    
    // Ensure numType is explicitly set on the chart instance
    if (chart && chart.w && chart.w.globals) {
      chart.w.globals.numType = dataType;
      console.log(`Explicitly set numType for ${chartId}: ${dataType}`);
    }

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
      numType: dataType, // Store numType for future reference
    };

    document.dispatchEvent(new CustomEvent("chartOptionsApplied", { 
      detail: { 
        chartId,
        mainName,
        options: {
          dataPeer,
          dataClient,
          parsedData,
          numType: dataType,
          fixedNum,
          wa: weightedAverage
        }
      }
    }));

    return chart;
  }

  // Create a cash flow chart
  createCashFlowChart(chartId, data, cashFlowKeys) {
    try {
      const chartElement = document.getElementById(chartId);
      if (!chartElement) {
        console.error(`Chart element with ID "${chartId}" not found`);
        return;
      }
      chartElement.innerHTML = "";

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

      // Get chart configuration
      const chartConfig = chartConfigFactory.createConfig("cashFlow", {
        data,
        financing: cashFlowKeys[0],
        investing: cashFlowKeys[1],
        operating: cashFlowKeys[2],
        total: cashFlowKeys[3],
        seriesData, // Add the series data to the config params
      });
      
      // Ensure numType is set in chart globals for cash flow charts
      if (!chartConfig.chart.events) {
        chartConfig.chart.events = {};
      }
      
      // Create or modify mounted event to ensure numType is set
      const originalMounted = chartConfig.chart.events.mounted;
      chartConfig.chart.events.mounted = function(chartContext) {
        // Ensure numType is set in chart globals for cash flow charts
        if (chartContext && chartContext.w && chartContext.w.globals) {
          chartContext.w.globals.numType = 'dollar';
        }
        
        // Call original mounted event if it exists
        if (typeof originalMounted === 'function') {
          originalMounted.call(this, chartContext);
        }
      };

      // Create chart and store it
      const chart = this._createAndRenderChart(chartId, chartConfig);
      
      // Ensure numType is explicitly set on the chart instance
      if (chart && chart.w && chart.w.globals) {
        chart.w.globals.numType = 'dollar';
        console.log(`Explicitly set numType for ${chartId}: dollar`);
      }
      
      this.charts[chartId] = {
        instance: chart,
        config: chartConfig,
        type: "cashFlow",
        name: "cashFlow",
        numType: 'dollar', // Store numType for future reference
      };
      
      // Update corresponding modal
      this.updateCashFlowModal("cashFlowsTrend", data, cashFlowKeys);
      
      return chart;
    } catch (error) {
      console.error("Error creating cash flow chart:", error);
      return null;
    }
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
    
    // Ensure numType is explicitly set before rendering
    if (!chart.w) chart.w = {};
    if (!chart.w.globals) chart.w.globals = {};
    
    // Try to get numType from config first
    let numType = null;
    
    // Method 1: Look for numType in the mounted function
    if (config && config.chart && config.chart.events && config.chart.events.mounted) {
      const mountedFn = config.chart.events.mounted.toString();
      // Try more patterns for robustness
      const patterns = [
        /numType\s*=\s*['"]([^'"]+)['"]/,
        /numType\s*=\s*([a-zA-Z0-9_]+)/,
        /globals\.numType\s*=\s*['"]([^'"]+)['"]/,
        /globals\.numType\s*=\s*([a-zA-Z0-9_]+)/
      ];
      
      for (let pattern of patterns) {
        const match = mountedFn.match(pattern);
        if (match && match[1]) {
          numType = match[1];
          break;
        }
      }
    }
    
    // Method 2: Look for numType in chart config parameters
    if (!numType && config && config.numType) {
      numType = config.numType;
    }
    
    // Method 3: Use special case detection based on chart ID
    if (!numType) {
      if (chartId.includes('dollar') || chartId.includes('cost') || 
          chartId.includes('asset') || chartId.includes('contributions') ||
          chartId.includes('cashFlow')) {
        numType = 'dollar';
      } else if (chartId.includes('percent') || chartId.includes('Percent') || 
                chartId.includes('functional') || chartId.includes('Allocation')) {
        numType = 'percent';
      }
    }
    
    // Set the numType if we found it
    if (numType) {
      chart.w.globals.numType = numType;
      console.log(`Direct numType set for ${chartId}: ${numType}`);
    }
    
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

  // Utility function to fix numType for all chart instances
  fixChartNumTypes() {
    console.log("Fixing numType for all charts...");
    
    // Chart types that should be dollars
    const dollarCharts = [
      'totalContributions_chart',
      'contributionsWithoutDR_chart',
      'netAssetBreakdown_chart',
      'changeInNetAssets_chart',
      'statementCashFlows_chart',
      'costOfContributions_chart',
      'costOfContributionsDetailView_chart',
      'daysCashOnHand_chart',
      'liquidityAssetsAvailableCover_chart'
    ];
    
    // Chart types that should be percentages
    const percentCharts = [
      'functionalExpensePercent_program_chart',
      'functionalExpensePercent_administrative_chart',
      'functionalExpensePercent_fundraising_chart',
      'functionalAllocation_chart',
      'contributionsTrend_chart',
      'annualizedInvestmentReturn_chart'
    ];
    
    // Fix dollar charts
    dollarCharts.forEach(chartId => {
      const chart = this.getChart(chartId);
      if (chart && chart.w && chart.w.globals) {
        chart.w.globals.numType = 'dollar';
        console.log(`Fixed ${chartId} to dollar`);
      }
    });
    
    // Fix percent charts
    percentCharts.forEach(chartId => {
      const chart = this.getChart(chartId);
      if (chart && chart.w && chart.w.globals) {
        chart.w.globals.numType = 'percent';
        console.log(`Fixed ${chartId} to percent`);
      }
    });
    
    console.log("Chart numType fixing complete");
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
