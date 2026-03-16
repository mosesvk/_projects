const displayReportComponent = () => {
  // console.log('displayReportComponent()');

  const cfiData = JSON.parse(localStorage.getItem("cfiData"));
  const financialAnalysisContentData = JSON.parse(
    localStorage.getItem("financialAnalysisData")
  );
  const financialStatementContentData = JSON.parse(
    localStorage.getItem("financialStatementData")
  );
  const years = getSelectedYearsFromLocalStorage();
  const selectedYears = years && years.sort((a, b) => a - b);

  // console.log(
  //   'displayReportComponent',
  //   {
  //   cfiData,
  //   financialAnalysisContentData,
  //   financialStatementContentData,
  //   selectedYears,
  // });

  if (selectedYears) {
    insertDataToReport(
      cfiData,
      selectedYears,
      document.getElementById("cfiRatio_clientTable"),
      [
        ["cfiRatio_peerAverage_Peer", "num", 1],
        ["cfiRatio", "num", 1],
        ["cfi_primaryReserveRatio", "num", 2],
        ["cfi_netIncomeOperationsRatio", "percent", 1],
        ["cfi_returnOnNetAssets", "percent", 1],
        ["cfi_viabilityRatio", "num", 2],
      ]
    );
    insertCalculatedDataToReport(cfiData, selectedYears, [
      ["primaryReserveRatio", "num", 2],
      ["netIncomeOperationsRatio", "num", 2],
      ["returnOnNetAssets", "num", 2],
      ["viabilityRatio", "num", 2],
    ]);

    insertDataToReport(
      cfiData,
      selectedYears,
      document.getElementById("primaryReserveRatio_clientTable"),
      [
        ["primaryReserveRatio_peerAverage_Peer", "num", 2],
        ["primaryReserveRatio", "num", 2],
        ["pr_nonrestrictedNetAssets", "dollar", 0],
        ["pr_restrictedNetAssets", "dollar", 0],
        ["pr_propertyAndEquipment", "dollar", 0],
        ["pr_notesPayable", "dollar", 0],
        ["pr_cfi_primaryReserveAdjustment", "num", 1],
        ["pr_totalFunctionalExpenses", "dollar", 0],
      ]
    );

    insertDataToReport(
      cfiData,
      selectedYears,
      document.getElementById("netIncomeOperations_clientTable"),
      [
        ["netIncomeOperationsRatio_peerAverage_Peer", "percent", 1],
        ["netIncomeOperationsRatio", "percent", 1],
        ["ni_operatingRevenuesSupportAndReleases", "dollar", 0],
        ["ni_totalFunctionalExpenses", "dollar", 0],
      ]
    );

    insertDataToReport(
      cfiData,
      selectedYears,
      document.getElementById("returnOnNetAssets_clientTable"),
      [
        ["returnOnNetAssets_peerAverage_Peer", "percent", 1],
        ["returnOnNetAssets", "percent", 1],
        ["ro_changeInNetAssets", "dollar", 0],
        ["ro_netAssetsBeginningOfYear", "dollar", 0],
      ]
    );

    insertDataToReport(
      cfiData,
      selectedYears,
      document.getElementById("viabilityRatio_clientTable"),
      [
        ["viabilityRatio_peerAverage_Peer", "num", 2],
        ["viabilityRatio", "num", 2],
        ["vr_nonrestrictedNetAssets", "dollar", 0],
        ["vr_restrictedNetAssets", "dollar", 0],
        ["vr_totalPropertyAndEquipment", "dollar", 0],
        ["vr_accumulatedDepreciation", "dollar", 0],
        ["vr_notesPayable", "dollar", 0],
      ]
    );

    insertDataToAssetToLiabilityReport(
      financialAnalysisContentData,
      selectedYears
    );

    insertDataToSourceOfInomeReport(
      financialAnalysisContentData,
      selectedYears
    );

    insertDataToFfaReport(financialAnalysisContentData, selectedYears);

    insertDataToFSReport(financialStatementContentData, selectedYears);

    // Initialize the negative number watcher for dynamic updates
    initializeNegativeNumberWatcher();
  }
};

