document.getElementById('nav').innerHTML = `
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
        <div class='flex ml-2 md:mr-24'>
          <img
            src='https://media.licdn.com/dms/image/C4D0BAQGjPsUWVmUauw/company-logo_200_200/0/1523879678231?e=2147483647&v=beta&t=f0iYTVCV56l8aRVGdR_8Ho0oPhCrb7_dtiVGBk-7Fm0'
            class='h-8 mr-3'
            alt='Logo'
          />
          <span class='self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white'>
            International
          </span>
        </div>
      </div>
      <div class='flex items-center cursor-pointer'>
      <div
          id='custom-select'
          class='block py-2.5 px-0 mr-4 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 hover:border-gray-400  appearance-none dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-500 transition delay-50 focus:outline-none focus:ring-0 focus:border-gray-200 peer relative text-xl'
        >
          <div class='flex items-center justify-between'>
            <svg class="w-5 h-5 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z"/>
            </svg>
            <div class='px-2 hover:text-gray-600'>Select Years</div>
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
            class='absolute left-0 z-10 mt-2 w-full bg-white border shadow-2xl rounded-lg invisible dark:border-gray-600 border-gray-300 dark:bg-gray-800 dark:shadow-md dark:shadow-capinGrey'
          ></div>
      </div>
      <div
          id='custom-select-region'
          class='block py-2.5 px-0 mr-4 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 hover:border-gray-400  appearance-none dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-500 transition delay-50 focus:outline-none focus:ring-0 focus:border-gray-200 peer relative text-xl'
        >
          <div class='flex items-center justify-between'>
            <div class="flex items-center"> 
            <svg class="w-5 h-5 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
            </svg>
              <div class='px-2 w-max hover:text-gray-600'>Select Region</div>
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
            id='options-list-region'
            class='absolute top-9 left-0 z-10 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:shadow-lg w-max invisible'
          ></div>
          </div>
      </div>
      <button
        id='run'
        class="bg-green-300 font-bold py-2 px-4 rounded transition transform text-black dark:text-white hover:scale-105 hover:shadow-md hover:shadow-green-300 opacity-75 hover:opacity-100"
        >
        Run
      </button>
      </div>
      <div class='flex items-center'>
        <button
          id='theme-toggle'
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
  </div>`;

const customSelect = document.getElementById('custom-select');
const optionsList = document.getElementById('options-list');
const sidebar = document.getElementById('sidebar')

const customSelectRegion = document.getElementById('custom-select-region');
const optionsListRegion = document.getElementById('options-list-region');

customSelect.addEventListener('click', (event) => {
  // Check if the click target is not a checkbox inside the customSelect
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsList.classList.toggle('invisible');
  }
});
customSelectRegion.addEventListener('click', (event) => {
  // Check if the click target is not a checkbox inside the customSelectRegion
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsListRegion.classList.toggle('invisible'); // Corrected class name
  }
});

document.addEventListener('click', (event) => {
  if (
    !customSelect.contains(event.target) &&
    !optionsList.contains(event.target)
  ) {
    optionsList.classList.add('invisible');
  }

  if (
    !optionsListRegion.contains(event.target) &&
    !customSelectRegion.contains(event.target)
  ) {
    optionsListRegion.classList.add('invisible');
  }
});

const addUniqueRegionsToOptionsSelectRegionDropdown = (regionsArray) => {
  const optionsListRegion = document.getElementById('options-list-region');

  regionsArray.forEach((regionObject) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `option-${regionString}`);
    newLabel.setAttribute(
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
    );

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('id', `option-${regionString}`);
    newInput.setAttribute(
      'class',
      'form-checkbox h-4 w-4 text-gray-600 mr-2 rounded'
    );
    newInput.setAttribute('value', regionString);

    // Add the value to selectedRegions_Array and check the input by default
    selectedRegions_Array.push(regionString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener('change', function () {
      if (newInput.checked) {
        // Handle when the region is selected
        selectedRegions_Array.push(regionString);
      } else {
        // Handle when the region is deselected
        const index = selectedRegions_Array.indexOf(regionString);
        if (index > -1) {
          selectedRegions_Array.splice(index, 1);
        }
      }
    });

    const newSpan = document.createElement('span');
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListRegion.appendChild(newLabel);
  });
};

const sidebarButtons = document.querySelectorAll("button[id$='Link']");
const tabContents = document.querySelectorAll('.tab-content');

console.log(sidebarButtons);
sidebarButtons.forEach(function (button, index) {
  button.addEventListener('click', function () {
    // Hide all tab contents
    tabContents.forEach(function (content) {
      content.classList.add('hidden');
    });

    // Show the corresponding tab content based on the button index
    tabContents[index].classList.remove('hidden');

    // Hide the sidebar and backdrop
    sidebar.classList.add('invisible');
    // Add the following line if you have a backdrop element
    backdrop.classList.add('invisible');
  });
});


