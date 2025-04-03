// HEADER.js

// Initialize global Sets if they don't exist
window.selectedAreas_Array = window.selectedAreas_Array || new Set();
window.selectedTypes_Array = window.selectedTypes_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();

// Initialize slider default values
window.sliderValue = 0;
window.sliderValue2 = 25000;
window.missionValue = 0;
window.missionValue2 = 10000;

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

/**
 * Checks if a client matches the current filter criteria
 * Critical function that determines whether a client should be selected
 */
function clientMatchesFilters(
  clientData,
  selectedTypes,
  selectedAreas,
  minGiving,
  maxGiving,
  minMission,
  maxMission
) {
  if (!clientData) return false;
  

  // Check giving unit range
  const givingUnitMatch =
    clientData.givingUnit >= minGiving && clientData.givingUnit <= maxGiving;

  // Check mission unit range
  const missionUnitMatch =
    clientData.missionUnit >= minMission &&
    clientData.missionUnit <= maxMission;

 if (selectedAreas.length === 0 || selectedTypes.length === 0) {
    console.log("No areas or types selected, returning false");
    return false;
  }

  // Check if client has at least one of the selected areas, handle missing areaQuery
  const areaMatch = clientData.areaQuery ? 
    clientData.areaQuery.some((area) => selectedAreas.includes(area)) : 
    false;

  // Check if client has at least one of the selected types, handle missing typeQuery
  const typeMatch = clientData.typeQuery ? 
    clientData.typeQuery.some((type) => selectedTypes.includes(type)) : 
    true; // Set to true if typeQuery is missing to avoid breaking functionality

  // Client matches only if it passes all criteria
  return givingUnitMatch && missionUnitMatch && areaMatch && typeMatch;
}

/**
 * Updates client dropdown checkboxes based on current filter criteria
 * Acts as the primary filter implementation that Utility.js will defer to
 */
function updateClientDropdownFilters() {
  // console.log("Running client dropdown filter update");

  // Ensure client data store exists
  if (!window.clientDataStore) {
    console.warn("Client data store not initialized");
    return;
  }

  // Get current filter values
  const selectedTypes = Array.from(window.selectedTypes_Array || []);
  const selectedAreas = Array.from(window.selectedAreas_Array || []);
  const minGiving = window.sliderValue || 0;
  const maxGiving = window.sliderValue2 || 25000;
  const minMission = window.missionValue || 0;
  const maxMission = window.missionValue2 || 10000;

  // console.log("Current filter criteria:", {
  //   areas: selectedAreas,
  //   types: selectedTypes,
  //   givingRange: [minGiving, maxGiving],
  //   missionRange: [minMission, maxMission],
  // });

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
      selectedTypes,
      selectedAreas,
      minGiving,
      maxGiving,
      minMission,
      maxMission
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

  // console.log(`Initialized dropdown with ${clientNames.length} clients`);
}

/**
 * Add unique areas to the options select dropdown
 * Prevents duplicate options by clearing existing content
 * @param {Array} areasArray - Array of area objects
 */
