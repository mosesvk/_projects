// At the top of Header.js - initialize global Sets if they don't exist
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedTypes_Array = window.selectedTypes_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();

/**
 * Initialize custom dropdowns with event listeners
 * Prevents duplicate event binding by checking if already initialized
 */
function initializeDropdowns() {
  // Skip if already initialized
  if (window.dropdownsInitialized) {
    return;
  }
  
  // Get all required elements
  const customSelectElement = document.getElementById("custom-select");
  const optionsListElement = document.getElementById("options-list");
  
  const customSelectRegionElement = document.getElementById("custom-select-region");
  const customSelectTypeElement = document.getElementById("custom-select-type");
  const customSelectClientElement = document.getElementById("custom-select-client");
  
  const optionsListRegionElement = document.getElementById("options-list-region");
  const optionsListTypeElement = document.getElementById("options-list-type");
  const optionsListClientElement = document.getElementById("options-list-client");
  
  const sidebarElement = document.getElementById("sidebar");
  const backdropElement = document.getElementById("sidebarBackdrop");
  
  // Initialize main dropdown
  if (customSelectElement && optionsListElement) {
    customSelectElement.addEventListener("click", (event) => {
      if (!event.target.closest(".form-checkbox") && !event.target.closest("label")) {
        optionsListElement.classList.toggle("invisible");
      }
    });
  }
  
  // Initialize region dropdown
  if (customSelectRegionElement && optionsListRegionElement) {
    customSelectRegionElement.addEventListener("click", (event) => {
      if (!event.target.closest(".form-checkbox") && !event.target.closest("label")) {
        optionsListRegionElement.classList.toggle("invisible");
      }
    });
  }
  
  // Initialize type dropdown
  if (customSelectTypeElement && optionsListTypeElement) {
    customSelectTypeElement.addEventListener("click", (event) => {
      if (!event.target.closest(".form-checkbox") && !event.target.closest("label")) {
        optionsListTypeElement.classList.toggle("invisible");
      }
    });
  }
  
  // Initialize client dropdown
  if (customSelectClientElement && optionsListClientElement) {
    customSelectClientElement.addEventListener("click", (event) => {
      if (!event.target.closest(".form-checkbox") && !event.target.closest("label")) {
        optionsListClientElement.classList.toggle("invisible");
      }
    });
  }
  
  // Add global click handler to close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    // Close main dropdown
    if (customSelectElement && optionsListElement &&
        !customSelectElement.contains(event.target) && 
        !optionsListElement.contains(event.target)) {
      optionsListElement.classList.add("invisible");
    }
    
    // Close region dropdown
    if (customSelectRegionElement && optionsListRegionElement &&
        !optionsListRegionElement.contains(event.target) && 
        !customSelectRegionElement.contains(event.target)) {
      optionsListRegionElement.classList.add("invisible");
    }
    
    // Close type dropdown
    if (customSelectTypeElement && optionsListTypeElement &&
        !customSelectTypeElement.contains(event.target) && 
        !optionsListTypeElement.contains(event.target)) {
      optionsListTypeElement.classList.add("invisible");
    }
    
    // Close client dropdown
    if (customSelectClientElement && optionsListClientElement &&
        !customSelectClientElement.contains(event.target) && 
        !optionsListClientElement.contains(event.target)) {
      optionsListClientElement.classList.add("invisible");
    }
  });
  
  // Mark as initialized
  window.dropdownsInitialized = true;
  
  // Adjust dropdown height for better UX
  if (typeof adjustDivHeight === 'function') {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
  }
}

// Call during DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeDropdowns);