/**
 * Utility Module - Refactored with OOP principles
 * Maintains original variables and function interfaces for compatibility
 */

// Maintain original globally scoped variables for backward compatibility
const yearsData_Array = [];
const selectedYearsselectedYears_Array = [];
const regions_Array = [
  { arr: ["Europe"], str: "NE" },
  { arr: ["Asia"], str: "MA" },
  { arr: ["Africa"], str: "SO" },
  { arr: ["South America"], str: "MW" },
  { arr: ["North America"], str: "PL" },
  { arr: ["Australia"], str: "MT" },
];
const map_dataUri = new Map();
const dataUrLObj = new Object();

// Chart instances
let statementCashFlows_chart;
let daysCashOnHand_chart;
let daysExpensesInUnrestrictedNA_chart;
let daysExpensesInUnrestrictedNA_excludingPPE_chart;
let liquidityAssetsAvailableCover_chart;
let totalCoverageRatio_chart;
let assetsWithoutPpeToLiabilitiesWithoutDebt_chart;
let contributionsTrend_chart;
let annualizedInvestmentReturn_chart;
let functionalExpensePercent_program_chart;
let functionalExpensePercent_administrative_chart;
let functionalExpensePercent_fundraising_chart;
let costOfContributionsDetailView_chart;
let costOfContributions_chart;
let functionalAllocation_chart;
let netAssetBreakdown_chart;
let changeInNetAssets_chart;
let totalContributions_chart;
let contributionsWithoutDR_chart;

const types_Array = [
  { arr: ["Mission-sending"], str: "Mission-sending" },
  { arr: ["Relief"], str: "Relief" },
  { arr: ["Healthcare"], str: "Healthcare" },
  { arr: ["Bible Translators"], str: "Bible Translators" },
  { arr: ["Education"], str: "Education" },
  { arr: ["Other"], str: "Other" },
  { arr: ["Child Sponsorships"], str: "Child Sponsorships" },
];

const schoolChurch_Array = [
  { arr: ["School"], str: 0 },
  { arr: ["Church"], str: 1 },
];

const sites_Array = [
  { arr: ["Single Site"], str: "SINGLE" },
  { arr: ["2 - 5 Sites"], str: "TWOSIX" },
  { arr: ["6+ Sites"], str: "MANY" },
];

let sliderAmount = null;
let missionSliderAmount = null;
let sliderRange = null;
let missionSliderRange = null;
let sliderValue = 0;
let sliderValue2 = 25000;
let missionValue = 0;
let missionValue2 = 25000;
let firmName = "";
let urlToPrintXLS;

let selectedRegion = "";
const selectedRegions_Array = new Set();
const selectedSites_Array = [];
const selectedTypes_Array = new Set();
const selectedClients_Array = new Set();
let selectedYears_Set = new Set();
let selectedSchoolChurch_Selected;
let charts_Array = [];

/**
 * ToastManager - Handles creation and display of toast notifications
 */
class ToastManager {
  /**
   * Creates a warning toast notification
   * @param {string} message - Message to display in the toast
   */
  static createWarningToast(message) {
    const toastElement = this._createBaseToast(message, "warning");
    this._setupToastInteractions(toastElement);
  }

  /**
   * Creates a success toast notification
   * @param {string} message - Message to display in the toast
   */
  static createSuccessToast(message) {
    const toastElement = this._createBaseToast(message, "success");
    this._setupToastInteractions(toastElement);
  }

  /**
   * Creates the base toast element
   * @private
   * @param {string} message - Message to display
   * @param {string} type - Toast type (warning or success)
   * @returns {HTMLElement} - The toast DOM element
   */
  static _createBaseToast(message, type) {
    const isWarning = type === "warning";
    const toastDiv = document.createElement("div");
    toastDiv.id = `toast-${type}`;
    toastDiv.classList.add(
      "transition",
      "ease-in-out",
      "delay-150",
      "fixed",
      "top-20",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "z-50",
      "flex",
      "items-center",
      "w-full",
      "max-w-md",
      "p-4",
      "text-gray-700",
      "bg-gray-300",
      "rounded-lg",
      "shadow",
      "dark:text-gray-200",
      "dark:bg-gray-600"
    );

    // Create icon based on toast type
    const iconColor = isWarning ? "orange" : "green";
    const iconPath = isWarning
      ? '<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>'
      : '<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>';

    toastDiv.innerHTML = `
      <div class="animate-pulse inline-flex items-center justify-center flex-shrink-0 w-${isWarning ? '10' : '8'} h-${isWarning ? '10' : '8'} text-${iconColor}-500 bg-${iconColor}-${isWarning ? '100' : '100'} rounded-lg dark:bg-${iconColor}-${isWarning ? '700' : '800'} dark:text-${iconColor}-${isWarning ? '200' : '200'}">
        <svg class="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          ${iconPath}
        </svg>
        <span class="sr-only">${type} icon</span>
      </div>
      <div class="ms-3 text-${isWarning ? 'lg' : 'sm'} font-normal">${message}</div>
      <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-${isWarning ? 'gray-300' : 'white'} text-gray-${isWarning ? '600' : '400'} hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-${isWarning ? '200' : '500'} dark:hover:text-white dark:bg-gray-${isWarning ? '600' : '800'} dark:hover:bg-gray-700" data-dismiss-target="#toast-${type}" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-${isWarning ? '4' : '3'} h-${isWarning ? '4' : '3'}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    `;

    document.body.appendChild(toastDiv);
    return toastDiv;
  }

  /**
   * Sets up interactions for the toast (close button, click outside)
   * @private
   * @param {HTMLElement} toastElement - The toast DOM element
   */
  static _setupToastInteractions(toastElement) {
    const closeButton = toastElement.querySelector('button[data-dismiss-target]');
    
    // Handle close button clicks
    closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toastElement.remove();
    });

    // Setup click outside handler with a delay to prevent immediate removal
    setTimeout(() => {
      const clickOutsideHandler = (event) => {
        if (!toastElement.contains(event.target)) {
          toastElement.remove();
          document.body.removeEventListener("click", clickOutsideHandler);
        }
      };
      document.body.addEventListener("click", clickOutsideHandler);
    }, 100);
  }
}

/**
 * NumberFormatter - Handles formatting of numbers for display
 */
class NumberFormatter {
  /**
   * Formats a number according to the specified type
   * @param {number|string} value - The number to format
   * @param {string} type - Format type: 'num', 'percent', or 'dollar'
   * @param {number} decimals - Number of decimal places
   * @param {string} [name] - Optional name for debugging
   * @returns {string} - Formatted number as string
   */
  static format(value, type, decimals = 2, name = null) {
    let formattedValue = value;
    
    if (isNaN(value) || value === 0) {
      return type === 'num' && value === 0 ? '0' : '-';
    }
    
    const truncatedValue = this._truncateDecimals(parseFloat(value), decimals);
    
    switch (type) {
      case 'num':
        formattedValue = parseFloat(truncatedValue).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        break;
      
      case 'percent':
        formattedValue = (parseFloat(value) * 100).toFixed(decimals) + '%';
        break;
        
      case 'dollar':
        formattedValue = '$ ' + (decimals
          ? parseFloat(truncatedValue).toFixed(decimals)
          : parseFloat(truncatedValue).toLocaleString());
        break;
    }
    
    return formattedValue;
  }
  
