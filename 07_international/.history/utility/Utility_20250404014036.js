let clientDataStore = {}; // Global store for client data
const testName = "daysCashOnHand";
const yearsData_Array = [];
const selectedYearsselectedYears_Array = [];
const areas_Array = [
  { arr: ["Europe"], str: "Europe" },
  {
    arr: ["Asia"],
    str: "Asia",
  },
  {
    arr: ["Africa"],
    str: "Africa",
  },
  { arr: ["South America"], str: "South America" },
  { arr: ["North America"], str: "North America" },
  {
    arr: ["Australia"],
    str: "Australia",
  },
  {
    arr: ["Unspecified"],
    str: "Unspecified",
  },
];
const map_dataUri = new Map();
const dataUrLObj = new Object();

// Charts
let statementCashFlows_chart;
let daysCashOnHand_chart;
let daysExpensesInUnrestrictedNA_chart;
let daysExpensesInUnrestrictedNA_excludingPPE_chart;
let liquidityAssetsAvailableCover_chart;
let totalCoverageRatio_chart;
let assetsWithoutPpeToLiabilitiesWithoutDebt_chart;
let contributionsTrend_chart;
let annualizedInvestmentReturn_chart;
let functionalExpensePercent_program_chart;
let functionalExpensePercent_administrative_chart;
let functionalExpensePercent_fundraising_chart;
let costOfContributionsDetailView_chart;
let costOfContributions_chart;
let functionalAllocation_chart;
let netAssetBreakdown_chart;
let changeInNetAssets_chart;
let totalContributions_chart;
let contributionsWithoutDR_chart;

// Mission Sending
// Relief Ops
// Healthcare
// Bible Translators
// Education
// Other
// Child Sponsorships
const types_Array = [
  { arr: ["Mission-sending"], str: "Mission-sending" },
  { arr: ["Relief"], str: "Relief" },
  { arr: ["Healthcare"], str: "Healthcare" },
  { arr: ["Bible Translators"], str: "Bible Translators" },
  { arr: ["Education"], str: "Education" },
  { arr: ["Other"], str: "Other" },
  { arr: ["Child Sponsorships"], str: "Child Sponsorships" },
  {
    arr: ["Unspecified"],
    str: "Unspecified",
  },
];

const schoolChurch_Array = [
  { arr: ["School"], str: 0 },
  { arr: ["Church"], str: 1 },
];

const sites_Array = [
  { arr: ["Single Site"], str: "SINGLE" },
  { arr: ["2 - 5 Sites"], str: "TWOSIX" },
  { arr: ["6+ Sites"], str: "MANY" },
];

let sliderAmount = null;
let missionSliderAmount = null;
let sliderRange = null;
let missionSliderRange = null;
let sliderValue = 0;
let sliderValue2 = 25000;
let missionValue = 0;
let missionValue2 = 25000;
let firmName = "";
let urlToPrintXLS;
// let amount = null;

let selectedArea = "";
const selectedAreas_Array = new Set();
const selectedTypes_Array = new Set();
const selectedClients_Array = new Set();
let selectedYears_Set = new Set();
let selectedSchoolChurch_Selected;
let charts_Array = [];

// Utility Functions
const createToastWarning = (textString) => {
  const toastWarningDiv = document.createElement("div");
  toastWarningDiv.id = "toast-warning";
  toastWarningDiv.classList.add(
    "transition",
    "ease-in-out",
    "delay-150",
    "fixed",
    "top-20",
    "left-1/2",
    "transform",
    "-translate-x-1/2",
    "z-50",
    "flex",
    "items-center",
    "w-full",
    "max-w-md",
    "p-4",
    "text-gray-700",
    "bg-gray-300",
    "rounded-lg",
    "shadow",
    "dark:text-gray-200",
    "dark:bg-gray-600"
  );

  toastWarningDiv.innerHTML = `
    <div class="animate-pulse inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
      <svg class="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
      </svg>
      <span class="sr-only">Warning icon</span>
    </div>
    <div class="ms-3 text-lg font-normal">
    ${textString}
    </div>
    <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-gray-300 text-gray-600 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-200 dark:hover:text-white dark:bg-gray-600 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close">
      <span class="sr-only">Close</span>
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  `;

  const closeButton = toastWarningDiv.querySelector(
    '[data-dismiss-target="#toast-warning"]'
  );
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent propagation to the toast
    toastWarningDiv.remove();
  });

  document.body.appendChild(toastWarningDiv);

  // Event listener to close the toast when clicking outside of it
  const clickOutsideHandler = (event) => {
    if (!toastWarningDiv.contains(event.target)) {
      toastWarningDiv.remove();
      document.body.removeEventListener("click", clickOutsideHandler);
    }
  };

  setTimeout(() => {
    document.body.addEventListener("click", clickOutsideHandler);
  }, 100); // Delay adding the event listener to prevent immediate removal
};

const createToastSuccess = (textString) => {
  const toastSuccessDiv = document.createElement("div");
  toastSuccessDiv.id = "toast-success";
  toastSuccessDiv.classList.add(
    "transition",
    "ease-in-out",
    "delay-150",
    "fixed",
    "top-20",
    "left-1/2",
    "transform",
    "-translate-x-1/2",
    "z-50",
    "flex",
    "items-center",
    "w-full",
    "max-w-md",
    "p-4",
    "text-gray-700",
    "bg-gray-300",
    "rounded-lg",
    "shadow",
    "dark:text-gray-200",
    "dark:bg-gray-600"
  );

  toastSuccessDiv.innerHTML = `
    <div class="animate-pulse inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
      <svg class="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      </svg>
      <span class="sr-only">success</span>
    </div>
    <div class="ms-3 text-sm font-normal">${textString}</div>
    <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
  `;

  const closeButton = toastSuccessDiv.querySelector(
    '[data-dismiss-target="#toast-success"]'
  );
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent propagation to the toast
    toastSuccessDiv.remove();
  });

  document.body.appendChild(toastSuccessDiv);

  // Event listener to close the toast when clicking outside of it
  const clickOutsideHandler = (event) => {
    if (!toastSuccessDiv.contains(event.target)) {
      toastSuccessDiv.remove();
      document.body.removeEventListener("click", clickOutsideHandler);
    }
  };

  setTimeout(() => {
    document.body.addEventListener("click", clickOutsideHandler);
  }, 100); // Delay adding the event listener to prevent immediate removal
};

const getMainChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  wa,
  parsedData,
  benchmark,
  title
) => {
  // Use chartConfigFactory to generate chart options
  if (typeof chartConfigFactory !== "undefined") {
    return chartConfigFactory.createConfig("main", {
      dataPeer,
      dataClient,
      numType,
      fixedNum,
      mainName,
      wa,
      parsedData,
      benchmark,
      title,
    });
  } else {
    console.error("chartConfigFactory is not defined");
    return {}; // Return empty options as fallback
  }
};

// Line chart options generator
const getLineChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  wa,
  parsedData,
  benchmark,
  title
) => {
  // Use chartConfigFactory to generate line chart options
  if (typeof chartConfigFactory !== "undefined") {
    return chartConfigFactory.createConfig("line", {
      dataPeer,
      dataClient,
      numType,
      fixedNum,
      mainName,
      wa,
      parsedData,
      benchmark,
      title,
    });
  } else {
    console.error("chartConfigFactory is not defined");
    return {}; // Return empty options as fallback
  }
};

// Functional allocation chart options generator
const getFunctionalAllocationChartOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  wa,
  parsedData
) => {
  // Use chartConfigFactory to generate functional allocation chart options
  if (typeof chartConfigFactory !== "undefined") {
    return chartConfigFactory.createConfig("functionalAllocation", {
      dataPeer,
      dataClient,
      numType,
      fixedNum,
      mainName,
      wa,
      parsedData,
    });
  } else {
    console.error("chartConfigFactory is not defined");
    return {}; // Return empty options as fallback
  }
};

// Cost of contributions chart options generator
const getCostOfContributionsDetailViewOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 2,
  mainName,
  wa,
  parsedData
) => {
  // Use chartConfigFactory to generate cost of contributions chart options
  if (typeof chartConfigFactory !== "undefined") {
    return chartConfigFactory.createConfig("costOfContributions", {
      dataPeer,
      dataClient,
      numType,
      fixedNum,
      mainName,
      wa,
      parsedData,
    });
  } else {
    console.error("chartConfigFactory is not defined");
    return {}; // Return empty options as fallback
  }
};

// Net asset breakdown chart options generator
const getNetAssetBreakdownOptions = (
  dataPeer,
  dataClient,
  numType,
  fixedNum = 0,
  mainName,
  wa,
  parsedData
) => {
  // Use chartConfigFactory to generate net asset breakdown chart options
  if (typeof chartConfigFactory !== "undefined") {
    return chartConfigFactory.createConfig("netAssetBreakdown", {
      dataPeer,
      dataClient,
      numType,
      fixedNum,
      mainName,
      wa,
      parsedData,
    });
  } else {
    console.error("chartConfigFactory is not defined");
    return {}; // Return empty options as fallback
  }
};

