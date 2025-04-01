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

  // Centralized filter change trigger
  const triggerFilterChange = () => {
    const event = new CustomEvent('filtersChanged');
    document.dispatchEvent(event);
  };

  // Comprehensive slider change handler
  const handleSliderChange = (sliderType, value) => {
    switch(sliderType) {
      case 'givingMin':
        window.sliderValue = Math.min(parseInt(value) || 0, window.sliderValue2);
        break;
      case 'givingMax':
        window.sliderValue2 = Math.max(parseInt(value) || 25000, window.sliderValue);
        break;
      case 'missionMin':
        window.missionValue = Math.min(parseInt(value) || 0, window.missionValue2);
        break;
      case 'missionMax':
        window.missionValue2 = Math.max(parseInt(value) || 10000, window.missionValue);
        break;
    }

    // Trigger filter change event
    triggerFilterChange();
  };

  // Add event listeners with improved handling
  if (givingMinInput) {
    givingMinInput.addEventListener('input', function() {
      handleSliderChange('givingMin', this.value);
    });
  }

  if (givingMaxInput) {
    givingMaxInput.addEventListener('input', function() {
      handleSliderChange('givingMax', this.value);
    });
  }

  if (missionMinInput) {
    missionMinInput.addEventListener('input', function() {
      handleSliderChange('missionMin', this.value);
    });
  }

  if (missionMaxInput) {
    missionMaxInput.addEventListener('input', function() {
      handleSliderChange('missionMax', this.value);
    });
  }

  // Initial setup to ensure values are set correctly
  if (givingMinInput) givingMinInput.value = window.sliderValue;
  if (givingMaxInput) givingMaxInput.value = window.sliderValue2;
  if (missionMinInput) missionMinInput.value = window.missionValue;
  if (missionMaxInput) missionMaxInput.value = window.missionValue2;
});

/**
 * Initialize custom dropdowns with event listeners
 * Prevents duplicate event binding by checking if already initialized
 */
function initializeDropdowns() {
  // Existing dropdown initialization code remains the same
  // (Keep the entire existing initializeDropdowns function)
}

const addUniqueYearsToOptionsSelectDropdown = (yearsArray) => {
  // Get the options list element correctly
  const optionsListElement = document.getElementById("options-list");
  const customSelectElement = document.getElementById("custom-select");

  if (!optionsListElement) {
    console.error("Options list element not found for years dropdown");
    return;
  }

  // Clear the selected years on page load
  if (!window.yearSelectionsInitialized) {
    resetSelectedYearsFromLocalStorage();
    selectedYears_Set.clear();
    window.yearSelectionsInitialized = true;
  }

  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage();

  if (Array.isArray(storedYears)) {
    selectedYears_Set = new Set(storedYears);
  }

  // Clear existing content
  optionsListElement.innerHTML = "";

  // Sort years in descending order
  yearsArray.sort((a, b) => b - a);

  // Update custom select text based on selected years
  const updateCustomSelectText = () => {
    if (customSelectElement) {
      const selectedYearsArray = Array.from(selectedYears_Set);
      if (selectedYearsArray.length === 0) {
        customSelectElement.textContent = "Select Years";
      } else if (selectedYearsArray.length === 1) {
        customSelectElement.textContent = `Year: ${selectedYearsArray[0]}`;
      } else {
        customSelectElement.textContent = `Years: ${selectedYearsArray.join(', ')}`;
      }
    }
  };

  // Add year options
  yearsArray.forEach((year) => {
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${year}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${year}`);
    newInput.setAttribute(
      "class",
      `form-checkbox h-4 w-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-300 dark:border-gray-500 mr-2 cursor-pointer`
    );
    newInput.setAttribute("value", year);
    newInput.checked = selectedYears_Set.has(year);

    newInput.addEventListener("change", (e) => {
      const checkbox = e.target;
      const year = checkbox.value;

      if (checkbox.checked) {
        selectedYears_Set.add(year);
      } else {
        selectedYears_Set.delete(year);
      }

      // Update local storage
      const selectedYearsArray = Array.from(selectedYears_Set).sort((a, b) => a - b);
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));

      // Update custom select text
      updateCustomSelectText();
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = year;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListElement.appendChild(newLabel);
  });

  // Initial update of custom select text
  updateCustomSelectText();
};

// Call during DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Existing dropdown and filter initialization code
  function initializeFilterTriggers() {
    // Modify existing filter triggers to use a centralized trigger method
    const triggerFilterChange = () => {
      const event = new CustomEvent('filtersChanged');
      document.dispatchEvent(event);
    };

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
          triggerFilterChange();
        });
      });
    });

    // Track changes to region selections
    const regionCheckboxes = document.querySelectorAll(
      "#options-list-region input[type='checkbox']"
    );
    regionCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", triggerFilterChange);
    });

    // Track changes to type selections
    const typeCheckboxes = document.querySelectorAll(
      "#options-list-type input[type='checkbox']"
    );
    typeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", triggerFilterChange);
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

        slider.addEventListener("input", triggerFilterChange);
      }
    });
  }

  // Call this at the end of the DOMContentLoaded event
  initializeFilterTriggers();

  // Existing logging of filter changes
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

// Additional slider event listeners (fallback)
const givingMinInput = document.getElementById("givingUnitsMin");
const givingMaxInput = document.getElementById("givingUnitsMax");
const missionMinInput = document.getElementById("missionUnitsMin");
const missionMaxInput = document.getElementById("missionUnitsMax");

if (givingMinInput) {
  givingMinInput.addEventListener("input", function () {
    window.sliderValue = Math.min(parseInt(this.value) || 0, window.sliderValue2);
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

if (givingMaxInput) {
  givingMaxInput.addEventListener("input", function () {
    window.sliderValue2 = Math.max(parseInt(this.value) || 25000, window.sliderValue);
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

if (missionMinInput) {
  missionMinInput.addEventListener("input", function () {
    window.missionValue = Math.min(parseInt(this.value) || 0, window.missionValue2);
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}

if (missionMaxInput) {
  missionMaxInput.addEventListener("input", function () {
    window.missionValue2 = Math.max(parseInt(this.value) || 10000, window.missionValue);
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  });
}