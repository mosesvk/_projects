// remember to check the url that it says "clientrid" and NOT "clientRid" with a capital R.

// Initialize global variables for client filtering
if (typeof window.selectedClients_Array === "undefined") {
  window.selectedClients_Array = new Set();
}
if (typeof window.selectedRegions_Array === "undefined") {
  window.selectedRegions_Array = [];
}
if (typeof window.selectedSites_Array === "undefined") {
  window.selectedSites_Array = [];
}
if (typeof window.sliderValue === "undefined") {
  window.sliderValue = 0;
}
if (typeof window.sliderValue2 === "undefined") {
  window.sliderValue2 = 25000;
}

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
          const fiscalYear = record.querySelector("s52_formatted_year")?.textContent;
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

  // DEMO DATA PROCESSING
  processDemoData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);

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
          "cfhi_compre_00e_yes_no___attendees_to_staff",
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

  // CASH DATA PROCESSING
  processCashData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // daysExpendableNetAssets [s35, s34, s45, s167, s168, s46]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "daysExpendableNetAssets_Peer",
          record,
          "cfhi_compre_01_ratio___days_of_expendable_net_asset_reserves",
          "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves"
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

        // availableDaysOfCashFlow [s49, s318, s320, s336, s321, s30, s45, s167, s168, s46, s154, s166]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "availableDaysOfCashFlow_Peer",
          record,
          "cfhi_compre_03_ratio___available_days_of_cash_flow_coverage",
          "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage"
        );

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

        // netCashAvailability [s18, s20, s26, s166, s31, s36, s21]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_Peer",
          record,
          "cfhi_compre_05_ratio___net_cash_availability",
          "cfhi_compre_05_yes_no___net_cash_availability"
        );

        // netCashAvailability_including [s18, s20, s26, s166, s31, s36, s21, s30]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_including_Peer",
          record,
          "cfhi_compre_05a_ratio___net_cash_availability_including_unused_line_of_credit",
          "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit"
        );

        // netCashAvailability_standard [s45, s167, s168, s46]
        this.dataStore.insertData(
          "cash",
          "peer",
          year,
          "netCashAvailability_standard_Peer",
          record,
          "cfhi_compre_05b_ratio___std__at_least_one_months_worth_cash_expenses",
          "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses"
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

  // DEBT DATA PROCESSING - Added from apiTest.js
  processDebtData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // debtServiceCoverageRatio [s40, s45, s167, s168, s54, s55, s46]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "debtServiceCoverageRatio_Peer",
          record,
          "cfhi_compre_06_ratio___debt_service_coverage_ratio",
          "cfhi_compre_06_yes_no___debt_service_coverage_ratio"
        );

        // totalDebtToTotalAssets [s35, s26, s166, s27, s28, s29, s31]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "totalDebtToTotalAssets_Peer",
          record,
          "cfhi_compre_07_ratio___total_debt_to_total_assets",
          "cfhi_compre_07_yes_no___total_debt_to_total_assets"
        );

        // totalDebtToExpendableNetAssets [s35, s26, s166, s27, s28, s29, s31, s34]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "totalDebtToExpendableNetAssets_Peer",
          record,
          "cfhi_compre_08_ratio___total_debt_to_expendable_net_assets",
          "cfhi_compre_08_yes_no___total_debt_to_expendable_net_assets"
        );

        // viabilityRatio [s35, s34, s26, s166, s27, s28, s29, s31]
        this.dataStore.insertData(
          "debt",
          "peer",
          year,
          "viabilityRatio_Peer",
          record,
          "cfhi_compre_09_ratio___viability_ratio",
          "cfhi_compre_09_yes_no___viability_ratio"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // debtServiceCoverageRatio
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "debtServiceCoverageRatio_Client",
          record,
          "cfhi_compre_06_ratio___debt_service_coverage_ratio",
          "cfhi_compre_06_bench_rating___debt_service_coverage_ratio"
        );

        // totalDebtToTotalAssets
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "totalDebtToTotalAssets_Client",
          record,
          "cfhi_compre_07_ratio___total_debt_to_total_assets",
          "cfhi_compre_07_bench_rating___total_debt_to_total_assets"
        );

        // totalDebtToExpendableNetAssets
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "totalDebtToExpendableNetAssets_Client",
          record,
          "cfhi_compre_08_ratio___total_debt_to_expendable_net_assets",
          "cfhi_compre_08_bench_rating___total_debt_to_expendable_net_assets"
        );

        // viabilityRatio
        this.dataStore.insertData(
          "debt",
          "client",
          year,
          "viabilityRatio_Client",
          record,
          "cfhi_compre_09_ratio___viability_ratio",
          "cfhi_compre_09_bench_rating___viability_ratio"
        );
      });
    });
  }

  // INCOME DATA PROCESSING - Added from apiTest.js
  processIncomeData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // surplusMargin [s40, s45, s167, s168, s46]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "surplusMargin_Peer",
          record,
          "cfhi_compre_10_ratio___surplus_margin",
          "cfhi_compre_10_yes_no___surplus_margin"
        );

        // totalContributions
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalContributions_Peer",
          record,
          "s40___total_contribution",
          "cfhi_compre_10_yes_no___surplus_margin"
        );

        // totalExpenseReturnsToContributions [s40, s44]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalExpenseReturnsToContributions_Peer",
          record,
          "cfhi_compre_11_ratio___total_expense_returns_to_total_contributions",
          "cfhi_compre_11_yes_no___total_expense_returns_to_total_contributions"
        );

        // contributionsPerAdultAttendee [s40, s01]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsPerAdultAttendee_Peer",
          record,
          "cfhi_compre_12_ratio___contributions_per_adult_attendee",
          "cfhi_compre_12_yes_no___contributions_per_adult_attendee"
        );

        // totalRevenuePerAdultAttendee [s41, s01]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "totalRevenuePerAdultAttendee_Peer",
          record,
          "cfhi_compre_13_ratio___total_revenue_per_adult_attendee",
          "cfhi_compre_13_yes_no___total_revenue_per_adult_attendee"
        );

        // averageContributionPerGivingUnit [s40, s02]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "averageContributionPerGivingUnit_Peer",
          record,
          "cfhi_compre_14_ratio___average_contribution_per_giving_unit",
          "cfhi_compre_14_yes_no___average_contribution_per_giving_unit"
        );

        // contributionsWithoutDonorRestrictionsToTotalContributions [s39, s40]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "contributionsWithoutDonorRestrictionsToTotalContributions_Peer",
          record,
          "cfhi_compre_15_ratio___contributions_without_donor_restrictions_to_total_contributions",
          "cfhi_compre_15_yes_no___contributions_without_donor_restrictions_to_total_contributions"
        );

        // nonContributionRevenueToTotalRevenue [s41, s40, s44]
        this.dataStore.insertData(
          "income",
          "peer",
          year,
          "nonContributionRevenueToTotalRevenue_Peer",
          record,
          "cfhi_compre_16_ratio___non_contribution_revenue_to_total_revenue",
          "cfhi_compre_16_yes_no___non_contribution_revenue_to_total_revenue"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // surplusMargin
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "surplusMargin_Client",
          record,
          "cfhi_compre_10_ratio___surplus_margin",
          "cfhi_compre_10_bench_rating___surplus_margin"
        );

        // totalExpenseReturnsToContributions
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalExpenseReturnsToContributions_Client",
          record,
          "cfhi_compre_11_ratio___total_expense_returns_to_total_contributions",
          "cfhi_compre_11_bench_rating___total_expense_returns_to_total_contributions"
        );

        // contributionsPerAdultAttendee
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsPerAdultAttendee_Client",
          record,
          "cfhi_compre_12_ratio___contributions_per_adult_attendee",
          "cfhi_compre_12_bench_rating___contributions_per_adult_attendee"
        );

        // totalRevenuePerAdultAttendee
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "totalRevenuePerAdultAttendee_Client",
          record,
          "cfhi_compre_13_ratio___total_revenue_per_adult_attendee",
          "cfhi_compre_13_bench_rating___total_revenue_per_adult_attendee"
        );

        // averageContributionPerGivingUnit
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "averageContributionPerGivingUnit_Client",
          record,
          "cfhi_compre_14_ratio___average_contribution_per_giving_unit",
          "cfhi_compre_14_bench_rating___average_contribution_per_giving_unit"
        );

        // contributionsWithoutDonorRestrictionsToTotalContributions
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "contributionsWithoutDonorRestrictionsToTotalContributions_Client",
          record,
          "cfhi_compre_15_ratio___contributions_without_donor_restrictions_to_total_contributions",
          "cfhi_compre_15_bench_rating___contributions_without_donor_restrictions_to_total_contributions"
        );

        // nonContributionRevenueToTotalRevenue
        this.dataStore.insertData(
          "income",
          "client",
          year,
          "nonContributionRevenueToTotalRevenue_Client",
          record,
          "cfhi_compre_16_ratio___non_contribution_revenue_to_total_revenue",
          "cfhi_compre_16_bench_rating___non_contribution_revenue_to_total_revenue"
        );
      });
    });
  }

  // EXPENSE DATA PROCESSING - Added from apiTest.js
  processExpenseData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // totalExpensesPerAdultAttendee [s45, s167, s168, s46, s01]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpensesPerAdultAttendee_Peer",
          record,
          "cfhi_compre_17_ratio___total_expenses_per_adult_attendee",
          "cfhi_compre_17_yes_no___total_expenses_per_adult_attendee"
        );

        // salariesBenefitsToTotalExpenses [s51, s45, s167, s168, s46]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesBenefitsToTotalExpenses_Peer",
          record,
          "cfhi_compre_18_ratio___salaries_and_benefits_to_total_expenses",
          "cfhi_compre_18_yes_no___salaries_and_benefits_to_total_expenses"
        );

        // salariesBenefitsPerFTE [s51, s151]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "salariesBenefitsPerFTE_Peer",
          record,
          "cfhi_compre_19_ratio___salaries_and_benefits_per_fte",
          "cfhi_compre_19_yes_no___salaries_and_benefits_per_fte"
        );

        // facilitiesMaintenanceToTotalExpenses [s45, s167, s168, s46, s48]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "facilitiesMaintenanceToTotalExpenses_Peer",
          record,
          "cfhi_compre_20_ratio___facilities_and_maintenance_to_total_expenses",
          "cfhi_compre_20_yes_no___facilities_and_maintenance_to_total_expenses"
        );

        // totalExpensesPerSquareFoot [s45, s167, s168, s46, s08]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "totalExpensesPerSquareFoot_Peer",
          record,
          "cfhi_compre_21_ratio___total_expenses_per_square_foot",
          "cfhi_compre_21_yes_no___total_expenses_per_square_foot"
        );

        // facilitiesMaintenancePerSquareFoot [s48, s08]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "facilitiesMaintenancePerSquareFoot_Peer",
          record,
          "cfhi_compre_22_ratio___facilities_and_maintenance_per_square_foot",
          "cfhi_compre_22_yes_no___facilities_and_maintenance_per_square_foot"
        );

        // fundraisingEfficiency [s50, s40]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "fundraisingEfficiency_Peer",
          record,
          "cfhi_compre_23_ratio___fundraising_efficiency",
          "cfhi_compre_23_yes_no___fundraising_efficiency"
        );

        // internalManagementToTotalExpenses [s45, s167, s168, s46, s49]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "internalManagementToTotalExpenses_Peer",
          record,
          "cfhi_compre_24_ratio___internal_management_to_total_expenses",
          "cfhi_compre_24_yes_no___internal_management_to_total_expenses"
        );

        // programExpensesToTotalExpenses [s45, s167, s168, s46, s47]
        this.dataStore.insertData(
          "expense",
          "peer",
          year,
          "programExpensesToTotalExpenses_Peer",
          record,
          "cfhi_compre_25_ratio___program_expenses_to_total_expenses",
          "cfhi_compre_25_yes_no___program_expenses_to_total_expenses"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // totalExpensesPerAdultAttendee
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "totalExpensesPerAdultAttendee_Client",
          record,
          "cfhi_compre_17_ratio___total_expenses_per_adult_attendee",
          "cfhi_compre_17_bench_rating___total_expenses_per_adult_attendee"
        );

        // salariesBenefitsToTotalExpenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "salariesBenefitsToTotalExpenses_Client",
          record,
          "cfhi_compre_18_ratio___salaries_and_benefits_to_total_expenses",
          "cfhi_compre_18_bench_rating___salaries_and_benefits_to_total_expenses"
        );

        // salariesBenefitsPerFTE
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "salariesBenefitsPerFTE_Client",
          record,
          "cfhi_compre_19_ratio___salaries_and_benefits_per_fte",
          "cfhi_compre_19_bench_rating___salaries_and_benefits_per_fte"
        );

        // facilitiesMaintenanceToTotalExpenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "facilitiesMaintenanceToTotalExpenses_Client",
          record,
          "cfhi_compre_20_ratio___facilities_and_maintenance_to_total_expenses",
          "cfhi_compre_20_bench_rating___facilities_and_maintenance_to_total_expenses"
        );

        // totalExpensesPerSquareFoot
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "totalExpensesPerSquareFoot_Client",
          record,
          "cfhi_compre_21_ratio___total_expenses_per_square_foot",
          "cfhi_compre_21_bench_rating___total_expenses_per_square_foot"
        );

        // facilitiesMaintenancePerSquareFoot
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "facilitiesMaintenancePerSquareFoot_Client",
          record,
          "cfhi_compre_22_ratio___facilities_and_maintenance_per_square_foot",
          "cfhi_compre_22_bench_rating___facilities_and_maintenance_per_square_foot"
        );

        // fundraisingEfficiency
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "fundraisingEfficiency_Client",
          record,
          "cfhi_compre_23_ratio___fundraising_efficiency",
          "cfhi_compre_23_bench_rating___fundraising_efficiency"
        );

        // internalManagementToTotalExpenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "internalManagementToTotalExpenses_Client",
          record,
          "cfhi_compre_24_ratio___internal_management_to_total_expenses",
          "cfhi_compre_24_bench_rating___internal_management_to_total_expenses"
        );

        // programExpensesToTotalExpenses
        this.dataStore.insertData(
          "expense",
          "client",
          year,
          "programExpensesToTotalExpenses_Client",
          record,
          "cfhi_compre_25_ratio___program_expenses_to_total_expenses",
          "cfhi_compre_25_bench_rating___program_expenses_to_total_expenses"
        );
      });
    });
  }

  // ADDITIONAL DATA PROCESSING - Added from apiTest.js
  processAdditionalData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);

      // Process peer records
      filteredPeerRecords.forEach((record) => {
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
  }

  // Get records for peer organizations with filtering
  async getRecordsForPeer(years, dataStr = "<qdbapi>") {
    const yearQueries = years.map(year => `{'6'.CT.'${year}'}`).join("OR");
    const query = `{${yearQueries}}`;

    const body = `${dataStr}<ticket>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</ticket><apptoken>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</apptoken><table_id>bsnm4tgec</table_id><query>${query}</query><clist>a</clist><options>num-999999</options></qdbapi>`;

    try {
      const response = await fetch(`${this.baseUrl}/db/bsnm4tgde?act=API_DoQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
          "QB-Realm-Hostname": "qbcapitalmanagement.quickbase.com",
          "Authorization": `QB-USER-TOKEN ${this.userToken}`
        },
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "text/xml");
      const records = xmlDoc.querySelectorAll("record");
      return Array.from(records);
    } catch (error) {
      console.error("Error fetching peer records:", error);
      throw error;
    }
  }

  // Get records for client organizations
  async getRecordsForClient(years, dataStr = "<qdbapi>") {
    const yearQueries = years.map(year => `{'6'.CT.'${year}'}`).join("OR");
    const query = `{${yearQueries}}`;

    const body = `${dataStr}<ticket>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</ticket><apptoken>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</apptoken><table_id>bsnm4tged</table_id><query>${query}</query><clist>a</clist><options>num-999999</options></qdbapi>`;

    try {
      const response = await fetch(`${this.baseUrl}/db/bsnm4tgde?act=API_DoQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
          "QB-Realm-Hostname": "qbcapitalmanagement.quickbase.com",
          "Authorization": `QB-USER-TOKEN ${this.userToken}`
        },
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "text/xml");
      const records = xmlDoc.querySelectorAll("record");
      return Array.from(records);
    } catch (error) {
      console.error("Error fetching client records:", error);
      throw error;
    }
  }

  // Get unique client and peer organization names for filtering
  async getRecordsForUniqueClientPeerNames() {
    const dataStr = "<qdbapi>";
    const body = `${dataStr}<ticket>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</ticket><apptoken>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</apptoken><table_id>bsnm4tgec</table_id><query></query><clist>7.8.9.10.11</clist><options>num-999999</options></qdbapi>`;

    try {
      const response = await fetch(`${this.baseUrl}/db/bsnm4tgde?act=API_DoQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
          "QB-Realm-Hostname": "qbcapitalmanagement.quickbase.com",
          "Authorization": `QB-USER-TOKEN ${this.userToken}`
        },
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "text/xml");
      const records = xmlDoc.querySelectorAll("record");

      // Initialize filter handlers after data is loaded
      this._initializeFilterHandlers();

      return Array.from(records);
    } catch (error) {
      console.error("Error fetching unique names:", error);
      throw error;
    }
  }

  // Initialize filter event handlers
  _initializeFilterHandlers() {
    // Handle changes to any filter
    const handleFilterChange = () => this._handleFiltersChanged();
    
    // Client selection
    const clientSelect = document.getElementById('clientSelect');
    if (clientSelect) {
      clientSelect.addEventListener('change', () => this._updateClientSelection());
    }

    // Region selection  
    const regionSelect = document.getElementById('regionSelect');
    if (regionSelect) {
      regionSelect.addEventListener('change', handleFilterChange);
    }

    // Site selection
    const siteSelect = document.getElementById('siteSelect');
    if (siteSelect) {
      siteSelect.addEventListener('change', handleFilterChange);
    }

    // Slider controls
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    if (slider1) {
      slider1.addEventListener('input', handleFilterChange);
    }
    if (slider2) {
      slider2.addEventListener('input', handleFilterChange);
    }
  }

  // Handle filter changes
  _handleFiltersChanged() {
    // Update global variables based on current filter state
    const regionSelect = document.getElementById('regionSelect');
    const siteSelect = document.getElementById('siteSelect');
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');

    if (regionSelect) {
      window.selectedRegions_Array = Array.from(regionSelect.selectedOptions).map(option => option.value);
    }
    if (siteSelect) {
      window.selectedSites_Array = Array.from(siteSelect.selectedOptions).map(option => option.value);
    }
    if (slider1) {
      window.sliderValue = parseInt(slider1.value);
    }
    if (slider2) {
      window.sliderValue2 = parseInt(slider2.value);
    }

    this._triggerFiltersChanged();
  }

  // Update client selection
  _updateClientSelection() {
    const clientSelect = document.getElementById('clientSelect');
    if (clientSelect) {
      window.selectedClients_Array = new Set(
        Array.from(clientSelect.selectedOptions).map(option => option.value)
      );
    }
    this._triggerFiltersChanged();
  }

  // Trigger filter change event
  _triggerFiltersChanged() {
    // Dispatch custom event for filter changes
    const event = new CustomEvent('filtersChanged', {
      detail: {
        clients: window.selectedClients_Array,
        regions: window.selectedRegions_Array,
        sites: window.selectedSites_Array,
        slider1: window.sliderValue,
        slider2: window.sliderValue2
      }
    });
    document.dispatchEvent(event);
  }

  // Populate clients dropdown fallback
  _populateClientsDropdownFallback(clientArray) {
    const clientSelect = document.getElementById('clientSelect');
    if (!clientSelect) return;

    clientSelect.innerHTML = '';
    
    clientArray.forEach(client => {
      const option = document.createElement('option');
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

    const clientQueries = Array.from(selectedClientsSet).map(client => 
      `{'7'.EX.'${this._escapeClientName(client)}'}`
    );
    
    return `AND({${clientQueries.join("OR")}})`;
  }

  // Get records for peer with batching support
  async getRecordsForPeerWithBatching(years, selectedClientsSet, dataStr = "<qdbapi>") {
    const yearQueries = years.map(year => `{'6'.CT.'${year}'}`).join("OR");
    const clientQuery = this.getClientQuery(selectedClientsSet);
    const query = clientQuery ? `{${yearQueries}}${clientQuery}` : `{${yearQueries}}`;

    const body = `${dataStr}<ticket>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</ticket><apptoken>bdqk4z_qh_0_efzgz73p69tg4exwdqhxudtg6s2fgje</apptoken><table_id>bsnm4tgec</table_id><query>${query}</query><clist>a</clist><options>num-999999</options></qdbapi>`;

    try {
      const response = await fetch(`${this.baseUrl}/db/bsnm4tgde?act=API_DoQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
          "QB-Realm-Hostname": "qbcapitalmanagement.quickbase.com",
          "Authorization": `QB-USER-TOKEN ${this.userToken}`
        },
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "text/xml");
      const records = xmlDoc.querySelectorAll("record");
      return Array.from(records);
    } catch (error) {
      console.error("Error fetching peer records with batching:", error);
      throw error;
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
    // Implementation for clearing cached records if needed
    console.log("Records cleared");
  }
}

