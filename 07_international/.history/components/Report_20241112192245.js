const displayReportComponent = () => {
  const generalData = JSON.parse(localStorage.getItem("generalData"));
  const cashData = JSON.parse(localStorage.getItem("cashData"));
  const assetData = JSON.parse(localStorage.getItem("assetData"));
  const incomeData = JSON.parse(localStorage.getItem("incomeData"));
  const expenseData = JSON.parse(localStorage.getItem("expenseData"));
  const miscData = JSON.parse(localStorage.getItem("miscData"));

  const selectedYears = getSelectedYearsFromLocalStorage();

  if (selectedYears) {
    addYearColumnsToReportTable(selectedYears);
    insertDataToReport(generalData, selectedYears, [
      ["givingUnits", "num", 0],
      ["missionaryUnit", "num", 0],
      ["numberOfEmployeesFTE", "num", 0],
      ["itExpenses", "dollar", 0, null, null, [6, 44, 82, 120], "begin", null],
    ]);

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
        "wa",
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
        0,
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

    processTHElements();
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
      name[4],
      name[5],
      name[6],
      name[7]
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
  cb,
  fIdArray,
  begin,
  end
) => {
  if (name == "percentWithoutDR_excludingPPE" || name == "netIncomeRatio") console.log({ selectedYears, name, client, peer, type, fixedNum });
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
    data,
    fIdArray,
    begin,
    end
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
    "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
  const propScope = "row";

  selectedYears.forEach((year) => {
    const dataPoint = document.createElement("th");

    // console.log({client, tableRow, year, type, fixedNum, dataPoint})

    const text =
      Number(client[year].value) !== 0
        ? styleNumber(client[year].value, type, fixedNum)
        : "-";

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
  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPoint = document.createElement("th");
  const text =
    Number(client[year].value) !== 0
      ? styleNumber(client[year].value, type, fixedNum)
      : "-";

  // console.log({ tableModalRow, year, client, type, fixedNum, dataPoint, text });

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
  data,
  fIdArray,
  begin,
  end
) => {
  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPointAvg = document.createElement("th");

  let avg;
  if (peer && wa) {
    avg = parseFloat(getWeightedAverageOfArray(data, name));
  } else if (peer && !wa) {
    avg = parseFloat(getAverageOfArray(peer[dataArray], name));
  } else {
    avg = 0;
  }

  // Ensure avg is not NaN
  if (isNaN(avg)) {
    avg = 0;
  }

  if (name == "netIncomeRatio")
    console.log(name, {
      tableRow,
      fIdArray,
      peerDataArray: peer[dataArray],
      type,
      fixedNum,
      peer,
      dataArray,
      wa,
      data,
      avg,
    });

  if (peer) {
    const [q1, median, q3] = calculatePercentiles(peer[dataArray], type, fixedNum);

    // if (name == "fundraisingAsPercentOfContributions") {
    //   console.log(name, { q1, median, q3 });
    // }
  }

  const textAvg = peer ? styleNumber(avg, type, fixedNum) : "";
  const dataPointMid = document.createElement("th");
  const mid = peer ? parseFloat(getMidpointOfArray(peer[dataArray])) : "";
  // console.log('mid', mid);
  const textMid = styleNumber(mid, type, fixedNum);
  const dataPointMin = document.createElement("th");
  let min;
  if (name == "netIncomeRatio") {
    min = peer
      ? parseFloat(get25thPercentileOfArray(peer[dataArray], name))
      : "";
  } else {
    min = peer ? parseFloat(get25thPercentileOfArray(peer[dataArray])) : "";
  }
  // if (name == 'daysCashOnHand') console.log('daysCashOnHand', {min, peerArray: peer[dataArray], type, fixedNum})
  const textMin = styleNumber(min, type, fixedNum);
  const dataPointMax = document.createElement("th");
  const max = peer ? parseFloat(get75thPercentileOfArray(peer[dataArray])) : "";
  const textMax = styleNumber(max, type, fixedNum);

  // console.log(name, { tableRow, fixedNum, wa, avg, mid, min, textMin, max, textMax, peer, dataArray });

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

  if (fIdArray) createFileForPrint(name, fIdArray, begin, end, avg, mid, min, max, peer, data);
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
    newTh.setAttribute("class", "px-6 py-3 text-xl");
    newTh.innerText = year;

    // Insert the new <th> element before the "avg" <th>
    tableHeaderRow.insertBefore(newTh, avgTh);
  });
};

const clearTableColumns = (idName) => {
  const headerRow = document.getElementById(idName);
  const columnsToPreserve = ["Avg", "25%", "50%", "75%"];

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
  const rows = document.querySelectorAll("tr[id]");

  rows.forEach((row) => {
    // Select all <th> elements inside the current <tr>
    const thElements = row.querySelectorAll("th");

    thElements.forEach((th) => {
      // Check if the <th> has a <div> child
      const divChild = th.querySelector("div");
      if (divChild) {
        // If <th> has a <div> child, find the <span> inside it
        const spanChild = divChild.querySelector("span");
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
          const pTags = th.querySelectorAll("p");
          pTags.forEach((p) => {
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
