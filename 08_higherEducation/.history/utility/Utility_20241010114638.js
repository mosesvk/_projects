let cfiRatioChart, assetsChart;

const yearsData_Array = [];
const selectedYearsselectedYears_Array = [];
const regions_Array = [
  { arr: ["Northwest"], str: "Northwest" },
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
  { arr: ["AL"], str: "AL" },
  { arr: ["AK"], str: "AK" },
  { arr: ["AZ"], str: "AZ" },
  { arr: ["AR"], str: "AR" },
  { arr: ["AS"], str: "AS" },
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
  { arr: ["MD"], str: "MD" },
  { arr: ["MA"], str: "MA" },
  { arr: ["MI"], str: "MI" },
  { arr: ["MN"], str: "MN" },
  { arr: ["MS"], str: "MS" },
  { arr: ["MO"], str: "MO" },
  { arr: ["MT"], str: "MT" },
  { arr: ["NE"], str: "NE" },
  { arr: ["NV"], str: "NV" },
  { arr: ["NH"], str: "NH" },
  { arr: ["NJ"], str: "NJ" },
  { arr: ["NM"], str: "NM" },
  { arr: ["NY"], str: "NY" },
  { arr: ["NC"], str: "NC" },
  { arr: ["ND"], str: "ND" },
  { arr: ["MP"], str: "MP" },
  { arr: ["OH"], str: "OH" },
  { arr: ["OK"], str: "OK" },
  { arr: ["OR"], str: "OR" },
  { arr: ["PA"], str: "PA" },
  { arr: ["PR"], str: "PR" },
  { arr: ["RI"], str: "RI" },
  { arr: ["SC"], str: "SC" },
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
  { arr: ["Bible College / University"], str: "Bible College / University" },
  { arr: ["Category I (Doctoral)"], str: "Category I (Doctoral)" },
  { arr: ["Category IIA (Master's)"], str: "Category IIA (Master's)" },
  {
    arr: ["Category IIB (Baccalaureate)"],
    str: "Category IIB (Baccalaureate)",
  },
  { arr: ["Graduate University"], str: "Graduate University" },
  { arr: ["Liberal Arts"], str: "Liberal Arts" },
  { arr: ["Seminary"], str: "Seminary" },
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
];
const athletics_Array = [
  { arr: ["NAIA Division I"], str: "NAIA Division I" },
  { arr: ["NAIA Division II"], str: "NAIA Division II" },
  {
    arr: ["NCAA Division I without football"],
    str: "NCAA Division I without football",
  },
  { arr: ["NCAA Division I FCS"], str: "NCAA Division I FCS" },
  {
    arr: ["NCAA Division II with football"],
    str: "NCAA Division II with football",
  },
  {
    arr: ["NCAA Division II without football"],
    str: "NCAA Division II without football",
  },
  {
    arr: ["NCAA Division III with football"],
    str: "NCAA Division III with football",
  },
  {
    arr: ["NCAA Division III without football"],
    str: "NCAA Division III without football",
  },
  { arr: ["NCCAA Division I"], str: "NCCAA Division I" },
  { arr: ["NCCAA Division II"], str: "NCCAA Division II" },
  { arr: ["NJCAA Division I"], str: "NJCAA Division I" },
  { arr: ["Other"], str: "Other" },
  { arr: ["USCAA"], str: "USCAA" },
];

let sliderAmount = null;
let sliderRange = null;
let sliderValue = 0;
let sliderValue2 = 25000;
let missionValue = 0;
// let amount = null;

let selectedRegion = "";
const selectedRegions_Array = new Set();
const selectedStates_Array = new Set();
const selectedMemberships_Array = new Set();
const selectedTrendlines_Array = new Set();
const selectedAthletics_Array = new Set();
const selectedSites_Array = [];
const selectedTypes_Array = new Set();
const selectedClients_Array = new Set();
let selectedSchoolChurch_Selected;
const map_dataUri = new Map();
const dataUrLObj = new Object();

