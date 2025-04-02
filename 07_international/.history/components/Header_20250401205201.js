// At the top of Header.js - initialize global Sets if they don't exist
window.selectedAreas_Array = window.selectedAreas_Array || new Set();
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

  // Function to close all other dropdowns
  function closeOtherDropdowns(currentOptionsListId) {
    const dropdownConfigs = [
      { selectId: "custom-select", optionsId: "options-list" },
      { selectId: "custom-select-area", optionsId: "options-list-area" },
      { selectId: "custom-select-type", optionsId: "options-list-type" },
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

// Function to check if a client matches the current filters
function clientMatchesFilters(
  clientData,
  selectedTypes,
  selectedAreas,
  minGiving,
  maxGiving,
  minMission,
  maxMission
) {
  // If no client data, return false
  if (!clientData) return false;
  
  // *** THE KEY CHANGE: If no types or areas selected, return false immediately ***
  if (selectedTypes.length === 0 || selectedAreas.length === 0) {
    return false;
  }

  // Check giving units range
  const givingUnitMatch =
    clientData.givingUnit >= minGiving && clientData.givingUnit <= maxGiving;

  // Check mission units range
  const missionUnitMatch =
    clientData.missionUnit >= minMission &&
    clientData.missionUnit <= maxMission;

  // Check area match - modified to remove the empty array case
  const areaMatch =
    clientData.areaQuery && 
    Array.isArray(clientData.areaQuery) && 
    selectedAreas.some(area => clientData.areaQuery.includes(area));

  // Check type match - modified to remove the empty array case
  const typeMatch =
    clientData.typeQuery && 
    Array.isArray(clientData.typeQuery) && 
    selectedTypes.some(type => clientData.typeQuery.includes(type));

  // Return true only if all conditions are met
  return givingUnitMatch && missionUnitMatch && areaMatch && typeMatch;
}

// Function to update client dropdown based on filters - enhanced version
function updateClientDropdownBasedOnFilters() {
  // Ensure client data store exists
  if (!window.clientDataStore) {
    console.warn("Client data store not initialized");
    return;
  }

  // Get current filter values - convert Sets to Arrays
  const selectedTypes = Array.from(window.selectedTypes_Array || []);
  const selectedAreas = Array.from(window.selectedAreas_Array || []);
  const minGiving = window.sliderValue || 0;
  const maxGiving = window.sliderValue2 || 25000;
  const minMission = window.missionValue || 0;
  const maxMission = window.missionValue2 || 10000;

  // Log what filters we're currently using
  console.log("Applying filters:", {
    types: selectedTypes,
    areas: selectedAreas,
    giving: [minGiving, maxGiving],
    mission: [minMission, maxMission],
  });

  // *** THE KEY CHANGE: If no types or areas selected, clear all selections ***
  if (selectedTypes.length === 0 || selectedAreas.length === 0) {
    console.log("No types or areas selected - clearing all client selections");

    // Clear the global selection set
    window.selectedClients_Array.clear();

    // Uncheck all client checkboxes (except the "select all" checkbox)
    const clientCheckboxes = document.querySelectorAll(
      '#options-list-client input[type="checkbox"]'
    );
    clientCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-client") {
        checkbox.checked = false;
      }
    });

    // Update "Select All" checkbox state
    updateSelectAllClientCheckboxState();
    return;
  }

  // Count matches for debugging
  let matchedCount = 0;
  let totalClients = Object.keys(window.clientDataStore).length;

  // Get all client checkboxes
  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );

  // Skip the first one (select all)
  for (let i = 1; i < clientCheckboxes.length; i++) {
    const checkbox = clientCheckboxes[i];
    const clientName = checkbox.value;
    const clientData = window.clientDataStore[clientName];

    if (!clientData) {
      console.warn(`No data found for client: ${clientName}`);
      continue;
    }

    // Check each filter individually for better debugging
    const givingMatch =
      clientData.givingUnit >= minGiving && clientData.givingUnit <= maxGiving;
    const missionMatch =
      clientData.missionUnit >= minMission &&
      clientData.missionUnit <= maxMission;

    // Check for area match - handle empty array case
    const areaMatch =
      selectedAreas.length === 0 ||
      (clientData.areaQuery &&
        Array.isArray(clientData.areaQuery) &&
        selectedAreas.some((area) => clientData.areaQuery.includes(area)));

    // Check for type match - handle empty array case
    const typeMatch =
      selectedTypes.length === 0 ||
      (clientData.typeQuery &&
        Array.isArray(clientData.typeQuery) &&
        selectedTypes.some((type) => clientData.typeQuery.includes(type)));

    // Combined match result
    const matches = givingMatch && missionMatch && areaMatch && typeMatch;

    if (matches) matchedCount++;

    // Only update if checkbox state would change
    if (checkbox.checked !== matches) {
      checkbox.checked = matches;

      // Update the selected clients array
      if (matches) {
        window.selectedClients_Array.add(clientName);
      } else {
        window.selectedClients_Array.delete(clientName);
      }
    }
  }

  console.log(
    `Filter results: ${matchedCount}/${totalClients} clients matched`
  );

  // Update select all checkbox state
  updateSelectAllClientCheckboxState();
}

