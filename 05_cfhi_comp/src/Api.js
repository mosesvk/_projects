
// Data Model and Business Logic Classes
class DataStore {
  constructor() {
    this.demoData = {};
    this.cashData = {};
    this.debtData = {};
    this.incomeData = {};
    this.expenseData = {};
    this.additionalData = {};
  }

  // Save all data categories to localStorage
  saveAllToLocalStorage() {
    localStorage.setItem("demoData", JSON.stringify(this.demoData));
    localStorage.setItem("cashData", JSON.stringify(this.cashData));
    localStorage.setItem("debtData", JSON.stringify(this.debtData));
    localStorage.setItem("incomeData", JSON.stringify(this.incomeData));
    localStorage.setItem("expenseData", JSON.stringify(this.expenseData));
    localStorage.setItem("additionalData", JSON.stringify(this.additionalData));
  }

  // Clear all data categories
  clear() {
    this.demoData = {};
    this.cashData = {};
    this.debtData = {};
    this.incomeData = {};
    this.expenseData = {};
    this.additionalData = {};
  }

  // Get a reference to the appropriate data object based on category
  getDataCategory(category) {
    switch (category) {
      case "demo":
        return this.demoData;
      case "cash":
        return this.cashData;
      case "debt":
        return this.debtData;
      case "income":
        return this.incomeData;
      case "expense":
        return this.expenseData;
      case "additional":
        return this.additionalData;
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
    this.processDemoData(years, recordsPeer, recordsClient);
    this.processCashData(years, recordsPeer, recordsClient);
    this.processDebtData(years, recordsPeer, recordsClient);
    this.processIncomeData(years, recordsPeer, recordsClient);
    this.processExpenseData(years, recordsPeer, recordsClient);
    this.processAdditionalData(years, recordsPeer, recordsClient);

    // Save all data to localStorage at once
    this.dataStore.saveAllToLocalStorage();
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
          const fiscalYear =
            record.querySelector("s52_formatted_year")?.textContent;
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

  processDemoData(years, recordsPeer, recordsClient) {
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
          "demo",
          "peer",
          year,
          "givingUnits_Peer",
          record,
          "s02___giving_units",
          "cfhi_compre_00a_yes_no___giving_units"
        );
        // averageAdultAttendees
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "averageAdultAttendees_Peer",
          record,
          "s01_average_adult_attendees_excluding_children",
          "cfhi_compre_00b_yes_no___average_adult_attendees"
        );
        // totalAttendees
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "totalAttendees_Peer",
          record,
          "s150___total_attendee_including_children",
          "cfhi_compre_00c_yes_no___total_attendees_including_children"
        );
        // fullTimeEquivalent
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "fullTimeEquivalent_Peer",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker",
          "cfhi_compre_00d_yes_no___full_time_equivalents"
        );
        // attendeesToStaff [s150/s151]
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "attendeesToStaff_Peer",
          record,
          "cfhi_compre_00e_ratio___attendees_to_staff",
          "cfhi_compre_00e_yes_no___attendees_to_staff"
        );
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "totalAttendees",
          record,
          "s150___total_attendee_including_children",
          "cfhi_compre_00c_yes_no___total_attendees_including_children",
          "attendeesToStaff"
        );
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "fullTimeEquivalent",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker",
          "cfhi_compre_00e_yes_no___attendees_to_staff",
          "attendeesToStaff"
        );

        // contributionsWithoutDonorExcludingLargeGifts
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "contributionsWithoutDonorExcludingLargeGifts_Peer",
          record,
          "cfhi_compre_00f_ratio___contributions_without_donor_restrictions",
          "cfhi_compre_00f_yes_no___contributions_without_donor_restrictions"
        );

        // totalContributionsExclude
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "totalContributionsExclude_Peer",
          record,
          "cfhi_compre_00g_ratio____total_contrib_excluding_large_gifts",
          "cfhi_compre_00g_yes_no____total_contrib_excluding_large_gifts"
        );

        // totalContributionOnline
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "totalContributionOnline_Peer",
          record,
          "s163___total_contribution_given_online",
          "cfhi_compre_00h_yes_no___total_contrib_given_online_including_large_gifts"
        );

        // percentContributionsOnline [(s163/s40) * 100]
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "percentContributionsOnline_Peer",
          record,
          "cfhi_compre_00i_ratio___percent_of_total_contrib_given_online",
          "cfhi_compre_00i_yes_no___percent_of_total_contrib_given_online"
        );
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "totalContributionOnline",
          record,
          "s163___total_contribution_given_online",
          "cfhi_compre_00i_yes_no___percent_of_total_contrib_given_online",
          "percentContributionsOnline"
        );
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "totalContributions",
          record,
          "s40___total_contribution",
          "cfhi_compre_00i_yes_no___percent_of_total_contrib_given_online",
          "percentContributionsOnline"
        );

        // totalOutsourcedEmployees
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "totalOutsourcedEmployees_Peer",
          record,
          "s157___total_outsourced_employee__fte_",
          "cfhi_compre_00j_yes_no___total_outsourced_fte"
        );

        // facilitySquareFootage
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "facilitySquareFootage_Peer",
          record,
          "s08___total_facility_square_footage",
          "cfhi_compre_00k_yes_no___facility_square_footage"
        );

        // numberOfLocations
        this.dataStore.insertData(
          "demo",
          "peer",
          year,
          "numberOfLocations_Peer",
          record,
          "s161___number_of_location",
          "cfhi_compre_00l_yes_no___number_of_locations"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // givingUnits
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "givingUnits_Client",
          record,
          "s02___giving_units"
        );
        // averageAdultAttendees
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "averageAdultAttendees_Client",
          record,
          "s01_average_adult_attendees_excluding_children"
        );
        // totalAttendees
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "totalAttendees_Client",
          record,
          "s150___total_attendee_including_children"
        );
        // fullTimeEquivalent
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "fullTimeEquivalent_Client",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker"
        );
        // attendeesToStaff
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "attendeesToStaff_Client",
          record,
          "cfhi_compre_00a_ratio___attendees_to_staff",
          "cfhi_compre_00a_bench_rating___attendees_to_staff"
        );
        // contributionsWithoutDonorExcludingLargeGifts
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "contributionsWithoutDonorExcludingLargeGifts_Client",
          record,
          "cfhi_compre_00b_ratio___contributions_w_o_donor_restrictions_exclude_lage"
        );
        // totalContributionsExclude
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "totalContributionsExclude_Client",
          record,
          "cfhi_compre_00c_ratio___total_contributions_exclude_large_gifts"
        );
        // totalContributionOnline
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "totalContributionOnline_Client",
          record,
          "s163___total_contribution_given_online"
        );
        // percentContributionsOnline
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "percentContributionsOnline_Client",
          record,
          "cfhi_compre_00d_ratio___percent_of_total_given_online"
        );
        // totalOutsourcedEmployees
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "totalOutsourcedEmployees_Client",
          record,
          "s157___total_outsourced_employee__fte_"
        );
        // facilitySquareFootage
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "facilitySquareFootage_Client",
          record,
          "s08___total_facility_square_footage"
        );
        // numberOfLocations
        this.dataStore.insertData(
          "demo",
          "client",
          year,
          "numberOfLocations_Client",
          record,
          "s161___number_of_location"
        );
      });
    });
  }

  processCashData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // daysExpendableNetAssets [s34, s92, s155, s45, s167, s46]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysExpendableNetAssets_Peer",
          record,
          "cfhi_compre_01_ratio___days_of_expendable_net_asset_reserves",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves"
        );
        // removed s35 per updated ratio
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetWithoutDonorRestriction",
          record,
          "s34___net_asset_without_donor_restriction__undesignated",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
          "daysExpendableNetAssets"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalPropertyPlantAndEquipmentNet",
          record,
          "s92___total_property_plant_and_equipment__net",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
          "daysExpendableNetAssets"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalDebt",
          record,
          "s155___total_debt",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
          "daysExpendableNetAssets"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
          "daysExpendableNetAssets"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
          "daysExpendableNetAssets"
        );
        // removed s168 per updated ratio
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
          "daysExpendableNetAssets"
        );

        // daysOperatingCash [s18, s20, s36, s21, s45, s167, s168, s51, s46, s154, s166]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysOperatingCash_Peer",
          record,
          "cfhi_compre_02_ratio___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalCash",
          record,
          "s18___total_cash",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "nonEndowmentInvestment",
          record,
          "s20___non_endowment_investment",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetWithDonor",
          record,
          "s36___net_asset_with_donor_restriction",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "pledgeReceivable",
          record,
          "s21___pledge_receivable",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "capitalizedInterest",
          record,
          "s51___capitalized_interest",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "daysOperatingCash"
        );

        // availableDaysOfCashFlow [s49] - Simplified per updated calculation
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "availableDaysOfCashFlow_Peer",
          record,
          "cfhi_compre_03_ratio___available_days_of_cash_flow_coverage",
          "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "cashFlowFromOperatingActivities",
          record,
          "s49___cash_flow_from_operating_activities",
          "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
          "availableDaysOfCashFlow"
        );
        // s318 - Total cash at beginning of year - REMOVED per simplified calculation
        // s320 - Non-endowment investment at beginning of year - REMOVED per simplified calculation
        // s336 - Net asset with donor restriction at beginning of year - REMOVED per simplified calculation
        // s321 - Pledge receivable at beginning of year - REMOVED per simplified calculation
        // s30 - Available operating line of credit - REMOVED per simplified calculation
        // s45 - Total expense - REMOVED per simplified calculation
        // s167 - Amortization of finance lease - REMOVED per simplified calculation
        // s168 - Interest on finance lease - REMOVED per simplified calculation
        // s46 - Total depreciation expense - REMOVED per simplified calculation
        // s154 - Required minimum debt principal - REMOVED per simplified calculation
        // s166 - Future minimum lease payment - REMOVED per simplified calculation

        // liquidityRatio [s18, s20, s36, s21, s26, s166, s27, s28, s154, s164, s29, s31]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "liquidityRatio_Peer",
          record,
          "cfhi_compre_04_ratio___liquidity_ratio",
          "cfhi_compre_04_yes_no___liquidity_ratio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalCash",
          record,
          "s18___total_cash",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "nonEndowmentInvestment",
          record,
          "s20___non_endowment_investment",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetWithDonor",
          record,
          "s36___net_asset_with_donor_restriction",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "pledgeReceivable",
          record,
          "s21___pledge_receivable",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "currentLiabilities",
          record,
          "s26___current_liabilities",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "accruedInterest",
          record,
          "s27___accrued_interest",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "accruedConstructionCost",
          record,
          "s28___accrued_construction_cost",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "oneTimePayoffDebtDueNextYear",
          record,
          "s164___one_time_payoff_of_debt_due_in_the_next_year",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "deferredRevenue",
          record,
          "s29___deferred_revenue",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "shortTermConstructionLineOfCredit",
          record,
          "s31___short_term_construction_line_of_credit",
          "cfhi_compre_04_yes_no___liquidity_ratio",
          "liquidityRatio"
        );

        // netCashAvailability [s18, s20, s26, s31, s164, s36]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_Peer",
          record,
          "cfhi_compre_05_ratio___net_cash_availability",
          "cfhi_compre_05_yes_no___net_cash_availability"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalCash",
          record,
          "s18___total_cash",
          "cfhi_compre_05_yes_no___net_cash_availability",
          "netCashAvailability"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "nonEndowmentInvestment",
          record,
          "s20___non_endowment_investment",
          "cfhi_compre_05_yes_no___net_cash_availability",
          "netCashAvailability"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "currentLiabilities",
          record,
          "s26___current_liabilities",
          "cfhi_compre_05_yes_no___net_cash_availability",
          "netCashAvailability"
        );
        // s166 - Future minimum lease payment - REMOVED per updated calculation
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "shortTermConstructionLineOfCredit",
          record,
          "s31___short_term_construction_line_of_credit",
          "cfhi_compre_05_yes_no___net_cash_availability",
          "netCashAvailability"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetWithDonor",
          record,
          "s36___net_asset_with_donor_restriction",
          "cfhi_compre_05_yes_no___net_cash_availability",
          "netCashAvailability"
        );
        // s21 - Pledge receivable - REMOVED per updated calculation

        // TODO: Add s164 field when available in Quickbase
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "oneTimePayoffDebtDueNextYear",
          record,
          "s164___one_time_payoff_of_debt_due_in_the_next_year",
          "cfhi_compre_05_yes_no___net_cash_availability",
          "netCashAvailability"
        );

        // netCashAvailability_including [s18, s20, s26, s31, s164, s36, s30]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_including_Peer",
          record,
          "cfhi_compre_05a_ratio___net_cash_availability_including_unused_line_of_credit",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalCash",
          record,
          "s18___total_cash",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
          "netCashAvailability_including"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "nonEndowmentInvestment",
          record,
          "s20___non_endowment_investment",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
          "netCashAvailability_including"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "currentLiabilities",
          record,
          "s26___current_liabilities",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
          "netCashAvailability_including"
        );
        // s166 - Future minimum lease payment - REMOVED per updated calculation
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "shortTermConstructionLineOfCredit",
          record,
          "s31___short_term_construction_line_of_credit",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
          "netCashAvailability_including"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netAssetWithDonor",
          record,
          "s36___net_asset_with_donor_restriction",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
          "netCashAvailability_including"
        );
        // s21 - Pledge receivable - REMOVED per updated calculation
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "availableOperatingLineOfCredit",
          record,
          "s30___available_operating_line_of_credit",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
          "netCashAvailability_including"
        );

        // TODO: Add s164 field when available in Quickbase
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "oneTimePayoffDebtDueNextYear",
          record,
          "s164___one_time_payoff_of_debt_due_in_the_next_year",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
          "netCashAvailability_including"
        );

        // netCashAvailability_standard [s45, s167, s46]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_standard_Peer",
          record,
          "cfhi_compre_05b_ratio___std__at_least_one_months_worth_cash_expenses",
          "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses",
          "netCashAvailability_standard"
        );
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses",
          "netCashAvailability_standard"
        );
        // s168 - Interest on finance lease - REMOVED per updated calculation
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses",
          "netCashAvailability_standard"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // daysExpendableNetAssets
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysExpendableNetAssets_Client",
          record,
          "cfhi_compre_01_ratio___days_of_expendable_net_asset_reserves",
          "cfhi_compre_01_bench_rating___days_of_expendable_net_asset_reserves"
        );

        // daysOperatingCash
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "daysOperatingCash_Client",
          record,
          "cfhi_compre_02_ratio___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
          "cfhi_compre_02_bench_rating___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures"
        );

        // availableDaysOfCashFlow
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "availableDaysOfCashFlow_Client",
          record,
          "cfhi_compre_03_ratio___available_days_of_cash_flow_coverage",
          "cfhi_compre_03_bench_rating___available_days_of_cash_flow_coverage"
        );

        // liquidityRatio
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "liquidityRatio_Client",
          record,
          "cfhi_compre_04_ratio___liquidity_ratio",
          "cfhi_compre_04_bench_rating___liquidity_ratio"
        );

        // netCashAvailability
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "netCashAvailability_Client",
          record,
          "cfhi_compre_05_ratio___net_cash_availability",
          "cfhi_compre_05_bench_rating___net_cash_availability"
        );

        // netCashAvailability_including
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "netCashAvailability_including_Client",
          record,
          "cfhi_compre_05a_ratio___net_cash_availability_including_unused_line_of_credit"
        );

        // netCashAvailability_standard
        this.dataStore.insertData(
          "cash",
          "client",
          year,
          "netCashAvailability_standard_Client",
          record,
          "cfhi_compre_05b_ratio___std__at_least_one_months_worth_cash_expenses"
        );
      });
    });
  }

  processDebtData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // debtToContributionsWithout [s155, s165, s39]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtToContributionsWithout_Peer",
          record,
          "cfhi_compre_06_ratio___debt_to_contributions_w_o_donor_restrictions",
          "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "totalDebt",
          record,
          "s155___total_debt",
          "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions",
          "debtToContributionsWithout"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "financeLeaseRightOfUse",
          record,
          "s165___finance_lease_right_of_use_asset_and_liability",
          "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions",
          "debtToContributionsWithout"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "contributionWithoutDonor",
          record,
          "s39___contribution_without_donor_retriction",
          "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions",
          "debtToContributionsWithout"
        );

        // currentRatio [s17, s26, s166]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "currentRatio_Peer",
          record,
          "cfhi_compre_07_ratio___current_ratio",
          "cfhi_compre_07_yes_no___current_ratio"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "currentAssets",
          record,
          "s17___current_assets",
          "cfhi_compre_07_yes_no___current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "currentLiabilities",
          record,
          "s26___current_liabilities",
          "cfhi_compre_07_yes_no___current_ratio",
          "currentRatio"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_07_yes_no___current_ratio",
          "currentRatio"
        );

        // mandatoryDebtServiceToContributionsWithout [s154, s47, s51, s39, s90]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "mandatoryDebtServiceToContributionsWithout_Peer",
          record,
          "cfhi_compre_08_ratio__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
          "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
          "mandatoryDebtServiceToContributionsWithout"
        );
        // s166 - Future minimum lease payment - REMOVED per updated calculation
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "cyInterestExpense",
          record,
          "s47___cy_interest_expense",
          "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
          "mandatoryDebtServiceToContributionsWithout"
        );
        // s168 - Interest on finance lease - REMOVED per updated calculation
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "capitalizedInterest",
          record,
          "s51___capitalized_interest",
          "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
          "mandatoryDebtServiceToContributionsWithout"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "contributionWithoutDonor",
          record,
          "s39___contribution_without_donor_retriction",
          "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
          "mandatoryDebtServiceToContributionsWithout"
        );

        // TODO: Add s90 field when available in Quickbase
        // this.dataStore.insertData(
        //   "debt",
        //   "peer",
        //   year,
        //   "nextFiscalYearsRefinancedLoanPayments",
        //   record,
        //   "s90___next_fiscal_years_refinanced_loan_payments", // Field name to be confirmed
        //   "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        //   "mandatoryDebtServiceToContributionsWithout"
        // );

        // debtPerAverageAdultAttendee (removed per todo)

        // debtPerGivingUnit [s155, s165, s02]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtPerGivingUnit_Peer",
          record,
          "cfhi_compre_09d_ratio___debt_per_giving_unit",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "totalDebt",
          record,
          "s155___total_debt",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit",
          "debtPerGivingUnit"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "financeLeaseRightOfUse",
          record,
          "s165___finance_lease_right_of_use_asset_and_liability",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit",
          "debtPerGivingUnit"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit",
          "debtPerGivingUnit"
        );

        // debtPerGivingUnit_percentChange
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtPerGivingUnit_percentChange_Peer",
          record,
          "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
        );

        // debtPerGivingUnit_standard [s39, s152, s02]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtPerGivingUnit_standard_Peer",
          record,
          "cfhi_compre_09f_ratio____std_2_x_contributions_w_o_restrictions_per_giving_unit",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "contributionWithoutDonor",
          record,
          "s39___contribution_without_donor_retriction",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit",
          "debtPerGivingUnit_standard"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "largeOneTimeGiftWithoutDonor",
          record,
          "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit",
          "debtPerGivingUnit_standard"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_compre_09d_yes_no___debt_per_giving_unit",
          "debtPerGivingUnit_standard"
        );

        // debtCoverage [s48, s167, s168, s47, s46, s154, s166]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtCoverage_Peer",
          record,
          "cfhi_compre_10_ratio___debt_coverage",
          "cfhi_compre_10_yes_no___debt_coverage"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "changeInNetAssetWithout",
          record,
          "s48___change_in_net_asset_without_donor_restriction",
          "cfhi_compre_10_yes_no___debt_coverage",
          "debtCoverage"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_10_yes_no___debt_coverage",
          "debtCoverage"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_10_yes_no___debt_coverage",
          "debtCoverage"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "cyInterestExpense",
          record,
          "s47___cy_interest_expense",
          "cfhi_compre_10_yes_no___debt_coverage",
          "debtCoverage"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_10_yes_no___debt_coverage",
          "debtCoverage"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_10_yes_no___debt_coverage",
          "debtCoverage"
        );
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_10_yes_no___debt_coverage",
          "debtCoverage"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // debtToContributionsWithout
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtToContributionsWithout_Client",
          record,
          "cfhi_compre_06_ratio___debt_to_contributions_w_o_donor_restrictions",
          "cfhi_compre_06_bench_rating___debt_to_contributions_w_o_donor_restrictions"
        );

        // currentRatio
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "currentRatio_Client",
          record,
          "cfhi_compre_07_ratio___current_ratio",
          "cfhi_compre_07_bench_rating___current_ratio"
        );

        // mandatoryDebtServiceToContributionsWithout
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "mandatoryDebtServiceToContributionsWithout_Client",
          record,
          "cfhi_compre_08_ratio__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
          "cfhi_compre_08_bench_rating___mandatory_debt_service_to_contributions_w_o_donor_restrictuions"
        );

        // debtPerAverageAdultAttendee
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerAverageAdultAttendee_Client",
          record,
          "cfhi_compre_09a_ratio___debt_per_average_adult_attendee",
          "cfhi_compre_09a_bench_rating___debt_per_average_adult_attendee"
        );

        // debtPerAverageAdultAttendee_percentChange
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerAverageAdultAttendee_percentChange_Client",
          record,
          "cfhi_compre_09a_ratio_change___debt_per_average_adult_attendee"
        );

        // debtPerAverageAdultAttendee_standard
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerAverageAdultAttendee_standard_Client",
          record,
          "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
        );

        // debtPerGivingUnit
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerGivingUnit_Client",
          record,
          "cfhi_compre_09d_ratio___debt_per_giving_unit",
          "cfhi_compre_09d_bench_rating___debt_per_giving_unit"
        );

        // debtPerGivingUnit_percentChange
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerGivingUnit_percentChange_Client",
          record,
          "cfhi_compre_09d_ratio_change___debt_per_giving_unit"
        );

        // debtPerGivingUnit_standard
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtPerGivingUnit_standard_Client",
          record,
          "cfhi_compre_09f_ratio____std_2_x_contributions_w_o_restrictions_per_giving_unit"
        );

        // debtCoverage
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtCoverage_Client",
          record,
          "cfhi_compre_10_ratio___debt_coverage",
          "cfhi_compre_10_bench_rating___debt_coverage"
        );
      });
    });
  }

  processIncomeData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // netIncomeRatio [s48, s167, s168, s41]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "netIncomeRatio_Peer",
          record,
          "cfhi_compre_11_ratio___net_income_ratio",
          "cfhi_compre_11_yes_no___net_income_ratio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "changeInNetAssetWithout",
          record,
          "s48___change_in_net_asset_without_donor_restriction",
          "cfhi_compre_11_yes_no___net_income_ratio",
          "netIncomeRatio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_11_yes_no___net_income_ratio",
          "netIncomeRatio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_11_yes_no___net_income_ratio",
          "netIncomeRatio"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributionWithout",
          record,
          "s41___total_contribution_w_o_donor_restriction__other_rev_and_reclasification",
          "cfhi_compre_11_yes_no___net_income_ratio",
          "netIncomeRatio"
        );

        // netIncomeRatio_twoYrAvg
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "netIncomeRatio_twoYrAvg_Peer",
          record,
          "cfhi_compre_11_ratio___net_income_ratio"
        );

        // contributionsWithoutDonorPerAverageAdultAttendee (removed per todo)

        // contributionsWithoutDonorPerGivingUnit [s39, s152, s02]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDonorPerGivingUnit_Peer",
          record,
          "cfhi_compre_12b_ratio___contributions_without_donor_restrictions_per_giving_unit",
          "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionWithoutDonor",
          record,
          "s39___contribution_without_donor_retriction",
          "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit",
          "contributionsWithoutDonorPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "largeOneTimeGiftWithoutDonor",
          record,
          "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
          "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit",
          "contributionsWithoutDonorPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit",
          "contributionsWithoutDonorPerGivingUnit"
        );

        // contributionsWithoutDonorPerGivingUnit_percentChange
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDonorPerGivingUnit_percentChange_Peer",
          record,
          "cfhi_compre_12b_ratio___contributions_without_donor_restrictions_per_giving_unit"
        );

        // totalContributionsPerAverageAdultAttendee (removed per todo)

        // totalContributionsPerGivingUnit [s40, s44, s152, s153, s02]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributionsPerGivingUnit_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit",
          "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributions",
          record,
          "s40___total_contribution",
          "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
          "totalContributionsPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "revenueFromPledge",
          record,
          "s44___revenue_from_pledge",
          "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
          "totalContributionsPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "largeOneTimeGiftWithoutDonor",
          record,
          "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
          "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
          "totalContributionsPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "largeOneTimeGiftWithDonor",
          record,
          "s153___large_one_time_gift_with_donor_restriction__non_recurring_",
          "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
          "totalContributionsPerGivingUnit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
          "totalContributionsPerGivingUnit"
        );

        // totalContributionsPerGivingUnit_percentChange
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributionsPerGivingUnit_percentChange_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );

        // Median Household Income Peer data
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdIncome_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );

        // medianHouseholdPerGivingUnit variations
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdPerGivingUnit_one_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdPerGivingUnit_two_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdPerGivingUnit_three_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdPerGivingUnit_four_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdPerGivingUnit_five_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdPerGivingUnit_six_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );

        // medianHouseholdLocalCounty variations
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdLocalCounty_one_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdLocalCounty_two_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdLocalCounty_three_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdLocalCounty_four_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdLocalCounty_five_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "medianHouseholdLocalCounty_six_Peer",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // netIncomeRatio
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "netIncomeRatio_Client",
          record,
          "cfhi_compre_11_ratio___net_income_ratio",
          "cfhi_compre_11_bench_ratings___net_income_ratio"
        );

        // netIncomeRatio_twoYrAvg
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "netIncomeRatio_twoYrAvg_Client",
          record,
          "cfhi_compre_11a_ratio___two_year_net_income_ratio",
          "cfhi_compre_11a_bench_ratings___two_year_net_income_ratio"
        );

        // contributionsWithoutDonorPerAverageAdultAttendee (removed per todo)

        // contributionsWithoutDonorPerGivingUnit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsWithoutDonorPerGivingUnit_Client",
          record,
          "cfhi_compre_12b_ratio___contributions_without_donor_restrictions_per_giving_unit"
        );

        // contributionsWithoutDonorPerGivingUnit_percentChange
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsWithoutDonorPerGivingUnit_percentChange_Client",
          record,
          "cfhi_compre_12b_ratio_change__contributions_without_donor_restrictions_per_giving_unit",
          "cfhi_compre_12b_bench_ratings___percent_change___contributions_without_donor_restrictions_per_gu"
        );

        // totalContributionsPerAverageAdultAttendee (removed per todo)

        // totalContributionsPerGivingUnit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalContributionsPerGivingUnit_Client",
          record,
          "cfhi_compre_13b_ratio___total_contributions_per_giving_unit",
          "cfhi_compre_13b_bench_ratings___percent_change___total_contributions_per_giving_unit"
        );

        // totalContributionsPerGivingUnit_percentChange
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalContributionsPerGivingUnit_percentChange_Client",
          record,
          "cfhi_compre_13b_ratio_change___total_contributions_per_giving_unit",
          "cfhi_compre_13b_bench_ratings___percent_change___total_contributions_per_giving_unit"
        );

        // localCountyPerGivingUnit variations
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyPerGivingUnit_Client",
          record,
          "cfhi_compre_14_ratio___median_household_income_given_to_church",
          "cfhi_compre_14_bench_rating___median_household_income_given_to_church"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyPerGivingUnit_two_Client",
          record,
          "cfhi_compre_14a_ratio___median_household_income_given_to_church"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyPerGivingUnit_three_Client",
          record,
          "cfhi_compre_14b_ratio___median_household_income_given_to_church"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyPerGivingUnit_four_Client",
          record,
          "cfhi_compre_14c_ratio___median_household_income_given_to_church"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyPerGivingUnit_five_Client",
          record,
          "cfhi_compre_14d_ratio___median_household_income_given_to_church"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyPerGivingUnit_six_Client",
          record,
          "cfhi_compre_14e_ratio___median_household_income_given_to_church"
        );

        // localCountyMedianHouseholdIncome variations
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyMedianHouseholdIncome_Client",
          record,
          "s54_county_code___data"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyMedianHouseholdIncome_two_Client",
          record,
          "s54_county_code_1054___data"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyMedianHouseholdIncome_three_Client",
          record,
          "s54_county_code_2054___data"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyMedianHouseholdIncome_four_Client",
          record,
          "s54_county_code_3054___data"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyMedianHouseholdIncome_five_Client",
          record,
          "s54_county_code_4054___data"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyMedianHouseholdIncome_six_Client",
          record,
          "s54_county_code_5054___data"
        );

        // localCountyName variations
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyName_Client",
          record,
          "s54_county_code___county"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyName_two_Client",
          record,
          "s54_county_code_1054___county"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyName_three_Client",
          record,
          "s54_county_code_2054___county"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyName_four_Client",
          record,
          "s54_county_code_3054___county"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyName_five_Client",
          record,
          "s54_county_code_4054___county"
        );
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "localCountyName_six_Client",
          record,
          "s54_county_code_5054___county"
        );
      });
    });
  }

  processExpenseData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // benefitsToSalaries
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "benefitsToSalaries_Peer",
          record,
          "cfhi_compre_15_ratio___benefits_to_salaries",
          "cfhi_compre_15_yes_no___benefits_to_salaries"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalBenefit",
          record,
          "s11___total_benefit",
          "cfhi_compre_15_yes_no___benefits_to_salaries",
          "benefitsToSalaries"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalSalaries",
          record,
          "s10___total_salaries",
          "cfhi_compre_15_yes_no___benefits_to_salaries",
          "benefitsToSalaries"
        );

        // salaries
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salaries_Peer",
          record,
          "cfhi_compre_16_ratio___average_salaries_per_fte",
          "cfhi_compre_16_yes_no___average_salaries_per_fte"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalSalaries",
          record,
          "s10___total_salaries",
          "cfhi_compre_16_yes_no___average_salaries_per_fte",
          "salaries"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "fullTimeEquivalent",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker",
          "cfhi_compre_16_yes_no___average_salaries_per_fte",
          "salaries"
        );

        // benefits
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "benefits_Peer",
          record,
          "cfhi_compre_16_ratio___average_benefits_per_fte",
          "cfhi_compre_16_yes_no___average_benefits_per_fte"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalBenefit",
          record,
          "s11___total_benefit",
          "cfhi_compre_16_yes_no___average_benefits_per_fte",
          "benefits"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "fullTimeEquivalent",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker",
          "cfhi_compre_16_yes_no___average_benefits_per_fte",
          "benefits"
        );

        // salariesBenefits
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesBenefits_Peer",
          record,
          "cfhi_compre_16_ratio___average_salaries_and_benefits_per_fte",
          "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalSalaries",
          record,
          "s10___total_salaries",
          "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte",
          "salariesBenefits"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalBenefit",
          record,
          "s11___total_benefit",
          "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte",
          "salariesBenefits"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "fullTimeEquivalent",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker",
          "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte",
          "salariesBenefits"
        );

        // salariesBenefitsIncludingOutsourcedEmployees
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesBenefitsIncludingOutsourcedEmployees_Peer",
          record,
          "cfhi_compre_16a_ratio___salaries_benefits_outsourced_per_all_emp",
          "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalSalaries",
          record,
          "s10___total_salaries",
          "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
          "salariesBenefitsIncludingOutsourcedEmployees"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalBenefit",
          record,
          "s11___total_benefit",
          "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
          "salariesBenefitsIncludingOutsourcedEmployees"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "costOfOutsourcedEmployee",
          record,
          "s162___cost_of_outsourced_employee",
          "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
          "salariesBenefitsIncludingOutsourcedEmployees"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "fullTimeEquivalent",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker",
          "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
          "salariesBenefitsIncludingOutsourcedEmployees"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalOutsourcedEmployee",
          record,
          "s157___total_outsourced_employee__fte_",
          "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
          "salariesBenefitsIncludingOutsourcedEmployees"
        );

        // personnelToCashExpenditure
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "personnelToCashExpenditure_Peer",
          record,
          "cfhi_compre_17_1_ratio__personnel_to_total_cash_expenditures",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalBenefit",
          record,
          "s11___total_benefit",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalSalaries",
          record,
          "s10___total_salaries",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
          "personnelToCashExpenditure"
        );

        // mandatoryDebtServiceToCashExpenditure
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "mandatoryDebtServiceToCashExpenditure_Peer",
          record,
          "cfhi_compre_17_2_ratio___mandatory_debt_to_total_cash_expenditures",
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
          "mandatoryDebtServiceToCashExpenditure"
        );
        // s166 - Future minimum lease payment - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "cyInterestExpense",
          record,
          "s47___cy_interest_expense",
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
          "mandatoryDebtServiceToCashExpenditure"
        );
        // s168 - Interest on finance lease - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
          "mandatoryDebtServiceToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
          "mandatoryDebtServiceToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
          "mandatoryDebtServiceToCashExpenditure"
        );

        // TODO: Add s90 field when available in Quickbase
        // this.dataStore.insertData(
        //   "expense",
        //   "peer",
        //   year,
        //   "nextFiscalYearsRefinancedLoanPayments",
        //   record,
        //   "s90___next_fiscal_years_refinanced_loan_payments", // Field name to be confirmed
        //   "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        //   "mandatoryDebtServiceToCashExpenditure"
        // );

        // TODO: Add s164 field when available in Quickbase
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "oneTimePayoffDebtDueNextYear",
          record,
          "s164___one_time_payoff_of_debt_due_in_the_next_year", // Field name to be confirmed
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
          "mandatoryDebtServiceToCashExpenditure"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "capitalizedInterest",
          record,
          "s51___capitalized_interest",
          "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
          "mandatoryDebtServiceToCashExpenditure"
        );

        // personnelIncludingToTotalCashExpenditures
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "personnelIncludingToTotalCashExpenditures_Peer",
          record,
          "cfhi_compre_17_3_ratio___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalBenefit",
          record,
          "s11___total_benefit",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalSalaries",
          record,
          "s10___total_salaries",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "costOfOutsourcedEmployee",
          record,
          "s162___cost_of_outsourced_employee",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        // s168 - Interest on finance lease - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );
        // s166 - Future minimum lease payment - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );

        // TODO: Add s90 field when available in Quickbase
        // this.dataStore.insertData(
        //   "expense",
        //   "peer",
        //   year,
        //   "nextFiscalYearsRefinancedLoanPayments",
        //   record,
        //   "s90___next_fiscal_years_refinanced_loan_payments", // Field name to be confirmed
        //   "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        //   "personnelIncludingToTotalCashExpenditures"
        // );

        // TODO: Add s164 field when available in Quickbase
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "oneTimePayoffDebtDueNextYear",
          record,
          "s164___one_time_payoff_of_debt_due_in_the_next_year", // Field name to be confirmed
          "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "personnelIncludingToTotalCashExpenditures"
        );

        // localOutreachExpenses
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "localOutreachExpenses_Peer",
          record,
          "cfhi_compre_18_1_ratio___local_outreach_expenses",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "localOutreachExpense",
          record,
          "s14___local_outreach_expense",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses",
          "localOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses",
          "localOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses",
          "localOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses",
          "localOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses",
          "localOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses",
          "localOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_18_1_yes_no___local_outreach_expenses",
          "localOutreachExpenses"
        );

        // globalOutreachExpenses
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "globalOutreachExpenses_Peer",
          record,
          "cfhi_compre_18_2_ratio___global_outreach_expenses",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "globalOutreachExpense",
          record,
          "s15___global_outreach_expense",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses",
          "globalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses",
          "globalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses",
          "globalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses",
          "globalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses",
          "globalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses",
          "globalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_18_2_yes_no___global_outreach_expenses",
          "globalOutreachExpenses"
        );

        // totalGlobalAndLocalOutreachExpenses
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalGlobalAndLocalOutreachExpenses_Peer",
          record,
          "cfhi_compre_18_3_ratio___global_local_outreach_expenses",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "localOutreachExpense",
          record,
          "s14___local_outreach_expense",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
          "totalGlobalAndLocalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "globalOutreachExpense",
          record,
          "s15___global_outreach_expense",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
          "totalGlobalAndLocalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
          "totalGlobalAndLocalOutreachExpenses"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
          "totalGlobalAndLocalOutreachExpenses"
        );
        // s168 - Interest on finance lease - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
          "totalGlobalAndLocalOutreachExpenses"
        );
        // s166 - Future minimum lease payment - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
          "totalGlobalAndLocalOutreachExpenses"
        );

        // TODO: Add s90 and s164 fields when available in Quickbase
        // this.dataStore.insertData(
        //   "expense",
        //   "peer",
        //   year,
        //   "nextFiscalYearsRefinancedLoanPayments",
        //   record,
        //   "s90___next_fiscal_years_refinanced_loan_payments",
        //   "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        //   "totalGlobalAndLocalOutreachExpenses"
        // );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "oneTimePayoffDebtDueNextYear",
          record,
          "s164___one_time_payoff_of_debt_due_in_the_next_year",
          "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
          "totalGlobalAndLocalOutreachExpenses"
        );

        // cashExpendituresPerAvgAdultAttendee (removed per todo)

        // cashExpendituresPerGivingUnit
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "cashExpendituresPerGivingUnit_Peer",
          record,
          "cfhi_compre_19_2_ratio___cash_exp_per_gu",
          "cfhi_compre_19_2_yes_no___cash_exp_per_gu"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
          "cashExpendituresPerGivingUnit"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
          "cashExpendituresPerGivingUnit"
        );
        // s168 - Interest on finance lease - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
          "cashExpendituresPerGivingUnit"
        );
        // s166 - Future minimum lease payment - REMOVED per updated calculation
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
          "cashExpendituresPerGivingUnit"
        );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "givingUnits",
          record,
          "s02___giving_units",
          "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
          "cashExpendituresPerGivingUnit"
        );

        // TODO: Add s90 and s164 fields when available in Quickbase
        // this.dataStore.insertData(
        //   "expense",
        //   "peer",
        //   year,
        //   "nextFiscalYearsRefinancedLoanPayments",
        //   record,
        //   "s90___next_fiscal_years_refinanced_loan_payments",
        //   "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        //   "cashExpendituresPerGivingUnit"
        // );
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "oneTimePayoffDebtDueNextYear",
          record,
          "s164___one_time_payoff_of_debt_due_in_the_next_year",
          "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
          "cashExpendituresPerGivingUnit"
        );

        // cashExpendituresPerGivingUnit_percentChange
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "cashExpendituresPerGivingUnit_percentChange_Peer",
          record,
          "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // benefitsToSalaries
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "benefitsToSalaries_Client",
          record,
          "cfhi_compre_15_ratio___benefits_to_salaries"
        );

        // salaries
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "salaries_Client",
          record,
          "cfhi_compre_16_ratio___average_salaries_per_fte"
        );

        // benefits
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "benefits_Client",
          record,
          "cfhi_compre_16_ratio___average_benefits_per_fte"
        );

        // salariesBenefits
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "salariesBenefits_Client",
          record,
          "cfhi_compre_16_ratio___average_salaries_and_benefits_per_fte"
        );

        // salariesBenefitsIncludingOutsourcedEmployees
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "salariesBenefitsIncludingOutsourcedEmployees_Client",
          record,
          "cfhi_compre_16a_ratio___average_salaries_and_benefits_per_fte___outsourced"
        );

        // personnelToCashExpenditure
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "personnelToCashExpenditure_Client",
          record,
          "cfhi_compre_17_1_ratio___personnel_to_total_cash_expenditures",
          "cfhi_compre_17_1_bench_rating___personnel_to_total_cash_expenditures"
        );

        // mandatoryDebtServiceToCashExpenditure
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "mandatoryDebtServiceToCashExpenditure_Client",
          record,
          "cfhi_compre_17_2_ratio___mandatory_debt_to_total_cash_expenditures",
          "cfhi_compre_17_2_bench_rating___mandatory_debt_to_total_cash_expenditures"
        );

        // personnelIncludingToTotalCashExpenditures
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "personnelIncludingToTotalCashExpenditures_Client",
          record,
          "cfhi_compre_17_3_ratio___mandatory_debt_and_personnel_to_total_cash_expenditures",
          "cfhi_compre_17_3_bench_rating___mandatory_debt_and_personnel_to_total_cash_expenditures"
        );

        // localOutreachExpenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "localOutreachExpenses_Client",
          record,
          "cfhi_compre_18a_ratio___local_outreach_to_total_cash_expend"
        );

        // globalOutreachExpenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "globalOutreachExpenses_Client",
          record,
          "cfhi_compre_18b_ratio___global_outreach_to_total_cash_expend"
        );

        // totalGlobalAndLocalOutreachExpenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "totalGlobalAndLocalOutreachExpenses_Client",
          record,
          "cfhi_compre_18c_ratio___total_outreach_to_total_cash_expend",
          "cfhi_compre_18c_bench_rating___total_outreach_to_total_cash_expend"
        );

        // cashExpendituresPerAvgAdultAttendee
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "cashExpendituresPerAvgAdultAttendee_Client",
          record,
          "cfhi_compre_19a_ratio___cash_exp_per_average_adult"
        );

        // cashExpendituresPerAvgAdultAttendee_percentChange
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "cashExpendituresPerAvgAdultAttendee_percentChange_Client",
          record,
          "cfhi_compre_19a_ratio_change___cash_exp_per_average_adult"
        );

        // cashExpendituresPerGivingUnit
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "cashExpendituresPerGivingUnit_Client",
          record,
          "cfhi_compre_19b_ratio___cash_exp_per_giving_unit"
        );

        // cashExpendituresPerGivingUnit_percentChange
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "cashExpendituresPerGivingUnit_percentChange_Client",
          record,
          "cfhi_compre_19b_ratio_change___cash_exp_per_giving_unit"
        );
      });
    });
  }

  processAdditionalData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // contributionsPerAccountingFTE [s40, s152, s153, s158, s159, s160, s94]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "contributionsPerAccountingFTE_Peer",
          record,
          "cfhi_compre_20_ratio___contributions_per_acct_fte",
          "cfhi_compre_20_yes_no___contributions_per_acct_fte"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalContributions",
          record,
          "s40___total_contribution",
          "cfhi_compre_20_yes_no___contributions_per_acct_fte",
          "contributionsPerAccountingFTE"
        );
        // s44 - Revenue from pledge - REMOVED per updated calculation
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "largeOneTimeGiftWithoutDonor",
          record,
          "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
          "cfhi_compre_20_yes_no___contributions_per_acct_fte",
          "contributionsPerAccountingFTE"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "largeOneTimeGiftWithDonor",
          record,
          "s153___large_one_time_gift_with_donor_restriction__non_recurring_",
          "cfhi_compre_20_yes_no___contributions_per_acct_fte",
          "contributionsPerAccountingFTE"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "averageAnnualAccountingDepartment",
          record,
          "s158___average_annual_accounting_department_full_time_employee",
          "cfhi_compre_20_yes_no___contributions_per_acct_fte",
          "contributionsPerAccountingFTE"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "accountingDepartmentPartTimeEmployee",
          record,
          "s159___accounting_department_part_time_employee",
          "cfhi_compre_20_yes_no___contributions_per_acct_fte",
          "contributionsPerAccountingFTE"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "accountingDepartmentVolunteer",
          record,
          "s160___accounting_department_volunteer",
          "cfhi_compre_20_yes_no___contributions_per_acct_fte",
          "contributionsPerAccountingFTE"
        );

        // TODO: Add s94 field when available in Quickbase
        // this.dataStore.insertData(
        //   "additional",
        //   "peer",
        //   year,
        //   "accountingDeptOutsourcedLabor",
        //   record,
        //   "s94___accounting_dept_outsourced_labor", // Field name to be confirmed
        //   "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        //   "contributionsPerAccountingFTE"
        // );

        // expensesPerAccountingFTE [s45, s158, s159, s160, s94]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "expensesPerAccountingFTE_Peer",
          record,
          "cfhi_compre_21_ratio___expenses_per_acct_fte",
          "cfhi_compre_21_yes_no___expenses_per_acct_fte"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_21_yes_no___expenses_per_acct_fte",
          "expensesPerAccountingFTE"
        );
        // s167 - Amortization of finance lease - REMOVED per updated calculation
        // s168 - Interest on finance lease - REMOVED per updated calculation
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "averageAnnualAccountingDepartment",
          record,
          "s158___average_annual_accounting_department_full_time_employee",
          "cfhi_compre_21_yes_no___expenses_per_acct_fte",
          "expensesPerAccountingFTE"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "accountingDepartmentPartTimeEmployee",
          record,
          "s159___accounting_department_part_time_employee",
          "cfhi_compre_21_yes_no___expenses_per_acct_fte",
          "expensesPerAccountingFTE"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "accountingDepartmentVolunteer",
          record,
          "s160___accounting_department_volunteer",
          "cfhi_compre_21_yes_no___expenses_per_acct_fte",
          "expensesPerAccountingFTE"
        );

        // TODO: Add s94 field when available in Quickbase
        // this.dataStore.insertData(
        //   "additional",
        //   "peer",
        //   year,
        //   "accountingDeptOutsourcedLabor",
        //   record,
        //   "s94___accounting_dept_outsourced_labor", // Field name to be confirmed
        //   "cfhi_compre_21_yes_no___expenses_per_acct_fte",
        //   "expensesPerAccountingFTE"
        // );

        // facilitiesExpenseToTotalCashExpenditures_lessThanTen [s12, s160, s45, s167, s168, s154, s166, s46]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen_Peer",
          record,
          "cfhi_compre_22a_ratio___facilties_to_total_cash_exp_less_than_10",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalMaintenanceOccupancyCost",
          record,
          "s12___total_maint___occupancy_cost",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "accountingDepartmentVolunteer",
          record,
          "s160___accounting_department_volunteer",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
        );

        // facilitiesExpenseToTotalCashExpenditures_greaterThanTen [s12, s45, s167, s168, s154, s166, s46]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen_Peer",
          record,
          "cfhi_compre_22b_ratio___facilties_to_total_cash_exp_more_than_10",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalMaintenanceOccupancyCost",
          record,
          "s12___total_maint___occupancy_cost",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalExpense",
          record,
          "s45___total_expense",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "amortizationFinanceLease",
          record,
          "s167___amortization_of_finance_lease_right_of_use_asset",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalDepreciationExpense",
          record,
          "s46___total_depreciation_expense",
          "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
        );

        // facilityCostPerSquareFootExcluding_lessThanTen [s12, s08]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "facilityCostPerSquareFootExcluding_lessThanTen_Peer",
          record,
          "cfhi_compre_23a_ratio___facility_cost_squarefoot_no_interest_less_than_10",
          "cfhi_compre_23a_yes_no___facility_cost_squarefoot_no_interest_less_than_10"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalMaintenanceOccupancyCost",
          record,
          "s12___total_maint___occupancy_cost",
          "cfhi_compre_23a_yes_no___facility_cost_squarefoot_no_interest_less_than_10",
          "facilityCostPerSquareFootExcluding_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalFacilitySquareFootage",
          record,
          "s08___total_facility_square_footage",
          "cfhi_compre_23a_yes_no___facility_cost_squarefoot_no_interest_less_than_10",
          "facilityCostPerSquareFootExcluding_lessThanTen"
        );

        // facilityCostPerSquareFootExcluding_greaterThanTen [s12, s08]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "facilityCostPerSquareFootExcluding_greaterThanTen_Peer",
          record,
          "cfhi_compre_23b_ratio___facility_cost_squarefoot_no_interest_more_than_10",
          "cfhi_compre_23b_yes_no___facility_cost_squarefoot_no_interest_more_than_10"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalMaintenanceOccupancyCost",
          record,
          "s12___total_maint___occupancy_cost",
          "cfhi_compre_23b_yes_no___facility_cost_squarefoot_no_interest_more_than_10",
          "facilityCostPerSquareFootExcluding_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalFacilitySquareFootage",
          record,
          "s08___total_facility_square_footage",
          "cfhi_compre_23b_yes_no___facility_cost_squarefoot_no_interest_more_than_10",
          "facilityCostPerSquareFootExcluding_greaterThanTen"
        );

        // facilityCostPerSquareFootIncluding_lessThanTen [s12, s47, s168, s154, s166, s08]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "facilityCostPerSquareFootIncluding_lessThanTen_Peer",
          record,
          "cfhi_compre_24a_ratio___facility_cost_squarefoot_with_interest_less_than_10",
          "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalMaintenanceOccupancyCost",
          record,
          "s12___total_maint___occupancy_cost",
          "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
          "facilityCostPerSquareFootIncluding_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "cyInterestExpense",
          record,
          "s47___cy_interest_expense",
          "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
          "facilityCostPerSquareFootIncluding_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
          "facilityCostPerSquareFootIncluding_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
          "facilityCostPerSquareFootIncluding_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
          "facilityCostPerSquareFootIncluding_lessThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalFacilitySquareFootage",
          record,
          "s08___total_facility_square_footage",
          "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
          "facilityCostPerSquareFootIncluding_lessThanTen"
        );

        // facilityCostPerSquareFootIncluding_greaterThanTen [s12, s47, s168, s154, s166, s08]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "facilityCostPerSquareFootIncluding_greaterThanTen_Peer",
          record,
          "cfhi_compre_24b_ratio___facility_cost_squarefoot_with_interest_more_than_10",
          "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalMaintenanceOccupancyCost",
          record,
          "s12___total_maint___occupancy_cost",
          "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
          "facilityCostPerSquareFootIncluding_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "cyInterestExpense",
          record,
          "s47___cy_interest_expense",
          "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
          "facilityCostPerSquareFootIncluding_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "internetOnFinanceLease",
          record,
          "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
          "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
          "facilityCostPerSquareFootIncluding_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "requiredMinimumDebtPrinciple",
          record,
          "s154___required_minimum_debt_principal_payment_for_the_next_year_",
          "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
          "facilityCostPerSquareFootIncluding_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "futureMinimumLeasePayment",
          record,
          "s166___future_minimum_lease_payment",
          "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
          "facilityCostPerSquareFootIncluding_greaterThanTen"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "totalFacilitySquareFootage",
          record,
          "s08___total_facility_square_footage",
          "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
          "facilityCostPerSquareFootIncluding_greaterThanTen"
        );

        // informationTechnologyCostPerFTE [s13, s151]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "informationTechnologyCostPerFTE_Peer",
          record,
          "cfhi_compre_25_ratio___it_cost_per_fte",
          "cfhi_compre_25_yes_no___it_cost_per_fte"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "itCost",
          record,
          "s13___it_cost",
          "cfhi_compre_25_yes_no___it_cost_per_fte",
          "informationTechnologyCostPerFTE"
        );
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "fullTimeEquivalent",
          record,
          "s151___church_only_full_time_equivalent_excluding_childcare_worker",
          "cfhi_compre_25_yes_no___it_cost_per_fte",
          "informationTechnologyCostPerFTE"
        );

        // designatedGiftsToTotalGifts [s325, s40]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "designatedGiftsToTotalGifts_Peer",
          record,
          "cfhi_compre_26_ratio___designated_gifts_to_total_gifts",
          "cfhi_compre_26_yes_no___designated_gifts_to_total_gifts"
        );

        // currentAssetsToCurrentLiabilities [s164, s154, s18, s20, s26, s166, s27, s28]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "currentAssetsToCurrentLiabilities_Peer",
          record,
          "cfhi_compre_27_ratio___current_assets_to_current_liabilities",
          "cfhi_compre_27_yes_no___current_assets_to_current_liabilities"
        );

        // netAssetsToTotalAssets [s34, s35, s26, s166, s27, s28, s29, s31]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "netAssetsToTotalAssets_Peer",
          record,
          "cfhi_compre_28_ratio___net_assets_to_total_assets",
          "cfhi_compre_28_yes_no___net_assets_to_total_assets"
        );

        // auditingCosts [s156]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "auditingCosts_Peer",
          record,
          "s156___audit_cost",
          "cfhi_compre_29_yes_no___audit_cost"
        );

        // capitalCampaignPledges [s336]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "capitalCampaignPledges_Peer",
          record,
          "s336___capital_campaign_pledges",
          "cfhi_compre_30_yes_no___capital_campaign_pledges"
        );

        // yearsOfBusinessLicense [s162]
        this.dataStore.insertData(
          "additional",
          "peer",
          year,
          "yearsOfBusinessLicense_Peer",
          record,
          "s162___years_of_business_license",
          "cfhi_compre_31_yes_no___years_of_business_license"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // contributionsPerAccountingFTE
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "contributionsPerAccountingFTE_Client",
          record,
          "cfhi_compre_20_ratio___contributions_per_accounting_fte"
        );

        // expensesPerAccountingFTE
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "expensesPerAccountingFTE_Client",
          record,
          "cfhi_compre_21_ratio___expenses_per_accounting_fte"
        );

        // facilitiesExpenseToTotalCashExpenditures_lessThanTen
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "facilitiesExpenseToTotalCashExpenditures_lessThanTen_Client",
          record,
          "cfhi_compre_22_value_under10___facilities_expenses_of_total_cash_expend",
          "cfhi_compre_22_rating_under10___facilities_expenses_of_total_cash_expend"
        );

        // facilitiesExpenseToTotalCashExpenditures_greaterThanTen
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "facilitiesExpenseToTotalCashExpenditures_greaterThanTen_Client",
          record,
          "cfhi_compre_22_value_over10___facilities_expenses_of_total_cash_expend",
          "cfhi_compre_22_rating_over10___facilities_expenses_of_total_cash_expend"
        );

        // facilityCostPerSquareFootExcluding_lessThanTen
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "facilityCostPerSquareFootExcluding_lessThanTen_Client",
          record,
          "cfhi_compre_23_value_under10___facility_cost_per_square_foot__excluding_interest_expense_"
        );

        // facilityCostPerSquareFootExcluding_greaterThanTen
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "facilityCostPerSquareFootExcluding_greaterThanTen_Client",
          record,
          "cfhi_compre_23_value_over10___facility_cost_per_square_foot__excluding_interest_expense_"
        );

        // facilityCostPerSquareFootIncluding_lessThanTen
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "facilityCostPerSquareFootIncluding_lessThanTen_Client",
          record,
          "cfhi_compre_24_value_under10___facility_cost_per_square_foot__including_principal_and_interest_expense_"
        );

        // facilityCostPerSquareFootIncluding_greaterThanTen
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "facilityCostPerSquareFootIncluding_greaterThanTen_Client",
          record,
          "cfhi_compre_24_value_over10___facility_cost_per_square_foot__including_principal_and_interest_expense_"
        );

        // informationTechnologyCostPerFTE
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "informationTechnologyCostPerFTE_Client",
          record,
          "cfhi_compre_25_ratio___information_technology_cost_per_fte"
        );

        // designatedGiftsToTotalGifts
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "designatedGiftsToTotalGifts_Client",
          record,
          "cfhi_compre_26_ratio___designated_gifts_to_total_gifts"
        );

        // currentAssetsToCurrentLiabilities
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "currentAssetsToCurrentLiabilities_Client",
          record,
          "cfhi_compre_27_ratio___current_assets_to_current_liabilities"
        );

        // netAssetsToTotalAssets
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "netAssetsToTotalAssets_Client",
          record,
          "cfhi_compre_28_ratio___net_assets_to_total_assets"
        );

        // auditingCosts
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "auditingCosts_Client",
          record,
          "s156___audit_cost"
        );

        // capitalCampaignPledges
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "capitalCampaignPledges_Client",
          record,
          "s336___capital_campaign_pledges"
        );

        // yearsOfBusinessLicense
        this.dataStore.insertData(
          "additional",
          "client",
          year,
          "yearsOfBusinessLicense_Client",
          record,
          "s162___years_of_business_license"
        );
      });
    });
  }
}

