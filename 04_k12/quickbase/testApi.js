// remember to check the url that it says "clientrid" and NOT "clientRid" with a capital R. 

let apiCallClientDataForUniqueYears = { 
  act: 'API_DoQuery', 
  query: `{138.EX.${ClientRid}}`, 
  clist: '136.138.139.142.149.1.5.49.50.51.52.53.149.54.110.55.111.56.57.112.58.59.60.113.61.62.63.64.65.66.114.67.115.68.69.70.116.71.117.72.118.73.74.75.76.77.78.79.80.81.82.83.84.85.86.87.88.89.90.91.92.93.94.95.96.97.98.99.100.101.102.103.104.105.106.107.108.109.43.150.151.6'
};	

$.get(clientData, apiCallClientDataForUniqueYears)
  .then(async(xml) => {
      recordsClient = await $('record', xml).toArray();

      const firmName = recordsClient[0].children[2].innerHTML
document.querySelector('#firmName').textContent = firmName

      if (recordsClient.length > 0) {
          findUniqueYears(recordsClient);
          dataClient = recordsClient[0].children;
      } else {
          console.error('No records found from this client for the specific years. Maybe check the spelling of clientrid and not clientRid');
      }
  })
  .catch(err => console.error(err));



window.addEventListener('beforeunload', () => {
localStorage.clear();
});




document.addEventListener('DOMContentLoaded', () => {



});


