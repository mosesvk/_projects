const yearsData_Array = [];
const selectedYearsselectedYears_Array = [];
const regions_Array = [
  { arr: ["Europe"], str: "NE" },
  {
    arr: ["Asia"],
    str: "MA",
  },
  {
    arr: ["Africa"],
    str: "SO",
  },
  { arr: ["South America"], str: "MW" },
  { arr: ["North America"], str: "PL" },
  {
    arr: ["Australia"],
    str: "MT",
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

let selectedRegion = "";
const selectedRegions_Array = new Set();
const selectedSites_Array = [];
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
    // if (mainName == 'functionalExpensePercent_program') console.log({ parsedData, chart, peer, client, type, fixedNum, mainName });
    updateModal(mainName, parsedData[peer], parsedData[client], parsedData);
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
  // console.log('createChart()', { chartId, dataPeer, dataClient, type, fixedNum });
  document.getElementById(chartId).innerHTML = "";

  dataUrLObj[mainName] = chartId;

  let chartOptions;

  if (mainName === "functionalAllocation") {
    chartOptions = getFunctionalAllocationChartOptions(
      dataPeer,
      dataClient,
      type,
      fixedNum,
      mainName,
      wa,
      parsedData
    );
  } else if (mainName === "costOfContributionsDetailView") {
    chartOptions = getCostOfContributionsDetailViewOptions(
      dataPeer,
      dataClient,
      type,
      fixedNum,
      mainName,
      wa,
      parsedData
    );
  } else if (mainName === "netAssetBreakdown") {
    chartOptions = getNetAssetBreakdownOptions(
      dataPeer,
      dataClient,
      type,
      fixedNum,
      mainName,
      wa,
      parsedData
    );
  } else if (chartType == "line") {
    chartOptions = getLineChartOptions(
      dataPeer,
      dataClient,
      type,
      fixedNum,
      mainName,
      wa,
      parsedData,
      benchmark,
      title
    );
  } else {
    chartOptions = getMainChartOptions(
      dataPeer,
      dataClient,
      type,
      fixedNum,
      mainName,
      wa,
      parsedData,
      benchmark,
      title
    );
  }

  const chartIds = [
    "daysCashOnHand_chart",
    "daysExpensesInUnrestrictedNA_chart",
    "daysExpensesInUnrestrictedNA_excludingPPE_chart",
    "liquidityAssetsAvailableCover_chart",
    "totalCoverageRatio_chart",
    "assetsWithoutPpeToLiabilitiesWithoutDebt_chart",
    "contributionsTrend_chart",
    "annualizedInvestmentReturn_chart",
    "functionalExpensePercent_program_chart",
    "functionalExpensePercent_administrative_chart",
    "functionalExpensePercent_fundraising_chart",
    "costOfContributionsDetailView_chart",
    "costOfContributions_chart",
    "functionalAllocation_chart",
    "netAssetBreakdown_chart",
    "changeInNetAssets_chart",
    "totalContributions_chart",
    "contributionsWithoutDR_chart",
  ];

  if (chartIds.includes(chartId)) {
    if (chartId === "daysCashOnHand_chart") {
      daysCashOnHand_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      daysCashOnHand_chart.render();
      document.addEventListener("dark-mode", function () {
        daysCashOnHand_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "daysExpensesInUnrestrictedNA_chart") {
      daysExpensesInUnrestrictedNA_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      daysExpensesInUnrestrictedNA_chart.render();
      document.addEventListener("dark-mode", function () {
        daysExpensesInUnrestrictedNA_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "daysExpensesInUnrestrictedNA_excludingPPE_chart") {
      daysExpensesInUnrestrictedNA_excludingPPE_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      daysExpensesInUnrestrictedNA_excludingPPE_chart.render();
      document.addEventListener("dark-mode", function () {
        daysExpensesInUnrestrictedNA_excludingPPE_chart.updateOptions(
          chartOptions
        );
      });
    } else if (chartId === "liquidityAssetsAvailableCover_chart") {
      liquidityAssetsAvailableCover_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      liquidityAssetsAvailableCover_chart.render();
      document.addEventListener("dark-mode", function () {
        liquidityAssetsAvailableCover_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "totalCoverageRatio_chart") {
      totalCoverageRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      totalCoverageRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        totalCoverageRatio_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "assetsWithoutPpeToLiabilitiesWithoutDebt_chart") {
      assetsWithoutPpeToLiabilitiesWithoutDebt_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      assetsWithoutPpeToLiabilitiesWithoutDebt_chart.render();
      document.addEventListener("dark-mode", function () {
        assetsWithoutPpeToLiabilitiesWithoutDebt_chart.updateOptions(
          chartOptions
        );
      });
    } else if (chartId === "contributionsTrend_chart") {
      contributionsTrend_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      contributionsTrend_chart.render();
      document.addEventListener("dark-mode", function () {
        contributionsTrend_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "annualizedInvestmentReturn_chart") {
      annualizedInvestmentReturn_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      annualizedInvestmentReturn_chart.render();
      document.addEventListener("dark-mode", function () {
        annualizedInvestmentReturn_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "functionalExpensePercent_program_chart") {
      functionalExpensePercent_program_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      functionalExpensePercent_program_chart.render();
      document.addEventListener("dark-mode", function () {
        functionalExpensePercent_program_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "functionalExpensePercent_administrative_chart") {
      functionalExpensePercent_administrative_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      functionalExpensePercent_administrative_chart.render();
      document.addEventListener("dark-mode", function () {
        functionalExpensePercent_administrative_chart.updateOptions(
          chartOptions
        );
      });
    } else if (chartId === "functionalExpensePercent_fundraising_chart") {
      functionalExpensePercent_fundraising_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      functionalExpensePercent_fundraising_chart.render();
      document.addEventListener("dark-mode", function () {
        functionalExpensePercent_fundraising_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "costOfContributionsDetailView_chart") {
      costOfContributionsDetailView_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      costOfContributionsDetailView_chart.render();
      document.addEventListener("dark-mode", function () {
        costOfContributionsDetailView_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "costOfContributions_chart") {
      costOfContributions_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      costOfContributions_chart.render();
      document.addEventListener("dark-mode", function () {
        costOfContributions_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "functionalAllocation_chart") {
      functionalAllocation_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      functionalAllocation_chart.render();
      document.addEventListener("dark-mode", function () {
        functionalAllocation_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "netAssetBreakdown_chart") {
      netAssetBreakdown_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      netAssetBreakdown_chart.render();
      document.addEventListener("dark-mode", function () {
        netAssetBreakdown_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "changeInNetAssets_chart") {
      changeInNetAssets_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      changeInNetAssets_chart.render();
      document.addEventListener("dark-mode", function () {
        changeInNetAssets_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "totalContributions_chart") {
      totalContributions_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      totalContributions_chart.render();
      document.addEventListener("dark-mode", function () {
        totalContributions_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "contributionsWithoutDR_chart") {
      contributionsWithoutDR_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      contributionsWithoutDR_chart.render();
      document.addEventListener("dark-mode", function () {
        contributionsWithoutDR_chart.updateOptions(chartOptions);
      });
    }
  }
};

function updateModal(mainName, peerData, clientData, parsedData) {
  console.log(`Updating modal for ${mainName}`, { peerData, clientData });

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
    console.warn(`Modal element with selector "${modalSelector}" not found`);
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
  populateModalContent(headerRow, selectedYears, clientData, peerData);
}

function populateModalContent(headerRow, selectedYears, clientData, peerData) {
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

  // Add data rows for each year
  selectedYears.forEach((year) => {
    const yearRow = createYearRow(headerRow.id.replace("_row", ""), year);
    tableHead.appendChild(yearRow);

    // Now add client data to this row if available
    if (clientData && clientData[year]) {
      addClientDataToModalRow(yearRow, clientData[year].value, "number", 2);
    }

    // Add peer data if available
    if (peerData && peerData[year]) {
      const peerValues = peerData[year];
      // Calculate peer stats
      const peerAvg = Array.isArray(peerValues)
        ? getAverageOfArray(peerValues)
        : 0;
      const peerMid = Array.isArray(peerValues)
        ? getMidpointOfArray(peerValues)
        : 0;
      const peer25 = Array.isArray(peerValues)
        ? get25thPercentileOfArray(peerValues)
        : 0;
      const peer75 = Array.isArray(peerValues)
        ? get75thPercentileOfArray(peerValues)
        : 0;

      addPeerDataToModalRow(yearRow, peerAvg, peerMid, peer25, peer75);
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
  // Convert string values to numbers
  let numericArr
  if (type == "percent") {
    numericArr = arr.map((value) => value);
  } else {
    numericArr = arr.map((value) => parseFloat(value));
  }

  // Sort the array in ascending order
  const sortedArr = numericArr.slice().sort((a, b) => a - b);

  // if (fixed == 2) console.log({sortedArr})

  const getPercentile = (percentile) => {
    const index = (percentile / 100) * (sortedArr.length - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    if (lowerIndex === upperIndex) {
      return fixed !== undefined
        ? parseFloat(sortedArr[lowerIndex].toFixed(fixed))
        : sortedArr[lowerIndex];
    }

    const lowerValue = sortedArr[lowerIndex];
    const upperValue = sortedArr[upperIndex];
    const fraction = index - lowerIndex;

    const result = lowerValue + fraction * (upperValue - lowerValue);
    return fixed !== undefined ? parseFloat(result.toFixed(fixed)) : result;
  };

  const q1 = getPercentile(25);
  const median = getPercentile(50);
  const q3 = getPercentile(75);

  return [q1, median, q3];
}

function getUrlBasedOnYearCount(format, RecordId) {
  const yearCount = selectedYears_Set.size;
  let url = "";

  switch (yearCount) {
    case 1:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=42&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    case 2:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=41&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    case 3:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=40&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    case 4:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=39&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    case 5:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=38&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    case 6:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=37&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    case 7:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=36&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    case 8:
      url = `https://www.quickbaseutilities1.com/CapinTechnology_1795/XL%20Docs/ExcelGen_UA.aspx?clientid=Q1795&appid=bps9da9i5&tpdbid=bsaavek7s&tpid=35&fn=InternationalSummary&dbid=bt76haf6m&msid=${RecordId}&docfmt=${format}&stream=y&apptoken=---`;
      break;
    default:
      console.error("Invalid year count");
  }

  console.log(
    `Generated URL for format ${format} and RecordId ${RecordId}: ${url}`
  ); // Add this line to log the generated URL
  return url;
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
  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage();

  if (Array.isArray(storedYears)) {
    selectedYears_Set = new Set(storedYears);
  }

  optionsListElement.innerHTML = "";

  yearsArray.sort((a, b) => b - a);

  yearsArray.forEach((year) => {
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${year}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
    );

    // w-4 h-4 mr-2

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${year}`);
    newInput.setAttribute(
      "class",
      `form-checkbox h-4 w-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-300 dark:border-gray-500 mr-2 cursor-pointer`
    );
    newInput.setAttribute("value", year);
    newInput.checked = selectedYears_Set.has(year);

    newInput.addEventListener("change", (e) =>
      changeListenerForInputYears(e.target, year)
    );

    const newSpan = document.createElement("span");
    newSpan.innerText = year;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListElement.appendChild(newLabel);
  });
};

// Enhanced addClientDataToModalRow function
function addClientDataToModalRow(yearRow, clientValue, type, fixedNum) {
  console.log(`Adding client data to row: ${yearRow.id}`, {
    clientValue,
    type,
    fixedNum,
  });

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

function addPeerDataToModalRow(
  yearRow,
  avgValue,
  midValue,
  p25Value,
  p75Value
) {
  console.log(`Adding peer data to row: ${yearRow.id}`, {
    avgValue,
    midValue,
    p25Value,
    p75Value,
  });

  // Add average value cell
  const avgCell = document.createElement("td");
  avgCell.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  avgCell.textContent =
    avgValue !== undefined && avgValue !== null ? avgValue.toFixed(2) : "-";
  yearRow.appendChild(avgCell);

  // Add 25th percentile cell
  const p25Cell = document.createElement("td");
  p25Cell.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  p25Cell.textContent =
    p25Value !== undefined && p25Value !== null ? p25Value.toFixed(2) : "-";
  yearRow.appendChild(p25Cell);

  // Add median cell
  const midCell = document.createElement("td");
  midCell.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  midCell.textContent =
    midValue !== undefined && midValue !== null ? midValue.toFixed(2) : "-";
  yearRow.appendChild(midCell);

  // Add 75th percentile cell
  const p75Cell = document.createElement("td");
  p75Cell.className =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  p75Cell.textContent =
    p75Value !== undefined && p75Value !== null ? p75Value.toFixed(2) : "-";
  yearRow.appendChild(p75Cell);
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
  if (!element) console.log(elementId);

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
  console.log("hit showLoading()");

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
  console.log("Using primary event listener from qbApi.js");

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
 * Extracts peer and client data arrays from the parsed data
 * This function is used by multiple chart configuration components
 *
 * @param {Array} years - Array of selected years
 * @param {Object} dataPeer - Peer data object
 * @param {Object} dataClient - Client data object
 * @param {Number} fixedNum - Number of decimal places for formatting
 * @param {String} mainName - Name identifier for the chart
 * @param {String} numType - Data type (percent, dollar, number)
 * @param {Boolean|String} wa - Whether to use weighted average
 * @returns {Object} Object containing formatted data arrays
 */
// Fix for the getPeerAndClientChartDataArrays function in Utility.js
// This function is used throughout the system to extract and format data

function getPeerAndClientChartDataArrays(
  years,
  dataPeer,
  dataClient,
  fixedNum,
  mainName,
  numType,
  wa
) {
  // Initialize arrays
  const peerAvg = [];
  const peerMid = [];
  const peer25 = [];
  const peer75 = [];
  const clientArray = [];

  // Special flag for annualizedInvestmentReturn to avoid double percentage conversion
  const isAnnualizedInvestmentReturn =
    mainName === "annualizedInvestmentReturn";

  // Process each year
  years.forEach((year) => {
    if (dataPeer !== undefined && dataClient !== undefined) {
      // Get peer data array
      const dataArray = dataPeer[year];

      // Handle missing data
      if (!dataArray) {
        peerAvg.push(0);
        peerMid.push(0);
        peer25.push(0);
        peer75.push(0);

        // Get client data
        let clientNum = dataClient[year]?.value
          ? Number(dataClient[year].value)
          : 0;

        // Convert to percentage if needed, but not for annualizedInvestmentReturn in the chart
        // (we'll handle that separately)
        if (numType === "percent" && !isAnnualizedInvestmentReturn) {
          clientNum *= 100;
        }

        clientArray.push(clientNum);
        return;
      }

      // Calculate statistics
      let avg, mid, lower25, higher75;

      // Use weighted average if requested
      if (
        wa === "wa" &&
        typeof window.getWeightedAverageOfArray === "function"
      ) {
        try {
          // Calculate weighted average with year parameter
          avg = window.getWeightedAverageOfArray(dataPeer, mainName, year);

          // For other percentiles, use regular calculations
          const array = dataArray.map((item) => Number(item || 0));
          mid = getMidpointOfArray(array, mainName);
          lower25 = get25thPercentileOfArray(array, mainName);
          higher75 = get75thPercentileOfArray(array, mainName);
        } catch (error) {
          console.error(
            `Error calculating weighted average for ${mainName}:`,
            error
          );
          // Fall back to regular statistics
          const array = dataArray.map((item) => Number(item || 0));
          avg = getAverageOfArray(array);
          mid = getMidpointOfArray(array, mainName);
          lower25 = get25thPercentileOfArray(array, mainName);
          higher75 = get75thPercentileOfArray(array, mainName);
        }
      } else {
        // Use regular statistics
        const array = dataArray.map((item) => Number(item || 0));
        avg = getAverageOfArray(array);
        mid = getMidpointOfArray(array, mainName);
        lower25 = get25thPercentileOfArray(array, mainName);
        higher75 = get75thPercentileOfArray(array, mainName);
      }

      // Get client value
      let clientNum = dataClient[year]?.value
        ? Number(dataClient[year].value)
        : 0;

      // Convert to percentage if needed, but not for annualizedInvestmentReturn in the chart
      if (numType === "percent" && !isAnnualizedInvestmentReturn) {
        avg *= 100;
        mid *= 100;
        lower25 *= 100;
        higher75 *= 100;
        clientNum *= 100;
      }

      // For annualizedInvestmentReturn specifically in the chart, we need to
      // handle the client data specially to ensure it shows as a percentage
      if (isAnnualizedInvestmentReturn && numType === "percent") {
        // For the chart, we want to make sure the data is properly displayed as percentages
        // Make sure client data is showing as a percentage (this is for the chart)
        clientNum *= 100;
      }

      // Format values and add to result arrays
      peerAvg.push(parseFloat(avg.toFixed(fixedNum)));
      peerMid.push(parseFloat(mid.toFixed(fixedNum)));
      peer25.push(parseFloat(lower25.toFixed(fixedNum)));
      peer75.push(parseFloat(higher75.toFixed(fixedNum)));
      clientArray.push(clientNum);
    } else {
      // Handle cases with missing data
      peerAvg.push(0);
      peerMid.push(0);
      peer25.push(0);
      peer75.push(0);

      if (dataPeer === undefined && dataClient) {
        let clientNum = dataClient[year]?.value
          ? Number(dataClient[year].value)
          : 0;

        // Convert to percentage if needed, but handle annualizedInvestmentReturn specially
        if (numType === "percent") {
          if (isAnnualizedInvestmentReturn) {
            // For annualizedInvestmentReturn, we need to ensure the client data shows as percentage
            clientNum *= 100;
          } else {
            // Normal percentage conversion
            clientNum *= 100;
          }
        }

        clientArray.push(clientNum);
      } else {
        clientArray.push(0);
      }
    }
  });

  return { clientArray, peerAvg, peerMid, peer25, peer75 };
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

// Ensure functions are available globally
window.getPeerAndClientChartDataArrays = getPeerAndClientChartDataArrays;
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
