const getWeightedAverageOfArray = (data, name) => {
  // console.log(data, name);
  switch (name) {
    case 'studentsFacilityRatio':
      return studentsFacilityRatio_weightedAverage(data, name);
    case 'expendableReserves_inDays':
      return expendableReservesInDays_weightedAverage(data, name);
    case 'expendableReserves_Percent':
      return expendableReservesPercent_weightedAverage(data, name);
    case 'cashAvailableDeferred':
      return cashAvailableDeferred_weightedAverage(data, name);
    case 'liquidityRatio':
      return liquidityRatio_weightedAverage(data, name);
    case 'netCashUsedOperating_overUnderBench':
      return netCashUsedOperating_overUnderBenchmark_weightedAverage(data);
    case 'propertyEquipmentPerStudent':
      return propertyEquipmentPerStudent_weightedAverage(data, name);
    case 'netTuitionARasPercentCurrentAssets':
      return netTuitionARasPercentCurrentAssets_weightedAverage(data, name);
    case 'receivableWriteOffsAsPercentNetTuitionAndFees':
      return receivableWriteOffsAsPercentNetTuitionAndFees_weightedAverage(
        data,
        name
      );
    case 'debtToPropertyAndEquipment':
      return debtToPropertyAndEquipment_weightedAverage(data, name);
    case 'currentRatio':
      return currentRatio_weightedAverage(data, name);
    case 'currentLiabilitiesToAvailableNetAssets':
      return currentLiabilitiesToAvailableNetAssets_weightedAverage(data, name);
    case 'debtPerStudents':
      return debtPerStudents_weightedAverage(data, name);
    case 'debtCoverage':
      return debtCoverage_weightedAverage(data, name);
    case 'netIncomeRatio':
      return netIncomeRatio_weightedAverage(data, name);
    case 'netIncomeRatioExcludingDepreciation':
      return netIncomeRatioExcludingDepreciation_weightedAverage(data, name);
    case 'financialAssistanceAsPercentTuitionAndFees':
      return financialAssistanceAsPercentTuitionAndFees_weightedAverage(
        data,
        name
      );
    case 'tuitionAndFeesAsPercentTotalIncome':
      return tuitionAndFeesAsPercentTotalIncome_weightedAverage(data, name);
    case 'contributionsAsAPercentOfTotalIncome':
      return contributionsAsAPercentOfTotalIncome_weightedAverage(data, name);
    case 'grossTuition':
      return grossTuition_weightedAverage(data, name);
    case 'financialAssistanceDiscountBased':
      return financialAssistanceDiscountBased_weightedAverage(data, name);
    case 'scholarshipAwarded':
      return scholarshipAwarded_weightedAverage(data, name);
    case 'totalFinancialAssistance':
      return totalFinancialAssistance_weightedAverage(data, name);
    case 'netTuition':
      return netTuition_weightedAverage(data, name);
    case 'feesPercentOfNetTuition':
      return feesPercentOfNetTuition_weightedAverage(data, name);
    case 'salariesBenefitsTeachersAsPercentNetTuition_Salaries':
      return salariesBenefitsTeachersAsPercentNetTuition_Salaries_weightedAverage(
        data,
        name
      );
    case 'salariesBenefitsTeachersAsPercentNetTuition_Benefits':
      return salariesBenefitsTeachersAsPercentNetTuition_Benefits_weightedAverage(
        data,
        name
      );
    case 'salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits':
      return salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_weightedAverage(
        data,
        name
      );
    case 'salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries':
      return salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries_weightedAverage(
        data,
        name
      );
    case 'salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits':
      return salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits_weightedAverage(
        data,
        name
      );
    case 'salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits':
        return salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits_weightedAverage(
            data,
            name
        );
    case 'benefitsPercentSalariesTeachers':
        return benefitsPercentSalariesTeachers_weightedAverage(data, name);
    case 'personnelMandatoryDebtService_SalariesAndBenefits_Teachers':
        return personnelMandatoryDebtService_SalariesAndBenefits_Teachers_weightedAverage(data, name);
    case 'personnelMandatoryDebtService_SalariesAndBenefits_Administration':
        return personnelMandatoryDebtService_SalariesAndBenefits_Administration_weightedAverage(data, name);
    case 'personnelMandatoryDebtService_SalariesAndBenefits_Employees':
        return personnelMandatoryDebtService_SalariesAndBenefits_Employees_weightedAverage(data, name);
    case 'personnelMandatoryDebtService_Mandatory':
        return personnelMandatoryDebtService_Mandatory_weightedAverage(data, name);
    case 'personnelMandatoryDebtService_Personnel':
        return personnelMandatoryDebtService_Personnel_weightedAverage(data, name);
    case 'percentFundRaisingExpensesExceeding':
        return percentFundRaisingExpensesExceeding_weightedAverage(data, name);
    case 'fundsExpensesPerStudent_FundsRaised':
        return fundsExpensesPerStudent_FundsRaised_weightedAverage(data, name);
    case 'fundsExpensesPerStudent_CashExpensesExcludingDepreciation':
        return fundsExpensesPerStudent_CashExpensesExcludingDepreciation_weightedAverage(data, name);
    case 'fundsExpensesPerStudent_netTuition':
        return fundsExpensesPerStudent_netTuition_weightedAverage(data, name);
    case 'fundsExpensesPerStudent_cashExpensesExcessNetTuition': 
        return fundsExpensesPerStudent_cashExpensesExcessNetTuition_weightedAverage(data, name);
    case 'fundsExpensesPerStudent_FundsRaisedOverUnder':
        return fundsExpensesPerStudent_FundsRaisedOverUnder_weightedAverage(data, name);
    default:
      return;
  }
};



const fundsExpensesPerStudent_FundsRaisedOverUnder_weightedAverage = (data, name) => {
    // ( [39] 04-06 Total Contributions / [6] 01-01 Students-average enrollment ) + ( ( ([34] 04-01 Gross Tuition Revenues Excluding Fees - [36] 04-03 Discounts - [37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment ) - ( ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense ) / [6] 01-01 Students-average enrollment ) )

    let numTotalContributions = getSumOfArray(
        data.totalContributions[name]
    );
    let numStudentAverageEnrollment = getSumOfArray(
        data.studentAverageEnrollment_Main[name]
    );
    let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
        data.grossTuitionRevenuesExcludingFees[name]
    );
    let numDiscounts = getSumOfArray(
        data.discounts[name]
    );
    let numFinancialAidScholarships = getSumOfArray(
        data.financialAidScholarships[name]
    );
    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );

    return (numTotalContributions / numStudentAverageEnrollment) + (((numGrossTuitionRevenuesExcludingFees - numDiscounts - numFinancialAidScholarships) / numStudentAverageEnrollment) - ((numTotalExpenses - numTotalDepreciationExpense) / numStudentAverageEnrollment));
}

const fundsExpensesPerStudent_cashExpensesExcessNetTuition_weightedAverage = (data, name) => {
    // ( ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment ) - ( ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense ) / [6] 01-01 Students-average enrollment )

    let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
        data.grossTuitionRevenuesExcludingFees[name]
    );
    let numFinancialAidScholarships = getSumOfArray(
        data.financialAidScholarships[name]
    );
    let numStudentAverageEnrollment = getSumOfArray(
        data.studentAverageEnrollment_Main[name]
    );
    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );

    return ((numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships) / numStudentAverageEnrollment) - ((numTotalExpenses - numTotalDepreciationExpense) / numStudentAverageEnrollment);

}

const fundsExpensesPerStudent_netTuition_weightedAverage = (data, name) => {
    // ([34] 04-01 Gross Tuition Revenues Excluding Fees -[37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment

    let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
        data.grossTuitionRevenuesExcludingFees[name]
    );
    let numFinancialAidScholarships = getSumOfArray(
        data.financialAidScholarships[name]
    );
    let numStudentAverageEnrollment = getSumOfArray(
        data.studentAverageEnrollment_Main[name]
    );

    return (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships) / numStudentAverageEnrollment;
}

const fundsExpensesPerStudent_CashExpensesExcludingDepreciation_weightedAverage = (data, name) => {
    // (4-08 Total Expenses - [42] 04-09 Total Depreciation Expense ) / [6] 01-01 Students-average enrollment

    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );
    let numStudentAverageEnrollment = getSumOfArray(
        data.studentAverageEnrollment_Main[name]
    );

    return (numTotalExpenses - numTotalDepreciationExpense) / numStudentAverageEnrollment;
}

const fundsExpensesPerStudent_FundsRaised_weightedAverage = (data, name) => {
    // [39] 04-06 Total Contributions / [6] 01-01 Students-average enrollment

    let numTotalContributions = getSumOfArray(
        data.totalContributions[name]
    );
    let numStudentAverageEnrollment = getSumOfArray(
        data.studentAverageEnrollment_Main[name]
    );

    return numTotalContributions / numStudentAverageEnrollment;
}

const percentFundRaisingExpensesExceeding_weightedAverage = (data, name) => {
    // [43] 04-10 Total Fundraising Expenses / ([39] 04-06 Total Contributions + [46] 04-13 Fundraising Income)

    let numTotalFundraising = getSumOfArray(
        data.totalFundraising[name]
    );
    let numTotalContributions = getSumOfArray(
        data.totalContributions[name]
    );
    let numFundraisingIncome = getSumOfArray(
        data.fundraisingIncome[name]
    );

    return numTotalFundraising / (numTotalContributions + numFundraisingIncome);

}

const personnelMandatoryDebtService_Personnel_weightedAverage = (data, name) => {
    // ( [15]  [16] 02-04 Total maintenance costs + [18] 02-06 Current maturities of LT Debt + [44] 04-11 Current Year Interest Expense +  [48] 05-02 Capitalized Interest )  / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

    // console.log('dataName', data, name);

    let numTotalMaintenanceCosts = getSumOfArray(
        data.totalMaintenanceCosts[name]
    );
    let numCurrentMaturingDebt = getSumOfArray(
        data.currentMaturingDebt[name]
    );
    let numCurrentYearInterestExpense = getSumOfArray(
        data.currentYearInterestExpense[name]
    );
    let numCapitalizedInterest = getSumOfArray(
        data.capitalizedInterest[name]
    );
    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );

    return (numTotalMaintenanceCosts + numCurrentMaturingDebt + numCurrentYearInterestExpense + numCapitalizedInterest) / (numTotalExpenses - numTotalDepreciationExpense);

}

const personnelMandatoryDebtService_Mandatory_weightedAverage = (data, name) => {
    // ( [18] 02-06 Current maturities of LT Debt + [44] 04-11 Current Year Interest Expense +  [48] 05-02 Capitalized Interest )  / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

    // console.log('dataName', data, name);

    let numCurrentMaturingDebt = getSumOfArray(
        data.currentMaturingDebt[name]
    );f
    let numCurrentYearInterestExpense = getSumOfArray(
        data.currentYearInterestExpense[name]
    );
    let numCapitalizedInterest = getSumOfArray(
        data.capitalizedInterest[name]
    );
    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );

    return (numCurrentMaturingDebt + numCurrentYearInterestExpense + numCapitalizedInterest) / (numTotalExpenses - numTotalDepreciationExpense);


}

const personnelMandatoryDebtService_SalariesAndBenefits_Employees_weightedAverage = (data, name) => {
    // [16] 02-04 Total maintenance costs  / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

    let numTotalMaintenanceCosts = getSumOfArray(
        data.totalMaintenanceCosts[name]
    );
    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );

    return numTotalMaintenanceCosts / (numTotalExpenses - numTotalDepreciationExpense);

}

const personnelMandatoryDebtService_SalariesAndBenefits_Administration_weightedAverage = (data, name) => {
    // ( [16] 02-04 Total maintenance costs - [13] 02-01 Total Teacher Salaries - [14] 02-02 Total Teacher Benefits  ) / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

    let numTotalMaintenanceCosts = getSumOfArray(
        data.totalMaintenanceCosts[name]
    );
    let numTotalTeacherSalaries = getSumOfArray(
        data.totalTeacherSalaries[name]
    );
    let numTotalTeacherBenefits = getSumOfArray(
        data.totalTeacherBenefits[name]
    );
    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );

    return (numTotalMaintenanceCosts - numTotalTeacherSalaries - numTotalTeacherBenefits) / (numTotalExpenses - numTotalDepreciationExpense);



}

