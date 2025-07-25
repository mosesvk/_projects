

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