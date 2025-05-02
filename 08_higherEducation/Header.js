// Initialize DOM elements
const customSelectClient = document.querySelector(".custom-select-client");
const optionsListClient = document.getElementById("options-list-client");
const selectAllCheckboxClient = document.getElementById("select-all-checkbox-client");
const selectedOptionsClient = document.getElementById("selected-options-client");

// Initialize global Sets if they don't exist
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedStates_Array = window.selectedStates_Array || new Set();
window.selectedMemberships_Array = window.selectedMemberships_Array || new Set();
window.selectedTypes_Array = window.selectedTypes_Array || new Set();
window.selectedAthletics_Array = window.selectedAthletics_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();
window.selectedSeminaries_Array = window.selectedSeminaries_Array || new Set();
window.selectedRegionals_Array = window.selectedRegionals_Array || new Set();

// Initialize slider default values
window.sliderValue = 0;
window.sliderValue2 = 25000;

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
      { selectId: "custom-select-other", optionsId: "options-list-other" },
      { selectId: "custom-select-type", optionsId: "options-list-type" },
      { selectId: "custom-select-athletic", optionsId: "options-list-athletic" },
      { selectId: "custom-select-seminary", optionsId: "options-list-seminary" },
      { selectId: "custom-select-regional", optionsId: "options-list-regional" },
      { selectId: "custom-select-membership", optionsId: "options-list-membership" },
      { selectId: "custom-select-client", optionsId: "options-list-client" }
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
    
    // If the dropdown is now visible, ensure z-index is set correctly
    if (!optionsListElement.classList.contains("invisible")) {
      // Ensure dropdown has the correct styling
      const isSpecialDropdown = ["custom-select-year", "custom-select-region", "custom-select-state"].includes(selectElement.id);
      const width = selectElement.id === "custom-select-regional" ? "w-66" : "w-60";
      optionsListElement.className = `absolute ${isSpecialDropdown ? 'top-28' : 'top-36'} z-50 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:shadow-lg ${width} overflow-y-auto h-fit max-h-80 text-xl`;
      if (optionsListElement.classList.contains("invisible")) {
        optionsListElement.classList.remove("invisible");
      }
      
      // Set slider container and all its components to a low z-index
      const sliders = document.querySelectorAll('[x-data="range()"]');
      sliders.forEach(slider => {
        // Set the slider container to low z-index
        slider.style.zIndex = "1";
        
        // Also set all slider components to low z-index
        const sliderComponents = slider.querySelectorAll("*");
        sliderComponents.forEach(component => {
          if (component.style) {
            component.style.zIndex = "5";
          }
        });
      });
    }
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
 */
function clientMatchesFilters(
  clientData,
  selectedRegions,
  selectedStates,
  selectedMemberships,
  selectedTypes,
  selectedAthletics,
  selectedSeminaries,
  selectedRegionals,
  minEnrollment,
  maxEnrollment
) {
  if (!clientData) return false;
  
  // Check enrollment range
  const enrollmentMatch =
    clientData.enrollment >= minEnrollment && clientData.enrollment <= maxEnrollment;

  // Check if client has at least one of the selected filters or if no filter is selected
  const regionMatch = selectedRegions.length === 0 || 
    selectedRegions.some(region => clientData.region === region);
  
  const stateMatch = selectedStates.length === 0 || 
    selectedStates.some(state => clientData.state === state);
  
  const membershipMatch = selectedMemberships.length === 0 || 
    (clientData.memberships && selectedMemberships.some(membership => 
      clientData.memberships.includes(membership)));
  
  const typeMatch = selectedTypes.length === 0 || 
    selectedTypes.some(type => clientData.type === type);
  
  const athleticMatch = selectedAthletics.length === 0 || 
    selectedAthletics.some(athletic => clientData.athletic === athletic);
  
  const seminaryMatch = selectedSeminaries.length === 0 || 
    selectedSeminaries.some(seminary => clientData.seminary === seminary);
  
  const regionalMatch = selectedRegionals.length === 0 || 
    selectedRegionals.some(regional => clientData.regional === regional);

  // Client matches only if it passes all criteria
  return enrollmentMatch && regionMatch && stateMatch && membershipMatch && 
         typeMatch && athleticMatch && seminaryMatch && regionalMatch;
}

/**
 * Updates client dropdown based on current filter criteria
 */
