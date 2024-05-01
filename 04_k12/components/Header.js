

const optionsButton = document.querySelector(
  '[data-modal-toggle="options_modal"]'
);
const optionsModal = document.getElementById("options_modal");
const printModal = document.getElementById("print_modal");

let backdropRemoved = false; // Flag to track whether the backdrop is removed

// Function to remove all backdrop elements
const removeBackdrops = () => {
  // console.log("removeBackdrop");
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
    // console.log(radio);
    radio.addEventListener("change", function () {
      const labels = document.querySelectorAll(`label[for="${this.id}"]`);
      labels.forEach((label) => {
        const checkIcon = label.querySelector(".check-icon");
        if (this.checked) {
          checkIcon.classList.remove("hidden");
        } else {
          checkIcon.classList.add("hidden");
        }
      });
    });
  });
};

// Call the function to add checkmark dynamically to selected option
addCheckmarkToSelectedOption();
