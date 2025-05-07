// ChartSystem.js
// Core class for chart management

class ChartSystem {
  constructor() {
    this.chartInstances = {};
    this.chartConfigs = {};
    this.registerThemeListener();
  }

  // Register event listeners for theme changes
  registerThemeListener() {
    document.addEventListener("dark-mode", () => {
      // Update all chart options when theme changes
      Object.keys(this.chartInstances).forEach((chartId) => {
        if (this.chartInstances[chartId] && this.chartConfigs[chartId]) {
          this.chartInstances[chartId].updateOptions(
            this.chartConfigs[chartId]
          );
        }
      });
    });
  }

  // Create and render a new chart
  createChart(chartId, config) {
    // Store the configuration for later updates
    this.chartConfigs[chartId] = config;

    // Clear existing chart if any
    const chartElement = document.getElementById(chartId);
    if (!chartElement) {
      console.error(`Element with ID "${chartId}" not found`);
      return;
    }
    chartElement.innerHTML = "";

    // Create and render the new chart
    this.chartInstances[chartId] = new ApexCharts(chartElement, config);
    this.chartInstances[chartId].render();

    return this.chartInstances[chartId];
  }

  // Update an existing chart
  updateChart(chartId, newConfig) {
    if (!this.chartInstances[chartId]) {
      console.error(`Chart with ID "${chartId}" not found`);
      return;
    }

    this.chartConfigs[chartId] = newConfig;
    this.chartInstances[chartId].updateOptions(newConfig);
  }

  // Get a chart instance
  getChart(chartId) {
    return this.chartInstances[chartId];
  }
a
  // Create or update modal for a chart
  updateModal(mainName, peerData, clientData, parsedData) {
    console.log(`Updating modal for ${mainName}`);
  
    // Get the selected years from local storage
    const selectedYears = getSelectedYearsFromLocalStorage();
    if (!selectedYears || !selectedYears.length) {
      console.warn(`No selected years found for modal ${mainName}`);
      return;
    }
  
    // Find the modal element
    const modal = document.getElementById(`${mainName}_modal`);
    if (!modal) {
      console.warn(`Modal element with ID "${mainName}_modal" not found`);
      return;
    }

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

    // Add standard columns
    this._addModalColumns(headerRow);

    // Add a row for each selected year
    selectedYears.forEach((year) => {
      const yearRow = this._createYearRow(mainName, year);
      tableHead.appendChild(yearRow);
    });
  }

  // Helper to add standard modal columns
  _addModalColumns(headerRow) {
    // Year column
    const yearColumn = document.createElement("th");
    yearColumn.className = "px-6 py-3";
    yearColumn.textContent = "year";
    headerRow.appendChild(yearColumn);

    // Client column
    const clientColumn = document.createElement("th");
    clientColumn.className = "px-6 py-3";
    clientColumn.textContent = "client";
    headerRow.appendChild(clientColumn);

    // Avg column
    const avgColumn = document.createElement("th");
    avgColumn.className = "px-6 py-3";
    avgColumn.textContent = "Avg";
    headerRow.appendChild(avgColumn);

    // Percentile columns
    const columns = ["25%", "50%", "75%"];
    columns.forEach((column) => {
      const col = document.createElement("th");
      col.className = "px-6 py-3";
      col.textContent = column;
      headerRow.appendChild(col);
    });
  }

  // Create a year row for standard modals
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

}

// Export a singleton instance for use throughout the application
const chartSystem = new ChartSystem();
