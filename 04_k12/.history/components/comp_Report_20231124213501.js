const displayReportComponent = () => {
  const savedData = JSON.parse(localStorage.getItem('enrollmentData'));
  const selectedYears = getSelectedYearsFromLocalStorage();

  addYearColumnsToReportTable(selectedYears);
  insertDataToReport(savedData, selectedYears);

  closeSidebarAfterSelectingOption('report');
};

const insertDataToReport = (data, selectedYears) => {
  if (data && selectedYears) {
    addTotalDataToEveryRow(data, selectedYears, [
      ['studentsAverageEnrollment', 'num', 0],
      ['studentsAverageEnrollment_PercentChange', 'percent', 1],
      ['studentsAverageEnrollment_Average', 'num', 0],
      ['studentsAverageEnrollment_Peak', 'num', 0],
      ['studentsFacilityRatio', 'num', 1]
    ]);
  }
};

const addTotalDataToEveryRow = (data, selectedYears, arrayOfNames) => {
  // console.log(data);
  for (let name of arrayOfNames) {
    addToSingleRow(
      selectedYears,
      name[0],
      data[`${name[0]}_Client`],
      data[`${name[0]}_Peer`],
      name[1],
      name[2]
    );
  }
};

const addToSingleRow = (selectedYears, name, client, peer, type, fixedNum) => {
  // console.log({selectedYears, name, client, peer, type, fixedNum});
  const tableRow = document.getElementById(`row_${name}`);

  while (tableRow.children.length > 1) {
    tableRow.removeChild(tableRow.children[1]);
  }

  addClientDataToRow(tableRow, selectedYears, client, type, fixedNum);
  addPeerDataToRow(tableRow, peer, type, fixedNum);
};

const addClientDataToRow = (
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
    const text = styleNumber(client[year][0], type, fixedNum);

    dataPoint.className = propClass;
    dataPoint.scope = propScope;
    dataPoint.textContent = text;

    tableRow.appendChild(dataPoint);
  });
};

const addPeerDataToRow = (tableRow, peer, type, fixedNum) => {
  const propClass =
    'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white';
  const propScope = 'row';

  const dataPointAvg = document.createElement('th');
  const avg = peer.hasOwnProperty('total') ? getAverageOfArray(peer['total']) : 0
  const textAvg = styleNumber(avg, type, fixedNum);
  const dataPointMid = document.createElement('th');
  const mid = peer.hasOwnProperty('total')  ? getMidpointOfArray(peer['total']) : 0
  const textMid = styleNumber(mid, type, fixedNum);
  const dataPointMin = document.createElement('th');
  const min = peer.hasOwnProperty('total')  ? getMinOfArray(peer['total']) : 0
  const textMin = styleNumber(min, type, fixedNum);
  const dataPointMax = document.createElement('th');
  const max = peer.hasOwnProperty('total')  ? getMaxOfArray(peer['total']) : 0
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

  tables.forEach((table) => {
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
