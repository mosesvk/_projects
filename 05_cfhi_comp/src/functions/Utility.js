
// console.log('utility.js----')

// Initialize global variables for client filtering and data management
window.yearsData_Array = window.yearsData_Array || [];
const selectedYearsselectedYears_Array = [];

// CFHI-specific data arrays (adapted from testUtility.js structure)
const regions_Array = [
  { arr: ["New England (CT, RI, MA, VT, NH)"], str: "NE" },
  {
    arr: ["Mid-Atlantic, VA, WV, MD, DE, NJ, NY, PA, DC)"],
    str: "MA",
  },
  {
    arr: ["South, AR, LA, AL, TN, KY, GA, FL, SC, NC, MS)"],
    str: "SO",
  },
  { arr: ["Midwest, WI, IL, IN, MI, OH, IA, MN)"], str: "MW" },
  { arr: ["Plains, KS, MO, OK, TX, ND, SD, NE)"], str: "PL" },
  {
    arr: ["Mountain/Southwest, ID, MT, WY, CO, UT, NV, AZ, NM)"],
    str: "MT",
  },
  { arr: ["West Coast, CA, OR, WA)"], str: "WC" },
];

const sites_Array = [
  { arr: ["Single Site"], str: "SINGLE" },
  { arr: ["2 - 5 Sites"], str: "TWOSIX" },
  { arr: ["6+ Sites"], str: "MANY" },
];

let sliderAmount = null;
let sliderRange = null;
let totalRecordsPeer = 0;
let totalRecordsClient = 0;
// Make sure these are window-scoped variables
window.peerRecordMapPerYear = window.peerRecordMapPerYear || new Map();
const peerRecordMapPerYear = window.peerRecordMapPerYear;
window.sliderValue = window.sliderValue || 0;
window.sliderValue2 = window.sliderValue2 || 25000;

let selectedRegion = "";
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedSites_Array = window.selectedSites_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();
let selectedSchoolChurch_Selected;
const map_dataUri = new Map();
const dataUrLObj = new Object();
let uniqueClientNames = []

// CHARTS - Make these global variables accessible via window
window.givingUnits_chart = null;
window.givingUnitsToStaff_chart = null;
window.daysExpendableNetAssets_chart = null;
window.daysOperatingCash_chart = null;
window.availableDaysOfCashFlow_chart = null;
window.liquidityRatio_chart = null;
window.netCashAvailability_chart = null;
window.debtToContributionsWithout_chart = null;
window.currentRatio_chart = null;
window.mandatoryDebtServiceToContributionsWithout_chart = null;
window.debtPerGivingUnit_chart = null;
window.debtCoverage_chart = null;
window.netIncomeRatio_chart = null;
window.contributionsWithoutDonorPerGivingUnit_chart = null;
window.totalContributionsPerGivingUnit_chart = null;
window.benefitsToSalaries_chart = null;
window.salariesBenefitsIncludingOutsourcedEmployees_chart = null;
window.personnelToCashExpenditure_chart = null;
window.cashExpendituresPerGivingUnit_chart = null;


