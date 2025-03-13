// Data Model and Business Logic Classes
class DataStore {
  constructor() {
    this.generalData = {};
    this.cashData = {};
    this.assetData = {};
    this.incomeData = {};
    this.expenseData = {};
    this.miscData = {};
  }

  // Save all data categories to localStorage
  saveAllToLocalStorage() {
    localStorage.setItem("generalData", JSON.stringify(this.generalData));
    localStorage.setItem("cashData", JSON.stringify(this.cashData));
    localStorage.setItem("assetData", JSON.stringify(this.assetData));
    localStorage.setItem("incomeData", JSON.stringify(this.incomeData));
    localStorage.setItem("expenseData", JSON.stringify(this.expenseData));
    localStorage.setItem("miscData", JSON.stringify(this.miscData));
  }

  // Get a reference to the appropriate data object based on category
  getDataCategory(category) {
    switch (category) {
      case "general":
        return this.generalData;
      case "cash":
        return this.cashData;
      case "asset":
        return this.assetData;
      case "income":
        return this.incomeData;
      case "expense":
        return this.expenseData;
      case "misc":
        return this.miscData;
      default:
        throw new Error(`Unknown data category: ${category}`);
    }
  }

  // Insert data into the appropriate data structure
  insertData(
    category,
    type,
    year,
    dataKey,
    record,
    child,
    dynamicValueClientPeer,
    name
  ) {
    const targetData = this.getDataCategory(category);

    // Get the value from the record or default to 0
    const innerData =
      !child || child == 0
        ? 0
        : record.querySelector(child)?.innerHTML.trim().length > 0
        ? record.querySelector(child).innerHTML.trim()
        : 0;

    if (type === "client") {
      this.insertClientData(
        targetData,
        dataKey,
        year,
        innerData,
        record,
        dynamicValueClientPeer
      );
    } else {
      this.insertPeerData(
        targetData,
        dataKey,
        year,
        innerData,
        record,
        dynamicValueClientPeer,
        name
      );
    }
  }

  // Insert client data with benchmark if available
  insertClientData(targetData, dataKey, year, value, record, benchmarkField) {
    if (!targetData[dataKey]) {
      targetData[dataKey] = {};
    }

    if (!targetData[dataKey][year]) {
      targetData[dataKey][year] = {};
    }

    targetData[dataKey][year].value = value;

    // Add benchmark if available
    if (benchmarkField) {
      const benchmark = record
        .querySelector(benchmarkField)
        ?.textContent.trim();
      targetData[dataKey][year].benchmark = benchmark;
    }
  }

  // Insert peer data with proper organization for calculating averages
  insertPeerData(targetData, dataKey, year, value, record, yesNoField, name) {
    // Check if the yesNo field value is "Yes"
    const shouldInclude =
      yesNoField === "Yes" ||
      (yesNoField &&
        record.querySelector(yesNoField)?.textContent.trim() === "Yes");

    if (shouldInclude) {
      // Initialize data structures if they don't exist
      if (!targetData[dataKey]) {
        targetData[dataKey] = {};
      }

      if (!targetData[dataKey][year]) {
        targetData[dataKey][year] = [];
      }

      // Add value to the year array
      targetData[dataKey][year].push(value);

      // If name is provided, organize by name as well (for weighted averages)
      if (name) {
        if (!targetData[dataKey][name]) {
          targetData[dataKey][name] = {};
        }

        if (!targetData[dataKey][name]["total"]) {
          targetData[dataKey][name]["total"] = [];
        }

        if (!targetData[dataKey][name][year]) {
          targetData[dataKey][name][year] = [];
        }

        targetData[dataKey][name]["total"].push(value);
        targetData[dataKey][name][year].push(value);
      }

      // Always add to "total" if we're including this value
      if (!targetData[dataKey]["total"]) {
        targetData[dataKey]["total"] = [];
      }

      targetData[dataKey]["total"].push(value);
    }
  }
}

class DataProcessor {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  // Process data for all categories
  processAllData(years, recordsPeer, recordsClient) {
    this.processGeneralData(years, recordsPeer, recordsClient);
    this.processCashData(years, recordsPeer, recordsClient);
    this.processAssetData(years, recordsPeer, recordsClient);
    this.processIncomeData(years, recordsPeer, recordsClient);
    this.processExpenseData(years, recordsPeer, recordsClient);
    this.processMiscData(years, recordsPeer, recordsClient);

    // Save all data to localStorage at once
    this.dataStore.saveAllToLocalStorage();
  }

  // GENERAL DATA PROCESSING
  processGeneralData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // givingUnits
        this.dataStore.insertData(
          "general",
          "peer",
          year,
          "givingUnits_Peer",
          record,
          "0"
        );

        // missionaryUnit
        this.dataStore.insertData(
          "general",
          "peer",
          year,
          "missionaryUnit_Peer",
          record,
          "0"
        );

        // numberOfEmployeesFTE
        this.dataStore.insertData(
          "general",
          "peer",
          year,
          "numberOfEmployeesFTE_Peer",
          record,
          "0"
        );

        // itExpenses
        this.dataStore.insertData(
          "general",
          "peer",
          year,
          "itExpenses_Peer",
          record,
          "c01_04_ratio_it_expenses",
          "c01_04_yes_no_it_expenses"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // givingUnits
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "givingUnits_Client",
          record,
          "c01_01_ratio_giving_units"
        );