const insertDataToFSReport = (data, selectedYears) => {
  // console.log({ data, selectedYears });
};

const insertDataToFfaReport = (data, selectedYears) => {
  // console.log('ffa', {data, selectedYears});

  const currentYear = selectedYears[selectedYears.length - 1];

  const revenueTuitionAndFeesClient = Number(
    data["ffa_revenueTuitionAndFees_Client"][currentYear].value
  );
  document.getElementById("ffa_tuitionFees").textContent =
    revenueTuitionAndFeesClient != 0
      ? styleNumber(revenueTuitionAndFeesClient, "dollar", 0)
      : "-";

  const revenueSchoolServicesClient = Math.abs(Number(
    data["ffa_revenueScholarshipsAndFinancialAid_Client"][currentYear].value
  ))
  document.getElementById("ffa_scholarshipsFinancial").textContent =
    revenueSchoolServicesClient != 0
      ? styleNumber(revenueSchoolServicesClient, "dollar", 0)
      : "-";

  const totalRevenueContributionsClient = Number(
    data["ffa_totalRevenueContributions_Client"][currentYear].value
  );
  document.getElementById("ffa_unrestrictedGifts").textContent =
    totalRevenueContributionsClient != 0
      ? styleNumber(totalRevenueContributionsClient, "dollar", 0)
      : "-";

  const revenueAuxiliaryActivitiesClient = Number(
    data["ffa_revenueAuxiliaryActivities_Client"][currentYear].value
  );
  const revenueOtherClient = Number(
    data["ffa_revenueOther_Client"][currentYear].value
  );
  const revenueInvestmentIncomeClient = Number(
    data["ffa_revenueInvestmentIncome_Client"][currentYear].value
  );
  const revenueEndowmentSpendingAppropriationClient = Number(
    data["ffa_revenueEndowmentSpendingAppropriation_Client"][currentYear].value
  );
  const auxiliaryAndOtherClient =
    revenueAuxiliaryActivitiesClient +
    revenueOtherClient +
    revenueInvestmentIncomeClient +
    revenueEndowmentSpendingAppropriationClient;
  document.getElementById("ffa_auxiliaryOther").textContent =
    auxiliaryAndOtherClient != 0
      ? styleNumber(auxiliaryAndOtherClient, "dollar", 0)
      : "-";

  const restrictedAssets = Number(
    data["ffa_restrictedAssets_Client"][currentYear].value
  );
  document.getElementById("ffa_restrictedGifts").textContent =
    restrictedAssets != 0
      ? styleNumber(restrictedAssets, "dollar", 0)
      : "-";

  const salariesAndWagesClient = Number(
    data["ffa_salariesAndWages_Client"][currentYear].value
  );
  const employeeBenefitsClient = Number(
    data["ffa_employeeBenefits_Client"][currentYear].value
  );
  const compensationAndBenefitsClient =
    salariesAndWagesClient + employeeBenefitsClient;
  document.getElementById("ffa_compensationBenefits").textContent =
    compensationAndBenefitsClient != 0
      ? styleNumber(compensationAndBenefitsClient, "dollar", 0)
      : "-";

  const servicesSuppliesAndOtherClient = Number(
    data["ffa_servicesSuppliesAndOther_Client"][currentYear].value
  );
  const occupancyUtilitiesAndMaintenanceClient = Number(
    data["ffa_occupancyUtilitiesAndMaintenance_Client"][currentYear].value
  );
  const depreciationAndAmortizationClient = Number(
    data["ffa_depreciationAndAmortization_Client"][currentYear].value
  );
  const interestClient = Number(
    data["ffa_interest_Client"][currentYear].value
  );
  const incomeExpenseSurplusDefecitClient = Number(
    data["ffa_incomeExpenseSurplusDefecit_Client"][currentYear].value
  );

  // Match General Expense definition used in the Financial Position chart
  // (sum of non-compensation expense categories, excluding surplus/deficit).
  const generalExpenseClient =
    servicesSuppliesAndOtherClient +
    occupancyUtilitiesAndMaintenanceClient +
    depreciationAndAmortizationClient +
    interestClient;

  document.getElementById("ffa_generalExpense").textContent =
    generalExpenseClient != 0
      ? styleNumber(generalExpenseClient, "dollar", 0)
      : "-";

  const totalRevenues =
    revenueTuitionAndFeesClient +
    totalRevenueContributionsClient +
    auxiliaryAndOtherClient +
    restrictedAssets;
  const totalExpenses =
    revenueSchoolServicesClient +
    compensationAndBenefitsClient +
    generalExpenseClient;

  document.getElementById("ffa_totalRevenues").textContent =
    totalRevenues != 0 ? styleNumber(totalRevenues, "dollar", 0) : "-";
  document.getElementById("ffa_totalExpenses").textContent =
    totalExpenses != 0 ? styleNumber(totalExpenses, "dollar", 0) : "-";
};

