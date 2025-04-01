// At the top of Header.js - initialize global Sets if they don't exist
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedTypes_Array = window.selectedTypes_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();

window.sliderValue = 0;
window.sliderValue2 = 25000;
window.missionValue = 0;
window.missionValue2 = 10000;

// Centralized dropdown toggle function
function setupDropdownToggle(selectElementId, optionsListId) {
  const selectElement = document.getElementById(selectElementId);
  const optionsListElement = document.getElementById(optionsListId);

  if (!selectElement || !optionsListElement) {
    console.warn(
      `Dropdown elements not found: ${selectElementId}, ${optionsListId}`
    );
    return;
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

// Function to check if a client matches the current filters
function clientMatchesFilters(
  clientData, 
  selectedTypes, 
  selectedRegions, 
  minGiving, 
  maxGiving, 
  minMission, 
  maxMission
) {
  // If no client data, return false
  if (!clientData) return false;

  // Check giving units range
  const givingUnitMatch = 
    clientData.givingUnit >= minGiving && 
    clientData.givingUnit <= maxGiving;

  // Check mission units range
  const missionUnitMatch = 
    clientData.missionUnit >= minMission && 
    clientData.missionUnit <= maxMission;

  // Check region match (if any regions selected)
  const regionMatch = 
    selectedRegions.length === 0 || 
    selectedRegions.some(region => clientData.areaQuery.includes(region));

  // Check type match (if any types selected)
  const typeMatch = 
    selectedTypes.length === 0 || 
    selectedTypes.some(type => clientData.typeQuery.includes(type));

  // Return true only if all conditions are met
  return givingUnitMatch && 
         missionUnitMatch && 
         regionMatch && 
         typeMatch;
}

// Function to update client dropdown based on filters
function updateClientDropdownFilters() {
  console.log("Running updateClientDropdownBasedOnFilters");
  
  // Ensure client data store exists
  if (!window.clientDataStore) {
    console.warn('Client data store not initialized');
    return;
  }

  // Get current filter values
  const selectedTypeCodes = Array.from(window.selectedTypes_Array || []);
  const selectedRegionCodes = Array.from(window.selectedRegions_Array || []);
  const minGiving = window.sliderValue || 0;
  const maxGiving = window.sliderValue2 || 25000;
  const minMission = window.missionValue || 0;
  const maxMission = window.missionValue2 || 10000;

  console.log("Filter criteria:", {
    regionCodes: selectedRegionCodes,
    typeCodes: selectedTypeCodes,
    givingRange: [minGiving, maxGiving],
    missionRange: [minMission, maxMission]
  });

  // Map region codes to their full names
  const regionNameMap = {
    "NE": "Europe",
    "MA": "Asia",
    "SO": "Africa", 
    "MW": "South America",
    "PL": "North America",
    "MT": "Australia",
    "Unspecified": "Unspecified"
  };

  // Convert region codes to full names
  const selectedRegionNames = selectedRegionCodes.map(code => regionNameMap[code]).filter(Boolean);
  console.log("Selected region names:", selectedRegionNames);

  // Get all client checkboxes
  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );
  
  // Get the select all checkbox
  const selectAllCheckbox = document.getElementById('select-all-checkbox-client');

  // Special case: if no region codes or type codes selected, deselect all clients
  if (selectedRegionCodes.length === 0 || selectedTypeCodes.length === 0) {
    console.log("No regions or types selected - deselecting all clients");
    window.selectedClients_Array.clear();
    
    clientCheckboxes.forEach(checkbox => {
      if (checkbox.id !== 'select-all-checkbox-client') {
        checkbox.checked = false;
      }
    });
    
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    }
    
    return;
  }

  // Special case: if ALL region codes and ALL type codes are selected, select all clients
  const allRegionsSelected = selectedRegionCodes.length === Object.keys(regionNameMap).length;
  const allTypesSelected = selectedTypeCodes.length === 8; // assuming there are 8 types total
  
  if (allRegionsSelected && allTypesSelected && 
      minGiving === 0 && maxGiving === 25000 && 
      minMission === 0 && maxMission === 10000) {
    console.log("All filters at default values - selecting all clients");
    
    // Select all clients
    clientCheckboxes.forEach(checkbox => {
      if (checkbox.id !== 'select-all-checkbox-client') {
        checkbox.checked = true;
        window.selectedClients_Array.add(checkbox.value);
      }
    });
    
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    }
    
    return;
  }

  // Normal filtering case
  console.log("Filtering clients based on criteria");
  window.selectedClients_Array.clear();
  let matchCount = 0;
  
  // Check each client
  clientCheckboxes.forEach(checkbox => {
    if (checkbox.id === 'select-all-checkbox-client') return;
    
    const clientName = checkbox.value;
    const clientData = window.clientDataStore[clientName];
    
    if (!clientData) {
      console.warn(`No data found for client: ${clientName}`);
      return;
    }

    // Debug log for this client
    console.log(`Checking client ${clientName}:`, {
      givingUnit: clientData.givingUnit,
      missionUnit: clientData.missionUnit,
      areaQuery: clientData.areaQuery,
      typeQuery: clientData.typeQuery
    });

    // Check giving units range
    const givingUnitMatch = 
      clientData.givingUnit >= minGiving && 
      clientData.givingUnit <= maxGiving;

    // Check mission units range
    const missionUnitMatch = 
      clientData.missionUnit >= minMission && 
      clientData.missionUnit <= maxMission;

    // Check if any client area matches any selected region
    const regionMatch = clientData.areaQuery.some(area => 
      selectedRegionNames.includes(area)
    );

    // Check if any client type matches any selected type
    const typeMatch = clientData.typeQuery.some(type => 
      selectedTypeCodes.includes(type)
    );

    // A client matches if it passes all criteria
    const matches = givingUnitMatch && missionUnitMatch && regionMatch && typeMatch;
    
    console.log(`Client ${clientName} match result:`, {
      givingUnitMatch,
      missionUnitMatch,
      regionMatch,
      typeMatch,
      overall: matches
    });

    // Update checkbox and selection array
    checkbox.checked = matches;
    
    if (matches) {
      window.selectedClients_Array.add(clientName);
      matchCount++;
    }
  });

  // Update select all checkbox state
  if (selectAllCheckbox) {
    const totalClientCheckboxes = Array.from(clientCheckboxes).filter(
      checkbox => checkbox.id !== 'select-all-checkbox-client'
    ).length;
    
    const allSelected = matchCount === totalClientCheckboxes && totalClientCheckboxes > 0;
    const noneSelected = matchCount === 0;
    
    selectAllCheckbox.checked = allSelected;
    selectAllCheckbox.indeterminate = !allSelected && !noneSelected;
  }

  console.log(`Filter completed: ${matchCount} clients match current filters`);
  console.log("Updated selectedClients_Array size:", window.selectedClients_Array.size);
}

