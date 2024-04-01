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

const processDemoData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // givingUnits
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits_Peer",
        record,
        "s02___giving_units",
        "cfhi_compre_00a_yes_no___giving_units"
      );
      // averageAdultAttendees
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAdultAttendees_Peer",
        record,
        "s01_average_adult_attendees_excluding_children",
        "cfhi_compre_00b_yes_no___average_adult_attendees"
      );
      // totalAttendees
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAttendees_Peer",
        record,
        "s150___total_attendee_including_children",
        "cfhi_compre_00c_yes_no___total_attendees_including_children"
      );
      // fullTimeEquivalent
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fullTimeEquivalent_Peer",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker",
        "cfhi_compre_00d_yes_no___full_time_equivalents"
      );
      // attendeesToStaff [s150/s151]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "attendeesToStaff_Peer",
        record,
        "cfhi_compre_00e_ratio___attendees_to_staff",
        "cfhi_compre_00e_yes_no___attendees_to_staff"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAttendees",
        record,
        "s150___total_attendee_including_children",
        "cfhi_compre_00e_yes_no___attendees_to_staff",
        "attendeesToStaff"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fullTimeEquivalent",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker",
        "cfhi_compre_00e_yes_no___attendees_to_staff",
        "attendeesToStaff"
      );

      // contributionsWithoutDonorExcludingLargeGifts
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorExcludingLargeGifts_Peer",
        record,
        "cfhi_compre_00f_ratio___contributions_without_donor_restrictions",
        "cfhi_compre_00f_yes_no___contributions_without_donor_restrictions"
      );

      // totalContributionsExclude
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionsExclude_Peer",
        record,
        "cfhi_compre_00g_ratio____total_contrib_excluding_large_gifts",
        "cfhi_compre_00g_yes_no____total_contrib_excluding_large_gifts"
      );

      // totalContributionOnline
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionOnline_Peer",
        record,
        "s163___total_contribution_given_online",
        "cfhi_compre_00h_yes_no___total_contrib_given_online_including_large_gifts"
      );

      // percentContributionsOnline [(s163/s40) * 100]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "percentContributionsOnline_Peer",
        record,
        "cfhi_compre_00i_ratio___percent_of_total_contrib_given_online",
        "cfhi_compre_00i_yes_no___percent_of_total_contrib_given_online"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionOnline",
        record,
        "s163___total_contribution_given_online",
        "cfhi_compre_00i_yes_no___percent_of_total_contrib_given_online",
        "percentContributionsOnline"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributions",
        record,
        "s40___total_contribution",
        "cfhi_compre_00i_yes_no___percent_of_total_contrib_given_online",
        "percentContributionsOnline"
      );

      // totalOutsourcedEmployees
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalOutsourcedEmployees_Peer",
        record,
        "s157___total_outsourced_employee__fte_",
        "cfhi_compre_00j_yes_no___total_outsourced_fte"
      );

      // facilitySquareFootage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "facilitySquareFootage_Peer",
        record,
        "s08___total_facility_square_footage",
        "cfhi_compre_00k_yes_no___facility_square_footage"
      );

      // numberOfLocations
      insertDataIntoObject(
        "peer",
        year,
        object,
        "numberOfLocations_Peer",
        record,
        "s161___number_of_location",
        "cfhi_compre_00l_yes_no___number_of_locations"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // givingUnits
      insertDataIntoObject(
        "client",
        year,
        object,
        "givingUnits_Client",
        record,
        "s02___giving_units"
      );
      // averageAdultAttendees
      insertDataIntoObject(
        "client",
        year,
        object,
        "averageAdultAttendees_Client",
        record,
        "s01_average_adult_attendees_excluding_children"
      );
      // totalAttendees
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalAttendees_Client",
        record,
        "s150___total_attendee_including_children"
      );
      // fullTimeEquivalent
      insertDataIntoObject(
        "client",
        year,
        object,
        "fullTimeEquivalent_Client",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker"
      );
      // attendeesToStaff
      insertDataIntoObject(
        "client",
        year,
        object,
        "attendeesToStaff_Client",
        record,
        "cfhi_compre_00a_ratio___attendees_to_staff",
        "cfhi_compre_00a_bench_rating___attendees_to_staff"
      );
      // contributionsWithoutDonorExcludingLargeGifts
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorExcludingLargeGifts_Client",
        record,
        "cfhi_compre_00b_ratio___contributions_w_o_donor_restrictions_exclude_lage"
      );
      // totalContributionsExclude
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsExclude_Client",
        record,
        "cfhi_compre_00c_ratio___total_contributions_exclude_large_gifts"
      );
      // totalContributionOnline
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionOnline_Client",
        record,
        "s163___total_contribution_given_online"
      );
      // percentContributionsOnline
      insertDataIntoObject(
        "client",
        year,
        object,
        "percentContributionsOnline_Client",
        record,
        "cfhi_compre_00d_ratio___percent_of_total_given_online"
      );
      // totalOutsourcedEmployees
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalOutsourcedEmployees_Client",
        record,
        "s157___total_outsourced_employee__fte_"
      );
      // facilitySquareFootage
      insertDataIntoObject(
        "client",
        year,
        object,
        "facilitySquareFootage_Client",
        record,
        "s08___total_facility_square_footage"
      );
      // numberOfLocations
      insertDataIntoObject(
        "client",
        year,
        object,
        "numberOfLocations_Client",
        record,
        "s161___number_of_location"
      );
    });
  });

  localStorage.removeItem("demoData");
  localStorage.setItem("demoData", JSON.stringify(object));
};

const processGeneralData = (selectedYears, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("fiscal_ye_date_formatted_year_text").textContent;

      return fiscalYear.includes(year.toString());
    });

    filteredPeerRecords.forEach((record) => {
            // givingUnits
            insertDataIntoObject(
              "peer",
              year,
              object,
              "givingUnits_Peer",
              record,
              "s02___giving_units",
              "cfhi_compre_00a_yes_no___giving_units"
            );
    })

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("fiscal_ye_date_formatted_year_text").textContent;
      return fiscalYear.includes(year.toString());
    });
  })

}

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