const createChartFromParsedData = (
  parsedData,
  chart,
  peer,
  client,
  type,
  fixedNum,
  mainName,
  wa,
  benchmark,
  title,
  chartType
) => {
  if (parsedData) {
    // Use chartManager instead of direct function calls
    if (
      typeof chartManager !== "undefined" &&
      chartManager.createChartFromParsedData
    ) {
      chartManager.createChartFromParsedData(
        parsedData,
        chart,
        peer,
        client,
        type,
        fixedNum,
        mainName,
        wa,
        benchmark,
        title,
        chartType
      );
    } else {
      console.error(
        "chartManager is not defined or missing createChartFromParsedData method"
      );
      // Fallback to old approach if needed
      updateModal(
        mainName,
        parsedData[peer],
        parsedData[client],
        parsedData,
        type,
        fixedNum,
        wa
      );
      createChart(
        chart,
        parsedData[peer],
        parsedData[client],
        type,
        fixedNum,
        mainName,
        wa,
        parsedData,
        benchmark,
        title,
        chartType
      );
    }
  }
};

const createChart = (
  chartId,
  dataPeer,
  dataClient,
  type,
  fixedNum,
  mainName,
  wa,
  parsedData,
  benchmark,
  title,
  chartType
) => {
  // Clear any existing chart
  document.getElementById(chartId).innerHTML = "";

  // Store chart ID in the dataUrLObj mapping
  dataUrLObj[mainName] = chartId;

  // Use the chartManager instance to create the chart
  if (typeof chartManager !== "undefined" && chartManager.createChart) {
    return chartManager.createChart(
      chartId,
      dataPeer,
      dataClient,
      type,
      fixedNum,
      mainName,
      wa,
      parsedData,
      benchmark,
      title,
      chartType
    );
  } else {
    console.error("chartManager is not defined or missing createChart method");
    return null;
  }
};

function updateModal(
  mainName,
  peerData,
  clientData,
  parsedData,
  type,
  fixedNum,
  wa
) {
  if (mainName == testName) {
    console.log({
      peerData,
      clientData,
      parsedData,
      type,
      fixedNum,
      wa,
    });
  }

  if (typeof chartManager !== 'undefined' && chartManager.updateModal) {
    console.log('--> revert to chartManager.udpateModal');
    
    return chartManager.updateModal(mainName, peerData, clientData, parsedData, type, fixedNum, wa);
  }

  // Get the selected years from local storage
  const selectedYears = getSelectedYearsFromLocalStorage();
  if (!selectedYears || !selectedYears.length) {
    console.warn(`No selected years found for modal ${mainName}`);
    return;
  }

  // Find the modal element
  const modalSelector = `#${mainName}_modal`;
  const modal = document.querySelector(modalSelector);

  if (!modal) {
    // console.warn(`Modal element with selector "${modalSelector}" not found`);
    return;
  }

  // Find the table header row with more flexible selector
  const rowSelector = `#${mainName}_modal_row`;
  let headerRow = modal.querySelector(rowSelector);

  if (!headerRow) {
    console.warn(
      `Header row with selector "${rowSelector}" not found in modal ${modalSelector}`
    );
    // Try a more generic approach to find the table row
    headerRow = modal.querySelector('tr[id$="_modal_row"]');
    if (!headerRow) {
      console.error(
        `Could not find any appropriate row in modal ${modalSelector}`
      );
      return;
    }
  }

  // Clear and populate the modal content
  populateModalContent(
    headerRow,
    selectedYears,
    clientData,
    peerData,
    parsedData,
    type,
    fixedNum,
    wa
  );
}

function populateModalContent(
  headerRow,
  selectedYears,
  clientData,
  peerData,
  parsedData,
  type,
  fixedNum,
  wa
) {
  let tableHead = headerRow.parentElement;

  // Clear existing rows after the headerRow
  let nextRow = headerRow.nextSibling;
  while (nextRow) {
    tableHead.removeChild(nextRow);
    nextRow = headerRow.nextSibling;
  }

  // Clear existing header content
  headerRow.innerHTML = "";

  // Add columns (year, client, avg, 25%, 50%, 75%)
  addModalColumns(headerRow);

  // Get the main name from the header row ID
  const mainName = headerRow.id.replace("_row", "");

  // Special case flag for annualizedInvestmentReturn chart
  const isAnnualizedInvestmentReturn =
    mainName === "annualizedInvestmentReturn";

  // Process data type appropriately
  const dataProcessingType = isAnnualizedInvestmentReturn
    ? "number"
    : type || "number";

  // Add data rows for each year
  selectedYears.forEach((year) => {
    const yearRow = createYearRow(mainName, year);
    tableHead.appendChild(yearRow);

    // Now add client data to this row if available
    if (clientData && clientData[year]) {
      // Format client data according to the data type
      addClientDataToModalRow(
        yearRow,
        clientData[year].value,
        dataProcessingType,
        fixedNum || 2
      );
    } else {
      // Add empty cell if no client data
      addEmptyCell(yearRow);
    }

    // Add peer data if available
    if (peerData && peerData[year]) {
      // If we're using weighted average and the function exists
      if (
        wa === "wa" &&
        typeof getWeightedAverageOfArray === "function" &&
        parsedData
      ) {
        try {
          // Calculate weighted average for this specific chart and year
          const weightedAvg = getWeightedAverageOfArray(
            parsedData,
            mainName,
            year
          );

          // For other percentiles, use regular calculations
          const peerValues = peerData[year];
          const peerMid = Array.isArray(peerValues)
            ? getMidpointOfArray(peerValues, mainName)
            : 0;
          const peer25 = Array.isArray(peerValues)
            ? get25thPercentileOfArray(peerValues, mainName)
            : 0;
          const peer75 = Array.isArray(peerValues)
            ? get75thPercentileOfArray(peerValues, mainName)
            : 0;

          // For percentage type, multiply values by 100 (except for annualizedInvestmentReturn which is already handled)
          let multiplier =
            dataProcessingType === "percent" && !isAnnualizedInvestmentReturn
              ? 100
              : 1;

          // Add the peer data to the row with appropriate formatting
          addPeerDataToModalRow(
            yearRow,
            weightedAvg * multiplier,
            peerMid * multiplier,
            peer25 * multiplier,
            peer75 * multiplier,
            dataProcessingType,
            fixedNum
          );
        } catch (error) {
          console.error(
            `Error calculating weighted average for ${mainName}:`,
            error
          );

          // Fall back to regular statistics
          const peerValues = peerData[year];
          const peerAvg = Array.isArray(peerValues)
            ? getAverageOfArray(peerValues)
            : 0;
          const peerMid = Array.isArray(peerValues)
            ? getMidpointOfArray(peerValues, mainName)
            : 0;
          const peer25 = Array.isArray(peerValues)
            ? get25thPercentileOfArray(peerValues, mainName)
            : 0;
          const peer75 = Array.isArray(peerValues)
            ? get75thPercentileOfArray(peerValues, mainName)
            : 0;

          // Add the peer data to the row
          addPeerDataToModalRow(
            yearRow,
            peerAvg,
            peerMid,
            peer25,
            peer75,
            dataProcessingType,
            fixedNum
          );
        }
      } else {
        // Use regular statistics without weighted average
        const peerValues = peerData[year];
        const peerAvg = Array.isArray(peerValues)
          ? getAverageOfArray(peerValues)
          : 0;
        const peerMid = Array.isArray(peerValues)
          ? getMidpointOfArray(peerValues, mainName)
          : 0;
        const peer25 = Array.isArray(peerValues)
          ? get25thPercentileOfArray(peerValues, mainName)
          : 0;
        const peer75 = Array.isArray(peerValues)
          ? get75thPercentileOfArray(peerValues, mainName)
          : 0;

        // For percentage type, multiply values by 100
        let multiplier =
          dataProcessingType === "percent" && !isAnnualizedInvestmentReturn
            ? 100
            : 1;

        // Add the peer data to the row
        addPeerDataToModalRow(
          yearRow,
          peerAvg * multiplier,
          peerMid * multiplier,
          peer25 * multiplier,
          peer75 * multiplier,
          dataProcessingType,
          fixedNum
        );
      }
    } else {
      // Add empty cells for peer data if none available
      for (let i = 0; i < 4; i++) {
        addEmptyCell(yearRow);
      }
    }
  });
}

