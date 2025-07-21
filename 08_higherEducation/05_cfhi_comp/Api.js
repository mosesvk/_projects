// remember to check the url that it says "clientrid" and NOT "clientRid" with a capital R.

let apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: `{98.EX.${ClientRid}}`,
  clist: "452.98.474",
};

$.get(clientData, apiCallClientDataForUniqueYears)
  .then(async (xml) => {
    recordsClient = await $("record", xml).toArray();

    console.log(recordsClient);

    if (recordsClient.length > 0) {
      findUniqueYears(recordsClient);
      dataClient = recordsClient[0].children;
    } else {
      console.error(
        "No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid"
      );
    }
  })
  .catch((err) => console.error(err));

window.addEventListener("beforeunload", () => {
  localStorage.clear();
});

document.addEventListener("DOMContentLoaded", () => {
  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
  addUniqueSitesToOptionsSelectSite(sites_Array);

  displayDemoComponent();
  displayCashComponent();
  displayDebtComponent();
  displayIncomeComponent();
  displayExpenseComponent();

  displayReportComponent();

  runApiMain();
});

const findUniqueYears = (data) => {
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

    //nav-component
    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
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
    record.querySelector(child).innerHTML.split("").length > 0
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
      dynamicValueClientPeer &&
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

const processCashData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // daysExpendableNetAssets [s35, s34, s45, s167, s168, s46]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysExpendableNetAssets_Peer",
        record,
        "cfhi_compre_01_ratio___days_of_expendable_net_asset_reserves",
        "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "bodDesignatedForOperations",
        record,
        "s35___bod_designated_for_operations",
        "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
        "daysExpendableNetAssets"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetWithoutDonorRestriction",
        record,
        "s34___net_asset_without_donor_restriction__undesignated",
        "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
        "daysExpendableNetAssets"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
        "daysExpendableNetAssets"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
        "daysExpendableNetAssets"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
        "daysExpendableNetAssets"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_01_yes_no___days_of_expendable_net_asset_reserves",
        "daysExpendableNetAssets"
      );

      // daysOperatingCash [s18, s20, s36, s21, s45, s167, s168, s51, s46, s154, s166]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysOperatingCash_Peer",
        record,
        "cfhi_compre_02_ratio___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCash",
        record,
        "s18___total_cash",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "nonEndowmentInvestment",
        record,
        "s20___non_endowment_investment",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetWithDonor",
        record,
        "s36___net_asset_with_donor_restriction",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "pledgeReceivable",
        record,
        "s21___pledge_receivable",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "capitalizedInterest",
        record,
        "s51___capitalized_interest",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_02_yes_no___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "daysOperatingCash"
      );

      // availableDaysOfCashFlow [s49, s318, s320, s336, s321, s30, s45, s167, s168, s46, s154, s166]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "availableDaysOfCashFlow_Peer",
        record,
        "cfhi_compre_03_ratio___available_days_of_cash_flow_coverage",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashFlowFromOperatingActivities",
        record,
        "s49___cash_flow_from_operating_activities",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCashAtBeginningYear",
        record,
        "s318___total_cash_at_the_beginning_of_the_year",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "nonEndowmentInvestmentBeginningYear",
        record,
        "s320___non_endowment_investment_at_the_beginning_of_the_year",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetWithDonorRestriction",
        record,
        "s336___net_asset_with_donor_restriction_at_the_beginning_of_the_year",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "pledgeReceivableBeginningYear",
        record,
        "s321___pledge_receivable_at_the_beginning_of_the_year",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "availableOperatingLineOfCredit",
        record,
        "s30___available_operating_line_of_credit",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_03_yes_no___available_days_of_cash_flow_coverage",
        "availableDaysOfCashFlow"
      );

      // liquidityRatio [s18, s20, s36, s21, s26, s166, s27, s28, s154, s164, s29, s31]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "liquidityRatio_Peer",
        record,
        "cfhi_compre_04_ratio___liquidity_ratio",
        "cfhi_compre_04_yes_no___liquidity_ratio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCash",
        record,
        "s18___total_cash",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "nonEndowmentInvestment",
        record,
        "s20___non_endowment_investment",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetWithDonor",
        record,
        "s36___net_asset_with_donor_restriction",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "pledgeReceivable",
        record,
        "s21___pledge_receivable",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentLiabilities",
        record,
        "s26___current_liabilities",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "accruedInterest",
        record,
        "s27___accrued_interest",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "accruedConstructionCost",
        record,
        "s28___accrued_construction_cost",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "oneTimePayoffDebtDueNextYear",
        record,
        "s164___one_time_payoff_of_debt_due_in_the_next_year",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "deferredRevenue",
        record,
        "s29___deferred_revenue",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "shortTermConstructionLineOfCredit",
        record,
        "s31___short_term_construction_line_of_credit",
        "cfhi_compre_04_yes_no___liquidity_ratio",
        "liquidityRatio"
      );

      // netCashAvailability [s18, s20, s26, s166, s31, s36, s21]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netCashAvailability_Peer",
        record,
        "cfhi_compre_05_ratio___net_cash_availability",
        "cfhi_compre_05_yes_no___net_cash_availability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCash",
        record,
        "s18___total_cash",
        "cfhi_compre_05_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "nonEndowmentInvestment",
        record,
        "s20___non_endowment_investment",
        "cfhi_compre_05_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentLiabilities",
        record,
        "s26___current_liabilities",
        "cfhi_compre_05_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_05_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "shortTermConstructionLineOfCredit",
        record,
        "s31___short_term_construction_line_of_credit",
        "cfhi_compre_05_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetWithDonor",
        record,
        "s36___net_asset_with_donor_restriction",
        "cfhi_compre_05_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "pledgeReceivable",
        record,
        "s21___pledge_receivable",
        "cfhi_compre_05_yes_no___net_cash_availability",
        "netCashAvailability"
      );

      // netCashAvailability_including [s18, s20, s26, s166, s31, s36, s21, s30]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netCashAvailability_including_Peer",
        record,
        "cfhi_compre_05a_ratio___net_cash_availability_including_unused_line_of_credit",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCash",
        record,
        "s18___total_cash",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "nonEndowmentInvestment",
        record,
        "s20___non_endowment_investment",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentLiabilities",
        record,
        "s26___current_liabilities",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "shortTermConstructionLineOfCredit",
        record,
        "s31___short_term_construction_line_of_credit",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netAssetWithDonor",
        record,
        "s36___net_asset_with_donor_restriction",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "pledgeReceivable",
        record,
        "s21___pledge_receivable",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "availableOperatingLineOfCredit",
        record,
        "s30___available_operating_line_of_credit",
        "cfhi_compre_05a_yes_no___net_cash_availability_including_unused_line_of_credit",
        "netCashAvailability_including"
      );

      // netCashAvailability_standard [s45, s167, s168, s46]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netCashAvailability_standard_Peer",
        record,
        "cfhi_compre_05b_ratio___std__at_least_one_months_worth_cash_expenses",
        "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses",
        "netCashAvailability_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses",
        "netCashAvailability_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses",
        "netCashAvailability_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_05b_yes_no___std__at_least_one_months_worth_cash_expenses",
        "netCashAvailability_standard"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // daysExpendableNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysExpendableNetAssets_Client",
        record,
        "cfhi_compre_01_ratio___days_of_expendable_net_asset_reserves",
        "cfhi_compre_01_bench_rating___days_of_expendable_net_asset_reserves"
      );

      // daysOperatingCash
      insertDataIntoObject(
        "client",
        year,
        object,
        "daysOperatingCash_Client",
        record,
        "cfhi_compre_02_ratio___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures",
        "cfhi_compre_02_bench_rating___days_operating_cash_and_investments_on_hand_to_fund_annual_cash_expenditures"
      );

      // availableDaysOfCashFlow
      insertDataIntoObject(
        "client",
        year,
        object,
        "availableDaysOfCashFlow_Client",
        record,
        "cfhi_compre_03_ratio___available_days_of_cash_flow_coverage",
        "cfhi_compre_03_bench_rating___available_days_of_cash_flow_coverage"
      );

      // liquidityRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "liquidityRatio_Client",
        record,
        "cfhi_compre_04_ratio___liquidity_ratio",
        "cfhi_compre_04_bench_rating___liquidity_ratio"
      );

      // netCashAvailability
      insertDataIntoObject(
        "client",
        year,
        object,
        "netCashAvailability_Client",
        record,
        "cfhi_compre_05_ratio___net_cash_availability",
        "cfhi_compre_05_bench_rating___net_cash_availability"
      );

      // netCashAvailability_including
      insertDataIntoObject(
        "client",
        year,
        object,
        "netCashAvailability_including_Client",
        record,
        "cfhi_compre_05a_ratio___net_cash_availability_including_unused_line_of_credit"
      );

      // netCashAvailability_standard
      insertDataIntoObject(
        "client",
        year,
        object,
        "netCashAvailability_standard_Client",
        record,
        "cfhi_compre_05b_ratio___std__at_least_one_months_worth_cash_expenses"
      );
    });
  });

  localStorage.removeItem("cashData");
  localStorage.setItem("cashData", JSON.stringify(object));
};

