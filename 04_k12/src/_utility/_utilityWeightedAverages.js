const getWeightedAverageOfArray = (data, name, year) => {
  switch (name) {
    case "studentFacilityRatio":
      return studentFacilityRatio_weightedAverage(data, name, year);
    case "expendableReserves_inDays":
      return expendableReservesInDays_weightedAverage(data, name, year);
    case "expendableReserves_Percent":
      return expendableReservesPercent_weightedAverage(data, name, year);
    case "cashAvailableDeferred":
      return cashAvailableDeferred_weightedAverage(data, name, year);
    case "liquidityRatio":
      return liquidityRatio_weightedAverage(data, name, year);
    case "netCashUsedOperating_overUnderBench":
      return netCashUsedOperating_overUnderBenchmark_weightedAverage(data, name, year);
    case "propertyEquipmentPerStudent":
      return propertyEquipmentPerStudent_weightedAverage(data, name, year);
    case "netTuitionARasPercentCurrentAssets":
      return netTuitionARasPercentCurrentAssets_weightedAverage(data, name, year);
    case "receivableWriteOffsAsPercentNetTuitionAndFees":
      return receivableWriteOffsAsPercentNetTuitionAndFees_weightedAverage(data, name, year);
    case "debtToPropertyAndEquipment":
      return debtToPropertyAndEquipment_weightedAverage(data, name, year);
    case "currentRatio":
      return currentRatio_weightedAverage(data, name, year);
    case "currentLiabilitiesToAvailableNetAssets":
      return currentLiabilitiesToAvailableNetAssets_weightedAverage(data, name, year);
    case "debtPerStudent":
      return debtPerStudents_weightedAverage(data, name, year);
    case "debtCoverage":
      return debtCoverage_weightedAverage(data, name, year);
    case "netIncomeRatio":
      return netIncomeRatio_weightedAverage(data, name, year);
    case "netIncomeRatioExcludingDepreciation":
      return netIncomeRatioExcludingDepreciation_weightedAverage(data, name, year);
    case "financialAssistanceAsPercentTuitionAndFees":
      return financialAssistanceAsPercentTuitionAndFees_weightedAverage(data, name, year);
    case "tuitionAndFeesAsPercentTotalIncome":
      return tuitionAndFeesAsPercentTotalIncome_weightedAverage(data, name, year);
    case "contributionsAsAPercentOfTotalIncome":
      return contributionsAsAPercentOfTotalIncome_weightedAverage(data, name, year);
    case "grossTuition":
      return grossTuition_weightedAverage(data, name, year);
    case "totalFinancialAssistance":
      return totalFinancialAssistance_weightedAverage(data, name, year);
    case "netTuition":
      return netTuition_weightedAverage(data, name, year);
    case "feesPercentOfNetTuition":
      return feesPercentOfNetTuition_weightedAverage(data, name, year);
    case "salariesBenefitsTeachersAsPercentNetTuition_Salaries":
      return salariesBenefitsTeachersAsPercentNetTuition_Salaries_weightedAverage(data, name, year);
    case "salariesBenefitsTeachersAsPercentNetTuition_Benefits":
      return salariesBenefitsTeachersAsPercentNetTuition_Benefits_weightedAverage(data, name, year);
    case "salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits":
      return salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_weightedAverage(data, name, year);
    case "salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries":
      return salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries_weightedAverage(data, name, year);
    case "salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits":
      return salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits_weightedAverage(data, name, year);
    case "salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits":
      return salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits_weightedAverage(data, name, year);
    case "benefitsPercentSalariesTeachers":
      return benefitsPercentSalariesTeachers_weightedAverage(data, name, year);
    case "personnelMandatoryDebtService_SalariesAndBenefits_Teachers":
      return personnelMandatoryDebtService_SalariesAndBenefits_Teachers_weightedAverage(data, name, year);
    case "personnelMandatoryDebtService_SalariesAndBenefits_Administration":
      return personnelMandatoryDebtService_SalariesAndBenefits_Administration_weightedAverage(data, name, year);
    case "personnelMandatoryDebtService_SalariesAndBenefits_Employees":
      return personnelMandatoryDebtService_SalariesAndBenefits_Employees_weightedAverage(data, name, year);
    case "personnelMandatoryDebtService_Mandatory":
      return personnelMandatoryDebtService_Mandatory_weightedAverage(data, name, year);
    case "personnelMandatoryDebtService_Personnel":
      return personnelMandatoryDebtService_Personnel_weightedAverage(data, name, year);
    case "percentFundRaisingExpensesExceeding":
      return percentFundRaisingExpensesExceeding_weightedAverage(data, name, year);
    case "fundsExpensesPerStudent_FundsRaised":
      return fundsExpensesPerStudent_FundsRaised_weightedAverage(data, name, year);
    case "fundsExpensesPerStudent_CashExpensesExcludingDepreciation":
      return fundsExpensesPerStudent_CashExpensesExcludingDepreciation_weightedAverage(data, name, year);
    case "fundsExpensesPerStudent_netTuition":
      return fundsExpensesPerStudent_netTuition_weightedAverage(data, name, year);
    case "fundsExpensesPerStudent_cashExpensesExcessNetTuition":
      return fundsExpensesPerStudent_cashExpensesExcessNetTuition_weightedAverage(data, name, year);
    case "fundsExpensesPerStudent_FundsRaisedOverUnder":
      return fundsExpensesPerStudent_FundsRaisedOverUnder_weightedAverage(data, name, year);
    case "daysCashOnHand":
      return daysCashOnHand_weightedAverage(data, name, year);
    case "debtToNetAssets":
      return debtToNetAssets_weightedAverage(data, name, year);
    default:
      return;
  }
};

