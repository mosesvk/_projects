const optionsButton = document.querySelector(
  '[data-modal-toggle="options_modal"]'
);
const optionsModal = document.getElementById("options_modal");
const printModal = document.getElementById("print_modal");

// Initialize slider default values (match 05_cfhi_comp)
window.sliderValue = 0;
window.sliderValue2 = 25000;

let backdropRemoved = false; // Flag to track whether the backdrop is removed

/**
 * Moves focus out of the options modal to the trigger button so that
 * aria-hidden can be set without leaving focus on a hidden element
 * (fixes "Blocked aria-hidden" accessibility warning).
 */
const returnFocusFromOptionsModal = () => {
  const active = document.activeElement;
  if (optionsModal && active && optionsModal.contains(active) && optionsButton) {
    optionsButton.focus();
  }
};

// Function to remove all backdrop elements
const removeBackdrops = () => {
  // console.log("removeBackdrop");
  returnFocusFromOptionsModal();
  const backdrops = document.querySelectorAll("[modal-backdrop]");
  backdrops.forEach((backdrop) => {
    backdrop.remove();
  });

  optionsModal.setAttribute("aria-hidden", "true");
  optionsModal.removeAttribute("aria-modal");
  optionsModal.removeAttribute("role");

  backdropRemoved = true;
};

// Function to add the backdrop
const addBackdrop = () => {
  // console.log("addBackdrop");
  // optionsModal.setAttribute("role", "dialog");

  const backdrop = document.createElement("div");
  backdrop.setAttribute("modal-backdrop", "");
  backdrop.classList.add(
    "bg-gray-900/50",
    "dark:bg-gray-900/80",
    "fixed",
    "inset-0",
    "z-40"
  );

  document.body.appendChild(backdrop);

  backdropRemoved = false;
};

// Function to toggle the options modal
const toggleOptionsModal = () => {
  // console.log('toggleOptionModal', backdropRemoved);
  if (backdropRemoved) {
    addBackdrop();
  }
};

optionsButton.addEventListener("click", toggleOptionsModal);

// When the options modal is hidden (by Flowbite or any code), return focus so
// aria-hidden does not hide the focused element (fixes accessibility warning).
if (optionsModal && optionsButton) {
  const modalObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "aria-hidden" && optionsModal.getAttribute("aria-hidden") === "true") {
        returnFocusFromOptionsModal();
        break;
      }
      if (m.attributeName === "class" && optionsModal.classList.contains("hidden")) {
        returnFocusFromOptionsModal();
        break;
      }
    }
  });
  modalObserver.observe(optionsModal, { attributes: true, attributeFilter: ["aria-hidden", "class"] });

  // Return focus before Flowbite closes the modal (backdrop click / Escape) to avoid aria-hidden warning.
  document.addEventListener(
    "click",
    (e) => {
      if (e.target && (e.target.hasAttribute("modal-backdrop") || e.target.closest("[modal-backdrop]"))) {
        returnFocusFromOptionsModal();
      }
    },
    true
  );
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && optionsModal && !optionsModal.classList.contains("hidden")) {
        returnFocusFromOptionsModal();
      }
    },
    true
  );
}

const customSelectElement = document.getElementById("custom-select");
const optionsListElement = document.getElementById("options-list");
const sidebarElement = document.getElementById("sidebar");
const backdropElement = document.getElementById("sidebarBackdrop");

const customSelectSchoolChurchElement = document.getElementById(
  "custom-select-schoolChurch"
);
const optionsListSchoolChurchElement = document.getElementById(
  "options-list-schoolChurch"
);

customSelectElement.addEventListener("click", (event) => {
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListElement.classList.toggle("invisible");
  }
});
// customSelectSchoolChurchElement.addEventListener("click", (event) => {
//   if (
//     !event.target.closest(".form-checkbox") &&
//     !event.target.closest("label")
//   ) {
//     optionsListSchoolChurchElement.classList.toggle("invisible");
//   }
// });

document.addEventListener("click", (event) => {
  if (
    !customSelectElement.contains(event.target) &&
    !optionsListElement.contains(event.target)
  ) {
    optionsListElement.classList.add("invisible");
  }

  // if (
  //   !optionsListSchoolChurchElement.contains(event.target) &&
  //   !customSelectSchoolChurchElement.contains(event.target)
  // ) {
  //   optionsListSchoolChurchElement.classList.add("invisible");
  // }
});