        // missionaryUnit
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "missionaryUnit_Client",
          record,
          "c01_02_ratio_missionary_unit"
        );

        // numberOfEmployeesFTE
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "numberOfEmployeesFTE_Client",
          record,
          "c01_03_ratio_number_of_employees_fte"
        );

        // itExpenses
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "itExpenses_Client",
          record,
          "c01_04_ratio_it_expenses"
        );

        // Net assets data
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "netAssetsWithoutDonorRestrictions_Client",
          record,
          "_01__03na___01_net_assets_without_donor_restrictions"
        );
        this.dataStore.insertData(
          "general",
          "client",
          year,
          "netAssetsWithDonorRestrictionsSum_Client",
          record,
          "_01__03na___03a_net_assets_with_donor_restrictions_sum"
        );

        this.dataStore.insertData(
          "general",
          "client",
          year,
          "changeInNetAssets_Client",
          record,
          "_02_04change___03_change_in_net_assets_with_and_wo_donor_restriction_sum"
        );
      });
    });
  }

  // CASH DATA PROCESSING
  processCashData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records for cash metrics
      filteredPeerRecords.forEach((record) => {
        // Days Cash on Hand
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysCashOnHand_Peer",
          record,
          "c02_01_ratio_days_cash_on_hand",
          "c02_01_yes_no_days_cash_on_hand"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "cashAndCashEquivalents",
          record,
          "_01__01ass___01_cash_and_cash_equivalents",
          "c02_01_yes_no_days_cash_on_hand",
          "daysCashOnHand"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_01_yes_no_days_cash_on_hand",
          "daysCashOnHand"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "depreciationAndAmortization",
          record,
          "_04_01fexp___06_depreciation_and_amortization",
          "c02_01_yes_no_days_cash_on_hand",
          "daysCashOnHand"
        );

        // Days Expenses in Unrestricted NA
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysExpensesInUnrestrictedNA_Peer",
          record,
          "c02_02_ratio_days_expenses_in_unrestricted_na",
          "c02_02_yes_no_days_expenses_in_unrestricted_na"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithoutDR",
          record,
          "_01__03na___01_net_assets_without_donor_restrictions",
          "c02_02_yes_no_days_expenses_in_unrestricted_na",
          "daysExpensesInUnrestrictedNA"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_02_yes_no_days_expenses_in_unrestricted_na",
          "daysExpensesInUnrestrictedNA"
        );

        // Days Expenses in Unrestricted NA excluding PPE
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysExpensesInUnrestrictedNA_excludingPPE_Peer",
          record,
          "c02_02a_ratio_days_expenses_in_unrestricted_na_less_ppe",
          "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithoutDR",
          record,
          "_01__03na___01_net_assets_without_donor_restrictions",
          "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
          "daysExpensesInUnrestrictedNA_excludingPPE"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "propertyPlantAndEquipment",
          record,
          "_01__01ass___09_property__plant_and_equipment",
          "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
          "daysExpensesInUnrestrictedNA_excludingPPE"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "notesPayable",
          record,
          "_01__02liab___02_notes_payable",
          "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
          "daysExpensesInUnrestrictedNA_excludingPPE"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_02a_yes_no_days_expenses_in_unrestricted_na_less_ppe",
          "daysExpensesInUnrestrictedNA_excludingPPE"
        );

        // Days Expenses in NA with DR
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysExpensesInNAwithDR_Peer",
          record,
          "c02_03_ratio_days_expenses_in_net_assets_with_dr",
          "c02_02_yes_no_days_expenses_in_unrestricted_na"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDRByPurposeOrTime",
          record,
          "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
          "c02_02_yes_no_days_expenses_in_unrestricted_na",
          "daysExpensesInNAwithDR"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDRInPerpetuity",
          record,
          "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
          "c02_02_yes_no_days_expenses_in_unrestricted_na",
          "daysExpensesInNAwithDR"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_02_yes_no_days_expenses_in_unrestricted_na",
          "daysExpensesInNAwithDR"
        );

        // Days Expenses in NA with DR excluding PPE
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysExpensesInNAwithDR_excludingPPE_Peer",
          record,
          "c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe",
          "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDRByPurposeOrTime",
          record,
          "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
          "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
          "daysExpensesInNAwithDR_excludingPPE"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDRInPerpetuity",
          record,
          "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
          "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
          "daysExpensesInNAwithDR_excludingPPE"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "propertyPlantAndEquipment",
          record,
          "_01__01ass___09_property__plant_and_equipment",
          "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
          "daysExpensesInNAwithDR_excludingPPE"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "notesPayable",
          record,
          "_01__02liab___02_notes_payable",
          "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
          "daysExpensesInNAwithDR_excludingPPE"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_04_yes_no_days_expenses_in_net_assets_with_dr_excluding_ppe",
          "daysExpensesInNAwithDR_excludingPPE"
        );

        // Liquidity Funds Available
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "liquidityFundsAvailable_Peer",
          record,
          "c02_05_ratio_liquidity_funds_available",
          "c02_05_yes_no_liquidity_funds_available"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalAssets",
          record,
          "_01__01ass___10_total_assets",
          "c02_05_yes_no_liquidity_funds_available",
          "liquidityFundsAvailable"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "propertyPlantAndEquipment",
          record,
          "_01__01ass___09_property__plant_and_equipment",
          "c02_05_yes_no_liquidity_funds_available",
          "liquidityFundsAvailable"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalLiabilities",
          record,
          "_01__02liab___05_total_liabilities",
          "c02_05_yes_no_liquidity_funds_available",
          "liquidityFundsAvailable"
        );

        // Liquidity Ratio
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "liquidityRatio_Peer",
          record,
          "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
          "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "financialAssetsAvailablePerLiquidity",
          record,
          "_05_01liquid___01_financial_assets_available_per_liquidity_fn",
          "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
          "liquidityRatio"
        );

        // Financial Assets Available FY
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "financialAssetsAvailableFY_Peer",
          record,
          "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
          "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "financialAssetsAvailablePerLiquidity",
          record,
          "_05_01liquid___01_financial_assets_available_per_liquidity_fn",
          "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
          "financialAssetsAvailableFY"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_06_yes_no_financial_assets_available_in_next_fy_to_fund_annual_expenditures",
          "financialAssetsAvailableFY"
        );

        // Days Financial Assets On Hand
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysFinancialAssetsOnHand_Peer",
          record,
          "c02_07_ratio_days_financial_assets_on_hand_to_fund_expenditures",
          "c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "financialAssetsAvailablePerLiquidity",
          record,
          "_05_01liquid___01_financial_assets_available_per_liquidity_fn",
          "c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures",
          "daysFinancialAssetsOnHand"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_07_yes_no_days_financial_assets_on_hand_to_fund_expenditures",
          "daysFinancialAssetsOnHand"
        );

        // Current Ratio
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "currentRatio_Peer",
          record,
          "c02_08_ratio_current_ratio",
          "c02_08_yes_no_current_ratio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalAssets",
          record,
          "_01__01ass___10_total_assets",
          "c02_08_yes_no_current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "cashAndCashEquivalents",
          record,
          "_01__01ass___01_cash_and_cash_equivalents",
          "c02_08_yes_no_current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "investments",
          record,
          "_01__01ass___03_investments",
          "c02_08_yes_no_current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "longTermLiabilities",
          record,
          "_01__02liab___04_long_term_liabilities",
          "c02_08_yes_no_current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "propertyPlantAndEquipment",
          record,
          "_01__01ass___09_property__plant_and_equipment",
          "c02_08_yes_no_current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalLiabilities",
          record,
          "_01__02liab___05_total_liabilities",
          "c02_08_yes_no_current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "notesPayable",
          record,
          "_01__02liab___02_notes_payable",
          "c02_08_yes_no_current_ratio",
          "currentRatio"
        );

        // Total Coverage Ratio
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalCoverageRatio_Peer",
          record,
          "c02_09_ratio_total_coverage_ratio",
          "c02_09_yes_no_total_coverage_ratio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalAssets",
          record,
          "_01__01ass___10_total_assets",
          "c02_09_yes_no_total_coverage_ratio",
          "totalCoverageRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalLiabilities",
          record,
          "_01__02liab___05_total_liabilities",
          "c02_09_yes_no_total_coverage_ratio",
          "totalCoverageRatio"
        );

        // Assets Without PPE To Liabilities Without Debt
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "assetsWithoutPpeToLiabilitiesWithoutDebt_Peer",
          record,
          "c02_09a_ratio_coverage_ratio_wo_ppe_and_debt",
          "c02_09a_yes_no_coverage_ratio_wo_ppe_and_debt"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalAssets",
          record,
          "_01__01ass___10_total_assets",
          "c02_09a_yes_no_coverage_ratio_wo_ppe_and_debt",
          "assetsWithoutPpeToLiabilitiesWithoutDebt"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "propertyPlantAndEquipment",
          record,
          "_01__01ass___09_property__plant_and_equipment",
          "c02_09a_yes_no_coverage_ratio_wo_ppe_and_debt",
          "assetsWithoutPpeToLiabilitiesWithoutDebt"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalLiabilities",
          record,
          "_01__02liab___05_total_liabilities",
          "c02_09a_yes_no_coverage_ratio_wo_ppe_and_debt",
          "assetsWithoutPpeToLiabilitiesWithoutDebt"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "notesPayable",
          record,
          "_01__02liab___02_notes_payable",
          "c02_09a_yes_no_coverage_ratio_wo_ppe_and_debt",
          "assetsWithoutPpeToLiabilitiesWithoutDebt"
        );

        // Liquidity Assets Available Cover
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "liquidityAssetsAvailableCover_Peer",
          record,
          "c02_05a_ratio_liquidity___assets_available_to_cover_liab_and_restricted_na",
          "c02_05a_yew_no_liquidity___assets_available_to_cover_liab_and_restricted_na"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalAssets",
          record,
          "_01__01ass___10_total_assets",
          "c02_05a_yew_no_liquidity___assets_available_to_cover_liab_and_restricted_na",
          "liquidityAssetsAvailableCover"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "propertyPlantAndEquipment",
          record,
          "_01__01ass___09_property__plant_and_equipment",
          "c02_05a_yew_no_liquidity___assets_available_to_cover_liab_and_restricted_na",
          "liquidityAssetsAvailableCover"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalLiabilities",
          record,
          "_01__02liab___05_total_liabilities",
          "c02_05a_yew_no_liquidity___assets_available_to_cover_liab_and_restricted_na",
          "liquidityAssetsAvailableCover"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDonorRestrictionsSum",
          record,
          "c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe",
          "c02_05a_yew_no_liquidity___assets_available_to_cover_liab_and_restricted_na",
          "liquidityAssetsAvailableCover"
        );

        // Cash Flow Trends
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "cashFlowsTrendFinancing_Peer",
          record,
          "0"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "cashFlowsTrendInvesting_Peer",
          record,
          "0"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "cashFlowsTrendOperating_Peer",
          record,
          "0"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "cashFlowsTrendTotal_Peer",
          record,
          "0"
        );
      });

      // Process client records for cash metrics
      filteredClientRecords.forEach((record) => {
        // Days Cash on Hand
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysCashOnHand_Client",
          record,
          "c02_01_ratio_days_cash_on_hand"
        );

        // Days Expenses in Unrestricted NA
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysExpensesInUnrestrictedNA_Client",
          record,
          "c02_02_ratio_days_expenses_in_unrestricted_na"
        );

        // Days Expenses in Unrestricted NA excluding PPE
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysExpensesInUnrestrictedNA_excludingPPE_Client",
          record,
          "c02_02a_ratio_days_expenses_in_unrestricted_na_less_ppe"
        );

        // Days Expenses in NA with DR
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysExpensesInNAwithDR_Client",
          record,
          "c02_03_ratio_days_expenses_in_net_assets_with_dr"
        );

        // Days Expenses in NA with DR excluding PPE
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysExpensesInNAwithDR_excludingPPE_Client",
          record,
          "c02_04_ratio_days_expenses_in_net_assets_with_dr_excluding_ppe"
        );

        // Liquidity Funds Available
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "liquidityFundsAvailable_Client",
          record,
          "c02_05_ratio_liquidity_funds_available"
        );

        // Liquidity Ratio
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "liquidityRatio_Client",
          record,
          "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
        );

        // Financial Assets Available FY
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "financialAssetsAvailableFY_Client",
          record,
          "c02_06_ratio_financial_assets_available_in_next_fy_to_fund_annual_expenditures"
        );

        // Days Financial Assets On Hand
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysFinancialAssetsOnHand_Client",
          record,
          "c02_07_ratio_days_financial_assets_on_hand_to_fund_expenditures"
        );

        // Current Ratio
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "currentRatio_Client",
          record,
          "c02_08_ratio_current_ratio"
        );

        // Liquidity Assets Available Cover
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "liquidityAssetsAvailableCover_Client",
          record,
          "c02_05a_ratio_liquidity___assets_available_to_cover_liab_and_restricted_na"
        );

        // Total Coverage Ratio
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "totalCoverageRatio_Client",
          record,
          "c02_09_ratio_total_coverage_ratio"
        );

        // Assets Without PPE To Liabilities Without Debt
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "assetsWithoutPpeToLiabilitiesWithoutDebt_Client",
          record,
          "c02_09a_ratio_coverage_ratio_wo_ppe_and_debt"
        );

        // Cash Flow Trends
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "cashFlowsTrendFinancing_Client",
          record,
          "_03_01cashflow___03_financing"
        );
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "cashFlowsTrendInvesting_Client",
          record,
          "_03_01cashflow___02_investing"
        );
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "cashFlowsTrendOperating_Client",
          record,
          "_03_01cashflow___01_operating"
        );
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "cashFlowsTrendTotal_Client",
          record,
          "_03_01cashflow___total"
        );
      });
    });
  }

  // ASSET DATA PROCESSING
  processAssetData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records for asset metrics
      filteredPeerRecords.forEach((record) => {
        // Percent With DR
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "percentWithDR_Peer",
          record,
          "c03_01_ratio_percent_with_donor_restrictions",
          "c03_01_yes_no_percent_with_donor_restrictions"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "netAssetsWithDRByPurposeOrTime",
          record,
          "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
          "c03_01_yes_no_percent_with_donor_restrictions",
          "percentWithDR"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "netAssetsWithDRInPerpetuity",
          record,
          "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
          "c03_01_yes_no_percent_with_donor_restrictions",
          "percentWithDR"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "totalNetAssets",
          record,
          "_01__03na___04_total_net_assets",
          "c03_01_yes_no_percent_with_donor_restrictions",
          "percentWithDR"
        );

        // Percent Without DR Excluding PPE
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "percentWithoutDR_excludingPPE_Peer",
          record,
          "c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
          "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "netAssetsWithoutDR",
          record,
          "_01__03na___01_net_assets_without_donor_restrictions",
          "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
          "percentWithoutDR_excludingPPE"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "propertyPlantAndEquipment",
          record,
          "_01__01ass___09_property__plant_and_equipment",
          "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
          "percentWithoutDR_excludingPPE"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "notesPayable",
          record,
          "_01__02liab___02_notes_payable",
          "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
          "percentWithoutDR_excludingPPE"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "totalNetAssets",
          record,
          "_01__03na___04_total_net_assets",
          "c03_02_yes_no_percent_without_donor_restrictions_excluding_net_investment_in_ppe",
          "percentWithoutDR_excludingPPE"
        );

        // Percent Without DR
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "percentWithoutDR_Peer",
          record,
          "c03_03_ratio_percent_without_donor_restrictions",
          "c03_03_yes_no_percent_without_donor_restrictions"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "netAssetsWithoutDR",
          record,
          "_01__03na___01_net_assets_without_donor_restrictions",
          "c03_03_yes_no_percent_without_donor_restrictions",
          "percentWithoutDR"
        );
        this.dataStore.insertData(
          "asset",
          "peer",
          year,
          "totalNetAssets",
          record,
          "_01__03na___04_total_net_assets",
          "c03_03_yes_no_percent_without_donor_restrictions",
          "percentWithoutDR"
        );
      });

      // Process client records for asset metrics
      filteredClientRecords.forEach((record) => {
        // Percent With DR
        this.dataStore.insertData(
          "asset",
          "client",
          year,
          "percentWithDR_Client",
          record,
          "c03_01_ratio_percent_with_donor_restrictions"
        );

        // Percent Without DR Excluding PPE
        this.dataStore.insertData(
          "asset",
          "client",
          year,
          "percentWithoutDR_excludingPPE_Client",
          record,
          "c03_02_ratio_percent_without_donor_restrictions_excluding_net_investment_in_ppe"
        );

        // Percent Without DR
        this.dataStore.insertData(
          "asset",
          "client",
          year,
          "percentWithoutDR_Client",
          record,
          "c03_03_ratio_percent_without_donor_restrictions"
        );
      });
    });
  }

  // INCOME DATA PROCESSING
  processIncomeData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records for income metrics
      filteredPeerRecords.forEach((record) => {
        // Net Income Ratio
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "netIncomeRatio_Peer",
          record,
          "c04_01_ratio_net_income_ratio",
          "c04_01_yes_no_net_income_ratio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "changeInNetAssetsWithoutDR",
          record,
          "_02_04change___01_change_in_net_assets_without_donor_restriction",
          "c04_01_yes_no_net_income_ratio",
          "netIncomeRatio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "changeInNetAssetsWithDR",
          record,
          "_02_04change___02_change_in_net_assets_with_donor_restriction",
          "c04_01_yes_no_net_income_ratio",
          "netIncomeRatio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalSupportAndRevenueWithoutDR",
          record,
          "_02_01sr___08_total_support_and_revenue_without_donor_restrictions",
          "c04_01_yes_no_net_income_ratio",
          "netIncomeRatio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalSupportAndRevenueWithDR",
          record,
          "_02_01sr___09_total_support_and_revenue_with_donor_restrictions",
          "c04_01_yes_no_net_income_ratio",
          "netIncomeRatio"
        );

        // Contributions Trend Based On Number Of Donors
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsTrend_basedOnNumberOfDonors_Peer",
          record,
          "c04_02_ratio_contributions_trend_based_on_donor_count",
          "c04_02_yes_no_contributions_trend_based_on_donor_count"
        );

        // Contributions Trend
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsTrend_Peer",
          record,
          "c04_03_ratio_contributions_trend",
          "c04_03_yes_no_contributions_trend"
        );

        // Contributions Percent Without DR
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsPercentWithoutDR_Peer",
          record,
          "c04_04_ratio_contributions_percent_without_donor_restrictions",
          "c04_04_yes_no_contributions_percent_without_donor_restrictions"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDR",
          record,
          "_02_01sr___01_contributions_without_donor_restrictions",
          "c04_04_yes_no_contributions_percent_without_donor_restrictions",
          "contributionsPercentWithoutDR"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c04_04_yes_no_contributions_percent_without_donor_restrictions",
          "contributionsPercentWithoutDR"
        );

        // Contributions Percent With DR
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsPercentWithDR_Peer",
          record,
          "c04_05_ratio_contributions_percent_with_donor_restrictions",
          "c04_05_yes_no_contributions_percent_with_donor_restrictions"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDR",
          record,
          "_02_01sr___01_contributions_without_donor_restrictions",
          "c04_05_yes_no_contributions_percent_with_donor_restrictions",
          "contributionsPercentWithDR"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c04_05_yes_no_contributions_percent_with_donor_restrictions",
          "contributionsPercentWithDR"
        );

        // Contributions Per Giving Unit
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsPerGivingUnit_Peer",
          record,
          "c04_06_ratio_contributions_per_giving_unit",
          "c04_06_yes_no_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDR",
          record,
          "_02_01sr___01_contributions_without_donor_restrictions",
          "c04_06_yes_no_contributions_per_giving_unit",
          "contributionsPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c04_06_yes_no_contributions_per_giving_unit",
          "contributionsPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "givingUnit",
          record,
          "_06_01nonfin___02_giving_unit",
          "c04_06_yes_no_contributions_per_giving_unit",
          "contributionsPerGivingUnit"
        );

        // Contributions Per Missionary Unit
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsPerMissionaryUnit_Peer",
          record,
          "c04_07_ratio_contributions_per_missionary_unit",
          "c04_07_yes_no_contributions_per_missionary_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDR",
          record,
          "_02_01sr___01_contributions_without_donor_restrictions",
          "c04_07_yes_no_contributions_per_missionary_unit",
          "contributionsPerMissionaryUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c04_07_yes_no_contributions_per_missionary_unit",
          "contributionsPerMissionaryUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "missionaryUnit",
          record,
          "_06_01nonfin___01_missionary_unit",
          "c04_07_yes_no_contributions_per_missionary_unit",
          "contributionsPerMissionaryUnit"
        );

        // Contributions Per Full Time Equivalent
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsPerFullTimeEquivalent_Peer",
          record,
          "c04_08_ratio_contributions_per_full_time_equivalent",
          "c04_08_yes_no_contributions_per_full_time_equivalent"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDR",
          record,
          "_02_01sr___01_contributions_without_donor_restrictions",
          "c04_08_yes_no_contributions_per_full_time_equivalent",
          "contributionsPerFullTimeEquivalent"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c04_08_yes_no_contributions_per_full_time_equivalent",
          "contributionsPerFullTimeEquivalent"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "numberOfEmployeesFTE",
          record,
          "_06_01nonfin___03_number_of_employees_fte",
          "c04_08_yes_no_contributions_per_full_time_equivalent",
          "contributionsPerFullTimeEquivalent"
        );

        // Fundraising As Percent Of Contributions
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "fundraisingAsPercentOfContributions_Peer",
          record,
          "c04_09_ratio_fundraising_as_percent_of_contributions",
          "c04_09_yes_no_fundraising_as_percent_of_contributions"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDR",
          record,
          "_02_01sr___01_contributions_without_donor_restrictions",
          "c04_09_yes_no_fundraising_as_percent_of_contributions",
          "fundraisingAsPercentOfContributions"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c04_09_yes_no_fundraising_as_percent_of_contributions",
          "fundraisingAsPercentOfContributions"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "fundraisingExpenses",
          record,
          "_02_03exp___03_fundraising_expenses",
          "c04_09_yes_no_fundraising_as_percent_of_contributions",
          "fundraisingAsPercentOfContributions"
        );

        // Annualized Investment Return
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "annualizedInvestmentReturn_Peer",
          record,
          "c04_10_ratio_annualized_investment_return",
          "c04_10_yes_no_annualized_investment_return"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "investmentIncome",
          record,
          "_02_01sr___03_investment_income",
          "c04_10_yes_no_annualized_investment_return",
          "annualizedInvestmentReturn"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "Investments",
          record,
          "_01__01ass___03_investments",
          "c04_10_yes_no_annualized_investment_return",
          "annualizedInvestmentReturn"
        );

        // Total Contributions
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributions_Peer",
          record,
          "_02_01sr___00_contributions_with_and_without_sum",
          "Yes"
        );
      });

      // Process client records for income metrics
      filteredClientRecords.forEach((record) => {
        // Net Income Ratio
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "netIncomeRatio_Client",
          record,
          "c04_01_ratio_net_income_ratio"
        );

        // Contributions Trend Based On Number Of Donors
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsTrend_basedOnNumberOfDonors_Client",
          record,
          "c04_02_ratio_contributions_trend_based_on_donor_count"
        );

        // Contributions Trend
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsTrend_Client",
          record,
          "c04_03_ratio_contributions_trend"
        );

        // Contributions Percent Without DR
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsPercentWithoutDR_Client",
          record,
          "c04_04_ratio_contributions_percent_without_donor_restrictions"
        );

        // Contributions Percent With DR
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsPercentWithDR_Client",
          record,
          "c04_05_ratio_contributions_percent_with_donor_restrictions"
        );

        // Contributions Per Giving Unit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsPerGivingUnit_Client",
          record,
          "c04_06_ratio_contributions_per_giving_unit"
        );

        // Contributions Per Missionary Unit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsPerMissionaryUnit_Client",
          record,
          "c04_07_ratio_contributions_per_missionary_unit"
        );

        // Contributions Per Full Time Equivalent
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsPerFullTimeEquivalent_Client",
          record,
          "c04_08_ratio_contributions_per_full_time_equivalent"
        );

        // Fundraising As Percent Of Contributions
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "fundraisingAsPercentOfContributions_Client",
          record,
          "c04_09_ratio_fundraising_as_percent_of_contributions"
        );

        // Annualized Investment Return
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "annualizedInvestmentReturn_Client",
          record,
          "c04_10_ratio_annualized_investment_return"
        );

        // Total Contributions
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalContributions_Client",
          record,
          "_02_01sr___00_contributions_with_and_without_sum"
        );

        // Total Contributions
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalContributions_Client",
          record,
          "_02_01sr___00_contributions_with_and_without_sum"
        );
      });
    });
  }

  // EXPENSE DATA PROCESSING
  processExpenseData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records for expense metrics
      filteredPeerRecords.forEach((record) => {
        // Functional Expense Percent Program
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "functionalExpensePercent_program_Peer",
          record,
          "c05_01_ratio_functional_expense_percentage___program",
          "c05_01_yes_no_functional_expense_percentage___program"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "programExpenses",
          record,
          "_02_03exp___01_program_expenses",
          "c05_01_yes_no_functional_expense_percentage___program",
          "functionalExpensePercent_program"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_01_yes_no_functional_expense_percentage___program",
          "functionalExpensePercent_program"
        );

        // Functional Expense Percent Administrative
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "functionalExpensePercent_administrative_Peer",
          record,
          "c05_02_ratio_functional_expense_percentage___administrative",
          "c05_02_yes_no_functional_expense_percentage___administrative"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "administrativeExpenses",
          record,
          "_02_03exp___02_administrative_expenses",
          "c05_02_yes_no_functional_expense_percentage___administrative",
          "functionalExpensePercent_administrative"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_02_yes_no_functional_expense_percentage___administrative",
          "functionalExpensePercent_administrative"
        );

        // Functional Expense Percent Fundraising
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "functionalExpensePercent_fundraising_Peer",
          record,
          "c05_03_ratio_functional_expense_percentage___fundraising",
          "c05_03_yes_no_functional_expense_percentage___fundraising"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "fundraisingExpenses",
          record,
          "_02_03exp___03_fundraising_expenses",
          "c05_03_yes_no_functional_expense_percentage___fundraising",
          "functionalExpensePercent_fundraising"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_03_yes_no_functional_expense_percentage___fundraising",
          "functionalExpensePercent_fundraising"
        );

        // Functional Expense Percent Other
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "functionalExpensePercent_other_Peer",
          record,
          "c05_04_ratio_functional_expense_percentage___other",
          "c05_04_yes_no_functional_expense_percentage___other"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "otherExpenses",
          record,
          "_02_03exp___04_other_expenses",
          "c05_04_yes_no_functional_expense_percentage___other",
          "functionalExpensePercent_other"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_04_yes_no_functional_expense_percentage___other",
          "functionalExpensePercent_other"
        );

        // Cost Of Contributions
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "costOfContributions_Peer",
          record,
          "c05_05_ratio_cost_of_contributions_raise_1_dollar",
          "c05_05_yes_no_cost_of_contributions_raise_1_dollar"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "fundraisingExpenses",
          record,
          "_02_03exp___03_fundraising_expenses",
          "c05_05_yes_no_cost_of_contributions_raise_1_dollar",
          "costOfContributions"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "contributionsWithoutDR",
          record,
          "_02_01sr___01_contributions_without_donor_restrictions",
          "c05_05_yes_no_cost_of_contributions_raise_1_dollar",
          "costOfContributions"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c05_05_yes_no_cost_of_contributions_raise_1_dollar",
          "costOfContributions"
        );

        // Expenses Per Giving Unit
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "expensesPerGivingUnit_Peer",
          record,
          "c05_06_ratio_expenses_per_giving_unit",
          "c05_06_yes_no_expenses_per_giving_unit"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_06_yes_no_expenses_per_giving_unit",
          "expensesPerGivingUnit"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "givingUnit",
          record,
          "_06_01nonfin___02_giving_unit",
          "c05_06_yes_no_expenses_per_giving_unit",
          "expensesPerGivingUnit"
        );

        // Expenses Per Missionary Unit
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "expensesPerMissionaryUnit_Peer",
          record,
          "c05_07_ratio_expenses_per_missionary_unit",
          "c05_07_yes_no_expenses_per_missionary_unit"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_07_yes_no_expenses_per_missionary_unit",
          "expensesPerMissionaryUnit"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "missionaryUnit",
          record,
          "_06_01nonfin___01_missionary_unit",
          "c05_07_yes_no_expenses_per_missionary_unit",
          "expensesPerMissionaryUnit"
        );

        // Expenses Per Full Time Equivalent
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "expensesPerFullTimeEquivalent_Peer",
          record,
          "c05_08_ratio_expenses_per_full_time_equivalent",
          "c05_08_yes_no_expenses_per_full_time_equivalent"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_08_yes_no_expenses_per_full_time_equivalent",
          "expensesPerFullTimeEquivalent"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "numberOfEmployeesFTE",
          record,
          "_06_01nonfin___03_number_of_employees_fte",
          "c05_08_yes_no_expenses_per_full_time_equivalent",
          "expensesPerFullTimeEquivalent"
        );

        // Salaries And Benefits As Percent Of Total Expenses
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesAndBenefitsAsPercentOfTotalExpenses_Peer",
          record,
          "c05_09_ratio_salaries_and_benefits_as_percent_of_total_expenses",
          "c05_09_yes_no_salaries_and_benefits_as_percent_of_total_expenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesAndBenefits",
          record,
          "_04_01fexp___03_salaries___benefits",
          "c05_09_yes_no_salaries_and_benefits_as_percent_of_total_expenses",
          "salariesAndBenefitsAsPercentOfTotalExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c05_09_yes_no_salaries_and_benefits_as_percent_of_total_expenses",
          "salariesAndBenefitsAsPercentOfTotalExpenses"
        );

        // Salaries And Benefits Per FTE
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesAndBenefitsPerFTE_Peer",
          record,
          "c05_10_ratio_salaries___benefits_per_fte",
          "c05_10_yes_no_salaries___benefits_per_fte"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesAndBenefits",
          record,
          "_04_01fexp___03_salaries___benefits",
          "c05_10_yes_no_salaries___benefits_per_fte",
          "salariesAndBenefitsPerFTE"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "numberOfEmployeesFTE",
          record,
          "_06_01nonfin___03_number_of_employees_fte",
          "c05_10_yes_no_salaries___benefits_per_fte",
          "salariesAndBenefitsPerFTE"
        );
      });

      // Process client records for expense metrics
      filteredClientRecords.forEach((record) => {
        // Cost Of Contributions Detail View
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "costOfContributionsDetailView_Client",
          record,
          "_02_01sr___00_contributions_with_and_without_sum"
        );

        // Functional Expense Percent Program
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "functionalExpensePercent_program_Client",
          record,
          "c05_01_ratio_functional_expense_percentage___program"
        );

        // Functional Expense Percent Administrative
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "functionalExpensePercent_administrative_Client",
          record,
          "c05_02_ratio_functional_expense_percentage___administrative"
        );

        // Functional Expense Percent Fundraising
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "functionalExpensePercent_fundraising_Client",
          record,
          "c05_03_ratio_functional_expense_percentage___fundraising"
        );

        // Functional Expense Percent Other
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "functionalExpensePercent_other_Client",
          record,
          "c05_04_ratio_functional_expense_percentage___other"
        );

        // Fundraising Expense
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "fundraisingExpense_Client",
          record,
          "_02_03exp___03_fundraising_expenses"
        );

        // Contributions With And Without Sum
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "contributionsWithAndWithoutSum_Client",
          record,
          "_02_01sr___00_contributions_with_and_without_sum"
        );

        // Cost Of Contributions
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "costOfContributions_Client",
          record,
          "c05_05_ratio_cost_of_contributions_raise_1_dollar"
        );

        // Expenses Per Giving Unit
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "expensesPerGivingUnit_Client",
          record,
          "c05_06_ratio_expenses_per_giving_unit"
        );

        // Expenses Per Missionary Unit
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "expensesPerMissionaryUnit_Client",
          record,
          "c05_07_ratio_expenses_per_missionary_unit"
        );

        // Expenses Per Full Time Equivalent
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "expensesPerFullTimeEquivalent_Client",
          record,
          "c05_08_ratio_expenses_per_full_time_equivalent"
        );

        // Salaries And Benefits As Percent Of Total Expenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "salariesAndBenefitsAsPercentOfTotalExpenses_Client",
          record,
          "c05_09_ratio_salaries_and_benefits_as_percent_of_total_expenses"
        );

        // Salaries And Benefits Per FTE
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "salariesAndBenefitsPerFTE_Client",
          record,
          "c05_10_ratio_salaries___benefits_per_fte"
        );
      });
    });
  }

  // MISC DATA PROCESSING
  processMiscData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records for misc metrics
      filteredPeerRecords.forEach((record) => {
        // Percentage Assessment On Restricted Gifts
        this.dataStore.insertData(
          "misc",
          "peer",
          year,
          "percentageAssessmentOnRestrictedGifts_Peer",
          record,
          "c06_01_ratio_percentage_assessment_on_restricted_gifts",
          "c06_01_yes_no_percentage_assessment_on_restricted_gifts"
        );
        this.dataStore.insertData(
          "misc",
          "peer",
          year,
          "totalAdministrativeAssessments",
          record,
          "_02_02reclass___01_total_administrative_assessments",
          "c06_01_yes_no_percentage_assessment_on_restricted_gifts",
          "percentageAssessmentOnRestrictedGifts"
        );
        this.dataStore.insertData(
          "misc",
          "peer",
          year,
          "contributionsWithDR",
          record,
          "_02_01sr___02_contributions_with_donor_restrictions",
          "c06_01_yes_no_percentage_assessment_on_restricted_gifts",
          "percentageAssessmentOnRestrictedGifts"
        );
      });

      // Process client records for misc metrics
      filteredClientRecords.forEach((record) => {
        // Percentage Assessment On Restricted Gifts
        this.dataStore.insertData(
          "misc",
          "client",
          year,
          "percentageAssessmentOnRestrictedGifts_Client",
          record,
          "c06_01_ratio_percentage_assessment_on_restricted_gifts"
        );
      });
    });
  }

  // Helper method to filter records by fiscal year
  filterRecordsByYear(records, year) {
    return [...records].filter((record) => {
      const fiscalYear = record.querySelector(
        "fiscal_ye_date_formatted_year_text"
      )?.textContent;
      return fiscalYear && fiscalYear.includes(year.toString());
    });
  }
}

