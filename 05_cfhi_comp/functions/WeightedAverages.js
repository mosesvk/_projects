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
  const s13 = getSumOfArray(data.itCost[name]);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]);

  return s13 / s151;
}

const facilityCostPerSquareFootIncluding_greaterThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]);
  const s47 = getSumOfArray(data.cyInterestExpense[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]);
  
  return (s12 + (s47 - s168) + (s154 - s166)) / s08;
}
const facilityCostPerSquareFootIncluding_lessThanTen_weightedAverage = (
  data,
  name
) => {
const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]);
const s47 = getSumOfArray(data.cyInterestExpense[name]);
const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]);

return (s12 + (s47 - s168) + (s154 - s166)) / s08;


}

const facilityCostPerSquareFootExcluding_greaterThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]);
  const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]);

  return s12 / s08;

}

const facilityCostPerSquareFootExcluding_lessThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]);
  const s08 = getSumOfArray(data.totalFacilitySquareFootage[name]);

  return s12 / s08;
}

const facilitiesExpenseToTotalCashExpenditures_greaterThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);
        
  return s12 / (s45 - s167 - s168 + (s154 - s166) - s46);

}

const facilitiesExpenseToTotalCashExpenditures_lessThanTen_weightedAverage = (
  data,
  name
) => {
  const s12 = getSumOfArray(data.totalMaintenanceOccupancyCost[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return s12 / (s45 - s167 - s168 + (s154 - s166) - s46);

}

const expensesPerAccountingFTE_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s158 = getSumOfArray(data.averageAnnualAccountingDepartment[name]);
  const s159 = getSumOfArray(data.accountingDepartmentPartTimeEmployee[name]);
  const s160 = getSumOfArray(data.accountingDepartmentVolunteer[name]);

  return (s45 - s167 - s168) / (s158 + s159 + s160);
}

const contributionsPerAccountingFTE_weightedAverage = (data, name) => {
  const s40 = getSumOfArray(data.totalContributions[name]);
  const s44 = getSumOfArray(data.revenueFromPledge[name]);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name]);

  const s158 = getSumOfArray(data.averageAnnualAccountingDepartment[name]);
  const s159 = getSumOfArray(data.accountingDepartmentPartTimeEmployee[name]);
  const s160 = getSumOfArray(data.accountingDepartmentVolunteer[name]);

  return (s40 - s44 - (s152 + s153)) / (s158 + s159 + s160);
};

const cashExpendituresPerGivingUnit_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return (s45 - s167 - s168 + (s154 - s166) - s46) / s02;
};

const cashExpendituresPerAvgAdultAttendee_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]);

  return (s45 - s167 - s168 + (s154 - s166) - s46) / s01;
};

