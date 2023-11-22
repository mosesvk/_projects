"use strict";

var displayReportComponent = function displayReportComponent() {
  var savedData = JSON.parse(localStorage.getItem('enrollmentData'));
  var selectedYears = getSelectedYearsFromLocalStorage();
  insertDataToReport(savedData, selectedYears);
  closeSidebarAfterSelectingOption('report');
};

var insertDataToReport = function insertDataToReport(data, selectedYears) {
  if (data && selectedYears) {
    addYearColumnsToReportTable(selectedYears);
  }
};

var addDataToEveryRow = function addDataToEveryRow(data, selectedYears, arrayOfNames) {
  console.log(data, selectedYears, arrayOfNames);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arrayOfNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;
      addToSingleRow(selectedYears, name, data["".concat(name, "_Client")], data["".concat(name, "_Peer")]);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var addToSingleRow = function addToSingleRow(selectedYears, name, client, peer) {
  var tableRow = document.getElementById("row_".concat(name));
};

var addYearColumnsToReportTable = function addYearColumnsToReportTable(years) {
  var tables = document.querySelectorAll('table');
  tables.forEach(function (table) {
    var trElements = table.querySelectorAll('tr');
    var trIds = Array.from(trElements).map(function (tr) {
      return tr.getAttribute('id');
    }).filter(function (id) {
      return id && id.endsWith('_tableHeader');
    });
    trIds.forEach(function (idName) {
      // Clear existing columns before adding new ones
      clearTableColumns(idName); // Add new columns to the table

      addSingleNewColumnToReportTable(idName, years);
    });
  });
};

var addSingleNewColumnToReportTable = function addSingleNewColumnToReportTable(tableHeader, yearsArray) {
  // Find the table header row by its ID
  var tableHeaderRow = document.getElementById(tableHeader); // Get the reference to the "avg" <th> element

  var avgTh = tableHeaderRow.children[1]; // const existingColumns = Array.from(tableHeader.children).slice(1
  // console.log(existingColumns);
  // Iterate through the selectedYearArray and add new columns

  yearsArray.forEach(function (year) {
    // Create a new <th> element for each selected year
    var newTh = document.createElement('th');
    newTh.setAttribute('scope', 'col');
    newTh.setAttribute('class', 'px-6 py-3');
    newTh.innerText = year; // Insert the new <th> element before the "avg" <th>

    tableHeaderRow.insertBefore(newTh, avgTh);
  });
};

var clearTableColumns = function clearTableColumns(idName) {
  var headerRow = document.getElementById(idName);
  var columnsToPreserve = ['Avg', 'Mid', 'Min', 'Max']; // Remove all existing th elements except the first one and those to be preserved

  Array.from(headerRow.children).slice(1).forEach(function (th) {
    var columnName = th.textContent.trim();

    if (!columnsToPreserve.includes(columnName)) {
      th.remove();
    }
  }); // Clear corresponding columns from other rows in the table body

  clearColumnsFromOtherRowsInTable(idName, columnsToPreserve);
};

var clearColumnsFromOtherRowsInTable = function clearColumnsFromOtherRowsInTable(idName, columnsToPreserve) {
  var rows = document.querySelectorAll("#".concat(idName, " + tbody tr"));
  rows.forEach(function (row) {
    // Remove all existing td elements except the first one and those to be preserved
    Array.from(row.children).slice(1).forEach(function (td) {
      var columnName = td.textContent.trim();

      if (!columnsToPreserve.includes(columnName)) {
        td.remove();
      }
    });
  });
};