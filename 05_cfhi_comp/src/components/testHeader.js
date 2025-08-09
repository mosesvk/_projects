// HEADER.js

// Initialize global Sets if they don't exist
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedStates_Array = window.selectedStates_Array || new Set();
window.selectedMemberships_Array =
  window.selectedMemberships_Array || new Set();
window.selectedTypes_Array = window.selectedTypes_Array || new Set();
window.selectedAthletics_Array = window.selectedAthletics_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();
window.selectedSeminaries_Array = window.selectedSeminaries_Array || new Set();
window.selectedRegionals_Array = window.selectedRegionals_Array || new Set();

// Initialize slider default values
window.sliderValue = 0;
window.sliderValue2 = 16000;

/**
 * Sets up dropdown toggle functionality
 * @param {string} selectElementId - ID of the dropdown trigger element
 * @param {string} optionsListId - ID of the dropdown content element
 */
function setupDropdownToggle(selectElementId, optionsListId) {
  const selectElement = document.getElementById(selectElementId);
  const optionsListElement = document.getElementById(optionsListId);

  if (!selectElement || !optionsListElement) {
    console.warn(
      `Dropdown elements not found: ${selectElementId}, ${optionsListId}`
    );
    return;
  }

  // Function to close all other dropdowns
  function closeOtherDropdowns(currentOptionsListId) {
    const dropdownConfigs = [
      { selectId: "custom-select-year", optionsId: "options-list-year" },
      { selectId: "custom-select-region", optionsId: "options-list-region" },
      { selectId: "custom-select-state", optionsId: "options-list-state" },
      { selectId: "custom-select-type", optionsId: "options-list-type" },
      {
        selectId: "custom-select-athletic",
        optionsId: "options-list-athletic",
      },
      {
        selectId: "custom-select-seminary",
        optionsId: "options-list-seminary",
      },
      {
        selectId: "custom-select-regional",
        optionsId: "options-list-regional",
      },
      {
        selectId: "custom-select-membership",
        optionsId: "options-list-membership",
      },
      { selectId: "custom-select-client", optionsId: "options-list-client" },
    ];

    dropdownConfigs.forEach((config) => {
      if (config.optionsId !== currentOptionsListId) {
        const otherOptionsListElement = document.getElementById(
          config.optionsId
        );
        if (otherOptionsListElement) {
          otherOptionsListElement.classList.add("invisible");
        }
      }
    });
  }

  // Function to toggle dropdown visibility
  function toggleDropdown(event) {
    // Prevent event propagation to avoid immediate closing
    event.stopPropagation();

    // Check if click is on checkbox or label to prevent unnecessary toggling
    if (
      event.target.closest(".form-checkbox") ||
      event.target.closest("label")
    ) {
      return;
    }

    // Close other dropdowns first
    closeOtherDropdowns(optionsListId);

    // Toggle visibility
    optionsListElement.classList.toggle("invisible");
  }

  // Function to close dropdown when clicking outside
  function closeDropdownOutsideClick(event) {
    if (
      !selectElement.contains(event.target) &&
      !optionsListElement.contains(event.target)
    ) {
      optionsListElement.classList.add("invisible");
    }
  }

  // Remove any existing listeners to prevent duplicate attachments
  selectElement.removeEventListener("click", toggleDropdown);
  document.removeEventListener("click", closeDropdownOutsideClick);

  // Add new event listeners
  selectElement.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOutsideClick);
}

/**
 * Checks if a client matches the current filter criteria
 * Critical function that determines whether a client should be selected
 */
