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
  const recordsPeer = await fetchPeerData();
  const clientsArray = [...recordsPeer].map((record) => {
    return record.querySelector("merged_client_name").textContent;
  });
  const uniqueClients = [...new Set(clientsArray)];

  // console.log(recordsClient[0]);

  clientName = recordsClient[0]
    .querySelector("merged_client_name")
    .textContent.replace(/[^\w\s]/g, "")
    .trim();

  document.getElementById("firmName").textContent = clientName;

  findUniqueYears(recordsClient);

  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);

  addUniqueStatesToOptionsSelectStatesDropdown(states_Array);

  addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);

  addUniqueClientsToOptionsSelectClientsDropdown(uniqueClients);

  addUniqueTypesToOptionsSelectTypesDropdown(types_Array);

  addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);

  addUniqueTrendlinesToOptionsSelectTrendlinesDropdown(trendlines_Array);

  localStorage.clear();
});

const findUniqueYears = (data) => {
  if (data) {
    data.forEach((item) => {
      // console.log(item);
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
  // console.log ({
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

const processRevenueExpenseContentData = (seletectedYears, recordsPeer, recordsClient) => {
  const salariesAndBenefits_obj = {};

  const years = seletectedYears.sort((a, b) => a - b);
  years.forEach((year) => {
    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      const salariesAndBenefits_array = [
        {
          key: "salariesAndBenefitsToTotalExpense_Client",
          field: "r228_csalaries_and_benefits_to_total_expenses",
        },
        {
          key: "salariesAndWages_Client",
          field: "r160_salaries_and_wages",
        },
        {
          key: "employeeBenefits_Client",
          field: "r161_employee_benefits",
        },
        {
          key: "totalFunctionalExpenses_Client",
          field: "r044_ctotal_functional_expenses",
        },
      ];
      salariesAndBenefits_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          salariesAndBenefits_obj,
          key,
          record,
          field
        );
      });


    })


  })

  const dataKeys = ["salariesAndBenefitsData"];
  const dataObjects = [salariesAndBenefits_obj];
  dataKeys.forEach((key, index) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
}