// API Service class for handling API calls
class ApiService {
  constructor() {
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
  }

  // Retrieve records for peer data based on selected years
  async getRecordsForPeer(years, dataStr = "<qdbapi>") {
    if (years.length === 0) {
      // Base case: return the final string when the array is empty
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataStr + "</qdbapi>", "text/xml");
      return xmlDoc.querySelectorAll("record");
    }

    const currentYear = years[0];

    // Build query conditions
    const regionQuery = this.getRegionQuery(selectedRegions_Array);
    const typeQuery = this.getTypeQuery(selectedTypes_Array);

    const apiCallPeerData = {
      act: "API_DoQuery",
      query: `
          (${regionQuery}) AND
          (${typeQuery}) AND
          {301.EX.${currentYear}}
        `,
      clist:
        "301.59.60.62.63.64.66.261.302.262.303.211.227.231.118.263.304.197.264.305.198.199.265.306.209.208.220.266.307.195.196.267.308.251.268.309.269.310.219.205.228.270.311.274.312.198.199.209.275.313.197.208.220.209.276.314.277.315.240.241.206.207.280.316.200.201.281.317.282.318.239.283.319.238.284.320.225.285.321.204.287.322.202.227.288.323.203.289.324.204.290.325.242.291.326.204.200.201.292.327.227.239.293.328.238.294.329.225.295.330.215.225.296.331.297.332.250.201.298.333.222.231.122.344.334.306.347.343.346.244.205.341.342.344.345.348.351.352.256.353.354.",
    };

