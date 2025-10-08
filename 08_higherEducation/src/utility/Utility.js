// UTILITY

const yearsData_Array = [];
const selectedYearsselectedYears_Array = [];
const regions_Array = [
  { arr: ["Northeast"], str: "Northeast" },
  {
    arr: ["West"],
    str: "West",
  },
  {
    arr: ["Canada"],
    str: "Canada",
  },
  { arr: ["Midwest"], str: "Midwest" },
  {
    arr: ["South"],
    str: "South",
  },
];
const states_Array = [
  { arr: ["AB"], str: "AB" },
  { arr: ["AL"], str: "AL" },
  { arr: ["AK"], str: "AK" },
  { arr: ["AZ"], str: "AZ" },
  { arr: ["AR"], str: "AR" },
  { arr: ["AS"], str: "AS" },
  { arr: ["BC"], str: "BC" },
  { arr: ["CA"], str: "CA" },
  { arr: ["CO"], str: "CO" },
  { arr: ["CT"], str: "CT" },
  { arr: ["DE"], str: "DE" },
  { arr: ["DC"], str: "DC" },
  { arr: ["FL"], str: "FL" },
  { arr: ["GA"], str: "GA" },
  { arr: ["GU"], str: "GU" },
  { arr: ["HI"], str: "HI" },
  { arr: ["ID"], str: "ID" },
  { arr: ["IL"], str: "IL" },
  { arr: ["IN"], str: "IN" },
  { arr: ["IA"], str: "IA" },
  { arr: ["KS"], str: "KS" },
  { arr: ["KY"], str: "KY" },
  { arr: ["LA"], str: "LA" },
  { arr: ["ME"], str: "ME" },
  { arr: ["MB"], str: "MB" },
  { arr: ["MD"], str: "MD" },
  { arr: ["MA"], str: "MA" },
  { arr: ["MI"], str: "MI" },
  { arr: ["MN"], str: "MN" },
  { arr: ["MS"], str: "MS" },
  { arr: ["MO"], str: "MO" },
  { arr: ["MT"], str: "MT" },
  { arr: ["NE"], str: "NE" },
  { arr: ["NB"], str: "NB" },
  { arr: ["NV"], str: "NV" },
  { arr: ["NH"], str: "NH" },
  { arr: ["NJ"], str: "NJ" },
  { arr: ["NM"], str: "NM" },
  { arr: ["NY"], str: "NY" },
  { arr: ["NC"], str: "NC" },
  { arr: ["ND"], str: "ND" },
  { arr: ["MP"], str: "MP" },
  { arr: ["OH"], str: "OH" },
  { arr: ["ON"], str: "ON" },
  { arr: ["OK"], str: "OK" },
  { arr: ["OR"], str: "OR" },
  { arr: ["PA"], str: "PA" },
  { arr: ["PR"], str: "PR" },
  { arr: ["RI"], str: "RI" },
  { arr: ["SC"], str: "SC" },
  { arr: ["SK"], str: "SK" },
  { arr: ["SD"], str: "SD" },
  { arr: ["TN"], str: "TN" },
  { arr: ["TX"], str: "TX" },
  { arr: ["TT"], str: "TT" },
  { arr: ["UT"], str: "UT" },
  { arr: ["VT"], str: "VT" },
  { arr: ["VA"], str: "VA" },
  { arr: ["VI"], str: "VI" },
  { arr: ["WA"], str: "WA" },
  { arr: ["WV"], str: "WV" },
  { arr: ["WI"], str: "WI" },
  { arr: ["WY"], str: "WY" },
];
const types_Array = [
  { arr: ["Bible College/University"], str: "Bible College/University" },
  { arr: ["Category I (Doctoral)"], str: "Category I (Doctoral)" },
  { arr: ["Category IIA (Master's)"], str: "Category IIA (Master's)" },
  {
    arr: ["Category IIB (Baccalaureate)"],
    str: "Category IIB (Baccalaureate)",
  },
  { arr: ["Graduate University"], str: "Graduate University" },
  { arr: ["Liberal Arts"], str: "Liberal Arts" },
  { arr: ["Seminary"], str: "Seminary" },
  {
    arr: ["Liberal Arts & Bible College"],
    str: "Liberal Arts & Bible College",
  },
  { arr: ["Unspecified"], str: "Unspecified" },
];
const memberships_Array = [
  { arr: ["ABACC"], str: "ABACC" },
  { arr: ["ABHE"], str: "ABHE" },
  { arr: ["ACCU"], str: "ACCU" },
  { arr: ["ATS"], str: "ATS" },
  { arr: ["CCCU"], str: "CCCU" },
  { arr: ["CIC"], str: "CIC" },
  { arr: ["IABCU"], str: "IABCU" },
  { arr: ["NHERMC"], str: "NHERMC" },
  { arr: ["TRACS"], str: "TRACS" },
  { arr: ["ECFA"], str: "ECFA" },
  { arr: ["NACUBO"], str: "NACUBO" },
  { arr: ["Unspecified"], str: "Unspecified" },
];