const debtToNetAssets_weightedAverage = (data, name, year) => {
  // [03-11 Total Debt] / [03-12 Total Unrestricted Net Assets] + [03-14 Temporarily Restricted Net Assets]
  const key = year != null ? `${name}_${year}` : name;
  let numTotalDebt = getSumOfArray(data.totalDebt?.[key] || []);
  let numTotalUnrestrictedNetAssets = getSumOfArray(
    data.totalUnrestrictedNetAssets?.[key] || []
  );
  let numTemporarilyRestrictedNetAssets = getSumOfArray(
    data.temporarilyRestrictedNetAssets?.[key] || []
  );
  const denominator = numTotalUnrestrictedNetAssets + numTemporarilyRestrictedNetAssets;
  if (!denominator) return 0;
  return numTotalDebt / denominator;
};

const daysCashOnHand_weightedAverage = (data, name, year) => {
  // [03-02 Total Cash]/([04-08 Total Expenses]/365)
  const key = year != null ? `${name}_${year}` : name;
  const totalCash = (data.totalCash && data.totalCash[key]) || [];
  const totalExpenses = (data.totalExpenses && data.totalExpenses[key]) || [];
  const numTotalCash = getSumOfArray(totalCash);
  const numTotalExpenses = getSumOfArray(totalExpenses);
  const denominator = numTotalExpenses / 365;
  if (!denominator) return 0;
  return numTotalCash / denominator;
};

const fundsExpensesPerStudent_FundsRaisedOverUnder_weightedAverage = (
  data,
  name,
  year
) => {
  // ( [39] 04-06 Total Contributions / [6] 01-01 Students-average enrollment ) + ( ( ([34] 04-01 Gross Tuition Revenues Excluding Fees - [36] 04-03 Discounts - [37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment ) - ( ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense ) / [6] 01-01 Students-average enrollment ) )

  const key = year != null ? `${name}_${year}` : name;
  let numTotalContributions = getSumOfArray(data.totalContributions[key]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  return (
    numTotalContributions / numStudentAverageEnrollment +
    ((numGrossTuitionRevenuesExcludingFees -
      numFinancialAidScholarships) /
      numStudentAverageEnrollment -
      (numTotalExpenses - numTotalDepreciationExpense) /
        numStudentAverageEnrollment)
  );
};

const fundsExpensesPerStudent_cashExpensesExcessNetTuition_weightedAverage = (
  data,
  name,
  year
) => {
  // ( ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment ) - ( ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense ) / [6] 01-01 Students-average enrollment )

  const key = year != null ? `${name}_${year}` : name;
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );
  let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  return (
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships) /
      numStudentAverageEnrollment -
    (numTotalExpenses - numTotalDepreciationExpense) /
      numStudentAverageEnrollment
  );
};