const processDebtData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // debtToContributionsWithout [s155, s165, s39]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtToContributionsWithout_Peer",
        record,
        "cfhi_compre_06_ratio___debt_to_contributions_w_o_donor_restrictions",
        "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDebt",
        record,
        "s155___total_debt",
        "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions",
        "debtToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "financeLeaseRightOfUse",
        record,
        "s165___finance_lease_right_of_use_asset_and_liability",
        "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions",
        "debtToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_compre_06_yes_no___debt_to_contributions_w_o_donor_restrictions",
        "debtToContributionsWithout"
      );

      // currentRatio [s17, s26, s166]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentRatio_Peer",
        record,
        "cfhi_compre_07_ratio___current_ratio",
        "cfhi_compre_07_yes_no___current_ratio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentAssets",
        record,
        "s17___current_assets",
        "cfhi_compre_07_yes_no___current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentLiabilities",
        record,
        "s26___current_liabilities",
        "cfhi_compre_07_yes_no___current_ratio",
        "currentRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_07_yes_no___current_ratio",
        "currentRatio"
      );

      // mandatoryDebtServiceToContributionsWithout [s154, s166, s47, s168, s51, s39]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "mandatoryDebtServiceToContributionsWithout_Peer",
        record,
        "cfhi_compre_08_ratio__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "mandatoryDebtServiceToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "mandatoryDebtServiceToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cyInterestExpense",
        record,
        "s47___cy_interest_expense",
        "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "mandatoryDebtServiceToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "mandatoryDebtServiceToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "capitalizedInterest",
        record,
        "s51___capitalized_interest",
        "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "mandatoryDebtServiceToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_compre_08_yes_no__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "mandatoryDebtServiceToContributionsWithout"
      );

      // debtPerAverageAdultAttendee [s155, s165, s01]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtPerAverageAdultAttendee_Peer",
        record,
        "cfhi_compre_09a_ratio___debt_per_average_adult_attendee",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDebt",
        record,
        "s155___total_debt",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee",
        "debtPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "financeLeaseRightOfUse",
        record,
        "s165___finance_lease_right_of_use_asset_and_liability",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee",
        "debtPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAdultAttendees",
        record,
        "s01_average_adult_attendees_excluding_children",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee",
        "debtPerAverageAdultAttendee"
      );

      // debtPerAverageAdultAttendee_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtPerAverageAdultAttendee_percentChange_Peer",
        record,
        "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
      );

      // debtPerAverageAdultAttendee_standard [s39, s152, s01]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtPerAverageAdultAttendee_standard_Peer",
        record,
        "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee",
        "debtPerAverageAdultAttendee_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithoutDonor",
        record,
        "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee",
        "debtPerAverageAdultAttendee_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAdultAttendees",
        record,
        "s01_average_adult_attendees_excluding_children",
        "cfhi_compre_09a_yes_no___debt_per_average_adult_attendee",
        "debtPerAverageAdultAttendee_standard"
      );

      // debtPerGivingUnit [s155, s165, s02]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtPerGivingUnit_Peer",
        record,
        "cfhi_compre_09d_ratio___debt_per_giving_unit",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDebt",
        record,
        "s155___total_debt",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit",
        "debtPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "financeLeaseRightOfUse",
        record,
        "s165___finance_lease_right_of_use_asset_and_liability",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit",
        "debtPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit",
        "debtPerGivingUnit"
      );

      // debtPerGivingUnit_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtPerGivingUnit_percentChange_Peer",
        record,
        "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
      );

      // debtPerGivingUnit_standard [s39, s152, s02]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtPerGivingUnit_standard_Peer",
        record,
        "cfhi_compre_09f_ratio____std_2_x_contributions_w_o_restrictions_per_giving_unit",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit",
        "debtPerGivingUnit_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithoutDonor",
        record,
        "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit",
        "debtPerGivingUnit_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_compre_09d_yes_no___debt_per_giving_unit",
        "debtPerGivingUnit_standard"
      );

      // debtCoverage [s48, s167, s168, s47, s46, s154, s166]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtCoverage_Peer",
        record,
        "cfhi_compre_10_ratio___debt_coverage",
        "cfhi_compre_10_yes_no___debt_coverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "changeInNetAssetWithout",
        record,
        "s48___change_in_net_asset_without_donor_restriction",
        "cfhi_compre_10_yes_no___debt_coverage",
        "debtCoverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_10_yes_no___debt_coverage",
        "debtCoverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_10_yes_no___debt_coverage",
        "debtCoverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cyInterestExpense",
        record,
        "s47___cy_interest_expense",
        "cfhi_compre_10_yes_no___debt_coverage",
        "debtCoverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_10_yes_no___debt_coverage",
        "debtCoverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_10_yes_no___debt_coverage",
        "debtCoverage"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_10_yes_no___debt_coverage",
        "debtCoverage"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // debtToContributionsWithout
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtToContributionsWithout_Client",
        record,
        "cfhi_compre_06_ratio___debt_to_contributions_w_o_donor_restrictions",
        "cfhi_compre_06_bench_rating___debt_to_contributions_w_o_donor_restrictions"
      );

      // currentRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "currentRatio_Client",
        record,
        "cfhi_compre_07_ratio___current_ratio",
        "cfhi_compre_07_bench_rating___current_ratio"
      );

      // mandatoryDebtServiceToContributionsWithout
      insertDataIntoObject(
        "client",
        year,
        object,
        "mandatoryDebtServiceToContributionsWithout_Client",
        record,
        "cfhi_compre_08_ratio__mandatory_debt_service_to_contributions_w_o_donor_restrictuions",
        "cfhi_compre_08_bench_rating___mandatory_debt_service_to_contributions_w_o_donor_restrictuions"
      );

      // debtPerAverageAdultAttendee
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerAverageAdultAttendee_Client",
        record,
        "cfhi_compre_09a_ratio___debt_per_average_adult_attendee",
        "cfhi_compre_09a_bench_rating___debt_per_average_adult_attendee"
      );

      // debtPerAverageAdultAttendee_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerAverageAdultAttendee_percentChange_Client",
        record,
        "cfhi_compre_09a_ratio_change___debt_per_average_adult_attendee"
      );

      // debtPerAverageAdultAttendee_standard
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerAverageAdultAttendee_standard_Client",
        record,
        "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
      );

      // debtPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerGivingUnit_Client",
        record,
        "cfhi_compre_09d_ratio___debt_per_giving_unit",
        "cfhi_compre_09d_bench_rating___debt_per_giving_unit"
      );

      // debtPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerGivingUnit_percentChange_Client",
        record,
        "cfhi_compre_09d_ratio_change___debt_per_giving_unit"
      );

      // debtPerGivingUnit_standard
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerGivingUnit_standard_Client",
        record,
        "cfhi_compre_09f_ratio____std_2_x_contributions_w_o_restrictions_per_giving_unit"
      );

      // debtCoverage
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtCoverage_Client",
        record,
        "cfhi_compre_10_ratio___debt_coverage",
        "cfhi_compre_10_bench_rating___debt_coverage"
      );
    });
  });

  localStorage.removeItem("debtData");
  localStorage.setItem("debtData", JSON.stringify(object));
};