// API Service Class - Added from apiTest.js
class ApiService {
  constructor() {
    this.baseUrl = "https://qbcapitalmanagement.quickbase.com";
    this.userToken = "bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje";
    this.appId = "bsnm4tgde";
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
  }

  // Get records for peer organizations with filtering
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
        // console.log("PEER XML", xmlDoc);
        const records = xmlDoc.querySelectorAll("record");
        // console.log("getRecordsForPeer", records);
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
      // console.log("PEERQUERY - window.selectedClients_Array ", window.selectedClients_Array);

      const clientQuery = this.getClientQuery(window.selectedClients_Array);

      // console.log("PEERQUERY - clientQuery ", clientQuery);

      // console.log("PEERQUERY - clientQuery ", {
      //   clientQuery,
      //   currentYear,
      //   selectedClients_ArrayWindow: window.selectedClients_Array
      // });

      // Basic query condition with year and client query
      let queryCondition = `{195.EX.${currentYear}} AND ${clientQuery}`;
      // console.log(`Using query condition: ${queryCondition}`);

      // Add giving units filter
      if (
        window.sliderValue !== undefined &&
        window.sliderValue2 !== undefined
      ) {
        queryCondition += ` AND {123.GTE.${window.sliderValue}} AND {123.LTE.${window.sliderValue2}}`;
      }

