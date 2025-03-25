const displayReportComponent = () => {
  // console.log("Starting report component display");

  // Add debug logging to see what's happening
  // console.log("Report tab display requested");

  // First make sure the report tab is visible
  showReportsTab();

  // Retrieve all data from localStorage
  const generalData = JSON.parse(localStorage.getItem("generalData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  const assetData = JSON.parse(localStorage.getItem("assetData"));
  const incomeData = JSON.parse(localStorage.getItem("incomeData"));
  const expenseData = JSON.parse(localStorage.getItem("expenseData"));
  const miscData = JSON.parse(localStorage.getItem("miscData"));

  // console.log("Data loaded from localStorage:", {
  //   generalData: generalData
  //     ? Object.keys(generalData).length + " keys"
  //     : "Not found",
  //   cashData: cashData ? Object.keys(cashData).length + " keys" : "Not found",
  //   assetData: assetData
  //     ? Object.keys(assetData).length + " keys"
  //     : "Not found",
  //   incomeData: incomeData
  //     ? Object.keys(incomeData).length + " keys"
  //     : "Not found",
  //   expenseData: expenseData
  //     ? Object.keys(expenseData).length + " keys"
  //     : "Not found",
  //   miscData: miscData ? Object.keys(miscData).length + " keys" : "Not found",
  // });

  // Get the selected years from localStorage
  const selectedYears = getSelectedYearsFromLocalStorage();
  if (!selectedYears || selectedYears.length === 0) {
    console.error("No selected years found, cannot display report");
    createToastWarning("Please select years to display the report");
    return;
  }
  // console.log("Selected years for report:", selectedYears);

  try {
    // First check if all report tables exist and log their status
    const reportTables = {
      generalTable: document.getElementById("generalDataTable"),
      cashTable: document.getElementById("cashDataTable"),
      assetTable: document.getElementById("assetDataTable"),
      incomeTable: document.getElementById("incomeDataTable"),
      expenseTable: document.getElementById("expenseDataTable"),
      miscTable: document.getElementById("miscDataTable"),
    };

    // console.log(
    //   "Report tables found:",
    //   Object.entries(reportTables)
    //     .map(([name, el]) => `${name}: ${el ? "Found" : "Missing"}`)
    //     .join(", ")
    // );

    // Ensure report structure exists (create missing rows)
    validateReportStructure();

    // Clear existing report content
    clearReportTables();

    // Add year columns to all report tables
    addYearColumnsToAllReportTables(selectedYears);

    // Insert data for each category
    if (generalData) {
      insertDataToReport(generalData, selectedYears, [
        ["givingUnits", "num", 0],
        ["missionaryUnit", "num", 0],
        ["numberOfEmployeesFTE", "num", 0],
        [
          "itExpenses",
          "dollar",
          0,
          null,
          null,
          [6, 44, 82, 120],
          "begin",
          null,
        ],
      ]);
    }

    if (cashData) {
      insertDataToReport(cashData, selectedYears, [
        ["daysCashOnHand", "num", 0, "wa", null, [7, 45, 83, 121], null, null],
        [
          "daysExpensesInUnrestrictedNA",
          "num",
          0,
          "wa",
          null,
          [8, 46, 84, 122],
          null,
          null,
        ],
        [
          "daysExpensesInUnrestrictedNA_excludingPPE",
          "num",
          0,
          "wa",
          null,
          [9, 47, 85, 123],
          null,
          null,
        ],
        [
          "daysExpensesInNAwithDR",
          "num",
          0,
          "wa",
          null,
          [10, 48, 86, 124],
          null,
          null,
        ],
        [
          "daysExpensesInNAwithDR_excludingPPE",
          "num",
          0,
          "wa",
          null,
          [11, 49, 87, 125],
          null,
          null,
        ],
        [
          "liquidityAssetsAvailableCover",
          "num",
          2,
          "wa",
          null,
          null,
          null,
          null,
        ],
        [
          "liquidityFundsAvailable",
          "num",
          1,
          "wa",
          null,
          [12, 50, 88, 126],
          null,
          null,
        ],
        [
          "financialAssetsAvailableFY",
          "dollar",
          2,
          "wa",
          null,
          [13, 51, 89, 127],
          null,
          null,
        ],
        [
          "daysFinancialAssetsOnHand",
          "num",
          0,
          "wa",
          null,
          [14, 52, 90, 128],
          null,
          null,
        ],
        ["currentRatio", "num", 1, "wa", null, [15, 53, 91, 129], null, null],
        [
          "totalCoverageRatio",
          "num",
          1,
          "wa",
          null,
          [16, 54, 92, 130],
          null,
          null,
        ],
        [
          "assetsWithoutPpeToLiabilitiesWithoutDebt",
          "num",
          2,
          "wa",
          null,
          null,
          null,
          null,
        ],
        [
          "cashFlowsTrendFinancing",
          "dollar",
          0,
          null,
          null,
          [17, 55, 93, 131],
          null,
          null,
        ],
        [
          "cashFlowsTrendInvesting",
          "dollar",
          0,
          null,
          null,
          [18, 56, 94, 132],
          null,
          null,
        ],
        [
          "cashFlowsTrendOperating",
          "dollar",
          0,
          null,
          null,
          [19, 57, 95, 133],
          null,
          null,
        ],
      ]);
    }

    if (assetData) {
      insertDataToReport(assetData, selectedYears, [
        [
          "percentWithDR",
          "percent",
          0,
          "wa",
          null,
          [20, 58, 96, 134],
          null,
          null,
        ],
        [
          "percentWithoutDR_excludingPPE",
          "percent",
          0,
          "wa",
          null,
          [21, 59, 97, 135],
          null,
          null,
        ],
        [
          "percentWithoutDR",
          "percent",
          0,
          "wa",
          null,
          [22, 60, 98, 136],
          null,
          null,
        ],
      ]);
    }

    if (incomeData) {
      insertDataToReport(incomeData, selectedYears, [
        ["netIncomeRatio", "num", 2, "wa", null, [23, 61, 99, 137], null, null],
        [
          "contributionsTrend_basedOnNumberOfDonors",
          "percent",
          0,
          "wa",
          null,
          [24, 62, 100, 138],
          null,
          null,
        ],
        [
          "contributionsTrend",
          "percent",
          0,
          null,
          null,
          [25, 63, 101, 139],
          null,
          null,
        ],
        [
          "contributionsPercentWithoutDR",
          "percent",
          0,
          "wa",
          null,
          [26, 64, 102, 140],
          null,
          null,
        ],
        [
          "contributionsPercentWithDR",
          "percent",
          0,
          "wa",
          null,
          [27, 65, 103, 141],
          null,
          null,
        ],
        [
          "contributionsPerGivingUnit",
          "dollar",
          0,
          "wa",
          null,
          [28, 66, 104, 142],
          null,
          null,
        ],
        [
          "contributionsPerMissionaryUnit",
          "dollar",
          0,
          "wa",
          null,
          [29, 67, 105, 143],
          null,
          null,
        ],
        [
          "contributionsPerFullTimeEquivalent",
          "dollar",
          0,
          "wa",
          null,
          [30, 68, 106, 144],
          null,
          null,
        ],
        [
          "fundraisingAsPercentOfContributions",
          "percent",
          1,
          "wa",
          null,
          [31, 69, 107, 145],
          null,
          null,
        ],
        [
          "annualizedInvestmentReturn",
          "percent",
          0,
          null,
          null,
          [32, 70, 108, 146],
          null,
          null,
        ],
      ]);
    }

    if (expenseData) {
      insertDataToReport(expenseData, selectedYears, [
        [
          "functionalExpensePercent_program",
          "percent",
          0,
          "wa",
          null,
          [33, 71, 109, 147],
          null,
          null,
        ],
        [
          "functionalExpensePercent_administrative",
          "percent",
          0,
          "wa",
          null,
          [34, 72, 110, 148],
          null,
          null,
        ],
        [
          "functionalExpensePercent_fundraising",
          "percent",
          0,
          "wa",
          null,
          [35, 73, 111, 149],
          null,
          null,
        ],
        [
          "costOfContributions",
          "dollar",
          2,
          "wa",
          null,
          [37, 75, 113, 151],
          null,
          null,
        ],
        [
          "expensesPerGivingUnit",
          "dollar",
          0,
          "wa",
          null,
          [38, 76, 114, 152],
          null,
          null,
        ],
        [
          "expensesPerMissionaryUnit",
          "dollar",
          0,
          "wa",
          null,
          [39, 77, 115, 153],
          null,
          null,
        ],
        [
          "expensesPerFullTimeEquivalent",
          "dollar",
          0,
          "wa",
          null,
          [40, 78, 116, 154],
          null,
          null,
        ],
        [
          "salariesAndBenefitsAsPercentOfTotalExpenses",
          "percent",
          0,
          "wa",
          null,
          [41, 79, 117, 155],
          null,
          null,
        ],
        [
          "salariesAndBenefitsPerFTE",
          "dollar",
          0,
          "wa",
          null,
          [42, 80, 118, 156],
          null,
          null,
        ],
      ]);
    }

    if (miscData) {
      insertDataToReport(miscData, selectedYears, [
        [
          "percentageAssessmentOnRestrictedGifts",
          "percent",
          0,
          "wa",
          null,
          [43, 81, 119, 157],
          null,
          null,
        ],
      ]);
    }

    // Format the table cells (negative values, etc.)
    processTHElements();

    // console.log("✅ Report display completed successfully");
  } catch (error) {
    console.error("Error displaying report component:", error);
    createToastWarning("Error displaying report: " + error.message);
  }

  // Close sidebar after selecting option
  closeSidebarAfterSelectingOption("report");
};

// Ensure all report structures exist by creating missing rows
function validateReportStructure() {
  // console.log("Validating report structure...");

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
      console.error(`Table with ID ${tableId} not found`);
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
        console.log(`Creating missing row: ${rowId} in table ${tableId}`);

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
        console.log(`Row ${rowId} exists`);

        // If row exists but first cell is empty, fill it
        const firstCell = row.querySelector("th");
        if (firstCell && !firstCell.textContent.trim()) {
          firstCell.textContent = displayName;
        }
      }
    });
  });

  // console.log("✅ Report structure validation complete");
}