// annotation - removed CFI-specific annotations

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
    <div class="ms-3 text-lg font-normal">${textString}</div>
    <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
  `;

  // Create click outside handler
  const clickOutsideHandler = (event) => {
    if (!toastSuccessDiv.contains(event.target)) {
      toastSuccessDiv.remove();
      document.body.removeEventListener("click", clickOutsideHandler);
    }
  };

  // Add click outside listener
  document.body.addEventListener("click", clickOutsideHandler);

  // Add close button handler
  const closeButton = toastSuccessDiv.querySelector(
    '[data-dismiss-target="#toast-success"]'
  );
  closeButton.addEventListener("click", () => {
    toastSuccessDiv.remove();
    document.body.removeEventListener("click", clickOutsideHandler);
  });

  document.body.appendChild(toastSuccessDiv);
};

const createChartFromParsedData = (
  parsedData,
  chart,
  peer,
  client,
  type,
  fixedNum,
  mainName,
  benchmark,
  title
) => {
  if (parsedData) {
    // console.log('createChartFromParsedData', { parsedData, chart, peer, client, type, fixedNum, mainName });

    createChart(
      chart,
      parsedData[peer],
      parsedData[client],
      type,
      fixedNum,
      mainName,
      benchmark,
      title
    );
    updateModal (mainName, parsedData[peer], parsedData[client]);
  }
};

const createChart = (
  chartId,
  dataPeer,
  dataClient,
  type,
  fixedNum,
  mainName,
  benchmark,
  title
) => {
  document.getElementById(chartId).innerHTML = "";

  dataUrLObj[mainName] = chartId;

  const chartOptions = getMainChartOptions(
    dataPeer,
    dataClient,
    type,
    fixedNum,
    mainName,
    benchmark,
    title,
    chartId
  );

  // Check if chartOptions is null (invalid data)
  if (!chartOptions) {
    console.warn(`Cannot create chart ${chartId} - invalid chart options`);
    return;
  }

  const chartIds = [
    "givingUnits_chart",
    "givingUnitsToStaff_chart",
    "daysExpendableNetAssets_chart",
    "daysOperatingCash_chart",
    "availableDaysOfCashFlow_chart",
    "liquidityRatio_chart",
    "netCashAvailability_chart",
    "debtToContributionsWithout_chart",
    "currentRatio_chart",
    "mandatoryDebtServiceToContributionsWithout_chart",
    "debtPerGivingUnit_chart",
    "debtCoverage_chart",
    "netIncomeRatio_chart",
    "contributionsWithoutDonorPerGivingUnit_chart",
    "totalContributionsPerGivingUnit_chart",
    "benefitsToSalaries_chart",
    "salariesBenefitsIncludingOutsourcedEmployees_chart",
    "personnelToCashExpenditure_chart",
    "cashExpendituresPerGivingUnit_chart",
  ];

  if (chartIds.includes(chartId)) {
    if (chartId === "givingUnits_chart") {
      window.givingUnits_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.givingUnits_chart.render();
      document.addEventListener("dark-mode", function () {
        window.givingUnits_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "givingUnitsToStaff_chart") {
      window.givingUnitsToStaff_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.givingUnitsToStaff_chart.render();
      document.addEventListener("dark-mode", function () {
        window.givingUnitsToStaff_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "daysExpendableNetAssets_chart") {
      window.daysExpendableNetAssets_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.daysExpendableNetAssets_chart.render();
      document.addEventListener("dark-mode", function () {
        window.daysExpendableNetAssets_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "daysOperatingCash_chart") {
      window.daysOperatingCash_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.daysOperatingCash_chart.render();
      document.addEventListener("dark-mode", function () {
        window.daysOperatingCash_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "availableDaysOfCashFlow_chart") {
      window.availableDaysOfCashFlow_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.availableDaysOfCashFlow_chart.render();
      document.addEventListener("dark-mode", function () {
        window.availableDaysOfCashFlow_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "liquidityRatio_chart") {
      window.liquidityRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.liquidityRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        window.liquidityRatio_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "netCashAvailability_chart") {
      window.netCashAvailability_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.netCashAvailability_chart.render();
      document.addEventListener("dark-mode", function () {
        window.netCashAvailability_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "debtToContributionsWithout_chart") {
      window.debtToContributionsWithout_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.debtToContributionsWithout_chart.render();
      document.addEventListener("dark-mode", function () {
        window.debtToContributionsWithout_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "currentRatio_chart") {
      window.currentRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.currentRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        window.currentRatio_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "mandatoryDebtServiceToContributionsWithout_chart") {
      window.mandatoryDebtServiceToContributionsWithout_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.mandatoryDebtServiceToContributionsWithout_chart.render();
      document.addEventListener("dark-mode", function () {
        window.mandatoryDebtServiceToContributionsWithout_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "debtPerGivingUnit_chart") {
      window.debtPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.debtPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        window.debtPerGivingUnit_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "debtCoverage_chart") {
      window.debtCoverage_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.debtCoverage_chart.render();
      document.addEventListener("dark-mode", function () {
        window.debtCoverage_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "netIncomeRatio_chart") {
      window.netIncomeRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.netIncomeRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        window.netIncomeRatio_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "contributionsWithoutDonorPerGivingUnit_chart") {
      window.contributionsWithoutDonorPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.contributionsWithoutDonorPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        window.contributionsWithoutDonorPerGivingUnit_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "totalContributionsPerGivingUnit_chart") {
      window.totalContributionsPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.totalContributionsPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        window.totalContributionsPerGivingUnit_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "benefitsToSalaries_chart") {
      window.benefitsToSalaries_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.benefitsToSalaries_chart.render();
      document.addEventListener("dark-mode", function () {
        window.benefitsToSalaries_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "salariesBenefitsIncludingOutsourcedEmployees_chart") {
      window.salariesBenefitsIncludingOutsourcedEmployees_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.salariesBenefitsIncludingOutsourcedEmployees_chart.render();
      document.addEventListener("dark-mode", function () {
        window.salariesBenefitsIncludingOutsourcedEmployees_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "personnelToCashExpenditure_chart") {
      window.personnelToCashExpenditure_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.personnelToCashExpenditure_chart.render();
      document.addEventListener("dark-mode", function () {
        window.personnelToCashExpenditure_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cashExpendituresPerGivingUnit_chart") {
      window.cashExpendituresPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.cashExpendituresPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        window.cashExpendituresPerGivingUnit_chart.updateOptions(chartOptions);
      });
    }
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

const getAverageOfArray = (array, name, num = 1) => {
  
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value) * num);

  if (filteredArray.length === 0) {
    return 0;
  }
  const sum = filteredArray.reduce((acc, value) => acc + value, 0);
  const avg = sum / filteredArray.length;

  // if (name == 'givingUnits') console.log('getAverageOfArray', {array, num, filteredArray, sum, avg});


  return avg;
};

const getMidpointOfArray = (array, mainName) => {
  // console.log({ mainName, array });
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value));

  // console.log({mainName, filteredArray});
  if (filteredArray.length === 0) {
    return 0;
  }

  filteredArray.sort((a, b) => a - b); // Sort the array

  // if (mainName == "cfi_netIncomeOperationsRatio")
  //   console.log("getMidpointOfArray", { filteredArray, mainName });

  const midpoint = Math.floor(filteredArray.length / 2); // Calculate the midpoint index

  if (filteredArray.length % 2 === 1) {
    // If odd length, return the value at the midpoint
    return Number(filteredArray[midpoint]);
  } else {
    // If even length, return the average of the two midpoints
    return (
      (Number(filteredArray[midpoint - 1]) + Number(filteredArray[midpoint])) /
      2
    );
  }
};

const get25thPercentileOfArray = (array, mainName) => {
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value));

  // if (mainName == "cfi_primaryReserveRatio")
  //   console.log("get25thPercentileOfArray", { filteredArray, mainName });

  const sortedArray = filteredArray.sort((a, b) => a - b);
  // console.log(sortedArray);

  // Step 2: Check if the array has less than or equal to 2 elements
  if (sortedArray.length <= 2) {
    // If array has 1 or 2 elements, return the average of the elements
    return (
      sortedArray.reduce((acc, val) => Number(acc) + Number(val), 0) /
      sortedArray.length
    );
  }

  // Step 3: Calculate the index for the 25th percentile
  const index = (sortedArray.length + 1) * 0.25;

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
    return (lowerValue + upperValue) / 2;
  }
};

const get75thPercentileOfArray = (array, mainName) => {
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value));

  // if (mainName == "cfi_primaryReserveRatio")
  //   console.log("get75thPercentileOfArray", { filteredArray, mainName });

  // Step 1: Sort the array in ascending order
  const sortedArray = filteredArray.sort((a, b) => a - b);

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
    return (lowerValue + upperValue) / 2;
  }
};

const getSumOfArray = (array) => {
  // console.log('getSumOfArray', array);
  
  if (array === null || array === undefined) return 0;
  const filteredArray = array.filter((value) => Number(value) !== 0);

  // console.log(array);
  if (filteredArray.length === 0) {
    return 0;
  }

  return filteredArray.reduce((sum, value) => sum + parseFloat(value) || 0, 0);
};

const formatCurrency = (value, fixedNum = 0) => {
  if (value === undefined || value === null || value === 0) return "-"; // Fallback for missing data or zero
  return `$${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fixedNum, // For whole number if fixedNum is true
    maximumFractionDigits: fixedNum,
  }).format(value)}`;
};

const getSelectedYearsFromLocalStorage = () => {
  const storedSelectedYears = JSON.parse(localStorage.getItem("selectedYears"));
  // console.log({'getSelectedYearsFrmLS': storedSelectedYears});

  const storedData = localStorage.getItem("demo");
  if (!storedSelectedYears && storedData) {
    console.error("Need to Select Year");
  }

  if (storedSelectedYears) {
    // console.log("Selected Years: ", storedSelectedYears);
    // console.log("Sort: ", storedSelectedYears.sort((a, b) => a - b));
    return storedSelectedYears;
  }
};

const resetSelectedYearsFromLocalStorage = () => {
  localStorage.setItem("selectedYears", JSON.stringify([]));
};

let selectedYears_Set = new Set();

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
  const optionsListElement = document.getElementById("options-list-year");

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


  // optionsListElement.appendChild(selectAllLabel);

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
      { selectId: "custom-select-year", optionsId: "options-list-year" },
      { selectId: "custom-select-region", optionsId: "options-list-region" },
      { selectId: "custom-select-site", optionsId: "options-list-site" },
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

// Enhanced addClientDataToModalRow function
// function addClientDataToModalRow(yearRow, clientValue, type, fixedNum) {
//   // console.log(`Adding client datfa to row: ${yearRow.id}`, {
//   //   clientValue,
//   //   type,
//   //   fixedNum,
//   // });

//   const cell = document.createElement("td");
//   cell.className =
//     "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";

//   // Format the value
//   const formattedValue =
//     clientValue !== undefined && clientValue !== null
//       ? styleNumber(clientValue, type, fixedNum)
//       : "-";

//   cell.textContent = formattedValue;
//   yearRow.appendChild(cell);

//   return cell;
// }

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

const getPeerAndClientChartDataArrays = (
  years,
  dataPeer,
  dataClient,
  fixedNum,
  mainName,
  benchmark,
  type
) => {
  // console.log({ years, dataPeer, dataClient, fixedNum, mainName, benchmark, type });

  const peerAvg = [];
  const peerMid = [];
  const peer25 = [];
  const peer75 = [];
  const clientArray = [];
  const benchmarkArray = [];

  years.forEach((year) => {
    // if (mainName == "cfi_netIncomeOperationsRatio")
    //   console.log({ mainName, year, client: dataClient[year], peer: dataPeer, type, fixedNum });

    benchmarkArray.push(benchmark);

    if (!dataPeer && dataClient[year]) {
      // console.log('---- hit ELSE if');

      peerAvg.push(null);
      peerMid.push(null);
      peer25.push(null);
      peer75.push(null);

      // Handle client data with better error checking
      let clientValue;
      if (dataClient[year] && typeof dataClient[year] === 'object' && dataClient[year].hasOwnProperty('value')) {
        clientValue = dataClient[year].value;
      } else if (typeof dataClient[year] === 'number' || typeof dataClient[year] === 'string') {
        clientValue = dataClient[year];
      } else {
        console.warn(`Invalid client data structure for ${mainName} year ${year}:`, dataClient[year]);
        clientValue = null;
      }

      if (clientValue !== null && clientValue !== undefined) {
        // Extract raw numeric value, removing commas if present
        let clientNum = typeof clientValue === 'string' ? 
          parseFloat(clientValue.replace(/,/g, '')) : parseFloat(clientValue);
        
        // Only multiply by 100 for percentages (ApexCharts expects percentage values as 0-100, not 0-1)
        if (type === "percent") {
          clientNum *= 100;
        }
        
        clientArray.push(clientNum);
      } else {
        clientArray.push(null);
      }
    } else if (dataPeer[year] !== undefined && dataClient[year] !== undefined) {
      // console.log('---- hit if');

      let numToTimesByIfPercent = 1;
      if (type == "percent") numToTimesByIfPercent = 100;

      const array = dataPeer[year];
      // if (mainName == 'cfiRatio') console.log(array)
      let avg = getAverageOfArray(array);
      avg *= numToTimesByIfPercent;
      let mid = getMidpointOfArray(array);
      mid *= numToTimesByIfPercent;
      let lower25 = get25thPercentileOfArray(array);
      lower25 *= numToTimesByIfPercent;
      let higher75 = get75thPercentileOfArray(array);
      higher75 *= numToTimesByIfPercent;

      // if (mainName == 'cfi_netIncomeOperationsRatio') console.log({mainName, avg, mid, lower25, higher75 });

      peerAvg.push(avg.toFixed(fixedNum));
      peerMid.push(mid.toFixed(fixedNum));
      peer25.push(lower25.toFixed(fixedNum));
      peer75.push(higher75.toFixed(fixedNum));

      // if (mainName == "cfi_netIncomeOperationsRatio") console.log({mainName, peerAvg, peerMid, peer25, peer75});

      // Handle client data with better error checking
      let clientValue;
      if (dataClient[year] && typeof dataClient[year] === 'object' && dataClient[year].hasOwnProperty('value')) {
        clientValue = dataClient[year].value;
      } else if (typeof dataClient[year] === 'number' || typeof dataClient[year] === 'string') {
        clientValue = dataClient[year];
      } else {
        console.warn(`Invalid client data structure for ${mainName} year ${year}:`, dataClient[year]);
        clientValue = null;
      }

      if (clientValue !== null && clientValue !== undefined) {
        // Extract raw numeric value, removing commas if present
        let clientNum = typeof clientValue === 'string' ? 
          parseFloat(clientValue.replace(/,/g, '')) : parseFloat(clientValue);
        
        // Only multiply by 100 for percentages (ApexCharts expects percentage values as 0-100, not 0-1)
        if (type === "percent") {
          clientNum *= 100;
        }
        
        clientArray.push(clientNum);
      } else {
        clientArray.push(null);
      }

      // if (mainName === "givingUnits") console.log('getPeerAndClientChartDataArrays', {
      //   clientValue, 
      //   'dataClient[year].value': dataClient[year].value,
      //   dataClient,
      //   type,
      //   fixedNum,
      //   mainName,
      // });
    } else if (dataPeer[year] === undefined && dataClient[year]) {
      // console.log('---- hit ELSE if');

      peerAvg.push(null);
      peerMid.push(null);
      peer25.push(null);
      peer75.push(null);

      // Handle client data with better error checking
      let clientValue;
      if (dataClient[year] && typeof dataClient[year] === 'object' && dataClient[year].hasOwnProperty('value')) {
        clientValue = dataClient[year].value;
      } else if (typeof dataClient[year] === 'number' || typeof dataClient[year] === 'string') {
        clientValue = dataClient[year];
      } else {
        console.warn(`Invalid client data structure for ${mainName} year ${year}:`, dataClient[year]);
        clientValue = null;
      }

      if (clientValue !== null && clientValue !== undefined) {
        // Extract raw numeric value, removing commas if present
        let clientNum = typeof clientValue === 'string' ? 
          parseFloat(clientValue.replace(/,/g, '')) : parseFloat(clientValue);
        
        // Only multiply by 100 for percentages (ApexCharts expects percentage values as 0-100, not 0-1)
        if (type === "percent") {
          clientNum *= 100;
        }
        
        clientArray.push(clientNum);
      } else {
        clientArray.push(null);
      }
    } else if (dataClient == undefined || dataPeer == undefined) {
      throw new Error(
        `No Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
      createToastWarning(
        `check Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
    }

    // if (mainName == "demoOverall") console.log({clientArray, dataClient});
  });

  return { clientArray, peerAvg, peerMid, peer25, peer75, benchmarkArray };
};

const formatDecimal = (val, fixedNum) => {
  // Check if val is null or undefined
  if (val == null) {
    return "";
  }

  // Convert val to a string
  let valStr = val.toString();

  // Add ".0" if fixedNum is 1 and val does not have a decimal point
  if (fixedNum === 1 && !valStr.includes(".")) {
    return valStr + ".0";
  }

  // Add ".00" if fixedNum is 2 and val does not have a decimal point
  if (fixedNum === 2 && !valStr.includes(".")) {
    return valStr + ".00";
  }

  // If val already has a decimal point, ensure it has the correct number of decimal places
  if (fixedNum === 2 && valStr.split(".")[1].length === 1) {
    return valStr + "0";
  }

  // Default return value
  return valStr;
};

function styleNumber(num, type, fixed) {
  // Convert num to a number if it's a string
  num = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(num)) {
    return "Invalid number";
  }

  const formatWithFixed = (number) => {
    return Number.isInteger(number) && fixed === 1
      ? number.toFixed(1)
      : number.toFixed(fixed);
  };

  if (type === "num" || type === "number") {
    if (Math.abs(num) < 1000) {
      return formatWithFixed(num);
    } else {
      // Round to 0 decimal places for values >= 1000
      return Math.round(num).toLocaleString();
    }
  } else if (type === "percent") {
    return formatWithFixed(num * 100) + "%";
  } else if (type === "dollar") {
    if (Math.abs(num) < 1000) {
      return "$ " + formatWithFixed(num);
    } else {
      // Round to 0 decimal places for values >= 1000
      return "$ " + Math.round(num).toLocaleString();
    }
  } else if (type === "percentNumber") {
    return formatWithFixed(num * 100);
  }
}

function updateModal(mainName, avgData, clientData) {
  // Get the selected years from local storage
  const selectedYears = getSelectedYearsFromLocalStorage();

  // Find the modal element
  const modal = document.getElementById(`${mainName}_modal`);

  // Check if the modal element exists
  if (modal) {
    // Find the table header row
    const headerRow = modal.querySelector(`#${mainName}_modal_row`);
    // console.log({headerRow});
    let tableHead = headerRow.parentElement;

    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling; // Get the next sibling again
    }

    // Clear existing header content
    headerRow.innerHTML = "";

    // Add the "year" column
    const yearColumn = document.createElement("th");
    yearColumn.className = "px-6 py-3";
    yearColumn.textContent = "year";
    headerRow.appendChild(yearColumn);

    // Add the "Client" column
    const clientColumn = document.createElement("th");
    clientColumn.className = "px-6 py-3";
    clientColumn.textContent = "client";
    headerRow.appendChild(clientColumn);

    // Add the "Avg" column
    const avgColumn = document.createElement("th");
    avgColumn.className = "px-6 py-3";
    avgColumn.textContent = "Avg";
    headerRow.appendChild(avgColumn);

    // Add the remaining columns
    const columns = ["25th","50th", "75th"];
    columns.forEach((column) => {
      const col = document.createElement("th");
      col.className = "px-6 py-3";
      col.textContent = column;
      headerRow.appendChild(col);
    });

    // Add a row for each selected year
    selectedYears.forEach((year) => {
      const yearRow = document.createElement("tr");
      yearRow.className =
        "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
      yearRow.id = `${mainName}_modal_${year}`;

      // Create a table header cell for the year
      const yearCell = document.createElement("th");
      yearCell.className =
        "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white opacity-75 justify-between border-r-2 dark:border-gray-600";
      yearCell.scope = "row";
      yearCell.textContent = year;

      // Append the year cell to the row
      yearRow.appendChild(yearCell);

      // Append the row to the header
      tableHead.appendChild(yearRow);
    });
  }
}

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
    minprice: window.sliderValue,
    maxprice: window.sliderValue2,
    min: 0,
    max: 25000,
    minthumb: 1,
    maxthumb: 1,

    mintrigger() {
      this.minprice = Math.min(this.minprice, this.maxprice - 500);
      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;

      // Update global variable
      window.sliderValue = this.minprice;

      // Trigger a custom event to notify other components
      const event = new CustomEvent("sliderChanged", {
        detail: { value: this.minprice, type: "min" },
      });
      document.dispatchEvent(event);

      if (sliderAmount) {
        sliderAmount.value = window.sliderValue;
      }

      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;
    },

    maxtrigger() {
      this.maxprice = Math.max(this.maxprice, this.minprice + 500);
      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;

      // Update global variable
      window.sliderValue2 = this.maxprice;

      // Trigger a custom event to notify other components
      const event = new CustomEvent("sliderChanged", {
        detail: { value: this.maxprice, type: "max" },
      });
      document.dispatchEvent(event);

      if (sliderRange) {
        sliderRange.value = window.sliderValue2;
      }

      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;
    },
  };
};

