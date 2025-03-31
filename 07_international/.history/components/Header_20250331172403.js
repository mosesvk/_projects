/**
 * Generic function to create and manage custom dropdown selectors
 * @param {string} selectElementId - ID of the custom select element
 * @param {string} optionsListId - ID of the options list element
 * @param {Set} selectedValuesSet - Reference to the Set storing selected values
 */
function initializeCustomDropdown(selectElementId, optionsListId, selectedValuesSet) {
  const customSelectElement = document.getElementById(selectElementId);
  const optionsListElement = document.getElementById(optionsListId);
  
  if (!customSelectElement || !optionsListElement) {
    console.error(`Elements not found: ${selectElementId} or ${optionsListId}`);
    return;
  }
  
  // Toggle dropdown on click
  customSelectElement.addEventListener("click", (event) => {
    // Check if the click target is not a checkbox inside the customSelectElement
    if (!event.target.closest(".form-checkbox") && !event.target.closest("label")) {
      optionsListElement.classList.toggle("invisible");
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!customSelectElement.contains(event.target) && 
        !optionsListElement.contains(event.target)) {
      optionsListElement.classList.add("invisible");
    }
  });
}

/**
 * Add options to Region dropdown 
 * @param {Array} regionArray - Array of region objects
 */
function addUniqueRegionsToOptionsSelectRegionsDropdown(regionArray) {
  const optionsListRegion = document.getElementById("options-list-region");
  if (!optionsListRegion) {
    console.error("Region options list element not found");
    return;
  }

  // Create "Select All" checkbox and label
  const selectAllLabel = createSelectAllElement(
    "select-all-checkbox-region", 
    selectedRegions_Array, 
    "#options-list-region input[type='checkbox']"
  );
  optionsListRegion.appendChild(selectAllLabel);

  // Add region options
  regionArray.forEach((regionObject, index) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;
    const uniqueId = `region-option-${regionString}`;
    
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", uniqueId);
    newInput.setAttribute(
      "class",
      "w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    newInput.setAttribute("value", regionString);

    // Add the value to selectedRegions_Array and check the input by default
    selectedRegions_Array.add(regionString);
    newInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListRegion.appendChild(newLabel);

    // Add change event listener to input to update selectedRegions_Array
    newInput.addEventListener("change", function() {
      if (newInput.checked) {
        selectedRegions_Array.add(regionString);
      } else {
        selectedRegions_Array.delete(regionString);
      }
      
      // Update "Select All" checkbox based on individual checkboxes
      updateSelectAllCheckbox("select-all-checkbox-region", "#options-list-region input[type='checkbox']");
    });
  });
}

/**
 * Add options to Type dropdown
 * @param {Array} typeArray - Array of type objects
 */
function addUniqueTypesToOptionsSelectTypeDropdown(typeArray) {
  const optionsListType = document.getElementById("options-list-type");
  if (!optionsListType) {
    console.error("Type options list element not found");
    return;
  }

  // Create "Select All" checkbox and label
  const selectAllLabel = createSelectAllElement(
    "select-all-checkbox-type", 
    selectedTypes_Array, 
    "#options-list-type input[type='checkbox']"
  );
  optionsListType.appendChild(selectAllLabel);

  // Add type options
  typeArray.forEach((typeObject, index) => {
    const typeName = typeObject.arr[0];
    const typeString = typeObject.str;
    const uniqueId = `type-option-${typeString}`;
    
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", uniqueId);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", uniqueId);
    newInput.setAttribute(
      "class",
      "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );
    newInput.setAttribute("value", typeString);

    // Add the value to selectedTypes_Array and check the input by default
    selectedTypes_Array.add(typeString);
    newInput.checked = true;

    const newSpan = document.createElement("span");
    newSpan.innerText = typeName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListType.appendChild(newLabel);

    // Add change event listener to input to update selectedTypes_Array
    newInput.addEventListener("change", function() {
      if (newInput.checked) {
        selectedTypes_Array.add(typeString);
      } else {
        selectedTypes_Array.delete(typeString);
      }
      
      // Update "Select All" checkbox based on individual checkboxes
      updateSelectAllCheckbox("select-all-checkbox-type", "#options-list-type input[type='checkbox']");
    });
  });
}

/**
 * Add options to Client dropdown
 * @param {Set} clientSet - Set of client strings
 */
