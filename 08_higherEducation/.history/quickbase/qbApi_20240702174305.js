let apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: `{533.EX.${ClientRid}}`,
  clist: "533.7.539"
};

$.get(clientData, apiCallClientDataForUniqueYears)
  .then(async (xml) => {
    recordsClient = await $("record", xml).toArray();

    // consozle.log(recordsClient[0]);

    const firmName =
      recordsClient[0].querySelector("merged_client_name").textContent;
    document.getElementById("firmName").textContent = firmName;

    // console.log(recordsClient[0].children)

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
  getRecordsForUniqueClientsPeerNames();

  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);

  addUniqueStatesToOptionsSelectStatesDropdown(states_Array);

  addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);

  addUniqueTypesToOptionsSelectTypesDropdown(types_Array);

  addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);

  addUniqueTrendlinesToOptionsSelectTrendlinesDropdown(trendlines_Array);
});

const findUniqueYears = (data) => {
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

    //nav-component
    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////

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

const processFinancialAnalysisContentData = (
  years,
  recordsPeer,
  recordsClient
) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // totalLiabilities
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalLiabilities_Peer",
        record,
        "r016_ctotal_liabilities",
        "Yes"
      );

      // totalAssets
      insertDataIntoObject(
        "peer",
        year,
        object,
        "totalAssets_Peer",
        record,
        "r008_ctotal_assets",
        "Yes"
      );

      // SOURCE OF INCOME ---------------------------------->

      // revenueTuitionAndFees
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueTuitionAndFees_Peer",
        record,
        "r023_revenue_tuition_and_fees",
        "Yes"
      );

      // revenueAuxiliaryActivities
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueAuxiliaryActivities_Peer",
        record,
        "r028_revenue_auxiliary_activities",
        "Yes"
      );

      // revenueContributions
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueContributions_Peer",
        record,
        "r033_revenue_contributions",
        "Yes"
      );

      // revenueInvestmentIncome
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueInvestmentIncome_Peer",
        record,
        "r029_revenue_investment_income",
        "Yes"
      );

      // revenueOther
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueOther_Peer",
        record,
        "r031_revenue_other",
        "Yes"
      );

      // Financial Flow Analysis ---------------------------------->

      // // ffa_revenueTuitionAndFees_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_revenueTuitionAndFees_Peer',
      //   record,
      //   'r023_revenue_tuition_and_fees',
      //   'Yes'
      // );

      // // ffa_revenueScholarshipsAndFinancialAid_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_revenueScholarshipsAndFinancialAid_Peer',
      //   record,
      //   'r024_revenue_scholarships_and_financial_aid',
      //   'Yes'
      // );

      // // ffa_revenueContributions_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_revenueContributions_Peer',
      //   record,
      //   'r035_ctotal_revenue_from_contributions',
      //   'Yes'
      // );

      // // ffa_revenueAuxiliaryActivities_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_revenueAuxiliaryActivities_Peer',
      //   record,
      //   'r028_revenue_auxiliary_activities',
      //   'Yes'
      // );

      // // ffa_revenueOther_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_revenueOther_Peer',
      //   record,
      //   'r031_revenue_other',
      //   'Yes'
      // );

      // // ffa_revenueInvestmentIncome_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_revenueInvestmentIncome_Peer',
      //   record,
      //   'r029_revenue_investment_income',
      //   'Yes'
      // );

      // // ffa_revenueEndowmentSpendingAppropriation_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_revenueEndowmentSpendingAppropriation_Peer',
      //   record,
      //   'r030_revenue_endowment_spending_appropriation',
      //   'Yes'
      // );

      // // ffa_contributions_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_contributions_Peer',
      //   record,
      //   'r054_contributions',
      //   'Yes'
      // );

      // // ffa_salariesAndWages_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_salariesAndWages_Peer',
      //   record,
      //   'r160_salaries_and_wages',
      //   'Yes'
      // );

      // // ffa_employeeBenefits_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_employeeBenefits_Peer',
      //   record,
      //   'r161_employee_benefits',
      //   'Yes'
      // );

      // // ffa_servicesSuppliesAndOther_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_servicesSuppliesAndOther_Peer',
      //   record,
      //   'r162_services_supplies_and_other',
      //   'Yes'
      // );

      // // ffa_occupancyUtilitiesAndMaintenance_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_occupancyUtilitiesAndMaintenance_Peer',
      //   record,
      //   'r163_occupancy_utilities_and_maintenance',
      //   'Yes'
      // );

      // // ffa_depreciationAndAmortization_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_depreciationAndAmortization_Peer',
      //   record,
      //   'r164_depreciation_and_amortization',
      //   'Yes'
      // );

      // // ffa_interest_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_interest_Peer',
      //   record,
      //   'r165_interest',
      //   'Yes'
      // );

      // // ffa_incomeExpenseSurplusDefecit_Peer
      // insertDataIntoObject (
      //   'peer',
      //   year,
      //   object,
      //   'ffa_incomeExpenseSurplusDefecit_Peer',
      //   record,
      //   'dashboard_c001_income_expense_surplus_defecit',
      //   'Yes'
      // );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // totalAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalAssets_Client",
        record,
        "r008_ctotal_assets"
      );
      // totalLiabilities
      insertDataIntoObject(
        "client",
        year,
        object,
        "totalLiabilities_Client",
        record,
        "r016_ctotal_liabilities"
      );
      // netPosition
      insertDataIntoObject(
        "client",
        year,
        object,
        "netPosition_Client",
        record,
        "r020_ctotal_net_assets"
      );

      // SOURCE OF INCOME ---------------------------------->

      // si_revenueTuitionAndFees_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueTuitionAndFees_Client",
        record,
        "r023_revenue_tuition_and_fees"
      );
      // si_revenueAuxiliaryActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueAuxiliaryActivities_Client",
        record,
        "r028_revenue_auxiliary_activities"
      );
      // si_revenueContributions_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueContributions_Client",
        record,
        "r033_revenue_contributions"
      );
      // si_revenueInvestmentIncome_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueInvestmentIncome_Client",
        record,
        "r029_revenue_investment_income"
      );
      // si_revenueOther_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueOther_Client",
        record,
        "r031_revenue_other"
      );

      // Financial Flow Analysis ---------------------------------->

      // ffa_revenueTuitionAndFees_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueTuitionAndFees_Client",
        record,
        "r023_revenue_tuition_and_fees"
      );

      // ffa_revenueScholarshipsAndFinancialAid_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueScholarshipsAndFinancialAid_Client",
        record,
        "r024_revenue_scholarships_and_financial_aid"
      );

      // ffa_totalRevenueContributions_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_totalRevenueContributions_Client",
        record,
        "r035_ctotal_revenue_from_contributions"
      );

      // ffa_revenueAuxiliaryActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueAuxiliaryActivities_Client",
        record,
        "r028_revenue_auxiliary_activities"
      );

      // ffa_revenueOther_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueOther_Client",
        record,
        "r031_revenue_other"
      );

      // ffa_revenueInvestmentIncome_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueInvestmentIncome_Client",
        record,
        "r029_revenue_investment_income"
      );

      // ffa_revenueEndowmentSpendingAppropriation_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_revenueEndowmentSpendingAppropriation_Client",
        record,
        "r030_revenue_endowment_spending_appropriation"
      );

      // ffa_contributions_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_contributions_Client",
        record,
        "r054_contributions"
      );

      // ffa_salariesAndWages_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_salariesAndWages_Client",
        record,
        "r160_salaries_and_wages"
      );

      // ffa_employeeBenefits_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_employeeBenefits_Client",
        record,
        "r161_employee_benefits"
      );

      // ffa_servicesSuppliesAndOther_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_servicesSuppliesAndOther_Client",
        record,
        "r162_services_supplies_and_other"
      );

      // ffa_occupancyUtilitiesAndMaintenance_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_occupancyUtilitiesAndMaintenance_Client",
        record,
        "r163_occupancy_utilities_and_maintenance"
      );

      // ffa_depreciationAndAmortization_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_depreciationAndAmortization_Client",
        record,
        "r164_depreciation_and_amortization"
      );

      // ffa_interest_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_interest_Client",
        record,
        "r165_interest"
      );

      // ffa_incomeExpenseSurplusDefecit_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "ffa_incomeExpenseSurplusDefecit_Client",
        record,
        "dashboard_c001_income_expense_surplus_defecit"
      );

      // dashboardSurplusDefecit_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "dashboardSurplusDefecit_Client",
        record,
        "dashboard_c001_income_expense_surplus_defecit"
      );

      // Cash Flows Trend ---------------------------------->

      // cft_OperatingActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cft_OperatingActivities_Client",
        record,
        "r080_cnet_cash_provided_by_operating_activities"
      );

      // cft_InvestingActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cft_InvestingActivities_Client",
        record,
        "r085_cnet_cash_used_in_investing_activities"
      );

      // cft_FinancingActivities_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cft_FinancingActivities_Client",
        record,
        "r089_cnet_cash_used_in_financing_activities"
      );
    });
  });

  localStorage.removeItem("financialAnalysisContentData");
  localStorage.setItem("financialAnalysisContentData", JSON.stringify(object));
};

