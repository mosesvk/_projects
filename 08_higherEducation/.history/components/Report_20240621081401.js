const displayReportComponent = () => {
  const cfiData = JSON.parse (localStorage.getItem ('cfiData'));

  const selectedYears = getSelectedYearsFromLocalStorage ();

  if (selectedYears) {
    insertDataToReport (
      cfiData,
      selectedYears,
      document.getElementById ('cfiRatio_clientTable'),
      [
        ['cfiRatio', 'num', 1],
        ['cfi_primaryReserveRatio', 'num', 2],
        ['cfi_netIncomeOperationsRatio', 'percent', 1],
        ['cfi_returnOnNetAssets', 'percent', 1],
        ['cfi_viabilityRatio', 'num', 2],
      ]
    );
    insertDataToReport (
      cfiData,
      selectedYears,
      document.getElementById ('primaryReserveRatio_clientTable'),
      [
        ['nonrestrictedNetAssets', 'dollar', 0],
        ['restrictedNetAssets', 'dollar', 0],
        ['propertyAndEquipment', 'dollar', 0],
        ['notesPayable', 'dollar', 0],
        ['cfi_primaryReserveAdjustment', 'num', 1],
        ['totalFunctionalExpenses', 'dollar', 0],
      ]
    );

    insertCalculatedDataToReport (cfiData, selectedYears, [
      ['primaryReserveRatio', 'num', 2],
      ['netIncomeOperationsRatio', 'percent', 1],
      ['returnOnNetAssets', 'percent', 1],
      ['viabilityRatio', 'num', 2],
    ]);

    processTHElements ();
  }

  // closeSidebarAfterSelectingOption('report');
};

const insertCalculatedDataToReport = (data, selectedYears, arrayOfNames) => {
  // console.log({ data, selectedYears, arrayOfNames });
  if (data && selectedYears) {
    // Get the value from data and set it to the element with id="th_cfiScore"
    const year = selectedYears[0];
    const ratioValue = data['row_cfiRatio_Client'] &&
      data['row_cfiRatio_Client'][year]
      ? data['row_cfiRatio_Client'][year].value
      : '-';
    // console.log({ ratioValue });
    const thCfiScoreElement = document.getElementById ('th_cfiScore');
    thCfiScoreElement.textContent = ratioValue !== undefined &&
      !isNaN (ratioValue) &&
      ratioValue !== 0
      ? ratioValue
      : '-';

    // Iterate through arrayOfNames and add calculated rows
    for (let name of arrayOfNames) {
      addToCalculatedRow (year, data, name[0], name[1], name[2]);
    }
  }
};

const addToCalculatedRow = (year, data, name, type, fixedNum) => {
  const tableReportRow = document.getElementById (`row_cfiScore_${name}`);

  // Clear previous children except the first one
  while (tableReportRow.children.length > 1) {
    tableReportRow.removeChild (tableReportRow.children[1]);
  }

  const propClass =
    'px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600';
  const propScope = 'row';

  const fields = [
    `cfi_${name}_Client`,
    `cfi_${name}_Strength_Client`,
    `cfi_${name}_Weight_Client`,
    `cfi_${name}_Score_Client`,
  ];

  for (let i = 0; i < 4; i++) {
    const dataPoint = document.createElement ('th');

    // console.log({ tableReportRow, year, type, fixedNum, data, name });
    const field = fields[i];
    const value = data[field] && data[field][year]
      ? data[field][year].value
      : undefined;

    // console.log ({value, field, year, type, fixedNum, dataPoint});

    const text = value !== undefined && !isNaN (value) && value !== 0
      ? styleNumber (value, type, fixedNum)
      : '-';

    // console.log({ text, year, type, fixedNum, dataPoint });

    // Create a new span element
    const spanElement = document.createElement ('span');
    spanElement.textContent = text;

    // Add the "mr-2" class to the span element
    spanElement.classList.add ('mr-2');

    // Create a new div element
    const divElement = document.createElement ('div');

    // Add the "flex" class to the div element
    divElement.classList.add ('flex');
    divElement.classList.add ('justify-between');

    // Append the span element to the div element
    divElement.appendChild (spanElement);

    // Append the div element to the dataPoint
    dataPoint.appendChild (divElement);
    dataPoint.className = propClass;
    dataPoint.scope = propScope;

    // Append the dataPoint to the tableRow
    tableReportRow.appendChild (dataPoint);
  }
};

const insertDataToReport = (data, selectedYears, table, arrayOfNames) => {
  addYearColumnsToReportTable (selectedYears, table);
  if (data && selectedYears) {
    addTotalDataToEveryRow (data, selectedYears, arrayOfNames, table);
  }
};

