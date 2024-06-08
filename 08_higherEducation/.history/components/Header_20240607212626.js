const sidebarElement = document.getElementById("sidebar");
const backdropElement = document.getElementById("sidebarBackdrop");

const customSelectYearElement = document.getElementById("custom-select-year");
const customSelectRegionElement = document.getElementById(
  "custom-select-region"
);
const customSelectStateElement = document.getElementById(
  "custom-select-state"
);

const optionsListYearElement = document.getElementById("options-list-year");
const optionsListRegionElement = document.getElementById("options-list-region");
const optionsListStateElement = document.getElementById("options-list-state");

customSelectYearElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectYearElement
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListYearElement.classList.toggle("invisible");
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
customSelectStateElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectTypeElement
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListStateElement.classList.toggle("invisible");
  }
});

document.addEventListener("click", (event) => {
  if (
    !customSelectYearElement.contains(event.target) &&
    !optionsListYearElement.contains(event.target)
  ) {
    optionsListYearElement.classList.add("invisible");
  }

  if (
    !optionsListRegionElement.contains(event.target) &&
    !customSelectRegionElement.contains(event.target)
  ) {
    optionsListRegionElement.classList.add("invisible");
  }

  if (
    !customSelectStateElement.contains(event.target) &&
    !optionsListStateElement.contains(event.target)
  ) {
    optionsListStateElement.classList.add("invisible");
  }
});

const addUniqueRegionsToOptionsSelectRegionsDropdown = (regionArray) => {
  const optionsListRegion = document.getElementById("options-list-region");

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListRegion.appendChild(selectAllLabel);

  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const regionCheckboxes = document.querySelectorAll(
      "#options-list-region input[type='checkbox']"
    );
    regionCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  });

  regionArray.forEach((regionObject, index) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${regionString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${regionString}`);
    newInput.setAttribute(
      "class",
      "w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    newInput.setAttribute("value", regionString);

    // Add the value to selectedRegions_Array and check the input by default
    selectedRegions_Array.add(regionString);
    newInput.checked = false;

    const newSpan = document.createElement("span");
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListRegion.appendChild(newLabel);
  });

  // Add event listeners to other checkboxes
  const regionLabels = document.querySelectorAll("#options-list-region label");
  regionLabels.forEach((label, index) => {
    const input = label.querySelector("input");
    const regionString = label.querySelector("input").value;

    input.addEventListener("change", function () {
      if (input.checked && !selectedRegions_Array.has(regionString)) {
        // Handle when the region is selected
        selectedRegions_Array.add(regionString);
      } else if (input.checked && selectedRegions_Array.has(regionString)) {
        // loop through regionLabels again to find any unchecked inputs, if so, delete from selectedRegions_Array
        regionLabels.forEach((label) => {
          const input = label.querySelector("input");
          const regionString = label.querySelector("input").value;
          if (!input.checked) {
            selectedRegions_Array.delete(regionString);
          }
        });
      } else {
        selectedRegions_Array.delete(regionString);
        // check if all inputs are unchecked, if so, make sure selectedRegions_Array contains all regions
        let allUnchecked = true;
        regionLabels.forEach((label) => {
          const input = label.querySelector("input");
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          regionLabels.forEach((label) => {
            const regionString = label.querySelector("input").value;
            selectedRegions_Array.add(regionString);
          });
        }
      }
    });
  });
};

const addUniqueStatesToOptionsSelectStatesDropdown = (stateArray) => {
  const optionsListState = document.getElementById("options-list-state");

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListState.appendChild(selectAllLabel);

  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const stateCheckboxes = document.querySelectorAll(
      "#options-list-state input[type='checkbox']"
    );
    stateCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  });

  stateArray.forEach((stateObject, index) => {
    const stateName = stateObject.arr[0];
    const stateString = stateObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${stateString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${stateString}`);
    newInput.setAttribute(
      "class",
      "w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    newInput.setAttribute("value", stateString);

    // Add the value to selectedStates_Array and check the input by default
    selectedStates_Array.add(stateString);
    newInput.checked = false;

    const newSpan = document.createElement("span");
    newSpan.innerText = stateName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListState.appendChild(newLabel);
  });

  // Add event listeners to other checkboxes
  const stateLabels = document.querySelectorAll("#options-list-state label");
  stateLabels.forEach((label, index) => {
    const input = label.querySelector("input");
    const stateString = label.querySelector("input").value;

    input.addEventListener("change", function () {
      if (input.checked && !selectedStates_Array.has(stateString)) {
        // Handle when the state is selected
        selectedStates_Array.add(stateString);
      } else if (input.checked && selectedStates_Array.has(stateString)) {
        // loop through stateLabels again to find any unchecked inputs, if so, delete from selectedStates_Array
        stateLabels.forEach((label) => {
          const input = label.querySelector("input");
          const stateString = label.querySelector("input").value;
          if (!input.checked) {
            selectedStates_Array.delete(stateString);
          }
        });
      } else {
        selectedStates_Array.delete(stateString);
        // check if all inputs are unchecked, if so, make sure selectedStates_Array contains all states
        let allUnchecked = true;
        stateLabels.forEach((label) => {
          const input = label.querySelector("input");
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          stateLabels.forEach((label) => {
            const stateString = label.querySelector("input").value;
            selectedStates_Array.add(stateString);
          });
        }
      }
    });
  });
};




