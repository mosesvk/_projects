// At the top of Header.js - initialize global Sets if they don't exist
window.selectedRegions_Array = window.selectedRegions_Array || new Set();
window.selectedTypes_Array = window.selectedTypes_Array || new Set();
window.selectedClients_Array = window.selectedClients_Array || new Set();

window.sliderValue = 0;
window.sliderValue2 = 25000;
window.missionValue = 0;
window.missionValue2 = 10000;

document.addEventListener("DOMContentLoaded", function() {
  const givingMinInput = document.getElementById('givingUnitsMin');
  const givingMaxInput = document.getElementById('givingUnitsMax');
  const missionMinInput = document.getElementById('missionUnitsMin');
  const missionMaxInput = document.getElementById('missionUnitsMax');

  // Set initial values
  if (givingMinInput) {
    givingMinInput.value = window.sliderValue;
    givingMinInput.addEventListener('input', function() {
      window.sliderValue = parseInt(this.value) || 0;
      
      const event = new CustomEvent('filtersChanged');
      document.dispatchEvent(event);
    });
  }

  if (givingMaxInput) {
    givingMaxInput.value = window.sliderValue2;
    givingMaxInput.addEventListener('input', function() {
      window.sliderValue2 = parseInt(this.value) || 25000;
      
      const event = new CustomEvent('filtersChanged');
      document.dispatchEvent(event);
    });
  }

  if (missionMinInput) {
    missionMinInput.value = window.missionValue;
    missionMinInput.addEventListener('input', function() {
      window.missionValue = parseInt(this.value) || 0;
      
      const event = new CustomEvent('filtersChanged');
      document.dispatchEvent(event);
    });
  }

  if (missionMaxInput) {
    missionMaxInput.value = window.missionValue2;
    missionMaxInput.addEventListener('input', function() {
      window.missionValue2 = parseInt(this.value) || 10000;
      
      const event = new CustomEvent('filtersChanged');
      document.dispatchEvent(event);
    });
  }
});


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

  document.addEventListener('filtersChanged', function() {
    console.log("Global Variables State:", {
      sliderValue: window.sliderValue,
      sliderValue2: window.sliderValue2,
      missionValue: window.missionValue,
      missionValue2: window.missionValue2,
      selectedRegions: {
        set: window.selectedRegions_Array,
        size: window.selectedRegions_Array ? window.selectedRegions_Array.size : 'N/A',
        array: window.selectedRegions_Array ? Array.from(window.selectedRegions_Array) : []
      },
      selectedTypes: {
        set: window.selectedTypes_Array,
        size: window.selectedTypes_Array ? window.selectedTypes_Array.size : 'N/A',
        array: window.selectedTypes_Array ? Array.from(window.selectedTypes_Array) : []
      },
      selectedClients: {
        set: window.selectedClients_Array,
        size: window.selectedClients_Array ? window.selectedClients_Array.size : 'N/A'
      }
    });
  });
});

// Connect to the range slider elements directly
const givingMinInput = document.getElementById("givingUnitsMin");
const givingMaxInput = document.getElementById("givingUnitsMax");
const missionMinInput = document.getElementById("missionUnitsMin");
const missionMaxInput = document.getElementById("missionUnitsMax");

if (givingMinInput) {
  givingMinInput.addEventListener("input", function () {
    console.log("Giving min input changed:", this.value);
    window.sliderValue = parseInt(this.value) || 0;

    // Trigger the filtersChanged event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

if (givingMaxInput) {
  givingMaxInput.addEventListener("input", function () {
    console.log("Giving max input changed:", this.value);
    window.sliderValue2 = parseInt(this.value) || 25000;

    // Trigger the filtersChanged event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

if (missionMinInput) {
  missionMinInput.addEventListener("input", function () {
    console.log("Mission min input changed:", this.value);
    window.missionValue = parseInt(this.value) || 0;

    // Trigger the filtersChanged event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

if (missionMaxInput) {
  missionMaxInput.addEventListener("input", function () {
    console.log("Mission max input changed:", this.value);
    window.missionValue2 = parseInt(this.value) || 10000;

    // Trigger the filtersChanged event
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}
