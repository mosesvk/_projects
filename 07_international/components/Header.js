const customSelectElement = document.getElementById("custom-select");
const optionsListElement = document.getElementById("options-list");
const sidebarElement = document.getElementById("sidebar");
const backdropElement = document.getElementById("sidebarBackdrop");

const customSelectRegionElement = document.getElementById(
  "custom-select-region"
);
const customSelectTypeElement = document.getElementById("custom-select-type");
const customSelectClientElement = document.getElementById(
  "custom-select-client"
);

const optionsListRegionElement = document.getElementById("options-list-region");
const optionsListTypeElement = document.getElementById("options-list-type");
const optionsListClientElement = document.getElementById("options-list-client");

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
customSelectClientElement.addEventListener("click", (event) => {
  // Check if the click target is not a checkbox inside the customSelectTypeElement
  if (
    !event.target.closest(".form-checkbox") &&
    !event.target.closest("label")
  ) {
    optionsListClientElement.classList.toggle("invisible");
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

  if (
    !customSelectClientElement.contains(event.target) &&
    !optionsListClientElement.contains(event.target)
  ) {
    optionsListClientElement.classList.add("invisible");
  }
});

const addUniqueRegionsToOptionsSelectRegionsDropdown = (regionArray) => {
  const optionsListRegion = document.getElementById("options-list-region");

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListRegion.appendChild(selectAllLabel);

  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const regionCheckboxes = document.querySelectorAll(
      "#options-list-region input[type='checkbox']"
    );
    regionCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
      const regionString = checkbox.value;
      if (isChecked) {
        selectedRegions_Array.add(regionString);
      } else {
        selectedRegions_Array.delete(regionString);
      }
    });
  });

  regionArray.forEach((regionObject, index) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", `option-${regionString}`);
    newLabel.setAttribute(
      "class",
      "flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("id", `option-${regionString}`);
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
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        selectedRegions_Array.add(regionString);
      } else {
        selectedRegions_Array.delete(regionString);
      }
      // Update "Select All" checkbox based on individual checkboxes
      const allChecked = Array.from(document.querySelectorAll("#options-list-region input[type='checkbox']"))
        .slice(1) // Exclude the "Select All" checkbox
        .every(input => input.checked);
      selectAllInput.checked = allChecked;
    });
  });
};

const addUniqueTypesToOptionsSelectTypeDropdown = (typeArray) => {
  const optionsListType = document.getElementById("options-list-type");

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-type");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-type");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-type");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListType.appendChild(selectAllLabel);

  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const typeCheckboxes = document.querySelectorAll(
      "#options-list-type input[type='checkbox']"
    );
    typeCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
      const typeString = checkbox.value;
      if (isChecked) {
        selectedTypes_Array.add(typeString);
      } else {
        selectedTypes_Array.delete(typeString);
      }
    });
  });

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
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        selectedTypes_Array.add(typeString);
      } else {
        selectedTypes_Array.delete(typeString);
      }
      // Update "Select All" checkbox based on individual checkboxes
      const allChecked = Array.from(document.querySelectorAll("#options-list-type input[type='checkbox']"))
        .slice(1) // Exclude the "Select All" checkbox
        .every(input => input.checked);
      selectAllInput.checked = allChecked;
    });
  });
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////

const addUniqueClientsToOptionsSelectClientDropdown = (clientSet) => {
  const optionsListClient = document.getElementById("options-list-client");
  const searchInput = document.getElementById("input-group-search");

  // Function to filter clients based on search input
  const filterClients = () => {
    const searchValue = searchInput.value.toLowerCase();
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
  searchInput.addEventListener("input", filterClients);

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement("label");
  selectAllLabel.setAttribute("for", "select-all-checkbox-client");
  selectAllLabel.setAttribute(
    "class",
    "flex items-center justify-start px-4 py-2 cursor-pointer truncate"
  );

  const selectAllInput = document.createElement("input");
  selectAllInput.setAttribute("type", "checkbox");
  selectAllInput.setAttribute("id", "select-all-checkbox-client");
  selectAllInput.setAttribute(
    "class",
    "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
  );
  selectAllInput.checked = true; // Check "Select All" by default

  const selectAllSpan = document.createElement("span");
  selectAllSpan.setAttribute("id", "select-all-text-client");
  selectAllSpan.innerText = "(select all)";
  selectAllSpan.setAttribute("class", "text-lg font-semibold");

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListClient.insertBefore(selectAllLabel, optionsListClient.children[1]);

  selectAllInput.addEventListener("change", function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const clientCheckboxes = document.querySelectorAll(
      "#options-list-client input[type='checkbox']"
    );
    clientCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
      const clientString = checkbox.value;
      if (isChecked) {
        selectedClients_Array.add(clientString);
      } else {
        selectedClients_Array.delete(clientString);
      }
    });
  });

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
    newInput.addEventListener("change", function () {
      if (newInput.checked) {
        selectedClients_Array.add(clientString);
      } else {
        selectedClients_Array.delete(clientString);
      }
      // Update "Select All" checkbox based on individual checkboxes
      const allChecked = Array.from(document.querySelectorAll("#options-list-client input[type='checkbox']"))
        .slice(1) // Exclude the "Select All" checkbox
        .every(input => input.checked);
      selectAllInput.checked = allChecked;
    });
  });
};

adjustDivHeight();

window.addEventListener("resize", adjustDivHeight);
