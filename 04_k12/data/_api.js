const fetchClientData = async () => {
  return fetch("./data/clientData.xml")
    .then((response) => response.text())
    .then((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      return xmlDoc.querySelectorAll("record");
    })
    .catch((error) => {
      console.error("Error fetching XML file:", error);
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
      console.error("Error fetching XML file:", error);
      return []; // Return an empty array in case of error
    });
};

document.addEventListener("DOMContentLoaded", async () => {
  const recordsClient = await fetchClientData();
  const recordsPeer = await fetchPeerData();

  document.getElementById('firmName').textContent = recordsClient[0].children[2].innerHTML

  findUniqueYears(recordsClient);

  // addUniqueSchoolChurchToOptionsSelectSchoolChurchDropdown(schoolChurch_Array);

  runApiMain(recordsPeer, recordsClient);
});

const findUniqueYears = (data) => {
  data.forEach((item) => {
    const yearElement = item.querySelector("fiscal_ye_date_formatted_year");
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
        "landBuildingEquipmentNet",
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
        "landBuildingEquipmentNet",
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

      processEnrollmentData(selectedYears, recordsPeer, recordsClient);
      processCashData(selectedYears, recordsPeer, recordsClient);
      processAssetData(selectedYears, recordsPeer, recordsClient);
      processDebtData(selectedYears, recordsPeer, recordsClient);
      processIncomeData(selectedYears, recordsPeer, recordsClient);
      processExpenseData(selectedYears, recordsPeer, recordsClient);

      displayEnrollmentComponent();
      displayCashComponent();
      displayAssetComponent();
      displayDebtComponent();
      displayIncomeComponent();
      displayExpenseComponent();
      displayReportComponent();
    } catch (err) {
      console.error(err);
    }
  });
};