const seminaries_Array = [
  { arr: ["Small"], str: "Small" },
  { arr: ["Large"], str: "Large" },
  { arr: ["Unspecified"], str: "Unspecified" },
];

const regionals_Array = [
  { arr: ["Higher Learning Commission"], str: "Higher Learning Commission" },
  {
    arr: ["Middle States Commission on Higher Education"],
    str: "Middle States Commission on Higher Education",
  },
  {
    arr: ["New England Commission on Higher Education"],
    str: "New England Commission on Higher Education",
  },
  {
    arr: ["Northwest Commission on Colleges and Universities"],
    str: "Northwest Commission on Colleges and Universities",
  },
  {
    arr: [
      "Southern Association of Colleges and Schools Commission on Colleges",
    ],
    str: "Southern Association of Colleges and Schools Commission on Colleges",
  },
  {
    arr: ["WASC Senior College and University Commission"],
    str: "WASC Senior College and University Commission",
  },
  {
    arr: ["South Carolina Independent Colleges and Universities"],
    str: "South Carolina Independent Colleges and Universities",
  },
  { arr: ["Unspecified"], str: "Unspecified" },
];

const athletics_Array = [
  { arr: ["NCAA  I"], str: "NCAA  I" },
  { arr: ["NCAA  II"], str: "NCAA  II" },
  { arr: ["NCAA  III"], str: "NCAA  III" },
  { arr: ["NAIA"], str: "NAIA" },
  { arr: ["NCCAA I"], str: "NCCAA I" },
  { arr: ["NCCAA II"], str: "NCCAA II" },
  { arr: ["USCAA"], str: "USCAA" },
  { arr: ["Unspecified"], str: "Unspecified" },
];

let sliderAmount = null;
let sliderRange = null;
// Make sure these are window-scoped variables
window.sliderValue = 0;
window.sliderValue2 = 16000;
let missionValue = 0;

let selectedRegion = "";
const selectedRegions_Array = new Set();
const selectedStates_Array = new Set();
const selectedMemberships_Array = new Set();
const selectedTrendlines_Array = new Set();
const selectedAthletics_Array = new Set();
const selectedSeminaries_Array = new Set();
const selectedRegionals_Array = new Set();
const selectedEnrollments_Array = new Set();
const selectedSites_Array = [];
const selectedTypes_Array = new Set();
const selectedClients_Array = new Set();
let selectedSchoolChurch_Selected;
const map_dataUri = new Map();
const dataUrLObj = new Object();
let mostRecentYearSourceRecordId = null;

// CHARTS
let cfiRatio_chart;
let doeOverall_chart;
let cfi_primaryReserveRatio_chart;
let cfi_netIncomeOperationsRatio_chart;
let cfi_returnOnNetAssets_chart;
let cfi_viabilityRatio_chart;
let FinancialPosition_chart;
let assetToLiabilities_chart;
let sourceOfIncomeClient_chart;
let sourceOfIncomePeer_chart;
let ffa_chart;
let cashFlowsTrend_chart;
let currentRatio_chart;
let salariesBenefitsToTotalExpense_chart;
let salariesBenefitsPerNetTuition_chart;
let netEducationalExpensePerStudent_chart;
let annualTraditionalNetTuitionPerStudent_chart;
let tuitionDependency_chart;
let tuitionDiscountRate_chart;
let ltDebtPerTotalOperatingRevenue_chart;
let debtServiceCoverageRatio_chart;
let debtBurdenRatio_chart;
let endowmentOperatingBudget_chart;
let endowmentAssetsPerStudent_chart
let netTuitionPerStudent_chart
let cfiCompositeHtml_chart;