const addUniqueSchoolChurchToOptionsSelectRegion = (SchoolChurchArray) => {
  const optionsListSchoolChurch = document.getElementById(
    "options-list-schoolChurch"
  );

  SchoolChurchArray.forEach((regionObject) => {
    const regionName = regionObject.arr[0];
    const SchoolChurchString = regionObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${SchoolChurchString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${SchoolChurchString}`);
    newInput.setAttribute(
      "class",
      "form-checkbox h-4 w-4 text-gray-600 mr-2 rounded"
    );
    newInput.setAttribute("value", SchoolChurchString);

    // Add the value to selectedSchoolChurch_Array and check the input by default
    selectedSchoolChurch_Array.push(SchoolChurchString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        // Handle when the region is selected
        selectedSchoolChurch_Array.push(SchoolChurchString);
      } else {
        // Handle when the region is deselected
        const index = selectedSchoolChurch_Array.indexOf(SchoolChurchString);
        if (index > -1) {
          selectedSchoolChurch_Array.splice(index, 1);
        }
      }
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListSchoolChurch.appendChild(newLabel);
  });
};

adjustDivHeight();

window.addEventListener("resize", adjustDivHeight);

const addCheckmarkToSelectedOption = () => {
  const radioButtons = document.querySelectorAll(
    'input[type="radio"][name="schoolChurch"]'
  );

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      const labels = document.querySelectorAll(`label[for="${this.id}"]`);
      labels.forEach((label) => {
        const checkIcon = label.querySelector(".check-icon");
        if (checkIcon) {
          if (this.checked) {
            checkIcon.classList.remove("hidden");
          } else {
            checkIcon.classList.add("hidden");
          }
        }
      });

      if (typeof getSelectedSchoolChurchOption === "function") {
        getSelectedSchoolChurchOption();
      }
      document.dispatchEvent(new CustomEvent("filtersChanged"));
    });
  });
};

// Call the function to add checkmark dynamically to selected option
addCheckmarkToSelectedOption();

// Enrollment range slider: match 05_cfhi_comp Giving Units (run after DOM + Alpine ready)
document.addEventListener("DOMContentLoaded", function () {
  function setupSliderReleaseListeners() {
    const sliderContainer = document.querySelector('[x-data="range()"]');
    if (sliderContainer) {
      const rangeInputs = sliderContainer.querySelectorAll('input[type="range"]');
      rangeInputs.forEach((rangeInput) => {
        rangeInput.addEventListener("mouseup", function () {
          document.dispatchEvent(new CustomEvent("filtersChanged"));
        });
        rangeInput.addEventListener("touchend", function () {
          document.dispatchEvent(new CustomEvent("filtersChanged"));
        });
        rangeInput.addEventListener("change", function () {
          document.dispatchEvent(new CustomEvent("filtersChanged"));
        });
      });
    }
  }
  setTimeout(setupSliderReleaseListeners, 100);

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
      defaultValue: 25000,
      sliderDivs: document.querySelectorAll(".givingUnitsSlider"),
    },
  ];

  sliderInputs.forEach((slider) => {
    if (slider.element) {
      slider.element.value = window[slider.globalVar];
    }
  });

  function triggerFiltersChanged(sliderInfo) {
    document.dispatchEvent(new CustomEvent("filtersChanged"));
  }

  sliderInputs.forEach((slider) => {
    if (slider.element) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            window[slider.globalVar] =
              parseInt(String(slider.element.value).replace(/[^\d]/g, ""), 10) || slider.defaultValue;
            triggerFiltersChanged(slider);
          }
        });
      });
      observer.observe(slider.element, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  });

  function initializeEnrollmentSliderValues() {
    const sliders = [
      document.getElementById("givingUnitsMin"),
      document.getElementById("givingUnitsMax"),
    ];
    sliders.forEach((slider) => {
      if (slider) {
        slider.value =
          slider.id === "givingUnitsMin"
            ? window.sliderValue
            : window.sliderValue2;
      }
    });
  }
  initializeEnrollmentSliderValues();
});

/**
 * Listen for filtersChanged event (enrollment range, school/church, etc.)
 * Show toast with unique clients info, matching church project behavior.
 * Debounced to avoid toast spam when dragging the slider.
 */
let filtersChangedToastTimeout = null;
document.addEventListener("filtersChanged", function () {
  if (typeof createToastSuccess !== "function") return;

  if (filtersChangedToastTimeout) clearTimeout(filtersChangedToastTimeout);
  filtersChangedToastTimeout = setTimeout(() => {
    filtersChangedToastTimeout = null;
    const count = window.lastRunUniqueClientCount;

    if (count != null) {
      createToastSuccess(
        `Filters updated. Peer group: ${count} unique clients match filters.`
      );
    } else {
      createToastSuccess("Filters updated. Click Run to load data.");
    }
  }, 150);
});
