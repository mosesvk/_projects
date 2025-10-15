async function fetchClientData() {
  try {
    const response = await fetch("./data/clientData.xml");
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    return xmlDoc.querySelectorAll("record");
  } catch (error) {
    console.error("Error fetching XML file:", error);
    return [];
  }
}

async function fetchPeerData() {
  try {
    const response = await fetch("./data/peerData.xml");
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    return xmlDoc.querySelectorAll("record");
  } catch (error) {
    console.error("Error fetching XML file:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
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

  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData();

  // console.log(recordsClient);

  findUniqueYears(recordsClient);

  addUniqueRegionsToOptionsSelectRegion(regions_Array);
  addUniqueSitesToOptionsSelectSite(sites_Array);

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
  console.log({ type, year, object, dataKey, record, child, dynamicValueClientPeer, name});

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
        "cfhi_stand_00a_yes_no___giving_units"
      );

      // contributionsWithoutDonorExcludingLargeGifts
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorExcludingLargeGifts_Peer",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_stand_00a_yes_no___giving_units"
      );

      // totalContributionsExclude
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionsExclude_Peer",
        record,
        "s40___total_contribution",
        "cfhi_stand_00b_yes_no___total_contributions"
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
        "s39___contribution_without_donor_retriction"
      );
      // totalContributionsExclude
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsExclude_Client",
        record,
        "s40___total_contribution"
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
      // daysOperatingCash   ((s18 + s20) / (s45 - s46)) * 365
      insertDataIntoObject(
        "peer",
        year,
        object,
        "daysOperatingCash_Peer",
        record,
        "cfhi_stand_01_ratio___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
        "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCash",
        record,
        "s18___total_cash",
        "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "nonEndowmentInvestment",
        record,
        "s20___non_endowment_investment",
        "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
        "daysOperatingCash"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_stand_01_yes_no___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
        "daysOperatingCash"
      );

      // netCashAvailability  s18 + s20 - s26 + s31
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netCashAvailability_Peer",
        record,
        "cfhi_stand_02_ratio___net_cash_availability",
        "cfhi_stand_02_yes_no___net_cash_availability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalCash",
        record,
        "s18___total_cash",
        "cfhi_stand_02_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "nonEndowmentInvestment",
        record,
        "s20___non_endowment_investment",
        "cfhi_stand_02_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "currentLiabilities",
        record,
        "s26___current_liabilities",
        "cfhi_stand_02_yes_no___net_cash_availability",
        "netCashAvailability"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "shortTermConstructionLineOfCredit",
        record,
        "s31___short_term_construction_line_of_credit",
        "cfhi_stand_02_yes_no___net_cash_availability",
        "netCashAvailability"
      );

      // netCashAvailability_standard .083333 * (s45 - s46)
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netCashAvailability_standard_Peer",
        record,
        "cfhi_stand_02a_ratio___one_month_of_cash_expenses",
        "cfhi_stand_02a_yes_no___one_month_of_cash_expenses"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_stand_02a_yes_no___one_month_of_cash_expenses",
        "netCashAvailability_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_stand_02a_yes_no___one_month_of_cash_expenses",
        "netCashAvailability_standard"
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
        "cfhi_stand_01_ratio___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures",
        "cfhi_stand_01_bench_rating___days_oper_cash_and_inv_on_hand_to_fund_annual_expenditures"
      );

      // netCashAvailability
      insertDataIntoObject(
        "client",
        year,
        object,
        "netCashAvailability_Client",
        record,
        "cfhi_stand_02_ratio___net_cash_availability",
        "cfhi_stand_02_bench_rating___net_cash_availability"
      );

      // netCashAvailability_standard
      insertDataIntoObject(
        "client",
        year,
        object,
        "netCashAvailability_standard_Client",
        record,
        "cfhi_stand_02a_ratio___one_month_of_cash_expenses"
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
      // debtToContributionsWithout  s32 / s39
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtToContributionsWithout_Peer",
        record,
        "cfhi_stand_03_ratio___debt_to_contribution_w_o_donor_rest",
        "cfhi_stand_03_yes_no___debt_to_contribution_w_o_donor_rest"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDebt",
        record,
        "s32___total_debt",
        "cfhi_stand_03_yes_no___debt_to_contribution_w_o_donor_rest",
        "debtToContributionsWithout"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_stand_03_yes_no___debt_to_contribution_w_o_donor_rest",
        "debtToContributionsWithout"
      );

      // debtPerGivingUnit  s32 / s02
      insertDataIntoObject(
        "peer",
        year,
        object,
        "debtPerGivingUnit_Peer",
        record,
        "cfhi_stand_04_ratio___debt_per_givingunit",
        "cfhi_stand_04_yes_no___debt_per_givingunit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDebt",
        record,
        "s32___total_debt",
        "cfhi_stand_04_yes_no___debt_per_givingunit",
        "debtPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_stand_04_yes_no___debt_per_givingunit",
        "debtPerGivingUnit"
      );
      
      // contributionsWithoutDonorPerGivingUnit_standard  2 * (s39 / s02)
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_standard_Peer",
        record,
        "cfhi_stand_04a_ratio___2_x_contributions_w_o_donor_restrictions_per_giving_unit",
        "cfhi_stand_04a_yes_no___2_x_contributions_w_o_donor_restrictions_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_stand_04a_yes_no___2_x_contributions_w_o_donor_restrictions_per_giving_unit",
        "contributionsWithoutDonorPerGivingUnit_standard"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_stand_04a_yes_no___2_x_contributions_w_o_donor_restrictions_per_giving_unit",
        "contributionsWithoutDonorPerGivingUnit_standard"
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
        "cfhi_stand_03_ratio___debt_to_contribution_w_o_donor_rest",
        "cfhi_stand_03_bench_rating___debt_to_contribution_w_o_donor_rest"
      );

      // debtPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerGivingUnit_Client",
        record,
        "cfhi_stand_04_ratio___debt_per_givingunit",
        "cfhi_stand_04_bench_rating___debt_per_givingunit"
      );

      // debtPerGivingUnit_standard
      insertDataIntoObject(
        "client",
        year,
        object,
        "debtPerGivingUnit_standard_Client",
        record,
        "cfhi_stand_04a_ratio___2_x_contributions_w_o_donor_restrictions_per_giving_unit"
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
      // contributionsWithoutDonorPerGivingUnit s39/s02
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_Peer",
        record,
        "cfhi_stand_05_ratio___contribution_w_o_donor_restriction_per_giving_unit",
        "cfhi_stand_05_yes_no___contribution_w_o_donor_restriction_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "contributionWithoutDonor",
        record,
        "s39___contribution_without_donor_retriction",
        "cfhi_stand_05_yes_no___contribution_w_o_donor_restriction_per_giving_unit",
        "contributionsWithoutDonorPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_stand_05_yes_no___contribution_w_o_donor_restriction_per_giving_unit",
        "contributionsWithoutDonorPerGivingUnit"
      );

      // totalContributionsPerGivingUnit s40 / s02
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributionsPerGivingUnit_Peer",
        record,
        "cfhi_stand_06_ratio___total_contributions_per_giving_unit",
        "cfhi_stand_06_yes_no___total_contributions_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalContributions",
        record,
        "s40___total_contribution",
        "cfhi_stand_06_yes_no___total_contributions_per_giving_unit",
        "totalContributionsPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_stand_06_yes_no___total_contributions_per_giving_unit",
        "totalContributionsPerGivingUnit"
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
        "cfhi_stand_05_ratio___contribution_w_o_donor_restriction_per_giving_unit"
      );
      // contributionsWithoutDonorPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "contributionsWithoutDonorPerGivingUnit_percentChange_Client",
        record,
        "cfhi_stand_05a_ratio_change___contribution_w_o_donor_restriction_per_giving_unit",
        "cfhi_stand_05a_bench_rating__percent_change___contribution_w_o_donor_restriction_per_giving_unit"
      );
      // totalContributionsPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerGivingUnit_Client",
        record,
        "cfhi_stand_06_ratio___total_contributions_per_giving_unit"
      );
      // totalContributionsPerGivingUnit_percentChange
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalContributionsPerGivingUnit_percentChange_Client",
        record,
        "cfhi_stand_06a_ratio_change__total_contributions_per_giving_unit",
        "cfhi_stand_06a_bench_rating___percentage_change__total_contributions_per_giving_unit"
      );

      // localCountyPerGivingUnit
      insertDataIntoObject(
        "client",
        year,
        object,
        "localCountyPerGivingUnit_Client",
        record,
        "cfhi_stand_07_ratio___median_household_income_given_to_the_church"
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
      // cashExpendituresPerGivingUnit (s45-s46)/s02
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cashExpendituresPerGivingUnit_Peer",
        record,
        "cfhi_stand_08_ratio___cash_expenses_per_giving_unit",
        "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalExpense",
        record,
        "s45___total_expense",
        "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit",
        "cashExpendituresPerGivingUnit"
      );
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalDepreciationExpense",
        record,
        "s46___total_depreciation_expense",
        "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit",
        "cashExpendituresPerGivingUnit"
      );

      insertDataIntoObject(
        "peer",
        year,
        object,
        "givingUnits",
        record,
        "s02___giving_units",
        "cfhi_stand_08_yes_no___cash_expenses_per_giving_unit",
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
        "cfhi_stand_08_ratio___cash_expenses_per_giving_unit"
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
