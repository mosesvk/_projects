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
      ['studentAverageEnrollment', 'num', 0],
      ['studentAverageEnrollment_PercentChange', 'percent', 1],
      ['studentAverageEnrollment_Average', 'num', 0],
      ['studentAverageEnrollment_Peak', 'num', 0],
      ['studentFacilityRatio', 'num', 1, 'wa']
    ]);

    insertDataToReport(cashData, selectedYears, [
      ['expendableReserves_inDays', 'num', 0, 'wa'],
      ['expendableReserves_Percent', 'percent', 0, 'wa'],
      ['daysCashOnHand', 'num', 0, 'wa'],
      // ['cashAvailableDeferred', 'num', 2, 'wa'],
      // ['liquidityRatio', 'num', 1, 'wa'],
      // ['netCashUsedOperating_asPerStatementCash', 'dollar', 0],
      // ['netCashUsedOperating_depreciation', 'dollar', 0]
      ['cashAvailableDeferred', 'num', 2, 'wa'],
      ['liquidityRatio', 'num', 1, 'wa'],
      ['netCashUsedOperating_asPerStatementCash', 'dollar', 0],
      ['netCashUsedOperating_depreciation', 'dollar', 0]
    ]);

    insertDataToReport(assetData, selectedYears, [
      ['propertyEquipmentPerStudent', 'dollar', 0],
      ['netTuitionARasPercentCurrentAssets', 'percent', 0],
      ['receivableWriteOffsAsPercentNetTuitionAndFees', 'percent', 0],
      ['receivableWriteOffsAsPercentNetTuitionAndFees_Percent', 'percent', 1]
    ]);

    insertDataToReport(debtData, selectedYears, [
      ['debtToPropertyAndEquipment', 'num', 2],
      ['debtToNetAssets', 'num', 2],
      ['currentRatio', 'num', 2],
      ['currentLiabilitiesToAvailableNetAssets', 'num', 2],
      ['debtPerStudent', 'num', 0],
      ['debtCoverage', 'num', 2]
    ]);

    insertDataToReport(incomeData, selectedYears, [
      ['netIncomeRatio', 'num', 2, 'wa'], 
      ['netIncomeRatioExcludingDepreciation', 'num', 1, 'wa'],
      ['financialAssistanceAsPercentTuitionAndFees', 'num', 1, 'wa'],
      ['tuitionAndFeesAsPercentTotalIncome', 'num', 1, 'wa'],
      ['contributionsAsAPercentOfTotalIncome', 'percent', 1, 'wa'],
      ['grossTuition' , 'num', 0, 'wa'],
      ['grossTuition_Percent', 'percent', 1],
      // ['financialAssistanceDiscountBased', 'num', 0, 'wa'],
      // ['financialAssistanceDiscountBased_Percent', 'percent', 1],
      // ['scholarshipAwarded', 'num', 0, 'wa'],
      // ['scholarshipAwarded_Percent', 'percent', 1],
      ['totalFinancialAssistance', 'num', 0, 'wa'],
      ['totalFinancialAssistance_Percent', 'percent', 1],
      ['netTuition', 'num', 0, 'wa'],
      ['netTuition_Percent', 'percent', 1],
      ['feesPercentOfNetTuition', 'num', 2, 'wa']
    ])

    insertDataToReport(expenseData, selectedYears, [
      ['salariesBenefitsTeachersAsPercentNetTuition_Salaries', 'num', 2, 'wa'],
      ['salariesBenefitsTeachersAsPercentNetTuition_Benefits', 'num', 2], 
      ['salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits', 'num', 2, 'wa'],
      ['salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries', 'num', 0, 'wa'],
      ['salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits', 'num', 0, 'wa'],
      ['salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits', 'num', 0, 'wa'],
      // ['benefitsPercentSalariesTeachers', 'num', 2, 'wa'],
      ['personnelMandatoryDebtService_SalariesAndBenefits_Teachers', 'num', 1, 'wa'],
      ['personnelMandatoryDebtService_SalariesAndBenefits_Administration', 'num', 1, 'wa'],
      ['personnelMandatoryDebtService_SalariesAndBenefits_Employees', 'num', 1, 'wa'],
      ['personnelMandatoryDebtService_Mandatory', 'num', 1, 'wa'],
      ['personnelMandatoryDebtService_Personnel', 'num', 1, 'wa'],
      ['percentFundRaisingExpensesExceeding', 'percent', 1, 'wa'],
      ['fundsExpensesPerStudent_FundsRaised', 'num', 0, 'wa'],
      ['fundsExpensesPerStudent_CashExpensesExcludingDepreciation', 'num', 0, 'wa'],
      ['fundsExpensesPerStudent_netTuition', 'num', 0, 'wa'],
      ['fundsExpensesPerStudent_cashExpensesExcessNetTuition', 'num', 0, 'wa'],
      ['fundsExpensesPerStudent_FundsRaisedOverUnder', 'num', 0, 'wa'],
      // ['facilityCostExcluding_lessThanTen', 'num', 2],
      // ['facilityCostExcluding_greaterThanTen', 'num', 2],
      // ['facilityCostIncluding_lessThanTen', 'num', 2],
      // ['facilityCostIncluding_greaterThanTen', 'num', 2],
      // ['informationTechnologyCosts', 'num', 2],
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
  data
) => {
  
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

  // console.log({ tableRow, peer, type, fixedNum, dataArray, wa, data, name, avg });
  
  
  const textAvg = peer ? styleNumber(avg, type, fixedNum) : '';
  const dataPointMid = document.createElement("th");
  const mid = peer ? getMidpointOfArray(peer[dataArray]) : '';
  // console.log('mid', mid);
  const textMid = styleNumber(mid, type, fixedNum);
  const dataPointMin = document.createElement("th");
  const min = peer ? get25thPercentileOfArray(peer[dataArray]) : '';
// if (name == 'studentAverageEnrollment') console.log('totalOutsourcedEmployees', {min, peerArray: peer[dataArray]})
  const textMin = styleNumber(min, type, fixedNum);
  const dataPointMax = document.createElement("th");
  const max = peer ? get75thPercentileOfArray(peer[dataArray]) : '';
  const textMax = styleNumber(max, type, fixedNum);

  // console.log({ tableRow, fixedNum, avg, mid, min, max });


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
    newTh.setAttribute("class", "px-6 py-3");
    newTh.innerText = year;

    // Insert the new <th> element before the "avg" <th>
    tableHeaderRow.insertBefore(newTh, avgTh);
  });
};

const clearTableColumns = (idName) => {
  const headerRow = document.getElementById(idName);
  const columnsToPreserve = ["Avg", "50%", "25%", "75%"];

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