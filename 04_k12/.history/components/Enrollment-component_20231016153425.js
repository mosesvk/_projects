const displayEnrollmentComponent = () => {
  document.querySelector('main').innerHTML = `
    <div class="mb-4">
    <div
      class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
    >
    
      <div class="flex items-center justify-between mb-4">
        <div class="flex-shrink-0">
          <span
            class="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white"
          >
            Giving Units
          </span>
        </div>
        <div
          class="flex items-center justify-end flex-1 text-base font-medium text-green-500 dark:text-green-400"
        >
          12.5%
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      
      <div id="main-chart"></div>
    
      <div
        class="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700"
      >
        <div class="flex-shrink-0">
          <button
            class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
          >
            Expand Info
            <svg
              class="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
    `;

    if (document.getElementById('main-chart')) {
      const chart = new ApexCharts(
        document.getElementById('main-chart'),
        getMainChartOptions()
      );

      console.log(chart.ctx);
      chart.render();

      // init again when toggling dark mode
      document.addEventListener('dark-mode', function () {
        chart.updateOptions(getMainChartOptions());
      });
    } else {
      throw new Error('no main-chart');
    }


    closeSidebarAfterSelectingOption()

};