const findUniqueYears = (data) => {

if (data) {
data.forEach((item) => {
  const yearElement = item.querySelector('fiscal_ye_date_formatted_year');
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








///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const processExpenseData = (years, recordsPeer, recordsClient) => {
const object = {};

years.forEach((year) => {
  const filteredPeerRecords = [...recordsPeer].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;

    return fiscalYear.includes(year.toString());
  });
  filteredPeerRecords.forEach((record) => {
    // salariesBenefitsTeachersAsPercentNetTuition_Salaries
    insertDataIntoObject(
      "peer",
      year,
      object,
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries_Peer",
      record,
      "_24a_ratio_salaries_as___of_net_tuition",
      "_24a_yes_no_salaries_as___of_net_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherSalaries",
      record,
      "_02_01_total_teacher_salaries",
      "_24a_yes_no_salaries_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_02_01_total_teacher_salaries",
      "_24a_yes_no_salaries_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_24a_yes_no_salaries_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries"
    );

    // salariesBenefitsTeachersAsPercentNetTuition_Benefits
    insertDataIntoObject(
      "peer",
      year,
      object,
      "salariesBenefitsTeachersAsPercentNetTuition_Benefits_Peer",
      record,
      "_24b_ratio_benefits_as___of_net_tuition",
      "_24b_yes_no_benefits_as___of_net_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherBenefits",
      record,
      "_02_02_total_teacher_benefits_",
      "_24b_yes_no_benefits_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_02_01_total_teacher_salaries",
      "_24b_yes_no_benefits_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_24b_yes_no_benefits_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries"
    );

    // salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits
    insertDataIntoObject(
      "peer",
      year,
      object,
      "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_Peer",
      record,
      "_24c_ratio_salaries_benefits_as___of_net_tuition",
      "_24c_yes_no_salaries_benefits_as___of_net_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherSalaries",
      record,
      "_02_01_total_teacher_salaries",
      "_24c_yes_no_salaries_benefits_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherBenefits",
      record,
      "_02_02_total_teacher_benefits_",
      "_24c_yes_no_salaries_benefits_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_02_01_total_teacher_salaries",
      "_24c_yes_no_salaries_benefits_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_24c_yes_no_salaries_benefits_as___of_net_tuition",
      "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits"
    );

    // salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries
    insertDataIntoObject(
      "peer",
      year,
      object,
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries_Peer",
      record,
      "_25a_ratio_salaries_per_students",
      "_25a_yes_no_salaries_per_students"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherSalaries",
      record,
      "_02_01_total_teacher_salaries",
      "_25a_yes_no_salaries_per_students",
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_25a_yes_no_salaries_per_students",
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries"
    );

    // salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits
    insertDataIntoObject(
      "peer",
      year,
      object,
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits_Peer",
      record,
      "_25b_ratio_benefits_per_students",
      "_25b_yes_no_benefits_per_students"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherBenefits",
      record,
      "_02_02_total_teacher_benefits_",
      "_25b_yes_no_benefits_per_students",
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_25b_yes_no_benefits_per_students",
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits"
    );

    // salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits
    insertDataIntoObject(
      "peer",
      year,
      object,
      "salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits_Peer",
      record,
      "_25c_ratio_salaries_and_benefits_per_students",
      "_25c_yes_no_salaries_and_benefits_per_students"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherSalaries",
      record,
      "_02_01_total_teacher_salaries",
      "_25c_yes_no_salaries_and_benefits_per_students",
      "salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherBenefits",
      record,
      "_02_02_total_teacher_benefits_",
      "_25c_yes_no_salaries_and_benefits_per_students",
      "salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_25c_yes_no_salaries_and_benefits_per_students",
      "salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits"
    );

    // benefitsPercentSalariesTeachers
    insertDataIntoObject(
      "peer",
      year,
      object,
      "benefitsPercentSalariesTeachers_Peer",
      record,
      "_26_ratio_benefits_as_a_percent_of_salaries_for_teachers",
      "_26_yes_no_benefits_as_a_percent_of_salaries_for_teachers"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherSalaries",
      record,
      "_02_01_total_teacher_salaries",
      "_26_yes_no_benefits_as_a_percent_of_salaries_for_teachers",
      "benefitsPercentSalariesTeachers"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherBenefits",
      record,
      "_02_02_total_teacher_benefits_",
      "_26_yes_no_benefits_as_a_percent_of_salaries_for_teachers",
      "benefitsPercentSalariesTeachers"
    );

    // personnelMandatoryDebtService_SalariesAndBenefits_Teachers
    insertDataIntoObject(
      "peer",
      year,
      object,
      "personnelMandatoryDebtService_SalariesAndBenefits_Teachers_Peer",
      record,
      "_27a1_ratio_teachers_salaries_and_benefits_per_total_expenses",
      "_27a1_yes_no_teachers_salaries_and_benefits_per_total_expenses"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherSalaries",
      record,
      "_02_01_total_teacher_salaries",
      "_27a1_yes_no_teachers_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Teachers"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherBenefits",
      record,
      "_02_02_total_teacher_benefits_",
      "_27a1_yes_no_teachers_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Teachers"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_27a1_yes_no_teachers_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Teachers"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_27a1_yes_no_teachers_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Teachers"
    );

    // personnelMandatoryDebtService_SalariesAndBenefits_Administration
    insertDataIntoObject(
      "peer",
      year,
      object,
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration_Peer",
      record,
      "_27a2_ratio_admin_salaries_and_benefits_per_total_expenses",
      "_27a2_yes_no_admin_salaries_and_benefits_per_total_expenses"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalPersonnelCostsSalariesBenefits",
      record,
      "_02_03_total_personnel_costs_salaries___benefits_of_all_school_employees",
      "_27a2_yes_no_admin_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherSalaries",
      record,
      "_02_01_total_teacher_salaries",
      "_27a2_yes_no_admin_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalTeacherBenefits",
      record,
      "_02_02_total_teacher_benefits_",
      "_27a2_yes_no_admin_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_27a2_yes_no_admin_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_27a2_yes_no_admin_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration"
    );

    // personnelMandatoryDebtService_SalariesAndBenefits_Employees
    insertDataIntoObject(
      "peer",
      year,
      object,
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration_Peer",
      record,
      "_27a3_ratio_all_salaries_and_benefits_per_total_expenses",
      "_27a3_yes_no_all_salaries_and_benefits_per_total_expenses"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalPersonnelCostsSalariesBenefits",
      record,
      "_02_03_total_personnel_costs_salaries___benefits_of_all_school_employees",
      "_27a3_yes_no_all_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Employees"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_27a3_yes_no_all_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Employees"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_27a3_yes_no_all_salaries_and_benefits_per_total_expenses",
      "personnelMandatoryDebtService_SalariesAndBenefits_Employees"
    );

    // personnelMandatoryDebtService_Mandatory
    insertDataIntoObject(
      "peer",
      year,
      object,
      "personnelMandatoryDebtService_Mandatory_Peer",
      record,
      "_27b_ratio__mandatory_debt_service_payments_including_interest_per_total_expenses",
      "_27b_yes_no_mandatory_debt_service_payments_including_interest_per_total_expenses"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentMaturingDebt",
      record,
      "_02_06_current_maturities_of_lt_debt",
      "_27b_yes_no_mandatory_debt_service_payments_including_interest_per_total_expenses",
      "personnelMandatoryDebtService_Mandatory"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentYearInterestExpense",
      record,
      "_04_11_current_year_interest_expense",
      "_27b_yes_no_mandatory_debt_service_payments_including_interest_per_total_expenses",
      "personnelMandatoryDebtService_Mandatory"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "capitalizedInterest",
      record,
      "_05_02_capitalized_interest",
      "_27b_yes_no_mandatory_debt_service_payments_including_interest_per_total_expenses",
      "personnelMandatoryDebtService_Mandatory"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_27b_yes_no_mandatory_debt_service_payments_including_interest_per_total_expenses",
      "personnelMandatoryDebtService_Mandatory"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_27b_yes_no_mandatory_debt_service_payments_including_interest_per_total_expenses",
      "personnelMandatoryDebtService_Mandatory"
    );

    // personnelMandatoryDebtService_Personnel
    insertDataIntoObject(
      "peer",
      year,
      object,
      "personnelMandatoryDebtService_Personnel_Peer",
      record,
      "_27c_ratio__personnel_and_mandatory_debt_service_payments_per_total_expenses",
      "_27c_yes_no__personnel_and_mandatory_debt_service_payments_per_total_expenses"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalPersonnelCostsSalariesBenefits",
      record,
      "_02_03_total_personnel_costs_salaries___benefits_of_all_school_employees",
      "_27c_yes_no__personnel_and_mandatory_debt_service_payments_per_total_expenses",
      "personnelMandatoryDebtService_Personnel"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentMaturingDebt",
      record,
      "_02_06_current_maturities_of_lt_debt",
      "_27c_yes_no__personnel_and_mandatory_debt_service_payments_per_total_expenses",
      "personnelMandatoryDebtService_Personnel"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentYearInterestExpense",
      record,
      "_04_11_current_year_interest_expense",
      "_27c_yes_no__personnel_and_mandatory_debt_service_payments_per_total_expenses",
      "personnelMandatoryDebtService_Personnel"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "capitalizedInterest",
      record,
      "_05_02_capitalized_interest",
      "_27c_yes_no__personnel_and_mandatory_debt_service_payments_per_total_expenses",
      "personnelMandatoryDebtService_Personnel"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_27c_yes_no__personnel_and_mandatory_debt_service_payments_per_total_expenses",
      "personnelMandatoryDebtService_Personnel"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_27c_yes_no__personnel_and_mandatory_debt_service_payments_per_total_expenses",
      "personnelMandatoryDebtService_Personnel"
    );

    // percentFundRaisingExpensesExceeding
    insertDataIntoObject(
      "peer",
      year,
      object,
      "percentFundRaisingExpensesExceeding_Peer",
      record,
      "_28_ratio___of_fund_raising_expenses_exceeding_or_less_than_funds_raised",
      "_28_yes_no___of_fund_raising_expenses_exceeding_or_less_than_funds_raised"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalFundraising",
      record,
      "_04_10_total_fundraising_expenses",
      "_28_yes_no___of_fund_raising_expenses_exceeding_or_less_than_funds_raised",
      "percentFundRaisingExpensesExceeding"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalContributions",
      record,
      "_04_06_total_contributions",
      "_28_yes_no___of_fund_raising_expenses_exceeding_or_less_than_funds_raised",
      "percentFundRaisingExpensesExceeding"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fundraisingIncome",
      record,
      "_04_13_fundraising_income",
      "_28_yes_no___of_fund_raising_expenses_exceeding_or_less_than_funds_raised",
      "percentFundRaisingExpensesExceeding"
    );

    // fundsExpensesPerStudent_FundsRaised
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fundsExpensesPerStudent_FundsRaised_Peer",
      record,
      "_29a_ratio_funds_raised",
      "_29a_yes_no_funds_raised"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalContributions",
      record,
      "_04_06_total_contributions",
      "_29a_yes_no_funds_raised",
      "fundsExpensesPerStudent_FundsRaised"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_29a_yes_no_funds_raised",
      "fundsExpensesPerStudent_FundsRaised"
    );

    // fundsExpensesPerStudent_CashExpensesExcludingDepreciation
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fundsExpensesPerStudent_CashExpensesExcludingDepreciation_Peer",
      record,
      "_29b_ratio_cash_expenses",
      "_29b_yes_no_cash_expenses"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_29b_yes_no_cash_expenses",
      "fundsExpensesPerStudent_CashExpensesExcludingDepreciation"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_29b_yes_no_cash_expenses",
      "fundsExpensesPerStudent_CashExpensesExcludingDepreciation"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_29b_yes_no_cash_expenses",
      "fundsExpensesPerStudent_CashExpensesExcludingDepreciation"
    );

    // fundsExpensesPerStudent_netTuition
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fundsExpensesPerStudent_netTuition_Peer",
      record,
      "_29c_ratio_net_tuition",
      "_29c_yes_no_net_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_29c_yes_no_net_tuition",
      "fundsExpensesPerStudent_netTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_29c_yes_no_net_tuition",
      "fundsExpensesPerStudent_netTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_29c_yes_no_net_tuition",
      "fundsExpensesPerStudent_netTuition"
    );

    // fundsExpensesPerStudent_cashExpensesExcessNetTuition
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fundsExpensesPerStudent_cashExpensesExcessNetTuition_Peer",
      record,
      "_29d_ratio_cash_expenses_in_excess_of_or_less_than_net_tuition",
      "_29d_yes_no_cash_expenses_in_excess_of_or_less_than_net_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_29d_yes_no_cash_expenses_in_excess_of_or_less_than_net_tuition",
      "fundsExpensesPerStudent_cashExpensesExcessNetTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_29d_yes_no_cash_expenses_in_excess_of_or_less_than_net_tuition",
      "fundsExpensesPerStudent_cashExpensesExcessNetTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_29d_yes_no_cash_expenses_in_excess_of_or_less_than_net_tuition",
      "fundsExpensesPerStudent_cashExpensesExcessNetTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_29d_yes_no_cash_expenses_in_excess_of_or_less_than_net_tuition",
      "fundsExpensesPerStudent_cashExpensesExcessNetTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_29d_yes_no_cash_expenses_in_excess_of_or_less_than_net_tuition",
      "fundsExpensesPerStudent_cashExpensesExcessNetTuition"
    );

    // fundsExpensesPerStudent_FundsRaisedOverUnder
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fundsExpensesPerStudent_FundsRaisedOverUnder_Peer",
      record,
      "_29e_ratio_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit",
      "_29e_yes_no_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalContributions",
      record,
      "_04_06_total_contributions",
      "_29e_yes_no_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit",
      "fundsExpensesPerStudent_FundsRaisedOverUnder"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_29e_yes_no_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit",
      "fundsExpensesPerStudent_FundsRaisedOverUnder"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_29e_yes_no_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit",
      "fundsExpensesPerStudent_FundsRaisedOverUnder"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_29e_yes_no_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit",
      "fundsExpensesPerStudent_FundsRaisedOverUnder"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_29e_yes_no_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit",
      "fundsExpensesPerStudent_FundsRaisedOverUnder"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_29e_yes_no_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit",
      "fundsExpensesPerStudent_FundsRaisedOverUnder"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "discounts",
      record,
      "_04_03_discounts",
      "_22b1_yes_no_financial_assistance_discount_based",
      "fundsExpensesPerStudent_FundsRaisedOverUnder"
    );

    // facilityCostExcluding_lessThanTen
    insertDataIntoObject(
      "peer",
      year,
      object,
      "facilityCostExcluding_lessThanTen_Peer",
      record,
      "_30a_ratio_lt10_facility_cost_per_square_foot_no_interest",
      "_30a_yes_no_lt10_facility_cost_per_square_foot_no_interest"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalMaintenanceCosts",
      record,
      "_02_04_total_maintenance_costs",
      "_30a_yes_no_lt10_facility_cost_per_square_foot_no_interest",
      "facilityCostExcluding_lessThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalFacilitySquareFootage",
      record,
      "_01_07_total_facility_square_footage",
      "_30a_yes_no_lt10_facility_cost_per_square_foot_no_interest",
      "facilityCostExcluding_lessThanTen"
    );

    // facilityCostExcluding_greaterThanTen
    insertDataIntoObject(
      "peer",
      year,
      object,
      "facilityCostExcluding_greaterThanTen_Peer",
      record,
      "_30b_ratio_gte10_facility_cost_per_square_foot_no_interest",
      "_30b_yes_no_gte10_facility_cost_per_square_foot_no_interest"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalMaintenanceCosts",
      record,
      "_02_04_total_maintenance_costs",
      "_30b_yes_no_gte10_facility_cost_per_square_foot_no_interest",
      "facilityCostExcluding_greaterThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalFacilitySquareFootage",
      record,
      "_01_07_total_facility_square_footage",
      "_30b_yes_no_gte10_facility_cost_per_square_foot_no_interest",
      "facilityCostExcluding_greaterThanTen"
    );

    // facilityCostIncluding_lessThanTen
    insertDataIntoObject(
      "peer",
      year,
      object,
      "facilityCostIncluding_lessThanTen_Peer",
      record,
      "_31a_ratio_lt10_facility_cost_per_square_foot_with_interest",
      "_31a_yes_no_lt10_facility_cost_per_square_foot_with_interest"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalMaintenanceCosts",
      record,
      "_02_04_total_maintenance_costs",
      "_31a_yes_no_lt10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_lessThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalFacilitySquareFootage",
      record,
      "_01_07_total_facility_square_footage",
      "_31a_yes_no_lt10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_lessThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentMaturingDebt",
      record,
      "_02_06_current_maturities_of_lt_debt",
      "_31a_yes_no_lt10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_lessThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentYearInterestExpense",
      record,
      "_04_11_current_year_interest_expense",
      "_31a_yes_no_lt10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_lessThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "capitalizedInterest",
      record,
      "_05_02_capitalized_interest",
      "_31a_yes_no_lt10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_lessThanTen"
    );

    // facilityCostIncluding_greaterThanTen
    insertDataIntoObject(
      "peer",
      year,
      object,
      "facilityCostIncluding_greaterThanTen_Peer",
      record,
      "_31b_ratio_gte10_facility_cost_per_square_foot_with_interest",
      "_31b_yes_no_gte10_facility_cost_per_square_foot_with_interest"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalMaintenanceCosts",
      record,
      "_02_04_total_maintenance_costs",
      "_31b_yes_no_gte10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_greaterThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalFacilitySquareFootage",
      record,
      "_01_07_total_facility_square_footage",
      "_31b_yes_no_gte10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_greaterThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentMaturingDebt",
      record,
      "_02_06_current_maturities_of_lt_debt",
      "_31b_yes_no_gte10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_greaterThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentYearInterestExpense",
      record,
      "_04_11_current_year_interest_expense",
      "_31b_yes_no_gte10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_greaterThanTen"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "capitalizedInterest",
      record,
      "_05_02_capitalized_interest",
      "_31b_yes_no_gte10_facility_cost_per_square_foot_with_interest",
      "facilityCostIncluding_greaterThanTen"
    );

    // informationTechnologyCosts
    insertDataIntoObject(
      "peer",
      year,
      object,
      "informationTechnologyCosts_Peer",
      record,
      "_32_ratio_information_technology_costs",
      "_32_yes_no_information_technology_costs"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "informationTechnologyCosts",
      record,
      "_02_05_information_technology_costs",
      "_32_yes_no_information_technology_costs",
      "informationTechnologyCosts"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_32_yes_no_information_technology_costs",
      "informationTechnologyCosts"
    );
  });

  const filteredClientRecords = [...recordsClient].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;
    return fiscalYear.includes(year.toString());
  });
  filteredClientRecords.forEach((record) => {
    // salariesBenefitsTeachersAsPercentNetTuition_Salaries
    insertDataIntoObject(
      "client",
      year,
      object,
      "salariesBenefitsTeachersAsPercentNetTuition_Salaries_Client",
      record,
      "_24a_ratio_salaries_as___of_net_tuition"
    );
    // salariesBenefitsTeachersAsPercentNetTuition_Benefits
    insertDataIntoObject(
      "client",
      year,
      object,
      "salariesBenefitsTeachersAsPercentNetTuition_Benefits_Client",
      record,
      "_24b_ratio_benefits_as___of_net_tuition"
    );
    // salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits
    insertDataIntoObject(
      "client",
      year,
      object,
      "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_Client",
      record,
      "_24c_ratio_salaries_benefits_as___of_net_tuition"
    );
    // salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries
    insertDataIntoObject(
      "client",
      year,
      object,
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries_Client",
      record,
      "_25a_ratio_salaries_per_students"
    );
    // salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits
    insertDataIntoObject(
      "client",
      year,
      object,
      "salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits_Client",
      record,
      "_25b_ratio_benefits_per_students"
    );
    // salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits
    insertDataIntoObject(
      "client",
      year,
      object,
      "salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits_Client",
      record,
      "_25c_ratio_salaries_and_benefits_per_students"
    );
    // benefitsPercentSalariesTeachers
    insertDataIntoObject(
      "client",
      year,
      object,
      "benefitsPercentSalariesTeachers_Client",
      record,
      "_26_ratio_benefits_as_a_percent_of_salaries_for_teachers"
    );
    // personnelMandatoryDebtService_SalariesAndBenefits_Teachers
    insertDataIntoObject(
      "client",
      year,
      object,
      "personnelMandatoryDebtService_SalariesAndBenefits_Teachers_Client",
      record,
      "_27a1_ratio_teachers_salaries_and_benefits_per_total_expenses"
    );
    // personnelMandatoryDebtService_SalariesAndBenefits_Administration
    insertDataIntoObject(
      "client",
      year,
      object,
      "personnelMandatoryDebtService_SalariesAndBenefits_Administration_Client",
      record,
      "_27a2_ratio_admin_salaries_and_benefits_per_total_expenses"
    );

    // personnelMandatoryDebtService_SalariesAndBenefits_Employees
    insertDataIntoObject(
      "client",
      year,
      object,
      "personnelMandatoryDebtService_SalariesAndBenefits_Employees_Client",
      record,
      "_27a3_ratio_all_salaries_and_benefits_per_total_expenses"
    );

    // personnelMandatoryDebtService_Mandatory
    insertDataIntoObject(
      "client",
      year,
      object,
      "personnelMandatoryDebtService_Mandatory_Client",
      record,
      "_27b_ratio__mandatory_debt_service_payments_including_interest_per_total_expenses"
    );

    // personnelMandatoryDebtService_Personnel
    insertDataIntoObject(
      "client",
      year,
      object,
      "personnelMandatoryDebtService_Personnel_Client",
      record,
      "_27c_ratio__personnel_and_mandatory_debt_service_payments_per_total_expenses"
    );

    // percentFundRaisingExpensesExceeding
    insertDataIntoObject(
      "client",
      year,
      object,
      "percentFundRaisingExpensesExceeding_Client",
      record,
      "_28_ratio___of_fund_raising_expenses_exceeding_or_less_than_funds_raised"
    );

    // fundsExpensesPerStudent_FundsRaised
    insertDataIntoObject(
      "client",
      year,
      object,
      "fundsExpensesPerStudent_FundsRaised_Client",
      record,
      "_29a_ratio_funds_raised"
    );

    // fundsExpensesPerStudent_CashExpensesExcludingDepreciation
    insertDataIntoObject(
      "client",
      year,
      object,
      "fundsExpensesPerStudent_CashExpensesExcludingDepreciation_Client",
      record,
      "_29b_ratio_cash_expenses"
    );

    // fundsExpensesPerStudent_netTuition
    insertDataIntoObject(
      "client",
      year,
      object,
      "fundsExpensesPerStudent_netTuition_Client",
      record,
      "_29c_ratio_net_tuition"
    );

    // fundsExpensesPerStudent_cashExpensesExcessNetTuition
    insertDataIntoObject(
      "client",
      year,
      object,
      "fundsExpensesPerStudent_cashExpensesExcessNetTuition_Client",
      record,
      "_29d_ratio_cash_expenses_in_excess_of_or_less_than_net_tuition"
    );

    // fundsExpensesPerStudent_FundsRaisedOverUnder
    insertDataIntoObject(
      "client",
      year,
      object,
      "fundsExpensesPerStudent_FundsRaisedOverUnder_Client",
      record,
      "_29e_ratio_funds_raised_over_under_to_cover_cash_expenses_overage_or_deficit"
    );

    // facilityCostExcluding_lessThanTen
    insertDataIntoObject(
      "client",
      year,
      object,
      "facilityCostExcluding_lessThanTen_Client",
      record,
      "_30a_ratio_lt10_facility_cost_per_square_foot_no_interest"
    );

    // facilityCostExcluding_greaterThanTen
    insertDataIntoObject(
      "client",
      year,
      object,
      "facilityCostExcluding_greaterThanTen_Client",
      record,
      "_30b_ratio_gte10_facility_cost_per_square_foot_no_interest"
    );

    // facilityCostIncluding_lessThanTen
    insertDataIntoObject(
      "client",
      year,
      object,
      "facilityCostIncluding_lessThanTen_Client",
      record,
      "_31a_ratio_lt10_facility_cost_per_square_foot_with_interest"
    );

    // facilityCostIncluding_greaterThanTen
    insertDataIntoObject(
      "client",
      year,
      object,
      "facilityCostIncluding_greaterThanTen_Client",
      record,
      "_31b_ratio_gte10_facility_cost_per_square_foot_with_interest"
    );

    // informationTechnologyCosts
    insertDataIntoObject(
      "client",
      year,
      object,
      "informationTechnologyCosts_Client",
      record,
      "_32_ratio_information_technology_costs"
    );
  });
});

