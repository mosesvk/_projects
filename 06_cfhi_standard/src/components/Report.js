const displayReportComponent = () => {
  const generalData = JSON.parse(localStorage.getItem("generalData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  const debtData = JSON.parse(localStorage.getItem("debtData"));
  const incomeData = JSON.parse(localStorage.getItem("incomeData"));
  const expenseData = JSON.parse(localStorage.getItem("expenseData"));

  // Get selected years - ensure we get the most up-to-date version
  let selectedYears = getSelectedYearsFromLocalStorage();
  
  // Validate and ensure selectedYears is an array
  if (!Array.isArray(selectedYears)) {
    // console.warn("selectedYears is not an array, converting:", selectedYears);
    selectedYears = [];
  }
  
  // Sort years to ensure consistent ordering
  if (selectedYears && selectedYears.length > 0) {
    selectedYears = selectedYears.sort((a, b) => a - b);
  }

  if (selectedYears && selectedYears.length > 0) {
    // addYearColumnsToReportTable will call clearTableColumns to clear year columns
    // while preserving benchmark columns (Avg, 25th, 50th, 75th)
    addYearColumnsToReportTable(selectedYears);
    insertDataToReport(generalData, selectedYears, [
      ["givingUnits", "num", 0],
      ["givingUnits_percentChange", "percent", 0],
      ["contributionsWithoutDonorExcludingLargeGifts", "dollar", 0],
      ["totalContributionsExclude", "dollar", 0],
    ]);
    insertDataToReport(cashData, selectedYears, [
      ["daysOperatingCash", "num", 0, "wa", 'cb'],
      ["netCashAvailability", "dollar", 0, null, 'cb'],
      ["netCashAvailability_standard", "dollar", 0],
    ]);
    insertDataToReport(debtData, selectedYears, [
      ["debtToContributionsWithout", "num", 1, "wa", 'cb'],
      ["debtPerGivingUnit", "dollar", 0, "wa", 'cb'],
      ["contributionsWithoutDonorPerGivingUnit_standard", "dollar", 0],
    ]);

    checkForCountyDataIncomeTable(
      "localCounty",
      "localCountyName_Client",
      "localCountyMedianHouseholdIncome_Client",
      "localCountyPerGivingUnit_Client",
      selectedYears,
    );

    insertDataToReport(incomeData, selectedYears, [
      ["contributionsWithoutDonorPerGivingUnit", "dollar", 0, "wa"],
      ["contributionsWithoutDonorPerGivingUnit_percentChange", "percent", 0, null, 'cb'],
      ["totalContributionsPerGivingUnit", "dollar", 0, "wa", 'cb'],
      ["totalContributionsPerGivingUnit_percentChange", "percent", 0, null, 'cb'],
    ])

    insertDataToReport(expenseData, selectedYears, [
      ["cashExpendituresPerGivingUnit", "dollar", 0, "wa"],
      ["personnelIncludingToTotalCashExpenditures", "percent", 0, "wa", 'cb'],
    ])

    // Process benchmark paragraphs and set up click handlers (async)
    processBenchmarkParagraphs().then(() => {
      // Set up click handlers for fields with hardcoded benchmark text
      // These fields may not have benchmark paragraph data in localStorage
      // but still need click handlers to show modals with hardcoded text
      if (typeof createBenchmark === 'function') {
        // PercentChange fields use hardcoded "Good: Improving Trend" text
        createBenchmark("Good: Improving Trend", "incomeData", "row_contributionsWithoutDonorPerGivingUnit_percentChange");
        createBenchmark("Good: Improving Trend", "incomeData", "row_totalContributionsPerGivingUnit_percentChange");
        
        // personnelIncludingToTotalCashExpenditures uses hardcoded benchmark text
        createBenchmark("Good: 40-55% | Warning: 35-40% or 55-59% | Action: < 35% or > 59%", "expenseData", "row_personnelIncludingToTotalCashExpenditures");
      }
    }).catch(error => {
      console.error("Error processing benchmark paragraphs:", error);
    });
  }

  processTHElements();
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
    const clientKey = `${name[0]}_Client`;
    const peerKey = `${name[0]}_Peer`;
    const client = data[clientKey] || null;
    const peer = data[peerKey] || null;
    
    addToSingleRow(
      selectedYears,
      name[0],
      data,
      client,
      peer,
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
      addPeerDataToRow(
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
    
    // Get value from client data, or null if missing - styleNumber handles null as 0
    const value = (client && client[year] && client[year].value !== undefined) ? client[year].value : null;
    // Always call styleNumber - it handles null/NaN/empty and formats as 0 based on type
    const text = styleNumber(value, type, fixedNum);

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

    // console.log(clientBenchmarkArray, tableRow);

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
  // console.log({ tableModalRow, year, client, type, fixedNum });

  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPoint = document.createElement("th");
  
  // Get value from client data, or null if missing - styleNumber handles null as 0
  const value = (client && client[year] && client[year].value !== undefined) ? client[year].value : null;
  // Always call styleNumber - it handles null/NaN/empty and formats as 0 based on type
  const text = styleNumber(value, type, fixedNum);

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
  // console.log({ tableRow, peer, type, fixedNum, dataArray, wa, data, name });
  // personnelToCashExpenditure
  // personnelIncludingToTotalCashExpenditures

  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPointAvg = document.createElement("th");

  // Check if this field should not have peer data calculated
  const shouldSkipPeerData = name.endsWith('_percentChange');

  let avg, mid, min, max;
  let textAvg, textMid, textMin, textMax;

  if (shouldSkipPeerData) {
    // For _percentChange fields, set peer data to blank
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
    } else if (peer && peer[dataArray] && !wa) {
      avg = getAverageOfArray(peer[dataArray], name);
    } else {
      avg = 0;
    }
    
    textAvg = peer ? styleNumber(avg, type, fixedNum) : '';
    
    // Use 25th percentile instead of Min (matching comp project)
    min = peer && peer[dataArray] ? get25thPercentileOfArray(peer[dataArray], name) : '';
    textMin = styleNumber(min, type, fixedNum);
    
    // Use 50th percentile (median/midpoint) 
    mid = peer && peer[dataArray] ? getMidpointOfArray(peer[dataArray], name) : '';
    textMid = styleNumber(mid, type, fixedNum);
    
    // Use 75th percentile instead of Max (matching comp project)
    max = peer && peer[dataArray] ? get75thPercentileOfArray(peer[dataArray], name) : '';
    textMax = styleNumber(max, type, fixedNum);
  }

  dataPointAvg.className = propClass;
  dataPointAvg.scope = propScope;
  dataPointAvg.textContent = textAvg;
  tableRow.appendChild(dataPointAvg);

  const dataPoint25th = document.createElement("th");
  dataPoint25th.className = propClass;
  dataPoint25th.scope = propScope;
  dataPoint25th.textContent = textMin;
  tableRow.appendChild(dataPoint25th);

  const dataPoint50th = document.createElement("th");
  dataPoint50th.className = propClass;
  dataPoint50th.scope = propScope;
  dataPoint50th.textContent = textMid;
  tableRow.appendChild(dataPoint50th);

  const dataPoint75th = document.createElement("th");
  dataPoint75th.className = propClass;
  dataPoint75th.scope = propScope;
  dataPoint75th.textContent = textMax;
  tableRow.appendChild(dataPoint75th);
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

  // Find the "avg" <th> element by text content (not by index, in case clearing didn't work perfectly)
  let avgTh = null;
  Array.from(tableHeaderRow.children).forEach((th) => {
    if (th.textContent.trim() === "Avg") {
      avgTh = th;
    }
  });

  // Fallback to children[1] if "Avg" not found (shouldn't happen, but safety check)
  if (!avgTh && tableHeaderRow.children.length > 1) {
    avgTh = tableHeaderRow.children[1];
  }

  // If still no avgTh found, append to end
  if (!avgTh) {
    // console.warn(`Could not find "Avg" column in ${tableHeader}, appending years to end`);
    yearsArray.forEach((year) => {
      const newTh = document.createElement("th");
      newTh.setAttribute("scope", "col");
      newTh.setAttribute("class", "px-6 py-3");
      newTh.innerText = year;
      tableHeaderRow.appendChild(newTh);
    });
    return;
  }

  // Iterate through the selectedYearArray and add new columns
  yearsArray.forEach((year) => {
    // Check if this year column already exists to avoid duplicates
    let yearExists = false;
    Array.from(tableHeaderRow.children).forEach((th) => {
      if (th.textContent.trim() === String(year)) {
        yearExists = true;
      }
    });

    // Only add if it doesn't already exist
    if (!yearExists) {
      // Create a new <th> element for each selected year
      const newTh = document.createElement("th");
      newTh.setAttribute("scope", "col");
      newTh.setAttribute("class", "px-6 py-3");
      newTh.innerText = year;

      // Insert the new <th> element before the "avg" <th>
      tableHeaderRow.insertBefore(newTh, avgTh);
    }
  });
};

const clearTableColumns = (idName) => {
  const headerRow = document.getElementById(idName);
  if (!headerRow) {
    // console.warn(`Header row not found: ${idName}`);
    return;
  }
  
  const columnsToPreserve = ["Avg", "25th", "50th", "75th"];

  // Create a static copy of all children to avoid live node list issues
  const allColumns = Array.from(headerRow.children);
  
  // Remove all existing th elements except the first one and those to be preserved
  // Work backwards to avoid index shifting issues
  for (let i = allColumns.length - 1; i >= 1; i--) {
    const th = allColumns[i];
    const columnName = th.textContent.trim();
    // Remove if it's not in the preserve list (this includes all year columns)
    if (!columnsToPreserve.includes(columnName)) {
      th.remove();
    }
  }

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

/**
 * Process benchmark paragraphs and display them in modals
 * Based on comp project implementation, adapted for Standard project's 9 metrics
 */
async function processBenchmarkParagraphs() {
  // Get data from localStorage
  const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
  const cashData = JSON.parse(localStorage.getItem("cashData") || "{}");
  const debtData = JSON.parse(localStorage.getItem("debtData") || "{}");
  const incomeData = JSON.parse(localStorage.getItem("incomeData") || "{}");
  const expenseData = JSON.parse(localStorage.getItem("expenseData") || "{}");

  // Array of field mappings for Standard project: [fieldName, dataSource]
  // Note: body-2 sections are populated by createWhatDoesThisMean() in DisplayCharts.js
  // body-3 sections are populated by createBenchmark() in Utility.js
  // This function only sets up click handlers for benchmark modals
  const modalInfoFields = [
    // General data
    ["givingUnits", generalData],
    ["contributionsWithoutDonorExcludingLargeGifts", generalData],
    
    // Cash data
    ["daysOperatingCash", cashData],
    ["netCashAvailability", cashData],
    
    // Debt data
    ["debtToContributionsWithout", debtData],
    ["debtPerGivingUnit", debtData],
    
    // Income data
    ["contributionsWithoutDonorPerGivingUnit", incomeData],
    ["contributionsWithoutDonorPerGivingUnit_percentChange", incomeData],
    ["totalContributionsPerGivingUnit", incomeData],
    ["totalContributionsPerGivingUnit_percentChange", incomeData],
    
    // Expense data
    ["cashExpendituresPerGivingUnit", expenseData],
    ["personnelIncludingToTotalCashExpenditures", expenseData],
  ];

  // Note: We don't need selectedYears here anymore since we're only setting up click handlers
  // The benchmark content is handled by createBenchmark() which is called from DisplayCharts.js

  // Process all fields and set up click handlers (using Promise.all to handle async)
  // Note: We don't populate body-2 here - that's handled by createWhatDoesThisMean() in DisplayCharts.js
  // We only set up click handlers for the benchmark modals
  const setupPromises = modalInfoFields.map(async ([fieldName, dataSource]) => {
    try {
      // Determine data category based on dataSource (needed for click handler)
      let dataCategory;
      if (dataSource === generalData) {
        dataCategory = "generalData";
      } else if (dataSource === cashData) {
        dataCategory = "cashData";
      } else if (dataSource === debtData) {
        dataCategory = "debtData";
      } else if (dataSource === incomeData) {
        dataCategory = "incomeData";
      } else if (dataSource === expenseData) {
        dataCategory = "expenseData";
      }

      // Set up click handler on the row element (e.g., "row_daysOperatingCash")
      const rowElementId = `row_${fieldName}`;
      if (dataCategory && typeof addClickEventToBenchmark === 'function') {
        await addClickEventToBenchmark(rowElementId, fieldName, dataCategory);
      }

    } catch (error) {
      // console.error(`Error setting up click handler for ${fieldName}:`, error);
    }
  });

  // Wait for all click handlers to be set up
  await Promise.all(setupPromises);
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