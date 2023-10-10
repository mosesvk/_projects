document.querySelector('main').innerHTML = `
<!--Table Report-->
<div
  class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"
>
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
              <tr>
                <th scope="col" class="px-6 py-3">Product name</th>
                <th scope="col" class="px-6 py-3">Color</th>
                <th scope="col" class="px-6 py-3">Category</th>
                <th scope="col" class="px-6 py-3">Price</th>
                <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">Silver</td>
                <td class="px-6 py-4">Laptop</td>
                <td class="px-6 py-4">$2999</td>
                <td class="px-6 py-4 text-right">
                  <a
                    href="#"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >Edit</a
                  >
                </td>
              </tr>
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Microsoft Surface Pro
                </th>
                <td class="px-6 py-4">White</td>
                <td class="px-6 py-4">Laptop PC</td>
                <td class="px-6 py-4">$1999</td>
                <td class="px-6 py-4 text-right">
                  <a
                    href="#"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >Edit</a
                  >
                </td>
              </tr>
              <tr
                class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Magic Mouse 2
                </th>
                <td class="px-6 py-4">Black</td>
                <td class="px-6 py-4">Accessories</td>
                <td class="px-6 py-4">$99</td>
                <td class="px-6 py-4 text-right">
                  <a
                    href="#"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >Edit</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- Card Footer -->
  <div class="flex items-center justify-between pt-3 sm:pt-6">
    <div class="flex-shrink-0">
      <a
        href="#"
        class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
      >
        Transactions Report
        <svg
          class="w-4 h-4 ml-1 sm:w-5 sm:h-5"
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
      </a>
    </div>
  </div>
</div>
`