////////////////////////////////////////////////////////////////////////////////////////////////////////////

const addUniqueClientsToOptionsSelectClientDropdown = (clientSet) => {
  const optionsListClient = document.getElementById("options-list-client");
  const searchInput = document.getElementById("input-group-search");

  // Function to filter clients based on search input
  const filterClients = () => {
    const searchValue = searchInput.value.toLowerCase();
    const clients = optionsListClient.querySelectorAll("label[for^='client_']");
    clients.forEach((client) => {
      if (client.getAttribute("for") !== "input-group-search") {
        const clientName = client.innerText.toLowerCase();
        const listItem = client.parentElement.parentElement;
        if (clientName.includes(searchValue)) {
          listItem.style.display = "block";
        } else {
          listItem.style.display = "none";
        }
      }
    });
  };

  // Event listener for search input
  searchInput.addEventListener("input", filterClients);

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-client");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-client");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-client");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListClient.insertBefore(selectAllLabel, optionsListClient.children[1]);

  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const clientCheckboxes = document.querySelectorAll(
      "#options-list-client input[type='checkbox']"
    );
    clientCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  });

  // Generate client checkboxes
  clientSet.forEach((clientString) => {
    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `client_${clientString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", clientString);

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `client_${clientString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = clientString;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);

    optionsListClient.appendChild(newListItem);
  });

  // Function to update selectedClients_Array
  const clientDivs = document.querySelectorAll("#options-list-client li div");
  clientDivs.forEach((div) => {
    const input = div.querySelector("input");
    const clientString = div.querySelector("label").textContent;

    input.addEventListener("change", function () {
      if (input.checked && !selectedClients_Array.has(clientString)) {
        // Handle when the type is selected
        selectedClients_Array.add(clientString);
      } else if (input.checked && selectedClients_Array.has(clientString)) {
        // loop through clientDivs again to find any unchecked inputs, if so, delete from selectedClients_Array
        clientDivs.forEach((div) => {
          const input = div.querySelector("input");
          const clientString = div.querySelector("label").textContent;
          if (!input.checked) {
            selectedClients_Array.delete(clientString);
          }
        });
      } else {
        selectedClients_Array.delete(clientString);
        // check if all inputs are unchecked, if so, make sure selectedClients_Array contains all types
        let allUnchecked = true;
        clientDivs.forEach((label) => {
          const input = label.querySelector("input");
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          clientDivs.forEach((div) => {
            const clientString = div.querySelector("label").textContent;
            selectedClients_Array.add(clientString);
          });
        }
      }
    });
  });
};

adjustDivHeight();

window.addEventListener("resize", adjustDivHeight);