function updateClientDropdownFilters() {
  // Ensure client data store exists
  if (!window.clientDataStore) {
    console.warn("Client data store not initialized");
    return;
  }

  // Get current filter values
  const selectedRegions = Array.from(window.selectedRegions_Array || []);
  const selectedStates = Array.from(window.selectedStates_Array || []);
  const selectedMemberships = Array.from(window.selectedMemberships_Array || []);
  const selectedTypes = Array.from(window.selectedTypes_Array || []);
  const selectedAthletics = Array.from(window.selectedAthletics_Array || []);
  const selectedSeminaries = Array.from(window.selectedSeminaries_Array || []);
  const selectedRegionals = Array.from(window.selectedRegionals_Array || []);
  const minEnrollment = window.sliderValue || 0;
  const maxEnrollment = window.sliderValue2 || 25000;

  // Get all client options
  const clientOptions = document.querySelectorAll('#custom-select-client option');

  // Get the select all checkbox
  const selectAllCheckbox = document.getElementById("select-all-checkbox-client");

  // Clear the selected clients array to rebuild from scratch
  window.selectedClients_Array.clear();
  let matchCount = 0;
  let totalClientCount = 0;

  // Process each client option (skip the first placeholder option)
  Array.from(clientOptions).forEach((option, index) => {
    if (index === 0) return; // Skip placeholder option
    
    totalClientCount++;
    const clientName = option.value;
    const clientData = window.clientDataStore[clientName];

    if (!clientData) {
      console.warn(`No data found for client: ${clientName}`);
      option.disabled = true;
      return;
    }

    // Determine if client matches all filter criteria
    const matches = clientMatchesFilters(
      clientData,
      selectedRegions,
      selectedStates,
      selectedMemberships,
      selectedTypes,
      selectedAthletics,
      selectedSeminaries,
      selectedRegionals,
      minEnrollment,
      maxEnrollment
    );

    // Update option and selection array
    option.disabled = !matches;

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
}

/**
 * Updates the state of the "select all" checkbox based on individual client selections
 */
function updateSelectAllClientCheckboxState() {
  const selectAllCheckbox = document.getElementById("select-all-checkbox-client");
  if (!selectAllCheckbox) return;

  const clientOptions = document.querySelectorAll('#custom-select-client option');
  const clientOnlyOptions = Array.from(clientOptions).filter(
    (option, index) => index > 0 && !option.disabled
  );

  const allChecked = clientOnlyOptions.every(option => 
    window.selectedClients_Array.has(option.value)
  );
  
  const noneChecked = clientOnlyOptions.every(option => 
    !window.selectedClients_Array.has(option.value)
  );

  selectAllCheckbox.checked = allChecked;
  selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
}

/**
 * Add unique clients to dropdown
 */
const addUniqueClientsToOptionsSelectClientsDropdown = (sortedUniquePeerClientNames) => {
  const optionsListClient = document.getElementById("options-list-client");
  if (!optionsListClient) {
    console.error("Client options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedClients_Array = window.selectedClients_Array || new Set();
  window.clientDataStore = window.clientDataStore || {};

  // Clear existing content
  optionsListClient.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-client");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-client");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer text-black"
  );
  selectAllInput.checked = true;

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-client");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);
  optionsListClient.appendChild(selectAllLabel);

  // Clear selectedClients_Array before populating
  window.selectedClients_Array.clear();

  // Handle undefined/non-array input
  if (!sortedUniquePeerClientNames || !Array.isArray(sortedUniquePeerClientNames)) {
    console.warn("No client names array provided");
    sortedUniquePeerClientNames = [];
  }

  // Add client options
  sortedUniquePeerClientNames.forEach((clientName) => {
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
      "w-full py-2 ms-2 text-gray-900 rounded dark:text-gray-300 text-sm"
    );
    newLabel.innerText = clientName;

    // Initialize checked state and add to selectedClients_Array
    newInput.checked = true;
    window.selectedClients_Array.add(clientName);

    // Initialize client data store
    window.clientDataStore[clientName] = window.clientDataStore[clientName] || {};

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
    newListItem.appendChild(newDiv);
    optionsListClient.appendChild(newListItem);

    // Add change event listener
    newInput.addEventListener("change", function() {
      if (newInput.checked) {
        window.selectedClients_Array.add(clientName);
      } else {
        window.selectedClients_Array.delete(clientName);
      }

      // Update select all checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-client input[type='checkbox']")
      )
        .filter(input => input.id !== "select-all-checkbox-client")
        .every(input => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && 
        Array.from(document.querySelectorAll("#options-list-client input[type='checkbox']"))
          .filter(input => input.id !== "select-all-checkbox-client")
          .some(input => input.checked);

      triggerFiltersChanged();
    });
  });

  // Add select all change handler
  selectAllInput.addEventListener("change", function() {
    const isChecked = selectAllInput.checked;
    const clientCheckboxes = document.querySelectorAll(
      "#options-list-client input[type='checkbox']"
    );

    clientCheckboxes.forEach(checkbox => {
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

    selectAllInput.indeterminate = false;
    triggerFiltersChanged();
  });

  // Populate client data store
  populateClientDataStore();
}

/**
 * Populate client data store with details needed for filtering
 */
function populateClientDataStore() {
  // Ensure client data store exists
  window.clientDataStore = window.clientDataStore || {};
  
  // Use existing recordPeerHTMLArray to populate client data
  if (window.recordPeerHTMLArray && window.recordPeerHTMLArray.length > 0) {
    window.recordPeerHTMLArray.forEach(recordHTML => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(recordHTML, 'text/html');
      const record = doc.querySelector('record');
      
      if (!record) return;
      
      const clientName = record.querySelector('merged_client_name')?.textContent;
      if (!clientName) return;
      
      // Create client data object if it doesn't exist
      window.clientDataStore[clientName] = window.clientDataStore[clientName] || {};
      
      // Populate with filter values
      window.clientDataStore[clientName].region = record.querySelector('merged_region')?.textContent;
      window.clientDataStore[clientName].state = record.querySelector('merged_state')?.textContent;
      window.clientDataStore[clientName].type = record.querySelector('merged_type')?.textContent;
      window.clientDataStore[clientName].athletic = record.querySelector('merged_athletic')?.textContent;
      window.clientDataStore[clientName].seminary = record.querySelector('merged_seminary')?.textContent;
      window.clientDataStore[clientName].regional = record.querySelector('merged_regional')?.textContent;
      window.clientDataStore[clientName].enrollment = parseInt(record.querySelector('merged_enrollment')?.textContent) || 0;
      
      // Parse memberships field (comma-separated)
      const membershipsStr = record.querySelector('merged_memberships')?.textContent;
      if (membershipsStr) {
        window.clientDataStore[clientName].memberships = membershipsStr.split(',').map(m => m.trim());
      }
    });
  }
}

// Initialize filter triggers
const initializeFilterTriggers = () => {
  const filterElements = [
    document.getElementById('custom-select-year'),
    document.getElementById('custom-select-region'),
    document.getElementById('custom-select-state'),
    document.getElementById('custom-select-type'),
    document.getElementById('custom-select-athletic'),
    document.getElementById('custom-select-seminary'),
    document.getElementById('custom-select-regional'),
    document.getElementById('custom-select-membership'),
    document.getElementById('custom-select-area'),
    document.getElementById('custom-select-client')
  ];

  filterElements.forEach(element => {
    if (element) {
      element.addEventListener('change', () => {
        if (element.id === 'custom-select-region') {
          updateRegionSelection(element);
        } else if (element.id === 'custom-select-state') {
          updateStateSelection(element);
        } else if (element.id === 'custom-select-year') {
          updateYearSelection(element);
        } else if (element.id === 'custom-select-type') {
          updateTypeSelection(element);
        } else if (element.id === 'custom-select-athletic') {
          updateAthleticSelection(element);
        } else if (element.id === 'custom-select-seminary') {
          updateSeminarySelection(element);
        } else if (element.id === 'custom-select-regional') {
          updateRegionalSelection(element);
        } else if (element.id === 'custom-select-membership') {
          updateMembershipSelection(element);
        } else if (element.id === 'custom-select-client') {
          updateClientSelection(element);
        }   

        triggerFiltersChanged();
      });
    }
  });

  // Handle select all checkbox
  const selectAllCheckbox = document.getElementById('select-all-checkbox-client');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      const clientOptions = document.querySelectorAll('#custom-select-client option');
      clientOptions.forEach((option, index) => {
        if (index > 0 && !option.disabled) {
          if (selectAllCheckbox.checked) {
            window.selectedClients_Array.add(option.value);
          } else {
            window.selectedClients_Array.delete(option.value);
          }
        }
      });
      triggerFiltersChanged();
    });
  }
  
};

