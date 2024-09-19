const fetchClientData = async () => {
  return fetch("./data/clientData.xml")
    .then((response) => response.text())
    .then((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      return xmlDoc.querySelectorAll("record");
    })
    .catch((error) => {
      console.error("Error fetching XML file (fetchClientData):", error);
      return []; // Return an empty array in case of error
    });
};

const fetchPeerData = async () => {
  return fetch("./data/peerData.xml")
    .then((response) => response.text())
    .then((xmlString) => {
      // console.log(xmlString);
      const parser = new DOMParser();
      // changes
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      return xmlDoc.querySelectorAll("record");
    })
    .catch((error) => {
      console.error("Error fetching XML file (fetchPeerData):", error);
      return []; // Return an empty array in case of error
    });
};

document.addEventListener("DOMContentLoaded", async () => {
  const recordsClient = await fetchClientData();

  document.getElementById("firmName").textContent =
    recordsClient[0].querySelector("pe___client_legal_name").textContent;

  findUniqueYears(recordsClient);

  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
  addUniqueTypesToOptionsSelectTypeDropdown(types_Array);

  resetSelectedYears()
  localStorage.clear();
});

const findUniqueYears = (data) => {
  data.forEach((item) => {
    const yearElement = item.querySelector(
      "fiscal_ye_date_formatted_year_text"
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
    child == 0
      ? 0
      : record.querySelector(child).innerHTML.split("").length > 0
      ? record.querySelector(child).innerHTML.trim()
      : 0;

  if (type === "client") {
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
      dynamicValueClientPeer == "Yes"
        ? "Yes"
        : dynamicValueClientPeer &&
          record.querySelector(dynamicValueClientPeer).textContent.trim();

    if (yesNoField == "Yes") {
      if (!object[dataKey]) {
        object[dataKey] = {};
      }
      if (!object[dataKey][year]) {
        object[dataKey][year] = [];
      }

      if (!name) {
        if (!object[dataKey]["total"]) {
          object[dataKey]["total"] = [];
        }
        object[dataKey]["total"].push(innerData);
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
        "fiscal_ye_date_formatted_year_text"
      ).textContent;

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
        "0"
      );

      // missionaryUnit
      insertDataIntoObject(
        "peer",
        year,
        object,
        "missionaryUnit_Peer",
        record,
        "0"
      );

      // numberOfEmployeesFTE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "numberOfEmployeesFTE_Peer",
        record,
        "0"
      );

      // itExpenses
      insertDataIntoObject(
        "peer",
        year,
        object,
        "itExpenses_Peer",
        record,
        "c01_04_ratio_it_expenses",
        "c01_04_yes_no_it_expenses"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;
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
        "c01_01_ratio_giving_units"
      );

      // missionaryUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "missionaryUnit_Client",
        record,
        "c01_02_ratio_missionary_unit"
      );

      // numberOfEmployeesFTE
      insertDataIntoObject(
        "client",
        year,
        object,
        "numberOfEmployeesFTE_Client",
        record,
        "c01_03_ratio_number_of_employees_fte"
      );

      // itExpenses
      insertDataIntoObject(
        "client",
        year,
        object,
        "itExpenses_Client",
        record,
        "c01_04_ratio_it_expenses"
      );
    });

    localStorage.removeItem("generalData");
    localStorage.setItem("generalData", JSON.stringify(object));
  });

  localStorage.removeItem("generalData");
  localStorage.setItem("generalData", JSON.stringify(object));
};