localStorage.removeItem("expenseData");
localStorage.setItem("expenseData", JSON.stringify(object));
};

const processIncomeData = (years, recordsPeer, recordsClient) => {
const object = {};

years.forEach((year) => {
  const filteredPeerRecords = [...recordsPeer].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;

    return fiscalYear.includes(year.toString());
  });
  filteredPeerRecords.forEach((record) => {
    // netIncomeRatio
    insertDataIntoObject(
      "peer",
      year,
      object,
      "netIncomeRatio_Peer",
      record,
      "_16_ratio_net_income_ratio",
      "_16_yes_no_net_income_ratio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "changeInUnrestrictedNetAssets",
      record,
      "_04_12_change_in_unrestricted_net_assets",
      "_16_yes_no_net_income_ratio",
      "netIncomeRatio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "unrestrictedSupportRevenuesReclassification",
      record,
      "_04_07_unrestricted_support__revenues_and_reclassifications_for_operating_purposes",
      "_16_yes_no_net_income_ratio",
      "netIncomeRatio"
    );

    // netIncomeRatioExcludingDepreciation
    insertDataIntoObject(
      "peer",
      year,
      object,
      "netIncomeRatioExcludingDepreciation_Peer",
      record,
      "_17_ratio_net_income_ratio_excluding_depreciation",
      "_17_yes_no_net_income_ratio_excluding_depreciation"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "changeInUnrestrictedNetAssets",
      record,
      "_04_12_change_in_unrestricted_net_assets",
      "_17_yes_no_net_income_ratio_excluding_depreciation",
      "netIncomeRatioExcludingDepreciation"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_17_yes_no_net_income_ratio_excluding_depreciation",
      "netIncomeRatioExcludingDepreciation"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "unrestrictedSupportRevenuesReclassification",
      record,
      "_04_07_unrestricted_support__revenues_and_reclassifications_for_operating_purposes",
      "_17_yes_no_net_income_ratio_excluding_depreciation",
      "netIncomeRatioExcludingDepreciation"
    );

    // financialAssistanceAsPercentTuitionAndFees
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAssistanceAsPercentTuitionAndFees_Peer",
      record,
      "_19_ratio_financial_assistance_as_a___of_tuition_and_fees",
      "_19_yes_no_financial_assistance_as_a___of_tuition_and_fees"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_19_yes_no_financial_assistance_as_a___of_tuition_and_fees",
      "financialAssistanceAsPercentTuitionAndFees"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_19_yes_no_financial_assistance_as_a___of_tuition_and_fees",
      "financialAssistanceAsPercentTuitionAndFees"
    );

    // tuitionAndFeesAsPercentTotalIncome
    insertDataIntoObject(
      "peer",
      year,
      object,
      "tuitionAndFeesAsPercentTotalIncome_Peer",
      record,
      "_20_ratio_tuition_and_fees_as_a___of_total_income",
      "_20_yes_no_tuition_and_fees_as_a___of_total_income"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_20_yes_no_tuition_and_fees_as_a___of_total_income",
      "tuitionAndFeesAsPercentTotalIncome"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalSupportRevenue",
      record,
      "_04_05_total_support_and_revenue",
      "_20_yes_no_tuition_and_fees_as_a___of_total_income",
      "tuitionAndFeesAsPercentTotalIncome"
    );

    // contributionsAsAPercentOfTotalIncome
    insertDataIntoObject(
      "peer",
      year,
      object,
      "contributionsAsAPercentOfTotalIncome_Peer",
      record,
      "_21_ratio_contributions_as_a___of_total_income",
      "_21_yes_no_contributions_as_a___of_total_income"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalContributions",
      record,
      "_04_06_total_contributions",
      "_21_yes_no_contributions_as_a___of_total_income",
      "contributionsAsAPercentOfTotalIncome"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalSupportRevenue",
      record,
      "_04_05_total_support_and_revenue",
      "_21_yes_no_contributions_as_a___of_total_income",
      "contributionsAsAPercentOfTotalIncome"
    );

    // grossTuition
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuition_Peer",
      record,
      "_22a1_ratio_gross_tuition",
      "_22a1_yes_no_gross_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_22a1_yes_no_gross_tuition",
      "grossTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_22a1_yes_no_gross_tuition",
      "grossTuition"
    );

    // financialAssistanceDiscountBased
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAssistanceDiscountBased_Peer",
      record,
      "_22b1_ratio_financial_assistance_discount_based",
      "_22b1_yes_no_financial_assistance_discount_based"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "discounts",
      record,
      "_04_03_discounts",
      "_22b1_yes_no_financial_assistance_discount_based",
      "financialAssistanceDiscountBased"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_22b1_yes_no_financial_assistance_discount_based",
      "financialAssistanceDiscountBased"
    );

    // scholarshipAwarded
    insertDataIntoObject(
      "peer",
      year,
      object,
      "scholarshipAwarded_Peer",
      record,
      "_22c1_ratio_scholarship_awarded",
      "_22c1_yes_no_scholarship_awarded"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "discounts",
      record,
      "_04_03_discounts",
      "_22c1_yes_no_scholarship_awarded",
      "scholarshipAwarded"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_22c1_yes_no_scholarship_awarded",
      "scholarshipAwarded"
    );

    // totalFinancialAssistance
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalFinancialAssistance_Peer",
      record,
      "_22d1_ratio_total_financial_assistance",
      "_22d1_yes_no_total_financial_assistance"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_22d1_yes_no_total_financial_assistance",
      "totalFinancialAssistance"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_22d1_yes_no_total_financial_assistance",
      "totalFinancialAssistance"
    );

    // netTuition
    insertDataIntoObject(
      "peer",
      year,
      object,
      "netTuition_Peer",
      record,
      "_22e1_ratio_net_tuition",
      "_22e1_yes_no_net_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_22e1_yes_no_net_tuition",
      "netTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_22e1_yes_no_net_tuition",
      "netTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01b_ratio_students_enrollment_average",
      "_22e1_yes_no_net_tuition",
      "netTuition"
    );

    // feesPercentOfNetTuition
    insertDataIntoObject(
      "peer",
      year,
      object,
      "feesPercentOfNetTuition_Peer",
      record,
      "_23_ratio_fees_as_a_percent_of_net_tuition",
      "_23_yes_no_fees_as_a_percent_of_net_tuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fees",
      record,
      "_04_02_fees",
      "_23_yes_no_fees_as_a_percent_of_net_tuition",
      "feesPercentOfNetTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_23_yes_no_fees_as_a_percent_of_net_tuition",
      "feesPercentOfNetTuition"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_23_yes_no_fees_as_a_percent_of_net_tuition",
      "feesPercentOfNetTuition"
    );
  });

  const filteredClientRecords = [...recordsClient].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;
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
      "_16_ratio_net_income_ratio",
      "_16_bench_rating_net_income_ratio"
    );

    // netIncomeRatioExcludingDepreciation
    insertDataIntoObject(
      "client",
      year,
      object,
      "netIncomeRatioExcludingDepreciation_Client",
      record,
      "_17_ratio_net_income_ratio_excluding_depreciation",
      "_17_bench_rating_net_income_ratio_excluding_depreciation"
    );

    // percentAverageTuitionIncreaseBetweenYears
    insertDataIntoObject(
      "client",
      year,
      object,
      "percentAverageTuitionIncreaseBetweenYears_Client",
      record,
      "_18_ratio_percentage_of_average_tuition_increase_between_years",
      "_18_bench_rating_percentage_of_average_tuition_increase_between_years"
    );

    // financialAssistanceAsPercentTuitionAndFees
    insertDataIntoObject(
      "client",
      year,
      object,
      "financialAssistanceAsPercentTuitionAndFees_Client",
      record,
      "_19_ratio_financial_assistance_as_a___of_tuition_and_fees"
    );

    // tuitionAndFeesAsPercentTotalIncome
    insertDataIntoObject(
      "client",
      year,
      object,
      "tuitionAndFeesAsPercentTotalIncome_Client",
      record,
      "_20_ratio_tuition_and_fees_as_a___of_total_income"
    );

    // contributionsAsAPercentOfTotalIncome
    insertDataIntoObject(
      "client",
      year,
      object,
      "contributionsAsAPercentOfTotalIncome_Client",
      record,
      "_20_ratio_tuition_and_fees_as_a___of_total_income"
    );

    // grossTuition
    insertDataIntoObject(
      "client",
      year,
      object,
      "grossTuition_Client",
      record,
      "_22a1_ratio_gross_tuition"
    );

    // grossTuition_Percent
    insertDataIntoObject(
      "client",
      year,
      object,
      "grossTuition_Percent_Client",
      record,
      "_22a2_ratio___change"
    );

    // totalFinancialAssistance
    insertDataIntoObject(
      "client",
      year,
      object,
      "totalFinancialAssistance_Client",
      record,
      "_22d1_ratio_total_financial_assistance"
    );

    // totalFinancialAssistance_Percent
    insertDataIntoObject(
      "client",
      year,
      object,
      "totalFinancialAssistance_Percent_Client",
      record,
      "_22d2_ratio___change"
    );

    // netTuition
    insertDataIntoObject(
      "client",
      year,
      object,
      "netTuition_Client",
      record,
      "_22e1_ratio_net_tuition"
    );

    // netTuition_Percent
    insertDataIntoObject(
      "client",
      year,
      object,
      "netTuition_Percent_Client",
      record,
      "_22e2_ratio___change"
    );

    // feesPercentOfNetTuition
    insertDataIntoObject(
      "client",
      year,
      object,
      "feesPercentOfNetTuition_Client",
      record,
      "_23_ratio_fees_as_a_percent_of_net_tuition"
    );
  });
});