function clientMatchesFilters(
  clientData,
  minEnrollment,
  maxEnrollment,
  selectedRegions,
  selectedStates,
  selectedMemberships,
  selectedTypes,
  selectedAthletics,
  selectedSeminaries,
  selectedRegionals
) {
  if (!clientData) return false;
  //   console.log('clientMatchesFilters', clientData);
  //   {
  //     "name": "Wofford College",
  //     "year": "2020",
  //     "enrollment": 0,
  //     "region": "0",
  //     "state": "SC",
  //     "membership": [
  //         "Unspecified"
  //     ],
  //     "type": [
  //         "Unspecified"
  //     ],
  //     "athletic": [
  //         "Unspecified"
  //     ],
  //     "seminary": [],
  //     "regional": [
  //         "South Carolina Independent Colleges and Universities"
  //     ]
  // }

  // Check enrollment range
  const enrollmentMatch =
    clientData.enrollment >= minEnrollment &&
    clientData.enrollment <= maxEnrollment;

  if (
    selectedRegions.length === 0 ||
    selectedStates.length === 0 ||
    selectedMemberships.length === 0 ||
    selectedTypes.length === 0 ||
    selectedAthletics.length === 0 ||
    selectedSeminaries.length === 0 ||
    selectedRegionals.length === 0
  ) {
    console.warn("No areas or types selected, returning false");
    return false;
  }

  // Check if client has at least one of the selected regions, handle missing regions
  const regionMatch = clientData.region
    ? selectedRegions.includes(clientData.region)
    : false;

  // Check if client has at least one of the selected states, handle missing states
  const stateMatch = clientData.state
    ? selectedStates.includes(clientData.state)
    : false;

  // Check if client has at least one of the selected memberships, handle missing memberships
  const membershipMatch = clientData.membership
    ? clientData.membership.some((membership) =>
        selectedMemberships.includes(membership)
      )
    : false;

  // Check if client has at least one of the selected types, handle missing typeQuery
  const typeMatch = clientData.type
    ? clientData.type.some((type) => selectedTypes.includes(type))
    : true; // Set to true if type is missing to avoid breaking functionality

  // Check if client has at least one of the selected athletics, handle missing athletics
  const athleticMatch = clientData.athletic
    ? clientData.athletic.some((athletic) =>
        selectedAthletics.includes(athletic)
      )
    : false;

  // Check if client has at least one of the selected seminaries, handle missing seminaries
  const seminaryMatch = clientData.seminary
    ? clientData.seminary.some((seminary) =>
        selectedSeminaries.includes(seminary)
      )
    : false;

  // Check if client has at least one of the selected regionals, handle missing regionals
  const regionalMatch = clientData.regional
    ? clientData.regional.some((regional) =>
        selectedRegionals.includes(regional)
      )
    : false;

  if (
    clientData.name === "Briercrest College and Seminary" 
  ) {
    // console.log("clientMatchesFilters", {
    //   clientData,
    //   enrollmentMin,
    //   enrollmentMax,
    //   selectedRegions,
    //   selectedStates,
    //   selectedMemberships,
    //   selectedTypes,
    //   selectedAthletics,
    //   selectedSeminaries,
    //   selectedRegionals,
    //   enrollmentMatch,
    //   regionMatch,
    //   stateMatch,
    //   membershipMatch,
    //   typeMatch,
    //   athleticMatch,
    //   seminaryMatch,
    //   regionalMatch,
    // });
  }
  return (
    enrollmentMatch &&
    regionMatch &&
    stateMatch &&
    membershipMatch &&
    typeMatch &&
    athleticMatch &&
    seminaryMatch &&
    regionalMatch
  );
}



/**
 * Updates client dropdown checkboxes based on current filter criteria
 * Acts as the primary filter implementation that Utility.js will defer to
 */

// Initialize prevMatchCount outside the function
let prevMatchCount = 0;

function updateClientDropdownFilters() {
  // console.log("Running client dropdown filter update");

  // Ensure client data store exists
  if (!window.clientDataStore) {
    console.warn("Client data store not initialized");
    return;
  }

  // Get current filter values
  const selectedRegions = Array.from(window.selectedRegions_Array || []);
  const selectedStates = Array.from(window.selectedStates_Array || []);
  const selectedMemberships = Array.from(
    window.selectedMemberships_Array || []
  );
  const selectedTypes = Array.from(window.selectedTypes_Array || []);
  const selectedAthletics = Array.from(window.selectedAthletics_Array || []);
  const selectedSeminaries = Array.from(window.selectedSeminaries_Array || []);
  const selectedRegionals = Array.from(window.selectedRegionals_Array || []);
  const minEnrollment = window.sliderValue || 0;
  const maxEnrollment = window.sliderValue2 || 25000;

  // Get all client checkboxes
  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );

  // Get the select all checkbox
  const selectAllCheckbox = document.getElementById(
    "select-all-checkbox-client"
  );

  // Clear the selected clients array to rebuild from scratch
  window.selectedClients_Array.clear();
  let matchCount = 0;
  let totalClientCount = 0;

  // Process each client checkbox (skip the select all checkbox)
  clientCheckboxes.forEach((checkbox) => {
    if (checkbox.id === "select-all-checkbox-client") return;

    totalClientCount++;
    const clientName = checkbox.value;
    const clientData = window.clientDataStore[clientName];

    if (!clientData) {
      console.warn(`No data found for client: ${clientName}`);
      checkbox.checked = false;
      return;
    }

    // Determine if client matches all filter criteria
    const matches = clientMatchesFilters(
      clientData,
      minEnrollment,
      maxEnrollment,
      selectedRegions,
      selectedStates,
      selectedMemberships,
      selectedTypes,
      selectedAthletics,
      selectedSeminaries,
      selectedRegionals
    );

    // Update checkbox and selection array
    checkbox.checked = matches;

    if (matches) {
      window.selectedClients_Array.add(clientName);
      matchCount++;
    }
  });

  // Update select all checkbox state
  if (selectAllCheckbox) {
    const allSelected = matchCount === totalClientCount && totalClientCount > 0;
    const noneSelected = matchCount === 0;

    selectAllCheckbox.checked = allSelected;
    selectAllCheckbox.indeterminate = !allSelected && !noneSelected;
  }

  // Only show toast if matchCount has changed and not on initial load
  if (window.hasRunInitialClientDropdownFilter) {
    if (matchCount !== prevMatchCount) {
      createToastSuccess(`${matchCount} clients match your filter criteria`);
    }
  } else {
    window.hasRunInitialClientDropdownFilter = true;
  }
  
  // Update prevMatchCount for next comparison
  prevMatchCount = matchCount;

  // console.log(
  //   `Filter completed: ${matchCount} of ${totalClientCount} clients match current filters`
  // );
  // console.log("Selected clients:", Array.from(window.selectedClients_Array));
}
/**
 * Updates the state of the "select all" checkbox based on individual client selections
 */