const addTotalDataToEveryRow = (data, selectedYears, arrayOfNames, table) => {
  // console.log('data', data);

  for (let name of arrayOfNames) {
    // console.log('name', name);
    addToSingleRow (
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
      name[7],
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
  end,
) => {
  // console.log ({selectedYears, name, client, peer, type, fixedNum});
  // console.log (`row_${name}`);
  // console.log ('tableReportRow', tableHeaderRow);
  const tableHeaderRow = document.getElementById (`row_${name}`);

  while (tableHeaderRow.children.length > 1) {
    tableHeaderRow.removeChild (tableHeaderRow.children[1]);
  }

  addClientDataToReportRow (
    tableHeaderRow,
    selectedYears,
    client,
    type,
    fixedNum,
    cb,
    name
  );
  // addPeerDataToRow(
  //   tableReportRow,
  //   peer,
  //   type,
  //   fixedNum,
  //   "total",
  //   wa,
  //   name,
  //   data,
  //   fIdArray,
  //   begin,
  //   end
  // );
};

const addClientDataToReportRow = (
  tableHeaderRow,
  selectedYears,
  client,
  type,
  fixedNum,
  cb,
  name
) => {
  const propClass =
    'px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600';
  const propScope = 'row';

  const tableRow = document.getElementById (`row_${name}`);

  // console.log ({client, tableRow, selectedYears, type, fixedNum, name});

  selectedYears.forEach (year => {
    const dataPoint = document.createElement ('th');

    // console.log({client, tableRow, year, type, fixedNum, dataPoint, name})

    const text = Number (client[year].value) !== 0
      ? styleNumber (client[year].value, type, fixedNum)
      : '-';

    // console.log ({text, client, year, type, fixedNum, dataPoint});

    // Create a new span element
    const spanElement = document.createElement ('span');
    spanElement.textContent = text;

    // Add the "mr-2" class to the span element
    spanElement.classList.add ('mr-2');

    // Create a new div element
    const divElement = document.createElement ('div');

    // Add the "flex" class to the div element
    divElement.classList.add ('flex');
    divElement.classList.add ('justify-between');

    // Append the span element to the div element
    divElement.appendChild (spanElement);

    // Append the div element to the dataPoint
    dataPoint.appendChild (divElement);
    dataPoint.className = propClass;
    dataPoint.scope = propScope;

    // Append the dataPoint to the tableRow
    tableRow.appendChild (dataPoint);
  });

  // if (cb) {
  //   let clientBenchmarkArray = getBenchmarks (client);

  //   //  console.log(clientBenchmarkArray, tableRow);

  //   getBackgroundColor (clientBenchmarkArray, tableRow);
  // }
};

// const addPeerDataToRow = (
//   tableRow,
//   peer,
//   type,
//   fixedNum,
//   dataArray,
//   wa,
//   name,
//   data,
//   fIdArray,
//   begin,
//   end
// ) => {

//   const propClass =
//   "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
//   const propScope = "row";

//   const dataPointAvg = document.createElement("th");

//   let avg;
//   if (peer && wa) {
//     avg = parseFloat(getWeightedAverageOfArray(data, name));
//   } else if (peer && !wa) {
//     avg = parseFloat(getAverageOfArray(peer[dataArray], name));
//   } else {
//     avg = 0;
//   }

//   // console.log({ tableRow, peer, type, fixedNum, dataArray, wa, data, name, avg });

//   const textAvg = peer ? styleNumber(avg, type, fixedNum) : '';
//   const dataPointMid = document.createElement("th");
//   const mid = peer ? parseFloat(getMidpointOfArray(peer[dataArray])) : '';
//   // console.log('mid', mid);
//   const textMid = styleNumber(mid, type, fixedNum);
//   const dataPointMin = document.createElement("th");
//   const min = peer ? parseFloat(get25thPercentileOfArray(peer[dataArray])) : '';
//   // if (name == 'salariesBenefitsTeachersAsPercentNetTuition_Salaries') console.log('salariesBenefitsTeachersAsPercentNetTuition_Salaries', {min, peerArray: peer[dataArray], type, fixedNum})
//   const textMin = styleNumber(min, type, fixedNum);
//   const dataPointMax = document.createElement("th");
//   const max = peer ? parseFloat(get75thPercentileOfArray(peer[dataArray])) : '';
//   const textMax = styleNumber(max, type, fixedNum);

//   // console.log({ tableRow, fixedNum, avg, mid, min, textMin, max, textMax });

//   dataPointAvg.className = propClass;
//   dataPointAvg.scope = propScope;
//   dataPointAvg.textContent = textAvg;
//   tableRow.appendChild(dataPointAvg);

//   dataPointMin.className = propClass;
//   dataPointMin.scope = propScope;
//   dataPointMin.textContent = textMin;
//   tableRow.appendChild(dataPointMin);

//   dataPointMid.className = propClass;
//   dataPointMid.scope = propScope;
//   dataPointMid.textContent = textMid;
//   tableRow.appendChild(dataPointMid);

//   dataPointMax.className = propClass;
//   dataPointMax.scope = propScope;
//   dataPointMax.textContent = textMax;
//   tableRow.appendChild(dataPointMax);

//   if (fIdArray) createFileForPrint(name, fIdArray, begin, end, avg, mid, min, max, peer, data);
// };

const addYearColumnsToReportTable = (years, table) => {
  // console.log({years, table});
  const trElements = table.querySelectorAll ('tr');
  const trIds = Array.from (trElements)
    .map (tr => tr.getAttribute ('id'))
    .filter (id => id && id.endsWith ('_tableHeader'));

  // console.log(trIds);

  trIds.forEach (idName => {
    // Clear existing columns before adding new ones
    clearTableColumns (idName);

    // Add new columns to the table
    addSingleNewColumnToReportTable (idName, years);
  });
};

const addSingleNewColumnToReportTable = (tableHeader, yearsArray) => {
  // Find the table header row by its ID
  const tableHeaderRow = document.getElementById (tableHeader);

  // const existingColumns = Array.from(tableHeader.children).slice(1
  // console.log(existingColumns)
  // console.log({tableHeaderRow, yearsArray});;

  // Iterate through the selectedYearArray and add new columns
  yearsArray.sort ((a, b) => b - a);
  // console.log(yearsArray);
  yearsArray.forEach (year => {
    // Create a new <th> element for each selected year
    const newTh = document.createElement ('th');
    newTh.setAttribute ('scope', 'col');
    newTh.setAttribute ('class', 'px-6 py-3 text-xl');
    newTh.innerText = year;

    // Insert the new <th> element to tableHeaderRow
    tableHeaderRow.appendChild (newTh);
    // console.log(year, newTh);
    // console.log(tableHeaderRow);
  });
};

const clearTableColumns = idName => {
  const headerRow = document.getElementById (idName);
  const columnsToPreserve = ['Avg', '25%', '50%', '75%'];

  // Remove all existing th elements except the first one and those to be preserved
  Array.from (headerRow.children).slice (1).forEach (th => {
    const columnName = th.textContent.trim ();
    if (!columnsToPreserve.includes (columnName)) {
      th.remove ();
    }
  });

  // Clear corresponding columns from other rows in the table body
  clearColumnsFromOtherRowsInTable (idName, columnsToPreserve);
};

const clearColumnsFromOtherRowsInTable = (idName, columnsToPreserve) => {
  const rows = document.querySelectorAll (`#${idName} + tbody tr`);

  rows.forEach (row => {
    // Remove all existing td elements except the first one and those to be preserved
    Array.from (row.children).slice (1).forEach (td => {
      const columnName = td.textContent.trim ();
      if (!columnsToPreserve.includes (columnName)) {
        td.remove ();
      }
    });
  });
};

function processTHElements () {
  // Select all <tr> elements with an id
  const rows = document.querySelectorAll ('tr[id]');

  rows.forEach (row => {
    // Select all <th> elements inside the current <tr>
    const thElements = row.querySelectorAll ('th');

    thElements.forEach (th => {
      // Check if the <th> has a <div> child
      const divChild = th.querySelector ('div');
      if (divChild) {
        // If <th> has a <div> child, find the <span> inside it
        const spanChild = divChild.querySelector ('span');
        if (spanChild) {
          // Process the text content of <span> child
          let textContent = spanChild.textContent.trim ();
          // Check if the text content contains numbers
          if (/\d/.test (textContent)) {
            if (textContent.includes ('-')) {
              // Remove "-" and apply classes
              textContent = `(${textContent.replace ('-', '')})`;
              spanChild.textContent = textContent;
              th.classList.remove ('text-gray-900', 'dark:text-white');
              th.classList.add ('text-red-500', 'dark:text-red-400');
            }
          }
        }
      } else {
        // Check if the <th> has exactly three children
        if (th.childElementCount === 3) {
          // Process the two <p> tags
          const pTags = th.querySelectorAll ('p');
          pTags.forEach (p => {
            let textContent = p.textContent.trim ();
            // Check if the text content contains numbers
            if (/\d/.test (textContent)) {
              if (textContent.includes ('-')) {
                // Remove "-" and apply classes
                textContent = `(${textContent.replace ('-', '')})`;
                p.textContent = textContent;
                p.classList.remove ('text-gray-900', 'dark:text-white');
                p.classList.add ('text-red-500', 'dark:text-red-400');
              }
            }
          });
        } else {
          // Process the text content of <th> directly
          let textContent = th.textContent.trim ();
          // Check if the text content contains numbers
          if (/\d/.test (textContent)) {
            if (textContent.includes ('-')) {
              // Remove "-" and apply classes
              textContent = `(${textContent.replace ('-', '')})`;
              th.textContent = textContent;
              th.classList.remove ('text-gray-900', 'dark:text-white');
              th.classList.add ('text-red-500', 'dark:text-red-400');
            }
          }
        }
      }
    });
  });
}