localStorage.removeItem("incomeData");
localStorage.setItem("incomeData", JSON.stringify(object));
};

const processDebtData = (years, recordsPeer, recordsClient) => {
const object = {};

years.forEach((year) => {
  const filteredPeerRecords = [...recordsPeer].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;

    return fiscalYear.includes(year.toString());
  });
  filteredPeerRecords.forEach((record) => {
    // debtToPropertyAndEquipment
    insertDataIntoObject(
      "peer",
      year,
      object,
      "debtToPropertyAndEquipment_Peer",
      record,
      "_11_ratio_debt_to_property_and_equipment",
      "_11_yes_no_debt_to_property_and_equipment"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDebt",
      record,
      "_03_11_total_debt",
      "_11_yes_no_debt_to_property_and_equipment",
      "debtToPropertyAndEquipment"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "landBuildingsEquipmentNet",
      record,
      "_03_08_land__buildings_and_equipment__net",
      "_11_yes_no_debt_to_property_and_equipment",
      "debtToPropertyAndEquipment"
    );

    // debtToNetAssets [03-11 Total Debt] / [03-12 Total Unrestricted Net Assets]
    insertDataIntoObject(
      "peer",
      year,
      object,
      "debtToNetAssets_Peer",
      record,
      "_11_1_ratio_debt_to_net_assets",
      "_11_1__yes_no_ratio_debt_to_net_assets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDebt",
      record,
      "_03_11_total_debt",
      "_11_1__yes_no_ratio_debt_to_net_assets",
      "debtToNetAssets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalUnrestrictedNetAssets",
      record,
      "_03_12_total_unrestricted_net_assets",
      "_11_1__yes_no_ratio_debt_to_net_assets",
      "debtToNetAssets"
    );

    // currentRatio
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentRatio_Peer",
      record,
      "_12_ratio_current_ratio",
      "_12_yes_no_current_ratio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentAssets",
      record,
      "_03_01_current_assets",
      "_12_yes_no_current_ratio",
      "currentRatio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentLiabilities",
      record,
      "_03_09_current_liabilities",
      "_12_yes_no_current_ratio",
      "currentRatio"
    );

    // currentLiabilitiesToAvailableNetAssets
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentLiabilitiesToAvailableNetAssets_Peer",
      record,
      "_13_ratio_current_liabilities_to_available_net_assets",
      "_13_yes_no_current_liabilities_to_available_net_assets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentLiabilities",
      record,
      "_03_09_current_liabilities",
      "_13_yes_no_current_liabilities_to_available_net_assets",
      "currentLiabilitiesToAvailableNetAssets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalUnrestrictedNetAssets",
      record,
      "_03_12_total_unrestricted_net_assets",
      "_13_yes_no_current_liabilities_to_available_net_assets",
      "currentLiabilitiesToAvailableNetAssets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "landBuildingsEquipmentNet",
      record,
      "_03_08_land__buildings_and_equipment__net",
      "_13_yes_no_current_liabilities_to_available_net_assets",
      "currentLiabilitiesToAvailableNetAssets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDebt",
      record,
      "_03_11_total_debt",
      "_13_yes_no_current_liabilities_to_available_net_assets",
      "currentLiabilitiesToAvailableNetAssets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "bodDesignatedForOperations",
      record,
      "_03_13_bod_designated_for_operations_",
      "_13_yes_no_current_liabilities_to_available_net_assets",
      "currentLiabilitiesToAvailableNetAssets"
    );

    // debtPerStudent
    insertDataIntoObject(
      "peer",
      year,
      object,
      "debtPerStudent_Peer",
      record,
      "_14_ratio_debt_per_students",
      "_14_yes_no_debt_per_students"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDebt",
      record,
      "_03_11_total_debt",
      "_14_yes_no_debt_per_students",
      "debtPerStudent"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01_01_students_average_enrollment",
      "_14_yes_no_debt_per_students",
      "debtPerStudent"
    );

    // debtCoverage
    insertDataIntoObject(
      "peer",
      year,
      object,
      "debtCoverage_Peer",
      record,
      "_15_ratio_debt_coverage",
      "_15_yes_no_debt_coverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "changeInUnrestrictedNetAssets",
      record,
      "_04_12_change_in_unrestricted_net_assets",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentYearInterestExpense",
      record,
      "_04_11_current_year_interest_expense",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "capitalizedInterest",
      record,
      "_05_02_capitalized_interest",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentMaturingDebt",
      record,
      "_02_06_current_maturities_of_lt_debt",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentMaturingDebt",
      record,
      "_02_06_current_maturities_of_lt_debt",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentYearInterestExpense",
      record,
      "_04_11_current_year_interest_expense",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "capitalizedInterest",
      record,
      "_05_02_capitalized_interest",
      "_15_yes_no_debt_coverage",
      "debtCoverage"
    );
  });

  const filteredClientRecords = [...recordsClient].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;
    return fiscalYear.includes(year.toString());
  });
  filteredClientRecords.forEach((record) => {
    // debtToPropertyAndEquipment
    insertDataIntoObject(
      "client",
      year,
      object,
      "debtToPropertyAndEquipment_Client",
      record,
      "_11_ratio_debt_to_property_and_equipment"
    );

    // debtToNetAssets
    insertDataIntoObject(
      "client",
      year,
      object,
      "debtToNetAssets_Client",
      record,
      "_11_1_ratio_debt_to_net_assets"
    );

    // currentRatio
    insertDataIntoObject(
      "client",
      year,
      object,
      "currentRatio_Client",
      record,
      "_12_ratio_current_ratio",
      "_12_bench_rating_current_ratio"
    );

    // currentLiabilitiesToAvailableNetAssets
    insertDataIntoObject(
      "client",
      year,
      object,
      "currentLiabilitiesToAvailableNetAssets_Client",
      record,
      "_13_ratio_current_liabilities_to_available_net_assets",
      "_13_bench_rating_current_liabilities_to_available_net_assets"
    );

    // debtPerStudent
    insertDataIntoObject(
      "client",
      year,
      object,
      "debtPerStudent_Client",
      record,
      "_14_ratio_debt_per_students"
    );

    // debtCoverage
    insertDataIntoObject(
      "client",
      year,
      object,
      "debtCoverage_Client",
      record,
      "_15_ratio_debt_coverage"
    );
  });
});