function updateSelectAllClientCheckboxState() {
  const selectAllCheckbox = document.getElementById(
    "select-all-checkbox-client"
  );
  if (!selectAllCheckbox) return;

  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );
  const clientOnlyCheckboxes = Array.from(clientCheckboxes).filter(
    (checkbox) => checkbox.id !== "select-all-checkbox-client"
  );

  const allChecked = clientOnlyCheckboxes.every((checkbox) => checkbox.checked);
  const noneChecked = clientOnlyCheckboxes.every(
    (checkbox) => !checkbox.checked
  );

  selectAllCheckbox.checked = allChecked;
  selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
}

/**
 * Initializes the client dropdown with checkboxes for each client
 * Called when client data is loaded
 */
function initializeClientDropdown(event) {
  // console.log("Initializing client dropdown");
  const optionsListClient = document.getElementById("options-list-client");
  if (!optionsListClient) {
    console.error("Client options list element not found");
    return;
  }

  // Ensure global sets exist
  window.selectedClients_Array = window.selectedClients_Array || new Set();
  window.clientDataStore = window.clientDataStore || {};

  // If event data exists, update clientDataStore
  if (event && event.detail && event.detail.dataStore) {
    window.clientDataStore = event.detail.dataStore;
  }

  // Clear existing content
  optionsListClient.innerHTML = "";

  // Create "Select All" checkbox
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
  selectAllInput.checked = true; // Check by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-client");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListClient.appendChild(selectAllLabel);

  // Get client names and sort them alphabetically
  const clientNames = Object.keys(window.clientDataStore).sort();

  // Populate clients from clientDataStore
  clientNames.forEach((clientName) => {
    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `client_${clientName}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", clientName);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `client_${clientName}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = clientName;

    // Always check the checkbox by default
    newInput.checked = true;
    window.selectedClients_Array.add(clientName);

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListClient.appendChild(newListItem);

    // Add change event listener
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedClients_Array.add(clientName);
      } else {
        window.selectedClients_Array.delete(clientName);
      }

      // Update select all checkbox state
      updateSelectAllClientCheckboxState();
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const clientCheckboxes = document.querySelectorAll(
      '#options-list-client input[type="checkbox"]'
    );

    clientCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-client") {
        checkbox.checked = isChecked;
        const clientName = checkbox.value;

        if (isChecked) {
          window.selectedClients_Array.add(clientName);
        } else {
          window.selectedClients_Array.delete(clientName);
        }
      }
    });
  });

  // console.log(`Initialized dropdown with ${clientNames.length} clients`);

  window.hasRunInitialClientDropdownFilter = false;
}

/**
 * Function to handle region selection changes
 * @param {Array} regionArray - Array of region objects
 */