// Clear all tables in the report section
const clearReportTables = () => {
  // console.log("Clearing report tables");

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
    } else {
      console.warn(`Could not find tbody for header ${header.id}`);
    }
  });
};

// Add year columns to all report tables
const addYearColumnsToAllReportTables = (years) => {
  // console.log("Adding year columns to all report tables");

  const tables = document.querySelectorAll("table");

  tables.forEach((table) => {
    const headerRows = table.querySelectorAll('tr[id$="_tableHeader"]');

    if (headerRows.length === 0) {
      console.warn(`No header rows found in table ${table.id || "unknown"}`);
    }

    headerRows.forEach((headerRow) => {
      // Add columns for each selected year plus the peer data columns
      addColumnsToTableHeader(headerRow, years);
    });
  });
};

// Add columns to a specific table header
const addColumnsToTableHeader = (headerRow, years) => {
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
};

// Insert data to the report for a specific category
const insertDataToReport = (data, selectedYears, arrayOfNames) => {
  if (!data || !selectedYears || !arrayOfNames) {
    console.warn("Missing data for report:", {
      data: !!data,
      years: !!selectedYears,
      names: !!arrayOfNames,
    });
    return;
  }

  // console.log(`Inserting data for ${arrayOfNames.length} metrics`);

  // Process each metric in the array
  for (let metricConfig of arrayOfNames) {
    const metricName = metricConfig[0];
    const dataType = metricConfig[1]; // 'num', 'percent', 'dollar'
    const fixedDecimals = metricConfig[2]; // number of decimal places
    const weightedAvg = metricConfig[3]; // 'wa' if weighted average
    const callback = metricConfig[4]; // callback function
    const fileIdArray = metricConfig[5]; // array of file IDs
    const begin = metricConfig[6]; // begin position
    const end = metricConfig[7]; // end position

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
          const formattedValue = styleNumber(
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
      // console.log(`Found peer data for ${metricName}`);

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
          console.log(`Using weighted average for ${metricName} in report: ${avg}`);
        } catch (error) {
          console.error(
            `Error calculating weighted average for ${metricName}:`,
            error
          );
          // Fall back to regular average
          if (peerData["total"] && Array.isArray(peerData["total"])) {
            avg = getAverageOfArray(peerData["total"], metricName) || 0;
          }
        }
      } else if (peerData["total"] && Array.isArray(peerData["total"])) {
        // Use regular average if not using weighted average
        avg = getAverageOfArray(peerData["total"], metricName) || 0;
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
            q1 = get25thPercentileOfArray(peerData["total"], metricName) || 0;
            median = getMidpointOfArray(peerData["total"], metricName) || 0;
            q3 = get75thPercentileOfArray(peerData["total"], metricName) || 0;
          }
        } else {
          // Fallback without calculatePercentiles function
          q1 = get25thPercentileOfArray(peerData["total"], metricName) || 0;
          median = getMidpointOfArray(peerData["total"], metricName) || 0;
          q3 = get75thPercentileOfArray(peerData["total"], metricName) || 0;
        }

        if (metricName == 'liquidityAssetsAvailableCover') {
          console.log('!!!!', {avg, q1, median, q3, fixedDecimals, peer: peerData['total'], weightedAvg})
        }
      }

      // Format values
      const textAvg = styleNumber(avg, dataType, fixedDecimals, metricName);
      const textQ1 = styleNumber(q1, dataType, fixedDecimals, metricName);
      const textMedian = styleNumber(
        median,
        dataType,
        fixedDecimals,
        metricName
      );
      const textQ3 = styleNumber(q3, dataType, fixedDecimals, metricName);

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
};

