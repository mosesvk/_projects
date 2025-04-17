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
const customSelectSeminaryElement = document.getElementById(
  'custom-select-seminary'
);
const customSelectRegionalElement = document.getElementById(
  'custom-select-regional'
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
const optionsListEnrollmentElement = document.getElementById(
  'options-list-enrollment'
);
const optionsListSeminaryElement = document.getElementById(
  'options-list-seminary'
);
const optionsListRegionalElement = document.getElementById(
  'options-list-regional'
);

// Initialize slider default values
window.sliderValue = 0;
window.sliderValue2 = 25000;


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
customSelectTypeElement.addEventListener ('click', event => {
  // Check if the click target is not a checkbox inside the customSelectTypeElement
  if (
    !event.target.closest ('.form-checkbox') &&
    !event.target.closest ('label')
  ) {
    optionsListTypeElement.classList.toggle ('invisible');
  }
});
customSelectAthleticElement.addEventListener ('click', event => {
  // Check if the click target is not a checkbox inside the customSelectAthleticElement
  if (
    !event.target.closest ('.form-checkbox') &&
    !event.target.closest ('label')
  ) {
    optionsListAthleticElement.classList.toggle ('invisible');
  }
});
customSelectEnrollmentElement.addEventListener('click', event => {
  // Check if the click target is not a checkbox inside the customSelectEnrollmentElement
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsListEnrollmentElement.classList.toggle('invisible');
  }
});
customSelectSeminaryElement.addEventListener('click', event => {
  // Check if the click target is not a checkbox inside the customSelectSeminaryElement
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsListSeminaryElement.classList.toggle('invisible');
  }
});
customSelectRegionalElement.addEventListener('click', event => {
  // Check if the click target is not a checkbox inside the customSelectRegionalElement
  if (
    !event.target.closest('.form-checkbox') &&
    !event.target.closest('label')
  ) {
    optionsListRegionalElement.classList.toggle('invisible');
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
    !customSelectTypeElement.contains (event.target) &&
    !optionsListTypeElement.contains (event.target)
  ) {
    optionsListTypeElement.classList.add ('invisible');
  }

  if (
    !customSelectAthleticElement.contains (event.target) &&
    !optionsListAthleticElement.contains (event.target)
  ) {
    optionsListAthleticElement.classList.add ('invisible');
  }

  if (
    !customSelectEnrollmentElement.contains(event.target) &&
    !optionsListEnrollmentElement.contains(event.target)
  ) {
    optionsListEnrollmentElement.classList.add('invisible');
  }

  if (
    !customSelectSeminaryElement.contains(event.target) &&
    !optionsListSeminaryElement.contains(event.target)
  ) {
    optionsListSeminaryElement.classList.add('invisible');
  }

  if (
    !customSelectRegionalElement.contains(event.target) &&
    !optionsListRegionalElement.contains(event.target)
  ) {
    optionsListRegionalElement.classList.add('invisible');
  }
  

  if (
    !document.getElementById('custom-select-other').contains(event.target)
  ) {

  }

});

document.getElementById('options-list-trendline').children[0].addEventListener('click', function() {
  console.log('clicked');
  
  const isChecked = this.querySelector('input[type="checkbox"]').checked;
  const checkboxes = document.querySelectorAll("#options-list-trendline input[type='checkbox']");
  checkboxes.forEach(checkbox => {
    // console.log({checkbox});
    checkbox.checked = isChecked;
  });
});

const addUniqueYearsToOptionsSelectDropdown = yearsArray => {
  const yearsObj = new Set();
  const selectedYears_Set = new Set();

  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage();
  if (Array.isArray(storedYears)) {
    storedYears.forEach(year => selectedYears_Set.add(year));
  }

  yearsArray.sort((a, b) => b - a);

  const cleanedArray = yearsArray.map(value => {
    const match = value.match(/\d+/); // Match one or more digits
    return match ? parseInt(match[0], 10) : null; // Convert to integer
  });

  cleanedArray.forEach(year => {
    if (year !== null) {
      const newLabel = document.createElement('label');
      newLabel.setAttribute('for', `option-${year}`);
      newLabel.setAttribute(
        'class',
        'flex items-center justify-start px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 colorBlue dark:text-gray-200 rounded'
      );

      const newInput = document.createElement('input');
      newInput.setAttribute('type', 'checkbox');
      newInput.setAttribute('id', `option-${year}`);
      newInput.setAttribute(
        'class',
        'form-checkbox h-4 w-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-300 dark:border-gray-500 mr-2 cursor-pointer'
      );
      newInput.setAttribute('value', year);
      newInput.checked = selectedYears_Set.has(year);

      newInput.addEventListener('change', e =>
        changeListenerForInputYears(e.target, year)
      );

      const newSpan = document.createElement('span');
      newSpan.innerText = year;

      newLabel.appendChild(newInput);
      newLabel.appendChild(newSpan);

      optionsListYearElement.appendChild(newLabel);
    }
  });
};

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
    selectAllInput.checked = true;
    newInput.checked = true;

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
    selectAllInput.checked = true;
    newInput.checked = true;

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
    selectAllInput.checked = true;
    newInput.checked = true;

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

