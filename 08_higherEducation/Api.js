// Data Model and Business Logic Classes
class DataStore {
  constructor() {
    this.cfiData = {};
    this.doeData = {};
    // this.debtEndowmentData = {};
    this.revenueExpenseData = {};
    this.financialPositionData = {};
    this.financialStatementData = {};
    this.financialAnalysisData = {};
    this.ltDebtPerTotalOperatingRevenueData = {};
    this.debtServiceCoverageRatioData = {};
    this.debtBurdenRatioData = {};
    
    this.endowmentOperatingBudgetData = {};
    this.endowmentAssetsPerStudentData = {};
  }

  // Save all data categories to localStorage
  saveAllToLocalStorage() {
    localStorage.setItem("cfiData", JSON.stringify(this.cfiData));
    localStorage.setItem("doeData", JSON.stringify(this.doeData));
    localStorage.setItem("ltDebtPerTotalOperatingRevenueData", JSON.stringify(this.ltDebtPerTotalOperatingRevenueData));
    localStorage.setItem("debtServiceCoverageRatioData", JSON.stringify(this.debtServiceCoverageRatioData));
    localStorage.setItem("debtBurdenRatioData", JSON.stringify(this.debtBurdenRatioData));
    localStorage.setItem("endowmentOperatingBudgetData", JSON.stringify(this.endowmentOperatingBudgetData));
    localStorage.setItem("endowmentAssetsPerStudentData", JSON.stringify(this.endowmentAssetsPerStudentData));
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
    // localStorage.setItem("debtEndowmentData", JSON.stringify(this.debtEndowmentData));
  }