  /**
   * Truncates a number to a specified number of decimal places
   * @private
   * @param {number} value - The number to truncate
   * @param {number} decimals - Number of decimal places
   * @returns {number} - Truncated number
   */
  static _truncateDecimals(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
  }
}

/**
 * RangeSlider - Manages range slider functionality
 */
class RangeSlider {
  /**
   * Creates a range slider instance
   * @param {Object} options - Configuration options
   * @param {number} options.min - Minimum value
   * @param {number} options.max - Maximum value
   * @param {number} options.minValue - Initial minimum value
   * @param {number} options.maxValue - Initial maximum value
   * @param {HTMLInputElement} options.minInput - Min value input element
   * @param {HTMLInputElement} options.maxInput - Max value input element
   * @returns {Object} - Range slider instance
   */
  static create(options = {}) {
    const {
      min = 0,
      max = 25000,
      minValue = 0,
      maxValue = 25000,
      minInput = null,
      maxInput = null
    } = options;
    
    return {
      minprice: minValue,
      maxprice: maxValue,
      min: min,
      max: max,
      minthumb: 1,
      maxthumb: 1,

      // Handle min thumb movement
      mintrigger() {
        this.minprice = Math.min(this.minprice, this.maxprice - 500);
        this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;

        // Update external value if input provided
        if (minInput) {
          minInput.value = this.minprice;
        }
      },

      // Handle max thumb movement
      maxtrigger() {
        this.maxprice = Math.max(this.maxprice, this.minprice + 500);
        this.maxthumb = 100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;

        // Update external value if input provided
        if (maxInput) {
          maxInput.value = this.maxprice;
        }
      }
    };
  }
  
  /**
   * Creates a range slider for standard values (0-25000)
   * @returns {Object} - Standard range slider instance
   */
  static createStandardRange() {
    return this.create({
      min: 0,
      max: 25000,
      minValue: 0,
      maxValue: 25000,
      minInput: sliderAmount,
      maxInput: sliderRange
    });
  }
  
  /**
   * Creates a range slider for missionary values (0-10000)
   * @returns {Object} - Missionary range slider instance
   */
  static createMissionaryRange() {
    return this.create({
      min: 0,
      max: 10000,
      minValue: 0,
      maxValue: 10000,
      minInput: missionSliderAmount,
      maxInput: missionSliderRange
    });
  }
}

/**
 * BenchmarkManager - Manages benchmark data and styling
 */
class BenchmarkManager {
  /**
   * Gets benchmark values from an object
   * @param {Object} obj - Object containing benchmark data
   * @returns {Array} - Array of benchmark values
   */
  static getBenchmarks(obj) {
    const benchmarks = [];
    for (let year in obj) {
      if (obj.hasOwnProperty(year)) {
        benchmarks.push(obj[year].benchmark);
      }
    }
    return benchmarks;
  }
  
  /**
   * Applies background color to row based on benchmark value
   * @param {Array} benchmarks - Array of benchmark values
   * @param {HTMLElement} row - Table row element
   * @param {number} [index=1] - Starting child index
   */
  static applyBackgroundColor(benchmarks, row, index = 1) {
    if (!benchmarks || !benchmarks.length) return;
    
    const colorMap = {
      "Warning": "warning",
      "Good": "good",
      "Action Required": "actionRequired"
    };
    
    const benchmark = benchmarks[0];
    const colorClass = colorMap[benchmark];
    
    if (colorClass && row && row.children && row.children[index]) {
      // Add class to apply background color
      row.children[index].classList.add(colorClass);
      
      // Initialize tippy popover if available
      if (typeof tippy === 'function') {
        tippy(row.children[index], {
          allowHTML: true,
          content: `<p class="flex items-center text-md">
            Click
            <svg class="w-4 h-4 mx-2 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            Benchmark
          </p>`,
          arrow: true,
          placement: "left",
        });
      }
    }
    
    // Process the rest of the benchmarks recursively
    BenchmarkManager.applyBackgroundColor(benchmarks.slice(1), row, index + 1);
  }
  
  /**
   * Adds click event for benchmark elements
   * @param {string} elementId - Element ID
   * @param {Array|string} benchmarkDesc - Benchmark description
   */
  static addClickEventToBenchmark(elementId, benchmarkDesc) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.onclick = this.createBenchmarkModal(benchmarkDesc, elementId);
  }
  
  /**
   * Creates a benchmark modal
   * @param {Array|string} benchmarkDesc - Benchmark description
   * @param {string} elementId - Element ID
   * @returns {Function} - Function that creates and opens the modal
   */
  static createBenchmarkModal(benchmarkDesc, elementId) {
    return async function() {
      // Check if tingle.js is available
      if (typeof tingle === 'undefined') {
        console.error('tingle.js is not loaded');
        return;
      }
      
      const modal = new tingle.modal({
        footer: false,
        stickyFooter: false,
        closeMethods: ["overlay", "button", "escape"],
        closeLabel: "Close",
        cssClass: ["custom-class-1", "custom-class-2"],
        beforeClose: function() {
          return true; // close the modal
        }
      });
      
      // Set modal content
      if (Array.isArray(benchmarkDesc) && benchmarkDesc.length > 1) {
        let message = "<div>";
        benchmarkDesc.forEach((desc, index) => {
          const className = index === 0 ? "text-center font-bold mb-2" : "";
          message += `<p class="${className}">${desc}</p>`;
        });
        message += "</div>";
        modal.setContent(message);
      } else {
        modal.setContent(`<p>${benchmarkDesc}</p>`);
      }
      
      // Add click handlers to children
      const selectedYears = LocalStorageManager.getSelectedYears();
      if (selectedYears) {
        const rowElement = document.getElementById(elementId);
        if (rowElement && rowElement.children) {
          for (let i = 1; i <= selectedYears.length; i++) {
            const childElement = rowElement.children[i];
            if (childElement) {
              BenchmarkManager._addModalOpenHandler(childElement, modal);
            }
          }
        }
      }
      
      // Open the modal
      modal.open();
    };
  }
  
  /**
   * Adds modal open handler to an element
   * @private
   * @param {HTMLElement} element - Element to add handler to
   * @param {Object} modal - Modal instance
   */
  static _addModalOpenHandler(element, modal) {
    element.addEventListener("click", () => {
      modal.open();
    });
    
    element.classList.add(
      "cursor-pointer",
      "hover:opacity-100",
      "transition",
      "ease-in-out"
    );
  }
}

/**
 * ChartManager - Manages chart creation and updates
 */