const personnelMandatoryDebtService_SalariesAndBenefits_Teachers_weightedAverage = (data, name) => {
    // ( [13] 02-01 Total Teacher Salaries + [14] 02-02 Total Teacher Benefits  ) / ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense )

    let numTotalTeacherSalaries = getSumOfArray(
        data.totalTeacherSalaries[name]
    );
    let numTotalTeacherBenefits = getSumOfArray(
        data.totalTeacherBenefits[name]
    );
    let numTotalExpenses = getSumOfArray(
        data.totalExpenses[name]
    );
    let numTotalDepreciationExpense = getSumOfArray(
        data.totalDepreciationExpense[name]
    );

    return (numTotalTeacherSalaries + numTotalTeacherBenefits) / (numTotalExpenses - numTotalDepreciationExpense);

}

const benefitsPercentSalariesTeachers_weightedAverage = (data, name) => {
    // [14] 02-02 Total Teacher Benefits  / [13] 02-01 Total Teacher Salaries

    let numTotalTeacherBenefits = getSumOfArray(
        data.totalTeacherBenefits[name]
    );
    let numTotalTeacherSalaries = getSumOfArray(
        data.totalTeacherSalaries[name]
    );

    return numTotalTeacherBenefits / numTotalTeacherSalaries;
}

const salariesBenefitsTeachersPerStudentsEnrolledYE_SalariesAndBenefits_weightedAverage = (data, name) => {
    // ( [13] 02-01 Total Teacher Salaries + [14] 02-02 Total Teacher Benefits) / [6] 01-01 Students-average enrollment
    
    let numTotalTeacherSalaries = getSumOfArray(
        data.totalTeacherSalaries[name]
    );
    let numTotalTeacherBenefits = getSumOfArray(
        data.totalTeacherBenefits[name]
    );
    let numStudentAverageEnrollment = getSumOfArray(
        data.studentAverageEnrollment_Main[name]
    );
    
    return (numTotalTeacherSalaries + numTotalTeacherBenefits) / numStudentAverageEnrollment;
}

const salariesBenefitsTeachersPerStudentsEnrolledYE_Benefits_weightedAverage = (
  data,
  name
) => {

    // [14] 02-02 Total Teacher Benefits / [6] 01-01 Students-average enrollment
    
    let numTotalTeacherBenefits = getSumOfArray(
        data.totalTeacherBenefits[name]
    );
    let numStudentAverageEnrollment = getSumOfArray(
        data.studentAverageEnrollment_Main[name]
    );
    
    return numTotalTeacherBenefits / numStudentAverageEnrollment;
};

const salariesBenefitsTeachersPerStudentsEnrolledYE_Salaries_weightedAverage = (
  data,
  name
) => {
  // [13] 02-01 Total Teacher Salaries / [6] 01-01 Students-average enrollment

  let numTotalTeacherSalaries = getSumOfArray(data.totalTeacherSalaries[name]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return numTotalTeacherSalaries / numStudentAverageEnrollment;
};

const salariesBenefitsTeachersAsPercentNetTuition_SalariesAndBenefits_weightedAverage =
  (data, name) => {
    // ( [13] 02-01 Total Teacher Salaries + [14] 02-02 Total Teacher Benefits) / ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships)

    let numTotalTeacherSalaries = getSumOfArray(
      data.totalTeacherSalaries[name]
    );
    let numTotalTeacherBenefits = getSumOfArray(
      data.totalTeacherBenefits[name]
    );
    let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
      data.grossTuitionRevenuesExcludingFees[name]
    );
    let numFinancialAidScholarships = getSumOfArray(
      data.financialAidScholarships[name]
    );

    return (
      (numTotalTeacherSalaries + numTotalTeacherBenefits) /
      (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships)
    );
  };

const salariesBenefitsTeachersAsPercentNetTuition_Benefits_weightedAverage = (
  data,
  name
) => {
  // [14] 02-02 Total Teacher Benefits  / ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships)

  let numTotalTeacherBenefits = getSumOfArray(data.totalTeacherBenefits[name]);
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[name]
  );

  return (
    numTotalTeacherBenefits /
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships)
  );
};

