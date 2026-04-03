const yearsData_Array = [];
const selectedYearsselectedYears_Array = [];
/**
 * Matches radio `value`: 1 = schoolAndChurch (default, all peer types); 0 = schoolOnly (field 288 school clients).
 */
let selectedSchoolChurch = 1;
let selectedImagesArray = []
let uniqueClients
let firmName;


const regions_Array = [
  { arr: ["New England CT, RI, MA, VT, NH"], str: "NE" },
  { arr: ["Mid-Atlantic VA, WV, MD, DE, NJ, NY, PA, DC"], str: "MA" },
  { arr: ["South AR, LA, AL, TN, KY, GA, FL, SC, NC, MS"], str: "SO" },
  { arr: ["Midwest WI, IL, IN, MI, OH, IA, MN"], str: "MW" },
  { arr: ["Plains KS, MO, OK, TX, ND, SD, NE"], str: "PL" },
  { arr: ["Mountain/Southwest ID, MT, WY, CO, UT, NV, AZ, NM"], str: "MT" },
  { arr: ["West Coast CA, OR, WA"], str: "WC" },
];

// Mission Sending
// Relief Ops
// Healthcare
// Bible Translators
// Education
// Other
// Child Sponsorships
const types_Array = [
  { arr: ["Mission Sending"], str: "MS" },
  { arr: ["Relief Ops"], str: "RO" },
  { arr: ["Healthcare"], str: "HC" },
  { arr: ["Bible Translators"], str: "BT" },
  { arr: ["Education"], str: "ED" },
  { arr: ["Other"], str: "OT" },
  { arr: ["Child Sponsorships"], str: "CS" },
]

const schoolChurch_Array = [
  { arr: ["School and Church"], str: 1 },
  { arr: ["School Only"], str: 0 },
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

let selectedRegion = "";
const selectedregion_Array = [];
const selectedSites_Array = [];
const selectedTypes_Array = []
let selectedSchoolChurch_Selected;

// Utility Functions

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
    // console.log({ parsedData, chart, peer, client, type, fixedNum, mainName });
    createChart(chart, parsedData[peer], parsedData[client], type, fixedNum, mainName, parsedData);
    updateModal(mainName, parsedData[peer], parsedData[client]);
  }
};

const createChart = (chartId, dataPeer, dataClient, type, fixedNum, name, allData = null) => {
  // console.log('createChart()', { chartId, dataPeer, dataClient, type, fixedNum });
  document.getElementById(chartId).innerHTML = "";




  // Create a new chart instance
  const chart = new ApexCharts(
    document.getElementById(chartId),
    getMainChartOptions(dataPeer, dataClient, type, fixedNum, name, allData)
  );

  chart.render();

  // Expose chart instance for Print Presentation (base64 export to Quickbase)
  if (typeof window !== "undefined") {
    window[chartId] = chart;
  }

  // init again when toggling dark mode
  document.addEventListener("dark-mode", function () {
    chart.updateOptions(
      getMainChartOptions(dataPeer, dataClient, type, fixedNum, name, allData)
    );
  });
};