    try {
      const xml = await $.get(peerData, apiCallPeerData);
      const recordsForPeer = $("record", xml).toArray();

      // Collect records for later use
      recordsForPeer.forEach((record) => {
        const newRecord = document.createElement("record");

        // Append each child element to the new record
        Array.from(record.children).forEach((child) => {
          newRecord.appendChild(child.cloneNode(true));
        });

        this.recordPeerHTMLArray.push(newRecord.outerHTML);

        const qdbapiElementPeer = `<qdbapi>${this.recordPeerHTMLArray.join(
          ""
        )}</qdbapi>`;
        // console.log("PEER", qdbapiElementPeer);

        // Append the new record's outerHTML to dataStr
        dataStr += newRecord.outerHTML;
      });

      // Recursive call with updated years and dataStr
      return this.getRecordsForPeer(years.slice(1), dataStr);
    } catch (error) {
      console.error("Error fetching peer data:", error);
      // Return the accumulated data so far even in case of an error
      return dataStr;
    }
  }

  // Retrieve records for client data based on selected years
  async getRecordsForClient(years, dataStr = "<qdbapi>") {
    if (years.length === 0) {
      // Base case: return the final string when the array is empty
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataStr + "</qdbapi>", "text/xml");
      return xmlDoc.querySelectorAll("record");
    }

    const currentYear = years[0];
    const apiCallClientData = {
      act: "API_DoQuery",
      query: `
          {192.EX.${currentYear}} AND
          {29.EX.${ClientRid}}`,
      clist:
        "29.192.157.158.159.160.141.142.143.144.145.146.147.148.149.185.186.187.212.189.188.150.161.162.163.164.165.166.167.168.169.170.171.172.42.173.174.175.176.177.178.179.180.181.182.183.184.31.213.42.217.25.193.222.221.218.15.21",
    };

    try {
      const xml = await $.get(clientData, apiCallClientData);
      const recordsForClient = $("record", xml).toArray();

      // Collect records for later use
      recordsForClient.forEach((record) => {
        const newRecord = document.createElement("record");

        // Append each child element to the new record
        Array.from(record.children).forEach((child) => {
          newRecord.appendChild(child.cloneNode(true));
        });

        this.recordClientHTMLArray.push(newRecord.outerHTML);

        // Append the new record's outerHTML to dataStr
        dataStr += newRecord.outerHTML;
      });

      // Recursive call with updated years and dataStr
      return this.getRecordsForClient(years.slice(1), dataStr);
    } catch (error) {
      console.error("Error fetching client data:", error);
      // Return the accumulated data so far even in case of an error
      return dataStr;
    }
  }

  // Get records for unique client peer names
  async getRecordsForUniqueClientPeerNames() {
    const apiCallPeerData = {
      act: "API_DoQuery",
      clist: "301.59",
    };

    try {
      const xml = await $.get(peerData, apiCallPeerData);
      const recordsForPeerUniqueClientPeerNames = $("record", xml).toArray();
      const uniquePeerClientNames = new Set();

      recordsForPeerUniqueClientPeerNames.forEach((record) => {
        const clientInformalName = record.querySelector(
          "pe___client_informal_name"
        )?.textContent;
        if (clientInformalName) {
          uniquePeerClientNames.add(clientInformalName);
        }
      });

      const sortedUniquePeerClientNames = Array.from(
        uniquePeerClientNames
      ).sort();

      // Add to global selected clients array
      sortedUniquePeerClientNames.forEach((item) =>
        selectedClients_Array.add(item)
      );

      // Update UI dropdown
      addUniqueClientsToOptionsSelectClientDropdown(
        sortedUniquePeerClientNames
      );
    } catch (error) {
      console.error("Error fetching unique client names:", error);
    }
  }

  // Build a query condition for regions
  getRegionQuery(selectedRegions) {
    const regionConditions = [...selectedRegions]
      .map((region) => `{122.EX.${region}}`)
      .join(" OR ");
    return regionConditions ? `(${regionConditions})` : '({122.EX.""})'; // Default empty condition
  }

  // Build a query condition for types
  getTypeQuery(selectedTypes) {
    const typeConditions = [...selectedTypes]
      .map((type) => `{334.EX.${type}}`)
      .join(" OR ");
    return typeConditions ? `(${typeConditions})` : '({334.EX.""})'; // Default empty condition
  }

  // Build a query condition for clients
  getClientQuery(selectedClients) {
    const clientConditions = [...selectedClients]
      .map((client) => `{59.EX.'${client}'}`)
      .join(" OR ");
    return clientConditions ? `(${clientConditions})` : '({59.EX.""})'; // Default empty condition
  }

  // Get the combined XML strings for peer and client records
  getPeerXmlString() {
    return `<qdbapi>${this.recordPeerHTMLArray.join("")}</qdbapi>`;
  }

  getClientXmlString() {
    return `<qdbapi>${this.recordClientHTMLArray.join("")}</qdbapi>`;
  }

  // Clear the record arrays
  clearRecords() {
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
  }
}

// Application controller class to manage the overall flow
class AppController {
  constructor() {
    this.dataStore = new DataStore();
    this.dataProcessor = new DataProcessor(this.dataStore);
    this.apiService = new ApiService();
    this.runButton = document.querySelector("#run"); // Store as instance variable
    this.initializeEventListeners();
  }

  // Initialize event listeners
  initializeEventListeners() {
    // console.log('initializeEventListeners()', {types_Array, regions_Array});

    localStorage.clear();

    this.apiService.getRecordsForUniqueClientPeerNames();
    addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
    addUniqueTypesToOptionsSelectTypeDropdown(types_Array);

    if (this.runButton) {
      this.runButton.addEventListener("click", () =>
        this.handleRunButtonClick()
      );
    }
  }

  // Handle the run button click
  async handleRunButtonClick() {
    try {
      // Clear existing records
      this.apiService.clearRecords();

      // Show loading state
      toggleButtonLoadingState(this.runButton);

      // Get and validate selected years
      const selectedYears = this.processSelectedYears();
      this.saveSelectedYearsToLocalStorage(selectedYears);

      // Fetch peer and client records
      const recordsPeer = await this.apiService.getRecordsForPeer(
        selectedYears
      );
      countUniqueClients(recordsPeer);

      const recordsClient = await this.apiService.getRecordsForClient(
        selectedYears
      );

      // Process data and update UI
      this.dataProcessor.processAllData(
        selectedYears,
        recordsPeer,
        recordsClient
      );
      this.displayAllComponents();
    } catch (err) {
      console.error(err);
    } finally {
      toggleButtonNormalState(this.runButton);
    }
  }

