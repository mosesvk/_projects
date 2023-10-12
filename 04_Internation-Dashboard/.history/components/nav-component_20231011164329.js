document.getElementById('nav').innerHTML = (
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

        <div class='relative cursor-pointer'>
          <div
            id='custom-select'
            class='block py-2.5 px-0 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer relative text-xl'
          >
            <div class='flex items-center justify-between'>
              <svg
                class='w-5 h-5 text-gray-500 dark:text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z'></path>
                <path
                  clip-rule='evenodd'
                  fill-rule='evenodd'
                  d='M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z'
                ></path>
              </svg>
              <div class='px-2'>Select Years</div>
              <svg
                class='h-5 w-5 text-gray-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fill-rule='evenodd'
                  d='M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                  clip-rule='evenodd'
                />
              </svg>
            </div>
            <div
              id='options-list'
              class='absolute left-0 z-10 mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-lg invisible border-gray-200 dark:bg-gray-800 dark:border-gray-800 dark:shadow-lg'
            ></div>
          </div>
        </div>
        <button 
          class='relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800'>
          <span class='relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
            <span class='text-xl'>Run</span>
          </span>
        </button>
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
      </div>
    </div>
  </div>
);

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

//
yearsData_Array.forEach((year) => {
  // Create a new <label> element
  const newLabel = document.createElement('label');
  newLabel.setAttribute('for', `option-${year}`);
  newLabel.setAttribute(
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
  );

  const newInput = document.createElement('input');
  newInput.setAttribute('type', 'checkbox');
  newInput.setAttribute('id', `option-${year}`);
  newInput.setAttribute('class', `form-checkbox h-4 w-4 text-gray-600 mr-2`);
  newInput.setAttribute('value', year);

  const newSpan = document.createElement('span');
  newSpan.innerText = year;

  newLabel.appendChild(newInput);
  newLabel.appendChild(newSpan);

  optionsList.appendChild(newLabel);
});