const processIncomeData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // netIncomeRatio [s48, s167, s168, s41]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netIncomeRatio_Peer",
        record,
        "cfhi_compre_11_ratio___net_income_ratio",
        "cfhi_compre_11_yes_no___net_income_ratio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "changeInNetAssetWithout",
        record,
        "s48___change_in_net_asset_without_donor_restriction",
        "cfhi_compre_11_yes_no___net_income_ratio",
        "netIncomeRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_11_yes_no___net_income_ratio",
        "netIncomeRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_11_yes_no___net_income_ratio",
        "netIncomeRatio"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionWithout",
        record,
        "s41___total_contribution_w_o_donor_restriction__other_rev_and_reclasification",
        "cfhi_compre_11_yes_no___net_income_ratio",
        "netIncomeRatio"
      );

      // netIncomeRatio_twoYrAvg
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netIncomeRatio_twoYrAvg_Peer",
        record,
        "cfhi_compre_11_ratio___net_income_ratio"
      );

      // contributionsWithoutDonorPerAverageAdultAttendee [s39, s152, s01]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorPerAverageAdultAttendee_Peer",
        record,
        "cfhi_compre_12a_ratio___contributions_without_donor_restrictions_per_average_adult_attendee",
        "cfhi_compre_12a_yes_no___contributions_without_donor_restrictions_per_average_adult_attendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_compre_12a_yes_no___contributions_without_donor_restrictions_per_average_adult_attendee",
        "contributionsWithoutDonorPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithoutDonor",
        record,
        "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
        "cfhi_compre_12a_yes_no___contributions_without_donor_restrictions_per_average_adult_attendee",
        "contributionsWithoutDonorPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAdultAttendees",
        record,
        "s01_average_adult_attendees_excluding_children",
        "cfhi_compre_12a_yes_no___contributions_without_donor_restrictions_per_average_adult_attendee",
        "contributionsWithoutDonorPerAverageAdultAttendee"
      );

      // contributionsWithoutDonorPerAverageAdultAttendee_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorPerAverageAdultAttendee_percentChange_Peer",
        record,
        "cfhi_compre_12a_ratio___contributions_without_donor_restrictions_per_average_adult_attendee"
      );

      // contributionsWithoutDonorPerGivingUnit [s39, s152, s02]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_Peer",
        record,
        "cfhi_compre_12b_ratio___contributions_without_donor_restrictions_per_giving_unit",
        "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit",
        "contributionsWithoutDonorPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithoutDonor",
        record,
        "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
        "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit",
        "contributionsWithoutDonorPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_compre_12b_yes_no___contributions_without_donor_restrictions_per_giving_unit",
        "contributionsWithoutDonorPerGivingUnit"
      );

      // contributionsWithoutDonorPerGivingUnit_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_percentChange_Peer",
        record,
        "cfhi_compre_12b_ratio___contributions_without_donor_restrictions_per_giving_unit"
      );

      // totalContributionsPerAverageAdultAttendee [s40, s44, s152, s153, s01]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionsPerAverageAdultAttendee_Peer",
        record,
        "cfhi_compre_13a_ratio___total_contributions_per_average_adult_attendee",
        "cfhi_compre_13a_yes_no___total_contributions_per_average_adult_attendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributions",
        record,
        "s40___total_contribution",
        "cfhi_compre_13a_yes_no___total_contributions_per_average_adult_attendee",
        "totalContributionsPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueFromPledge",
        record,
        "s44___revenue_from_pledge",
        "cfhi_compre_13a_yes_no___total_contributions_per_average_adult_attendee",
        "totalContributionsPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithoutDonor",
        record,
        "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
        "cfhi_compre_13a_yes_no___total_contributions_per_average_adult_attendee",
        "totalContributionsPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithDonor",
        record,
        "s153___large_one_time_gift_with_donor_restriction__non_recurring_",
        "cfhi_compre_13a_yes_no___total_contributions_per_average_adult_attendee",
        "totalContributionsPerAverageAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAdultAttendees",
        record,
        "s01_average_adult_attendees_excluding_children",
        "cfhi_compre_13a_yes_no___total_contributions_per_average_adult_attendee",
        "totalContributionsPerAverageAdultAttendee"
      );

      // totalContributionsPerAverageAdultAttendee_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionsPerAverageAdultAttendee_percentChange_Peer",
        record,
        "cfhi_compre_13a_ratio___total_contributions_per_average_adult_attendee"
      );

      // totalContributionsPerGivingUnit [s40, s44, s152, s153, s02]
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionsPerGivingUnit_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit",
        "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributions",
        record,
        "s40___total_contribution",
        "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
        "totalContributionsPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueFromPledge",
        record,
        "s44___revenue_from_pledge",
        "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
        "totalContributionsPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithoutDonor",
        record,
        "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
        "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
        "totalContributionsPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithDonor",
        record,
        "s153___large_one_time_gift_with_donor_restriction__non_recurring_",
        "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
        "totalContributionsPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_compre_13b_yes_no___total_contributions_per_giving_unit",
        "totalContributionsPerGivingUnit"
      );

      // totalContributionsPerGivingUnit_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionsPerGivingUnit_percentChange_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // Name
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdIncome_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdPerGivingUnit_one
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdPerGivingUnit_one_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdPerGivingUnit_two
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdPerGivingUnit_two_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdPerGivingUnit_three
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdPerGivingUnit_three_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdPerGivingUnit_four
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdPerGivingUnit_four_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdPerGivingUnit_five
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdPerGivingUnit_five_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdPerGivingUnit_six
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdPerGivingUnit_six_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdLocalCounty_one
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdLocalCounty_one_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdLocalCounty_two
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdLocalCounty_two_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdLocalCounty_three
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdLocalCounty_three_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdLocalCounty_four
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdLocalCounty_four_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdLocalCounty_five
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdLocalCounty_five_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      // medianHouseholdLocalCounty_six
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdLocalCounty_six_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

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
        "cfhi_compre_11_ratio___net_income_ratio",
        "cfhi_compre_11_bench_ratings___net_income_ratio"
      );

      // netIncomeRatio_twoYrAvg
      insertDataIntoObject(
        "client",
        year,
        object,
        "netIncomeRatio_twoYrAvg_Client",
        record,
        "cfhi_compre_11a_ratio___two_year_net_income_ratio",
        "cfhi_compre_11a_bench_ratings___two_year_net_income_ratio"
      );

      // contributionsWithoutDonorPerAverageAdultAttendee
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorPerAverageAdultAttendee_Client",
        record,
        "cfhi_compre_12a_ratio___contributions_without_donor_restrictions_per_average_adult_attendee"
      );

      // contributionsWithoutDonorPerAverageAdultAttendee_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorPerAverageAdultAttendee_percentChange_Client",
        record,
        "cfhi_compre_12a_ratio_change___contributions_without_donor_restrictions_per_average_adult_attendee",
        "cfhi_compre_12a_bench_ratings___percent_change___contributions_without_donor_restrictions_per_adult"
      );

      // contributionsWithoutDonorPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_Client",
        record,
        "cfhi_compre_12b_ratio___contributions_without_donor_restrictions_per_giving_unit"
      );

      // contributionsWithoutDonorPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_percentChange_Client",
        record,
        "cfhi_compre_12b_ratio_change__contributions_without_donor_restrictions_per_giving_unit",
        "cfhi_compre_12b_bench_ratings___percent_change___contributions_without_donor_restrictions_per_gu"
      );

      // totalContributionsPerAverageAdultAttendee
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerAverageAdultAttendee_Client",
        record,
        "cfhi_compre_13a_ratio___total_contributions_per_average_adult_attendee",
        "cfhi_compre_13a_bench_rating___total_contributions_per_average_adult_attendee"
      );

      // totalContributionsPerAverageAdultAttendee_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerAverageAdultAttendee_percentChange_Client",
        record,
        "cfhi_compre_13a_ratio_change___total_contributions_per_average_adult_attendee",
        "cfhi_compre_13a_bench_rating___total_contributions_per_average_adult_attendee"
      );

      // totalContributionsPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerGivingUnit_Client",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit",
        "cfhi_compre_13b_bench_ratings___percent_change___total_contributions_per_giving_unit"
      );

      // totalContributionsPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerGivingUnit_percentChange_Client",
        record,
        "cfhi_compre_13b_ratio_change___total_contributions_per_giving_unit",
        "cfhi_compre_13b_bench_ratings___percent_change___total_contributions_per_giving_unit"
      );

      // localCountyPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyPerGivingUnit_Client",
        record,
        "cfhi_compre_14_ratio___median_household_income_given_to_church",
        "cfhi_compre_14_bench_rating___median_household_income_given_to_church"
      );

      // localCountyPerGivingUnit_two
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyPerGivingUnit_two_Client",
        record,
        "cfhi_compre_14a_ratio___median_household_income_given_to_church"
      );

      // localCountyPerGivingUnit_three
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyPerGivingUnit_three_Client",
        record,
        "cfhi_compre_14b_ratio___median_household_income_given_to_church"
      );

      // localCountyPerGivingUnit_four
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyPerGivingUnit_four_Client",
        record,
        "cfhi_compre_14c_ratio___median_household_income_given_to_church"
      );

      // localCountyPerGivingUnit_five
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyPerGivingUnit_five_Client",
        record,
        "cfhi_compre_14d_ratio___median_household_income_given_to_church"
      );

      // localCountyPerGivingUnit_six
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyPerGivingUnit_six_Client",
        record,
        "cfhi_compre_14e_ratio___median_household_income_given_to_church"
      );

      // localCountyMedianHouseholdIncome
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyMedianHouseholdIncome_Client",
        record,
        "s54_county_code___data"
      );

      // localCountyMedianHouseholdIncome_two
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyMedianHouseholdIncome_two_Client",
        record,
        "s54_county_code_1054___data"
      );

      // localCountyMedianHouseholdIncome_three
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyMedianHouseholdIncome_three_Client",
        record,
        "s54_county_code_2054___data"
      );

      // localCountyMedianHouseholdIncome_four
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyMedianHouseholdIncome_four_Client",
        record,
        "s54_county_code_3054___data"
      );

      // localCountyMedianHouseholdIncome_five
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyMedianHouseholdIncome_five_Client",
        record,
        "s54_county_code_4054___data"
      );

      // localCountyMedianHouseholdIncome_six
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyMedianHouseholdIncome_six_Client",
        record,
        "s54_county_code_5054___data"
      );

      // localCountyName
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyName_Client",
        record,
        "s54_county_code___county"
      );

      // localCountyName_two
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyName_two_Client",
        record,
        "s54_county_code_1054___county"
      );

      // localCountyName_three
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyName_three_Client",
        record,
        "s54_county_code_2054___county"
      );

      // localCountyName_four
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyName_four_Client",
        record,
        "s54_county_code_3054___county"
      );

      // localCountyName_five
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyName_five_Client",
        record,
        "s54_county_code_4054___county"
      );

      // localCountyName_six
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyName_six_Client",
        record,
        "s54_county_code_5054___county"
      );
    });
  });

  localStorage.removeItem("incomeData");
  localStorage.setItem("incomeData", JSON.stringify(object));
};