const processCfiData = (years, recordsPeer, recordsClient) => {
  const object = {};

  years.forEach((year) => {
    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // cfiRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "cfiRatio_peerAverage_Peer",
        record,
        "r119_ccfi_overall_ratio",
        "Yes"
      );

      // primaryReserveRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "primaryReserveRatio_peerAverage_Peer",
        record,
        "r115_ccfi_primary_reserve_ratio",
        "Yes"
      );

      // netIncomeOperationsRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "netIncomeOperationsRatio_peerAverage_Peer",
        record,
        "r116_ccfi_net_income_operations_ratio",
        "Yes"
      );

      // returnOnNetAssets_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "returnOnNetAssets_peerAverage_Peer",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio",
        "Yes"
      );

      // viabilityRatio_peerAverage
      insertDataIntoObject(
        "peer",
        year,
        object,
        "viabilityRatio_peerAverage_Peer",
        record,
        "r118_ccfi_viability_ratio",
        "Yes"
      );
    });

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      // cfiRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfiRatio_Client",
        record,
        "r119_ccfi_overall_ratio"
      );

      // cfi_primaryReserveRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Client",
        record,
        "r115_ccfi_primary_reserve_ratio"
      );

      // cfi_primaryReserveRatio_Strength
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Strength_Client",
        record,
        "r115_ccfi_primary_reserve_ratio_cfi_score___strength"
      );

      // cfi_primaryReserveRatio_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Weight_Client",
        record,
        "r115_ccfi_primary_reserve_ratio_cfi_score___weight"
      );

      // cfi_primaryReserveRatio_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_primaryReserveRatio_Score_Client",
        record,
        "r115_ccfi_primary_reserve_ratio_cfi_score"
      );

      // cfi_netIncomeOperationsRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Client",
        record,
        "r116_ccfi_net_income_operations_ratio"
      );

      // cfi_netIncomeOperationsRatio_Strength_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Strength_Client",
        record,
        "r116_ccfi_net_income_operations_ratio_cfi_score___strength"
      );

      // cfi_netIncomeOperationsRatio_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Weight_Client",
        record,
        "r116_ccfi_net_income_operations_ratio_cfi_score___weight"
      );

      // cfi_netIncomeOperationsRatio_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_netIncomeOperationsRatio_Score_Client",
        record,
        "r116_ccfi_net_income_operations_ratio_cfi_score"
      );

      // cfi_returnOnNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio"
      );

      // cfi_returnOnNetAssets_Strength_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Strength_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___strength"
      );

      // cfi_returnOnNetAssets_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Weight_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___weight"
      );

      // cfi_returnOnNetAssets_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_returnOnNetAssets_Score_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score"
      );

      // cfi_viabilityRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Client",
        record,
        "r118_ccfi_viability_ratio"
      );

      // cfi_viabilityRatio_Strength_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Strength_Client",
        record,
        "r118_ccfi_viability_ratio_cfi_score___strength"
      );

      // cfi_viabilityRatio_Weight_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Weight_Client",
        record,
        "r118_ccfi_viability_ratio_cfi_score___weight"
      );

      // cfi_viabilityRatio_Score_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "cfi_viabilityRatio_Score_Client",
        record,
        "r118_ccfi_viability_ratio_cfi_score"
      );

      // PRIMARY RESERVE RATIO ---------------------------------->

      // primaryReserveRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "primaryReserveRatio_Client",
        record,
        "r115_ccfi_primary_reserve_ratio"
      );
      // pr_nonrestrictedNetAssets_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_nonrestrictedNetAssets_Client",
        record,
        "r017_net_assets_without_donor_restriction"
      );

      // pr_restrictedNetAssets_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_restrictedNetAssets_Client",
        record,
        "r018_net_assets_restricted_by_time_or_purpose"
      );

      // pr_propertyAndEquipment_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_propertyAndEquipment_Client",
        record,
        "r099_ctotal_property_and_equipment_less_depreciation"
      );

      // pr_notesPayable_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_notesPayable_Client",
        record,
        "r015_notes_payable"
      );

      // pr_cfi_primaryReserveAdjustment_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_cfi_primaryReserveAdjustment_Client",
        record,
        "r114_cfi_primary_reserve_adjustment_number"
      );

      // pr_totalFunctionalExpenses_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "pr_totalFunctionalExpenses_Client",
        record,
        "r044_ctotal_functional_expenses"
      );

      // NET INCOME OPERATIONS RATIO ---------------------------------->

      // netIncomeOperationsRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "netIncomeOperationsRatio_Client",
        record,
        "r116_ccfi_net_income_operations_ratio"
      );

      // ni_operatingRevenuesSupportAndReleases
      insertDataIntoObject(
        "client",
        year,
        object,
        "ni_operatingRevenuesSupportAndReleases_Client",
        record,
        "r036_coperating_revenues_support_and_releases"
      );

      // ni_totalFunctionalExpenses
      insertDataIntoObject(
        "client",
        year,
        object,
        "ni_totalFunctionalExpenses_Client",
        record,
        "r044_ctotal_functional_expenses"
      );

      // ni_nonOperatingActivitiesInvestmentIncome
      insertDataIntoObject(
        "client",
        year,
        object,
        "ni_nonOperatingActivitiesInvestmentIncome_Client",
        record,
        "r047_non_operating_activities_investment_income"
      );

      // CFI RETURN ON NET ASSETS ---------------------------------->

      // returnOnNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "returnOnNetAssets_Client",
        record,
        "r117_ccfi_return_on_net_assets_total_return_ratio"
      );
      // ro_changeInNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "ro_changeInNetAssets_Client",
        record,
        "r065_cchange_in_net_assets"
      );
      // ro_netAssetsBeginningOfYear
      insertDataIntoObject(
        "client",
        year,
        object,
        "ro_netAssetsBeginningOfYear_Client",
        record,
        "r066_net_assets_beginning_of_year"
      );

      // CFI RETURN ON NET ASSETS ---------------------------------->

      // viabilityRatio
      insertDataIntoObject(
        "client",
        year,
        object,
        "viabilityRatio_Client",
        record,
        "r118_ccfi_viability_ratio"
      );
      // vr_nonrestrictedNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_nonrestrictedNetAssets_Client",
        record,
        "r017_net_assets_without_donor_restriction"
      );
      // vr_restrictedNetAssets
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_restrictedNetAssets_Client",
        record,
        "r018_net_assets_restricted_by_time_or_purpose"
      );
      // vr_totalPropertyAndEquipment
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_totalPropertyAndEquipment_Client",
        record,
        "r099_ctotal_property_and_equipment_less_depreciation"
      );
      // vr_accumulatedDepreciation
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_accumulatedDepreciation_Client",
        record,
        "r098_accumulated_depreciation"
      );
      // vr_notesPayable
      insertDataIntoObject(
        "client",
        year,
        object,
        "vr_notesPayable_Client",
        record,
        "r015_notes_payable"
      );
    });
  });

  localStorage.removeItem("cfiData");
  localStorage.setItem("cfiData", JSON.stringify(object));

  const selectedYears = getSelectedYearsFromLocalStorage();
  const cfiValue =
    object.cfiRatio_Client[selectedYears[selectedYears.length - 1]].value;
  updateCfiValue(cfiValue);
  const thCfiScoreElement = document.getElementById("th_cfiScore");
  thCfiScoreElement.textContent =
    cfiValue !== undefined && !isNaN(cfiValue) && cfiValue !== 0
      ? cfiValue
      : "-";
};

