document.getElementById('nav').innerHTML = 
`
  <div class='px-3 py-3 lg:px-5 lg:pl-3'>
    <div class='flex items-center justify-between'>
      <div class='flex items-center justify-start'>
        <button
          id='toggleSidebarMobile'
          aria-expanded='true'
          aria-controls='sidebar'
          class='p-2 text-gray-600 rounded cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          <svg
            id='toggleSidebarMobileHamburger'
            class='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
              clip-rule='evenodd'
            ></path>
          </svg>
          <svg
            id='toggleSidebarMobileClose'
            class='hidden w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clip-rule='evenodd'
            ></path>
          </svg>
        </button>
        <a href='http://localhost:1313/' class='flex ml-2 md:mr-24'>
          <img
            src='https://media.licdn.com/dms/image/C4D0BAQGjPsUWVmUauw/company-logo_200_200/0/1523879678231?e=2147483647&v=beta&t=f0iYTVCV56l8aRVGdR_8Ho0oPhCrb7_dtiVGBk-7Fm0'
            class='h-8 mr-3'
            alt='Logo'
          />
          <span class='self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white'>
            International
          </span>
        </a>

        <div class="relative cursor-pointer">
        <div
            id="custom-select"
            class="block py-2.5 px-0 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer relative text-xl"
        >
            <div class="flex items-center justify-between">
                <div>Select Years</div>
                <svg
                    class="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fill-rule="evenodd"
                        d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </div>
            <div
                id="options-list"
                class="absolute left-0 z-10 mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-lg invisible"
            >
                <label
                    for="option-2015"
                    class="flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                    <input
                        type="checkbox"
                        id="option-2015"
                        class="form-checkbox h-4 w-4 text-gray-600 mr-2"
                        value="2015"
                    />
                    <span>2015</span>
                </label>
                <label
                    for="option-2016"
                    class="flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                    <input
                        type="checkbox"
                        id="option-2016"
                        class="form-checkbox h-4 w-4 text-gray-600 mr-2"
                        value="2016"
                    />
                    <span>2016</span>
                </label>
            </div>
        </div>
    </div>
 
        

    </div>
      <div class='flex items-center'>
        <div class='hidden mr-3 -mb-1 sm:block'>
          <span></span>
        </div>
        <button
          id='toggleSidebarMobileSearch'
          type='button'
          class='p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          <span class='sr-only'>Search</span>
          <svg
            class='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              clip-rule='evenodd'
            ></path>
          </svg>
        </button>

        <button
          id='theme-toggle'
          data-tooltip-target='tooltip-toggle'
          type='button'
          class='text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5'
        >
          <svg
            id='theme-toggle-dark-icon'
            class='hidden w-5 h-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z'></path>
          </svg>
          <svg
            id='theme-toggle-light-icon'
            class='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
              fill-rule='evenodd'
              clip-rule='evenodd'
            ></path>
          </svg>
        </button>
        <div
          id='tooltip-toggle'
          role='tooltip'
          class='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip'
          data-popper-placement='bottom'
          style='
        position: absolute;
        inset: 0px auto auto 0px;
        margin: 0px;
        transform: translate(470px, 60px);
      '
        >
          Toggle dark mode
          <div
            class='tooltip-arrow'
            data-popper-arrow=''
            style='
          position: absolute;
          left: 0px;
          transform: translate(69px, 0px);
        '
          ></div>
        </div>

        <div class='flex items-center ml-3'>
          <div>
            <button
              type='button'
              class='flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
              id='user-menu-button-2'
              aria-expanded='false'
              data-dropdown-toggle='dropdown-2'
            >
              <span class='sr-only'>Open user menu</span>
              <img
                class='w-8 h-8 rounded-full'
                src='https://media.licdn.com/dms/image/C4D0BAQGjPsUWVmUauw/company-logo_200_200/0/1523879678231?e=2147483647&v=beta&t=f0iYTVCV56l8aRVGdR_8Ho0oPhCrb7_dtiVGBk-7Fm0'
                alt='user photo'
              />
            </button>
          </div>

          <div
            class='z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600'
            id='dropdown-2'
            data-popper-placement='bottom'
            style='
          position: absolute;
          inset: 0px auto auto 0px;
          margin: 0px;
          transform: translate(590px, 58px);
        '
          >
            <div class='px-4 py-3' role='none'>
              <p class='text-sm text-gray-900 dark:text-white' role='none'>
                Neil Sims
              </p>
              <p
                class='text-sm font-medium text-gray-900 truncate dark:text-gray-300'
                role='none'
              >
                neil.sims@flowbite.com
              </p>
            </div>
            <ul class='py-1' role='none'>
              <li>
                <a
                  href='#'
                  class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                  role='menuitem'
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href='#'
                  class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                  role='menuitem'
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href='#'
                  class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                  role='menuitem'
                >
                  Earnings
                </a>
              </li>
              <li>
                <a
                  href='#'
                  class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                  role='menuitem'
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
`;


const customSelect = document.getElementById('custom-select');
const optionsList = document.getElementById('options-list');

customSelect.addEventListener('click', () => {
    optionsList.classList.toggle('invisible');
});

document.addEventListener('click', (event) => {
    if (
        !customSelect.contains(event.target) &&
        !optionsList.contains(event.target)
    ) {
        optionsList.classList.add('invisible');
    }
});

// Prevent the click on a checkbox from hiding the options list
const checkboxes = document.querySelectorAll('.form-checkbox');
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', (event) => {
        event.stopPropagation(); // Stop propagation to the parent div
    });
});

let selectedOptions = [];

// checkboxes.forEach((checkbox) => {
//     checkbox.addEventListener('change', () => {
//         const selectedValue = checkbox.value;
//         if (checkbox.checked) {
//             selectedOptions.push(selectedValue);
//         } else {
//             const index = selectedOptions.indexOf(selectedValue);
//             if (index !== -1) {
//                 selectedOptions.splice(index, 1);
//             }
//         }
//         customSelect.querySelector('div').textContent =
//             selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Years';
//     });
// });