const processFinancialPositionContentData = (seletectedYears, recordsPeer, recordsClient) => {
  const currentRatio_obj = {};
  const liquidity_obj = {}

  const years = seletectedYears.sort((a, b) => a - b);
  years.forEach((year) => {
    
    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      if (record.querySelector('_9999_completion_test_fs_tab').innerHTML == 'IN PROCESS') {
        return 
      }
      const currentRatio_array = [
        {
          key: "cashAndCashEquivalents_Client",
          field: "r001_cash_and_cash_equivalents",
        },
        {
          key: "accountsReceivable_Client",
          field: "r002_accounts_receivable_net",
        },
        {
          key: "studentLoansAndOtherReceivables_Client",
          field: "r003_student_loans_and_other_receivables",
        },
        {
          key: "contributionsReceivable_Client",
          field: "r004_contributions_receivable",
        },
        {
          key: "prepaidExpensesAndOtherAssets_Client",
          field: "r005_prepaid_expenses_and_other_assets",
        },
        {
          key: "accountsPayable_Client",
          field: "r009_accounts_payable_and_accrued_liabilities",
        },
        {
          key: "deferredRevenue_Client",
          field: "r010_deferred_revenue",
        },
      ];
      currentRatio_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          currentRatio_obj,
          key,
          record,
          field
        );
      });

      const liquidity_array = [
        {
          key: "fasbLiquidity_Client",
          field: "r250_fasb_liquidity",
        },
        {
          key: "quasiEndowment_Client",
          field: "r251_quasi_endowment",
        },
        {
          key: "lineOfCredit_Client",
          field: "r252_line_of_credit_available",
        },
      ];
      liquidity_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          liquidity_obj,
          key,
          record,
          field
        );
      });
    });

    const filteredPeerRecords = [...recordsPeer].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;

      return fiscalYear.includes(year.toString());
    });
    filteredPeerRecords.forEach((record) => {
      // currentRatio
      insertDataIntoObject(
        "peer",
        year,
        currentRatio_obj,
        "currentRatio_Peer",
        record,
        "r258c_current_ratio",
        "Yes"
      );

      // liquidity
      insertDataIntoObject(
        "peer",
        year,
        liquidity_obj,
        "liquidity_Peer",
        record,
        "r250_fasb_liquidity",
        "Yes"
      );
    });
  });

  const dataKeys = ["currentRatioData", "liquidityData"];
  const dataObjects = [currentRatio_obj, liquidity_obj];
  dataKeys.forEach((key, index) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

const processFinancialStatementContentData = (recordsPeer, recordsClient) => {
  const totalAssets_obj = {};
  const totalLiabilities_obj = {};
  const netAssets_obj = {};
  const revenueAndSupport_obj = {};
  const educationalProgram_obj = {};
  const nonOperatingActivities_obj = {};
  const changesInNetAssetsWithDR_obj = {};
  const naturalExpenseCategories_obj = {};
  const cashFlowsOperating_obj = {};
  const cashFlowsInvesting_obj = {};
  const cashFlowsFinancing_obj = {};
  const propertyAndEquipment_obj = {};

  const years = yearsData_Array.sort((a, b) => a - b);
  years.forEach((year) => {

    const filteredClientRecords = [...recordsClient].filter((record) => {
      const fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });
    filteredClientRecords.forEach((record) => {
      if (record.querySelector('_9999_completion_test_fs_tab').innerHTML == 'IN PROCESS') {
        return 
      }
      const totalAssets_array = [
        {
          key: "totalAssets_Client",
          field: "r008_ctotal_assets",
        },
        {
          key: "cashAndCashEquivalents_Client",
          field: "r001_cash_and_cash_equivalents",
        },
        {
          key: "accountsReceivable_Client",
          field: "r002_accounts_receivable_net",
        },
        {
          key: "studentLoansAndOtherReceivables_Client",
          field: "r003_student_loans_and_other_receivables",
        },
        {
          key: "contributionsReceivable_Client",
          field: "r004_contributions_receivable",
        },
        {
          key: "prepaidExpensesAndOtherAssets_Client",
          field: "r005_prepaid_expenses_and_other_assets",
        },
        {
          key: "propertyAndEquipment_Client",
          field: "r006_property_and_equipment_net",
        },
        {
          key: "investmentsHeldForLongTermPurposes_Client",
          field: "r007_investments_held_for_long_term_purposes",
        },
      ];
      totalAssets_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          totalAssets_obj,
          key,
          record,
          field
        );
      });

      const totalLiabilities_array = [
        {
          key: "accountsPayable_Client",
          field: "r009_accounts_payable_and_accrued_liabilities",
        },
        {
          key: "deferredRevenue_Client",
          field: "r010_deferred_revenue",
        },
        {
          key: "postRetirementHealthBenefits_Client",
          field: "r011_post_retirement_health_benefits",
        },
        {
          key: "annuityObligations_Client",
          field: "r012_annuity_obligations",
        },
        {
          key: "otherLiabilities_Client",
          field: "r013_other_liabilities",
        },
        {
          key: "interestRateSwapLiability_Client",
          field: "r014_interest_rate_swap_liability",
        },
        {
          key: "bondsNotesPayable_Client",
          field: "r015_notes_payable",
        },
        {
          key: "totalLiabilities_Client",
          field: "r016_ctotal_liabilities",
        },
      ];
      totalLiabilities_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          totalLiabilities_obj,
          key,
          record,
          field
        );
      });

      const netAssets_array = [
        {
          key: "netAssetsWithoutDonorRestriction_Client",
          field: "r017_net_assets_without_donor_restriction",
        },
        {
          key: "netAssetsRestrictedByTimeOrPurpose_Client",
          field: "r018_net_assets_restricted_by_time_or_purpose",
        },
        {
          key: "netChangeInNetAssetsRestrictedInPerpetuity_Client",
          field: "r064_cnet_change_restricted_in_perpetuity",
        },
        {
          key: "netAssets_Client",
          field: "r020_ctotal_net_assets",
        },
      ];
      netAssets_array.forEach(({ key, field }) => {
        insertDataIntoObject("client", year, netAssets_obj, key, record, field);
      });

      const revenueAndSupport_array = [
        {
          key: "tuitionAndFees_Client",
          field: "r023_revenue_tuition_and_fees",
        },
        {
          key: "scholarshipsAndFinancialaid_Client",
          field: "r024_revenue_scholarships_and_financial_aid",
        },
        {
          key: "netTuitionAndFees_Client",
          field: "r026_cnet_tuition_and_fees",
        },
        {
          key: "auxiliaryActivities_Client",
          field: "r028_revenue_auxiliary_activities",
        },
        {
          key: "investmentIncome_Client",
          field: "r029_revenue_investment_income",
        },
        {
          key: "endowmentSpendingAppropriation_Client",
          field: "r030_revenue_endowment_spending_appropriation",
        },
        {
          key: "other_Client",
          field: "r031_revenue_other",
        },
        {
          key: "nonContributionRevenue_Client",
          field: "r032_cnon_contribution_revenue",
        },
        {
          key: "contributions_Client",
          field: "r054_contributions",
        },
        {
          key: "contributionsLargeOneTimeGifts_Client",
          field: "r033a_revenue_contributions_large_one_time_gifts",
        },
        {
          key: "netAssetsReleasedFromRestriction_Client",
          field: "r034_revenue_net_assets_released_from_restriction",
        },
        {
          key: "totalRevenueContributions_Client",
          field: "r035_ctotal_revenue_from_contributions",
        },
        {
          key: "operatingRevenuesSupportAndReleases_Client",
          field: "r036_coperating_revenues_support_and_releases",
        },
        {
          key: "revenueAndSupport_Client",
          field: "r008_ctotal_assets",
        },
      ];
      revenueAndSupport_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          revenueAndSupport_obj,
          key,
          record,
          field
        );
      });

      const educationalProgramExpenses_array = [
        {
          key: "expensesEducationalInstruction_Client",
          field: "r037_expenses_educational_program_instruction",
        },
        {
          key: "expensesEducationalResearch_Client",
          field: "r038_expenses_educational_program_research",
        },
        {
          key: "expensesEducationalAcademicSupport_Client",
          field: "r039_expenses_educational_program_academic_support",
        },
        {
          key: "expensesEducationalStudentServices_Client",
          field: "r040_expenses_educational_program_student_services",
        },
        {
          key: "expensesEducationalAuxiliaryActivities_Client",
          field: "r041_expenses_educational_program_auxiliary_activities",
        },
        {
          key: "expensesEducationalInstitutionalSupport_Client",
          field: "r042_expenses_educational_program_institutional_support",
        },
        {
          key: "expensesEducationalPublicService_Client",
          field: "r043_expenses_educational_program_public_service",
        },
        {
          key: "educationalProgramExpenses_Client",
          field: "r044_ctotal_functional_expenses",
        },
      ];
      educationalProgramExpenses_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          educationalProgram_obj,
          key,
          record,
          field
        );
      });

      const nonOperatingActivities_array = [
        {
          key: "investmentIncome_Client",
          field: "r047_non_operating_activities_investment_income",
        },
        {
          key: "endowmentSpendingPolicy_Client",
          field:
            "r048_investments_net_in_excess_of_amounts_appropriated_for_spending",
        },
        {
          key: "changeInValueInterestRateSwap_Client",
          field:
            "r049_non_operating_activities_change_in_value_of_split_interest_agreements",
        },
        {
          key: "adjustmentPrbo_Client",
          field: "r050_non_operating_activities_adjustment_to_prbo",
        },
        {
          key: "contributionsAndOther_Client",
          field: "r051_other_gains_losses",
        },
        {
          key: "nonOperatingActivities_Client",
          field: "r052_ctotal_non_operating_changes",
        },
      ];
      nonOperatingActivities_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          nonOperatingActivities_obj,
          key,
          record,
          field
        );
      });

      const changesInNetAssetsWithDR_array = [
        {
          key: "contributions_Client",
          field: "r054_contributions",
        },
        {
          key: "investmentIncomePlusEndowment_Client",
          field: "r055_investment_return_net",
        },
        {
          key: "endowmentSpendingPolicy_Client",
          field:
            "r056_change_in_temporarily_restricted_net_assets_endowment_spending_policy_approp",
        },
        {
          key: "NetAssetsReleasedFromProgram_Client",
          field: "r058_net_assets_released_from_restriction",
        },
        {
          key: "temporarilyRestrictedNetChange_Client",
          field: "r059_cchange_in_net_assets_with_donor_restrictions",
        },
        {
          key: "contributions2_Client",
          field:
            "r060_change_in_permanently_restricted_net_assets_contributions",
        },
        {
          key: "investmentIncome_Client",
          field:
            "r061_change_in_permanently_restricted_net_assets_investment_income",
        },
        {
          key: "netAssetsReleased_Client",
          field:
            "r063_change_in_permanently_restricted_net_assets_released_from_program_restrictions",
        },
        {
          key: "permanentlyRestricted_Client",
          field: "r064_cnet_change_restricted_in_perpetuity",
        },
        {
          key: "changesInNetAssetsWithDR_Client",
          field: "r065_cchange_in_net_assets",
        },
      ];
      changesInNetAssetsWithDR_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          changesInNetAssetsWithDR_obj,
          key,
          record,
          field
        );
      });

      const naturalExpenseCategories_array = [
        {
          key: "salariesAndWages_Client",
          field: "r160_salaries_and_wages",
        },
        {
          key: "employeeBenefits_Client",
          field: "r161_employee_benefits",
        },
        {
          key: "servicesSuppliesAndOther_Client",
          field: "r162_services_supplies_and_other",
        },
        {
          key: "occupancyUtilitiesAndMaintenance_Client",
          field: "r163_occupancy_utilities_and_maintenance",
        },
        {
          key: "depreciationAndAmortization_Client",
          field: "r164_depreciation_and_amortization",
        },
        {
          key: "interest_Client",
          field: "r165_interest",
        },
        {
          key: "naturalExpenseCategories_Client",
          field: "r166_ctotal_natural_category_expenses",
        },
      ];
      naturalExpenseCategories_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          naturalExpenseCategories_obj,
          key,
          record,
          field
        );
      });

      const cashFlowsOperating_array = [
        {
          key: "salariesAndWages_Client",
          field: "r160_salaries_and_wages",
        },
        {
          key: "employeeBenefits_Client",
          field: "r161_employee_benefits",
        },
        {
          key: "serviceSuppliesOther_Client",
          field: "r162_services_supplies_and_other",
        },
        {
          key: "occupancyUtilitiesMaintenance_Client",
          field: "r163_occupancy_utilities_and_maintenance",
        },
        {
          key: "depreciationAndAmortization_Client",
          field: "r164_depreciation_and_amortization",
        },
        {
          key: "interest_Client",
          field: "r165_interest",
        },
        {
          key: "cashFlowsOperatingActivities_Client",
          field: "r166_ctotal_natural_category_expenses",
        },
      ];
      cashFlowsOperating_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          cashFlowsOperating_obj,
          key,
          record,
          field
        );
      });

      const cashFlowsInvesting_array = [
        {
          key: "purchaseOfInvestments_Client",
          field:
            "r081_cash_flows_from_investing_activities_purchase_of_investments",
        },
        {
          key: "proceedsFromSaleOfInvestments_Client",
          field:
            "r082_cash_flows_from_investing_activities_proceeds_from_sale_of_investments",
        },
        {
          key: "PurchaseOfPropertyAndEquipment_Client",
          field:
            "r083_cash_flows_from_investing_activities_purchases_of_property_and_equipment",
        },
        {
          key: "studentLoanFund_Client",
          field: "r084_cash_flows_from_investing_activities_student_loan_fund",
        },
        {
          key: "cashFlowsInvestingActivities_Client",
          field: "r085_cnet_cash_used_in_investing_activities",
        },
      ];
      cashFlowsInvesting_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          cashFlowsInvesting_obj,
          key,
          record,
          field
        );
      });

      const cashFlowsFinancing_array = [
        {
          key: "proceedsFromNotesPayable_Client",
          field:
            "r086_cash_flows_from_financing_activities_proceeds_from_notes_payable",
        },
        {
          key: "principalPayments_Client",
          field:
            "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable",
        },
        {
          key: "other_Client",
          field: "r088_cash_flows_from_financing_activities_other",
        },
        {
          key: "cashFlowsFinancingActivities_Client",
          field: "r089_cnet_cash_used_in_financing_activities",
        },
      ];
      cashFlowsFinancing_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          cashFlowsFinancing_obj,
          key,
          record,
          field
        );
      });

      const propertyAndEquipment_array = [
        {
          key: "landImprovements_Client",
          field: "r093_property_and_equipment_land_and_improvements",
        },
        {
          key: "buildingImprovements_Client",
          field: "r094_property_and_equipment_buildings_and_improvements",
        },
        {
          key: "furnitureEquipment_Client",
          field: "r095_property_and_equipment_furniture_and_equipment",
        },
        {
          key: "cip_Client",
          field: "r096_property_and_equipment_cip",
        },
        {
          key: "totalPEatCost_Client",
          field: "r097_ctotal_property_and_equipment_at_cost",
        },
        {
          key: "accumulatedDepreciation_Client",
          field: "r098_accumulated_depreciation",
        },
        {
          key: "propertyAndEquipment_Client",
          field: "r099_ctotal_property_and_equipment_less_depreciation",
        },
      ];
      propertyAndEquipment_array.forEach(({ key, field }) => {
        insertDataIntoObject(
          "client",
          year,
          propertyAndEquipment_obj,
          key,
          record,
          field
        );
      });
    });
  });

  const dataKeys = [
    "totalAssetsData",
    "totalLiabilitiesData",
    "netAssetsData",
    "revenueAndSupportData",
    "educationalProgramData",
    "nonOperatingActivitiesData",
    "changesInNetAssetsWithDRData",
    "naturalExpenseCategoriesData",
    "cashFlowsOperatingData",
    "cashFlowsInvestingData",
    "cashFlowsFinancingData",
    "propertyAndEquipmentData",
  ];
  const dataObjects = [
    totalAssets_obj,
    totalLiabilities_obj,
    netAssets_obj,
    revenueAndSupport_obj,
    educationalProgram_obj,
    nonOperatingActivities_obj,
    changesInNetAssetsWithDR_obj,
    naturalExpenseCategories_obj,
    cashFlowsOperating_obj,
    cashFlowsInvesting_obj,
    cashFlowsFinancing_obj,
    propertyAndEquipment_obj,
  ];
  dataKeys.forEach((key, index) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
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
        "dashboard_c002a_income_____tuition",
        "Yes"
      );

      // revenueAuxiliaryActivities
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueAuxiliaryActivities_Peer",
        record,
        "dashboard_c002b_income_____auxiliary",
        "Yes"
      );

      // revenueContributions
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueContributions_Peer",
        record,
        "dashboard_c002c_income_____contributions",
        "Yes"
      );

      // revenueInvestmentIncome
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueInvestmentIncome_Peer",
        record,
        "dashboard_c002d_income_____investments",
        "Yes"
      );

      // revenueOther
      insertDataIntoObject(
        "peer",
        year,
        object,
        "revenueOther_Peer",
        record,
        "dashboard_c002e_income_____other_sources",
        "Yes"
      );

      // Financial Flow Analysis ---------------------------------->
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
      // si_revenueContributionsLargeOneTimeGifts_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueContributionsLargeOneTimeGifts_Client",
        record,
        "r033a_revenue_contributions_large_one_time_gifts"
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
      // si_revenueEndowmentSpendingAppropriation_Client
      insertDataIntoObject(
        "client",
        year,
        object,
        "si_revenueEndowmentSpendingAppropriation_Client",
        record,
        "r030_revenue_endowment_spending_appropriation"
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

const toggleButtonLoadingState = (btn) => {
  btn.innerHTML = `
    <svg aria-hidden=dtrue" role="status" class="inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  processFinancialStatementContentData(recordsPeer, recordsClient);
  processFinancialPositionContentData(selectedYears, recordsPeer, recordsClient);
  processRevenueExpenseContentData(selectedYears, recordsPeer, recordsClient);
};

const displayComponents = () => {
  displayCfiComponent();
  displayFinancialAnalysisContentComponent();
  displayFinancialStatementComponent();
  displayFinancialPositionComponent();
  displayReportComponent();
};

const run_btn = document.querySelector("#run");
run_btn.addEventListener("click", async () => {
  // uploadMainFile = ''
  // document.getElementById('print_modal_footer').classList.add('hidden');
  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData();

  // console.log({ recordsClient, recordsPeer });

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