const totalGlobalAndLocalOutreachExpenses_weightedAverage = (data, name) => {
  const s14 = getSumOfArray(data.localOutreachExpense[name]);
  const s15 = getSumOfArray(data.globalOutreachExpense[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return (s14 + s15) / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const globalOutreachExpenses_weightedAverage = (data, name) => {
  const s15 = getSumOfArray(data.globalOutreachExpense[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return s15 / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const localOutreachExpenses_weightedAverage = (data, name) => {
  const s14 = getSumOfArray(data.localOutreachExpense[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return s14 / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const personnelIncludingToTotalCashExpenditures_weightedAverage = (
  data,
  name
) => {
  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s10 = getSumOfArray(data.totalSalaries[name]);
  const s162 = getSumOfArray(data.costOfOutsourcedEmployee[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return (s11 + s10 + s162) / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const mandatoryDebtServiceToCashExpenditure_weightedAverage = (data, name) => {
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s47 = getSumOfArray(data.cyInterestExpense[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return (
    (s154 - s166 + (s47 - s168)) / (s45 - s167 - s168 + (s154 - s166) - s46)
  );
};

const personnelToCashExpenditure_weightedAverage = (data, name) => {
  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s10 = getSumOfArray(data.totalSalaries[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return (s11 + s10) / (s45 - s167 - s168 + (s154 - s166) - s46);
};

const salariesBenefitsIncludingOutsourcedEmployees_weightedAverage = (
  data,
  name
) => {
  // console.log(data, name);

  const s10 = getSumOfArray(data.totalSalaries[name]);
  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s162 = getSumOfArray(data.costOfOutsourcedEmployee[name]);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]);
  const s157 = getSumOfArray(data.totalOutsourcedEmployee[name]);

  return (s10 + s11 + s162) / (s151 + s157);
};

const salariesBenefits_weightedAverage = (data, name) => {
  const s10 = getSumOfArray(data.totalSalaries[name]);
  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]);

  return (s10 + s11) / s151;
};

const benefits_weightedAverage = (data, name) => {
  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]);

  return s11 / s151;
};

const salaries_weightedAverage = (data, name) => {
  // console.log(data, name);
  const s10 = getSumOfArray(data.totalSalaries[name]);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]);

  return s10 / s151;
};

const benefitsToSalaries_weightedAverage = (data, name) => {
  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s10 = getSumOfArray(data.totalSalaries[name]);

  return s11 / s10;
};

const totalContributionsPerGivingUnit_weightedAverage = (data, name) => {
  const s40 = getSumOfArray(data.totalContributions[name]);
  const s44 = getSumOfArray(data.revenueFromPledge[name]);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return (s40 - s44 - (s152 + s153)) / s02;
};

const totalContributionsPerAverageAdultAttendee_weightedAverage = (
  data,
  name
) => {
  const s40 = getSumOfArray(data.totalContributions[name]);
  const s44 = getSumOfArray(data.revenueFromPledge[name]);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]);
  const s153 = getSumOfArray(data.largeOneTimeGiftWithDonor[name]);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]);

  return (s40 - s44 - (s152 + s153)) / s01;
};

const contributionsWithoutDonorPerGivingUnit_weightedAverage = (data, name) => {
  // console.log(data, name);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return (s39 - s152) / s02;
};

const contributionsWithoutDonorPerAverageAdultAttendee_weightedAverage = (
  data,
  name
) => {
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]);

  console.log({ s39, s152, s01});
  return (s39 - s152) / s01;
};

const netIncomeRatio_weightedAverage = (data, name) => {
  const s48 = getSumOfArray(data.changeInNetAssetWithout[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s41 = getSumOfArray(data.totalContributionWithout[name]);

  return (s48 + s167 + s168) / s41;
};

const debtPerGivingUnit_standard_weightedAverage = (data, name) => {
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);
  // console.log({s39, s152, s02});

  return ((s39 - s152) / s02) * 2;
};

const debtPerGivingUnit_weightedAverage = (data, name) => {
  const s155 = getSumOfArray(data.totalDebt[name]);
  const s165 = getSumOfArray(data.financeLeaseRightOfUse[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return (s155 - s165) / s02;
};

const debtPerAverageAdultAttendee_standard_weightedAverage = (data, name) => {
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);
  const s152 = getSumOfArray(data.largeOneTimeGiftWithoutDonor[name]);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]);

  return ((s39 - s152) / s01) * 2;
};

const debtPerAverageAdultAttendee_weightedAverage = (data, name) => {
  const s155 = getSumOfArray(data.totalDebt[name]);
  const s165 = getSumOfArray(data.financeLeaseRightOfUse[name]);
  const s01 = getSumOfArray(data.averageAdultAttendees[name]);

  return (s155 - s165) / s01;
};

const mandatoryDebtServiceToContributionsWithout_weightedAverage = (
  data,
  name
) => {
  // console.log(data, name);

  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s47 = getSumOfArray(data.cyInterestExpense[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s51 = getSumOfArray(data.capitalizedInterest[name]);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);

  return (s154 - s166 + (s47 - s168) + s51) / s39;
};

const currentRatio_weightedAverage = (data, name) => {
  const s17 = getSumOfArray(data.currentAssets[name]);
  const s26 = getSumOfArray(data.currentLiabilities[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);

  return s17 / (s26 - s166);
};

const debtToContributionsWithout_weightedAverage = (data, name) => {
  const s155 = getSumOfArray(data.totalDebt[name]);
  const s165 = getSumOfArray(data.financeLeaseRightOfUse[name]);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);

  return (s155 - s165) / s39;
};

const debtCoverage_weightedAverage = (data, name) => {
  const s48 = getSumOfArray(data.changeInNetAssetWithout[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s47 = getSumOfArray(data.cyInterestExpense[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);

  return (
    (s48 + s167 + s168 + (s47 - s168) + s46) / (s154 - s166 + (s47 - s168))
  );
};

const netCashAvailability_standard_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return ((s45 - s167 - s168) - s46) / 12;
};

const netCashAvailability_including_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]);
  const s26 = getSumOfArray(data.currentLiabilities[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name]);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]);
  const s21 = getSumOfArray(data.pledgeReceivable[name]);
  const s30 = getSumOfArray(data.availableOperatingLineOfCredit[name]);

  return (s18 - ((s26 - s166 ) - s31) - s36) + s21 + s30
};

