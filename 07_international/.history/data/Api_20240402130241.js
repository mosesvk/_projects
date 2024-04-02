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


  const innerData = child == 0 ? 0 :
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

      // givingUnits
      insertDataIntoObject(
        'peer',
        year,
        object,
        'givingUnits_Peer',
        record,
        '0',
      );

      // missionaryUnit
      insertDataIntoObject(
        'peer',
        year,
        object,
        'missionaryUnit_Peer',
        record,
        '0',
      );

      // numberOfEmployeesFTE
      insertDataIntoObject(
        'peer',
        year,
        object,
        'numberOfEmployeesFTE_Peer',
        record,
        '0',
      );

      // itExpenses
      insertDataIntoObject(
        'peer',
        year,
        object,
        'itExpenses_Peer',
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

      // itExpenses
      insertDataIntoObject(
        'client',
        year,
        object,
        'itExpenses_Client',
        record,
        'c01_04_ratio_it_expenses'
      );
    });

    localStorage.removeItem('generalData');
    localStorage.setItem('generalData', JSON.stringify(object));
  });
};

const processCashData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // daysCashOnHand
      insertDataIntoObject(
        'peer',
        year,
        object,
        'daysCashOnHand_Peer',
        record,
        'c02_01_ratio_days_cash_on_hand',
        'c02_01_yes_no_days_cash_on_hand'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'cashAndCashEquivalents',
        record,
        '_01__01ass___01_cash_and_cash_equivalents',
        'c02_01_yes_no_days_cash_on_hand',
        'daysCashOnHand'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalExpenses',
        record,
        '_02_03exp___05_total_expenses',
        'c02_01_yes_no_days_cash_on_hand',
        'daysCashOnHand'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'depreciationAndAmortization',
        record,
        '_04_01fexp___06_depreciation_and_amortization',
        'c02_01_yes_no_days_cash_on_hand',
        'daysCashOnHand'
      );

      // daysExpensesInUnrestrictedNA
      insertDataIntoObject(
        'peer',
        year,
        object,
        'daysExpensesInUnrestrictedNA_Peer',
        record,
        'c02_02_ratio_days_expenses_in_unrestricted_na',
        'c02_02_yes_no_days_expenses_in_unrestricted_na'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'changeInNetAssetsWithoutDR',
        record,
        '_01__03na___01_net_assets_without_donor_restrictions',
        'c02_02_yes_no_days_expenses_in_unrestricted_na',
        'daysExpensesInUnrestrictedNA'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalExpenses',
        record,
        '_02_03exp___05_total_expenses',
        'c02_02_yes_no_days_expenses_in_unrestricted_na',
        'daysExpensesInUnrestrictedNA'
      );

      // daysExpensesInNAwithDR
      insertDataIntoObject(
        'peer',
        year,
        object,
        'daysExpensesInNAwithDR_Peer',
        record,
        'c02_03_ratio_days_expenses_in_net_assets_with_dr',
        'c02_02_yes_no_days_expenses_in_unrestricted_na'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'netAssetsWithDRByPurposeOrTime',
        record,
        '_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time',
        'c02_02_yes_no_days_expenses_in_unrestricted_na',
        'daysExpensesInNAwithDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'netAssetsWithDRInPerpetuity',
        record,
        '_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity',
        'c02_02_yes_no_days_expenses_in_unrestricted_na',
        'daysExpensesInNAwithDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalExpenses',
        record,
        '_02_03exp___05_total_expenses',
        'c02_02_yes_no_days_expenses_in_unrestricted_na',
        'daysExpensesInNAwithDR'
      );

      // daysExpensesInNAwithDR_excludingPPE
      insertDataIntoObject(
        'peer',
        year,
        object,
        'daysExpensesInNAwithDR_excludingPPE_Peer',
        record,
        'c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe',
        'c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalNetAssets',
        record,
        '_01__03na___04_total_net_assets',
        'c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe',
        'daysExpensesInNAwithDR_excludingPPE'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'propertyPlantAndEquipment',
        record,
        '_01__01ass___09_property__plant_and_equipment',
        'c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe',
        'daysExpensesInNAwithDR_excludingPPE'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'notesPayable',
        record,
        '_01__02liab___02_notes_payable',
        'c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe',
        'daysExpensesInNAwithDR_excludingPPE'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalExpenses',
        record,
        '_02_03exp___05_total_expenses',
        'c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe',
        'daysExpensesInNAwithDR_excludingPPE'
      );

      // liquidityFundsAvailable
      insertDataIntoObject(
        'peer',
        year,
        object,
        'liquidityFundsAvailable_Peer',
        record,
        'c02_05_ratio_liquidity_funds_available',
        'c02_05_yes_no_liquidity_funds_available'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalAssets',
        record,
        '_01__01ass___10_total_assets',
        'c02_05_yes_no_liquidity_funds_available',
        'liquidityFundsAvailable'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'propertyPlantAndEquipment',
        record,
        '_01__01ass___09_property__plant_and_equipment',
        'c02_05_yes_no_liquidity_funds_available',
        'liquidityFundsAvailable'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalLiabilities',
        record,
        '_01__02liab___05_total_liabilities',
        'c02_05_yes_no_liquidity_funds_available',
        'liquidityFundsAvailable'
      );

      // financialAssetsAvailableFY
      insertDataIntoObject(
        'peer',
        year,
        object,
        'financialAssetsAvailableFY_Peer',
        record,
        'c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures',
        'c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'financialAssetsAvailablePerLiquidity',
        record,
        '_05_01liquid___01_financial_assets_available_per_liquidity_fn',
        'c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures',
        'financialAssetsAvailableFY'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalExpenses',
        record,
        '_02_03exp___05_total_expenses',
        'c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures',
        'financialAssetsAvailableFY'
      );

      // daysFinancialAssetsOnHand
      insertDataIntoObject(
        'peer',
        year,
        object,
        'daysFinancialAssetsOnHand_Peer',
        record,
        'c02_07_ratio_days_financial_assets_on_hand_to_fund_expenditures',
        'c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'financialAssetsAvailablePerLiquidity',
        record,
        '_05_01liquid___01_financial_assets_available_per_liquidity_fn',
        'c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures',
        'daysFinancialAssetsOnHand'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalExpenses',
        record,
        '_02_03exp___05_total_expenses',
        'c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures',
        'daysFinancialAssetsOnHand'
      );

      // currentRatio
      insertDataIntoObject(
        'peer',
        year,
        object,
        'currentRatio_Peer',
        record,
        'c02_08_ratio_current_ratio',
        'c02_08_yes_no_current_ratio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalAssets',
        record,
        '_01__01ass___10_total_assets',
        'c02_08_yes_no_current_ratio',
        'currentRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'cashAndCashEquivalents',
        record,
        '_01__01ass___01_cash_and_cash_equivalents',
        'c02_08_yes_no_current_ratio',
        'currentRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'investments',
        record,
        '_01__01ass___03_investments',
        'c02_08_yes_no_current_ratio',
        'currentRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'longTermLiabilities',
        record,
        '_01__02liab___04_long_term_liabilities',
        'c02_08_yes_no_current_ratio',
        'currentRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'propertyPlantAndEquipment',
        record,
        '_01__01ass___09_property__plant_and_equipment',
        'c02_08_yes_no_current_ratio',
        'currentRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalLiabilities',
        record,
        '_01__02liab___05_total_liabilities',
        'c02_08_yes_no_current_ratio',
        'currentRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'notesPayable',
        record,
        '_01__02liab___02_notes_payable',
        'c02_08_yes_no_current_ratio',
        'currentRatio'
      );

      // totalCoverageRatio
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalCoverageRatio_Peer',
        record,
        'c02_09_ratio_total_coverage_ratio',
        'c02_09_yes_no_total_coverage_ratio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalAssets',
        record,
        '_01__01ass___10_total_assets',
        'c02_09_yes_no_total_coverage_ratio',
        'totalCoverageRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalLiabilities',
        record,
        '_01__02liab___05_total_liabilities',
        'c02_09_yes_no_total_coverage_ratio',
        'totalCoverageRatio'
      );

      // cashFlowsTrendFinancing
      insertDataIntoObject(
        'peer',
        year,
        object,
        'cashFlowsTrendFinancing_Peer',
        record,
        '0',
      );

      // cashFlowsTrendInvesting
      insertDataIntoObject(
        'peer',
        year,
        object,
        'cashFlowsTrendInvesting_Peer',
        record,
        '0',
      );

      // cashFlowsTrendOperating
      insertDataIntoObject(
        'peer',
        year,
        object,
        'cashFlowsTrendOperating_Peer',
        record,
        '0',
      );

    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {

      // daysCashOnHand 
      insertDataIntoObject(
        'client',
        year,
        object,
        'daysCashOnHand_Client',
        record,
        'c02_01_ratio_days_cash_on_hand'
      );

      // daysExpensesInUnrestrictedNA_
      insertDataIntoObject(
        'client',
        year,
        object,
        'daysExpensesInUnrestrictedNA_Client',
        record,
        'c02_02_ratio_days_expenses_in_unrestricted_na'
      );

      // daysExpensesInNAwithDR
      insertDataIntoObject(
        'client',
        year,
        object,
        'daysExpensesInNAwithDR_Client',
        record,
        'c02_03_ratio_days_expenses_in_net_assets_with_dr'
      );

      // daysExpensesInNAwithDR_excludingPPE
      insertDataIntoObject(
        'client',
        year,
        object,
        'daysExpensesInNAwithDR_excludingPPE_Client',
        record,
        'c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe'
      );

      // liquidityFundsAvailable
      insertDataIntoObject(
        'client',
        year,
        object,
        'liquidityFundsAvailable_Client',
        record,
        'c02_05_ratio_liquidity_funds_available'
      );

      // financialAssetsAvailableFY
      insertDataIntoObject(
        'client',
        year,
        object,
        'financialAssetsAvailableFY_Client',
        record,
        'c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures'
      );

      // daysFinancialAssetsOnHand
      insertDataIntoObject(
        'client',
        year,
        object,
        'daysFinancialAssetsOnHand_Client',
        record,
        'c02_07_ratio_days_financial_assets_on_hand_to_fund_expenditures'
      );

      // currentRatio
      insertDataIntoObject(
        'client',
        year,
        object,
        'currentRatio_Client',
        record,
        'c02_08_ratio_current_ratio'
      );

      // totalCoverageRatio
      insertDataIntoObject(
        'client',
        year,
        object,
        'totalCoverageRatio_Client',
        record,
        'c02_09_ratio_total_coverage_ratio'
      );

      // cashFlowsTrendFinancing
      insertDataIntoObject(
        'client',
        year,
        object,
        'cashFlowsTrendFinancing_Client',
        record,
        'c02_10a_ratio_cash_flows_trend___financing'
      );

      // cashFlowsTrendInvesting
      insertDataIntoObject(
        'client',
        year,
        object,
        'cashFlowsTrendInvesting_Client',
        record,
        'c02_10b_ratio_cash_flows_trend___investing'
      );

      // cashFlowsTrendOperating
      insertDataIntoObject(
        'client',
        year,
        object,
        'cashFlowsTrendOperating_Client',
        record,
        'c02_10c_ratio_cash_flows_trend___operating'
      );
    });

    localStorage.removeItem('cashData');
    localStorage.setItem('cashData', JSON.stringify(object));
  });
};

