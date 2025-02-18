"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var apiCallClientDataForUniqueYears = {
  act: "API_DoQuery",
  query: "{533.EX.".concat(ClientRid, "}"),
  clist: "533.7.539.3"
};
$.get(clientData, apiCallClientDataForUniqueYears).then(function _callee(xml) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap($("record", xml).toArray());

        case 2:
          recordsClient = _context.sent;
          // console.log(recordsClient[0]);
          // console.log(xml);
          clientName = recordsClient[0].querySelector("merged_client_name").textContent;
          document.getElementById("firmName").textContent = clientName;
          recordId = recordsClient[0].querySelector("related_client").textContent; // console.log(recordsClient[0].children)

          if (recordsClient.length > 0) {
            findUniqueYears(recordsClient);
            dataClient = recordsClient[0].children;
          } else {
            console.error("No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid");
          }

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
})["catch"](function (err) {
  return console.error(err);
});
window.addEventListener("beforeunload", function () {
  localStorage.clear();
});
document.addEventListener("DOMContentLoaded", function () {
  getRecordsForUniqueClientsPeerNames();
  addUniqueRegionsToOptionsSelectRegionsDropdown(regions_Array);
  addUniqueStatesToOptionsSelectStatesDropdown(states_Array);
  addUniqueMembershipsToOptionsSelectMembershipsDropdown(memberships_Array);
  addUniqueTypesToOptionsSelectTypesDropdown(types_Array);
  addUniqueAthleticsToOptionsSelectAthleticsDropdown(athletics_Array);
});

var findUniqueYears = function findUniqueYears(data) {
  if (data) {
    data.forEach(function (item) {
      var yearElement = item.querySelector("year");

      if (yearElement) {
        var year = yearElement.textContent; // Check if the year is not already in yearsData_Array to ensure uniqueness

        if (!yearsData_Array.includes(year)) {
          yearsData_Array.push(year);
        }
      }
    });
    yearsData_Array.sort(); //nav-component
    // we want to display all the years

    addUniqueYearsToOptionsSelectDropdown(yearsData_Array);
  }
}; // Main Data Retrieval Functions ----------------------------------------------->


