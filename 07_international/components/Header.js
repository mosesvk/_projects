const customSelectElement = document.getElementById("custom-select");
const optionsListElement = document.getElementById("options-list");
const sidebarElement = document.getElementById("sidebar");
const backdropElement = document.getElementById("sidebarBackdrop");

const customSelectRegionElement = document.getElementById(
  "custom-select-region"
);
const customSelectTypeElement = document.getElementById("custom-select-type");

const optionsListRegionElement = document.getElementById("options-list-region");
const optionsListTypeElement = document.getElementById("options-list-type");

customSelectElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectElement
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListElement.classList.toggle("invisible");
  }
});

customSelectRegionElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectRegion
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListRegionElement.classList.toggle("invisible"); // Corrected class name
  }
});
customSelectTypeElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectTypeElement
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListTypeElement.classList.toggle("invisible");
  }
});

document.addEventListener("click", (event) => {
  if (
    !customSelectElement.contains(event.target) &&
    !optionsListElement.contains(event.target)
  ) {
    optionsListElement.classList.add("invisible");
  }

  if (
    !optionsListRegionElement.contains(event.target) &&
    !customSelectRegionElement.contains(event.target)
  ) {
    optionsListRegionElement.classList.add("invisible");
  }

  if (
    !customSelectTypeElement.contains(event.target) &&
    !optionsListTypeElement.contains(event.target)
  ) {
    optionsListTypeElement.classList.add("invisible");
  }
});

// const addUniqueRegionsToOptionsSelectRegionsDropdown = (regionArray) => {
//   const optionsListRegion = document.getElementById("options-list-region");

//   regionArray.forEach((regionObject, index) => {
//     const regionName = regionObject.arr[0];
//     const regionString = regionObject.str;

//     const newLabel = document.createElement("label");
//     newLabel.setAttribute("for", `option-${regionString}`);
//     newLabel.setAttribute(
//       "class",
//       "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//     );

//     const newInput = document.createElement("input");
//     newInput.setAttribute("type", "radio");
//     newInput.setAttribute("name", "region"); // Set the same name for all radio inputs
//     newInput.setAttribute("id", `option-${regionString}`);
//     newInput.setAttribute(
//       "class",
//       "form-radio h-4 w-4 text-gray-600 mr-2 rounded"
//     );
//     newInput.setAttribute("value", regionString);

//     // Check the first radio button by default
//     if (index === 0) {
//       newInput.checked = true;
//       selectedRegion = regionString; // Set the selected region initially
//     }

//     // Add an onChange event to the input element
//     newInput.addEventListener("change", function () {
//       if (newInput.checked) {
//         // Set the selected region when changed
//         selectedRegion = regionString;
//       }
//     });

//     const newSpan = document.createElement("span");
//     newSpan.innerText = regionName;

//     newLabel.appendChild(newInput);
//     newLabel.appendChild(newSpan);

//     optionsListRegion.appendChild(newLabel);
//   });
// };

const addUniqueRegionsToOptionsSelectRegionsDropdown = (regionArray) => {
  const optionsListRegion = document.getElementById("options-list-region");

  regionArray.forEach((regionObject, index) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${regionString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("name", "region"); // Set the same name for all checkboxes
    newInput.setAttribute("id", `option-${regionString}`);
    newInput.setAttribute(
      "class",
      "form-checkbox h-4 w-4 text-gray-600 mr-2 rounded"
    );
    newInput.setAttribute("value", regionString);

    // Add the value to selectedTypes_Array and check the input by default
    selectedRegions_Array.push(regionString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        // Handle when the region is selected
        selectedRegions_Array.push(regionString);
      } else {
        // Handle when the region is deselected
        const index = selectedRegions_Array.indexOf(regionString);
        if (index > -1) {
          selectedRegions_Array.splice(index, 1);
        }
      }
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = regionName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListRegion.appendChild(newLabel);
  });
};


const addUniqueTypesToOptionsSelectTypeDropdown = (typeArray) => {
  const optionsListType = document.getElementById("options-list-type");

  typeArray.forEach((typeObject, index) => {
    const typeName = typeObject.arr[0];
    const typeString = typeObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${typeString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${typeString}`);
    newInput.setAttribute(
      "class",
      "form-checkbox h-4 w-4 text-gray-600 mr-2 rounded"
    );
    newInput.setAttribute("value", typeString);

    // Add the value to selectedTypes_Array and check the input by default
    selectedTypes_Array.push(typeString);
    newInput.checked = true;

    // Add an onChange event to the input element
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        // Handle when the type is selected
        selectedTypes_Array.push(typeString);
      } else {
        // Handle when the type is deselected
        const index = selectedTypes_Array.indexOf(typeString);
        if (index > -1) {
          selectedTypes_Array.splice(index, 1);
        }
      }
    });

    const newSpan = document.createElement("span");
    newSpan.innerText = typeName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListType.appendChild(newLabel);
  });
};

adjustDivHeight();

window.addEventListener("resize", adjustDivHeight);