      // Add regions filter
      if (
        window.selectedRegions_Array &&
        window.selectedRegions_Array.length > 0
      ) {
        const regionConditions = window.selectedRegions_Array
          .map((region) => `{267.EX.${region}}`)
          .join(" OR ");
        queryCondition += ` AND (${regionConditions})`;
      }

      // Add sites filter
      if (window.selectedSites_Array && window.selectedSites_Array.length > 0) {
        const siteConditions = window.selectedSites_Array
          .map((site) => `{268.EX.${site}}`)
          .join(" OR ");
        queryCondition += ` AND (${siteConditions})`;
      }

      const apiCallPeerData = {
        act: "API_DoQuery",
        query: queryCondition,
        clist:
          "195.123.122.135.136.226.160.137.161.176.354.170.129.174.252.253.254.255.256.257.258.259.260.261.262.263.264.265.405.239.156.158.149.142.143.153.155.164.162.132.131.141.140.171.172.173.157.181.182.165.179.145.147.169.138.168.139.180.177.152.150.151.154.166.167.163.175.178.133.227.228.229.230.231.232.233.234.235.144.146.159.148.236.237.238.239.240.241.242.243.244.245.246.247.248.249.250.251.267.268.271.274.273.276.277.278.279.280.281.282.283.134.284.286.287.288.289.290.291.324.325.326.327.328.352.329.353.330.331.332.333.334.335.406.240.167.181.356.162.241.137.122.357.242.123.358.243.161.163.138.359.244.361.245.365.273.136.363.274.364.249.366.170.367.250.164.181.182.139.180.165.368.251.166.369.271.175.370.277.142.371.278.140.372.279.141.373.280.374.281.375.282.173.376.283.377.284.133.378.286.379.287.129.380.288.381.289.382.290.383.291.178",
      };