const fundsExpensesPerStudent_netTuition_weightedAverage = (data, name, year) => {
  // ([34] 04-01 Gross Tuition Revenues Excluding Fees -[37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return (
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships) /
    numStudentAverageEnrollment
  );
};

const fundsExpensesPerStudent_CashExpensesExcludingDepreciation_weightedAverage =
  (data, name, year) => {
    // (4-08 Total Expenses - [42] 04-09 Total Depreciation Expense ) / [6] 01-01 Students-average enrollment

    const key = year != null ? `${name}_${year}` : name;
    let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
    let numTotalDepreciationExpense = getSumOfArray(
      data.totalDepreciationExpense[key]
    );
    let numStudentAverageEnrollment = getSumOfArray(
      data.studentAverageEnrollment_Main[key]
    );

    return (
      (numTotalExpenses - numTotalDepreciationExpense) /
      numStudentAverageEnrollment
    );
  };

const fundsExpensesPerStudent_FundsRaised_weightedAverage = (data, name, year) => {
  // [39] 04-06 Total Contributions / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numTotalContributions = getSumOfArray(data.totalContributions[key]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return numTotalContributions / numStudentAverageEnrollment;
};

const percentFundRaisingExpensesExceeding_weightedAverage = (data, name, year) => {
  // [43] 04-10 Total Fundraising Expenses / ([39] 04-06 Total Contributions + [46] 04-13 Fundraising Income)

  const key = year != null ? `${name}_${year}` : name;
  let numTotalFundraising = getSumOfArray(data.totalFundraising[key]);
  let numTotalContributions = getSumOfArray(data.totalContributions[key]);
  let numFundraisingIncome = getSumOfArray(data.fundraisingIncome[key]);

  return numTotalFundraising / (numTotalContributions + numFundraisingIncome);
};

const personnelMandatoryDebtService_Personnel_weightedAverage = (
  data,
  name,
  year
) => {
  // ( [15]  [16] 02-04 Total maintenance costs + [18] 02-06 Current maturities of LT Debt + [44] 04-11 Current Year Interest Expense +  [48] 05-02 Capitalized Interest )  / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

  const key = year != null ? `${name}_${year}` : name;
  let numTotalPersonnelCostsSalariesBenefits = getSumOfArray(
    data.totalPersonnelCostsSalariesBenefits[key]
  );
  let numCurrentMaturingDebt = getSumOfArray(data.currentMaturingDebt[key]);
  let numCurrentYearInterestExpense = getSumOfArray(
    data.currentYearInterestExpense[key]
  );
  let numCapitalizedInterest = getSumOfArray(data.capitalizedInterest[key]);
  let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  return (
    (numTotalPersonnelCostsSalariesBenefits +
      numCurrentMaturingDebt +
      numCurrentYearInterestExpense +
      numCapitalizedInterest) /
    (numTotalExpenses - numTotalDepreciationExpense)
  );
};

const personnelMandatoryDebtService_Mandatory_weightedAverage = (
  data,
  name,
  year
) => {
  // ( [18] 02-06 Current maturities of LT Debt + [44] 04-11 Current Year Interest Expense +  [48] 05-02 Capitalized Interest )  / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

  const key = year != null ? `${name}_${year}` : name;
  let numCurrentMaturingDebt = getSumOfArray(data.currentMaturingDebt[key]);
  let numCurrentYearInterestExpense = getSumOfArray(
    data.currentYearInterestExpense[key]
  );
  let numCapitalizedInterest = getSumOfArray(data.capitalizedInterest[key]);
  let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  return (
    (numCurrentMaturingDebt +
      numCurrentYearInterestExpense +
      numCapitalizedInterest) /
    (numTotalExpenses - numTotalDepreciationExpense)
  );
};

