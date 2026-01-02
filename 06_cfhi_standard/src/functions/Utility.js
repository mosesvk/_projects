const yearsData_Array = [];
const selectedYearsselectedYears_Array = [];
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
window.sliderValue = window.sliderValue || 0;
window.sliderValue2 = window.sliderValue2 || 25000;
// let amount = null;

const selectedRegions_Array = [];
const selectedSites_Array = [];

// Utility Functions

const createChartFromParsedData = (
  parsedData,
  chart,
  peer,
  client,
  type,
  fixedNum,
  mainName,
  benchmark,
  title,
  wa = null,
  allData = null
) => {
  //console.log('parsedData', parsedData);
  if (parsedData) {
    createChart(chart, parsedData[peer], parsedData[client], type, fixedNum, mainName, benchmark, title, wa, allData || parsedData);
    updateModal(mainName, parsedData[peer], parsedData[client]);
  }
};

const createChart = (chartId, dataPeer, dataClient, type, fixedNum, mainName, benchmark, title, wa = null, allData = null) => {
  // console.log('createChart()', { chartId, dataPeer, dataClient, type, fixedNum, mainName, benchmark, title, wa, allData });
  document.getElementById(chartId).innerHTML = "";

  // Create a new chart instance with all parameters
  const chartOptions = getMainChartOptions(
    dataPeer,
    dataClient,
    type,
    fixedNum,
    mainName,
    benchmark,
    title,
    chartId,
    wa,
    allData
  );

  // Check if chartOptions is null (invalid data)
  if (!chartOptions) {
    console.warn(`Cannot create chart ${chartId} - invalid chart options`);
    return;
  }

  const chart = new ApexCharts(
    document.getElementById(chartId),
    chartOptions
  );

  chart.render();

  // Store chart instance globally for print functionality
  window[chartId] = chart;

  // init again when toggling dark mode
  document.addEventListener("dark-mode", function () {
    chart.updateOptions(
      getMainChartOptions(dataPeer, dataClient, type, fixedNum, mainName, benchmark, title, chartId, wa, allData)
    );
  });
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

    // Add the remaining columns (matching comp project - using percentiles)
    const columns = ["25th", "50th", "75th"];
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

const getAverageOfArray = (array, name, num = 1) => {
  // Handle null, undefined, or non-array inputs
  if (!array || !Array.isArray(array)) {
    return 0;
  }
  
  // Filter out zero values before calculating average (matching comp implementation)
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value) * num);

  if (filteredArray.length === 0) {
    return 0;
  }
  const sum = filteredArray.reduce((acc, value) => acc + value, 0);
  const avg = sum / filteredArray.length;

  return avg;
};

const getMidpointOfArray = (array, mainName) => {
  // Handle null, undefined, or non-array inputs
  if (!array || !Array.isArray(array)) {
    return 0;
  }
  
  // Filter out zero values before calculating midpoint (matching comp implementation)
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value));

  if (filteredArray.length === 0) {
    return 0;
  }

  filteredArray.sort((a, b) => a - b); // Sort the array

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
  // Handle null, undefined, or non-array inputs
  if (!array || !Array.isArray(array)) {
    return 0;
  }
  
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value));

  const sortedArray = filteredArray.sort((a, b) => a - b);

  // Check if the array has less than or equal to 2 elements
  if (sortedArray.length <= 2) {
    // If array has 1 or 2 elements, return the average of the elements
    return (
      sortedArray.reduce((acc, val) => Number(acc) + Number(val), 0) /
      sortedArray.length
    );
  }

  // Calculate the index for the 25th percentile
  const index = (sortedArray.length + 1) * 0.25;

  // Check if the index is an integer
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
  // Handle null, undefined, or non-array inputs
  if (!array || !Array.isArray(array)) {
    return 0;
  }
  
  const filteredArray = array
    .filter((value) => Number(value) !== 0)
    .map((value) => Number(value));

  // Sort the array in ascending order
  const sortedArray = filteredArray.sort((a, b) => a - b);

  // Check if the array has less than or equal to 2 elements
  if (sortedArray.length <= 2) {
    // If array has 1 or 2 elements, return the average of the elements
    return (
      sortedArray.reduce((acc, val) => Number(acc) + Number(val), 0) /
      sortedArray.length
    );
  }

  // Calculate the index for the 75th percentile
  const index = (sortedArray.length + 1) * 0.75;

  // Check if the index is an integer
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

