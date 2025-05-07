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
    dataPeer,
    dataClient,
    numType,
    fixedNum,
    mainName,
    wa,
    title,
    chartType
  ) {
    try {
      if (!parsedData) {
        console.warn(`No data provided for chart ${mainName}`);
        this.createEmptyChart(chartId, mainName, title);
        return;
      }

      // Log the exact property names we're looking for
      if (mainName == 'cfiRatio') console.log(`Looking for data with properties:`, {
        peerKey: dataPeer,
        clientKey: dataClient,
        data: parsedData
      });

      // For CFI Ratio, handle data differently
      if (mainName === "cfiRatio") {
        // Extract the data using the provided keys, handling both direct data and keys
        const clientData = typeof dataClient === 'string' ? parsedData[dataClient] : dataClient;
        const peerData = typeof dataPeer === 'string' ? parsedData[dataPeer] : dataPeer;

        console.log("CFI Ratio Data:", {
          clientData,
          peerData,
          parsedData
        });

        if (!clientData && !peerData) {
          console.warn(`Missing peer and client data for CFI Ratio chart`);
          this.createEmptyChart(chartId, mainName, title);
          return;
        }

        // Transform the data into arrays
        const transformedClientData = this._transformCfiData(clientData);
        const transformedPeerData = this._transformCfiData(peerData);

        console.log("Transformed CFI Ratio Data:", {
          transformedClientData,
          transformedPeerData
        });

        // Create the chart using the transformed data and proper parameters
        return this.createChart(
          chartId,
          transformedPeerData, // Use the transformed peer data
          transformedClientData, // Use the transformed client data
          numType,
          fixedNum,
          mainName,
          wa,
          parsedData,
          3, // benchmark for CFI Ratio
          title || "CFI Overall Ratio",
          chartType || "line"
        );
      } else {
        // Handle other chart types as before
        const clientData = typeof dataClient === 'string' ? 
                          parsedData[dataClient] || 
                          parsedData[`${mainName}_Client`] || 
                          parsedData[`cfi_${mainName}_Client`] : dataClient;
        
        const peerData = typeof dataPeer === 'string' ? 
                         parsedData[dataPeer] || 
                         parsedData[`${mainName}_peerAverage_Peer`] || 
                         parsedData[`${mainName}_Peer`] : dataPeer;

        if (!clientData && !peerData) {
          console.warn(`Missing peer and client data for chart ${mainName}`);
          this.createEmptyChart(chartId, mainName, title);
          return;
        }

        const transformedClientData = this.transformClientData(clientData);
        const transformedPeerData = this.transformPeerData(peerData);

        return this.createChart(
          chartId,
          transformedPeerData,
          transformedClientData,
          numType,
          fixedNum,
          mainName,
          wa,
          parsedData,
          null,
          title,
          chartType
        );
      }
    } catch (error) {
      console.error(`Error creating chart from parsed data for ${mainName}:`, error);
      this.createEmptyChart(chartId, mainName, title);
      return null;
    }
  }

  // Add this new method to create empty charts as fallbacks
  createEmptyChart(chartId, mainName, title) {
    const element = document.getElementById(`${chartId}_chart`);
    if (!element) {
      console.warn(`Chart element ${chartId}_chart not found`);
      return;
    }

    element.innerHTML = `
      <div class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-lg font-medium">No data available</p>
          <p class="text-sm">Try adjusting your filters or selecting different years</p>
        </div>
      </div>
    `;
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
    if (mainName === "cfiRatio") {
      console.log("ChartManager.createChart called for:", {
        chartId,
        mainName,
        dataType,
        fixedNum,
        weightedAverage,
        dataPeer,
        dataClient,
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

    // Determine chart configuration type
    let configType;
    try {
      // Special chart types based on mainName
      if (
        mainName === "currentRatio" ||
        mainName === "tuitionDiscountRate" ||
        mainName === "tuitionDependency" ||
        mainName === "debtBurdenRatio" ||
        mainName === "endowmentAssetsPerStudent" ||
        mainName === "endowmentOperatingBudget" ||
        mainName === "cfiRatio" // Add cfiRatio to main chart type
      ) {
        configType = "main";
      } else if (
        chartType === "pie" ||
        mainName === "sourceOfIncomeClient" ||
        mainName === "sourceOfIncomePeer"
      ) {
        configType = "pie";
      } else if (
        chartType === "radialBar" ||
        mainName === "salariesBenefitsToTotalExpense" ||
        mainName === "salariesBenefitsPerNetTuition" ||
        mainName === "ltDebtPerTotalOperatingRevenue" ||
        mainName === "annualizedInvestmentReturn"
      ) {
        configType = "radialBar";
      } else if (
        chartType === "hlineargauge" ||
        mainName === "debtServiceCoverageRatio" ||
        mainName === "endowmentOperatingBudget"
      ) {
        configType = "hlineargauge";
      } else if (chartType === "rangeBar" || mainName === "ffa") {
        configType = "rangeBar";
      } else {
        configType = "main";
      }

      // For cfiRatio, ensure we're using the proper data format
      let clientDataParam = dataClient;
      let peerDataParam = dataPeer;

      // If we have strings for dataPeer/dataClient but actual objects in parsedData
      if (typeof dataPeer === 'string' && parsedData && parsedData[dataPeer]) {
        peerDataParam = parsedData[dataPeer];
      }

      if (typeof dataClient === 'string' && parsedData && parsedData[dataClient]) {
        clientDataParam = parsedData[dataClient];
      }

      // Get chart configuration from factory
      const chartConfig = configType === 'main' 
        ? chartConfigFactory.createMainChartConfig({
            dataPeer: peerDataParam,
            dataClient: clientDataParam,
            numType: dataType,
            fixedNum,
            mainName,
            benchmark,
            title,
            chartId,
            wa: weightedAverage,
            parsedData
          })
        : chartConfigFactory.createConfig(configType, {
            dataPeer: peerDataParam,
            dataClient: clientDataParam,
            numType: dataType,
            fixedNum,
            mainName,
            wa: weightedAverage,
            parsedData,
            benchmark,
            title,
            data: parsedData
          });

      if (!chartConfig) {
        console.warn(`No configuration created for chart type: ${configType}`);
        return null;
      }

      // Create and render the chart
      const chart = this._createAndRenderChart(chartId, chartConfig);

      // Store chart for reference
      this.charts[chartId] = {
        instance: chart,
        config: chartConfig,
        type: configType,
        name: mainName,
        weightedAverage,
        dataPeer: peerDataParam,
        dataClient: clientDataParam,
        parsedData,
      };

      return chart;
    } catch (error) {
      console.error(
        `Error creating chart configuration for ${mainName}:`,
        error
      );
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
    if (!chartId) {
      console.error("No chart ID provided to _createAndRenderChart");
      return null;
    }

    if (!config) {
      console.error(`No configuration provided for chart: ${chartId}`);
      return null;
    }

    if (config.mainName == 'cfiRatio' || chartId.includes('cfiRatio')) {
      console.log('chartManager._createAndRenderChart() for cfiRatio chart:', {
        chartId,
        config: {
          ...config,
          series: config.series.map(s => ({
            name: s.name,
            type: s.type,
            dataLength: s.data ? s.data.length : 0,
            data: s.data ? s.data.slice(0, 3) + "..." : "undefined" // Only log a preview
          }))
        }
      });
    }
    
    // Find the chart element
    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      console.error(`Chart element with ID "${chartId}" not found`);
      return null;
    }
    
    try {
      // Create and render the chart
      const chart = new ApexCharts(chartElement, config);
      
      // Add error handling for chart rendering
      try {
        chart.render();
        console.log(`Chart ${chartId} rendered successfully`);
      } catch (renderError) {
        console.error(`Error rendering chart ${chartId}:`, renderError);
        // Try to render a basic version if there was an error
        if (config.mainName === 'cfiRatio') {
          try {
            // Create a simplified config for fallback
            const fallbackConfig = {
              series: [{
                name: "CFI Ratio",
                data: [1, 2, 3, 4]
              }],
              chart: {
                type: 'line',
                height: 350
              },
              xaxis: {
                categories: ["2021", "2022", "2023", "2024"]
              },
              title: {
                text: "CFI Overall Ratio (Fallback)",
                align: "center"
              }
            };
            
            // Clear previous chart attempt
            chartElement.innerHTML = '';
            
            // Create and render fallback chart
            const fallbackChart = new ApexCharts(chartElement, fallbackConfig);
            fallbackChart.render();
            console.log(`Fallback chart ${chartId} rendered`);
            
            // Return the fallback chart
            return fallbackChart;
          } catch (fallbackError) {
            console.error(`Error rendering fallback chart:`, fallbackError);
            // Show error message in the chart area
            chartElement.innerHTML = `
              <div style="padding: 20px; text-align: center; color: #ff6384;">
                <h3>Chart rendering error</h3>
                <p>Unable to display CFI Ratio chart. Please check the console for details.</p>
              </div>
            `;
            return null;
          }
        }
      }

      // Add event listener for dark mode changes
      document.addEventListener("dark-mode", function () {
        if (chart) {
          chart.updateOptions(config);
        }
      });

      return chart;
      
    } catch (error) {
      console.error(`Error creating chart ${chartId}:`, error);
      // Show error message in the chart area
      chartElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #ff6384;">
          <h3>Chart creation error</h3>
          <p>Unable to create chart. Please check the console for details.</p>
        </div>
      `;
      return null;
    }
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

  // Update the transform methods to handle more data formats
  transformClientData(data) {
    if (!data) return null;

    // If data is an object with year properties
    if (typeof data === "object" && !Array.isArray(data)) {
      return Object.entries(data)
        .sort(([yearA], [yearB]) => yearA - yearB)
        .map(([_, yearData]) => {
          if (yearData && yearData.value !== undefined) {
            return parseFloat(yearData.value);
          }
          return null;
        })
        .filter((val) => val !== null);
    }

    return Array.isArray(data) ? data : null;
  }

  transformPeerData(data) {
    if (!data) return null;

    // If data is an object with year properties containing arrays
    if (typeof data === "object" && !Array.isArray(data)) {
      return Object.entries(data)
        .sort(([yearA], [yearB]) => yearA - yearB)
        .map(([_, yearData]) => {
          if (Array.isArray(yearData)) {
            // Calculate average of peer data array
            const validValues = yearData.filter(
              (v) => v !== null && v !== undefined
            );
            return validValues.length > 0
              ? validValues.reduce((sum, val) => sum + parseFloat(val), 0) /
                  validValues.length
              : null;
          }
          return null;
        })
        .filter((val) => val !== null);
    }

    return Array.isArray(data) ? data : null;
  }

  // Add helper method for CFI data transformation
  _transformCfiData(data) {
    if (!data) return null;
    
    // If data is an object with year properties
    if (typeof data === 'object' && !Array.isArray(data)) {
      console.log('Transforming CFI data:', data);
      
      // Handle peer data structure where data is the peer average object
      if (data.cfiRatio_peerAverage_Peer) {
        return Object.entries(data.cfiRatio_peerAverage_Peer)
          .sort(([yearA], [yearB]) => yearA - yearB)
          .map(([_, values]) => {
            if (Array.isArray(values)) {
              const validValues = values.filter(v => v !== null && v !== undefined);
              return validValues.length > 0 
                ? validValues.reduce((sum, val) => sum + parseFloat(val), 0) / validValues.length 
                : null;
            }
            return null;
          })
          .filter(val => val !== null);
      }
      
      // Handle client data structure where data is the client data object
      if (data.cfiRatio_Client) {
        return Object.entries(data.cfiRatio_Client)
          .sort(([yearA], [yearB]) => yearA - yearB)
          .map(([_, yearData]) => {
            if (yearData && yearData.value !== undefined) {
              const value = parseFloat(yearData.value);
              return isNaN(value) ? null : value;
            }
            return null;
          })
          .filter(val => val !== null);
      }
      
      // Handle case where data itself contains year-value pairs with value property
      if (Object.keys(data).some(key => /^\d{4}$/.test(key))) {
        return Object.entries(data)
          .filter(([year]) => /^\d{4}$/.test(year))
          .sort(([yearA], [yearB]) => yearA - yearB)
          .map(([_, yearData]) => {
            if (yearData && yearData.value !== undefined) {
              const value = parseFloat(yearData.value);
              return isNaN(value) ? null : value;
            }
            return null;
          })
          .filter(val => val !== null);
      }
      
      // Handle case where data itself contains year-value pairs with array values (peer data)
      if (Object.keys(data).some(key => /^\d{4}$/.test(key) && Array.isArray(data[key]))) {
        return Object.entries(data)
          .filter(([year]) => /^\d{4}$/.test(year))
          .sort(([yearA], [yearB]) => yearA - yearB)
          .map(([_, values]) => {
            if (Array.isArray(values)) {
              const validValues = values.filter(v => v !== null && v !== undefined);
              return validValues.length > 0 
                ? validValues.reduce((sum, val) => sum + parseFloat(val), 0) / validValues.length 
                : null;
            }
            return null;
          })
          .filter(val => val !== null);
      }
    }
    
    // Handle case where data is already an array
    if (Array.isArray(data)) {
      return data.map(v => {
        const parsed = parseFloat(v);
        return isNaN(parsed) ? null : parsed;
      }).filter(v => v !== null);
    }
    
    return null;
  }
}

// Create and export singleton instance
window.chartManager = window.chartManager || new ChartManager();