localStorage.removeItem("debtData");
localStorage.setItem("debtData", JSON.stringify(object));
};

const processAssetData = (years, recordsPeer, recordsClient) => {
const object = {};

years.forEach((year) => {
  const filteredPeerRecords = [...recordsPeer].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;

    return fiscalYear.includes(year.toString());
  });
  filteredPeerRecords.forEach((record) => {
    // propertyEquipmentPerStudent
    insertDataIntoObject(
      "peer",
      year,
      object,
      "propertyEquipmentPerStudent_Peer",
      record,
      "_08_ratio_property_and_equipment_per_student_excluding_land",
      "_08_yes_no_property_and_equipment_per_student_excluding_land"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "landBuildingsEquipmentNet",
      record,
      "_03_08_land__buildings_and_equipment__net",
      "_08_yes_no_property_and_equipment_per_student_excluding_land",
      "propertyEquipmentPerStudent"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "landAndLandImprovements",
      record,
      "_03_07_land_and_land_improvements",
      "_08_yes_no_property_and_equipment_per_student_excluding_land",
      "propertyEquipmentPerStudent"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01_01_students_average_enrollment",
      "_08_yes_no_property_and_equipment_per_student_excluding_land",
      "propertyEquipmentPerStudent"
    );

    // netTuitionARasPercentCurrentAssets
    insertDataIntoObject(
      "peer",
      year,
      object,
      "netTuitionARasPercentCurrentAssets_Peer",
      record,
      "_09_ratio_net_tuition_a_r_as_a___of_current_assets",
      "_09_yes_no_net_tuition_a_r_as_a___of_current_assets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentsAccountsReceivable",
      record,
      "_03_05_student_accounts_receivable",
      "_09_yes_no_net_tuition_a_r_as_a___of_current_assets",
      "netTuitionARasPercentCurrentAssets"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentAssets",
      record,
      "_03_01_current_assets",
      "_09_yes_no_net_tuition_a_r_as_a___of_current_assets",
      "netTuitionARasPercentCurrentAssets"
    );

    // receivableWriteOffsAsPercentNetTuitionAndFees
    insertDataIntoObject(
      "peer",
      year,
      object,
      "receivableWriteOffsAsPercentNetTuitionAndFees_Peer",
      record,
      "_10_ratio_receivable_write_offs_as_a___of_net_tuition_and_fees",
      "_10_yes_no_receivable_write_offs_as_a___of_net_tuition_and_fees"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAccountsReceivableWriteOffs",
      record,
      "_03_05_student_accounts_receivable",
      "_10_yes_no_receivable_write_offs_as_a___of_net_tuition_and_fees",
      "receivableWriteOffsAsPercentNetTuitionAndFees"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "grossTuitionRevenuesExcludingFees",
      record,
      "_04_01_gross_tuition_revenues_excluding_fees",
      "_10_yes_no_receivable_write_offs_as_a___of_net_tuition_and_fees",
      "receivableWriteOffsAsPercentNetTuitionAndFees"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "financialAidScholarships",
      record,
      "_04_04_financial_aid___scholarships",
      "_10_yes_no_receivable_write_offs_as_a___of_net_tuition_and_fees",
      "receivableWriteOffsAsPercentNetTuitionAndFees"
    );
  });

  const filteredClientRecords = [...recordsClient].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;
    return fiscalYear.includes(year.toString());
  });
  filteredClientRecords.forEach((record) => {
    // propertyEquipmentPerStudent
    insertDataIntoObject(
      "client",
      year,
      object,
      "propertyEquipmentPerStudent_Client",
      record,
      "_08_ratio_property_and_equipment_per_student_excluding_land"
    );

    // netTuitionARasPercentCurrentAssets
    insertDataIntoObject(
      "client",
      year,
      object,
      "netTuitionARasPercentCurrentAssets_Client",
      record,
      "_09_ratio_net_tuition_a_r_as_a___of_current_assets"
    );

    // receivableWriteOffsAsPercentNetTuitionAndFees
    insertDataIntoObject(
      "client",
      year,
      object,
      "receivableWriteOffsAsPercentNetTuitionAndFees_Client",
      record,
      "_10_ratio_receivable_write_offs_as_a___of_net_tuition_and_fees"
    );

    // receivableWriteOffsAsPercentNetTuitionAndFees_Percent
    insertDataIntoObject(
      "client",
      year,
      object,
      "receivableWriteOffsAsPercentNetTuitionAndFees_Percent_Client",
      record,
      "_10a_ratio___change"
    );
  });
});