const salariesBenefitsTeachersAsPercentNetTuition_Salaries_weightedAverage = (
  data,
  name
) => {
  // [13] 02-01 Total Teacher Salaries / ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships)

  let numTotalTeacherSalaries = getSumOfArray(data.totalTeacherSalaries[name]);
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[name]
  );

  return (
    numTotalTeacherSalaries /
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships)
  );
};

const feesPercentOfNetTuition_weightedAverage = (data, name) => {
  // [35] 04-02 Fees / ([34] 04-01 Gross Tuition Revenues Excluding Fees -  [37] 04-04 Financial Aid / Scholarships)

  let numFees = getSumOfArray(data.fees[name]);
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[name]
  );

  return (
    numFees /
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships)
  );
};

const netTuition_weightedAverage = (data, name) => {
  // ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships) / [6] 01-01 Students-average enrollment

  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[name]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return (
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships) /
    numStudentAverageEnrollment
  );
};

const totalFinancialAssistance_weightedAverage = (data, name) => {
  // [37] 04-04 Financial Aid / Scholarships / [6] 01-01 Students-average enrollment

  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[name]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return numFinancialAidScholarships / numStudentAverageEnrollment;
};

const scholarshipAwarded_weightedAverage = (data, name) => {
  // (0 - [36] 04-03 Discounts )  / [6] 01-01 Students-average enrollment

  let numDiscounts = getSumOfArray(data.discounts[name]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return (0 - numDiscounts) / numStudentAverageEnrollment;
};

const financialAssistanceDiscountBased_weightedAverage = (data, name) => {
  // [36] 04-03 Discounts / [6] 01-01 Students-average enrollment

  let numDiscounts = getSumOfArray(data.discounts[name]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return numDiscounts / numStudentAverageEnrollment;
};

const grossTuition_weightedAverage = (data, name) => {
  // [34] 04-01 Gross Tuition Revenues Excluding Fees / [6] 01-01 Students-average enrollment

  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return numGrossTuitionRevenuesExcludingFees / numStudentAverageEnrollment;
};

const contributionsAsAPercentOfTotalIncome_weightedAverage = (data, name) => {
  // [39] 04-06 Total Contributions / [38] 04-05 Total Support and Revenue

  let numTotalContributions = getSumOfArray(data.totalContributions[name]);
  let numTotalSupportRevenue = getSumOfArray(data.totalSupportRevenue[name]);

  return numTotalContributions / numTotalSupportRevenue;
};

const tuitionAndFeesAsPercentTotalIncome_weightedAverage = (data, name) => {
  // [34] 04-01 Gross Tuition Revenues Excluding Fees / [38] 04-05 Total Support and Revenue

  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );
  let numtotalSupportRevenue = getSumOfArray(
    data.totalSupportRevenue[name]
  );

  return numGrossTuitionRevenuesExcludingFees / numtotalSupportRevenue;
};

const financialAssistanceAsPercentTuitionAndFees_weightedAverage = (
  data,
  name
) => {
  // [37] 04-04 Financial Aid / Scholarships / [34] 04-01 Gross Tuition Revenues Excluding Fees

  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[name]
  );
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );

  return numFinancialAidScholarships / numGrossTuitionRevenuesExcludingFees;
};

const netIncomeRatioExcludingDepreciation_weightedAverage = (data, name) => {
  // ( [45] 04-12 Change in Unrestricted Net Assets + [42] 04-09 Total Depreciation Expense) / [40] 04-07 Unrestricted Support, Revenues and Reclassifications for operating purposes

  let numChangeInUnrestrictedNetAssets = getSumOfArray(
    data.changeInUnrestrictedNetAssets[name]
  );
  let NumUnrestrictedSupportRevenuesReclassification = getSumOfArray(
    data.unrestrictedSupportRevenuesReclassification[name]
  );
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[name]
  );

  return (
    (numChangeInUnrestrictedNetAssets + numTotalDepreciationExpense) /
    NumUnrestrictedSupportRevenuesReclassification
  );
};