function addModalColumns(headerRow) {
  // Clear existing header content
  headerRow.innerHTML = "";

  // Add the "Year" column
  const yearColumn = document.createElement("th");
  yearColumn.className = "px-6 py-3";
  yearColumn.textContent = "Year";
  headerRow.appendChild(yearColumn);

  // Add the "Client" column
  const clientColumn = document.createElement("th");
  clientColumn.className = "px-6 py-3";
  clientColumn.textContent = "Client";
  headerRow.appendChild(clientColumn);

  // Add peer data columns
  const avgColumn = document.createElement("th");
  avgColumn.className = "px-6 py-3";
  avgColumn.textContent = "Avg";
  headerRow.appendChild(avgColumn);

  const p25Column = document.createElement("th");
  p25Column.className = "px-6 py-3";
  p25Column.textContent = "25%";
  headerRow.appendChild(p25Column);

  const midColumn = document.createElement("th");
  midColumn.className = "px-6 py-3";
  midColumn.textContent = "50%";
  headerRow.appendChild(midColumn);

  const p75Column = document.createElement("th");
  p75Column.className = "px-6 py-3";
  p75Column.textContent = "75%";
  headerRow.appendChild(p75Column);
}

function createYearRow(modalId, year) {
  const row = document.createElement("tr");
  row.id = `${modalId}_${year}`;
  row.className =
    "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";

  const yearCell = document.createElement("td");
  yearCell.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white";
  yearCell.textContent = year;
  row.appendChild(yearCell);

  return row;
}

const updateCashFlowModal = (
  mainName,
  data,
  [financing, investing, operating, total]
) => {
  // Get the selected years from local storage

  const financingData = data[`${financing}_Client`];
  const investingData = data[`${investing}_Client`];
  const operatingData = data[`${operating}_Client`];
  const totalData = data[`${total}_Client`];
  const selectedYears = getSelectedYearsFromLocalStorage();

  // Find the modal element
  const modal = document.getElementById(`${mainName}_modal`);

  // Check if the modal element exists
  if (modal) {
    // Find the table header row
    const headerRow = modal.querySelector(`#${mainName}_modal_row`);
    let tableHead = headerRow.parentElement;

    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling; // Get the next sibling again
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add the "Year" column
    const yearColumn = document.createElement("th");
    yearColumn.className = "px-6 py-3";
    yearColumn.textContent = "Year";
    headerRow.appendChild(yearColumn);

    // Add the "Operating" column
    const operatingColumn = document.createElement("th");
    operatingColumn.className = "px-6 py-3";
    operatingColumn.textContent = "Operating";
    headerRow.appendChild(operatingColumn);

    // Add the "Investing" column
    const investingColumn = document.createElement("th");
    investingColumn.className = "px-6 py-3";
    investingColumn.textContent = "Investing";
    headerRow.appendChild(investingColumn);

    // Add the "Financing" column
    const financingColumn = document.createElement("th");
    financingColumn.className = "px-6 py-3";
    financingColumn.textContent = "Financing";
    headerRow.appendChild(financingColumn);

    // Add the "Total" column
    const totalColumn = document.createElement("th");
    totalColumn.className = "px-6 py-3";
    totalColumn.textContent = "Total";
    headerRow.appendChild(totalColumn);

    // Loop through selected years and add data rows
    selectedYears.forEach((year) => {
      const row = document.createElement("tr");
      row.className =
        "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
      row.id = `${mainName}_modal_${year}`;

      // Add year cell
      const yearCell = document.createElement("td");
      yearCell.className =
        "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
      yearCell.scope = "row";
      yearCell.textContent = year;
      row.appendChild(yearCell);

      // Add operating cell
      const operatingCell = document.createElement("td");
      operatingCell.className =
        "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
      operatingCell.scope = "row";
      operatingCell.textContent = operatingData[year]
        ? styleNumber(operatingData[year].value, "dollar")
        : 0;
      row.appendChild(operatingCell);

      // Add investing cell
      const investingCell = document.createElement("td");
      investingCell.className =
        "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
      investingCell.scope = "row";
      investingCell.textContent = investingData[year]
        ? styleNumber(investingData[year].value, "dollar")
        : 0;
      row.appendChild(investingCell);

      // Add financing cell
      const financingCell = document.createElement("td");
      financingCell.className =
        "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
      financingCell.scope = "row";
      financingCell.textContent = financingData[year]
        ? styleNumber(financingData[year].value, "dollar")
        : 0;
      row.appendChild(financingCell);

      // Add total cell
      const totalCell = document.createElement("td");
      totalCell.className =
        "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
      totalCell.scope = "row";
      totalCell.textContent = totalData[year]
        ? styleNumber(totalData[year].value, "dollar")
        : 0;
      row.appendChild(totalCell);

      // Append the row to the table
      tableHead.appendChild(row);
    });
  }
};

const getStoredData = (dataTable) => {
  return localStorage.getItem(dataTable) || null;
};

const parseStoredData = (data) => {
  return data ? JSON.parse(data) : null;
};

const closeSidebarAfterSelectingOption = (component) => {
  // Remove the sidebar/backdoor/"x" svg icon
  // Add back the "hamburger" svg icon
  document.querySelector("#sidebar").classList.add("hidden");
  document.querySelector("#sidebarBackdrop").classList.add("hidden");
  document
    .querySelector("#toggleSidebarMobileHamburger")
    .classList.remove("hidden");
  document.querySelector("#toggleSidebarMobileClose").classList.add("hidden");

  localStorage.setItem("lastRenderedComponent", component);
};

const getAverageOfArray = (array) => {
  array = array.map((val) => Number(val));
  if (array.length === 0) {
    return 0;
  }
  const sum = array.reduce((acc, str) => acc + Number(str), 0);
  const avg = sum / array.length;

  // Check if the average is NaN, undefined, or null, and return 0 in such cases
  if (isNaN(avg) || avg === undefined || avg === null) {
    return 0;
  }

  return avg;
};

const getMidpointOfArray = (array, name) => {
  // console.log(array);
  if (array.length === 0) {
    return 0;
  }

  array = array.map((val) => Number(val));

  array.sort((a, b) => a - b); // Sort the array

  const midpoint = Math.floor(array.length / 2); // Calculate the midpoint index

  // if (name == 'liquidityFundsAvailable') {
  //   console.log({ array, midpoint, num: Number(array[midpoint]), 'else': (Number(array[midpoint - 1]) + Number(array[midpoint])) / 2 });
  // }

  if (array.length % 2 === 1) {
    // If odd length, return the value at the midpoint
    return Number(array[midpoint]);
  } else {
    // If even length, return the average of the two midpoints
    return (Number(array[midpoint - 1]) + Number(array[midpoint])) / 2;
  }
};

const getMaxOfArray = (array, name) => {
  const nonZeroArray = array.filter((num) => num !== 0);

  if (nonZeroArray.length === 0) {
    return 0;
  }

  // if (name == "liquidityFundsAvailable") {
  //   console.log({ nonZeroArray: Math.max(...nonZeroArray),  array: Math.max(...array) });
  // }

  return Math.max(...array);
};

const get25thPercentileOfArray = (array, name) => {
  // make sure each value is a Number format before calculating
  array = array.map((val) => Number(val));

  // Step 1: Sort the array in ascending order
  const sortedArray = array.sort((a, b) => a - b);
  // console.log(sortedArray);

  // Step 2: Check if the array has less than or equal to 2 elements
  if (sortedArray.length <= 2) {
    // If array has 1 or 2 elements, return the average of the elements
    return (
      sortedArray.reduce((acc, val) => Number(acc) + Number(val), 0) /
      sortedArray.length
    );
  }

  // if (name) console.log(name, sortedArray);
  // Step 3: Calculate the index for the 25th percentile
  const index = (sortedArray.length + 1) * 0.25;

  // Step 4: Check if the index is an integer
  if (Number.isInteger(index)) {
    // If it's an integer, return the value at that index
    // if (name) console.log(name, { num: sortedArray[index - 1] });
    return Number(sortedArray[index - 1]);
  } else {
    // If not an integer, interpolate between the two nearest values
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const lowerValue = Number(sortedArray[lowerIndex - 1]);
    const upperValue = Number(sortedArray[upperIndex - 1]);
    return (lowerValue + upperValue) / 2;
  }
};

const get75thPercentileOfArray = (array, name) => {
  array = array.map((val) => Number(val));
  // Step 1: Sort the array in ascending order
  const sortedArray = array.sort((a, b) => a - b);

  // Step 2: Check if the array has less than or equal to 2 elements
  if (sortedArray.length <= 2) {
    // If array has 1 or 2 elements, return the average of the elements
    return (
      sortedArray.reduce((acc, val) => Number(acc) + Number(val), 0) /
      sortedArray.length
    );
  }

  // Step 3: Calculate the index for the 75th percentile
  const index = (sortedArray.length + 1) * 0.75;

  // Step 4: Check if the index is an integer
  if (Number.isInteger(index)) {
    // If it's an integer, return the value at that index
    return Number(sortedArray[index - 1]);
  } else {
    // If not an integer, interpolate between the two nearest values
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const lowerValue = Number(sortedArray[lowerIndex - 1]);
    const upperValue = Number(sortedArray[upperIndex - 1]);

    // if (name == "liquidityFundsAvailable") {
    //   console.log({ sortedArray, lowerValue, upperValue, index });
    // }

    return (lowerValue + upperValue) / 2;
  }
};

