// Data Model and Business Logic Classes
class DataStore {
  constructor() {
    this.cfiData = {};
    this.doeData = {};
    this.debtEndowmentData = {};
    this.revenueExpenseData = {};
    this.financialPositionData = {};
    this.financialStatementData = {};
    this.financialAnalysisData = {};
  }

  // Save all data categories to localStorage
  saveAllToLocalStorage() {
    localStorage.setItem("cfiData", JSON.stringify(this.cfiData));
    localStorage.setItem("doeData", JSON.stringify(this.doeData));
    localStorage.setItem(
      "debtEndowmentData",
      JSON.stringify(this.debtEndowmentData)
    );
    localStorage.setItem(
      "revenueExpenseData",
      JSON.stringify(this.revenueExpenseData)
    );
    localStorage.setItem(
      "financialPositionData",
      JSON.stringify(this.financialPositionData)
    );
    localStorage.setItem(
      "financialStatementData",
      JSON.stringify(this.financialStatementData)
    );
    localStorage.setItem(
      "financialAnalysisData",
      JSON.stringify(this.financialAnalysisData)
    );
  }

  // Get a reference to the appropriate data object based on category
  getDataCategory(category) {
    switch (category) {
      case "cfi":
        return this.cfiData;
      case "doe":
        return this.doeData;
      case "debtEndowment":
        return this.debtEndowmentData;
      case "revenueExpense":
        return this.revenueExpenseData;
      case "financialPosition":
        return this.financialPositionData;
      case "financialStatement":
        return this.financialStatementData;
      case "financialAnalysis":
        return this.financialAnalysisData;
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
    this.processCfiData(years, recordsPeer, recordsClient);
    this.processDoeData(years, recordsPeer, recordsClient);
    this.processDebtEndowmentData(years, recordsPeer, recordsClient);
    this.processRevenueExpenseData(years, recordsPeer, recordsClient);
    this.processFinancialPositionData(years, recordsPeer, recordsClient);
    this.processFinancialStatementData(years, recordsPeer, recordsClient);
    this.processFinancialAnalysisData(years, recordsPeer, recordsClient);

    // Save all data to localStorage at once
    this.dataStore.saveAllToLocalStorage();
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
          "c02_03_yes_no_days_expenses_in_net_assets_with_dr"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDRByPurposeOrTime",
          record,
          "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
          "c02_03_yes_no_days_expenses_in_net_assets_with_dr",
          "daysExpensesInNAwithDR"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDRInPerpetuity",
          record,
          "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
          "c02_03_yes_no_days_expenses_in_net_assets_with_dr",
          "daysExpensesInNAwithDR"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpenses",
          record,
          "_02_03exp___05_total_expenses",
          "c02_03_yes_no_days_expenses_in_net_assets_with_dr",
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
          "_01__01ass___02_cash___cash_equivalents_held_for_long_term",
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
          "netAssetsWithDRByPurposeOrTime",
          record,
          "_01__03na___02_net_assets_with_donor_restrictions_by_purpose_or_time",
          "c02_05a_yew_no_liquidity___assets_available_to_cover_liab_and_restricted_na",
          "liquidityAssetsAvailableCover"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetsWithDRInPerpetuity",
          record,
          "_01__03na___03_net_assets_with_donor_restrictions_in_perpetuity",
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

  processCfiData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // cfiRatio_peerAverage
        this.dataStore.insertData(
          "cfi",
          "peer",
          year,
          "cfiRatio_peerAverage_Peer",
          record,
          "r119_ccfi_overall_ratio",
          "r119_ccfi_overall_ratioyn"
        );

        // primaryReserveRatio_peerAverage
        this.dataStore.insertData(
          "cfi",
          "peer",
          year,
          "primaryReserveRatio_peerAverage_Peer",
          record,
          "r115_ccfi_primary_reserve_ratio",
          "r115_ccfi_primary_reserve_ratioyn"
        );

        // netIncomeOperationsRatio_peerAverage
        this.dataStore.insertData(
          "cfi",
          "peer",
          year,
          "netIncomeOperationsRatio_peerAverage_Peer",
          record,
          "r116_ccfi_net_income_operations_ratio",
          "r116_ccfi_net_income_operations_ratioyn"
        );

        // returnOnNetAssets_peerAverage
        this.dataStore.insertData(
          "cfi",
          "peer",
          year,
          "returnOnNetAssets_peerAverage_Peer",
          record,
          "r117_ccfi_return_on_net_assets_total_return_ratio",
          "r117_ccfi_return_on_net_assets_total_return_ratioyn"
        );

        // viabilityRatio_peerAverage
        this.dataStore.insertData(
          "cfi",
          "peer",
          year,
          "viabilityRatio_peerAverage_Peer",
          record,
          "r118_ccfi_viability_ratio",
          "r118_ccfi_viability_ratioyn"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // cfiRatio
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfiRatio_Client",
          record,
          "r119_ccfi_overall_ratio"
        );

        // cfi_primaryReserveRatio
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_primaryReserveRatio_Client",
          record,
          "r115_ccfi_primary_reserve_ratio"
        );

        // cfi_primaryReserveRatio_Strength
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_primaryReserveRatio_Strength_Client",
          record,
          "r115_ccfi_primary_reserve_ratio_cfi_score___strength"
        );