const processCashData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // daysCashOnHand
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysCashOnHand_Peer",
        record,
        "c02_01_ratio_days_cash_on_hand",
        "c02_01_yes_no_days_cash_on_hand"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashAndCashEquivalents",
        record,
        "_01__01ass___01_cash_and_cash_equivalents",
        "c02_01_yes_no_days_cash_on_hand",
        "daysCashOnHand"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_01_yes_no_days_cash_on_hand",
        "daysCashOnHand"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "depreciationAndAmortization",
        record,
        "_04_01fexp___06_depreciation_and_amortization",
        "c02_01_yes_no_days_cash_on_hand",
        "daysCashOnHand"
      );

      // daysExpensesInUnrestrictedNA
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysExpensesInUnrestrictedNA_Peer",
        record,
        "c02_02_ratio_days_expenses_in_unrestricted_na",
        "c02_02_yes_no_days_expenses_in_unrestricted_na"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithoutDR",
        record,
        "_01__03na___01_net_assets_without_donor_restrictions",
        "c02_02_yes_no_days_expenses_in_unrestricted_na",
        "daysExpensesInUnrestrictedNA"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_02_yes_no_days_expenses_in_unrestricted_na",
        "daysExpensesInUnrestrictedNA"
      );

      // daysExpensesInUnrestrictedNA_excludingPPE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysExpensesInUnrestrictedNA_excludingPPE_Peer",
        record,
        "c02_02a_ratio_days_expenses_in_unrestricted_na_less_ppe",
        "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRByPurposeOrTime",
        record,
        "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
        "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
        "daysExpensesInUnrestrictedNA_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRInPerpetuity",
        record,
        "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
        "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
        "daysExpensesInUnrestrictedNA_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "propertyPlantAndEquipment",
        record,
        "_01__01ass___09_property__plant_and_equipment",
        "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
        "daysExpensesInUnrestrictedNA_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "notesPayable",
        record,
        "_01__02liab___02_notes_payable",
        "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
        "daysExpensesInUnrestrictedNA_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
        "daysExpensesInUnrestrictedNA_excludingPPE"
      );

      // daysExpensesInNAwithDR
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysExpensesInNAwithDR_Peer",
        record,
        "c02_03_ratio_days_expenses_in_net_assets_with_dr",
        "c02_02_yes_no_days_expenses_in_unrestricted_na"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRByPurposeOrTime",
        record,
        "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
        "c02_02_yes_no_days_expenses_in_unrestricted_na",
        "daysExpensesInNAwithDR"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRInPerpetuity",
        record,
        "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
        "c02_02_yes_no_days_expenses_in_unrestricted_na",
        "daysExpensesInNAwithDR"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_02_yes_no_days_expenses_in_unrestricted_na",
        "daysExpensesInNAwithDR"
      );

      // daysExpensesInNAwithDR_excludingPPE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysExpensesInNAwithDR_excludingPPE_Peer",
        record,
        "c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe",
        "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRByPurposeOrTime",
        record,
        "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
        "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
        "daysExpensesInNAwithDR_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRInPerpetuity",
        record,
        "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
        "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
        "daysExpensesInNAwithDR_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "propertyPlantAndEquipment",
        record,
        "_01__01ass___09_property__plant_and_equipment",
        "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
        "daysExpensesInNAwithDR_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "notesPayable",
        record,
        "_01__02liab___02_notes_payable",
        "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
        "daysExpensesInNAwithDR_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
        "daysExpensesInNAwithDR_excludingPPE"
      );

      // liquidityFundsAvailable
      insertDataIntoObject(
        "peer",
        year,
        object,
        "liquidityFundsAvailable_Peer",
        record,
        "c02_05_ratio_liquidity_funds_available",
        "c02_05_yes_no_liquidity_funds_available"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAssets",
        record,
        "_01__01ass___10_total_assets",
        "c02_05_yes_no_liquidity_funds_available",
        "liquidityFundsAvailable"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "propertyPlantAndEquipment",
        record,
        "_01__01ass___09_property__plant_and_equipment",
        "c02_05_yes_no_liquidity_funds_available",
        "liquidityFundsAvailable"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalLiabilities",
        record,
        "_01__02liab___05_total_liabilities",
        "c02_05_yes_no_liquidity_funds_available",
        "liquidityFundsAvailable"
      );

      // liquidityRatio
      insertDataIntoObject(
        "peer",
        year,
        object,
        "liquidityRatio_Peer",
        record,
        "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
        "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "financialAssetsAvailablePerLiquidity",
        record,
        "_05_01liquid___01_financial_assets_available_per_liquidity_fn",
        "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
        "liquidityRatio"
      );

      // financialAssetsAvailableFY
      insertDataIntoObject(
        "peer",
        year,
        object,
        "financialAssetsAvailableFY_Peer",
        record,
        "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
        "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "financialAssetsAvailablePerLiquidity",
        record,
        "_05_01liquid___01_financial_assets_available_per_liquidity_fn",
        "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
        "financialAssetsAvailableFY"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
        "financialAssetsAvailableFY"
      );

      // daysFinancialAssetsOnHand
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysFinancialAssetsOnHand_Peer",
        record,
        "c02_07_ratio_days_financial_assets_on_hand_to_fund_expenditures",
        "c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "financialAssetsAvailablePerLiquidity",
        record,
        "_05_01liquid___01_financial_assets_available_per_liquidity_fn",
        "c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures",
        "daysFinancialAssetsOnHand"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures",
        "daysFinancialAssetsOnHand"
      );

      // currentRatio
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentRatio_Peer",
        record,
        "c02_08_ratio_current_ratio",
        "c02_08_yes_no_current_ratio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAssets",
        record,
        "_01__01ass___10_total_assets",
        "c02_08_yes_no_current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashAndCashEquivalents",
        record,
        "_01__01ass___01_cash_and_cash_equivalents",
        "c02_08_yes_no_current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "investments",
        record,
        "_01__01ass___03_investments",
        "c02_08_yes_no_current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "longTermLiabilities",
        record,
        "_01__02liab___04_long_term_liabilities",
        "c02_08_yes_no_current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "propertyPlantAndEquipment",
        record,
        "_01__01ass___09_property__plant_and_equipment",
        "c02_08_yes_no_current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalLiabilities",
        record,
        "_01__02liab___05_total_liabilities",
        "c02_08_yes_no_current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "notesPayable",
        record,
        "_01__02liab___02_notes_payable",
        "c02_08_yes_no_current_ratio",
        "currentRatio"
      );

      // totalCoverageRatio
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCoverageRatio_Peer",
        record,
        "c02_09_ratio_total_coverage_ratio",
        "c02_09_yes_no_total_coverage_ratio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAssets",
        record,
        "_01__01ass___10_total_assets",
        "c02_09_yes_no_total_coverage_ratio",
        "totalCoverageRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalLiabilities",
        record,
        "_01__02liab___05_total_liabilities",
        "c02_09_yes_no_total_coverage_ratio",
        "totalCoverageRatio"
      );

      // cashFlowsTrendFinancing
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashFlowsTrendFinancing_Peer",
        record,
        "0"
      );

      // cashFlowsTrendInvesting
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashFlowsTrendInvesting_Peer",
        record,
        "0"
      );

      // cashFlowsTrendOperating
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashFlowsTrendOperating_Peer",
        record,
        "0"
      );

      // cashFlowsTrendTotal
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashFlowsTrendTotal_Peer",
        record,
        "0"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // daysCashOnHand
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysCashOnHand_Client",
        record,
        "c02_01_ratio_days_cash_on_hand"
      );

      // daysExpensesInUnrestrictedNA_
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysExpensesInUnrestrictedNA_Client",
        record,
        "c02_02_ratio_days_expenses_in_unrestricted_na"
      );

      // daysExpensesInUnrestrictedNA_excludingPPE
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysExpensesInUnrestrictedNA_excludingPPE_Client",
        record,
        "c02_02a_ratio_days_expenses_in_unrestricted_na_less_ppe"
      );

      // daysExpensesInNAwithDR
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysExpensesInNAwithDR_Client",
        record,
        "c02_03_ratio_days_expenses_in_net_assets_with_dr"
      );

      // daysExpensesInNAwithDR_excludingPPE
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysExpensesInNAwithDR_excludingPPE_Client",
        record,
        "c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe"
      );

      // liquidityFundsAvailable
      insertDataIntoObject(
        "client",
        year,
        object,
        "liquidityFundsAvailable_Client",
        record,
        "c02_05_ratio_liquidity_funds_available"
      );

      // liquidityRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "liquidityRatio_Client",
        record,
        "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
      );

      // financialAssetsAvailableFY
      insertDataIntoObject(
        "client",
        year,
        object,
        "financialAssetsAvailableFY_Client",
        record,
        "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
      );

      // daysFinancialAssetsOnHand
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysFinancialAssetsOnHand_Client",
        record,
        "c02_07_ratio_days_financial_assets_on_hand_to_fund_expenditures"
      );

      // currentRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "currentRatio_Client",
        record,
        "c02_08_ratio_current_ratio"
      );

      // totalCoverageRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalCoverageRatio_Client",
        record,
        "c02_09_ratio_total_coverage_ratio"
      );

      // cashFlowsTrendFinancing
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashFlowsTrendFinancing_Client",
        record,
        "c02_10a_ratio_cash_flows_trend___financing"
      );

      // cashFlowsTrendInvesting
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashFlowsTrendInvesting_Client",
        record,
        "c02_10b_ratio_cash_flows_trend___investing"
      );

      // cashFlowsTrendOperating
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashFlowsTrendOperating_Client",
        record,
        "c02_10c_ratio_cash_flows_trend___operating"
      );

      // cashFlowsTrendTotal
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashFlowsTrendTotal_Client",
        record,
        "_03_01cashflow___total"
      );
    });

    localStorage.removeItem("cashData");
    localStorage.setItem("cashData", JSON.stringify(object));
  });

  localStorage.removeItem("cashData");
  localStorage.setItem("cashData", JSON.stringify(object));
};