  // Get a reference to the appropriate data object based on category
  getDataCategory(category) {
    switch (category) {
      case "cfi":
        return this.cfiData;
      case "doe":
        return this.doeData;
      // case "debtEndowment":
      //   return this.debtEndowmentData;
      case "ltDebtPerTotalOperatingRevenue":
        return this.ltDebtPerTotalOperatingRevenueData;
      case "debtServiceCoverageRatio":
        return this.debtServiceCoverageRatioData;
      case "debtBurdenRatio":
        return this.debtBurdenRatioData;
      case "revenueExpense":
        return this.revenueExpenseData;
      case "financialPosition":
        return this.financialPositionData;
      case "financialStatement":
        return this.financialStatementData;
      case "financialAnalysis":
        return this.financialAnalysisData;
      case "endowmentOperatingBudget":
        return this.endowmentOperatingBudgetData;
      case "endowmentAssetsPerStudent":
        return this.endowmentAssetsPerStudentData;
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
    // if (category === "debtServiceCoverageRatio") { console.log({dataKey, record, child, childRec: record.querySelector(child), name}); }
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

  processDebtEndowmentData(years, recordsPeer, recordsClient) {

    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      filteredClientRecords.forEach((record) => {
        // Long Term Debt Per Total Operating Revenue
        const ltDebtPerTotalOperatingRevenue_array = [
          { key: "longTermDebtForLongTermPurpose_Client", field: "r285_clong_term_debt_per_total_operating_revenue" },
          { key: "longTermDebt_Client", field: "r015_notes_payable" },
          { key: "totalOperatingRevenue_Client", field: "r036_coperating_revenues_support_and_releases" }
        ];
        ltDebtPerTotalOperatingRevenue_array.forEach(({ key, field }) => {
          this.dataStore.insertData("ltDebtPerTotalOperatingRevenue", "client", year, key, record, field);
        });

        // Debt Service Coverage Ratio
        const debtServiceCoverageRatio_array = [
          { key: "debtServiceCoverageRatio_Client", field: "r288_cdebt_service_coverage_ratio" },
          { key: "changeInNetAssetWithoutDR_Client", field: "r259_cchange_in_unrestricted_net_assets" },
          { key: "depreciation_Client", field: "r164_depreciation_and_amortization" },
          { key: "interest_Client", field: "r165_interest" },
          { key: "principalPayments_Client", field: "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable" },
          { key: "capitalLease_Client", field: "r292_capital_lease_obligations" },
          { key: "financingLeasesRightOfUseLiabilities_Client", field: "r291_financing_leases_right_of_use_liabilities" }
        ];
        debtServiceCoverageRatio_array.forEach(({ key, field }) => {
          this.dataStore.insertData("debtServiceCoverageRatio", "client", year, key, record, field);
        });

        // Debt Burden Ratio
        const debtBurdenRatio_array = [
          { key: "ratio_Client", field: "r287_cdebt_burden_ratio" },
          { key: "interest_Client", field: "r165_interest" },
          { key: "principalPayments_Client", field: "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable" },
          { key: "depreciation_Client", field: "r164_depreciation_and_amortization" },
          { key: "totalExpenses_Client", field: "r044_ctotal_functional_expenses" }
        ];
        debtBurdenRatio_array.forEach(({ key, field }) => {
          this.dataStore.insertData("debtBurdenRatio", "client", year, key, record, field);
        });

        // Endowment Operating Budget
        const endowmentOperatingBudget_array = [
          { key: "ratio_Client", field: "r153_cendowment_to_expenses_ratio" },
          { key: "endowment_Client", field: "e001_endowment_size" },
          { key: "annualOperatingBudget_Client", field: "r044_ctotal_functional_expenses" }
        ];
        endowmentOperatingBudget_array.forEach(({ key, field }) => {
          this.dataStore.insertData("endowmentOperatingBudget", "client", year, key, record, field);
        });

        // Endowment Assets Per Student
        const endowmentAssetsPerStudent_array = [
          { key: "ratio_Client", field: "r152_cendowment_assets_per_student" },
          { key: "endowment_Client", field: "e001_endowment_size" },
          { key: "totalStudentFte_Client", field: "g025_ctotal_student_fte" }
        ];
        endowmentAssetsPerStudent_array.forEach(({ key, field }) => {
          this.dataStore.insertData("endowmentAssetsPerStudent", "client", year, key, record, field);
        });
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {

        // Debt Burden Ratio for Peers
        const debtBurdenRatio_array = [
          { key: "ratio_Peer", field: "r287_cdebt_burden_ratio" },
          { key: "operationalExpense_Peer", field: "r044_ctotal_functional_expenses" }
        ];
        debtBurdenRatio_array.forEach(({ key, field }) => {
          this.dataStore.insertData("debtBurdenRatio", "peer", year, key, record, field, "Yes");
        });

        // Endowment Assets Per Student for Peers
        const endowmentAssetsPerStudent_array = [
          { key: "ratio_Peer", field: "r152_cendowment_assets_per_student" },
          { key: "endowment_Peer", field: "e001_endowment_size" },
          { key: "totalStudentFte_Peer", field: "g025_ctotal_student_fte" }
        ];
        endowmentAssetsPerStudent_array.forEach(({ key, field }) => {
          this.dataStore.insertData("endowmentAssetsPerStudent", "peer", year, key, record, field, "Yes");
        });
      });
    });
  }

  processRevenueExpenseData(years, recordsPeer, recordsClient) {
    const salariesAndBenefitsToTotalExpense_obj = {};
    const averageEmployeeSalary_obj = {};
    const salariesAndBenefitsPerNetTuition_obj = {};
    const adminCostsPerStudent_obj = {};
    const netEducationalExpensePerStudent_obj = {};
    const annualTraditionalNetTuitionPerStudent_obj = {};
    const tuitionDependency_obj = {};
    const tuitionDiscountRate_obj = {};

    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      filteredClientRecords.forEach((record) => {
        // Salaries and Benefits to Total Expense
        const salariesAndBenefitsToTotalExpense_array = [
          { key: "salariesAndBenefitsToTotalExpense_Client", field: "r228_csalaries_and_benefits_to_total_expenses" },
          { key: "salariesAndWages_Client", field: "r160_salaries_and_wages" },
          { key: "employeeBenefits_Client", field: "r161_employee_benefits" },
          { key: "totalFunctionalExpenses_Client", field: "r044_ctotal_functional_expenses" }
        ];
        salariesAndBenefitsToTotalExpense_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "client", year, key, record, field);
        });

        // Average Employee Salary
        const averageEmployeeSalary_array = [
          { key: "president_Client", field: "c011_sal_president" },
          { key: "chiefAcademic_Client", field: "c021_sal_chief_academic" },
          { key: "chiefFinance_Client", field: "c031_sal_chief_finance" },
          { key: "chiefEnrollment_Client", field: "c041_sal_chief_enrollment" },
          { key: "chiefDevelopment_Client", field: "c051_sal_chief_development" },
          { key: "chiefOps_Client", field: "c061_sal_chief_ops" },
          { key: "dirFinance_Client", field: "c071_sal_dir_of_fin_aid" },
          { key: "dirHr_Client", field: "c081_sal_dir_of_hr" },
          { key: "dirIt_Client", field: "c091_sal_dir_of_it" },
          { key: "dirPhysPlant_Client", field: "c101_sal_dir_of_phys_plant" },
          { key: "controller_Client", field: "c111_sal_controller" },
          { key: "busMgr_Client", field: "c121_sal_bus_mgr" },
          { key: "bursar_Client", field: "c131_sal_bursar" },
          { key: "budgetDir_Client", field: "c141_sal_budget_dir" },
          { key: "dirAcct_Client", field: "c151_sal_dir_of_acct" },
          { key: "srAcct_Client", field: "c161_sal_sr_acct" },
          { key: "nonSrAcct_Client", field: "c171_sal_non_sr_acct" },
          { key: "stuAcctMgr_Client", field: "c181_sal_stu_acct_mgr" },
          { key: "otherBusOffice_Client", field: "c191_sal_other_bus_office" },
          { key: "adminAsst_Client", field: "c201_sal_admin_asst" }
        ];
        averageEmployeeSalary_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "client", year, key, record, field);
        });

        // Salaries and Benefits Per Net Tuition
        const salariesAndBenefitsPerNetTuition_array = [
          { key: "salariesAndWages_Client", field: "r160_salaries_and_wages" },
          { key: "employeeBenefits_Client", field: "r161_employee_benefits" },
          { key: "salariesAndBenefitsPerNetTuition_Client", field: "r284_csalaries_and_benefits_per_net_tuition_revenue" },
          { key: "netTuitionAndFees_Client", field: "r026_cnet_tuition_and_fees" }
        ];
        salariesAndBenefitsPerNetTuition_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "client", year, key, record, field);
        });

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
        const netEducationalExpensePerStudent_array = [
          { key: "netEducationalExpensePerStudentRatio_Client", field: "r138_cnet_educational_expenses_per_student" },
          { key: "netEducationalExpenses_Client", field: "r137_cnet_educational_expenses" },
          { key: "totalStudents_Client", field: "g025_ctotal_student_fte" }
        ];
        netEducationalExpensePerStudent_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "client", year, key, record, field);
        });

        // Annual Traditional Net Tuition Per Student
        const netTuitionPerStudent_array = [
          { key: "netTuitionPerStudentRatio_Client", field: "r136_cnet_tuition_per_student" },
          { key: "netTuitionAndFees_Client", field: "r026_cnet_tuition_and_fees" },
          { key: "totalStudents_Client", field: "g025_ctotal_student_fte" }
        ];
        netTuitionPerStudent_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "client", year, key, record, field);
        });

        // Tuition Dependency
        const tuitionDependency_array = [
          { key: "tuitionDependencyRatio_Client", field: "r147_cnet_tuition_dependency_ratio" },
          { key: "netTuitionAndFees_Client", field: "r026_cnet_tuition_and_fees" },
          { key: "operatingRevenuesSupportAndRelease_Client", field: "r036_coperating_revenues_support_and_releases" }
        ];
        tuitionDependency_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "client", year, key, record, field);
        });

        // Tuition Discount Rate
        const tuitionDiscountRate_array = [
          { key: "tuitionDiscountRateRatio_Client", field: "r229_ctuition_discount_rate" },
          { key: "revenueScholarshipsAndFinanancialAid_Client", field: "r024_revenue_scholarships_and_financial_aid" },
          { key: "revenueTuitionAndFees_Client", field: "r023_revenue_tuition_and_fees" }
        ];
        tuitionDiscountRate_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "client", year, key, record, field);
        });
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {

        // Tuition Dependency for Peers
        this.dataStore.insertData(
          "revenueExpense", 
          "peer",
          year,
          "tuitionDependencyRatio_Peer",
          record,
          "r147_cnet_tuition_dependency_ratio",
          "Yes"
        );

        // Tuition Discount Rate for Peers
        this.dataStore.insertData(
          "revenueExpense",
          "peer",
          year,
          "tuitionDiscountRateRatio_Peer",
          record,
          "r229_ctuition_discount_rate",
          "Yes"
        );


        // Average Employee Salary for Peers
        const averageEmployeeSalary_array = [
          { key: "president_Peer", field: "c011_sal_president" },
          { key: "chiefAcademic_Peer", field: "c021_sal_chief_academic" },
          { key: "chiefFinance_Peer", field: "c031_sal_chief_finance" },
          { key: "chiefEnrollment_Peer", field: "c041_sal_chief_enrollment" },
          { key: "chiefDevelopment_Peer", field: "c051_sal_chief_development" },
          { key: "chiefOps_Peer", field: "c061_sal_chief_ops" },
          { key: "dirFinance_Peer", field: "c071_sal_dir_of_fin_aid" },
          { key: "dirHr_Peer", field: "c081_sal_dir_of_hr" },
          { key: "dirIt_Peer", field: "c091_sal_dir_of_it" },
          { key: "dirPhysPlant_Peer", field: "c101_sal_dir_of_phys_plant" },
          { key: "controller_Peer", field: "c111_sal_controller" },
          { key: "busMgr_Peer", field: "c121_sal_bus_mgr" },
          { key: "bursar_Peer", field: "c131_sal_bursar" },
          { key: "budgetDir_Peer", field: "c141_sal_budget_dir" },
          { key: "dirAcct_Peer", field: "c151_sal_dir_of_acct" },
          { key: "srAcct_Peer", field: "c161_sal_sr_acct" },
          { key: "nonSrAcct_Peer", field: "c171_sal_non_sr_acct" },
          { key: "stuAcctMgr_Peer", field: "c181_sal_stu_acct_mgr" },
          { key: "otherBusOffice_Peer", field: "c191_sal_other_bus_office" },
          { key: "adminAsst_Peer", field: "c201_sal_admin_asst" }
        ];
        averageEmployeeSalary_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "peer", year, key, record, field, "Yes");
        });

        // Admin Costs Per Student for Peers
        const adminCostsPerStudent_array = [
          { key: "salAdminAsst_Peer", field: "c201_sal_admin_asst" },
          { key: "ficaAdminAsst_Peer", field: "c203_fica_admin_asst" },
          { key: "healthAdminAsst_Peer", field: "c204_health_admin_asst" },
          { key: "disabilityAdminAsst_Peer", field: "c205_disability_admin_asst" },
          { key: "retirementAdminAsst_Peer", field: "c206_retirement_admin_asst" },
          { key: "housingAdminAsst_Peer", field: "c207_housing_admin_asst" },
          { key: "otherAdminAsst_Peer", field: "c208_other_admin_asst" },
          { key: "totalStudentFte_Peer", field: "g025_ctotal_student_fte" },
          { key: "totalStudentUhc_Peer", field: "g035_ctotal_student_uhc" }
        ];
        adminCostsPerStudent_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "peer", year, key, record, field, "Yes");
        });

        // Net Educational Expense Per Student for Peers
        this.dataStore.insertData(
          "revenueExpense",
          "peer",
          year,
          "netEducationalExpensePerStudentRatio_Peer",
          record,
          "r138_cnet_educational_expenses_per_student",
          "Yes"
        );

        // Tuition Dependency for Peers
        const tuitionDependency_array = [
          { key: "ratio_Peer", field: "r147_cnet_tuition_dependency_ratio" },
          { key: "netTuitionAndFees_Peer", field: "r026_cnet_tuition_and_fees" },
          { key: "operatingRevenuesSupportAndRelease_Peer", field: "r036_coperating_revenues_support_and_releases" }
        ];
        tuitionDependency_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "peer", year, key, record, field, "Yes");
        });

        // Tuition Discount Rate for Peers
        const tuitionDiscountRate_array = [
          { key: "ratio_Peer", field: "r229_ctuition_discount_rate" },
          { key: "revenueScholarshipsAndFinanancialAid_Peer", field: "r024_revenue_scholarships_and_financial_aid" },
          { key: "revenueTuitionAndFees_Peer", field: "r023_revenue_tuition_and_fees" }
        ];
        tuitionDiscountRate_array.forEach(({ key, field }) => {
          this.dataStore.insertData("revenueExpense", "peer", year, key, record, field, "Yes");
        });
      });
    });
  }

  processFinancialPositionData(years, recordsPeer, recordsClient) {
    const currentRatio_obj = {};
    const liquidity_obj = {};

    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      filteredClientRecords.forEach((record) => {
        // Current Ratio
        const currentRatio_array = [
          { key: "cashAndCashEquivalents_Client", field: "r001_cash_and_cash_equivalents" },
          { key: "accountsReceivable_Client", field: "r002_accounts_receivable_net" },
          { key: "studentLoansAndOtherReceivables_Client", field: "r003_student_loans_and_other_receivables" },
          { key: "contributionsReceivable_Client", field: "r004_contributions_receivable" },
          { key: "prepaidExpensesAndOtherAssets_Client", field: "r005_prepaid_expenses_and_other_assets" },
          { key: "shortTermInvestments_Client", field: "r289_investments" },
          { key: "accountsPayableAndAccruedExpenses_Client", field: "r009_accounts_payable_and_accrued_liabilities" },
          { key: "deferredRevenue_Client", field: "r010_deferred_revenue" },
          { key: "postRetirementHealthBenefits_Client", field: "r011_post_retirement_health_benefits" },
          { key: "annuityObligations_Client", field: "r012_annuity_obligations" },
          { key: "otherLiabilities_Client", field: "r013_other_liabilities" }
        ];
        currentRatio_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialPosition", "client", year, key, record, field);
        });

        // Liquidity
        const liquidity_array = [
          { key: "fasbLiquidity_Client", field: "r250_fasb_liquidity" },
          { key: "quasiEndowment_Client", field: "r251_quasi_endowment" },
          { key: "lineOfCredit_Client", field: "r252_line_of_credit_available" }
        ];
        liquidity_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialPosition", "client", year, key, record, field);
        });
      });

      // Process peer recordsd
      filteredPeerRecords.forEach((record) => {
        // Current Ratio for Peers
        this.dataStore.insertData(
          "financialPosition",
          "peer",
          year,
          "currentRatio_Peer",
          record,
          "r258_ccurrent_ratio",
          "Yes"
        );

        // Current Assets for Peers
        this.dataStore.insertData(
          "financialPosition",
          "peer",
          year,
          "currentAssets_Peer",
          record,
          "r256_ccurrent_assets",
          "Yes"
        );

        // Current Liabilities for Peers
        this.dataStore.insertData(
          "financialPosition",
          "peer",
          year,
          "currentLiabilities_Peer",
          record,
          "r257_ccurrent_liabilities",
          "Yes"
        );

        // Liquidity for Peers
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

  processFinancialAnalysisData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Total Liabilities and Assets
        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "totalLiabilities_Peer",
          record,
          "r016_ctotal_liabilities",
          "Yes"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "totalAssets_Peer",
          record,
          "r008_ctotal_assets",
          "Yes"
        );

        // Source of Income for Peers
        this.dataStore.insertData(
          "financialAnalysis",
          "peer", 
          year,
          "soiTotal_Peer",
          record,
          "dashboard_c002_income_____total",
          "Yes"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "revenueTuitionAndFees_Peer",
          record,
          "dashboard_c002a_income_____tuition",
          "Yes"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "revenueAuxiliaryActivities_Peer",
          record,
          "dashboard_c002b_income_____auxiliary",
          "Yes"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "revenueContributions_Peer",
          record,
          "dashboard_c002c_income_____contributions",
          "Yes"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "revenueInvestmentIncome_Peer",
          record,
          "dashboard_c002d_income_____investments",
          "Yes"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "revenueOther_Peer",
          record,
          "dashboard_c002e_income_____other_sources",
          "Yes"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "peer",
          year,
          "releasedGifts_Peer",
          record,
          "dashboard_c002f_income_____released_gifts",
          "Yes"
        );
      });

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Total Assets, Liabilities, and Net Position
        this.dataStore.insertData(
          "financialAnalysis",
          "client",
          year,
          "totalAssets_Client",
          record,
          "r008_ctotal_assets"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "client",
          year,
          "totalLiabilities_Client",
          record,
          "r016_ctotal_liabilities"
        );

        this.dataStore.insertData(
          "financialAnalysis",
          "client",
          year,
          "netPosition_Client",
          record,
          "r020_ctotal_net_assets"
        );

        // Source of Income for Client
        const sourceOfIncomeFields = [
          { key: "si_revenueTuitionAndFees_Client", field: "r026_cnet_tuition_and_fees" },
          { key: "si_revenueAuxiliaryActivities_Client", field: "r028_revenue_auxiliary_activities" },
          { key: "si_revenueContributions_Client", field: "r033_revenue_contributions" },
          { key: "si_revenueContributionsLargeOneTimeGifts_Client", field: "r033a_revenue_contributions_large_one_time_gifts" },
          { key: "si_revenueInvestmentIncome_Client", field: "r029_revenue_investment_income" },
          { key: "si_netAssetsReleased_Client", field: "r034_revenue_net_assets_released_from_restriction" },
          { key: "si_revenueEndowmentSpendingAppropriation_Client", field: "r030_revenue_endowment_spending_appropriation" },
          { key: "si_revenueOther_Client", field: "r031_revenue_other" }
        ];

        sourceOfIncomeFields.forEach(({ key, field }) => {
          this.dataStore.insertData("financialAnalysis", "client", year, key, record, field);
        });

        // Financial Flow Analysis for Client
        const financialFlowFields = [
          { key: "ffa_revenueTuitionAndFees_Client", field: "r023_revenue_tuition_and_fees" },
          { key: "ffa_revenueScholarshipsAndFinancialAid_Client", field: "r024_revenue_scholarships_and_financial_aid" },
          { key: "ffa_totalRevenueContributions_Client", field: "r035_ctotal_revenue_from_contributions" },
          { key: "ffa_revenueAuxiliaryActivities_Client", field: "r028_revenue_auxiliary_activities" },
          { key: "ffa_revenueOther_Client", field: "r031_revenue_other" },
          { key: "ffa_revenueInvestmentIncome_Client", field: "r029_revenue_investment_income" },
          { key: "ffa_revenueEndowmentSpendingAppropriation_Client", field: "r030_revenue_endowment_spending_appropriation" },
          { key: "ffa_changeInNetAssetsWithDR_Client", field: "r059_cchange_in_net_assets_with_donor_restrictions" },
          { key: "ffa_netChangeRestrictedInPerpetuity_Client", field: "r064_cnet_change_restricted_in_perpetuity" },
          { key: "ffa_contributions_Client", field: "r054_contributions" },
          { key: "ffa_changeInPermanentlyRestrictedNA_Client", field: "r060_change_in_permanently_restricted_net_assets_contributions" },
          { key: "ffa_salariesAndWages_Client", field: "r160_salaries_and_wages" },
          { key: "ffa_employeeBenefits_Client", field: "r161_employee_benefits" },
          { key: "ffa_servicesSuppliesAndOther_Client", field: "r162_services_supplies_and_other" },
          { key: "ffa_occupancyUtilitiesAndMaintenance_Client", field: "r163_occupancy_utilities_and_maintenance" },
          { key: "ffa_incomeExpenseSurplusDefecit_Client", field: "dashboard_c001_income_expense_surplus_defecit" },
          { key: "ffa_interest_Client", field: "r165_interest" },
          { key: "ffa_totalFunctionalExpenses_Client", field: "r044_ctotal_functional_expenses" },
          { key: "ffa_depreciationAndAmortization_Client", field: "r164_depreciation_and_amortization" }
        ];

        financialFlowFields.forEach(({ key, field }) => {
          this.dataStore.insertData("financialAnalysis", "client", year, key, record, field);
        });

        // Cash Flows Trend for Client
        const cashFlowsFields = [
          { key: "cft_OperatingActivities_Client", field: "r080_cnet_cash_provided_by_operating_activities" },
          { key: "cft_InvestingActivities_Client", field: "r085_cnet_cash_used_in_investing_activities" },
          { key: "cft_FinancingActivities_Client", field: "r089_cnet_cash_used_in_financing_activities" },
          { key: "cft_TotalActivities_Client", field: "r283_ctotal_cash_flows" }
        ];

        cashFlowsFields.forEach(({ key, field }) => {
          this.dataStore.insertData("financialAnalysis", "client", year, key, record, field);
        });

        // Dashboard Surplus/Deficit
        this.dataStore.insertData(
          "financialAnalysis",
          "client",
          year,
          "dashboardSurplusDefecit_Client",
          record,
          "dashboard_c001_income_expense_surplus_defecit"
        );
      });
    });
  }

  processDoeData(years, recordsPeer, recordsClient) {
    years.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(
        recordsClient,
        year
      );
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      // Process client records
      filteredClientRecords.forEach((record) => {
        // Composite Score
        this.dataStore.insertData(
          "doe",
          "client",
          year,
          "doeOverall_Client",
          record,
          "r245_cdoe_overall__composite_score_"
        );

        // Primary Reserve Ratio
        const primaryReserveFields = [
          ["doePrimaryReserveRatio_Client", "r232_cdoe_primary_reserve_ratio"],
          ["doePrimaryReserveStrengthFactor_Client", "r233_cdoe_primary_reserve_strength_factor"],
          ["doePrimaryReserveRatioWeighted_Client", "r234_cdoe_primary_reserve_ratio_weighted"],
          ["expendableNetAssets_Client", "r230_cdoe_primary_reserve_expendable_net_assets"],
          ["totalExpenses_Client", "r230_cdoe_primary_reserve_expendable_net_assets"],
        ];

        primaryReserveFields.forEach(([key, field]) => {
          this.dataStore.insertData("doe", "client", year, key, record, field);
        });

        // Equity Ratio
        const equityFields = [
          ["doeEquityRatio_Client", "r237_cdoe_equity_ratio"],
          ["doeEquityStrengthFactor_Client", "r238_cdoe_equity_strength_factor"],
          ["doeEquityRatioWeighted_Client", "r239_cdoe_equity_ratio_weighted"],
          ["modifiedNetAssets_Client", "r235_cdoe_equity_modified_net_assets"],
          ["modifiedAssets_Client", "r236_cdoe_equity_modified_assets"],
        ];

        equityFields.forEach(([key, field]) => {
          this.dataStore.insertData("doe", "client", year, key, record, field);
        });

        // Net Income Ratio
        const netIncomeFields = [
          ["doeNetIncomeRatio_Client", "r242_cdoe_net_income_ratio"],
          ["doeNetIncomeStrengthFactor_Client", "r243_cdoe_net_income_strength_factor"],
          ["doeNetIncomeRatioWeighted_Client", "r244_cdoe_net_income_ratio_weighted"],
          [
            "changeInUnrestrictedNetAssets_Client",
            "r240_cdoe_net_income_change_in_net_assets_without_donor_restrictions",
          ],
          [
            "totalUnrestrictedRevenue_Client",
            "r241_cdoe_net_income_total_revenue_and_gains_without_donor_restrictions",
          ],
        ];

        netIncomeFields.forEach(([key, field]) => {
          this.dataStore.insertData("doe", "client", year, key, record, field);
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

  processFinancialStatementData(years, recordsPeer, recordsClient) {

    const allYears = yearsData_Array.sort((a, b) => a - b);

    // console.log('allYears', allYears);

    allYears.forEach((year) => {
      const filteredClientRecords = this.filterRecordsByYear(recordsClient, year);
      const filteredPeerRecords = this.filterRecordsByYear(recordsPeer, year);

      filteredClientRecords.forEach((record) => {
        if (record.querySelector("_9999_completion_test_fs_tab").innerHTML === "IN PROCESS") {
          return;
        }

        // Total Assets
        const totalAssets_array = [
          { key: "cashAndCashEquivalents_Client", field: "r001_cash_and_cash_equivalents" },
          { key: "accountsReceivable_Client", field: "r002_accounts_receivable_net" },
          { key: "studentLoansAndOtherReceivables_Client", field: "r003_student_loans_and_other_receivables" },
          { key: "contributionsReceivable_Client", field: "r004_contributions_receivable" },
          { key: "prepaidExpensesAndOtherAssets_Client", field: "r005_prepaid_expenses_and_other_assets" },
          { key: "financingLeasesRightOfUseAssets_Client", field: "r290_financing_leases_right_of_use_assets" },
          { key: "propertyAndEquipment_Client", field: "r006_property_and_equipment_net" },
          { key: "investmentsHeldForLongTermPurposes_Client", field: "r007_investments_held_for_long_term_purposes" },
          { key: "investmentsHeldForShortTermPurposes_Client", field: "r289_investments" },
          { key: "totalAssets_Client", field: "r008_ctotal_assets" }
        ];
        totalAssets_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Total Liabilities
        const totalLiabilities_array = [
          { key: "accountsPayableAndAccruedExpenses_Client", field: "r009_accounts_payable_and_accrued_liabilities" },
          { key: "deferredRevenue_Client", field: "r010_deferred_revenue" },
          { key: "postRetirementHealthBenefits_Client", field: "r011_post_retirement_health_benefits" },
          { key: "annuityObligations_Client", field: "r012_annuity_obligations" },
          { key: "financingLeasesRightOfUseLiabilities_Client", field: "r291_financing_leases_right_of_use_liabilities" },
          { key: "otherLiabilities_Client", field: "r013_other_liabilities" },
          { key: "interestRateSwapLiability_Client", field: "r014_interest_rate_swap_liability" },
          { key: "bondsAndNotesPayable_Client", field: "r015_notes_payable" },
          { key: "totalLiabilities_Client", field: "r016_ctotal_liabilities" }
        ];
        totalLiabilities_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Net Assets
        const netAssets_array = [
          { key: "withoutDonorRestrictions_Client", field: "r017_net_assets_without_donor_restriction" },
          { key: "restrictedByTimeOrPurpose_Client", field: "r018_net_assets_restricted_by_time_or_purpose" },
          { key: "restrictedInPerpetuity_Client", field: "r019_net_assets_restricted_in_perpetuity" }, 
          { key: "netAssets_Client", field: "r020_ctotal_net_assets" }
        ];
        netAssets_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Revenue and Support
        const revenueAndSupport_array = [
          { key: "tuitionAndFees_Client", field: "r023_revenue_tuition_and_fees" },
          { key: "scholarshipsAndFinancialAid_Client", field: "r024_revenue_scholarships_and_financial_aid" },
          { key: "netTuitionAndFees_Client", field: "r026_cnet_tuition_and_fees" },
          { key: "auxiliaryActivities_Client", field: "r028_revenue_auxiliary_activities" },
          { key: "revenueInvestmentIncome_Client", field: "r029_revenue_investment_income" },
          { key: "revenueEndowmentSpendingAppropriation_Client", field: "r030_revenue_endowment_spending_appropriation" },
          { key: "revenueAndSupportOther_Client", field: "r031_revenue_other" },
          { key: "nonContributionRevenue_Client", field: "r032_cnon_contribution_revenue" },
          { key: "contributions_Client", field: "r054_contributions" },
          { key: "contributionsLargeOneTimeGifts_Client", field: "r033a_revenue_contributions_large_one_time_gifts" },
          { key: "netAssetsReleasedFromRestriction_Client", field: "r034_revenue_net_assets_released_from_restriction" },
          { key: "totalRevenueContributions_Client", field: "r035_ctotal_revenue_from_contributions" },
          { key: "operatingRevenuesSupportAndReleases_Client", field: "r036_coperating_revenues_support_and_releases" },
          { key: "revenueAndSupport_Client", field: "r036_coperating_revenues_support_and_releases" }
        ];
        revenueAndSupport_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Educational Program Expenses
        const educationalProgramExpenses_array = [
          { key: "educationalProgramInstruction_Client", field: "r037_expenses_educational_program_instruction" },
          { key: "educationalProgramResearch_Client", field: "r038_expenses_educational_program_research" },
          { key: "educationalProgramAcademicSupport_Client", field: "r039_expenses_educational_program_academic_support" },
          { key: "educationalProgramStudentServices_Client", field: "r040_expenses_educational_program_student_services" },
          { key: "educationalProgramAuxiliaryActivities_Client", field: "r041_expenses_educational_program_auxiliary_activities" },
          { key: "educationalProgramInstitutionalSupport_Client", field: "r042_expenses_educational_program_institutional_support" },
          { key: "educationalProgramPublicService_Client", field: "r043_expenses_educational_program_public_service" },
          { key: "educationalProgramExpenses_Client", field: "r044_ctotal_functional_expenses" },
          { key: "educationalProgramFundraisingExpenses_Client", field: "r280_fundraising_expenses" },
          { key: "educationalProgramOther_Client", field: "r281_other_expenses" }
        ];
        educationalProgramExpenses_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Non-Operating Activities
        const nonOperatingActivities_array = [
          { key: "nonOperatingInvestmentIncome_Client", field: "r047_non_operating_activities_investment_income" },
          { key: "nonOperatingEndowmentSpendingPolicyAppropriation_Client", field: "r048_investments_net_in_excess_of_amounts_appropriated_for_spending" },
          { key: "changeInValueOfInterestRateSwap_Client", field: "r049_non_operating_activities_change_in_value_of_split_interest_agreements" },
          { key: "adjustmentToPRBO_Client", field: "r050_non_operating_activities_adjustment_to_prbo" },
          { key: "contributionsAndOther_Client", field: "r051_other_gains_losses" },
          { key: "nonOperatingActivities_Client", field: "r052_ctotal_non_operating_changes" }
        ];
        nonOperatingActivities_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Changes in Net Assets with DR
        const changesInNetAssetsWithDR_array = [
          { key: "contributions_Client", field: "r054_contributions" },
          { key: "investmentIncomePlusEndowment_Client", field: "r055_investment_return_net" },
          { key: "endowmentSpendingPolicy_Client", field: "r056_change_in_temporarily_restricted_net_assets_endowment_spending_policy_approp" },
          { key: "netAssetsReleasedFromProgram_Client", field: "r058_net_assets_released_from_restriction" },
          { key: "temporarilyRestrictedNetChange_Client", field: "r059_cchange_in_net_assets_with_donor_restrictions" },
          { key: "permanentlyRestrictedContributions_Client", field: "r060_change_in_permanently_restricted_net_assets_contributions" },
          { key: "investmentIncome_Client", field: "r061_change_in_permanently_restricted_net_assets_investment_income" },
          { key: "netAssetsReleased_Client", field: "r063_change_in_permanently_restricted_net_assets_released_from_program_restrictions" },
          { key: "permanentlyRestrictedNetChange_Client", field: "r064_cnet_change_restricted_in_perpetuity" },
          { key: "changesInNetAssetsWithDR_Client", field: "r065_cchange_in_net_assets" }
        ];
        changesInNetAssetsWithDR_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Natural Expense Categories
        const naturalExpenseCategories_array = [
          { key: "salariesAndWages_Client", field: "r160_salaries_and_wages" },
          { key: "employeeBenefits_Client", field: "r161_employee_benefits" },
          { key: "servicesSuppliesAndOther_Client", field: "r162_services_supplies_and_other" },
          { key: "occupancyUtilitiesAndMaintenance_Client", field: "r163_occupancy_utilities_and_maintenance" },
          { key: "depreciationAndAmortization_Client", field: "r164_depreciation_and_amortization" },
          { key: "interest_Client", field: "r165_interest" },
          { key: "naturalExpenseCategories_Client", field: "r166_ctotal_natural_category_expenses" }
        ];
        naturalExpenseCategories_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Cash Flows Operating
        const cashFlowsOperating_array = [
          { key: "depreciation_Client", field: "r070_adjustments_depreciation" },
          { key: "adjustmentsGiftsAndGrantsRestrictedInPerpetuity_Client", field: "r071_adjustments_gifts_and_grants_restricted_in_perpetuity" },
          { key: "gainOnInvestment_Client", field: "r072_adjustments_gain_on_investments" },
          { key: "derivativeCSLVIAmortBondCosts_Client", field: "r073_adjustments_derivative_cslvi_amort_bond_costs" },
          { key: "adjustmentsAccountsReceivable_Client", field: "r074_adjustments_accounts_receivable" },
          { key: "adjustmentsInventory_Client", field: "r075_adjustments_inventory" },
          { key: "adjustmentsPrepaidsAndOtherAssets_Client", field: "r076_adjustments_prepaids_and_other_assets" },
          { key: "cashFlowsAccountsPayableAndAccruedExpenses_Client", field: "r077_adjustments_accounts_payable_and_accrued_expenses" },
          { key: "cashFlowsDeferredRevenue_Client", field: "r078_adjustments_deferred_revenue" },
          { key: "adjustmentsOtherLiabilities_Client", field: "r079_adjustments_other_liabilities" },
          { key: "cashFlowsOperatingActivities_Client", field: "r080_cnet_cash_provided_by_operating_activities" },
          { key: "netCashFlowOperatingActivities_Client", field: "r081_cnet_cash_provided_by_operating_activities" },
        ];
        cashFlowsOperating_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Cash Flows Investing
        const cashFlowsInvesting_array = [
          { key: "purchaseOfInvestments_Client", field: "r081_cash_flows_from_investing_activities_purchase_of_investments" },
          { key: "proceedsFromSaleOfInvestments_Client", field: "r082_cash_flows_from_investing_activities_proceeds_from_sale_of_investments" },
          { key: "purchaseOfPropertyAndEquipment_Client", field: "r083_cash_flows_from_investing_activities_purchases_of_property_and_equipment" },
          { key: "studentLoanFund_Client", field: "r084_cash_flows_from_investing_activities_student_loan_fund" },
          { key: "otherInvestingActivity_Client", field: "r282_other_investing_activity" },
          { key: "cashFlowsInvestingActivities_Client", field: "r085_cnet_cash_used_in_investing_activities" }
        ];
        cashFlowsInvesting_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Cash Flows Financing
        const cashFlowsFinancing_array = [
          { key: "proceedsFromNotesPayable_Client", field: "r086_cash_flows_from_financing_activities_proceeds_from_notes_payable" },
          { key: "principalPaymentsOnNotesPayable_Client", field: "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable" },
          { key: "cashFlowsFinancingOther_Client", field: "r088_cash_flows_from_financing_activities_other" },
          { key: "cashFlowsFinancingActivities_Client", field: "r089_cnet_cash_used_in_financing_activities" },
        ];
        cashFlowsFinancing_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });

        // Property and Equipment
        const propertyAndEquipment_array = [
          { key: "landAndImprovements_Client", field: "r093_property_and_equipment_land_and_improvements" },
          { key: "buildingAndImprovements_Client", field: "r094_property_and_equipment_buildings_and_improvements" },
          { key: "furnitureAndEquipment_Client", field: "r095_property_and_equipment_furniture_and_equipment" },
          { key: "cip_Client", field: "r096_property_and_equipment_cip" },
          { key: "totalPropertyAndEquipment_Client", field: "r097_ctotal_property_and_equipment_at_cost" },
          { key: "accumulatedDepreciation_Client", field: "r098_accumulated_depreciation" },
          { key: "propertyAndEquipmentLessDepreciation_Client", field: "r099_ctotal_property_and_equipment_less_depreciation" }
        ];
        propertyAndEquipment_array.forEach(({ key, field }) => {
          this.dataStore.insertData("financialStatement", "client", year, key, record, field);
        });
      });

      // Process peer records
      filteredPeerRecords.forEach((record) => {
        // Add peer data processing here if needed
        // Similar structure as client data but with "_Peer" suffix
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
          const fiscalYear = record.querySelector("year")?.textContent;
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

      // Basic query condition with year
      const queryCondition = `{7.EX.${currentYear}} AND ${clientQuery} AND {638.EX.'COMPLETE'}`;
      // console.log(`Using query condition: ${queryCondition}`);

      const apiCallPeerData = {
        act: "API_DoQuery",
        query: queryCondition,
        clist:
          "7.3.536.619.537.618.534.539.758.759.757.760.761.741.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395.390.391.549.392.395.393.394.411.450.451.452.453.454.455.727.546.397.394.398.622.621.623.624.625.626.627.629.630.631.632.633.634.635.636.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.481.91.111.131.151.171.191.557.616.614.615.386.641.217.557.611.605.552.391.390.609.217.557.643.644.645.646.550.638.566.439"
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
    // console.log(`Fetching client data for year: ${currentYear}`);

    try {
      const apiCallClientData = {
        act: "API_DoQuery",
        query: `
          {7.EX.${currentYear}} AND {533.EX.${ClientRid}}`,
        clist:
          "3.539.7.533.536.619.537.618.534.580.578.576.577.579.712.725.722.719.714.726.723.720.717.724.721.718.387.388.569.386.632.551.550.406.561.418.567.441.540.541.542.600.606.390.392.396.393.395.391.549.394.411.450.451.452.453.454.455.727.570.571.572.546.397.398.373.374.375.376.377.378.379.380.381.382.383.384.385.326.541.387.338.542.390.391.548.402.403.404.405.551.407.408.409.410.557.411.412.415.416.417.560.561.419.420.421.422.423.424.425.426.427.428.571.435.572.566.389.399.400.401.402.403.404.405.551.406.407.408.409.410.557.411.412.413.414.559.415.416.417.560.561.450.451.452.453.454.455.429.430.431.432.571.433.434.435.572.437.438.439.440.567.441.567.441.569.442.429.641.635.481.482.483.709.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.450.451.551.546.711.614.613.633.603.633.621.710.504.550.217.980.981.982.985.983.984.609.608.581.582.583.584.585.586.587.588.589.590.591.592.593.594.595.596.971.972.973.355.1075.1076.1077.1078.1012.993.1013.1014.859.259",
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

      
      // console.log("dataStr CLIENT", dataStr);

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

  // Get records for unique client peer name with additional data
  async getRecordsForUniqueClientPeerNames() {
    const apiCallPeerData = {
      act: "API_DoQuery",
      clist: "7.539.667.619.758.759.757.760.761.741.536.557",
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
          record.querySelector("merged_client_name")?.textContent;

        if (clientName) {

          uniquePeerClientNames.add(clientName);

          // Store client data with all required fields
          if (!window.clientDataStore[clientName]) {
            // Get fiscal year
            const year = record.querySelector("year")?.textContent;

            // Get mission unit value
            const enrollmentVal =
              record.querySelector("g025_ctotal_student_fte")
                ?.textContent || "0";

            // Get region value
            const regionVal =
              record.querySelector("client___he__g001_geographic_region")
                ?.textContent || "0";

            // Get statevalue
            const stateVal =
              record.querySelector("client___merged_state")?.textContent || "0";

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
              record.querySelector(
                "client___he__a001_athletic_classificiationquery"
              )?.textContent || "";
            const athleticQuery = athleticQueryText
              ? athleticQueryText.split(";").filter(Boolean)
              : [];

            // Get seminary query - parse from string to array
            const seminaryQueryText =
              record.querySelector("client___he___seminary_projectquery")
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
          // console.log("xmlString getRecordsForUniqueClientPeerNames()", xmlString);
          
        }
      });

      // Close the XML string
      xmlString += "</qdbapi>";

      // Print the XML string to console
      // console.log("getRecordsForUniqueClientPeerNames XML", xmlString);

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

    // console.log("Filter change detected. Updating client selection...");

    // Call the function that updates client checkboxes based on current filters
    if (typeof headerUpdateClientDropdown === "function") {
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
    const selectedMemberships = Array.from(
      window.selectedMemberships_Array || []
    );
    const selectedTypes = Array.from(window.selectedTypes_Array || []);
    const selectedAthletics = Array.from(window.selectedAthletics_Array || []);
    const selectedSeminaries = Array.from(
      window.selectedSeminaries_Array || []
    );
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
          clientData.enrollment <= maxEnrollment;
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

  // Build a query condition for clients
  getClientQuery(selectedClientsSet) {
    // Convert Set to Array for iteration
    const selectedClients = Array.from(selectedClientsSet);

    // If empty, return default condition
    if (selectedClients.length === 0) {
      return '({539.EX.""})';
    }

    // For 15 or fewer clients, use specific OR conditions
    // For more than 15 clients, the batched approach will be used instead
    const clientConditions = selectedClients
      .map((client) => `{539.EX.'${this._escapeClientName(client)}'}`)
      .join(" OR ");

    return `(${clientConditions})`;
  }

  // New method to handle batched client queries for large client sets
  async getRecordsForPeerWithBatching(years, selectedClientsSet, dataStr = "<qdbapi>") {
    const selectedClients = Array.from(selectedClientsSet);
    
    // If 15 or fewer clients, use the original method
    if (selectedClients.length <= 15) {
      return await this.getRecordsForPeer(years, dataStr);
    }

    console.log(`Using batched approach for ${selectedClients.length} clients`);
    
    // Split clients into batches of 10 (safe for QuickBase query limits)
    const BATCH_SIZE = 80;
    const clientBatches = [];
    for (let i = 0; i < selectedClients.length; i += BATCH_SIZE) {
      clientBatches.push(selectedClients.slice(i, i + BATCH_SIZE));
    }

    // console.log(`Split into ${clientBatches.length} batches of ${BATCH_SIZE} clients each`);

    // Process each year with all batches
    for (const currentYear of years) {
      console.log(`Processing year ${currentYear} with ${clientBatches.length} batches`);
      
      for (let batchIndex = 0; batchIndex < clientBatches.length; batchIndex++) {
        const clientBatch = clientBatches[batchIndex];
        // console.log(`Processing batch ${batchIndex + 1}/${clientBatches.length} with ${clientBatch.length} clients`);
        
        try {
          // Build query for this specific batch
          const clientConditions = clientBatch
            .map((client) => `{539.EX.'${this._escapeClientName(client)}'}`)
            .join(" OR ");
          const batchClientQuery = `(${clientConditions})`;
          
          // Basic query condition with year and batch client query
          const queryCondition = `{7.EX.${currentYear}} AND ${batchClientQuery} AND {638.EX.'COMPLETE'}`;
          
          const apiCallPeerData = {
            act: "API_DoQuery",
            query: queryCondition,
            clist:
              "7.3.536.619.537.618.534.539.758.759.757.760.761.741.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395.390.391.549.392.395.393.394.411.450.451.452.453.454.455.727.546.397.394.398.622.621.623.624.625.626.627.629.630.631.632.633.634.635.636.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.481.91.111.131.151.171.191.557.616.614.615.386.641.217.557.611.605.552.391.390.609.217.557.643.644.645.646.550.638.566.439"
          };

          const xml = await $.get(peerData, apiCallPeerData);
          const recordsForPeer = $("record", xml).toArray();
          
          // console.log(`Batch ${batchIndex + 1}: Received ${recordsForPeer.length} records for year ${currentYear}`);

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

          // Add a small delay between batches to avoid overwhelming the API
          if (batchIndex < clientBatches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.error(`Error fetching peer data for year ${currentYear}, batch ${batchIndex + 1}:`, error);
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
      // console.log(`Batched approach completed: Parsed ${records.length} total peer records`);
      return records;
    } catch (error) {
      console.error("Error parsing XML in batched approach:", error);
      return [];
    }
  }

  // New method to handle batched client queries for large client sets


  // Add this helper method to the ApiService class
  _escapeClientName(clientName) {
    if (!clientName) return "";
    // Replace problematic characters in client names
    return clientName.replace(/'/g, "\\'");
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

    const statesListElement = document.getElementById("options-list-state");
    if (
      statesListElement &&
      (!statesListElement.children.length ||
        statesListElement.children.length <= 1)
    ) {
      addUniqueStatesToOptionsSelectStatesDropdown(states_Array);
    }

    const membershipsListElement = document.getElementById(
      "options-list-membership"
    );
    if (
      membershipsListElement &&
      (!membershipsListElement.children.length ||
        membershipsListElement.children.length <= 1)
    ) {
      addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);
    }

    const athleticsListElement = document.getElementById(
      "options-list-athletic"
    );
    if (
      athleticsListElement &&
      (!athleticsListElement.children.length ||
        athleticsListElement.children.length <= 1)
    ) {
      addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);
    }

    const seminariesListElement = document.getElementById(
      "options-list-seminary"
    );
    if (
      seminariesListElement &&
      (!seminariesListElement.children.length ||
        seminariesListElement.children.length <= 1)
    ) {
      addUniqueSeminariesToOptionsSelectSeminariesDropdown(seminaries_Array);
    }

    const regionalsListElement = document.getElementById(
      "options-list-regional"
    );
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
      // "debtEndowmentData",
      "ltDebtPerTotalOperatingRevenueData",
      "debtServiceCoverageRatioData",
      "debtBurdenRatioData",
      "endowmentOperatingBudgetData",
      "endowmentAssetsPerStudentData",
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
    // console.log("handleRunButtonClick() called");

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

        // this.enableGenerateReportsButton();

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
        // this.enableGenerateReportsButton();

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
        // Use batched approach if more than 15 clients are selected
        const selectedClientsCount = window.selectedClients_Array ? window.selectedClients_Array.size : 0;
        
        if (selectedClientsCount > 15) {
          console.log(`Using batched approach for ${selectedClientsCount} clients`);
          recordsPeer = await this.apiService.getRecordsForPeerWithBatching(selectedYears, window.selectedClients_Array);
        } else {
          recordsPeer = await this.apiService.getRecordsForPeer(selectedYears);
        }

        // Validate records
        if (!recordsPeer || recordsPeer.length === 0) {
          console.warn("No peer records returned");
          createToastWarning("No peer records extracted. Please select more filters");
          showApiLoadingFunction("close");
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
        createToastWarning(
          "Error fetching peer data. Please try again or adjust your filters."
        );
        showApiLoadingFunction("close");
        return; // Stop the process on error as well
      }

      // Fetch client data with error handling
      let recordsClient;
      try {
        recordsClient = await this.apiService.getRecordsForClient(
          yearsData_Array
        );

        window.testRecordsClient = recordsClient;

        /**
         * Extracts the "record_id_" value from the most recent year client record.
         * The first record in recordsClient is always the most recent year.
         * Saves the value to the already initialized "mostRecentYearSourceRecordId".
         */
        if (recordsClient && recordsClient.length > 0) {
          const mostRecentRecord = recordsClient[0];
          const recordIdElement = mostRecentRecord.querySelector("record_id_");
          if (recordIdElement) {
            mostRecentYearSourceRecordId = recordIdElement.textContent;
          } else {
            console.warn('No "record_id_" field found in the most recent client record.');
            mostRecentYearSourceRecordId = null;
          }
        } else {
          mostRecentYearSourceRecordId = null;
        }

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
        // return;
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
      // this.enableGenerateReportsButton();
    } finally {
      // console.log("Finally block in handleRunButtonClick, re-enabling buttons");

      // this.enableGenerateReportsButton();
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

      // Call all display component functions
      displayCfiComponent();
      displayDoeComponent();
      displayFinancialAnalysisContentComponent();
      displayFinancialStatementComponent();
      displayFinancialPositionComponent();
      displayRevenueAndExpenseComponent();
      displayDebtAndEndowmentComponent();
      displayReportComponent();
      // Signal that all components have been displayed
      document.dispatchEvent(new CustomEvent('componentsDisplayed'));

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
        // "debtEndowmentData",
        "ltDebtPerTotalOperatingRevenueData",
        "debtServiceCoverageRatioData",
        "debtBurdenRatioData",
        "endowmentOperatingBudgetData",
        "endowmentAssetsPerStudentData",
      ];

      for (const category of categories) {
        const data = localStorage.getItem(category);
        if (!data || data === "{}") {
          console.warn(`Missing or empty data for category: ${category}`);
          // return false;
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

  // Initialize uniqueClientsPerYearMap based on selectedYears_Set
  window.uniqueClientsPerYearMap = {};

  if (selectedYears_Set) {
    // Convert Set to Array and sort for consistent key order
    const selectedYearsArray = Array.from(selectedYears_Set).sort();
    selectedYearsArray.forEach(year => {
      window.uniqueClientsPerYearMap[year] = new Set();
    });
  }

  // console.log({records});

  try {
    records.forEach((record) => {
      const clientName =
        record.querySelector("merged_client_name")?.textContent;
      const year = record.querySelector("year")?.textContent;

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
      createToastWarning("There are 5 or less Unique Clients in Peer Records.");
    }
    const element = document.getElementById("uniqueClients");
    if (element) {
      element.textContent = count;
    } else {
      createToastWarning("There are 5 or less Unique Clients in Peer Records.");
    }

    // console.log(`Counted ${count} unique clients after filtering`);
    // console.log('Unique clients per year:', window.uniqueClientsPerYearMap);
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
      debtBurdenRatioData: JSON.parse(localStorage.getItem("debtBurdenRatioData")),
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