// Process all TH elements to format negative values
const processTHElements = () => {
  // console.log("Processing TH elements (formatting negative values)");

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
        // Check if the TH has exactly three children (might be P tags for values)
        if (th.childElementCount === 3) {
          // Process the two P tags
          const pTags = th.querySelectorAll("p");
          pTags.forEach((p) => {
            let textContent = p.textContent.trim();
            // Check if the text content contains numbers and is negative
            if (/\d/.test(textContent) && textContent.includes("-")) {
              // Remove "-" and apply classes
              textContent = `(${textContent.replace("-", "")})`;
              p.textContent = textContent;
              p.classList.remove("text-gray-900", "dark:text-white");
              p.classList.add("text-red-500", "dark:text-red-400");
            }
          });
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
      }
    });
  });
};

// Show the reports tab
const showReportsTab = () => {
  // console.log("Showing reports tab");

  // Hide all content tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.add("hidden");
  });

  // Show the reports tab
  const reportsTab = document.getElementById("reportsContent");
  if (reportsTab) {
    reportsTab.classList.remove("hidden");
    console.log("Reports tab visibility updated");
  } else {
    console.error("Reports tab element not found");
  }

  // Update active state on sidebar links
  document.querySelectorAll("#sidebar button").forEach((button) => {
    button.classList.remove("active", "bg-gray-300", "dark:bg-gray-700");
  });

  // Set the reports link as active
  const reportsLink = document.getElementById("reportLink");
  if (reportsLink) {
    reportsLink.classList.add("active", "bg-gray-300", "dark:bg-gray-700");
  }
};

// Make the function globally available
window.displayReportComponent = displayReportComponent;

// Listen for chartsRendered event
document.addEventListener("chartsRendered", function () {
  // console.log("Charts rendered event received - displaying report");
  setTimeout(() => {
    displayReportComponent();
  }, 300);
});

// Add a direct console log to verify script loading
// console.log('Report.js fully loaded - displayReportComponent available in global scope');