const getSumOfArray = (array) => {
  array = array.map((val) => Number(val));
  // console.log(array);
  if (array.length === 0) {
    return 0;
  }

  return array.reduce((sum, value) => sum + parseFloat(value) || 0, 0);
};

function calculatePercentiles(arr, type, fixed) {
  // Handle empty or invalid arrays
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return [0, 0, 0]; // Return default values if array is empty or invalid
  }

  // Convert string values to numbers, filtering out non-numeric values
  let numericArr = arr
    .map((value) => {
      // Handle null, undefined or empty strings
      if (value === null || value === undefined || value === "") {
        return 0;
      }

      // Simply convert to number, preserve exact value
      return parseFloat(value);
    })
    .filter((value) => !isNaN(value)); // Filter out any NaN values

  // Handle empty result after filtering
  if (numericArr.length === 0) {
    return [0, 0, 0];
  }

  // Sort the array in ascending order
  const sortedArr = numericArr.slice().sort((a, b) => a - b);

  const getPercentile = (percentile) => {
    const index = (percentile / 100) * (sortedArr.length - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    // Handle edge cases
    if (lowerIndex < 0) return sortedArr[0];
    if (upperIndex >= sortedArr.length) return sortedArr[sortedArr.length - 1];

    // If indices are the same, return that exact value
    if (lowerIndex === upperIndex) {
      return sortedArr[lowerIndex];
    }

    // Calculate interpolated value
    const lowerValue = sortedArr[lowerIndex];
    const upperValue = sortedArr[upperIndex];
    const fraction = index - lowerIndex;

    // Return exact calculated value without any rounding
    return lowerValue + fraction * (upperValue - lowerValue);
  };

  // Calculate the 25th, 50th, and 75th percentiles
  try {
    const q1 = getPercentile(25);
    const median = getPercentile(50);
    const q3 = getPercentile(75);

    return [q1, median, q3];
  } catch (error) {
    console.error(`Error calculating percentiles: ${error.message}`);
    return [0, 0, 0]; // Return default values if calculation fails
  }
}

function sortSet(set) {
  const sortedArray = Array.from(set).sort();
  set.clear();
  sortedArray.forEach((item) => set.add(item));
}

const getSelectedYearsFromLocalStorage = () => {
  const storedSelectedYears = JSON.parse(localStorage.getItem("selectedYears"));
  const storedData = localStorage.getItem("enrollment");
  if (!storedSelectedYears && storedData) {
    console.error("Need to Select Year");
  }

  return storedSelectedYears;
};

const resetSelectedYearsFromLocalStorage = () => {
  localStorage.setItem("selectedYears", JSON.stringify([]));
};

const changeListenerForInputYears = (input, year) => {
  if (input.checked) {
    selectedYears_Set.add(year);
  } else {
    selectedYears_Set.delete(year);
  }

  const selectedYearsArray = Array.from(selectedYears_Set).sort(
    (a, b) => a - b
  );
  localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
};