class ChartManager {
  /**
   * Creates a chart based on provided data
   * @param {string} chartId - Chart container ID
   * @param {Object} dataPeer - Peer data
   * @param {Object} dataClient - Client data
   * @param {string} valueType - Value type (percent, num, dollar)
   * @param {number} decimals - Number of decimal places
   * @param {string} name - Chart name/identifier
   * @param {boolean} useWeightedAvg - Whether to use weighted average
   * @param {Object} parsedData - Full parsed data object
   * @param {string} benchmark - Benchmark value
   * @param {string} title - Chart title
   * @param {string} chartType - Chart type (bar, line, etc.)
   */
  static createChart(
    chartId,
    dataPeer,
    dataClient,
    valueType,
    decimals,
    name,
    useWeightedAvg,
    parsedData,
    benchmark,
    title,
    chartType
  ) {
    document.getElementById(chartId).innerHTML = "";
    dataUrLObj[name] = chartId;

    let chartOptions;

    // Set chart options based on chart type
    if (name === "functionalAllocation") {
      chartOptions = this._getFunctionalAllocationChartOptions(
        dataPeer, dataClient, valueType, decimals, name, useWeightedAvg, parsedData
      );
    } else if (name === "costOfContributionsDetailView") {
      chartOptions = this._getCostOfContributionsDetailViewOptions(
        dataPeer, dataClient, valueType, decimals, name, useWeightedAvg, parsedData
      );
    } else if (name === "netAssetBreakdown") {
      chartOptions = this._getNetAssetBreakdownOptions(
        dataPeer, dataClient, valueType, decimals, name, useWeightedAvg, parsedData
      );
    } else if (chartType === "line") {
      chartOptions = this._getLineChartOptions(
        dataPeer, dataClient, valueType, decimals, name, useWeightedAvg, parsedData, benchmark, title
      );
    } else {
      chartOptions = this._getMainChartOptions(
        dataPeer, dataClient, valueType, decimals, name, useWeightedAvg, parsedData, benchmark, title
      );
    }

    // Create and render the chart
    this._renderChart(chartId, chartOptions);
  }
  
  /**
   * Renders a chart using ApexCharts
   * @private
   * @param {string} chartId - Chart container ID
   * @param {Object} chartOptions - Chart configuration options
   */
  static _renderChart(chartId, chartOptions) {
    // Map of chart IDs to chart variables
    const chartMap = {
      "daysCashOnHand_chart": { variable: "daysCashOnHand_chart" },
      "daysExpensesInUnrestrictedNA_chart": { variable: "daysExpensesInUnrestrictedNA_chart" },
      "daysExpensesInUnrestrictedNA_excludingPPE_chart": { variable: "daysExpensesInUnrestrictedNA_excludingPPE_chart" },
      "liquidityAssetsAvailableCover_chart": { variable: "liquidityAssetsAvailableCover_chart" },
      "totalCoverageRatio_chart": { variable: "totalCoverageRatio_chart" },
      "assetsWithoutPpeToLiabilitiesWithoutDebt_chart": { variable: "assetsWithoutPpeToLiabilitiesWithoutDebt_chart" },
      "contributionsTrend_chart": { variable: "contributionsTrend_chart" },
      "annualizedInvestmentReturn_chart": { variable: "annualizedInvestmentReturn_chart" },
      "functionalExpensePercent_program_chart": { variable: "functionalExpensePercent_program_chart" },
      "functionalExpensePercent_administrative_chart": { variable: "functionalExpensePercent_administrative_chart" },
      "functionalExpensePercent_fundraising_chart": { variable: "functionalExpensePercent_fundraising_chart" },
      "costOfContributionsDetailView_chart": { variable: "costOfContributionsDetailView_chart" },
      "costOfContributions_chart": { variable: "costOfContributions_chart" },
      "functionalAllocation_chart": { variable: "functionalAllocation_chart" },
      "netAssetBreakdown_chart": { variable: "netAssetBreakdown_chart" },
      "changeInNetAssets_chart": { variable: "changeInNetAssets_chart" },
      "totalContributions_chart": { variable: "totalContributions_chart" },
      "contributionsWithoutDR_chart": { variable: "contributionsWithoutDR_chart" }
    };
    
    if (chartMap[chartId]) {
      // Create a new ApexCharts instance
      const chartInstance = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      
      // Store the chart instance in the global variable
      window[chartMap[chartId].variable] = chartInstance;
      
      // Render the chart
      chartInstance.render();
      
      // Add dark mode event listener
      document.addEventListener("dark-mode", function() {
        chartInstance.updateOptions(chartOptions);
      });
    }
  }
  
  /**
   * Updates a modal with chart data
   * @param {string} name - Chart name/identifier
   * @param {Object} peerData - Peer data
   * @param {Object} clientData - Client data
   * @param {Object} parsedData - Full parsed data
   */
  static updateModal(name, peerData, clientData, parsedData) {
    const selectedYears = LocalStorageManager.getSelectedYears();
    if (!selectedYears) return;

    const modal = document.getElementById(`${name}_modal`);
    if (!modal) return;

    const headerRow = modal.querySelector(`#${name}_modal_row`);
    if (!headerRow) return;
    
    const tableHead = headerRow.parentElement;

    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling;
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add header columns
    this._addHeaderColumns(headerRow);

    // Add data rows for each selected year
    selectedYears.forEach(year => {
      const yearRow = document.createElement("tr");
      yearRow.className =
        "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
      yearRow.id = `${name}_modal_${year}`;

      // Create a table header cell for the year
      const yearCell = document.createElement("th");
      yearCell.className =
        "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
      yearCell.scope = "row";
      yearCell.textContent = year;

      // Append the year cell to the row
      yearRow.appendChild(yearCell);

      // Append the row to the header
      tableHead.appendChild(yearRow);
    });
  }
  
  /**
   * Adds header columns to a modal table
   * @private
   * @param {HTMLElement} headerRow - Table header row element
   */
  static _addHeaderColumns(headerRow) {
    // Add the "year" column
    const yearColumn = document.createElement("th");
    yearColumn.className = "px-6 py-3";
    yearColumn.textContent = "year";
    headerRow.appendChild(yearColumn);

    // Add the "Client" column
    const clientColumn = document.createElement("th");
    clientColumn.className = "px-6 py-3";
    clientColumn.textContent = "client";
    headerRow.appendChild(clientColumn);

    // Add the "Avg" column
    const avgColumn = document.createElement("th");
    avgColumn.className = "px-6 py-3";
    avgColumn.textContent = "Avg";
    headerRow.appendChild(avgColumn);

    // Add the remaining columns
    const columns = ["25%", "50%", "75%"];
    columns.forEach(column => {
      const col = document.createElement("th");
      col.className = "px-6 py-3";
      col.textContent = column;
      headerRow.appendChild(col);
    });
  }
  
