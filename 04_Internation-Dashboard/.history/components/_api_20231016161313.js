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
  },
  {
    children: {
      year: {
        innerHTML: '2023'
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

document.addEventListener('DOMContentLoaded', () => {
  findUniqueYears(data);

  checkLastRenderedComponent();

  runApiMain();
});

const findUniqueYears = (data) => {
  data.forEach((item) => {
    const year = item.children.year.innerHTML;

    // Check if the year is not already in yearsDataArray to ensure uniqueness
    if (!yearsData_Array.includes(year)) {
      yearsData_Array.push(year);
    }

    yearsData_Array.sort();
  });

  //nav-component
  addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
};

const checkLastRenderedComponent = () => {
  // Check if a component was last rendered and display it
  const lastRenderedComponent = localStorage.getItem('lastRenderedComponent');
  if (lastRenderedComponent === 'report') {
    displayReportComponent();
  } else {
    displayEnrollmentComponent();
  }
};

const getSelectedYearsFromLocalStorage = () => {
  const storedSelectedYears = JSON.parse(localStorage.getItem('selectedYears'));
  if (!storedSelectedYears) {
    throw new Error('Need to select a year');
  }
  return storedSelectedYears;
};


const addTableColumnsToReport = (tableHeader, data) => {
  // Find the table header row by its ID
  const tableHeaderRow = document.getElementById(tableHeader);

  // Create a reference to the second child of the tableHeaderRow
  const secondChild = tableHeaderRow.children[1];

  // Iterate through the selectedYearArray in the original order
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Create a new <th> element
    const newTh = document.createElement('th');
    newTh.setAttribute('scope', 'col');
    newTh.setAttribute('class', 'px-6 py-3');

    // Set the inner text of the new <th> element to the year
    newTh.innerText = item;

    // Insert the new <th> element before the second child of the tableHeaderRow
    tableHeaderRow.insertBefore(newTh, secondChild);
  }
};

const processEnrollmentData = (years, data) => {
  const findYearInObject = (year, object, innerData) => {
    if (year in object) {
      object[year].push(innerData);
    } else {
      object[year] = [innerData];
    }
  };

  years.forEach((year) => {
    const matchingData = data.filter(
      (item) => item.children.year.innerHTML === year.toString()
    );

    matchingData.forEach((item) => {
      const {
        students,
        'students - percent change': percentChange,
        'students - average enrollment': averageEnrollment,
        'students - peak enrollment': peakEnrollment,
        'student/faculty ratio': studentFacultyRatio
      } = item.children;

      const year = item.children.year.innerHTML;

      findYearInObject(year, studentAverageEnrollment_Main, students.innerHTML);

      findYearInObject(
        year,
        studentAverageEnrollment_PercentChange_Main,
        percentChange.innerHTML
      );
    });
  });
  // console.log('studentAverageEnrollment_Main', studentAverageEnrollment_Main);
  // console.log(
  //   'studentAverageEnrollment_PercentChange_Main',
  //   studentAverageEnrollment_PercentChange_Main
  // );

  displayEnrollmentComponent({studentAverageEnrollment_Main, studentAverageEnrollment_PercentChange_Main})
};

const runApiMain = () => {
  const run_btn = document.querySelector('#run');
  run_btn.addEventListener('click', () => {
    try {
      const selectedYears = getSelectedYearsFromLocalStorage();
      processEnrollmentData(selectedYears, data);

      localStorage.removeItem('selectedYears');
    } catch (error) {
      console.error(error.message);
    }
  });
};
