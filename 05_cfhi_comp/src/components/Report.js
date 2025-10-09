const displayReportComponent = () => {
  const demoData = JSON.parse(localStorage.getItem("demoData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  const debtData = JSON.parse(localStorage.getItem("debtData"));
  const incomeData = JSON.parse(localStorage.getItem("incomeData"));
  const expenseData = JSON.parse(localStorage.getItem("expenseData"));
  const additionalData = JSON.parse(localStorage.getItem("additionalData"));

  const selectedYears = getSelectedYearsFromLocalStorage();

  if (selectedYears) {
    addYearColumnsToReportTable(selectedYears);
    insertDataToReport(demoData, selectedYears, [
      ["givingUnits", "num", 0],
      ["fullTimeEquivalent", "num", 0],
      ["givingUnitsToStaff", "num", 1, "wa", "cb"],
      ["contributionsWithoutDonorExcludingLargeGifts", "dollar", 0],
      ["totalContributionsExclude", "dollar", 0],
      ["percentContributionsOnline", "percent", 0, "wa"],
      ["totalOutsourcedEmployees", "num", 0],
      ["facilitySquareFootage", "num", 0],
      ["numberOfLocations", "num", 0],
    ]);
    insertDataToReport(cashData, selectedYears, [
      ["daysExpendableNetAssets", "num", 0, "wa", "cb"],
      ["daysOperatingCash", "num", 0, "wa", "cb"],
      ["availableDaysOfCashFlow", "num", 0, "wa", "cb"],
      ["liquidityRatio", "num", 1, "wa", "cb"],
      ["netCashAvailability", "dollar", 0, null, "cb"],
      ["netCashAvailability_including", "dollar", 0, null],
      ["netCashAvailability_standard", "dollar", 0, null],
      // ["cashFlowsFromOperatingActivities", "dollar", 0, "wa"],
    ]);
    insertDataToReport(debtData, selectedYears, [
      ["debtToContributionsWithout", "num", 1, "wa", "cb"],
      ["currentRatio", "num", 1, "wa", "cb"],
      ["mandatoryDebtServiceToContributionsWithout", "percent", 0, "wa", "cb"],
      // Removed per todo: Debt per Average Adult Attendee
      ["debtPerGivingUnit", "dollar", 0, "wa", "cb"],
      ["debtPerGivingUnit_percentChange", "percent", 0],
      ["debtPerGivingUnit_standard", "dollar", 0, "wa"],
      ["debtCoverage", "num", 2, "wa", "cb"],
    ]);

    checkForCountyDataIncomeTable(
      "localCounty",
      "localCountyName_Client",
      "localCountyMedianHouseholdIncome_Client",
      "localCountyPerGivingUnit_Client",
      selectedYears,
      "cb"
    );
    checkForCountyDataIncomeTable(
      "localCounty_two",
      "localCountyName_two_Client",
      "localCountyMedianHouseholdIncome_two_Client",
      "localCountyPerGivingUnit_two_Client",
      selectedYears
    );
    checkForCountyDataIncomeTable(
      "localCounty_three",
      "localCountyName_three_Client",
      "localCountyMedianHouseholdIncome_three_Client",
      "localCountyPerGivingUnit_three_Client",
      selectedYears
    );
    checkForCountyDataIncomeTable(
      "localCounty_four",
      "localCountyName_four_Client",
      "localCountyMedianHouseholdIncome_four_Client",
      "localCountyPerGivingUnit_four_Client",
      selectedYears
    );
    checkForCountyDataIncomeTable(
      "localCounty_five",
      "localCountyName_five_Client",
      "localCountyMedianHouseholdIncome_five_Client",
      "localCountyPerGivingUnit_five_Client",
      selectedYears
    );
    checkForCountyDataIncomeTable(
      "localCounty_six",
      "localCountyName_six_Client",
      "localCountyMedianHouseholdIncome_six_Client",
      "localCountyPerGivingUnit_six_Client",
      selectedYears
    );

    insertDataToReport(incomeData, selectedYears, [
      ["netIncomeRatio", "percent", 0, "wa", "cb"],
      ["netIncomeRatio_twoYrAvg", "percent", 0, null, "cb"],
      ["contributionsWithoutDonorPerGivingUnit", "dollar", 0],
      [
        "contributionsWithoutDonorPerGivingUnit_percentChange",
        "percent",
        0,
        null,
        "cb",
      ],
      ["totalContributionsPerGivingUnit", "dollar", 0],
      [
        "totalContributionsPerGivingUnit_percentChange",
        "percent",
        0,
        "wa",
        "cb",
      ],
    ]);

    insertDataToReport(expenseData, selectedYears, [
      ["benefitsToSalaries", "percent", 0, "wa"],
      ["salaries", "dollar", 0, "wa"],
      ["benefits", "dollar", 0, "wa"],
      ["salariesBenefits", "dollar", 0, "wa"],
      ["salariesBenefitsIncludingOutsourcedEmployees", "dollar", 0, "wa"],
      ["personnelToCashExpenditure", "percent", 0, "wa", "cb"],
      ["mandatoryDebtServiceToCashExpenditure", "percent", 0, "wa", "cb"],
      ["personnelIncludingToTotalCashExpenditures", "percent", 0, "wa", "cb"],
      ["localOutreachExpenses", "percent", 0, "wa"],
      ["globalOutreachExpenses", "percent", 0, "wa"],
      ["totalGlobalAndLocalOutreachExpenses", "percent", 0, "wa", "cb"],
      // Removed per todo: Cash Expenditures Per Average Adult Attendee
      ["cashExpendituresPerGivingUnit", "dollar", 0, "wa"],
      ["cashExpendituresPerGivingUnit_percentChange", "percent", 0],
    ]);

    insertDataToReport(additionalData, selectedYears, [
      ["contributionsPerAccountingFTE", "dollar", 0, "wa"],
      ["expensesPerAccountingFTE", "dollar", 0, "wa"],
      // Removed facility-related ratios per todo
      // Removed per todo: Information Technology Cost per FTE
    ]);

    processTHElements()
    processBenchmarkParagraphs()
  }

  closeSidebarAfterSelectingOption("report");
};

const insertDataToReport = (data, selectedYears, arrayOfNames) => {
  if (data && selectedYears) {
    addTotalDataToEveryRow(data, selectedYears, arrayOfNames);
  }
};

const addTotalDataToEveryRow = (data, selectedYears, arrayOfNames) => {
  // console.log('data', data);

  for (let name of arrayOfNames) {
    // console.log('name', name);
    addToSingleRow(
      selectedYears,
      name[0],
      data,
      data[`${name[0]}_Client`],
      data[`${name[0]}_Peer`],
      name[1],
      name[2],
      name[3],
      name[4]
    );
  }
};

const addToSingleRow = (
  selectedYears,
  name,
  data,
  client,
  peer,
  type,
  fixedNum,
  wa,
  cb
) => {
  // console.log({ selectedYears, name, client, peer, type, fixedNum });
  const tableReportRow = document.getElementById(`row_${name}`);
  // console.log(`row_${name}`);
  // console.log("tableReportRow", tableReportRow);

  while (tableReportRow.children.length > 1) {
    tableReportRow.removeChild(tableReportRow.children[1]);
  }

  selectedYears.forEach((year) => {
    const tableModalRow = document.getElementById(`${name}_modal_${year}`);

    if (tableModalRow) {
      // console.log('tableModalRow', `${name}_modal_${year}`,tableModalRow);

      addClientDataToModalRow(tableModalRow, year, client, type, fixedNum);
      addPeerDataToModalRow(
        tableModalRow,
        peer,
        type,
        fixedNum,
        year,
        wa,
        name,
        data
      );
    }
  });

  addClientDataToReportRow(
    tableReportRow,
    selectedYears,
    client,
    type,
    fixedNum,
    cb
  );
  addPeerDataToRow(
    tableReportRow,
    peer,
    type,
    fixedNum,
    "total",
    wa,
    name,
    data
  );
};

const addClientDataToReportRow = (
  tableRow,
  selectedYears,
  client,
  type,
  fixedNum,
  cb
) => {
  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
  const propScope = "row";

  selectedYears.forEach((year) => {
    const dataPoint = document.createElement("th");
    const text = client ? styleNumber(client[year].value, type, fixedNum) : "";

    // Create a new span element
    const spanElement = document.createElement("span");
    spanElement.textContent = text;

    // Add the "mr-2" class to the span element
    spanElement.classList.add("mr-2");

    // Create a new div element
    const divElement = document.createElement("div");

    // Add the "flex" class to the div element
    divElement.classList.add("flex");
    divElement.classList.add("justify-between");

    // Append the span element to the div element
    divElement.appendChild(spanElement);

    // Append the div element to the dataPoint
    dataPoint.appendChild(divElement);
    dataPoint.className = propClass;
    dataPoint.scope = propScope;

    // Append the dataPoint to the tableRow
    tableRow.appendChild(dataPoint);
  });

  if (cb) {
    let clientBenchmarkArray = getBenchmarks(client);

    //  console.log(clientBenchmarkArray, tableRow);

    getBackgroundColor(clientBenchmarkArray, tableRow);
  }
};

const addClientDataToModalRow = (
  tableModalRow,
  year,
  client,
  type,
  fixedNum
) => {
  // console.log('addClientDataToModalRow', { tableModalRow, year, client, type, fixedNum  });

  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPoint = document.createElement("th");
  const text = styleNumber(client[year].value, type, fixedNum);

  dataPoint.className = propClass;
  dataPoint.scope = propScope;
  dataPoint.textContent = text;

  tableModalRow.appendChild(dataPoint);
};

const addPeerDataToRow = (
  tableRow,
  peer,
  type,
  fixedNum,
  dataArray,
  wa,
  name,
  data
) => {
  // console.log('addPeerDataToRow', { tableRow, peer, type, fixedNum, dataArray, wa, data, name });

  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPointAvg = document.createElement("th");

  // Check if this field should not have peer data calculated
  const shouldSkipPeerData = name.endsWith('_percentChange') || name === 'netIncomeRatio_twoYrAvg';

  let avg, mid, min, max;
  let textAvg, textMid, textMin, textMax;

  if (shouldSkipPeerData) {
    // For _percentChange fields and netIncomeRatio_twoYrAvg, set peer data to blank
    avg = '';
    mid = '';
    min = '';
    max = '';
    textAvg = '';
    textMid = '';
    textMin = '';
    textMax = '';
  } else {
    // Normal peer data calculation
    if (peer && wa) {
      avg = getWeightedAverageOfArray(data, name);
    } else if (peer && wa === undefined) {
      avg = getAverageOfArray(peer[dataArray], name);
    } else {
      avg = 0;
    }

    textAvg = peer ? styleNumber(avg, type, fixedNum) : '';
    mid = peer ? getMidpointOfArray(peer[dataArray]) : '';
    textMid = styleNumber(mid, type, fixedNum);
    min = peer ? get25thPercentileOfArray(peer[dataArray]) : '';
    textMin = styleNumber(min, type, fixedNum);
    max = peer ? get75thPercentileOfArray(peer[dataArray]) : '';
    textMax = styleNumber(max, type, fixedNum);
  }

  // if (name == 'givingUnits') console.log('givingUnits', {avg, textAvg, peer, wa, data, name, type, dataArray, fixedNum});

  // console.log('----', {avg, textAvg, peer, wa, data, name});  

  const dataPointMid = document.createElement("th");
  const dataPointMin = document.createElement("th");
  const dataPointMax = document.createElement("th");

  dataPointAvg.className = propClass;
  dataPointAvg.scope = propScope;
  dataPointAvg.textContent = textAvg;
  tableRow.appendChild(dataPointAvg);

  dataPointMin.className = propClass;
  dataPointMin.scope = propScope;
  dataPointMin.textContent = textMin;
  tableRow.appendChild(dataPointMin);

  dataPointMid.className = propClass;
  dataPointMid.scope = propScope;
  dataPointMid.textContent = textMid;
  tableRow.appendChild(dataPointMid);

  dataPointMax.className = propClass;
  dataPointMax.scope = propScope;
  dataPointMax.textContent = textMax;
  tableRow.appendChild(dataPointMax);
};

const addPeerDataToModalRow = (
  tableRow,
  peer,
  type,
  fixedNum,
  dataArray,
  wa,
  name,
  data
) => {
  // console.log('addPeerDataToRow', { tableRow, peer, type, fixedNum, dataArray, wa, data, name });

  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPointAvg = document.createElement("th");

  // Check if this field should not have peer data calculated
  const shouldSkipPeerData = name.endsWith('_percentChange') || name === 'netIncomeRatio_twoYrAvg';

  let avg, mid, min, max;
  let textAvg, textMid, textMin, textMax;

  if (shouldSkipPeerData) {
    // For _percentChange fields and netIncomeRatio_twoYrAvg, set peer data to blank
    avg = '';
    mid = '';
    min = '';
    max = '';
    textAvg = '';
    textMid = '';
    textMin = '';
    textMax = '';
  } else {
    // Normal peer data calculation
    if (peer && wa) {
      avg = getWeightedAverageOfArray(data, name, dataArray);
    } else if (peer && wa === undefined) {
      avg = getAverageOfArray(peer[dataArray], name);
    } else {
      avg = 0;
    }

    textAvg = peer ? styleNumber(avg, type, fixedNum) : '';
    mid = peer ? getMidpointOfArray(peer[dataArray]) : '';
    textMid = styleNumber(mid, type, fixedNum);
    min = peer ? get25thPercentileOfArray(peer[dataArray]) : '';
    textMin = styleNumber(min, type, fixedNum);
    max = peer ? get75thPercentileOfArray(peer[dataArray]) : '';
    textMax = styleNumber(max, type, fixedNum);
  }

  // if (name == 'givingUnits') console.log('givingUnits', {avg, textAvg, peer, wa, data, name, type, dataArray, fixedNum});

  // console.log('----', {avg, textAvg, peer, wa, data, name});  

  const dataPointMid = document.createElement("th");
  const dataPointMin = document.createElement("th");
  const dataPointMax = document.createElement("th");

  dataPointAvg.className = propClass;
  dataPointAvg.scope = propScope;
  dataPointAvg.textContent = textAvg;
  tableRow.appendChild(dataPointAvg);

  dataPointMin.className = propClass;
  dataPointMin.scope = propScope;
  dataPointMin.textContent = textMin;
  tableRow.appendChild(dataPointMin);

  dataPointMid.className = propClass;
  dataPointMid.scope = propScope;
  dataPointMid.textContent = textMid;
  tableRow.appendChild(dataPointMid);

  dataPointMax.className = propClass;
  dataPointMax.scope = propScope;
  dataPointMax.textContent = textMax;
  tableRow.appendChild(dataPointMax);
};

const addYearColumnsToReportTable = (years) => {
  const tables = document.querySelectorAll("table");
  // console.log(tables);

  tables.forEach((table) => {
    // console.log(table);
    const trElements = table.querySelectorAll("tr");
    const trIds = Array.from(trElements)
      .map((tr) => tr.getAttribute("id"))
      .filter((id) => id && id.endsWith("_tableHeader"));

    trIds.forEach((idName) => {
      // Clear existing columns before adding new ones
      clearTableColumns(idName);

      // Add new columns to the table
      addSingleNewColumnToReportTable(idName, years);
    });
  });
};

const addSingleNewColumnToReportTable = (tableHeader, yearsArray) => {
  // Find the table header row by its ID
  const tableHeaderRow = document.getElementById(tableHeader);

  // Get the reference to the "avg" <th> element
  const avgTh = tableHeaderRow.children[1];
  // const existingColumns = Array.from(tableHeader.children).slice(1
  // console.log(existingColumns);

  // Iterate through the selectedYearArray and add new columns
  yearsArray.forEach((year) => {
    // Create a new <th> element for each selected year
    const newTh = document.createElement("th");
    newTh.setAttribute("scope", "col");
    newTh.setAttribute("class", "px-6 py-3 text-lg");
    newTh.innerText = year;

    // Insert the new <th> element before the "avg" <th>
    tableHeaderRow.insertBefore(newTh, avgTh);
  });
};

const clearTableColumns = (idName) => {
  const headerRow = document.getElementById(idName);
  const columnsToPreserve = ["Avg", "25th", "50th", "75th"];

  // Remove all existing th elements except the first one and those to be preserved
  Array.from(headerRow.children)
    .slice(1)
    .forEach((th) => {
      const columnName = th.textContent.trim();
      if (!columnsToPreserve.includes(columnName)) {
        th.remove();
      }
    });

  // Clear corresponding columns from other rows in the table body
  clearColumnsFromOtherRowsInTable(idName, columnsToPreserve);
};

const clearColumnsFromOtherRowsInTable = (idName, columnsToPreserve) => {
  const rows = document.querySelectorAll(`#${idName} + tbody tr`);

  rows.forEach((row) => {
    // Remove all existing td elements except the first one and those to be preserved
    Array.from(row.children)
      .slice(1)
      .forEach((td) => {
        const columnName = td.textContent.trim();
        if (!columnsToPreserve.includes(columnName)) {
          td.remove();
        }
      });
  });
};

function processTHElements() {
  // Select all <tr> elements with an id
  const rows = document.querySelectorAll('tr[id]');

  rows.forEach(row => {
    // Select all <th> elements inside the current <tr>
    const thElements = row.querySelectorAll('th');

    thElements.forEach(th => {
      // Check if the <th> has a <div> child
      const divChild = th.querySelector('div');
      if (divChild) {
        // If <th> has a <div> child, find the <span> inside it
        const spanChild = divChild.querySelector('span');
        if (spanChild) {
          // Process the text content of <span> child
          let textContent = spanChild.textContent.trim();
          // Check if the text content contains numbers
          if (/\d/.test(textContent)) {
            if (textContent.includes("-")) {
              // Remove "-" and apply classes
              textContent = `(${textContent.replace("-", "")})`;
              spanChild.textContent = textContent;
              th.classList.remove("text-gray-900", "dark:text-white");
              th.classList.add("text-red-500", "dark:text-red-400");
            }
          }
        }
      } else {
        // Check if the <th> has exactly three children
        if (th.childElementCount === 3) {
          // Process the two <p> tags
          const pTags = th.querySelectorAll('p');
          pTags.forEach(p => {
            let textContent = p.textContent.trim();
            // Check if the text content contains numbers
            if (/\d/.test(textContent)) {
              if (textContent.includes("-")) {
                // Remove "-" and apply classes
                textContent = `(${textContent.replace("-", "")})`;
                p.textContent = textContent;
                p.classList.remove("text-gray-900", "dark:text-white");
                p.classList.add("text-red-500", "dark:text-red-400");
              }
            }
          });
        } else {
          // Process the text content of <th> directly
          let textContent = th.textContent.trim();
          // Check if the text content contains numbers
          if (/\d/.test(textContent)) {
            if (textContent.includes("-")) {
              // Remove "-" and apply classes
              textContent = `(${textContent.replace("-", "")})`;
              th.textContent = textContent;
              th.classList.remove("text-gray-900", "dark:text-white");
              th.classList.add("text-red-500", "dark:text-red-400");
            }
          }
        }
      }
    });
  });
}

function processBenchmarkParagraphs() {
  // Get data from localStorage
  const demoData = JSON.parse(localStorage.getItem("demoData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  const debtData = JSON.parse(localStorage.getItem("debtData"));
  const incomeData = JSON.parse(localStorage.getItem("incomeData"));
  const expenseData = JSON.parse(localStorage.getItem("expenseData"));

  // Array of field mappings: [fieldName, dataSource, modalBodySelector]
  const benchmarkFields = [
    // Demo data
    ["attendeesToStaff", demoData, "#attendeesToStaff-body-3 div"],
    
    // Cash data
    ["daysExpendableNetAssets", cashData, "#daysExpendableNetAssets-body-3 div"],
    ["daysOperatingCash", cashData, "#daysOperatingCash-body-3 div"],
    ["availableDaysOfCashFlow", cashData, "#availableDaysOfCashFlow-body-3 div"],
    ["liquidityRatio", cashData, "#liquidityRatio-body-3 div"],
    ["netCashAvailability", cashData, "#netCashAvailability-body-3 div"],
    
    // Debt data
    ["debtToContributionsWithout", debtData, "#debtToContributionsWithout-body-3 div"],
    ["currentRatio", debtData, "#currentRatio-body-3 div"],
    ["mandatoryDebtServiceToContributionsWithout", debtData, "#mandatoryDebtServiceToContributionsWithout-body-3 div"],
    ["debtPerGivingUnit", debtData, "#debtPerGivingUnit-body-3 div"],
    ["debtCoverage", debtData, "#debtCoverage-body-3 div"],
    
    // Income data
    ["netIncomeRatio", incomeData, "#netIncomeRatio-body-3 div"],
    ["totalContributionsPerGivingUnit", incomeData, "#totalContributionsPerGivingUnit-body-3 div"],
    ["contributionsWithoutDonorPerGivingUnit", incomeData, "#contributionsWithoutDonorPerGivingUnit-body-3 div"],
    
    // Expense data
    ["personnelToCashExpenditure", expenseData, "#personnelToCashExpenditure-body-3 div"],
    ["benefitsToSalaries", expenseData, "#benefitsToSalaries-body-3 div"],
    ["salariesBenefitsIncludingOutsourcedEmployees", expenseData, "#salariesBenefitsIncludingOutsourcedEmployees-body-3 div"],
    ["cashExpendituresPerGivingUnit", expenseData, "#cashExpendituresPerGivingUnit-body-3 div"],
    
  ];

  // Get the selected years to access the benchmark data
  const selectedYears = getSelectedYearsFromLocalStorage();
  
  if (!selectedYears || selectedYears.length === 0) {
    return;
  }

  // Use the first available year to get benchmark paragraph data
  const targetYear = selectedYears[0];

  benchmarkFields.forEach(([fieldName, dataSource, selector]) => {
    try {
      const targetElement = document.querySelector(selector);
      
      if (!targetElement) {
        // console.warn(`Element not found for selector: ${selector}`);
        return;
      }

      if (!dataSource) {
        console.warn(`Data source not available for field: ${fieldName}`);
        return;
      }

      const benchmarkKey = `${fieldName}_benchmarkParagraph`;
      const benchmarkData = dataSource[benchmarkKey];

      if (!benchmarkData || !benchmarkData[targetYear]) {
        // console.warn(`Benchmark data not found for field: ${fieldName}, year: ${targetYear}`);
        return;
      }

      let benchmarkContent = benchmarkData[targetYear].value;

      if (!benchmarkContent || benchmarkContent === '0') {
        // console.warn(`No benchmark content for field: ${fieldName}`);
        return;
      }

      // Process the HTML content to add mb-2 class to p tags
      benchmarkContent = addMb2ClassToPTags(benchmarkContent);

      // Set the innerHTML of the target element
      targetElement.innerHTML = benchmarkContent;

    } catch (error) {
      console.error(`Error processing benchmark paragraph for ${fieldName}:`, error);
    }
  });
}

/**
 * Add 'mb-2' class to all <p> tags in HTML content and wrap text after <br/> in <p> tags
 * @param {string} htmlContent - The HTML content string
 * @returns {string} - HTML content with mb-2 class added to p tags and text after br wrapped in p tags
 */
function addMb2ClassToPTags(htmlContent) {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Process the content to handle <br/> tags and unwrapped text
  processContentNodes(tempDiv);

  // Find all p tags and add appropriate classes
  const pTags = tempDiv.querySelectorAll('p');
  pTags.forEach(p => {
    applyParagraphStyling(p);
  });

  return tempDiv.innerHTML;
}

/**
 * Process all content nodes to handle <br/> tags and wrap unwrapped text
 * @param {HTMLElement} container - The container element
 */
function processContentNodes(container) {
  const nodes = Array.from(container.childNodes);
  const newNodes = [];
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'p') {
      // Handle paragraphs that might contain <br/> tags
      const processedP = processParagraphWithBr(node);
      newNodes.push(...processedP);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'br') {
      // Skip <br/> tags as they will be handled by splitting
      continue;
    } else if (node.nodeType === Node.TEXT_NODE) {
      // Wrap standalone text nodes in <p> tags
      const text = node.textContent.trim();
      if (text) {
        const newP = document.createElement('p');
        newP.textContent = text;
        newNodes.push(newP);
      }
    } else {
      // Keep other elements as-is
      newNodes.push(node);
    }
  }
  
  // Clear the container and add processed nodes
  container.innerHTML = '';
  newNodes.forEach(node => container.appendChild(node));
}

/**
 * Process a paragraph that might contain <br/> tags
 * @param {HTMLElement} pElement - The paragraph element
 * @returns {Array} - Array of processed paragraph elements
 */
function processParagraphWithBr(pElement) {
  const content = pElement.innerHTML;
  
  // Check if the paragraph contains <br/> tags
  if (content.includes('<br') || content.includes('<BR')) {
    // Split by <br/> tags and create separate paragraphs
    const parts = content.split(/<br\s*\/?>/gi);
    const paragraphs = [];
    
    parts.forEach(part => {
      const trimmedPart = part.trim();
      if (trimmedPart) {
        const newP = document.createElement('p');
        newP.innerHTML = trimmedPart;
        // Preserve original classes
        newP.className = pElement.className;
        paragraphs.push(newP);
      }
    });
    
    return paragraphs;
  } else {
    // Return the original paragraph if no <br/> tags
    return [pElement];
  }
}

/**
 * Apply consistent styling to paragraph elements
 * @param {HTMLElement} pElement - The paragraph element to style
 */
function applyParagraphStyling(pElement) {
  const standardClasses = 'mb-2 text-gray-500 dark:text-gray-400';
  
  // Check if the p tag already has classes
  const existingClasses = pElement.className.trim();
  
  if (existingClasses) {
    // Parse existing classes
    const classArray = existingClasses.split(/\s+/);
    const newClasses = [];
    
    // Add mb-2 if not present
    if (!classArray.includes('mb-2')) {
      newClasses.push('mb-2');
    }
    
    // Add text color classes if not present
    if (!classArray.some(cls => cls.includes('text-gray-500'))) {
      newClasses.push('text-gray-500');
    }
    
    if (!classArray.some(cls => cls.includes('dark:text-gray-400'))) {
      newClasses.push('dark:text-gray-400');
    }
    
    // Combine existing and new classes
    if (newClasses.length > 0) {
      pElement.className = `${newClasses.join(' ')} ${existingClasses}`;
    }
  } else {
    // Add standard classes if no existing classes
    pElement.className = standardClasses;
  }
}