localStorage.removeItem("assetData");
localStorage.setItem("assetData", JSON.stringify(object));
};

const processCashData = (years, recordsPeer, recordsClient) => {
const object = {};

years.forEach((year) => {
  const filteredPeerRecords = [...recordsPeer].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;

    return fiscalYear.includes(year.toString());
  });
  filteredPeerRecords.forEach((record) => {
    // expendableReserves_inDays
    insertDataIntoObject(
      "peer",
      year,
      object,
      "expendableReserves_inDays_Peer",
      record,
      "_03_ratio_expendable_reserves___in_days",
      "_03_yes_no_expendable_reserves___in_days"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "unrestrictedNetAssets",
      record,
      "_03_12_total_unrestricted_net_assets",
      "_03_yes_no_expendable_reserves___in_days",
      "expendableReserves_inDays"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "landBuildingsEquipmentNet",
      record,
      "_03_08_land__buildings_and_equipment__net",
      "_03_yes_no_expendable_reserves___in_days",
      "expendableReserves_inDays"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDebt",
      record,
      "_03_11_total_debt",
      "_03_yes_no_expendable_reserves___in_days",
      "expendableReserves_inDays"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_03_yes_no_expendable_reserves___in_days",
      "expendableReserves_inDays"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_03_yes_no_expendable_reserves___in_days",
      "expendableReserves_inDays"
    );

    // expaendableReserves_Percent
    insertDataIntoObject(
      "peer",
      year,
      object,
      "expendableReserves_Percent_Peer",
      record,
      "_04_ratio_expendable_reserves______of_total_cash_expenses",
      "_04_yes_no_expendable_reserves______of_total_cash_expenses"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "unrestrictedNetAssets",
      record,
      "_03_12_total_unrestricted_net_assets",
      "_04_yes_no_expendable_reserves______of_total_cash_expenses",
      "expendableReserves_Percent"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "landBuildingsEquipmentNet",
      record,
      "_03_08_land__buildings_and_equipment__net",
      "_04_yes_no_expendable_reserves______of_total_cash_expenses",
      "expendableReserves_Percent"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDebt",
      record,
      "_03_11_total_debt",
      "_04_yes_no_expendable_reserves______of_total_cash_expenses",
      "expendableReserves_Percent"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalDepreciationExpense",
      record,
      "_04_09_total_depreciation_expense",
      "_04_yes_no_expendable_reserves______of_total_cash_expenses",
      "expendableReserves_Percent"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_04_yes_no_expendable_reserves______of_total_cash_expenses",
      "expendableReserves_Percent"
    );

    // daysCashOnHand [03-02 Total Cash]/([04-08 Total Expenses]/365)
    insertDataIntoObject(
      "peer",
      year,
      object,
      "daysCashOnHand_Peer",
      record,
      "_05_1_ratio_days_cash_on_hand",
      "_05_1_yes_no_ratio_days_cash_on_hand"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalCash",
      record,
      "_03_02_total_cash",
      "_05_1_yes_no_ratio_days_cash_on_hand",
      "daysCashOnHand"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalExpenses",
      record,
      "_04_08_total_expenses",
      "_05_1_yes_no_ratio_days_cash_on_hand",
      "daysCashOnHand"
    );

    // cashAvailableDeferred
    insertDataIntoObject(
      "peer",
      year,
      object,
      "cashAvailableDeferred_Peer",
      record,
      "_05_ratio_cash_available_to_deferred_revenues",
      "_05_yes_no_cash_available_to_deferred_revenues"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalCash",
      record,
      "_03_02_total_cash",
      "_05_yes_no_cash_available_to_deferred_revenues",
      "cashAvailableDeferred"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "nonEndowmentInvestments",
      record,
      "_03_03_non_endowment_investments",
      "_05_yes_no_cash_available_to_deferred_revenues",
      "cashAvailableDeferred"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "deferredRevenue",
      record,
      "_03_10_deferred_revenue",
      "_05_yes_no_cash_available_to_deferred_revenues",
      "cashAvailableDeferred"
    );

    // liquidityRatio
    insertDataIntoObject(
      "peer",
      year,
      object,
      "liquidityRatio_Peer",
      record,
      "_06_ratio_liquidity_ratio",
      "_06_yes_no_liquidity_ratio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "totalCash",
      record,
      "_03_02_total_cash",
      "_06_yes_no_liquidity_ratio",
      "liquidityRatio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "currentLiabilities",
      record,
      "_03_09_current_liabilities",
      "_06_yes_no_liquidity_ratio",
      "liquidityRatio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "deferredRevenue",
      record,
      "_03_10_deferred_revenue",
      "_06_yes_no_liquidity_ratio",
      "liquidityRatio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "nonEndowmentInvestments",
      record,
      "_03_03_non_endowment_investments",
      "_06_yes_no_liquidity_ratio",
      "liquidityRatio"
    );

    // netCashUsedOperating_asPerStatementCash
    insertDataIntoObject(
      "peer",
      year,
      object,
      "netCashUsedOperating_asPerStatementCash_Peer",
      record,
      "_07a_ratio_as_per_statement_of_cash_flows",
      "_07a_yes_no_as_per_statement_of_cash_flows"
    );

    // netCashUsedOperating_depreciation
    insertDataIntoObject(
      "peer",
      year,
      object,
      "netCashUsedOperating_depreciation_Peer",
      record,
      "_07b_ratio_depreciation_expenses_on_3_7_year_assets",
      "_07b_yes_no_depreciation_expenses_on_3_7_year_assets"
    );

    // netCashUsedOperating_overUnder
    insertDataIntoObject(
      "peer",
      year,
      object,
      "netCashUsedOperating_overUnder_Peer",
      record,
      "_07c_ratio_over_under_benchmark",
      "_07c_yes_no_over_under_benchmark"
    );
  });

  const filteredClientRecords = [...recordsClient].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;
    return fiscalYear.includes(year.toString());
  });
  filteredClientRecords.forEach((record) => {
    // expendableReserves_inDays
    insertDataIntoObject(
      "client",
      year,
      object,
      "expendableReserves_inDays_Client",
      record,
      "_03_ratio_expendable_reserves___in_days",
      "_03_bench_rating_expendable_reserves___in_days"
    );
    // expendableReserves_Percent
    insertDataIntoObject(
      "client",
      year,
      object,
      "expendableReserves_Percent_Client",
      record,
      "_04_ratio_expendable_reserves______of_total_cash_expenses",
      "_04_benchmark_rating_expendable_reserves______of_total_cash_expenses"
    );
    // daysCashOnHand
    insertDataIntoObject(
      "client",
      year,
      object,
      "daysCashOnHand_Client",
      record,
      "_05_1_ratio_days_cash_on_hand"
    );
    // cashAvailableDeferred
    insertDataIntoObject(
      "client",
      year,
      object,
      "cashAvailableDeferred_Client",
      record,
      "_05_ratio_cash_available_to_deferred_revenues"
    );
    // liquidityRatio
    insertDataIntoObject(
      "client",
      year,
      object,
      "liquidityRatio_Client",
      record,
      "_06_ratio_liquidity_ratio",
      "_06_bench_rating_liquidity_ratio"
    );
    // netCashUsedOperating_asPerStatementCash
    insertDataIntoObject(
      "client",
      year,
      object,
      "netCashUsedOperating_asPerStatementCash_Client",
      record,
      "_07a_ratio_as_per_statement_of_cash_flows"
    );
    // netCashUsedOperating_depreciation
    insertDataIntoObject(
      "client",
      year,
      object,
      "netCashUsedOperating_depreciation_Client",
      record,
      "_07b_ratio_depreciation_expenses_on_3_7_year_assets"
    );
    // netCashUsedOperating_overUnder
    insertDataIntoObject(
      "client",
      year,
      object,
      "netCashUsedOperating_overUnder_Client",
      record,
      "_07b_ratio_depreciation_expenses_on_3_7_year_assets", 
      "_07c_bench_rating_over_under_benchmark"
    );
  });
});