      // Use await to make the async operation more explicit
      const xml = await $.get(peerData, apiCallPeerData);
      // console.log("PEER XML", xml);
      const recordsForPeer = $("record", xml).toArray();
      // console.log("recordsForPeer", recordsForPeer);
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
      // console.log(`Continuing to next year after error...`);
      return await this.getRecordsForPeer(years.slice(1), dataStr);
    }
  }

  // Get records for client organizations
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
        // console.log("Client XML", xmlDoc);
        const records = xmlDoc.querySelectorAll("record");

        // console.log(`Parsed ${records.length} client records from collected data`);
        return records;
      } catch (error) {
        console.error("Error parsing client XML:", error);
        return [];
      }
    }

    const currentYear = years[0];
    const apiCallClientData = {
      act: "API_DoQuery",
      query: `
      {98.EX.${ClientRid}} AND {105.EX.'Comprehensive'} AND {474.EX.${currentYear}} 
    `,
      clist:
        "452.98.474.22.21.34.35.259.300.301.60.302.69.28.73.257.258.260.261.263.303.304.264.262.265.266.280.267.281.268.269.270.271.272.273.275.278.277.276.279.242.243.244.305.306.245.307.308.309.310.246.311.312.313.274.389.390.391.392.393.230.282.283.286.285.284.75.399.401.402.403.404.405.406.407.408.409.317.318.321.327.329.330.333.335.339.341.342.345.377.379.256.255.254.253.252.33.288.445.446.447.448.449.294.295.296.297.298.299.437.444.438.443.439.440.442.441.313.410.316.319.320.326.328.331.332.334.338.340.343.346.378.381.383.380.251.250.249.248.247.213.216.220.223.236",
    };

    try {
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

      // console.log("recordClientHTMLArray", this.recordClientHTMLArray);

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

  async getRecordsForUniqueClientPeerNames() {
    const apiCallPeerData = {
      act: "API_DoQuery",
      clist: "195.301.123.267.268.186.3",
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
          "client___merged_client_name"
        )?.textContent;

        if (clientName) {
          uniquePeerClientNames.add(clientName);

          // Store client data with all required fields
          if (!window.clientDataStore[clientName]) {
            // Get fiscal year
            const year = record.querySelector("year")?.textContent;

            // Get mission unit value
            const givingUnitVal =
              record.querySelector("s02___giving_units")?.textContent || "0";

            // Get region value
            const regionVal =
              record.querySelector("main_queryregions")?.textContent || "0";

            // Get statevalue
            const siteVal =
              record.querySelector("main_querymultisite")?.textContent || "0";

            // Store all client data
            window.clientDataStore[clientName] = {
              name: clientName,
              year: year,
              givingUnitVal: parseFloat(givingUnitVal) || 0,
              region: regionVal,
              site: siteVal,
            };
          }

          // Add record's outerHTML to the XML string
          xmlString += record.outerHTML;
        }
      });

      // Close the XML string
      xmlString += "</qdbapi>";

      // Print the XML string to console
      // console.log(
      //   "xmlString getRecordsForUniqueClientPeerNames()",
      //   xmlString
      // );

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
      if (sortedUniquePeerClientNames.length > 0) {
        this._initializeFilterHandlers();
      } else {
        console.log(
          "No client data loaded, skipping filter handler initialization"
        );
      }

      window.sortedUniquePeerClientNames = sortedUniquePeerClientNames;

      return sortedUniquePeerClientNames;
    } catch (error) {
      console.error("Error fetching unique client names:", error);
      return [];
    }
  }

  // Initialize filter event handlers
  _initializeFilterHandlers() {
    // Handle changes to any filter
    const handleFilterChange = () => this._handleFiltersChanged();

    // Note: Client selection is handled by custom dropdown checkboxes in options-list-client
    // The checkboxes have their own event listeners that update window.selectedClients_Array

    // Region selection
    const regionSelect = document.getElementById("regionSelect");
    if (regionSelect) {
      regionSelect.addEventListener("change", handleFilterChange);
    }

    // Site selection
    const siteSelect = document.getElementById("siteSelect");
    if (siteSelect) {
      siteSelect.addEventListener("change", handleFilterChange);
    }

    // Slider controls
    const slider1 = document.getElementById("slider1");
    const slider2 = document.getElementById("slider2");
    if (slider1) {
      slider1.addEventListener("input", handleFilterChange);
    }
    if (slider2) {
      slider2.addEventListener("input", handleFilterChange);
    }
  }

  // Handle filter changes
  _handleFiltersChanged() {
    // Update global variables based on current filter state
    const regionSelect = document.getElementById("regionSelect");
    const siteSelect = document.getElementById("siteSelect");
    const slider1 = document.getElementById("slider1");
    const slider2 = document.getElementById("slider2");

    if (regionSelect) {
      window.selectedRegions_Array = Array.from(
        regionSelect.selectedOptions
      ).map((option) => option.value);
    }
    if (siteSelect) {
      window.selectedSites_Array = Array.from(siteSelect.selectedOptions).map(
        (option) => option.value
      );
    }
    if (slider1) {
      window.sliderValue = parseInt(slider1.value);
    }
    if (slider2) {
      window.sliderValue2 = parseInt(slider2.value);
    }

    this._triggerFiltersChanged();
  }

  // Client selection is handled by custom dropdown checkboxes
  // The checkboxes update window.selectedClients_Array directly through their event listeners
  // No additional update method needed here

  // Trigger filter change event
  _triggerFiltersChanged() {
    // Dispatch custom event for filter changes
    const event = new CustomEvent("filtersChanged", {
      detail: {
        clients: window.selectedClients_Array,
        regions: window.selectedRegions_Array,
        sites: window.selectedSites_Array,
        slider1: window.sliderValue,
        slider2: window.sliderValue2,
      },
    });
    document.dispatchEvent(event);
  }

  // Populate clients dropdown fallback
  _populateClientsDropdownFallback(clientArray) {
    const clientSelect = document.getElementById("clientSelect");
    if (!clientSelect) return;

    clientSelect.innerHTML = "";

    clientArray.forEach((client) => {
      const option = document.createElement("option");
      option.value = client;
      option.textContent = client;
      clientSelect.appendChild(option);
    });
  }

  // Get client query for filtering
  getClientQuery(selectedClientsSet) {
    if (!selectedClientsSet || selectedClientsSet.size === 0) {
      return "";
    }

    const clientQueries = Array.from(selectedClientsSet).map(
      (client) => `{301.EX.'${this._escapeClientName(client)}'}`
    );

    return `(${clientQueries.join(" OR ")})`;
  }

  // New method to handle batched client queries for large client sets
  async getRecordsForPeerWithBatching(
    years,
    selectedClientsSet,
    dataStr = "<qdbapi>"
  ) {
    // Initialize record arrays if they don't exist
    if (!this.recordPeerHTMLArray) {
      this.recordPeerHTMLArray = [];
    }

    const selectedClients = Array.from(selectedClientsSet);

    // If 15 or fewer clients, use the original method
    if (selectedClients.length <= 15) {
      return await this.getRecordsForPeer(years, dataStr);
    }

    // Pre-calculate all filter conditions once
    const filterParts = [];
    if (window.sliderValue !== undefined && window.sliderValue2 !== undefined) {
      filterParts.push(`{123.GTE.${window.sliderValue}} AND {123.LTE.${window.sliderValue2}}`);
    }
    if (window.selectedRegions_Array?.length > 0) {
      const regionConditions = window.selectedRegions_Array
        .map(region => `{267.EX.${region}}`)
        .join(" OR ");
      filterParts.push(`(${regionConditions})`);
    }
    if (window.selectedSites_Array?.length > 0) {
      const siteConditions = window.selectedSites_Array
        .map(site => `{268.EX.${site}}`)
        .join(" OR ");
      filterParts.push(`(${siteConditions})`);
    }
    const additionalFilters = filterParts.length > 0 ? ` AND ${filterParts.join(" AND ")}` : "";

    // Pre-escape all client names once
    const escapedClients = selectedClients.map(client => this._escapeClientName(client));

    // Split clients into batches of 80
    const BATCH_SIZE = 80;
    const clientBatches = [];
    for (let i = 0; i < escapedClients.length; i += BATCH_SIZE) {
      clientBatches.push(escapedClients.slice(i, i + BATCH_SIZE));
    }

    // Create all API calls for parallel execution
    const apiCalls = [];
    const clist = "195.123.122.135.136.226.160.137.161.176.354.170.129.174.252.253.254.255.256.257.258.259.260.261.262.263.264.265.405.239.156.158.149.142.143.153.155.164.162.132.131.141.140.171.172.173.157.181.182.165.179.145.147.169.138.168.139.180.177.152.150.151.154.166.167.163.175.178.133.227.228.229.230.231.232.233.234.235.144.146.159.148.236.237.238.239.240.241.242.243.244.245.246.247.248.249.250.251.267.268.271.274.273.276.277.278.279.280.281.282.283.134.284.286.287.288.289.290.291.324.325.326.327.328.352.329.353.330.331.332.333.334.335.406.240.167.181.356.162.241.137.122.357.242.123.358.243.161.163.138.359.244.361.245.365.273.136.363.274.364.249.366.170.367.250.164.181.182.139.180.165.368.251.166.369.271.175.370.277.142.371.278.140.372.279.141.373.280.374.281.375.282.173.376.283.377.284.133.378.286.379.287.129.380.288.381.289.382.290.383.291.178.301";

    for (const currentYear of years) {
      for (const clientBatch of clientBatches) {
        const clientConditions = clientBatch
          .map(client => `{301.EX.'${client}'}`)
          .join(" OR ");
        const queryCondition = `{195.EX.${currentYear}} AND (${clientConditions})${additionalFilters}`;
        
        const apiCallPeerData = {
          act: "API_DoQuery",
          query: queryCondition,
          clist: clist
        };
        
        apiCalls.push($.get(peerData, apiCallPeerData));
      }
    }

    // Execute all API calls in parallel with limited concurrency
    const CONCURRENCY_LIMIT = 5; // Limit concurrent requests to avoid overwhelming server
    const results = [];
    
    for (let i = 0; i < apiCalls.length; i += CONCURRENCY_LIMIT) {
      const batch = apiCalls.slice(i, i + CONCURRENCY_LIMIT);
      try {
        const batchResults = await Promise.allSettled(batch);
        results.push(...batchResults);
        
        // Small delay between batches to be API-friendly
        if (i + CONCURRENCY_LIMIT < apiCalls.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error("Error in batch execution:", error);
      }
    }

    // Process all results efficiently
    const recordHtmlParts = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        try {
          const xml = result.value;
          // Use jQuery once per response, then process natively
          const $records = $("record", xml);
          
          // Process records using native DOM for better performance
          for (let i = 0; i < $records.length; i++) {
            const recordHtml = $records[i].outerHTML;
            recordHtmlParts.push(recordHtml);
            this.recordPeerHTMLArray.push(recordHtml);
          }
        } catch (error) {
          console.error("Error processing XML result:", error);
        }
      }
    }

    // Parse and return final results
    try {
      if (recordHtmlParts.length === 0) {
        console.warn("No records collected, returning empty array");
        return [];
      }

      const finalXmlString = dataStr + recordHtmlParts.join("") + "</qdbapi>";
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(finalXmlString, "text/xml");
      const records = xmlDoc.querySelectorAll("record");
      return records;
    } catch (error) {
      console.error("Error parsing XML in batched approach:", error);
      return [];
    }
  }

  // Escape client name for query
  _escapeClientName(clientName) {
    return clientName.replace(/'/g, "\\'");
  }

  // Get peer XML string helper
  getPeerXmlString() {
    return "<qdbapi>";
  }

  // Get client XML string helper
  getClientXmlString() {
    return "<qdbapi>";
  }

  // Clear records helper
  clearRecords() {
    this.recordClientHTMLArray = [];
    this.recordPeerHTMLArray = [];
    console.log("Records cleared");
  }

  // Add a fallback method - Added to match apiTest.js functionality
  _updateClientSelection() {
    // Check if clientDataStore is available before proceeding
    if (!window.clientDataStore) {
      console.log(
        "Client data store not available for client selection update"
      );
      return;
    }

    // Get current filter values
    const minGivingUnits = window.sliderValue || 0;
    const maxGivingUnits = window.sliderValue2 || 25000;
    const selectedRegions = Array.from(window.selectedRegions_Array || []);
    const selectedSites = Array.from(window.selectedSites_Array || []);

    // Get all client checkboxes
    const clientCheckboxes = document.querySelectorAll(
      '#options-list-client input[type="checkbox"]'
    );

    // Clear the selected clients array to rebuild from scratch
    window.selectedClients_Array.clear();
    let matchCount = 0;

    // Process each client checkbox (skip the select all checkbox)
    clientCheckboxes.forEach((checkbox) => {
      if (checkbox.id === "select-all-checkbox-client") return;

      const clientName = checkbox.value;
      const clientData = window.clientDataStore[clientName];

      if (!clientData) {
        console.warn(`No data found for client: ${clientName}`);
        checkbox.checked = false;
        return;
      }

      // Check if client matches filter criteria (using givingUnitVal to match Header.js)
      const givingUnitsMatch =
        clientData.givingUnitVal >= minGivingUnits &&
        clientData.givingUnitVal <= maxGivingUnits;
      const regionMatch =
        selectedRegions.length === 0 ||
        selectedRegions.includes(clientData.region);
      const siteMatch =
        selectedSites.length === 0 || selectedSites.includes(clientData.site);

      const matches = givingUnitsMatch && regionMatch && siteMatch;

      // Update checkbox and selection array
      checkbox.checked = matches;

      if (matches) {
        window.selectedClients_Array.add(clientName);
        matchCount++;
      }
    });

    console.log(
      `Filter completed: ${matchCount} clients match current filters`
    );
  }
}