const addUniqueEnrollmentsToOptionsSelectEnrollmentsDropdown = enrollmentArray => {
  const optionsListEnrollment = document.getElementById(
    'options-list-enrollment'
  );

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement('label');
  selectAllLabel.setAttribute('for', 'select-all-checkbox-enrollment');
  selectAllLabel.setAttribute(
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement('input');
  selectAllInput.setAttribute('type', 'checkbox');
  selectAllInput.setAttribute('id', 'select-all-checkbox-enrollment');
  selectAllInput.setAttribute(
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement('span');
  selectAllSpan.setAttribute('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute('class', 'text-lg font-semibold');

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListEnrollment.appendChild(selectAllLabel);

  selectAllInput.addEventListener('change', function() {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const enrollmentCheckboxes = document.querySelectorAll(
      "#options-list-enrollment input[type='checkbox']"
    );
    enrollmentCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });
  });

  enrollmentArray.forEach((enrollmentObject, index) => {
    const enrollmentName = enrollmentObject.arr[0];
    const enrollmentString = enrollmentObject.str;

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `option-${enrollmentString}`);
    newLabel.setAttribute(
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate'
    );

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('id', `option-${enrollmentString}`);
    newInput.setAttribute(
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute('value', enrollmentString);

    // Add the value to selectedEnrollments_Array and check the input by default
    selectedEnrollments_Array.add(enrollmentString);
    selectAllInput.checked = true;
    newInput.checked = true;

    const newSpan = document.createElement('span');
    newSpan.innerText = enrollmentName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListEnrollment.appendChild(newLabel);
  });

  // Add event listeners to other checkboxes
  const enrollmentLabels = document.querySelectorAll(
    '#options-list-enrollment label'
  );
  enrollmentLabels.forEach((label, index) => {
    const input = label.querySelector('input');
    const enrollmentString = label.querySelector('input').value;

    input.addEventListener('change', function() {
      if (input.checked && !selectedEnrollments_Array.has(enrollmentString)) {
        // Handle when the enrollment is selected
        selectedEnrollments_Array.add(enrollmentString);
      } else if (
        input.checked &&
        selectedEnrollments_Array.has(enrollmentString)
      ) {
        // loop through enrollmentLabels again to find any unchecked inputs, if so, delete from selectedEnrollments_Array
        enrollmentLabels.forEach(label => {
          const input = label.querySelector('input');
          const enrollmentString = label.querySelector('input').value;
          if (!input.checked) {
            selectedEnrollments_Array.delete(enrollmentString);
          }
        });
      } else {
        selectedEnrollments_Array.delete(enrollmentString);
        // check if all inputs are unchecked, if so, make sure selectedEnrollments_Array contains all enrollments
        let allUnchecked = true;
        enrollmentLabels.forEach(label => {
          const input = label.querySelector('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          enrollmentLabels.forEach(label => {
            const enrollmentString = label.querySelector('input').value;
            selectedEnrollments_Array.add(enrollmentString);
          });
        }
      }
    });
  });
};

const addUniqueRegionalsToOptionsSelectRegionalsDropdown = regionalArray => {
  const optionsListRegional = document.getElementById(
    'options-list-regional'
  );

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement('label');
  selectAllLabel.setAttribute('for', 'select-all-checkbox-regional');
  selectAllLabel.setAttribute(
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement('input');
  selectAllInput.setAttribute('type', 'checkbox');
  selectAllInput.setAttribute('id', 'select-all-checkbox-regional');
  selectAllInput.setAttribute(
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement('span');
  selectAllSpan.setAttribute('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute('class', 'text-lg font-semibold');

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListRegional.appendChild(selectAllLabel);

  selectAllInput.addEventListener('change', function() {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const regionalCheckboxes = document.querySelectorAll(
      "#options-list-regional input[type='checkbox']"
    );
    regionalCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });
  });

  regionalArray.forEach((regionalObject, index) => {
    const regionalName = regionalObject.arr[0];
    const regionalString = regionalObject.str;

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `option-${regionalString}`);
    newLabel.setAttribute(
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate'
    );

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('id', `option-${regionalString}`);
    newInput.setAttribute(
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute('value', regionalString);

    // Add the value to selectedRegionals_Array and check the input by default
    selectedRegionals_Array.add(regionalString);
    selectAllInput.checked = true;
    newInput.checked = true;

    const newSpan = document.createElement('span');
    newSpan.innerText = regionalName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListRegional.appendChild(newLabel);
  });

  // Add event listeners to other checkboxes
  const regionalLabels = document.querySelectorAll(
    '#options-list-regional label'
  );
  regionalLabels.forEach((label, index) => {
    const input = label.querySelector('input');
    const regionalString = label.querySelector('input').value;

    input.addEventListener('change', function() {
      if (input.checked && !selectedRegionals_Array.has(regionalString)) {
        // Handle when the regional is selected
        selectedRegionals_Array.add(regionalString);
      } else if (
        input.checked &&
        selectedRegionals_Array.has(regionalString)
      ) {
        // loop through regionalLabels again to find any unchecked inputs, if so, delete from selectedRegionals_Array
        regionalLabels.forEach(label => {
          const input = label.querySelector('input');
          const regionalString = label.querySelector('input').value;
          if (!input.checked) {
            selectedRegionals_Array.delete(regionalString);
          }
        });
      } else {
        selectedRegionals_Array.delete(regionalString);
        // check if all inputs are unchecked, if so, make sure selectedRegionals_Array contains all regionals
        let allUnchecked = true;
        regionalLabels.forEach(label => {
          const input = label.querySelector('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          regionalLabels.forEach(label => {
            const regionalString = label.querySelector('input').value;
            selectedRegionals_Array.add(regionalString);
          });
        }
      }
    });
  });
};

const addUniqueSeminariesToOptionsSelectSeminariesDropdown = seminaryArray => {
  const optionsListSeminary = document.getElementById(
    'options-list-seminary'
  );

  // Create "Select All" checkbox and label
  const selectAllLabel = document.createElement('label');
  selectAllLabel.setAttribute('for', 'select-all-checkbox-seminary');
  selectAllLabel.setAttribute(
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer truncate'
  );

  const selectAllInput = document.createElement('input');
  selectAllInput.setAttribute('type', 'checkbox');
  selectAllInput.setAttribute('id', 'select-all-checkbox-seminary');
  selectAllInput.setAttribute(
    'class',
    'w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer'
  );

  const selectAllSpan = document.createElement('span');
  selectAllSpan.setAttribute('id', 'select-all-text');
  selectAllSpan.innerText = '(select all)';
  selectAllSpan.setAttribute('class', 'text-lg font-semibold');

  selectAllLabel.appendChild(selectAllInput);
  selectAllLabel.appendChild(selectAllSpan);

  optionsListSeminary.appendChild(selectAllLabel);

  selectAllInput.addEventListener('change', function() {
    const isChecked = selectAllInput.checked;
    // Toggle other checkboxes based on "Select All" checkbox state
    const seminaryCheckboxes = document.querySelectorAll(
      "#options-list-seminary input[type='checkbox']"
    );
    seminaryCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });
  });

  seminaryArray.forEach((seminaryObject, index) => {
    const seminaryName = seminaryObject.arr[0];
    const seminaryString = seminaryObject.str;

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `option-${seminaryString}`);
    newLabel.setAttribute(
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 truncate'
    );

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('id', `option-${seminaryString}`);
    newInput.setAttribute(
      'class',
      'w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
    );
    newInput.setAttribute('value', seminaryString);

    // Add the value to selectedSeminaries_Array and check the input by default
    selectedSeminaries_Array.add(seminaryString);
    selectAllInput.checked = true;
    newInput.checked = true;

    const newSpan = document.createElement('span');
    newSpan.innerText = seminaryName;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsListSeminary.appendChild(newLabel);
  });

  // Add event listeners to other checkboxes
  const seminaryLabels = document.querySelectorAll(
    '#options-list-seminary label'
  );
  seminaryLabels.forEach((label, index) => {
    const input = label.querySelector('input');
    const seminaryString = label.querySelector('input').value;

    input.addEventListener('change', function() {
      if (input.checked && !selectedSeminaries_Array.has(seminaryString)) {
        // Handle when the seminary is selected
        selectedSeminaries_Array.add(seminaryString);
      } else if (
        input.checked &&
        selectedSeminaries_Array.has(seminaryString)
      ) {
        // loop through seminaryLabels again to find any unchecked inputs, if so, delete from selectedSeminaries_Array
        seminaryLabels.forEach(label => {
          const input = label.querySelector('input');
          const seminaryString = label.querySelector('input').value;
          if (!input.checked) {
            selectedSeminaries_Array.delete(seminaryString);
          }
        });
      } else {
        selectedSeminaries_Array.delete(seminaryString);
        // check if all inputs are unchecked, if so, make sure selectedSeminaries_Array contains all seminaries
        let allUnchecked = true;
        seminaryLabels.forEach(label => {
          const input = label.querySelector('input');
          if (input.checked) {
            allUnchecked = false;
          }
        });
        if (allUnchecked) {
          seminaryLabels.forEach(label => {
            const seminaryString = label.querySelector('input').value;
            selectedSeminaries_Array.add(seminaryString);
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
    selectAllInput.checked = true;
    newInput.checked = true;

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
    selectAllInput.checked = true;
    newInput.checked = true;

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
    const athleticName = item.str;
    const athleticString = item.str;

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
    selectAllInput.checked = true;
    newInput.checked = true;

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


// --------------------------------------------------------------------------------

adjustDivHeight ();

window.addEventListener ('resize', adjustDivHeight);