const addUniqueYearsToOptionsSelectDropdown = (yearsArray) => {
  // Get the options list element correctly
  const optionsListElement = document.getElementById("options-list");

  if (!optionsListElement) {
    console.error("Options list element not found for years dropdown");
    return;
  }

  // Clear the selected years on page load
  if (!window.yearSelectionsInitialized) {
    resetSelectedYearsFromLocalStorage();
    selectedYears_Set.clear();
    window.yearSelectionsInitialized = true;
  }

  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage();

  if (Array.isArray(storedYears)) {
    selectedYears_Set = new Set(storedYears);
  }

  // Clear existing content
  optionsListElement.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-years");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-years");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  // CHANGE HERE: Set to unchecked by default
  selectAllInput.checked = false;

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-years");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListElement.appendChild(selectAllLabel);

  // Sort years in descending order
  const sortedYears = yearsArray.sort((a, b) => b - a);

  // Add year options
  sortedYears.forEach((year) => {
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${year}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${year}`);
    newInput.setAttribute(
      "class",
      `form-checkbox h-4 w-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-300 dark:border-gray-500 mr-2 cursor-pointer`
    );
    newInput.setAttribute("value", year);
    // Check the input only if the year is in the selectedYears_Set
    newInput.checked = selectedYears_Set.has(year);

    newInput.addEventListener("change", (e) => {
      const isChecked = e.target.checked;

      if (isChecked) {
        selectedYears_Set.add(year);
      } else {
        selectedYears_Set.delete(year);
      }

      // Update "Select All" checkbox state
      const yearCheckboxes = document.querySelectorAll(
        "#options-list input[type='checkbox']"
      );
      const nonSelectAllCheckboxes = Array.from(yearCheckboxes).filter(
        (cb) => cb.id !== "select-all-checkbox-years"
      );

      const allChecked = nonSelectAllCheckboxes.every((cb) => cb.checked);
      const noneChecked = nonSelectAllCheckboxes.every((cb) => !cb.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && !noneChecked;

      // Save to local storage
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = year;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListElement.appendChild(newLabel);
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    const yearCheckboxes = document.querySelectorAll(
      "#options-list input[type='checkbox']"
    );

    yearCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-years") {
        checkbox.checked = isChecked;
        const year = parseInt(checkbox.value);

        if (isChecked) {
          selectedYears_Set.add(year);
        } else {
          selectedYears_Set.delete(year);
        }
      }
    });

    // Save to local storage
    const selectedYearsArray = Array.from(selectedYears_Set).sort(
      (a, b) => a - b
    );
    localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
  });
};

// Modify the dropdown toggle function to close other dropdowns
function setupDropdownToggle(selectElementId, optionsListId) {
  const selectElement = document.getElementById(selectElementId);
  const optionsListElement = document.getElementById(optionsListId);

  if (!selectElement || !optionsListElement) {
    console.warn(
      `Dropdown elements not found: ${selectElementId}, ${optionsListId}`
    );
    return;
  }

  // Function to close all other dropdowns
  function closeOtherDropdowns(currentOptionsListId) {
    const dropdownConfigs = [
      { selectId: "custom-select", optionsId: "options-list" },
      { selectId: "custom-select-area", optionsId: "options-list-area" },
      { selectId: "custom-select-type", optionsId: "options-list-type" },
      { selectId: "custom-select-client", optionsId: "options-list-client" },
    ];

    dropdownConfigs.forEach((config) => {
      if (config.optionsId !== currentOptionsListId) {
        const otherOptionsListElement = document.getElementById(
          config.optionsId
        );
        if (otherOptionsListElement) {
          otherOptionsListElement.classList.add("invisible");
        }
      }
    });
  }

  // Function to toggle dropdown visibility
  function toggleDropdown(event) {
    // Prevent event propagation to avoid immediate closing
    event.stopPropagation();

    // Check if click is on checkbox or label to prevent unnecessary toggling
    if (
      event.target.closest(".form-checkbox") ||
      event.target.closest("label")
    ) {
      return;
    }

    // Close other dropdowns first
    closeOtherDropdowns(optionsListId);

    // Toggle visibility of current dropdown
    optionsListElement.classList.toggle("invisible");
  }

  // Function to close dropdown when clicking outside
  function closeDropdownOutsideClick(event) {
    if (
      !selectElement.contains(event.target) &&
      !optionsListElement.contains(event.target)
    ) {
      optionsListElement.classList.add("invisible");
    }
  }

  // Remove any existing listeners to prevent duplicate attachments
  selectElement.removeEventListener("click", toggleDropdown);
  document.removeEventListener("click", closeDropdownOutsideClick);

  // Add new event listeners
  selectElement.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOutsideClick);
}

const addUniqueClientsToOptionsSelectClientDropdown = (clientArray) => {
  const optionsListClient = document.getElementById("options-list-client");
  if (!optionsListClient) {
    console.error("Client options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedClients_Array = window.selectedClients_Array || new Set();

  // Clear existing content
  optionsListClient.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-client");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-client");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-client");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListClient.appendChild(selectAllLabel);

  // EXPLICITLY clear the selectedClients_Array before populating
  window.selectedClients_Array.clear();

  // Populate all clients by default
  clientArray.forEach((clientString) => {
    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    // Create the new input element
    const newInput = document.createElement("input");
    newInput.setAttribute("id", `client_${clientString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", clientString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `client_${clientString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = clientString;

    // FORCE check the input and add to selectedClients_Array
    newInput.checked = true;
    window.selectedClients_Array.add(clientString);

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListClient.appendChild(newListItem);

    // Event listener to update selectedClients_Array
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        window.selectedClients_Array.add(clientString);
      } else {
        window.selectedClients_Array.delete(clientString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-client input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-client")
        .every((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate =
        !allChecked &&
        Array.from(
          document.querySelectorAll(
            "#options-list-client input[type='checkbox']"
          )
        )
          .filter((input) => input.id !== "select-all-checkbox-client")
          .some((input) => input.checked);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    const clientCheckboxes = document.querySelectorAll(
      "#options-list-client input[type='checkbox']"
    );

    clientCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-client") {
        checkbox.checked = isChecked;
        const clientString = checkbox.value;

        if (isChecked) {
          window.selectedClients_Array.add(clientString);
        } else {
          window.selectedClients_Array.delete(clientString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;
  });
};

// Enhanced addClientDataToModalRow function
function addClientDataToModalRow(yearRow, clientValue, type, fixedNum) {
  // console.log(`Adding client data to row: ${yearRow.id}`, {
  //   clientValue,
  //   type,
  //   fixedNum,
  // });

  const cell = document.createElement("td");
  cell.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";

  // Format the value
  const formattedValue =
    clientValue !== undefined && clientValue !== null
      ? styleNumber(clientValue, type, fixedNum)
      : "-";

  cell.textContent = formattedValue;
  yearRow.appendChild(cell);

  return cell;
}

// Function to update the "select all" checkbox state
function updateSelectAllCheckboxState() {
  const selectAllCheckbox = document.getElementById(
    "select-all-checkbox-client"
  );
  if (!selectAllCheckbox) return;

  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );
  const clientOnlyCheckboxes = Array.from(clientCheckboxes).filter(
    (checkbox) => checkbox.id !== "select-all-checkbox-client"
  );

  const allChecked = clientOnlyCheckboxes.every((checkbox) => checkbox.checked);
  const noneChecked = clientOnlyCheckboxes.every(
    (checkbox) => !checkbox.checked
  );

  selectAllCheckbox.checked = allChecked;
  selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
}
function addPeerDataToModalRow(
  row,
  avgValue,
  midValue,
  p25Value,
  p75Value,
  dataType,
  fixedNum
) {
  // console.log({
  //   row, avgValue, dataType, fixedNum
  // });

  // Create and add the average value cell
  const avgCell = createPeerDataCell(row, avgValue, dataType, fixedNum);

  // Create and add the 25th percentile cell
  const p25Cell = createPeerDataCell(row, p25Value, dataType, fixedNum);

  // Create and add the median cell
  const midCell = createPeerDataCell(row, midValue, dataType, fixedNum);

  // Create and add the 75th percentile cell
  const p75Cell = createPeerDataCell(row, p75Value, dataType, fixedNum);
}

// Helper to create a data cell for peer data with appropriate formatting
function createPeerDataCell(row, value, dataType, fixedNum) {
  const cell = document.createElement("td");
  cell.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";

  if (value !== undefined && value !== null) {
    // Make sure value is a number before formatting
    const numValue = parseFloat(value);

    // Format the value based on type using styleNumber
    let formattedValue;
    if (!isNaN(numValue) && typeof styleNumber === "function") {
      // Force the type parameter to match expected format in styleNumber
      let typeParam = dataType;
      if (dataType === "number") typeParam = "num"; // Convert "number" to "num" for styleNumber

      formattedValue = styleNumber(numValue, typeParam, fixedNum);
    } else {
      // Fallback if value is not a number or styleNumber is not available
      formattedValue = value.toFixed(fixedNum || 2);
    }

    cell.textContent = formattedValue;

    // Apply color formatting for negative values
    if (numValue < 0) {
      cell.classList.remove("text-gray-900", "dark:text-white");
      cell.classList.add("text-red-500", "dark:text-red-400");
    }
  } else {
    cell.textContent = "-";
  }

  row.appendChild(cell);
  return cell;
}

const styleNumber = (num, type, fixed, name) => {
  let text = num;
  let textNum;

  const truncateNumber = (number, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.floor(number * factor) / factor;
  };

  if (!isNaN(text)) {
    if (type === "num" && text != 0) {
      textNum = truncateNumber(parseFloat(text), fixed).toFixed(fixed);
      text = parseFloat(textNum).toLocaleString(undefined, {
        minimumFractionDigits: fixed,
        maximumFractionDigits: fixed,
      });
    }

    if (type === "percent" && text != 0) {
      const number = parseFloat(text);
      text = (number * 100).toFixed(fixed) + "%";
    }

    if (type === "dollar" && text != 0) {
      textNum = truncateNumber(parseFloat(text), fixed).toFixed(fixed);
      text = fixed
        ? "$ " + parseFloat(textNum).toFixed(fixed)
        : "$ " + parseFloat(textNum).toLocaleString();
    }
  }

  return text;
};

const updateCountyData = (trId, countyName, percentage, income, year) => {
  // console.log({ trId, countyName, percentage, income });

  // Create the <tr> element if it doesn't exist
  let trElement = document.getElementById(`row_${trId}`);

  // Create the second <th> element and its children
  const secondThElement = document.createElement("th");
  secondThElement.scope = "row";
  secondThElement.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";

  // Create the span element inside the second <th>
  const spanElementSecond = document.createElement("span");
  spanElementSecond.textContent = "---";
  secondThElement.appendChild(spanElementSecond);

  // Create the <p> elements inside the second <th>
  const percentagePElement = document.createElement("p");
  percentagePElement.id = `percentage_${trId}_${year}`;
  percentagePElement.className = "mb-2";
  percentagePElement.textContent = "adfas";
  secondThElement.appendChild(percentagePElement);

  const incomePElement = document.createElement("p");
  incomePElement.id = `income_${trId}_${year}`;
  incomePElement.textContent = "fadf";
  secondThElement.appendChild(incomePElement);

  trElement.appendChild(secondThElement);

  // Format values
  const formattedIncome = new Intl.NumberFormat().format(income);
  const formattedPercentage = Math.round(percentage);

  // Update the content of the selected elements

  document.getElementById(
    `percentage_${trId}_${year}`
  ).textContent = `${formattedPercentage}%`;
  document.getElementById(
    `income_${trId}_${year}`
  ).textContent = `$${formattedIncome}`;
};

const checkForCountyDataIncomeTable = (
  trId,
  countyName,
  incomeData,
  percentData,
  selectedYearsArray,
  cb
) => {
  // console.log({ trId, countyName, incomeData, percentData, selectedYearsArray, cb });

  const data = JSON.parse(localStorage.getItem("incomeData"));
  // check the data of the passed dataId to see if it has data, if there is no data, then add the class "hidden" to the trId

  // Create the first <th> element and its children if it doesn't exist
  let thElement = document.getElementById(`th_${trId}`);
  if (!thElement) {
    thElement = document.createElement("th");
    thElement.scope = "row";
    thElement.className =
      "pl-12 py-4 font-medium text-gray-900 whitespace-normal dark:text-white";

    // console.log('COUNTY', data[countyName][selectedYearsArray[0]]);

    // Create the span element inside the first <th>
    const spanElement = document.createElement("span");
    spanElement.id = `title_${trId}`;
    spanElement.textContent = data[countyName][selectedYearsArray[0]]
      ? data[countyName][selectedYearsArray[0]].value
      : "";
    thElement.appendChild(spanElement);

    // Create the <p> elements inside the first <th>
    const firstPElement = document.createElement("p");
    firstPElement.className = "pl-4 mb-2";
    firstPElement.textContent = "__ Per Giving Units";
    thElement.appendChild(firstPElement);

    const secondPElement = document.createElement("p");
    secondPElement.className = "pl-4";
    secondPElement.textContent = "__ Median Household Income";
    thElement.appendChild(secondPElement);

    const tableRow = document.getElementById(`row_${trId}`);
    tableRow.appendChild(thElement);
  }

  if (data[countyName][selectedYearsArray[0]].value === "") {
    const trElement = document.getElementById(`row_${trId}`);
    trElement.classList.add("hidden");
    return;
  }

  selectedYearsArray.forEach((year) => {
    let countyNameVal;

    // Iterate over the years
    for (const year of Object.keys(data[countyName])) {
      // Check if the value is not empty
      if (data[countyName][year].value !== "") {
        // Store the value and break the loop
        countyNameVal = data[countyName][year].value;
        break;
      }
    }
    // console.log(countyNameVal, trId);

    // If countyNameVal is still undefined, all values were empty
    if (
      countyNameVal === 0 ||
      countyNameVal === undefined ||
      countyNameVal === ""
    ) {
      const trElement = document.getElementById(`row_${trId}`);
      trElement.classList.add("hidden");
    }

    // Now you have the countyNameVal, you can continue with your logic
    // Assuming the rest of your code...
    const percentageVal = data[percentData][year].value;
    const incomeVal = data[incomeData][year].value;

    updateCountyData(trId, countyNameVal, percentageVal * 100, incomeVal, year);
  });

  if (cb) {
    const benchmarkArray = getBenchmarks(data[percentData]);
    const row = document.getElementById(`row_${trId}`);

    getBackgroundColor(benchmarkArray, row);
  }
};

function changeThWidth(elementId) {
  // Get the element by its ID
  var trElement = document.getElementById(elementId);

  // Check if the element exists
  if (trElement) {
    // Find the first <th> element child of the <tr>
    var thElement = trElement.querySelector("th");

    // Check if the <th> element exists
    if (thElement) {
      // Change the width of the <th> to 50rem
      thElement.style.width = "50rem";
    } else {
      console.error("No <th> element found inside the specified <tr>.");
    }
  } else {
    console.error("Element with ID " + elementId + " not found.");
  }
}

const range = () => {
  return {
    minprice: 0,
    maxprice: 25000,
    min: 0,
    max: 25000,
    minthumb: 1,
    maxthumb: 1,

    mintrigger() {
      this.minprice = Math.min(this.minprice, this.maxprice - 500);
      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;

      // Update sliderValue and trigger slider movement if necessary
      sliderValue = this.minprice;
      if (sliderAmount) {
        sliderAmount.value = sliderValue; // Assuming sliderAmount is an input element
        // Update slider position dynamically using appropriate API (e.g., jQuery UI, NoUiSlider)
      }

      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;

      // Consider adding visual or functional feedback for minthumb movement
    },

    maxtrigger() {
      this.maxprice = Math.max(this.maxprice, this.minprice + 500);
      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;

      // Update sliderValue2 and trigger slider movement if necessary
      sliderValue2 = this.maxprice;
      if (sliderRange) {
        sliderRange.value = sliderValue2; // Assuming sliderRange is an input element
        // Update slider position dynamically using appropriate API
      }

      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;

      // Consider adding visual or functional feedback for maxthumb movement
    },
  };
};

function missionaryRange() {
  return {
    minprice: 0,
    maxprice: 10000,
    min: 0,
    max: 10000,
    minthumb: 1,
    maxthumb: 1,

    mintrigger() {
      this.minprice = Math.min(this.minprice, this.maxprice - 500);
      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;

      // Update missionValue and trigger slider movement if necessary
      missionValue = this.minprice;
      if (missionSliderAmount) {
        missionSliderAmount.value = missionValue; // Assuming missionSliderAmount is an input element
        // Update slider position dynamically using appropriate API (e.g., jQuery UI, NoUiSlider)
      }

      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;

      // Consider adding visual or functional feedback for minthumb movement
    },

    maxtrigger() {
      this.maxprice = Math.max(this.maxprice, this.minprice + 500);
      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;

      // Update missionValue2 and trigger slider movement if necessary
      missionValue2 = this.maxprice;
      if (missionSliderRange) {
        missionSliderRange.value = missionValue2; // Assuming missionSliderRange is an input element
        // Update slider position dynamically using appropriate API
      }

      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;

      // Consider adding visual or functional feedback for maxthumb movement
    },
  };
}

const adjustDivHeight = () => {
  var div = document.getElementById("options-list");

  if (div.scrollHeight <= 20 * 16) {
    //
    div.classList.remove("h-80");
    div.classList.add("h-fit");
    div.classList.add("py-4");
  } else {
    div.classList.remove("h-fit");
    div.classList.remove("py-4");
    div.classList.add("h-80");
  }
};

function getBenchmarks(obj) {
  // console.log('getBenchmarks', obj)

  let benchmarks = [];
  for (let year in obj) {
    if (obj.hasOwnProperty(year)) {
      benchmarks.push(obj[year].benchmark);
    }
  }
  return benchmarks;
}

const getBackgroundColor = (array, row, i = 1) => {
  if (!array.length) return;
  // console.log({ array, row, i });

  let color =
    array[0] === "Warning"
      ? "warning"
      : array[0] === "Good"
      ? "good"
      : array[0] === "Action Required"
      ? "actionRequired"
      : null;

  if (color) {
    // Add class to apply background color
    row.children[i].classList.add(color);
    // Initialize tippy popover
    tippy(row.children[i], {
      allowHTML: true,
      content: `<p class="flex items-center text-md">
        Click
        <svg class="w-4 h-4 mx-2 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
        Benchmark
      </p>`,
      arrow: true,
      placement: "left",
      // animation: scaleExtreme
    });
  }

  getBackgroundColor(array.slice(1), row, i + 1);
  // console.log('---');
};

const addClickEventToBenchmark = (elementId, benchmarkDesc) => {
  const element = document.getElementById(elementId);
  // if (!element) return;
  element.onclick = createBenchmark(benchmarkDesc, elementId);
};

const createBenchmark = async (benchmarkDesc, elementId) => {
  // console.log({ benchmarkDesc, elementId });

  let variable = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ["overlay", "button", "escape"],
    closeLabel: "Close",
    cssClass: ["custom-class-1", "custom-class-2"],
    // onOpen: function () {
    //   console.log('modal open');
    // },
    // onClose: function () {
    //   console.log('modal closed');
    // },
    beforeClose: function () {
      // here's goes some logic
      // e.g. save content before closing the modal
      return true; // close the modal
      return false; // nothing happens
    },
  });

  if (benchmarkDesc.length > 1) {
    let message = "<div>";
    let p = "";
    for (let i = 0; i < benchmarkDesc.length; i++) {
      if (i === 0) {
        p += `<p class="text-center font-bold mb-2">${benchmarkDesc[i]}</p>`;
      } else {
        p += `<p >${benchmarkDesc[i]}</p>`;
      }
    }
    message += p;
    message += "</div>";
    variable.setContent(`${message}`);
  } else {
    variable.setContent(`<p>${benchmarkDesc}</p>`);
  }

  const selectedYears = JSON.parse(localStorage.getItem("selectedYears"));
  // console.log({selectedYears, elementId})
  if (selectedYears) {
    const children = await document.getElementById(elementId).children;
    // console.log(children);

    for (let i = 1; i < selectedYears.length + 1; i++) {
      editElementChildren(children[i], variable, elementId);
    }
  }

  return variable;
};

const editElementChildren = (element, variable, elementId) => {
  // console.log({ element, variable });
  // if (!element) console.log(elementId);

  // console.log(element.firstChild);

  element.addEventListener("click", () => {
    variable.open();
  });
  element.classList.add("cursor-pointer");
  element.classList.add("hover:opacity-100");
  element.classList.add("transition");
  element.classList.add("ease-in-out");
};

const getSelectedSchoolChurchOption = () => {
  const options = document.querySelectorAll('input[name="schoolChurch"]');
  options.forEach((option, index) => {
    if (option.checked) {
      selectedSchoolChurch_Selected = index.toString();
      return;
    }
  });
};

function calculatePercentageChange(numbers) {
  const percentageChanges = [];
  for (let i = 1; i < numbers.length; i++) {
    const change = ((numbers[i] - numbers[i - 1]) / numbers[i - 1]) * 100;
    percentageChanges.push(change);
  }
  return percentageChanges;
}

document.querySelector("#sidebar ul").addEventListener("click", function () {
  // Select all div elements whose ID ends with "Link"
  const buttons = document.querySelectorAll('button[id$="Link"]');

  buttons.forEach((button) => {
    // Check if the button has the class "active"
    if (button.classList.contains("active")) {
      // Add the classes bg-gray-300 and dark:bg-gray-700 if they are not already present
      button.classList.add("bg-gray-300", "dark:bg-gray-700");
    } else {
      // Remove the classes bg-gray-300 and dark:bg-gray-700 if they are present
      button.classList.remove("bg-gray-300", "dark:bg-gray-700");
    }
  });
});

// Function to destroy all existing charts
const destroyAllCharts = () => {
  if (!charts_Array) return;
  a;
  charts_Array.forEach((chart) => {
    chart.destroy();
  });
  charts_Array = []; // Clear the chart instances array
};

// selectedYears_Set.add(2018)
// selectedYears_Set.add(2019)
// selectedYears_Set.add(2020)
// selectedYears_Set.add(2021)
// selectedYears_Set.add(2022)

function showApiLoadingFunction(action, mode) {
  // console.log("hit showLoading()");

  const loadingDiv = document.getElementById("loadingApiDiv");
  const loadingApiHeader = document.getElementById("loadingApiHeader");
  const apiPrint = document.getElementById("apiPrint");
  const firstApiYearSpan = document.getElementById("firstApiYear");
  const lastApiYearSpan = document.getElementById("LastApiYear");
  const apiYears = document.getElementById("apiYears");

  if (action === "close") {
    setTimeout(() => {
      loadingDiv.classList.add("hidden");
    }, 1500);
  } else if (action === "open") {
    loadingDiv.classList.remove("hidden");

    if (mode === "api") {
      loadingApiHeader.innerHTML = "Loading Data";
      apiYears.classList.remove("hidden");
      apiPrint.classList.add("hidden");

      const selectedYears = getSelectedYearsFromLocalStorage();
      // console.log({ selectedYears });

      if (selectedYears.length > 0) {
        firstApiYearSpan.textContent = selectedYears[0];
        lastApiYearSpan.textContent = selectedYears[selectedYears.length - 1];
      }
    } else if (mode === "print") {
      loadingApiHeader.innerHTML = "Printing Chart Data";
      apiYears.classList.add("hidden");
      apiPrint.classList.remove("hidden");
    }
  }
}

/**
 * Generates series data for cash flow charts
 *
 * @param {Array} years - Array of selected years
 * @param {Object} operatingData - Object containing operating cash flow data by year
 * @param {Object} investingData - Object containing investing cash flow data by year
 * @param {Object} financingData - Object containing financing cash flow data by year
 * @param {Object} totalData - Object containing total cash flow data by year
 * @returns {Array} Array of series data for the chart
 */
function getSeriesData(
  years,
  operatingData,
  investingData,
  financingData,
  totalData
) {
  // Initialize empty data arrays for each series
  const operatingValues = [];
  const investingValues = [];
  const financingValues = [];
  const totalValues = [];

  // Collect data for each year
  years.forEach((year) => {
    // Get data for each category, defaulting to 0 if undefined
    const operating =
      operatingData && operatingData[year]
        ? Number(operatingData[year].value)
        : 0;

    const investing =
      investingData && investingData[year]
        ? Number(investingData[year].value)
        : 0;

    const financing =
      financingData && financingData[year]
        ? Number(financingData[year].value)
        : 0;

    const total =
      totalData && totalData[year] ? Number(totalData[year].value) : 0;

    // Add values to respective arrays
    operatingValues.push(operating);
    investingValues.push(investing);
    financingValues.push(financing);
    totalValues.push(total);
  });

  // Create series array
  return [
    {
      name: "Operating",
      data: operatingValues,
    },
    {
      name: "Investing",
      data: investingValues,
    },
    {
      name: "Financing",
      data: financingValues,
    },
    {
      name: "Total",
      data: totalValues,
    },
  ];
}

// Preserve the original registerChartEventListeners function
const originalRegisterChartEventListeners = window.registerChartEventListeners;

// Override it to avoid duplicate run button listeners
window.registerChartEventListeners = function () {
  // console.log("Using primary event listener from qbApi.js");

  // Only keep the dark mode toggle if it exists
  const darkModeToggle = document.querySelector("#dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const darkModeEvent = new Event("dark-mode");
      document.dispatchEvent(darkModeEvent);
    });
  }
};

