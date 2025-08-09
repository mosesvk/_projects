const getWeightedAverageOfArray = (data, name) => {
  // console.log(data, name);
  switch (name) {
    case "attendeesToStaff":
      return attendeesToStaff_weightedAverage(data, name);
    case "percentContributionsOnline":
      return percentContributionsOnline_weightedAverage(data, name);
    case "daysExpendableNetAssets":
      return daysExpendableNetAssets_weightedAverage(data, name);
    case "daysOperatingCash":
      return daysOperatingCash_weightedAverage(data, name);
    case "availableDaysOfCashFlow":
      return availableDaysOfCashFlow_weightedAverage(data, name);
    case "liquidityRatio":
      return liquidityRatio_weightedAverage(data, name);
    case "netCashAvailability":
      return netCashAvailability_weightedAverage(data, name);
    case "netCashAvailability_including":
      return netCashAvailability_including_weightedAverage(data, name);
    case "netCashAvailability_standard":
      return netCashAvailability_standard_weightedAverage(data, name);
    case "debtCoverage":
      return debtCoverage_weightedAverage(data, name);
    case "debtToContributionsWithout":
      return debtToContributionsWithout_weightedAverage(data, name);
    case "currentRatio":
      return currentRatio_weightedAverage(data, name);
    case "mandatoryDebtServiceToContributionsWithout":
      return mandatoryDebtServiceToContributionsWithout_weightedAverage(
        data,
        name
      );
    case "debtPerAverageAdultAttendee":
      return debtPerAverageAdultAttendee_weightedAverage(data, name);
    case "debtPerAverageAdultAttendee_standard":
      return debtPerAverageAdultAttendee_standard_weightedAverage(data, name);
    case "debtPerGivingUnit":
      return debtPerGivingUnit_weightedAverage(data, name);
    case "debtPerGivingUnit_standard":
      return debtPerGivingUnit_standard_weightedAverage(data, name);
    case "netIncomeRatio":
      return netIncomeRatio_weightedAverage(data, name);
    case "contributionsWithoutDonorPerAverageAdultAttendee":
      return contributionsWithoutDonorPerAverageAdultAttendee_weightedAverage(
        data,
        name
      );
    case "contributionsWithoutDonorPerGivingUnit":
      return contributionsWithoutDonorPerGivingUnit_weightedAverage(data, name);
    case "totalContributionsPerAverageAdultAttendee":
      return totalContributionsPerAverageAdultAttendee_weightedAverage(
        data,
        name
      );
    case "totalContributionsPerGivingUnit":
      return totalContributionsPerGivingUnit_weightedAverage(data, name);
    case "benefitsToSalaries":
      return benefitsToSalaries_weightedAverage(data, name);
    case "salaries":
      return salaries_weightedAverage(data, name);
    case "benefits":
      return benefits_weightedAverage(data, name);
    case "salariesBenefits":
      return salariesBenefits_weightedAverage(data, name);
    case "salariesBenefitsIncludingOutsourcedEmployees":
      return salariesBenefitsIncludingOutsourcedEmployees_weightedAverage(
        data,
        name
      );
    case "personnelToCashExpenditure":
      return personnelToCashExpenditure_weightedAverage(data, name);
    case "mandatoryDebtServiceToCashExpenditure":
      return mandatoryDebtServiceToCashExpenditure_weightedAverage(data, name);
    case "personnelIncludingToTotalCashExpenditures":
      return personnelIncludingToTotalCashExpenditures_weightedAverage(
        data,
        name
      );
    case "localOutreachExpenses":
      return localOutreachExpenses_weightedAverage(data, name);
    case "globalOutreachExpenses":
      return globalOutreachExpenses_weightedAverage(data, name);
    case "totalGlobalAndLocalOutreachExpenses":
      return totalGlobalAndLocalOutreachExpenses_weightedAverage(data, name);
    case "cashExpendituresPerAvgAdultAttendee":
      return cashExpendituresPerAvgAdultAttendee_weightedAverage(data, name);
    case "cashExpendituresPerGivingUnit":
      return cashExpendituresPerGivingUnit_weightedAverage(data, name);
    case "contributionsPerAccountingFTE":
      return contributionsPerAccountingFTE_weightedAverage(data, name);
    case "expensesPerAccountingFTE": 
      return expensesPerAccountingFTE_weightedAverage(data, name);
    case "facilitiesExpenseToTotalCashExpenditures_lessThanTen":
      return facilitiesExpenseToTotalCashExpenditures_lessThanTen_weightedAverage(
        data,
        name
      );
    case "facilitiesExpenseToTotalCashExpenditures_greaterThanTen":
      return facilitiesExpenseToTotalCashExpenditures_greaterThanTen_weightedAverage(
        data,
        name
      );
    case "facilityCostPerSquareFootExcluding_lessThanTen":
      return facilityCostPerSquareFootExcluding_lessThanTen_weightedAverage(
        data,
        name
      );
    case "facilityCostPerSquareFootExcluding_greaterThanTen":
      return facilityCostPerSquareFootExcluding_greaterThanTen_weightedAverage(
        data,
        name
      );
    case "facilityCostPerSquareFootIncluding_lessThanTen":
      return facilityCostPerSquareFootIncluding_lessThanTen_weightedAverage(
        data,
        name
      );
    case "facilityCostPerSquareFootIncluding_greaterThanTen":
      return facilityCostPerSquareFootIncluding_greaterThanTen_weightedAverage(
        data,
        name
      );
    case "informationTechnologyCostPerFTE":
      return informationTechnologyCostPerFTE_weightedAverage(data, name);
    default:
      return;
  }
};