const findMaxValueOfObject = (data) => {
  let max = -Infinity;
  for (let year in data) {
    if (data[year].value > max) {
      max = data[year].value;
    }
  }
  return max;
};

const adjustDivHeight = () => {
  var div = document.getElementById("options-list-year");

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
  // console.log('createBenchmark', {selectedYears, elementId})
  if (selectedYears) {
    const children = await document.getElementById(elementId).children;
    // console.log(children);
    // console.log('createBenchmark', {selectedYears, elementId})

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

function showApiLoadingFunction(action, mode) {
  const loadingDiv = document.getElementById("loadingApiDiv");
  const loadingApiHeader = document.getElementById("loadingApiHeader");
  const apiPrint = document.getElementById("apiPrint");
  const firstApiYearSpan = document.getElementById("firstApiYear");
  const lastApiYearSpan = document.getElementById("LastApiYear");
  const apiYears = document.getElementById("apiYears");
  const loadingApiYears = document.getElementById("loadingApiYears");


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
      loadingApiHeader.innerHTML = "Creating Presentation Slides";
      apiYears.classList.add("hidden");
      apiPrint.classList.remove("hidden");
      loadingApiYears.classList.add('hidden')
    }
  }
}


// CRITICAL API CONNECTION FUNCTION - Added from testUtility.js
window.processApiData = function (selectedYears, recordsPeer, recordsClient) {
  // console.log("processApiData called with", {
  //   yearsCount: selectedYears.length,
  //   peerCount: recordsPeer ? recordsPeer.length : 0,
  //   clientCount: recordsClient ? recordsClient.length : 0,
  // });

  // Call the processApiCalls function which will update the dataStore
  if (typeof processApiCalls === "function") {
    const processedData = processApiCalls(
      selectedYears,
      recordsPeer,
      recordsClient
    );

    // Signal that data processing is complete
    document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

    // Attempt to trigger chart initialization
    setTimeout(() => {
      if (typeof enhancedInitializeChartDisplay === "function") {
        // console.log(
        //   "Triggering enhancedInitializeChartDisplay from processApiData"
        // );
        enhancedInitializeChartDisplay();
      } else if (typeof initializeChartDisplay === "function") {
        // console.log("Triggering initializeChartDisplay from processApiData");
        initializeChartDisplay();
      } else if (
        window.systemConnector &&
        typeof window.systemConnector.displayCharts === "function"
      ) {
        // console.log(
        //   "Triggering systemConnector.displayCharts from processApiData"
        // );
        window.systemConnector.displayCharts();
      }
    }, 500);

    return processedData;
  } else {
    console.error("processApiCalls function not available");

    // Create a fallback function
    if (!window.dataStore) {
      window.dataStore = new DataStore();
    }

    const dataProcessor = new DataProcessor(window.dataStore);
    dataProcessor.processAllData(selectedYears, recordsPeer, recordsClient);

    // Signal completion
    document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

    return {
      demoData: JSON.parse(localStorage.getItem("demoData")),
      cashData: JSON.parse(localStorage.getItem("cashData")),
      debtData: JSON.parse(localStorage.getItem("debtData")),
      incomeData: JSON.parse(localStorage.getItem("incomeData")),
      expenseData: JSON.parse(localStorage.getItem("expenseData")),
      additionalData: JSON.parse(localStorage.getItem("additionalData")),
    };
  }
};

// Ensure other key components are globally accessible (FOR API.JS CONNECTION)
window.DataStore = window.DataStore || class DataStore {};
window.DataProcessor = window.DataProcessor || class DataProcessor {};
window.ApiService = window.ApiService || class ApiService {};

// Create global instances if they don't exist (FOR API.JS CONNECTION)
if (!window.dataStore && window.DataStore) {
  window.dataStore = new window.DataStore();
}

if (!window.dataProcessor && window.DataProcessor && window.dataStore) {
  window.dataProcessor = new window.DataProcessor(window.dataStore);
}

const addUniqueClientsToOptionsSelectClientDropdown = (clientArray) => {
  // console.log("addUniqueClientsToOptionsSelectClientDropdown", { clientArray });

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
  
  // Trigger client dropdown initialization event - CRITICAL FOR HEADER.JS CONNECTION
  const event = new CustomEvent("clientDropdownInitialized", {
    detail: { clientArray: clientArray }
  });
  document.dispatchEvent(event);
};