const getMaxOfArray = (array) => {
  const nonZeroArray = array.filter((num) => num !== 0);

  if (nonZeroArray.length === 0) {
    return 0;
  }

  return Math.max(...nonZeroArray);
};

const getMinOfArray = (array) => {
  // Filter out zero values before calculating minimum (matching comp implementation)
  const nonZeroArray = array.filter((num) => Number(num) !== 0);

  if (nonZeroArray.length === 0) {
    return 0;
  }

  return Math.min(...nonZeroArray);
};

const getSumOfArray = (array) => {
  // console.log(array);
  if (!array || !Array.isArray(array)) {
    return 0;
  }
  
  if (array.length === 0) {
    return 0;
  }

  return array.reduce((sum, value) => sum + parseFloat(value) || 0, 0);
};

const calculateAveragePercentageChange = (values) => {
  // console.log(values);
  // console.log('---');

  const years = Object.keys(values);
  const numberOfYears = years.length;

  if (numberOfYears < 2) {
    return 0.0; // No change if there are fewer than two years
  }

  let totalChange = 0;

  for (let i = 1; i < numberOfYears; i++) {
    const year = years[i];
    const previousYear = years[i - 1];

    const initialValue = parseFloat(values[previousYear][0]);
    const finalValue = parseFloat(values[year][0]);

    if (initialValue === 0) {
      if (finalValue === 0) {
        continue; // No change if both initial and final values are zero
      } else {
        totalChange = Infinity; // Handle division by zero
        break;
      }
    }

    const change = ((finalValue - initialValue) / Math.abs(initialValue)) * 100;
    totalChange += change;
  }

  const averagePercentageChange = totalChange / (numberOfYears - 1);

  return averagePercentageChange ? averagePercentageChange.toFixed(1) : 0; // Ensure one decimal point
};

/**
 * Create a warning toast notification
 * @param {string} textString - The message to display in the toast
 */
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
    event.stopPropagation();
    toastWarningDiv.remove();
  });

  document.body.appendChild(toastWarningDiv);

  const clickOutsideHandler = (event) => {
    if (!toastWarningDiv.contains(event.target)) {
      toastWarningDiv.remove();
      document.body.removeEventListener("click", clickOutsideHandler);
    }
  };

  setTimeout(() => {
    document.body.addEventListener("click", clickOutsideHandler);
  }, 100);
};

/**
 * Create a success toast notification
 * @param {string} textString - The message to display in the toast
 */
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

  const clickOutsideHandler = (event) => {
    if (!toastSuccessDiv.contains(event.target)) {
      toastSuccessDiv.remove();
      document.body.removeEventListener("click", clickOutsideHandler);
    }
  };

  document.body.addEventListener("click", clickOutsideHandler);

  const closeButton = toastSuccessDiv.querySelector(
    '[data-dismiss-target="#toast-success"]'
  );
  closeButton.addEventListener("click", () => {
    toastSuccessDiv.remove();
    document.body.removeEventListener("click", clickOutsideHandler);
  });

  document.body.appendChild(toastSuccessDiv);
};

/**
 * Get selected years from localStorage
 * @returns {Array} Array of selected years
 */
