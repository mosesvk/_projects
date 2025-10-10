const getWeightedAverageOfArray = (data, name, year) => {
  // console.log(data, name, year);
  switch (name) {
    case "givingUnitsToStaff":
      return givingUnitsToStaff_weightedAverage(data, name, year);
    case "percentContributionsOnline":
      return percentContributionsOnline_weightedAverage(data, name, year);
    case "daysExpendableNetAssets":
      return daysExpendableNetAssets_weightedAverage(data, name, year);
    case "daysOperatingCash":
      return daysOperatingCash_weightedAverage(data, name, year);
    case "availableDaysOfCashFlow":
      return availableDaysOfCashFlow_weightedAverage(data, name, year);
    case "liquidityRatio":
      return liquidityRatio_weightedAverage(data, name, year);
    case "debtCoverage":
      return debtCoverage_weightedAverage(data, name, year);
    case "debtToContributionsWithout":
      return debtToContributionsWithout_weightedAverage(data, name, year);
    case "currentRatio":
      return currentRatio_weightedAverage(data, name, year);
    case "mandatoryDebtServiceToContributionsWithout":
      return mandatoryDebtServiceToContributionsWithout_weightedAverage(
        data,
        name,
        year
      );
  
    case "debtPerGivingUnit":
      return debtPerGivingUnit_weightedAverage(data, name, year);
    case "debtPerGivingUnit_standard":
      return debtPerGivingUnit_standard_weightedAverage(data, name, year);
    case "netIncomeRatio":
      return netIncomeRatio_weightedAverage(data, name, year);
    case "contributionsWithoutDonorPerGivingUnit":
      return contributionsWithoutDonorPerGivingUnit_weightedAverage(data, name, year);
    case "totalContributionsPerGivingUnit":
      return totalContributionsPerGivingUnit_weightedAverage(data, name, year);
    case "benefitsToSalaries":
      return benefitsToSalaries_weightedAverage(data, name, year);
    case "salaries":
      return salaries_weightedAverage(data, name, year);
    case "benefits":
      return benefits_weightedAverage(data, name, year);
    case "salariesBenefits":
      return salariesBenefits_weightedAverage(data, name, year);
    case "salariesBenefitsIncludingOutsourcedEmployees":
      return salariesBenefitsIncludingOutsourcedEmployees_weightedAverage(
        data,
        name,
        year
      );
    case "personnelToCashExpenditure":
      return personnelToCashExpenditure_weightedAverage(data, name, year);
    case "mandatoryDebtServiceToCashExpenditure":
      return mandatoryDebtServiceToCashExpenditure_weightedAverage(data, name, year);
    case "personnelIncludingToTotalCashExpenditures":
      return personnelIncludingToTotalCashExpenditures_weightedAverage(
        data,
        name,
        year
      );
    case "localOutreachExpenses":
      return localOutreachExpenses_weightedAverage(data, name, year);
    case "globalOutreachExpenses":
      return globalOutreachExpenses_weightedAverage(data, name, year);
    case "totalGlobalAndLocalOutreachExpenses":
      return totalGlobalAndLocalOutreachExpenses_weightedAverage(data, name, year);
    // removed cashExpendituresPerAvgAdultAttendee
    case "cashExpendituresPerGivingUnit":
      return cashExpendituresPerGivingUnit_weightedAverage(data, name, year);
    case "contributionsPerAccountingFTE":
      return contributionsPerAccountingFTE_weightedAverage(data, name, year);
    case "expensesPerAccountingFTE": 
      return expensesPerAccountingFTE_weightedAverage(data, name, year);
    // Facility and IT ratios removed per todo
    default:
      return;
  }
};

// Facility and IT helper functions removed per todo

const expensesPerAccountingFTE_weightedAverage = (data, name, year) => {
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s158 = getSumOfArray(data.averageAnnualAccountingDepartment[name][year ? year : 'total']);
  const s159 = getSumOfArray(data.accountingDepartmentPartTimeEmployee[name][year ? year : 'total']);
  const s160 = getSumOfArray(data.accountingDepartmentVolunteer[name][year ? year : 'total']);
  const s94 = data.accountingDeptOutsourcedLabor 
    ? getSumOfArray(data.accountingDeptOutsourcedLabor[name][year ? year : 'total']) 
    : 0;

  // Updated formula per image: s45 / (s158 + s159 + s160 + s94)
  // Removed s167 (amortizationFinanceLease) and s168 (internetOnFinanceLease) per updated calculation
  return s45 / (s158 + s159 + s160 + s94);
}