const processAssetData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // percentWithDR
      insertDataIntoObject(
        "peer",
        year,
        object,
        "percentWithDR_Peer",
        record,
        "c03_01_ratio_percent_with_donor_restrictions",
        "c03_01_yes_no_percent_with_donor_restrictions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRByPurposeOrTime",
        record,
        "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
        "c03_01_yes_no_percent_with_donor_restrictions",
        "percentWithDR"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithDRInPerpetuity",
        record,
        "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
        "c03_01_yes_no_percent_with_donor_restrictions",
        "percentWithDR"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalNetAssets",
        record,
        "_01__03na___04_total_net_assets",
        "c03_01_yes_no_percent_with_donor_restrictions",
        "percentWithDR"
      );

      // percentWithoutDR_excludingPPE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "percentWithoutDR_Peer",
        record,
        "c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
        "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithoutDR",
        record,
        "_01__03na___01_net_assets_without_donor_restrictions",
        "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
        "percentWithoutDR_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "propertyPlantAndEquipment",
        record,
        "_01__01ass___09_property__plant_and_equipment",
        "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
        "percentWithoutDR_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "notesPayable",
        record,
        "_01__02liab___02_notes_payable",
        "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
        "percentWithoutDR_excludingPPE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalNetAssets",
        record,
        "_01__03na___04_total_net_assets",
        "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
        "percentWithoutDR_excludingPPE"
      );

      // percentWithoutDR
      insertDataIntoObject(
        "peer",
        year,
        object,
        "percentWithoutDR_excludingPPE_Peer",
        record,
        "c03_03_ratio_percent_without_donor_restrictions",
        "c03_03_yes_no_percent_without_donor_restrictions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetsWithoutDR",
        record,
        "_01__03na___01_net_assets_without_donor_restrictions",
        "c03_03_yes_no_percent_without_donor_restrictions",
        "percentWithoutDR"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalNetAssets",
        record,
        "_01__03na___04_total_net_assets",
        "c03_03_yes_no_percent_without_donor_restrictions",
        "percentWithoutDR"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // percentWithDR
      insertDataIntoObject(
        "client",
        year,
        object,
        "percentWithDR_Client",
        record,
        "c03_01_ratio_percent_with_donor_restrictions"
      );

      // percentWithoutDR_excludingPPE
      insertDataIntoObject(
        "client",
        year,
        object,
        "percentWithoutDR_excludingPPE_Client",
        record,
        "c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe"
      );

      // percentWithoutDR
      insertDataIntoObject(
        "client",
        year,
        object,
        "percentWithoutDR_Client",
        record,
        "c03_03_ratio_percent_without_donor_restrictions"
      );
    });

    localStorage.removeItem("assetData");
    localStorage.setItem("assetData", JSON.stringify(object));
  });

  localStorage.removeItem("assetData");
  localStorage.setItem("assetData", JSON.stringify(object));
};

