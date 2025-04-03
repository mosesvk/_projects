/**
 * Simplified Report Component
 * Handles displaying report data in tables
 */
class ReportComponent {
  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Report link handling
    const reportLink = document.getElementById("reportLink");
    if (reportLink) {
      reportLink.addEventListener(
        "click",
        this.handleReportLinkClick.bind(this)
      );
    }

    // Generate reports button
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      generateReportsBtn.addEventListener(
        "click",
        this.handleGenerateReportClick.bind(this)
      );
    }

    // Listen for data processing complete
    document.addEventListener(
      "dataProcessingComplete",
      this.onDataProcessingComplete.bind(this)
    );
  }

  /**
   * Handle report link click
   */
  handleReportLinkClick(event) {
    // Show the report tab
    this.showReportsTab();

    // Only generate report if data is available
    if (localStorage.getItem("generalData")) {
      this.displayReportComponent();
    } else {
      if (typeof createToastWarning === "function") {
        createToastWarning("Please select years and run the report first.");
      }
    }
  }

  /**
   * Handle generate report button click
   */
  handleGenerateReportClick() {
    if (typeof window.createPrintExcel === "function") {
      window.createPrintExcel();
    } else {
      console.error("Excel report generator not available");
    }
  }

  /**
   * Show reports tab
   */
  showReportsTab() {
    // Hide all content tabs
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.add("hidden");
    });

    // Show reports tab
    const reportsTab = document.getElementById("reportsContent");
    if (reportsTab) {
      reportsTab.classList.remove("hidden");
    }

    // Update active state on sidebar links
    document.querySelectorAll("#sidebar button").forEach((button) => {
      button.classList.remove("active", "bg-gray-300", "dark:bg-gray-700");
    });

    // Set reports link as active
    const reportsLink = document.getElementById("reportLink");
    if (reportsLink) {
      reportsLink.classList.add("active", "bg-gray-300", "dark:bg-gray-700");
    }
  }

  /**
   * Display report component with data
   */
  displayReportComponent() {
    console.log("Displaying report component");

    try {
      // Get selected years
      const selectedYears = getSelectedYearsFromLocalStorage();
      if (!selectedYears || selectedYears.length === 0) {
        console.error("No selected years found, cannot display report");
        if (typeof createToastWarning === "function") {
          createToastWarning("Please select years to display the report");
        }
        return;
      }

      // Prepare report structure
      this.validateReportStructure();

      // Clear tables to start fresh
      this.clearReportTables();

      // Add year columns to all tables
      this.addYearColumnsToAllReportTables(selectedYears);

      // Insert data for each category
      const generalData = JSON.parse(
        localStorage.getItem("generalData") || "{}"
      );
      const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
      const assetData = JSON.parse(localStorage.getItem("assetData") || "{}");
      const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
      const expenseData = JSON.parse(
        localStorage.getItem("expenseData") || "{}"
      );
      const miscData = JSON.parse(localStorage.getItem("miscData") || "{}");

      // Insert data for each category
      this.insertDataToReport(generalData, selectedYears, [
        ["givingUnits", "num", 0],
        ["missionaryUnit", "num", 0],
        ["numberOfEmployeesFTE", "num", 0],
        ["itExpenses", "dollar", 0],
      ]);

      this.insertDataToReport(cashData, selectedYears, [
        ["daysCashOnHand", "num", 0, "wa"],
        ["daysExpensesInUnrestrictedNA", "num", 0, "wa"],
        ["daysExpensesInUnrestrictedNA_excludingPPE", "num", 0, "wa"],
        ["daysExpensesInNAwithDR", "num", 0, "wa"],
        ["daysExpensesInNAwithDR_excludingPPE", "num", 0, "wa"],
        ["liquidityAssetsAvailableCover", "num", 2, "wa"],
        ["liquidityFundsAvailable", "num", 1, "wa"],
        ["financialAssetsAvailableFY", "dollar", 2, "wa"],
        ["daysFinancialAssetsOnHand", "num", 0, "wa"],
        ["currentRatio", "num", 1, "wa"],
        ["totalCoverageRatio", "num", 1, "wa"],
        ["assetsWithoutPpeToLiabilitiesWithoutDebt", "num", 2, "wa"],
        ["cashFlowsTrendFinancing", "dollar", 0],
        ["cashFlowsTrendInvesting", "dollar", 0],
        ["cashFlowsTrendOperating", "dollar", 0],
      ]);

      this.insertDataToReport(assetData, selectedYears, [
        ["percentWithDR", "percent", 0, "wa"],
        ["percentWithoutDR_excludingPPE", "percent", 0, "wa"],
        ["percentWithoutDR", "percent", 0, "wa"],
      ]);

      this.insertDataToReport(incomeData, selectedYears, [
        ["netIncomeRatio", "num", 2, "wa"],
        ["contributionsTrend_basedOnNumberOfDonors", "percent", 0, "wa"],
        ["contributionsTrend", "percent", 0],
        ["contributionsPercentWithoutDR", "percent", 0, "wa"],
        ["contributionsPercentWithDR", "percent", 0, "wa"],
        ["contributionsPerGivingUnit", "dollar", 0, "wa"],
        ["contributionsPerMissionaryUnit", "dollar", 0, "wa"],
        ["contributionsPerFullTimeEquivalent", "dollar", 0, "wa"],
        ["fundraisingAsPercentOfContributions", "percent", 1, "wa"],
        ["annualizedInvestmentReturn", "percent", 0],
      ]);

      this.insertDataToReport(expenseData, selectedYears, [
        ["functionalExpensePercent_program", "percent", 0, "wa"],
        ["functionalExpensePercent_administrative", "percent", 0, "wa"],
        ["functionalExpensePercent_fundraising", "percent", 0, "wa"],
        ["costOfContributions", "dollar", 2, "wa"],
        ["expensesPerGivingUnit", "dollar", 0, "wa"],
        ["expensesPerMissionaryUnit", "dollar", 0, "wa"],
        ["expensesPerFullTimeEquivalent", "dollar", 0, "wa"],
        ["salariesAndBenefitsAsPercentOfTotalExpenses", "percent", 0, "wa"],
        ["salariesAndBenefitsPerFTE", "dollar", 0, "wa"],
      ]);

      this.insertDataToReport(miscData, selectedYears, [
        ["percentageAssessmentOnRestrictedGifts", "percent", 0, "wa", true],
      ]);

      // Format the table cells
      this.processTHElements();

      // Show Generate Reports button
      const generateReportsBtn = document.getElementById("generateReports");
      if (generateReportsBtn) {
        generateReportsBtn.classList.remove("hidden");
      }

      console.log("Report generated successfully");
    } catch (error) {
      console.error("Error displaying report component:", error);
      if (typeof createToastWarning === "function") {
        createToastWarning("Error displaying report: " + error.message);
      }
    }
  }

  /**
   * Event handler for when data processing is complete
   */
  onDataProcessingComplete() {
    // console.log("Data processing complete event received");

    // Enable the report link
    const reportLink = document.getElementById("reportLink");
    if (reportLink) {
      reportLink.classList.remove("disabled");
    }
  }

  /**
   * Insert data to the report for a specific category
   */
  insertDataToReport(data, selectedYears, metricsConfig) {
    if (!data || !selectedYears || !metricsConfig) {
      return;
    }

    // Process each metric in the array
    for (const metricConfig of metricsConfig) {
      const metricName = metricConfig[0];
      const dataType = metricConfig[1]; // 'num', 'percent', 'dollar'
      const fixedDecimals = metricConfig[2]; // number of decimal places
      const weightedAvg = metricConfig[3]; // 'wa' if weighted average
      const endXml = metricConfig[4] ? true : false;

      // Find the row element for this metric
      const rowId = `row_${metricName}`;
      const row = document.getElementById(rowId);

      if (!row) {
        console.warn(`Row not found for metric: ${metricName} (ID: ${rowId})`);
        continue;
      }

      // Add client data for each year
      const clientData = data[`${metricName}_Client`];

      // Add client data cells
      if (clientData) {
        selectedYears.forEach((year) => {
          const value = clientData[year]?.value;

          // Create a data cell
          const cell = document.createElement("th");
          cell.scope = "row";
          cell.className =
            "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";

          if (value !== undefined && Number(value) !== 0) {
            // Format the value
            const formattedValue = this.styleNumber(
              value,
              dataType,
              fixedDecimals,
              metricName
            );

            // Create a wrapper div
            const wrapper = document.createElement("div");
            wrapper.className = "flex justify-between";

            // Create value span
            const valueSpan = document.createElement("span");
            valueSpan.className = "mr-2";
            valueSpan.textContent = formattedValue;

            // Add value span to wrapper
            wrapper.appendChild(valueSpan);

            // Add wrapper to cell
            cell.appendChild(wrapper);
          } else {
            cell.textContent = "-";
          }

          // Add cell to row
          row.appendChild(cell);
        });
      } else {
        // Add empty cells if no client data
        selectedYears.forEach(() => {
          const emptyCell = document.createElement("th");
          emptyCell.scope = "row";
          emptyCell.className =
            "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
          emptyCell.textContent = "-";
          row.appendChild(emptyCell);
        });
      }

      // Add peer data cells (average, percentiles)
      const peerData = data[`${metricName}_Peer`];

      if (peerData) {
        // Calculate statistics
        let avg = 0;
        let q1 = 0,
          median = 0,
          q3 = 0;

        // Use weighted average if requested and function is available
        if (
          weightedAvg === "wa" &&
          typeof getWeightedAverageOfArray === "function"
        ) {
          try {
            // For report, use weighted average across all years (pass null for year parameter)
            avg = getWeightedAverageOfArray(data, metricName, null);
          } catch (error) {
            console.error(
              `Error calculating weighted average for ${metricName}:`,
              error
            );
            // Fall back to regular average
            if (peerData["total"] && Array.isArray(peerData["total"])) {
              avg = this.getAverageOfArray(peerData["total"]) || 0;
            }
          }
        } else if (peerData["total"] && Array.isArray(peerData["total"])) {
          // Use regular average if not using weighted average
          avg = this.getAverageOfArray(peerData["total"]) || 0;
        }

        // Calculate percentiles
        if (peerData["total"] && Array.isArray(peerData["total"])) {
          if (typeof calculatePercentiles === "function") {
            try {
              [q1, median, q3] = calculatePercentiles(
                peerData["total"],
                dataType,
                fixedDecimals
              );
            } catch (error) {
              console.warn(
                `Error calculating percentiles for ${metricName}:`,
                error
              );
              // Fallback calculation
              q1 = this.getPercentileOfArray(peerData["total"], 25) || 0;
              median = this.getPercentileOfArray(peerData["total"], 50) || 0;
              q3 = this.getPercentileOfArray(peerData["total"], 75) || 0;
            }
          } else {
            // Fallback without calculatePercentiles function
            q1 = this.getPercentileOfArray(peerData["total"], 25) || 0;
            median = this.getPercentileOfArray(peerData["total"], 50) || 0;
            q3 = this.getPercentileOfArray(peerData["total"], 75) || 0;
          }
        }

        // Format values
        const textAvg = this.styleNumber(
          avg,
          dataType,
          fixedDecimals,
          metricName
        );
        const textQ1 = this.styleNumber(
          q1,
          dataType,
          fixedDecimals,
          metricName
        );
        const textMedian = this.styleNumber(
          median,
          dataType,
          fixedDecimals,
          metricName
        );
        const textQ3 = this.styleNumber(
          q3,
          dataType,
          fixedDecimals,
          metricName
        );

        // Add formatted cells
        const cells = [
          {
            value: textAvg,
            class:
              "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600",
          },
          {
            value: textQ1,
            class:
              "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600",
          },
          {
            value: textMedian,
            class:
              "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600",
          },
          {
            value: textQ3,
            class:
              "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600",
          },
        ];

        cells.forEach((cellConfig) => {
          const cell = document.createElement("th");
          cell.scope = "row";
          cell.className = cellConfig.class;
          cell.textContent = cellConfig.value;
          row.appendChild(cell);
        });
      } else {
        // Add empty cells if no peer data
        for (let i = 0; i < 4; i++) {
          const emptyCell = document.createElement("th");
          emptyCell.scope = "row";
          emptyCell.className =
            "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
          emptyCell.textContent = "-";
          row.appendChild(emptyCell);
        }
      }
    }
  }

  /**
   * Format number based on data type
   */
  styleNumber(value, type, decimals, metricName) {
    if (value === undefined || value === null) return "-";

    // Convert to number
    let num = parseFloat(value);
    if (isNaN(num)) return "-";

    let prefix = "";
    let suffix = "";
    let result = "";

    switch (type) {
      case "percent":
        num = num * 100;
        suffix = "%";
        result = num.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: false // Disable thousand separators for percentage values
        });
        console.log(value, decimals, result);
        break;

      case "dollar":
        prefix = "$";
        // Format as currency with commas
        result = num.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        break;

      case "num":
      default:
        // Format number with commas
        result = num.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        break;
    }

    return `${prefix}${result}${suffix}`;
  }

  /**
   * Calculate average of array
   */
  getAverageOfArray(array) {
    if (!array || array.length === 0) return 0;

    const validValues = array.filter((val) => !isNaN(parseFloat(val)));
    if (validValues.length === 0) return 0;

    const sum = validValues.reduce((sum, val) => sum + parseFloat(val), 0);
    return sum / validValues.length;
  }

  /**
   * Calculate percentile of array
   */
  getPercentileOfArray(array, percentile) {
    if (!array || array.length === 0) return 0;

    const validValues = array
      .filter((val) => !isNaN(parseFloat(val)))
      .map((val) => parseFloat(val))
      .sort((a, b) => a - b);

    if (validValues.length === 0) return 0;

    const index = Math.floor(validValues.length * (percentile / 100));
    return validValues[index];
  }

  /**
   * Ensure all report structures exist by creating missing rows
   */
  validateReportStructure() {
    // Define the expected tables and their rows
    const reportStructure = {
      generalDataTable: [
        "givingUnits",
        "missionaryUnit",
        "numberOfEmployeesFTE",
        "itExpenses",
      ],
      cashDataTable: [
        "daysCashOnHand",
        "daysExpensesInUnrestrictedNA",
        "daysExpensesInUnrestrictedNA_excludingPPE",
        "daysExpensesInNAwithDR",
        "daysExpensesInNAwithDR_excludingPPE",
        "liquidityAssetsAvailableCover",
        "liquidityFundsAvailable",
        "financialAssetsAvailableFY",
        "daysFinancialAssetsOnHand",
        "currentRatio",
        "totalCoverageRatio",
        "assetsWithoutPpeToLiabilitiesWithoutDebt",
        "cashFlowsTrendFinancing",
        "cashFlowsTrendInvesting",
        "cashFlowsTrendOperating",
      ],
      assetDataTable: [
        "percentWithDR",
        "percentWithoutDR_excludingPPE",
        "percentWithoutDR",
      ],
      incomeDataTable: [
        "netIncomeRatio",
        "contributionsTrend_basedOnNumberOfDonors",
        "contributionsTrend",
        "contributionsPercentWithoutDR",
        "contributionsPercentWithDR",
        "contributionsPerGivingUnit",
        "contributionsPerMissionaryUnit",
        "contributionsPerFullTimeEquivalent",
        "fundraisingAsPercentOfContributions",
        "annualizedInvestmentReturn",
      ],
      expenseDataTable: [
        "functionalExpensePercent_program",
        "functionalExpensePercent_administrative",
        "functionalExpensePercent_fundraising",
        "costOfContributions",
        "expensesPerGivingUnit",
        "expensesPerMissionaryUnit",
        "expensesPerFullTimeEquivalent",
        "salariesAndBenefitsAsPercentOfTotalExpenses",
        "salariesAndBenefitsPerFTE",
      ],
      miscDataTable: ["percentageAssessmentOnRestrictedGifts"],
    };

    // Check each table and create any missing rows
    Object.entries(reportStructure).forEach(([tableId, rowNames]) => {
      const table = document.getElementById(tableId);
      if (!table) {
        // console.warn(`Table ${tableId} not found in DOM`);
        return;
      }

      const tbody = table.querySelector("tbody");
      if (!tbody) {
        console.error(`Table ${tableId} does not have a tbody element`);
        return;
      }

      // Check each expected row
      rowNames.forEach((rowName) => {
        // Convert rowName to display name for cell text
        const displayName = rowName
          .replace(/([A-Z])/g, " $1") // Add space before capital letters
          .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
          .replace(/_/g, " "); // Replace underscores with spaces

        // First check if row exists
        const rowId = `row_${rowName}`;
        let row = document.getElementById(rowId);

        if (!row) {
          // Create row
          row = document.createElement("tr");
          row.id = rowId;
          row.className =
            "bg-white border-b dark:bg-gray-800 dark:border-gray-700";

          // Create name cell
          const nameCell = document.createElement("th");
          nameCell.scope = "row";
          nameCell.className =
            "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white";
          nameCell.textContent = displayName;

          // Add cell to row
          row.appendChild(nameCell);

          // Add row to table
          tbody.appendChild(row);
        } else {
          // If row exists but first cell is empty, fill it
          const firstCell = row.querySelector("th");
          if (firstCell && !firstCell.textContent.trim()) {
            firstCell.textContent = displayName;
          }
        }
      });
    });
  }

  /**
   * Clear all tables in the report section
   */
  clearReportTables() {
    // Get all report table headers
    const tableHeaders = document.querySelectorAll('[id$="_tableHeader"]');

    tableHeaders.forEach((header) => {
      // Clear all header cells except the first one (which contains the category name)
      while (header.children.length > 1) {
        header.removeChild(header.children[1]);
      }

      // Get all rows in the same table as this header
      const tableBody = header.closest("table")?.querySelector("tbody");
      if (tableBody) {
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach((row) => {
          // Clear all cells in the row except the first one (which contains the metric name)
          while (row.children.length > 1) {
            row.removeChild(row.children[1]);
          }
        });
      }
    });
  }

  /**
   * Add year columns to all report tables
   */
  addYearColumnsToAllReportTables(years) {
    const tables = document.querySelectorAll("table");

    tables.forEach((table) => {
      const headerRows = table.querySelectorAll('tr[id$="_tableHeader"]');

      headerRows.forEach((headerRow) => {
        // Add columns for each selected year plus the peer data columns
        this.addColumnsToTableHeader(headerRow, years);
      });
    });
  }

  /**
   * Add columns to a specific table header
   */
  addColumnsToTableHeader(headerRow, years) {
    // Ensure the header row has the first column (metric name)
    if (headerRow.children.length === 0) {
      const categoryColumn = document.createElement("th");
      categoryColumn.scope = "col";
      categoryColumn.className = "px-6 py-3 text-lg tracking-wide";
      categoryColumn.textContent = "Metrics"; // Generic text, should be overridden by existing content
      headerRow.appendChild(categoryColumn);
    }

    // Add columns for each year
    years.forEach((year) => {
      const yearColumn = document.createElement("th");
      yearColumn.scope = "col";
      yearColumn.className = "px-6 py-3 text-xl";
      yearColumn.textContent = year;
      headerRow.appendChild(yearColumn);
    });

    // Add peer data columns
    const peerColumns = [
      { text: "Avg", class: "px-6 py-3" },
      { text: "25%", class: "px-6 py-3" },
      { text: "50%", class: "px-6 py-3" },
      { text: "75%", class: "px-6 py-3" },
    ];

    peerColumns.forEach((column) => {
      const thElement = document.createElement("th");
      thElement.scope = "col";
      thElement.className = column.class;
      thElement.textContent = column.text;
      headerRow.appendChild(thElement);
    });
  }

  /**
   * Process all TH elements to format negative values
   */
  processTHElements() {
    // Select all TR elements with an ID
    const rows = document.querySelectorAll("tr[id]");

    rows.forEach((row) => {
      // Select all TH elements inside the current TR
      const thElements = row.querySelectorAll("th");

      thElements.forEach((th) => {
        // Check if the TH has a DIV child
        const divChild = th.querySelector("div");
        if (divChild) {
          // If TH has a DIV child, find the SPAN inside it
          const spanChild = divChild.querySelector("span");
          if (spanChild) {
            // Process the text content of SPAN child
            let textContent = spanChild.textContent.trim();
            // Check if the text content contains numbers and is negative
            if (/\d/.test(textContent) && textContent.includes("-")) {
              // Remove "-" and apply classes
              textContent = `(${textContent.replace("-", "")})`;
              spanChild.textContent = textContent;
              th.classList.remove("text-gray-900", "dark:text-white");
              th.classList.add("text-red-500", "dark:text-red-400");
            }
          }
        } else {
          // Process the text content of TH directly
          let textContent = th.textContent.trim();
          // Check if the text content contains numbers and is negative
          if (/\d/.test(textContent) && textContent.includes("-")) {
            // Remove "-" and apply classes
            textContent = `(${textContent.replace("-", "")})`;
            th.textContent = textContent;
            th.classList.remove("text-gray-900", "dark:text-white");
            th.classList.add("text-red-500", "dark:text-red-400");
          }
        }
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Create report component
  const reportComponent = new ReportComponent();

  // Expose functions globally for backward compatibility
  window.reportComponent = reportComponent;
  window.displayReportComponent =
    reportComponent.displayReportComponent.bind(reportComponent);
});