const insertDataToSourceOfInomeReport = (data, selectedYears) => {
  // console.log ({data, selectedYears});
  const tableHeaderRow = document.getElementById(
    "row_sourceOfIncomeClient_tableHeader"
  );
  const tbody = document.getElementById("sourceOfIncomeClient_tbody");

  const yearElement = `
    <th
      scope="col"
      class="px-6 py-3 text-lg tracking-wide"
    >
      ${selectedYears[selectedYears.length - 1]}
    </th>  
  `;
  // append yearElement as the first child of tableHeaderRows children
  tableHeaderRow.insertAdjacentHTML("afterbegin", yearElement);

  const variables = [
    ["Tuition", "revenueTuitionAndFees"],
    ["Auxiliary", "revenueAuxiliaryActivities"],
    ["Contributions", "revenueContributions"],
    ["Investments", "revenueInvestmentIncome"],
    ["Other", "revenueOther"],
  ];

  variables.forEach((variable, index) => {
    // console.log({variable, index});
    const clientName = `si_${variable[1]}_Client`;
    const peerName = `${variable[1]}_Peer`;
    const title = variable[0];

    // console.log({clientName, peerName, title, data});

    const clientValue =
      Number(data[clientName][selectedYears[selectedYears.length - 1]].value) != 0
        ? styleNumber(
            data[clientName][selectedYears[selectedYears.length - 1]].value,
            "dollar",
            0
          )
        : "-";

    const classTrEven =
      "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
    const classTrOdd =
      "backgroundOffGreen border-b dark:bg-gray-700 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
    const rowElement = document.createElement("tr");
    rowElement.className = index % 2 === 0 ? classTrEven : classTrOdd;

    const cellHTML = `
          <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">${title}</th>
          <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">${clientValue}</th>
      `;

    rowElement.innerHTML = cellHTML;
    tbody.appendChild(rowElement);
  });
};