const processIncomeData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // netIncomeRatio
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netIncomeRatio_Peer",
        record,
        "c04_01_ratio_net_income_ratio",
        "c04_01_yes_no_net_income_ratio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "changeInNetAssetsWithoutDR",
        record,
        "_02_04change___01_change_in_net_assets_without_donor_restriction",
        "c04_01_yes_no_net_income_ratio",
        "netIncomeRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "changeInNetAssetsWithDR",
        record,
        "_02_04change___02_change_in_net_assets_with_donor_restriction",
        "c04_01_yes_no_net_income_ratio",
        "netIncomeRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSupportAndRevenueWithoutDR",
        record,
        "_02_01sr___08_total_support_and_revenue_without_donor_restrictions",
        "c04_01_yes_no_net_income_ratio",
        "netIncomeRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSupportAndRevenueWithDR",
        record,
        "_02_01sr___09_total_support_and_revenue_with_donor_restrictions",
        "c04_01_yes_no_net_income_ratio",
        "netIncomeRatio"
      );

      // contributionsTrend_basedOnNumberOfDonors
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsTrend_basedOnNumberOfDonors_Peer",
        record,
        "__c04_02_ratio_contributions_trend_based_on_donor_count",
        "c04_02_yes_no_contributions_trend_based_on_donor_count"
      );

      // contributionsTrend
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsTrend_Peer",
        record,
        "__c04_03_ratio_contributions_trend",
        "c04_03_yes_no_contributions_trend"
      );

      // contributionsPercentWithoutDR
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsPercentWithoutDR_Peer",
        record,
        "c04_04_ratio_contributions_percent_without_donor_restrictions",
        "c04_04_yes_no_contributions_percent_without_donor_restrictions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDR",
        record,
        "_02_01sr___01_contributions_without_donor_restrictions",
        "c04_04_yes_no_contributions_percent_without_donor_restrictions",
        "contributionsPercentWithoutDR"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c04_04_yes_no_contributions_percent_without_donor_restrictions",
        "contributionsPercentWithoutDR"
      );

      // contributionsPercentWithDR
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsPercentWithDR_Peer",
        record,
        "c04_05_ratio_contributions_percent_with_donor_restrictions",
        "c04_05_yes_no_contributions_percent_with_donor_restrictions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDR",
        record,
        "_02_01sr___01_contributions_without_donor_restrictions",
        "c04_05_yes_no_contributions_percent_with_donor_restrictions",
        "contributionsPercentWithDR"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c04_05_yes_no_contributions_percent_with_donor_restrictions",
        "contributionsPercentWithDR"
      );

      // contributionsPerGivingUnit
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsPerGivingUnit_Peer",
        record,
        "c04_06_ratio_contributions_per_giving_unit",
        "c04_06_yes_no_contributions_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDR",
        record,
        "_02_01sr___01_contributions_without_donor_restrictions",
        "c04_06_yes_no_contributions_per_giving_unit",
        "contributionsPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c04_06_yes_no_contributions_per_giving_unit",
        "contributionsPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnit",
        record,
        "_06_01nonfin___02_giving_unit",
        "c04_06_yes_no_contributions_per_giving_unit",
        "contributionsPerGivingUnit"
      );

      // contributionsPerMissionaryUnit
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsPerMissionaryUnit_Peer",
        record,
        "c04_07_ratio_contributions_per_missionary_unit",
        "c04_07_yes_no_contributions_per_missionary_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDR",
        record,
        "_02_01sr___01_contributions_without_donor_restrictions",
        "c04_07_yes_no_contributions_per_missionary_unit",
        "contributionsPerMissionaryUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c04_07_yes_no_contributions_per_missionary_unit",
        "contributionsPerMissionaryUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "missionaryUnit",
        record,
        "_06_01nonfin___01_missionary_unit",
        "c04_07_yes_no_contributions_per_missionary_unit",
        "contributionsPerMissionaryUnit"
      );

      // contributionsPerFullTimeEquivalent
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsPerFullTimeEquivalent_Peer",
        record,
        "c04_08_ratio_contributions_per_full_time_equivalent",
        "c04_08_yes_no_contributions_per_full_time_equivalent"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDR",
        record,
        "_02_01sr___01_contributions_without_donor_restrictions",
        "c04_08_yes_no_contributions_per_full_time_equivalent",
        "contributionsPerFullTimeEquivalent"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c04_08_yes_no_contributions_per_full_time_equivalent",
        "contributionsPerFullTimeEquivalent"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "numberOfEmployeesFTE",
        record,
        "_06_01nonfin___03_number_of_employees_fte",
        "c04_08_yes_no_contributions_per_full_time_equivalent",
        "contributionsPerFullTimeEquivalent"
      );

      // fundraisingAsPercentOfContributions
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fundraisingAsPercentOfContributions_Peer",
        record,
        "c04_09_ratio_fundraising_as_percent_of_contributions",
        "c04_09_yes_no_fundraising_as_percent_of_contributions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDR",
        record,
        "_02_01sr___01_contributions_without_donor_restrictions",
        "c04_09_yes_no_fundraising_as_percent_of_contributions",
        "fundraisingAsPercentOfContributions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c04_09_yes_no_fundraising_as_percent_of_contributions",
        "fundraisingAsPercentOfContributions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fundraisingExpenses",
        record,
        "_02_03exp___03_fundraising_expenses",
        "c04_09_yes_no_fundraising_as_percent_of_contributions",
        "fundraisingAsPercentOfContributions"
      );

      // annualizedInvestmentReturn
      insertDataIntoObject(
        "peer",
        year,
        object,
        "annualizedInvestmentReturn_Peer",
        record,
        "__c04_10_ratio_annualized_investment_return",
        "c04_10_yes_no_annualized_investment_return"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "investmentIncome",
        record,
        "_02_01sr___03_investment_income",
        "c04_10_yes_no_annualized_investment_return",
        "annualizedInvestmentReturn"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "Investments",
        record,
        "_01__01ass___03_investments",
        "c04_10_yes_no_annualized_investment_return",
        "annualizedInvestmentReturn"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // netIncomeRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "netIncomeRatio_Client",
        record,
        "c04_01_ratio_net_income_ratio"
      );

      // contributionsTrend_basedOnNumberOfDonors
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsTrend_basedOnNumberOfDonors_Client",
        record,
        "c04_02_ratio_contributions_trend_based_on_donor_count"
      );

      // contributionsTrend
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsTrend_Client",
        record,
        "c04_03_ratio_contributions_trend"
      );

      // contributionsPercentWithoutDR
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsPercentWithoutDR_Client",
        record,
        "c04_04_ratio_contributions_percent_without_donor_restrictions"
      );

      // contributionsPercentWithDR
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsPercentWithDR_Client",
        record,
        "c04_05_ratio_contributions_percent_with_donor_restrictions"
      );

      // contributionsPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsPerGivingUnit_Client",
        record,
        "c04_06_ratio_contributions_per_giving_unit"
      );

      // contributionsPerMissionaryUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsPerMissionaryUnit_Client",
        record,
        "c04_07_ratio_contributions_per_missionary_unit"
      );
      // contributionsPerFullTimeEquivalent
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsPerFullTimeEquivalent_Client",
        record,
        "c04_08_ratio_contributions_per_full_time_equivalent"
      );
      // fundraisingAsPercentOfContributions
      insertDataIntoObject(
        "client",
        year,
        object,
        "fundraisingAsPercentOfContributions_Client",
        record,
        "c04_09_ratio_fundraising_as_percent_of_contributions"
      );
      // annualizedInvestmentReturn
      insertDataIntoObject(
        "client",
        year,
        object,
        "annualizedInvestmentReturn_Client",
        record,
        "c04_10_ratio_annualized_investment_return"
      );
    });

    localStorage.removeItem("incomeData");
    localStorage.setItem("incomeData", JSON.stringify(object));
  });

  localStorage.removeItem("incomeData");
  localStorage.setItem("incomeData", JSON.stringify(object));
};

