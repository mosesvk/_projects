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
let totalCoverageRatio_chart;
let contributionsTrend_chart;
let annualizedInvestmentReturn_chart;
let functionalExpensePercent_program_chart;
let functionalExpensePercent_administrative_chart;
let functionalExpensePercent_fundraising_chart;
let costOfContributions_chart;

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
  mainName
) => {
  if (parsedData) {
    // if (mainName == 'functionalExpensePercent_program') console.log({ parsedData, chart, peer, client, type, fixedNum, mainName });
    createChart(
      chart,
      parsedData[peer],
      parsedData[client],
      type,
      fixedNum,
      mainName
    );
    updateModal(mainName, parsedData[peer], parsedData[client]);
  }
};

const createChart = (
  chartId,
  dataPeer,
  dataClient,
  type,
  fixedNum,
  mainName
) => {
  // console.log('createChart()', { chartId, dataPeer, dataClient, type, fixedNum });
  document.getElementById(chartId).innerHTML = "";

  dataUrLObj[mainName] = chartId;

  const chartOptions = getMainChartOptions(
    dataPeer,
    dataClient,
    type,
    fixedNum,
    mainName
  );

  const chartIds = [
    "daysCashOnHand_chart",
    "daysExpensesInUnrestrictedNA_chart",
    "daysExpensesInUnrestrictedNA_excludingPPE_chart",
    "totalCoverageRatio_chart",
    "contributionsTrend_chart",
    "annualizedInvestmentReturn_chart",
    "functionalExpensePercent_program_chart",
    "functionalExpensePercent_administrative_chart",
    "functionalExpensePercent_fundraising_chart",
    "costOfContributions_chart",
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
    } else if (chartId === "totalCoverageRatio_chart") {
      totalCoverageRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      totalCoverageRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        totalCoverageRatio_chart.updateOptions(chartOptions);
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
    } else if (chartId === "costOfContributions_chart") {
      costOfContributions_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      costOfContributions_chart.render();
      document.addEventListener("dark-mode", function () {
        costOfContributions_chart.updateOptions(chartOptions);
      });
    }
  }
};

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
    const columns = ["25%", "50%", "75%"];
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
  let numericArr = arr.map((value) => parseFloat(value));

  if (type == "percent") {
    numericArr = numericArr.map((value) => parseFloat(value * 100));
  } else {
    numericArr = numericArr.map((value) => parseFloat(value));
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

const addClientDataToModalRow = (
  tableModalRow,
  year,
  clientArray,
  type,
  fixedNum,
  name
) => {
  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";
  const dataPoint = document.createElement("th");

  dataPoint.className = propClass;
  dataPoint.scope = propScope;

  clientArray.forEach((client) => {
    const text =
    Number(client[year].value) !== 0
      ? styleNumber(client[year].value, type, fixedNum)
      : "-";
    dataPoint.textContent = text;

    tableModalRow.appendChild(dataPoint);
  })

  if (name == 'daysCashOnHand') console.log({ tableModalRow, year, client, type, fixedNum, dataPoint, text });
};

const addPeerDataToModalRow = (
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
  end
) => {
  const propClass =
    "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2 dark:border-gray-600";
  const propScope = "row";

  const dataPointAvg = document.createElement("th");

  let avg;
  let testAvg
  if (peer && wa) {
    avg = parseFloat(getWeightedAverageOfArray(data, name));
    testAvg = getWeightedAverageOfArray(data, name);
  } else if (peer && !wa) {
    avg = parseFloat(getAverageOfArray(peer[dataArray], name));
  } else {
    avg = 0;
  }

  // Ensure avg is not NaN
  if (isNaN(avg)) {
    avg = 0;
  }

  if (peer) {
    const [q1, median, q3] = calculatePercentiles(peer[dataArray], type, fixedNum);

    // if (name == "fundraisingAsPercentOfContributions") {
    //   console.log(name, { q1, median, q3 });
    // }
  }

  const textAvg = peer ? styleNumber(avg, type, fixedNum) : "";
  const dataPointMid = document.createElement("th");
  const mid = peer ? parseFloat(getMidpointOfArray(peer[dataArray], name)) : "";
  // console.log('mid', mid);
  const textMid = styleNumber(mid, type, fixedNum);
  const dataPointMin = document.createElement("th");
  let min;
  if (name == "netIncomeRatio") {
    min = peer
      ? parseFloat(get25thPercentileOfArray(peer[dataArray], name))
      : "";
  } else {
    min = peer ? parseFloat(get25thPercentileOfArray(peer[dataArray])) : "";
  }
  const textMin = styleNumber(min, type, fixedNum);
  const dataPointMax = document.createElement("th");
  const max = peer ? parseFloat(get75thPercentileOfArray(peer[dataArray], name)) : "";
  const textMax = styleNumber(max, type, fixedNum);

  if (name == 'daysCashOnHand') console.log('daysCashOnHand', {
    tableRow,
    fixedNum,
    wa,
    testAvg,
    avg,
    textAvg,
    mid,
    min,
    textMin,
    max,
    textMax,
    peer,
    dataArray
  })

  // console.log(name, { tableRow, fixedNum, wa, avg, mid, min, textMin, max, textMax, peer, dataArray });

  dataPointAvg.className = propClass;
  dataPointAvg.scope = propScope;
  dataPointAvg.textContent = textAvg;
  tableRow.appendChild(dataPointAvg);

  dataPointMin.className = propClass;
  dataPointMin.scope = propScope;
  dataPointMin.textContent = textMin;
  tableRow.appendChild(dataPointMin);

  dataPointMid.className = propClass;
  dataPointMid.scope = propScope;
  dataPointMid.textContent = textMid;
  tableRow.appendChild(dataPointMid);

  dataPointMax.className = propClass;
  dataPointMax.scope = propScope;
  dataPointMax.textContent = textMax;
  tableRow.appendChild(dataPointMax);

};

const getPeerAndClientChartDataArrays = (
  years,
  dataPeer,
  dataClient,
  fixedNum,
  mainName,
  numType
) => {
  // console.log(mainName, {
  //   years,
  //   dataPeer,
  //   dataClient,
  //   fixedNum,
  //   mainName,
  //   numType,
  // });
  const peerAvg = [];
  const peerMid = [];
  const peer25 = [];
  const peer75 = [];
  const clientArray = [];

  years.forEach((year) => {
    // console.log(year, dataPeer)
    // check if dataPeer is undefined but dataClient is not
    if (dataPeer != undefined && dataClient != undefined) {
      const dataArray = dataPeer[year];
      const array = dataArray.map((item) => Number(item));
      // console.log(array)
      let avg = getAverageOfArray(array);
      let mid = getMidpointOfArray(array);
      let lower25 = get25thPercentileOfArray(array);
      let higher75 = get75thPercentileOfArray(array);
      let clientNum = Number(dataClient[year].value);

      if (numType === "percent") {
        avg *= 100;
        mid *= 100;
        lower25 *= 100;
        higher75 *= 100;
        clientNum *= 100;
      }

      clientNum.toFixed(fixedNum);

      // console.log(mainName,{ avg, mid, lower25, higher75, fixedNum, numType});

      peerAvg.push(parseFloat(avg.toFixed(fixedNum)));
      peerMid.push(parseFloat(mid.toFixed(fixedNum)));
      peer25.push(parseFloat(lower25.toFixed(fixedNum)));
      peer75.push(parseFloat(higher75.toFixed(fixedNum)));

      clientArray.push(clientNum);
    } else if (dataPeer == undefined && dataClient) {
      peerAvg.push(0);
      peerMid.push(0);
      peer25.push(0);
      peer75.push(0);

      let clientNum = Number(dataClient[year].value);
      if (numType === "percent") clientNum *= 100;
      clientNum.toFixed(fixedNum);
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

  // console.log({ clientArray, peerAvg, peerMid, peer25, peer75 });

  return { clientArray, peerAvg, peerMid, peer25, peer75 };
};

const styleNumber = (num, type, fixed) => {
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
      }); // Add commas for thousands and ensure fix
    }

    if (type === "percent" && text != 0) {
      text = (truncateNumber(parseFloat(text), fixed) * 100).toFixed(fixed) + "%";
    }

    if (type === "dollar" && text != 0) {
      textNum = truncateNumber(parseFloat(text), fixed).toFixed(fixed);
      text = fixed
        ? "$ " + parseFloat(textNum).toFixed(fixed)
        : "$ " + parseFloat(textNum).toLocaleString(); // Add commas for thousands
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
