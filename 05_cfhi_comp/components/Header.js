document.getElementById(
  "nav"
).innerHTML = `<div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start">
        <button
          id="toggleSidebarMobile"
          aria-expanded="true"
          aria-controls="sidebar"
          class="p-2 text-gray-600 rounded cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg
            id="toggleSidebarMobileHamburger"
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            id="toggleSidebarMobileClose"
            class="hidden w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div class="flex ml-2 md:mr-24">
          <img
            src="https://media.licdn.com/dms/image/C4D0BAQGjPsUWVmUauw/company-logo_200_200/0/1523879678231?e=2147483647&v=beta&t=f0iYTVCV56l8aRVGdR_8Ho0oPhCrb7_dtiVGBk-7Fm0"
            class="h-8 mr-3"
            alt="Logo"
          />
          <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
            CFHI
          </span>
        </div>
      </div>
      <div class="flex items-center cursor-pointer">
        <div
          id="custom-select"
          class="block py-2.5 px-0 mr-4 w-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 bg-transparent border-0 border-b-2 border-gray-400 hover:border-gray-600 dark:border-gray-400 dark:hover:border-gray-300 appearance-none transition delay-50 focus:outline-none focus:ring-0 focus:border-gray-200 peer relative text-xl"
        >
          <div class="flex items-center justify-between">
            <svg
              class="w-5 h-5 text-gray-500 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" 
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
            </svg>
            <div class="px-2">Select Years</div>
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
            class="absolute left-0 z-10 mt-2 w-full bg-white border shadow-2xl rounded-lg dark:border-gray-600 border-gray-300 dark:bg-gray-800 dark:shadow-md dark:shadow-capinGrey h-80 overflow-y-auto"
          ></div>
        </div>
        <button
          data-modal-target="options_modal"
          data-modal-toggle="options_modal"
          type="button"
          class="flex mr-3 backgroundBlue font-bold py-2 px-4 rounded transition transform text-white dark:text-white hover:scale-105 hover:shadow-md hover:shadow-blue-300 opacity-75 hover:opacity-100 cursor:pointer"
        >
          <span>Options</span>
          <svg class="pl-2 w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z"/>
          </svg>
        </button>
        <button
          id="run"
          class="backgroundGreen font-bold py-2 px-4 rounded transition transform text-white dark:text-white hover:scale-105 hover:shadow-md hover:shadow-green-300 opacity-75 hover:opacity-100 cursor:pointer"
        >
          <span>Run</span>
        </button>
      </div>
      <div class="flex items-center">
        <button
          id="theme-toggle"
          type="button"
          class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        >
          <svg
            id="theme-toggle-dark-icon"
            class="hidden w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg
            id="theme-toggle-light-icon"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>`;

const customSelectElement = document.getElementById("custom-select");
const optionsListElement = document.getElementById("options-list");
const sidebarElement = document.getElementById("sidebar");
const backdropElement = document.getElementById("sidebarBackdrop");

const customSelectRegionElement = document.getElementById(
  "custom-select-region"
);
const optionsListRegionElement = document.getElementById("options-list-region");

const customSelectSitesElement = document.getElementById(
  "custom-select-site"
);
const optionsListSitesElement = document.getElementById("options-list-site");

customSelectElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectElement
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListElement.classList.toggle("invisible");
  }
});
customSelectRegionElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectRegion
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListRegionElement.classList.toggle("invisible"); // Corrected class name
  }
});

customSelectSitesElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectSitesElement
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListSitesElement.classList.toggle("invisible");
  }
});


document.addEventListener("click", (event) => {
  if (
    !customSelectElement.contains(event.target) &&
    !optionsListElement.contains(event.target)
  ) {
    optionsListElement.classList.add("invisible");
  }

  if (
    !optionsListRegionElement.contains(event.target) &&
    !customSelectRegionElement.contains(event.target)
  ) {
    optionsListRegionElement.classList.add("invisible");
  }

  if (
    !optionsListSitesElement.contains(event.target) &&
    !customSelectSitesElement.contains(event.target)
  ) {
    optionsListSitesElement.classList.add("invisible");
  }

});

const addUniqueRegionsToOptionsSelectRegionsDropdown = (regionsArray) => {
  const optionsListRegion = document.getElementById("options-list-region");

  regionsArray.forEach((regionObject) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${regionString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${regionString}`);
    newInput.setAttribute(
      "class",
      "form-checkbox h-4 w-4 text-gray-600 mr-2 rounded"
    );
    newInput.setAttribute("value", regionString);

    // Add the value to selectedRegions_Array and check the input by default
    selectedRegions_Array.push(regionString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener("change", function () {
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

    const newSpan = document.createElement("span");
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListRegion.appendChild(newLabel);
  });
};

const addUniqueRegionsToOptionsSelectRegion = (regionsArray) => {
  const optionsListRegion = document.getElementById("options-list-region");

  regionsArray.forEach((regionObject) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${regionString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${regionString}`);
    newInput.setAttribute(
      "class",
      "form-checkbox h-4 w-4 text-gray-600 mr-2 rounded"
    );
    newInput.setAttribute("value", regionString);

    // Add the value to selectedRegions_Array and check the input by default
    selectedRegions_Array.push(regionString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener("change", function () {
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

    const newSpan = document.createElement("span");
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListRegion.appendChild(newLabel);
  });
};

const addUniqueSitesToOptionsSelectSitesDropdown = (sitesArray) => {
  const optionsListSite = document.getElementById("options-list-site");

  sitesArray.forEach((siteObject) => {
    const siteName = siteObject.arr[0];
    const siteString = siteObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${siteString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${siteString}`);
    newInput.setAttribute(
      "class",
      "form-checkbox h-4 w-4 text-gray-600 mr-2 rounded"
    );
    newInput.setAttribute("value", siteString);

    // Add the value to selectedSites_Array and check the input by default
    selectedSites_Array.push(siteString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        // Handle when the site is selected
        selectedSites_Array.push(siteString);
      } else {
        // Handle when the site is deselected
        const index = selectedSites_Array.indexOf(siteString);
        if (index > -1) {
          selectedSites_Array.splice(index, 1);
        }
      }
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = siteName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListSite.appendChild(newLabel);
  });
};

const addUniqueSitesToOptionsSelectSite = (sitesArray) => {
  const optionsListSite = document.getElementById("options-list-site");

  sitesArray.forEach((siteObject) => {
    // console.log(siteObject);
    const siteName = siteObject.arr[0];
    const siteString = siteObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${siteString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${siteString}`);
    newInput.setAttribute(
      "class",
      "form-checkbox h-4 w-4 text-gray-600 mr-2 rounded"
    );
    newInput.setAttribute("value", siteString);

    // Add the value to selectedSites_Array and check the input by default
    selectedSites_Array.push(siteString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        // Handle when the site is selected
        selectedSites_Array.push(siteString);
      } else {
        // Handle when the site is deselected
        const index = selectedSites_Array.indexOf(siteString);
        if (index > -1) {
          selectedSites_Array.splice(index, 1);
        }
      }
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = siteName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListSite.appendChild(newLabel);
  });
};


adjustDivHeight()

window.addEventListener('resize', adjustDivHeight);