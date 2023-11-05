const objectData = {};

// Enrollment
const studentAverageEnrollment_Main = {};
const studentAverageEnrollment_Client = {};
const studentAverageEnrollment_PercentChange_Main = {};
const studentAverageEnrollment_PercentChange_Client = {};
const studentAverageEnrollment_Average_Main = {};
const studentAverageEnrollment_Average_Client = {};
const studentAverageEnrollment_Peak_Main = {};
const studentAverageEnrollment_Peak_Client = {};
const studentFacilityRatio_Main = {};
const studentFacilityRatio_Client = {};

// Cash Flow and Reserve Ratios
const expendableReserves_Main = {};
const expendableReserves_PercentChange_Main = {};
const cashAvailableToDeferredRevenues_Main = {};
const liquidityRatio_Main = {};
const netCashProvided_PerStatement_Main = {};
const netCashProvided_DepreciationExpenses_Main = {};
const netCashProvided_OverUnder_Main = {};

// Asset Ratios
const propertyEquipmentPerStudent_Main = {};
const netTuitionCurrentAssets_Main = {};
const receivableWriteOffs_Main = {};
const receivableWriteOffs_PercentChange_Main = {};

// Debt Ratios
const debtToPropertyEquipment_Main = {};
const currentRatio_Main = {};
const currentLiabilitiesToAvailableNetAssets_Main = {};
const debtPerStudents_Main = {};
const debtCoverage_Main = {};

// Income/Giving Ratios
const netIncomeRatio_Main = {};
const netIncomeRatio_ExcludeDeprication_Main = {};
const PercentOfAverageTuition_Main = {};
const financialAssistancePercentTuition_Main = {};
const tuitionFeesTotalIncome_Main = {};
const contributionsTotalIncome_Main = {};
const netTuitionFinancialAssistance_GrossTuition_Main = {};
const netTuitionFinancialAssistance_GrossTuitionPercentChange_Main = {};
const netTuitionFinancialAssistance_FinancialAssistance_Main = {};
const netTuitionFinancialAssistance_FinancialAssistancePercentChange_Main = {};
const netTuitionFinancialAssistance_ScholarshipAwarded_Main = {};
const netTuitionFinancialAssistance_ScholarshipAwardedPercentChange_Main = {};
const netTuitionFinancialAssistance_TotalFinancial_Main = {};
const netTuitionFinancialAssistance_TotalFinancialPercentChange_Main = {};
const netTuitionFinancialAssistance_netTuition_Main = {};
const netTuitionFinancialAssistance_netTuitionPercentChange_Main = {};
const feesPercentNetTuition_Main = {};

// Expense Ratios
const salariesBenefitsPercentNetTuition_Main = {};
const salariesBenefits_Salaries_Main = {};
const salariesBenefits_Benefits_Main = {};
const salariesBenefitsStudentsEnrolled_Main = {};
const salariesBenefitsStudentsEnrolled_Salaries_Main = {};
const salariesBenefitsStudentsEnrolled_Benefits_Main = {};
const salariesBenefitsStudentsEnrolled_SalariesAndBenefits_Main = {};
const benefitsPercentSalariesTeachers_Main = {};
const personnelMandatoryDebtService_SalariesBenefits_Teachers_Main = {};
const personnelMandatoryDebtService_SalariesBenefits_Administration_Main = {};
const personnelMandatoryDebtService_SalariesBenefits_Employees_Main = {};
const personnelMandatoryDebtService_MandatoryDebtService_Main = {};
const personnelMandatoryDebtService_PersonnelMandatory_Main = {};
const percentFundRaisingExpensesExceeding_Main = {};
const fundsExpensesPerStudent_FundsRaised_Main = {};
const fundsExpensesPerStudent_CashExpensesExcludeDepreciation_Main = {};
const fundsExpensesPerStudent_NetTuition_Main = {};
const fundsExpensesPerStudent_CashExpensesNetTuition_Main = {};
const fundsExpensesPerStudent_FundsRaisedCoverCash_Main = {};
const facilityCostPerSquareFootExcludeInterest_AverageAgeGreaterThanTen_Main =
  {};
const facilityCostPerSquareFootExcludeInterest_AverageAgeLessThanTen_Main = {};
const facilityCostPerSquareFootIncludeInterest_AverageAgeGreaterThanTen_Main =
  {};
const facilityCostPerSquareFootIncludeInterest_AverageAgeLessThanTen_Main = {};
const informationTechCosts_Main = {};

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
  data.forEach((item) => {
    const year = item.children.year.innerHTML;

    // Check if the year is not already in yearsDataArray to ensure uniqueness
    if (!yearsData_Array.includes(year)) {
      yearsData_Array.push(year);
    }

    yearsData_Array.sort();
  });

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
  if (!storedSelectedYears) {
    console.error('Need to select a year');
  }
  return storedSelectedYears;
};

const resetSelectedYearsFromLocalStorage = () => {
  localStorage.removeItem('selectedYears')
  console.log(localStorage.getItem('selectedYears'))
}