// Update filter selections
function updateRegionSelection(element) {f
    console.log({element, selectedRegions_Array: window.selectedRegions_Array, selectedOptions: Array.from(element.selectedOptions), isSelected: element.selectedOptions});
    
  window.selectedRegions_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedRegions_Array.add(option.value);
  });
}

function updateStateSelection(element) {
  window.selectedStates_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedStates_Array.add(option.value);
  });
}

function updateMembershipSelection(element) {
  window.selectedMemberships_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedMemberships_Array.add(option.value);
  });
}

function updateTypeSelection(element) {
  window.selectedTypes_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedTypes_Array.add(option.value);
  });
}

function updateAthleticSelection(element) {
  window.selectedAthletics_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedAthletics_Array.add(option.value);
  });
}

function updateSeminarySelection(element) {
  window.selectedSeminaries_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedSeminaries_Array.add(option.value);
  });
}

function updateRegionalSelection(element) {
  window.selectedRegionals_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedRegionals_Array.add(option.value);
  });
}

function updateClientSelection(element) {
  window.selectedClients_Array.clear();
  Array.from(element.selectedOptions).forEach(option => {
    if (option.value) window.selectedClients_Array.add(option.value);
  });
}

const addUniqueYearsToOptionsSelectDropdown = (yearsArray) => {
    // Get the options list element correctly
    const optionsListElement = document.getElementById("options-list");
  
    if (!optionsListElement) {
      console.error("Options list element not found for years dropdown");
      return;
    }
  
    // Clear the selected years on page load
    if (!window.yearSelectionsInitialized) {
      resetSelectedYearsFromLocalStorage();
      selectedYears_Set.clear();
      window.yearSelectionsInitialized = true;
    }
  
    // Initialize selectedYears_Set from local storage if data exists
    const storedYears = getSelectedYearsFromLocalStorage();
  
    if (Array.isArray(storedYears)) {
      selectedYears_Set = new Set(storedYears);
    }
  
    // Clear existing content
    optionsListElement.innerHTML = "";
  
    // Create "Select All" checkbox
    const selectAllLabel = document.createElement("label");
    selectAllLabel.setAttribute("for", "select-all-checkbox-years");
    selectAllLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
    );
  
    const selectAllInput = document.createElement("input");
    selectAllInput.setAttribute("type", "checkbox");
    selectAllInput.setAttribute("id", "select-all-checkbox-years");
    selectAllInput.setAttribute(
      "class",
      "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
    );
    // CHANGE HERE: Set to unchecked by default
    selectAllInput.checked = false;
  
    const selectAllSpan = document.createElement("span");
    selectAllSpan.setAttribute("id", "select-all-text-years");
    selectAllSpan.innerText = "(select all)";
    selectAllSpan.setAttribute("class", "text-lg font-semibold");
  
    selectAllLabel.appendChild(selectAllInput);
    selectAllLabel.appendChild(selectAllSpan);
  
    optionsListElement.appendChild(selectAllLabel);
  
    // Sort years in descending order
    const sortedYears = yearsArray.sort((a, b) => b - a);
  
    // Add year options
    sortedYears.forEach((year) => {
      const newLabel = document.createElement("label");
      newLabel.setAttribute("for", `option-${year}`);
      newLabel.setAttribute(
        "class",
        "flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      );
  
      const newInput = document.createElement("input");
      newInput.setAttribute("type", "checkbox");
      newInput.setAttribute("id", `option-${year}`);
      newInput.setAttribute(
        "class",
        `form-checkbox h-4 w-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-300 dark:border-gray-500 mr-2 cursor-pointer`
      );
      newInput.setAttribute("value", year);
      // Check the input only if the year is in the selectedYears_Set
      newInput.checked = selectedYears_Set.has(year);
  
      newInput.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
  
        if (isChecked) {
          selectedYears_Set.add(year);
        } else {
          selectedYears_Set.delete(year);
        }
  
        // Update "Select All" checkbox state
        const yearCheckboxes = document.querySelectorAll(
          "#options-list input[type='checkbox']"
        );
        const nonSelectAllCheckboxes = Array.from(yearCheckboxes).filter(
          (cb) => cb.id !== "select-all-checkbox-years"
        );
  
        const allChecked = nonSelectAllCheckboxes.every((cb) => cb.checked);
        const noneChecked = nonSelectAllCheckboxes.every((cb) => !cb.checked);
  
        selectAllInput.checked = allChecked;
        selectAllInput.indeterminate = !allChecked && !noneChecked;
  
        // Save to local storage
        const selectedYearsArray = Array.from(selectedYears_Set).sort(
          (a, b) => a - b
        );
        localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
      });
  
      const newSpan = document.createElement("span");
      newSpan.innerText = year;
  
      newLabel.appendChild(newInput);
      newLabel.appendChild(newSpan);
  
      optionsListElement.appendChild(newLabel);
    });
  
    // "Select All" checkbox behavior
    selectAllInput.addEventListener("change", function () {
      const isChecked = selectAllInput.checked;
      const yearCheckboxes = document.querySelectorAll(
        "#options-list input[type='checkbox']"
      );
  
      yearCheckboxes.forEach((checkbox) => {
        if (checkbox.id !== "select-all-checkbox-years") {
          checkbox.checked = isChecked;
          const year = parseInt(checkbox.value);
  
          if (isChecked) {
            selectedYears_Set.add(year);
          } else {
            selectedYears_Set.delete(year);
          }
        }
      });
  
      // Save to local storage
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
    });
  };