const processExpenseData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // benefitsToSalaries
      insertDataIntoObject(
        "peer",
        year,
        object,
        "benefitsToSalaries_Peer",
        record,
        "cfhi_compre_15_ratio___benefits_to_salaries",
        "cfhi_compre_15_yes_no___benefits_to_salaries"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalBenefit",
        record,
        "s11___total_benefit",
        "cfhi_compre_15_yes_no___benefits_to_salaries",
        "benefitsToSalaries"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSalaries",
        record,
        "s10___total_salaries",
        "cfhi_compre_15_yes_no___benefits_to_salaries",
        "benefitsToSalaries"
      );

      // salaries
      insertDataIntoObject(
        "peer",
        year,
        object,
        "salaries_Peer",
        record,
        "cfhi_compre_16_ratio___average_salaries_per_fte",
        "cfhi_compre_16_yes_no___average_salaries_per_fte"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSalaries",
        record,
        "s10___total_salaries",
        "cfhi_compre_16_yes_no___average_salaries_per_fte",
        "salaries"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fullTimeEquivalent",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker",
        "cfhi_compre_16_yes_no___average_salaries_per_fte",
        "salaries"
      );

      // benefits
      insertDataIntoObject(
        "peer",
        year,
        object,
        "benefits_Peer",
        record,
        "cfhi_compre_16_ratio___average_benefits_per_fte",
        "cfhi_compre_16_yes_no___average_benefits_per_fte"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalBenefit",
        record,
        "s11___total_benefit",
        "cfhi_compre_16_yes_no___average_benefits_per_fte",
        "benefits"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fullTimeEquivalent",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker",
        "cfhi_compre_16_yes_no___average_benefits_per_fte",
        "benefits"
      );

      // salariesBenefits
      insertDataIntoObject(
        "peer",
        year,
        object,
        "salariesBenefits_Peer",
        record,
        "cfhi_compre_16_ratio___average_salaries_and_benefits_per_fte",
        "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSalaries",
        record,
        "s10___total_salaries",
        "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte",
        "salariesBenefits"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalBenefit",
        record,
        "s11___total_benefit",
        "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte",
        "salariesBenefits"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fullTimeEquivalent",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker",
        "cfhi_compre_16_yes_no___average_salaries_and_benefits_per_fte",
        "salariesBenefits"
      );

      // salariesBenefitsIncludingOutsourcedEmployees
      insertDataIntoObject(
        "peer",
        year,
        object,
        "salariesBenefitsIncludingOutsourcedEmployees_Peer",
        record,
        "cfhi_compre_16a_ratio___salaries_benefits_outsourced_per_all_emp",
        "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSalaries",
        record,
        "s10___total_salaries",
        "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
        "salariesBenefitsIncludingOutsourcedEmployees"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalBenefit",
        record,
        "s11___total_benefit",
        "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
        "salariesBenefitsIncludingOutsourcedEmployees"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "costOfOutsourcedEmployee",
        record,
        "s162___cost_of_outsourced_employee",
        "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
        "salariesBenefitsIncludingOutsourcedEmployees"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fullTimeEquivalent",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker",
        "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
        "salariesBenefitsIncludingOutsourcedEmployees"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalOutsourcedEmployee",
        record,
        "s157___total_outsourced_employee__fte_",
        "cfhi_compre_16a_yes_no___salaries_benefits_outsourced_per_all_emp",
        "salariesBenefitsIncludingOutsourcedEmployees"
      );

      // personnelToCashExpenditure
      insertDataIntoObject(
        "peer",
        year,
        object,
        "personnelToCashExpenditure_Peer",
        record,
        "cfhi_compre_17_1_ratio__personnel_to_total_cash_expenditures",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalBenefit",
        record,
        "s11___total_benefit",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSalaries",
        record,
        "s10___total_salaries",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_17_1_yes_no___personnel_to_total_cash_expenditures",
        "personnelToCashExpenditure"
      );

      // mandatoryDebtServiceToCashExpenditure
      insertDataIntoObject(
        "peer",
        year,
        object,
        "mandatoryDebtServiceToCashExpenditure_Peer",
        record,
        "cfhi_compre_17_2_ratio___mandatory_debt_to_total_cash_expenditures",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        "mandatoryDebtServiceToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        "mandatoryDebtServiceToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cyInterestExpense",
        record,
        "s47___cy_interest_expense",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        "mandatoryDebtServiceToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        "mandatoryDebtServiceToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        "mandatoryDebtServiceToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        "mandatoryDebtServiceToCashExpenditure"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_17_2_yes_no___mandatory_debt_to_total_cash_expenditures",
        "mandatoryDebtServiceToCashExpenditure"
      );

      // personnelIncludingToTotalCashExpenditures
      insertDataIntoObject(
        "peer",
        year,
        object,
        "personnelIncludingToTotalCashExpenditures_Peer",
        record,
        "cfhi_compre_17_3_ratio___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalBenefit",
        record,
        "s11___total_benefit",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalSalaries",
        record,
        "s10___total_salaries",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "costOfOutsourcedEmployee",
        record,
        "s162___cost_of_outsourced_employee",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_17_3_yes_no___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "personnelIncludingToTotalCashExpenditures"
      );

      // localOutreachExpenses
      insertDataIntoObject(
        "peer",
        year,
        object,
        "localOutreachExpenses_Peer",
        record,
        "cfhi_compre_18_1_ratio___local_outreach_expenses",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "localOutreachExpense",
        record,
        "s14___local_outreach_expense",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses",
        "localOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses",
        "localOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses",
        "localOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses",
        "localOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses",
        "localOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses",
        "localOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_18_1_yes_no___local_outreach_expenses",
        "localOutreachExpenses"
      );

      // globalOutreachExpenses
      insertDataIntoObject(
        "peer",
        year,
        object,
        "globalOutreachExpenses_Peer",
        record,
        "cfhi_compre_18_2_ratio___global_outreach_expenses",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "globalOutreachExpense",
        record,
        "s15___global_outreach_expense",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses",
        "globalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses",
        "globalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses",
        "globalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses",
        "globalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses",
        "globalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses",
        "globalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_18_2_yes_no___global_outreach_expenses",
        "globalOutreachExpenses"
      );

      // totalGlobalAndLocalOutreachExpenses
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalGlobalAndLocalOutreachExpenses_Peer",
        record,
        "cfhi_compre_18_3_ratio___global_local_outreach_expenses",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "localOutreachExpense",
        record,
        "s14___local_outreach_expense",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "globalOutreachExpense",
        record,
        "s15___global_outreach_expense",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_18_3_yes_no___global_local_outreach_expenses",
        "totalGlobalAndLocalOutreachExpenses"
      );

      // cashExpendituresPerAvgAdultAttendee
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashExpendituresPerAvgAdultAttendee_Peer",
        record,
        "cfhi_compre_19_1_ratio___cash_exp_per_adult",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult",
        "cashExpendituresPerAvgAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult",
        "cashExpendituresPerAvgAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult",
        "cashExpendituresPerAvgAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult",
        "cashExpendituresPerAvgAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult",
        "cashExpendituresPerAvgAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult",
        "cashExpendituresPerAvgAdultAttendee"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAdultAttendees",
        record,
        "s01_average_adult_attendees_excluding_children",
        "cfhi_compre_19_1_yes_no___cash_exp_per_adult",
        "cashExpendituresPerAvgAdultAttendee"
      );

      // cashExpendituresPerAvgAdultAttendee_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashExpendituresPerAvgAdultAttendee_percentChange_Peer",
        record,
        "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
      );

      // cashExpendituresPerGivingUnit
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashExpendituresPerGivingUnit_Peer",
        record,
        "cfhi_compre_19_2_ratio___cash_exp_per_gu",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        "cashExpendituresPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        "cashExpendituresPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        "cashExpendituresPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        "cashExpendituresPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        "cashExpendituresPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        "cashExpendituresPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_compre_19_2_yes_no___cash_exp_per_gu",
        "cashExpendituresPerGivingUnit"
      );

      // cashExpendituresPerGivingUnit_percentChange
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashExpendituresPerGivingUnit_percentChange_Peer",
        record,
        "cfhi_compre_09c_ratio___std_2_x_contributions_w_o_restrictions_per_avg_adult_attendee"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // benefitsToSalaries
      insertDataIntoObject(
        "client",
        year,
        object,
        "benefitsToSalaries_Client",
        record,
        "cfhi_compre_15_ratio___benefits_to_salaries"
      );

      // salaries
      insertDataIntoObject(
        "client",
        year,
        object,
        "salaries_Client",
        record,
        "cfhi_compre_16_ratio___average_salaries_per_fte"
      );

      // benefits
      insertDataIntoObject(
        "client",
        year,
        object,
        "benefits_Client",
        record,
        "cfhi_compre_16_ratio___average_benefits_per_fte"
      );

      // salariesBenefits
      insertDataIntoObject(
        "client",
        year,
        object,
        "salariesBenefits_Client",
        record,
        "cfhi_compre_16_ratio___average_salaries_and_benefits_per_fte"
      );

      // salariesBenefitsIncludingOutsourcedEmployees
      insertDataIntoObject(
        "client",
        year,
        object,
        "salariesBenefitsIncludingOutsourcedEmployees_Client",
        record,
        "cfhi_compre_16a_ratio___average_salaries_and_benefits_per_fte___outsourced"
      );

      // personnelToCashExpenditure
      insertDataIntoObject(
        "client",
        year,
        object,
        "personnelToCashExpenditure_Client",
        record,
        "cfhi_compre_17_1_ratio___personnel_to_total_cash_expenditures",
        "cfhi_compre_17_1_bench_rating___personnel_to_total_cash_expenditures"
      );

      // mandatoryDebtServiceToCashExpenditure
      insertDataIntoObject(
        "client",
        year,
        object,
        "mandatoryDebtServiceToCashExpenditure_Client",
        record,
        "cfhi_compre_17_2_ratio___mandatory_debt_to_total_cash_expenditures",
        "cfhi_compre_17_2_bench_rating___mandatory_debt_to_total_cash_expenditures"
      );

      // personnelIncludingToTotalCashExpenditures
      insertDataIntoObject(
        "client",
        year,
        object,
        "personnelIncludingToTotalCashExpenditures_Client",
        record,
        "cfhi_compre_17_3_ratio___mandatory_debt_and_personnel_to_total_cash_expenditures",
        "cfhi_compre_17_3_bench_rating___mandatory_debt_and_personnel_to_total_cash_expenditures"
      );

      // localOutreachExpenses
      insertDataIntoObject(
        "client",
        year,
        object,
        "localOutreachExpenses_Client",
        record,
        "cfhi_compre_18a_ratio___local_outreach_to_total_cash_expend"
      );

      // globalOutreachExpenses
      insertDataIntoObject(
        "client",
        year,
        object,
        "globalOutreachExpenses_Client",
        record,
        "cfhi_compre_18b_ratio___global_outreach_to_total_cash_expend"
      );

      // totalGlobalAndLocalOutreachExpenses
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalGlobalAndLocalOutreachExpenses_Client",
        record,
        "cfhi_compre_18c_ratio___total_outreach_to_total_cash_expend",
        "cfhi_compre_18c_bench_rating___total_outreach_to_total_cash_expend"
      );

      // cashExpendituresPerAvgAdultAttendee
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashExpendituresPerAvgAdultAttendee_Client",
        record,
        "cfhi_compre_19a_ratio___cash_exp_per_average_adult"
      );

      // cashExpendituresPerAvgAdultAttendee_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashExpendituresPerAvgAdultAttendee_percentChange_Client",
        record,
        "cfhi_compre_19a_ratio_change___cash_exp_per_average_adult"
      );

      // cashExpendituresPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashExpendituresPerGivingUnit_Client",
        record,
        "cfhi_compre_19b_ratio___cash_exp_per_giving_unit"
      );

      // cashExpendituresPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashExpendituresPerGivingUnit_percentChange_Client",
        record,
        "cfhi_compre_19b_ratio_change___cash_exp_per_giving_unit"
      );
    });
  });

  localStorage.removeItem("expenseData");
  localStorage.setItem("expenseData", JSON.stringify(object));
};