const getSelectedYearsFromLocalStorage = () => {
  const storedSelectedYears = JSON.parse(localStorage.getItem("selectedYears"));
  const storedData = localStorage.getItem("general");
  if (!storedSelectedYears && storedData) {
    console.error("Need to Select Year");
  }

  return storedSelectedYears;
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

  yearsArray.sort((a, b) => b - a);

  yearsArray.forEach((year) => {
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${year}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${year}`);
    newInput.setAttribute("class", `form-checkbox h-4 w-4 text-gray-600 mr-2`);
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

const getPeerAndClientChartDataArrays = (
  years,
  dataPeer,
  dataClient,
  fixedNum,
  mainName,
  benchmark,
  type,
  wa = null,
  allData = null
) => {
  console.log({ years, dataPeer, dataClient, fixedNum, mainName, benchmark, type });

  const peerAvg = [];
  const peerMid = [];
  const peer25 = [];
  const peer75 = [];
  const clientArray = [];
  const benchmarkArray = [];

  years.forEach((year) => {
    benchmarkArray.push(benchmark);

    if (!dataPeer && dataClient && dataClient[year]) {
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

      if (clientValue !== null && clientValue !== undefined && clientValue !== "") {
        // Extract raw numeric value, removing commas if present
        let clientNum = typeof clientValue === 'string' ? 
          parseFloat(clientValue.replace(/,/g, '')) : parseFloat(clientValue);
        
        // Check if the parsed value is a valid number
        if (!isNaN(clientNum) && isFinite(clientNum)) {
          // Only multiply by 100 for percentages (ApexCharts expects percentage values as 0-100, not 0-1)
          if (type === "percent") {
            clientNum *= 100;
          }
          
          clientArray.push(clientNum);
        } else {
          clientArray.push(null);
        }
      } else {
        clientArray.push(null);
      }
    } else if (dataPeer && dataPeer[year] !== undefined && dataClient && dataClient[year] !== undefined) {
      let numToTimesByIfPercent = 1;
      if (type == "percent") numToTimesByIfPercent = 100;

      const array = dataPeer[year];
      // Use weighted average if "wa" is present, otherwise use simple average
      let avg;
      if (wa && allData) {
        // Use weighted average for specific year
        avg = getWeightedAverageOfArray(allData, mainName, year);
        avg *= numToTimesByIfPercent;
      } else {
        // Use simple average
        avg = getAverageOfArray(array, mainName);
        avg *= numToTimesByIfPercent;
      }
      let mid = getMidpointOfArray(array, mainName);
      mid *= numToTimesByIfPercent;
      let lower25 = get25thPercentileOfArray(array, mainName);
      lower25 *= numToTimesByIfPercent;
      let higher75 = get75thPercentileOfArray(array, mainName);
      higher75 *= numToTimesByIfPercent;

    peerAvg.push(avg.toFixed(fixedNum));
      peerMid.push(mid.toFixed(fixedNum));
      peer25.push(lower25.toFixed(fixedNum));
      peer75.push(higher75.toFixed(fixedNum));

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

      if (clientValue !== null && clientValue !== undefined && clientValue !== "") {
        // Extract raw numeric value, removing commas if present
        let clientNum = typeof clientValue === 'string' ? 
          parseFloat(clientValue.replace(/,/g, '')) : parseFloat(clientValue);
        
        // Check if the parsed value is a valid number
        if (!isNaN(clientNum) && isFinite(clientNum)) {
          // Only multiply by 100 for percentages (ApexCharts expects percentage values as 0-100, not 0-1)
          if (type === "percent") {
            clientNum *= 100;
          }
          
          clientArray.push(clientNum);
        } else {
          clientArray.push(null);
        }
      } else {
        clientArray.push(null);
      }
    } else if (dataPeer[year] === undefined && dataClient[year]) {
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
    } else if (!dataClient || !dataPeer) {
      throw new Error(
        `No Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
      createToastWarning(
        `check Data for ${mainName} - object: ${{ dataPeer, dataClient }}`
      );
    }
  });

  return { clientArray, peerAvg, peerMid, peer25, peer75, benchmarkArray };
};