// annotation
let cfiRatio_annotation;
let cfi_primaryReserveRatio_annotation;
let cfi_netIncomeOperationsRatio_annotation;
let cfi_returnOnNetAssets_annotation;
let cfi_viabilityRatio_annotation;

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
    // console.log({ parsedData, chart, peer, client, type, fixedNum, mainName });

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
    // updateModal (mainName, parsedData[peer], parsedData[client]);
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

  const chartIds = [
    "cfiRatio_chart",
    "doeOverall_chart",
    "cfi_primaryReserveRatio_chart",
    "cfi_netIncomeOperationsRatio_chart",
    "cfi_returnOnNetAssets_chart",
    "cfi_viabilityRatio_chart",
  ];

  if (chartIds.includes(chartId)) {
    if (chartId === "cfiRatio_chart") {
      // Create a custom chart options object for cfiRatio that explicitly sets min to -4
      const cfiRatioOptions = { ...chartOptions };

      // Make sure the yaxis setting has a proper min value
      if (!cfiRatioOptions.yaxis.min) {
        cfiRatioOptions.yaxis.min = -4;
      }

      cfiRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        cfiRatioOptions
      );
      cfiRatio_chart.render();

      document.addEventListener("dark-mode", function () {
        cfiRatio_chart.updateOptions(cfiRatioOptions);
      });
    } else if (chartId === "doeOverall_chart") {
      doeOverall_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      doeOverall_chart.render();
      document.addEventListener("dark-mode", function () {
        doeOverall_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cfi_primaryReserveRatio_chart") {
      cfi_primaryReserveRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_primaryReserveRatio_chart.render();

      document.addEventListener("dark-mode", function () {
        cfi_primaryReserveRatio_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cfi_netIncomeOperationsRatio_chart") {
      cfi_netIncomeOperationsRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_netIncomeOperationsRatio_chart.render();

      document.addEventListener("dark-mode", function () {
        cfi_netIncomeOperationsRatio_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cfi_returnOnNetAssets_chart") {
      cfi_returnOnNetAssets_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_returnOnNetAssets_chart.render();

      document.addEventListener("dark-mode", function () {
        cfi_returnOnNetAssets_chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cfi_viabilityRatio_chart") {
      cfi_viabilityRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_viabilityRatio_chart.render();

      // document.addEventListener("dark-mode", function () {
      //   cfi_viabilityRatio_chart.updateOptions(chartOptions);
      // });
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

const getAverageOfArray = (array, num = 1) => {
  // Check if array is empty or undefined
  if (!array || array.length === 0) {
    return 0;
  }

  // Convert all values to numbers
  const numericArray = array.map((value) => Number(value) * num);
  
  // Check if all values are zero
  const allZeros = numericArray.every((value) => value === 0);
  if (allZeros) {
    return 0;
  }

  // Filter out zeros for calculation
  const filteredArray = numericArray.filter((value) => value !== 0);

  if (filteredArray.length === 0) {
    return 0;
  }
  
  const sum = filteredArray.reduce((acc, value) => acc + value, 0);
  const avg = sum / filteredArray.length;

  return avg;
};

const getMidpointOfArray = (array, mainName) => {
  // console.log({ mainName, array });
  
  // Check if array is empty or undefined
  if (!array || array.length === 0) {
    return 0;
  }

  // Convert all values to numbers
  const numericArray = array.map((value) => Number(value));
  
  // Check if all values are zero
  const allZeros = numericArray.every((value) => value === 0);
  if (allZeros) {
    return 0;
  }

  // Filter out zeros for calculation
  const filteredArray = numericArray.filter((value) => value !== 0);

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
  // Check if array is empty or undefined
  if (!array || array.length === 0) {
    return 0;
  }

  // Convert all values to numbers
  const numericArray = array.map((value) => Number(value));
  
  // Check if all values are zero
  const allZeros = numericArray.every((value) => value === 0);
  if (allZeros) {
    return 0;
  }

  // Filter out zeros for calculation
  const filteredArray = numericArray.filter((value) => value !== 0);

  // if (mainName == "cfi_primaryReserveRatio")
  //   console.log("get25thPercentileOfArray", { filteredArray, mainName });

  if (filteredArray.length === 0) {
    return 0;
  }

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
  // Check if array is empty or undefined
  if (!array || array.length === 0) {
    return 0;
  }

  // Convert all values to numbers
  const numericArray = array.map((value) => Number(value));
  
  // Check if all values are zero
  const allZeros = numericArray.every((value) => value === 0);
  if (allZeros) {
    return 0;
  }

  // Filter out zeros for calculation
  const filteredArray = numericArray.filter((value) => value !== 0);

  // if (mainName == "cfi_primaryReserveRatio")
  //   console.log("get75thPercentileOfArray", { filteredArray, mainName });

  if (filteredArray.length === 0) {
    return 0;
  }

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
};

// Enhanced addClientDataToModalRow function
function addClientDataToModalRow(yearRow, clientValue, type, fixedNum) {
  // console.log(`Adding client datfa to row: ${yearRow.id}`, {
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

      const clientNum = styleNumber(dataClient[year].value, type, fixedNum);
      // if (mainName === "doeOverall") console.log(clientNum);

      clientArray.push(clientNum);
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

      // const client = Number(dataClient[year].value).toFixed(fixedNum);
      // const client = dataClient[year].value;
      // const clientNum = styleNumber(client, type, fixedNum);
      // // if (mainName == 'doeOverall') debugger
      // clientArray.push(clientNum);

      const clientNum = styleNumber(dataClient[year].value, type, fixedNum);
      clientArray.push(clientNum);
    } else if (dataPeer[year] === undefined && dataClient[year]) {
      // console.log('---- hit ELSE if');

      peerAvg.push(null);
      peerMid.push(null);
      peer25.push(null);
      peer75.push(null);

      const clientNum = styleNumber(dataClient[year].value, type, fixedNum);
      clientArray.push(clientNum);
    } else if (dataClient == undefined || dataPeer == undefined) {
      throw new Error(
        `No Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
      createToastWarning(
        `check Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
    }

    // if (mainName == "doeOverall") console.log({clientArray, dataClient});
  });

  // if (mainName == "cfi_netIncomeOperationsRatio")
  //   console.log({ mainName, clientArray, peerAvg, peerMid, peer25, peer75 });

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

  if (type === "num") {
    if (Math.abs(num) < 1000) {
      return formatWithFixed(num);
    } else {
      return num.toLocaleString(undefined, { minimumFractionDigits: fixed });
    }
  } else if (type === "percent") {
    return formatWithFixed(num * 100) + "%";
  } else if (type === "dollar") {
    if (Math.abs(num) < 1000) {
      return "$ " + formatWithFixed(num);
    } else {
      return (
        "$ " + num.toLocaleString(undefined, { minimumFractionDigits: fixed })
      );
    }
  } else if (type === "percentNumber") {
    return formatWithFixed(num * 100);
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
    isDragging: false,
    dragHandle: null,
    sliderRect: null,

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

    startDrag(event, handle) {
      event.preventDefault();
      this.isDragging = true;
      this.dragHandle = handle;
      
      // Get the slider container rect for calculations
      const sliderContainer = event.target.closest('.relative.z-10.h-2');
      if (sliderContainer) {
        this.sliderRect = sliderContainer.getBoundingClientRect();
      }
      
      // Add global mouse event listeners
      document.addEventListener('mousemove', this.handleDrag.bind(this));
      document.addEventListener('mouseup', this.stopDrag.bind(this));
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
    },

    handleDrag(event) {
      if (!this.isDragging || !this.sliderRect) return;
      
      // Calculate the position relative to the slider
      const x = event.clientX - this.sliderRect.left;
      const percentage = Math.max(0, Math.min(100, (x / this.sliderRect.width) * 100));
      
      // Convert percentage to value
      const value = Math.round(this.min + (percentage / 100) * (this.max - this.min));
      
      if (this.dragHandle === 'min') {
        this.minprice = Math.min(value, this.maxprice - 500);
        this.mintrigger();
      } else if (this.dragHandle === 'max') {
        this.maxprice = Math.max(value, this.minprice + 500);
        this.maxtrigger();
      }
    },

    stopDrag() {
      this.isDragging = false;
      this.dragHandle = null;
      this.sliderRect = null;
      
      // Remove global mouse event listeners
      document.removeEventListener('mousemove', this.handleDrag.bind(this));
      document.removeEventListener('mouseup', this.stopDrag.bind(this));
      
      // Restore text selection
      document.body.style.userSelect = '';
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

const getMinMaxY = (arrays) => {
  // Handle case where arrays contains numbers instead of arrays
  const allData = arrays.reduce((acc, item) => {
    // If item is a number or string number, wrap it in array before spreading
    const arr = Array.isArray(item) ? item : [item];
    return [
      ...acc,
      ...arr.map((val) => (typeof val === "string" ? parseFloat(val) : val)),
    ];
  }, []);

  let minY = Math.min(...allData);
  let maxY = Math.max(...allData);

  // For ratio values between 0 and 1
  if (allData.every((val) => val > 0 && val <= 1)) {
    minY = 0;
    maxY = Math.ceil(maxY * 10) / 10; // Round up to nearest 0.1
    return {
      minY,
      maxY,
      minYLine:
        minY < 0.1
          ? 0
          : minY < 0.2
          ? 0.1
          : minY < 0.3
          ? 0.2
          : minY < 0.4
          ? 0.3
          : minY < 0.5
          ? 0.4
          : minY < 0.6
          ? 0.5
          : minY < 0.7
          ? 0.6
          : minY < 0.8
          ? 0.7
          : minY < 0.9
          ? 0.8
          : 0.9,
      maxYLine: maxY + 0.1, // Add 0.1 to give some padding above highest value
    };
  }

  // Handle maxY rounding
  if (maxY >= 1000000) {
    maxY = Math.ceil(maxY / 5000000) * 5000000;
  } else if (maxY >= 100000) {
    maxY = Math.ceil(maxY / 10000) * 10000;
  } else if (maxY >= 1000) {
    maxY = Math.ceil(maxY / 5000) * 5000;
  } else if (maxY >= 100) {
    maxY = Math.ceil(maxY / 100) * 100;
  } else if (maxY >= 10) {
    maxY = Math.ceil(maxY / 10) * 10;
  } else if (maxY >= 1) {
    maxY = Math.ceil(maxY);
  } else {
    // For values between 0 and 1
    maxY = Math.ceil(maxY * 10) / 10;
  }

  // Handle minY
  if (minY >= 0) {
    minY = 0;
  } else {
    // Handle negative minY rounding
    if (Math.abs(minY) >= 1000000) {
      minY = Math.floor(minY / 5000000) * 5000000;
    } else if (Math.abs(minY) >= 100000) {
      minY = Math.floor(minY / 10000) * 10000;
    } else if (Math.abs(minY) >= 1000) {
      minY = Math.floor(minY / 5000) * 5000;
    } else if (Math.abs(minY) >= 100) {
      minY = Math.floor(minY / 100) * 100;
    } else if (Math.abs(minY) >= 10) {
      minY = Math.floor(minY / 10) * 10;
    } else if (Math.abs(minY) >= 1) {
      minY = Math.floor(minY);
    } else {
      // For values between -1 and 0
      minY = Math.floor(minY * 10) / 10;
    }
  }

  return { minY, maxY, minYLine: minY, maxYLine: maxY };
};

const yaxisLabelFormatter = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) {
    return "Invalid input";
  }

  const absNum = Math.abs(num);
  let rounded;

  if (absNum >= 1000000) {
    rounded = Math.round(num / 100000) * 100000;
    return `${(rounded / 1000000).toFixed(1)}M`;
  }
  if (absNum >= 100000) {
    rounded = Math.round(num / 10000) * 10000;
    return `${(rounded / 1000).toFixed(0)}k`;
  }
  if (absNum >= 10000) {
    rounded = Math.round(num / 1000) * 1000;
    return `${(rounded / 1000).toFixed(0)}k`;
  }
  if (absNum >= 1000) {
    rounded = Math.round(num / 100) * 100;
    return `${(rounded / 1000).toFixed(1)}k`;
  }
  if (absNum >= 100) {
    rounded = Math.round(num / 10) * 10;
    return rounded.toString();
  }
  if (absNum >= 1) {
    rounded = Math.round(num * 2) / 2;
    return rounded.toFixed(1);
  }
  // Between 0 and 1
  rounded = Math.round(num * 10) / 10;
  return rounded.toFixed(1);
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

function handleValue(value) {
  if (value === undefined || isNaN(value)) {
    return "0"; // Push "0" as a string if value is undefined or NaN
  }
  return String(value); // Convert value to string and push
}

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

function getValuesInChronologicalOrder(data) {
  // console.log('data', {data})
  const years = Object.keys(data).sort(); // Get the years in chronological order
  const valuesArray = years.map((year) => data[year].value); // Map the values to an array
  return valuesArray;
}


const displayFSSummary = (chart, idx) => {
  const summaryDiv = document.getElementById(chart.replace("chart", "summary"));
  // console.log({ summaryDiv, idx });
};

function toggleDetails(button, details, arrowIcon, identifier) {
  button.addEventListener("click", () => {
    // console.log('clicked');
    const wasHidden = details.classList.contains("hidden");
    details.classList.toggle("hidden");
    arrowIcon.classList.toggle("rotate-90");
    
    // If CFI details section is being shown (was hidden, now visible), re-render the chart
    if (identifier === 'cfiRatio' && wasHidden && typeof window.renderCfiChart === 'function') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        window.renderCfiChart();
      }, 100);
    }
    // console.log('toggleDetails() clicked');
  });
}

function toggleDetailsByIdentifier(identifier) {
  const dropdownButton = document.getElementById(`dropdown_${identifier}`);
  const detailsDiv = document.getElementById(`details_${identifier}`);
  const arrowIcon = document.getElementById(`arrow_${identifier}`);

  // Your existing toggleDetails logic here
  // ...

  // For demonstration purposes, let's log a message
  toggleDetails(dropdownButton, detailsDiv, arrowIcon, identifier);
}

function createFSTable(tableDataClass, arrayData, idString, year, dataObject, dataPointArray) {
  const tableHeaderData = document.getElementById(`${idString}_yearSelectData`);
  const tableHeaderYear = document.getElementById(`${idString}_yearSelect`);
  const totalNum = dataObject[`${idString}_Client`][year].value;
  const isTotalNumString = typeof totalNum === "string";

  tableHeaderYear.textContent = `(${year})`;
  tableHeaderData.textContent = `$${
    isTotalNumString
      ? Number(totalNum).toLocaleString()
      : totalNum.toLocaleString()
  }`;

  // console.log({ tableDataClass, arrayData, idString, year, dataObject, dataPointArray });

  // Loop through each data point in the array
  dataPointArray.forEach(dataPoint => {
    // console.log('---',{ dataPoint });
    // console.log({ dataPoint });
    // Get the corresponding table cell using the dataPoint class
    const tableCell = document.querySelector(`.${dataPoint}_dataPoint`);
    if (tableCell) {
      // Get the value from dataObject using the _Client suffix
      const value = dataObject[`${dataPoint}_Client`][year].value;
      // Format and display the value
      tableCell.textContent = `$${Number(value).toLocaleString()}`;
    }
  });
}

function processFinancialData(
  dataObject,
  tableDataClass,
  year,
  idString,
  dataPointArray
) {
  // Create an array of values for the current year
  let arrayData = [];
  for (let key in dataObject) {
    if (dataObject[key][year]) {
      arrayData.push(dataObject[key][year].value);
    }
  }

  // console.log("processFinancialData - utility.js", {
  //   dataObject,
  //   tableDataClass,
  //   year,
  //   idString,
  //   arrayData,
  //   dataPointArray
  // });
  // Call the createFSTable function with the tableId and arrayData
  createFSTable(
    tableDataClass,
    arrayData,
    idString,
    year,
    dataObject,
    dataPointArray
  );
}

function createAndRenderFSChart(
  chartId,
  parsedData,
  dataKey,
  color,
  currency,
  label,
  tableDataClass,
  dataPointArray
) {
  // if (tableDataClass == 'totalAssets_dataPoint')
  // console.log("createAndRenderFSChart", {
  //   yearsData_Array,
  //   chartId,
  //   parsedData,
  //   dataKey,
  //   color,
  //   currency,
  //   label,
  //   dataPointArray
  // });
  // Create the chart
  const chart = new ApexCharts(
    document.querySelector(chartId),
    getFSchartOptions(
      parsedData,
      dataKey,
      color,
      currency,
      label,
      chartId,
      tableDataClass,
      dataPointArray
    )
  );
  // let mostCurrentYearIndex = Object.keys(parsedData[dataKey]).length - 1
  // console.log('mostCurrentYearIndex', parsedData[dataKey])
  // console.log('mostCurrentYearIndex', mostCurrentYearIndex)

  // chart.toggleDataPointSelection(0, mostCurrentYearIndex)
  chart.render();

  // Get the client string
  const clientString = dataKey.replace("_Client", "");

  // Get the years from the data
  const years = Object.keys(parsedData[dataKey]);

  // Sort years numerically (ascending)
  const sortedYears = [...years].sort((a, b) => parseInt(a) - parseInt(b));

  // Get the most recent year (last in the sorted array)
  const mostRecentYear = sortedYears[sortedYears.length - 1];

  // Get the index of the most recent year in the chart's x-axis categories
  const firstKey = Object.keys(parsedData)[0];
  const yearsDataFinancialStatment_Array = Object.keys(
    parsedData[firstKey]
  ).sort((a, b) => a - b);
  const mostRecentYearIndex =
    yearsDataFinancialStatment_Array.indexOf(mostRecentYear);

  // Process financial data for the most recent year
  setTimeout(() => {
    processFinancialData(
      parsedData,
      tableDataClass,
      mostRecentYear,
      clientString,
      dataPointArray
    );

    // Apply styling to the last bar
    try {
      const chartElement = document.querySelector(chartId);
      if (!chartElement) return;

      // Target all possible chart types
      const allBars = chartElement.querySelectorAll(".apexcharts-series rect");

      // Filter to get only the bars for the current series (if multiple series exist)
      const seriesBars = Array.from(allBars).filter((bar) => {
        // Look for the data series index in the element's attributes
        return (
          bar.getAttribute("data-series-index") === "0" ||
          bar.parentElement.getAttribute("data-series-index") === "0"
        );
      });

      // If we have bars and the index is valid
      if (
        seriesBars.length > 0 &&
        mostRecentYearIndex >= 0 &&
        mostRecentYearIndex < seriesBars.length
      ) {
        // Get the bar for the most recent year
        const targetBar = seriesBars[mostRecentYearIndex];
        if (targetBar) {
          // Apply darkening style to make it look active
          targetBar.style.filter = "brightness(0.65)";
          targetBar.style.opacity = "1";
          targetBar.style.stroke = "rgba(0, 0, 0, 0.35)";
          targetBar.style.strokeWidth = "1px";
        }
      }
    } catch (e) {
      console.error("Error styling bar:", e);
    }
  }, 500); // Allow time for chart to render

  // Update the chart on dark mode event
  document.addEventListener("dark-mode", function () {
    chart.updateOptions(
      getFSchartOptions(
        parsedData,
        dataKey,
        color,
        currency,
        label,
        chartId,
        tableDataClass,
        dataPointArray
      )
    );
  });

  return chart;
}

function showApiLoadingFunction(action, mode) {
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
      loadingApiHeader.innerHTML = "Creating Presentation Slides";
      apiYears.classList.add("hidden");
      apiPrint.classList.remove("hidden");
    }
  }
}

document
  .getElementById("option-25")
  .addEventListener("change", function (event) {
    const charts = [
      cfiRatio_chart,
      cfi_primaryReserveRatio_chart,
      cfi_netIncomeOperationsRatio_chart,
      cfi_returnOnNetAssets_chart,
      cfi_viabilityRatio_chart,
    ];

    charts.forEach((chart) => {
      if (!event.target.checked) {
        chart.hideSeries("25th");
      } else {
        chart.showSeries("25th");
      }
    });
  });

document
  .getElementById("option-50")
  .addEventListener("change", function (event) {
    const charts = [
      cfiRatio_chart,
      cfi_primaryReserveRatio_chart,
      cfi_netIncomeOperationsRatio_chart,
      cfi_returnOnNetAssets_chart,
      cfi_viabilityRatio_chart,
    ];

    charts.forEach((chart) => {
      if (!event.target.checked) {
        chart.hideSeries("50th");
      } else {
        chart.showSeries("50th");
      }
    });
  });

document
  .getElementById("option-75")
  .addEventListener("change", function (event) {
    const charts = [
      cfiRatio_chart,
      cfi_primaryReserveRatio_chart,
      cfi_netIncomeOperationsRatio_chart,
      cfi_returnOnNetAssets_chart,
      cfi_viabilityRatio_chart,
    ];

    charts.forEach((chart) => {
      if (!event.target.checked) {
        chart.hideSeries("75th");
      } else {
        chart.showSeries("75th");
      }
    });
  });

document
  .getElementById("option-avg")
  .addEventListener("change", function (event) {
    const charts = [
      cfiRatio_chart,
      cfi_primaryReserveRatio_chart,
      cfi_netIncomeOperationsRatio_chart,
      cfi_returnOnNetAssets_chart,
      cfi_viabilityRatio_chart,
    ];

    charts.forEach((chart) => {
      if (!event.target.checked) {
        chart.hideSeries("Avg");
      } else {
        chart.showSeries("Avg");
      }
    });
  });

document
  .getElementById("option-benchmark")
  .addEventListener("change", function (event) {
    const charts = [
      cfiRatio_chart,
      cfi_primaryReserveRatio_chart,
      cfi_netIncomeOperationsRatio_chart,
      cfi_returnOnNetAssets_chart,
      cfi_viabilityRatio_chart,
    ];

    const chartIds = [
      "cfiRatio_chart",
      "cfi_primaryReserveRatio_chart", 
      "cfi_netIncomeOperationsRatio_chart",
      "cfi_returnOnNetAssets_chart",
      "cfi_viabilityRatio_chart",
    ];

    charts.forEach((chart, idx) => {
      if (event.target.checked) {
        // Use the same robust regeneration approach as select-all
        const benchmark = getBenchmarkValueForChart(chartIds[idx]);
        const annotation = regenerateAnnotationForChart(chartIds[idx], benchmark);
        console.log(`Individual toggle: Adding benchmark annotation for ${chartIds[idx]}:`, {
          benchmark,
          annotation,
          chart: !!chart
        });
        
        // For now, just try the single object approach since we know it should work
        chart.addYaxisAnnotation(annotation[0]);
        chart.update();
      } else {
        console.log(`Individual toggle: Removing benchmark annotation for ${chartIds[idx]}`);
        chart.removeAnnotation("annotation");
      }
    });
  });

/**
 * Function to regenerate annotation for a specific chart
 * @param {string} chartId - The chart ID (e.g., "cfiRatio_chart") 
 * @param {number} benchmark - The benchmark value for the annotation
 * @returns {Object} The annotation object
 */
const regenerateAnnotationForChart = (chartId, benchmark) => {
  console.log(`regenerateAnnotationForChart called:`, { chartId, benchmark });
  const selectedYearsArray = getSelectedYearsFromLocalStorage();
  const selectedYearsLength = selectedYearsArray.length;
  console.log(`Selected years:`, { selectedYearsArray, selectedYearsLength });
  
  // Calculate dynamic offset based on number of years (same logic as in getMainChartOptions)
  let dynamicOffsetX;
  switch (selectedYearsLength) {
    case 1:
      dynamicOffsetX = 30;
      break;
    case 3:
    case 2:
      dynamicOffsetX = -120;
      break;
    case 5:
    case 4:
      dynamicOffsetX = -75;
      break;
    case 6:
      dynamicOffsetX = -40;
      break;
    case 7:
      dynamicOffsetX = -10;
      break;
    case 8:
      dynamicOffsetX = 0;
      break;
    case 9:
      dynamicOffsetX = 20;
      break;
    case 10:
      dynamicOffsetX = 30;
      break;
    case 11:
      dynamicOffsetX = 40;
      break;
    default:
      dynamicOffsetX = 50;
  }

  // Get chart colors (same logic as in getMainChartOptions)
  const chartColors = document.documentElement.classList.contains("dark")
    ? {
        borderColor: "#374151",
        labelColor: "#ebedf0",
        backgroundColor: "#000000",
        opacityFrom: 0,
        opacityTo: 0.15,
      }
    : {
        borderColor: "#F3F4F6",
        labelColor: "#000000",
        backgroundColor: "#ffffff",
        opacityFrom: 0.45,
        opacityTo: 0,
      };

  // Determine position based on chart type
  const position = chartId === "cfiRatio_chart" ? "left" : "top";

  const annotation = [
    {
      id: "annotation",
      y: benchmark,
      borderColor: chartColors.labelColor,
      strokeDashArray: 0,
      label: {
        text: "Benchmark",
        borderColor: "transparent",
        borderWidth: 0,
        offsetX: dynamicOffsetX,
        position: position,
        style: {
          background: "transparent",
          color: chartColors.labelColor,
          fontSize: "18px",
          fontWeight: 600,
        },
      },
    },
  ];
  
  console.log(`Generated annotation for ${chartId}:`, annotation);
  return annotation;
};

/**
 * Function to get the benchmark value for a specific chart
 * @param {string} chartId - The chart ID
 * @returns {number} The benchmark value
 */
const getBenchmarkValueForChart = (chartId) => {
  // These benchmark values match what's used in DisplayCharts.js
  const benchmarkMap = {
    "cfiRatio_chart": 3, // CFI Overall Ratio benchmark
    "cfi_primaryReserveRatio_chart": 0.4, // Primary Reserve Ratio benchmark  
    "cfi_netIncomeOperationsRatio_chart": 0, // Net Income Operations Ratio benchmark
    "cfi_returnOnNetAssets_chart": 6, // Return on Net Assets benchmark
    "cfi_viabilityRatio_chart": 1.25, // Viability Ratio benchmark
  };
  
  return benchmarkMap[chartId] || 0;
};

document
  .getElementById("select-all-checkbox-trendline")
  .addEventListener("change", function (event) {
    console.log("hi");

    const allOptions = [
      { id: "25th", elementId: "option-25" },
      { id: "50th", elementId: "option-50" },
      { id: "75th", elementId: "option-75" },
      { id: "Avg", elementId: "option-avg" },
      { id: "benchmark", elementId: "option-benchmark" },
    ];

    const checked = event.target.checked;

    allOptions.forEach(({ id, elementId }) => {
      const optionElement = document.getElementById(elementId);
      optionElement.checked = checked;

      const charts = [
        cfiRatio_chart,
        cfi_primaryReserveRatio_chart,
        cfi_netIncomeOperationsRatio_chart,
        cfi_returnOnNetAssets_chart,
        cfi_viabilityRatio_chart,
      ];

      const chartIds = [
        "cfiRatio_chart",
        "cfi_primaryReserveRatio_chart", 
        "cfi_netIncomeOperationsRatio_chart",
        "cfi_returnOnNetAssets_chart",
        "cfi_viabilityRatio_chart",
      ];

      charts.forEach((chart, idx) => {
        console.log(`Processing chart ${chartIds[idx]}: chart exists = ${!!chart}, chart type = ${typeof chart}`);
        if (id === "benchmark") {
          if (checked) {
            // Regenerate annotation instead of using potentially stale global variables
            const benchmark = getBenchmarkValueForChart(chartIds[idx]);
            const annotation = regenerateAnnotationForChart(chartIds[idx], benchmark);
            console.log(`Adding benchmark annotation for ${chartIds[idx]}:`, {
              benchmark,
              annotation,
              chart: !!chart
            });
            
            // Try different approaches to see which works
            try {
              // Try with single annotation object
              chart.addYaxisAnnotation(annotation[0]);
              console.log(`Method 1 (single object) succeeded for ${chartIds[idx]}`);
            } catch (error) {
              console.log(`Method 1 failed for ${chartIds[idx]}:`, error);
              try {
                // Try with array of annotations
                chart.addYaxisAnnotation(annotation);
                console.log(`Method 2 (array) succeeded for ${chartIds[idx]}`);
              } catch (error2) {
                console.log(`Method 2 also failed for ${chartIds[idx]}:`, error2);
                
                // Try global variable approach (original)
                const originalAnnotations = [
                  cfiRatio_annotation,
                  cfi_primaryReserveRatio_annotation,
                  cfi_netIncomeOperationsRatio_annotation,
                  cfi_returnOnNetAssets_annotation,
                  cfi_viabilityRatio_annotation,
                ];
                console.log(`Global annotation for ${chartIds[idx]}:`, originalAnnotations[idx]);
                if (originalAnnotations[idx]) {
                  chart.addYaxisAnnotation(originalAnnotations[idx]);
                  console.log(`Method 3 (original globals) succeeded for ${chartIds[idx]}`);
                } else {
                  console.log(`Method 3 failed: No global annotation for ${chartIds[idx]}`);
                }
              }
            }
            chart.update();
          } else {
            console.log(`Removing benchmark annotation for ${chartIds[idx]}`);
            chart.removeAnnotation("annotation");
          }
        } else {
          if (checked) {
            chart.showSeries(id);
          } else {
            chart.hideSeries(id);
          }
        }
      });
    });
  });

  