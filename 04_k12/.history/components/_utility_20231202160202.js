const yearsData_Array = [];
const selectedYears_Array = [];
const regions_Array = [
  { arr: ['New England (CT, RI, MA, VT, NH)'], str: 'NE' },
  {
    arr: ['Mid-Atlantic, VA, WV, MD, DE, NJ, NY, PA, DC)'],
    str: 'MA'
  },
  {
    arr: ['South, AR, LA, AL, TN, KY, GA, FL, SC, NC, MS)'],
    str: 'SO'
  },
  { arr: ['Midwest, WI, IL, IN, MI, OH, IA, MN)'], str: 'MW' },
  { arr: ['Plains, KS, MO, OK, TX, ND, SD, NE)'], str: 'PL' },
  {
    arr: ['Mountain/Southwest, ID, MT, WY, CO, UT, NV, AZ, NM)'],
    str: 'MT'
  },
  { arr: ['West Coast, CA, OR, WA)'], str: 'WC' }
];

const selectedRegions_Array = [];

// Utility Functions

const createChartFromParsedData = (
  parsedData,
  chart,
  peer,
  client,
  type,
  fixedNum,
  mainName
) => {
  // console.log('parsedData', parsedData);
  if (parsedData) {
    createChart(chart, parsedData[peer], parsedData[client], type, fixedNum);
    updateModal(mainName, parsedData[peer], parsedData[client]);
  }
};

const createChart = (chartId, dataPeer, dataClient, type, fixedNum) => {
  // console.log('createChart()', { chartId, dataPeer, dataClient, type, fixedNum });
  document.getElementById(chartId).innerHTML = '';

  // Create a new chart instance
  const chart = new ApexCharts(
    document.getElementById(chartId),
    getMainChartOptions(dataPeer, dataClient, type, fixedNum)
  );

  chart.render();

  // init again when toggling dark mode
  document.addEventListener('dark-mode', function () {
    chart.updateOptions(
      getMainChartOptions(dataPeer, dataClient, type, fixedNum)
    );
  });
};

function updateModal(mainName, avgData, clientData) {
  // Get the selected years from local storage
  const selectedYears = getSelectedYearsFromLocalStorage();

  // Find the modal element
  const modal = document.getElementById(`${mainName}_modal`);

  // Check if the modal element exists
  if (modal) {
    // Find the table header row
    const headerRow = modal.querySelector(`#${mainName}_modal_row`);
    let tableHead = headerRow.parentElement;

    // Clear existing rows after the headerRow
    let nextRow = headerRow.nextSibling;
    while (nextRow) {
      tableHead.removeChild(nextRow);
      nextRow = headerRow.nextSibling; // Get the next sibling again
    }

    // Clear existing header content
    headerRow.innerHTML = '';

    // Add the "year" column
    const yearColumn = document.createElement('th');
    yearColumn.className = 'px-6 py-3';
    yearColumn.textContent = 'year';
    headerRow.appendChild(yearColumn);

    // Add the "Client" column
    const clientColumn = document.createElement('th');
    clientColumn.className = 'px-6 py-3';
    clientColumn.textContent = 'client';
    headerRow.appendChild(clientColumn);

    // Add the "Avg" column
    const avgColumn = document.createElement('th');
    avgColumn.className = 'px-6 py-3';
    avgColumn.textContent = 'Avg';
    headerRow.appendChild(avgColumn);

    // Add the remaining columns
    const columns = ['Mid', 'Min', 'Max'];
    columns.forEach((column) => {
      const col = document.createElement('th');
      col.className = 'px-6 py-3';
      col.textContent = column;
      headerRow.appendChild(col);
    });

    // Add a row for each selected year
    selectedYears.forEach((year) => {
      const yearRow = document.createElement('tr');
      yearRow.className =
        'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
      yearRow.id = `${mainName}_modal_${year}`;

      // Create a table header cell for the year
      const yearCell = document.createElement('th');
      yearCell.className =
        'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white';
      yearCell.scope = 'row';
      yearCell.textContent = year;

      // Append the year cell to the row
      yearRow.appendChild(yearCell);

      // Append the row to the header
      tableHead.appendChild(yearRow);
    });
  }
}

const getStoredData = (dataTable) => {
  return localStorage.getItem(dataTable) || null;
};

const parseStoredData = (data) => {
  return data ? JSON.parse(data) : null;
};

const closeSidebarAfterSelectingOption = (component) => {
  // Remove the sidebar/backdoor/"x" svg icon
  // Add back the "hamburger" svg icon
  document.querySelector('#sidebar').classList.add('hidden');
  document.querySelector('#sidebarBackdrop').classList.add('hidden');
  document
    .querySelector('#toggleSidebarMobileHamburger')
    .classList.remove('hidden');
  document.querySelector('#toggleSidebarMobileClose').classList.add('hidden');

  localStorage.setItem('lastRenderedComponent', component);
};

const getAverageOfArray = (array) => {
  if (array.length === 0) {
    return 0;
  }
  const sum = array.reduce((acc, str) => acc + Number(str), 0);
  const avg = sum / array.length;

  return avg;
};

const getMidpointOfArray = (array) => {
  if (array.length === 0) {
    return 0;
  }

  if (array.length % 2 === 1) {
    // Array has an odd number of elements
    const midpointIndex = Math.floor(array.length / 2);
    return Number(array[midpointIndex]);
  } else {
    // Array has an even number of elements
    const midpointIndex1 = array.length / 2 - 1;
    const midpointIndex2 = array.length / 2;
    const midpoint1 = Number(array[midpointIndex1]);
    const midpoint2 = Number(array[midpointIndex2]);
    return (midpoint1 + midpoint2) / 2;
  }
};