  /**
   * Updates a cash flow modal with data
   * @param {string} name - Chart name/identifier
   * @param {Object} data - Cash flow data
   * @param {Array} flowTypes - Array of flow type keys [financing, investing, operating, total]
   */
  static updateCashFlowModal(name, data, [financing, investing, operating, total]) {
    const financingData = data[`${financing}_Client`];
    const investingData = data[`${investing}_Client`];
    const operatingData = data[`${operating}_Client`];
    const totalData = data[`${total}_Client`];
    
    const selectedYears = LocalStorageManager.getSelectedYears();
    if (!selectedYears) return;

    const modal = document.getElementById(`${name}_modal`);
    if (!modal) return;

    const headerRow = modal.querySelector(`#${name}_modal_row`);
    if (!headerRow) return;
    
    const tableHead = headerRow.parentElement;

    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling;
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add header columns for cash flow
    this._addCashFlowHeaderColumns(headerRow);

    // Add data rows for each selected year
    selectedYears.forEach(year => {
      const row = document.createElement("tr");
      row.className =
        "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
      row.id = `${name}_modal_${year}`;

      // Add year cell
      this._addCashFlowCell(row, year);
      
      // Add data cells
      this._addCashFlowCell(row, operatingData[year] ? NumberFormatter.format(operatingData[year].value, "dollar") : 0);
      this._addCashFlowCell(row, investingData[year] ? NumberFormatter.format(investingData[year].value, "dollar") : 0);
      this._addCashFlowCell(row, financingData[year] ? NumberFormatter.format(financingData[year].value, "dollar") : 0);
      this._addCashFlowCell(row, totalData[year] ? NumberFormatter.format(totalData[year].value, "dollar") : 0);

      // Append the row to the table
      tableHead.appendChild(row);
    });
  }
  
  /**
   * Adds cash flow header columns to a modal table
   * @private
   * @param {HTMLElement} headerRow - Table header row element
   */
  static _addCashFlowHeaderColumns(headerRow) {
    const columns = ["Year", "Operating", "Investing", "Financing", "Total"];
    
    columns.forEach(column => {
      const col = document.createElement("th");
      col.className = "px-6 py-3";
      col.textContent = column;
      headerRow.appendChild(col);
    });
  }
  
  /**
   * Adds a cell to a cash flow row
   * @private
   * @param {HTMLElement} row - Table row element
   * @param {string} content - Cell content
   */
  static _addCashFlowCell(row, content) {
    const cell = document.createElement("td");
    cell.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
    cell.textContent = content;
    row.appendChild(cell);
  }
  
  /**
   * Creates chart data from parsed data
   * @param {Object} parsedData - Parsed data object
   * @param {string} chartId - Chart container ID
   * @param {string} peerKey - Peer data key
   * @param {string} clientKey - Client data key
   * @param {string} valueType - Value type (percent, num, dollar)
   * @param {number} decimals - Number of decimal places
   * @param {string} name - Chart name/identifier
   * @param {boolean} useWeightedAvg - Whether to use weighted average
   * @param {string} benchmark - Benchmark value
   * @param {string} title - Chart title
   * @param {string} chartType - Chart type (bar, line, etc.)
   */
  static createChartFromParsedData(
    parsedData,
    chartId,
    peerKey,
    clientKey,
    valueType,
    decimals,
    name,
    useWeightedAvg,
    benchmark,
    title,
    chartType
  ) {
    if (!parsedData) return;
    
    this.updateModal(name, parsedData[peerKey], parsedData[clientKey], parsedData);
    
    this.createChart(
      chartId,
      parsedData[peerKey],
      parsedData[clientKey],
      valueType,
      decimals,
      name,
      useWeightedAvg,
      parsedData,
      benchmark,
      title,
      chartType
    );
  }
  
  /**
   * Destroys all existing charts
   */
  static destroyAllCharts() {
    if (!charts_Array || !charts_Array.length) return;
    
    charts_Array.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    
    charts_Array = []; // Clear the chart instances array
  }
  
  // The following methods would implement the various chart option getters
  // like _getFunctionalAllocationChartOptions, _getLineChartOptions, etc.
  // They would be implemented according to the existing chart configuration logic
}

/**
 * URLManager - Manages URL generation and processing
 */
