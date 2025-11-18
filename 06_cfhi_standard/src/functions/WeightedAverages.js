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
      return contributionsWithoutDonorPerAverageAdultAttendee_weightedAverage(data, name);
    case "contributionsWithoutDonorPerGivingUnit":
      return contributionsWithoutDonorPerGivingUnit_weightedAverage(data, name);
    case "contributionsWithoutDonorPerGivingUnit_standard":
      return contributionsWithoutDonorPerGivingUnit_standard(data, name);
    case "totalContributionsPerAverageAdultAttendee":
      return totalContributionsPerAverageAdultAttendee_weightedAverage(data, name);
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
      return salariesBenefitsIncludingOutsourcedEmployees_weightedAverage(data, name);
    case "personnelToCashExpenditure":
      return personnelToCashExpenditure_weightedAverage(data, name);
    case "mandatoryDebtServiceToCashExpenditure":
      return mandatoryDebtServiceToCashExpenditure_weightedAverage(data, name);
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
    case "personnelIncludingToTotalCashExpenditures":
      return personnelIncludingToTotalCashExpenditures_weightedAverage(data, name);
    default:
      return;
  }
};

const personnelIncludingToTotalCashExpenditures_weightedAverage = (data, name) => {
  const s10 = getSumOfArray(data.totalSalaries[name]);
  const s162 = getSumOfArray(data.costOfOutsourcedEmployee[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return (s10 + s162) / (s45 - s46) 
}

const cashExpendituresPerGivingUnit_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return (s45-s46)/s02
}


const benefitsToSalaries_weightedAverage = (data, name) => {

  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s10 = getSumOfArray(data.totalSalaries[name]);

  return s11 / s10;
}

const totalContributionsPerGivingUnit_weightedAverage = (data, name) => {

  const s40 = getSumOfArray(data.totalContributions[name]); 
  const s02 = getSumOfArray(data.givingUnits[name]);

  return  s40 / s02
}



const contributionsWithoutDonorPerGivingUnit_weightedAverage = (data, name) => {
  // console.log(data, name);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return s39/s02
}

const contributionsWithoutDonorPerGivingUnit_standard = (data, name) => {
  // console.log(data, name);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return 2 * (s39 / s02)
}




const debtPerGivingUnit_weightedAverage = (data, name) => {
  const s32 = getSumOfArray(data.totalDebt[name]);
  const s02 = getSumOfArray(data.givingUnits[name]);

  return s32/s02
};


const debtToContributionsWithout_weightedAverage = (data, name) => {
  const s32 = getSumOfArray(data.totalDebt[name]);
  const s39 = getSumOfArray(data.contributionWithoutDonor[name]);

  return s32 / s39
};

const daysOperatingCash_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]);
  const s36 = getSumOfArray(data.netAssetWithDonorRestriction[name]);
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return (
    ((s18 + s20 - s36) / (s45 - s46)) * 365
  );
};