function addUniqueClientsToOptionsSelectClientDropdown(clientSet) {
  const optionsListClient = document.getElementById("options-list-client");
  const searchInput = document.getElementById("input-group-search");
  
  if (!optionsListClient) {
    console.error("Client options list element not found");
    return;
  }

  // Function to filter clients based on search input
  const filterClients = () => {
    const searchValue = searchInput?.value.toLowerCase() || '';
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
  if (searchInput) {
    searchInput.addEventListener("input", filterClients);
  }

  // Create "Select All" checkbox and label
  const selectAllLabel = createSelectAllElement(
    "select-all-checkbox-client", 
    selectedClients_Array, 
    "#options-list-client input[type='checkbox']"
  );
  
  // Insert after search input if it exists, otherwise at beginning
  const insertPoint = optionsListClient.children[1] || optionsListClient.firstChild;
  if (insertPoint) {
    optionsListClient.insertBefore(selectAllLabel, insertPoint);
  } else {
    optionsListClient.appendChild(selectAllLabel);
  }

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

    // Add the value to selectedClients_Array and check the input by default
    selectedClients_Array.add(clientString);
    newInput.checked = true;

    // Add change event listener to input to update selectedClients_Array
    newInput.addEventListener("change", function() {
      if (newInput.checked) {
        selectedClients_Array.add(clientString);
      } else {
        selectedClients_Array.delete(clientString);
      }
      
      // Update "Select All" checkbox based on individual checkboxes
      updateSelectAllCheckbox("select-all-checkbox-client", "#options-list-client input[type='checkbox']");
    });
  });
}

/**
 * Create a "Select All" checkbox element
 * @param {string} id - ID for the select all checkbox
 * @param {Set} valuesSet - Reference to the Set storing selected values
 * @param {string} checkboxSelector - Selector for the checkboxes controlled by "Select All"
 * @returns {HTMLElement} The select all label element
 */
function createSelectAllElement(id, valuesSet, checkboxSelector) {
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", id);
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", id);
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", `${id}-text`);
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  // Add event listener to handle "Select All" behavior
  selectAllInput.addEventListener("change", function() {
    const isChecked = selectAllInput.checked;
    
    // Toggle other checkboxes based on "Select All" checkbox state
    const checkboxes = document.querySelectorAll(checkboxSelector);
    checkboxes.forEach((checkbox) => {
      if (checkbox.id !== id) { // Skip the "Select All" checkbox itself
        checkbox.checked = isChecked;
        const valueString = checkbox.value;
        
        if (isChecked) {
          valuesSet.add(valueString);
        } else {
          valuesSet.delete(valueString);
        }
      }
    });
  });

  return selectAllLabel;
}

/**
 * Update the state of a "Select All" checkbox based on individual checkboxes
 * @param {string} selectAllId - ID of the select all checkbox
 * @param {string} checkboxSelector - Selector for the checkboxes that determine the state
 */
function updateSelectAllCheckbox(selectAllId, checkboxSelector) {
  const selectAllInput = document.getElementById(selectAllId);
  if (!selectAllInput) return;
  
  // Get all checkboxes except the "Select All" checkbox
  const allCheckboxes = Array.from(document.querySelectorAll(checkboxSelector))
    .filter(input => input.id !== selectAllId);
  
  // Check if all checkboxes are checked
  const allChecked = allCheckboxes.every(input => input.checked);
  selectAllInput.checked = allChecked;
}

// Initialize dropdowns when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize region dropdown
  initializeCustomDropdown(
    "custom-select-region", 
    "options-list-region", 
    selectedRegions_Array
  );
  
  // Initialize type dropdown
  initializeCustomDropdown(
    "custom-select-type", 
    "options-list-type", 
    selectedTypes_Array
  );
  
  // Initialize client dropdown
  initializeCustomDropdown(
    "custom-select-client", 
    "options-list-client", 
    selectedClients_Array
  );

  // Initialize the main dropdown if it exists
  initializeCustomDropdown(
    "custom-select", 
    "options-list", 
    null
  );
  
  // Initialize sidebar if elements exist
  const sidebarElement = document.getElementById("sidebar");
  const backdropElement = document.getElementById("sidebarBackdrop");
  
  if (sidebarElement && backdropElement) {
    // Add sidebar-specific functionality here
  }
  
  // Adjust heights if needed
  if (typeof adjustDivHeight === 'function') {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
  }
});