// Application Controller Class - Added from apiTest.js
class AppController {
  constructor() {
    this.dataStore = new DataStore();
    this.dataProcessor = new DataProcessor(this.dataStore);
    this.apiService = new ApiService();
    this.isProcessing = false;
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Run button click handler
    const runButton = document.getElementById('runButton');
    if (runButton) {
      runButton.addEventListener('click', () => this.handleRunButtonClick());
    }

    // Generate report button
    const generateReportButton = document.getElementById('generateReportButton');
    if (generateReportButton) {
      generateReportButton.addEventListener('click', () => this.handleGenerateReportClick());
    }

    // Print presentation button
    const printPresentationButton = document.getElementById('printPresentationButton');
    if (printPresentationButton) {
      printPresentationButton.addEventListener('click', () => this.handlePrintPresentationClick());
    }

    // Year selection handlers
    const yearCheckboxes = document.querySelectorAll('input[name="selectedYears"]');
    yearCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.processSelectedYears());
    });

    // Filter change handlers
    document.addEventListener('filtersChanged', (event) => {
      console.log('Filters changed:', event.detail);
    });
  }

  // Create empty chart placeholder
  async createEmptyChart(chart, title) {
    try {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }

      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6c757d';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${title} - No Data Available`, canvas.width / 2, canvas.height / 2);

      return canvas;
    } catch (error) {
      console.error('Error creating empty chart:', error);
      return null;
    }
  }

  // Validate data for charts
  async _validateDataForCharts() {
    const patterns = [
      'demo', 'cash', 'debt', 'income', 'expense', 'additional'
    ];

    for (const pattern of patterns) {
      const hasData = await this._checkForAnyData(pattern);
      if (!hasData) {
        console.warn(`No data found for pattern: ${pattern}`);
      }
    }
  }

  // Check for any data matching pattern
  async _checkForAnyData(pattern) {
    try {
      const data = this.dataStore.getDataCategory(pattern);
      return Object.keys(data).length > 0;
    } catch (error) {
      console.error(`Error checking data for pattern ${pattern}:`, error);
      return false;
    }
  }

  // Handle run button click
  async handleRunButtonClick() {
    if (this.isProcessing) {
      console.log('Already processing...');
      return;
    }

    this.isProcessing = true;
    const runButton = document.getElementById('runButton');
    
    try {
      // Update button state
      toggleButtonLoadingState(runButton);

      // Get selected years
      const selectedYears = this.processSelectedYears();
      if (selectedYears.length === 0) {
        alert('Please select at least one year.');
        return;
      }

      // Get unique client/peer names for filtering
      const uniqueRecords = await this.apiService.getRecordsForUniqueClientPeerNames();
      
      // Get records for selected years
      const recordsPeer = await this.apiService.getRecordsForPeerWithBatching(
        selectedYears, 
        window.selectedClients_Array
      );
      const recordsClient = await this.apiService.getRecordsForClient(yearsData_Array);

      // Validate records
      const validatedPeerRecords = await validateAndNormalizeRecords(recordsPeer);
      const validatedClientRecords = await validateAndNormalizeRecords(recordsClient);

      // Process all data
      this.dataProcessor.processAllData(
        selectedYears, 
        validatedPeerRecords, 
        validatedClientRecords
      );

      // Validate data for charts
      await this._validateDataForCharts();

      // Display components
      this.displayAllComponents();

      console.log('Data processing completed successfully');

    } catch (error) {
      console.error('Error during data processing:', error);
      alert('An error occurred while processing data. Please try again.');
    } finally {
      this.isProcessing = false;
      toggleButtonNormalState(runButton);
    }
  }

  // Handle generate report button click
  handleGenerateReportClick() {
    const generateReportButton = document.getElementById('generateReportButton');
    
    try {
      toggleGenerateReportButtonNormalState(generateReportButton);
      
      // Generate report logic here
      console.log('Generating report...');
      
      // Reset button after operation
      setTimeout(() => {
        toggleButtonNormalState(generateReportButton);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating report:', error);
      toggleButtonNormalState(generateReportButton);
    }
  }

  // Handle print presentation button click
  handlePrintPresentationClick() {
    const printPresentationButton = document.getElementById('printPresentationButton');
    
    try {
      togglePrintPresentationButtonNormalState(printPresentationButton);
      
      // Print presentation logic here
      console.log('Printing presentation...');
      window.print();
      
      // Reset button after operation
      setTimeout(() => {
        toggleButtonNormalState(printPresentationButton);
      }, 2000);
      
    } catch (error) {
      console.error('Error printing presentation:', error);
      toggleButtonNormalState(printPresentationButton);
    }
  }

  // Process selected years
  processSelectedYears() {
    const checkboxes = document.querySelectorAll('input[name="selectedYears"]:checked');
    const selectedYears = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedYears.length > 0) {
      this.saveSelectedYearsToLocalStorage(selectedYears);
    }
    
    return selectedYears;
  }

  // Save selected years to localStorage
  saveSelectedYearsToLocalStorage(selectedYearsData) {
    try {
      localStorage.setItem('selectedYears', JSON.stringify(selectedYearsData));
      console.log('Selected years saved to localStorage:', selectedYearsData);
    } catch (error) {
      console.error('Error saving selected years to localStorage:', error);
    }
  }

  // Display all components
  displayAllComponents() {
    try {
      // Display charts and components based on processed data
      console.log('Displaying all components...');
      
      // This would typically trigger chart creation and component rendering
      const event = new CustomEvent('dataProcessed', {
        detail: {
          dataStore: this.dataStore
        }
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error displaying components:', error);
    }
  }

  // Validate data for charts (duplicate method for consistency)
  _validateDataForCharts() {
    return this._validateDataForCharts();
  }
}

// Utility Functions - Added from apiTest.js

// Restore initial client selection
function restoreInitialClientSelection() {
  try {
    const savedSelection = localStorage.getItem('selectedClients');
    if (savedSelection) {
      const clientArray = JSON.parse(savedSelection);
      window.selectedClients_Array = new Set(clientArray);
      
      // Update UI if client select exists
      const clientSelect = document.getElementById('clientSelect');
      if (clientSelect) {
        Array.from(clientSelect.options).forEach(option => {
          option.selected = window.selectedClients_Array.has(option.value);
        });
      }
    }
  } catch (error) {
    console.error('Error restoring client selection:', error);
  }
}

// Count unique clients in records
function countUniqueClients(records) {
  if (!records || records.length === 0) {
    return 0;
  }

  const uniqueClients = new Set();
  
  records.forEach(record => {
    try {
      const clientName = record.querySelector('s07___church_name')?.textContent?.trim();
      if (clientName) {
        uniqueClients.add(clientName);
      }
    } catch (error) {
      console.error('Error processing record for unique client count:', error);
    }
  });

  return uniqueClients.size;
}

// Toggle button loading state
function toggleButtonLoadingState(btn) {
  if (!btn) return;
  
  btn.disabled = true;
  btn.classList.add('loading');
  
  const originalText = btn.textContent;
  btn.dataset.originalText = originalText;
  btn.textContent = 'Loading...';
}

// Toggle print presentation button normal state
const togglePrintPresentationButtonNormalState = (btn) => {
  if (!btn) return;
  
  btn.disabled = false;
  btn.classList.remove('loading');
  btn.textContent = 'Print Presentation';
};

// Toggle generate report button normal state
const toggleGenerateReportButtonNormalState = (btn) => {
  if (!btn) return;
  
  btn.disabled = false;
  btn.classList.remove('loading');
  btn.textContent = 'Generate Report';
};

// Toggle button normal state
function toggleButtonNormalState(btn) {
  if (!btn) return;
  
  btn.disabled = false;
  btn.classList.remove('loading');
  
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
  if (!records || !Array.isArray(records)) {
    console.warn('Invalid records provided for validation');
    return [];
  }

  const validRecords = [];
  
  records.forEach((record, index) => {
    try {
      // Check if record has required structure
      if (record && typeof record.querySelector === 'function') {
        validRecords.push(record);
      } else {
        console.warn(`Record at index ${index} is not a valid DOM element`);
      }
    } catch (error) {
      console.error(`Error validating record at index ${index}:`, error);
    }
  });

  console.log(`Validated ${validRecords.length} out of ${records.length} records`);
  return validRecords;
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const appController = new AppController();
  appController.initializeEventListeners();
  
  // Restore any saved selections
  restoreInitialClientSelection();
  
  console.log('Application initialized successfully');
}); 