        // cfi_primaryReserveRatio_Weight
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_primaryReserveRatio_Weight_Client",
          record,
          "r115_ccfi_primary_reserve_ratio_cfi_score___weight"
        );

        // cfi_primaryReserveRatio_Score
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_primaryReserveRatio_Score_Client",
          record,
          "r115_ccfi_primary_reserve_ratio_cfi_score"
        );

        // cfi_netIncomeOperationsRatio
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_netIncomeOperationsRatio_Client",
          record,
          "r116_ccfi_net_income_operations_ratio"
        );

        // cfi_netIncomeOperationsRatio_Strength
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_netIncomeOperationsRatio_Strength_Client",
          record,
          "r116_ccfi_net_income_operations_ratio_cfi_score___strength"
        );

        // cfi_netIncomeOperationsRatio_Weight
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_netIncomeOperationsRatio_Weight_Client",
          record,
          "r116_ccfi_net_income_operations_ratio_cfi_score___weight"
        );

        // cfi_netIncomeOperationsRatio_Score
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_netIncomeOperationsRatio_Score_Client",
          record,
          "r116_ccfi_net_income_operations_ratio_cfi_score"
        );

        // cfi_returnOnNetAssets
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_returnOnNetAssets_Client",
          record,
          "r117_ccfi_return_on_net_assets_total_return_ratio"
        );

        // cfi_returnOnNetAssets_Strength
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_returnOnNetAssets_Strength_Client",
          record,
          "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___strength"
        );

        // cfi_returnOnNetAssets_Weight
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_returnOnNetAssets_Weight_Client",
          record,
          "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___weight"
        );

        // cfi_returnOnNetAssets_Score
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_returnOnNetAssets_Score_Client",
          record,
          "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score"
        );

        // cfi_viabilityRatio
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_viabilityRatio_Client",
          record,
          "r118_ccfi_viability_ratio"
        );

        // cfi_viabilityRatio_Strength
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_viabilityRatio_Strength_Client",
          record,
          "r118_ccfi_viability_ratio_cfi_score___strength"
        );

        // cfi_viabilityRatio_Weight
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_viabilityRatio_Weight_Client",
          record,
          "r118_ccfi_viability_ratio_cfi_score___weight"
        );

        // cfi_viabilityRatio_Score
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "cfi_viabilityRatio_Score_Client",
          record,
          "r118_ccfi_viability_ratio_cfi_score"
        );

        // PRIMARY RESERVE RATIO
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "primaryReserveRatio_Client",
          record,
          "r115_ccfi_primary_reserve_ratio"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "pr_nonrestrictedNetAssets_Client",
          record,
          "r017_net_assets_without_donor_restriction"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "pr_restrictedNetAssets_Client",
          record,
          "r018_net_assets_restricted_by_time_or_purpose"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "pr_propertyAndEquipment_Client",
          record,
          "r099_ctotal_property_and_equipment_less_depreciation"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "pr_notesPayable_Client",
          record,
          "r015_notes_payable"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "pr_cfi_primaryReserveAdjustment_Client",
          record,
          "r114_cfi_primary_reserve_adjustment_number"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "pr_totalFunctionalExpenses_Client",
          record,
          "r044_ctotal_functional_expenses"
        );

        // NET INCOME OPERATIONS RATIO
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "netIncomeOperationsRatio_Client",
          record,
          "r116_ccfi_net_income_operations_ratio"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "ni_operatingRevenuesSupportAndReleases_Client",
          record,
          "r036_coperating_revenues_support_and_releases"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "ni_totalFunctionalExpenses_Client",
          record,
          "r044_ctotal_functional_expenses"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "ni_nonOperatingActivitiesInvestmentIncome_Client",
          record,
          "r047_non_operating_activities_investment_income"
        );

        // CFI RETURN ON NET ASSETS
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "returnOnNetAssets_Client",
          record,
          "r117_ccfi_return_on_net_assets_total_return_ratio"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "ro_changeInNetAssets_Client",
          record,
          "r065_cchange_in_net_assets"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "ro_netAssetsBeginningOfYear_Client",
          record,
          "r066_net_assets_beginning_of_year"
        );

        // VIABILITY RATIO
        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "viabilityRatio_Client",
          record,
          "r118_ccfi_viability_ratio"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "vr_nonrestrictedNetAssets_Client",
          record,
          "r017_net_assets_without_donor_restriction"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "vr_restrictedNetAssets_Client",
          record,
          "r018_net_assets_restricted_by_time_or_purpose"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "vr_totalPropertyAndEquipment_Client",
          record,
          "r099_ctotal_property_and_equipment_less_depreciation"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "vr_accumulatedDepreciation_Client",
          record,
          "r098_accumulated_depreciation"
        );

        this.dataStore.insertData(
          "cfi",
          "client",
          year,
          "vr_notesPayable_Client",
          record,
          "r015_notes_payable"
        );
      });
    });

    const selectedYears = getSelectedYearsFromLocalStorage();
    const cfiValue =
      this.dataStore.cfiData.cfiRatio_Client[
        selectedYears[selectedYears.length - 1]
      ]?.value;
    updateCfiValue(cfiValue, selectedYears[selectedYears.length - 1]);
    const thCfiScoreElement = document.getElementById("th_cfiScore");
    thCfiScoreElement.textContent =
      cfiValue !== undefined && !isNaN(cfiValue) && cfiValue !== 0
        ? cfiValue
        : "-";
  }

  processDebtEndowmentContentData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Long Term Debt Per Total Operating Revenue
        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "longTermDebtForLongTermPurpose_Client",
          record,
          "r285_clong_term_debt_per_total_operating_revenue"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "longTermDebt_Client",
          record,
          "r015_notes_payable"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "totalOperatingRevenue_Client",
          record,
          "r036_coperating_revenues_support_and_releases"
        );

        // Debt Service Coverage Ratio
        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "ratio_Client",
          record,
          "r288_cdebt_service_coverage_ratio"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "debtService_Client",
          record,
          "r286_cdebt_service"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "interest_Client",
          record,
          "r165_interest"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "principalPayments_Client",
          record,
          "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable"
        );

        // Debt Burden Ratio
        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "ratio_Client",
          record,
          "r287_cdebt_burden_ratio"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "operationalExpense_Client",
          record,
          "r044_ctotal_functional_expenses"
        );

        // Endowment Operating Budget
        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "ratio_Client",
          record,
          "r153_cendowment_to_expenses_ratio"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "endowment_Client",
          record,
          "e001_endowment_size"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "annualOperatingBudget_Client",
          record,
          "r044_ctotal_functional_expenses"
        );

        // Endowment Assets Per Student
        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "ratio_Client",
          record,
          "r152_cendowment_assets_per_student"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "client",
          year,
          "totalStudentFte_Client",
          record,
          "g025_ctotal_student_fte"
        );
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Debt Burden Ratio
        this.dataStore.insertData(
          "debtEndowment",
          "peer",
          year,
          "ratio_Peer",
          record,
          "r287_cdebt_burden_ratio",
          "Yes"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "peer",
          year,
          "operationalExpense_Peer",
          record,
          "r044_ctotal_functional_expenses",
          "Yes"
        );

        // Endowment Assets Per Student
        this.dataStore.insertData(
          "debtEndowment",
          "peer",
          year,
          "ratio_Peer",
          record,
          "r152_cendowment_assets_per_student",
          "Yes"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "peer",
          year,
          "endowment_Peer",
          record,
          "e001_endowment_size",
          "Yes"
        );

        this.dataStore.insertData(
          "debtEndowment",
          "peer",
          year,
          "totalStudentFte_Peer",
          record,
          "g025_ctotal_student_fte",
          "Yes"
        );
      });
    });
  }

  processRevenueExpenseContentData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Salaries and Benefits to Total Expense
        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "salariesAndBenefitsToTotalExpense_Client",
          record,
          "r228_csalaries_and_benefits_to_total_expenses"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "salariesAndWages_Client",
          record,
          "r160_salaries_and_wages"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "employeeBenefits_Client",
          record,
          "r161_employee_benefits"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "totalFunctionalExpenses_Client",
          record,
          "r044_ctotal_functional_expenses"
        );

        // Average Employee Salary
        const employeeSalaryFields = [
          ["president_Client", "c011_sal_president"],
          ["chiefAcademic_Client", "c021_sal_chief_academic"],
          ["chiefFinance_Client", "c031_sal_chief_finance"],
          ["chiefEnrollment_Client", "c041_sal_chief_enrollment"],
          ["chiefDevelopment_Client", "c051_sal_chief_development"],
          ["chiefOps_Client", "c061_sal_chief_ops"],
          ["dirFinance_Client", "c071_sal_dir_of_fin_aid"],
          ["dirHr_Client", "c081_sal_dir_of_hr"],
          ["dirIt_Client", "c091_sal_dir_of_it"],
          ["dirPhysPlant_Client", "c101_sal_dir_of_phys_plant"],
          ["controller_Client", "c111_sal_controller"],
          ["busMgr_Client", "c121_sal_bus_mgr"],
          ["bursar_Client", "c131_sal_bursar"],
          ["budgetDir_Client", "c141_sal_budget_dir"],
          ["dirAcct_Client", "c151_sal_dir_of_acct"],
          ["srAcct_Client", "c161_sal_sr_acct"],
          ["nonSrAcct_Client", "c171_sal_non_sr_acct"],
          ["stuAcctMgr_Client", "c181_sal_stu_acct_mgr"],
          ["otherBusOffice_Client", "c191_sal_other_bus_office"],
          ["adminAsst_Client", "c201_sal_admin_asst"]
        ];

        employeeSalaryFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "revenueExpense",
            "client",
            year,
            key,
            record,
            field
          );
        });

        // Salaries and Benefits Per Net Tuition
        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "salariesAndBenefitsPerNetTuition_Client",
          record,
          "r284_csalaries_and_benefits_per_net_tuition_revenue"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "netTuitionAndFees_Client",
          record,
          "r026_cnet_tuition_and_fees"
        );

        // Admin Costs Per Student
        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "adminCostsPerStudent_Client",
          record,
          "r230_cadmin_costs_per_student"
        );

        // Net Educational Expense Per Student
        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "ratio_Client",
          record,
          "r138_cnet_educational_expenses_per_student"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "netEducationalExpenses_Client",
          record,
          "r137_cnet_educational_expenses"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "totalStudents_Client",
          record,
          "g025_ctotal_student_fte"
        );

        // Annual Traditional Net Tuition Per Student
        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "ratio_Client",
          record,
          "r136_cnet_tuition_per_student"
        );

        // Tuition Dependency
        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "ratio_Client",
          record,
          "r147_cnet_tuition_dependency_ratio"
        );

        // Tuition Discount Rate
        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "ratio_Client",
          record,
          "r229_ctuition_discount_rate"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "revenueScholarshipsAndFinanancialAid_Client",
          record,
          "r024_revenue_scholarships_and_financial_aid"
        );

        this.dataStore.insertData(
          "revenueExpense",
          "client",
          year,
          "revenueTuitionAndFees_Client",
          record,
          "r023_revenue_tuition_and_fees"
        );
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Average Employee Salary
        const peerSalaryFields = [
          ["president_Peer", "c011_sal_president"],
          ["chiefAcademic_Peer", "c021_sal_chief_academic"],
          ["chiefFinance_Peer", "c031_sal_chief_finance"],
          ["chiefEnrollment_Peer", "c041_sal_chief_enrollment"],
          ["chiefDevelopment_Peer", "c051_sal_chief_development"],
          ["chiefOps_Peer", "c061_sal_chief_ops"],
          ["dirFinance_Peer", "c071_sal_dir_of_fin_aid"],
          ["dirHr_Peer", "c081_sal_dir_of_hr"],
          ["dirIt_Peer", "c091_sal_dir_of_it"],
          ["dirPhysPlant_Peer", "c101_sal_dir_of_phys_plant"],
          ["controller_Peer", "c111_sal_controller"],
          ["busMgr_Peer", "c121_sal_bus_mgr"],
          ["bursar_Peer", "c131_sal_bursar"],
          ["budgetDir_Peer", "c141_sal_budget_dir"],
          ["dirAcct_Peer", "c151_sal_dir_of_acct"],
          ["srAcct_Peer", "c161_sal_sr_acct"],
          ["nonSrAcct_Peer", "c171_sal_non_sr_acct"],
          ["stuAcctMgr_Peer", "c181_sal_stu_acct_mgr"],
          ["otherBusOffice_Peer", "c191_sal_other_bus_office"],
          ["adminAsst_Peer", "c201_sal_admin_asst"]
        ];

        peerSalaryFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "revenueExpense",
            "peer",
            year,
            key,
            record,
            field,
            "Yes"
          );
        });

        // Admin Costs Per Student
        const adminCostsFields = [
          ["salAdminAsst_Peer", "c201_sal_admin_asst"],
          ["ficaAdminAsst_Peer", "c203_fica_admin_asst"],
          ["healthAdminAsst_Peer", "c204_health_admin_asst"],
          ["disabilityAdminAsst_Peer", "c205_disability_admin_asst"],
          ["retirementAdminAsst_Peer", "c206_retirement_admin_asst"],
          ["housingAdminAsst_Peer", "c207_housing_admin_asst"],
          ["otherAdminAsst_Peer", "c208_other_admin_asst"],
          ["totalStudentFte_Peer", "g025_ctotal_student_fte"],
          ["totalStudentUhc_Peer", "g035_ctotal_student_uhc"]
        ];

        adminCostsFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "revenueExpense",
            "peer",
            year,
            key,
            record,
            field,
            "Yes"
          );
        });

        // Net Educational Expense Per Student
        this.dataStore.insertData(
          "revenueExpense",
          "peer",
          year,
          "ratio_Peer",
          record,
          "r138_cnet_educational_expenses_per_student",
          "Yes"
        );

        // Tuition Dependency
        this.dataStore.insertData(
          "revenueExpense",
          "peer",
          year,
          "ratio_Peer",
          record,
          "r147_cnet_tuition_dependency_ratio",
          "Yes"
        );

        // Tuition Discount Rate
        this.dataStore.insertData(
          "revenueExpense",
          "peer",
          year,
          "ratio_Peer",
          record,
          "r229_ctuition_discount_rate",
          "Yes"
        );
      });
    });
  }

  processFinancialPositionContentData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Current Ratio
        const currentRatioFields = [
          ["cashAndCashEquivalents_Client", "r001_cash_and_cash_equivalents"],
          ["accountsReceivable_Client", "r002_accounts_receivable_net"],
          ["studentLoansAndOtherReceivables_Client", "r003_student_loans_and_other_receivables"],
          ["contributionsReceivable_Client", "r004_contributions_receivable"],
          ["prepaidExpensesAndOtherAssets_Client", "r005_prepaid_expenses_and_other_assets"],
          ["accountsPayable_Client", "r009_accounts_payable_and_accrued_liabilities"],
          ["deferredRevenue_Client", "r010_deferred_revenue"],
          ["postRetirementHealthBenefits_Client", "r011_post_retirement_health_benefits"],
          ["annuityObligations_Client", "r012_annuity_obligations"],
          ["otherLiabilities_Client", "r013_other_liabilities"]
        ];

        currentRatioFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "financialPosition",
            "client",
            year,
            key,
            record,
            field
          );
        });

        // Liquidity
        const liquidityFields = [
          ["fasbLiquidity_Client", "r250_fasb_liquidity"],
          ["quasiEndowment_Client", "r251_quasi_endowment"],
          ["lineOfCredit_Client", "r252_line_of_credit_available"]
        ];

        liquidityFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "financialPosition",
            "client",
            year,
            key,
            record,
            field
          );
        });
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Current Ratio
        this.dataStore.insertData(
          "financialPosition",
          "peer",
          year,
          "currentRatio_Peer",
          record,
          "r258_ccurrent_ratio",
          "Yes"
        );

        this.dataStore.insertData(
          "financialPosition",
          "peer",
          year,
          "currentAssets_Peer",
          record,
          "r256_ccurrent_assets",
          "Yes"
        );

        this.dataStore.insertData(
          "financialPosition",
          "peer",
          year,
          "currentLiabilities_Peer",
          record,
          "r257_ccurrent_liabilities",
          "Yes"
        );

        // Liquidity
        this.dataStore.insertData(
          "financialPosition",
          "peer",
          year,
          "liquidity_Peer",
          record,
          "r250_fasb_liquidity",
          "Yes"
        );
      });
    });
  }

  processFinancialAnalysisContentData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Operating Results
        const operatingResultsFields = [
          ["operatingRevenuesSupportAndRelease_Client", "r036_coperating_revenues_support_and_releases"],
          ["totalFunctionalExpenses_Client", "r044_ctotal_functional_expenses"],
          ["changeInNetAssetsFromOperations_Client", "r045_cchange_in_net_assets_from_operations"]
        ];

        operatingResultsFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "financialAnalysis",
            "client",
            year,
            key,
            record,
            field
          );
        });

        // Net Operating Income Ratio
        this.dataStore.insertData(
          "financialAnalysis",
          "client",
          year,
          "netOperatingIncomeRatio_Client",
          record,
          "r227_cnet_operating_income_ratio"
        );

        // Operating Revenue Growth
        this.dataStore.insertData(
          "financialAnalysis",
          "client",
          year,
          "operatingRevenueGrowth_Client",
          record,
          "r231_coperating_revenue_growth"
        );

        // Operating Expense Growth
        this.dataStore.insertData(
          "financialAnalysis",
          "client",
          year,
          "operatingExpenseGrowth_Client",
          record,
          "r232_coperating_expense_growth"
        );
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Net Operating Income Ratio
        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "netOperatingIncomeRatio_Peer",
          record,
          "r227_cnet_operating_income_ratio",
          "Yes"
        );

        // Operating Revenue Growth
        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "operatingRevenueGrowth_Peer",
          record,
          "r231_coperating_revenue_growth",
          "Yes"
        );

        // Operating Expense Growth
        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "operatingExpenseGrowth_Peer",
          record,
          "r232_coperating_expense_growth",
          "Yes"
        );
      });
    });
  }

  processDoeData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Composite Score
        this.dataStore.insertData(
          "doe",
          "client",
          year,
          "compositeScore_Client",
          record,
          "r226_ccomposite_score"
        );

        // Primary Reserve Ratio
        const primaryReserveFields = [
          ["primaryReserveRatio_Client", "r223_cprimary_reserve_ratio"],
          ["expendableNetAssets_Client", "r217_cexpendable_net_assets"],
          ["totalExpenses_Client", "r044_ctotal_functional_expenses"]
        ];

        primaryReserveFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "doe",
            "client",
            year,
            key,
            record,
            field
          );
        });

        // Equity Ratio
        const equityFields = [
          ["equityRatio_Client", "r224_cequity_ratio"],
          ["modifiedNetAssets_Client", "r218_cmodified_net_assets"],
          ["modifiedAssets_Client", "r219_cmodified_assets"]
        ];

        equityFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "doe",
            "client",
            year,
            key,
            record,
            field
          );
        });

        // Net Income Ratio
        const netIncomeFields = [
          ["netIncomeRatio_Client", "r225_cnet_income_ratio"],
          ["changeInUnrestrictedNetAssets_Client", "r220_cchange_in_unrestricted_net_assets"],
          ["totalUnrestrictedRevenue_Client", "r221_ctotal_unrestricted_revenue"]
        ];

        netIncomeFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "doe",
            "client",
            year,
            key,
            record,
            field
          );
        });
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Composite Score
        this.dataStore.insertData(
          "doe",
          "peer",
          year,
          "compositeScore_Peer",
          record,
          "r226_ccomposite_score",
          "Yes"
        );

        // Primary Reserve Ratio
        this.dataStore.insertData(
          "doe",
          "peer",
          year,
          "primaryReserveRatio_Peer",
          record,
          "r223_cprimary_reserve_ratio",
          "Yes"
        );

        // Equity Ratio
        this.dataStore.insertData(
          "doe",
          "peer",
          year,
          "equityRatio_Peer",
          record,
          "r224_cequity_ratio",
          "Yes"
        );

        // Net Income Ratio
        this.dataStore.insertData(
          "doe",
          "peer",
          year,
          "netIncomeRatio_Peer",
          record,
          "r225_cnet_income_ratio",
          "Yes"
        );
      });
    });
  }

  processFinancialStatementContentData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Operating Revenue
        const operatingRevenueFields = [
          ["tuitionAndFees_Client", "r023_revenue_tuition_and_fees"],
          ["scholarshipsAndFinancialAid_Client", "r024_revenue_scholarships_and_financial_aid"],
          ["netTuitionAndFees_Client", "r026_cnet_tuition_and_fees"],
          ["governmentGrants_Client", "r027_revenue_government_grants"],
          ["privateGifts_Client", "r028_revenue_private_gifts"],
          ["investmentReturn_Client", "r029_revenue_investment_return"],
          ["salesAndServices_Client", "r030_revenue_sales_and_services"],
          ["otherRevenue_Client", "r031_revenue_other"],
          ["netAssetsReleasedFromRestrictions_Client", "r032_revenue_net_assets_released_from_restrictions"],
          ["operatingRevenuesSupportAndRelease_Client", "r036_coperating_revenues_support_and_releases"]
        ];

        operatingRevenueFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "financialStatement",
            "client",
            year,
            key,
            record,
            field
          );
        });

        // Operating Expenses
        const operatingExpenseFields = [
          ["instructionExpense_Client", "r037_expense_instruction"],
          ["researchExpense_Client", "r038_expense_research"],
          ["publicServiceExpense_Client", "r039_expense_public_service"],
          ["academicSupportExpense_Client", "r040_expense_academic_support"],
          ["studentServicesExpense_Client", "r041_expense_student_services"],
          ["institutionalSupportExpense_Client", "r042_expense_institutional_support"],
          ["auxiliaryEnterprisesExpense_Client", "r043_expense_auxiliary_enterprises"],
          ["totalFunctionalExpenses_Client", "r044_ctotal_functional_expenses"]
        ];

        operatingExpenseFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "financialStatement",
            "client",
            year,
            key,
            record,
            field
          );
        });

        // Change in Net Assets
        const netAssetsFields = [
          ["changeInNetAssetsFromOperations_Client", "r045_cchange_in_net_assets_from_operations"],
          ["nonOperatingRevenues_Client", "r046_non_operating_revenues"],
          ["totalChangeInNetAssets_Client", "r047_ctotal_change_in_net_assets"],
          ["beginningNetAssets_Client", "r048_beginning_net_assets"],
          ["endingNetAssets_Client", "r049_cending_net_assets"]
        ];

        netAssetsFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "financialStatement",
            "client",
            year,
            key,
            record,
            field
          );
        });
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Operating Revenue
        this.dataStore.insertData(
          "financialStatement",
          "peer",
          year,
          "operatingRevenuesSupportAndRelease_Peer",
          record,
          "r036_coperating_revenues_support_and_releases",
          "Yes"
        );

        // Operating Expenses
        this.dataStore.insertData(
          "financialStatement",
          "peer",
          year,
          "totalFunctionalExpenses_Peer",
          record,
          "r044_ctotal_functional_expenses",
          "Yes"
        );

        // Change in Net Assets
        const peerNetAssetsFields = [
          ["changeInNetAssetsFromOperations_Peer", "r045_cchange_in_net_assets_from_operations"],
          ["totalChangeInNetAssets_Peer", "r047_ctotal_change_in_net_assets"],
          ["endingNetAssets_Peer", "r049_cending_net_assets"]
        ];

        peerNetAssetsFields.forEach(([key, field]) => {
          this.dataStore.insertData(
            "financialStatement",
            "peer",
            year,
            key,
            record,
            field,
            "Yes"
          );
        });
      });
    });
  }

  // Helper method to filter records by fiscal year
  filterRecordsByYear(records, year) {
    // Handle null or undefined records
    if (!records) {
      console.warn("Records is null or undefined");
      return [];
    }

    // Convert to array if it's not already one
    const recordsArray = Array.isArray(records) ? records : Array.from(records);

    return recordsArray.filter((record) => {
      try {
        // Check if record is a DOM element
        if (record && typeof record.querySelector === "function") {
          const fiscalYear = record.querySelector(
            "year"
          )?.textContent;
          return fiscalYear && fiscalYear.includes(year.toString());
        }
        // Check if record is an object with direct properties
        else if (record && record.year) {
          const fiscalYear = record.year;
          return fiscalYear && fiscalYear.includes(year.toString());
        }
        // If neither format works, log and skip this record
        else {
          console.warn("Unrecognized record format:", record);
          return false;
        }
      } catch (error) {
        console.error("Error filtering record by year:", error, record);
        return false;
      }
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
      try {
        // If no data was collected, return empty array
        if (dataStr === "<qdbapi>") {
          console.warn("No records collected, returning empty array");
          return [];
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(
          dataStr + "</qdbapi>",
          "text/xml"
        );
        const records = xmlDoc.querySelectorAll("record");
        // console.log(`Parsed ${records.length} peer records from collected data`);
        return records;
      } catch (error) {
        console.error("Error parsing XML in getRecordsForPeer:", error);
        return [];
      }
    }

    const currentYear = years[0];
    // console.log(`Fetching peer data for year: ${currentYear}`);

    try {
      // Get selected clients with appropriate batching
      const clientQuery = this.getClientQuery(window.selectedClients_Array);

      // Basic query condition with year
      const queryCondition = `{301.EX.${currentYear}} AND ${clientQuery}`;
      // console.log(`Using query condition: ${queryCondition}`);

      const apiCallPeerData = {
        act: "API_DoQuery",
        query: queryCondition,
        clist:
          "7.3.536.619.537.618.534.539.758.759.757.760.761.741.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395.390.391.549.392.395.393.394.411.450.451.452.453.454.455.727.546.397.394.398.622.621.623.624.625.626.627.629.630.631.632.633.634.635.636.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.481.91.111.131.151.171.191.557.616.614.615.386.641.217.557.611.605.552.391.390.609.217.557.643.644.645.646.550.638.566",
      };

      // Use await to make the async operation more explicit
      const xml = await $.get(peerData, apiCallPeerData);
      const recordsForPeer = $("record", xml).toArray();
      // console.log(`Received ${recordsForPeer.length} records for year ${currentYear}`);

      // Collect records for later use
      if (recordsForPeer.length > 0) {
        for (const record of recordsForPeer) {
          const newRecord = document.createElement("record");

          // Append each child element to the new record
          Array.from(record.children).forEach((child) => {
            newRecord.appendChild(child.cloneNode(true));
          });

          this.recordPeerHTMLArray.push(newRecord.outerHTML);
          dataStr += newRecord.outerHTML;
        }
      } else {
        console.warn(`No records found for year ${currentYear}`);
      }

      // Recursive call with updated years and dataStr
      return await this.getRecordsForPeer(years.slice(1), dataStr);
    } catch (error) {
      console.error("Error fetching peer data for year", currentYear, error);

      // Log error details
      if (error.status) {
        console.error(
          `Status: ${error.status}, StatusText: ${error.statusText}`
        );
      }

      // Continue with next year even if this one failed
      console.log(`Continuing to next year after error...`);
      return await this.getRecordsForPeer(years.slice(1), dataStr);
    }
  }

  // Retrieve records for client data based on selected years
  async getRecordsForClient(years, dataStr = "<qdbapi>") {
    if (years.length === 0) {
      // Base case: return the final XML when the array is empty
      try {
        // If no data was collected, return empty array
        if (dataStr === "<qdbapi>") {
          console.warn("No client records collected, returning empty array");
          return [];
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(
          dataStr + "</qdbapi>",
          "text/xml"
        );

        const records = xmlDoc.querySelectorAll("record");
        // console.log(`Parsed ${records.length} client records from collected data`);
        return records;
      } catch (error) {
        console.error("Error parsing client XML:", error);
        return [];
      }
    }

    const currentYear = years[0];
    // console.log(`Fetching client data for year: ${currentYear}`);

    try {
      const apiCallClientData = {
        act: "API_DoQuery",
        query: `
          {7.EX.${currentYear}} AND {533.EX.${ClientRid}}`,
        clist:
          "539.7.533.536.619.537.618.534.580.578.576.577.579.712.725.722.719.714.726.723.720.717.724.721.718.387.388.569.386.632.551.550.406.561.418.567.441.540.541.542.600.606.390.392.396.393.395.391.549.394.411.450.451.452.453.454.455.727.570.571.572.546.397.398.373.374.375.376.377.378.379.380.381.382.383.384.385.326.541.387.338.542.390.391.548.402.403.404.405.551.407.408.409.410.557.411.412.415.416.417.560.561.419.420.421.422.423.424.425.426.427.428.571.435.572.566.389.399.400.401.402.403.404.405.551.406.407.408.409.410.557.411.412.413.414.559.415.416.417.560.561.450.451.452.453.454.455.429.430.431.432.571.433.434.435.572.437.438.439.440.567.441.567.441.569.442.429.641.635.481.482.483.709.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.450.451.551.546.711.614.613.633.603.633.621.710.504.550.217.980.981.982.985.983.984.609.608.581.582.583.584.585.586.587.588.589.590.591.592.593.594.595.596.971.972.973.355.1075.1076.1077.1078",
      };

      // Use await to make the async operation more explicit
      const xml = await $.get(clientData, apiCallClientData);
      const recordsForClient = $("record", xml).toArray();
      // console.log(`Received ${recordsForClient.length} client records for year ${currentYear}`);

      // Process the records
      for (const record of recordsForClient) {
        const newRecord = document.createElement("record");

        // Append each child element to the new record
        Array.from(record.children).forEach((child) => {
          newRecord.appendChild(child.cloneNode(true));
        });

        this.recordClientHTMLArray.push(newRecord.outerHTML);
        dataStr += newRecord.outerHTML;
      }

      // Recursive call with updated years and dataStr
      return await this.getRecordsForClient(years.slice(1), dataStr);
    } catch (error) {
      console.error("Error fetching client data for year", currentYear, error);

      // Log error details
      if (error.status) {
        console.error(
          `Status: ${error.status}, StatusText: ${error.statusText}`
        );
      }

      // Continue with next year even if this one failed
      // console.log(`Continuing to next year for client data after error...`);
      return await this.getRecordsForClient(years.slice(1), dataStr);
    }
  }

  // Get records for unique client peer name with additional data
  async getRecordsForUniqueClientPeerNames() {
    const apiCallPeerData = {
      act: "API_DoQuery",
      clist: "7.539.667.619.758.759.757.760.761.741", 
    };

    try {
      const xml = await $.get(peerData, apiCallPeerData);
      const recordsForPeerUniqueClientPeerNames = $("record", xml).toArray();
      const uniquePeerClientNames = new Set();

      // Create a global client data storage if it doesn't exist
      if (!window.clientDataStore) {
        window.clientDataStore = {};
      }

      // Create a string to hold the XML data
      let xmlString = "<qdbapi>";

      recordsForPeerUniqueClientPeerNames.forEach((record) => {
        const clientName = record.querySelector(
          "merged_client_name"
        )?.textContent;

        if (clientName) {
          uniquePeerClientNames.add(clientName);

          // Store client data with all required fields
          if (!window.clientDataStore[clientName]) {
            // Get fiscal year
            const year = record.querySelector(
              "year"
            )?.textContent;

            // Get mission unit value
            const enrollmentVal =
              record.querySelector("client___2023_total_headcount_12_month")
                ?.textContent || "0";

            // Get region value
            const regionVal =
              record.querySelector("client___he__g001_geographic_region")
                ?.textContent || "0";

            // Get statevalue
            const stateVal =
              record.querySelector("client___merged_state")?.textContent ||
              "0";

            // Get membership query - parse from string to array
            const membershipText =
              record.querySelector("client___he__membershipsquery")
                ?.textContent || "";
            const membership = membershipText
              ? membershipText.split(";").filter(Boolean)
              : [];

            // Get type query - parse from string to array
            const typeQueryText =
              record.querySelector("client___he__g003_institution_typequery")
                ?.textContent || "";
            const typeQuery = typeQueryText
              ? typeQueryText.split(";").filter(Boolean)
              : [];

            // Get athletic query - parse from string to array
            const athleticQueryText =
              record.querySelector("client___he__a001_athletic_classificiationquery")
                ?.textContent || "";
            const athleticQuery = athleticQueryText
              ? athleticQueryText.split(";").filter(Boolean)
              : [];

            // Get seminary query - parse from string to array 
            const seminaryQueryText =
              record.querySelector("client___he__seminary_projectquery")
                ?.textContent || "";
            const seminaryQuery = seminaryQueryText
              ? seminaryQueryText.split(";").filter(Boolean)
              : [];

            // Get regional query - parse from string to array 
            const regionalQueryText =
              record.querySelector("client___he__regional_accreditorquery")
                ?.textContent || "";
            const regionalQuery = regionalQueryText
              ? regionalQueryText.split(";").filter(Boolean)
              : [];
              

            // Store all client data
            window.clientDataStore[clientName] = {
              name: clientName,
              year: year, 
              enrollment: parseFloat(enrollmentVal) || 0,
              region: regionVal,
              state: stateVal,
              membership: membership,
              type: typeQuery,
              athletic: athleticQuery,
              seminary: seminaryQuery,
              regional: regionalQuery,
            };
          }

          // Add record's outerHTML to the XML string
          xmlString += record.outerHTML;
        }
      });

      // Close the XML string
      xmlString += "</qdbapi>";

      // Print the XML string to console
      // console.log("Client Data XML:", xmlString);

      const sortedUniquePeerClientNames = Array.from(
        uniquePeerClientNames
      ).sort();

      // Add to global selected clients array
      if (typeof selectedClients_Array !== "undefined") {
        sortedUniquePeerClientNames.forEach((item) =>
          selectedClients_Array.add(item)
        );
      }

      // Check if the function exists before calling it
      if (typeof addUniqueClientsToOptionsSelectClientDropdown === "function") {
        addUniqueClientsToOptionsSelectClientDropdown(
          sortedUniquePeerClientNames
        );
      } else {
        console.error(
          "addUniqueClientsToOptionsSelectClientDropdown function is not defined"
        );

        // Provide a simple fallback for populating clients if needed
        this._populateClientsDropdownFallback(sortedUniquePeerClientNames);
      }

      // Initialize filter handlers after client data is loaded
      this._initializeFilterHandlers();

      window.sortedUniquePeerClientNames = sortedUniquePeerClientNames;

      return sortedUniquePeerClientNames;
    } catch (error) {
      console.error("Error fetching unique client names:", error);
      return [];
    }
  }

  // Add a method to initialize filter handlers
  _initializeFilterHandlers() {
    // Set up event listeners for filter changes
    // These will be triggered when types, areas or sliders change
    document.addEventListener("filtersChanged", this._handleFiltersChanged);

    // Initialize sliders if they exist
    const enrollmentMinSlider = document.getElementById("enrollmentMin");
    const enrollmentMaxSlider = document.getElementById("enrollmentMax");


    if (enrollmentMinSlider) {
      enrollmentMinSlider.addEventListener("input", () => {
        window.sliderValue = parseInt(enrollmentMinSlider.value);
        this._triggerFiltersChanged();
      });
    }

    if (enrollmentMaxSlider) {
      enrollmentMaxSlider.addEventListener("input", () => {
        window.sliderValue2 = parseInt(enrollmentMaxSlider.value);
        this._triggerFiltersChanged();
      });
    }

    // Initial filter application
    this._triggerFiltersChanged();
  }

  // Method to handle filter changes
  _handleFiltersChanged() {
    if (!window.clientDataStore) {
      console.warn("Client data store not available yet");
      return;
    }

    console.log("Filter change detected. Updating client selection...");

    // Call the function that updates client checkboxes based on current filters
    if (typeof updateClientDropdownBasedOnFilters === "function") {
      updateClientDropdownBasedOnFilters();
    } else if (typeof headerUpdateClientDropdown === "function") {
      // Try the function from Header.js
      headerUpdateClientDropdown();
    } else {
      console.error("No suitable update function found for client dropdown");
      this._updateClientSelection();
    }
  }

  // Add a fallback method
  _updateClientSelection() {
    // Get current filter values
    const minEnrollment = window.sliderValue || 0;
    const maxEnrollment = window.sliderValue2 || 25000;
    const selectedRegions = Array.from(window.selectedRegions_Array || []);
    const selectedStates = Array.from(window.selectedStates_Array || []);
    const selectedMemberships = Array.from(window.selectedMemberships_Array || []);
    const selectedTypes = Array.from(window.selectedTypes_Array || []);
    const selectedAthletics = Array.from(window.selectedAthletics_Array || []);
    const selectedSeminaries = Array.from(window.selectedSeminaries_Array || []);
    const selectedRegionals = Array.from(window.selectedRegionals_Array || []);


    // Update client checkboxes based on filters
    const clientCheckboxes = document.querySelectorAll(
      '#options-list-client input[type="checkbox"]'
    );

    // Process each client (skip the "select all" checkbox)
    for (let i = 1; i < clientCheckboxes.length; i++) {
      const checkbox = clientCheckboxes[i];
      const clientName = checkbox.value;
      const clientData = window.clientDataStore[clientName];

      if (clientData) {
        // Simple matching logic as fallback
        const matches =
          (selectedRegions.length === 0 ||
            clientData.regionQuery.some((region) =>
              selectedRegions.includes(region)
            )) &&
          (selectedStates.length === 0 ||
            clientData.stateQuery.some((state) =>
              selectedStates.includes(state)
            )) &&
          (selectedMemberships.length === 0 ||
            clientData.membershipQuery.some((membership) =>
              selectedMemberships.includes(membership)
            )) &&
          (selectedTypes.length === 0 ||
            clientData.typeQuery.some((type) =>
              selectedTypes.includes(type)
            )) &&
          (selectedAthletics.length === 0 ||
            clientData.athleticQuery.some((athletic) =>
              selectedAthletics.includes(athletic)
            )) &&
          (selectedSeminaries.length === 0 ||
            clientData.seminaryQuery.some((seminary) =>
              selectedSeminaries.includes(seminary)
            )) &&
          (selectedRegionals.length === 0 ||
            clientData.regionalQuery.some((regional) =>
              selectedRegionals.includes(regional)
            )) &&
          clientData.enrollment >= minEnrollment &&
          clientData.enrollment <= maxEnrollment
        checkbox.checked = matches;

        if (matches) {
          window.selectedClients_Array.add(clientName);
        } else {
          window.selectedClients_Array.delete(clientName);
        }
      }
    }
  }

  // Method to trigger filter changed event
  _triggerFiltersChanged() {
    const event = new CustomEvent("filtersChanged");
    document.dispatchEvent(event);
  }

  // Fallback method for populating clients dropdown
  _populateClientsDropdownFallback(clientArray) {
    const optionsListClient = document.getElementById("options-list-client");
    if (!optionsListClient) return;

    // Clear existing content
    optionsListClient.innerHTML = "";

    // Just add simple options without the complex Select All behavior
    clientArray.forEach((clientName) => {
      const listItem = document.createElement("li");
      listItem.textContent = clientName;
      listItem.className = "px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700";
      optionsListClient.appendChild(listItem);

      // Add to global Set if it exists
      if (typeof selectedClients_Array !== "undefined") {
        selectedClients_Array.add(clientName);
      }
    });
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

    // Add initialization flag
    this._initialized = false;

    this.initializeEventListeners();
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Prevent duplicate initialization
    if (this._initialized) {
      console.log("AppController already initialized");
      return;
    }

    // Clear localStorage but preserve any existing selections
    const preservedKeys = ["selectedYears"];
    const savedValues = {};

    // Save values we want to keep
    preservedKeys.forEach((key) => {
      savedValues[key] = localStorage.getItem(key);
    });

    // Clear localStorage
    localStorage.clear();

    // Restore preserved values
    Object.keys(savedValues).forEach((key) => {
      if (savedValues[key]) {
        localStorage.setItem(key, savedValues[key]);
      }
    });

    // Move this line to here - after localStorage operations
    if (
      typeof this.apiService.getRecordsForUniqueClientPeerNames === "function"
    ) {
      // console.log("Loading client names...");
      this.apiService.getRecordsForUniqueClientPeerNames();
    }

    // Initialize dropdowns only if they aren't already populated
    const regionsListElement = document.getElementById("options-list-region");
    if (
      regionsListElement &&
      (!regionsListElement.children.length ||
        regionsListElement.children.length <= 1)
    ) {
      addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
    }

    const statesListElement = document.getElementById("options-list-state");
    if (
      statesListElement &&
      (!statesListElement.children.length ||
        statesListElement.children.length <= 1)
    ) {
      addUniqueStatesToOptionsSelectStatesDropdown(states_Array);
    }

    const membershipsListElement = document.getElementById("options-list-membership");
    if (
      membershipsListElement &&
      (!membershipsListElement.children.length ||
        membershipsListElement.children.length <= 1)
    ) {
      addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);
    }

    const athleticsListElement = document.getElementById("options-list-athletic");
    if (
      athleticsListElement &&
      (!athleticsListElement.children.length ||
        athleticsListElement.children.length <= 1)
    ) {
      addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);
    }

    const seminariesListElement = document.getElementById("options-list-seminary");
    if (
      seminariesListElement &&
      (!seminariesListElement.children.length ||
        seminariesListElement.children.length <= 1)
    ) {
      addUniqueSeminariesToOptionsSelectSeminariesDropdown(seminaries_Array);
    }

    const regionalsListElement = document.getElementById("options-list-regional");
    if (
      regionalsListElement &&
      (!regionalsListElement.children.length ||
        regionalsListElement.children.length <= 1)
    ) {
      addUniqueRegionalsToOptionsSelectRegionalsDropdown(regionals_Array);
    }

    const typesListElement = document.getElementById("options-list-type");
    if (
      typesListElement &&
      (!typesListElement.children.length ||
        typesListElement.children.length <= 1)
    ) {
      addUniqueTypesToOptionsSelectTypesDropdown(types_Array);
      
    }

    // Set up run button event listener
    const runButton = document.getElementById("run"); // Make sure to use correct ID
    if (runButton) {
      this.runButton = runButton;

      // Remove any existing listeners to prevent duplicates
      const newRunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newRunButton, runButton);
      this.runButton = newRunButton;

      // Add click listener
      this.runButton.addEventListener(
        "click",
        this.handleRunButtonClick.bind(this)
      );
    }

    // Mark as initialized
    this._initialized = true;
  }

  async createEmptyChart(chart, title) {
    const element = document.getElementById(chart);
    if (!element) return;

    // Clear any existing content
    element.innerHTML = "";

    // Create a message container
    const messageDiv = document.createElement("div");
    messageDiv.className =
      "flex flex-col items-center justify-center h-64 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg";

    // Add an icon
    const icon = document.createElement("div");
    icon.innerHTML = `
        <svg class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `;

    // Add a title
    const titleElement = document.createElement("h3");
    titleElement.className =
      "mb-2 text-lg font-medium text-gray-900 dark:text-white";
    titleElement.textContent = title || "No Data Available";

    // Add a message
    const message = document.createElement("p");
    message.className = "text-center text-sm text-gray-500 dark:text-gray-400";
    message.textContent =
      "No data could be retrieved for this chart. Try selecting fewer clients or different years.";

    // Assemble the elements
    messageDiv.appendChild(icon);
    messageDiv.appendChild(titleElement);
    messageDiv.appendChild(message);
    element.appendChild(messageDiv);
  }

  // Update validateDataForCharts method with async/await
  async _validateDataForCharts() {
    try {
      // Check if we have any peer or client data
      const peerDataExists = await this._checkForAnyData("*_Peer");
      const clientDataExists = await this._checkForAnyData("*_Client");

      if (!peerDataExists && !clientDataExists) {
        console.warn("No peer or client data found");
        createToastWarning(
          "No data retrieved. Try selecting fewer clients or different years."
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating chart data:", error);
      return false;
    }
  }

  // Update checkForAnyData helper method with async/await
  async _checkForAnyData(pattern) {
    // Check all data categories
    const categories = [
      "cfiData",
      "doeData",
      "financialAnalysisData",
      "financialPositionData",
      "financialStatementData",
      "revenueExpenseData",
      "debtEndowmentData",
    ];

    for (const category of categories) {
      const data = localStorage.getItem(category);
      if (!data || data === "{}") continue;

      try {
        const parsedData = JSON.parse(data);

        // Check for any keys matching the pattern
        const keys = Object.keys(parsedData);
        if (
          keys.some((key) =>
            pattern === "*_Peer"
              ? key.endsWith("_Peer")
              : key.endsWith("_Client")
          )
        ) {
          return true;
        }
      } catch (e) {
        console.error(`Error parsing ${category}:`, e);
      }
    }

    return false;
  }

  // Handle the run button click
  async handleRunButtonClick() {
    console.log("handleRunButtonClick() called");

    try {
      // Show loading indicator
      showApiLoadingFunction("open", "api");

      // Process selected years
      let selectedYears;
      try {
        selectedYears = this.processSelectedYears();
      } catch (error) {
        console.error("Error processing selected years:", error);
        showApiLoadingFunction("close");

        this.enableGenerateReportsButton();

        return;
      }

      this.saveSelectedYearsToLocalStorage(selectedYears);

      // Check for selected clients
      if (
        !window.selectedClients_Array ||
        window.selectedClients_Array.size === 0
      ) {
        console.warn("No clients selected");
        createToastWarning("Please select at least one client");
        showApiLoadingFunction("close");

        // Re-enable generateReports button if it exists
        this.enableGenerateReportsButton();

        return;
      }

      // Log selected data for debugging
      // console.log("Selected years:", selectedYears);
      // console.log(
      //   "Selected clients:",
      //   Array.from(window.selectedClients_Array)
      // );
      // console.log(
      //   "Selected areas:",
      //   Array.from(window.selectedAreas_Array || [])
      // );
      // console.log(
      //   "Selected types:",
      //   Array.from(window.selectedTypes_Array || [])
      // );

      // Clear existing data
      if (this.dataStore && typeof this.dataStore.clear === "function") {
        this.dataStore.clear();
      }

      if (
        this.apiService &&
        typeof this.apiService.clearRecords === "function"
      ) {
        this.apiService.clearRecords();
      }

      // Fetch peer data with improved error handling
      let recordsPeer;
      try {
        recordsPeer = await this.apiService.getRecordsForPeer(selectedYears);

        // Validate records
        if (!recordsPeer || recordsPeer.length === 0) {
          console.warn("No peer records returned");
          // Continue anyway, we might have client data
        } else {
          // Process peer records
          recordsPeer = await validateAndNormalizeRecords(recordsPeer);
          // console.log(`Normalized ${recordsPeer.length} peer records`);
          window.recordsPeer = recordsPeer;
          countUniqueClients(recordsPeer);
        }
      } catch (error) {
        console.error("Error fetching peer data:", error);
        createToastWarning(
          "Error fetching peer data. Please try again or adjust your filters."
        );
        // Continue anyway, we might have client data
      }

      // Fetch client data with error handling
      let recordsClient;
      try {
        recordsClient = await this.apiService.getRecordsForClient(
          selectedYears
        );

        window.testRecordsClient = recordsClient;

        if (!recordsClient || recordsClient.length === 0) {
          console.warn("No client records returned");
          // Continue anyway, we might have peer data
        } else {
          // Process client records
          recordsClient = await validateAndNormalizeRecords(recordsClient);

          window.recordsClientSelectedYears = recordsClient;
          window.monthYearEnd = recordsClient[
            recordsClientSelectedYears.length - 1
          ].querySelector("fiscal_ye_date_formatted_month").textContent;
          // console.log(`Normalized ${recordsClient.length} client records`);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        createToastWarning("Error fetching client data. Please try again.");
        // Continue anyway, we might have peer data
      }

      // Check if we have any data at all
      if (
        (!recordsPeer || recordsPeer.length === 0) &&
        (!recordsClient || recordsClient.length === 0)
      ) {
        console.error("No data available for either peer or client");
        createToastWarning(
          "No data retrieved. Try selecting fewer clients or different years."
        );
        showApiLoadingFunction("close");
        return;
      }

      // Process the data
      try {
        this.dataProcessor.processAllData(
          selectedYears,
          recordsPeer || [],
          recordsClient || []
        );
      } catch (error) {
        console.error("Error processing data:", error);
        createToastWarning("Error processing data. Please try again.");
        showApiLoadingFunction("close");
        return;
      }

      // Validate data for charts
      const hasValidData = await this._validateDataForCharts();
      if (!hasValidData) {
        console.warn("No valid data for charts");
        showApiLoadingFunction("close");
        return;
      }

      // Display charts
      try {
        this.displayAllComponents();
      } catch (error) {
        console.error("Error displaying components:", error);
        createToastWarning(
          "Error displaying charts. Please check console for details."
        );
      } finally {
        // Always hide loading indicator
        showApiLoadingFunction("close");
      }
    } catch (err) {
      console.error("Unexpected error in handleRunButtonClick:", err);
      createToastWarning("An unexpected error occurred. Please try again.");
      showApiLoadingFunction("close");

      // Re-enable generateReports button if it exists
      this.enableGenerateReportsButton();
    } finally {
      console.log("Finally block in handleRunButtonClick, re-enabling buttons");

      this.enableGenerateReportsButton();
    }
  }

  // enableGenerateReportsButton() {
  //   console.log("enableGenerateReportsButton called");

  //   // Re-enable the generate reports button
  //   const generateReportsBtn = document.getElementById("generateReports");
  //   if (generateReportsBtn) {
  //     generateReportsBtn.disabled = false;

  //     // Use the existing toggle function if available
  //     if (typeof toggleGenerateReportButtonNormalState === "function") {
  //       toggleGenerateReportButtonNormalState(generateReportsBtn);
  //     } else {
  //       // Fallback for when the toggle function is not available
  //       generateReportsBtn.textContent = "Generate Reports";
  //     }

  //     // Remove any existing listeners to prevent duplicates
  //     const newBtn = generateReportsBtn.cloneNode(true);
  //     generateReportsBtn.parentNode.replaceChild(newBtn, generateReportsBtn);

  //     // Ensure ExcelReportGenerator is available
  //     if (typeof ExcelReportGenerator === "function") {
  //       // Create a new instance or use the existing one
  //       if (!window.excelReportGenerator) {
  //         window.excelReportGenerator = new ExcelReportGenerator();
  //       }

  //       // Add a single click event listener
  //       newBtn.addEventListener(
  //         "click",
  //         window.excelReportGenerator.handleGenerateReport.bind(
  //           window.excelReportGenerator
  //         ),
  //         { once: true } // This ensures the event only fires once per click
  //       );

  //       // Expose functions globally for backward compatibility if not already done
  //       if (!window.createPrintExcel) {
  //         window.createPrintExcel =
  //           window.excelReportGenerator.createPrintExcel.bind(
  //             window.excelReportGenerator
  //           );
  //         window.uploadToFile = window.excelReportGenerator.uploadToFile.bind(
  //           window.excelReportGenerator
  //         );
  //         window.uploadSingleToFile =
  //           window.excelReportGenerator.uploadSingleToFile.bind(
  //             window.excelReportGenerator
  //           );
  //         window.printToExcel = window.excelReportGenerator.printToExcel.bind(
  //           window.excelReportGenerator
  //         );
  //       }
  //     } else {
  //       console.warn(
  //         "ExcelReportGenerator not available. Excel report functionality may be limited."
  //       );
  //     }
  //   }

  //   this.enablePrintModalHiddenClass();
  // }

  // enablePrintModalHiddenClass() {
  //   console.log("enablePrintModalHiddenClass called");

  //   // Hide the print modal footer if it exists
  //   const printModalFooter = document.getElementById("print_modal_footer");
  //   if (printModalFooter) {
  //     // Only add the hidden class if it's not already present
  //     if (!printModalFooter.classList.contains("hidden")) {
  //       console.log("Adding hidden class to print_modal_footer");
  //       printModalFooter.classList.add("hidden");
  //     } else {
  //       console.log("print_modal_footer already has hidden class");
  //     }
  //   } else {
  //     console.warn("print_modal_footer element not found!");
  //   }
  // }

  // Process selected years - with better error handling
  
  processSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears) {
      createToastWarning(
        "Error retrieving selected years. Please reload the page and try again."
      );
      throw new Error("Failed to retrieve selected years from localStorage");
    }

    if (!selectedYears.length) {
      createToastWarning("Please select at least one year for data to appear");
      throw new Error("No years selected");
    }

    return selectedYears;
  }

  // Save selected years to localStorage - improved for Sets
  saveSelectedYearsToLocalStorage(selectedYearsData) {
    let selectedYearsArray;

    if (selectedYearsData instanceof Set) {
      // Convert Set to Array
      selectedYearsArray = Array.from(selectedYearsData);
    } else if (Array.isArray(selectedYearsData)) {
      // Already an array
      selectedYearsArray = selectedYearsData;
    } else {
      console.error(
        "Invalid selected years data type:",
        typeof selectedYearsData
      );
      return;
    }

    // Sort years
    selectedYearsArray.sort((a, b) => a - b);

    // Save to localStorage
    localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
  }

  // Display all UI components with error handling
  displayAllComponents() {
    try {
      // Check if we have any valid data to display
      const hasData = this._validateDataForCharts();

      if (!hasData) {
        console.warn(
          "No valid data available for charts. Showing error message to user."
        );
        createToastWarning(
          "No data retrieved from API. Try adjusting your filters or selecting different years."
        );
        return;
      }

      window.reportComponent.displayReportComponent();
      // Rest of the displayAllComponents method...
    } catch (error) {
      console.error("Error in displayAllComponents:", error);
      throw error;
    }
  }

  _validateDataForCharts() {
    try {
      // Check localStorage for required data categories
      const categories = [
        "cfiData",
        "doeData",
        "financialAnalysisData",
        "financialPositionData",
        "financialStatementData",
        "revenueExpenseData",
        "debtEndowmentData",
      ];

      for (const category of categories) {
        const data = localStorage.getItem(category);
        if (!data || data === "{}") {
          console.warn(`Missing or empty data for category: ${category}`);
          return false;
        }

        // Try to parse the data to make sure it's valid JSON
        try {
          const parsedData = JSON.parse(data);
          if (Object.keys(parsedData).length === 0) {
            console.warn(`Empty object for category: ${category}`);
            return false;
          }
        } catch (e) {
          console.error(`Error parsing ${category}: ${e}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error validating chart data:", error);
      return false;
    }
  }
}

// Function to restore initial client selection
function restoreInitialClientSelection() {
  if (!window.clientDataStore) {
    console.warn("Client data store not initialized");
    return;
  }

  // Get all client checkboxes
  const clientCheckboxes = document.querySelectorAll(
    '#options-list-client input[type="checkbox"]'
  );

  // Get the select all checkbox
  const selectAllCheckbox = document.getElementById(
    "select-all-checkbox-client"
  );

  // Clear previous selections
  window.selectedClients_Array.clear();

  // Iterate through all clients and check them
  clientCheckboxes.forEach((checkbox) => {
    // Skip the select all checkbox
    if (checkbox.id === "select-all-checkbox-client") return;

    const clientName = checkbox.value;

    // Always check the checkbox
    checkbox.checked = true;
    window.selectedClients_Array.add(clientName);
  });

  // Ensure select all checkbox is checked
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  }
}

// Add event listener for client data loaded to restore initial selection
document.addEventListener("clientDataLoaded", restoreInitialClientSelection);

// Initialize client dropdown when client data is loaded
document.addEventListener("clientDataLoaded", function (event) {
  // Call the existing function to add clients to dropdown
  addUniqueClientsToOptionsSelectClientDropdown(
    Object.keys(window.clientDataStore)
  );
});

/**
 * Counts and displays the number of unique clients in filtered records
 * @param {NodeList} records - The filtered client records
 */
function countUniqueClients(records) {
  // Check if records is valid and has a forEach method
  if (!records || typeof records.forEach !== "function") {
    console.error("Invalid records provided to countUniqueClients:", records);
    document.getElementById("uniqueClients").textContent = "0";
    return;
  }

  // Get the current filter state
  const selectedClients = window.selectedClients_Array
    ? Array.from(window.selectedClients_Array)
    : [];

  // Use a Set to track unique client names
  const uniqueClients = new Set();

  try {
    records.forEach((record) => {
      const clientName = record.querySelector(
        "merged_client_name"
      )?.textContent;

      // Only count clients that are in the selectedClients_Array
      if (clientName && selectedClients.includes(clientName)) {
        uniqueClients.add(clientName);
      }
    });

    // Update the UI with the count
    const count = uniqueClients.size;
    if (count < 6) {
      createToastWarning("There are 5 or less Unique Clients in Peer Records.");
    }
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = count;
    } else {
      createToastWarning("There are 5 or less Unique Clients in Peer Records.");
    }

    console.log(`Counted ${count} unique clients after filtering`);
  } catch (error) {
    console.error("Error counting unique clients:", error);
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = "0";
    }
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

const togglePrintPresentationButtonNormalState = (btn) => {
  btn.innerHTML = `
    Print Presentation
    `;
};

const toggleGenerateReportButtonNormalState = (btn) => {
  btn.innerHTML = `
    Generate Trends and Benchmark Reports
    `;
};

function toggleButtonNormalState(btn) {
  btn.innerHTML = `
        <span class='text-xl mr-2'>Run</span>
        <svg class="w-8 h-8 text-2xl text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
        </svg>`;
  btn.disabled = false;
}

// API Client Data Query
let apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: `{533.EX.${ClientRid}}`,
  clist: "533.7.539.3",
};

// Fetch client information
$.get(clientData, apiCallClientDataForUniqueYears)
  .then(async (xml) => {
    recordsClient = await $("record", xml).toArray();

    // console.log({recordsClient});
    

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
  // console.log('findUniqueYears', {data});

  if (data) {
    data.forEach((item) => {
      const yearElement = item.querySelector("year");
      if (yearElement) {
        const year = yearElement.textContent;

        // Check if the year is not already in yearsData_Array to ensure uniqueness
        if (!yearsData_Array.includes(year)) {
          yearsData_Array.push(year);
        }
      }
    });
    

    yearsData_Array.sort();
    // console.log('findUniqueYears', {yearsData_Array});

    // Add years to options dropdown
    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
};

async function validateAndNormalizeRecords(records) {
  // Handle empty or invalid input
  if (!records) {
    console.warn("Empty records received");
    return [];
  }

  // If records is already an array, process it
  if (Array.isArray(records)) {
    // Create a new array with properly processed records
    const result = [];

    for (const record of records) {
      // If it's a DOM node, return as is
      if (record && typeof record.querySelector === "function") {
        result.push(record);
      }
      // If it's an object but not a DOM node, convert to a simulated DOM-like object
      else if (record && typeof record === "object") {
        // Create a wrapper with querySelector method
        const wrapper = {
          querySelector: function (selector) {
            // Strip any leading underscores or other characters from selector to match property name
            const propName = selector.replace(/^[_.]/, "");
            if (this.hasOwnProperty(propName)) {
              return { textContent: this[propName] };
            }
            return null;
          },
        };

        // Copy all properties from the original record
        Object.assign(wrapper, record);
        result.push(wrapper);
      }
    }

    return result;
  }

  // If records is NodeList or other iterable, convert to array
  if (typeof records[Symbol.iterator] === "function") {
    return Array.from(records);
  }

  // If records is a single object, wrap in array
  if (typeof records === "object") {
    return [records];
  }

  console.error("Unrecognized records format:", records);
  return [];
}

window.processApiData = function (selectedYears, recordsPeer, recordsClient) {
  console.log("processApiData called with", {
    yearsCount: selectedYears.length,
    peerCount: recordsPeer ? recordsPeer.length : 0,
    clientCount: recordsClient ? recordsClient.length : 0,
  });

  // Call the processApiCalls function which will update the dataStore
  if (typeof processApiCalls === "function") {
    const processedData = processApiCalls(
      selectedYears,
      recordsPeer,
      recordsClient
    );

    // Signal that data processing is complete
    document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

    // Attempt to trigger chart initialization
    setTimeout(() => {
      if (typeof enhancedInitializeChartDisplay === "function") {
        console.log(
          "Triggering enhancedInitializeChartDisplay from processApiData"
        );
        enhancedInitializeChartDisplay();
      } else if (typeof initializeChartDisplay === "function") {
        console.log("Triggering initializeChartDisplay from processApiData");
        initializeChartDisplay();
      } else if (
        window.systemConnector &&
        typeof window.systemConnector.displayCharts === "function"
      ) {
        console.log(
          "Triggering systemConnector.displayCharts from processApiData"
        );
        window.systemConnector.displayCharts();
      }
    }, 500);

    return processedData;
  } else {
    console.error("processApiCalls function not available");

    // Create a fallback function
    if (!window.dataStore) {
      window.dataStore = new DataStore();
    }

    const dataProcessor = new DataProcessor(window.dataStore);
    dataProcessor.processAllData(selectedYears, recordsPeer, recordsClient);

    // Signal completion
    document.dispatchEvent(new CustomEvent("dataProcessingComplete"));

    return {
      cfiData: JSON.parse(localStorage.getItem("cfiData")),
      doeData: JSON.parse(localStorage.getItem("doeData")),
      financialAnalysisData: JSON.parse(localStorage.getItem("financialAnalysisData")),
      financialPositionData: JSON.parse(localStorage.getItem("financialPositionData")),
      financialStatementData: JSON.parse(localStorage.getItem("financialStatementData")),
      revenueExpenseData: JSON.parse(localStorage.getItem("revenueExpenseData")),
      debtEndowmentData: JSON.parse(localStorage.getItem("debtEndowmentData")),
    };
  }
};

// Ensure other key components are globally accessible
window.DataStore = DataStore;
window.DataProcessor = DataProcessor;
window.ApiService = ApiService;

// Create global instances if they don't exist
if (!window.dataStore) {
  window.dataStore = new DataStore();
}

if (!window.dataProcessor) {
  window.dataProcessor = new DataProcessor(window.dataStore);
}

window.onload = () => {
  if (!window.appController) {
    console.log("Initializing AppController");
    window.appController = new AppController();
  }
};
