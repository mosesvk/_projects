

// Enrollment
const studentAverageEnrollment_Peer = {};
const studentAverageEnrollment_YesNo_Peer = {};
const studentAverageEnrollment_Client = {};
const studentAverageEnrollment_PercentChange_Client = {};
const studentAverageEnrollment_Average_Client = {};
const studentAverageEnrollment_Peak_Peer = {};
const studentAverageEnrollment_Peak_Client = {};
const studentFacilityRatio_Peer = {};
const studentFacilityRatio_Client = {};

// Cash Flow and Reserve Ratios
const expendableReserves_Peer = {};
const expendableReserves_PercentChange_Peer = {};
const cashAvailableToDeferredRevenues_Peer = {};
const liquidityRatio_Peer = {};
const netCashProvided_PerStatement_Peer = {};
const netCashProvided_DepreciationExpenses_Peer = {};
const netCashProvided_OverUnder_Peer = {};

// Asset Ratios
const propertyEquipmentPerStudent_Peer = {};
const netTuitionCurrentAssets_Peer = {};
const receivableWriteOffs_Peer = {};
const receivableWriteOffs_PercentChange_Peer = {};

// Debt Ratios
const debtToPropertyEquipment_Peer = {};
const currentRatio_Peer = {};
const currentLiabilitiesToAvailableNetAssets_Peer = {};
const debtPerStudents_Peer = {};
const debtCoverage_Peer = {};

// Income/Giving Ratios
const netIncomeRatio_Peer = {};
const netIncomeRatio_ExcludeDeprication_Peer = {};
const PercentOfAverageTuition_Peer = {};
const financialAssistancePercentTuition_Peer = {};
const tuitionFeesTotalIncome_Peer = {};
const contributionsTotalIncome_Peer = {};
const netTuitionFinancialAssistance_GrossTuition_Peer = {};
const netTuitionFinancialAssistance_GrossTuitionPercentChange_Peer = {};
const netTuitionFinancialAssistance_FinancialAssistance_Peer = {};
const netTuitionFinancialAssistance_FinancialAssistancePercentChange_Peer = {};
const netTuitionFinancialAssistance_ScholarshipAwarded_Peer = {};
const netTuitionFinancialAssistance_ScholarshipAwardedPercentChange_Peer = {};
const netTuitionFinancialAssistance_TotalFinancial_Peer = {};
const netTuitionFinancialAssistance_TotalFinancialPercentChange_Peer = {};
const netTuitionFinancialAssistance_netTuition_Peer = {};
const netTuitionFinancialAssistance_netTuitionPercentChange_Peer = {};
const feesPercentNetTuition_Peer = {};

// Expense Ratios
const salariesBenefitsPercentNetTuition_Peer = {};
const salariesBenefits_Salaries_Peer = {};
const salariesBenefits_Benefits_Peer = {};
const salariesBenefitsStudentsEnrolled_Peer = {};
const salariesBenefitsStudentsEnrolled_Salaries_Peer = {};
const salariesBenefitsStudentsEnrolled_Benefits_Peer = {};
const salariesBenefitsStudentsEnrolled_SalariesAndBenefits_Peer = {};
const benefitsPercentSalariesTeachers_Peer = {};
const personnelMandatoryDebtService_SalariesBenefits_Teachers_Peer = {};
const personnelMandatoryDebtService_SalariesBenefits_Administration_Peer = {};
const personnelMandatoryDebtService_SalariesBenefits_Employees_Peer = {};
const personnelMandatoryDebtService_MandatoryDebtService_Peer = {};
const personnelMandatoryDebtService_PersonnelMandatory_Peer = {};
const percentFundRaisingExpensesExceeding_Peer = {};
const fundsExpensesPerStudent_FundsRaised_Peer = {};
const fundsExpensesPerStudent_CashExpensesExcludeDepreciation_Peer = {};
const fundsExpensesPerStudent_NetTuition_Peer = {};
const fundsExpensesPerStudent_CashExpensesNetTuition_Peer = {};
const fundsExpensesPerStudent_FundsRaisedCoverCash_Peer = {};
const facilityCostPerSquareFootExcludeInterest_AverageAgeGreaterThanTen_Peer =
  {};
const facilityCostPerSquareFootExcludeInterest_AverageAgeLessThanTen_Peer = {};
const facilityCostPerSquareFootIncludeInterest_AverageAgeGreaterThanTen_Peer =
  {};
const facilityCostPerSquareFootIncludeInterest_AverageAgeLessThanTen_Peer = {};
const informationTechCosts_Peer = {};

const yearsData_Array = [];
const selectedYears_Array = [];
const regions_Array = [
  { arr: ['New England (CT, RI, MA, VT, NH)'], str: 'NE' },
  {
    arr: ['Mid-Atlantic, VA, WV, MD, DE, NJ, NY, PA, DC)'],
    str: 'MA'
  },
  {
    arr: ['South, AR, LA, AL, TN, KY, GA, FL, SC, NC, MS)'],
    str: 'SO'
  },
  { arr: ['Midwest, WI, IL, IN, MI, OH, IA, MN)'], str: 'MW' },
  { arr: ['Plains, KS, MO, OK, TX, ND, SD, NE)'], str: 'PL' },
  {
    arr: ['Mountain/Southwest, ID, MT, WY, CO, UT, NV, AZ, NM)'],
    str: 'MT'
  },
  { arr: ['West Coast, CA, OR, WA)'], str: 'WC' }
];