const personnelMandatoryDebtService_SalariesAndBenefits_Employees_weightedAverage =
  (data, name, year) => {
    // ([02-03 Total personnel costs salaries & benefits of all school employees] /
    //  ([04-08 Total Expenses] - [04-09 Total Depreciation Expense]))

    const key = year != null ? `${name}_${year}` : name;
    const numTotalPersonnelCostsSalariesBenefits = getSumOfArray(
      (data.totalPersonnelCostsSalariesBenefits &&
        data.totalPersonnelCostsSalariesBenefits[key]) ||
        []
    );
    const numTotalExpenses = getSumOfArray(
      (data.totalExpenses && data.totalExpenses[key]) || []
    );
    const numTotalDepreciationExpense = getSumOfArray(
      (data.totalDepreciationExpense &&
        data.totalDepreciationExpense[key]) ||
        []
    );

    const denominator = numTotalExpenses - numTotalDepreciationExpense;
    if (!denominator) return 0;

    return numTotalPersonnelCostsSalariesBenefits / denominator;
  };

const personnelMandatoryDebtService_SalariesAndBenefits_Administration_weightedAverage =
  (data, name, year) => {
    const key = year != null ? `${name}_${year}` : name;
    let numTotalPersonnelCostsSalariesBenefits = getSumOfArray(
      data.totalPersonnelCostsSalariesBenefits[key]
    );
    let numTotalTeacherSalaries = getSumOfArray(
      data.totalTeacherSalaries[key]
    );
    let numTotalTeacherBenefits = getSumOfArray(
      data.totalTeacherBenefits[key]
    );
    let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
    let numTotalDepreciationExpense = getSumOfArray(
      data.totalDepreciationExpense[key]
    );

    return (
      (numTotalPersonnelCostsSalariesBenefits -
        numTotalTeacherSalaries -
        numTotalTeacherBenefits) /
      (numTotalExpenses - numTotalDepreciationExpense)
    );
  };

const personnelMandatoryDebtService_SalariesAndBenefits_Teachers_weightedAverage =
  (data, name, year) => {
    // ( [13] 02-01 Total Teacher Salaries + [14] 02-02 Total Teacher Benefits  ) / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

    const key = year != null ? `${name}_${year}` : name;
    let numTotalTeacherSalaries = getSumOfArray(
      data.totalTeacherSalaries[key]
    );
    let numTotalTeacherBenefits = getSumOfArray(
      data.totalTeacherBenefits[key]
    );
    let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
    let numTotalDepreciationExpense = getSumOfArray(
      data.totalDepreciationExpense[key]
    );

    return (
      (numTotalTeacherSalaries + numTotalTeacherBenefits) /
      (numTotalExpenses - numTotalDepreciationExpense)
    );
  };

const benefitsPercentSalariesTeachers_weightedAverage = (data, name, year) => {
  // [14] 02-02 Total Teacher Benefits  / [13] 02-01 Total Teacher Salaries

  const key = year != null ? `${name}_${year}` : name;
  let numTotalTeacherBenefits = getSumOfArray(data.totalTeacherBenefits[key]);
  let numTotalTeacherSalaries = getSumOfArray(data.totalTeacherSalaries[key]);

  return numTotalTeacherBenefits / numTotalTeacherSalaries;
};

const salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits_weightedAverage =
  (data, name, year) => {
    // ( [02-01 Total Teacher Salaries] + [02-02 Total Teacher Benefits ]  ) / [01-01 Students-average enrollment]

    const key = year != null ? `${name}_${year}` : name;
    let numTotalTeacherSalaries = getSumOfArray(
      data.totalTeacherSalaries[key]
    );
    let numTotalTeacherBenefits = getSumOfArray(
      data.totalTeacherBenefits[key]
    );
    let numStudentAverageEnrollment = getSumOfArray(
      data.studentAverageEnrollment_Main[key]
    );

    return (
      (numTotalTeacherSalaries + numTotalTeacherBenefits) /
      numStudentAverageEnrollment
    );
  };

const salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits_weightedAverage = (
  data,
  name,
  year
) => {
  // [14] 02-02 Total Teacher Benefits / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numTotalTeacherBenefits = getSumOfArray(data.totalTeacherBenefits[key]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return numTotalTeacherBenefits / numStudentAverageEnrollment;
};

const salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries_weightedAverage = (
  data,
  name,
  year
) => {
  // [13] 02-01 Total Teacher Salaries / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numTotalTeacherSalaries = getSumOfArray(data.totalTeacherSalaries[key]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return numTotalTeacherSalaries / numStudentAverageEnrollment;
};

const salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_weightedAverage =
  (data, name, year) => {
    // ( [02-01 Total Teacher Salaries] + [02-02 Total Teacher Benefits ] ) / ([04-01 Gross Tuition Revenues Excluding Fees] - [04-04 Financial Aid / Scholarships])

    const key = year != null ? `${name}_${year}` : name;
    let numTotalTeacherSalaries = getSumOfArray(
      data.totalTeacherSalaries[key]
    );
    let numTotalTeacherBenefits = getSumOfArray(
      data.totalTeacherBenefits[key]
    );
    let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
      data.grossTuitionRevenuesExcludingFees[key]
    );
    let numFinancialAidScholarships = getSumOfArray(
      data.financialAidScholarships[key]
    );
    const denominator =
      numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships;
    const numerator = numTotalTeacherSalaries + numTotalTeacherBenefits;

    return denominator === 0 ? 0 : numerator / denominator;
  };

const salariesBenefitsTeachersAsPercentNetTuition_Benefits_weightedAverage = (
  data,
  name,
  year
) => {
  // [02-02 Total Teacher Benefits ]  / ([04-01 Gross Tuition Revenues Excluding Fees] - [04-04 Financial Aid / Scholarships])

  const key = year != null ? `${name}_${year}` : name;
  let numTotalTeacherBenefits = getSumOfArray(data.totalTeacherBenefits[key]);
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  const denominator =
    numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships;

  return denominator === 0 ? 0 : numTotalTeacherBenefits / denominator;
};

const salariesBenefitsTeachersAsPercentNetTuition_Salaries_weightedAverage = (
  data,
  name,
  year
) => {
  // [02-01 Total Teacher Salaries] / ([04-01 Gross Tuition Revenues Excluding Fees] - [04-04 Financial Aid / Scholarships])

  const key = year != null ? `${name}_${year}` : name;
  let numTotalTeacherSalaries = getSumOfArray(data.totalTeacherSalaries[key]);
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  const denominator =
    numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships;

  return denominator === 0 ? 0 : numTotalTeacherSalaries / denominator;
};

const feesPercentOfNetTuition_weightedAverage = (data, name, year) => {
  // [35] 04-02 Fees / ([34] 04-01 Gross Tuition Revenues Excluding Fees -  [37] 04-04 Financial Aid / Scholarships)

  const key = year != null ? `${name}_${year}` : name;
  let numFees = getSumOfArray(data.fees[key]);
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );

  return (
    numFees /
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships)
  );
};

const netTuition_weightedAverage = (data, name, year) => {
  // ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return (
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships) /
    numStudentAverageEnrollment
  );
};

const totalFinancialAssistance_weightedAverage = (data, name, year) => {
  // [37] 04-04 Financial Aid / Scholarships / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return numFinancialAidScholarships / numStudentAverageEnrollment;
};


const grossTuition_weightedAverage = (data, name, year) => {
  // [34] 04-01 Gross Tuition Revenues Excluding Fees / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return numGrossTuitionRevenuesExcludingFees / numStudentAverageEnrollment;
};

const contributionsAsAPercentOfTotalIncome_weightedAverage = (data, name, year) => {
  // [39] 04-06 Total Contributions / [38] 04-05 Total Support and Revenue

  const key = year != null ? `${name}_${year}` : name;
  let numTotalContributions = getSumOfArray(data.totalContributions[key]);
  let numTotalSupportRevenue = getSumOfArray(data.totalSupportRevenue[key]);

  return numTotalContributions / numTotalSupportRevenue;
};