const processExpenseData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // functionalExpensePercent_program
      insertDataIntoObject(
        "peer",
        year,
        object,
        "functionalExpensePercent_program_Peer",
        record,
        "c05_01_ratio_functional_expense_percentage___program",
        "c05_01_yes_no_functional_expense_percentage___program"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "programExpenses",
        record,
        "_02_03exp___01_program_expenses",
        "c05_01_yes_no_functional_expense_percentage___program",
        "functionalExpensePercent_program"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_01_yes_no_functional_expense_percentage___program",
        "functionalExpensePercent_program"
      );

      // functionalExpensePercent_administrative
      insertDataIntoObject(
        "peer",
        year,
        object,
        "functionalExpensePercent_administrative_Peer",
        record,
        "c05_02_ratio_functional_expense_percentage___administrative",
        "c05_02_yes_no_functional_expense_percentage___administrative"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "administrativeExpenses",
        record,
        "_02_03exp___02_administrative_expenses",
        "c05_02_yes_no_functional_expense_percentage___administrative",
        "functionalExpensePercent_administrative"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_02_yes_no_functional_expense_percentage___administrative",
        "functionalExpensePercent_administrative"
      );

      // functionalExpensePercent_fundraising
      insertDataIntoObject(
        "peer",
        year,
        object,
        "functionalExpensePercent_fundraising_Peer",
        record,
        "c05_03_ratio_functional_expense_percentage___fundraising",
        "c05_03_yes_no_functional_expense_percentage___fundraising"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fundraisingExpenses",
        record,
        "_02_03exp___03_fundraising_expenses",
        "c05_03_yes_no_functional_expense_percentage___fundraising",
        "functionalExpensePercent_fundraising"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_03_yes_no_functional_expense_percentage___fundraising",
        "functionalExpensePercent_fundraising"
      );

      // functionalExpensePercent_other
      insertDataIntoObject(
        "peer",
        year,
        object,
        "functionalExpensePercent_other_Peer",
        record,
        "c05_04_ratio_functional_expense_percentage___other",
        "c05_04_yes_no_functional_expense_percentage___other"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "otherExpenses",
        record,
        "_02_03exp___04_other_expenses",
        "c05_04_yes_no_functional_expense_percentage___other",
        "functionalExpensePercent_other"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_04_yes_no_functional_expense_percentage___other",
        "functionalExpensePercent_other"
      );

      // costOfContributions
      insertDataIntoObject(
        "peer",
        year,
        object,
        "costOfContributions_Peer",
        record,
        "c05_05_ratio_cost_of_contributions_raise_1_dollar",
        "c05_05_yes_no_cost_of_contributions_raise_1_dollar"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fundraisingExpenses",
        record,
        "_02_03exp___03_fundraising_expenses",
        "c05_05_yes_no_cost_of_contributions_raise_1_dollar",
        "costOfContributions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDR",
        record,
        "_02_01sr___01_contributions_without_donor_restrictions",
        "c05_05_yes_no_cost_of_contributions_raise_1_dollar",
        "costOfContributions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c05_05_yes_no_cost_of_contributions_raise_1_dollar",
        "costOfContributions"
      );

      // expensesPerGivingUnit
      insertDataIntoObject(
        "peer",
        year,
        object,
        "expensesPerGivingUnit_Peer",
        record,
        "c05_06_ratio_expenses_per_giving_unit",
        "c05_06_yes_no_expenses_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_06_yes_no_expenses_per_giving_unit",
        "expensesPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnit",
        record,
        "_06_01nonfin___02_giving_unit",
        "c05_06_yes_no_expenses_per_giving_unit",
        "expensesPerGivingUnit"
      );

      // expensesPerMissionaryUnit
      insertDataIntoObject(
        "peer",
        year,
        object,
        "expensesPerMissionaryUnit_Peer",
        record,
        "c05_07_ratio_expenses_per_missionary_unit",
        "c05_07_yes_no_expenses_per_missionary_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_07_yes_no_expenses_per_missionary_unit",
        "expensesPerMissionaryUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "missionaryUnit",
        record,
        "_06_01nonfin___01_missionary_unit",
        "c05_07_yes_no_expenses_per_missionary_unit",
        "expensesPerMissionaryUnit"
      );

      // expensesPerFullTimeEquivalent
      insertDataIntoObject(
        "peer",
        year,
        object,
        "expensesPerFullTimeEquivalent_Peer",
        record,
        "c05_08_ratio_expenses_per_full_time_equivalent",
        "c05_08_yes_no_expenses_per_full_time_equivalent"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_08_yes_no_expenses_per_full_time_equivalent",
        "expensesPerFullTimeEquivalent"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "numberOfEmployeesFTE",
        record,
        "_06_01nonfin___03_number_of_employees_fte",
        "c05_08_yes_no_expenses_per_full_time_equivalent",
        "expensesPerFullTimeEquivalent"
      );

      // salariesAndBenefitsAsPercentOfTotalExpenses
      insertDataIntoObject(
        "peer",
        year,
        object,
        "salariesAndBenefitsAsPercentOfTotalExpenses_Peer",
        record,
        "c05_09_ratio_salaries_and_benefits_as_percent_of_total_expenses",
        "c05_09_yes_no_salaries_and_benefits_as_percent_of_total_expenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "salariesAndBenefits",
        record,
        "_04_01fexp___03_salaries___benefits",
        "c05_09_yes_no_salaries_and_benefits_as_percent_of_total_expenses",
        "salariesAndBenefitsAsPercentOfTotalExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpenses",
        record,
        "_02_03exp___05_total_expenses",
        "c05_09_yes_no_salaries_and_benefits_as_percent_of_total_expenses",
        "salariesAndBenefitsAsPercentOfTotalExpenses"
      );

      // salariesAndBenefitsPerFTE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "salariesAndBenefitsPerFTE_Peer",
        record,
        "c05_10_ratio_salaries___benefits_per_fte",
        "c05_10_yes_no_salaries___benefits_per_fte"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "salariesAndBenefits",
        record,
        "_04_01fexp___03_salaries___benefits",
        "c05_10_yes_no_salaries___benefits_per_fte",
        "salariesAndBenefitsPerFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "numberOfEmployeesFTE",
        record,
        "_06_01nonfin___03_number_of_employees_fte",
        "c05_10_yes_no_salaries___benefits_per_fte",
        "salariesAndBenefitsPerFTE"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // functionalExpensePercent_program
      insertDataIntoObject(
        "client",
        year,
        object,
        "functionalExpensePercent_program_Client",
        record,
        "c05_01_ratio_functional_expense_percentage___program"
      );
      // functionalExpensePercent_administrative
      insertDataIntoObject(
        "client",
        year,
        object,
        "functionalExpensePercent_administrative_Client",
        record,
        "c05_02_ratio_functional_expense_percentage___administrative"
      );
      // functionalExpensePercent_fundraising
      insertDataIntoObject(
        "client",
        year,
        object,
        "functionalExpensePercent_fundraising_Client",
        record,
        "c05_03_ratio_functional_expense_percentage___fundraising"
      );
      // functionalExpensePercent_other
      insertDataIntoObject(
        "client",
        year,
        object,
        "functionalExpensePercent_other_Client",
        record,
        "c05_04_ratio_functional_expense_percentage___other"
      );
      // costOfContributions
      insertDataIntoObject(
        "client",
        year,
        object,
        "costOfContributions_Client",
        record,
        "c05_05_ratio_cost_of_contributions_raise_1_dollar"
      );
      // expensesPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "expensesPerGivingUnit_Client",
        record,
        "c05_06_ratio_expenses_per_giving_unit"
      );
      // expensesPerMissionaryUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "expensesPerMissionaryUnit_Client",
        record,
        "c05_07_ratio_expenses_per_missionary_unit"
      );
      // expensesPerFullTimeEquivalent
      insertDataIntoObject(
        "client",
        year,
        object,
        "expensesPerFullTimeEquivalent_Client",
        record,
        "c05_08_ratio_expenses_per_full_time_equivalent"
      );
      // salariesAndBenefitsAsPercentOfTotalExpenses
      insertDataIntoObject(
        "client",
        year,
        object,
        "salariesAndBenefitsAsPercentOfTotalExpenses_Client",
        record,
        "c05_09_ratio_salaries_and_benefits_as_percent_of_total_expenses"
      );
      // salariesAndBenefitsPerFTE
      insertDataIntoObject(
        "client",
        year,
        object,
        "salariesAndBenefitsPerFTE_Client",
        record,
        "c05_10_ratio_salaries___benefits_per_fte"
      );
    });

    localStorage.removeItem("expenseData");
    localStorage.setItem("expenseData", JSON.stringify(object));
  });

  localStorage.removeItem("expenseData");
  localStorage.setItem("expenseData", JSON.stringify(object));
};