var insertDataIntoObject = function insertDataIntoObject(type, year, object, dataKey, record, child, dynamicValueClientPeer, name) {
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
  var innerData = child == 0 ? 0 : record.querySelector(child).innerHTML.split("").length > 0 ? record.querySelector(child).innerHTML.trim() : 0;

  if (type === "client") {
    if (!object[dataKey]) {
      object[dataKey] = {};
    }

    if (!object[dataKey][year]) {
      object[dataKey][year] = {};
    }

    object[dataKey][year].value = innerData;
    var benchmarkField = dynamicValueClientPeer && record.querySelector(dynamicValueClientPeer).textContent.trim();
    object[dataKey][year].benchmark = benchmarkField;
  } else {
    // type === 'peer'
    var yesNoField = dynamicValueClientPeer == "Yes" ? "Yes" : dynamicValueClientPeer && record.querySelector(dynamicValueClientPeer).textContent.trim();

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

var processDebtEndowmentContentData = function processDebtEndowmentContentData(seletectedYears, recordsPeer, recordsClient) {
  var ltDebtPerTotalOperatingRevenue_obj = {};
  var debtServiceCoverageRatio_obj = {};
  var debtBurdenRatio_obj = {};
  var endowmentOperatingBudget_obj = {};
  var endowmentAssetsPerStudent_obj = {};
  var years = seletectedYears.sort(function (a, b) {
    return a - b;
  });
  years.forEach(function (year) {
    var filteredClientRecords = _toConsumableArray(recordsClient).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredClientRecords.forEach(function (record) {
      var ltDebtPerTotalOperatingRevenue_array = [{
        key: "longTermDebtForLongTermPurpose_Client",
        field: "r285_clong_term_debt_per_total_operating_revenue"
      }, {
        key: "longTermDebt_Client",
        field: "r015_notes_payable"
      }, {
        key: "totalOperatingRevenue_Client",
        field: "r036_coperating_revenues_support_and_releases"
      }];
      ltDebtPerTotalOperatingRevenue_array.forEach(function (_ref) {
        var key = _ref.key,
            field = _ref.field;
        insertDataIntoObject("client", year, ltDebtPerTotalOperatingRevenue_obj, key, record, field);
      });
      var debtServiceCoverageRatio_array = [{
        key: "ratio_Client",
        field: "r288_cdebt_service_coverage_ratio"
      }, {
        key: "debtService_Client",
        field: "r286_cdebt_service"
      }, {
        key: "interest_Client",
        field: "r165_interest"
      }, {
        key: "principalPayments_Client",
        field: "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable"
      }, {
        key: "totalOperatingRevenue_Client",
        field: "r036_coperating_revenues_support_and_releases"
      }];
      debtServiceCoverageRatio_array.forEach(function (_ref2) {
        var key = _ref2.key,
            field = _ref2.field;
        insertDataIntoObject("client", year, debtServiceCoverageRatio_obj, key, record, field);
      });
      var debtBurdenRatio_array = [{
        key: "ratio_Client",
        field: "r287_cdebt_burden_ratio"
      }, {
        key: "debtService_Client",
        field: "r286_cdebt_service"
      }, {
        key: "interest_Client",
        field: "r165_interest"
      }, {
        key: "principalPayments_Client",
        field: "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable"
      }, {
        key: "operationalExpense_Client",
        field: "r044_ctotal_functional_expenses"
      }];
      debtBurdenRatio_array.forEach(function (_ref3) {
        var key = _ref3.key,
            field = _ref3.field;
        insertDataIntoObject("client", year, debtBurdenRatio_obj, key, record, field);
      });
      var endowmentOperatingBudget_array = [{
        key: "ratio_Client",
        field: "r153_cendowment_to_expenses_ratio"
      }, {
        key: "endowment_Client",
        field: "e001_endowment_size"
      }, {
        key: "annualOperatingBudget_Client",
        field: "r044_ctotal_functional_expenses"
      }];
      endowmentOperatingBudget_array.forEach(function (_ref4) {
        var key = _ref4.key,
            field = _ref4.field;
        insertDataIntoObject("client", year, endowmentOperatingBudget_obj, key, record, field);
      });
      var endowmentAssetsPerStudent_Array = [{
        key: "ratio_Client",
        field: "r152_cendowment_assets_per_student"
      }, {
        key: "endowment_Client",
        field: "e001_endowment_size"
      }, {
        key: "totalStudentFte_Client",
        field: "g025_ctotal_student_fte"
      }];
      endowmentAssetsPerStudent_Array.forEach(function (_ref5) {
        var key = _ref5.key,
            field = _ref5.field;
        insertDataIntoObject("client", year, endowmentAssetsPerStudent_obj, key, record, field);
      });
    }); // PEER

    var filteredPeerRecords = _toConsumableArray(recordsPeer).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredPeerRecords.forEach(function (record) {
      var debtBurdenRatio_array = [{
        key: "ratio_Peer",
        field: "r287_cdebt_burden_ratio"
      }, {
        key: "operationalExpense_Peer",
        field: "r044_ctotal_functional_expenses"
      }];
      debtBurdenRatio_array.forEach(function (_ref6) {
        var key = _ref6.key,
            field = _ref6.field;
        insertDataIntoObject("peer", year, debtBurdenRatio_obj, key, record, field, "Yes");
      });
      var endowmentAssetsPerStudent_Array = [{
        key: "ratio_Peer",
        field: "r152_cendowment_assets_per_student"
      }, {
        key: "endowment_Peer",
        field: "e001_endowment_size"
      }, {
        key: "totalStudentFte_Peer",
        field: "g025_ctotal_student_fte"
      }];
      endowmentAssetsPerStudent_Array.forEach(function (_ref7) {
        var key = _ref7.key,
            field = _ref7.field;
        insertDataIntoObject("peer", year, endowmentAssetsPerStudent_obj, key, record, field, "Yes");
      });
    });
  });
  var dataKeys = ["ltDebtPerTotalOperatingRevenueData", "debtServiceCoverageRatioData", "debtBurdenRatioData", "endowmentOperatingBudgetData", "endowmentAssetsPerStudentData"];
  var dataObjects = [ltDebtPerTotalOperatingRevenue_obj, debtServiceCoverageRatio_obj, debtBurdenRatio_obj, endowmentOperatingBudget_obj, endowmentAssetsPerStudent_obj];
  dataKeys.forEach(function (key, index) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

var processRevenueExpenseContentData = function processRevenueExpenseContentData(seletectedYears, recordsPeer, recordsClient) {
  var salariesAndBenefitsToTotalExpense_obj = {};
  var averageEmployeeSalary_obj = {};
  var salariesAndBenefitsPerNetTuition_obj = {};
  var adminCostsPerStudent_obj = {};
  var netEducationalExpensePerStudent_obj = {};
  var annualTraditionalNetTuitionPerStudent_obj = {};
  var tuitionDependency_obj = {};
  var tuitionDiscountRate_obj = {};
  var years = seletectedYears.sort(function (a, b) {
    return a - b;
  });
  years.forEach(function (year) {
    var filteredClientRecords = _toConsumableArray(recordsClient).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredClientRecords.forEach(function (record) {
      var salariesAndBenefitsToTotalExpense_array = [{
        key: "salariesAndBenefitsToTotalExpense_Client",
        field: "r228_csalaries_and_benefits_to_total_expenses"
      }, {
        key: "salariesAndWages_Client",
        field: "r160_salaries_and_wages"
      }, {
        key: "employeeBenefits_Client",
        field: "r161_employee_benefits"
      }, {
        key: "totalFunctionalExpenses_Client",
        field: "r044_ctotal_functional_expenses"
      }];
      salariesAndBenefitsToTotalExpense_array.forEach(function (_ref8) {
        var key = _ref8.key,
            field = _ref8.field;
        insertDataIntoObject("client", year, salariesAndBenefitsToTotalExpense_obj, key, record, field);
      });
      var averageEmployeeSalary_array = [{
        key: "president_Client",
        field: "c011_sal_president"
      }, {
        key: "chiefAcademic_Client",
        field: "c021_sal_chief_academic"
      }, {
        key: "chiefFinance_Client",
        field: "c031_sal_chief_finance"
      }, {
        key: "chiefEnrollment_Client",
        field: "c041_sal_chief_enrollment"
      }, {
        key: "chiefDevelopment_Client",
        field: "c051_sal_chief_development"
      }, {
        key: "chiefOps_Client",
        field: "c061_sal_chief_ops"
      }, {
        key: "dirFinance_Client",
        field: "c071_sal_dir_of_fin_aid"
      }, {
        key: "dirHr_Client",
        field: "c081_sal_dir_of_hr"
      }, {
        key: "dirIt_Client",
        field: "c091_sal_dir_of_it"
      }, {
        key: "dirPhysPlant_Client",
        field: "c101_sal_dir_of_phys_plant"
      }, {
        key: "controller_Client",
        field: "c111_sal_controller"
      }, {
        key: "busMgr_Client",
        field: "c121_sal_bus_mgr"
      }, {
        key: "bursar_Client",
        field: "c131_sal_bursar"
      }, {
        key: "budgetDir_Client",
        field: "c141_sal_budget_dir"
      }, {
        key: "dirAcct_Client",
        field: "c151_sal_dir_of_acct"
      }, {
        key: "srAcct_Client",
        field: "c161_sal_sr_acct"
      }, {
        key: "nonSrAcct_Client",
        field: "c171_sal_non_sr_acct"
      }, {
        key: "stuAcctMgr_Client",
        field: "c181_sal_stu_acct_mgr"
      }, {
        key: "otherBusOffice_Client",
        field: "c191_sal_other_bus_office"
      }, {
        key: "adminAsst_Client",
        field: "c201_sal_admin_asst"
      }];
      averageEmployeeSalary_array.forEach(function (_ref9) {
        var key = _ref9.key,
            field = _ref9.field;
        insertDataIntoObject("client", year, averageEmployeeSalary_obj, key, record, field);
      });
      var salariesAndBenefitsPerNetTuition_array = [{
        key: "salariesAndWages_Client",
        field: "r160_salaries_and_wages"
      }, {
        key: "employeeBenefits_Client",
        field: "r161_employee_benefits"
      }, {
        key: "salariesAndBenefitsPerNetTuition_Client",
        field: "r284_csalaries_and_benefits_per_net_tuition_revenue"
      }, {
        key: "netTuitionAndFees_Client",
        field: "r026_cnet_tuition_and_fees"
      }];
      salariesAndBenefitsPerNetTuition_array.forEach(function (_ref10) {
        var key = _ref10.key,
            field = _ref10.field;
        insertDataIntoObject("client", year, salariesAndBenefitsPerNetTuition_obj, key, record, field);
      });
      insertDataIntoObject("client", year, adminCostsPerStudent_obj, "adminCostsPerStudent_Client", record, "r230_cadmin_costs_per_student");
      var netEducationalExpensePerStudent_array = [{
        key: "ratio_Client",
        field: "r138_cnet_educational_expenses_per_student"
      }, {
        key: "netEducationalExpenses_Client",
        field: "r137_cnet_educational_expenses"
      }, {
        key: "totalStudents_Client",
        field: "g025_ctotal_student_fte"
      }];
      netEducationalExpensePerStudent_array.forEach(function (_ref11) {
        var key = _ref11.key,
            field = _ref11.field;
        insertDataIntoObject("client", year, netEducationalExpensePerStudent_obj, key, record, field);
      });
      var annualTraditionalNetTuitionPerStudent_array = [{
        key: "ratio_Client",
        field: "r136_cnet_tuition_per_student"
      }, {
        key: "netTuitionAndFees_Client",
        field: "r026_cnet_tuition_and_fees"
      }, {
        key: "totalStudents_Client",
        field: "g025_ctotal_student_fte"
      }];
      annualTraditionalNetTuitionPerStudent_array.forEach(function (_ref12) {
        var key = _ref12.key,
            field = _ref12.field;
        insertDataIntoObject("client", year, annualTraditionalNetTuitionPerStudent_obj, key, record, field);
      });
      var tuitionDependency_array = [{
        key: "ratio_Client",
        field: "r147_cnet_tuition_dependency_ratio"
      }, {
        key: "netTuitionAndFees_Client",
        field: "r026_cnet_tuition_and_fees"
      }, {
        key: "operatingRevenuesSupportAndRelease_Client",
        field: "r036_coperating_revenues_support_and_releases"
      }];
      tuitionDependency_array.forEach(function (_ref13) {
        var key = _ref13.key,
            field = _ref13.field;
        insertDataIntoObject("client", year, tuitionDependency_obj, key, record, field);
      });
      var tuitionDiscountRate_array = [{
        key: "ratio_Client",
        field: "r229_ctuition_discount_rate"
      }, {
        key: "revenueScholarshipsAndFinanancialAid_Client",
        field: "r024_revenue_scholarships_and_financial_aid"
      }, {
        key: "revenueTuitionAndFees_Client",
        field: "r023_revenue_tuition_and_fees"
      }];
      tuitionDiscountRate_array.forEach(function (_ref14) {
        var key = _ref14.key,
            field = _ref14.field;
        insertDataIntoObject("client", year, tuitionDiscountRate_obj, key, record, field);
      });
    }); // PEER

    var filteredPeerRecords = _toConsumableArray(recordsPeer).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredPeerRecords.forEach(function (record) {
      var averageEmployeeSalary_array = [{
        key: "president_Peer",
        field: "c011_sal_president"
      }, {
        key: "chiefAcademic_Peer",
        field: "c021_sal_chief_academic"
      }, {
        key: "chiefFinance_Peer",
        field: "c031_sal_chief_finance"
      }, {
        key: "chiefEnrollment_Peer",
        field: "c041_sal_chief_enrollment"
      }, {
        key: "chiefDevelopment_Peer",
        field: "c051_sal_chief_development"
      }, {
        key: "chiefOps_Peer",
        field: "c061_sal_chief_ops"
      }, {
        key: "dirFinance_Peer",
        field: "c071_sal_dir_of_fin_aid"
      }, {
        key: "dirHr_Peer",
        field: "c081_sal_dir_of_hr"
      }, {
        key: "dirIt_Peer",
        field: "c091_sal_dir_of_it"
      }, {
        key: "dirPhysPlant_Peer",
        field: "c101_sal_dir_of_phys_plant"
      }, {
        key: "controller_Peer",
        field: "c111_sal_controller"
      }, {
        key: "busMgr_Peer",
        field: "c121_sal_bus_mgr"
      }, {
        key: "bursar_Peer",
        field: "c131_sal_bursar"
      }, {
        key: "budgetDir_Peer",
        field: "c141_sal_budget_dir"
      }, {
        key: "dirAcct_Peer",
        field: "c151_sal_dir_of_acct"
      }, {
        key: "srAcct_Peer",
        field: "c161_sal_sr_acct"
      }, {
        key: "nonSrAcct_Peer",
        field: "c171_sal_non_sr_acct"
      }, {
        key: "stuAcctMgr_Peer",
        field: "c181_sal_stu_acct_mgr"
      }, {
        key: "otherBusOffice_Peer",
        field: "c191_sal_other_bus_office"
      }, {
        key: "adminAsst_Peer",
        field: "c201_sal_admin_asst"
      }];
      averageEmployeeSalary_array.forEach(function (_ref15) {
        var key = _ref15.key,
            field = _ref15.field;
        insertDataIntoObject("peer", year, averageEmployeeSalary_obj, key, record, field, "Yes");
      });
      var adminCostsPerStudent_Array = [{
        key: "salAdminAsst_Peer",
        field: "c201_sal_admin_asst"
      }, {
        key: "ficaAdminAsst_Peer",
        field: "c203_fica_admin_asst"
      }, {
        key: "healthAdminAsst_Peer",
        field: "c204_health_admin_asst"
      }, {
        key: "disabilityAdminAsst_Peer",
        field: "c205_disability_admin_asst"
      }, {
        key: "retirementAdminAsst_Peer",
        field: "c206_retirement_admin_asst"
      }, {
        key: "housingAdminAsst_Peer",
        field: "c207_housing_admin_asst"
      }, {
        key: "otherAdminAsst_Peer",
        field: "c208_other_admin_asst"
      }, {
        key: "totalStudentFte_Peer",
        field: "g025_ctotal_student_fte"
      }, {
        key: "totalStudentUhc_Peer",
        field: "g035_ctotal_student_uhc"
      }];
      adminCostsPerStudent_Array.forEach(function (_ref16) {
        var key = _ref16.key,
            field = _ref16.field;
        insertDataIntoObject("peer", year, adminCostsPerStudent_obj, key, record, field, "Yes");
      });
      insertDataIntoObject("peer", year, netEducationalExpensePerStudent_obj, "ratio_Peer", record, "r138_cnet_educational_expenses_per_student", "Yes");
      var tuitionDependency_array = [{
        key: "ratio_Peer",
        field: "r147_cnet_tuition_dependency_ratio"
      }, {
        key: "netTuitionAndFees_Peer",
        field: "r026_cnet_tuition_and_fees"
      }, {
        key: "operatingRevenuesSupportAndRelease_Peer",
        field: "r036_coperating_revenues_support_and_releases"
      }];
      tuitionDependency_array.forEach(function (_ref17) {
        var key = _ref17.key,
            field = _ref17.field;
        insertDataIntoObject("Peer", year, tuitionDependency_obj, key, record, field, "Yes");
      });
      var tuitionDiscountRate_array = [{
        key: "ratio_Peer",
        field: "r229_ctuition_discount_rate"
      }, {
        key: "revenueScholarshipsAndFinanancialAid_Peer",
        field: "r024_revenue_scholarships_and_financial_aid"
      }, {
        key: "revenueTuitionAndFees_Peer",
        field: "r023_revenue_tuition_and_fees"
      }];
      tuitionDiscountRate_array.forEach(function (_ref18) {
        var key = _ref18.key,
            field = _ref18.field;
        insertDataIntoObject("Peer", year, tuitionDiscountRate_obj, key, record, field, "Yes");
      });
    });
  });
  var dataKeys = ["salariesAndBenefitsToTotalExpenseData", "averageEmployeeSalaryData", "salariesAndBenefitsPerNetTuitionData", "adminCostsPerStudentData", "netEducationalExpensePerStudentData", "annualTraditionalNetTuitionPerStudentData", "tuitionDependencyData", "tuitionDiscountRateData"];
  var dataObjects = [salariesAndBenefitsToTotalExpense_obj, averageEmployeeSalary_obj, salariesAndBenefitsPerNetTuition_obj, adminCostsPerStudent_obj, netEducationalExpensePerStudent_obj, annualTraditionalNetTuitionPerStudent_obj, tuitionDependency_obj, tuitionDiscountRate_obj];
  dataKeys.forEach(function (key, index) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

var processFinancialPositionContentData = function processFinancialPositionContentData(seletectedYears, recordsPeer, recordsClient) {
  var currentRatio_obj = {};
  var liquidity_obj = {};
  var years = seletectedYears.sort(function (a, b) {
    return a - b;
  });
  years.forEach(function (year) {
    var filteredClientRecords = _toConsumableArray(recordsClient).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredClientRecords.forEach(function (record) {
      var currentRatio_array = [{
        key: "cashAndCashEquivalents_Client",
        field: "r001_cash_and_cash_equivalents"
      }, {
        key: "accountsReceivable_Client",
        field: "r002_accounts_receivable_net"
      }, {
        key: "studentLoansAndOtherReceivables_Client",
        field: "r003_student_loans_and_other_receivables"
      }, {
        key: "contributionsReceivable_Client",
        field: "r004_contributions_receivable"
      }, {
        key: "prepaidExpensesAndOtherAssets_Client",
        field: "r005_prepaid_expenses_and_other_assets"
      }, {
        key: "accountsPayable_Client",
        field: "r009_accounts_payable_and_accrued_liabilities"
      }, {
        key: "deferredRevenue_Client",
        field: "r010_deferred_revenue"
      }, {
        key: "postRetirementHealthBenefits_Client",
        field: "r011_post_retirement_health_benefits"
      }, {
        key: "annuityObligations_Client",
        field: "r012_annuity_obligations"
      }, {
        key: "otherLiabilities_Client",
        field: "r013_other_liabilities"
      }];
      currentRatio_array.forEach(function (_ref19) {
        var key = _ref19.key,
            field = _ref19.field;
        insertDataIntoObject("client", year, currentRatio_obj, key, record, field);
      });
      var liquidity_array = [{
        key: "fasbLiquidity_Client",
        field: "r250_fasb_liquidity"
      }, {
        key: "quasiEndowment_Client",
        field: "r251_quasi_endowment"
      }, {
        key: "lineOfCredit_Client",
        field: "r252_line_of_credit_available"
      }];
      liquidity_array.forEach(function (_ref20) {
        var key = _ref20.key,
            field = _ref20.field;
        insertDataIntoObject("client", year, liquidity_obj, key, record, field);
      });
    });

    var filteredPeerRecords = _toConsumableArray(recordsPeer).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredPeerRecords.forEach(function (record) {
      // currentRatio
      insertDataIntoObject("peer", year, currentRatio_obj, "currentRatio_Peer", record, "r258_ccurrent_ratio", "Yes"); // currentRatio

      insertDataIntoObject("peer", year, currentRatio_obj, "currentAssets_Peer", record, "r256_ccurrent_assets", "Yes"); // currentRatio

      insertDataIntoObject("peer", year, currentRatio_obj, "currentLiabilities_Peer", record, "r257_ccurrent_liabilities", "Yes"); // liquidity

      insertDataIntoObject("peer", year, liquidity_obj, "liquidity_Peer", record, "r250_fasb_liquidity", "Yes");
    });
  });
  var dataKeys = ["currentRatioData", "liquidityData"];
  var dataObjects = [currentRatio_obj, liquidity_obj];
  dataKeys.forEach(function (key, index) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

var processFinancialStatementContentData = function processFinancialStatementContentData(recordsPeer, recordsClient) {
  var totalAssets_obj = {};
  var totalLiabilities_obj = {};
  var netAssets_obj = {};
  var revenueAndSupport_obj = {};
  var educationalProgram_obj = {};
  var nonOperatingActivities_obj = {};
  var changesInNetAssetsWithDR_obj = {};
  var naturalExpenseCategories_obj = {};
  var cashFlowsOperating_obj = {};
  var cashFlowsInvesting_obj = {};
  var cashFlowsFinancing_obj = {};
  var propertyAndEquipment_obj = {};
  var years = yearsData_Array.sort(function (a, b) {
    return a - b;
  });
  years.forEach(function (year) {
    var filteredClientRecords = _toConsumableArray(recordsClient).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredClientRecords.forEach(function (record) {
      if (record.querySelector("_9999_completion_test_fs_tab").innerHTML == "IN PROCESS") {
        return;
      }

      var totalAssets_array = [{
        key: "cashAndCashEquivalents_Client",
        field: "r001_cash_and_cash_equivalents"
      }, {
        key: "accountsReceivable_Client",
        field: "r002_accounts_receivable_net"
      }, {
        key: "studentLoansAndOtherReceivables_Client",
        field: "r003_student_loans_and_other_receivables"
      }, {
        key: "contributionsReceivable_Client",
        field: "r004_contributions_receivable"
      }, {
        key: "prepaidExpensesAndOtherAssets_Client",
        field: "r005_prepaid_expenses_and_other_assets"
      }, {
        key: "propertyAndEquipment_Client",
        field: "r006_property_and_equipment_net"
      }, {
        key: "investmentsHeldForLongTermPurposes_Client",
        field: "r007_investments_held_for_long_term_purposes"
      }, {
        key: "totalAssets_Client",
        field: "r008_ctotal_assets"
      }];
      totalAssets_array.forEach(function (_ref21) {
        var key = _ref21.key,
            field = _ref21.field;
        insertDataIntoObject("client", year, totalAssets_obj, key, record, field);
      });
      var totalLiabilities_array = [{
        key: "accountsPayable_Client",
        field: "r009_accounts_payable_and_accrued_liabilities"
      }, {
        key: "deferredRevenue_Client",
        field: "r010_deferred_revenue"
      }, {
        key: "postRetirementHealthBenefits_Client",
        field: "r011_post_retirement_health_benefits"
      }, {
        key: "annuityObligations_Client",
        field: "r012_annuity_obligations"
      }, {
        key: "otherLiabilities_Client",
        field: "r013_other_liabilities"
      }, {
        key: "interestRateSwapLiability_Client",
        field: "r014_interest_rate_swap_liability"
      }, {
        key: "bondsNotesPayable_Client",
        field: "r015_notes_payable"
      }, {
        key: "totalLiabilities_Client",
        field: "r016_ctotal_liabilities"
      }];
      totalLiabilities_array.forEach(function (_ref22) {
        var key = _ref22.key,
            field = _ref22.field;
        insertDataIntoObject("client", year, totalLiabilities_obj, key, record, field);
      });
      var netAssets_array = [{
        key: "netAssetsWithoutDonorRestriction_Client",
        field: "r017_net_assets_without_donor_restriction"
      }, {
        key: "netAssetsRestrictedByTimeOrPurpose_Client",
        field: "r018_net_assets_restricted_by_time_or_purpose"
      }, {
        key: "netChangeInNetAssetsRestrictedInPerpetuity_Client",
        field: "r019_net_assets_restricted_in_perpetuity"
      }, {
        key: "netAssets_Client",
        field: "r020_ctotal_net_assets"
      }];
      netAssets_array.forEach(function (_ref23) {
        var key = _ref23.key,
            field = _ref23.field;
        insertDataIntoObject("client", year, netAssets_obj, key, record, field);
      });
      var revenueAndSupport_array = [{
        key: "tuitionAndFees_Client",
        field: "r023_revenue_tuition_and_fees"
      }, {
        key: "scholarshipsAndFinancialaid_Client",
        field: "r024_revenue_scholarships_and_financial_aid"
      }, {
        key: "auxiliaryActivities_Client",
        field: "r028_revenue_auxiliary_activities"
      }, {
        key: "investmentIncome_Client",
        field: "r029_revenue_investment_income"
      }, {
        key: "endowmentSpendingAppropriation_Client",
        field: "r030_revenue_endowment_spending_appropriation"
      }, {
        key: "other_Client",
        field: "r031_revenue_other"
      }, {
        key: "contributionsLargeOneTimeGifts_Client",
        field: "r033a_revenue_contributions_large_one_time_gifts"
      }, {
        key: "netAssetsReleasedFromRestriction_Client",
        field: "r034_revenue_net_assets_released_from_restriction"
      }, {
        key: "totalRevenueContributions_Client",
        field: "r035_ctotal_revenue_from_contributions"
      }, {
        key: "revenueAndSupport_Client",
        field: "r036_coperating_revenues_support_and_releases"
      }];
      revenueAndSupport_array.forEach(function (_ref24) {
        var key = _ref24.key,
            field = _ref24.field;
        insertDataIntoObject("client", year, revenueAndSupport_obj, key, record, field);
      });
      var educationalProgramExpenses_array = [{
        key: "expensesEducationalInstruction_Client",
        field: "r037_expenses_educational_program_instruction"
      }, {
        key: "expensesEducationalResearch_Client",
        field: "r038_expenses_educational_program_research"
      }, {
        key: "expensesEducationalAcademicSupport_Client",
        field: "r039_expenses_educational_program_academic_support"
      }, {
        key: "expensesEducationalStudentServices_Client",
        field: "r040_expenses_educational_program_student_services"
      }, {
        key: "expensesEducationalAuxiliaryActivities_Client",
        field: "r041_expenses_educational_program_auxiliary_activities"
      }, {
        key: "expensesEducationalInstitutionalSupport_Client",
        field: "r042_expenses_educational_program_institutional_support"
      }, {
        key: "expensesEducationalPublicService_Client",
        field: "r043_expenses_educational_program_public_service"
      }, {
        key: "educationalProgramExpenses_Client",
        field: "r044_ctotal_functional_expenses"
      }, {
        key: "fundraisingExpenses_Client",
        field: "r280_fundraising_expenses"
      }, {
        key: "otherExpenses_Client",
        field: "r281_other_expenses"
      }];
      educationalProgramExpenses_array.forEach(function (_ref25) {
        var key = _ref25.key,
            field = _ref25.field;
        insertDataIntoObject("client", year, educationalProgram_obj, key, record, field);
      });
      var nonOperatingActivities_array = [{
        key: "investmentIncome_Client",
        field: "r047_non_operating_activities_investment_income"
      }, {
        key: "endowmentSpendingPolicy_Client",
        field: "r048_investments_net_in_excess_of_amounts_appropriated_for_spending"
      }, {
        key: "changeInValueInterestRateSwap_Client",
        field: "r049_non_operating_activities_change_in_value_of_split_interest_agreements"
      }, {
        key: "adjustmentPrbo_Client",
        field: "r050_non_operating_activities_adjustment_to_prbo"
      }, {
        key: "contributionsAndOther_Client",
        field: "r051_other_gains_losses"
      }, {
        key: "nonOperatingActivities_Client",
        field: "r052_ctotal_non_operating_changes"
      }];
      nonOperatingActivities_array.forEach(function (_ref26) {
        var key = _ref26.key,
            field = _ref26.field;
        insertDataIntoObject("client", year, nonOperatingActivities_obj, key, record, field);
      });
      var changesInNetAssetsWithDR_array = [{
        key: "contributions_Client",
        field: "r054_contributions"
      }, {
        key: "investmentIncomePlusEndowment_Client",
        field: "r055_investment_return_net"
      }, {
        key: "endowmentSpendingPolicy_Client",
        field: "r056_change_in_temporarily_restricted_net_assets_endowment_spending_policy_approp"
      }, {
        key: "NetAssetsReleasedFromProgram_Client",
        field: "r058_net_assets_released_from_restriction"
      }, {
        key: "temporarilyRestrictedNetChange_Client",
        field: "r059_cchange_in_net_assets_with_donor_restrictions"
      }, {
        key: "contributions2_Client",
        field: "r060_change_in_permanently_restricted_net_assets_contributions"
      }, {
        key: "investmentIncome_Client",
        field: "r061_change_in_permanently_restricted_net_assets_investment_income"
      }, {
        key: "netAssetsReleased_Client",
        field: "r063_change_in_permanently_restricted_net_assets_released_from_program_restrictions"
      }, {
        key: "permanentlyRestricted_Client",
        field: "r064_cnet_change_restricted_in_perpetuity"
      }, {
        key: "changesInNetAssetsWithDR_Client",
        field: "r065_cchange_in_net_assets"
      }];
      changesInNetAssetsWithDR_array.forEach(function (_ref27) {
        var key = _ref27.key,
            field = _ref27.field;
        insertDataIntoObject("client", year, changesInNetAssetsWithDR_obj, key, record, field);
      });
      var naturalExpenseCategories_array = [{
        key: "salariesAndWages_Client",
        field: "r160_salaries_and_wages"
      }, {
        key: "employeeBenefits_Client",
        field: "r161_employee_benefits"
      }, {
        key: "servicesSuppliesAndOther_Client",
        field: "r162_services_supplies_and_other"
      }, {
        key: "occupancyUtilitiesAndMaintenance_Client",
        field: "r163_occupancy_utilities_and_maintenance"
      }, {
        key: "depreciationAndAmortization_Client",
        field: "r164_depreciation_and_amortization"
      }, {
        key: "interest_Client",
        field: "r165_interest"
      }, {
        key: "naturalExpenseCategories_Client",
        field: "r166_ctotal_natural_category_expenses"
      }];
      naturalExpenseCategories_array.forEach(function (_ref28) {
        var key = _ref28.key,
            field = _ref28.field;
        insertDataIntoObject("client", year, naturalExpenseCategories_obj, key, record, field);
      });
      var cashFlowsOperating_array = [{
        key: "depreciation_Client",
        field: "r070_adjustments_depreciation"
      }, {
        key: "giftsAndGrantsRestrictedInPerpetuity_Client",
        field: "r071_adjustments_gifts_and_grants_restricted_in_perpetuity"
      }, {
        key: "gainOnInvestment_Client",
        field: "r072_adjustments_gain_on_investments"
      }, {
        key: "derivativeCSLVIAmortBondCosts_Client",
        field: "r073_adjustments_derivative_cslvi_amort_bond_costs"
      }, {
        key: "accountsReceivable_Client",
        field: "r074_adjustments_accounts_receivable"
      }, {
        key: "inventory_Client",
        field: "r075_adjustments_inventory"
      }, {
        key: "prepaidsAndOtherAssets_Client",
        field: "r076_adjustments_prepaids_and_other_assets"
      }, {
        key: "accountsPayableAndAccruedExpenses_Client",
        field: "r077_adjustments_accounts_payable_and_accrued_expenses"
      }, {
        key: "deferredRevenue_Client",
        field: "r078_adjustments_deferred_revenue"
      }, {
        key: "otherLiabilities_Client",
        field: "r079_adjustments_other_liabilities"
      }, {
        key: "cashFlowsOperatingActivities_Client",
        field: "r080_cnet_cash_provided_by_operating_activities"
      }];
      cashFlowsOperating_array.forEach(function (_ref29) {
        var key = _ref29.key,
            field = _ref29.field;
        insertDataIntoObject("client", year, cashFlowsOperating_obj, key, record, field);
      });
      var cashFlowsInvesting_array = [{
        key: "purchaseOfInvestments_Client",
        field: "r081_cash_flows_from_investing_activities_purchase_of_investments"
      }, {
        key: "proceedsFromSaleOfInvestments_Client",
        field: "r082_cash_flows_from_investing_activities_proceeds_from_sale_of_investments"
      }, {
        key: "PurchaseOfPropertyAndEquipment_Client",
        field: "r083_cash_flows_from_investing_activities_purchases_of_property_and_equipment"
      }, {
        key: "studentLoanFund_Client",
        field: "r084_cash_flows_from_investing_activities_student_loan_fund"
      }, {
        key: "cashFlowsInvestingActivities_Client",
        field: "r085_cnet_cash_used_in_investing_activities"
      }, {
        key: "otherInvestingActivity_Client",
        field: "r282_other_investing_activity"
      }];
      cashFlowsInvesting_array.forEach(function (_ref30) {
        var key = _ref30.key,
            field = _ref30.field;
        insertDataIntoObject("client", year, cashFlowsInvesting_obj, key, record, field);
      });
      var cashFlowsFinancing_array = [{
        key: "proceedsFromNotesPayable_Client",
        field: "r086_cash_flows_from_financing_activities_proceeds_from_notes_payable"
      }, {
        key: "principalPayments_Client",
        field: "r087_cash_flows_from_financing_activities_principal_payments_on_notes_payable"
      }, {
        key: "other_Client",
        field: "r088_cash_flows_from_financing_activities_other"
      }, {
        key: "cashFlowsFinancingActivities_Client",
        field: "r089_cnet_cash_used_in_financing_activities"
      }];
      cashFlowsFinancing_array.forEach(function (_ref31) {
        var key = _ref31.key,
            field = _ref31.field;
        insertDataIntoObject("client", year, cashFlowsFinancing_obj, key, record, field);
      });
      var propertyAndEquipment_array = [{
        key: "landImprovements_Client",
        field: "r093_property_and_equipment_land_and_improvements"
      }, {
        key: "buildingImprovements_Client",
        field: "r094_property_and_equipment_buildings_and_improvements"
      }, {
        key: "furnitureEquipment_Client",
        field: "r095_property_and_equipment_furniture_and_equipment"
      }, {
        key: "cip_Client",
        field: "r096_property_and_equipment_cip"
      }, {
        key: "totalPEatCost_Client",
        field: "r097_ctotal_property_and_equipment_at_cost"
      }, {
        key: "accumulatedDepreciation_Client",
        field: "r098_accumulated_depreciation"
      }, {
        key: "propertyAndEquipment_Client",
        field: "r099_ctotal_property_and_equipment_less_depreciation"
      }];
      propertyAndEquipment_array.forEach(function (_ref32) {
        var key = _ref32.key,
            field = _ref32.field;
        insertDataIntoObject("client", year, propertyAndEquipment_obj, key, record, field);
      });
    });
  });
  var dataKeys = ["totalAssetsData", "totalLiabilitiesData", "netAssetsData", "revenueAndSupportData", "educationalProgramData", "nonOperatingActivitiesData", "changesInNetAssetsWithDRData", "naturalExpenseCategoriesData", "cashFlowsOperatingData", "cashFlowsInvestingData", "cashFlowsFinancingData", "propertyAndEquipmentData"];
  var dataObjects = [totalAssets_obj, totalLiabilities_obj, netAssets_obj, revenueAndSupport_obj, educationalProgram_obj, nonOperatingActivities_obj, changesInNetAssetsWithDR_obj, naturalExpenseCategories_obj, cashFlowsOperating_obj, cashFlowsInvesting_obj, cashFlowsFinancing_obj, propertyAndEquipment_obj];
  dataKeys.forEach(function (key, index) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(dataObjects[index]));
  });
};

var processFinancialAnalysisContentData = function processFinancialAnalysisContentData(years, recordsPeer, recordsClient) {
  var object = {};
  years.forEach(function (year) {
    var filteredPeerRecords = _toConsumableArray(recordsPeer).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredPeerRecords.forEach(function (record) {
      // totalLiabilities
      insertDataIntoObject("peer", year, object, "totalLiabilities_Peer", record, "r016_ctotal_liabilities", "Yes"); // totalAssets

      insertDataIntoObject("peer", year, object, "totalAssets_Peer", record, "r008_ctotal_assets", "Yes"); // SOURCE OF INCOME ---------------------------------->
      // revenueTuitionAndFees

      insertDataIntoObject("peer", year, object, "revenueTuitionAndFees_Peer", record, "dashboard_c002a_income_____tuition", "Yes"); // revenueAuxiliaryActivities

      insertDataIntoObject("peer", year, object, "revenueAuxiliaryActivities_Peer", record, "dashboard_c002b_income_____auxiliary", "Yes"); // revenueContributions

      insertDataIntoObject("peer", year, object, "revenueContributions_Peer", record, "dashboard_c002c_income_____contributions", "Yes"); // revenueInvestmentIncome

      insertDataIntoObject("peer", year, object, "revenueInvestmentIncome_Peer", record, "dashboard_c002d_income_____investments", "Yes"); // revenueOther

      insertDataIntoObject("peer", year, object, "revenueOther_Peer", record, "dashboard_c002e_income_____other_sources", "Yes"); // Financial Flow Analysis ---------------------------------->
    });

    var filteredClientRecords = _toConsumableArray(recordsClient).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredClientRecords.forEach(function (record) {
      // totalAssets
      insertDataIntoObject("client", year, object, "totalAssets_Client", record, "r008_ctotal_assets"); // totalLiabilities

      insertDataIntoObject("client", year, object, "totalLiabilities_Client", record, "r016_ctotal_liabilities"); // netPosition

      insertDataIntoObject("client", year, object, "netPosition_Client", record, "r020_ctotal_net_assets"); // SOURCE OF INCOME ---------------------------------->
      // si_revenueTuitionAndFees_Client

      insertDataIntoObject("client", year, object, "si_revenueTuitionAndFees_Client", record, "r026_cnet_tuition_and_fees"); // si_revenueAuxiliaryActivities_Client

      insertDataIntoObject("client", year, object, "si_revenueAuxiliaryActivities_Client", record, "r028_revenue_auxiliary_activities"); // si_revenueContributions_Client

      insertDataIntoObject("client", year, object, "si_revenueContributions_Client", record, "r033_revenue_contributions"); // si_revenueContributionsLargeOneTimeGifts_Client

      insertDataIntoObject("client", year, object, "si_revenueContributionsLargeOneTimeGifts_Client", record, "r033a_revenue_contributions_large_one_time_gifts"); // si_revenueInvestmentIncome_Client

      insertDataIntoObject("client", year, object, "si_revenueInvestmentIncome_Client", record, "r029_revenue_investment_income"); // si_revenueEndowmentSpendingAppropriation_Client

      insertDataIntoObject("client", year, object, "si_revenueEndowmentSpendingAppropriation_Client", record, "r030_revenue_endowment_spending_appropriation"); // si_revenueOther_Client

      insertDataIntoObject("client", year, object, "si_revenueOther_Client", record, "r031_revenue_other"); // si_netAssetsReleased_Client

      insertDataIntoObject("client", year, object, "si_netAssetsReleased_Client", record, "r034_revenue_net_assets_released_from_restriction"); // Financial Flow Analysis ---------------------------------->
      // ffa_revenueTuitionAndFees_Client

      insertDataIntoObject("client", year, object, "ffa_revenueTuitionAndFees_Client", record, "r023_revenue_tuition_and_fees"); // ffa_revenueScholarshipsAndFinancialAid_Client

      insertDataIntoObject("client", year, object, "ffa_revenueScholarshipsAndFinancialAid_Client", record, "r024_revenue_scholarships_and_financial_aid"); // ffa_totalRevenueContributions_Client

      insertDataIntoObject("client", year, object, "ffa_totalRevenueContributions_Client", record, "r035_ctotal_revenue_from_contributions"); // ffa_revenueAuxiliaryActivities_Client

      insertDataIntoObject("client", year, object, "ffa_revenueAuxiliaryActivities_Client", record, "r028_revenue_auxiliary_activities"); // ffa_revenueOther_Client

      insertDataIntoObject("client", year, object, "ffa_revenueOther_Client", record, "r031_revenue_other"); // ffa_revenueInvestmentIncome_Client

      insertDataIntoObject("client", year, object, "ffa_revenueInvestmentIncome_Client", record, "r029_revenue_investment_income"); // ffa_revenueEndowmentSpendingAppropriation_Client

      insertDataIntoObject("client", year, object, "ffa_revenueEndowmentSpendingAppropriation_Client", record, "r030_revenue_endowment_spending_appropriation"); // ffa_changeInNetAssetsWithDR_Client

      insertDataIntoObject("client", year, object, "ffa_changeInNetAssetsWithDR_Client", record, "r059_cchange_in_net_assets_with_donor_restrictions"); // ffa_netChangeRestrictedInPerpetuity_Client

      insertDataIntoObject("client", year, object, "ffa_netChangeRestrictedInPerpetuity_Client", record, "r064_cnet_change_restricted_in_perpetuity"); // ffa_contributions_Client

      insertDataIntoObject("client", year, object, "ffa_contributions_Client", record, "r054_contributions"); // ffa_changeInPermanentlyRestrictedNA_Client

      insertDataIntoObject("client", year, object, "ffa_changeInPermanentlyRestrictedNA_Client", record, "r060_change_in_permanently_restricted_net_assets_contributions"); // ffa_salariesAndWages_Client

      insertDataIntoObject("client", year, object, "ffa_salariesAndWages_Client", record, "r160_salaries_and_wages"); // ffa_employeeBenefits_Client

      insertDataIntoObject("client", year, object, "ffa_employeeBenefits_Client", record, "r161_employee_benefits"); // ffa_servicesSuppliesOther_Client

      insertDataIntoObject("client", year, object, "ffa_servicesSuppliesOther_Client", record, "r162_services_supplies_and_other"); // ffa_occupancyUtilitiesAndMaintenance_Client

      insertDataIntoObject("client", year, object, "ffa_occupancyUtilitiesAndMaintenance_Client", record, "r163_occupancy_utilities_and_maintenance"); // ffa_incomeExpenseSurplusDefecit_Client

      insertDataIntoObject("client", year, object, "ffa_incomeExpenseSurplusDefecit_Client", record, "dashboard_c001_income_expense_surplus_defecit"); // ffa_interest_Client

      insertDataIntoObject("client", year, object, "ffa_interest_Client", record, "r165_interest"); // ffa_totalFunctionalExpenses_Client

      insertDataIntoObject("client", year, object, "ffa_totalFunctionalExpenses_Client", record, "r044_ctotal_functional_expenses"); // ffa_servicesSuppliesAndOther_Client

      insertDataIntoObject("client", year, object, "ffa_servicesSuppliesAndOther_Client", record, "r162_services_supplies_and_other"); // ffa_occupancyUtilitiesAndMaintenance_Client

      insertDataIntoObject("client", year, object, "ffa_occupancyUtilitiesAndMaintenance_Client", record, "r163_occupancy_utilities_and_maintenance"); // ffa_depreciationAndAmortization_Client

      insertDataIntoObject("client", year, object, "ffa_depreciationAndAmortization_Client", record, "r164_depreciation_and_amortization"); // ffa_interest_Client

      insertDataIntoObject("client", year, object, "ffa_interest_Client", record, "r165_interest"); // ffa_incomeExpenseSurplusDefecit_Client

      insertDataIntoObject("client", year, object, "ffa_incomeExpenseSurplusDefecit_Client", record, "dashboard_c001_income_expense_surplus_defecit"); // dashboardSurplusDefecit_Client

      insertDataIntoObject("client", year, object, "dashboardSurplusDefecit_Client", record, "dashboard_c001_income_expense_surplus_defecit"); // Cash Flows Trend ---------------------------------->
      // cft_OperatingActivities_Client

      insertDataIntoObject("client", year, object, "cft_OperatingActivities_Client", record, "r080_cnet_cash_provided_by_operating_activities"); // cft_InvestingActivities_Client

      insertDataIntoObject("client", year, object, "cft_InvestingActivities_Client", record, "r085_cnet_cash_used_in_investing_activities"); // cft_FinancingActivities_Client

      insertDataIntoObject("client", year, object, "cft_FinancingActivities_Client", record, "r089_cnet_cash_used_in_financing_activities"); // cft_TotalActivities_Client

      insertDataIntoObject("client", year, object, "cft_TotalActivities_Client", record, "r283_ctotal_cash_flows"); // Salaries & Benefits to Total Expenses ---------------------------------->
      // salariesAndBenefitsToTotalExpenses_Client

      insertDataIntoObject("client", year, object, "salariesAndBenefitsToTotalExpenses_Client", record, "r228_csalaries_and_benefits_to_total_expenses"); // salariesAndWages_Client

      insertDataIntoObject("client", year, object, "salariesAndWages_Client", record, "r160_salaries_and_wages"); // employeeBenefits_Client

      insertDataIntoObject("client", year, object, "employeeBenefits_Client", record, "r161_employee_benefits"); // totalFunctionalExpenses_Client

      insertDataIntoObject("client", year, object, "totalFunctionalExpenses_Client", record, "r044_ctotal_functional_expenses");
    });
  });
  localStorage.removeItem("financialAnalysisContentData");
  localStorage.setItem("financialAnalysisContentData", JSON.stringify(object));
};

var processDoeData = function processDoeData(years, recordsPeer, recordsClient) {
  var object = {};
  years.forEach(function (year) {
    var filteredPeerRecords = _toConsumableArray(recordsPeer).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredPeerRecords.forEach(function (record) {});

    var filteredClientRecords = _toConsumableArray(recordsClient).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredClientRecords.forEach(function (record) {
      // doePrimaryReserveRatio
      insertDataIntoObject("client", year, object, "doePrimaryReserveRatio_Client", record, "r232_cdoe_primary_reserve_ratio"); // doePrimaryReserveStrengthFactor

      insertDataIntoObject("client", year, object, "doePrimaryReserveStrengthFactor_Client", record, "r233_cdoe_primary_reserve_strength_factor"); // doePrimaryReserveRatioWeighted

      insertDataIntoObject("client", year, object, "doePrimaryReserveRatioWeighted_Client", record, "r234_cdoe_primary_reserve_ratio_weighted"); // doeEquityRatio

      insertDataIntoObject("client", year, object, "doeEquityRatio_Client", record, "r237_cdoe_equity_ratio"); // doeEquityStrengthFactor

      insertDataIntoObject("client", year, object, "doeEquityStrengthFactor_Client", record, "r238_cdoe_equity_strength_factor"); // doeEquityRatioWeighted

      insertDataIntoObject("client", year, object, "doeEquityRatioWeighted_Client", record, "r239_cdoe_equity_ratio_weighted"); // doeNetIncomeRatio

      insertDataIntoObject("client", year, object, "doeNetIncomeRatio_Client", record, "r242_cdoe_net_income_ratio"); // doeNetIncomeStrengthFactor

      insertDataIntoObject("client", year, object, "doeNetIncomeStrengthFactor_Client", record, "r243_cdoe_net_income_strength_factor"); // doeNetIncomeRatioWeighted

      insertDataIntoObject("client", year, object, "doeNetIncomeRatioWeighted_Client", record, "r244_cdoe_net_income_ratio_weighted"); // doeOverall

      insertDataIntoObject("client", year, object, "doeOverall_Client", record, "r245_cdoe_overall__composite_score_");
    });
  });
  localStorage.removeItem("doeData");
  localStorage.setItem("doeData", JSON.stringify(object)); // console.log({ selectedYears });
};

var processCfiData = function processCfiData(years, recordsPeer, recordsClient) {
  var object = {};
  years.forEach(function (year) {
    var filteredPeerRecords = _toConsumableArray(recordsPeer).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredPeerRecords.forEach(function (record) {
      // cfiRatio_peerAverage
      insertDataIntoObject("peer", year, object, "cfiRatio_peerAverage_Peer", record, "r119_ccfi_overall_ratio", "Yes"); // primaryReserveRatio_peerAverage

      insertDataIntoObject("peer", year, object, "primaryReserveRatio_peerAverage_Peer", record, "r115_ccfi_primary_reserve_ratio", "Yes"); // netIncomeOperationsRatio_peerAverage

      insertDataIntoObject("peer", year, object, "netIncomeOperationsRatio_peerAverage_Peer", record, "r116_ccfi_net_income_operations_ratio", "Yes"); // returnOnNetAssets_peerAverage

      insertDataIntoObject("peer", year, object, "returnOnNetAssets_peerAverage_Peer", record, "r117_ccfi_return_on_net_assets_total_return_ratio", "Yes"); // viabilityRatio_peerAverage

      insertDataIntoObject("peer", year, object, "viabilityRatio_peerAverage_Peer", record, "r118_ccfi_viability_ratio", "Yes");
    });

    var filteredClientRecords = _toConsumableArray(recordsClient).filter(function (record) {
      var fiscalYear = record.querySelector("year").textContent;
      return fiscalYear.includes(year.toString());
    });

    filteredClientRecords.forEach(function (record) {
      // cfiRatio
      insertDataIntoObject("client", year, object, "cfiRatio_Client", record, "r119_ccfi_overall_ratio"); // cfi_primaryReserveRatio

      insertDataIntoObject("client", year, object, "cfi_primaryReserveRatio_Client", record, "r115_ccfi_primary_reserve_ratio"); // cfi_primaryReserveRatio_Strength

      insertDataIntoObject("client", year, object, "cfi_primaryReserveRatio_Strength_Client", record, "r115_ccfi_primary_reserve_ratio_cfi_score___strength"); // cfi_primaryReserveRatio_Weight_Client

      insertDataIntoObject("client", year, object, "cfi_primaryReserveRatio_Weight_Client", record, "r115_ccfi_primary_reserve_ratio_cfi_score___weight"); // cfi_primaryReserveRatio_Score_Client

      insertDataIntoObject("client", year, object, "cfi_primaryReserveRatio_Score_Client", record, "r115_ccfi_primary_reserve_ratio_cfi_score"); // cfi_netIncomeOperationsRatio

      insertDataIntoObject("client", year, object, "cfi_netIncomeOperationsRatio_Client", record, "r116_ccfi_net_income_operations_ratio"); // cfi_netIncomeOperationsRatio_Strength_Client

      insertDataIntoObject("client", year, object, "cfi_netIncomeOperationsRatio_Strength_Client", record, "r116_ccfi_net_income_operations_ratio_cfi_score___strength"); // cfi_netIncomeOperationsRatio_Weight_Client

      insertDataIntoObject("client", year, object, "cfi_netIncomeOperationsRatio_Weight_Client", record, "r116_ccfi_net_income_operations_ratio_cfi_score___weight"); // cfi_netIncomeOperationsRatio_Score_Client

      insertDataIntoObject("client", year, object, "cfi_netIncomeOperationsRatio_Score_Client", record, "r116_ccfi_net_income_operations_ratio_cfi_score"); // cfi_returnOnNetAssets

      insertDataIntoObject("client", year, object, "cfi_returnOnNetAssets_Client", record, "r117_ccfi_return_on_net_assets_total_return_ratio"); // cfi_returnOnNetAssets_Strength_Client

      insertDataIntoObject("client", year, object, "cfi_returnOnNetAssets_Strength_Client", record, "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___strength"); // cfi_returnOnNetAssets_Weight_Client

      insertDataIntoObject("client", year, object, "cfi_returnOnNetAssets_Weight_Client", record, "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score___weight"); // cfi_returnOnNetAssets_Score_Client

      insertDataIntoObject("client", year, object, "cfi_returnOnNetAssets_Score_Client", record, "r117_ccfi_return_on_net_assets_total_return_ratio_cfi_score"); // cfi_viabilityRatio

      insertDataIntoObject("client", year, object, "cfi_viabilityRatio_Client", record, "r118_ccfi_viability_ratio"); // cfi_viabilityRatio_Strength_Client

      insertDataIntoObject("client", year, object, "cfi_viabilityRatio_Strength_Client", record, "r118_ccfi_viability_ratio_cfi_score___strength"); // cfi_viabilityRatio_Weight_Client

      insertDataIntoObject("client", year, object, "cfi_viabilityRatio_Weight_Client", record, "r118_ccfi_viability_ratio_cfi_score___weight"); // cfi_viabilityRatio_Score_Client

      insertDataIntoObject("client", year, object, "cfi_viabilityRatio_Score_Client", record, "r118_ccfi_viability_ratio_cfi_score"); // PRIMARY RESERVE RATIO ---------------------------------->
      // primaryReserveRatio

      insertDataIntoObject("client", year, object, "primaryReserveRatio_Client", record, "r115_ccfi_primary_reserve_ratio"); // pr_nonrestrictedNetAssets_Client

      insertDataIntoObject("client", year, object, "pr_nonrestrictedNetAssets_Client", record, "r017_net_assets_without_donor_restriction"); // pr_restrictedNetAssets_Client

      insertDataIntoObject("client", year, object, "pr_restrictedNetAssets_Client", record, "r018_net_assets_restricted_by_time_or_purpose"); // pr_propertyAndEquipment_Client

      insertDataIntoObject("client", year, object, "pr_propertyAndEquipment_Client", record, "r099_ctotal_property_and_equipment_less_depreciation"); // pr_notesPayable_Client

      insertDataIntoObject("client", year, object, "pr_notesPayable_Client", record, "r015_notes_payable"); // pr_cfi_primaryReserveAdjustment_Client

      insertDataIntoObject("client", year, object, "pr_cfi_primaryReserveAdjustment_Client", record, "r114_cfi_primary_reserve_adjustment_number"); // pr_totalFunctionalExpenses_Client

      insertDataIntoObject("client", year, object, "pr_totalFunctionalExpenses_Client", record, "r044_ctotal_functional_expenses"); // NET INCOME OPERATIONS RATIO ---------------------------------->
      // netIncomeOperationsRatio

      insertDataIntoObject("client", year, object, "netIncomeOperationsRatio_Client", record, "r116_ccfi_net_income_operations_ratio"); // ni_operatingRevenuesSupportAndReleases

      insertDataIntoObject("client", year, object, "ni_operatingRevenuesSupportAndReleases_Client", record, "r036_coperating_revenues_support_and_releases"); // ni_totalFunctionalExpenses

      insertDataIntoObject("client", year, object, "ni_totalFunctionalExpenses_Client", record, "r044_ctotal_functional_expenses"); // ni_nonOperatingActivitiesInvestmentIncome

      insertDataIntoObject("client", year, object, "ni_nonOperatingActivitiesInvestmentIncome_Client", record, "r047_non_operating_activities_investment_income"); // CFI RETURN ON NET ASSETS ---------------------------------->
      // returnOnNetAssets

      insertDataIntoObject("client", year, object, "returnOnNetAssets_Client", record, "r117_ccfi_return_on_net_assets_total_return_ratio"); // ro_changeInNetAssets

      insertDataIntoObject("client", year, object, "ro_changeInNetAssets_Client", record, "r065_cchange_in_net_assets"); // ro_netAssetsBeginningOfYear

      insertDataIntoObject("client", year, object, "ro_netAssetsBeginningOfYear_Client", record, "r066_net_assets_beginning_of_year"); // CFI RETURN ON NET ASSETS ---------------------------------->
      // viabilityRatio

      insertDataIntoObject("client", year, object, "viabilityRatio_Client", record, "r118_ccfi_viability_ratio"); // vr_nonrestrictedNetAssets

      insertDataIntoObject("client", year, object, "vr_nonrestrictedNetAssets_Client", record, "r017_net_assets_without_donor_restriction"); // vr_restrictedNetAssets

      insertDataIntoObject("client", year, object, "vr_restrictedNetAssets_Client", record, "r018_net_assets_restricted_by_time_or_purpose"); // vr_totalPropertyAndEquipment

      insertDataIntoObject("client", year, object, "vr_totalPropertyAndEquipment_Client", record, "r099_ctotal_property_and_equipment_less_depreciation"); // vr_accumulatedDepreciation

      insertDataIntoObject("client", year, object, "vr_accumulatedDepreciation_Client", record, "r098_accumulated_depreciation"); // vr_notesPayable

      insertDataIntoObject("client", year, object, "vr_notesPayable_Client", record, "r015_notes_payable");
    });
  });
  localStorage.removeItem("cfiData");
  localStorage.setItem("cfiData", JSON.stringify(object));
  var selectedYears = getSelectedYearsFromLocalStorage(); // console.log({ selectedYears });

  var cfiValue = object.cfiRatio_Client[selectedYears[selectedYears.length - 1]].value;
  updateCfiValue(cfiValue, selectedYears[selectedYears.length - 1]);
  var thCfiScoreElement = document.getElementById("th_cfiScore");
  thCfiScoreElement.textContent = cfiValue !== undefined && !isNaN(cfiValue) && cfiValue !== 0 ? cfiValue : "-";
}; // Helper functions   ----------------------------------------------->


var countUniqueClients = function countUniqueClients(records) {
  uniqueClients = new Set();

  try {
    records.forEach(function (record) {
      var mainRelatedClient = record.querySelector("merged_client_name").textContent; // console.log(mainRelatedClient);

      uniqueClients.add(mainRelatedClient);
    });
    var count = uniqueClients.size; // console.log(count);

    document.getElementById("uniqueClients").textContent = count;
  } catch (error) {
    console.error("Error counting unique clients:", error);
    document.getElementById("uniqueClients").textContent = 0; // Set to 0 in case of error
  }
};

var toggleButtonLoadingState = function toggleButtonLoadingState(btn) {
  btn.innerHTML = "\n    <svg aria-hidden=\"true\" role=\"status\" class=\"inline w-6 h-6 me-3 text-xl colorGreen font-extrabold animate-spin\" viewBox=\"0 0 100 101\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path d=\"M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z\" fill=\"#E5E7EB\"/>\n      <path d=\"M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z\" fill=\"currentColor\"/>\n    </svg>\n    Loading...";
  btn.disabled = true;
};

var toggleButtonNormalState = function toggleButtonNormalState(btn) {
  btn.innerHTML = "\n    <span class='text-xl mr-2'>Run</span>\n    <svg class=\"w-8 h-8 text-2xl text-white\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"none\" viewBox=\"0 0 24 24\">\n      <path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m7 16 4-4-4-4m6 8 4-4-4-4\"/>\n    </svg>";
  btn.disabled = false;
};

var toggleGenerateReportButtonNormalState = function toggleGenerateReportButtonNormalState(btn) {
  btn.innerHTML = "\n  Generate Trends and Benchmark Reports\n";
};

var processSelectedYears = function processSelectedYears() {
  var selectedYears = getSelectedYearsFromLocalStorage(); // console.log(selectedYears);

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

var saveSelectedYearsToLocalStorage = function saveSelectedYearsToLocalStorage(selectedYears_Set) {
  var selectedYearsArray = Array.from(selectedYears_Set).sort(function (a, b) {
    return a - b;
  });
  localStorage.setItem("selectedYears", JSON.stringify(selectedYearsArray));
};

var resetSelectedYears = function resetSelectedYears() {
  var selectedYears_Set = new Set();
  saveSelectedYearsToLocalStorage(selectedYears_Set);
};

var processApiCalls = function processApiCalls(selectedYears, recordsPeer, recordsClient) {
  processCfiData(selectedYears, recordsPeer, recordsClient);
  processDoeData(selectedYears, recordsPeer, recordsClient);
  processFinancialAnalysisContentData(selectedYears, recordsPeer, recordsClient);
  processFinancialStatementContentData(recordsPeer, recordsClient);
  processFinancialPositionContentData(selectedYears, recordsPeer, recordsClient);
  processRevenueExpenseContentData(selectedYears, recordsPeer, recordsClient);
  processDebtEndowmentContentData(selectedYears, recordsPeer, recordsClient);
};

var displayComponents = function displayComponents() {
  displayCfiComponent();
  displayDoeComponent();
  displayFinancialAnalysisContentComponent();
  displayFinancialStatementComponent();
  displayFinancialPositionComponent();
  displayRevenueAndExpenseComponent();
  displayDebtAndEndowmentComponent();
  displayReportComponent();
}; //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var recordClientHTMLArray = [];
var recordPeerHTMLArray = [];
var run_btn = document.querySelector("#run");
run_btn.addEventListener("click", function _callee2() {
  var selectedYears, recordsPeer, _recordsClient, qdbapiElementClient, qdbapiElementPeer;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          toggleButtonLoadingState(run_btn);
          showApiLoadingFunction("open", "api"); // const selectedYears = processSelectedYears();

          selectedYears = getSelectedYearsFromLocalStorage(); // const requiredYears = [2019, 2020, 2021, 2022, 2023, 2024];
          // const filteredYears = requiredYears.filter((year) =>
          //   selectedYears.includes(year)
          // );

          saveSelectedYearsToLocalStorage(selectedYears);
          _context2.next = 7;
          return regeneratorRuntime.awrap(getRecordsForPeer(selectedYears, "<qdbapi>"));

        case 7:
          recordsPeer = _context2.sent;
          countUniqueClients(recordsPeer); // console.log({selectedYears, yearsData_Array})

          _context2.next = 11;
          return regeneratorRuntime.awrap(getRecordsForClient(yearsData_Array, "<qdbapi>"));

        case 11:
          _recordsClient = _context2.sent;
          qdbapiElementClient = "<qdbapi>".concat(recordClientHTMLArray.join(""), "</qdbapi>"); // console.log("CLIENT", qdbapiElementClient);

          qdbapiElementPeer = "<qdbapi>".concat(recordPeerHTMLArray.join(""), "</qdbapi>");

          if (recordPeerHTMLArray.length === 0) {
            console.error("No Peer records found for the selected years");
          } else {// console.log("PEER", qdbapiElementPeer);
          }

          processApiCalls(selectedYears, recordsPeer, _recordsClient);
          displayComponents();
          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 22:
          _context2.prev = 22;
          toggleButtonNormalState(run_btn);
          return _context2.finish(22);

        case 25:
          showApiLoadingFunction("close", "api");

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19, 22, 25]]);
}); //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var getParsedData = function getParsedData(xmlString) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc.querySelectorAll("record");
};

var getRecordsForPeer = function getRecordsForPeer(years, dataStr) {
  var parsedData, currentYear, getRegionQuery, getStateQuery, getMembershipsQuery, getAthleticsQuery, getTypeQuery, getClientQuery, apiCallPeerData, xml, recordsForPeer;
  return regeneratorRuntime.async(function getRecordsForPeer$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          getClientQuery = function _ref38(selectedClients) {
            // Check if the "select-all-checkbox-client" input is checked
            var selectAllCheckbox = document.getElementById("select-all-checkbox-client");

            if (selectAllCheckbox && selectAllCheckbox.checked) {
              // If checked, return an empty string
              return "";
            } // Otherwise, continue with the existing logic


            var clientConditions = selectedClients.map(function (client) {
              return "{539.EX.".concat(client, "}");
            }).join(" OR "); // console.log({ clientConditions });

            return "(".concat(clientConditions, ")");
          };

          getTypeQuery = function _ref37(selectedTypes) {
            var typeConditions = _toConsumableArray(selectedTypes).map(function (type) {
              return "{618.EX.".concat(type, "}");
            }).join(" OR "); // console.log({ typeConditions });


            return "(".concat(typeConditions, ")");
          };

          getAthleticsQuery = function _ref36(selectedAthletics) {
            var athleticsConditions = _toConsumableArray(selectedAthletics).map(function (athletic) {
              return "{534.EX.".concat(athletic, "}");
            }).join(" OR "); // console.log({ athleticsConditions });


            return "(".concat(athleticsConditions, ")");
          };

          getMembershipsQuery = function _ref35(selectedMemberships) {
            var membershipsConditions = _toConsumableArray(selectedMemberships).map(function (membership) {
              return "{537.HAS.".concat(membership, "}");
            }).join(" OR "); // console.log({ membershipsConditions });


            return "(".concat(membershipsConditions, ")");
          };

          getStateQuery = function _ref34(selectedStates) {
            var stateConditions = _toConsumableArray(selectedStates).map(function (state) {
              return "{619.EX.".concat(state, "}");
            }).join(" OR "); // console.log({ stateConditions });


            return "(".concat(stateConditions, ")");
          };

          getRegionQuery = function _ref33(selectedRegions) {
            var regionConditions = _toConsumableArray(selectedRegions).map(function (region) {
              return "{536.EX.".concat(region, "}");
            }).join(" OR ");

            return "(".concat(regionConditions, ")");
          };

          if (!(years.length === 0)) {
            _context3.next = 9;
            break;
          }

          // Base case: return the final string when the array is empty
          // if (dataStr === '<qdbapi>') console.error('No Peer records found for the selected years')
          parsedData = getParsedData(dataStr + "</qdbapi>");
          return _context3.abrupt("return", parsedData);

        case 9:
          currentYear = years[0]; // console.log({ currentYear, sliderValue, sliderValue2, selectedTypes_Array})

          apiCallPeerData = {
            act: "API_DoQuery",
            query: "\n      (".concat(getRegionQuery(selectedRegions_Array), ") AND\n      (").concat(getStateQuery(selectedStates_Array), ") AND\n      (").concat(getMembershipsQuery(selectedMemberships_Array), ") AND\n      (").concat(getAthleticsQuery(selectedAthletics_Array), ") AND\n      (").concat(getTypeQuery(selectedTypes_Array), ") AND\n      (").concat(getClientQuery(selectedClients_Array), ") AND\n      {7.EX.").concat(currentYear, "}\n    "),
            clist: "7.3.536.619.537.618.534.539.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395.390.391.549.392.395.393.394.411.450.451.452.453.454.455.727.546.397.394.398.622.621.623.624.625.626.627.629.630.631.632.633.634.635.636.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.481.91.111.131.151.171.191.557.616.614.615.386.641.217.557.611.605.552.391.390.609.217.557.643.644.645.646.550"
          };
          _context3.prev = 11;
          _context3.next = 14;
          return regeneratorRuntime.awrap($.get(peerData, apiCallPeerData));

        case 14:
          xml = _context3.sent;
          // console.log('PEER-XML', xml)
          recordsForPeer = $("record", xml).toArray(); // console.log("recordsForPeer", recordsForPeer);
          // console.log("recordsForPeer", recordsForPeer[0].children);
          // Update dataStr with the records from the current API call
          // console.log(`year - ${currentYear}`)

          recordsForPeer.forEach(function (record, index) {
            // if (index < 2) console.log(`Peer`, record);
            // Create a new record element
            var newRecord = document.createElement("record"); // Append each child element to the new record

            Array.from(record.children).forEach(function (child) {
              newRecord.appendChild(child.cloneNode(true));
            });
            recordPeerHTMLArray.push(newRecord.outerHTML); // Append the new record's outerHTML to dataStr

            dataStr += newRecord.outerHTML;
          }); // Recursive call with updated years and dataStr

          return _context3.abrupt("return", getRecordsForPeer(years.slice(1), dataStr));

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](11);
          console.error("Error fetching data:", _context3.t0); // Handle the error as needed

          return _context3.abrupt("return", dataStr);

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[11, 20]]);
};

var getRecordsForUniqueClientsPeerNames = function getRecordsForUniqueClientsPeerNames() {
  var apiCallPeerData, xml, recordsForPeerUniqueClientPeerNames, uniquePeerClientNames, sortedUniquePeerClientNames;
  return regeneratorRuntime.async(function getRecordsForUniqueClientsPeerNames$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          apiCallPeerData = {
            act: "API_DoQuery",
            clist: "7.536.619.537.618.534.539.541.549.551.547.553.390.392.396.393.395.600.606.390.392.396.393.395"
          };
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap($.get(peerData, apiCallPeerData));

        case 4:
          xml = _context4.sent;
          recordsForPeerUniqueClientPeerNames = $("record", xml).toArray();
          uniquePeerClientNames = new Set();
          recordsForPeerUniqueClientPeerNames.forEach(function (record, index) {
            var clientInformalName = record.querySelector("merged_client_name").textContent;
            uniquePeerClientNames.add(clientInformalName);
          }); // console.log({ uniquePeerClientNames });

          sortedUniquePeerClientNames = Array.from(uniquePeerClientNames).sort();
          sortedUniquePeerClientNames.forEach(function (item) {
            return selectedClients_Array.add(item);
          });
          addUniqueClientsToOptionsSelectClientsDropdown(sortedUniquePeerClientNames);
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](1);
          console.error("Error fetching data:", _context4.t0);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

var getRecordsForClient = function getRecordsForClient(years, dataStr) {
  var parsedData, currentYear, apiCallClientData, xml, recordsForClient;
  return regeneratorRuntime.async(function getRecordsForClient$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(years.length === 0)) {
            _context5.next = 3;
            break;
          }

          // Base case: return the final string when the array is empty
          parsedData = getParsedData(dataStr + "</qdbapi>");
          return _context5.abrupt("return", parsedData);

        case 3:
          currentYear = years[0];
          apiCallClientData = {
            act: "API_DoQuery",
            query: "\n\t    {7.EX.".concat(currentYear, "} AND {533.EX.").concat(ClientRid, "}"),
            clist: "539.7.533.536.619.537.618.534.580.578.576.577.579.712.725.722.719.714.726.723.720.717.724.721.718.387.388.569.386.632.551.550.406.561.418.567.441.540.541.542.600.606.390.392.396.393.395.391.549.394.411.450.451.452.453.454.455.727.570.571.572.546.397.398.373.374.375.376.377.378.379.380.381.382.383.384.385.326.541.387.338.542.390.391.548.402.403.404.405.551.407.408.409.410.557.411.412.415.416.417.560.561.419.420.421.422.423.424.425.426.427.428.571.435.572.566.389.399.400.401.402.403.404.405.551.406.407.408.409.410.557.411.412.413.414.559.415.416.417.560.561.450.451.452.453.454.455.429.430.431.432.571.433.434.435.572.437.438.439.440.567.441.567.441.569.442.429.641.635.481.482.483.709.32.33.34.35.36.37.38.39.40.41.42.43.44.45.46.47.48.49.50.51.450.451.551.546.711.614.613.633.603.633.621.710.504.550.217.980.981.982.985.983.984.609.608.581.582.583.584.585.586.587.588.589.590.591.592.593.594.595.596.971.972.973"
          };
          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap($.get(clientData, apiCallClientData));

        case 8:
          xml = _context5.sent;
          recordsForClient = $("record", xml).toArray(); //console.log('recordsForClient', recordsForClient[0].children)
          //console.log($('record', xml))
          //console.log(`year - ${currentYear}`)
          // Update dataStr with the records from the current API call

          recordsForClient.forEach(function (record, index) {
            // if (index < 4) console.log(`Client`, record);
            // Create a new record element
            var newRecord = document.createElement("record"); // Append each child element to the new record

            Array.from(record.children).forEach(function (child) {
              newRecord.appendChild(child.cloneNode(true));
            });
            recordClientHTMLArray.push(newRecord.outerHTML); // Append the new record's outerHTML to dataStr

            dataStr += newRecord.outerHTML;
          }); // Recursive call with updated years and dataStr

          return _context5.abrupt("return", getRecordsForClient(years.slice(1), dataStr));

        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](5);
          console.error("Error fetching data:", _context5.t0); // Handle the error as needed

          return _context5.abrupt("return", dataStr);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 14]]);
};