// Helper functions

const countUniqueClients = (records) => {
  uniqueClients = new Set();
  try {
    records.forEach((record) => {
      const mainRelatedClient = record.querySelector(
        "pe___client_legal_name"
      ).textContent;
      // console.log(mainRelatedClient);
      uniqueClients.add(mainRelatedClient);
    });

    const count = uniqueClients.size;
    console.log(count);
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
  processCfiData(selectedYears, recordsPeer, recordsClient);
  processFinancialAnalysisContentData(
    selectedYears,
    recordsPeer,
    recordsClient
  );
};

const displayComponents = () => {
  displayCfiComponent();
  displayReportComponent();
  displayFinancialAnalysisContentComponent();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const recordClientHTMLArray = [];
const recordPeerHTMLArray = [];

const run_btn = document.querySelector("#run");
run_btn.addEventListener("click", async () => {
  try {
    // uploadMainFile = "";
    // document.getElementById("print_modal_footer").classList.add("hidden");
    toggleButtonLoadingState(run_btn);
    const selectedYears = processSelectedYears();
    saveSelectedYearsToLocalStorage(selectedYears);

    const recordsPeer = await getRecordsForPeer(selectedYears, "<qdbapi>");
    // countUniqueClients(recordsPeer);

    const recordsClient = await getRecordsForClient(selectedYears, "<qdbapi>");

    const qdbapiElementClient = `<qdbapi>${recordClientHTMLArray.join(
      ""
    )}</qdbapi>`;
    console.log("CLIENT", qdbapiElementClient);

    const qdbapiElementPeer = `<qdbapi>${recordPeerHTMLArray.join(
      ""
    )}</qdbapi>`;
    if (recordPeerHTMLArray.length === 0) {
      console.error("No Peer records found for the selected years");
    } else {
      console.log("PEER", qdbapiElementPeer);
    }

    processApiCalls(selectedYears, recordsPeer, recordsClient);
    displayComponents();
  } catch (err) {
    console.error(err);
  } finally {
    toggleButtonNormalState(run_btn);
  }
});

const getParsedData = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc.querySelectorAll("record");
};

const getRecordsForPeer = async (years, dataStr) => {
  if (years.length === 0) {
    // Base case: return the final string when the array is empty
    // if (dataStr === '<qdbapi>') console.error('No Peer records found for the selected years')
    const parsedData = getParsedData(dataStr + "</qdbapi>");
    return parsedData;
  }

  const currentYear = years[0];

  // console.log({ currentYear, sliderValue, sliderValue2, selectedTypes_Array})

  function getRegionQuery(selectedRegions) {
    const regionConditions = [...selectedRegions]
      .map((region) => `{536.EX.${region}}`)
      .join(" OR ");
    return `(${regionConditions})`;
  }

  function getStateQuery(selectedStates) {
    const stateConditions = [...selectedStates]
      .map((state) => `{619.EX.${state}}`)
      .join(" OR ");
    return `(${stateConditions})`;
  }

  function getMembershipsQuery(selectedMemberships) {
    const membershipsConditions = [...selectedMemberships]
      .map((membership) => `{537.EX.${membership}}`)
      .join(" OR ");
    return `(${membershipsConditions})`;
  }

  function getTrendlinesQuery(selectedTrendlines) {
    const trendlinesConditions = [...selectedTrendlines]
      .map((trendline) => `{536.EX.${trendline}}`)
      .join(" OR ");
    return `(${trendlinesConditions})`;
  }

  function getAthleticsQuery(selectedAthletics) {
    const athleticsConditions = [...selectedAthletics]
      .map((athletic) => `{534.EX.${athletic}}`)
      .join(" OR ");
    return `(${athleticsConditions})`;
  }

  function getTypeQuery(selectedTypes) {
    const typeConditions = [...selectedTypes]
      .map((type) => `{618.EX.${type}}`)
      .join(" OR ");
    return `(${typeConditions})`;
  }

  function getClientQuery(selectedClients) {
    const clientConditions = [...selectedClients]
      .map((client) => `{539.EX.${client}}`)
      .join(" OR ");
    return `(${clientConditions})`;
  }

  // (${getRegionQuery(selectedRegions_Array)}) AND 
  // (${getStateQuery(selectedStates_Array)}) AND 
  // (${getMembershipsQuery(selectedMemberships_Array)}) AND 
  // (${getTrendlinesQuery(selectedTrendlines_Array)}) AND 
  // (${getAthleticsQuery(selectedAthletics_Array)}) AND 
  // (${getTypeQuery(selectedTypes_Array)}) AND
  // (${getClientQuery(selectedClients_Array)})

  const apiCallPeerData = {
    act: "API_DoQuery",
    query: `
    {7.EX.${currentYear}
    }
    `,
    clist:
      "7.536.619.537.618.534.539.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395.390.391.549.392.395.393.394.411.450.451.452.453.454.455.727"
  };

  try {
    const xml = await $.get(peerData, apiCallPeerData);

    // console.log('PEER-XML', xml)

    const recordsForPeer = $("record", xml).toArray();

    // console.log("recordsForPeer", recordsForPeer);
    // console.log("recordsForPeer", recordsForPeer[0].children);

    // Update dataStr with the records from the current API call
    // console.log(`year - ${currentYear}`)

    recordsForPeer.forEach((record, index) => {
      // if (index < 2) console.log(`Peer`, record);

      // Create a new record element
      const newRecord = document.createElement("record");

      // Append each child element to the new record
      Array.from(record.children).forEach((child) => {
        newRecord.appendChild(child.cloneNode(true));
      });

      recordPeerHTMLArray.push(newRecord.outerHTML);

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

const getRecordsForUniqueClientsPeerNames = async () => {
  const apiCallPeerData = {
    act: "API_DoQuery",
    clist:
      "7.536.619.537.618.534.539.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395"
  };

  try {
    const xml = await $.get(peerData, apiCallPeerData);

    const recordsForPeerUniqueClientPeerNames = $("record", xml).toArray();

    const uniquePeerClientNames = new Set();

    recordsForPeerUniqueClientPeerNames.forEach((record, index) => {
      const clientInformalName =
        record.querySelector("merged_client_name").textContent;
      uniquePeerClientNames.add(clientInformalName);
    });

    // console.log({ uniquePeerClientNames });

    const sortedUniquePeerClientNames = Array.from(
      uniquePeerClientNames
    ).sort();

    sortedUniquePeerClientNames.forEach((item) =>
      selectedClients_Array.add(item)
    );

    addUniqueClientsToOptionsSelectClientsDropdown(sortedUniquePeerClientNames);
  } catch (error) {
    console.error("Error fetching data:", error);
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
	    {7.EX.${currentYear}} AND
	    {533.EX.${ClientRid}}`,
    clist:
      "539.7.533..536.619.537.618.534.539.580.578.576.577.578.579.712.725.722.719.714.726.723.720.717.724.721.718.580.576.387.388.569.386.632.551.550.551.406.578.561.418.579.387.388.567.441.386.540.541.542.540.541.600.606.390.392.396.393.395.390.391.549.392.395.393.394.411.450.451.452.453.454.455.727.570.571.572."
  };

  try {
    const xml = await $.get(clientData, apiCallClientData);
    const recordsForClient = $("record", xml).toArray();

    //console.log('recordsForClient', recordsForClient[0].children)
    //console.log($('record', xml))
    //console.log(`year - ${currentYear}`)

    // Update dataStr with the records from the current API call
    recordsForClient.forEach((record, index) => {
      // if (index < 4) console.log(`Client`, record);

      // Create a new record element
      const newRecord = document.createElement("record");

      // Append each child element to the new record
      Array.from(record.children).forEach((child) => {
        newRecord.appendChild(child.cloneNode(true));
      });

      recordClientHTMLArray.push(newRecord.outerHTML);

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
