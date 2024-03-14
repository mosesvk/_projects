async function fetchClientData() {
  try {
    const response = await fetch('./data/clientData.xml');
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return xmlDoc.querySelectorAll('record');
  } catch (error) {
    console.error('Error fetching XML file:', error);
    return [];
  }
}

async function fetchPeerData() {
  try {
    const response = await fetch('./data/peerData.xml');
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return xmlDoc.querySelectorAll('record');
  } catch (error) {
    console.error('Error fetching XML file:', error);
    return [];
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData();

  console.log(recordsClient);

  findUniqueYears(recordsClient);

  addUniqueRegionsToOptionsSelectRegion(regions_Array);
  addUniqueSitesToOptionsSelectSite(sites_Array);

  displayDemoComponent();
  displayCashComponent();
  displayDebtComponent();
  displayIncomeComponent();
  displayExpenseComponent();

  displayReportComponent();

  runApiMain(recordsPeer, recordsClient);
});

const findUniqueYears = (data) => {
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
};

const insertDataIntoObject = (
  type,
  year,
  object,
  dataKey,
  record,
  child,
  dynamicValueClientPeer,
  name,
  paragraph
) => {
  // console.log({
  //   type,
  //   year,
  //   object,
  //   dataKey,
  //   record,
  //   child,
  //   dynamicValueClientPeer,
  //   name,
  // });

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

    const yesNoField = dynamicValueClientPeer
      ? record.querySelector(dynamicValueClientPeer).textContent.trim()
      : "empty";

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
    } else if (yesNoField == "empty") {
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
        object[dataKey]["total"].push(0);
      } else {
        if (!object[dataKey][name]) {
          object[dataKey][name] = [];
        }
        object[dataKey][name].push(0);
      }
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
      
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
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

      // debtPerGivingUnit_standard
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerGivingUnit_standard_Client",
        record,
        "cfhi_compre_09f_ratio____std_2_x_contributions_w_o_restrictions_per_giving_unit"
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

      // medianHouseholdPerGivingUnit
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

      // medianHouseholdLocalCounty_one
      insertDataIntoObject(
        "peer",
        year,
        object,
        "medianHouseholdLocalCounty_one_Peer",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit"
      );

      
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // contributionsWithoutDonorPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_Client",
        record,
        "cfhi_compre_12b_ratio___contributions_without_donor_restrictions_per_giving_unit",
        "cfhi_compre_12b_bench_ratings___percent_change___contributions_without_donor_restrictions_per_gu"
      );
      // contributionsWithoutDonorPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_percentChange_Client",
        record,
        "cfhi_compre_12b_ratio_change__contributions_without_donor_restrictions_per_giving_unit"
      );
      // totalContributionsPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerGivingUnit_Client",
        record,
        "cfhi_compre_13b_ratio___total_contributions_per_giving_unit",
        "cfhi_compre_13b_ratio_change___total_contributions_per_giving_unit"
      );
      // totalContributionsPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerGivingUnit_percentChange_Client",
        record,
        "cfhi_compre_14_ratio___median_household_income_given_to_church"
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

      // localCountyMedianHouseholdIncome
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyMedianHouseholdIncome_Client",
        record,
        "s54_county_code___data"
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

    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("s52_formatted_year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
     

      // cashExpendituresPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "cashExpendituresPerGivingUnit_Client",
        record,
        "cfhi_compre_19b_ratio___cash_exp_per_giving_unit"
      );

    });
  });

  localStorage.removeItem("expenseData");
  localStorage.setItem("expenseData", JSON.stringify(object));
};

const addColumnsToOtherRows = (idName, year) => {
  const rows = document.querySelectorAll(`#${idName} + tbody tr`);

  rows.forEach((row) => {
    const tdElement = document.createElement("td");
    // You can customize the content of the new columns as needed
    tdElement.textContent = "New Data"; // Change this line accordingly
    row.appendChild(tdElement);
  });
};

const runApiMain = (recordsPeer, recordsClient) => {
  const run_btn = document.querySelector("#run");

  run_btn.addEventListener("click", () => {
    try {
      const selectedYears = getSelectedYearsFromLocalStorage();

      // After processing, save selectedYears_Set to localStorage
      const selectedYearsArray = Array.from(selectedYears_Set).sort(
        (a, b) => a - b
      );
      localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));

      processDemoData(selectedYears, recordsPeer, recordsClient);
      processCashData(selectedYears, recordsPeer, recordsClient);
      processDebtData(selectedYears, recordsPeer, recordsClient);
      processIncomeData(selectedYears, recordsPeer, recordsClient);
      processExpenseData(selectedYears, recordsPeer, recordsClient);

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
