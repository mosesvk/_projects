// Enrollment
const studentAverageEnrollment_Main = {};
const studentAverageEnrollment_PercentChange_Main = {};
const studentAverageEnrollment_Average_Main = {};
const studentAverageEnrollment_Peak_Main = {};
const studentFacilityRatio_Main = {};

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

// Utility Functions

const closeSidebarAfterSelectingOption = () => {
  // Remove the sidebar/backdoor/"x" svg icon
  // Add back the "hamburger" svg icon
  document.querySelector('#sidebar').classList.add('hidden');
  document.querySelector('#sidebarBackdrop').classList.add('hidden');
  document
    .querySelector('#toggleSidebarMobileHamburger')
    .classList.remove('hidden');
  document.querySelector('#toggleSidebarMobileClose').classList.add('hidden');

  localStorage.setItem('lastRenderedComponent', 'enrollment');
};

const createChart = (chartId, data) => {
  const chart = new ApexCharts(
    document.getElementById(chartId),
    getMainChartOptions(data)
  );

  chart.render();

  // init again when toggling dark mode
  document.addEventListener('dark-mode', function () {
    chart.updateOptions(getMainChartOptions(data));
  });
};


const getAverageOfArray = (array) => {
    const sum = array.reduce((acc, str) => acc + Number(str), 0);
    const avg = sum / array.length;

    return avg
}

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
}