const processMiscData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // percentageAssessmentOnRestrictedGifts
      insertDataIntoObject(
        "peer",
        year,
        object,
        "percentageAssessmentOnRestrictedGifts_Peer",
        record,
        "c06_01_ratio_percentage_assessment_on_restricted_gifts",
        "c06_01_yes_no_percentage_assessment_on_restricted_gifts"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAdministrativeAssessments",
        record,
        "_02_02reclass___01_total_administrative_assessments",
        "c06_01_yes_no_percentage_assessment_on_restricted_gifts",
        "percentageAssessmentOnRestrictedGifts"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithDR",
        record,
        "_02_01sr___02_contributions_with_donor_restrictions",
        "c06_01_yes_no_percentage_assessment_on_restricted_gifts",
        "percentageAssessmentOnRestrictedGifts"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      ).textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // percentageAssessmentOnRestrictedGifts
      insertDataIntoObject(
        "client",
        year,
        object,
        "percentageAssessmentOnRestrictedGifts_Client",
        record,
        "c06_01_ratio_percentage_assessment_on_restricted_gifts"
      );
    });

    localStorage.removeItem("miscData");
    localStorage.setItem("miscData", JSON.stringify(object));
  });

  localStorage.removeItem("miscData");
  localStorage.setItem("miscData", JSON.stringify(object));
};

