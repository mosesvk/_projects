const fetchClientData = async () => {
  return fetch('./data/clientData.xml')
    .then((response) => response.text())
    .then((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      return xmlDoc.querySelectorAll('record');
    })
    .catch((error) => {
      console.error('Error fetching XML file (fetchClientData):', error);
      return []; // Return an empty array in case of error
    });
};

const fetchPeerData = async () => {
  return fetch('./data/peerData.xml')
    .then((response) => response.text())
    .then((xmlString) => {
      // console.log(xmlString);
      const parser = new DOMParser();
      // changes
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      return xmlDoc.querySelectorAll('record');
    })
    .catch((error) => {
      console.error('Error fetching XML file (fetchPeerData):', error);
      return []; // Return an empty array in case of error
    });
};

document.addEventListener('DOMContentLoaded', async () => {
  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData();

  findUniqueYears(recordsClient);

  // addUniqueSchoolChurchToOptionsSelectSchoolChurchDropdown(schoolChurch_Array);

  // displayEnrollmentComponent();
  // displayCashComponent();
  // displayAssetComponent();
  // displayDebtComponent();
  // displayIncomeComponent();
  // displayExpenseComponent();
  // displayReportComponent();

  runApiMain(recordsPeer, recordsClient);
});

const findUniqueYears = (data) => {
  data.forEach((item) => {
    const yearElement = item.querySelector(
      'fiscal_ye_date_formatted_year_text'
    );
    if (yearElement) {
      const year = yearElement.textContent;

      // Check if the year is not already in yearsData_Array to ensure uniqueness
      if (!yearsData_Array.includes(year)) {
        yearsData_Array.push(year);
      }
    }
  });

  yearsData_Array.sort();

  //nav-component
  addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
};

const insertDataIntoObject = (
  type,
  year,
  object,
  dataKey,
  record,
  child,
  dynamicValueClientPeer,
  name
) => {
  // console.log({ type, year, object, dataKey, record, child, dynamicValueClientPeer, name });
  const innerData =
    record.querySelector(child).innerHTML.split('').length > 0
      ? record.querySelector(child).innerHTML.trim()
      : 0;

  if (type === 'client') {
    if (!object[dataKey]) {
      object[dataKey] = {};
    }
    if (!object[dataKey][year]) {
      object[dataKey][year] = {};
    }
    object[dataKey][year].value = innerData;
    const benchmarkField =
      dynamicValueClientPeer &&
      record.querySelector(dynamicValueClientPeer).textContent.trim();
    object[dataKey][year].benchmark = benchmarkField;
  } else {
    // type === 'peer'

    const yesNoField =
      dynamicValueClientPeer &&
      record.querySelector(dynamicValueClientPeer).textContent.trim();

    if (yesNoField == 'Yes') {
      if (!object[dataKey]) {
        object[dataKey] = {};
      }
      if (!object[dataKey][year]) {
        object[dataKey][year] = [];
      }

      if (!name) {
        if (!object[dataKey]['total']) {
          object[dataKey]['total'] = [];
        }
        object[dataKey]['total'].push(innerData);
      } else {
        if (!object[dataKey][name]) {
          object[dataKey][name] = [];
        }
        object[dataKey][name].push(innerData);
      }

      object[dataKey][year].push(innerData);
    }
  }
};

const processGeneralData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // ItExpenses
      insertDataIntoObject(
        'peer',
        year,
        object,
        'ItExpenses_Peer',
        record,
        'c01_04_ratio_it_expenses',
        'c01_04_yes_no_it_expenses'
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {

      // givingUnits
      insertDataIntoObject(
        'client',
        year,
        object,
        'givingUnits_Client',
        record,
        'c01_01_ratio_giving_units'
      );

      // missionaryUnit
      insertDataIntoObject(
        'client',
        year,
        object,
        'missionaryUnit_Client',
        record,
        'c01_02_ratio_missionary_unit'
      );

      // numberOfEmployeesFTE
      insertDataIntoObject(
        'client',
        year,
        object,
        'numberOfEmployeesFTE_Client',
        record,
        'c01_03_ratio_number_of_employees_fte'
      );

      // ItExpenses
      insertDataIntoObject(
        'client',
        year,
        object,
        'ItExpenses_Client',
        record,
        'c01_04_ratio_it_expenses'
      );
    })


    localStorage.removeItem('generalData');
    localStorage.setItem('generalData', JSON.stringify(object));
  });
};

const runApiMain = (recordsPeer, recordsClient) => {
  const run_btn = document.querySelector('#run');

  run_btn.addEventListener('click', () => {
    try {
      const selectedYears = getSelectedYearsFromLocalStorage();

      // After processing, save selectedYears_Set to localStorage
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      localStorage.setItem('selectedYears', JSON.stringify(selectedYearsArray));

      processGeneralData(selectedYears, recordsPeer, recordsClient);
      // processCashData(selectedYears, recordsPeer, recordsClient);
      // processAssetData(selectedYears, recordsPeer, recordsClient);
      // processDebtData(selectedYears, recordsPeer, recordsClient);
      // processIncomeData(selectedYears, recordsPeer, recordsClient);
      // processExpenseData(selectedYears, recordsPeer, recordsClient);

      // displayEnrollmentComponent();
      // displayCashComponent();
      // displayAssetComponent();
      // displayDebtComponent();
      // displayIncomeComponent();
      // displayExpenseComponent();
      // displayReportComponent();
    } catch (err) {
      console.error(err);
    }
  });
};
