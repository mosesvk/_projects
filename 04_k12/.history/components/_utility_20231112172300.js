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

const createChart = (chartId, dataPeer, dataClient, type, fixedNum) => {
  const chart = new ApexCharts(
    document.getElementById(chartId),
    getMainChartOptions(dataPeer, dataClient, type, fixedNum)
  );

  chart.render();

  // init again when toggling dark mode
  document.addEventListener('dark-mode', function () {
    chart.updateOptions(getMainChartOptions(dataPeer, dataClient));
  });
};

const createDivChartandModal = (
  chartId,
  modalId,
  title,
  chartComponents,
  modalComponents,
  data,
  client,
  peer
) => {
  const percentChangeValue = data
    ? calculateAveragePercentageChange(data[peer])
    : '0';

  // console.log('data[peer]', data[peer]);
  // console.log('data[client]', data[client]);

  const chartComponent = `
    <div class='p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
      <div class='flex items-center justify-between mb-4'>
        <div class='flex-shrink-0'>
          <span class='text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white'>
            ${title}
          </span>
        </div>
        <div class='flex items-center justify-end flex-1 text-base font-medium text-green-500 dark:text-green-400'>
          ${percentChangeValue}%
          <svg
            class='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              d='M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z'
              clip-rule='evenodd'
            ></path>
          </svg>
        </div>
      </div>

      <div id=${chartId}></div>

      <div class='flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700'>
        <div class='flex-shrink-0'>
          <button 
          data-modal-target=${modalId} data-modal-toggle=${modalId}  class='inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600'>
            Expand Info
            <svg
              class='w-4 h-4 ml-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M9 5l7 7-7 7'
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const modalComponent = `
    <div
      id=${modalId}
      tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:w-3/4 md:inset-0 h-full max-h-full flex" aria-modal="true" role="dialog"
    >
      <div class='relative p-4 w-full max-w-fit md:max-w-3xl max-h-full'>
        <div class='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div class='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
            <h3 class='text-xl font-semibold text-gray-900 dark:text-white'>
              ${title}
            </h3>
            <button
              type='button'
              class='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
              data-modal-hide=${modalId}
            >
              <svg
                class='w-3 h-3'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
            </button>
          </div>

          <div class='flex flex-col mt-2'>
            <div class='overflow-x-auto rounded-lg'>
              <div class='inline-block min-w-full align-middle'>
                <div class='relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <table class='w-full text-lg text-left text-gray-500 dark:text-gray-400'>
                    <thead class='text-xs text-gray-700 uppercase bg-green-200 dark:bg-gray-700 dark:text-green-200 '>
                      <tr id='row_enrollment_tableHeader'>
                        <th scope='col' class='px-6 py-3 text-lg'>
                          Enrollment Comparison between Years
                        </th>

                        <th scope='col' class='px-6 py-3'>
                          Avg
                        </th>
                        <th scope='col' class='px-6 py-3'>
                          Mid
                        </th>
                        <th scope='col' class='px-6 py-3'>
                          Min
                        </th>
                        <th scope='col' class='px-6 py-3'>
                          Max
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        id='row_studentsAverageEnrollment'
                        class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      >
                        <th
                          scope='row'
                          class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                        </th>
                      </tr>
                      <tr
                        id='row_studentsAverageEnrollment-percentChange'
                        class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      >
                        <th
                          scope='row'
                          class='pr-6 pl-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          a. % Change
                        </th>
                      </tr>
                      <tr
                        id='row_studentsAverageEnrollment-Average'
                        class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      >
                        <th
                          scope='row'
                          class='pr-6 pl-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          b. Average Enrollment
                        </th>
                      </tr>
                      <tr
                        id='row_studentsAverageEnrollment-Peak'
                        class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      >
                        <th
                          scope='row'
                          class='pr-6 pl-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          b. Peak Enrollment
                        </th>
                      </tr>
                      <tr
                        id='row_studentsAverageEnrollment-Average'
                        class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      >
                        <th
                          scope='row'
                          class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          Student/Faculty Ratio
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  chartComponents += chartComponent; // Append chart component HTML
  modalComponents += modalComponent; // Append modal component HTML

  return {
    chartComponents,
    modalComponents
  };
};

const getStoredData = () => {
  return localStorage.getItem('enrollmentData') || null;
};

const parseStoredData = (data) => {
  return data ? JSON.parse(data) : null;
};

const createAndAppendComponent = (
  chartId,
  modalId,
  title,
  chartComponents,
  modalComponents,
  data,
  client,
  peer
) => {
  const updatedComponents = createDivChartandModal(
    chartId,
    modalId,
    title,
    chartComponents,
    modalComponents,
    data,
    client,
    peer
  );

  return updatedComponents;
};

const createChartFromParsedData = (
  parsedData,
  chart,
  peer,
  client,
  type,
  fixedNum
) => {
  if (parsedData) {
    createChart(chart, parsedData[peer], parsedData[client], type, fixedNum);
    // You might need to create other charts here based on the component IDs
  }
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

const calculateAveragePercentageChange = (values) => {
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
  const storedData = localStorage.getItem('enrollment');
  if (!storedSelectedYears && storedData) {
    console.error('Need to Select Year');
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

  const selectedYearsArray = Array.from(selectedYears_Set).sort(
    (a, b) => a - b
  );
  localStorage.setItem('selectedYears', JSON.stringify(selectedYearsArray));
};

const addUniqueYearsToOptionsSelectDropdown = (yearsArray) => {
  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage();

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

const appendModalsToBody = (modalComponents) => {
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalComponents;

  document.body.appendChild(modalContainer);
};

const getPeerAndClientChartDataArrays = (
  years,
  dataPeer,
  dataClient,
  fixedNum
) => {
  const peerAvg = [];
  const peerMid = [];
  const peerMin = [];
  const peerMax = [];
  const clientArray = [];

  years.forEach((year) => {
    if (dataPeer[year]) {
      const array = dataPeer[year];
      const avg = getAverageOfArray(array);
      const mid = getMidpointOfArray(array);
      const min = Math.min(...array);
      const max = Math.max(...array);

      peerAvg.push(parseFloat(avg.toFixed(fixedNum)));
      peerMid.push(parseFloat(mid.toFixed(fixedNum)));
      peerMin.push(parseFloat(min.toFixed(fixedNum)));
      peerMax.push(parseFloat(max.toFixed(fixedNum)));

      const clientNum = Number(dataClient[year][0]).toFixed(fixedNum);
      clientArray.push(clientNum);
    } else {
      console.error(`Data for year ${year} is undefined in dataPeer`);
    }
  });

  return { clientArray, peerAvg, peerMid, peerMin, peerMax };
};

const createEventListenersForModal = (id) => {
  console.log(document.querySelector('#id'))

  // Add an event listener to the button that toggles the modal visibility
  const expandInfoButton = document.querySelector(
    `[data-modal-toggle=${id}]`
  );
  const modal = document.getElementById(id);

  expandInfoButton.addEventListener('click', () => {
    modal.classList.toggle('hidden'); // Toggle the 'hidden' class
  });

  // Add an event listener to the close button within the modal
  const closeButton = modal.querySelector(
    `[data-modal-hide=${id}]`
  );
  closeButton.addEventListener('click', () => {
    modal.classList.add('hidden'); // Hide the modal when the close button is clicked
  });
}