const processAdditionalData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // contributionsPerAccountingFTE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsPerAccountingFTE_Peer",
        record,
        "cfhi_compre_20_ratio___contributions_per_acct_fte",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributions",
        record,
        "s40___total_contribution",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        "contributionsPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueFromPledge",
        record,
        "s44___revenue_from_pledge",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        "contributionsPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithoutDonor",
        record,
        "s152___large_one_time_gift_without_donor_retriction__non_recurring_",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        "contributionsPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "largeOneTimeGiftWithDonor",
        record,
        "s153___large_one_time_gift_with_donor_restriction__non_recurring_",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        "contributionsPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAnnualAccountingDepartment",
        record,
        "s158___average_annual_accounting_department_full_time_employee",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        "contributionsPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "accountingDepartmentPartTimeEmployee",
        record,
        "s159___accounting_department_part_time_employee",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        "contributionsPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "accountingDepartmentVolunteer",
        record,
        "s160___accounting_department_volunteer",
        "cfhi_compre_20_yes_no___contributions_per_acct_fte",
        "contributionsPerAccountingFTE"
      );

      // expensesPerAccountingFTE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "expensesPerAccountingFTE_Peer",
        record,
        "cfhi_compre_21_ratio___expenses_per_acct_fte",
        "cfhi_compre_21_yes_no___expenses_per_acct_fte"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_21_yes_no___expenses_per_acct_fte",
        "expensesPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_21_yes_no___expenses_per_acct_fte",
        "expensesPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_21_yes_no___expenses_per_acct_fte",
        "expensesPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "averageAnnualAccountingDepartment",
        record,
        "s158___average_annual_accounting_department_full_time_employee",
        "cfhi_compre_21_yes_no___expenses_per_acct_fte",
        "expensesPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "accountingDepartmentPartTimeEmployee",
        record,
        "s159___accounting_department_part_time_employee",
        "cfhi_compre_21_yes_no___expenses_per_acct_fte",
        "expensesPerAccountingFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "accountingDepartmentVolunteer",
        record,
        "s160___accounting_department_volunteer",
        "cfhi_compre_21_yes_no___expenses_per_acct_fte",
        "expensesPerAccountingFTE"
      );

      // facilitiesExpenseToTotalCashExpenditures_lessThanTen
      insertDataIntoObject(
        "peer",
        year,
        object,
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen_Peer",
        record,
        "cfhi_compre_22a_ratio___facilties_to_total_cash_exp_less_than_10",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalMaintenanceOccupancyCost",
        record,
        "s12___total_maint___occupancy_cost",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "accountingDepartmentVolunteer",
        record,
        "s160___accounting_department_volunteer",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_22a_yes_no___facilties_to_total_cash_exp_less_than_10",
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen"
      );

      // facilitiesExpenseToTotalCashExpenditures_greaterThanTen
      insertDataIntoObject(
        "peer",
        year,
        object,
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen_Peer",
        record,
        "cfhi_compre_22b_ratio___facilties_to_total_cash_exp_more_than_10",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalMaintenanceOccupancyCost",
        record,
        "s12___total_maint___occupancy_cost",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "amortizationFinanceLease",
        record,
        "s167___amortization_of_finance_lease_right_of_use_asset",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_compre_22b_yes_no___facilties_to_total_cash_exp_more_than_10",
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen"
      );

      // facilityCostPerSquareFootExcluding_lessThanTen
      insertDataIntoObject(
        "peer",
        year,
        object,
        "facilityCostPerSquareFootExcluding_lessThanTen_Peer",
        record,
        "cfhi_compre_23a_ratio___facility_cost_squarefoot_no_interest_less_than_10",
        "cfhi_compre_23a_yes_no___facility_cost_squarefoot_no_interest_less_than_10"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalMaintenanceOccupancyCost",
        record,
        "s12___total_maint___occupancy_cost",
        "cfhi_compre_23a_yes_no___facility_cost_squarefoot_no_interest_less_than_10",
        "facilityCostPerSquareFootExcluding_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalFacilitySquareFootage",
        record,
        "s08___total_facility_square_footage",
        "cfhi_compre_23a_yes_no___facility_cost_squarefoot_no_interest_less_than_10",
        "facilityCostPerSquareFootExcluding_lessThanTen"
      );

      // facilityCostPerSquareFootExcluding_greaterThanTen
      insertDataIntoObject(
        "peer",
        year,
        object,
        "facilityCostPerSquareFootExcluding_greaterThanTen_Peer",
        record,
        "cfhi_compre_23b_ratio___facility_cost_squarefoot_no_interest_more_than_10",
        "cfhi_compre_23b_yes_no___facility_cost_squarefoot_no_interest_more_than_10"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalMaintenanceOccupancyCost",
        record,
        "s12___total_maint___occupancy_cost",
        "cfhi_compre_23b_yes_no___facility_cost_squarefoot_no_interest_more_than_10",
        "facilityCostPerSquareFootExcluding_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalFacilitySquareFootage",
        record,
        "s08___total_facility_square_footage",
        "cfhi_compre_23b_yes_no___facility_cost_squarefoot_no_interest_more_than_10",
        "facilityCostPerSquareFootExcluding_greaterThanTen"
      );

      // facilityCostPerSquareFootIncluding_lessThanTen
      insertDataIntoObject(
        "peer",
        year,
        object,
        "facilityCostPerSquareFootIncluding_lessThanTen_Peer",
        record,
        "cfhi_compre_24a_ratio___facility_cost_squarefoot_with_interest_less_than_10",
        "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalMaintenanceOccupancyCost",
        record,
        "s12___total_maint___occupancy_cost",
        "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
        "facilityCostPerSquareFootIncluding_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cyInterestExpense",
        record,
        "s47___cy_interest_expense",
        "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
        "facilityCostPerSquareFootIncluding_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
        "facilityCostPerSquareFootIncluding_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
        "facilityCostPerSquareFootIncluding_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
        "facilityCostPerSquareFootIncluding_lessThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalFacilitySquareFootage",
        record,
        "s08___total_facility_square_footage",
        "cfhi_compre_24a_yes_no___facility_cost_squarefoot_with_interest_less_than_10",
        "facilityCostPerSquareFootIncluding_lessThanTen"
      );

      // facilityCostPerSquareFootIncluding_greaterThanTen
      insertDataIntoObject(
        "peer",
        year,
        object,
        "facilityCostPerSquareFootIncluding_greaterThanTen_Peer",
        record,
        "cfhi_compre_24b_ratio___facility_cost_squarefoot_with_interest_more_than_10",
        "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalMaintenanceOccupancyCost",
        record,
        "s12___total_maint___occupancy_cost",
        "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
        "facilityCostPerSquareFootIncluding_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cyInterestExpense",
        record,
        "s47___cy_interest_expense",
        "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
        "facilityCostPerSquareFootIncluding_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "internetOnFinanceLease",
        record,
        "s168___internet_on_finance_lease_right_of_use_lease_liabilitie",
        "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
        "facilityCostPerSquareFootIncluding_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "requiredMinimumDebtPrinciple",
        record,
        "s154___required_minimum_debt_principal_payment_for_the_next_year_",
        "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
        "facilityCostPerSquareFootIncluding_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "futureMinimumLeasePayment",
        record,
        "s166___future_minimum_lease_payment",
        "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
        "facilityCostPerSquareFootIncluding_greaterThanTen"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalFacilitySquareFootage",
        record,
        "s08___total_facility_square_footage",
        "cfhi_compre_24b_yes_no___facility_cost_squarefoot_with_interest_more_than_10",
        "facilityCostPerSquareFootIncluding_greaterThanTen"
      );

      // informationTechnologyCostPerFTE
      insertDataIntoObject(
        "peer",
        year,
        object,
        "informationTechnologyCostPerFTE_Peer",
        record,
        "cfhi_compre_25_ratio___it_cost_per_fte",
        "cfhi_compre_25_yes_no___it_cost_per_fte"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "itCost",
        record,
        "s13___it_cost",
        "cfhi_compre_25_yes_no___it_cost_per_fte",
        "informationTechnologyCostPerFTE"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "fullTimeEquivalent",
        record,
        "s151___church_only_full_time_equivalent_excluding_childcare_worker",
        "cfhi_compre_25_yes_no___it_cost_per_fte",
        "informationTechnologyCostPerFTE"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // contributionsPerAccountingFTE
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsPerAccountingFTE_Client",
        record,
        "cfhi_compre_20_ratio___contributions_per_accounting_fte"
      );

      // expensesPerAccountingFTE
      insertDataIntoObject(
        "client",
        year,
        object,
        "expensesPerAccountingFTE_Client",
        record,
        "cfhi_compre_21_ratio___expenses_per_accounting_fte"
      );

      // facilitiesExpenseToTotalCashExpenditures_lessThanTen
      insertDataIntoObject(
        "client",
        year,
        object,
        "facilitiesExpenseToTotalCashExpenditures_lessThanTen_Client",
        record,
        "cfhi_compre_22_value_under10___facilities_expenses_of_total_cash_expend",
        "cfhi_compre_22_rating_under10___facilities_expenses_of_total_cash_expend"
      );

      // facilitiesExpenseToTotalCashExpenditures_greaterThanTen
      insertDataIntoObject(
        "client",
        year,
        object,
        "facilitiesExpenseToTotalCashExpenditures_greaterThanTen_Client",
        record,
        "cfhi_compre_22_value_over10___facilities_expenses_of_total_cash_expend",
        "cfhi_compre_22_rating_over10___facilities_expenses_of_total_cash_expend"
      );

      // facilityCostPerSquareFootExcluding_lessThanTen
      insertDataIntoObject(
        "client",
        year,
        object,
        "facilityCostPerSquareFootExcluding_lessThanTen_Client",
        record,
        "cfhi_compre_23_value_under10___facility_cost_per_square_foot__excluding_interest_expense_"
      );

      // facilityCostPerSquareFootExcluding_greaterThanTen
      insertDataIntoObject(
        "client",
        year,
        object,
        "facilityCostPerSquareFootExcluding_greaterThanTen_Client",
        record,
        "cfhi_compre_23_value_over10___facility_cost_per_square_foot__excluding_interest_expense_"
      );

      // facilityCostPerSquareFootIncluding_lessThanTen
      insertDataIntoObject(
        "client",
        year,
        object,
        "facilityCostPerSquareFootIncluding_lessThanTen_Client",
        record,
        "cfhi_compre_24_value_under10___facility_cost_per_square_foot__including_principal_and_interest_expense_"
      );

      // facilityCostPerSquareFootIncluding_greaterThanTen
      insertDataIntoObject(
        "client",
        year,
        object,
        "facilityCostPerSquareFootIncluding_greaterThanTen_Client",
        record,
        "cfhi_compre_24_value_over10___facility_cost_per_square_foot__including_principal_and_interest_expense_"
      );

      // informationTechnologyCostPerFTE
      insertDataIntoObject(
        "client",
        year,
        object,
        "informationTechnologyCostPerFTE_Client",
        record,
        "cfhi_compre_25_ratio___information_technology_cost_per_fte"
      );
    });
  });

  localStorage.removeItem("additionalData");
  localStorage.setItem("additionalData", JSON.stringify(object));
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const addColumnsToOtherRows = (idName, year) => {
  const rows = document.querySelectorAll(`#${idName} + tbody tr`);

  rows.forEach((row) => {
    const tdElement = document.createElement("td");
    // You can customize the content of the new columns as needed
    tdElement.textContent = "New Data"; // Change this line accordingly
    row.appendChild(tdElement);
  });
};

