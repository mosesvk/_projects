const sidebarElement = document.getElementById ('sidebar');
const backdropElement = document.getElementById ('sidebarBackdrop');

const customSelectYearElement = document.getElementById ('custom-select-year');
const customSelectRegionElement = document.getElementById (
  'custom-select-region'
);
const customSelectStateElement = document.getElementById (
  'custom-select-state'
);
const customSelectMembershipElement = document.getElementById (
  'custom-select-membership'
);
const customSelectClientElement = document.getElementById (
  'custom-select-client'
);
const customSelectTypeElement = document.getElementById ('custom-select-type');
const customSelectAthleticElement = document.getElementById (
  'custom-select-athletic'
);
const customSelectTrendlineElement = document.getElementById (
  'custom-select-trendline'
);

const optionsListYearElement = document.getElementById ('options-list-year');
const optionsListRegionElement = document.getElementById (
  'options-list-region'
);
const optionsListStateElement = document.getElementById ('options-list-state');
const optionsListMembershipElement = document.getElementById (
  'options-list-membership'
);
const optionsListClientElement = document.getElementById (
  'options-list-client'
);
const optionsListTypeElement = document.getElementById ('options-list-type');
const optionsListAthleticElement = document.getElementById (
  'options-list-athletic'
);
const optionsListTrendlineElement = document.getElementById (
  'options-list-trendline'
);

customSelectYearElement.addEventListener ('click', event => {
  // Check if the click target is not a checkbox inside the customSelectYearElement
  if (
    !event.target.closest ('.form-checkbox') &&
    !event.target.closest ('label')
  ) {
    optionsListYearElement.classList.toggle ('invisible');
  }
});
customSelectRegionElement.addEventListener ('click', event => {
  // Check if the click target is not a checkbox inside the customSelectRegion
  if (
    !event.target.closest ('.form-checkbox') &&
    !event.target.closest ('label')
  ) {
    optionsListRegionElement.classList.toggle ('invisible'); // Corrected class name
  }
});
customSelectStateElement.addEventListener ('click', event => {
  // Check if the click target is not a checkbox inside the customSelectTypeElement
  if (
    !event.target.closest ('.form-checkbox') &&
    !event.target.closest ('label')
  ) {
    optionsListStateElement.classList.toggle ('invisible');
  }
});
customSelectMembershipElement.addEventListener ('click', event => {
  // Check if the click target is not a checkbox inside the customSelectMembershipElement
  if (
    !event.target.closest ('.form-checkbox') &&
    !event.target.closest ('label')
  ) {
    optionsListMembershipElement.classList.toggle ('invisible');
  }
});
customSelectClientElement.addEventListener ('click', event => {
  // Check if the click target is not a checkbox inside the customSelectClientElement
  if (
    !event.target.closest ('.form-checkbox') &&
    !event.target.closest ('label')
  ) {
    optionsListClientElement.classList.toggle ('invisible');
  }
});
customSelectTypeElement.addEventListener('click', event => {
  // Check if the click target is not a checkbox inside the customSelectTypeElement
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsListTypeElement.classList.toggle('invisible');
  }
});
customSelectAthleticElement.addEventListener('click', event => {
  // Check if the click target is not a checkbox inside the customSelectAthleticElement
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsListAthleticElement.classList.toggle('invisible');
  }
});
customSelectTrendlineElement.addEventListener('click', event => {
  // Check if the click target is not a checkbox inside the customSelectTrendlineElement
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsListTrendlineElement.classList.toggle('invisible');
  }
});