// Helper functions

const countUniqueClients = (records) => {
  const uniqueClients = new Set();
  try {
    records.forEach((record) => {
      const fiscalYear = record.querySelector("fiscal_ye_date_formatted_year_text").textContent;
      if (selectedYears_Set.has(fiscalYear)) {
        const mainRelatedClient = record.querySelector("pe___client_legal_name").textContent;
        uniqueClients.add(mainRelatedClient);
      }
    });

    // console.log(uniqueClients);
    const count = uniqueClients.size;
    // console.log(count);
    document.getElementById("uniqueClients").textContent = count;
  } catch (error) {
    console.error("Error counting unique clients:", error);
    document.getElementById("uniqueClients").textContent = 0; // Set to 0 in case of error
  }
};


const toggleButtonLoadingState = (btn) => {
  btn.innerHTML = `
    <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Loading...`;
  btn.disabled = true;
};

const toggleButtonNormalState = (btn) => {
  btn.innerHTML = `
    <span class='text-xl mr-2'>Run</span>
    <svg class="w-8 h-8 text-2xl text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
    </svg>`;
  btn.disabled = false;
};

const toggleGenerateReportButtonNormalState = (btn) => {
  btn.innerHTML = `
  Generate Trends and Benchmark Reports
`;
};

const processSelectedYears = () => {
  const selectedYears = getSelectedYearsFromLocalStorage();

  // console.log(selectedYears);

  if (!selectedYears) {
    createToastWarning("Please select year(s) for data to appear");
    throw new Error("No years selected.");
  }

  if (!selectedYears.length) {
    createToastWarning("Please select year(s) for data to appear");
    throw new Error("No years selected.");
  }

  return selectedYears;
};

