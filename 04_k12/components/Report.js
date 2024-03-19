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
      ['propertyEquipmentPerStudent', 'num', 0],
      ['netTuitionARasPercentCurrentAssets', 'num', 2],
      ['receivableWriteOffsAsPercentNetTuitionAndFees', 'percent', 0],
      ['receivableWriteOffsAsPercentNetTuitionAndFees_Percent', 'percent', 2]
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
      name[3]
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
  wa
) => {
  // console.log({selectedYears, name, client, peer, type, fixedNum});
  const tableReportRow = document.getElementById(`row_${name}`);
  // console.log(`row_${name}`);
  // console.log('tableReportRow', tableReportRow);

  while (tableReportRow.children.length > 1) {
    tableReportRow.removeChild(tableReportRow.children[1]);
  }

  selectedYears.forEach((year) => {
    const tableModalRow = document.getElementById(`${name}_modal_${year}`);

    if (tableModalRow) {
      // console.log('tableModalRow', `${name}_modal_${year}`,tableModalRow);

      addClientDataToModalRow(tableModalRow, year, client, type, fixedNum);
      addPeerDataToRow(tableModalRow, peer, type, fixedNum, year, wa, name, data);
    }
  });

  addClientDataToReportRow(
    tableReportRow,
    selectedYears,
    client,
    type,
    fixedNum 
  );
  addPeerDataToRow(
    tableReportRow,
    peer,
    type,
    fixedNum,
    'total',
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
  fixedNum
) => {
  const propClass =
    'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white';
  const propScope = 'row';

  selectedYears.forEach((year) => {
    const dataPoint = document.createElement('th');
    const text = styleNumber(client[year].value, type, fixedNum);

    dataPoint.className = propClass;
    dataPoint.scope = propScope;
    dataPoint.textContent = text;

    tableRow.appendChild(dataPoint);
  });
};

const addClientDataToModalRow = (
  tableModalRow,
  year,
  client,
  type,
  fixedNum
) => {
  const propClass =
    'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white';
  const propScope = 'row';

  const dataPoint = document.createElement('th');
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
  // console.log({ tableRow, peer, type, fixedNum, dataArray, wa, data });

  const propClass =
    'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white';
  const propScope = 'row';

  const dataPointAvg = document.createElement('th');

  let avg;
  if (peer && wa) {
    avg = getWeightedAverageOfArray(data, name);
  } else if (peer && !wa) {
    avg = getAverageOfArray(peer[dataArray]);
  } else {
    avg = 0;
  }

  // console.log(peer[dataArray]);

  const textAvg = styleNumber(avg, type, fixedNum);
  const dataPointMid = document.createElement('th');
  const mid = peer ? getMidpointOfArray(peer[dataArray]) : 0;
  const textMid = styleNumber(mid, type, fixedNum);
  const dataPointMin = document.createElement('th');
  const min = peer ? getMinOfArray(peer[dataArray]) : 0;
  const textMin = styleNumber(min, type, fixedNum);
  const dataPointMax = document.createElement('th');
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
  const tables = document.querySelectorAll('table');
  // console.log(tables);

  tables.forEach((table) => {
    // console.log(table);
    const trElements = table.querySelectorAll('tr');
    const trIds = Array.from(trElements)
      .map((tr) => tr.getAttribute('id'))
      .filter((id) => id && id.endsWith('_tableHeader'));

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
    const newTh = document.createElement('th');
    newTh.setAttribute('scope', 'col');
    newTh.setAttribute('class', 'px-6 py-3');
    newTh.innerText = year;

    // Insert the new <th> element before the "avg" <th>
    tableHeaderRow.insertBefore(newTh, avgTh);
  });
};

const clearTableColumns = (idName) => {
  const headerRow = document.getElementById(idName);
  const columnsToPreserve = ['Avg', 'Mid', 'Min', 'Max'];

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
