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
        'DepreciationAndAmortization',
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
        'netAssetsWithoutDR',
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

      // daysFinancialAssetsOnHandToFundAnnualExpenditures
      insertDataIntoObject(
        'peer',
        year,
        object,
        'daysFinancialAssetsOnHandToFundAnnualExpenditures_Peer',
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
        'daysFinancialAssetsOnHandToFundAnnualExpenditures'
      );
      insertDataIntoObject(
        'peer',
        year,
        object,
        'totalExpenses',
        record,
        '_02_03exp___05_total_expenses',
        'c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures',
        'daysFinancialAssetsOnHandToFundAnnualExpenditures'
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

      // daysFinancialAssetsOnHandToFundAnnualExpenditures
      insertDataIntoObject(
        'client',
        year,
        object,
        'daysFinancialAssetsOnHandToFundAnnualExpenditures_Client',
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
    filteredPeerRecords.forEach((record) => {});

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {});

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
    filteredPeerRecords.forEach((record) => {});

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        'fiscal_ye_date_formatted_year_text'
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {});

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