const contributionsPerAccountingFTE_weightedAverage = (data, name, year) => {
  const s40 = getSumOfArray(data.totalContributions[name][year ? year : 'total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name][year ? year : 'total']);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name][year ? year : 'total']);

  const s158 = getSumOfArray(data.averageAnnualAccountingDepartment[name][year ? year : 'total']);
  const s159 = getSumOfArray(data.accountingDepartmentPartTimeEmployee[name][year ? year : 'total']);
  const s160 = getSumOfArray(data.accountingDepartmentVolunteer[name][year ? year : 'total']);
  // const s94 = data.accountingDeptOutsourcedLabor 
  //   ? getSumOfArray(data.accountingDeptOutsourcedLabor[name][year ? year : 'total']) 
  //   : 0;

  // console.log('contributionsPerAccountingFTE_weightedAverage', '(s40 - (s152 + s153)) / (s158 + s159 + s160 + s94)', {s40, s152, s153, s158, s159, s160});

  // Updated formula per image: (s40 - (s152 + s153)) / (s158 + s159 + s160 + s94)
  // Removed s44 (revenueFromPledge) and added s94 (accountingDeptOutsourcedLabor) per updated calculation
  return (s40 - (s152 + s153)) / (s158 + s159 + s160);
};

const cashExpendituresPerGivingUnit_weightedAverage = (data, name, year) => {
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);
  const s90 = data.nextFiscalYearsRefinancedLoanPayments 
    ? getSumOfArray(data.nextFiscalYearsRefinancedLoanPayments[name][year ? year : 'total']) 
    : 0;
  const s164 = data.oneTimePayoffDebtDueNextYear 
    ? getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']) 
    : 0;
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);
  const s02 = getSumOfArray(data.givingUnits[name][year ? year : 'total']);

  // Updated formula per image: (s45 - s167 + s154 + s90 - s164 - s46) / s02
  // Removed s168 (internetOnFinanceLease) and s166 (futureMinimumLeasePayment) per updated calculation
  return (s45 - s167 + s154 + s90 - s164 - s46) / s02;
};


const totalGlobalAndLocalOutreachExpenses_weightedAverage = (data, name, year) => {
  const s14 = getSumOfArray(data.localOutreachExpense[name][year ? year : 'total']);
  const s15 = getSumOfArray(data.globalOutreachExpense[name][year ? year : 'total']);
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);
  const s90 = data.nextFiscalYearsRefinancedLoanPayments 
    ? getSumOfArray(data.nextFiscalYearsRefinancedLoanPayments[name][year ? year : 'total']) 
    : 0;
  const s164 = data.oneTimePayoffDebtDueNextYear 
    ? getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']) 
    : 0;
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);

  // Updated formula per image: (s14 + s15) / (s45 - s167 + s154 + s90 - s164 - s46)
  // Removed s168 (internetOnFinanceLease) and s166 (futureMinimumLeasePayment) per updated calculation
  return (s14 + s15) / (s45 - s167 + s154 + s90 - s164 - s46);
};


const personnelIncludingToTotalCashExpenditures_weightedAverage = (
  data,
  name,
  year
) => {
  const s11 = getSumOfArray(data.totalBenefit[name][year ? year : 'total']);
  const s10 = getSumOfArray(data.totalSalaries[name][year ? year : 'total']);
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);
  const s90 = data.nextFiscalYearsRefinancedLoanPayments 
    ? getSumOfArray(data.nextFiscalYearsRefinancedLoanPayments[name][year ? year : 'total']) 
    : 0;
  const s164 = data.oneTimePayoffDebtDueNextYear 
    ? getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']) 
    : 0;
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);
  const s162 = getSumOfArray(data.costOfOutsourcedEmployee[name][year ? year : 'total']);

  return (s11 + s10 + s162) / (s45 - s167) + (s154 + s90 - s164) - s46
};

const mandatoryDebtServiceToCashExpenditure_weightedAverage = (data, name, year) => {
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);
  const s90 = data.nextFiscalYearsRefinancedLoanPayments 
    ? getSumOfArray(data.nextFiscalYearsRefinancedLoanPayments[name][year ? year : 'total']) 
    : 0;
  const s164 = data.oneTimePayoffDebtDueNextYear 
    ? getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']) 
    : 0;
  const s47 = getSumOfArray(data.cyInterestExpense[name][year ? year : 'total']);
  const s51 = getSumOfArray(data.capitalizedInterest[name][year ? year : 'total']);
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);

  return (
    (s154 + s90 - s164) + s47 + s51 / (s45 - s167 + (s154 + s90 - s164) - s46)
  );
};