const saveSelectedYearsToLocalStorage = (selectedYears_Set) => {
  const selectedYearsArray = Array.from(selectedYears_Set).sort(
    (a, b) => a - b
  );
  localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
};

const resetSelectedYears = () => {
  const selectedYears_Set = new Set();
  saveSelectedYearsToLocalStorage(selectedYears_Set);
};

const processApiCalls = (selectedYears, recordsPeer, recordsClient) => {
  processGeneralData(selectedYears, recordsPeer, recordsClient);
  processCashData(selectedYears, recordsPeer, recordsClient);
  processAssetData(selectedYears, recordsPeer, recordsClient);
  processIncomeData(selectedYears, recordsPeer, recordsClient);
  processExpenseData(selectedYears, recordsPeer, recordsClient);
  processMiscData(selectedYears, recordsPeer, recordsClient);
};

const displayComponents = () => {
  displayGeneralComponent();
  displayCashComponent();
  // displayAssetComponent();
  displayIncomeComponent();
  displayExpenseComponent();
  displayReportComponent();
};

const run_btn = document.querySelector("#run");
run_btn.addEventListener("click", async () => {
  // destroyAllCharts()
  // uploadMainFile = ''
  // document.getElementById('print_modal_footer').classList.add('hidden');
  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData();
  countUniqueClients(recordsPeer);

  try {
    toggleButtonLoadingState(run_btn);
    const selectedYears = processSelectedYears();
    saveSelectedYearsToLocalStorage(selectedYears);
    processApiCalls(selectedYears, recordsPeer, recordsClient);
    displayComponents();
  } catch (err) {
    console.error(err);
  } finally {
    toggleButtonNormalState(run_btn);
  }
});
