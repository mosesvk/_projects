const displayReportComponent = () => {
  const enrollmentTable = `
    <div class='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
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
                      Students - Average Enrollment
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
  `;
  const cashTable = (`
    <div class='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
      <div class='flex flex-col mt-2'>
        <div class='overflow-x-auto rounded-lg'>
          <div class='inline-block min-w-full align-middle'>
            <div class='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table class='w-full text-lg text-left text-gray-500 dark:text-gray-400'>
                <thead class='text-xs text-gray-700 uppercase bg-green-200 dark:bg-gray-700 dark:text-green-200'>
                  <tr id='row_cash_tableHeader'>
                    <th scope='col' class='px-6 py-3 text-lg'>
                      Cash Flow and Reserve Ratios
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
                    id='row_expendableReserves_inDays'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      1. Expendable Reserves - In Days
                    </th>
                  </tr>
                  <tr
                    id='row_expendableReserves_percentTotalCash'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      2. Expendable Reserves - % of Total Cash Exprenses
                    </th>
                  </tr>
                  <tr
                    id='row_cashAvailableDeferred'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      3. Cash Available to Deferred Revenues
                    </th>
                  </tr>
                  <tr
                    id='row_liquidityRatio'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      4. Liquidity Ratio
                    </th>
                  </tr>
                  <tr
                    id='row_netCashUsedOperating'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      5. Net Cash Provided (used) by Operating Activities
                    </th>
                  </tr>
                  <tr
                    id='row_netCashUsedOperating_asPerStatementCash'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='pr-6 pl-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      a. As per statement of Cash Flows
                    </th>
                  </tr>
                  <tr
                    id='row_netCashUsedOperating_depreciationExpensesThreeToSeven'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='pr-6 pl-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      b. Depreciation Expenses on 3 - 7 Year Assets
                    </th>
                  </tr>
                  <tr
                    id='row_netCashUsedOperating_overUnderBench'
                    class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      class='pr-6 pl-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      c. Over (Under) Benchmark
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
  // <td class='text-center'>21</td>

  document.querySelector('main').innerHTML = `
    ${enrollmentTable}
    ${cashTable}
  `;

  const savedData = JSON.parse(localStorage.getItem('enrollmentData'));
  const selectedYears = getSelectedYearsFromLocalStorage();

  displayDataToReport(savedData, selectedYears);

  closeSidebarAfterSelectingOption('report');
};

const displayDataToReport = (data, selectedYears) => {
  if (data && selectedYears) {
    addYearColumnsToReportTables(selectedYears);
  }
};

const addYearColumnsToReportTables = (years) => {
  const tables = document.querySelectorAll('table');

  tables.forEach((table) => {
    const trElements = table.querySelectorAll('tr');
    const trIds = Array.from(trElements)
      .map((tr) => tr.getAttribute('id'))
      .filter((id) => id && id.endsWith('_tableHeader'));

      console.log(trIds);

    trIds.forEach((idName) => addTableColumnsToReport(idName, years));
  });
};
