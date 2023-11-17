const displayReportComponent = () => {

  const savedData = JSON.parse(localStorage.getItem('enrollmentData'));
  const selectedYears = getSelectedYearsFromLocalStorage();

  displayDataToReport(savedData, selectedYears);

  closeSidebarAfterSelectingOption('report');
};

const displayDataToReport = (data, selectedYears) => {
  if (data && selectedYears) {
    addYearColumnsToReportTables(selectedYears);
  }
};

const addYearColumnsToReportTables = (years) => {
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
      addTableColumnsToReport(idName, years);
    });
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
  clearColumnsFromOtherRows(idName, columnsToPreserve);
};

const clearColumnsFromOtherRows = (idName, columnsToPreserve) => {
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