const processAssetData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // percentWithDR
      insertDataIntoObject(
        'peer',
        year,
        object,
        'percentWithDR_Peer',
        record,
        'c03_01_ratio_percent_with_donor_restrictions',
        'c03_01_yes_no_percent_with_donor_restrictions'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'changeInNetAssetsWithDRByPurposeOrTime',
        record,
        '_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time',
        'c03_01_yes_no_percent_with_donor_restrictions',
        'percentWithDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'netAssetsWithDRInPerpetuity',
        record,
        '_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity',
        'c03_01_yes_no_percent_with_donor_restrictions',
        'percentWithDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalNetAssets',
        record,
        '_01__03na___04_total_net_assets',
        'c03_01_yes_no_percent_with_donor_restrictions',
        'percentWithDR'
      );

      // percentWithoutDR_excludingPPE
      insertDataIntoObject(
        'peer',
        year,
        object,
        'percentWithoutDR_Peer',
        record,
        'c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe',
        'c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'changeInNetAssetsWithoutDR',
        record,
        '_01__03na___01_net_assets_without_donor_restrictions',
        'c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe',
        'percentWithoutDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'propertyPlantAndEquipment',
        record,
        '_01__01ass___09_property__plant_and_equipment',
        'c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe',
        'percentWithoutDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'notesPayable',
        record,
        '_01__02liab___02_notes_payable',
        'c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe',
        'percentWithoutDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalNetAssets',
        record,
        '_01__03na___04_total_net_assets',
        'c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe',
        'percentWithoutDR'
      );

      // percentWithoutDR
      insertDataIntoObject(
        'peer',
        year,
        object,
        'percentWithoutDR_excludingPPE_Peer',
        record,
        'c03_03_ratio_percent_without_donor_restrictions',
        'c03_03_yes_no_percent_without_donor_restrictions'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'changeInNetAssetsWithoutDR',
        record,
        '_01__03na___01_net_assets_without_donor_restrictions',
        'c03_03_yes_no_percent_without_donor_restrictions',
        'percentWithoutDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalNetAssets',
        record,
        '_01__03na___04_total_net_assets',
        'c03_03_yes_no_percent_without_donor_restrictions',
        'percentWithoutDR'
      );

    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {

      // percentWithDR
      insertDataIntoObject(
        'client',
        year,
        object,
        'percentWithDR_Client',
        record,
        'c03_01_ratio_percent_with_donor_restrictions'
      );

      // percentWithoutDR_excludingPPE
      insertDataIntoObject(
        'client',
        year,
        object,
        'percentWithoutDR_Client',
        record,
        'c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe'
      );

      // percentWithoutDR
      insertDataIntoObject(
        'client',
        year,
        object,
        'percentWithoutDR_excludingPPE_Client',
        record,
        'c03_03_ratio_percent_without_donor_restrictions'
      );




    });

    localStorage.removeItem('assetData');
    localStorage.setItem('assetData', JSON.stringify(object));
  });
};