const tuitionAndFeesAsPercentTotalIncome_weightedAverage = (data, name, year) => {
  // [34] 04-01 Gross Tuition Revenues Excluding Fees / [38] 04-05 Total Support and Revenue

  const key = year != null ? `${name}_${year}` : name;
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numtotalSupportRevenue = getSumOfArray(data.totalSupportRevenue[key]);

  return numGrossTuitionRevenuesExcludingFees / numtotalSupportRevenue;
};

const financialAssistanceAsPercentTuitionAndFees_weightedAverage = (
  data,
  name,
  year
) => {
  // [37] 04-04 Financial Aid / Scholarships / [34] 04-01 Gross Tuition Revenues Excluding Fees

  const key = year != null ? `${name}_${year}` : name;
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );

  return numFinancialAidScholarships / numGrossTuitionRevenuesExcludingFees;
};

const netIncomeRatioExcludingDepreciation_weightedAverage = (data, name, year) => {
  // ( [45] 04-12 Change in Unrestricted Net Assets + [42] 04-09 Total Depreciation Expense) / [40] 04-07 Unrestricted Support, Revenues and Reclassifications for operating purposes

  const key = year != null ? `${name}_${year}` : name;
  let numChangeInUnrestrictedNetAssets = getSumOfArray(
    data.changeInUnrestrictedNetAssets[key]
  );
  let NumUnrestrictedSupportRevenuesReclassification = getSumOfArray(
    data.unrestrictedSupportRevenuesReclassification[key]
  );
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  return (
    (numChangeInUnrestrictedNetAssets + numTotalDepreciationExpense) /
    NumUnrestrictedSupportRevenuesReclassification
  );
};

const netIncomeRatio_weightedAverage = (data, name, year) => {
  // [45] 04-12 Change in Unrestricted Net Assets / [40] 04-07 Unrestricted Support, Revenues and Reclassifications for operating purposes

  const key = year != null ? `${name}_${year}` : name;
  let numChangeInUnrestrictedNetAssets = getSumOfArray(
    data.changeInUnrestrictedNetAssets[key]
  );
  let NumUnrestrictedSupportRevenuesReclassification = getSumOfArray(
    data.unrestrictedSupportRevenuesReclassification[key]
  );

  return (
    numChangeInUnrestrictedNetAssets /
    NumUnrestrictedSupportRevenuesReclassification
  );
};

const debtCoverage_weightedAverage = (data, name, year) => {
  // ( [45] 04-12 Change in Unrestricted Net Assets + [44] 04-11 Current Year Interest Expense + [42] 04-09 Total Depreciation Expense + [48] 05-02 Capitalized Interest ) / ([18] 02-06 Current maturities of LT Debt + [44] 04-11 Current Year Interest Expense + [48] 05-02 Capitalized Interest)

  const key = year != null ? `${name}_${year}` : name;
  let numChangeInUnrestrictedNetAssets = getSumOfArray(
    data.changeInUnrestrictedNetAssets?.[key] || []
  );
  let numCurrentYearInterestExpense = getSumOfArray(
    data.currentYearInterestExpense?.[key] || []
  );
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense?.[key] || []
  );
  let numCapitalizedInterest = getSumOfArray(
    data.capitalizedInterest?.[key] || []
  );
  const currentMaturitiesArr =
    data.currentMaturingDebt?.[key] ?? data.currentMaturitiesOfLTDebt?.[key];
  let numCurrentMaturitiesOfLTDebt = getSumOfArray(currentMaturitiesArr || []);

  return (
    (numChangeInUnrestrictedNetAssets +
      numCurrentYearInterestExpense +
      numTotalDepreciationExpense +
      numCapitalizedInterest) /
    (numCurrentMaturitiesOfLTDebt +
      numCurrentYearInterestExpense +
      numCapitalizedInterest)
  );
};