// console.log(object);
localStorage.removeItem("cashData");
localStorage.setItem("cashData", JSON.stringify(object));
};

const processEnrollmentData = (years, recordsPeer, recordsClient) => {
const object = {};

years.forEach((year) => {
  const filteredPeerRecords = [...recordsPeer].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;

    return fiscalYear.includes(year.toString());
  });
  filteredPeerRecords.forEach((record) => {
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Peer",
      record,
      "_01_ratio_students_enrollment",
      "_01_yes_no_students_enrollment"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Average_Peer",
      record,
      "_01b_ratio_students_enrollment_average",
      "_01b_yes_no_students_enrollment_average"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Peak_Peer",
      record,
      "_01c_ratio_students_enrollment_peak_enrolmment",
      "_01c_yes_no_students_enrollment_peak_enrolmment"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentFacilityRatio_Peer",
      record,
      "_02_ratio_student_faculty_ratio",
      "_02_yes_no_student_faculty_ratio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "fullTimeTeachers_Peer",
      record,
      "_01_03_ft_teachers",
      "_02_yes_no_student_faculty_ratio",
      "studentFacilityRatio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "partTimeTeachers_Peer",
      record,
      "_01_05_pt_teachers",
      "_02_yes_no_student_faculty_ratio",
      "studentFacilityRatio"
    );
    insertDataIntoObject(
      "peer",
      year,
      object,
      "studentAverageEnrollment_Main",
      record,
      "_01_01_students_average_enrollment",
      "_02_yes_no_student_faculty_ratio",
      "studentFacilityRatio"
    );

    // studentFacilityRatio (01-03 FT Teachers + (0.5 * 01-05 PT Teachers) ) / 01-01 Students-average enrollment
  });

  const filteredClientRecords = [...recordsClient].filter((record) => {
    const fiscalYear = record.querySelector(
      "fiscal_ye_date_formatted_year"
    ).textContent;
    return fiscalYear.includes(year.toString());
  });
  filteredClientRecords.forEach((record) => {
    insertDataIntoObject(
      "client",
      year,
      object,
      "studentAverageEnrollment_Client",
      record,
      "_01_ratio_students_enrollment"
    );
    insertDataIntoObject(
      "client",
      year,
      object,
      "studentAverageEnrollment_PercentChange_Client",
      record,
      "_01a_ratio_students_enrollment___change"
    );
    insertDataIntoObject(
      "client",
      year,
      object,
      "studentAverageEnrollment_Average_Client",
      record,
      "_01b_ratio_students_enrollment_average"
    );
    insertDataIntoObject(
      "client",
      year,
      object,
      "studentAverageEnrollment_Peak_Client",
      record,
      "_01c_ratio_students_enrollment_peak_enrolmment"
    );
    insertDataIntoObject(
      "client",
      year,
      object,
      "studentFacilityRatio_Client",
      record,
      "_02_ratio_student_faculty_ratio"
    );
  });
});

