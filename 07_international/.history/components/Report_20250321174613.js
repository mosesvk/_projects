const displayReportComponent = () => {
  console.log("Starting report component display");

  // Retrieve all data from localStorage
  const generalData = JSON.parse(localStorage.getItem("generalData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  const assetData = JSON.parse(localStorage.getItem("assetData"));
  const incomeData = JSON.parse(localStorage.getItem("incomeData"));
  const expenseData = JSON.parse(localStorage.getItem("expenseData"));
  const miscData = JSON.parse(localStorage.getItem("miscData"));

  console.log("Data loaded from localStorage:", {
    generalData: generalData ? "Found" : "Not found",
    cashData: cashData ? "Found" : "Not found",
    assetData: assetData ? "Found" : "Not found",
    incomeData: incomeData ? "Found" : "Not found",
    expenseData: expenseData ? "Found" : "Not found",
    miscData: miscData ? "Found" : "Not found"
  });

  // Get the selected years from localStorage
  const selectedYears = getSelectedYearsFromLocalStorage();
  if (!selectedYears || selectedYears.length === 0) {
    console.error("No selected years found, cannot display report");
    createToastWarning("Please select years to display the report");
    return;
  }
  console.log("Selected years:", selectedYears);

  try {
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
        ["itExpenses", "dollar", 0, null, null, [6, 44, 82, 120], "begin", null],
      ]);
    }

    if (cashData) {
      insertDataToReport(cashData, selectedYears, [
        ["daysCashOnHand", "num", 0, "wa", null, [7, 45, 83, 121], null, null],
        ["daysExpensesInUnrestrictedNA", "num", 0, "wa", null, [8, 46, 84, 122], null, null],
        ["daysExpensesInUnrestrictedNA_excludingPPE", "num", 0, "wa", null, [9, 47, 85, 123], null, null],
        ["daysExpensesInNAwithDR", "num", 0, "wa", null, [10, 48, 86, 124], null, null],
        ["daysExpensesInNAwithDR_excludingPPE", "num", 0, "wa", null, [11, 49, 87, 125], null, null],
        ["liquidityAssetsAvailableCover", "num", 2, "wa", null, null, null, null],
        ["liquidityFundsAvailable", "num", 1, "wa", null, [12, 50, 88, 126], null, null],
        ["financialAssetsAvailableFY", "dollar", 2, "wa", null, [13, 51, 89, 127], null, null],
        ["daysFinancialAssetsOnHand", "num", 0, "wa", null, [14, 52, 90, 128], null, null],
        ["currentRatio", "num", 1, "wa", null, [15, 53, 91, 129], null, null],
        ["totalCoverageRatio", "num", 1, "wa", null, [16, 54, 92, 130], null, null],
        ["assetsWithoutPpeToLiabilitiesWithoutDebt", "num", 2, "wa", null, null, null, null],
        ["cashFlowsTrendFinancing", "dollar", 0, null, null, [17, 55, 93, 131], null, null],
        ["cashFlowsTrendInvesting", "dollar", 0, null, null, [18, 56, 94, 132], null, null],
        ["cashFlowsTrendOperating", "dollar", 0, null, null, [19, 57, 95, 133], null, null],
      ]);
    }

    if (assetData) {
      insertDataToReport(assetData, selectedYears, [
        ["percentWithDR", "percent", 0, "wa", null, [20, 58, 96, 134], null, null],
        ["percentWithoutDR_excludingPPE", "percent", 0, "wa", null, [21, 59, 97, 135], null, null],
        ["percentWithoutDR", "percent", 0, "wa", null, [22, 60, 98, 136], null, null],
      ]);
    }

    if (incomeData) {
      insertDataToReport(incomeData, selectedYears, [
        ["netIncomeRatio", "num", 2, "wa", null, [23, 61, 99, 137], null, null],
        ["contributionsTrend_basedOnNumberOfDonors", "percent", 0, "wa", null, [24, 62, 100, 138], null, null],
        ["contributionsTrend", "percent", 0, "wa", null, [25, 63, 101, 139], null, null],
        ["contributionsPercentWithoutDR", "percent", 0, "wa", null, [26, 64, 102, 140], null, null],
        ["contributionsPercentWithDR", "percent", 0, "wa", null, [27, 65, 103, 141], null, null],
        ["contributionsPerGivingUnit", "dollar", 0, "wa", null, [28, 66, 104, 142], null, null],
        ["contributionsPerMissionaryUnit", "dollar", 0, "wa", null, [29, 67, 105, 143], null, null],
        ["contributionsPerFullTimeEquivalent", "dollar", 0, "wa", null, [30, 68, 106, 144], null, null],
        ["fundraisingAsPercentOfContributions", "percent", 1, "wa", null, [31, 69, 107, 145], null, null],
        ["annualizedInvestmentReturn", "percent", 0, null, null, [32, 70, 108, 146], null, null],
      ]);
    }

    if (expenseData) {
      insertDataToReport(expenseData, selectedYears, [
        ["functionalExpensePercent_program", "percent", 0, "wa", null, [33, 71, 109, 147], null, null],
        ["functionalExpensePercent_administrative", "percent", 0, "wa", null, [34, 72, 110, 148], null, null],
        ["functionalExpensePercent_fundraising", "percent", 0, "wa", null, [35, 73, 111, 149], null, null],
        ["costOfContributions", "dollar", 2, "wa", null, [37, 75, 113, 151], null, null],
        ["expensesPerGivingUnit", "dollar", 0, "wa", null, [38, 76, 114, 152], null, null],
        ["expensesPerMissionaryUnit", "dollar", 0, "wa", null, [39, 77, 115, 153], null, null],
        ["expensesPerFullTimeEquivalent", "dollar", 0, "wa", null, [40, 78, 116, 154], null, null],
        ["salariesAndBenefitsAsPercentOfTotalExpenses", "percent", 0, "wa", null, [41, 79, 117, 155], null, null],
        ["salariesAndBenefitsPerFTE", "dollar", 0, "wa", null, [42, 80, 118, 156], null, null],
      ]);
    }

    if (miscData) {
      insertDataToReport(miscData, selectedYears, [
        ["percentageAssessmentOnRestrictedGifts", "percent", 0, "wa", null, [43, 81, 119, 157], null, null],
      ]);
    }

    // Format the table cells (negative values, etc.)
    processTHElements();
    
    // Show the reports tab
    showReportsTab();

    console.log("Report display completed successfully");
  } catch (error) {
    console.error("Error displaying report component:", error);
    createToastWarning("Error displaying report: " + error.message);
  }

  // Close sidebar after selecting option
  closeSidebarAfterSelectingOption("report");
};

