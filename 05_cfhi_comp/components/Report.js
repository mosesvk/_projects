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
      ["averageAdultAttendees", "num", 0],
      ["totalAttendees", "num", 0],
      ["fullTimeEquivalent", "num", 0],
      ["attendeesToStaff", "num", 1, "wa", "cb"],
      ["contributionsWithoutDonorExcludingLargeGifts", "dollar", 0],
      ["totalContributionsExclude", "dollar", 0],
      ["totalContributionOnline", "dollar", 0],
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
      ["netCashAvailability", "dollar", 0, "wa", "cb"],
      ["netCashAvailability_including", "dollar", 0, "wa"],
      ["netCashAvailability_standard", "dollar", 0, "wa"],
    ]);
    insertDataToReport(debtData, selectedYears, [
      ["debtToContributionsWithout", "num", 0, "wa", "cb"],
      ["currentRatio", "num", 0, "wa", "cb"],
      ["mandatoryDebtServiceToContributionsWithout", "percent", 0, "wa", "cb"],
      ["debtPerAverageAdultAttendee", "dollar", 0, "wa", "cb"],
      ["debtPerAverageAdultAttendee_percentChange", "percent", 0],
      ["debtPerAverageAdultAttendee_standard", "dollar", 0, "wa"],
      ["debtPerGivingUnit", "dollar", 0, "wa", "cb"],
      ["debtPerGivingUnit_percentChange", "percent", 0],
      ["debtPerGivingUnit_standard", "dollar", 0, "wa"],
      ["debtCoverage", "num", 0, "wa", "cb"],
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
      ["contributionsWithoutDonorPerAverageAdultAttendee", "dollar", 0],
      [
        "contributionsWithoutDonorPerAverageAdultAttendee_percentChange",
        "percent",
        0,
        null,
        "cb",
      ],
      ["contributionsWithoutDonorPerGivingUnit", "dollar", 0],
      [
        "contributionsWithoutDonorPerGivingUnit_percentChange",
        "percent",
        0,
        null,
        "cb",
      ],
      ["totalContributionsPerAverageAdultAttendee", "dollar", 0, "wa", "cb"],
      [
        "totalContributionsPerAverageAdultAttendee_percentChange",
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
      ["cashExpendituresPerAvgAdultAttendee", "dollar", 0, "wa"],
      ["cashExpendituresPerAvgAdultAttendee_percentChange", "percent", 0],
      ["cashExpendituresPerGivingUnit", "dollar", 0, "wa"],
      ["cashExpendituresPerGivingUnit_percentChange", "percent", 0],
    ]);

    insertDataToReport(additionalData, selectedYears, [
      ["contributionsPerAccountingFTE", "dollar", 0, "wa"],
      ["expensesPerAccountingFTE", "dollar", 0, "wa"],
      [
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen",
        "percent",
        0,
        "wa",
        "cb",
      ],
      [
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen",
        "percent",
        0,
        "wa",
        "cb",
      ],
      ["facilityCostPerSquareFootExcluding_lessThanTen", "dollar", 2, "wa"],
      ["facilityCostPerSquareFootExcluding_greaterThanTen", "dollar", 2, "wa"],
      ["facilityCostPerSquareFootIncluding_lessThanTen", "dollar", 2, "wa"],
      ["facilityCostPerSquareFootIncluding_greaterThanTen", "dollar", 2, "wa"],
      ["informationTechnologyCostPerFTE", "dollar", 0, "wa"],
    ]);

    processTHElements()
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
  //console.log({ selectedYears, name, client, peer, type, fixedNum });
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
    const text = styleNumber(client[year].value, type, fixedNum);

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
  // console.log({ tableModalRow, year, client, type, fixedNum });

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
  // console.log({ tableRow, peer, type, fixedNum, dataArray, wa, data, name });

  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPointAvg = document.createElement("th");

  let avg;
  if (peer && wa) {
    avg = getWeightedAverageOfArray(data, name);
  } else if (peer && !wa) {
    avg = getAverageOfArray(peer[dataArray], name);
  } else {
    avg = 0;
  }
  
  
  const textAvg = styleNumber(avg, type, fixedNum);
  const dataPointMid = document.createElement("th");
  const mid = peer ? getMidpointOfArray(peer[dataArray]) : 0;
  // console.log('mid', mid);
  const textMid = styleNumber(mid, type, fixedNum);
  const dataPointMin = document.createElement("th");
  const min = peer ? getMinOfArray(peer[dataArray]) : 0;
// if (name == 'totalOutsourcedEmployees') console.log('totalOutsourcedEmployees', {min, peerArray: peer[dataArray]})
  const textMin = styleNumber(min, type, fixedNum);
  const dataPointMax = document.createElement("th");
  const max = peer ? getMaxOfArray(peer[dataArray]) : 0;
  const textMax = styleNumber(max, type, fixedNum);

  dataPointAvg.className = propClass;
  dataPointAvg.scope = propScope;
  dataPointAvg.textContent = textAvg;
  tableRow.appendChild(dataPointAvg);

  dataPointMid.className = propClass;
  dataPointMid.scope = propScope;
  dataPointMid.textContent = textMid;
  tableRow.appendChild(dataPointMid);

  dataPointMin.className = propClass;
  dataPointMin.scope = propScope;
  dataPointMin.textContent = textMin;
  tableRow.appendChild(dataPointMin);

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
    newTh.setAttribute("class", "px-6 py-3");
    newTh.innerText = year;

    // Insert the new <th> element before the "avg" <th>
    tableHeaderRow.insertBefore(newTh, avgTh);
  });
};

const clearTableColumns = (idName) => {
  const headerRow = document.getElementById(idName);
  const columnsToPreserve = ["Avg", "Mid", "Min", "Max"];

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