const informationTechnologyCostPerFTE_weightedAverage = (data, name) => {
  const s13 = getSumOfArray(data.itCost[name]['total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]['total']);

  return s13 / s151;
}

const facilityCostPerSquareFootIncluding_greaterThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]['total']);
  const s47 = getSumOfArray(data.cyInterestExpense[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]['total']);
  
  return (s12 + (s47 - s168) + (s154 - s166)) / s08;
}
const facilityCostPerSquareFootIncluding_lessThanTen_weightedAverage = (
  data,
  name
) => {
const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]['total']);
const s47 = getSumOfArray(data.cyInterestExpense[name]['total']);
const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]['total']);

return (s12 + (s47 - s168) + (s154 - s166)) / s08;


}

const facilityCostPerSquareFootExcluding_greaterThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]['total']);
  const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]['total']);

  return s12 / s08;

}

const facilityCostPerSquareFootExcluding_lessThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]['total']);
  const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]['total']);

  return s12 / s08;
}

const facilitiesExpenseToTotalCashExpenditures_greaterThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);
        
  return s12 / (s45 - s167 - s168 + (s154 - s166) - s46);

}

const facilitiesExpenseToTotalCashExpenditures_lessThanTen_weightedAverage = (
  data,
  name
) => {
  // console.log(data, name);
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return s12 / (s45 - s167 - s168 + (s154 - s166) - s46);

}

const expensesPerAccountingFTE_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s158 = getSumOfArray(data.averageAnnualAccountingDepartment[name]['total']);
  const s159 = getSumOfArray(data.accountingDepartmentPartTimeEmployee[name]['total']);
  const s160 = getSumOfArray(data.accountingDepartmentVolunteer[name]['total']);

  return (s45 - s167 - s168) / (s158 + s159 + s160);
}

const contributionsPerAccountingFTE_weightedAverage = (data, name) => {
  const s40 = getSumOfArray(data.totalContributions[name]['total']);
  const s44 = getSumOfArray(data.revenueFromPledge[name]['total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]['total']);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name]['total']);

  const s158 = getSumOfArray(data.averageAnnualAccountingDepartment[name]['total']);
  const s159 = getSumOfArray(data.accountingDepartmentPartTimeEmployee[name]['total']);
  const s160 = getSumOfArray(data.accountingDepartmentVolunteer[name]['total']);

  return (s40 - s44 - (s152 + s153)) / (s158 + s159 + s160);
};

const cashExpendituresPerGivingUnit_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);
  const s02 = getSumOfArray(data.givingUnits[name]['total']);

  return (s45 - s167 - s168 + (s154 - s166) - s46) / s02;
};

const cashExpendituresPerAvgAdultAttendee_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]['total']);

  return (s45 - s167 - s168 + (s154 - s166) - s46) / s01;
};

