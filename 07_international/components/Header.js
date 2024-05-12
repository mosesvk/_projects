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

const addUniqueClientsToOptionsSelectClientDropdown = (clientSet) => {
  const optionsListClient = document.getElementById("options-list-client");
  const searchInput = document.getElementById("input-group-search");
  const selectedClients_Array = []; // Initialize selected clients array

  // Initialize selectedClients_Array with all client names
  clientSet.forEach((clientString) => {
    selectedClients_Array.push(clientString);
  });

  // Function to filter clients based on search input
  const filterClients = () => {
    const searchValue = searchInput.value.toLowerCase();
    const clients = optionsListClient.querySelectorAll("label");
    clients.forEach((client) => {
      // Check if the label is associated with the search input
      if (client.getAttribute("for") !== "input-group-search") {
        const clientName = client.innerText.toLowerCase();
        const listItem = client.parentElement; // Get the parent list item
        if (clientName.includes(searchValue)) {
          listItem.style.display = "block"; // Show the list item
        } else {
          listItem.style.display = "none"; // Hide the list item
        }
      }
    });
  };

  // Event listener for search input
  searchInput.addEventListener("input", filterClients);

  // Event listener for input elements to update selectedClients_Array
  optionsListClient.addEventListener("change", (event) => {
    const selectedInput = event.target;
    const selectedLabel = selectedInput.nextElementSibling;
    const clientName = selectedLabel.innerText;
    if (selectedInput.checked) {
      // If input is checked, add client name to selectedClients_Array
      selectedClients_Array.push(clientName);
    } else {
      // If input is unchecked, remove client name from selectedClients_Array
      const index = selectedClients_Array.indexOf(clientName);
      if (index > -1) {
        selectedClients_Array.splice(index, 1);
      }
    }
    console.log(selectedClients_Array); // For testing purposes
  });

  // Generate client checkboxes
  clientSet.forEach((clientString) => {
    const newListItem = document.createElement("li");
    newListItem.style.listStyleType = "none"; // Remove list-style-type

    const newDiv = document.createElement("div");
    newDiv.setAttribute(
      "class",
      "flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    );

    const newInput = document.createElement("input");
    newInput.setAttribute("id", `client_${clientString}`);
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("value", "");
    newInput.setAttribute(
      "class",
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    );

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
  });
};

adjustDivHeight();

window.addEventListener("resize", adjustDivHeight);