function updateModal(mainName, avgData, clientData) {
  // Get the selected years from local storage; show only years that exist in peer data
  const selectedYears = getSelectedYearsFromLocalStorage();
  const yearsToShow =
    Array.isArray(selectedYears) && avgData
      ? selectedYears.filter((year) => avgData[year])
      : [];

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
    const columns = ["25%","50%", "75%"];
    columns.forEach((column) => {
      const col = document.createElement("th");
      col.className = "px-6 py-3";
      col.textContent = column;
      headerRow.appendChild(col);
    });

    // Add a row for each year that has peer data
    yearsToShow.forEach((year) => {
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

const getMaxOfArray = (array) => {
  const nonZeroArray = array.filter((num) => num !== 0);

  if (nonZeroArray.length === 0) {
    return 0;
  }

  return Math.max(...nonZeroArray);
};

const OfArray = (array) => {
  return Math.min(...array);
};

const get25thPercentileOfArray = (array) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return 0;
  }
  // Step 1: Sort the array in ascending order
  const sortedArray = array.slice().sort((a, b) => Number(a) - Number(b));
  // Step 2: Check if the array has less than or equal to 2 elements
  if (sortedArray.length <= 2) {
    // If array has 1 or 2 elements, return the average of the elements
    return sortedArray.reduce((acc, val) => Number(acc) + Number(val), 0) / sortedArray.length;
  }

  // Step 3: Calculate the index for the 25th percentile
  const index = (sortedArray.length + 1) * 0.25;

  // Step 4: Check if the index is an integer
  if (Number.isInteger(index)) {
    // If it's an integer, return the value at that index
    return sortedArray[index - 1];
  } else {
    // If not an integer, interpolate between the two nearest values
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const lowerValue = Number(sortedArray[lowerIndex - 1]);
    const upperValue = Number(sortedArray[upperIndex - 1]);
    return (lowerValue + upperValue) / 2;
  }
};

const get75thPercentileOfArray = (array) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return 0;
  }
  // Step 1: Sort the array in ascending order
  const sortedArray = array.slice().sort((a, b) => Number(a) - Number(b));
  // Step 2: Calculate the index for the 75th percentile
  const index = Math.ceil(sortedArray.length * 0.75);
  // Step 3: Return the value at the calculated index (index 0 when length is 0 is handled above)
  const value = sortedArray[Math.max(0, index - 1)];
  return Number(value);
};

// 


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

/**
 * Show or hide the API loading modal (matches comp project process).
 * @param {string} action - "open" or "close"
 * @param {string} [mode] - "api" for data load (show year range) or "print" for presentation (hide year range)
 * @param {number} [closeDelayMs] - Optional delay in ms before hiding (close only). If omitted, uses 1500. Use shorter value (e.g. 400) when showing success toast so overlay hides before toast.
 */