const debtPerStudents_weightedAverage = (data, name, year) => {
  // [30] 03-11 Total Debt / [6] 01-01 Students-average enrollment

  const key = year != null ? `${name}_${year}` : name;
  let numTotalDebt = getSumOfArray(data.totalDebt[key]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return numTotalDebt / numStudentAverageEnrollment;
};

const currentLiabilitiesToAvailableNetAssets_weightedAverage = (data, name, year) => {
  // [28] 03-09 Current Liabilities / ([31] 03-12 Total Unrestricted Net Assets - (IF [27] 03-08 Land, Buildings and Equipment, net - [30] 03-11 Total Debt <0,0, [27] 03-08 Land, Buildings and Equipment, net - [30] 03-11 Total Debt) - [32] 03-13 BOD Designated for Operations )
  // Current Liabilities / (03-12 Total Unrestricted Net Assets - 03-08 Land, Buildings and Equipment, net - 03-11 Total Debt - BOD Designated for Operations)

  const key = year != null ? `${name}_${year}` : name;
  let numCurrentLiabilities = getSumOfArray(data.currentLiabilities[key]);
  let numTotalUnrestrictedNetAssets = getSumOfArray(
    data.totalUnrestrictedNetAssets[key]
  );
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[key]
  );
  let numTotalDebt = getSumOfArray(data.totalDebt[key]);
  let numBODDesignatedForOperations = getSumOfArray(
    data.bodDesignatedForOperations[key]
  );

  let numIf =
    numLandBuildingsEquipmentNet - numTotalDebt < 0
      ? 0
      : numLandBuildingsEquipmentNet - numTotalDebt;

  return (
    numCurrentLiabilities /
    (numTotalUnrestrictedNetAssets - numIf - numBODDesignatedForOperations)
  );
};

const currentRatio_weightedAverage = (data, name, year) => {
  // [20] 03-01 Current Assets / [28] 03-09 Current Liabilities

  const key = year != null ? `${name}_${year}` : name;
  let numCurrentAssets = getSumOfArray(data.currentAssets[key]);
  let numCurrentLiabilities = getSumOfArray(data.currentLiabilities[key]);

  return numCurrentAssets / numCurrentLiabilities;
};

const debtToPropertyAndEquipment_weightedAverage = (data, name, year) => {
  // [30] 03-11 Total Debt / [27] 03-08 Land, Buildings and Equipment, net

  const key = year != null ? `${name}_${year}` : name;
  let numTotalDebt = getSumOfArray(data.totalDebt[key]);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[key]
  );

  return numTotalDebt / numLandBuildingsEquipmentNet;
};

const receivableWriteOffsAsPercentNetTuitionAndFees_weightedAverage = (
  data,
  name,
  year
) => {
  // [25] 03-06 Student Accounts Receivable Written-Off / ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships )

  const key = year != null ? `${name}_${year}` : name;
  const writeOffs =
    data.studentAccountsReceivableWriteOffs?.[key] ??
    data.studentAccountsReceivableWrittenOff?.[key];
  let numStudentAccountsReceivableWrittenOff = getSumOfArray(writeOffs);
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[key]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[key]
  );

  // Display the values in a table labeled 'Receivable Write-Offs as Percent Net Tuition And Fees (weighted avg)'
  // console.table([
  //   {
  //     'Student Accounts Receivable Written-Off (total)': numStudentAccountsReceivableWrittenOff,
  //     'Gross Tuition Revenues Excluding Fees (total)': numGrossTuitionRevenuesExcludingFees,
  //     'Financial Aid / Scholarships (total)': numFinancialAidScholarships
  //   }
  // ], [
  //   'Student Accounts Receivable Written-Off (total)',
  //   'Gross Tuition Revenues Excluding Fees (total)',
  //   'Financial Aid / Scholarships (total)'
  // ]);
  // console.log('Table: Receivable Write-Offs as Percent Net Tuition And Fees (weighted avg)');

  return (
    numStudentAccountsReceivableWrittenOff /
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships)
  );
};

const netTuitionARasPercentCurrentAssets_weightedAverage = (data, name, year) => {
  // [24] 03-05 Student Accounts Receivable / [20] 03-01 Current Assets
  const key = year != null ? `${name}_${year}` : name;
  const ar =
    data.studentsAccountsReceivable?.[key] ??
    data.studentAccountsReceivable?.[key];
  let numStudentAccountsReceivable = getSumOfArray(ar);
  let numCurrentAssets = getSumOfArray(data.currentAssets[key]);

  return numStudentAccountsReceivable / numCurrentAssets;
};