// Clear all tables in the report section
const clearReportTables = () => {
  console.log("Clearing report tables");
  
  // Get all report table headers
  const tableHeaders = document.querySelectorAll('[id$="_tableHeader"]');
  
  tableHeaders.forEach(header => {
    // Clear all header cells except the first one (which contains the category name)
    while (header.children.length > 1) {
      header.removeChild(header.children[1]);
    }
    
    // Get all rows in the same table as this header
    const tableBody = header.closest('table').querySelector('tbody');
    if (tableBody) {
      const rows = tableBody.querySelectorAll('tr');
      rows.forEach(row => {
        // Clear all cells in the row except the first one (which contains the metric name)
        while (row.children.length > 1) {
          row.removeChild(row.children[1]);
        }
      });
    }
  });
};

// Add year columns to all report tables
const addYearColumnsToAllReportTables = (years) => {
  console.log("Adding year columns to all report tables");
  
  const tables = document.querySelectorAll("table");
  
  tables.forEach(table => {
    const headerRows = table.querySelectorAll('tr[id$="_tableHeader"]');
    
    headerRows.forEach(headerRow => {
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
  years.forEach(year => {
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
    { text: "75%", class: "px-6 py-3" }
  ];
  
  peerColumns.forEach(column => {
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
    console.warn("Missing data for report:", { data: !!data, years: !!selectedYears, names: !!arrayOfNames });
    return;
  }
  
  console.log(`Inserting data for ${arrayOfNames.length} metrics`);
  
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
    const row = document.getElementById(`row_${metricName}`);
    if (!row) {
      console.warn(`Row not found for metric: ${metricName}`);
      continue;
    }
    
    // Clear any existing data cells in the row
    while (row.children.length > 1) {
      row.removeChild(row.children[1]);
    }
    
    // Add client data for each year
    const clientData = data[`${metricName}_Client`];
    if (clientData) {
      addClientDataToRow(row, selectedYears, clientData, dataType, fixedDecimals, callback, metricName);
    } else {
      console.warn(`No client data found for metric: ${metricName}`);
      // Add empty cells for client data
      selectedYears.forEach(() => {
        const emptyCell = document.createElement("th");
        emptyCell.className = "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
        emptyCell.textContent = "-";
        row.appendChild(emptyCell);
      });
    }
    
    // Add peer data (avg, 25%, 50%, 75%)
    const peerData = data[`${metricName}_Peer`];
    addPeerDataToRow(
      row, 
      peerData, 
      dataType, 
      fixedDecimals, 
      "total", 
      weightedAvg, 
      metricName, 
      data, 
      fileIdArray, 
      begin, 
      end
    );
  }
};

// Add client data to a report row
const addClientDataToRow = (tableRow, selectedYears, client, type, fixedNum, cb, name) => {
  if (!client || !tableRow) return;
  
  console.log(`Adding client data for ${name}`, { years: selectedYears.length });
  
  const cellClass = "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
  
  selectedYears.forEach(year => {
    const cell = document.createElement("th");
    cell.className = cellClass;
    cell.scope = "row";
    
    if (client[year] && client[year].value !== undefined) {
      const value = client[year].value;
      const formattedValue = Number(value) !== 0 ? styleNumber(value, type, fixedNum, name) : "-";
      
      // Create wrapper for the value
      const wrapper = document.createElement("div");
      wrapper.className = "flex justify-between";
      
      const valueSpan = document.createElement("span");
      valueSpan.className = "mr-2";
      valueSpan.textContent = formattedValue;
      wrapper.appendChild(valueSpan);
      
      cell.appendChild(wrapper);
    } else {
      cell.textContent = "-";
    }
    
    tableRow.appendChild(cell);
  });
  
  // Apply benchmarks if provided
  if (cb && client) {
    const benchmarkArray = getBenchmarks(client);
    if (benchmarkArray && benchmarkArray.length > 0) {
      getBackgroundColor(benchmarkArray, tableRow);
    }
  }
};

// Add peer data to a report row
const addPeerDataToRow = (tableRow, peer, type, fixedNum, dataArray, wa, name, data, fIdArray, begin, end) => {
  if (!tableRow) return;
  
  console.log(`Adding peer data for ${name}`);
  
  const cellClass = "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  
  // Calculate average
  let avg = 0;
  if (peer && wa) {
    avg = parseFloat(getWeightedAverageOfArray(data, name));
  } else if (peer && !wa) {
    avg = parseFloat(getAverageOfArray(peer[dataArray], name));
  }
  
  // Ensure avg is not NaN
  if (isNaN(avg)) avg = 0;
  
  // Calculate percentiles
  let q1 = 0, median = 0, q3 = 0;
  if (peer) {
    try {
      [q1, median, q3] = calculatePercentiles(peer[dataArray], type, fixedNum);
    } catch (error) {
      console.warn(`Error calculating percentiles for ${name}:`, error);
    }
  }
  
  // Format values
  const textAvg = peer ? styleNumber(avg, type, fixedNum) : "-";
  const textQ1 = peer ? styleNumber(q1, type, fixedNum) : "-";
  const textMedian = peer ? styleNumber(median, type, fixedNum) : "-";
  const textQ3 = peer ? styleNumber(q3, type, fixedNum) : "-";
  
  // Add average cell
  const avgCell = document.createElement("th");
  avgCell.className = cellClass;
  avgCell.scope = "row";
  avgCell.textContent = textAvg;
  tableRow.appendChild(avgCell);
  
  // Add 25th percentile cell
  const q1Cell = document.createElement("th");
  q1Cell.className = cellClass;
  q1Cell.scope = "row";
  q1Cell.textContent = textQ1;
  tableRow.appendChild(q1Cell);
  
  // Add median cell
  const medianCell = document.createElement("th");
  medianCell.className = cellClass;
  medianCell.scope = "row";
  medianCell.textContent = textMedian;
  tableRow.appendChild(medianCell);
  
  // Add 75th percentile cell
  const q3Cell = document.createElement("th");
  q3Cell.className = cellClass;
  q3Cell.scope = "row";
  q3Cell.textContent = textQ3;
  tableRow.appendChild(q3Cell);
  
  // Create file for print if needed
  if (fIdArray) {
    createFileForPrint(name, fIdArray, begin, end, avg, median, q1, q3, peer, data);
  }
};

// Process all TH elements to format negative values
const processTHElements = () => {
  console.log("Processing TH elements (formatting negative values)");
  
  // Select all TR elements with an ID
  const rows = document.querySelectorAll("tr[id]");
  
  rows.forEach(row => {
    // Select all TH elements inside the current TR
    const thElements = row.querySelectorAll("th");
    
    thElements.forEach(th => {
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
          pTags.forEach(p => {
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
  // Hide all content tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  
  // Show the reports tab
  const reportsTab = document.getElementById('reportsContent');
  if (reportsTab) {
    reportsTab.classList.remove('hidden');
  }
  
  // Update active state on sidebar links
  document.querySelectorAll('#sidebar button').forEach(button => {
    button.classList.remove('active', 'bg-gray-300', 'dark:bg-gray-700');
  });
  
  // Set the reports link as active
  const reportsLink = document.getElementById('reportLink');
  if (reportsLink) {
    reportsLink.classList.add('active', 'bg-gray-300', 'dark:bg-gray-700');
  }
};