const runApiMain = () => {
  const run_btn = document.querySelector("#run");

  run_btn.addEventListener("click", async () => {
    try {
      const selectedYears = getSelectedYearsFromLocalStorage();

      // After processing, save selectedYears_Set to localStorage
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));

      const recordsPeer = await getRecordsForPeer(
        selectedYearsArray,
        "<qdbapi>"
      );
      const recordsClient = await getRecordsForClient(
        selectedYearsArray,
        "<qdbapi>"
      );
      console.log(recordsPeer);
      console.log("PEER", recordsPeer[0].children);
      console.log("CLIENT", recordsClient[0].children);
      //recordsPeer.forEach(record => console.log(record))
      //console.log(recordsClient)d

      processDemoData(selectedYears, recordsPeer, recordsClient);
      processCashData(selectedYears, recordsPeer, recordsClient);
      processDebtData(selectedYears, recordsPeer, recordsClient);
      processIncomeData(selectedYears, recordsPeer, recordsClient);
      processExpenseData(selectedYears, recordsPeer, recordsClient);
      processAdditionalData(selectedYears, recordsPeer, recordsClient);
      displayDemoComponent();
      displayCashComponent();
      displayDebtComponent();
      displayIncomeComponent();
      displayExpenseComponent();
      displayReportComponent();
    } catch (err) {
      console.error(err);
    }
  });
};