function showApiLoadingFunction(action, mode, closeDelayMs) {
  const loadingDiv = document.getElementById("loadingApiDiv");
  const loadingApiHeader = document.getElementById("loadingApiHeader");
  const apiPrint = document.getElementById("apiPrint");
  const firstApiYearSpan = document.getElementById("firstApiYear");
  const lastApiYearSpan = document.getElementById("LastApiYear");
  const apiYears = document.getElementById("apiYears");
  const loadingApiYears = document.getElementById("loadingApiYears");

  if (!loadingDiv || !loadingApiHeader) return;

  if (action === "close") {
    const delay = typeof closeDelayMs === "number" ? closeDelayMs : 1500;
    setTimeout(() => {
      loadingDiv.classList.add("hidden");
    }, delay);
  } else if (action === "open") {
    loadingDiv.classList.remove("hidden");

    if (mode === "api") {
      loadingApiHeader.innerHTML = "Loading Data";
      if (apiYears) apiYears.classList.remove("hidden");
      if (apiPrint) apiPrint.classList.add("hidden");
      if (loadingApiYears) loadingApiYears.classList.remove("hidden");

      const selectedYears = getSelectedYearsFromLocalStorage();
      if (selectedYears && selectedYears.length > 0 && firstApiYearSpan && lastApiYearSpan) {
        firstApiYearSpan.textContent = selectedYears[0];
        lastApiYearSpan.textContent = selectedYears[selectedYears.length - 1];
      }
    } else if (mode === "print") {
      loadingApiHeader.innerHTML = "Creating Presentation Slides";
      if (apiYears) apiYears.classList.add("hidden");
      if (apiPrint) apiPrint.classList.remove("hidden");
      if (loadingApiYears) loadingApiYears.classList.add("hidden");
    }
  }
}

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

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${year}`);
    newInput.setAttribute("class", `form-checkbox h-4 w-4 colorBlue mr-2`);
    newInput.setAttribute("value", year);
    newInput.checked = selectedYears_Set.has(year);

    newInput.addEventListener("change", (e) =>
      changeListenerForInputYears(e.target, year)
    );

    const newSpan = document.createElement("span");
    // Inherit text-2xl and colorBlue from #options-list (match church options-list-year)
    newSpan.innerText = year;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListElement.appendChild(newLabel);
  });
};

/**
 * Populates the options-list-region dropdown with region checkboxes from regions_Array.
 * Includes a "(select all)" option. All options are always visible (no max-height).
 * Updates selectedregion_Array on change.
 */
const addUniqueRegionsToOptionsSelectDropdown = () => {
  const optionsListRegion = document.getElementById("options-list-region");
  if (!optionsListRegion) return;

  optionsListRegion.innerHTML = "";

  const labelClass =
    "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded";
  const inputClass = "form-checkbox h-4 w-4 colorBlue mr-2 rounded";

  const regionInputs = [];

  // "(select all)" option
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "option-region-selectall");
  selectAllLabel.setAttribute("class", labelClass);
  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "option-region-selectall");
  selectAllInput.setAttribute("class", inputClass);
  selectAllInput.checked = selectedregion_Array.length === 0 || selectedregion_Array.length === regions_Array.length;
  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("class", "dark:text-white");
  selectAllSpan.innerText = "(select all)";
  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);
  optionsListRegion.appendChild(selectAllLabel);

  selectAllInput.addEventListener("change", () => {
    const checked = selectAllInput.checked;
    regionInputs.forEach((input) => {
      input.checked = checked;
    });
    selectedregion_Array.length = 0;
    if (checked) {
      regions_Array.forEach((r) => selectedregion_Array.push(r.str));
    }
  });

  // Individual region options
  regions_Array.forEach((regionObj) => {
    const regionName = regionObj.arr[0];
    const regionStr = regionObj.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-region-${regionStr}`);
    newLabel.setAttribute("class", labelClass);

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-region-${regionStr}`);
    newInput.setAttribute("class", inputClass);
    newInput.setAttribute("value", regionStr);
    newInput.checked = selectedregion_Array.includes(regionStr);
    regionInputs.push(newInput);

    newInput.addEventListener("change", () => {
      if (newInput.checked) {
        selectedregion_Array.push(regionStr);
      } else {
        const idx = selectedregion_Array.indexOf(regionStr);
        if (idx > -1) selectedregion_Array.splice(idx, 1);
      }
      selectAllInput.checked = selectedregion_Array.length === regions_Array.length;
    });

    const newSpan = document.createElement("span");
    newSpan.setAttribute("class", "dark:text-white");
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);
    optionsListRegion.appendChild(newLabel);
  });

  if (selectedregion_Array.length === 0) {
    regions_Array.forEach((r) => selectedregion_Array.push(r.str));
    regionInputs.forEach((i) => (i.checked = true));
    selectAllInput.checked = true;
  }
};

/**
 * Builds chart data arrays for peer (avg, mid, 25%, 75%) and client per year.
 * For percent type, values are scaled by 100 so the chart matches modal display (e.g. 0.05 → 5).
 * @param {number[]} years - Years to include
 * @param {Object} dataPeer - Peer data keyed by year (each value is array of numbers)
 * @param {Object} dataClient - Client data keyed by year (each value has .value)
 * @param {number} fixedNum - Decimal places for toFixed
 * @param {string} [numType] - "percent" | "number" | "dollar" — for percent, scale by 100
 * @returns {{ clientArray: string[], peerAvg: string[], peerMid: string[], peer25: string[], peer75: string[] }}
 */
const getPeerAndClientChartDataArrays = (
  years,
  dataPeer,
  dataClient,
  fixedNum,
  numType,
  mainName = "",
  allData = null
) => {
  const peerAvg = [];
  const peerMid = [];
  const peer25 = [];
  const peer75 = [];
  const clientArray = [];

  /** Scale factor for percent: chart expects 0–100 scale to match modal (styleNumber multiplies by 100). */
  const scale = numType === "percent" ? 100 : 1;

  /**
   * Iterate over the provided years (already filtered in getMainChartOptions)
   * and build peer and client series. If peer data is missing for a year,
   * use 0s so the client bar can still render.
   */
  const safeYears = Array.isArray(years) ? years : [];

  safeYears.forEach((year) => {
    const peerArray =
      dataPeer && Array.isArray(dataPeer[year]) ? dataPeer[year] : null;
    const hasPeerData = !!(peerArray && peerArray.length);

    if (hasPeerData) {
      let avg;
      if (mainName === "studentFacilityRatio" && allData) {
        // Recalculate per-year student/faculty ratio using teacher/student sums
        // (matches report tab + modal expectations).
        const fullTimeArr = allData.fullTimeTeachers_Peer?.[year] || [];
        const partTimeArr = allData.partTimeTeachers_Peer?.[year] || [];
        const studentsArr =
          allData.studentAverageEnrollment_Main?.[year] || [];

        const numFullTime = getSumOfArray(fullTimeArr);
        const numPartTime = getSumOfArray(partTimeArr);
        const numStudents = getSumOfArray(studentsArr);

        avg = numStudents === 0 ? 0 : (numFullTime + 0.5 * numPartTime) / numStudents;
      } else if (mainName === "netTuitionARasPercentCurrentAssets" && allData) {
        // Recalculate per-year A/R as % of current assets using sums
        const receivablesArr =
          allData.studentsAccountsReceivable?.[year] || [];
        const currentAssetsArr = allData.currentAssets?.[year] || [];

        const numStudentAccountsReceivable = getSumOfArray(receivablesArr);
        const numCurrentAssets = getSumOfArray(currentAssetsArr);

        avg = numCurrentAssets === 0 ? 0 : numStudentAccountsReceivable / numCurrentAssets;
      } else if (mainName === "netIncomeRatio" && allData) {
        // Recalculate per-year Net Income Ratio using sums
        const changeInUnrestrictedNetAssetsArr =
          allData.changeInUnrestrictedNetAssets?.[year] || [];
        const unrestrictedSupportRevenuesReclassificationArr =
          allData.unrestrictedSupportRevenuesReclassification?.[year] || [];

        const numerator = getSumOfArray(changeInUnrestrictedNetAssetsArr);
        const denominator = getSumOfArray(
          unrestrictedSupportRevenuesReclassificationArr
        );

        avg = denominator === 0 ? 0 : numerator / denominator;
      } else if (mainName === "grossTuition" && allData) {
        // Recalculate per-year Gross Tuition using sums
        const grossTuitionRevenuesArr =
          allData.grossTuitionRevenuesExcludingFees?.[year] || [];
        const studentsArr =
          allData.studentAverageEnrollment_Main?.[year] || [];

        const numerator = getSumOfArray(grossTuitionRevenuesArr);
        const denominator = getSumOfArray(studentsArr);

        avg = denominator === 0 ? 0 : numerator / denominator;
      } else if (
        mainName === "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits" &&
        allData
      ) {
        // Recalculate per-year salaries+benefits as % of net tuition using sums.
        // (Total Teacher Salaries + Total Teacher Benefits) / (Gross Tuition - Financial Aid)
        const totalTeacherSalariesArr =
          allData.totalTeacherSalaries?.[year] || [];
        const totalTeacherBenefitsArr =
          allData.totalTeacherBenefits?.[year] || [];
        const grossTuitionRevenuesArr =
          allData.grossTuitionRevenuesExcludingFees?.[year] || [];
        const financialAidScholarshipsArr =
          allData.financialAidScholarships?.[year] || [];

        const numTotalTeacherSalaries = getSumOfArray(totalTeacherSalariesArr);
        const numTotalTeacherBenefits = getSumOfArray(totalTeacherBenefitsArr);
        const numGrossTuition = getSumOfArray(grossTuitionRevenuesArr);
        const numFinancialAid = getSumOfArray(financialAidScholarshipsArr);

        const numerator = numTotalTeacherSalaries + numTotalTeacherBenefits;
        const denominator = numGrossTuition - numFinancialAid;

        avg = denominator === 0 ? 0 : numerator / denominator;
      } else if (
        mainName === "financialAssistanceAsPercentTuitionAndFees" &&
        allData
      ) {
        // Recalculate per-year financial assistance as % of tuition/fees using sums
        const financialAidScholarshipsArr =
          allData.financialAidScholarships?.[year] || [];
        const grossTuitionRevenuesArr =
          allData.grossTuitionRevenuesExcludingFees?.[year] || [];

        const numerator = getSumOfArray(financialAidScholarshipsArr);
        const denominator = getSumOfArray(grossTuitionRevenuesArr);

        avg = denominator === 0 ? 0 : numerator / denominator;
      } else if (mainName === "liquidityRatio" && allData) {
        // Recalculate per-year liquidity ratio using cash/liability sums.
        const totalCashArr = allData.totalCash?.[year] || [];
        const nonEndowmentArr = allData.nonEndowmentInvestments?.[year] || [];
        const currentLiabilitiesArr = allData.currentLiabilities?.[year] || [];
        const deferredRevenueArr = allData.deferredRevenue?.[year] || [];

        const numTotalCash = getSumOfArray(totalCashArr);
        const numNonEndowment = getSumOfArray(nonEndowmentArr);
        const numCurrentLiabilities = getSumOfArray(currentLiabilitiesArr);
        const numDeferredRevenue = getSumOfArray(deferredRevenueArr);

        const denominator = numCurrentLiabilities - numDeferredRevenue;
        avg = denominator === 0 ? 0 : (numTotalCash + numNonEndowment) / denominator;
      } else if (mainName === "daysCashOnHand" && allData) {
        // Recalculate per-year days cash on hand using cash & expense sums.
        const totalCashArr = allData.totalCash?.[year] || [];
        const totalExpensesArr = allData.totalExpenses?.[year] || [];

        const numTotalCash = getSumOfArray(totalCashArr);
        const numTotalExpenses = getSumOfArray(totalExpensesArr);

        const denominator = numTotalExpenses / 365;
        avg = denominator === 0 ? 0 : numTotalCash / denominator;
      } else if (mainName === "currentRatio" && allData) {
        // Recalculate per-year current ratio using current asset/liability sums.
        const currentAssetsArr = allData.currentAssets?.[year] || [];
        const currentLiabilitiesArr = allData.currentLiabilities?.[year] || [];

        const numCurrentAssets = getSumOfArray(currentAssetsArr);
        const numCurrentLiabilities = getSumOfArray(currentLiabilitiesArr);

        avg = numCurrentLiabilities === 0 ? 0 : numCurrentAssets / numCurrentLiabilities;
      } else if (mainName === "debtPerStudent" && allData) {
        // Recalculate per-year debt per student using total debt / student enrollment sums.
        const totalDebtArr = allData.totalDebt?.[year] || [];
        const studentsArr = allData.studentAverageEnrollment_Main?.[year] || [];

        const numTotalDebt = getSumOfArray(totalDebtArr);
        const numStudents = getSumOfArray(studentsArr);

        avg = numStudents === 0 ? 0 : numTotalDebt / numStudents;
      } else if (mainName === "debtCoverage" && allData) {
        // Recalculate per-year debt coverage using the same numerator/denominator as weighted average.
        const changeInUnrestrictedNetAssetsArr =
          allData.changeInUnrestrictedNetAssets?.[year] || [];
        const currentYearInterestExpenseArr =
          allData.currentYearInterestExpense?.[year] || [];
        const totalDepreciationExpenseArr =
          allData.totalDepreciationExpense?.[year] || [];
        const capitalizedInterestArr =
          allData.capitalizedInterest?.[year] || [];
        const currentMaturitiesOfLTDebtArr =
          allData.currentMaturingDebt?.[year] ||
          allData.currentMaturitiesOfLTDebt?.[year] ||
          [];

        const numChangeInUnrestrictedNetAssets = getSumOfArray(
          changeInUnrestrictedNetAssetsArr
        );
        const numCurrentYearInterestExpense = getSumOfArray(
          currentYearInterestExpenseArr
        );
        const numTotalDepreciationExpense = getSumOfArray(totalDepreciationExpenseArr);
        const numCapitalizedInterest = getSumOfArray(capitalizedInterestArr);
        const numCurrentMaturitiesOfLTDebt = getSumOfArray(
          currentMaturitiesOfLTDebtArr
        );

        const numerator =
          numChangeInUnrestrictedNetAssets +
          numCurrentYearInterestExpense +
          numTotalDepreciationExpense +
          numCapitalizedInterest;
        const denominator =
          numCurrentMaturitiesOfLTDebt +
          numCurrentYearInterestExpense +
          numCapitalizedInterest;

        avg = denominator === 0 ? 0 : numerator / denominator;
      } else if (mainName === "debtToNetAssets" && allData) {
        // Recalculate per-year debt to net assets using total debt / (unrestricted + temporarily restricted) sums.
        const totalDebtArr = allData.totalDebt?.[year] || [];
        const totalUnrestrictedNetAssetsArr =
          allData.totalUnrestrictedNetAssets?.[year] || [];
        const temporarilyRestrictedNetAssetsArr =
          allData.temporarilyRestrictedNetAssets?.[year] || [];

        const numTotalDebt = getSumOfArray(totalDebtArr);
        const numTotalUnrestrictedNetAssets = getSumOfArray(totalUnrestrictedNetAssetsArr);
        const numTemporarilyRestrictedNetAssets = getSumOfArray(
          temporarilyRestrictedNetAssetsArr
        );

        const denominator = numTotalUnrestrictedNetAssets + numTemporarilyRestrictedNetAssets;
        avg = denominator === 0 ? 0 : numTotalDebt / denominator;
      } else {
        avg = parseFloat(getAverageOfArray(peerArray));
      }
      const mid = parseFloat(getMidpointOfArray(peerArray));
      const lower25 = parseFloat(get25thPercentileOfArray(peerArray));
      const higher75 = parseFloat(get75thPercentileOfArray(peerArray));

      peerAvg.push((avg * scale).toFixed(fixedNum));
      peerMid.push((mid * scale).toFixed(fixedNum));
      peer25.push((lower25 * scale).toFixed(fixedNum));
      peer75.push((higher75 * scale).toFixed(fixedNum));
    } else {
      peerAvg.push("0");
      peerMid.push("0");
      peer25.push("0");
      peer75.push("0");
    }

    if (
      dataClient &&
      dataClient[year] &&
      dataClient[year].value !== undefined &&
      dataClient[year].value !== null &&
      dataClient[year].value !== ""
    ) {
      const clientVal = Number(dataClient[year].value) * scale;
      clientArray.push(clientVal.toFixed(fixedNum));
    } else {
      clientArray.push("0");
      if (dataClient) {
        console.warn(
          `Client data for year ${year} is undefined, null, or empty; treating as 0 for chart.`
        );
      }
    }
  });

  return { clientArray, peerAvg, peerMid, peer25, peer75 };
};


const styleNumber = (num, type, fixed) => {
  let text = num;
  let textNum
  
  if (!isNaN(text)) {
    if (type === "num" && text != 0) {
      textNum = Number(text).toFixed(fixed);
      text = Number(textNum).toLocaleString(undefined, {
        minimumFractionDigits: fixed,
        maximumFractionDigits: fixed,
      }); // Add commas for thousands, preserve trailing zeros
    }
    
    if (type === "percent" && text != 0) {
      text = (parseFloat(text) * 100).toFixed(fixed) + "%";
    }
    
    if (type === "dollar" && text != 0) {
      textNum = parseFloat(text).toFixed(fixed);
      text = fixed ? "$ " + Number(textNum).toFixed(fixed) : "$ " + Number(textNum).toLocaleString(); // Add commas for thousands
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

/**
 * Creates an Alpine.js data object for the Enrollment Range slider (min/max enrollment).
 * Matches Comprehensive slider behavior: text inputs with formatting, dynamic z-index,
 * bidirectional sync, and pointer-events for dual-thumb interaction.
 * Syncs with global window.sliderValue and window.sliderValue2 for API queries.
 * Min gap: 500. Range: 0–25,000.
 * @returns {Object} Alpine.js data object with minprice, maxprice, thumb positions, and trigger functions
 */
const range = () => {
  return {
    minprice: 0,
    maxprice: 25000,
    min: 0,
    max: 25000,
    minthumb: 1,
    maxthumb: 1,

    /**
     * Updates the minimum value, recalculates thumb position, and updates the DOM.
     * @param {boolean} shouldDispatchEvent - Whether to dispatch filtersChanged event
     * @param {boolean} shouldRound - Whether to round the value to nearest 100 (used for slider input)
     */
    mintrigger(shouldDispatchEvent = true, shouldRound = false) {
      let value = String(this.minprice).replace(/[^\d]/g, '');
      this.minprice = parseInt(value) || 0;
      if (shouldRound) {
        this.minprice = Math.round(this.minprice / 100) * 100;
      }
      this.minprice = Math.max(this.min, Math.min(this.minprice, this.maxprice - 500));
      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;
      window.sliderValue = this.minprice;
      const inputElement = document.getElementById("givingUnitsMin");
      if (inputElement) {
        inputElement.value = this.minprice.toLocaleString('en-US');
        inputElement.dataset.oldValue = String(this.minprice);
      }
      if (shouldDispatchEvent) {
        document.dispatchEvent(new CustomEvent("filtersChanged"));
      }
    },

    /**
     * Updates the maximum value, recalculates thumb position, and updates the DOM.
     * @param {boolean} shouldDispatchEvent - Whether to dispatch filtersChanged event
     * @param {boolean} shouldRound - Whether to round the value to nearest 100 (used for slider input)
     */
    maxtrigger(shouldDispatchEvent = true, shouldRound = false) {
      let value = String(this.maxprice).replace(/[^\d]/g, '');
      this.maxprice = parseInt(value) || this.max;
      if (shouldRound) {
        this.maxprice = Math.round(this.maxprice / 100) * 100;
      }
      this.maxprice = Math.max(this.minprice + 500, Math.min(this.maxprice, this.max));
      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;
      window.sliderValue2 = this.maxprice;
      const inputElement = document.getElementById("givingUnitsMax");
      if (inputElement) {
        inputElement.value = this.maxprice.toLocaleString('en-US');
        inputElement.dataset.oldValue = String(this.maxprice);
      }
      if (shouldDispatchEvent) {
        document.dispatchEvent(new CustomEvent("filtersChanged"));
      }
    },
  };
};

// Expose for Alpine.js x-data
if (typeof window !== "undefined") {
  window.range = range;
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
  if (!element) {
    console.warn(`Element not found for elementId: ${elementId}`);
    return;
  }

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
  const numericNumbers = numbers.map(num => {
    // Convert string numbers to numeric values, keeping non-string numbers unchanged
    if (typeof num === 'string') {
      // Parse string numbers, handle "-0" as regular zero
      return parseFloat(num.replace(/-0/, '0'));
    } else if (isNaN(num)) {
      return 0; // Treat NaN as 0
    } else {
      return num;
    }
  });

  const percentageChanges = [];
  for (let i = 1; i < numericNumbers.length; i++) {
    // If either current or previous value is NaN or zero, skip the calculation
    if (numericNumbers[i] === 0 || numericNumbers[i - 1] === 0 || isNaN(numericNumbers[i]) || isNaN(numericNumbers[i - 1])) {
      continue;
    }
    const change = ((numericNumbers[i] - numericNumbers[i - 1]) / Math.abs(numericNumbers[i - 1])) * 100;
    percentageChanges.push(change);
  }

  // Calculate average percentage change if there are changes
  if (percentageChanges.length === 0) {
    return 0; // Return 0 if there are no changes
  } else {
    // Calculate average percentage change
    const averagePercentageChange = percentageChanges.reduce((acc, val) => acc + val, 0) / percentageChanges.length;

    return Math.round(averagePercentageChange); // Round to the nearest whole number
  }
}

function missionaryRange() {
  return {
    min: 0,
    max: 10000,
    missionprice: 0,
    missionthumb: 0,
    missiontrigger() {
      let minposition = ((this.missionprice - this.min) / (this.max - this.min)) * 100;
      this.missionthumb = minposition > 100 ? 100 : minposition < 0 ? 0 : minposition;
    }
  };
}

/**
 * Updates selectedSchoolChurch from the checked radio: value "1" = schoolAndChurch, "0" = schoolOnly.
 */
const updateSelectedSchoolChurch = () => {
  const checked = document.querySelector('input[name="schoolChurch"]:checked');
  const raw = checked?.value;
  selectedSchoolChurch = Number(raw) === 0 ? 0 : 1;
};

// Attach change listeners to both radio buttons
['selectSchoolAndChurch', 'selectSchoolOnly'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', updateSelectedSchoolChurch);
  }
});

// Initialize on load in case one is pre-selected
updateSelectedSchoolChurch();

// Add event listener to sidebar ul highlighting the active button
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


const selectedImages = () => {
  selectedImagesArray = []
  
  $("input:checkbox[name=printCheckbox]:checked").map(function() {
    selectedImagesArray.push($(this).val())
  })
  console.log(selectedImagesArray)
}