document.addEventListener ('click', event => {
  if (
    !customSelectYearElement.contains (event.target) &&
    !optionsListYearElement.contains (event.target)
  ) {
    optionsListYearElement.classList.add ('invisible');
  }

  if (
    !optionsListRegionElement.contains (event.target) &&
    !customSelectRegionElement.contains (event.target)
  ) {
    optionsListRegionElement.classList.add ('invisible');
  }

  if (
    !customSelectStateElement.contains (event.target) &&
    !optionsListStateElement.contains (event.target)
  ) {
    optionsListStateElement.classList.add ('invisible');
  }

  if (
    !customSelectMembershipElement.contains (event.target) &&
    !optionsListMembershipElement.contains (event.target)
  ) {
    optionsListMembershipElement.classList.add ('invisible');
  }

  if (
    !customSelectClientElement.contains (event.target) &&
    !optionsListClientElement.contains (event.target)
  ) {
    optionsListClientElement.classList.add ('invisible');
  }

  if (
    !customSelectTypeElement.contains(event.target) &&
    !optionsListTypeElement.contains(event.target)
  ) {
    optionsListTypeElement.classList.add('invisible');
  }
  
  if (
    !customSelectAthleticElement.contains(event.target) &&
    !optionsListAthleticElement.contains(event.target)
  ) {
    optionsListAthleticElement.classList.add('invisible');
  }
  
  if (
    !customSelectTrendlineElement.contains(event.target) &&
    !optionsListTrendlineElement.contains(event.target)
  ) {
    optionsListTrendlineElement.classList.add('invisible');
  }
  
});

