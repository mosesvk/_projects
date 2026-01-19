
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
window.cashFlowsFromOperatingActivities_chart = null;
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
  title,
  wa = null
) => {
  if (parsedData) {
    // console.log('createChartFromParsedData', { parsedData, chart, peer, client, type, fixedNum, mainName, wa });

    createChart(
      chart,
      parsedData[peer],
      parsedData[client],
      type,
      fixedNum,
      mainName,
      benchmark,
      title,
      wa,
      parsedData
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
  title,
  wa = null,
  allData = null
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
    chartId,
    wa,
    allData
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
    "cashFlowsFromOperatingActivities_chart",
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
    // Store parameters for regenerating chart options on theme change
    const chartParams = {
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
    };

    if (chartId === "givingUnits_chart") {
      window.givingUnits_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.givingUnits_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.givingUnits_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "givingUnitsToStaff_chart") {
      window.givingUnitsToStaff_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.givingUnitsToStaff_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.givingUnitsToStaff_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "daysExpendableNetAssets_chart") {
      window.daysExpendableNetAssets_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.daysExpendableNetAssets_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.daysExpendableNetAssets_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "daysOperatingCash_chart") {
      window.daysOperatingCash_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.daysOperatingCash_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.daysOperatingCash_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "cashFlowsFromOperatingActivities_chart") {
      window.cashFlowsFromOperatingActivities_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.cashFlowsFromOperatingActivities_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.cashFlowsFromOperatingActivities_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "liquidityRatio_chart") {
      window.liquidityRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.liquidityRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.liquidityRatio_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "netCashAvailability_chart") {
      window.netCashAvailability_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.netCashAvailability_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.netCashAvailability_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "debtToContributionsWithout_chart") {
      window.debtToContributionsWithout_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.debtToContributionsWithout_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.debtToContributionsWithout_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "currentRatio_chart") {
      window.currentRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.currentRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.currentRatio_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "mandatoryDebtServiceToContributionsWithout_chart") {
      window.mandatoryDebtServiceToContributionsWithout_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.mandatoryDebtServiceToContributionsWithout_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.mandatoryDebtServiceToContributionsWithout_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "debtPerGivingUnit_chart") {
      window.debtPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.debtPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.debtPerGivingUnit_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "debtCoverage_chart") {
      window.debtCoverage_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.debtCoverage_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.debtCoverage_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "netIncomeRatio_chart") {
      window.netIncomeRatio_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.netIncomeRatio_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.netIncomeRatio_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "contributionsWithoutDonorPerGivingUnit_chart") {
      window.contributionsWithoutDonorPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.contributionsWithoutDonorPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.contributionsWithoutDonorPerGivingUnit_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "totalContributionsPerGivingUnit_chart") {
      window.totalContributionsPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.totalContributionsPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.totalContributionsPerGivingUnit_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "benefitsToSalaries_chart") {
      window.benefitsToSalaries_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.benefitsToSalaries_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.benefitsToSalaries_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "salariesBenefitsIncludingOutsourcedEmployees_chart") {
      window.salariesBenefitsIncludingOutsourcedEmployees_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.salariesBenefitsIncludingOutsourcedEmployees_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.salariesBenefitsIncludingOutsourcedEmployees_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "personnelToCashExpenditure_chart") {
      window.personnelToCashExpenditure_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.personnelToCashExpenditure_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.personnelToCashExpenditure_chart.updateOptions(updatedOptions);
        }
      });
    } else if (chartId === "cashExpendituresPerGivingUnit_chart") {
      window.cashExpendituresPerGivingUnit_chart = new ApexCharts(
        document.getElementById(chartId),
        chartOptions
      );
      window.cashExpendituresPerGivingUnit_chart.render();
      document.addEventListener("dark-mode", function () {
        const updatedOptions = getMainChartOptions(
          chartParams.dataPeer,
          chartParams.dataClient,
          chartParams.type,
          chartParams.fixedNum,
          chartParams.mainName,
          chartParams.benchmark,
          chartParams.title,
          chartParams.chartId,
          chartParams.wa,
          chartParams.allData
        );
        if (updatedOptions) {
          window.cashExpendituresPerGivingUnit_chart.updateOptions(updatedOptions);
        }
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
  // if (name == 'netCashAvailability') console.log('getAverageOfArray', {array, name, num});
  
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
  type,
  wa = null,
  allData = null
) => {
  // console.log({ years, dataPeer, dataClient, fixedNum, mainName, benchmark, type, wa, allData });

  const peerAvg = [];
  const peerMid = [];
  const peer25 = [];
  const peer75 = [];
  const clientArray = [];
  const benchmarkArray = [];

  years.forEach((year) => {
    // if (mainName == "cfi_netIncomeOperationsRatio")
      // console.log({ mainName, year, client: dataClient[year], peer: dataPeer, type, fixedNum });

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
      
      // Use weighted average if "wa" is present, otherwise use simple average
      let avg;
      if (wa && allData) {
        // Use weighted average for specific year
        avg = getWeightedAverageOfArray(allData, mainName, year);
        avg *= numToTimesByIfPercent;
      } else {
        // Use simple average
        avg = getAverageOfArray(array);
        avg *= numToTimesByIfPercent;
      }
      
      let mid = getMidpointOfArray(array);
      mid *= numToTimesByIfPercent;
      let lower25 = get25thPercentileOfArray(array);
      lower25 *= numToTimesByIfPercent;
      let higher75 = get75thPercentileOfArray(array);
      higher75 *= numToTimesByIfPercent;

      // Round quartile values to match fixedNum decimal places (same as Report.js formatting)
      avg = parseFloat(avg.toFixed(fixedNum));
      mid = parseFloat(mid.toFixed(fixedNum));
      lower25 = parseFloat(lower25.toFixed(fixedNum));
      higher75 = parseFloat(higher75.toFixed(fixedNum));

      // if (mainName == 'cfi_netIncomeOperationsRatio') console.log({mainName, avg, mid, lower25, higher75 });

      // Push numeric values (not strings) so ApexCharts can format decimals correctly
      peerAvg.push(avg);
      peerMid.push(mid);
      peer25.push(lower25);
      peer75.push(higher75);

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

  // Format values
  const formattedIncome = new Intl.NumberFormat().format(income);
  const formattedPercentage = Math.round(percentage);

  // Check if elements already exist for this year
  const percentagePElement = document.getElementById(`percentage_${trId}_${year}`);
  const incomePElement = document.getElementById(`income_${trId}_${year}`);

  if (percentagePElement && incomePElement) {
    // Elements already exist, just update their content
    percentagePElement.textContent = `${formattedPercentage}%`;
    incomePElement.textContent = `$${formattedIncome}`;
    return;
  }

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
  const newPercentagePElement = document.createElement("p");
  newPercentagePElement.id = `percentage_${trId}_${year}`;
  newPercentagePElement.className = "mb-2";
  newPercentagePElement.textContent = `${formattedPercentage}%`;
  secondThElement.appendChild(newPercentagePElement);

  const newIncomePElement = document.createElement("p");
  newIncomePElement.id = `income_${trId}_${year}`;
  newIncomePElement.textContent = `$${formattedIncome}`;
  secondThElement.appendChild(newIncomePElement);

  trElement.appendChild(secondThElement);
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

  // Clear ALL year columns to start fresh (similar to addToSingleRow)
  const trElement = document.getElementById(`row_${trId}`);
  if (trElement) {
    // Find the label column (first <th> with id th_${trId})
    const labelTh = trElement.querySelector(`#th_${trId}`);
    
    // Remove all <th> elements except the label column
    const allThElements = Array.from(trElement.querySelectorAll('th'));
    allThElements.forEach((th) => {
      if (th !== labelTh) {
        th.remove();
      }
    });
  }

  // Create the first <th> element and its children if it doesn't exist
  let thElement = document.getElementById(`th_${trId}`);
  if (!thElement) {
    thElement = document.createElement("th");
    thElement.scope = "row";
    thElement.className =
      "pl-16 py-4 font-medium text-gray-900 whitespace-normal dark:text-white";

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

    // Iterate over the years to find the first non-empty county name
    for (const dataYear of Object.keys(data[countyName])) {
      // Check if the value is not empty
      if (data[countyName][dataYear].value !== "") {
        // Store the value and break the loop
        countyNameVal = data[countyName][dataYear].value;
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
 * Creates an Alpine.js data object for the Giving Units range slider.
 * Manages min/max values, thumb positions, and formatted input display.
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
      // Remove any non-numeric characters except digits
      let value = String(this.minprice).replace(/[^\d]/g, '');
      
      // Parse as number
      this.minprice = parseInt(value) || 0;
      
      // Round to nearest 100 only if from slider
      if (shouldRound) {
        this.minprice = Math.round(this.minprice / 100) * 100;
      }
      
      // Constrain within valid range
      this.minprice = Math.max(this.min, Math.min(this.minprice, this.maxprice - 500));
      
      // Calculate thumb position
      this.minthumb =
        ((this.minprice - this.min) / (this.max - this.min)) * 100;

      // Update global window variable
      window.sliderValue = this.minprice;
      
      // Update the text input element with formatted value (with commas)
      const inputElement = document.getElementById("givingUnitsMin");
      if (inputElement) {
        inputElement.value = this.minprice.toLocaleString('en-US');
        // Store the numeric value (without commas) for comparison on blur
        inputElement.dataset.oldValue = String(this.minprice);
      }

      // Trigger filter change event only if requested
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
      // Remove any non-numeric characters except digits
      let value = String(this.maxprice).replace(/[^\d]/g, '');
      
      // Parse as number
      this.maxprice = parseInt(value) || this.max;
      
      // Round to nearest 100 only if from slider
      if (shouldRound) {
        this.maxprice = Math.round(this.maxprice / 100) * 100;
      }
      
      // Constrain within valid range
      this.maxprice = Math.max(this.minprice + 500, Math.min(this.maxprice, this.max));
      
      // Calculate thumb position
      this.maxthumb =
        100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;

      // Update global window variable
      window.sliderValue2 = this.maxprice;
      
      // Update the text input element with formatted value (with commas)
      const inputElement = document.getElementById("givingUnitsMax");
      if (inputElement) {
        inputElement.value = this.maxprice.toLocaleString('en-US');
        // Store the numeric value (without commas) for comparison on blur
        inputElement.dataset.oldValue = String(this.maxprice);
      }

      // Trigger filter change event only if requested
      if (shouldDispatchEvent) {
        document.dispatchEvent(new CustomEvent("filtersChanged"));
      }
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

/**
 * Creates a benchmark modal and populates the _body-3 section with benchmark description
 * @param {Array|string} benchmarkDesc - Benchmark description content (array or string)
 * @param {string} elementId - ID of the modal element
 * @returns {Object} - Tingle modal instance
 */
/**
 * Generate a human-readable title from a field name
 * @param {string} fieldName - The field name (e.g., "daysExpendableNetAssets")
 * @returns {string} - The formatted title (e.g., "Days Expendable Net Assets Benchmark")
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
const processHtmlContent = (htmlContent, addColorClasses = false) => {
  if (typeof htmlContent !== 'string') {
    return '';
  }
  
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Find all p tags and add mb-2 class
  const pTags = tempDiv.querySelectorAll('p');
  pTags.forEach(p => {
    if (!p.classList.contains('mb-2')) {
      p.classList.add('mb-2');
    }
    // Add color classes if requested (for benchmark content)
    if (addColorClasses) {
      if (!p.classList.contains('text-gray-600')) {
        p.classList.add('text-gray-600', 'dark:text-gray-400');
      }
    }
  });
  
  return tempDiv.innerHTML;
};

/**
 * Create benchmark modal and populate report content with static text
 * @param {string} benchmarkText - The static benchmark text (e.g., "Good: > 60 | Warning: 30-60 | Action: < 30")
 * @param {string} dataCategory - The data category (e.g., "cashData", "debtData")
 * @param {string} elementId - The row element ID (e.g., "row_daysExpendableNetAssets")
 * @returns {Object} - The tingle modal instance
 */
const createBenchmark = async (benchmarkText, dataCategory, elementId) => {
  // console.log({ benchmarkText, dataCategory, elementId });

  // Get selected years for click handlers
  const selectedYears = JSON.parse(localStorage.getItem("selectedYears"));
  if (!selectedYears || selectedYears.length === 0) {
    console.warn('No selected years found');
    return null;
  }

  // Extract field name from elementId (e.g., "row_daysExpendableNetAssets" -> "daysExpendableNetAssets")
  const fieldName = elementId.replace(/^row_/, '');
  
  // Generate title from field name
  const benchmarkTitle = generateBenchmarkTitle(fieldName);

  // Process the static benchmark text and apply fixUnicodeCharacters
  // Pass true to addColorClasses to ensure proper text colors for light/dark mode
  let processedContent = processHtmlContent(benchmarkText, true);
  processedContent = fixUnicodeCharacters(processedContent);
  const processedTitle = fixUnicodeCharacters(benchmarkTitle);

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
  // Add proper text color classes for light/dark mode
  const modalContent = `<div class="text-gray-700 dark:text-gray-300"><p class="mb-2"><strong>${processedTitle}</strong></p><div class="text-gray-600 dark:text-gray-400">${processedContent}</div></div>`;
  variable.setContent(modalContent);

  // Build report content (SKIP the title for the report tab _body-3 section)
  // Add proper text color classes for light/dark mode
  const reportContent = `<div class="text-gray-600 dark:text-gray-400">${processedContent}</div>`;

  // Populate the _body-3 section with the benchmark description (without title)
  try {
    // Extract field name from elementId (e.g., "row_daysExpendableNetAssets" -> "daysExpendableNetAssets")
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
  if (selectedYears) {
    const children = await document.getElementById(elementId).children;
    
    for (let i = 1; i < selectedYears.length + 1; i++) {
      editElementChildren(children[i], variable, elementId);
    }
  }

  return variable;
};

/**
 * Create "What Does This Mean" content and populate the _body-2 section
 * @param {Array<string>} whatDoesThisMeanArray - Array of strings describing what the metric means
 * @param {string} elementId - The row element ID (e.g., "row_daysExpendableNetAssets")
 */
const createWhatDoesThisMean = (whatDoesThisMeanArray, elementId) => {
  if (!Array.isArray(whatDoesThisMeanArray) || whatDoesThisMeanArray.length === 0) {
    console.warn(`Invalid whatDoesThisMeanArray for ${elementId}`);
    return;
  }

  // Extract field name from elementId (e.g., "row_daysExpendableNetAssets" -> "daysExpendableNetAssets")
  const fieldName = elementId.replace(/^row_/, '');

  // Build HTML content from array - each item becomes a paragraph
  let htmlContent = '';
  whatDoesThisMeanArray.forEach((paragraph) => {
    // Process each paragraph and apply fixUnicodeCharacters
    let processedParagraph = processHtmlContent(paragraph);
    processedParagraph = fixUnicodeCharacters(processedParagraph);
    htmlContent += `<p class="mb-2 text-gray-500 dark:text-gray-400">${processedParagraph}</p>`;
  });

  // Wrap in a div with the same structure as the example
  const content = `<div class="p-5 bg-gray-50 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-800">${htmlContent}</div>`;

  // Populate the _body-2 section
  try {
    const body2Selector = `#${fieldName}-body-2`;
    const body2Element = document.querySelector(body2Selector);
    
    if (body2Element) {
      // Find the inner div with the p-5 class, or create it if it doesn't exist
      let innerDiv = body2Element.querySelector('div.p-5');
      if (!innerDiv) {
        innerDiv = document.createElement('div');
        innerDiv.className = 'p-5 bg-gray-50 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-800';
        body2Element.appendChild(innerDiv);
      }
      innerDiv.innerHTML = htmlContent;
    } else {
      console.warn(`_body-2 element not found for selector: ${body2Selector}`);
    }
  } catch (error) {
    console.error(`Error populating _body-2 section for ${elementId}:`, error);
  }
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
