// remember to check the url that it says "clientrid" and NOT "clientRid" with a capital R.

// Initialize global variables for client filtering
if (typeof window.selectedClients_Array === "undefined") {
  window.selectedClients_Array = new Set();
}
if (typeof window.selectedRegions_Array === "undefined") {
  window.selectedRegions_Array = new Set();
}
if (typeof window.selectedSites_Array === "undefined") {
  window.selectedSites_Array = new Set();
}
if (typeof window.sliderValue === "undefined") {
  window.sliderValue = 0;
}
if (typeof window.sliderValue2 === "undefined") {
  window.sliderValue2 = 25000;
}
if (typeof window.yearsData_Array === "undefined") {
  window.yearsData_Array = [];
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

  // DEMO DATA PROCESSING
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
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

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
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

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
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

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
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

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
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );

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
        const clientName =
          record.querySelector("client___merged_client_name")?.textContent;

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
        console.log("No client data loaded, skipping filter handler initialization");
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

    // console.log(`Using batched approach for ${selectedClients.length} clients`);

    // Split clients into batches of 80 (safe for QuickBase query limits)
    const BATCH_SIZE = 80;
    const clientBatches = [];
    for (let i = 0; i < selectedClients.length; i += BATCH_SIZE) {
      clientBatches.push(selectedClients.slice(i, i + BATCH_SIZE));
    }

    // console.log(
    //   `Split into ${clientBatches.length} batches of ${BATCH_SIZE} clients each`
    // );

    // Process each year with all batches
    for (const currentYear of years) {
      // console.log(
      //   `Processing year ${currentYear} with ${clientBatches.length} batches`
      // );

      for (
        let batchIndex = 0;
        batchIndex < clientBatches.length;
        batchIndex++
      ) {
        const clientBatch = clientBatches[batchIndex];
        // console.log(
        //   `Processing batch ${batchIndex + 1}/${clientBatches.length} with ${
        //     clientBatch.length
        //   } clients`
        // );

        try {
          // Build query for this specific batch
          const clientConditions = clientBatch
            .map((client) => `{301.EX.'${this._escapeClientName(client)}'}`)
            .join(" OR ");
          const batchClientQuery = `(${clientConditions})`;

          // Basic query condition with year and batch client query
          let queryCondition = `{195.EX.${currentYear}} AND ${batchClientQuery}`;

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
              "195.123.122.135.136.226.160.137.161.176.354.170.129.174.252.253.254.255.256.257.258.259.260.261.262.263.264.265.405.239.156.158.149.142.143.153.155.164.162.132.131.141.140.171.172.173.157.181.182.165.179.145.147.169.138.168.139.180.177.152.150.151.154.166.167.163.175.178.133.227.228.229.230.231.232.233.234.235.144.146.159.148.236.237.238.239.240.241.242.243.244.245.246.247.248.249.250.251.267.268.271.274.273.276.277.278.279.280.281.282.283.134.284.286.287.288.289.290.291.324.325.326.327.328.352.329.353.330.331.332.333.334.335.406.240.167.181.356.162.241.137.122.357.242.123.358.243.161.163.138.359.244.361.245.365.273.136.363.274.364.249.366.170.367.250.164.181.182.139.180.165.368.251.166.369.271.175.370.277.142.371.278.140.372.279.141.373.280.374.281.375.282.173.376.283.377.284.133.378.286.379.287.129.380.288.381.289.382.290.383.291.178.301",
          };

          const xml = await $.get(peerData, apiCallPeerData);
          const recordsForPeer = $("record", xml).toArray();

          // console.log(
          //   `Batch ${batchIndex + 1}: Received ${
          //     recordsForPeer.length
          //   } records for year ${currentYear}`
          // );

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
          }

          // console.log('recordPeerHTMLArray', this.recordPeerHTMLArray, 'dataStr', dataStr);

          // Add a small delay between batches to avoid overwhelming the API
          if (batchIndex < clientBatches.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(
            `Error fetching peer data for year ${currentYear}, batch ${
              batchIndex + 1
            }:`,
            error
          );
          // Continue with next batch even if this one failed
        }
      }
    }

    // Parse and return the final results
    try {
      if (dataStr === "<qdbapi>") {
        console.warn("No records collected, returning empty array");
        return [];
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataStr + "</qdbapi>", "text/xml");
      const records = xmlDoc.querySelectorAll("record");
      console.log(
        `Batched approach completed: Parsed ${records.length} total peer records`
      );
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
      console.log("Client data store not available for client selection update");
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
      const regionMatch = selectedRegions.length === 0 || 
        selectedRegions.includes(clientData.region);
      const siteMatch = selectedSites.length === 0 || 
        selectedSites.includes(clientData.site);

      const matches = givingUnitsMatch && regionMatch && siteMatch;

      // Update checkbox and selection array
      checkbox.checked = matches;

      if (matches) {
        window.selectedClients_Array.add(clientName);
        matchCount++;
      }
    });

    console.log(`Filter completed: ${matchCount} clients match current filters`);
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
      "additionalData"
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

      if (
        this &&
        typeof this.clearRecords === "function"
      ) {
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

  // Process selected years
  processSelectedYears() {
    const selectedYears = getSelectedYearsFromLocalStorage();

    if (!selectedYears) {
      if (typeof createToastWarning === "function") {
        createToastWarning(
          "Error retrieving selected years. Please reload the page and try again."
        );
      } else {
        alert("Error retrieving selected years. Please reload the page and try again.");
      }
      throw new Error("Failed to retrieve selected years from localStorage");
    }

    if (!selectedYears.length) {
      if (typeof createToastWarning === "function") {
        createToastWarning("Please select at least one year for data to appear");
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
      const event = new CustomEvent('componentsDisplayed', {
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
  selectedYears.forEach(year => {
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
        if (year && window.uniqueClientsPerYearMap && window.uniqueClientsPerYearMap[year]) {
          window.uniqueClientsPerYearMap[year].add(clientName);
        }
      }
    });

    // Convert Sets to counts for the per-year map
    if (window.uniqueClientsPerYearMap) {
      Object.keys(window.uniqueClientsPerYearMap).forEach(year => {
        window.uniqueClientsPerYearMap[year] = window.uniqueClientsPerYearMap[year].size;
      });
    }

    // Update the UI with the count
    const count = uniqueClients.size;
    window.uniqueClientSize = count;
    if (count < 6) {
      if (typeof createToastWarning === "function") {
        createToastWarning("There are 5 or less Unique Clients in Peer Records.");
      }
    }
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = count;
    }

    console.log(`Counted ${count} unique clients after filtering`);
    console.log('Unique clients per year:', window.uniqueClientsPerYearMap);
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
      cfiData: JSON.parse(localStorage.getItem("cfiData")),
      doeData: JSON.parse(localStorage.getItem("doeData")),
      financialAnalysisData: JSON.parse(
        localStorage.getItem("financialAnalysisData")
      ),
      financialPositionData: JSON.parse(
        localStorage.getItem("financialPositionData")
      ),
      financialStatementData: JSON.parse(
        localStorage.getItem("financialStatementData")
      ),
      revenueExpenseData: JSON.parse(
        localStorage.getItem("revenueExpenseData")
      ),
      // debtEndowmentData: JSON.parse(localStorage.getItem("debtEndowmentData")),
      ltDebtPerTotalOperatingRevenueData: JSON.parse(
        localStorage.getItem("ltDebtPerTotalOperatingRevenueData")
      ),
      debtServiceCoverageRatioData: JSON.parse(
        localStorage.getItem("debtServiceCoverageRatioData")
      ),
      debtBurdenRatioData: JSON.parse(
        localStorage.getItem("debtBurdenRatioData")
      ),
      endowmentOperatingBudgetData: JSON.parse(
        localStorage.getItem("endowmentOperatingBudgetData")
      ),
      endowmentAssetsPerStudentData: JSON.parse(
        localStorage.getItem("endowmentAssetsPerStudentData")
      ),
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