const getMaxOfArray = (array) => {
  const nonZeroArray = array.filter((num) => num !== 0);

  if (nonZeroArray.length === 0) {
    return 0;
  }

  return Math.max(...nonZeroArray);
};

const getMinOfArray = (array) => {
  const nonZeroArray = array.filter((num) => {
    if (num != 0 || num != 0.0) {
      return num;
    }
    return;
  });

  if (nonZeroArray.length === 0) {
    return 0;
  }

  return Math.min(...nonZeroArray);
};

const getSumOfArray = (array) => {
  if (array.length === 0) {
    return 0;
  }

  return array.reduce((sum, value) => sum + parseFloat(value) || 0, 0);
};

const calculateAveragePercentageChange = (values) => {
  // console.log(values);
  // console.log('---');

  const years = Object.keys(values);
  const numberOfYears = years.length;

  if (numberOfYears < 2) {
    return 0.0; // No change if there are fewer than two years
  }

  let totalChange = 0;

  for (let i = 1; i < numberOfYears; i++) {
    const year = years[i];
    const previousYear = years[i - 1];

    const initialValue = parseFloat(values[previousYear][0]);
    const finalValue = parseFloat(values[year][0]);

    if (initialValue === 0) {
      if (finalValue === 0) {
        continue; // No change if both initial and final values are zero
      } else {
        totalChange = Infinity; // Handle division by zero
        break;
      }
    }

    const change = ((finalValue - initialValue) / Math.abs(initialValue)) * 100;
    totalChange += change;
  }

  const averagePercentageChange = totalChange / (numberOfYears - 1);

  return averagePercentageChange ? averagePercentageChange.toFixed(1) : 0; // Ensure one decimal point
};

const getSelectedYearsFromLocalStorage = () => {
  const storedSelectedYears = JSON.parse(localStorage.getItem('selectedYears'));
  const storedData = localStorage.getItem('enrollment');
  if (!storedSelectedYears && storedData) {
    console.error('Need to Select Year');
  }

  return storedSelectedYears;
};

const resetSelectedYearsFromLocalStorage = () => {
  localStorage.setItem('selectedYears', JSON.stringify([]));
};

let selectedYears_Set = new Set();

const changeListenerForInputYears = (input, year) => {
  if (input.checked) {
    selectedYears_Set.add(year);
  } else {
    selectedYears_Set.delete(year);
  }

  const selectedYearsArray = Array.from(selectedYears_Set).sort(
    (a, b) => a - b
  );
  localStorage.setItem('selectedYears', JSON.stringify(selectedYearsArray));
};

const addUniqueYearsToOptionsSelectDropdown = (yearsArray) => {
  // Initialize selectedYears_Set from local storage if data exists
  const storedYears = getSelectedYearsFromLocalStorage();

  if (Array.isArray(storedYears)) {
    selectedYears_Set = new Set(storedYears);
  }

  optionsList.innerHTML = '';

  yearsArray.forEach((year) => {
    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `option-${year}`);
    newLabel.setAttribute(
      'class',
      'flex items-center justify-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
    );

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('id', `option-${year}`);
    newInput.setAttribute('class', `form-checkbox h-4 w-4 text-gray-600 mr-2`);
    newInput.setAttribute('value', year);
    newInput.checked = selectedYears_Set.has(year);

    newInput.addEventListener('change', (e) =>
      changeListenerForInputYears(e.target, year)
    );

    const newSpan = document.createElement('span');
    newSpan.innerText = year;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    optionsList.appendChild(newLabel);
  });
};

const getPeerAndClientChartDataArrays = (
  years,
  dataPeer,
  dataClient,
  fixedNum
) => {
  // console.log({ years, dataPeer, dataClient, fixedNum })
  const peerAvg = [];
  const peerMid = [];
  const peerMin = [];
  const peerMax = [];
  const clientArray = [];

  years.forEach((year) => {
    if (dataPeer[year]) {
      const array = dataPeer[year];
      const avg = getAverageOfArray(array);
      const mid = getMidpointOfArray(array);
      const min = Math.min(...array);
      const max = Math.max(...array);

      peerAvg.push(parseFloat(avg.toFixed(fixedNum)));
      peerMid.push(parseFloat(mid.toFixed(fixedNum)));
      peerMin.push(parseFloat(min.toFixed(fixedNum)));
      peerMax.push(parseFloat(max.toFixed(fixedNum)));

      const clientNum = Number(dataClient[year].value).toFixed(fixedNum);
      clientArray.push(clientNum);
    } else {
      console.error(`Data for year ${year} is undefined in dataPeer`);
    }
  });

  return { clientArray, peerAvg, peerMid, peerMin, peerMax };
};

const styleNumber = (num, type, fixed) => {
  let text = num;

  if (text == 0) text = '-';

  if (!isNaN(text)) {
    if (type === 'num' && text != 0) {
      text = Number(text).toFixed(fixed);
      text = Number(text).toLocaleString(); // Add commas for thousands
    }

    if (type === 'percent' && text != 0)
      text = parseFloat(text).toFixed(fixed) + '%';

    
    if (type === 'dollar' && text != 0) {
      text = parseFloat(text).toFixed(fixed);
      text = '$' + Number(text).toLocaleString(); // Add commas for thousands
    }
  }

  return text;
};