function addUniqueAreasToOptionsSelectAreasDropdown(areasArray) {
  const optionsListArea = document.getElementById("options-list-area");
  if (!optionsListArea) {
    console.error("Area options list element not found");
    return;
  }

  // Ensure global sets exist
  window.selectedAreas_Array = window.selectedAreas_Array || new Set();

  // Clear existing content
  optionsListArea.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-area");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-area");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-area");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListArea.appendChild(selectAllLabel);

  // Populate all areas by default
  areasArray.forEach((areaObject) => {
    const areaName = areaObject.arr[0];
    const areaString = areaObject.str;
    const uniqueId = `area-option-${areaString}`;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
    );

    const areaInput = document.createElement("input");
    areaInput.setAttribute("type", "checkbox");
    areaInput.setAttribute("id", uniqueId);
    areaInput.setAttribute(
      "class",
      "w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    areaInput.setAttribute("value", areaString);

    // Add the value to selectedAreas_Array and check the input by default
    window.selectedAreas_Array.add(areaString);
    areaInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = areaName;

    newLabel.appendChild(areaInput);
    newLabel.appendChild(newSpan);

    optionsListArea.appendChild(newLabel);

    // Add change event listener to update selectedAreas_Array
    areaInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedAreas_Array.add(areaString);
      } else {
        window.selectedAreas_Array.delete(areaString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-area input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-area")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-area input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-area")
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
    const areaCheckboxes = document.querySelectorAll(
      "#options-list-area input[type='checkbox']"
    );

    areaCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-area") {
        checkbox.checked = isChecked;
        const areaString = checkbox.value;

        if (isChecked) {
          window.selectedAreas_Array.add(areaString);
        } else {
          window.selectedAreas_Array.delete(areaString);
        }
      }
    });

    // Reset indeterminate state
    selectAllInput.indeterminate = false;

    // console.log(
    //   "All areas selected:",
    //   isChecked,
    //   "Areas:",
    //   Array.from(window.selectedAreas_Array)
    // );

    // Trigger filter changed event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

/**
 * Function to handle type selection changes
 * @param {Array} typeArray - Array of type objects
 */
function addUniqueTypesToOptionsSelectTypeDropdown(typeArray) {
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
      "w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
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

// Add event listeners for key events
document.addEventListener("filtersChanged", updateClientDropdownFilters);
document.addEventListener("clientDataLoaded", initializeClientDropdown);

// Main initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // console.log("DOM loaded, initializing Header.js functionality");

  // Initialize Sets with all available values
  if (typeof areas_Array !== "undefined") {
    window.selectedAreas_Array = new Set(areas_Array.map((area) => area.str));
  }

  if (typeof types_Array !== "undefined") {
    window.selectedTypes_Array = new Set(types_Array.map((type) => type.str));
  }

  // Configure slider inputs
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
      // Set initial value
      slider.element.value = window[slider.globalVar];

      // If slider has specific slider divs
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

  // Initialize all dropdowns
  const dropdownConfigs = [
    { selectId: "custom-select", optionsId: "options-list" },
    { selectId: "custom-select-area", optionsId: "options-list-area" },
    { selectId: "custom-select-type", optionsId: "options-list-type" },
    { selectId: "custom-select-client", optionsId: "options-list-client" },
  ];

  dropdownConfigs.forEach((config) => {
    setupDropdownToggle(config.selectId, config.optionsId);
  });

  // Initialize filters for area and type checkboxes
  function initializeFilterTriggers() {
    // Set up event listeners for area and type filter checkboxes
    ["area", "type"].forEach((type) => {
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
              type === "area"
                ? window.selectedAreas_Array
                : window.selectedTypes_Array;

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
          } else {
            // Update the appropriate global array
            const targetArray =
              type === "area"
                ? window.selectedAreas_Array
                : window.selectedTypes_Array;

            if (checkbox.checked) {
              targetArray.add(checkbox.value);
            } else {
              targetArray.delete(checkbox.value);
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

  // Initialize all filter triggers
  initializeFilterTriggers();

  document.addEventListener("filtersChanged", function () {
    console.log("Filter State Updated:", {
      sliders: {
        givingMin: window.sliderValue,
        givingMax: window.sliderValue2,
        missionMin: window.missionValue,
        missionMax: window.missionValue2,
      },
      areas: Array.from(window.selectedAreas_Array || []),
      types: Array.from(window.selectedTypes_Array || []),
      clients: {
        count: window.selectedClients_Array
          ? window.selectedClients_Array.size
          : 0,
      },
    });
  });

  // Initialize areas dropdown with the provided array
  if (typeof areas_Array !== "undefined") {
    addUniqueAreasToOptionsSelectAreasDropdown(areas_Array);
  }

  // Export the filter update function to global scope so Utility.js can use it
  window.headerUpdateClientDropdown = updateClientDropdownFilters;
  // console.log("Header.js filter function exported as headerUpdateClientDropdown");
});