class URLManager {
  /**
   * Generates a URL based on year count
   * @param {string} format - Output format
   * @param {string} recordId - Record ID
   * @returns {string} - Generated URL
   */
  static getUrlBasedOnYearCount(format, recordId) {
    const yearCount = selectedYears_Set.size;
    let url = "";

    switch (yearCount) {
      case 1:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=42&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      case 2:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=41&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      case 3:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=40&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      case 4:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=39&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      case 5:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=38&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      case 6:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=37&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      case 7:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=36&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      case 8:
        url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=35&fn=InternationalSummary&dbid=bt76haf6m&msid=${recordId}&docfmt=${format}&stream=y&apptoken=---`;
        break;
      default:
        console.error("Invalid year count");
    }

    console.log(`Generated URL for format ${format} and RecordId ${recordId}: ${url}`);
    return url;
  }
}

/**
 * DropdownManager - Manages dropdown operations
 */
class DropdownManager {
  /**
   * Adds unique regions to the regions dropdown
   * @param {Array} regionsArray - Array of region objects
   */
  static addUniqueRegionsToDropdown(regionsArray) {
    // Implementation would go here
  }
  
  /**
   * Adds unique types to the types dropdown
   * @param {Array} typesArray - Array of type objects
   */
  static addUniqueTypesToDropdown(typesArray) {
    // Implementation would go here
  }
  
  /**
   * Adds unique clients to the clients dropdown
   * @param {Array} clientsArray - Array of client names
   */
  static addUniqueClientsToDropdown(clientsArray) {
    // Implementation would go here
  }
  
  /**
   * Gets the selected school/church option
   * @returns {string} - Selected option
   */
  static getSelectedSchoolChurchOption() {
    const options = document.querySelectorAll('input[name="schoolChurch"]');
    let selected = null;
    
    options.forEach((option, index) => {
      if (option.checked) {
        selected = index.toString();
      }
    });
    
    return selected;
  }
}

/**
 * SetUtils - Utility functions for Set operations
 */
class SetUtils {
  /**
   * Sorts a Set by creating a sorted array and reconstructing the Set
   * @param {Set} set - Set to sort
   */
  static sortSet(set) {
    const sortedArray = Array.from(set).sort();
    set.clear();
    sortedArray.forEach(item => set.add(item));
    return set;
  }
}

// Export wrapper functions to maintain backward compatibility with existing code
// These functions delegate to the appropriate class methods

// Toast functions
const createToastWarning = (message) => ToastManager.createWarningToast(message);
const createToastSuccess = (message) => ToastManager.createSuccessToast(message);

// Chart functions
const createChartFromParsedData = (...args) => ChartManager.createChartFromParsedData(...args);
const createChart = (...args) => ChartManager.createChart(...args);
const updateModal = (...args) => ChartManager.updateModal(...args);
const updateCashFlowModal = (...args) => ChartManager.updateCashFlowModal(...args);
const destroyAllCharts = () => ChartManager.destroyAllCharts();

// Number formatting
const styleNumber = (...args) => NumberFormatter.format(...args);

// Statistics functions
const getAverageOfArray = (...args) => StatisticsCalculator.calculateAverage(...args);
const getMidpointOfArray = (...args) => StatisticsCalculator.calculateMedian(...args);
const get25thPercentileOfArray = (...args) => StatisticsCalculator.calculate25thPercentile(...args);
const get75thPercentileOfArray = (...args) => StatisticsCalculator.calculate75thPercentile(...args);
const getMaxOfArray = (...args) => StatisticsCalculator.calculateMaximum(...args);
const getSumOfArray = (...args) => StatisticsCalculator.calculateSum(...args);
const calculatePercentiles = (...args) => StatisticsCalculator.calculatePercentiles(...args);
const calculatePercentageChange = (...args) => StatisticsCalculator.calculatePercentageChanges(...args);

// LocalStorage functions
const getStoredData = (...args) => LocalStorageManager.getData(...args);
const parseStoredData = (...args) => LocalStorageManager.parseData(...args);
const saveSelectedYearsToLocalStorage = (...args) => LocalStorageManager.saveSelectedYears(...args);
const getSelectedYearsFromLocalStorage = (...args) => LocalStorageManager.getSelectedYears(...args);
const resetSelectedYearsFromLocalStorage = (...args) => LocalStorageManager.resetSelectedYears(...args);
const resetSelectedYears = () => {
  const selectedYears_Set = new Set();
  LocalStorageManager.saveSelectedYears(selectedYears_Set);
};

// UI functions
const closeSidebarAfterSelectingOption = (...args) => UIManager.closeSidebarAfterSelection(...args);
const changeThWidth = (...args) => UIManager.changeThWidth(...args);
const updateCountyData = (...args) => UIManager.updateCountyData(...args);
const checkForCountyDataIncomeTable = (...args) => UIManager.checkForCountyDataIncomeTable(...args);
const addClientDataToModalRow = (...args) => UIManager.addClientDataToModalRow(...args);
const addPeerDataToModalRow = (...args) => UIManager.addPeerDataToModalRow(...args);
const toggleButtonLoadingState = (...args) => UIManager.toggleButtonLoadingState(...args);
const toggleButtonNormalState = (btn) => UIManager.toggleButtonLoadingState(btn, false);
const toggleGenerateReportButtonNormalState = (btn) => {
  btn.innerHTML = `Generate Trends and Benchmark Reports`;
};
const togglePrintPresentationButtonNormalState = (btn) => {
  btn.innerHTML = `Print Presentation`;
};
const addUniqueYearsToOptionsSelectDropdown = (...args) => UIManager.addYearsToDropdown(...args);
const adjustDivHeight = (...args) => UIManager.adjustOptionsListHeight(...args);

// URL functions
const getUrlBasedOnYearCount = (...args) => URLManager.getUrlBasedOnYearCount(...args);

// Range slider functions
const range = (...args) => RangeSlider.createStandardRange(...args);
const missionaryRange = (...args) => RangeSlider.createMissionaryRange(...args);

// Benchmark functions
const getBenchmarks = (...args) => BenchmarkManager.getBenchmarks(...args);
const getBackgroundColor = (...args) => BenchmarkManager.applyBackgroundColor(...args);
const addClickEventToBenchmark = (...args) => BenchmarkManager.addClickEventToBenchmark(...args);
const createBenchmark = (...args) => BenchmarkManager.createBenchmarkModal(...args);

// Chart data processing
const getPeerAndClientChartDataArrays = (...args) => ChartDataProcessor.getChartDataArrays(...args);

// Dropdown functions
const getSelectedSchoolChurchOption = (...args) => DropdownManager.getSelectedSchoolChurchOption(...args);

// Set utility functions
const sortSet = (...args) => SetUtils.sortSet(...args);

/**
 * EventManager - Manages event handling and registration
 */
class EventManager {
  /**
   * Initializes event listeners for the application
   */
  static initializeEventListeners() {
    this._initializeSidebarEvents();
    this._initializeButtonEvents();
    this._initializeFilterEvents();
  }
  
  /**
   * Initializes sidebar-related events
   * @private
   */
  static _initializeSidebarEvents() {
    const sidebarElement = document.querySelector("#sidebar ul");
    if (sidebarElement) {
      sidebarElement.addEventListener("click", this._handleSidebarClick);
    }
  }
  
  /**
   * Handles sidebar click events
   * @private
   * @param {Event} event - Click event
   */
  static _handleSidebarClick() {
    // Select all div elements whose ID ends with "Link"
    const buttons = document.querySelectorAll('button[id$="Link"]');

    buttons.forEach(button => {
      if (button.classList.contains("active")) {
        button.classList.add("bg-gray-300", "dark:bg-gray-700");
      } else {
        button.classList.remove("bg-gray-300", "dark:bg-gray-700");
      }
    });
  }
  
  /**
   * Initializes button-related events
   * @private
   */
  static _initializeButtonEvents() {
    const runBtn = document.querySelector("#run");
    if (runBtn) {
      runBtn.addEventListener("click", this._handleRunButtonClick);
    }
  }
  
  /**
   * Handles run button click events
   * @private
   * @param {Event} event - Click event
   */
  static _handleRunButtonClick() {
    // Reset client and peer records
    recordClientHTMLArray.length = 0;
    recordPeerHTMLArray.length = 0;
    try {
      UIManager.toggleButtonLoadingState(this, true);
      const selectedYears = processSelectedYears();
      LocalStorageManager.saveSelectedYears(new Set(selectedYears));

      // Implementation would continue here...
      // This is a placeholder for the original functionality
      
    } catch (err) {
      console.error(err);
    } finally {
      UIManager.toggleButtonLoadingState(this, false);
    }
  }
  
  /**
   * Initializes filter-related events
   * @private
   */
  static _initializeFilterEvents() {
    // Implementation for filter events
  }
}

// Initialize event listeners when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  EventManager.initializeEventListeners();
  DropdownManager.addUniqueRegionsToDropdown(regions_Array);
  DropdownManager.addUniqueTypesToDropdown(types_Array);
});

/**
 * DataProcessor - Handles data processing operations
 */
class DataProcessor {
  /**
   * Processes API calls for all data types
   * @param {Array} selectedYears - Array of selected years
   * @param {Array} recordsPeer - Array of peer records
   * @param {Array} recordsClient - Array of client records
   */
  static processApiCalls(selectedYears, recordsPeer, recordsClient) {
    this.processGeneralData(selectedYears, recordsPeer, recordsClient);
    this.processCashData(selectedYears, recordsPeer, recordsClient);
    this.processAssetData(selectedYears, recordsPeer, recordsClient);
    this.processIncomeData(selectedYears, recordsPeer, recordsClient);
    this.processExpenseData(selectedYears, recordsPeer, recordsClient);
    this.processMiscData(selectedYears, recordsPeer, recordsClient);
  }
  
  /**
   * Processes general data
   * @param {Array} years - Array of years
   * @param {Array} recordsPeer - Array of peer records
   * @param {Array} recordsClient - Array of client records
   */
  static processGeneralData(years, recordsPeer, recordsClient) {
    // Delegate to the existing processGeneralData function
    // This is a placeholder for the original functionality
    processGeneralData(years, recordsPeer, recordsClient);
  }
  
  /**
   * Processes cash data
   * @param {Array} years - Array of years
   * @param {Array} recordsPeer - Array of peer records
   * @param {Array} recordsClient - Array of client records
   */
  static processCashData(years, recordsPeer, recordsClient) {
    // Delegate to the existing processCashData function
    processCashData(years, recordsPeer, recordsClient);
  }
  
  /**
   * Processes asset data
   * @param {Array} years - Array of years
   * @param {Array} recordsPeer - Array of peer records
   * @param {Array} recordsClient - Array of client records
   */
  static processAssetData(years, recordsPeer, recordsClient) {
    // Delegate to the existing processAssetData function
    processAssetData(years, recordsPeer, recordsClient);
  }
  
  /**
   * Processes income data
   * @param {Array} years - Array of years
   * @param {Array} recordsPeer - Array of peer records
   * @param {Array} recordsClient - Array of client records
   */
  static processIncomeData(years, recordsPeer, recordsClient) {
    // Delegate to the existing processIncomeData function
    processIncomeData(years, recordsPeer, recordsClient);
  }
  
  /**
   * Processes expense data
   * @param {Array} years - Array of years
   * @param {Array} recordsPeer - Array of peer records
   * @param {Array} recordsClient - Array of client records
   */
  static processExpenseData(years, recordsPeer, recordsClient) {
    // Delegate to the existing processExpenseData function
    processExpenseData(years, recordsPeer, recordsClient);
  }
  
  /**
   * Processes miscellaneous data
   * @param {Array} years - Array of years
   * @param {Array} recordsPeer - Array of peer records
   * @param {Array} recordsClient - Array of client records
   */
  static processMiscData(years, recordsPeer, recordsClient) {
    // Delegate to the existing processMiscData function
    processMiscData(years, recordsPeer, recordsClient);
  }
  
  /**
   * Inserts data into an object
   * @param {string} type - Data type ('client' or 'peer')
   * @param {string|number} year - Year value
   * @param {Object} object - Target object
   * @param {string} dataKey - Data key
   * @param {Object} record - Record object
   * @param {string} child - Child element identifier
   * @param {string} dynamicValueClientPeer - Dynamic value identifier
   * @param {string} name - Name identifier
   */
  static insertDataIntoObject(type, year, object, dataKey, record, child, dynamicValueClientPeer, name) {
    // Delegate to the existing insertDataIntoObject function
    // This is a placeholder for the original functionality
    insertDataIntoObject(type, year, object, dataKey, record, child, dynamicValueClientPeer, name);
  }
}

/**
 * ComponentManager - Manages component display
 */
class ComponentManager {
  /**
   * Displays all components
   */
  static displayAllComponents() {
    this.displayGeneralComponent();
    this.displayCashComponent();
    this.displayIncomeComponent();
    this.displayExpenseComponent();
    this.displayReportComponent();
  }
  
  /**
   * Displays the general component
   */
  static displayGeneralComponent() {
    // Delegate to the existing displayGeneralComponent function
    displayGeneralComponent();
  }
  
  /**
   * Displays the cash component
   */
  static displayCashComponent() {
    // Delegate to the existing displayCashComponent function
    displayCashComponent();
  }
  
  /**
   * Displays the income component
   */
  static displayIncomeComponent() {
    // Delegate to the existing displayIncomeComponent function
    displayIncomeComponent();
  }
  
  /**
   * Displays the expense component
   */
  static displayExpenseComponent() {
    // Delegate to the existing displayExpenseComponent function
    displayExpenseComponent();
  }
  
  /**
   * Displays the report component
   */
  static displayReportComponent() {
    // Delegate to the existing displayReportComponent function
    displayReportComponent();
  }
}

// Wrapper functions for backward compatibility
const processApiCalls = (...args) => DataProcessor.processApiCalls(...args);
const displayComponents = () => ComponentManager.displayAllComponents();

// Export the classes for potential modular use in the future
// (though currently everything is in the global scope for backward compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ToastManager,
    NumberFormatter,
    StatisticsCalculator,
    ChartDataProcessor,
    LocalStorageManager,
    UIManager,
    RangeSlider,
    BenchmarkManager,
    ChartManager,
    URLManager,
    DropdownManager,
    SetUtils,
    EventManager,
    DataProcessor,
    ComponentManager
  };
}

 variable: "functionalAllocation_chart" },
      "netAssetBreakdown_chart": { variable: "netAssetBreakdown_chart" },
      "changeInNetAssets_chart": { variable: "changeInNetAssets_chart" },
      "totalContributions_chart": { variable: "totalContributions_chart" },
      "contributionsWithoutDR_chart": { variable: "contributionsWithoutDR_chart" }
    };
    
    if (chartMap[chartId]) {
      // Create a new ApexCharts instance
      const chartInstance = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      
      // Store the chart instance in the global variable
      window[chartMap[chartId].variable] = chartInstance;
      
      // Render the chart
      chartInstance.render();
      
      // Add dark mode event listener
      document.addEventListener("dark-mode", function() {
        chartInstance.updateOptions(chartOptions);
      });
    }
  }
  
  /**
   * Updates a modal with chart data
   * @param {string} name - Chart name/identifier
   * @param {Object} peerData - Peer data
   * @param {Object} clientData - Client data
   * @param {Object} parsedData - Full parsed data
   */
  static updateModal(name, peerData, clientData, parsedData) {
    const selectedYears = LocalStorageManager.getSelectedYears();
    if (!selectedYears) return;

    const modal = document.getElementById(`${name}_modal`);
    if (!modal) return;

    const headerRow = modal.querySelector(`#${name}_modal_row`);
    if (!headerRow) return;
    
    const tableHead = headerRow.parentElement;

    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling;
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add header columns
    this._addHeaderColumns(headerRow);

    // Add data rows for each selected year
    selectedYears.forEach(year => {
      const yearRow = document.createElement("tr");
      yearRow.className =
        "bg-white border-b dark:bg-gray-800 dark:border-gray-700
class StatisticsCalculator {
  /**
   * Calculates the average of an array of numbers
   * @param {Array<number|string>} array - Array of numbers or numeric strings
   * @returns {number} - The average
   */
  static calculateAverage(array) {
    const numericArray = this._convertToNumericArray(array);
    if (numericArray.length === 0) return 0;
    
    const sum = numericArray.reduce((acc, val) => acc + val, 0);
    const avg = sum / numericArray.length;
    
    return isNaN(avg) || avg === undefined || avg === null ? 0 : avg;
  }
  
  /**
   * Calculates the median (50th percentile) of an array
   * @param {Array<number|string>} array - Array of numbers or numeric strings
   * @param {string} [name] - Optional name for debugging
   * @returns {number} - The median value
   */
  static calculateMedian(array, name = null) {
    const numericArray = this._convertToNumericArray(array);
    if (numericArray.length === 0) return 0;
    
    const sortedArray = [...numericArray].sort((a, b) => a - b);
    const midpoint = Math.floor(sortedArray.length / 2);
    
    if (sortedArray.length % 2 === 1) {
      return sortedArray[midpoint];
    } else {
      return (sortedArray[midpoint - 1] + sortedArray[midpoint]) / 2;
    }
  }
  
  /**
   * Calculates the 25th percentile of an array
   * @param {Array<number|string>} array - Array of numbers or numeric strings
   * @param {string} [name] - Optional name for debugging
   * @returns {number} - The 25th percentile value
   */
  static calculate25thPercentile(array, name = null) {
    const numericArray = this._convertToNumericArray(array);
    if (numericArray.length <= 2) {
      return this.calculateAverage(numericArray);
    }
    
    const sortedArray = [...numericArray].sort((a, b) => a - b);
    const index = (sortedArray.length + 1) * 0.25;
    
    if (Number.isInteger(index)) {
      return sortedArray[index - 1];
    } else {
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      const lowerValue = sortedArray[lowerIndex - 1];
      const upperValue = sortedArray[upperIndex - 1];
      return (lowerValue + upperValue) / 2;
    }
  }
  
  /**
   * Calculates the 75th percentile of an array
   * @param {Array<number|string>} array - Array of numbers or numeric strings
   * @param {string} [name] - Optional name for debugging
   * @returns {number} - The 75th percentile value
   */
  static calculate75thPercentile(array, name = null) {
    const numericArray = this._convertToNumericArray(array);
    if (numericArray.length <= 2) {
      return this.calculateAverage(numericArray);
    }
    
    const sortedArray = [...numericArray].sort((a, b) => a - b);
    const index = (sortedArray.length + 1) * 0.75;
    
    if (Number.isInteger(index)) {
      return sortedArray[index - 1];
    } else {
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      const lowerValue = sortedArray[lowerIndex - 1];
      const upperValue = sortedArray[upperIndex - 1];
      return (lowerValue + upperValue) / 2;
    }
  }
  
  /**
   * Calculates the maximum value in an array
   * @param {Array<number|string>} array - Array of numbers or numeric strings
   * @param {string} [name] - Optional name for debugging
   * @returns {number} - The maximum value
   */
  static calculateMaximum(array, name = null) {
    const numericArray = this._convertToNumericArray(array);
    const nonZeroArray = numericArray.filter(num => num !== 0);
    
    if (nonZeroArray.length === 0) return 0;
    return Math.max(...nonZeroArray);
  }
  
  /**
   * Calculates the sum of an array
   * @param {Array<number|string>} array - Array of numbers or numeric strings
   * @returns {number} - The sum
   */
  static calculateSum(array) {
    const numericArray = this._convertToNumericArray(array);
    if (numericArray.length === 0) return 0;
    
    return numericArray.reduce((sum, value) => sum + value, 0);
  }
  
  /**
   * Calculates multiple percentile values from an array
   * @param {Array<number|string>} array - Array of numbers or numeric strings
   * @param {string} [type] - Optional type for formatting ('percent' or other)
   * @param {number} [decimals] - Number of decimal places for results
   * @returns {Array<number>} - Array of [25th, 50th, 75th] percentiles
   */
  static calculatePercentiles(array, type, decimals) {
    let numericArray = this._convertToNumericArray(array);
    
    if (type === "percent") {
      numericArray = numericArray.map(value => value * 100);
    }
    
    const sortedArray = [...numericArray].sort((a, b) => a - b);
    
    const getPercentile = (percentile) => {
      const index = (percentile / 100) * (sortedArray.length - 1);
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      
      if (lowerIndex === upperIndex) {
        return decimals !== undefined 
          ? parseFloat(sortedArray[lowerIndex].toFixed(decimals)) 
          : sortedArray[lowerIndex];
      }
      
      const lowerValue = sortedArray[lowerIndex];
      const upperValue = sortedArray[upperIndex];
      const fraction = index - lowerIndex;
      
      const result = lowerValue + fraction * (upperValue - lowerValue);
      return decimals !== undefined ? parseFloat(result.toFixed(decimals)) : result;
    };
    
    return [
      getPercentile(25),
      getPercentile(50),
      getPercentile(75)
    ];
  }
  
  /**
   * Calculates percentage changes between consecutive values in an array
   * @param {Array<number>} numbers - Array of numbers
   * @returns {Array<number>} - Array of percentage changes
   */
  static calculatePercentageChanges(numbers) {
    const changes = [];
    for (let i = 1; i < numbers.length; i++) {
      const change = ((numbers[i] - numbers[i - 1]) / numbers[i - 1]) * 100;
      changes.push(change);
    }
    return changes;
  }
  
  /**
   * Converts an array of mixed values to numeric values
   * @private
   * @param {Array<number|string>} array - Array to convert
   * @returns {Array<number>} - Array of numbers
   */
  static _convertToNumericArray(array) {
    return array.map(val => Number(val));
  }
}

/**
 * ChartDataProcessor - Processes data for charts
 */
class ChartDataProcessor {
  /**
   * Extracts peer and client chart data arrays
   * @param {Array<string|number>} years - Array of years
   * @param {Object} dataPeer - Peer data object
   * @param {Object} dataClient - Client data object
   * @param {number} decimals - Number of decimal places
   * @param {string} name - Name identifier for the dataset
   * @param {string} valueType - Type of values ('percent', 'num', 'dollar')
   * @param {boolean} useWeightedAverage - Whether to use weighted average
   * @returns {Object} - Object containing processed data arrays
   */
  static getChartDataArrays(years, dataPeer, dataClient, decimals, name, valueType, useWeightedAverage) {
    const peerAvg = [];
    const peerMid = [];
    const peer25 = [];
    const peer75 = [];
    const clientArray = [];

    years.forEach(year => {
      if (dataPeer !== undefined && dataClient !== undefined) {
        const dataArray = dataPeer[year];
        const array = dataArray.map(item => Number(item));
        
        let avg = StatisticsCalculator.calculateAverage(array);
        let mid = StatisticsCalculator.calculateMedian(array);
        let lower25 = StatisticsCalculator.calculate25thPercentile(array);
        let higher75 = StatisticsCalculator.calculate75thPercentile(array);
        let clientNum = Number(dataClient[year].value);

        if (valueType === "percent") {
          avg *= 100;
          mid *= 100;
          lower25 *= 100;
          higher75 *= 100;
          clientNum *= 100;
        }

        peerAvg.push(parseFloat(avg.toFixed(decimals)));
        peerMid.push(parseFloat(mid.toFixed(decimals)));
        peer25.push(parseFloat(lower25.toFixed(decimals)));
        peer75.push(parseFloat(higher75.toFixed(decimals)));
        clientArray.push(clientNum);
      } else if (dataPeer === undefined && dataClient) {
        peerAvg.push(0);
        peerMid.push(0);
        peer25.push(0);
        peer75.push(0);

        let clientNum = Number(dataClient[year].value);
        if (valueType === "percent") clientNum *= 100;
        clientArray.push(clientNum);
      } else if (dataClient === undefined || dataPeer === undefined) {
        throw new Error(`No Data for ${name} - object: ${JSON.stringify({ dataPeer, dataClient })}`);
      }
    });

    return { clientArray, peerAvg, peerMid, peer25, peer75 };
  }
}

/**
 * LocalStorageManager - Manages operations for localStorage
 */
class LocalStorageManager {
  /**
   * Retrieves data from localStorage
   * @param {string} key - Key to retrieve
   * @returns {any} - Retrieved data or null
   */
  static getData(key) {
    return localStorage.getItem(key) || null;
  }
  
  /**
   * Parses stored JSON data
   * @param {string} data - JSON string
   * @returns {Object|null} - Parsed object or null
   */
  static parseData(data) {
    return data ? JSON.parse(data) : null;
  }
  
  /**
   * Saves selected years to localStorage
   * @param {Set} yearsSet - Set of selected years
   */
  static saveSelectedYears(yearsSet) {
    const yearsArray = Array.from(yearsSet).sort((a, b) => a - b);
    localStorage.setItem("selectedYears", JSON.stringify(yearsArray));
  }
  
  /**
   * Gets selected years from localStorage
   * @returns {Array} - Array of selected years
   */
  static getSelectedYears() {
    return JSON.parse(localStorage.getItem("selectedYears"));
  }
  
  /**
   * Resets selected years in localStorage
   */
  static resetSelectedYears() {
    localStorage.setItem("selectedYears", JSON.stringify([]));
  }
}

/**
 * UIManager - Manages UI operations and DOM manipulations
 */
class UIManager {
  /**
   * Adds unique years to the options dropdown
   * @param {Array} yearsArray - Array of years
   */
  static addYearsToDropdown(yearsArray) {
    // Initialize selectedYears_Set from local storage if data exists
    const storedYears = LocalStorageManager.getSelectedYears();
    
    if (Array.isArray(storedYears)) {
      selectedYears_Set = new Set(storedYears);
    }
    
    const optionsListElement = document.getElementById('options-list');
    if (!optionsListElement) return;
    
    optionsListElement.innerHTML = "";
    
    // Sort years in descending order (newest first)
    yearsArray.sort((a, b) => b - a);
    
    yearsArray.forEach(year => {
      const newLabel = document.createElement("label");
      newLabel.setAttribute("for", `option-${year}`);
      newLabel.setAttribute(
        "class",
        "flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      );
      
      const newInput = document.createElement("input");
      newInput.setAttribute("type", "checkbox");
      newInput.setAttribute("id", `option-${year}`);
      newInput.setAttribute(
        "class",
        `form-checkbox h-4 w-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-300 dark:border-gray-500 mr-2 cursor-pointer`
      );
      newInput.setAttribute("value", year);
      newInput.checked = selectedYears_Set.has(year);
      
      newInput.addEventListener("change", e => 
        this._handleYearSelectionChange(e.target, year)
      );
      
      const newSpan = document.createElement("span");
      newSpan.innerText = year;
      
      newLabel.appendChild(newInput);
      newLabel.appendChild(newSpan);
      
      optionsListElement.appendChild(newLabel);
    });
  }
  
  /**
   * Handles year selection changes
   * @private
   * @param {HTMLElement} input - Input element
   * @param {string|number} year - Selected year
   */
  static _handleYearSelectionChange(input, year) {
    if (input.checked) {
      selectedYears_Set.add(year);
    } else {
      selectedYears_Set.delete(year);
    }
    
    LocalStorageManager.saveSelectedYears(selectedYears_Set);
  }
  
  /**
   * Adjusts the height of the options list div
   */
  static adjustOptionsListHeight() {
    const optionsList = document.getElementById("options-list");
    if (!optionsList) return;
    
    if (optionsList.scrollHeight <= 20 * 16) { // 20rem in pixels
      optionsList.classList.remove("h-80");
      optionsList.classList.add("h-fit");
      optionsList.classList.add("py-4");
    } else {
      optionsList.classList.remove("h-fit");
      optionsList.classList.remove("py-4");
      optionsList.classList.add("h-80");
    }
  }
  
  /**
   * Toggles the loading state of a button
   * @param {HTMLElement} button - Button element
   * @param {boolean} isLoading - Whether button should show loading state
   */
  static toggleButtonLoadingState(button, isLoading) {
    if (isLoading) {
      button.innerHTML = `
        <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        Loading...`;
      button.disabled = true;
    } else {
      button.innerHTML = `
        <span class='text-xl mr-2'>Run</span>
        <svg class="w-8 h-8 text-2xl text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
        </svg>`;
      button.disabled = false;
    }
  }
  
  /**
   * Closes the sidebar after selecting an option
   * @param {string} component - Component identifier
   */
  static closeSidebarAfterSelection(component) {
    document.querySelector("#sidebar").classList.add("hidden");
    document.querySelector("#sidebarBackdrop").classList.add("hidden");
    document
      .querySelector("#toggleSidebarMobileHamburger")
      .classList.remove("hidden");
    document.querySelector("#toggleSidebarMobileClose").classList.add("hidden");

    localStorage.setItem("lastRenderedComponent", component);
  }
  
  /**
   * Changes the width of a table header
   * @param {string} elementId - Element ID
   */
  static changeThWidth(elementId) {
    const trElement = document.getElementById(elementId);
    if (!trElement) {
      console.error(`Element with ID ${elementId} not found.`);
      return;
    }
    
    const thElement = trElement.querySelector("th");
    if (!thElement) {
      console.error("No <th> element found inside the specified <tr>.");
      return;
    }
    
    thElement.style.width = "50rem";
  }
  
  /**
   * Updates county data in the UI
   * @param {string} trId - Table row ID
   * @param {string} countyName - County name
   * @param {number} percentage - Percentage value
   * @param {number} income - Income value
   * @param {string|number} year - Year value
   */
  static updateCountyData(trId, countyName, percentage, income, year) {
    // Create the <tr> element if it doesn't exist
    let trElement = document.getElementById(`row_${trId}`);
    if (!trElement) return;

    // Create the second <th> element and its children
    const secondThElement = document.createElement("th");
    secondThElement.scope = "row";
    secondThElement.className =
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";

    // Create the span element inside the second <th>
    const spanElementSecond = document.createElement("span");
    spanElementSecond.textContent = "---";
    secondThElement.appendChild(spanElementSecond);

    // Create the <p> elements inside the second <th>
    const percentagePElement = document.createElement("p");
    percentagePElement.id = `percentage_${trId}_${year}`;
    percentagePElement.className = "mb-2";
    percentagePElement.textContent = "adfas";
    secondThElement.appendChild(percentagePElement);

    const incomePElement = document.createElement("p");
    incomePElement.id = `income_${trId}_${year}`;
    incomePElement.textContent = "fadf";
    secondThElement.appendChild(incomePElement);

    trElement.appendChild(secondThElement);

    // Format values
    const formattedIncome = new Intl.NumberFormat().format(income);
    const formattedPercentage = Math.round(percentage);

    // Update the content of the selected elements
    document.getElementById(
      `percentage_${trId}_${year}`
    ).textContent = `${formattedPercentage}%`;
    document.getElementById(
      `income_${trId}_${year}`
    ).textContent = `${formattedIncome}`;
  }
}
    }