// Trigger filters changed event
const triggerFiltersChanged = () => {
  // Update client dropdown based on filter selections
  updateClientDropdownFilters();
  
  // Dispatch the filters changed event
  const event = new CustomEvent('filtersChanged');
  document.dispatchEvent(event);
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Setup dropdown toggles
  const dropdownConfigs = [
    { selectId: "custom-select-year", optionsId: "options-list-year" },
    { selectId: "custom-select-region", optionsId: "options-list-region" },
    { selectId: "custom-select-state", optionsId: "options-list-state" },
    { selectId: "custom-select-type", optionsId: "options-list-type" },
    { selectId: "custom-select-athletic", optionsId: "options-list-athletic" },
    { selectId: "custom-select-seminary", optionsId: "options-list-seminary" },
    { selectId: "custom-select-regional", optionsId: "options-list-regional" },
    { selectId: "custom-select-membership", optionsId: "options-list-membership" }, 
    { selectId: "custom-select-client", optionsId: "options-list-client" }
  ];

  dropdownConfigs.forEach(config => {
    setupDropdownToggle(config.selectId, config.optionsId);
    
    // Update the classes for custom select elements
    const customSelectElement = document.getElementById(config.selectId);
    if (customSelectElement) {
      // Preserve backgroundBlue class if it exists or add Tailwind button styling
      const hasBackgroundBlue = customSelectElement.classList.contains('backgroundBlue');
      
      customSelectElement.className = "text-sm mr-3 font-semibold px-4 py-2 h-10 rounded transition flex items-center justify-between text-white hover:scale-105 hover:shadow-md hover:shadow-blue-300 cursor-pointer";
      
      // Add backgroundBlue class back if it existed
      if (hasBackgroundBlue) {
        customSelectElement.classList.add('backgroundBlue');
      } else {
        // Add equivalent Tailwind blue background if backgroundBlue doesn't exist
        customSelectElement.classList.add('bg-blue-600');
      }
      
      // Ensure it's a button if it's not already
      if (customSelectElement.tagName !== 'BUTTON') {
        customSelectElement.setAttribute('role', 'button');
        customSelectElement.setAttribute('tabindex', '0');
      }
    }
    
    // Update the classes for options list elements
    const optionsListElement = document.getElementById(config.optionsId);
    if (optionsListElement) {
      optionsListElement.className = "absolute z-50 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:shadow-lg w-60 overflow-y-auto h-fit max-h-80 text-xl invisible";
    }
  });
  
  // Make sure the buttons container has proper styling for side-by-side alignment
  const buttonsContainer = document.querySelector('#custom-select-membership')?.closest('div');
  if (buttonsContainer) {
    // Add flex and spacing classes to container
    buttonsContainer.classList.add('flex', 'flex-wrap', 'items-center', 'gap-2', 'p-2');
  }
  
  // Initialize filter triggers
  initializeFilterTriggers();
  
  // Create client data store
  window.clientDataStore = {};
  
  // Make header functions globally available
  window.headerUpdateClientDropdownFilters = updateClientDropdownFilters;
});