const totalGlobalAndLocalOutreachExpenses_weightedAverage = (data, name) => {
  const s14 = getSumOfArray(data.localOutreachExpense[name]['total']);
  const s15 = getSumOfArray(data.globalOutreachExpense[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return (s14 + s15) / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const globalOutreachExpenses_weightedAverage = (data, name) => {
  const s15 = getSumOfArray(data.globalOutreachExpense[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return s15 / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const localOutreachExpenses_weightedAverage = (data, name) => {
  const s14 = getSumOfArray(data.localOutreachExpense[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return s14 / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const personnelIncludingToTotalCashExpenditures_weightedAverage = (
  data,
  name
) => {
  const s11 = getSumOfArray(data.totalBenefit[name]['total']);
  const s10 = getSumOfArray(data.totalSalaries[name]['total']);
  const s162 = getSumOfArray(data.costOfOutsourcedEmployee[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return (s11 + s10 + s162) / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const mandatoryDebtServiceToCashExpenditure_weightedAverage = (data, name) => {
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s47 = getSumOfArray(data.cyInterestExpense[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return (
    (s154 - s166 + (s47 - s168)) / (s45 - s167 - s168 + (s154 - s166) - s46)
  );
};

const personnelToCashExpenditure_weightedAverage = (data, name) => {
  const s11 = getSumOfArray(data.totalBenefit[name]['total']);
  const s10 = getSumOfArray(data.totalSalaries[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return (s11 + s10) / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const salariesBenefitsIncludingOutsourcedEmployees_weightedAverage = (
  data,
  name
) => {
  // console.log(data, name);

  const s10 = getSumOfArray(data.totalSalaries[name]['total']);
  const s11 = getSumOfArray(data.totalBenefit[name]['total']);
  const s162 = getSumOfArray(data.costOfOutsourcedEmployee[name]['total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]['total']);
  const s157 = getSumOfArray(data.totalOutsourcedEmployee[name]['total']);

  return (s10 + s11 + s162) / (s151 + s157);
};

const salariesBenefits_weightedAverage = (data, name) => {
  const s10 = getSumOfArray(data.totalSalaries[name]['total']);
  const s11 = getSumOfArray(data.totalBenefit[name]['total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]['total']);

  return (s10 + s11) / s151;
};

const benefits_weightedAverage = (data, name) => {
  const s11 = getSumOfArray(data.totalBenefit[name]['total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]['total']);

  return s11 / s151;
};

const salaries_weightedAverage = (data, name) => {
  // console.log(data, name);
  const s10 = getSumOfArray(data.totalSalaries[name]['total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]['total']);

  return s10 / s151;
};

const benefitsToSalaries_weightedAverage = (data, name) => {
  const s11 = getSumOfArray(data.totalBenefit[name]['total']);
  const s10 = getSumOfArray(data.totalSalaries[name]['total']);

  return s11 / s10;
};

const totalContributionsPerGivingUnit_weightedAverage = (data, name) => {
  const s40 = getSumOfArray(data.totalContributions[name]['total']);
  const s44 = getSumOfArray(data.revenueFromPledge[name]['total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]['total']);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name]['total']);
  const s02 = getSumOfArray(data.givingUnits[name]['total']);

  return (s40 - s44 - (s152 + s153)) / s02;
};

const totalContributionsPerAverageAdultAttendee_weightedAverage = (
  data,
  name
) => {
  const s40 = getSumOfArray(data.totalContributions[name]['total']);
  const s44 = getSumOfArray(data.revenueFromPledge[name]['total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]['total']);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name]['total']);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]['total']);

  return (s40 - s44 - (s152 + s153)) / s01;
};

const contributionsWithoutDonorPerGivingUnit_weightedAverage = (data, name) => {
  // console.log(data, name);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]['total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]['total']);
  const s02 = getSumOfArray(data.givingUnits[name]['total']);

  return (s39 - s152) / s02;
};

const contributionsWithoutDonorPerAverageAdultAttendee_weightedAverage = (
  data,
  name
) => {
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]['total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]['total']);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]['total']);

  console.log({ s39, s152, s01});
  return (s39 - s152) / s01;
};

const netIncomeRatio_weightedAverage = (data, name) => {
  const s48 = getSumOfArray(data.changeInNetAssetWithout[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s41 = getSumOfArray(data.totalContributionWithout[name]['total']);

  return (s48 + s167 + s168) / s41;
};

const debtPerGivingUnit_standard_weightedAverage = (data, name) => {
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]['total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]['total']);
  const s02 = getSumOfArray(data.givingUnits[name]['total']);
  // console.log({s39, s152, s02});

  return ((s39 - s152) / s02) * 2;
};

const debtPerGivingUnit_weightedAverage = (data, name) => {
  const s155 = getSumOfArray(data.totalDebt[name]['total']);
  const s165 = getSumOfArray(data.financeLeaseRightOfUse[name]['total']);
  const s02 = getSumOfArray(data.givingUnits[name]['total']);

  return (s155 - s165) / s02;
};

const debtPerAverageAdultAttendee_standard_weightedAverage = (data, name) => {
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]['total']);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]['total']);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]['total']);

  return ((s39 - s152) / s01) * 2;
};

const debtPerAverageAdultAttendee_weightedAverage = (data, name) => {
  const s155 = getSumOfArray(data.totalDebt[name]['total']);
  const s165 = getSumOfArray(data.financeLeaseRightOfUse[name]['total']);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]['total']);

  return (s155 - s165) / s01;
};

const mandatoryDebtServiceToContributionsWithout_weightedAverage = (
  data,
  name
) => {
  // console.log(data, name);

  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s47 = getSumOfArray(data.cyInterestExpense[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s51 = getSumOfArray(data.capitalizedInterest[name]['total']);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]['total']);

  return (s154 - s166 + (s47 - s168) + s51) / s39;
};

const currentRatio_weightedAverage = (data, name) => {
  const s17 = getSumOfArray(data.currentAssets[name]['total']);
  const s26 = getSumOfArray(data.currentLiabilities[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);

  return s17 / (s26 - s166);
};

const debtToContributionsWithout_weightedAverage = (data, name) => {
  const s155 = getSumOfArray(data.totalDebt[name]['total']);
  const s165 = getSumOfArray(data.financeLeaseRightOfUse[name]['total']);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]['total']);

  return (s155 - s165) / s39;
};

const debtCoverage_weightedAverage = (data, name) => {
  const s48 = getSumOfArray(data.changeInNetAssetWithout[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s47 = getSumOfArray(data.cyInterestExpense[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);

  return (
    (s48 + s167 + s168 + (s47 - s168) + s46) / (s154 - s166 + (s47 - s168))
  );
};

const netCashAvailability_standard_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return ((s45 - s167 - s168) - s46) / 12;
};

const netCashAvailability_including_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]['total']);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]['total']);
  const s26 = getSumOfArray(data.currentLiabilities[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name]['total']);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]['total']);
  const s21 = getSumOfArray(data.pledgeReceivable[name]['total']);
  const s30 = getSumOfArray(data.availableOperatingLineOfCredit[name]['total']);

  return (s18 - ((s26 - s166 ) - s31) - s36) + s21 + s30
};

const netCashAvailability_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]['total']);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]['total']);
  const s26 = getSumOfArray(data.currentLiabilities[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name]['total']);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]['total']);
  const s21 = getSumOfArray(data.pledgeReceivable[name]['total']);

  // console.log({s18, s20, s26, s166, s31, s36, s21})

  return s18 + s20 - ((s26 - s166) - s31) - s36 + s21
};

const liquidityRatio_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]['total']);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]['total']);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]['total']);
  const s21 = getSumOfArray(data.pledgeReceivable[name]['total']);
  const s26 = getSumOfArray(data.currentLiabilities[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);
  const s27 = getSumOfArray(data.accruedInterest[name]['total']);
  const s28 = getSumOfArray(data.accruedConstructionCost[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s164 = getSumOfArray(data.oneTimePayoffDebtDueNextYear[name]['total']);
  const s29 = getSumOfArray(data.deferredRevenue[name]['total']);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name]['total']);

  return (
    (s18 + s20 - s36 + s21) /
    (s26 - s166 - (s27 + s28 + (s154 - s166) + s164) - s29 - s31)
  );
};

const availableDaysOfCashFlow_weightedAverage = (data, name) => {
  const s49 = getSumOfArray(data.cashFlowFromOperatingActivities[name]['total']);
  const s318 = getSumOfArray(data.totalCashAtBeginningYear[name]['total']);
  const s320 = getSumOfArray(data.nonEndowmentInvestmentBeginningYear[name]['total']);
  const s336 = getSumOfArray(data.netAssetWithDonorRestriction[name]['total']);
  const s321 = getSumOfArray(data.pledgeReceivableBeginningYear[name]['total']);
  const s30 = getSumOfArray(data.availableOperatingLineOfCredit[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);

  return (
    ((s49 + s318 + s320 - s336 + s321 + s30) /
      (s45 - s167 - s168 - s46 + (s154 - s166))) *
    365
  );
};

const daysOperatingCash_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]['total']);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]['total']);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]['total']);
  const s21 = getSumOfArray(data.pledgeReceivable[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]['total']);
  const s51 = getSumOfArray(data.capitalizedInterest[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]['total']);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]['total']);

  return (
    ((s18 + s20 - s36 + s21) /
      (s45 - s167 - s168 + (s51 - s46) + (s154 - s166))) *
    365
  );
};

const daysExpendableNetAssets_weightedAverage = (data, name) => {
  const s35 = getSumOfArray(data.bodDesignatedForOperations[name]['total']);
  const s34 = getSumOfArray(data.netAssetWithoutDonorRestriction[name]['total']);
  const s45 = getSumOfArray(data.totalExpense[name]['total']);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s168 = getSumOfArray(data.amortizationFinanceLease[name]['total']);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]['total']);

  return ((s35 + s34) / (s45 - s167 - s168 - s46)) * 365;
};

const attendeesToStaff_weightedAverage = (data, name) => {
  // console.log('attendeesToStaff_weightedAverage', data, name);
  const s150 = getSumOfArray(data.totalAttendees[name]['total']);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]['total']);

  return s150 / s151;
};

const percentContributionsOnline_weightedAverage = (data, name) => {
  const s163 = getSumOfArray(data.totalContributionOnline[name]['total']);
  const s40 = getSumOfArray(data.totalContributions[name]['total']);

  return s163 / s40;
};