const personnelToCashExpenditure_weightedAverage = (data, name, year) => {
  const s11 = getSumOfArray(data.totalBenefit[name][year ? year : 'total']);
  const s10 = getSumOfArray(data.totalSalaries[name][year ? year : 'total']);
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);
  const s90 = data.nextFiscalYearsRefinancedLoanPayments 
    ? getSumOfArray(data.nextFiscalYearsRefinancedLoanPayments[name][year ? year : 'total']) 
    : 0;
  const s164 = data.oneTimePayoffDebtDueNextYear 
    ? getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']) 
    : 0;
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);

  return (s11 + s10) / (s45 - s167 + (s154 + s90 - s164) - s46);
};

const salariesBenefitsIncludingOutsourcedEmployees_weightedAverage = (
  data,
  name,
  year
) => {
  // console.log(data, name);

  const s10 = getSumOfArray(data.totalSalaries[name][year ? year : 'total']);
  const s11 = getSumOfArray(data.totalBenefit[name][year ? year : 'total']);
  const s162 = getSumOfArray(data.costOfOutsourcedEmployee[name][year ? year : 'total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name][year ? year : 'total']);
  const s157 = getSumOfArray(data.totalOutsourcedEmployee[name][year ? year : 'total']);

  return (s10 + s11 + s162) / (s151 + s157);
};

const salariesBenefits_weightedAverage = (data, name, year) => {
  const s10 = getSumOfArray(data.totalSalaries[name][year ? year : 'total']);
  const s11 = getSumOfArray(data.totalBenefit[name][year ? year : 'total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name][year ? year : 'total']);

  return (s10 + s11) / s151;
};

const benefits_weightedAverage = (data, name, year) => {
  const s11 = getSumOfArray(data.totalBenefit[name][year ? year : 'total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name][year ? year : 'total']);

  return s11 / s151;
};

const salaries_weightedAverage = (data, name, year) => {
  // console.log(data, name);
  const s10 = getSumOfArray(data.totalSalaries[name][year ? year : 'total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name][year ? year : 'total']);

  return s10 / s151;
};

const benefitsToSalaries_weightedAverage = (data, name, year) => {
  const s11 = getSumOfArray(data.totalBenefit[name][year ? year : 'total']);
  const s10 = getSumOfArray(data.totalSalaries[name][year ? year : 'total']);

  return s11 / s10;
};

const totalContributionsPerGivingUnit_weightedAverage = (data, name, year) => {
  const s40 = getSumOfArray(data.totalContributions[name][year ? year : 'total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name][year ? year : 'total']);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name][year ? year : 'total']);
  const s02 = getSumOfArray(data.givingUnits[name][year ? year : 'total']);

  return (s40 - (s152 + s153)) / s02;
};

const contributionsWithoutDonorPerGivingUnit_weightedAverage = (data, name, year) => {
  // console.log(data, name);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name][year ? year : 'total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name][year ? year : 'total']);
  const s02 = getSumOfArray(data.givingUnits[name][year ? year : 'total']);

  return (s39 - s152) / s02;
};

const netIncomeRatio_weightedAverage = (data, name, year) => {
  const s48 = getSumOfArray(data.changeInNetAssetWithout[name][year ? year : 'total']);
  const s41 = getSumOfArray(data.totalContributionWithout[name][year ? year : 'total']);

  return s48 / s41;
};

const debtPerGivingUnit_standard_weightedAverage = (data, name, year) => {
  const s39 = getSumOfArray(data.contributionWithoutDonor[name][year ? year : 'total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name][year ? year : 'total']);
  const s02 = getSumOfArray(data.givingUnits[name][year ? year : 'total']);
  // console.log({s39, s152, s02});

  return ((s39 - s152) / s02) * 2;
};

const debtPerGivingUnit_weightedAverage = (data, name, year) => {
  const s155 = getSumOfArray(data.totalDebt[name][year ? year : 'total']);
  const s02 = getSumOfArray(data.givingUnits[name][year ? year : 'total']);

  return s155 / s02;
};

const mandatoryDebtServiceToContributionsWithout_weightedAverage = (
  data,
  name,
  year
) => {
  // console.log(data, name);

  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);
  const s90 = data.nextFiscalYearsRefinancedLoanPayments 
    ? getSumOfArray(data.nextFiscalYearsRefinancedLoanPayments[name][year ? year : 'total']) 
    : 0;
  const s47 = getSumOfArray(data.cyInterestExpense[name][year ? year : 'total']);
  const s51 = getSumOfArray(data.capitalizedInterest[name][year ? year : 'total']);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name][year ? year : 'total']);
  const s164 = data.oneTimePayoffDebtDueNextYear 
    ? getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']) 
    : 0;


  // Updated formula: (s154 + s90 + s47 + s51) / s39
  // Removed s166 (futureMinimumLeasePayment) and s168 (internetOnFinanceLease) per updated calculation
  return (s154 + s90 - s164) + s47 + s51 / s39;
};

const currentRatio_weightedAverage = (data, name, year) => {
  const s17 = getSumOfArray(data.currentAssets[name][year ? year : 'total']);
  const s26 = getSumOfArray(data.currentLiabilities[name][year ? year : 'total']);

  return s17 / s26;
};

const debtToContributionsWithout_weightedAverage = (data, name, year) => {
  const s155 = getSumOfArray(data.totalDebt[name][year ? year : 'total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name][year ? year : 'total']);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name][year ? year : 'total']);

  return s155 / s39 - s152;
};

const debtCoverage_weightedAverage = (data, name, year) => {
  const s48 = getSumOfArray(data.changeInNetAssetWithout[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s47 = getSumOfArray(data.cyInterestExpense[name][year ? year : 'total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);

  return (
    (s48 + s167 + (s47) + s46) / (s154 + (s47))
  );
};


const liquidityRatio_weightedAverage = (data, name, year) => {
  const s18 = getSumOfArray(data.totalCash[name][year ? year : 'total']);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name][year ? year : 'total']);
  const s36 = getSumOfArray(data.netAssetWithDonor[name][year ? year : 'total']);
  const s21 = getSumOfArray(data.pledgeReceivable[name][year ? year : 'total']);
  const s26 = getSumOfArray(data.currentLiabilities[name][year ? year : 'total']);
  const s164 = getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']);
  const s29 = getSumOfArray(data.deferredRevenue[name][year ? year : 'total']);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name][year ? year : 'total']);
  const s91 = getSumOfArray(data.accountsReceivable[name][year ? year : 'total']);


  return (
    (s18 + s20 + s91 - s36 + s21) / 
    (s26 - s31 - s29 - s164)
  );
};

const daysOperatingCash_weightedAverage = (data, name, year) => {
  const s18 = getSumOfArray(data.totalCash[name][year ? year : 'total']);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name][year ? year : 'total']);
  const s36 = getSumOfArray(data.netAssetWithDonor[name][year ? year : 'total']);
  const s21 = getSumOfArray(data.pledgeReceivable[name][year ? year : 'total']);
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s51 = getSumOfArray(data.capitalizedInterest[name][year ? year : 'total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name][year ? year : 'total']);
  const s90 = data.nextFiscalYearsRefinancedLoanPayments
    ? getSumOfArray(data.nextFiscalYearsRefinancedLoanPayments[name][year ? year : 'total'])
    : 0;
  const s164 = data.oneTimePayoffDebtDueNextYear 
    ? getSumOfArray(data.oneTimePayoffDebtDueNextYear[name][year ? year : 'total']) 
    : 0;

  return (((s18 + s20 - s36 + s21) / (s45 - s167 + (s51 - s46) + (s154 + s90 - s164))) * 365);
};

const daysExpendableNetAssets_weightedAverage = (data, name, year) => {
  const s34 = getSumOfArray(data.netAssetWithoutDonorRestriction[name][year ? year : 'total']);
  const s92 = data.totalPropertyPlantAndEquipmentNet && data.totalPropertyPlantAndEquipmentNet[name]
    ? getSumOfArray(data.totalPropertyPlantAndEquipmentNet[name][year ? year : 'total'])
    : 0;
  const s155 = data.totalDebt && data.totalDebt[name]
    ? getSumOfArray(data.totalDebt[name][year ? year : 'total'])
    : 0;
  const s45 = getSumOfArray(data.totalExpense[name][year ? year : 'total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name][year ? year : 'total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name][year ? year : 'total']);


  return (((s34 - s92 + s155) / ((s45 - s167) - s46)) * 365);
};

const givingUnitsToStaff_weightedAverage = (data, name, year) => {
  // console.log('givingUnitsToStaff_weightedAverage', data, name);
  const s02 = getSumOfArray(data.givingUnits[name][year ? year : 'total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name][year ? year : 'total']);

  return s02 / s151;
};

const percentContributionsOnline_weightedAverage = (data, name, year) => {
  const s163 = getSumOfArray(data.totalContributionOnline[name][year ? year : 'total']);
  const s40 = getSumOfArray(data.totalContributions[name][year ? year : 'total']);

  return s163 / s40;
};