/**
 * Add unique regions to the options select dropdown
 * @param {Array} regionsArray - Array of region objects
 */
function addUniqueRegionsToOptionsSelectRegionsDropdown(regionsArray) {
  const optionsListRegion = document.getElementById("options-list-region");
  if (!optionsListRegion) {
    console.error("Region options list element not found");
    return;
  }
  
  // Ensure global sets exist
  window.selectedRegions_Array = window.selectedRegions_Array || new Set();

  // Clear existing content
  optionsListRegion.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-region");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
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
  selectAllSpan.setAttribute("class", "text-lg font-semibold text-black");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListRegion.appendChild(selectAllLabel);

  // If array is not provided or empty, return after creating select all option
  if (!regionsArray || !Array.isArray(regionsArray)) {
    console.warn("No regions array provided to addUniqueRegionsToOptionsSelectRegionsDropdown");
    regionsArray = [];
  }

  // Populate all regions by default
  regionsArray.forEach((regionObject) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;
    const uniqueId = `region-option-${regionString}`;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate text-black"
    );

    const regionInput = document.createElement("input");
    regionInput.setAttribute("type", "checkbox");
    regionInput.setAttribute("id", uniqueId);
    regionInput.setAttribute(
      "class",
      "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    regionInput.setAttribute("value", regionString);

    // Add the value to selectedRegions_Array and check the input by default
    window.selectedRegions_Array.add(regionString);
    regionInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = regionName;

    newLabel.appendChild(regionInput);
    newLabel.appendChild(newSpan);

    optionsListRegion.appendChild(newLabel);

    // Add change event listener to update selectedRegions_Array
    regionInput.addEventListener("change", function () {
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
 * Add unique states to the options select dropdown
 * @param {Array} statesArray - Array of state objects
 */
function addUniqueStatesToOptionsSelectStatesDropdown(statesArray) {
  const optionsListState = document.getElementById("options-list-state");
  if (!optionsListState) {
    console.error("State options list element not found");
    return;
  }
  
  // Ensure global sets exist
  window.selectedStates_Array = window.selectedStates_Array || new Set();

  // Clear existing content
  optionsListState.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-state");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
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

  // If array is not provided or empty, return after creating select all option
  if (!statesArray || !Array.isArray(statesArray)) {
    console.warn("No states array provided to addUniqueStatesToOptionsSelectStatesDropdown");
    statesArray = [];
  }

  // Populate all states by default
  statesArray.forEach((stateObject) => {
    const stateName = stateObject.arr[0];
    const stateString = stateObject.str;
    const uniqueId = `state-option-${stateString}`;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate text-black"
    );

    const stateInput = document.createElement("input");
    stateInput.setAttribute("type", "checkbox");
    stateInput.setAttribute("id", uniqueId);
    stateInput.setAttribute(
      "class",
      "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    stateInput.setAttribute("value", stateString);

    // Add the value to selectedStates_Array and check the input by default
    window.selectedStates_Array.add(stateString);
    stateInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = stateName;

    newLabel.appendChild(stateInput);
    newLabel.appendChild(newSpan);

    optionsListState.appendChild(newLabel);

    // Add change event listener to update selectedStates_Array
    stateInput.addEventListener("change", function () {
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
 * Add unique memberships to the options select dropdown
 * @param {Array} membershipsArray - Array of membership objects
 */
function addUniqueMembershipsToOptionsSelectMembershipsDropdown(membershipsArray) {
  const optionsListMembership = document.getElementById("options-list-membership");
  if (!optionsListMembership) {
    console.error("Membership options list element not found");
    return;
  }
  
  // Ensure global sets exist
  window.selectedMemberships_Array = window.selectedMemberships_Array || new Set();

  // Clear existing content
  optionsListMembership.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-membership");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
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

  // If array is not provided or empty, return after creating select all option
  if (!membershipsArray || !Array.isArray(membershipsArray)) {
    console.warn("No memberships array provided to addUniqueMembershipsToOptionsSelectMembershipsDropdown");
    membershipsArray = [];
  }

  // Populate all memberships by default
  membershipsArray.forEach((membershipObject) => {
    const membershipName = membershipObject.arr[0];
    const membershipString = membershipObject.str;
    const uniqueId = `membership-option-${membershipString}`;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate text-black"
    );

    const membershipInput = document.createElement("input");
    membershipInput.setAttribute("type", "checkbox");
    membershipInput.setAttribute("id", uniqueId);
    membershipInput.setAttribute(
      "class",
      "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    membershipInput.setAttribute("value", membershipString);

    // Add the value to selectedMemberships_Array and check the input by default
    window.selectedMemberships_Array.add(membershipString);
    membershipInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = membershipName;

    newLabel.appendChild(membershipInput);
    newLabel.appendChild(newSpan);

    optionsListMembership.appendChild(newLabel);

    // Add change event listener to update selectedMemberships_Array
    membershipInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedMemberships_Array.add(membershipString);
      } else {
        window.selectedMemberships_Array.delete(membershipString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-membership input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-membership")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-membership input[type='checkbox']")
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
 * Add unique types to the options select dropdown
 * @param {Array} typesArray - Array of type objects
 */
function addUniqueTypesToOptionsSelectTypesDropdown(typesArray) {
  const optionsListType = document.getElementById("options-list-type");
  if (!optionsListType) {
    console.error("Type options list element not found");
    return;
  }
  
  // Ensure global sets exist
  window.selectedTypes_Array = window.selectedTypes_Array || new Set();

  // Clear existing content
  optionsListType.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-type");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
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

  // If array is not provided or empty, return after creating select all option
  if (!typesArray || !Array.isArray(typesArray)) {
    console.warn("No types array provided to addUniqueTypesToOptionsSelectTypesDropdown");
    typesArray = [];
  }

  // Populate all types by default
  typesArray.forEach((typeObject) => {
    const typeName = typeObject.arr[0];
    const typeString = typeObject.str;
    const uniqueId = `type-option-${typeString}`;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const typeInput = document.createElement("input");
    typeInput.setAttribute("id", `type_${typeString}`);
    typeInput.setAttribute("type", "checkbox");
    typeInput.setAttribute("value", typeString);
    typeInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `type_${typeString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = typeName;

    // Add the value to selectedTypes_Array and check the input by default
    window.selectedTypes_Array.add(typeString);
    typeInput.checked = true;

    newDiv.appendChild(typeInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListType.appendChild(newListItem);

    // Add change event listener to update selectedTypes_Array
    typeInput.addEventListener("change", function () {
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

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Add unique athletics options to the dropdown
 * @param {Array} athleticsArray - Array of athletics objects
 */
function addUniqueAthleticsToOptionsSelectAthleticsDropdown(athleticsArray) {
  const optionsListAthletic = document.getElementById("options-list-athletic");
  if (!optionsListAthletic) {
    console.error("Athletic options list element not found");
    return;
  }
  
  // Ensure global sets exist
  window.selectedAthletics_Array = window.selectedAthletics_Array || new Set();

  // Clear existing content
  optionsListAthletic.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-athletic");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
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

  // If array is not provided or empty, return after creating select all option
  if (!athleticsArray || !Array.isArray(athleticsArray)) {
    console.warn("No athletics array provided to addUniqueAthleticsToOptionsSelectAthleticsDropdown");
    athleticsArray = [];
  }

  // Populate all athletics by default
  athleticsArray.forEach((athleticObject) => {
    const athleticName = athleticObject.arr[0];
    const athleticString = athleticObject.str;
    const uniqueId = `athletic-option-${athleticString}`;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate text-black"
    );

    const athleticInput = document.createElement("input");
    athleticInput.setAttribute("type", "checkbox");
    athleticInput.setAttribute("id", uniqueId);
    athleticInput.setAttribute(
      "class",
      "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    athleticInput.setAttribute("value", athleticString);

    // Add the value to selectedAthletics_Array and check the input by default
    window.selectedAthletics_Array.add(athleticString);
    athleticInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = athleticName;

    newLabel.appendChild(athleticInput);
    newLabel.appendChild(newSpan);

    optionsListAthletic.appendChild(newLabel);

    // Add change event listener to update selectedAthletics_Array
    athleticInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedAthletics_Array.add(athleticString);
      } else {
        window.selectedAthletics_Array.delete(athleticString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-athletic input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-athletic")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-athletic input[type='checkbox']")
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
 * Add unique regionals to the options select dropdown
 * @param {Array} regionalsArray - Array of regional objects
 */
function addUniqueRegionalsToOptionsSelectRegionalsDropdown(regionalsArray) {
  const optionsListRegional = document.getElementById("options-list-regional");
  if (!optionsListRegional) {
    console.error("Regional options list element not found");
    return;
  }
  
  // Ensure global sets exist
  window.selectedRegionals_Array = window.selectedRegionals_Array || new Set();

  // Clear existing content
  optionsListRegional.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-regional");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
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
  selectAllSpan.setAttribute("class", "text-lg font-semibold text-black");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListRegional.appendChild(selectAllLabel);

  // If array is not provided or empty, return after creating select all option
  if (!regionalsArray || !Array.isArray(regionalsArray)) {
    console.warn("No regionals array provided to addUniqueRegionalsToOptionsSelectRegionalsDropdown");
    regionalsArray = [];
  }

  // Clear selectedRegionals_Array before populating
  window.selectedRegionals_Array.clear();

  // Populate all regionals by default
  regionalsArray.forEach((regionalObject) => {
    const regionalName = regionalObject.arr[0];
    const regionalString = regionalObject.str;
    
    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class", 
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const regionalInput = document.createElement("input");
    regionalInput.setAttribute("id", `regional_${regionalString}`);
    regionalInput.setAttribute("type", "checkbox");
    regionalInput.setAttribute("value", regionalString);
    regionalInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `regional_${regionalString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = regionalName;

    // Add the value to selectedRegionals_Array and check the input by default
    window.selectedRegionals_Array.add(regionalString);
    regionalInput.checked = true;

    newDiv.appendChild(regionalInput);
    newDiv.appendChild(newLabel);
    newListItem.appendChild(newDiv);
    optionsListRegional.appendChild(newListItem);

    // Add change event listener to update selectedRegionals_Array
    regionalInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedRegionals_Array.add(regionalString);
      } else {
        window.selectedRegionals_Array.delete(regionalString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-regional input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-regional")
        .every((input) => input.checked);

      selectAllInput.checked = allChecked;
      selectAllInput.indeterminate = !allChecked && 
        Array.from(document.querySelectorAll("#options-list-regional input[type='checkbox']"))
          .filter(input => input.id !== "select-all-checkbox-regional")
          .some(input => input.checked);

      triggerFiltersChanged();
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
    triggerFiltersChanged();
  });
}

/**
 * Add unique seminaries to the options select dropdown
 * @param {Array} seminariesArray - Array of seminary objects
 */
function addUniqueSeminariesToOptionsSelectSeminariesDropdown(seminariesArray) {
  const optionsListSeminary = document.getElementById("options-list-seminary");
  if (!optionsListSeminary) {
    console.error("Seminary options list element not found");
    return;
  }
  
  // Ensure global sets exist
  window.selectedSeminaries_Array = window.selectedSeminaries_Array || new Set();

  // Clear existing content
  optionsListSeminary.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-seminary");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate text-black"
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

  // If array is not provided or empty, return after creating select all option
  if (!seminariesArray || !Array.isArray(seminariesArray)) {
    console.warn("No seminaries array provided to addUniqueSeminariesToOptionsSelectSeminariesDropdown");
    seminariesArray = [];
  }

  // Populate all seminaries by default
  seminariesArray.forEach((seminaryObject) => {
    const seminaryName = seminaryObject.arr[0];
    const seminaryString = seminaryObject.str;
    const uniqueId = `seminary-option-${seminaryString}`;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate text-black text-black"
    );

    const seminaryInput = document.createElement("input");
    seminaryInput.setAttribute("type", "checkbox");
    seminaryInput.setAttribute("id", uniqueId);
    seminaryInput.setAttribute(
      "class",
      "w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    seminaryInput.setAttribute("value", seminaryString);

    // Add the value to selectedSeminaries_Array and check the input by default
    window.selectedSeminaries_Array.add(seminaryString);
    seminaryInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = seminaryName;

    newLabel.appendChild(seminaryInput);
    newLabel.appendChild(newSpan);

    optionsListSeminary.appendChild(newLabel);

    // Add change event listener to update selectedSeminaries_Array
    seminaryInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedSeminaries_Array.add(seminaryString);
      } else {
        window.selectedSeminaries_Array.delete(seminaryString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-seminary input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-seminary")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-seminary input[type='checkbox']")
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