// Function to update the "select all" checkbox state
function updateSelectAllClientCheckboxState() {
  const selectAllCheckbox = document.getElementById('select-all-checkbox-client');
  if (!selectAllCheckbox) return;

  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );
  const clientOnlyCheckboxes = Array.from(clientCheckboxes).filter(
    checkbox => checkbox.id !== 'select-all-checkbox-client'
  );

  const allChecked = clientOnlyCheckboxes.every(checkbox => checkbox.checked);
  const noneChecked = clientOnlyCheckboxes.every(checkbox => !checkbox.checked);

  selectAllCheckbox.checked = allChecked;
  selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
}

// Enhanced client dropdown initialization
function initializeClientDropdown() {
  const optionsListClient = document.getElementById('options-list-client');
  if (!optionsListClient) {
    console.error('Client options list element not found');
    return;
  }

  // Ensure global sets exist
  window.selectedClients_Array = window.selectedClients_Array || new Set();
  window.clientDataStore = window.clientDataStore || {};

  // Clear existing content
  optionsListClient.innerHTML = '';

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement('label');
  selectAllLabel.setAttribute('for', 'select-all-checkbox-client');
  selectAllLabel.setAttribute(
    'class', 
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement('input');
  selectAllInput.setAttribute('type', 'checkbox');
  selectAllInput.setAttribute('id', 'select-all-checkbox-client');
  selectAllInput.setAttribute(
    'class', 
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );
  selectAllInput.checked = true; // Check by default

  const selectAllSpan = document.createElement('span');
  selectAllSpan.setAttribute('id', 'select-all-text-client');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute('class', 'text-lg font-semibold');

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListClient.appendChild(selectAllLabel);

  // Populate clients from clientDataStore
  Object.keys(window.clientDataStore).forEach(clientName => {
    const newListItem = document.createElement('li');
    newListItem.style.listStyleType = 'none';

    const newDiv = document.createElement('div');
    newDiv.setAttribute(
      'class', 
      'flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600'
    );

    const newInput = document.createElement('input');
    newInput.setAttribute('id', `client_${clientName}`);
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('value', clientName);
    newInput.setAttribute(
      'class', 
      'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `client_${clientName}`);
    newLabel.setAttribute(
      'class', 
      'w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300'
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
    newInput.addEventListener('change', function() {
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
  selectAllInput.addEventListener('change', function() {
    const isChecked = this.checked;
    const clientCheckboxes = document.querySelectorAll(
      '#options-list-client input[type="checkbox"]'
    );

    clientCheckboxes.forEach(checkbox => {
      if (checkbox.id !== 'select-all-checkbox-client') {
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
}

// Add event listener for filters changed
document.addEventListener('filtersChanged', updateClientDropdownFilters);

// Initialize client dropdown when client data is loaded
document.addEventListener('clientDataLoaded', initializeClientDropdown);

document.addEventListener("DOMContentLoaded", function () {
  const sliderInputs = [
    {
      element: document.getElementById("givingUnitsMin"),
      globalVar: "sliderValue",
      defaultValue: 0,
      sliderDivs: document.querySelectorAll(".givingUnitSlider"),
    },
    {
      element: document.getElementById("givingUnitsMax"),
      globalVar: "sliderValue2",
      defaultValue: 25000,
      sliderDivs: document.querySelectorAll(".givingUnitSlider"),
    },
    {
      element: document.getElementById("missionUnitsMin"),
      globalVar: "missionValue",
      defaultValue: 0,
      sliderDivs: document.querySelectorAll(".missionUnitSlider"),
    },
    {
      element: document.getElementById("missionUnitsMax"),
      globalVar: "missionValue2",
      defaultValue: 10000,
      sliderDivs: document.querySelectorAll(".missionUnitSlider"),
    },
  ];

  function triggerFiltersChanged(sliderInfo) {
    console.log(
      `${sliderInfo.globalVar} changed:`,
      window[sliderInfo.globalVar]
    );
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  }

  sliderInputs.forEach((slider) => {
    if (slider.element) {
      // Set initial value
      slider.element.value = window[slider.globalVar];

      // If slider has specific slider divs (for giving units)
      if (slider.sliderDivs && slider.sliderDivs.length) {
        slider.sliderDivs.forEach((sliderDiv) => {
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
          observer.observe(sliderDiv, {
            attributes: true,
            attributeFilter: ["style"],
          });
        });
      }

      // Standard event listeners as a fallback
      slider.element.addEventListener("input", function () {
        window[slider.globalVar] = parseInt(this.value) || slider.defaultValue;
        triggerFiltersChanged(slider);
      });

      slider.element.addEventListener("change", function () {
        window[slider.globalVar] = parseInt(this.value) || slider.defaultValue;
        triggerFiltersChanged(slider);
      });
    }
  });

  // Dropdown configurations
  const dropdownConfigs = [
    { selectId: "custom-select", optionsId: "options-list" },
    { selectId: "custom-select-region", optionsId: "options-list-region" },
    { selectId: "custom-select-type", optionsId: "options-list-type" },
    { selectId: "custom-select-client", optionsId: "options-list-client" },
  ];

  // Set up each dropdown
  dropdownConfigs.forEach((config) => {
    setupDropdownToggle(config.selectId, config.optionsId);
  });

  function initializeFilterTriggers() {
    ["region", "type"].forEach((type) => {
      const checkboxes = document.querySelectorAll(
        `#options-list-${type} input[type='checkbox']`
      );
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          console.log(
            `${type} checkbox changed:`,
            checkbox.value,
            checkbox.checked
          );
          const event = new CustomEvent("filtersChanged");
          document.dispatchEvent(event);
        });
      });
    });

    // Track changes to region selections
    const regionCheckboxes = document.querySelectorAll(
      "#options-list-region input[type='checkbox']"
    );
    regionCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // Trigger the filtersChanged event
        const event = new CustomEvent("filtersChanged");
        document.dispatchEvent(event);
      });
    });

    // Track changes to type selections
    const typeCheckboxes = document.querySelectorAll(
      "#options-list-type input[type='checkbox']"
    );
    typeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // Trigger the filtersChanged event
        const event = new CustomEvent("filtersChanged");
        document.dispatchEvent(event);
      });
    });

    const sliders = [
      document.getElementById("givingUnitsMin"),
      document.getElementById("givingUnitsMax"),
      document.getElementById("missionUnitsMin"),
      document.getElementById("missionUnitsMax"),
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
            : window.missionValue2
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
          }

          // Trigger the filtersChanged event
          const event = new CustomEvent("filtersChanged");
          document.dispatchEvent(event);
        });
      }
    });
  }

  // Call this at the end of the DOMContentLoaded event
  initializeFilterTriggers();

  document.addEventListener("filtersChanged", function () {
    console.log("Global Variables State:", {
      sliderValue: window.sliderValue,
      sliderValue2: window.sliderValue2,
      missionValue: window.missionValue,
      missionValue2: window.missionValue2,
      selectedRegions: {
        set: window.selectedRegions_Array,
        size: window.selectedRegions_Array
          ? window.selectedRegions_Array.size
          : "N/A",
        array: window.selectedRegions_Array
          ? Array.from(window.selectedRegions_Array)
          : [],
      },
      selectedTypes: {
        set: window.selectedTypes_Array,
        size: window.selectedTypes_Array
          ? window.selectedTypes_Array.size
          : "N/A",
        array: window.selectedTypes_Array
          ? Array.from(window.selectedTypes_Array)
          : [],
      },
      selectedClients: {
        set: window.selectedClients_Array,
        size: window.selectedClients_Array
          ? window.selectedClients_Array.size
          : "N/A",
      },
    });
  });
});