// Function to trigger filters changed event with proper timing
function triggerFiltersChanged() {
  console.log("Triggering filtersChanged event");
  // Use a setTimeout to ensure event fires after DOM updates
  setTimeout(() => {
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  }, 0);
}

// Function to update the "select all" checkbox state
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

// Enhanced client dropdown initialization
function initializeClientDropdown() {
  const optionsListClient = document.getElementById("options-list-client");
  if (!optionsListClient) {
    console.error("Client options list element not found");
    return;
  }

  // Ensure global sets exist
  window.selectedClients_Array = window.selectedClients_Array || new Set();
  window.clientDataStore = window.clientDataStore || {};

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

  // Populate clients from clientDataStore
  const clientNames = Object.keys(window.clientDataStore);
  console.log(`Populating client dropdown with ${clientNames.length} clients`);

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
      "w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
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
}

// Add event listener for filters changed
document.addEventListener("filtersChanged", updateClientDropdownBasedOnFilters);

// Initialize client dropdown when client data is loaded
document.addEventListener("clientDataLoaded", function (event) {
  console.log(
    "Client data loaded event received",
    event.detail
      ? `with ${event.detail.clients ? event.detail.clients.length : 0} clients`
      : "without client details"
  );
  initializeClientDropdown();
  // Apply initial filters after dropdown is populated
  setTimeout(updateClientDropdownBasedOnFilters, 100);
});

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

  function handleSliderChange(sliderInfo) {
    window[sliderInfo.globalVar] =
      parseInt(sliderInfo.element.value) || sliderInfo.defaultValue;
    console.log(
      `${sliderInfo.globalVar} changed to:`,
      window[sliderInfo.globalVar]
    );
    triggerFiltersChanged();
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
                handleSliderChange(slider);
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
        handleSliderChange(slider);
      });

      slider.element.addEventListener("change", function () {
        handleSliderChange(slider);
      });
    }
  });

  // Dropdown configurations
  const dropdownConfigs = [
    { selectId: "custom-select", optionsId: "options-list" },
    { selectId: "custom-select-area", optionsId: "options-list-area" },
    { selectId: "custom-select-type", optionsId: "options-list-type" },
    { selectId: "custom-select-client", optionsId: "options-list-client" },
  ];

  // Set up each dropdown
  dropdownConfigs.forEach((config) => {
    setupDropdownToggle(config.selectId, config.optionsId);
  });

  function initializeFilterTriggers() {
    // Track changes to area selections
    const areaCheckboxes = document.querySelectorAll(
      "#options-list-area input[type='checkbox']"
    );
    areaCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const areaValue = this.value;
        if (this.checked) {
          window.selectedAreas_Array.add(areaValue);
        } else {
          window.selectedAreas_Array.delete(areaValue);
        }
        console.log(
          `Area ${areaValue} ${this.checked ? "selected" : "deselected"}`
        );
        triggerFiltersChanged();
      });
    });

    // Track changes to type selections
    const typeCheckboxes = document.querySelectorAll(
      "#options-list-type input[type='checkbox']"
    );
    typeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const typeValue = this.value;
        if (this.checked) {
          window.selectedTypes_Array.add(typeValue);
        } else {
          window.selectedTypes_Array.delete(typeValue);
        }
        console.log(
          `Type ${typeValue} ${this.checked ? "selected" : "deselected"}`
        );
        triggerFiltersChanged();
      });
    });

    // Handle "Select All" checkboxes separately
    const selectAllArea = document.getElementById("select-all-checkbox");
    if (selectAllArea) {
      selectAllArea.addEventListener("change", function () {
        const isChecked = this.checked;
        areaCheckboxes.forEach((checkbox) => {
          if (checkbox.id !== "select-all-checkbox") {
            checkbox.checked = isChecked;
            const areaValue = checkbox.value;
            if (isChecked) {
              window.selectedAreas_Array.add(areaValue);
            } else {
              window.selectedAreas_Array.delete(areaValue);
            }
          }
        });
        console.log(`All areas ${isChecked ? "selected" : "deselected"}`);
        triggerFiltersChanged();
      });
    }

    const selectAllType = document.getElementById("select-all-checkbox-type");
    if (selectAllType) {
      selectAllType.addEventListener("change", function () {
        const isChecked = this.checked;
        typeCheckboxes.forEach((checkbox) => {
          if (checkbox.id !== "select-all-checkbox-type") {
            checkbox.checked = isChecked;
            const typeValue = checkbox.value;
            if (isChecked) {
              window.selectedTypes_Array.add(typeValue);
            } else {
              window.selectedTypes_Array.delete(typeValue);
            }
          }
        });
        console.log(`All types ${isChecked ? "selected" : "deselected"}`);
        triggerFiltersChanged();
      });
    }
  }

  // Call this at the end of the DOMContentLoaded event
  initializeFilterTriggers();

  // Log filter state when changes occur
 
});
