// HEADER.js

// Initialize global Sets if they don't exist
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedSites_Array = window.selectedSites_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();

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
      { selectId: "custom-select-site", optionsId: "options-list-site" },
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

// Alias for backward compatibility
const addUniqueRegionsToOptionsSelectRegion = addUniqueRegionsToOptionsSelectRegionsDropdown;

/**
 * Function to handle site selection changes
 * @param {Array} siteArray - Array of site objects
 */
function addUniqueSitesToOptionsSelectSitesDropdown(siteArray) {
  const optionsListSite = document.getElementById("options-list-site");
  if (!optionsListSite) {
    console.error("Site options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedSites_Array = window.selectedSites_Array || new Set();

  // Clear existing content
  optionsListSite.innerHTML = "";

  // Create "Select All" checkbox
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-site");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-site");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-site");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListSite.appendChild(selectAllLabel);

  // Populate all sites by default
  siteArray.forEach((siteObject) => {
    const siteName = siteObject.arr[0];
    const siteString = siteObject.str;

    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("label");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `site_${siteString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", siteString);
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `site_${siteString}`);
    newLabel.setAttribute(
      "class",
      "w-full py-2 ms-2 font-medium text-gray-900 rounded dark:text-gray-300"
    );
    newLabel.innerText = siteName;

    // Automatically add all sites to the set and check the inputs
    window.selectedSites_Array.add(siteString);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListSite.appendChild(newListItem);

    // Event listener to update selectedSites_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedSites_Array.add(siteString);
      } else {
        window.selectedSites_Array.delete(siteString);
      }

      // Update "Select All" checkbox state
      const allChecked = Array.from(
        document.querySelectorAll("#options-list-site input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-site")
        .every((input) => input.checked);

      const someChecked = Array.from(
        document.querySelectorAll("#options-list-site input[type='checkbox']")
      )
        .filter((input) => input.id !== "select-all-checkbox-site")
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
    const siteCheckboxes = document.querySelectorAll(
      "#options-list-site input[type='checkbox']"
    );

    siteCheckboxes.forEach((checkbox) => {
      if (checkbox.id !== "select-all-checkbox-site") {
        checkbox.checked = isChecked;
        const siteString = checkbox.value;

        if (isChecked) {
          window.selectedSites_Array.add(siteString);
        } else {
          window.selectedSites_Array.delete(siteString);
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

// Alias for backward compatibility
const addUniqueSitesToOptionsSelectSite = addUniqueSitesToOptionsSelectSitesDropdown;

/**
 * Checks if a client matches the current filter criteria
 * Critical function that determines whether a client should be selected
 */
function clientMatchesFilters(
  clientData,
  minGivingUnits,
  maxGivingUnits,
  selectedRegions,
  selectedSites
) {
  if (!clientData) return false;

  // Check giving units range
  const givingUnitsMatch =
    clientData.givingUnitVal >= minGivingUnits &&
    clientData.givingUnitVal <= maxGivingUnits;

  if (selectedRegions.length === 0 || selectedSites.length === 0) {
    console.warn("No regions or sites selected, returning false");
    return false;
  }

  // Check if client has at least one of the selected regions, handle missing regions
  const regionMatch = clientData.region
    ? selectedRegions.includes(clientData.region)
    : false;

  // Check if client has at least one of the selected sites, handle missing sites
  const siteMatch = clientData.site
    ? selectedSites.includes(clientData.site)
    : false;

  return givingUnitsMatch && regionMatch && siteMatch;
}

/**
 * Updates client dropdown checkboxes based on current filter criteria
 * Acts as the primary filter implementation that Utility.js will defer to
 */
let prevMatchCount = 0;
let updateTimeout = null;

function updateClientDropdownFilters() {
  // Clear any existing timeout to debounce rapid calls
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  
  updateTimeout = setTimeout(() => {
    executeClientDropdownFilters();
  }, 100);
}

function executeClientDropdownFilters() {
  // Ensure client data store exists
  if (!window.clientDataStore) {
    setTimeout(() => {
      if (!window.clientDataStore) {
        console.warn("Client data store not initialized");
        return;
      }
      executeClientDropdownFilters();
    }, 100);
    return;
  }

  // Get current filter values
  const selectedRegions = Array.from(window.selectedRegions_Array || []);
  const selectedSites = Array.from(window.selectedSites_Array || []);
  const minGivingUnits = window.sliderValue || 0;
  const maxGivingUnits = window.sliderValue2 || 25000;

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
      minGivingUnits,
      maxGivingUnits,
      selectedRegions,
      selectedSites
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

  console.log("Selected clients:", Array.from(window.selectedClients_Array));

  // Only show toast if matchCount has changed and not on initial load
  if (window.hasRunInitialClientDropdownFilter) {
    if (matchCount !== prevMatchCount) {
      if (typeof createToastSuccess === "function") {
        createToastSuccess(`${matchCount} clients match your filter criteria`);
      }
    }
  } else {
    window.hasRunInitialClientDropdownFilter = true;
  }
  
  // Update prevMatchCount for next comparison
  prevMatchCount = matchCount;
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

// Function to format numbers with commas
function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to observe and format input values
function setupNumberFormatting() {
  const inputIds = ["givingUnitsMin", "givingUnitsMax"];

  // Process each input field
  inputIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    // Set initial value if not set and format it
    if (!input.value || input.value === "0") {
      if (id === "givingUnitsMin") {
        input.value = window.sliderValue || 0;
      } else {
        input.value = window.sliderValue2 || 25000;
      }
    }
    
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

/**
 * Function to populate client dropdown
 * Called from Api.js after fetching unique client names
 */
function addUniqueClientsToOptionsSelectClientDropdown(clientArray) {
  const optionsListClient = document.getElementById("options-list-client");
  if (!optionsListClient) {
    console.error("Client options list element not found");
    return;
  }

  // Ensure global scoping and initialization
  window.selectedClients_Array = window.selectedClients_Array || new Set();

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
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-client");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListClient.appendChild(selectAllLabel);

  // Populate all clients by default
  clientArray.forEach((clientName) => {
    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none";

    const newDiv = document.createElement("label");
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

    // Automatically add all clients to the set and check the inputs
    window.selectedClients_Array.add(clientName);
    newInput.checked = true;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    newListItem.appendChild(newDiv);
    optionsListClient.appendChild(newListItem);

    // Event listener to update selectedClients_Array
    newInput.addEventListener("change", function () {
      if (this.checked) {
        window.selectedClients_Array.add(clientName);
      } else {
        window.selectedClients_Array.delete(clientName);
      }

      // Update "Select All" checkbox state
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

    // Reset indeterminate state
    selectAllInput.indeterminate = false;
  });

  // After populating, apply initial filters
  window.hasRunInitialClientDropdownFilter = false;
  updateClientDropdownFilters();
}

// Main initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Sets with all available values
  if (typeof regions_Array !== "undefined") {
    window.selectedRegions_Array = new Set(
      regions_Array.map((region) => region.str)
    );
  }

  if (typeof sites_Array !== "undefined") {
    window.selectedSites_Array = new Set(sites_Array.map((site) => site.str));
  }

  // Initialize all dropdowns
  const dropdownConfigs = [
    { selectId: "custom-select-year", optionsId: "options-list-year" },
    { selectId: "custom-select-region", optionsId: "options-list-region" },
    { selectId: "custom-select-site", optionsId: "options-list-site" },
    { selectId: "custom-select-client", optionsId: "options-list-client" },
  ];

  dropdownConfigs.forEach((config) => {
    setupDropdownToggle(config.selectId, config.optionsId);
  });

  // Setup number formatting for giving units
  setupNumberFormatting();
});

// Listen for custom slider events to update formatted display
document.addEventListener("sliderChanged", function (event) {
  const { value, type } = event.detail;
  const input = document.getElementById(
    type === "min" ? "givingUnitsMin" : "givingUnitsMax"
  );
  if (input && input.value != value) {
    input.value = value;

    // Also update the formatted display if it exists
    const displaySpan = document.querySelector(
      `[data-format-for="${input.id}"]`
    );
    if (displaySpan) {
      displaySpan.textContent = formatNumberWithCommas(value);
    }
  }
});

// Listen for filtersChanged event to update client dropdown
document.addEventListener("filtersChanged", function () {
  if (typeof updateClientDropdownFilters === "function") {
    updateClientDropdownFilters();
  }
});

// Keep the existing adjustDivHeight function call if it exists
if (typeof adjustDivHeight === "function") {
  adjustDivHeight();
  window.addEventListener("resize", adjustDivHeight);
}