localStorage.removeItem("enrollmentData");
localStorage.setItem("enrollmentData", JSON.stringify(object));
};





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










// Helper functions


const countUniqueClients = (records) => {
const uniqueClients = new Set();
try {
  records.forEach((record) => {
      const mainRelatedClient = record.querySelector("main__related_client").textContent;
      // console.log(mainRelatedClient);
      uniqueClients.add(mainRelatedClient);
  });

  const count = uniqueClients.size;
  console.log(count);
  document.getElementById('uniqueClients').textContent = count;
} catch (error) {
  console.error("Error counting unique clients:", error);
  document.getElementById('uniqueClients').textContent = 0; // Set to 0 in case of error
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
  <span class='text-xl mr-2'>RUN</span>
  <svg class="w-8 h-8 text-2xl text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
  </svg>`;
btn.disabled = false;
};

const createToastWarning = () => {
const toastWarningDiv = document.createElement("div");
toastWarningDiv.id = "toast-warning";
toastWarningDiv.classList.add(
  "transition",
  "ease-in-out",
  "delay-150",
  "fixed",
  "top-20",
  "left-1/2",
  "transform",
  "-translate-x-1/2",
  "z-50",
  "flex",
  "items-center",
  "w-full",
  "max-w-md",
  "p-4",
  "text-gray-700",
  "bg-gray-300",
  "rounded-lg",
  "shadow",
  "dark:text-gray-200",
  "dark:bg-gray-600"
);

toastWarningDiv.innerHTML = `
  <div class="animate-pulse inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
    <svg class="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
    </svg>
    <span class="sr-only">Warning icon</span>
  </div>
  <div class="ms-3 text-lg font-normal">
    Please select year(s) for data to appear
  </div>
  <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-gray-300 text-gray-600 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-200 dark:hover:text-white dark:bg-gray-600 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close">
    <span class="sr-only">Close</span>
    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
  </button>
`;


const closeButton = toastWarningDiv.querySelector('[data-dismiss-target="#toast-warning"]');
closeButton.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent propagation to the toast
  toastWarningDiv.remove();
});

document.body.appendChild(toastWarningDiv);

// Event listener to close the toast when clicking outside of it
const clickOutsideHandler = (event) => {
  if (!toastWarningDiv.contains(event.target)) {
    toastWarningDiv.remove();
    document.body.removeEventListener("click", clickOutsideHandler);
  }
};

setTimeout(() => {
  document.body.addEventListener("click", clickOutsideHandler);
}, 100); // Delay adding the event listener to prevent immediate removal

};

const processSelectedYears = () => {
const selectedYears = getSelectedYearsFromLocalStorage();

// console.log(selectedYears);

if (!selectedYears) {
  createToastWarning();
  throw new Error("No years selected.");
}

if (!selectedYears.length) {
  createToastWarning();
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

const processApiCalls = (selectedYears, recordsPeer, recordsClient) => {
processEnrollmentData(selectedYears, recordsPeer, recordsClient);
processCashData(selectedYears, recordsPeer, recordsClient);
processAssetData(selectedYears, recordsPeer, recordsClient);
processDebtData(selectedYears, recordsPeer, recordsClient);
processIncomeData(selectedYears, recordsPeer, recordsClient);
processExpenseData(selectedYears, recordsPeer, recordsClient);
};

const displayComponents = () => {
displayEnrollmentComponent();
displayCashComponent();
displayAssetComponent();
displayDebtComponent();
displayIncomeComponent();
displayExpenseComponent();
displayReportComponent();
};






/////////////---------------------/////////////---------------------/////////////---------------------/////////////---------------------/////////////---------------------












 const recordClientHTMLArray = []
 const recordPeerHTMLArray = []





const run_btn = document.querySelector("#run");
run_btn.addEventListener("click", async () => {
  try {
    toggleButtonLoadingState(run_btn);
    const selectedYears = processSelectedYears();
    saveSelectedYearsToLocalStorage(selectedYears);

    const recordsPeer = await getRecordsForPeer(selectedYears, '<qdbapi>');
    countUniqueClients(recordsPeer)

    const recordsClient = await getRecordsForClient(selectedYears, '<qdbapi>');


const qdbapiElementClient = `<qdbapi>${recordClientHTMLArray.join('')}</qdbapi>`;
console.log('CLIENT', qdbapiElementClient)

const qdbapiElementPeer= `<qdbapi>${recordPeerHTMLArray.join('')}</qdbapi>`;
console.log('PEER', qdbapiElementPeer)

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
const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
return xmlDoc.querySelectorAll('record');
};




const getRecordsForPeer = async (years, dataStr) => {

// console.log(years, dataStr) 

if (years.length === 0) {
  // Base case: return the final string when the array is empty
  const parsedData = getParsedData(dataStr + '</qdbapi>');
  return parsedData;
}


//  ( {288.EX.${schoolChurch_Array[0]['arr'][0]}} OR {288.EX.${schoolChurch_Array[1]['arr'][0]}} ) 


const currentYear = years[0];
const apiCallPeerData = {
  act: 'API_DoQuery',
  query: `
    {136.EX.${currentYear}} AND 
    {6.GTE.${sliderValue}} AND 
    {6.LTE.${sliderValue2}} AND
|]'
  `,
  clist: '136.138.49.50.51.52.53.154.157.159.160.161.162.8.10.6.54.163.31.27.30.27.30.41.42.55.164.56.165.21.22.29.57.166.28.58.167.59.168.60.169.47.19.61.170.27.26.62.171.24.20.63.186.25.34.37.65.188.30.27.66.189.20.28.67.190.28.31.27.30.32.68.191.69.192.45.44.48.18.70.193..45.40.71.194.42.73.196.37.34.74.197.34.38.75.198.39.38.76.199.34.78.201.36.80.203.82.205.37.84.207.34.86.209.35.87.210.13.34.37.88.211.14.89.212.34.90.213.91.215.92.216.93.217.94.218.4.42.95.219.15.41.96.220.97.221.48.98.222.18.44.99.223.39.46.100.224.39.101.225.102.226.34.37.103.227.104.228.39.105.229.16.12.106.230.107.231.16.18.44.48.12.108.232.109.233.17.43.282.285.283.284.288.156'              
};

try {
  const xml = await $.get(peerData, apiCallPeerData);
  const recordsForPeer = $('record', xml).toArray()

  //console.log('recordsForPeer', recordsForPeer) 

     // Update dataStr with the records from the current API call
  recordsForPeer.forEach((record) => {
    // Create a new record element
    const newRecord = document.createElement('record');

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
  console.error('Error fetching data:', error);
  // Handle the error as needed
  return dataStr; // Return the accumulated data so far even in case of an error
}
};




const getRecordsForClient = async (years, dataStr) => {

if (years.length === 0) {
  // Base case: return the final string when the array is empty
  const parsedData = getParsedData(dataStr + '</qdbapi>');
  return parsedData;
}

const currentYear = years[0];
const apiCallClientData = {
  act: 'API_DoQuery',
  query: `
    {138.EX.${ClientRid}} AND
    {136.EX.${currentYear}} 
  `,
  clist: '136.138.139.142.149.1.5.49.50.51.52.53.149.54.110.55.111.56.57.112.58.59.60.113.61.62.63.64.65.66.114.67.115.68.69.70.116.71.117.72.118.73.74.75.76.77.78.79.80.81.82.83.84.85.86.87.88.89.90.91.92.93.94.95.96.97.98.99.100.101.102.103.104.105.106.107.108.109.150.151'
};

try {
  const xml = await $.get(clientData, apiCallClientData);
  const recordsForClient = $('record', xml).toArray();

console.log(xml) 
//console.log('recordsForClient', recordsForClient)

     // Update dataStr with the records from the current API call
  recordsForClient.forEach((record) => {
    // Create a new record element
    const newRecord = document.createElement('record');

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
  console.error('Error fetching data:', error);
  // Handle the error as needed
  return dataStr; // Return the accumulated data so far even in case of an error
}
};