const propertyEquipmentPerStudent_weightedAverage = (data, name, year) => {
  const key = year != null ? `${name}_${year}` : name;
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[key]
  );
  let numLandAndLandImprovements = getSumOfArray(
    data.landAndLandImprovements[key]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[key]
  );

  return (
    (numLandBuildingsEquipmentNet - numLandAndLandImprovements) /
    numStudentAverageEnrollment
  );
};

const netCashUsedOperating_overUnderBenchmark_weightedAverage = (
  data,
  name,
  year
) => {
  const key = year != null ? `${name}_${year}` : name;
  let numCashFlowsOperatingActivities = getSumOfArray(
    data.cashFlowsOperatingActivities[key]
  );
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  return (
    numNetnumCashFlowsOperatingActivitiesCashUsedOperating -
    numTotalDepreciationExpense
  );
};

const studentFacilityRatio_weightedAverage = (data, name, year) => {
  const key = year != null ? `${name}_${year}` : name;
  let numFullTime = getSumOfArray(data.fullTimeTeachers_Peer[key]);
  let numPartTime = getSumOfArray(data.partTimeTeachers_Peer[key]);
  let numStudents = getSumOfArray(data.studentAverageEnrollment_Main[key]);

  return (numFullTime + 0.5 * numPartTime) / numStudents;
};

const expendableReservesInDays_weightedAverage = (data, name, year) => {
  const key = year != null ? `${name}_${year}` : name;
  let numTotalUnrestricted = getSumOfArray(data.unrestrictedNetAssets[key]);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[key]
  );
  let numTotalDebt = getSumOfArray(data.totalDebt[key]);
  let numTotalExpenses = getSumOfArray(data.totalExpenses[key]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  let numIf =
    numLandBuildingsEquipmentNet - numTotalDebt < 0
      ? 0
      : numLandBuildingsEquipmentNet - numTotalDebt;

  return (
    ((numTotalUnrestricted - numIf) /
      (numTotalExpenses - numTotalDepreciationExpense)) *
    365
  );
};

const expendableReservesPercent_weightedAverage = (data, name, year) => {
  const key = year != null ? `${name}_${year}` : name;
  let numTotalUnrestricted = getSumOfArray(data.unrestrictedNetAssets[key]);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[key]
  );
  let numTotalDebt = getSumOfArray(data.totalDebt[key]);
  let numTotalExpense = getSumOfArray(data.totalExpenses[key]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[key]
  );

  let numIf =
    numLandBuildingsEquipmentNet - numTotalDebt < 0
      ? 0
      : numLandBuildingsEquipmentNet - numTotalDebt;

  return (
    (numTotalUnrestricted - numIf) /
    (numTotalExpense - numTotalDepreciationExpense)
  );
};

const cashAvailableDeferred_weightedAverage = (data, name, year) => {
  // ( ([21] 03-02 Total Cash  + [22] 03-03 Non-Endowment Investments - [29] 03-10 Deferred Revenue ) / [29] 03-10 Deferred Revenue

  const key = year != null ? `${name}_${year}` : name;
  let numTotalCash = getSumOfArray(data.totalCash[key]);
  let numNonEndowmentInvestments = getSumOfArray(
    data.nonEndowmentInvestments[key]
  );
  let numDeferredRevenue = getSumOfArray(data.deferredRevenue[key]);

  return (
    (numTotalCash + numNonEndowmentInvestments - numDeferredRevenue) /
    numDeferredRevenue
  );
};

const liquidityRatio_weightedAverage = (data, name, year) => {
  const key = year != null ? `${name}_${year}` : name;
  let numTotalCash = getSumOfArray(data.totalCash[key]);
  let numNonEndowmentInvestments = getSumOfArray(
    data.nonEndowmentInvestments[key]
  );
  let numCurrentLiabilities = getSumOfArray(data.currentLiabilities[key]);
  let numDeferredRevenue = getSumOfArray(data.deferredRevenue[key]);

  const denominator = numCurrentLiabilities - numDeferredRevenue;
  if (!denominator) return 0;
  return (numTotalCash + numNonEndowmentInvestments) / denominator;
};