const insertDataToAssetToLiabilityReport = (data, selectedYears) => {
  // console.log({ data, selectedYears });
  const totalAssetsClient = data["totalAssets_Client"];
  const totalLiabilitiesClient = data["totalLiabilities_Client"];
  const tableBodyClient = document.getElementById(
    "assetToLiabilitiesClient_tbody"
  );
  tableBodyClient.innerHTML = "";

  const totalAssetsPeer = data["totalAssets_Peer"];
  const totalLiabilitiesPeer = data["totalLiabilities_Peer"];
  const tableBodyPeer = document.getElementById("assetToLiabilitiesPeer_tbody");
  tableBodyPeer.innerHTML = "";

  // console.log({ totalAssetsPeer, totalLiabilitiesPeer });

  selectedYears.forEach((year, index) => {
    const totalAssetsClientValue =
      Number(totalAssetsClient[year].value) > 0
        ? styleNumber(totalAssetsClient[year].value, "dollar", 0)
        : "-";
    const totalLiabilitiesClientValue =
      Number(totalLiabilitiesClient[year].value) > 0
        ? styleNumber(totalLiabilitiesClient[year].value, "dollar", 0)
        : "-";
    const totalAssetToLiabilityClientValue =
      Number(totalAssetsClient[year].value) > 0
        ? styleNumber(
            Number(totalAssetsClient[year].value) /
              Number(totalLiabilitiesClient[year].value),
            "num",
            2
          )
        : "-";

    // console.log(index, index % 2 !== 0)
    const classTrClient =
      index % 2 === 0
        ? "bg-white dark:bg-gray-800"
        : "backgroundOffGreen dark:bg-gray-700";
    const clientRow = document.createElement("tr");
    clientRow.className = classTrClient;
    clientRow.innerHTML = `
          <th scope="row" class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${year}</th>
          <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetsClientValue}</td>
          <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalLiabilitiesClientValue}</td>
          <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetToLiabilityClientValue}</td>
      `;
    tableBodyClient.appendChild(clientRow);

    const totalAssetsPeerValue = totalAssetsPeer[year]
      ? styleNumber(getSumOfArray(totalAssetsPeer[year]), "dollar", 0)
      : "-";
    const totalLiabilitiesPeerValue = totalLiabilitiesPeer[year]
      ? styleNumber(getSumOfArray(totalLiabilitiesPeer[year]), "dollar", 0)
      : "-";
    const ratioPeer = totalLiabilitiesPeer[year]
      ? Number(getSumOfArray(totalAssetsPeer[year])) /
        Number(getSumOfArray(totalLiabilitiesPeer[year]))
      : 0;
    const totalAssetToLiabilitysPeerValue =
      ratioPeer > 0 ? styleNumber(ratioPeer, "num", 2) : "-";

    const classTrPeer =
      index % 2 === 0
        ? "bg-white dark:bg-gray-800"
        : "backgroundOffBlue dark:bg-gray-700";
    const peerRow = document.createElement("tr");
    peerRow.className = classTrPeer;
    peerRow.innerHTML = `
          <th scope="row" class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${year}</th>
          <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetsPeerValue}</td>
          <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalLiabilitiesPeerValue}</td>
          <td class="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">${totalAssetToLiabilitysPeerValue}</td>
      `;
    tableBodyPeer.appendChild(peerRow);
  });
};

const insertDataToReport = (data, selectedYears, table, arrayOfNames) => {
  addYearColumnsToReportTable(selectedYears, table);
  if (data && selectedYears) {
    addTotalDataToEveryRow(data, selectedYears, arrayOfNames, table);
  }
};