const addUniqueRegionsToOptionsSelectRegionsDropdown = regionArray => {
  const optionsListRegion = document.getElementById ('options-list-region');

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement ('label');
  selectAllLabel.setAttribute ('for', 'select-all-checkbox-region');
  selectAllLabel.setAttribute (
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement ('input');
  selectAllInput.setAttribute ('type', 'checkbox');
  selectAllInput.setAttribute ('id', 'select-all-checkbox-region');
  selectAllInput.setAttribute (
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement ('span');
  selectAllSpan.setAttribute ('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

  selectAllLabel.appendChild (selectAllInput);
  selectAllLabel.appendChild (selectAllSpan);

  optionsListRegion.appendChild (selectAllLabel);

  selectAllInput.addEventListener ('change', function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const regionCheckboxes = document.querySelectorAll (
      "#options-list-region input[type='checkbox']"
    );
    regionCheckboxes.forEach (checkbox => {
      checkbox.checked = isChecked;
    });
  });

  regionArray.forEach ((regionObject, index) => {
    const regionName = regionObject.arr[0];
    const regionString = regionObject.str;

    const newLabel = document.createElement ('label');
    newLabel.setAttribute ('for', `option-${regionString}`);
    newLabel.setAttribute (
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate'
    );

    const newInput = document.createElement ('input');
    newInput.setAttribute ('type', 'checkbox');
    newInput.setAttribute ('id', `option-${regionString}`);
    newInput.setAttribute (
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute ('value', regionString);

    // Add the value to selectedRegions_Array and check the input by default
    selectedRegions_Array.add (regionString);
    newInput.checked = false;

    const newSpan = document.createElement ('span');
    newSpan.innerText = regionName;

    newLabel.appendChild (newInput);
    newLabel.appendChild (newSpan);

    optionsListRegion.appendChild (newLabel);
  });

  // Add event listeners to other checkboxes
  const regionLabels = document.querySelectorAll ('#options-list-region label');
  regionLabels.forEach ((label, index) => {
    const input = label.querySelector ('input');
    const regionString = label.querySelector ('input').value;

    input.addEventListener ('change', function () {
      if (input.checked && !selectedRegions_Array.has (regionString)) {
        // Handle when the region is selected
        selectedRegions_Array.add (regionString);
      } else if (input.checked && selectedRegions_Array.has (regionString)) {
        // loop through regionLabels again to find any unchecked inputs, if so, delete from selectedRegions_Array
        regionLabels.forEach (label => {
          const input = label.querySelector ('input');
          const regionString = label.querySelector ('input').value;
          if (!input.checked) {
            selectedRegions_Array.delete (regionString);
          }
        });
      } else {
        selectedRegions_Array.delete (regionString);
        // check if all inputs are unchecked, if so, make sure selectedRegions_Array contains all regions
        let allUnchecked = true;
        regionLabels.forEach (label => {
          const input = label.querySelector ('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          regionLabels.forEach (label => {
            const regionString = label.querySelector ('input').value;
            selectedRegions_Array.add (regionString);
          });
        }
      }
    });
  });
};

const addUniqueStatesToOptionsSelectStatesDropdown = stateArray => {
  const optionsListState = document.getElementById ('options-list-state');

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement ('label');
  selectAllLabel.setAttribute ('for', 'select-all-checkbox-state');
  selectAllLabel.setAttribute (
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement ('input');
  selectAllInput.setAttribute ('type', 'checkbox');
  selectAllInput.setAttribute ('id', 'select-all-checkbox-state');
  selectAllInput.setAttribute (
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement ('span');
  selectAllSpan.setAttribute ('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

  selectAllLabel.appendChild (selectAllInput);
  selectAllLabel.appendChild (selectAllSpan);

  optionsListState.appendChild (selectAllLabel);

  selectAllInput.addEventListener ('change', function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const stateCheckboxes = document.querySelectorAll (
      "#options-list-state input[type='checkbox']"
    );
    stateCheckboxes.forEach (checkbox => {
      checkbox.checked = isChecked;
    });
  });

  stateArray.forEach ((stateObject, index) => {
    const stateName = stateObject.arr[0];
    const stateString = stateObject.str;

    const newLabel = document.createElement ('label');
    newLabel.setAttribute ('for', `option-${stateString}`);
    newLabel.setAttribute (
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate'
    );

    const newInput = document.createElement ('input');
    newInput.setAttribute ('type', 'checkbox');
    newInput.setAttribute ('id', `option-${stateString}`);
    newInput.setAttribute (
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute ('value', stateString);

    // Add the value to selectedStates_Array and check the input by default
    selectedStates_Array.add (stateString);
    newInput.checked = false;

    const newSpan = document.createElement ('span');
    newSpan.innerText = stateName;

    newLabel.appendChild (newInput);
    newLabel.appendChild (newSpan);

    optionsListState.appendChild (newLabel);
  });

  // Add event listeners to other checkboxes
  const stateLabels = document.querySelectorAll ('#options-list-state label');
  stateLabels.forEach ((label, index) => {
    const input = label.querySelector ('input');
    const stateString = label.querySelector ('input').value;

    input.addEventListener ('change', function () {
      if (input.checked && !selectedStates_Array.has (stateString)) {
        // Handle when the state is selected
        selectedStates_Array.add (stateString);
      } else if (input.checked && selectedStates_Array.has (stateString)) {
        // loop through stateLabels again to find any unchecked inputs, if so, delete from selectedStates_Array
        stateLabels.forEach (label => {
          const input = label.querySelector ('input');
          const stateString = label.querySelector ('input').value;
          if (!input.checked) {
            selectedStates_Array.delete (stateString);
          }
        });
      } else {
        selectedStates_Array.delete (stateString);
        // check if all inputs are unchecked, if so, make sure selectedStates_Array contains all states
        let allUnchecked = true;
        stateLabels.forEach (label => {
          const input = label.querySelector ('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          stateLabels.forEach (label => {
            const stateString = label.querySelector ('input').value;
            selectedStates_Array.add (stateString);
          });
        }
      }
    });
  });
};

const addUniqueMembershipsToOptionsSelectMembershipsDropdown = membershipArray => {
  const optionsListMembership = document.getElementById (
    'options-list-membership'
  );

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement ('label');
  selectAllLabel.setAttribute ('for', 'select-all-checkbox-membership');
  selectAllLabel.setAttribute (
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement ('input');
  selectAllInput.setAttribute ('type', 'checkbox');
  selectAllInput.setAttribute ('id', 'select-all-checkbox-membership');
  selectAllInput.setAttribute (
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement ('span');
  selectAllSpan.setAttribute ('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

  selectAllLabel.appendChild (selectAllInput);
  selectAllLabel.appendChild (selectAllSpan);

  optionsListMembership.appendChild (selectAllLabel);

  selectAllInput.addEventListener ('change', function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const membershipCheckboxes = document.querySelectorAll (
      "#options-list-membership input[type='checkbox']"
    );
    membershipCheckboxes.forEach (checkbox => {
      checkbox.checked = isChecked;
    });
  });

  membershipArray.forEach ((membershipObject, index) => {
    const membershipName = membershipObject.arr[0];
    const membershipString = membershipObject.str;

    const newLabel = document.createElement ('label');
    newLabel.setAttribute ('for', `option-${membershipString}`);
    newLabel.setAttribute (
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate'
    );

    const newInput = document.createElement ('input');
    newInput.setAttribute ('type', 'checkbox');
    newInput.setAttribute ('id', `option-${membershipString}`);
    newInput.setAttribute (
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute ('value', membershipString);

    // Add the value to selectedMemberships_Array and check the input by default
    selectedMemberships_Array.add (membershipString);
    newInput.checked = false;

    const newSpan = document.createElement ('span');
    newSpan.innerText = membershipName;

    newLabel.appendChild (newInput);
    newLabel.appendChild (newSpan);

    optionsListMembership.appendChild (newLabel);
  });

  // Add event listeners to other checkboxes
  const membershipLabels = document.querySelectorAll (
    '#options-list-membership label'
  );
  membershipLabels.forEach ((label, index) => {
    const input = label.querySelector ('input');
    const membershipString = label.querySelector ('input').value;

    input.addEventListener ('change', function () {
      if (input.checked && !selectedMemberships_Array.has (membershipString)) {
        // Handle when the membership is selected
        selectedMemberships_Array.add (membershipString);
      } else if (
        input.checked &&
        selectedMemberships_Array.has (membershipString)
      ) {
        // loop through membershipLabels again to find any unchecked inputs, if so, delete from selectedMemberships_Array
        membershipLabels.forEach (label => {
          const input = label.querySelector ('input');
          const membershipString = label.querySelector ('input').value;
          if (!input.checked) {
            selectedMemberships_Array.delete (membershipString);
          }
        });
      } else {
        selectedMemberships_Array.delete (membershipString);
        // check if all inputs are unchecked, if so, make sure selectedMemberships_Array contains all memberships
        let allUnchecked = true;
        membershipLabels.forEach (label => {
          const input = label.querySelector ('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          membershipLabels.forEach (label => {
            const membershipString = label.querySelector ('input').value;
            selectedMemberships_Array.add (membershipString);
          });
        }
      }
    });
  });
};

const addUniqueClientsToOptionsSelectClientsDropdown = clientArray => {
  // console.log(clientArray);
  const optionsListClient = document.getElementById ('options-list-client');

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement ('label');
  selectAllLabel.setAttribute ('for', 'select-all-checkbox-client');
  selectAllLabel.setAttribute (
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement ('input');
  selectAllInput.setAttribute ('type', 'checkbox');
  selectAllInput.setAttribute ('id', 'select-all-checkbox-client');
  selectAllInput.setAttribute (
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement ('span');
  selectAllSpan.setAttribute ('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

  selectAllLabel.appendChild (selectAllInput);
  selectAllLabel.appendChild (selectAllSpan);

  optionsListClient.appendChild (selectAllLabel);

  selectAllInput.addEventListener ('change', function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const clientCheckboxes = document.querySelectorAll (
      "#options-list-client input[type='checkbox']"
    );
    clientCheckboxes.forEach (checkbox => {
      checkbox.checked = isChecked;
    });
  });

  clientArray.forEach ((item, index) => {
    const clientName = item;
    const clientString = item;

    const newLabel = document.createElement ('label');
    newLabel.setAttribute ('for', `option-${clientString}`);
    newLabel.setAttribute (
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate whitespace-normal items-baseline'
    );

    const newInput = document.createElement ('input');
    newInput.setAttribute ('type', 'checkbox');
    newInput.setAttribute ('id', `option-${clientString}`);
    newInput.setAttribute (
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute ('value', clientString);

    // Add the value to selectedClients_Array and check the input by default
    selectedClients_Array.add (clientString);
    newInput.checked = false;

    const newSpan = document.createElement ('span');
    newSpan.setAttribute ('class', 'ml-2');

    newSpan.innerText = clientName;

    newLabel.appendChild (newInput);
    newLabel.appendChild (newSpan);

    optionsListClient.appendChild (newLabel);
  });

  // Add event listeners to other checkboxes
  const clientLabels = document.querySelectorAll ('#options-list-client label');
  clientLabels.forEach ((label, index) => {
    const input = label.querySelector ('input');
    const clientString = label.querySelector ('input').value;

    input.addEventListener ('change', function () {
      if (input.checked && !selectedClients_Array.has (clientString)) {
        // Handle when the client is selected
        selectedClients_Array.add (clientString);
      } else if (input.checked && selectedClients_Array.has (clientString)) {
        // loop through clientLabels again to find any unchecked inputs, if so, delete from selectedClients_Array
        clientLabels.forEach (label => {
          const input = label.querySelector ('input');
          const clientString = label.querySelector ('input').value;
          if (!input.checked) {
            selectedClients_Array.delete (clientString);
          }
        });
      } else {
        selectedClients_Array.delete (clientString);
        // check if all inputs are unchecked, if so, make sure selectedClients_Array contains all clients
        let allUnchecked = true;
        clientLabels.forEach (label => {
          const input = label.querySelector ('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          clientLabels.forEach (label => {
            const clientString = label.querySelector ('input').value;
            selectedClients_Array.add (clientString);
          });
        }
      }
    });
  });
};

const addUniqueTypesToOptionsSelectTypesDropdown = typeArray => {
  const optionsListType = document.getElementById ('options-list-type');

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement ('label');
  selectAllLabel.setAttribute ('for', 'select-all-checkbox-type');
  selectAllLabel.setAttribute (
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement ('input');
  selectAllInput.setAttribute ('type', 'checkbox');
  selectAllInput.setAttribute ('id', 'select-all-checkbox-type');
  selectAllInput.setAttribute (
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement ('span');
  selectAllSpan.setAttribute ('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

  selectAllLabel.appendChild (selectAllInput);
  selectAllLabel.appendChild (selectAllSpan);

  optionsListType.appendChild (selectAllLabel);

  selectAllInput.addEventListener ('change', function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const typeCheckboxes = document.querySelectorAll (
      "#options-list-type input[type='checkbox']"
    );
    typeCheckboxes.forEach (checkbox => {
      checkbox.checked = isChecked;
    });
  });

  typeArray.forEach ((item, index) => {
    const typeName = item.str;
    const typeString = item.str;

    const newLabel = document.createElement ('label');
    newLabel.setAttribute ('for', `option-${typeString}`);
    newLabel.setAttribute (
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate whitespace-normal items-baseline'
    );

    const newInput = document.createElement ('input');
    newInput.setAttribute ('type', 'checkbox');
    newInput.setAttribute ('id', `option-${typeString}`);
    newInput.setAttribute (
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute ('value', typeString);

    // Add the value to selectedTypes_Array and check the input by default
    selectedTypes_Array.add (typeString);
    newInput.checked = false;

    const newSpan = document.createElement ('span');
    newSpan.setAttribute ('class', 'ml-2');

    newSpan.innerText = typeName;

    newLabel.appendChild (newInput);
    newLabel.appendChild (newSpan);

    optionsListType.appendChild (newLabel);
  });

  // Add event listeners to other checkboxes
  const typeLabels = document.querySelectorAll ('#options-list-type label');
  typeLabels.forEach ((label, index) => {
    const input = label.querySelector ('input');
    const typeString = label.querySelector ('input').value;

    input.addEventListener ('change', function () {
      if (input.checked && !selectedTypes_Array.has (typeString)) {
        // Handle when the type is selected
        selectedTypes_Array.add (typeString);
      } else if (input.checked && selectedTypes_Array.has (typeString)) {
        // loop through typeLabels again to find any unchecked inputs, if so, delete from selectedTypes_Array
        typeLabels.forEach (label => {
          const input = label.querySelector ('input');
          const typeString = label.querySelector ('input').value;
          if (!input.checked) {
            selectedTypes_Array.delete (typeString);
          }
        });
      } else {
        selectedTypes_Array.delete (typeString);
        // check if all inputs are unchecked, if so, make sure selectedTypes_Array contains all types
        let allUnchecked = true;
        typeLabels.forEach (label => {
          const input = label.querySelector ('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          typeLabels.forEach (label => {
            const typeString = label.querySelector ('input').value;
            selectedTypes_Array.add (typeString);
          });
        }
      }
    });
  });
};

const addUniqueAthleticsToOptionsSelectAthleticsDropdown = athleticArray => {
  const optionsListAthletic = document.getElementById ('options-list-athletic');

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement ('label');
  selectAllLabel.setAttribute ('for', 'select-all-checkbox-athletic');
  selectAllLabel.setAttribute (
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement ('input');
  selectAllInput.setAttribute ('type', 'checkbox');
  selectAllInput.setAttribute ('id', 'select-all-checkbox-athletic');
  selectAllInput.setAttribute (
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement ('span');
  selectAllSpan.setAttribute ('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

  selectAllLabel.appendChild (selectAllInput);
  selectAllLabel.appendChild (selectAllSpan);

  optionsListAthletic.appendChild (selectAllLabel);

  selectAllInput.addEventListener ('change', function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const athleticCheckboxes = document.querySelectorAll (
      "#options-list-athletic input[type='checkbox']"
    );
    athleticCheckboxes.forEach (checkbox => {
      checkbox.checked = isChecked;
    });
  });

  athleticArray.forEach ((item, index) => {
    const athleticName = item;
    const athleticString = item;

    const newLabel = document.createElement ('label');
    newLabel.setAttribute ('for', `option-${athleticString}`);
    newLabel.setAttribute (
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate whitespace-normal items-baseline'
    );

    const newInput = document.createElement ('input');
    newInput.setAttribute ('type', 'checkbox');
    newInput.setAttribute ('id', `option-${athleticString}`);
    newInput.setAttribute (
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute ('value', athleticString);

    // Add the value to selectedAthletics_Array and check the input by default
    selectedAthletics_Array.add (athleticString);
    newInput.checked = false;

    const newSpan = document.createElement ('span');
    newSpan.setAttribute ('class', 'ml-2');

    newSpan.innerText = athleticName;

    newLabel.appendChild (newInput);
    newLabel.appendChild (newSpan);

    optionsListAthletic.appendChild (newLabel);
  });

  // Add event listeners to other checkboxes
  const athleticLabels = document.querySelectorAll (
    '#options-list-athletic label'
  );
  athleticLabels.forEach ((label, index) => {
    const input = label.querySelector ('input');
    const athleticString = label.querySelector ('input').value;

    input.addEventListener ('change', function () {
      if (input.checked && !selectedAthletics_Array.has (athleticString)) {
        // Handle when the athletic is selected
        selectedAthletics_Array.add (athleticString);
      } else if (
        input.checked &&
        selectedAthletics_Array.has (athleticString)
      ) {
        // loop through athleticLabels again to find any unchecked inputs, if so, delete from selectedAthletics_Array
        athleticLabels.forEach (label => {
          const input = label.querySelector ('input');
          const athleticString = label.querySelector ('input').value;
          if (!input.checked) {
            selectedAthletics_Array.delete (athleticString);
          }
        });
      } else {
        selectedAthletics_Array.delete (athleticString);
        // check if all inputs are unchecked, if so, make sure selectedAthletics_Array contains all athletics
        let allUnchecked = true;
        athleticLabels.forEach (label => {
          const input = label.querySelector ('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          athleticLabels.forEach (label => {
            const athleticString = label.querySelector ('input').value;
            selectedAthletics_Array.add (athleticString);
          });
        }
      }
    });
  });
};

const addUniqueTrendlinesToOptionsSelectTrendlinesDropdown = trendlineArray => {
  const optionsListTrendline = document.getElementById (
    'options-list-trendline'
  );

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement ('label');
  selectAllLabel.setAttribute ('for', 'select-all-checkbox-trendline');
  selectAllLabel.setAttribute (
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement ('input');
  selectAllInput.setAttribute ('type', 'checkbox');
  selectAllInput.setAttribute ('id', 'select-all-checkbox-trendline');
  selectAllInput.setAttribute (
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement ('span');
  selectAllSpan.setAttribute ('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

  selectAllLabel.appendChild (selectAllInput);
  selectAllLabel.appendChild (selectAllSpan);

  optionsListTrendline.appendChild (selectAllLabel);

  selectAllInput.addEventListener ('change', function () {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const trendlineCheckboxes = document.querySelectorAll (
      "#options-list-trendline input[type='checkbox']"
    );
    trendlineCheckboxes.forEach (checkbox => {
      checkbox.checked = isChecked;
    });
  });

  trendlineArray.forEach ((item, index) => {
    const trendlineName = item;
    const trendlineString = item;

    const newLabel = document.createElement ('label');
    newLabel.setAttribute ('for', `option-${trendlineString}`);
    newLabel.setAttribute (
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate whitespace-normal items-baseline'
    );

    const newInput = document.createElement ('input');
    newInput.setAttribute ('type', 'checkbox');
    newInput.setAttribute ('id', `option-${trendlineString}`);
    newInput.setAttribute (
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute ('value', trendlineString);

    // Add the value to selectedTrendlines_Array and check the input by default
    selectedTrendlines_Array.add (trendlineString);
    newInput.checked = false;

    const newSpan = document.createElement ('span');
    newSpan.setAttribute ('class', 'ml-2');

    newSpan.innerText = trendlineName;

    newLabel.appendChild (newInput);
    newLabel.appendChild (newSpan);

    optionsListTrendline.appendChild (newLabel);
  });

  // Add event listeners to other checkboxes
  const trendlineLabels = document.querySelectorAll (
    '#options-list-trendline label'
  );
  trendlineLabels.forEach ((label, index) => {
    const input = label.querySelector ('input');
    const trendlineString = label.querySelector ('input').value;

    input.addEventListener ('change', function () {
      if (input.checked && !selectedTrendlines_Array.has (trendlineString)) {
        // Handle when the trendline is selected
        selectedTrendlines_Array.add (trendlineString);
      } else if (
        input.checked &&
        selectedTrendlines_Array.has (trendlineString)
      ) {
        // loop through trendlineLabels again to find any unchecked inputs, if so, delete from selectedTrendlines_Array
        trendlineLabels.forEach (label => {
          const input = label.querySelector ('input');
          const trendlineString = label.querySelector ('input').value;
          if (!input.checked) {
            selectedTrendlines_Array.delete (trendlineString);
          }
        });
      } else {
        selectedTrendlines_Array.delete (trendlineString);
        // check if all inputs are unchecked, if so, make sure selectedTrendlines_Array contains all trendlines
        let allUnchecked = true;
        trendlineLabels.forEach (label => {
          const input = label.querySelector ('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          trendlineLabels.forEach (label => {
            const trendlineString = label.querySelector ('input').value;
            selectedTrendlines_Array.add (trendlineString);
          });
        }
      }
    });
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const addUniqueClientsToOptionsSelectClientDropdown = clientSet => {
//   const optionsListClient = document.getElementById ('options-list-client');
//   const searchInput = document.getElementById ('input-group-search');

//   // Function to filter clients based on search input
//   const filterClients = () => {
//     const searchValue = searchInput.value.toLowerCase ();
//     const clients = optionsListClient.querySelectorAll (
//       "label[for^='client_']"
//     );
//     clients.forEach (client => {
//       if (client.getAttribute ('for') !== 'input-group-search') {
//         const clientName = client.innerText.toLowerCase ();
//         const listItem = client.parentElement.parentElement;
//         if (clientName.includes (searchValue)) {
//           listItem.style.display = 'block';
//         } else {
//           listItem.style.display = 'none';
//         }
//       }
//     });
//   };

//   // Event listener for search input
//   searchInput.addEventListener ('input', filterClients);

//   // Create "Select All" checkbox and label
//   const selectAllLabel = document.createElement ('label');
//   selectAllLabel.setAttribute ('for', 'select-all-checkbox-client');
//   selectAllLabel.setAttribute (
//     'class',
//     'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
//   );

//   const selectAllInput = document.createElement ('input');
//   selectAllInput.setAttribute ('type', 'checkbox');
//   selectAllInput.setAttribute ('id', 'select-all-checkbox-client');
//   selectAllInput.setAttribute (
//     'class',
//     'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
//   );

//   const selectAllSpan = document.createElement ('span');
//   selectAllSpan.setAttribute ('id', 'select-all-text-client');
//   selectAllSpan.innerText = '(select all)';
//   selectAllSpan.setAttribute ('class', 'text-lg font-semibold');

//   selectAllLabel.appendChild (selectAllInput);
//   selectAllLabel.appendChild (selectAllSpan);

//   optionsListClient.insertBefore (
//     selectAllLabel,
//     optionsListClient.children[1]
//   );

//   selectAllInput.addEventListener ('change', function () {
//     const isChecked = selectAllInput.checked;
//     // Toggle other checkboxes based on "Select All" checkbox state
//     const clientCheckboxes = document.querySelectorAll (
//       "#options-list-client input[type='checkbox']"
//     );
//     clientCheckboxes.forEach (checkbox => {
//       checkbox.checked = isChecked;
//     });
//   });

//   // Generate client checkboxes
//   clientSet.forEach (clientString => {
//     const newListItem = document.createElement ('li');
//     newListItem.style.listStyleType = 'none';

//     const newDiv = document.createElement ('div');
//     newDiv.setAttribute (
//       'class',
//       'flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600'
//     );

//     const newInput = document.createElement ('input');
//     newInput.setAttribute ('id', `client_${clientString}`);
//     newInput.setAttribute ('type', 'checkbox');
//     newInput.setAttribute ('value', clientString);

//     const newLabel = document.createElement ('label');
//     newLabel.setAttribute ('for', `client_${clientString}`);
//     newLabel.setAttribute (
//       'class',
//       'w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300'
//     );
//     newLabel.innerText = clientString;

//     newDiv.appendChild (newInput);
//     newDiv.appendChild (newLabel);

//     newListItem.appendChild (newDiv);

//     optionsListClient.appendChild (newListItem);
//   });

//   // Function to update selectedClients_Array
//   const clientDivs = document.querySelectorAll ('#options-list-client li div');
//   clientDivs.forEach (div => {
//     const input = div.querySelector ('input');
//     const clientString = div.querySelector ('label').textContent;

//     input.addEventListener ('change', function () {
//       if (input.checked && !selectedClients_Array.has (clientString)) {
//         // Handle when the type is selected
//         selectedClients_Array.add (clientString);
//       } else if (input.checked && selectedClients_Array.has (clientString)) {
//         // loop through clientDivs again to find any unchecked inputs, if so, delete from selectedClients_Array
//         clientDivs.forEach (div => {
//           const input = div.querySelector ('input');
//           const clientString = div.querySelector ('label').textContent;
//           if (!input.checked) {
//             selectedClients_Array.delete (clientString);
//           }
//         });
//       } else {
//         selectedClients_Array.delete (clientString);
//         // check if all inputs are unchecked, if so, make sure selectedClients_Array contains all types
//         let allUnchecked = true;
//         clientDivs.forEach (label => {
//           const input = label.querySelector ('input');
//           if (input.checked) {
//             allUnchecked = false;
//           }
//         });
//         if (allUnchecked) {
//           clientDivs.forEach (div => {
//             const clientString = div.querySelector ('label').textContent;
//             selectedClients_Array.add (clientString);
//           });
//         }
//       }
//     });
//   });
// };

adjustDivHeight ();

window.addEventListener ('resize', adjustDivHeight);