const netCashAvailability_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]);
  const s26 = getSumOfArray(data.currentLiabilities[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name]);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]);
  const s21 = getSumOfArray(data.pledgeReceivable[name]);

  // console.log({s18, s20, s26, s166, s31, s36, s21})

  return s18 + s20 - ((s26 - s166) - s31) - s36 + s21
};

const liquidityRatio_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]);
  const s21 = getSumOfArray(data.pledgeReceivable[name]);
  const s26 = getSumOfArray(data.currentLiabilities[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s27 = getSumOfArray(data.accruedInterest[name]);
  const s28 = getSumOfArray(data.accruedConstructionCost[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s164 = getSumOfArray(data.oneTimePayoffDebtDueNextYear[name]);
  const s29 = getSumOfArray(data.deferredRevenue[name]);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name]);

  return (
    (s18 + s20 - s36 + s21) /
    (s26 - s166 - (s27 + s28 + (s154 - s166) + s164) - s29 - s31)
  );
};

const availableDaysOfCashFlow_weightedAverage = (data, name) => {
  const s49 = getSumOfArray(data.cashFlowFromOperatingActivities[name]);
  const s318 = getSumOfArray(data.totalCashAtBeginningYear[name]);
  const s320 = getSumOfArray(data.nonEndowmentInvestmentBeginningYear[name]);
  const s336 = getSumOfArray(data.netAssetWithDonorRestriction[name]);
  const s321 = getSumOfArray(data.pledgeReceivableBeginningYear[name]);
  const s30 = getSumOfArray(data.availableOperatingLineOfCredit[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);

  return (
    ((s49 + s318 + s320 - s336 + s321 + s30) /
      (s45 - s167 - s168 - s46 + (s154 - s166))) *
    365
  );
};

const daysOperatingCash_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]);
  const s21 = getSumOfArray(data.pledgeReceivable[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s51 = getSumOfArray(data.capitalizedInterest[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);
  const s154 = getSumOfArray(data.requiredMinimumDebtPrinciple[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);

  return (
    ((s18 + s20 - s36 + s21) /
      (s45 - s167 - s168 + (s51 - s46) + (s154 - s166))) *
    365
  );
};

const daysExpendableNetAssets_weightedAverage = (data, name) => {
  const s35 = getSumOfArray(data.bodDesignatedForOperations[name]);
  const s34 = getSumOfArray(data.netAssetWithoutDonorRestriction[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return ((s35 + s34) / (s45 - s167 - s168 - s46)) * 365;
};

const attendeesToStaff_weightedAverage = (data, name) => {
  // console.log(data, name);
  const s150 = getSumOfArray(data.totalAttendees[name]);
  const s151 = getSumOfArray(data.fullTimeEquivalent[name]);

  return s150 / s151;
};

const percentContributionsOnline_weightedAverage = (data, name) => {
  const s163 = getSumOfArray(data.totalContributionOnline[name]);
  const s40 = getSumOfArray(data.totalContributions[name]);

  return s163 / s40;
};
