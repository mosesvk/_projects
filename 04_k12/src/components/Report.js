const displayReportComponent = () => {
  const enrollmentData = JSON.parse(localStorage.getItem('enrollmentData'));
  const cashData = JSON.parse(localStorage.getItem('cashData'));
  const assetData = JSON.parse(localStorage.getItem('assetData'));
  const debtData = JSON.parse(localStorage.getItem('debtData'));
  const incomeData = JSON.parse(localStorage.getItem('incomeData'));
  const expenseData = JSON.parse(localStorage.getItem('expenseData'));
  const selectedYears = getSelectedYearsFromLocalStorage();

  if (selectedYears) {
    addYearColumnsToReportTable(selectedYears);
    insertDataToReport(enrollmentData, selectedYears, [
      ['studentAverageEnrollment', 'num', 0, null, null, 6, 'begin', null],
      ['studentAverageEnrollment_PercentChange', 'percent', 0],
      ['studentAverageEnrollment_Average', 'num', 0],
      ['studentAverageEnrollment_Peak', 'num', 0, null, null, 10, null, null],
      ['studentFacilityRatio', 'percent', 1, 'wa', null, 14, null, null]
    ]);

    insertDataToReport(cashData, selectedYears, [
      ['expendableReserves_inDays', 'num', 0, 'wa', 'cb', 18, null, null],
      ['expendableReserves_Percent', 'percent', 0, 'wa', 'cb', 22, null, null],
      ['daysCashOnHand', 'num', 0, 'wa',  null, 30, null, null],
      ['cashAvailableDeferred', 'num', 2, 'wa', null, 26, null, null],
      ['liquidityRatio', 'num', 1, 'wa', 'cb', 34, null, null],
      ['netCashUsedOperating_asPerStatementCash', 'dollar', 0, null, null, 38, null, null],
      ['netCashUsedOperating_depreciation', 'dollar', 0, null, null, 42, null, null], 
    ]);

    insertDataToReport(assetData, selectedYears, [
      ['propertyEquipmentPerStudent', 'dollar', 0, 'wa', null, 46, null, null],
      ['netTuitionARasPercentCurrentAssets', 'percent', 1, 'wa', null, 50, null, null],
      ['receivableWriteOffsAsPercentNetTuitionAndFees', 'percent', 1, 'wa', null, 54, null, null],
      ['receivableWriteOffsAsPercentNetTuitionAndFees_Percent', 'percent', 1],  
    ]);

    insertDataToReport(debtData, selectedYears, [
      ['debtToPropertyAndEquipment', 'num', 1, 'wa', null, 58, null, null],
      ['debtToNetAssets', 'num', 1, 'wa', null, 62, null, null],
      ['currentRatio', 'num', 1, 'wa', 'cb', 66, null, null], 
      ['currentLiabilitiesToAvailableNetAssets', 'num', 1, 'wa', 'cb', 70, null, null],
      ['debtPerStudent', 'num', 0, 'wa', null, 74, null, null],
      ['debtCoverage', 'num', 1, 'wa', null, 78, null, null],
    ]);

    insertDataToReport(incomeData, selectedYears, [
      ['netIncomeRatio', 'num', 2, 'wa', 'cb', 82, null, null], 
      ['netIncomeRatioExcludingDepreciation', 'num', 2, 'wa', 'cb', 86, null, null],
      ['percentAverageTuitionIncreaseBetweenYears', 'percent', 0, null, 'cb'],
      ['financialAssistanceAsPercentTuitionAndFees', 'percent', 1, 'wa', null, 90, null, null],
      ['tuitionAndFeesAsPercentTotalIncome', 'percent', 0, 'wa', null, 94, null, null],
      ['contributionsAsAPercentOfTotalIncome', 'percent', 0, 'wa', null, 98, null, null],
      ['grossTuition' , 'dollar', 0, 'wa', null, 102, null, null],
      ['grossTuition_Percent', 'percent', 0],
      ['totalFinancialAssistance', 'dollar', 0, 'wa', null, 106, null, null],
      ['totalFinancialAssistance_Percent', 'percent', 0],
      ['netTuition', 'dollar', 0, 'wa', null, 110, null, null],
      ['netTuition_Percent', 'percent', 0],
      ['feesPercentOfNetTuition', 'percent', 1, 'wa', null, 114, null, null],
    ])

    insertDataToReport(expenseData, selectedYears, [
      ['salariesBenefitsTeachersAsPercentNetTuition_Salaries', 'percent', 0, 'wa', null, 118, null, null],
      ['salariesBenefitsTeachersAsPercentNetTuition_Benefits', 'percent', 0, 'wa', null, 122, null, null], 
      ['salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits', 'percent', 0, 'wa', null, 126, null, null],
      ['salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries', 'dollar', 0, 'wa', null, 130, null, null],
      ['salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits', 'dollar', 0, 'wa', null , 134, null, null],
      ['salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits', 'dollar', 0, 'wa', null, 138, null, null],
      ['personnelMandatoryDebtService_SalariesAndBenefits_Teachers', 'percent', 0, 'wa', null, 142, null, null],
      ['personnelMandatoryDebtService_SalariesAndBenefits_Administration', 'percent', 0, 'wa', null, 146, null, null],
      ['personnelMandatoryDebtService_SalariesAndBenefits_Employees', 'percent', 0, 'wa', null, 150, null, null],
      ['personnelMandatoryDebtService_Mandatory', 'percent', 0, 'wa', null, 154, null, null],
      ['personnelMandatoryDebtService_Personnel', 'percent', 0, 'wa', null, 158, null, null],
      ['percentFundRaisingExpensesExceeding', 'percent', 0, 'wa', null, 162, null, null],
      ['fundsExpensesPerStudent_FundsRaised', 'dollar', 0, 'wa', null, 166, null, null],
      ['fundsExpensesPerStudent_CashExpensesExcludingDepreciation', 'dollar', 0, 'wa', null, 170, null, null],
      ['fundsExpensesPerStudent_netTuition', 'dollar', 0, 'wa', null, 174, null, null],
      ['fundsExpensesPerStudent_cashExpensesExcessNetTuition', 'dollar', 0, 'wa', null, 178, null, null],
      ['fundsExpensesPerStudent_FundsRaisedOverUnder', 'dollar', 0, 'wa', null, 182, null, null],
    ])
  }
  
  closeSidebarAfterSelectingOption('report');
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
  fId, 
  begin, 
  end
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
        data,
        null,
        null,
        null
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
    fId,
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
    
    const text = Number(client[year].value) !== 0 ? styleNumber(client[year].value, type, fixedNum) : '-';

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
  const text = Number(client[year].value) !== 0 ? styleNumber(client[year].value, type, fixedNum) : '-';
  
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
  fId,
  begin,
  end
) => {
  
  const propClass =
  "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";
  
  const dataPointAvg = document.createElement("th");

  /** Report rows where peer benchmark columns (Avg, 25%, 50%, 75%) are intentionally blank. */
  const peerBlankPeerColumnsNames = new Set([
    "studentAverageEnrollment_PercentChange",
    "receivableWriteOffsAsPercentNetTuitionAndFees_Percent",
  ]);

  /** Peer objects from JSON use string keys; modal passes year as number or string. */
  const peerLookupKey =
    dataArray === "total" || dataArray == null ? dataArray : String(dataArray);
  const peerArr =
    peer && peer[peerLookupKey] != null ? peer[peerLookupKey] : [];

  // Year key for per-year modal rows; undefined for the report's total column.
  const yearKey = dataArray !== "total" ? String(dataArray) : undefined;

  let avg;

  if (
    name === "expendableReserves_inDays" ||
    name === "expendableReserves_Percent"
  ) {
    // These ratios use a simple average of pre-computed peer values (not a WA formula).
    avg = parseFloat(getAverageOfArray(peerArr));
  } else if (peer && wa) {
    const w = getWeightedAverageOfArray(data, name, yearKey);
    avg = w != null && Number.isFinite(Number(w)) ? Number(w) : 0;
  } else if (peer && !wa) {
    avg = parseFloat(getAverageOfArray(peerArr));
  } else {
    avg = 0;
  }

  // console.log({ tableRow, peer, type, fixedNum, dataArray, wa, data, name, avg });
  const mid = peer ? parseFloat(getMidpointOfArray(peerArr)) : '';
  const min = peer ? parseFloat(get25thPercentileOfArray(peerArr)) : '';
  const max = peer ? parseFloat(get75thPercentileOfArray(peerArr)) : '';
  const safeNum = (n) => (Number.isFinite(n) ? styleNumber(n, type, fixedNum) : '-');
  let textAvg = peer ? safeNum(avg) : '-';
  const dataPointMid = document.createElement("th");
  let textMid = safeNum(mid);
  const dataPointMin = document.createElement("th");
  let textMin = safeNum(min);
  const dataPointMax = document.createElement("th");
  let textMax = safeNum(max);

  if (peerBlankPeerColumnsNames.has(name)) {
    textAvg = '';
    textMid = '';
    textMin = '';
    textMax = '';
  }

  // console.log({ tableRow, fixedNum, avg, mid, min, textMin, max, textMax });

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

  if (fId) createFileForPrint(name, fId, begin, end, textAvg, textMid, textMin, textMax, peer, data);
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