/**
 * Extracts peer and client data arrays from the parsed data with improved consistency
 *
 * @param {Array} years - Array of selected years
 * @param {Object} dataPeer - Peer data object
 * @param {Object} dataClient - Client data object
 * @param {Number} fixedNum - Number of decimal places for formatting
 * @param {String} mainName - Name identifier for the chart
 * @param {String} numType - Data type (percent, dollar, number)
 * @param {Boolean|String} wa - Whether to use weighted average
 * @param {Boolean} forceRefresh - Whether to force data refresh
 * @returns {Object} Object containing formatted data arrays
 */
function getPeerAndClientChartDataArrays(
  years,
  dataPeer,
  dataClient,
  fixedNum,
  mainName,
  numType,
  wa,
  forceRefresh = false,
  parsedData
) {
  // Cache key based on parameters
  const cacheKey = `${mainName}_${years.join(
    "_"
  )}_${numType}_${wa}_${fixedNum}`;

  if (mainName == testName)
    console.log("getPeerAndClientChartDataArrays", {
      dataPeer,
      dataClient,
      parsedData,
      fixedNum, 
      mainName, 
      numType,
      wa
    });

  // Use cached result if available and not forcing refresh
  if (
    !forceRefresh &&
    window.chartDataCache &&
    window.chartDataCache[cacheKey]
  ) {
    console.log(`Using cached chart data for ${mainName}`);
    return window.chartDataCache[cacheKey];
  }

  // Initialize window.chartDataCache if it doesn't exist
  if (!window.chartDataCache) {
    window.chartDataCache = {};
  }

  // Initialize arrays
  const peerAvg = [];
  const peerMid = [];
  const peer25 = [];
  const peer75 = [];
  const clientArray = [];

  // Special flag for annualizedInvestmentReturn to avoid double percentage conversion
  const isAnnualizedInvestmentReturn =
    mainName === "annualizedInvestmentReturn";

  // Log data for debugging
  if (mainName == testName) {
    console.log(`Processing chart data for ${mainName}:`, {
      years,
      peerData: parsedData[dataPeer],
      clientData: parsedData[dataClient],
      numType,
      wa,
      parsedData,
    });
  }

  // Process each year
  years.forEach((year) => {
    // Case 1: We have both peer and client data
    if (parsedData[dataPeer] && parsedData[dataClient]) {
      // Get peer data array
      const dataArray = parsedData[dataPeer];

      if (mainName == testName)
        console.log({
          peerData: parsedData[dataPeer],
          dataArray,
          peerClient: parseStoredData[dataClient],
          parsedData,
        });

      // Handle missing data
      if (!dataArray || dataArray.length === 0) {
        console.warn(`No peer data array for ${mainName}, year ${year}`);
        peerAvg.push(0);
        peerMid.push(0);
        peer25.push(0);
        peer75.push(0);

        // Get client data
        let clientNum = parsedData[dataClient][year]?.value
          ? Number(parsedData[dataClient][year].value)
          : 0;

        // Convert to percentage if needed
        if (numType === "percent" && !isAnnualizedInvestmentReturn) {
          clientNum *= 100;
        }

        clientArray.push(clientNum);
        return;
      }

      // Calculate statistics
      let avg, mid, lower25, higher75;

      // Ensure we're working with numeric arrays
      const numericArray = dataArray[year].map((val) =>
        typeof val === "string" ? parseFloat(val) : Number(val)
      );

      // Use weighted average if requested
      if (
        wa === "wa" &&
        typeof window.getWeightedAverageOfArray === "function"
      ) {
        try {
          // Calculate weighted average with year parameter
          avg = window.getWeightedAverageOfArray(parsedData, mainName, year, 'utility.js');

          // For other percentiles, use regular calculations
          mid = getMidpointOfArray(numericArray, mainName);
          lower25 = get25thPercentileOfArray(numericArray, mainName);
          higher75 = get75thPercentileOfArray(numericArray, mainName);

          // Log successful weighted average calculation
          // console.log(`Used weighted average for ${mainName}, year ${year}: ${avg}`);
        } catch (error) {
          console.error(
            `Error calculating weighted average for ${mainName}:`,
            error
          );
          // Fall back to regular statistics
          avg = getAverageOfArray(numericArray);
          mid = getMidpointOfArray(numericArray, mainName);
          lower25 = get25thPercentileOfArray(numericArray, mainName);
          higher75 = get75thPercentileOfArray(numericArray, mainName);
        }
      } else {
        // Use regular statistics
        avg = getAverageOfArray(numericArray);
        mid = getMidpointOfArray(numericArray, mainName);
        lower25 = get25thPercentileOfArray(numericArray, mainName);
        higher75 = get75thPercentileOfArray(numericArray, mainName);
      }

      // Get client value
      let clientNum = parsedData[dataClient][year]?.value
        ? Number(parsedData[dataClient][year].value)
        : 0;

      

      if (mainName == testName) {
        console.log({
          avg,
          mid,
          lower25,
          higher75,
          clientNum,
        });
      }

      // Format values with consistent precision and add to result arrays
      peerAvg.push(styleNumber(avg, numType, fixedNum));
      peerMid.push(styleNumber(mid, numType, fixedNum));
      peer25.push(styleNumber(lower25, numType, fixedNum));
      peer75.push(styleNumber(higher75, numType, fixedNum));
      clientArray.push(styleNumber(clientNum, numType, fixedNum));
    }
    // Case 2: We have client data but no peer data
    else if (parsedData[dataClient]) {
      peerAvg.push(0);
      peerMid.push(0);
      peer25.push(0);
      peer75.push(0);

      let clientNum = parsedData[dataClient][year]?.value
        ? Number(parsedData[dataClient][year].value)
        : 0;

      clientArray.push(styleNumber(clientNum, numType, fixedNum))
    }
    // Case 3: We have peer data but no client data
    else if (parsedData[dataPeer]) {
      const dataArray = parsedData[dataPeer][year];

      if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
        const numericArray = dataArray.map((val) =>
          typeof val === "string" ? parseFloat(val) : Number(val)
        );

        let avg = getAverageOfArray(numericArray);
        let mid = getMidpointOfArray(numericArray, mainName);
        let lower25 = get25thPercentileOfArray(numericArray, mainName);
        let higher75 = get75thPercentileOfArray(numericArray, mainName);

        if (numType === "percent") {
          avg *= 100;
          mid *= 100;
          lower25 *= 100;
          higher75 *= 100;
        }

        peerAvg.push(styleNumber(avg, numType, fixedNum))
        peerMid.push(styleNumber(mid, numType, fixedNum))
        peer25.push(styleNumber(lower25, numType, fixedNum))
        peer75.push(styleNumber(higher75, numType, fixedNum))
      } else {
        peerAvg.push(0);
        peerMid.push(0);
        peer25.push(0);
        peer75.push(0);
      }

      clientArray.push(0);
    }
    // Case 4: We have neither peer nor client data
    else {
      peerAvg.push(0);
      peerMid.push(0);
      peer25.push(0);
      peer75.push(0);
      clientArray.push(0);
    }
  });

  // Create result object
  const result = {
    clientArray,
    peerAvg,
    peerMid,
    peer25,
    peer75,
  };

  // Cache the result
  window.chartDataCache[cacheKey] = result;

  return result;
}

