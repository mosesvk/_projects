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

  const customSelectRegionElement = document.getElementById(
    "custom-select-region"
  );
  const customSelectTypeElement = document.getElementById("custom-select-type");
  const customSelectClientElement = document.getElementById(
    "custom-select-client"
  );

  const optionsListRegionElement = document.getElementById(
    "options-list-region"
  );
  const optionsListTypeElement = document.getElementById("options-list-type");
  const optionsListClientElement = document.getElementById(
    "options-list-client"
  );

  const sidebarElement = document.getElementById("sidebar");
  const backdropElement = document.getElementById("sidebarBackdrop");

  // Initialize main dropdown
  if (customSelectElement && optionsListElement) {
    customSelectElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListElement.classList.toggle("invisible");
      }
    });
  }

  // Initialize region dropdown
  if (customSelectRegionElement && optionsListRegionElement) {
    customSelectRegionElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListRegionElement.classList.toggle("invisible");
      }
    });
  }

  // Initialize type dropdown
  if (customSelectTypeElement && optionsListTypeElement) {
    customSelectTypeElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListTypeElement.classList.toggle("invisible");
      }
    });
  }

  // Initialize client dropdown
  if (customSelectClientElement && optionsListClientElement) {
    customSelectClientElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListClientElement.classList.toggle("invisible");
      }
    });
  }

  // Add global click handler to close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    // Close main dropdown
    if (
      customSelectElement &&
      optionsListElement &&
      !customSelectElement.contains(event.target) &&
      !optionsListElement.contains(event.target)
    ) {
      optionsListElement.classList.add("invisible");
    }

    // Close region dropdown
    if (
      customSelectRegionElement &&
      optionsListRegionElement &&
      !optionsListRegionElement.contains(event.target) &&
      !customSelectRegionElement.contains(event.target)
    ) {
      optionsListRegionElement.classList.add("invisible");
    }

    // Close type dropdown
    if (
      customSelectTypeElement &&
      optionsListTypeElement &&
      !customSelectTypeElement.contains(event.target) &&
      !optionsListTypeElement.contains(event.target)
    ) {
      optionsListTypeElement.classList.add("invisible");
    }

    // Close client dropdown
    if (
      customSelectClientElement &&
      optionsListClientElement &&
      !customSelectClientElement.contains(event.target) &&
      !optionsListClientElement.contains(event.target)
    ) {
      optionsListClientElement.classList.add("invisible");
    }
  });

  // Mark as initialized
  window.dropdownsInitialized = true;

  // Adjust dropdown height for better UX
  if (typeof adjustDivHeight === "function") {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
  }
}