function addUniqueRegionsToOptionsSelectRegionsDropdown(regionArray) {
  const optionsListRegion = document.getElementById("options-list-region");
  if (!optionsListRegion) {
    console.error("Region options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedRegions_Array = window.selectedRegions_Array || new Set();

  // Clear existing content
  optionsListRegion.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-region");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-region");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-region");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListRegion.appendChild(selectAllLabel);

  // Populate all regions by default
  regionArray.forEach((regionObject) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("label");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `region_${regionString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", regionString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `region_${regionString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = regionName;

    // Automatically add all regions to the set and check the inputs
    window.selectedRegions_Array.add(regionString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListRegion.appendChild(newListItem);

    // Event listener to update selectedRegions_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedRegions_Array.add(regionString);
      } else {
        window.selectedRegions_Array.delete(regionString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-region input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-region")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-region input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-region")
        .some((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && someChecked;

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const regionCheckboxes = document.querySelectorAll(
      "#options-list-region input[type='checkbox']"
    );

    regionCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-region") {
        checkbox.checked = isChecked;
        const regionString = checkbox.value;

        if (isChecked) {
          window.selectedRegions_Array.add(regionString);
        } else {
          window.selectedRegions_Array.delete(regionString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Function to handle state selection changes
 * @param {Array} stateArray - Array of state objects
 */
function addUniqueStatesToOptionsSelectStatesDropdown(stateArray) {
  const optionsListState = document.getElementById("options-list-state");
  if (!optionsListState) {
    console.error("State options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedStates_Array = window.selectedStates_Array || new Set();

  // Clear existing content
  optionsListState.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-state");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-state");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-state");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListState.appendChild(selectAllLabel);

  // Populate all states by default
  stateArray.forEach((stateObject) => {
    const stateName = stateObject.arr[0];
    const stateString = stateObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("label");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `state_${stateString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", stateString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `state_${stateString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = stateName;

    // Automatically add all states to the set and check the inputs
    window.selectedStates_Array.add(stateString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListState.appendChild(newListItem);

    // Event listener to update selectedStates_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedStates_Array.add(stateString);
      } else {
        window.selectedStates_Array.delete(stateString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-state input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-state")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-state input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-state")
        .some((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && someChecked;

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const stateCheckboxes = document.querySelectorAll(
      "#options-list-state input[type='checkbox']"
    );

    stateCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-state") {
        checkbox.checked = isChecked;
        const stateString = checkbox.value;

        if (isChecked) {
          window.selectedStates_Array.add(stateString);
        } else {
          window.selectedStates_Array.delete(stateString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Function to handle membership selection changes
 * @param {Array} membershipArray - Array of membership objects
 */
function addUniqueMembershipsToOptionsSelectMembershipsDropdown(
  membershipArray
) {
  // console.log("addUniqueMembershipsToOptionsSelectMembershipsDropdown", {
  //   membershipArray,
  // });

  const optionsListMembership = document.getElementById(
    "options-list-membership"
  );
  if (!optionsListMembership) {
    console.error("Membership options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedMemberships_Array =
    window.selectedMemberships_Array || new Set();

  // Clear existing content
  optionsListMembership.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-membership");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-membership");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-membership");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListMembership.appendChild(selectAllLabel);

  // Populate all memberships by default
  membershipArray.forEach((membershipObject) => {
    const membershipName = membershipObject.arr[0];
    const membershipString = membershipObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `membership_${membershipString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", membershipString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `membership_${membershipString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = membershipName;

    // Automatically add all memberships to the set and check the inputs
    window.selectedMemberships_Array.add(membershipString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListMembership.appendChild(newListItem);

    // Event listener to update selectedMemberships_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedMemberships_Array.add(membershipString);
      } else {
        window.selectedMemberships_Array.delete(membershipString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll(
          "#options-list-membership input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-membership")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll(
          "#options-list-membership input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-membership")
        .some((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && someChecked;

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const membershipCheckboxes = document.querySelectorAll(
      "#options-list-membership input[type='checkbox']"
    );

    membershipCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-membership") {
        checkbox.checked = isChecked;
        const membershipString = checkbox.value;

        if (isChecked) {
          window.selectedMemberships_Array.add(membershipString);
        } else {
          window.selectedMemberships_Array.delete(membershipString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Function to handle type selection changes
 * @param {Array} typeArray - Array of type objects
 */
function addUniqueTypesToOptionsSelectTypesDropdown(typeArray) {
  const optionsListType = document.getElementById("options-list-type");
  if (!optionsListType) {
    console.error("Type options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedTypes_Array = window.selectedTypes_Array || new Set();

  // Clear existing content
  optionsListType.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-type");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-type");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-type");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListType.appendChild(selectAllLabel);

  // Populate all types by default
  typeArray.forEach((typeObject) => {
    const typeName = typeObject.arr[0];
    const typeString = typeObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `type_${typeString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", typeString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `type_${typeString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = typeName;

    // Automatically add all types to the set and check the inputs
    window.selectedTypes_Array.add(typeString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListType.appendChild(newListItem);

    // Event listener to update selectedTypes_Array
    newInput.addEventListener("change", function () {
      // console.log("Type checkbox changed:", typeString, this.checked);

      if (this.checked) {
        window.selectedTypes_Array.add(typeString);
      } else {
        window.selectedTypes_Array.delete(typeString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-type input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-type")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-type input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-type")
        .some((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && someChecked;

      // console.log(
      //   "Types after change:",
      //   Array.from(window.selectedTypes_Array)
      // );

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const typeCheckboxes = document.querySelectorAll(
      "#options-list-type input[type='checkbox']"
    );

    typeCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-type") {
        checkbox.checked = isChecked;
        const typeString = checkbox.value;

        if (isChecked) {
          window.selectedTypes_Array.add(typeString);
        } else {
          window.selectedTypes_Array.delete(typeString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // console.log(
    //   "All types selected:",
    //   isChecked,
    //   "Types:",
    //   Array.from(window.selectedTypes_Array)
    // );

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Function to handle athletic selection changes
 * @param {Array} athleticArray - Array of athletic objects
 */
function addUniqueAthleticsToOptionsSelectAthleticsDropdown(athleticArray) {
  const optionsListAthletic = document.getElementById("options-list-athletic");
  if (!optionsListAthletic) {
    console.error("Athletic options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedAthletics_Array = window.selectedAthletics_Array || new Set();

  // Clear existing content
  optionsListAthletic.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-athletic");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-athletic");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-athletic");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListAthletic.appendChild(selectAllLabel);

  // Populate all athletics by default
  athleticArray.forEach((athleticObject) => {
    const athleticName = athleticObject.arr[0];
    const athleticString = athleticObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `athletic_${athleticString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", athleticString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `athletic_${athleticString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = athleticName;

    // Automatically add all athletics to the set and check the inputs
    window.selectedAthletics_Array.add(athleticString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListAthletic.appendChild(newListItem);

    // Event listener to update selectedAthletics_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedAthletics_Array.add(athleticString);
      } else {
        window.selectedAthletics_Array.delete(athleticString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll(
          "#options-list-athletic input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-athletic")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll(
          "#options-list-athletic input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-athletic")
        .some((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && someChecked;

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const athleticCheckboxes = document.querySelectorAll(
      "#options-list-athletic input[type='checkbox']"
    );

    athleticCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-athletic") {
        checkbox.checked = isChecked;
        const athleticString = checkbox.value;

        if (isChecked) {
          window.selectedAthletics_Array.add(athleticString);
        } else {
          window.selectedAthletics_Array.delete(athleticString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Function to handle seminary selection changes
 * @param {Array} seminaryArray - Array of seminary objects
 */
function addUniqueSeminariesToOptionsSelectSeminariesDropdown(seminaryArray) {
  const optionsListSeminary = document.getElementById("options-list-seminary");
  if (!optionsListSeminary) {
    console.error("Seminary options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedSeminaries_Array =
    window.selectedSeminaries_Array || new Set();

  // Clear existing content
  optionsListSeminary.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-seminary");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-seminary");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-seminary");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListSeminary.appendChild(selectAllLabel);

  // Populate all seminaries by default
  seminaryArray.forEach((seminaryObject) => {
    const seminaryName = seminaryObject.arr[0];
    const seminaryString = seminaryObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `seminary_${seminaryString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", seminaryString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `seminary_${seminaryString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = seminaryName;

    // Automatically add all seminaries to the set and check the inputs
    window.selectedSeminaries_Array.add(seminaryString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListSeminary.appendChild(newListItem);

    // Event listener to update selectedSeminaries_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedSeminaries_Array.add(seminaryString);
      } else {
        window.selectedSeminaries_Array.delete(seminaryString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll(
          "#options-list-seminary input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-seminary")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll(
          "#options-list-seminary input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-seminary")
        .some((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && someChecked;

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const seminaryCheckboxes = document.querySelectorAll(
      "#options-list-seminary input[type='checkbox']"
    );

    seminaryCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-seminary") {
        checkbox.checked = isChecked;
        const seminaryString = checkbox.value;

        if (isChecked) {
          window.selectedSeminaries_Array.add(seminaryString);
        } else {
          window.selectedSeminaries_Array.delete(seminaryString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Function to handle regional selection changes
 * @param {Array} regionalArray - Array of regional objects
 */
function addUniqueRegionalsToOptionsSelectRegionalsDropdown(regionalArray) {
  const optionsListRegional = document.getElementById("options-list-regional");
  if (!optionsListRegional) {
    console.error("Regional options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedRegionals_Array = window.selectedRegionals_Array || new Set();

  // Clear existing content
  optionsListRegional.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-regional");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-regional");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-regional");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListRegional.appendChild(selectAllLabel);

  // Populate all regionals by default
  regionalArray.forEach((regionalObject) => {
    const regionalName = regionalObject.arr[0];
    const regionalString = regionalObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `regional_${regionalString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", regionalString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `regional_${regionalString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = regionalName;

    // Automatically add all regionals to the set and check the inputs
    window.selectedRegionals_Array.add(regionalString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListRegional.appendChild(newListItem);

    // Event listener to update selectedRegionals_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedRegionals_Array.add(regionalString);
      } else {
        window.selectedRegionals_Array.delete(regionalString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll(
          "#options-list-regional input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-regional")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll(
          "#options-list-regional input[type='checkbox']"
        )
      )
        .filter((input) => input.id !== "select-all-checkbox-regional")
        .some((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && someChecked;

      // Trigger filter changed event
      const event = new CustomEvent("filtersChanged");
      document.dispatchEvent(event);
    });
  });

  // "Select All" checkbox behavior
  selectAllInput.addEventListener("change", function () {
    const isChecked = this.checked;
    const regionalCheckboxes = document.querySelectorAll(
      "#options-list-regional input[type='checkbox']"
    );

    regionalCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-regional") {
        checkbox.checked = isChecked;
        const regionalString = checkbox.value;

        if (isChecked) {
          window.selectedRegionals_Array.add(regionalString);
        } else {
          window.selectedRegionals_Array.delete(regionalString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

// Function to format numbers with commas
function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to observe and format input values
function setupNumberFormatting() {
  const inputIds = ["enrollmentMin", "enrollmentMax"];

  // Process each input field
  inputIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    // Format initial value
    if (input.value) {
      const formattedValue = formatNumberWithCommas(input.value);
      const displaySpan = getOrCreateDisplaySpan(input, id);
      displaySpan.textContent = formattedValue;
    }

    // Setup MutationObserver to watch for value changes from slider movement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "value"
        ) {
          const rawValue = input.value;
          const formattedValue = formatNumberWithCommas(rawValue);
          const displaySpan = getOrCreateDisplaySpan(input, id);
          displaySpan.textContent = formattedValue;
        }
      });
    });

    // Start observing the input element for value changes
    observer.observe(input, { attributes: true });

    // Also handle direct input changes
    input.addEventListener("input", function () {
      const rawValue = this.value;
      const formattedValue = formatNumberWithCommas(rawValue);
      const displaySpan = getOrCreateDisplaySpan(this, id);
      displaySpan.textContent = formattedValue;
    });

    // Handle change event to ensure formattedValue is updated
    input.addEventListener("change", function () {
      const rawValue = this.value;
      const formattedValue = formatNumberWithCommas(rawValue);
      const displaySpan = getOrCreateDisplaySpan(this, id);
      displaySpan.textContent = formattedValue;
    });
  });

  // Also listen for the custom filtersChanged event
  document.addEventListener("filtersChanged", function () {
    inputIds.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      const rawValue = input.value;
      const formattedValue = formatNumberWithCommas(rawValue);
      const displaySpan = getOrCreateDisplaySpan(input, id);
      displaySpan.textContent = formattedValue;
    });
  });
}

// Helper function to get or create display span
function getOrCreateDisplaySpan(inputElement, inputId) {
  // Check if we already have a display span
  let displaySpan = document.querySelector(`[data-format-for="${inputId}"]`);

  // If not, create one and position it appropriately
  if (!displaySpan) {
    displaySpan = document.createElement("span");
    displaySpan.setAttribute("data-format-for", inputId);
    displaySpan.className = "formatted-value ml-2";

    // Style the display span
    displaySpan.style.position = "absolute";
    displaySpan.style.zIndex = "10";
    displaySpan.style.background = "transparent";
    displaySpan.style.pointerEvents = "none"; // Don't interfere with input

    // Hide the actual input value visually (keep it for functionality)
    inputElement.style.color = "transparent";

    // Position the display span over the input
    const rect = inputElement.getBoundingClientRect();

    // Create a wrapper if the input doesn't have one
    let wrapper = inputElement.parentElement;
    if (!wrapper.classList.contains("input-wrapper")) {
      wrapper = document.createElement("div");
      wrapper.className = "input-wrapper relative";
      wrapper.style.position = "relative";
      inputElement.parentNode.insertBefore(wrapper, inputElement);
      wrapper.appendChild(inputElement);
    }

    // Add the span after the input in the same wrapper
    wrapper.appendChild(displaySpan);

    // Adjust positioning to overlay the input
    displaySpan.style.left = "8px"; // Padding
    displaySpan.style.top = "50%";
    displaySpan.style.transform = "translateY(-50%)";
  }

  return displaySpan;
}

// Add event listeners for key events
document.addEventListener("filtersChanged", updateClientDropdownFilters);
document.addEventListener("clientDataLoaded", initializeClientDropdown);

// Listen for custom slider events
document.addEventListener("sliderChanged", function(event) {
  const { value, type } = event.detail;
  const input = document.getElementById(type === "min" ? "enrollmentMin" : "enrollmentMax");
  if (input && input.value != value) {
    input.value = value;
    
    // Also update the formatted display if it exists
    const displaySpan = document.querySelector(`[data-format-for="${input.id}"]`);
    if (displaySpan) {
      displaySpan.textContent = formatNumberWithCommas(value);
    }
  }
});

// Main initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // console.log("DOM loaded, initializing Header.js functionality");

  // Initialize Sets with all available values
  if (typeof regions_Array !== "undefined") {
    window.selectedRegions_Array = new Set(
      regions_Array.map((region) => region.str)
    );
  }

  if (typeof states_Array !== "undefined") {
    window.selectedStates_Array = new Set(
      states_Array.map((state) => state.str)
    );
  }

  if (typeof memberships_Array !== "undefined") {
    window.selectedMemberships_Array = new Set(
      memberships_Array.map((membership) => membership.str)
    );
  }

  if (typeof types_Array !== "undefined") {
    window.selectedTypes_Array = new Set(types_Array.map((type) => type.str));
  }

  if (typeof athletics_Array !== "undefined") {
    window.selectedAthletics_Array = new Set(
      athletics_Array.map((athletic) => athletic.str)
    );
  }

  if (typeof seminaries_Array !== "undefined") {
    window.selectedSeminaries_Array = new Set(
      seminaries_Array.map((seminary) => seminary.str)
    );
  }

  if (typeof regionals_Array !== "undefined") {
    window.selectedRegionals_Array = new Set(
      regionals_Array.map((regional) => regional.str)
    );
  }

  // Configure slider inputs
  const sliderInputs = [
    {
      element: document.getElementById("enrollmentMin"),
      globalVar: "sliderValue",
      defaultValue: 0,
      sliderDivs: document.querySelectorAll(".enrollmentSlider"),
    },
    {
      element: document.getElementById("enrollmentMax"),
      globalVar: "sliderValue2",
      defaultValue: 16000,
      sliderDivs: document.querySelectorAll(".enrollmentSlider"),
    },
  ];

  // Set initial values to inputs
  sliderInputs.forEach(slider => {
    if (slider.element) {
      slider.element.value = window[slider.globalVar];
    }
  });

  // Function to trigger filter change event
  function triggerFiltersChanged(sliderInfo) {
    // console.log(
    //   `${sliderInfo.globalVar} changed to ${window[sliderInfo.globalVar]}`
    // );
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  }

  // Set up each slider
  sliderInputs.forEach((slider) => {
    if (slider.element) {
      // Set up MutationObserver to detect style changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            // Update global variable from the input element
            window[slider.globalVar] =
              parseInt(slider.element.value) || slider.defaultValue;
            triggerFiltersChanged(slider);
          }
        });
      });

      // Configure the observer
      observer.observe(slider.element, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  });

  // Initialize all dropdowns
  const dropdownConfigs = [
    { selectId: "custom-select-year", optionsId: "options-list-year" },
    { selectId: "custom-select-region", optionsId: "options-list-region" },
    { selectId: "custom-select-state", optionsId: "options-list-state" },
    {
      selectId: "custom-select-membership",
      optionsId: "options-list-membership",
    },
    { selectId: "custom-select-type", optionsId: "options-list-type" },
    { selectId: "custom-select-athletic", optionsId: "options-list-athletic" },
    { selectId: "custom-select-seminary", optionsId: "options-list-seminary" },
    { selectId: "custom-select-regional", optionsId: "options-list-regional" },
    { selectId: "custom-select-client", optionsId: "options-list-client" },
  ];

  dropdownConfigs.forEach((config) => {
    setupDropdownToggle(config.selectId, config.optionsId);
  });

  // Initialize filters for area and type checkboxes
  function initializeFilterTriggers() {
    // Set up event listeners for area and type filter checkboxes
    [
      "region",
      "state",
      "membership",
      "type",
      "athletic",
      "seminary",
      "regional",
    ].forEach((type) => {
      const checkboxes = document.querySelectorAll(
        `#options-list-${type} input[type='checkbox']`
      );

      checkboxes.forEach((checkbox) => {
        // Add change event listener that triggers filter update
        checkbox.addEventListener("change", () => {
          // For select-all checkbox, need special handling
          if (checkbox.id === `select-all-checkbox-${type}`) {
            const isChecked = checkbox.checked;
            const targetArray =
              type === "region"
                ? window.selectedRegions_Array
                : type === "state"
                ? window.selectedStates_Array
                : type === "membership"
                ? window.selectedMemberships_Array
                : type === "type"
                ? window.selectedTypes_Array
                : type === "athletic"
                ? window.selectedAthletics_Array
                : type === "seminary"
                ? window.selectedSeminaries_Array
                : window.selectedRegionals_Array;

            // Clear existing selections
            targetArray.clear();

            if (isChecked) {
              // Add all values if checked
              document
                .querySelectorAll(
                  `#options-list-${type} input[type='checkbox']:not(#select-all-checkbox-${type})`
                )
                .forEach((cb) => {
                  targetArray.add(cb.value);
                });
            }
          }

          // Log change and trigger filter update
          // console.log(
          //   `${type} selection changed:`,
          //   checkbox.value,
          //   checkbox.checked
          // );
          const event = new CustomEvent("filtersChanged");
          document.dispatchEvent(event);
        });
      });
    });

    // Set up sliders with current values
    const sliders = [
      document.getElementById("enrollmentMin"),
      document.getElementById("enrollmentMax"),
    ];

    sliders.forEach((slider) => {
      if (slider) {
        // Set initial slider values to match global variables
        slider.value = parseInt(
          slider.id === "givingUnitsMin"
            ? window.sliderValue
            : slider.id === "givingUnitsMax"
            ? window.sliderValue2
            : slider.id === "missionUnitsMin"
            ? window.missionValue
            : slider.id === "missionUnitsMax"
            ? window.missionValue2
            : slider.id === "assetsMin"
            ? window.assetsValue
            : slider.id === "assetsMax"
            ? window.assetsValue2
            : slider.id === "revenueMin"
            ? window.revenueValue
            : window.revenueValue2
        );
        slider.addEventListener("input", () => {
          // Update corresponding value
          if (slider.id === "givingUnitsMin") {
            window.sliderValue = parseInt(slider.value);
          } else if (slider.id === "givingUnitsMax") {
            window.sliderValue2 = parseInt(slider.value);
          } else if (slider.id === "missionUnitsMin") {
            window.missionValue = parseInt(slider.value);
          } else if (slider.id === "missionUnitsMax") {
            window.missionValue2 = parseInt(slider.value);
          } else if (slider.id === "assetsMin") {
            window.assetsValue = parseInt(slider.value);
          } else if (slider.id === "assetsMax") {
            window.assetsValue2 = parseInt(slider.value);
          } else if (slider.id === "revenueMin") {
            window.revenueValue = parseInt(slider.value);
          } else if (slider.id === "revenueMax") {
            window.revenueValue2 = parseInt(slider.value);
          }

          // Trigger the filtersChanged event
          const event = new CustomEvent("filtersChanged");
          document.dispatchEvent(event);
        });
      }
    });
  }

  // Initialize all filter triggers
  initializeFilterTriggers();

  document.addEventListener("filtersChanged", function () {
    setTimeout(setupNumberFormatting, 500);
    // console.log("Filter State Updated:", {
    //   sliders: {
    //     enrollmentMin: window.sliderValue,
    //     enrollmentMax: window.sliderValue2,
    //   },
    //   regions: Array.from(window.selectedRegions_Array || []),
    //   states: Array.from(window.selectedStates_Array || []),
    //   memberships: Array.from(window.selectedMemberships_Array || []),
    //   types: Array.from(window.selectedTypes_Array || []),
    //   athletics: Array.from(window.selectedAthletics_Array || []),
    //   seminaries: Array.from(window.selectedSeminaries_Array || []),
    //   regionals: Array.from(window.selectedRegionals_Array || []),
    //   clients: {
    //     count: window.selectedClients_Array
    //       ? window.selectedClients_Array.size
    //       : 0,
    //   },
    // });
  });

  // Initialize areas dropdown with the provided array
  // if (typeof areas_Array !== "undefined") {
  //   addUniqueAreasToOptionsSelectAreasDropdown(areas_Array);
  // }

  // Export the filter update function to global scope so Utility.js can use it
  window.headerUpdateClientDropdown = updateClientDropdownFilters;
  // console.log("Header.js filter function exported as headerUpdateClientDropdown");
  
  // Explicitly set enrollment input values
  const enrollmentMin = document.getElementById('enrollmentMin');
  const enrollmentMax = document.getElementById('enrollmentMax');
  if (enrollmentMin) enrollmentMin.value = window.sliderValue;
  if (enrollmentMax) enrollmentMax.value = window.sliderValue2;
});
