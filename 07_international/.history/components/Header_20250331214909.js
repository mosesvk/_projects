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

document.addEventListener("DOMContentLoaded", function () {
  const sliderInputs = [
    {
      element: document.getElementById("givingUnitsMin"),
      globalVar: "sliderValue",
      defaultValue: 0,
    },
    {
      element: document.getElementById("givingUnitsMax"),
      globalVar: "sliderValue2",
      defaultValue: 25000,
    },
    {
      element: document.getElementById("missionUnitsMin"),
      globalVar: "missionValue",
      defaultValue: 0,
    },
    {
      element: document.getElementById("missionUnitsMax"),
      globalVar: "missionValue2",
      defaultValue: 10000,
    },
  ];

  sliderInputs.forEach((slider) => {
    if (slider.element) {
      // Set initial value
      slider.element.value = window[slider.globalVar];

      // Add input event listener
      slider.element.addEventListener("input", function () {
        // Update global variable, use default if parsing fails
        window[slider.globalVar] = parseInt(this.value) || slider.defaultValue;

        console.log(`${slider.globalVar} changed:`, window[slider.globalVar]);

        // Trigger filters changed event
        const event = new CustomEvent("filtersChanged");
        document.dispatchEvent(event);
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
