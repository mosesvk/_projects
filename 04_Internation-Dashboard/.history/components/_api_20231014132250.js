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

// Loop through the data -> Unique Years
data.forEach((item) => {
  const year = item.children.year.innerHTML;

  // Check if the year is not already in yearsDataArray to ensure uniqueness
  if (!yearsData_Array.includes(year)) {
    yearsData_Array.push(year);
  }

  yearsData_Array.sort();
});

document.addEventListener('DOMContentLoaded', () => {
  checkLastRenderedComponent();

  runApi();
});

const checkLastRenderedComponent = () => {
  // Check if a component was last rendered and display it
  const lastRenderedComponent = localStorage.getItem('lastRenderedComponent');
  if (lastRenderedComponent === 'report') {
    displayReportComponent();
  } else {
    displayEnrollmentComponent();
  }
};

const runApi = () => {
  const run_btn = document.querySelector('#run');
  run_btn.addEventListener('click', () => {
    retrieveApiData();
  });

  const retrieveApiData = () => {
    // To retrieve the selectedYears_Array from localStorage in another component:
    const storedSelectedYears = JSON.parse(
      localStorage.getItem('selectedYears')
    );
    if (storedSelectedYears) {
      storedSelectedYears.forEach((year) => {
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
  
          // Use the retrieved data as needed (e.g., log or process it)
          console.log(`Year: ${year}`);
          console.log(`Students: ${students.innerHTML}`);
          console.log(`Percent Change: ${percentChange.innerHTML}`);
          console.log(`Average Enrollment: ${averageEnrollment.innerHTML}`);
          console.log(`Peak Enrollment: ${peakEnrollment.innerHTML}`);
          console.log(`Student/Faculty Ratio: ${studentFacultyRatio.innerHTML}`);
        });
      });

      localStorage.removeItem('selectedYears');

    } else {
      throw new Error('Need to Select a year')
    }

  };
};