// Call during DOMContentLoaded
// Add this to Header.js - to initialize the dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get all dropdown elements
  const customSelectElement = document.getElementById("custom-select");
  const optionsListElement = document.getElementById("options-list");

  const customSelectRegionElement = document.getElementById(
    "custom-select-region"
  );
  const customSelectTypeElement = document.getElementById("custom-select-type");
  const customSelectClientElement = document.getElementById(
    "custom-select-client"
  );

  const optionsListRegionElement = document.getElementById(
    "options-list-region"
  );
  const optionsListTypeElement = document.getElementById("options-list-type");
  const optionsListClientElement = document.getElementById(
    "options-list-client"
  );

  // Only attach event listeners if elements exist

  // Main dropdown toggle
  if (customSelectElement && optionsListElement) {
    customSelectElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListElement.classList.toggle("invisible");
      }
    });
  }

  // Region dropdown toggle
  if (customSelectRegionElement && optionsListRegionElement) {
    customSelectRegionElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListRegionElement.classList.toggle("invisible");
      }
    });
  }

  // Type dropdown toggle
  if (customSelectTypeElement && optionsListTypeElement) {
    customSelectTypeElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListTypeElement.classList.toggle("invisible");
      }
    });
  }

  // Client dropdown toggle
  if (customSelectClientElement && optionsListClientElement) {
    customSelectClientElement.addEventListener("click", (event) => {
      if (
        !event.target.closest(".form-checkbox") &&
        !event.target.closest("label")
      ) {
        optionsListClientElement.classList.toggle("invisible");
      }
    });
  }

  // Document click handler to close dropdowns
  document.addEventListener("click", (event) => {
    // Close main dropdown when clicking outside
    if (customSelectElement && optionsListElement) {
      if (
        !customSelectElement.contains(event.target) &&
        !optionsListElement.contains(event.target)
      ) {
        optionsListElement.classList.add("invisible");
      }
    }

    // Close region dropdown when clicking outside
    if (customSelectRegionElement && optionsListRegionElement) {
      if (
        !customSelectRegionElement.contains(event.target) &&
        !optionsListRegionElement.contains(event.target)
      ) {
        optionsListRegionElement.classList.add("invisible");
      }
    }

    // Close type dropdown when clicking outside
    if (customSelectTypeElement && optionsListTypeElement) {
      if (
        !customSelectTypeElement.contains(event.target) &&
        !optionsListTypeElement.contains(event.target)
      ) {
        optionsListTypeElement.classList.add("invisible");
      }
    }

    // Close client dropdown when clicking outside
    if (customSelectClientElement && optionsListClientElement) {
      if (
        !customSelectClientElement.contains(event.target) &&
        !optionsListClientElement.contains(event.target)
      ) {
        optionsListClientElement.classList.add("invisible");
      }
    }
  });

  function initializeFilterTriggers() {
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

    // Connect sliders to filter triggers
    const sliders = [
      document.getElementById("giving-min-slider"),
      document.getElementById("giving-max-slider"),
      document.getElementById("mission-min-slider"),
      document.getElementById("mission-max-slider"),
    ];

    sliders.forEach((slider) => {
      if (slider) {
        slider.addEventListener("input", () => {
          // Update corresponding value
          if (slider.id === "giving-min-slider") {
            window.sliderValue = parseInt(slider.value);
          } else if (slider.id === "giving-max-slider") {
            window.sliderValue2 = parseInt(slider.value);
          } else if (slider.id === "mission-min-slider") {
            window.missionValue = parseInt(slider.value);
          } else if (slider.id === "mission-max-slider") {
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

  document.addEventListener('filtersChanged', function() {
    console.log("Filter changed event received in Header.js");
    console.log("Current filter values:", {
      givingMin: window.sliderValue !== undefined ? window.sliderValue : 'undefined',
      givingMax: window.sliderValue2 !== undefined ? window.sliderValue2 : 'undefined',
      missionMin: window.missionValue !== undefined ? window.missionValue : 'undefined',
      missionMax: window.missionValue2 !== undefined ? window.missionValue2 : 'undefined',
      selectedRegions: window.selectedRegions_Array ? Array.from(window.selectedRegions_Array) : 'undefined',
      selectedTypes: window.selectedTypes_Array ? Array.from(window.selectedTypes_Array) : 'undefined',
      selectedClients: window.selectedClients_Array ? window.selectedClients_Array.size : 0
    });
  });
});

// Connect to the range slider elements directly
const givingMinInput = document.getElementById('givingUnitsMin');
const givingMaxInput = document.getElementById('givingUnitsMax');
const missionMinInput = document.getElementById('missionUnitsMin');
const missionMaxInput = document.getElementById('missionUnitsMax');

if (givingMinInput) {
  givingMinInput.addEventListener('input', function() {
    console.log("Giving min input changed:", this.value);
    window.sliderValue = parseInt(this.value) || 0;
    
    // Trigger the filtersChanged event
    const event = new CustomEvent('filtersChanged');
    document.dispatchEvent(event);
  });
}

if (givingMaxInput) {
  givingMaxInput.addEventListener('input', function() {
    console.log("Giving max input changed:", this.value);
    window.sliderValue2 = parseInt(this.value) || 25000;
    
    // Trigger the filtersChanged event
    const event = new CustomEvent('filtersChanged');
    document.dispatchEvent(event);
  });
}

if (missionMinInput) {
  missionMinInput.addEventListener('input', function() {
    console.log("Mission min input changed:", this.value);
    window.missionValue = parseInt(this.value) || 0;
    
    // Trigger the filtersChanged event
    const event = new CustomEvent('filtersChanged');
    document.dispatchEvent(event);
  });
}

if (missionMaxInput) {
  missionMaxInput.addEventListener('input', function() {
    console.log("Mission max input changed:", this.value);
    window.missionValue2 = parseInt(this.value) || 10000;
    
    // Trigger the filtersChanged event
    const event = new CustomEvent('filtersChanged');
    document.dispatchEvent(event);
  });
}