// Application Controller Class - Added from apiTest.js
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
      // console.log("AppController already initialized");
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

    const sitesListElement = document.getElementById("options-list-site");
    if (
      sitesListElement &&
      (!sitesListElement.children.length ||
        sitesListElement.children.length <= 1)
    ) {
      addUniqueSitesToOptionsSelectSitesDropdown(sites_Array);
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

  // Create empty chart placeholder
  async createEmptyChart(chart, title) {
    try {
      if (chart && typeof chart.destroy === "function") {
        chart.destroy();
      }

      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 200;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#6c757d";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${title} - No Data Available`,
        canvas.width / 2,
        canvas.height / 2
      );

      return canvas;
    } catch (error) {
      console.error("Error creating empty chart:", error);
      return null;
    }
  }

  // Validate data for charts
  async _validateDataForCharts() {
    try {
      // Check localStorage for required data categories
      const categories = [
        "demoData",
        "cashData",
        "debtData",
        "incomeData",
        "expenseData",
        "additionalData",
      ];

      let hasAnyData = false;

      for (const category of categories) {
        const data = localStorage.getItem(category);
        if (!data || data === "{}") {
          console.warn(`Missing or empty data for category: ${category}`);
          continue;
        }

        // Try to parse the data to make sure it's valid JSON
        try {
          const parsedData = JSON.parse(data);
          if (Object.keys(parsedData).length > 0) {
            hasAnyData = true;
          }
        } catch (e) {
          console.error(`Error parsing ${category}: ${e}`);
        }
      }

      return hasAnyData;
    } catch (error) {
      console.error("Error validating chart data:", error);
      return false;
    }
  }

  // Update checkForAnyData helper method with async/await
  async _checkForAnyData(pattern) {
    // Check all data categories used in this application
    const categories = [
      "demoData",
      "cashData",
      "debtData",
      "incomeData",
      "expenseData",
      "additionalData",
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

  // Handle run button click
  async handleRunButtonClick() {
    // console.log("handleRunButtonClick() called");

    try {
      // Show loading indicator
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("open", "api");
      }

      // Process selected years
      let selectedYears;
      try {
        selectedYears = this.processSelectedYears();
      } catch (error) {
        console.error("Error processing selected years:", error);
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      this.saveSelectedYearsToLocalStorage(selectedYears);

      // Check for selected clients
      if (
        !window.selectedClients_Array ||
        window.selectedClients_Array.size === 0
      ) {
        console.warn("No clients selected");
        if (typeof createToastWarning === "function") {
          createToastWarning("Please select at least one client");
        } else {
          alert("Please select at least one client");
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      // Log selected data for debugging
      // console.log("Selected years:", selectedYears);
      // console.log(
      //   "Selected clients:",
      //   Array.from(window.selectedClients_Array)
      // );
      // console.log(
      //   "Selected regions:",
      //   Array.from(window.selectedRegions_Array || [])
      // );
      // console.log(
      //   "Selected sites:",
      //   Array.from(window.selectedSites_Array || [])
      // );

      // Clear existing data
      if (this.dataStore && typeof this.dataStore.clear === "function") {
        this.dataStore.clear();
      }

      if (this && typeof this.clearRecords === "function") {
        this.clearRecords();
      }

      // Fetch peer data with improved error handling
      let recordsPeer;
      try {
        // Use batched approach if more than 15 clients are selected
        const selectedClientsCount = window.selectedClients_Array
          ? window.selectedClients_Array.size
          : 0;

        if (selectedClientsCount > 15) {
          console.log(
            `Using batched approach for ${selectedClientsCount} clients`
          );
          recordsPeer = await this.apiService.getRecordsForPeerWithBatching(
            selectedYears,
            window.selectedClients_Array
          );

          // console.log("recordsPeer", recordsPeer);
        } else {
          recordsPeer = await this.apiService.getRecordsForPeer(selectedYears);
        }

        // Validate records
        if (!recordsPeer || recordsPeer.length === 0) {
          console.warn("No peer records returned");
          if (typeof createToastWarning === "function") {
            createToastWarning(
              "No peer records extracted. Please select more filters"
            );
          } else {
            alert("No peer records extracted. Please select more filters");
          }
          if (typeof showApiLoadingFunction === "function") {
            showApiLoadingFunction("close");
          }
          return; // Stop the whole process here
        } else {
          // Process peer records
          recordsPeer = await validateAndNormalizeRecords(recordsPeer);
          // console.log(`Normalized ${recordsPeer.length} peer records`);
          window.recordsPeer = recordsPeer;
          countUniqueClients(recordsPeer);
        }
      } catch (error) {
        console.error("Error fetching peer data:", error);
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "Error fetching peer data. Please try again or adjust your filters."
          );
        } else {
          alert(
            "Error fetching peer data. Please try again or adjust your filters."
          );
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return; // Stop the process on error as well
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
          if (
            recordsClient.length > 0 &&
            recordsClient[recordsClient.length - 1]
          ) {
            const monthYearElement = recordsClient[
              recordsClient.length - 1
            ].querySelector("fiscal_ye_date_formatted_month");
            if (monthYearElement) {
              window.monthYearEnd = monthYearElement.textContent;
            }
          }
          // console.log(`Normalized ${recordsClient.length} client records`);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        if (typeof createToastWarning === "function") {
          createToastWarning("Error fetching client data. Please try again.");
        } else {
          alert("Error fetching client data. Please try again.");
        }
        // Continue anyway, we might have peer data
      }

      // Check if we have any data at all
      if (
        (!recordsPeer || recordsPeer.length === 0) &&
        (!recordsClient || recordsClient.length === 0)
      ) {
        console.error("No data available for either peer or client");
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "No data retrieved. Try selecting fewer clients or different years."
          );
        } else {
          alert(
            "No data retrieved. Try selecting fewer clients or different years."
          );
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
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
        if (typeof createToastWarning === "function") {
          createToastWarning("Error processing data. Please try again.");
        } else {
          alert("Error processing data. Please try again.");
        }
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        return;
      }

      // Validate data for charts
      const hasValidData = await this._validateDataForCharts();
      if (!hasValidData) {
        console.warn("No valid data for charts");
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
        // return;
      }

      // Display charts
      try {
        await this.displayAllComponents();
        
        // Enable the generate reports button after successful data loading and display
        this.enableGenerateReportsButton();
        
      } catch (error) {
        console.error("Error displaying components:", error);
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "Error displaying charts. Please check console for details."
          );
        } else {
          alert("Error displaying charts. Please check console for details.");
        }
      } finally {
        // Always hide loading indicator
        if (typeof showApiLoadingFunction === "function") {
          showApiLoadingFunction("close");
        }
      }
    } catch (err) {
      console.error("Unexpected error in handleRunButtonClick:", err);
      if (typeof createToastWarning === "function") {
        createToastWarning("An unexpected error occurred. Please try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      if (typeof showApiLoadingFunction === "function") {
        showApiLoadingFunction("close");
      }
    }
  }

  // Handle generate report button click
  handleGenerateReportClick() {
    const generateReportButton = document.getElementById(
      "generateReportButton"
    );

    try {
      toggleGenerateReportButtonNormalState(generateReportButton);

      // Generate report logic here
      console.log("Generating report...");

      // Reset button after operation
      setTimeout(() => {
        toggleButtonNormalState(generateReportButton);
      }, 2000);
    } catch (error) {
      console.error("Error generating report:", error);
      toggleButtonNormalState(generateReportButton);
    }
  }

  // Handle print presentation button click
  handlePrintPresentationClick() {
    const printPresentationButton = document.getElementById(
      "printPresentationButton"
    );

    try {
      togglePrintPresentationButtonNormalState(printPresentationButton);

      // Print presentation logic here
      console.log("Printing presentation...");
      window.print();

      // Reset button after operation
      setTimeout(() => {
        toggleButtonNormalState(printPresentationButton);
      }, 2000);
    } catch (error) {
      console.error("Error printing presentation:", error);
      toggleButtonNormalState(printPresentationButton);
    }
  }

  /**
   * Enable the Generate Reports button and set up event listeners
   */
  enableGenerateReportsButton() {
    console.log("enableGenerateReportsButton called");

    // Re-enable the generate reports button
    const generateReportsBtn = document.getElementById("generateReports");
    if (generateReportsBtn) {
      generateReportsBtn.disabled = false;

      // Use the existing toggle function if available
      if (typeof toggleGenerateReportButtonNormalState === "function") {
        toggleGenerateReportButtonNormalState(generateReportsBtn);
      } else {
        // Fallback for when the toggle function is not available
        generateReportsBtn.textContent = "Generate Trends and Benchmark Reports";
      }

      // Remove any existing listeners to prevent duplicates
      const newBtn = generateReportsBtn.cloneNode(true);
      generateReportsBtn.parentNode.replaceChild(newBtn, generateReportsBtn);

      // Ensure ExcelReportGenerator is available
      if (typeof ExcelReportGenerator === "function") {
        // Create a new instance or use the existing one
        if (!window.excelReportGenerator) {
          window.excelReportGenerator = new ExcelReportGenerator();
        }

        // Add a single click event listener
        newBtn.addEventListener(
          "click",
          window.excelReportGenerator.handleGenerateReport.bind(
            window.excelReportGenerator
          ),
          { once: true } // This ensures the event only fires once per click
        );

        // Expose functions globally for backward compatibility if not already done
        if (!window.createPrintExcel) {
          window.createPrintExcel =
            window.excelReportGenerator.createPrintExcel.bind(
              window.excelReportGenerator
            );
          window.uploadToFile = window.excelReportGenerator.uploadToFile.bind(
            window.excelReportGenerator
          );
          window.uploadSingleToFile =
            window.excelReportGenerator.uploadSingleToFile.bind(
              window.excelReportGenerator
            );
          window.printToExcel = window.excelReportGenerator.printToExcel.bind(
            window.excelReportGenerator
          );
        }
      } else {
        console.warn(
          "ExcelReportGenerator not available. Excel report functionality may be limited."
        );
      }
    }

    this.enablePrintModalHiddenClass();
  }

  /**
   * Enable print modal and hide footer initially
   */
  enablePrintModalHiddenClass() {
    console.log("enablePrintModalHiddenClass called");

    // Hide the print modal footer if it exists
    const printModalFooter = document.getElementById("print_modal_footer");
    if (printModalFooter) {
      printModalFooter.classList.add("hidden");
    }

    // Ensure print base64 functionality is initialized
    if (typeof initApexChartsPrintFunction === "function") {
      initApexChartsPrintFunction();
    }
  }

  // Process selected years
  processSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears) {
      if (typeof createToastWarning === "function") {
        createToastWarning(
          "Error retrieving selected years. Please reload the page and try again."
        );
      } else {
        alert(
          "Error retrieving selected years. Please reload the page and try again."
        );
      }
      throw new Error("Failed to retrieve selected years from localStorage");
    }

    if (!selectedYears.length) {
      if (typeof createToastWarning === "function") {
        createToastWarning(
          "Please select at least one year for data to appear"
        );
      } else {
        alert("Please select at least one year for data to appear");
      }
      throw new Error("No years selected");
    }

    if (selectedYears.length > 0) {
      this.saveSelectedYearsToLocalStorage(selectedYears);
    }

    return selectedYears;
  }

  // Save selected years to localStorage
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
  async displayAllComponents() {
    try {
      // Check if we have any valid data to display
      const hasData = await this._validateDataForCharts();

      if (!hasData) {
        console.warn(
          "No valid data available for charts. Showing error message to user."
        );
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "No data retrieved from API. Try adjusting your filters or selecting different years."
          );
        }
        return;
      }

      // Call all display component functions for this application
      if (typeof displayDemoComponent === "function") {
        displayDemoComponent();
      }
      if (typeof displayCashComponent === "function") {
        displayCashComponent();
      }
      if (typeof displayDebtComponent === "function") {
        displayDebtComponent();
      }
      if (typeof displayIncomeComponent === "function") {
        displayIncomeComponent();
      }
      if (typeof displayExpenseComponent === "function") {
        displayExpenseComponent();
      }
      if (typeof displayReportComponent === "function") {
        displayReportComponent();
      }

      // Signal that all components have been displayed
      const event = new CustomEvent("componentsDisplayed", {
        detail: {
          dataStore: this.dataStore,
        },
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error in displayAllComponents:", error);
      throw error;
    }
  }

  // Update validateDataForCharts method with async/await
  async _validateDataForCharts() {
    try {
      // Check if we have any peer or client data
      const peerDataExists = await this._checkForAnyData("*_Peer");
      const clientDataExists = await this._checkForAnyData("*_Client");

      if (!peerDataExists && !clientDataExists) {
        console.warn("No peer or client data found");
        if (typeof createToastWarning === "function") {
          createToastWarning(
            "No data retrieved. Try selecting fewer clients or different years."
          );
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating chart data:", error);
      return false;
    }
  }
}

// Restore initial client selection
function restoreInitialClientSelection() {
  try {
    const savedSelection = localStorage.getItem("selectedClients");
    if (savedSelection) {
      const clientArray = JSON.parse(savedSelection);
      window.selectedClients_Array = new Set(clientArray);

      // Update UI if client select exists
      const clientSelect = document.getElementById("clientSelect");
      if (clientSelect) {
        Array.from(clientSelect.options).forEach((option) => {
          option.selected = window.selectedClients_Array.has(option.value);
        });
      }
    }
  } catch (error) {
    console.error("Error restoring client selection:", error);
  }
}

// Count unique clients in records
function countUniqueClients(records) {
  // Check if records is valid and has a forEach method
  if (!records || typeof records.forEach !== "function") {
    console.error("Invalid records provided to countUniqueClients:", records);
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = "0";
    }
    return;
  }

  // Get the current filter state
  const selectedClients = window.selectedClients_Array
    ? Array.from(window.selectedClients_Array)
    : [];

  // Use a Set to track unique client names
  const uniqueClients = new Set();

  // Initialize uniqueClientsPerYearMap based on selected years
  window.uniqueClientsPerYearMap = {};

  const selectedYears = getSelectedYearsFromLocalStorage() || [];
  selectedYears.forEach((year) => {
    window.uniqueClientsPerYearMap[year] = new Set();
  });

  try {
    records.forEach((record) => {
      const clientName = record
        .querySelector("client___merged_client_name")
        ?.textContent?.trim();
      const year = record.querySelector("s52_formatted_year")?.textContent;

      // Only count clients that are in the selectedClients_Array
      if (clientName && selectedClients.includes(clientName)) {
        uniqueClients.add(clientName);

        // Track unique clients per year
        if (
          year &&
          window.uniqueClientsPerYearMap &&
          window.uniqueClientsPerYearMap[year]
        ) {
          window.uniqueClientsPerYearMap[year].add(clientName);
        }
      }
    });

    // Convert Sets to counts for the per-year map
    if (window.uniqueClientsPerYearMap) {
      Object.keys(window.uniqueClientsPerYearMap).forEach((year) => {
        window.uniqueClientsPerYearMap[year] =
          window.uniqueClientsPerYearMap[year].size;
      });
    }

    // Update the UI with the count
    const count = uniqueClients.size;
    window.uniqueClientSize = count;
    if (count < 6) {
      if (typeof createToastWarning === "function") {
        createToastWarning(
          "There are 5 or less Unique Clients in Peer Records."
        );
      }
    }
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = count;
    }

    console.log(`Counted ${count} unique clients after filtering`);
    console.log("Unique clients per year:", window.uniqueClientsPerYearMap);
  } catch (error) {
    console.error("Error counting unique clients:", error);
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = "0";
    }
  }
}