const netIncomeRatio_weightedAverage = (data, name) => {
  // [45] 04-12 Change in Unrestricted Net Assets / [40] 04-07 Unrestricted Support, Revenues and Reclassifications for operating purposes

  let numChangeInUnrestrictedNetAssets = getSumOfArray(
    data.changeInUnrestrictedNetAssets[name]
  );
  let NumUnrestrictedSupportRevenuesReclassification = getSumOfArray(
    data.unrestrictedSupportRevenuesReclassification[name]
  );

  return (
    numChangeInUnrestrictedNetAssets /
    NumUnrestrictedSupportRevenuesReclassification
  );
};

const debtCoverage_weightedAverage = (data, name) => {
  // ( [45] 04-12 Change in Unrestricted Net Assets + [44] 04-11 Current Year Interest Expense + [42] 04-09 Total Depreciation Expense + [48] 05-02 Capitalized Interest ) / ([18] 02-06 Current maturities of LT Debt + [44] 04-11 Current Year Interest Expense + [48] 05-02 Capitalized Interest)

  let numChangeInUnrestrictedNetAssets = getSumOfArray(
    data.changeInUnrestrictedNetAssets[name]
  );
  let numCurrentYearInterestExpense = getSumOfArray(
    data.currentYearInterestExpense[name]
  );
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[name]
  );
  let numCapitalizedInterest = getSumOfArray(data.capitalizedInterest[name]);
  let numCurrentMaturitiesOfLTDebt = getSumOfArray(
    data.currentMaturitiesOfLTDebt[name]
  );

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

const debtPerStudents_weightedAverage = (data, name) => {
  // [30] 03-11 Total Debt / [6] 01-01 Students-average enrollment

  let numTotalDebt = getSumOfArray(data.totalDebt[name]);
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return numTotalDebt / numStudentAverageEnrollment;
};

const currentLiabilitiesToAvailableNetAssets_weightedAverage = (data, name) => {
  // [28] 03-09 Current Liabilities / ([31] 03-12 Total Unrestricted Net Assets - (IF [27] 03-08 Land, Buildings and Equipment, net - [30] 03-11 Total Debt <0,0, [27] 03-08 Land, Buildings and Equipment, net - [30] 03-11 Total Debt) - [32] 03-13 BOD Designated for Operations )

  let numCurrentLiabilities = getSumOfArray(data.currentLiabilities[name]);
  let numTotalUnrestrictedNetAssets = getSumOfArray(
    data.unrestrictedNetAssets[name]
  );
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[name]
  );
  let numTotalDebt = getSumOfArray(data.totalDebt[name]);
  let numBODDesignatedForOperations = getSumOfArray(
    data.bodDesignatedForOperations[name]
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

const currentRatio_weightedAverage = (data, name) => {
  // [20] 03-01 Current Assets / [28] 03-09 Current Liabilities

  let numCurrentAssets = getSumOfArray(data.currentAssets[name]);
  let numCurrentLiabilities = getSumOfArray(data.currentLiabilities[name]);

  return numCurrentAssets / numCurrentLiabilities;
};

const debtToPropertyAndEquipment_weightedAverage = (data, name) => {
  // [30] 03-11 Total Debt / [27] 03-08 Land, Buildings and Equipment, net

  let numTotalDebt = getSumOfArray(data.totalDebt[name]);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[name]
  );

  return numTotalDebt / numLandBuildingsEquipmentNet;
};

const receivableWriteOffsAsPercentNetTuitionAndFees_weightedAverage = (
  data,
  name
) => {
  // [25] 03-06 Student Accounts Receivable Written-Off / ([34] 04-01 Gross Tuition Revenues Excluding Fees - [37] 04-04 Financial Aid / Scholarships )

  let numStudentAccountsReceivableWrittenOff = getSumOfArray(
    data.studentAccountsReceivableWrittenOff[name]
  );
  let numGrossTuitionRevenuesExcludingFees = getSumOfArray(
    data.grossTuitionRevenuesExcludingFees[name]
  );
  let numFinancialAidScholarships = getSumOfArray(
    data.financialAidScholarships[name]
  );

  return (
    numStudentAccountsReceivableWrittenOff /
    (numGrossTuitionRevenuesExcludingFees - numFinancialAidScholarships)
  );
};