const selectedRegions_Array = [];

// Utility Functions

const createChart = (chartId, dataPeer, dataClient) => {
  const chart = new ApexCharts(
    document.getElementById(chartId),
    getMainChartOptions(dataPeer, dataClient)
  );

  chart.render();

  // init again when toggling dark mode
  document.addEventListener('dark-mode', function () {
    chart.updateOptions(getMainChartOptions(dataPeer, dataClient));
  });
};

const closeSidebarAfterSelectingOption = (component) => {
  // Remove the sidebar/backdoor/"x" svg icon
  // Add back the "hamburger" svg icon
  document.querySelector('#sidebar').classList.add('hidden');
  document.querySelector('#sidebarBackdrop').classList.add('hidden');
  document
    .querySelector('#toggleSidebarMobileHamburger')
    .classList.remove('hidden');
  document.querySelector('#toggleSidebarMobileClose').classList.add('hidden');

  localStorage.setItem('lastRenderedComponent', component);
};

const getAverageOfArray = (array) => {
  const sum = array.reduce((acc, str) => acc + Number(str), 0);
  const avg = sum / array.length;

  return avg;
};

const getMidpointOfArray = (array) => {
  if (array.length % 2 === 1) {
    // Array has an odd number of elements
    const midpointIndex = Math.floor(array.length / 2);
    return Number(array[midpointIndex]);
  } else {
    // Array has an even number of elements
    const midpointIndex1 = array.length / 2 - 1;
    const midpointIndex2 = array.length / 2;
    const midpoint1 = Number(array[midpointIndex1]);
    const midpoint2 = Number(array[midpointIndex2]);
    return (midpoint1 + midpoint2) / 2;
  }
};

function calculateAveragePercentageChange(values) {
  if (values.length < 2) {
    return 0.0; // No change if there are fewer than two values
  }

  let totalChange = 0;

  for (let i = 1; i < values.length; i++) {
    const initial = values[i - 1];
    const final = values[i];
    const change = final - initial;

    if (initial === 0) {
      if (final === 0) {
        continue; // No change if both initial and final values are zero
      } else {
        totalChange = Infinity; // Handle division by zero
        break;
      }
    }

    totalChange += (change / Math.abs(initial)) * 100;
  }

  const averagePercentageChange = totalChange / (values.length - 1);

  return averagePercentageChange.toFixed(1); // Ensure one decimal point
}

window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(131, 178, 64)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

const findUniqueYears = (data) => {
  const yearsDataArray = [];

  recordsClient.forEach((item) => {
    const yearElement = item.querySelector('fiscal_ye_date_formatted_year');
    if (yearElement) {
      const year = yearElement.textContent;

      // Check if the year is not already in yearsData_Array to ensure uniqueness
      if (!yearsData_Array.includes(year)) {
        yearsData_Array.push(year);
      }
    }
  });

  yearsData_Array.sort();

  //nav-component
  addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
};

const checkLastRenderedComponent = () => {
  const lastRenderedComponent = localStorage.getItem('lastRenderedComponent');
  if (lastRenderedComponent === 'report') {
    displayReportComponent();
  } else {
    displayEnrollmentComponent();
  }
};

const getSelectedYearsFromLocalStorage = () => {
  const storedSelectedYears = JSON.parse(localStorage.getItem('selectedYears'));
  const storedData = localStorage.getItem('enrollment')
  if (!storedSelectedYears && storedData) {
    console.error('Need to Select Year')
  } 
  
  return storedSelectedYears;
};

const resetSelectedYearsFromLocalStorage = () => {
  localStorage.setItem('selectedYears', JSON.stringify([]));
};

let selectedYears_Set = new Set();

const changeListenerForInputYears = (input, year) => {
  if (input.checked) {
    selectedYears_Set.add(year);
  } else {
    selectedYears_Set.delete(year);
  }

  const selectedYearsArray = Array.from(selectedYears_Set).sort((a, b) => a - b);
  localStorage.setItem('selectedYears', JSON.stringify(selectedYearsArray));
};

const addUniqueYearsToOptionsSelectDropdown = (yearsArray) => {
  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage()

  if (Array.isArray(storedYears)) {
    selectedYears_Set = new Set(storedYears);
  }

  optionsList.innerHTML = '';

  yearsArray.forEach((year) => {
    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `option-${year}`);
    newLabel.setAttribute(
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
    );

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('id', `option-${year}`);
    newInput.setAttribute('class', `form-checkbox h-4 w-4 text-gray-600 mr-2`);
    newInput.setAttribute('value', year);
    newInput.checked = selectedYears_Set.has(year);

    newInput.addEventListener('change', (e) =>
      changeListenerForInputYears(e.target, year)
    );

    const newSpan = document.createElement('span');
    newSpan.innerText = year;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsList.appendChild(newLabel);
  });
};


