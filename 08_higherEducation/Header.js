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
      { selectId: "selectRegions", optionsId: "options-list-region" },
      { selectId: "selectStates", optionsId: "options-list-state" },
      { selectId: "selectMemberships", optionsId: "options-list-membership" },
      { selectId: "selectTypes", optionsId: "options-list-type" },
      { selectId: "selectAthletics", optionsId: "options-list-athletic" },
      { selectId: "selectClients", optionsId: "options-list-client" },
      { selectId: "selectSeminaries", optionsId: "options-list-seminary" },
      { selectId: "selectRegionals", optionsId: "options-list-regional" },
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
  const clientOptions = document.querySelectorAll('#selectClients option');

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

  const clientOptions = document.querySelectorAll('#selectClients option');
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
  const selectElement = document.getElementById("selectClients");
  if (!selectElement) return;

  // Clear existing options except the first one
  while (selectElement.options.length > 1) {
    selectElement.remove(1);
  }

  // Add new options
  sortedUniquePeerClientNames.forEach((clientName) => {
    const option = document.createElement("option");
    option.value = clientName;
    option.textContent = clientName;
    selectElement.appendChild(option);
    
    // Store client data in client data store
    if (!window.clientDataStore) {
      window.clientDataStore = {};
    }
    
    window.clientDataStore[clientName] = window.clientDataStore[clientName] || {};
  });

  // Add options selection event
  selectElement.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    if (selectedOption.value) {
      window.selectedClients_Array.clear();
      window.selectedClients_Array.add(selectedOption.value);
      triggerFiltersChanged();
    }
  });

  // Populate client data store with additional information from peer records
  populateClientDataStore();

  // Update select all checkbox state
  updateSelectAllClientCheckboxState();
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
    document.getElementById('selectRegions'),
    document.getElementById('selectStates'),
    document.getElementById('selectMemberships'),
    document.getElementById('selectTypes'),
    document.getElementById('selectAthletics'),
    document.getElementById('selectSeminaries'),
    document.getElementById('selectRegionals'),
    document.getElementById('selectClients'),
    document.getElementById('enrollmentRange')
  ];

  filterElements.forEach(element => {
    if (element) {
      element.addEventListener('change', () => {
        if (element.id === 'selectRegions') {
          updateRegionSelection(element);
        } else if (element.id === 'selectStates') {
          updateStateSelection(element);
        } else if (element.id === 'selectMemberships') {
          updateMembershipSelection(element);
        } else if (element.id === 'selectTypes') {
          updateTypeSelection(element);
        } else if (element.id === 'selectAthletics') {
          updateAthleticSelection(element);
        } else if (element.id === 'selectSeminaries') {
          updateSeminarySelection(element);
        } else if (element.id === 'selectRegionals') {
          updateRegionalSelection(element);
        }
        
        triggerFiltersChanged();
      });
    }
  });

  // Handle select all checkbox
  const selectAllCheckbox = document.getElementById('select-all-checkbox-client');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      const clientOptions = document.querySelectorAll('#selectClients option');
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
  
  // Set up enrollment slider
  setupEnrollmentSlider();
};

// Update filter selections
function updateRegionSelection(element) {
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

// Set up enrollment slider
function setupEnrollmentSlider() {
  const minSlider = document.getElementById('enrollmentMin');
  const maxSlider = document.getElementById('enrollmentMax');
  
  if (minSlider && maxSlider) {
    // Set initial values
    minSlider.value = window.sliderValue;
    maxSlider.value = window.sliderValue2;
    
    // Update values on change
    minSlider.addEventListener('input', function() {
      window.sliderValue = parseInt(this.value);
      triggerFiltersChanged();
    });
    
    maxSlider.addEventListener('input', function() {
      window.sliderValue2 = parseInt(this.value);
      triggerFiltersChanged();
    });
  }
}

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
    { selectId: "selectRegions", optionsId: "options-list-region" },
    { selectId: "selectStates", optionsId: "options-list-state" },
    { selectId: "selectMemberships", optionsId: "options-list-membership" },
    { selectId: "selectTypes", optionsId: "options-list-type" },
    { selectId: "selectAthletics", optionsId: "options-list-athletic" },
    { selectId: "selectClients", optionsId: "options-list-client" },
    { selectId: "selectSeminaries", optionsId: "options-list-seminary" },
    { selectId: "selectRegionals", optionsId: "options-list-regional" }
  ];

  dropdownConfigs.forEach(config => {
    setupDropdownToggle(config.selectId, config.optionsId);
  });
  
  // Initialize filter triggers
  initializeFilterTriggers();
  
  // Create client data store
  window.clientDataStore = {};
  
  // Make header functions globally available
  window.headerUpdateClientDropdownFilters = updateClientDropdownFilters;
}); 