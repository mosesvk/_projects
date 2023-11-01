const getReportComponent = () => {
  document.querySelector('main').innerHTML = 
  `
    <!--Table Report-->
    <div
      class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
        <!--Table Header-->
        <div class="items-center justify-between lg:flex">
            <div class="mb-4 lg:mb-0">
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Enrollment Comparison between Years</h3>
            </div>
        </div>
      <!-- Table -->
      <div class="flex flex-col mt-2">
        <div class="overflow-x-auto rounded-lg">
          <div class="inline-block min-w-full align-middle">
            <div
              class="relative overflow-x-auto shadow-md sm:rounded-lg"
            >
              <table
                class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr class="row_tableHeader">
                    <th scope="col" class="px-6 py-3">Unit</th>
                    <th scope="col" class="px-6 py-3">Avg</th>
                    <th scope="col" class="px-6 py-3">Mid</th>
                    <th scope="col" class="px-6 py-3">Min</th>
                    <th scope="col" class="px-6 py-3">Max</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    id="row_studentsAverageEnrollment"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Students - Average Enrollment
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
`


    // Remove the sidebar/backdoor/"x" svg icon
    // Add back the "hamburger" svg icon
    document.querySelector('#sidebar').classList.add('hidden')
    document.querySelector('#sidebarBackdrop').classList.add('hidden')
    document.querySelector('#toggleSidebarMobileHamburger').classList.remove('hidden')
    document.querySelector('#toggleSidebarMobileClose').classList.add('hidden')
};
