const data = [
  {
    children: {
      year: {
        innerHTML: '2021'
      },
      students: {
        innerHTML: '21'
      },
      'students - percent change': {
        innerHTML: '.04'
      },
      'students - average enrollment': {
        innerHTML: '19'
      },
      'students - peak enrollment': {
        innerHTML: '26'
      },
      'student/faculty ratio': {
        innerHTML: '1.5'
      }
    }
    // Additional data objects with years 2020, 2021, or 2022 and variations
  },
  {
    children: {
      year: {
        innerHTML: '2020'
      },
      students: {
        innerHTML: '20'
      },
      'students - percent change': {
        innerHTML: '.03'
      },
      'students - average enrollment': {
        innerHTML: '18'
      },
      'students - peak enrollment': {
        innerHTML: '25'
      },
      'student/faculty ratio': {
        innerHTML: '1.3'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2022'
      },
      students: {
        innerHTML: '22'
      },
      'students - percent change': {
        innerHTML: '.05'
      },
      'students - average enrollment': {
        innerHTML: '20'
      },
      'students - peak enrollment': {
        innerHTML: '27'
      },
      'student/faculty ratio': {
        innerHTML: '1.7'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2020'
      },
      students: {
        innerHTML: '22'
      },
      'students - percent change': {
        innerHTML: '.02'
      },
      'students - average enrollment': {
        innerHTML: '20'
      },
      'students - peak enrollment': {
        innerHTML: '25'
      },
      'student/faculty ratio': {
        innerHTML: '1.4'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2021'
      },
      students: {
        innerHTML: '22'
      },
      'students - percent change': {
        innerHTML: '.02'
      },
      'students - average enrollment': {
        innerHTML: '20'
      },
      'students - peak enrollment': {
        innerHTML: '24'
      },
      'student/faculty ratio': {
        innerHTML: '1.6'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2022'
      },
      students: {
        innerHTML: '20'
      },
      'students - percent change': {
        innerHTML: '.06'
      },
      'students - average enrollment': {
        innerHTML: '22'
      },
      'students - peak enrollment': {
        innerHTML: '28'
      },
      'student/faculty ratio': {
        innerHTML: '1.8'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2020'
      },
      students: {
        innerHTML: '19'
      },
      'students - percent change': {
        innerHTML: '.03'
      },
      'students - average enrollment': {
        innerHTML: '18'
      },
      'students - peak enrollment': {
        innerHTML: '24'
      },
      'student/faculty ratio': {
        innerHTML: '1.2'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2021'
      },
      students: {
        innerHTML: '20'
      },
      'students - percent change': {
        innerHTML: '.05'
      },
      'students - average enrollment': {
        innerHTML: '19'
      },
      'students - peak enrollment': {
        innerHTML: '27'
      },
      'student/faculty ratio': {
        innerHTML: '1.7'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2022'
      },
      students: {
        innerHTML: '23'
      },
      'students - percent change': {
        innerHTML: '.03'
      },
      'students - average enrollment': {
        innerHTML: '21'
      },
      'students - peak enrollment': {
        innerHTML: '29'
      },
      'student/faculty ratio': {
        innerHTML: '1.4'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2020'
      },
      students: {
        innerHTML: '19'
      },
      'students - percent change': {
        innerHTML: '.05'
      },
      'students - average enrollment': {
        innerHTML: '18'
      },
      'students - peak enrollment': {
        innerHTML: '26'
      },
      'student/faculty ratio': {
        innerHTML: '1.6'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2021'
      },
      students: {
        innerHTML: '23'
      },
      'students - percent change': {
        innerHTML: '.03'
      },
      'students - average enrollment': {
        innerHTML: '21'
      },
      'students - peak enrollment': {
        innerHTML: '27'
      },
      'student/faculty ratio': {
        innerHTML: '1.6'
      }
    }
  },
  {
    children: {
      year: {
        innerHTML: '2022'
      },
      students: {
        innerHTML: '24'
      },
      'students - percent change': {
        innerHTML: '.06'
      },
      'students - average enrollment': {
        innerHTML: '22'
      },
      'students - peak enrollment': {
        innerHTML: '28'
      },
      'student/faculty ratio': {
        innerHTML: '1.8'
      }
    }
  }
];

console.log(data);

// Loop through the data array to find all unique years
data.forEach((item) => {
  const year = item.children.year.innerHTML;

  // Check if the year is not already in yearsDataArray to ensure uniqueness
  if (!yearsData_Array.includes(year)) {
    yearsData_Array.push(year);
  }

  yearsData_Array.sort();
});

yearsData_Array.forEach((year) => {
  const selectYearOption_div = document.querySelector('#options-list');

  // Create a new <label> element
  const newLabel = document.createElement('label');
  newLabel.setAttribute('for', `option-${year}`);
  newLabel.setAttribute(
    'class',
    'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
  );

  const newInput = document.createElement('input');
  newInput.setAttribute('type', 'checkbox');
  newInput.setAttribute('id', `option-${year}`);
  newInput.setAttribute('class', `form-checkbox h-4 w-4 text-gray-600 mr-2`);
  newInput.setAttribute('value', year);

  const newSpan = document.createElement('span');
  newSpan.innerText = year;

  newLabel.appendChild(newInput);
  newLabel.appendChild(newSpan);

  selectYearOption_div.appendChild(newLabel);
});