// Ensure function is available globally
window.getPeerAndClientChartDataArrays = getPeerAndClientChartDataArrays;

/**
 * Create series data for cash flow charts
 *
 * @param {Array} years - Array of selected years
 * @param {Object} operatingData - Object containing operating cash flow data by year
 * @param {Object} investingData - Object containing investing cash flow data by year
 * @param {Object} financingData - Object containing financing cash flow data by year
 * @param {Object} totalData - Object containing total cash flow data by year
 * @returns {Array} Array of series data for the chart
 */
function getSeriesData(
  years,
  operatingData,
  investingData,
  financingData,
  totalData
) {
  // Initialize empty data arrays for each series
  const operatingValues = [];
  const investingValues = [];
  const financingValues = [];
  const totalValues = [];

  // Collect data for each year
  years.forEach((year) => {
    // Get data for each category, defaulting to 0 if undefined
    const operating =
      operatingData && operatingData[year]
        ? Number(operatingData[year].value)
        : 0;

    const investing =
      investingData && investingData[year]
        ? Number(investingData[year].value)
        : 0;

    const financing =
      financingData && financingData[year]
        ? Number(financingData[year].value)
        : 0;

    const total =
      totalData && totalData[year] ? Number(totalData[year].value) : 0;

    // Add values to respective arrays
    operatingValues.push(operating);
    investingValues.push(investing);
    financingValues.push(financing);
    totalValues.push(total);
  });

  // Create series array
  return [
    {
      name: "Operating",
      data: operatingValues,
    },
    {
      name: "Investing",
      data: investingValues,
    },
    {
      name: "Financing",
      data: financingValues,
    },
    {
      name: "Total",
      data: totalValues,
    },
  ];
}

