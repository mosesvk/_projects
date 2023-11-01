// const getReportComponent = () => {

const enrollmentTable = `
<div class='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
<div class='flex flex-col mt-2'>
  <div class='overflow-x-auto rounded-lg'>
    <div class='inline-block min-w-full align-middle'>
      <div class='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead class='text-xs text-gray-700 uppercase bg-green-200 dark:bg-gray-700 dark:text-gray-400'>
            <tr id='row_tableHeader'>
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

const cashTable = `
<div class='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
<div class='flex flex-col mt-2'>
  <div class='overflow-x-auto rounded-lg'>
    <div class='inline-block min-w-full align-middle'>
      <div class='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead class='text-xs text-gray-700 uppercase bg-green-200 dark:bg-gray-700 dark:text-gray-400'>
            <tr id='row_tableHeader'>
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

document.querySelector('main').innerHTML = `
  <>
    ${enrollmentTable}
    ${cashTable}
  </>
  `;

// Remove the sidebar/backdoor/"x" svg icon
// Add back the "hamburger" svg icon
document.querySelector('#sidebar').classList.add('hidden');
document.querySelector('#sidebarBackdrop').classList.add('hidden');
document
  .querySelector('#toggleSidebarMobileHamburger')
  .classList.remove('hidden');
document.querySelector('#toggleSidebarMobileClose').classList.add('hidden');
// };