const getParsedData = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc.querySelectorAll("record");
};

const getRecordsForPeer = async (years, dataStr) => {
  if (years.length === 0) {
    // Base case: return the final string when the array is empty
    const parsedData = getParsedData(dataStr + "</qdbapi>");
    return parsedData;
  }

  const currentYear = years[0];
  const apiCallPeerData = {
    act: "API_DoQuery",
    query: `
    {195.EX.${currentYear}} AND 
    {123.GTE.${sliderValue}} AND 
    {123.LTE.${sliderValue2}} AND 
    {193.EX.'Comprehensive'} AND
    ( {267.EX.${selectedRegions_Array[0]}} OR {267.EX.${selectedRegions_Array[1]}} OR {267.EX.${selectedRegions_Array[2]}} OR {267.EX.${selectedRegions_Array[3]}} OR {267.EX.${selectedRegions_Array[4]}} OR {267.EX.${selectedRegions_Array[5]}} OR {267.EX.${selectedRegions_Array[6]}} ) AND 
    ( {268.EX.${selectedSites_Array[0]}} OR {268.EX.${selectedSites_Array[1]}} OR {268.EX.${selectedSites_Array[2]}} ) AND
  `,
    clist:
      "195.123.122.135.136.226.160.137.161.176.354.170.129.174.252.253.254.255.256.257.258.259.260.261.262.263.264.265.405.239.156.158.149.142.143.153.155.164.162.132.131.141.140.171.172.173.157.181.182.165.179.145.147.169.138.168.139.180.177.152.150.151.154.166.167.163.175.178.133.227.228.229.230.231.232.233.234.235.144.146.159.148.236.237.238.239.240.241.242.243.244.245.246.247.248.249.250.251.267.268.271.274.273.276.277.278.279.280.281.282.283.134.284.286.287.288.289.290.291.324.325.326.327.328.352.329.353.330.331.332.333.334.335.406.240.167.181.356.162.241.137.122.357.242.123.358.243.161.163.138.359.244.361.245.365.273.136.363.274.364.249.366.170.367.250.164.181.182.139.180.165.368.251.166.369.271.175.370.277.142.371.278.140.372.279.141.373.280.374.281.375.282.173.376.283.377.284.133.378.286.379.287.129.380.288.381.289.382.290.383.291.178",
  };

  try {
    const xml = await $.get(peerData, apiCallPeerData);
    const recordsForPeer = $("record", xml).toArray();

    // Update dataStr with the records from the current API call
    console.log(`year - ${currentYear}`);
    recordsForPeer.forEach((record, index) => {
      // Create a new record element
      if (index < 6) console.log(record);
      const newRecord = document.createElement("record");

      // Append each child element to the new record
      Array.from(record.children).forEach((child) => {
        newRecord.appendChild(child.cloneNode(true));
      });

      // Append the new record's outerHTML to dataStr
      dataStr += newRecord.outerHTML;
    });

    // Recursive call with updated years and dataStr
    return getRecordsForPeer(years.slice(1), dataStr);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error as needed
    return dataStr; // Return the accumulated data so far even in case of an error
  }
};

const getRecordsForClient = async (years, dataStr) => {
  if (years.length === 0) {
    // Base case: return the final string when the array is empty
    const parsedData = getParsedData(dataStr + "</qdbapi>");
    return parsedData;
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
    const xml = await $.get(clientData, apiCallClientData);
    const recordsForClient = $("record", xml).toArray();

    //console.log('recordsForClient', recordsForClient[0].children)
    //console.log($('record', xml))
    //console.log(`year - ${currentYear}`)

    // Update dataStr with the records from the current API call
    recordsForClient.forEach((record, index) => {
      if (index < 4) console.log(`Client`, record);

      // Create a new record element
      const newRecord = document.createElement("record");

      // Append each child element to the new record
      Array.from(record.children).forEach((child) => {
        newRecord.appendChild(child.cloneNode(true));
      });

      // Append the new record's outerHTML to dataStr
      dataStr += newRecord.outerHTML;
    });

    // Recursive call with updated years and dataStr
    return getRecordsForClient(years.slice(1), dataStr);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error as needed
    return dataStr; // Return the accumulated data so far even in case of an error
  }
};