// Toggle button loading state
function toggleButtonLoadingState(btn) {
  if (!btn) return;

  btn.disabled = true;
  btn.classList.add("loading");

  const originalText = btn.textContent;
  btn.dataset.originalText = originalText;
  btn.textContent = "Loading...";
}

// Toggle print presentation button normal state
const togglePrintPresentationButtonNormalState = (btn) => {
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("loading");
  btn.textContent = "Print Presentation";
};

// Toggle generate report button normal state
const toggleGenerateReportButtonNormalState = (btn) => {
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("loading");
  btn.textContent = "Generate Report";
};

// Toggle button normal state
function toggleButtonNormalState(btn) {
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("loading");

  const originalText = btn.dataset.originalText;
  if (originalText) {
    btn.textContent = originalText;
    delete btn.dataset.originalText;
  }
}

// API Client Data Query
let apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: `{98.EX.${ClientRid}}`,
  clist: "98.474.452.3",
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
      const yearElement = item.querySelector("s52_formatted_year");
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

// Validate and normalize records
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

    console.log(`Validated ${result.length} out of ${records.length} records`);
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
  // console.log("processApiData called with", {
  //   yearsCount: selectedYears.length,
  //   peerCount: recordsPeer ? recordsPeer.length : 0,
  //   clientCount: recordsClient ? recordsClient.length : 0,
  // });

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
        // console.log(
        //   "Triggering enhancedInitializeChartDisplay from processApiData"
        // );
        enhancedInitializeChartDisplay();
      } else if (typeof initializeChartDisplay === "function") {
        // console.log("Triggering initializeChartDisplay from processApiData");
        initializeChartDisplay();
      } else if (
        window.systemConnector &&
        typeof window.systemConnector.displayCharts === "function"
      ) {
        // console.log(
        //   "Triggering systemConnector.displayCharts from processApiData"
        // );
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
      demoData: JSON.parse(localStorage.getItem("demoData")),
      cashData: JSON.parse(localStorage.getItem("cashData")), 
      debtData: JSON.parse(localStorage.getItem("debtData")),
      incomeData: JSON.parse(localStorage.getItem("incomeData")),
      expenseData: JSON.parse(localStorage.getItem("expenseData")),
      additionalData: JSON.parse(localStorage.getItem("additionalData"))
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
    // console.log("Initializing AppController");
    window.appController = new AppController();
  }
};