const netTuitionARasPercentCurrentAssets_weightedAverage = (data, name) => {
  // [24] 03-05 Student Accounts Receivable / [20] 03-01 Current Assets
  let numStudentAccountsReceivable = getSumOfArray(
    data.studentAccountsReceivable[name]
  );
  let numCurrentAssets = getSumOfArray(data.currentAssets[name]);

  return numStudentAccountsReceivable / numCurrentAssets;
};

const propertyEquipmentPerStudent_weightedAverage = (data, name) => {
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[name]
  );
  let numLandAndLandImprovements = getSumOfArray(
    data.landAndLandImprovements[name]
  );
  let numStudentAverageEnrollment = getSumOfArray(
    data.studentAverageEnrollment_Main[name]
  );

  return (
    (numLandBuildingsEquipmentNet - numLandAndLandImprovements) /
    numStudentAverageEnrollment
  );
};

const netCashUsedOperating_overUnderBenchmark_weightedAverage = (
  data,
  name
) => {
  let numCashFlowsOperatingActivities = getSumOfArray(
    data.cashFlowsOperatingActivities[name]
  );
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[name]
  );

  return (
    numNetnumCashFlowsOperatingActivitiesCashUsedOperating -
    numTotalDepreciationExpense
  );
};

const studentsFacilityRatio_weightedAverage = (data, name) => {
  //   console.log('wa', data, name);
  let numFullTime = getSumOfArray(data.fullTimeTeachers_Peer[name]);
  let numPartTime = getSumOfArray(data.partTimeTeachers_Peer[name]);
  let numStudents = getSumOfArray(data.studentAverageEnrollment_Main[name]);

  return (numFullTime + 0.5 * numPartTime) / numStudents;
};

const expendableReservesInDays_weightedAverage = (data, name) => {
  //   console.log(data);
  let numTotalUnrestricted = getSumOfArray(data.unrestrictedNetAssets[name]);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[name]
  );
  let numTotalDebt = getSumOfArray(data.totalDebt[name]);
  let numTotalExpense = getSumOfArray(data.totalExpense[name]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[name]
  );

  let numIf =
    numLandBuildingsEquipmentNet - numTotalDebt < 0
      ? 0
      : numLandBuildingsEquipmentNet - numTotalDebt;

  return (
    ((numTotalUnrestricted - numIf) /
      (numTotalExpense - numTotalDepreciationExpense)) *
    365
  );
};

const expendableReservesPercent_weightedAverage = (data, name) => {
  let numTotalUnrestricted = getSumOfArray(data.unrestrictedNetAssets[name]);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet[name]
  );
  let numTotalDebt = getSumOfArray(data.totalDebt[name]);
  let numTotalExpense = getSumOfArray(data.totalExpense[name]);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense[name]
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

const cashAvailableDeferred_weightedAverage = (data, name) => {
  // ( ([21] 03-02 Total Cash  + [22] 03-03 Non-Endowment Investments - [29] 03-10 Deferred Revenue ) / [29] 03-10 Deferred Revenue

  let numTotalCash = getSumOfArray(data.totalCash[name]);
  let numNonEndowmentInvestments = getSumOfArray(
    data.nonEndowmentInvestments[name]
  );
  let numDeferredRevenue = getSumOfArray(data.deferredRevenue[name]);

  return (
    (numTotalCash + numNonEndowmentInvestments - numDeferredRevenue) /
    numDeferredRevenue
  );
};

const liquidityRatio_weightedAverage = (data, name) => {
  let numTotalCash = getSumOfArray(data.totalCash[name]);
  let numNonEndowmentInvestments = getSumOfArray(
    data.nonEndowmentInvestments[name]
  );
  let numCurrentLiabilities = getSumOfArray(data.currentLiabilities[name]);
  let numDeferredRevenue = getSumOfArray(data.deferredRevenue[name]);

  return (
    (numTotalCash + numNonEndowmentInvestments) /
    (numCurrentLiabilities - numDeferredRevenue)
  );
};
