// HEADER.js

// Initialize global Sets if they don't exist
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedSites_Array = window.selectedSites_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();

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
      { selectId: "custom-select-region", optionsId: "options-list-region" },
      { selectId: "custom-select-site", optionsId: "options-list-site" },
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
  minGivingUnits,
  maxGivingUnits,
  selectedRegions,
  selectedSites
) {
  if (!clientData) return false;

  // Check giving units range
  const givingUnitsMatch =
    clientData.givingUnits >= minGivingUnits &&
    clientData.givingUnits <= maxGivingUnits;

  if (
    selectedRegions.length === 0 ||
    selectedSites.length === 0
  ) {
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

  return (
    givingUnitsMatch &&
    regionMatch &&
    siteMatch
  );
}

/**
 * Updates client dropdown checkboxes based on current filter criteria
 * Acts as the primary filter implementation that Utility.js will defer to
 */

// Initialize prevMatchCount outside the function
let prevMatchCount = 0;


function updateClientDropdownFilters() {
  // Ensure client data store exists
  if (!window.clientDataStore) {
    console.warn("Client data store not initialized");
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
 * Called when client data is loaded from Api.js
 */
function initializeClientDropdown(event) {
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

  window.hasRunInitialClientDropdownFilter = false;
  
  // Dispatch event to notify that client dropdown is initialized
  const clientDropdownInitializedEvent = new CustomEvent("clientDropdownInitialized");
  document.dispatchEvent(clientDropdownInitializedEvent);
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

// Add event listeners for key events - CRITICAL CONNECTION POINTS
document.addEventListener("filtersChanged", updateClientDropdownFilters);
document.addEventListener("clientDataLoaded", initializeClientDropdown);

// LISTEN FOR API.JS EVENTS - Key connection to Api.js
document.addEventListener("dataProcessed", function(event) {
  console.log("Data processed event received from Api.js");
  
  // Initialize client dropdown when data is processed
  if (event.detail && event.detail.dataStore) {
    // Extract client data from the dataStore
    window.clientDataStore = {};
    
    // Process demo data to build client data store
    const demoData = event.detail.dataStore.getDataCategory('demo');
    
    // Extract unique client names and their data
    Object.keys(demoData).forEach(key => {
      if (key.includes('_Client')) {
        Object.keys(demoData[key]).forEach(year => {
          // This would need to be adapted based on actual data structure
          // For now, create basic client entries
        });
      }
    });
    
    // Trigger client dropdown initialization
    const clientDataLoadedEvent = new CustomEvent("clientDataLoaded", {
      detail: { dataStore: window.clientDataStore }
    });
    document.dispatchEvent(clientDataLoadedEvent);
  }
});

// Listen for custom slider events
document.addEventListener("sliderChanged", function(event) {
  const { value, type } = event.detail;
  const input = document.getElementById(type === "min" ? "givingUnitsMin" : "givingUnitsMax");
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
  // Initialize Sets with all available values
  if (typeof regions_Array !== "undefined") {
    window.selectedRegions_Array = new Set(
      regions_Array.map((region) => region.str)
    );
  }

  if (typeof sites_Array !== "undefined") {
    window.selectedSites_Array = new Set(
      sites_Array.map((site) => site.str)
    );
  }

  // Configure slider inputs for giving units (CFHI-specific)
  const sliderInputs = [
    {
      element: document.getElementById("givingUnitsMin"),
      globalVar: "sliderValue",
      defaultValue: 0,
      sliderDivs: document.querySelectorAll(".givingUnitsSlider"),
    },
    {
      element: document.getElementById("givingUnitsMax"),
      globalVar: "sliderValue2",
      defaultValue: 16000,
      sliderDivs: document.querySelectorAll(".givingUnitsSlider"),
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
    { selectId: "custom-select-region", optionsId: "options-list-region" },
    { selectId: "custom-select-site", optionsId: "options-list-site" },
    { selectId: "custom-select-client", optionsId: "options-list-client" },
  ];

  dropdownConfigs.forEach((config) => {
    setupDropdownToggle(config.selectId, config.optionsId);
  });

  // Initialize filters for region and site checkboxes
  function initializeFilterTriggers() {
    // Set up event listeners for region and site filter checkboxes
    [
      "region",
      "site",
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
                : window.selectedSites_Array;

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

          // Trigger filter update
          const event = new CustomEvent("filtersChanged");
          document.dispatchEvent(event);
        });
      });
    });

    // Set up sliders with current values
    const sliders = [
      document.getElementById("givingUnitsMin"),
      document.getElementById("givingUnitsMax"),
    ];

    sliders.forEach((slider) => {
      if (slider) {
        // Set initial slider values to match global variables
        slider.value = parseInt(
          slider.id === "givingUnitsMin"
            ? window.sliderValue
            : window.sliderValue2
        );
        slider.addEventListener("input", () => {
          // Update corresponding value
          if (slider.id === "givingUnitsMin") {
            window.sliderValue = parseInt(slider.value);
          } else if (slider.id === "givingUnitsMax") {
            window.sliderValue2 = parseInt(slider.value);
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
  });

  // Export the filter update function to global scope so Utility.js can use it
  window.headerUpdateClientDropdown = updateClientDropdownFilters;
  
  // Add event listener for client dropdown initialization
  document.addEventListener("clientDropdownInitialized", function(event) {
    // Trigger initial filter update after client dropdown is populated
    setTimeout(() => {
      updateClientDropdownFilters();
    }, 100);
  });
  
  // Explicitly set giving units input values
  const givingUnitsMin = document.getElementById('givingUnitsMin');
  const givingUnitsMax = document.getElementById('givingUnitsMax');
  if (givingUnitsMin) givingUnitsMin.value = window.sliderValue;
  if (givingUnitsMax) givingUnitsMax.value = window.sliderValue2;
});

// Keep the existing adjustDivHeight function call if it exists
if (typeof adjustDivHeight === 'function') {
  adjustDivHeight();
  window.addEventListener('resize', adjustDivHeight);
}