  // Process selected years
  processSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears || !selectedYears.length) {
      createToastWarning("Please select year(s) for data to appear");
      throw new Error("No years selected.");
    }

    return selectedYears;
  }

  // Save selected years to localStorage
  saveSelectedYearsToLocalStorage(selectedYears_Set) {
    const selectedYearsArray = Array.from(selectedYears_Set).sort(
      (a, b) => a - b
    );
    localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
  }

  // Display all UI components
  displayAllComponents() {
    displayGeneralComponent();
    displayCashComponent();
    displayIncomeComponent();
    displayExpenseComponent();
    displayReportComponent();
  }
}

// Utility to count unique clients in the records
function countUniqueClients(records) {
  const uniqueClients = new Set();
  try {
    records.forEach((record) => {
      const mainRelatedClient = record.querySelector(
        "pe___client_legal_name"
      )?.textContent;
      if (mainRelatedClient) {
        uniqueClients.add(mainRelatedClient);
      }
    });

    const count = uniqueClients.size;
    document.getElementById("uniqueClients").textContent = count;
  } catch (error) {
    console.error("Error counting unique clients:", error);
    document.getElementById("uniqueClients").textContent = "0"; // Set to 0 in case of error
  }
}

// Toggle button loading/normal states
function toggleButtonLoadingState(btn) {
  btn.innerHTML = `
      <svg aria-hidden="true" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
      Loading...`;
  btn.disabled = true;
}