const styleNumber = (num, type, fixed) => {
  let text = num;

  // if (text == 0 || text == 0.00) text = "-";

  if (!isNaN(text)) {
    if (type === "num" && text != 0) {
      text = Number(text).toFixed(fixed);
      text = Number(text).toLocaleString(); // Add commas for thousands
    }

    if (type === "percent" && text != 0) {
      text = parseFloat(text * 100).toFixed(fixed) + "%";
    } else if (type === "percent" && text == 0.00) { 
      text = "0%"
    }

    if (type === "dollar" && text != 0) {
      text = parseFloat(text).toFixed(fixed);
      text = "$ " + Number(text).toLocaleString(); // Add commas for thousands
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
    firstPElement.textContent = "Per Giving Units";
    thElement.appendChild(firstPElement);

    const secondPElement = document.createElement("p");
    secondPElement.className = "pl-4";
    secondPElement.textContent = "Median Household Income";
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

    console.log(row, benchmarkArray, trId);

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

// <------------------------------------  SLIDER RANGE ------------------------------------------------------------------>
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
  if (!array || !array.length) return;
  
  // Filter out null/undefined values and safely process items
  const trimmedArray = array
    .filter(item => item != null && typeof item === 'string')
    .map(item => item.trim().replace(/\n/g, '').replace(/Action\s+Required/g, 'Action Required'));
  
  if (!trimmedArray.length) return;
  
  // console.log({ array, row, trimmedArray});

  let color =
    trimmedArray[0] === "Warning"
      ? "warning"
      : trimmedArray[0] === "Good"
      ? "good"
      : trimmedArray[0] === "Action Required"
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
        <svg class="w-4 h-4 mx-2 text-white " aria-hidden="true" xmlns="http://www.w3.org/ 00/svg" fill="none" viewBox="0 0 14 10">
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

/**
 * Add click event to benchmark element
 * Updated to use benchmark paragraph data from localStorage
 * @param {string} elementId - The row element ID (e.g., "row_daysOperatingCash")
 * @param {string} fieldName - The field name (e.g., "daysOperatingCash")
 * @param {string} dataCategory - The data category (e.g., "cashData", "debtData")
 */
const addClickEventToBenchmark = (elementId, fieldName, dataCategory) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element not found: ${elementId}`);
    return;
  }
  
  const benchmarkFieldName = `${fieldName}_benchmarkParagraph`;
  element.onclick = () => {
    createBenchmark(benchmarkFieldName, dataCategory, elementId);
  };
};

/**
 * Generate benchmark title from field name
 * @param {string} fieldName - The field name (e.g., "daysOperatingCash")
 * @returns {string} - Formatted title (e.g., "Days Operating Cash Benchmark")
 */
const generateBenchmarkTitle = (fieldName) => {
  // Convert camelCase to Title Case and add "Benchmark"
  const title = fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
  return `${title} Benchmark`;
};

/**
 * Process HTML content and add mb-2 class to p tags
 * @param {string} htmlContent - The HTML content string
 * @returns {string} - Processed HTML content
 */
const processHtmlContent = (htmlContent) => {
  if (typeof htmlContent !== 'string') {
    return '';
  }
  
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Find all p tags and add mb-2 class and text styling
  const pTags = tempDiv.querySelectorAll('p');
  pTags.forEach(p => {
    const existingClasses = p.className.trim();
    const classArray = existingClasses ? existingClasses.split(/\s+/) : [];
    const newClasses = [];
    
    // Add mb-2 if not present
    if (!classArray.includes('mb-2')) {
      newClasses.push('mb-2');
    }
    
    // Add text color classes if not present
    if (!classArray.some(cls => cls.includes('text-gray-500'))) {
      newClasses.push('text-gray-500');
    }
    
    if (!classArray.some(cls => cls.includes('dark:text-gray-400'))) {
      newClasses.push('dark:text-gray-400');
    }
    
    // Apply new classes
    if (newClasses.length > 0) {
      if (existingClasses) {
        p.className = `${newClasses.join(' ')} ${existingClasses}`;
      } else {
        p.className = newClasses.join(' ');
      }
    }
  });
  
  return tempDiv.innerHTML;
};

/**
 * Create benchmark modal and populate report content dynamically from localStorage
 * Based on comp project implementation, adapted for Standard project
 * @param {string} benchmarkFieldName - The field name for the benchmark (e.g., "daysOperatingCash_benchmarkParagraph")
 * @param {string} dataCategory - The data category (e.g., "cashData", "debtData")
 * @param {string} elementId - The row element ID (e.g., "row_daysOperatingCash")
 * @returns {Object} - The tingle modal instance
 */
const createBenchmark = async (benchmarkFieldName, dataCategory, elementId) => {
  // Get data from localStorage
  const data = localStorage.getItem(dataCategory);
  if (!data) {
    console.warn(`No data found for category: ${dataCategory}`);
    return null;
  }

  const parsedData = JSON.parse(data);
  const benchmarkData = parsedData[benchmarkFieldName];
  
  if (!benchmarkData) {
    console.warn(`No benchmark data found for field: ${benchmarkFieldName}`);
    return null;
  }

  // Get selected years to access benchmark paragraph
  const selectedYears = getSelectedYearsFromLocalStorage();
  if (!selectedYears || selectedYears.length === 0) {
    console.warn('No selected years found');
    return null;
  }

  // Ensure fixUnicodeCharacters is available (defined in DisplayCharts.js)
  if (typeof fixUnicodeCharacters !== 'function') {
    console.warn('fixUnicodeCharacters function not found, skipping Unicode processing');
  }

  // Use the first available year to get benchmark paragraph data
  const targetYear = selectedYears[0];
  const benchmarkContent = benchmarkData[targetYear]?.value;

  if (!benchmarkContent || benchmarkContent === '0') {
    // Silently skip if benchmark content is missing (field may not exist in QuickBase)
    // console.warn(`No benchmark content for field: ${benchmarkFieldName}, year: ${targetYear}`);
    return null;
  }

  // Extract field name from benchmarkFieldName (remove _benchmarkParagraph suffix)
  const fieldName = benchmarkFieldName.replace(/_benchmarkParagraph$/, '');
  
  // Generate title from field name
  const benchmarkTitle = generateBenchmarkTitle(fieldName);

  // Process HTML content and apply fixUnicodeCharacters
  let processedContent = processHtmlContent(benchmarkContent);
  let processedTitle; 
  if (typeof fixUnicodeCharacters === 'function') {
    processedContent = fixUnicodeCharacters(processedContent);
    processedTitle = fixUnicodeCharacters(benchmarkTitle);
  } else {
    processedTitle = benchmarkTitle;
  }

  // Create modal for clickable benchmark interactions
  let variable = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ["overlay", "button", "escape"],
    closeLabel: "Close",
    cssClass: ["custom-class-1", "custom-class-2"],
    beforeClose: function () {
      return true; // close the modal
    },
  });

  // Build modal content (INCLUDE the title for the tingle modal)
  const modalContent = `<div><p class="mb-2"><strong>${processedTitle}</strong></p>${processedContent}</div>`;
  variable.setContent(modalContent);

  // Build report content (SKIP the title for the report tab _body-3 section)
  const reportContent = `<div>${processedContent}</div>`;

  // Populate the _body-3 section with the benchmark description (without title)
  try {
    // Extract field name from elementId (e.g., "row_daysOperatingCash" -> "daysOperatingCash")
    const rowFieldName = elementId.replace(/^row_/, '');
    const body3Selector = `#${rowFieldName}-body-3 div`;
    const body3Element = document.querySelector(body3Selector);
    
    if (body3Element) {
      // Set the innerHTML of the _body-3 element with the report content (without title)
      body3Element.innerHTML = reportContent;
    } else {
      // console.warn(`_body-3 element not found for selector: ${body3Selector}`);
    }
  } catch (error) {
    console.error(`Error populating _body-3 section for ${elementId}:`, error);
  }

  // Set up click handlers for year columns
  if (selectedYears && selectedYears.length > 0) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id ${elementId} not found for benchmark modal`);
      return variable;
    }
    
    const children = element.children;
    if (!children || children.length === 0) {
      console.warn(`Element ${elementId} has no children for benchmark modal`);
      return variable;
    }
    
    for (let i = 1; i < selectedYears.length + 1 && i < children.length; i++) {
      if (children[i]) {
        editElementChildren(children[i], variable, elementId);
      }
    }
  }

  return variable;
};

const editElementChildren = (element, variable, elementId) => {
  // console.log({ element, variable });
  if (!element) {
    console.warn(`Element not found for elementId: ${elementId}`);
    return;
  }

  if (!variable) {
    console.warn(`Variable (modal) not provided for elementId: ${elementId}`);
    return;
  }

  // console.log(element);

  element.addEventListener("click", () => {
    variable.open();
  });
  element.classList.add("cursor-pointer");
  element.classList.add("hover:text-lg");
  element.classList.add("hover:opacity-100");
  element.classList.add("transition");
  element.classList.add("ease-in-out");

};

/**
 * Show or hide the API loading modal
 * @param {string} action - "open" or "close"
 * @param {string} mode - "api" or "print"
 */
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