const processIncomeData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // netIncomeRatio
      insertDataIntoObject(
        'peer',
        year,
        object,
        'netIncomeRatio_Peer',
        record,
        'c04_01_ratio_net_income_ratio',
        'c04_01_yes_no_net_income_ratio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'changeInNetAssetsWithoutDR',
        record,
        '_02_04change___01_change_in_net_assets_without_donor_restriction',
        'c04_01_yes_no_net_income_ratio',
        'netIncomeRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'changeInNetAssetsWithDR',
        record,
        '_02_04change___02_change_in_net_assets_with_donor_restriction',
        'c04_01_yes_no_net_income_ratio',
        'netIncomeRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalSupportAndRevenueWithoutDR',
        record,
        '_02_01sr___08_total_support_and_revenue_without_donor_restrictions',
        'c04_01_yes_no_net_income_ratio',
        'netIncomeRatio'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalSupportAndRevenueWithDR',
        record,
        '_02_01sr___09_total_support_and_revenue_with_donor_restrictions',
        'c04_01_yes_no_net_income_ratio',
        'netIncomeRatio'
      );

      // contributionsTrend_basedOnNumberOfDonors
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsTrend_basedOnNumberOfDonors_Peer',
        record,
        '0',
      );

      // contributionsTrend
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsTrend_Peer',
        record,
        '0',
      );

      // contributionsPercentWithoutDR
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsPercentWithoutDR_Peer',
        record,
        'c04_04_ratio_contributions_percent_without_donor_restrictions',
        'c04_04_yes_no_contributions_percent_without_donor_restrictions'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithoutDR',
        record,
        '_02_01sr___01_contributions_without_donor_restrictions',
        'c04_04_yes_no_contributions_percent_without_donor_restrictions',
        'contributionsPercentWithoutDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithDR',
        record,
        '_02_01sr___02_contributions_with_donor_restrictions',
        'c04_04_yes_no_contributions_percent_without_donor_restrictions',
        'contributionsPercentWithoutDR'
      );

      // contributionsPercentWithDR
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsPercentWithDR_Peer',
        record,
        'c04_05_ratio_contributions_percent_with_donor_restrictions',
        'c04_05_yes_no_contributions_percent_with_donor_restrictions'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithoutDR',
        record,
        '_02_01sr___01_contributions_without_donor_restrictions',
        'c04_05_yes_no_contributions_percent_with_donor_restrictions',
        'contributionsPercentWithDR'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithDR',
        record,
        '_02_01sr___02_contributions_with_donor_restrictions',
        'c04_05_yes_no_contributions_percent_with_donor_restrictions',
        'contributionsPercentWithDR'
      );

      // contributionsPerGivingUnit
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsPerGivingUnit_Peer',
        record,
        'c04_06_ratio_contributions_per_giving_unit',
        'c04_06_yes_no_contributions_per_giving_unit'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithoutDR',
        record,
        '_02_01sr___01_contributions_without_donor_restrictions',
        'c04_06_yes_no_contributions_per_giving_unit',
        'contributionsPerGivingUnit'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithDR',
        record,
        '_02_01sr___02_contributions_with_donor_restrictions',
        'c04_06_yes_no_contributions_per_giving_unit',
        'contributionsPerGivingUnit'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'givingUnit',
        record,
        '_06_01nonfin___02_giving_unit',
        'c04_06_yes_no_contributions_per_giving_unit',
        'contributionsPerGivingUnit'
      );

      // contributionsPerMissionaryUnit
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsPerMissionaryUnit_Peer',
        record,
        'c04_07_ratio_contributions_per_missionary_unit',
        'c04_07_yes_no_contributions_per_missionary_unit'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithoutDR',
        record,
        '_02_01sr___01_contributions_without_donor_restrictions',
        'c04_07_yes_no_contributions_per_missionary_unit',
        'contributionsPerMissionaryUnit'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithDR',
        record,
        '_02_01sr___02_contributions_with_donor_restrictions',
        'c04_07_yes_no_contributions_per_missionary_unit',
        'contributionsPerMissionaryUnit'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'missionaryUnit',
        record,
        '_06_01nonfin___01_missionary_unit',
        'c04_07_yes_no_contributions_per_missionary_unit',
        'contributionsPerMissionaryUnit'
      );

      // contributionsPerFullTimeEquivalent
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsPerFullTimeEquivalent_Peer',
        record,
        'c04_08_ratio_contributions_per_full_time_equivalent',
        'c04_08_yes_no_contributions_per_full_time_equivalent'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithoutDR',
        record,
        '_02_01sr___01_contributions_without_donor_restrictions',
        'c04_08_yes_no_contributions_per_full_time_equivalent',
        'contributionsPerFullTimeEquivalent'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithDR',
        record,
        '_02_01sr___02_contributions_with_donor_restrictions',
        'c04_08_yes_no_contributions_per_full_time_equivalent',
        'contributionsPerFullTimeEquivalent'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'numberOfEmployeesFTE',
        record,
        '_06_01nonfin___03_number_of_employees_fte',
        'c04_08_yes_no_contributions_per_full_time_equivalent',
        'contributionsPerFullTimeEquivalent'
      );

      // fundraisingAsPercentOfContributions
      insertDataIntoObject(
        'peer',
        year,
        object,
        'fundraisingAsPercentOfContributions_Peer',
        record,
        'c04_09_ratio_fundraising_as_percent_of_contributions',
        'c04_09_yes_no_fundraising_as_percent_of_contributions'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithoutDR',
        record,
        '_02_01sr___01_contributions_without_donor_restrictions',
        'c04_09_yes_no_fundraising_as_percent_of_contributions',
        'fundraisingAsPercentOfContributions'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'contributionsWithDR',
        record,
        '_02_01sr___02_contributions_with_donor_restrictions',
        'c04_09_yes_no_fundraising_as_percent_of_contributions',
        'fundraisingAsPercentOfContributions'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'fundraisingExpenses',
        record,
        '_02_03exp___03_fundraising_expenses',
        'c04_09_yes_no_fundraising_as_percent_of_contributions',
        'fundraisingAsPercentOfContributions'
      );

      // annualizedInvestmentReturn
      insertDataIntoObject(
        'peer',
        year,
        object,
        'annualizedInvestmentReturn_Peer',
        record,
        '0'
      );

    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // netIncomeRatio
      insertDataIntoObject(
        'client',
        year,
        object,
        'netIncomeRatio_Client',
        record,
        'c04_01_ratio_net_income_ratio'
      );

      // contributionsTrend_basedOnNumberOfDonors
      insertDataIntoObject(
        'client',
        year,
        object,
        'contributionsTrend_basedOnNumberOfDonors_Client',
        record,
        'c04_02_ratio_contributions_trend_based_on_donor_count'
      );

      // contributionsTrend
      insertDataIntoObject(
        'client',
        year,
        object,
        'contributionsTrend_Client',
        record,
        'c04_03_ratio_contributions_trend'
      );

      // contributionsPercentWithoutDR
      insertDataIntoObject(
        'client',
        year,
        object,
        'contributionsPercentWithoutDR_Client',
        record,
        'c04_04_ratio_contributions_percent_without_donor_restrictions'
      );

      // contributionsPercentWithDR
      insertDataIntoObject(
        'client',
        year,
        object,
        'contributionsPercentWithDR_Client',
        record,
        'c04_05_ratio_contributions_percent_with_donor_restrictions'
      );

      // contributionsPerGivingUnit
      insertDataIntoObject(
        'client',
        year,
        object,
        'contributionsPerGivingUnit_Client',
        record,
        'c04_06_ratio_contributions_per_giving_unit'
      );

      // contributionsPerMissionaryUnit
      insertDataIntoObject(
        'client',
        year,
        object,
        'contributionsPerMissionaryUnit_Client',
        record,
        'c04_07_ratio_contributions_per_missionary_unit'
      );
      // contributionsPerFullTimeEquivalent
      insertDataIntoObject(
        'client',
        year,
        object,
        'contributionsPerFullTimeEquivalent_Client',
        record,
        'c04_08_ratio_contributions_per_full_time_equivalent'
      );
      // fundraisingAsPercentOfContributions
      insertDataIntoObject(
        'client',
        year,
        object,
        'fundraisingAsPercentOfContributions_Client',
        record,
        'c04_09_ratio_fundraising_as_percent_of_contributions'
      );
      // annualizedInvestmentReturn
      insertDataIntoObject(
        'client',
        year,
        object,
        'annualizedInvestmentReturn_Client',
        record,
        'c04_10_ratio_annualized_investment_return'
      );



    });

    localStorage.removeItem('incomeData');
    localStorage.setItem('incomeData', JSON.stringify(object));
  });
};

const processExpenseData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {});

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {});

    localStorage.removeItem('expenseData');
    localStorage.setItem('expenseData', JSON.stringify(object));
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
      processCashData(selectedYears, recordsPeer, recordsClient);
      processAssetData(selectedYears, recordsPeer, recordsClient);
      processIncomeData(selectedYears, recordsPeer, recordsClient);
      // processExpenseData(selectedYears, recordsPeer, recordsClient);

      // displayEnrollmentComponent();
      // displayCashComponent();
      // displayAssetComponent();
      // displayDebtComponent();
      // displayIncomeComponent();
      // displayExpenseComponent();
      displayReportComponent();
    } catch (err) {
      console.error(err);
    }
  });
};