function toggleButtonNormalState(btn) {
  btn.innerHTML = `
      <span class='text-xl mr-2'>Run</span>
      <svg class="w-8 h-8 text-2xl text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
      </svg>`;
  btn.disabled = false;
}

// Initialize the application when the window loads
window.onload = () => {
  const app = new AppController();
};

// API Client Data Query
let apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: `{29.EX.${ClientRid}}`,
  clist: "29.191.31",
};

// Fetch client information
$.get(clientData, apiCallClientDataForUniqueYears)
  .then(async (xml) => {
    recordsClient = await $("record", xml).toArray();

    if (recordsClient.length > 0) {
      firmName = recordsClient[0].children[2].innerHTML;
      document.querySelector("#firmName").textContent = firmName;
      findUniqueYears(recordsClient);
    } else {
      console.error(
        "No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid"
      );
    }
  })
  .catch((err) => console.error(err));

// Find and add unique years from data
const findUniqueYears = (data) => {
  if (data) {
    data.forEach((item) => {
      const yearElement = item.querySelector("fiscal_ye_date_formatted_year");
      if (yearElement) {
        const year = yearElement.textContent;

        // Check if the year is not already in yearsData_Array to ensure uniqueness
        if (!yearsData_Array.includes(year)) {
          yearsData_Array.push(year);
        }
      }
    });

    yearsData_Array.sort();

    // Add years to options dropdown
    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
};