const addTotalDataToEveryRow = (data, selectedYears, arrayOfNames, table) => {
  // console.log('data', data);d

  // console.log({ table, data, arrayOfNames });

  for (let name of arrayOfNames) {
    // console.log('name', name);
    addToSingleRow(
      selectedYears,
      name[0],
      data,
      data[`${name[0]}_Client`],
      data[`${name[0]}`],
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
  // take away the "_Peer" from the name
  const rowName = peer ? name.replace("_Peer", "") : name;
  const tableHeaderRow = document.getElementById(`row_${rowName}`);
  // console.log (`row_${name}`);
  // console.log ({
  //   selectedYears,
  //   name,
  //   client,
  //   peer,
  //   type,
  //   fixedNum,
  //   tableHeaderRow,
  //   rowName,
  // });
  // console.log({name})
  while (tableHeaderRow.children.length > 1) {
    tableHeaderRow.removeChild(tableHeaderRow.children[1]);
  }

  // check if variable name ends with '_Peer'
  if (name.endsWith("_Peer")) {
    addPeerDataToReportRow(
      tableHeaderRow,
      peer,
      type,
      fixedNum,
      "total",
      wa,
      name,
      data,
      fIdArray,
      begin,
      end,
      selectedYears
    );
  } else {
    addClientDataToReportRow(
      tableHeaderRow,
      selectedYears,
      client,
      type,
      fixedNum,
      cb,
      name
    );
  }
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
    "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
  const propScope = "row";

  const tableRow = document.getElementById(`row_${name}`);

  // console.log ({client, tableRow, selectedYears, type, fixedNum, name});

  selectedYears.forEach((year) => {
    const dataPoint = document.createElement("th");

    // console.log({client, tableRow, year, type, fixedNum, dataPoint, name})

    const text =
      Number(client[year].value) !== 0
        ? styleNumber(client[year].value, type, fixedNum)
        : "-";

    // console.log ({text, client, year, type, fixedNum, dataPoint});

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

  // if (cb) {
  //   let clientBenchmarkArray = getBenchmarks (client);

  //   //  console.log(clientBenchmarkArray, tableRow);

  //   getBackgroundColor (clientBenchmarkArray, tableRow);
  // }
};

const addPeerDataToReportRow = (
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
  end,
  selectedYears
) => {
  // console.log({ tableRow, peer, type, fixedNum, dataArray, wa, name, data, fIdArray, begin, end, selectedYears })
  // if (name == "primaryReserveRatio_peerAverage_Peer")
  //   console.log({
  //     tableRow,
  //     peer,
  //     type,
  //     fixedNum,
  //     dataArray,
  //     wa,
  //     name,
  //     data,
  //     fIdArray,
  //     begin,
  //     end,
  //     selectedYears,
  //   });

  const propClass =
    "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
  const propScope = "row";

  selectedYears.forEach((year) => {
    let avg;
    let test
    if (peer && wa) {
      avg = parseFloat(getWeightedAverageOfArray(data, name));
    } else if (peer && !wa) {
      avg = peer[year] ? parseFloat(getAverageOfArray(peer[year])) : 0;
      test = peer[year] ? getAverageOfArray(peer[year]) : 0;
    } else {
      avg = 0;
    }

    // if (name == "primaryReserveRatio_peerAverage_Peer")
      // console.log({  year, wa, data, avg, test, peer });

    const dataPoint = document.createElement("th");
    const text = peer ? styleNumber(avg, type, fixedNum) : "";

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


};

const insertCalculatedDataToReport = (data, selectedYears, arrayOfNames) => {
  // console.log({ data, selectedYears, arrayOfNames });
  if (data && selectedYears) {
    // Get the value from data and set it to the element with id="th_cfiScore"
    const year = selectedYears[selectedYears.length - 1];
    const ratioValue =
      data["row_cfiRatio_Client"] && data["row_cfiRatio_Client"][year]
        ? data["row_cfiRatio_Client"][year].value
        : "-";

    // Iterate through arrayOfNames and add calculated rows
    for (let name of arrayOfNames) {
      addToCalculatedRow(year, data, name[0], name[1], name[2]);
    }
  }
};

const addToCalculatedRow = (year, data, name, type, fixedNum) => {
  const tableReportRow = document.getElementById(`row_cfiScore_${name}`);

  // console.log ({tableReportRow, year, type, fixedNum, data, name});
  // Clear previous children except the first one
  while (tableReportRow.children.length > 1) {
    tableReportRow.removeChild(tableReportRow.children[1]);
  }

  const propClass =
    "px-6 py-4 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-80 justify-between border-r-2 dark:border-gray-600";
  const propScope = "row";

  const fields = [
    `cfi_${name}_Client`,
    `cfi_${name}_Strength_Client`,
    `cfi_${name}_Weight_Client`,
    `cfi_${name}_Score_Client`,
  ];

  for (let i = 0; i < 4; i++) {
    const dataPoint = document.createElement("th");

    // console.log({ tableReportRow, year, type, fixedNum, data, name });
    const field = fields[i];
    const value =
      data[field] && data[field][year] ? data[field][year].value : undefined;

    // console.log ({value, field, year, type, fixedNum, dataPoint});

    const text =
      value !== undefined && !isNaN(value) && value !== 0
        ? styleNumber(value, type, fixedNum)
        : "-";

    // console.log({ text, year, type, fixedNum, dataPoint });

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
    tableReportRow.appendChild(dataPoint);
  }
};

const addYearColumnsToReportTable = (years, table) => {
  // console.log({years, table});
  const trElements = table.querySelectorAll("tr");
  const trIds = Array.from(trElements)
    .map((tr) => tr.getAttribute("id"))
    .filter((id) => id && id.endsWith("_tableHeader"));

  // console.log(trIds);

  trIds.forEach((idName) => {
    // console.log ({idName, table});
    // Clear existing columns before adding new ones
    clearTableColumns(idName);

    // Add new columns to the table
    addSingleNewColumnToReportTable(idName, years);
  });
};

const addSingleNewColumnToReportTable = (tableHeader, yearsArray) => {
  // Find the table header row by its ID
  const tableHeaderRow = document.getElementById(tableHeader);

  // const existingColumns = Array.from(tableHeader.children).slice(1
  // console.log(existingColumns)
  // console.log({tableHeaderRow, yearsArray});;

  // Iterate through the selectedYearArray and add new columns
  // yearsArray.sort((a, b) => b - a);
  // console.log(yearsArray);
  yearsArray.forEach((year) => {
    // Create a new <th> element for each selected yeara
    const newTh = document.createElement("th");
    newTh.setAttribute("scope", "col");
    newTh.setAttribute("class", "px-6 py-3 text-xl");
    newTh.innerText = year;

    // Insert the new <th> element to tableHeaderRow
    tableHeaderRow.appendChild(newTh);
    // console.log(year, newTh);
    // console.log(tableHeaderRow);
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

/**
 * Extracts numeric value from formatted text (removes $, commas, parentheses, etc.)
 * @param {string} text - The formatted text containing a number
 * @returns {number} - The parsed numeric value, or NaN if not a valid number
 */
function extractNumericValue(text) {
  if (!text || typeof text !== 'string') return NaN;
  
  // Remove currency symbols, commas, and whitespace
  // Handle parentheses notation for negative numbers (accounting format)
  let cleanText = text.trim()
    .replace(/[$,\s]/g, '') // Remove $, commas, and spaces
    .replace(/[()]/g, ''); // Remove parentheses
  
  // Check if original text had parentheses (indicating negative in accounting format)
  const isNegativeFromParens = text.includes('(') && text.includes(')');
  
  const numValue = parseFloat(cleanText);
  return isNegativeFromParens ? -Math.abs(numValue) : numValue;
}

/**
 * Applies red styling to an element if the numeric value is negative
 * @param {HTMLElement} element - The DOM element to potentially style
 * @param {string} textContent - The text content to evaluate
 */
function applyNegativeNumberStyling(element, textContent) {
  if (!element || !textContent) return;
  
  // Check if text contains numbers
  if (!/\d/.test(textContent)) return;
  
  // Extract the numeric value
  const numValue = extractNumericValue(textContent);
  
  // Reset classes first
  element.classList.remove("text-red-500", "dark:text-red-400");
  element.classList.remove("text-gray-900", "dark:text-white", "text-black");
  
  if (!isNaN(numValue) && numValue < 0) {
    // Apply red styling for negative numbers
    element.classList.add("text-red-500", "dark:text-red-400");
  } else {
    // Apply default styling for positive numbers
    element.classList.add("text-gray-900", "dark:text-white");
  }
}

function formatNegativeNumbers() {
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
          applyNegativeNumberStyling(th, textContent);
        }
      } else {
        // Check if the <th> has exactly three children
        if (th.childElementCount === 3) {
          // Process the two <p> tags
          const pTags = th.querySelectorAll("p");
          pTags.forEach((p) => {
            let textContent = p.textContent.trim();
            applyNegativeNumberStyling(p, textContent);
          });
        } else {
          // Process the text content of <th> directly
          let textContent = th.textContent.trim();
          applyNegativeNumberStyling(th, textContent);
        }
      }
    });
  });

  // Select all <td> elements with a class that ends with "_dataPoint"
  const tdElements = document.querySelectorAll("td[class$='_dataPoint']");
  tdElements.forEach((td) => {
    let textContent = td.textContent.trim();
    applyNegativeNumberStyling(td, textContent);
  });

  // Select all <th> elements with an id attribute
  const thElements = document.querySelectorAll("th[id]");
  thElements.forEach((th) => {
    let textContent = th.textContent.trim();
    applyNegativeNumberStyling(th, textContent);
  });

  // Select all <p> elements with an id that ends with "_yearSelectData"
  const pElements = document.querySelectorAll("p[id$='_yearSelectData']");
  pElements.forEach((p) => {
    let textContent = p.textContent.trim();
    // Special handling for p elements that might have different default classes
    if (!/\d/.test(textContent)) return;
    
    const numValue = extractNumericValue(textContent);
    p.classList.remove("text-red-500", "dark:text-red-400");
    p.classList.remove("text-black", "dark:text-white", "text-gray-900");
    
    if (!isNaN(numValue) && numValue < 0) {
      p.classList.add("text-red-500", "dark:text-red-400");
    } else {
      p.classList.add("text-black", "dark:text-white");
    }
  });

  // Select all <div> elements with an id that ends with "_summary"
  const divs = document.querySelectorAll("div[id$='_summary']");
  divs.forEach((div) => {
    // Process the text content of <td> elements inside the table
    const tdElements = div.querySelectorAll("td");
    tdElements.forEach((td) => {
      let textContent = td.textContent.trim();
      applyNegativeNumberStyling(td, textContent);
    });
  });
}

/**
 * Sets up automatic re-formatting of negative numbers when content changes
 * This handles dynamic updates from ApexCharts and other content changes
 */
function initializeNegativeNumberWatcher() {
  // Initial formatting
  formatNegativeNumbers();
  
  // Create a MutationObserver to watch for text content changes
  const observer = new MutationObserver((mutations) => {
    let shouldReformat = false;
    
    mutations.forEach((mutation) => {
      // Check if text content changed
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        // Check if the changed element or its descendants contain numeric data
        const target = mutation.target;
        if (target.nodeType === Node.TEXT_NODE) {
          const parentElement = target.parentElement;
          if (parentElement && (
            parentElement.matches('td[class$="_dataPoint"]') ||
            parentElement.matches('th[id]') ||
            parentElement.matches('p[id$="_yearSelectData"]') ||
            parentElement.closest('div[id$="_summary"]') ||
            parentElement.closest('tr[id]')
          )) {
            shouldReformat = true;
          }
        } else if (target.nodeType === Node.ELEMENT_NODE) {
          // Check if the element itself or its descendants match our selectors
          if (target.matches('td[class$="_dataPoint"]') ||
              target.matches('th[id]') ||
              target.matches('p[id$="_yearSelectData"]') ||
              target.closest('div[id$="_summary"]') ||
              target.closest('tr[id]') ||
              target.querySelector('td[class$="_dataPoint"]') ||
              target.querySelector('th[id]') ||
              target.querySelector('p[id$="_yearSelectData"]') ||
              target.querySelector('div[id$="_summary"]') ||
              target.querySelector('tr[id]')
          ) {
            shouldReformat = true;
          }
        }
      }
    });
    
    if (shouldReformat) {
      // Debounce the reformatting to avoid excessive calls
      clearTimeout(window.negativeNumberReformatTimeout);
      window.negativeNumberReformatTimeout = setTimeout(() => {
        formatNegativeNumbers();
      }, 100);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  
  // Store the observer reference for potential cleanup
  window.negativeNumberObserver = observer;
}