// CHARTS
let cfiRatio_chart;
let cfi_primaryReserveRatio_chart;
let cfi_netIncomeOperationsRatio_chart;
let cfi_returnOnNetAssets_chart;
let cfi_viabilityRatio_chart;
let FinancialPosition_chart
let assetToLiabilities_chart
let sourceOfIncomeClient_chart
let sourceOfIncomePeer_chart
let ffa_chart
let cashFlowsTrend_chart
let currentRatio_chart


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
    title
  );

  const chartIds = [
    "cfiRatio_chart",
    "cfi_primaryReserveRatio_chart",
    "cfi_netIncomeOperationsRatio_chart",
    "cfi_returnOnNetAssets_chart",
    "cfi_viabilityRatio_chart",
  ];

  if (chartIds.includes(chartId)) {
    if (chartId === "cfiRatio_chart") {
      cfiRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      cfiRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cfi_primaryReserveRatio_chart") {
      cfi_primaryReserveRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_primaryReserveRatio_chart.render();

      document.addEventListener("dark-mode", function () {
        chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cfi_netIncomeOperationsRatio_chart") {
      cfi_netIncomeOperationsRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_netIncomeOperationsRatio_chart.render();

      document.addEventListener(
        "dark-mode",
        function () {
          chart.updateOptions(chartOptions);
        }
      );
    } else if (chartId === "cfi_returnOnNetAssets_chart") {
      cfi_returnOnNetAssets_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_returnOnNetAssets_chart.render();

      document.addEventListener("dark-mode", function () {
        chart.updateOptions(chartOptions);
      });
    } else if (chartId === "cfi_viabilityRatio_chart") {
      cfi_viabilityRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );

      cfi_viabilityRatio_chart.render();

      document.addEventListener("dark-mode", function () {
        chart.updateOptions(chartOptions);
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

const getAverageOfArray = (array, mainName) => {
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value));

  if (filteredArray.length === 0) {
    return 0;
  }
  const sum = filteredArray.reduce((acc, str) => acc + Number(str), 0);
  const avg = sum / filteredArray.length;

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
  const filteredArray = array.filter((value) => Number(value) !== 0);

  // console.log(array);
  if (filteredArray.length === 0) {
    return 0;
  }

  return filteredArray.reduce((sum, value) => sum + parseFloat(value) || 0, 0);
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
    // console.log({ year, peer: dataPeer[year], client: dataClient[year] });

    benchmarkArray.push(benchmark);

    if (dataPeer != undefined && dataClient != undefined) {
      const array = dataPeer[year];
      // if (mainName == 'cfiRatio') console.log(array)
      const avg = getAverageOfArray(array, mainName);
      const mid = getMidpointOfArray(array, mainName);
      const lower25 = get25thPercentileOfArray(array, mainName);
      const higher75 = get75thPercentileOfArray(array, mainName);

      // if (mainName == 'cfiRatio') consolde.log({ avg, mid, lower25, higher75 });

      peerAvg.push(Number(styleNumber(avg, type, fixedNum)));
      peerMid.push(Number(styleNumber(mid, type, fixedNum)));
      peer25.push(Number(styleNumber(lower25, type, fixedNum)));
      peer75.push(Number(styleNumber(higher75, type, fixedNum)));

      // if (mainName == "cfi_netIncomeOperationsRatio") console.log({peerAvg, peerMid, peer25, peer75});

      // const client = Number(dataClient[year].value).toFixed(fixedNum);
      const client = dataClient[year].value;
      const clientNum = styleNumber(client, type, fixedNum);
      clientArray.push(clientNum);
    } else if (dataPeer == undefined && dataClient) {
      peerAvg.push(0);
      peerMid.push(0);
      peer25.push(0);
      peer75.push(0);

      const clientNum = Number(dataClient[year].value).toFixed(fixedNum);
      clientArray.push(clientNum);
    } else if (dataClient == undefined || dataPeer == undefined) {
      throw new Error(
        `No Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
      createToastWarning(
        `check Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
    }
  });

  // if (mainName == 'cfi_primaryReserveRatio') console.log({ clientArray, peerAvg, peerMid, peer25, peer75 });

  return { clientArray, peerAvg, peerMid, peer25, peer75, benchmarkArray };
};

function styleNumber(num, type, fixed) {
  // console.log({num, type, fixed});
  // if (type == 'dollar') console.log ({num, type, fixed});
  // Convert num to float
  num = parseFloat(num);

  if (type === "num") {
    // If fixed is 1 and the number has a decimal part of 0, return with one decimal place
    if (fixed === 1 && Number.isInteger(num)) {
      return num.toFixed(1);
    } else {
      if (num < 1000) {
        return Number.isInteger(num) ? num : num.toFixed(fixed);
      } else {
        // Otherwise, format the number with commas for thousands
        return num.toLocaleString(undefined, { minimumFractionDigits: fixed });
      }
    }
  } else if (type === "percent") {
    // Convert to percentage and format with fixed decimal places
    return (num * 100).toFixed(fixed) + "%";
  } else if (type === "dollar") {
    // If fixed is 1 and the number has a decimal part of 0, return with one decimal place
    if (fixed === 1 && Number.isInteger(num)) {
      return "$ " + num.toFixed(1);
    } else {
      if (num < 1000) {
        return "$ " + (Number.isInteger(num) ? num : num.toFixed(fixed));
      } else {
        // Otherwise, format the number with commas for thousands
        return (
          "$ " + num.toLocaleString(undefined, { minimumFractionDigits: fixed })
        );
      }
    }
  } else if (type === "percentNumber") {
    return (num * 100).toFixed(fixed);
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
    min: 0,
    max: 10000,
    missionprice: 0,
    missionthumb: 0,
    missiontrigger() {
      missionValue = this.missionprice;
      let missionValuePercent =
        ((this.missionprice - this.min) / (this.max - this.min)) * 100;
      this.missionthumb =
        missionValuePercent > 100
          ? 100
          : missionValuePercent < 0
          ? 0
          : missionValuePercent;
    },
  };
}

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

function toggleDetails(button, details, arrowIcon) {
  button.addEventListener("click", () => {
    // console.log('clicked');
    details.classList.toggle("hidden");
    arrowIcon.classList.toggle("rotate-90");
  });
}

function getValuesInChronologicalOrder(data) {
  const years = Object.keys(data).sort(); // Get the years in chronological order
  const valuesArray = years.map((year) => data[year].value); // Map the values to an array
  return valuesArray;
}

const updateCfiValue = (cfiValue, mostRecentYear) => {
  // console.log({ cfiValue });

  document.querySelector("#cfiRatio_year").innerHTML = mostRecentYear;

  let thresholds = [
    10.0, 9.7, 9.4, 9.1, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0,
    3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.0, -1.0, -2.0, -3.0, -3.2,
  ];

  for (let i = 0; i < thresholds.length; i++) {
    // console.log({ cfiValue, thresh: thresholds[i] });
    if (cfiValue >= thresholds[i]) {
      document.getElementById(thresholds[i].toFixed(1)).style.backgroundColor =
        "black";
    }
    if (cfiValue > thresholds[i] && cfiValue < thresholds[i - 1]) {
      document.getElementById(thresholds[i - 1].toFixed(1)).innerHTML =
        cfiValue;
      document.getElementById(thresholds[i - 1].toFixed(1)).classList =
        "font-bold text-lg text-black";
    }
  }

  let ids = [
    "yearCfiRatio_negative",
    "yearCfiRatio_1",
    "yearCfiRatio_3",
    "yearCfiRatio_5",
    "yearCfiRatio_7",
    "yearCfiRatio_9",
  ];

  const propClass = `text-2xl tracking-wide font-bold`;

  let idThresholds = [1, 3, 5, 7, 9];
  let idIndex = idThresholds.findIndex((threshold) => cfiValue < threshold);

  if (idIndex === -1) {
    idIndex = ids.length - 1; // if cfiValue is not less than any threshold, use the last id
  }

  let element = document.getElementById(ids[idIndex]);

  if (element) {
    element.classList = propClass;
  } else {
    console.log(`Element with id ${ids[idIndex]} does not exist.`);
  }
};

const displayFSSummary = (chart, idx) => {
  const summaryDiv = document.getElementById(chart.replace("chart", "summary"));
  // console.log({ summaryDiv, idx });
};

function createFSTable(tableDataClass, data, idString, year) {
  // console.log({ tableDataClass, data, idString, year });

  const tableHeaderData = document.getElementById(`${idString}_yearSelectData`);
  const tableHeaderYear = document.getElementById(`${idString}_yearSelect`);
  let index = yearsData_Array.indexOf(year);
  const totalNum = Number(data[data.length - 1]);

  tableHeaderYear.textContent = `(${year})`;
  tableHeaderData.textContent = `$${totalNum.toLocaleString()}`;

  const tableDataArray = document.querySelectorAll(`.${tableDataClass}`);

  // console.log({ tableDataArray });
  tableDataArray.forEach((item, idx) => {
    const dataPoint = Number(data[idx]).toLocaleString();
    // console.log({ dataPoint });
    item.textContent = `$${dataPoint}`;
  });
}

function processFinancialData(dataObject, tableDataClass, year, idString) {
  // console.log({ dataObject, tableDataClass, year, idString });

  // Create an array of values for the current year
  let arrayData = [];
  for (let key in dataObject) {
    if (dataObject[key][year]) {
      arrayData.push(dataObject[key][year].value);
    }
  }
  // Call the createFSTable function with the tableId and arrayData
  createFSTable(tableDataClass, arrayData, idString, year);
}

function toggleDetailsByIdentifier(identifier) {
  const dropdownButton = document.getElementById(`dropdown_${identifier}`);
  const detailsDiv = document.getElementById(`details_${identifier}`);
  const arrowIcon = document.getElementById(`arrow_${identifier}`);

  // Your existing toggleDetails logic here
  // ...

  // For demonstration purposes, let's log a message
  toggleDetails(dropdownButton, detailsDiv, arrowIcon);
}

function createAndRenderFSChart(
  chartId,
  parsedData,
  dataKey,
  color,
  currency,
  label,
  tableDataClass
) {
  // if (tableDataClass == 'changesInNetAssetsWithDR_dataPoint') console.log({ chartId, parsedData, dataKey, color, currency, label });
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
      tableDataClass
    )
  );
  chart.render();

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
        tableDataClass
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
      loadingApiHeader.innerHTML = "Printing Chart Data";
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

    const annotations = [
      cfiRatio_annotation,
      cfi_primaryReserveRatio_annotation,
      cfi_netIncomeOperationsRatio_annotation,
      cfi_returnOnNetAssets_annotation,
      cfi_viabilityRatio_annotation,
    ];

    charts.forEach((chart, idx) => {
      if (event.target.checked) {
        chart.addYaxisAnnotation(annotations[idx]);
        chart.update();
      } else {
        chart.removeAnnotation("annotation");
      }
    });
  });

document
  .getElementById("select-all-checkbox-trendline")
  .addEventListener("change", function (event) {
    console.log('hi');
    
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

      charts.forEach((chart, idx) => {
        if (id === "benchmark") {
          if (checked) {
            const annotations = [
              cfiRatio_annotation,
              cfi_primaryReserveRatio_annotation,
              cfi_netIncomeOperationsRatio_annotation,
              cfi_returnOnNetAssets_annotation,
              cfi_viabilityRatio_annotation,
            ];
            chart.addYaxisAnnotation(annotations[idx]);
            chart.update();
          } else {
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
