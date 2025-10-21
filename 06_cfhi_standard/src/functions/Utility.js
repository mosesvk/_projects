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
  title
) => {
  //console.log('parsedData', parsedData);
  if (parsedData) {
    createChart(chart, parsedData[peer], parsedData[client], type, fixedNum, mainName, benchmark, title);
    updateModal(mainName, parsedData[peer], parsedData[client]);
  }
};

const createChart = (chartId, dataPeer, dataClient, type, fixedNum, mainName, benchmark, title) => {
  // console.log('createChart()', { chartId, dataPeer, dataClient, type, fixedNum, mainName, benchmark, title });
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
    chartId
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

  // init again when toggling dark mode
  document.addEventListener("dark-mode", function () {
    chart.updateOptions(
      getMainChartOptions(dataPeer, dataClient, type, fixedNum, mainName, benchmark, title, chartId)
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

    // Add the remaining columns
    const columns = ["Mid", "Min", "Max"];
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
  if (array.length === 0) {
    return 0;
  }
  const sum = array.reduce((acc, str) => acc + Number(str), 0);
  const avg = sum / array.length;

  return avg;
};

const getMidpointOfArray = (array) => {
  // console.log(array);
  if (array.length === 0) {
    return 0;
  }

  array.sort((a, b) => a - b); // Sort the array

  const midpoint = Math.floor(array.length / 2); // Calculate the midpoint index

  if (array.length % 2 === 1) {
    // If odd length, return the value at the midpoint
    return Number(array[midpoint]);
  } else {
    // If even length, return the average of the two midpoints
    return (Number(array[midpoint - 1]) + Number(array[midpoint])) / 2;
  }
};

const get25thPercentileOfArray = (array, mainName) => {
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

  return Math.min(...array);
};

const getSumOfArray = (array) => {
  // console.log(array);
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

const getSelectedYearsFromLocalStorage = () => {
  const storedSelectedYears = JSON.parse(localStorage.getItem("selectedYears"));
  const storedData = localStorage.getItem("demo");
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
    benchmarkArray.push(benchmark);

    if (!dataPeer && dataClient[year]) {
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
      let numToTimesByIfPercent = 1;
      if (type == "percent") numToTimesByIfPercent = 100;

      const array = dataPeer[year];
      let avg = getAverageOfArray(array);
      avg *= numToTimesByIfPercent;
      let mid = getMidpointOfArray(array);
      mid *= numToTimesByIfPercent;
      let lower25 = get25thPercentileOfArray(array);
      lower25 *= numToTimesByIfPercent;
      let higher75 = get75thPercentileOfArray(array);
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
    } else if (dataClient == undefined || dataPeer == undefined) {
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
  if (!array.length) return;
  
  const trimmedArray = array.map(item => item.trim().replace(/\n/g, '').replace(/Action\s+Required/g, 'Action Required'));
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