window.getSeriesData = getSeriesData;

function ensureModalsHaveRows() {
  // List of all expected modals
  const modalIds = [
    "daysCashOnHand",
    "daysExpensesInUnrestrictedNA",
    "daysExpensesInUnrestrictedNA_excludingPPE",
    "liquidityAssetsAvailableCover",
    "totalCoverageRatio",
    "totalContributions",
    "contributionsWithoutDR",
    "contributionsTrend",
    "annualizedInvestmentReturn",
    "functionalExpensePercent_program",
    "functionalExpensePercent_administrative",
    "functionalExpensePercent_fundraising",
    "costOfContributions",
  ];

  modalIds.forEach((id) => {
    const modalSelector = `#${id}_modal`;
    const modal = document.querySelector(modalSelector);

    if (modal) {
      // Check if row exists
      const rowId = `${id}_modal_row`;
      let row = modal.querySelector(`#${rowId}`);

      // If row doesn't exist, find the table and create it
      if (!row) {
        const table = modal.querySelector("table");
        if (table) {
          const thead = table.querySelector("thead");
          if (thead) {
            // Check if there's any row we can use
            const existingRow = thead.querySelector("tr");
            if (existingRow) {
              // Set the ID on the existing row
              existingRow.id = rowId;
            } else {
              // Create a new row with proper ID
              row = document.createElement("tr");
              row.id = rowId;
              thead.appendChild(row);
            }
          }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", ensureModalsHaveRows);
document.addEventListener("DOMContentLoaded", function () {
  // Reset selected years on initial page load
  resetSelectedYearsFromLocalStorage();
  if (selectedYears_Set) {
    selectedYears_Set.clear();
  }
  window.yearSelectionsInitialized = false;
});

window.selectedAreas_Array = window.selectedAreas_Array || new Set();
window.selectedTypes_Array = window.selectedTypes_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();

/**
 * Add unique areas to the options select dropdown
 * Prevents duplicate options by clearing existing content
 * @param {Array} areaArray - Array of area objects
 */
function addUniqueAreasToOptionsSelectAreasDropdown(areaArray) {
  window.selectedAreas_Array = window.selectedAreas_Array || new Set();

  areaArray.forEach((areaObject) => {
    const areaString = areaObject.str;
    window.selectedAreas_Array.add(areaString);
  });

  const optionsListArea = document.getElementById("options-list-area");
  if (!optionsListArea) {
    console.error("Area options list element not found");
    return;
  }

  // Clear existing content
  optionsListArea.innerHTML = "";

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListArea.appendChild(selectAllLabel);

  // Handle "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    const areaCheckboxes = document.querySelectorAll(
      "#options-list-area input[type='checkbox']"
    );

    areaCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox") {
        checkbox.checked = isChecked;
        const areaString = checkbox.value;

        if (isChecked) {
          window.selectedAreas_Array.add(areaString);
        } else {
          window.selectedAreas_Array.delete(areaString);
        }
      }
    });

    // Log change
    // console.log("All areas selected:", isChecked, {
    //   areas: Array.from(window.selectedAreas_Array),
    // });

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });

  // Add area options
  areaArray.forEach((areaObject) => {
    const areaName = areaObject.arr[0];
    const areaString = areaObject.str;
    const uniqueId = `area-option-${areaString}`;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
    );

    const areaInput = document.createElement("input");
    areaInput.setAttribute("type", "checkbox");
    areaInput.setAttribute("id", uniqueId);
    areaInput.setAttribute(
      "class",
      "w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    areaInput.setAttribute("value", areaString);

    // Add the value to selectedAreas_Array and check the input by default
    selectedAreas_Array.add(areaString);
    areaInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = areaName;

    newLabel.appendChild(areaInput);
    newLabel.appendChild(newSpan);

    optionsListArea.appendChild(newLabel);

    // Add change event listener to update selectedAreas_Array
    areaInput.addEventListener("change", function () {
      if (areaInput.checked) {
        selectedAreas_Array.add(areaString);
      } else {
        selectedAreas_Array.delete(areaString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-area input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox")
        .every((input) => input.checked);

      selectAllInput.checked = allChecked;

      // Log change
      // console.log("Area selection changed:", {
      //   area: areaString,
      //   selected: areaInput.checked,
      //   allAreas: Array.from(selectedAreas_Array),
      // });

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // Adjust height if needed
  if (typeof adjustDivHeight === "function") {
    adjustDivHeight();
  }
}

// Function to handle type selection changes
function addUniqueTypesToOptionsSelectTypeDropdown(typeArray) {
  const optionsListType = document.getElementById("options-list-type");
  if (!optionsListType) {
    console.error("Type options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedTypes_Array = window.selectedTypes_Array || new Set();

  // Clear existing content
  optionsListType.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-type");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-type");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-type");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListType.appendChild(selectAllLabel);

  // Populate all types by default
  typeArray.forEach((typeObject) => {
    const typeName = typeObject.arr[0];
    const typeString = typeObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `type_${typeString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", typeString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `type_${typeString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = typeName;

    // Automatically add all types to the set and check the inputs
    window.selectedTypes_Array.add(typeString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListType.appendChild(newListItem);

    // Event listener to update selectedTypes_Array
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        window.selectedTypes_Array.add(typeString);
      } else {
        window.selectedTypes_Array.delete(typeString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-type input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-type")
        .every((input) => input.checked);

      selectAllInput.checked = allChecked;

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    const typeCheckboxes = document.querySelectorAll(
      "#options-list-type input[type='checkbox']"
    );

    typeCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-type") {
        checkbox.checked = isChecked;
        const typeString = checkbox.value;

        if (isChecked) {
          window.selectedTypes_Array.add(typeString);
        } else {
          window.selectedTypes_Array.delete(typeString);
        }
      }
    });

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Utility function to convert Set to Array
 * @param {Set} set - Set to convert
 * @returns {Array} Array containing all values from the set
 */
function setToArray(set) {
  return Array.from(set);
}
