const displayReportComponent = () => {

  const savedData = JSON.parse(localStorage.getItem('enrollmentData'));
  const selectedYears = getSelectedYearsFromLocalStorage();

  insertDataToReport(savedData, selectedYears);

  closeSidebarAfterSelectingOption('report');
};

const insertDataToReport = (data, selectedYears) => {
  if (data && selectedYears) {
    addYearColumnsToReportTable(selectedYears);
  }
};

const addDataToEveryRow = (data, selectedYears, arrayOfNames) => {
  console.log(data);
  for (let name of arrayOfNames) {
    addToSingleRow(selectedYears, name, data[`${name}_Client`], data[`${name}_Peer`])
  }

  
}

const addToSingleRow = (selectedYears, name, client, peer) => {
  console.log(name, client, peer);
  const tableRow = document.getElementById(`row_${name}`)

}

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
  Array.from(headerRow.children).slice(1).forEach((th) => {
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
    Array.from(row.children).slice(1).forEach((td) => {
      const columnName = td.textContent.trim();
      if (!columnsToPreserve.includes(columnName)) {
        td.remove();
      }
    });
  });
};


