const getWeightedAverageOfArray = (data, name, year) => {
  // console.log(data, name, year);
  switch (name) {
    case "attendeesToStaff":
      return attendeesToStaff_weightedAverage(data, name);
    case "percentContributionsOnline":
      return percentContributionsOnline_weightedAverage(data, name);
    case "daysExpendableNetAssets":
      return daysExpendableNetAssets_weightedAverage(data, name);
    case "daysOperatingCash":
      return daysOperatingCash_weightedAverage(data, name, year);
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
      return debtToContributionsWithout_weightedAverage(data, name, year);
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
      return debtPerGivingUnit_weightedAverage(data, name, year);
    case "debtPerGivingUnit_standard":
      return debtPerGivingUnit_standard_weightedAverage(data, name);
    case "netIncomeRatio":
      return netIncomeRatio_weightedAverage(data, name);
    case "contributionsWithoutDonorPerAverageAdultAttendee": 
      return contributionsWithoutDonorPerAverageAdultAttendee_weightedAverage(data, name);
    case "contributionsWithoutDonorPerGivingUnit":
      return contributionsWithoutDonorPerGivingUnit_weightedAverage(data, name, year);
    case "contributionsWithoutDonorPerGivingUnit_standard":
      return contributionsWithoutDonorPerGivingUnit_standard_weightedAverage(data, name, year);
    case "totalContributionsPerAverageAdultAttendee":
      return totalContributionsPerAverageAdultAttendee_weightedAverage(data, name);
    case "totalContributionsPerGivingUnit":
      return totalContributionsPerGivingUnit_weightedAverage(data, name, year);
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
      return cashExpendituresPerGivingUnit_weightedAverage(data, name, year);
    case "personnelIncludingToTotalCashExpenditures":
      return personnelIncludingToTotalCashExpenditures_weightedAverage(data, name, year);
    default:
      return;
  }
};

const personnelIncludingToTotalCashExpenditures_weightedAverage = (data, name, year) => {
  const yearKey = year ? year : 'total';
  
  // Safely access nested properties with fallback to empty arrays
  const s10 = data.totalSalaries && data.totalSalaries[name] && data.totalSalaries[name][yearKey]
    ? getSumOfArray(data.totalSalaries[name][yearKey])
    : 0;
  const s162 = data.costOfOutsourcedEmployee && data.costOfOutsourcedEmployee[name] && data.costOfOutsourcedEmployee[name][yearKey]
    ? getSumOfArray(data.costOfOutsourcedEmployee[name][yearKey])
    : 0;
  const s45 = data.totalExpense && data.totalExpense[name] && data.totalExpense[name][yearKey]
    ? getSumOfArray(data.totalExpense[name][yearKey])
    : 0;
  const s46 = data.totalDepreciationExpense && data.totalDepreciationExpense[name] && data.totalDepreciationExpense[name][yearKey]
    ? getSumOfArray(data.totalDepreciationExpense[name][yearKey])
    : 0;

  const denominator = s45 - s46;
  if (denominator === 0 || isNaN(denominator)) {
    return 0;
  }

  return (s10 + s162) / denominator;
}

const cashExpendituresPerGivingUnit_weightedAverage = (data, name, year) => {
  const yearKey = year ? year : 'total';
  
  // Safely access nested properties with fallback to empty arrays
  const s45 = data.totalExpense && data.totalExpense[name] && data.totalExpense[name][yearKey]
    ? getSumOfArray(data.totalExpense[name][yearKey])
    : 0;
  const s46 = data.totalDepreciationExpense && data.totalDepreciationExpense[name] && data.totalDepreciationExpense[name][yearKey]
    ? getSumOfArray(data.totalDepreciationExpense[name][yearKey])
    : 0;
  const s02 = data.givingUnits && data.givingUnits[name] && data.givingUnits[name][yearKey]
    ? getSumOfArray(data.givingUnits[name][yearKey])
    : 0;

  if (s02 === 0 || isNaN(s02)) {
    return 0;
  }

  return (s45 - s46) / s02;
}

/**
 * Weighted average for netCashAvailability_standard (one month of cash expenses).
 * Standard project: (s45 - s46) / 12.
 * @param {Object} data - Data object
 * @param {string} name - Metric name (netCashAvailability_standard)
 * @returns {number}
 */
const netCashAvailability_standard_weightedAverage = (data, name) => {
  const yearKey = 'total';
  const s45 = data.totalExpense && data.totalExpense[name] && data.totalExpense[name][yearKey]
    ? getSumOfArray(data.totalExpense[name][yearKey])
    : 0;
  const s46 = data.totalDepreciationExpense && data.totalDepreciationExpense[name] && data.totalDepreciationExpense[name][yearKey]
    ? getSumOfArray(data.totalDepreciationExpense[name][yearKey])
    : 0;
  const denominator = s45 - s46;
  if (!denominator || isNaN(denominator)) return 0;
  return denominator / 12;
};

/**
 * Weighted average for netCashAvailability. Delegates to netCashAvailability_standard
 * when used in Standard project (same underlying inputs).
 * @param {Object} data - Data object
 * @param {string} name - Metric name
 * @returns {number}
 */
const netCashAvailability_weightedAverage = (data, name) => {
  const v = netCashAvailability_standard_weightedAverage(data, 'netCashAvailability_standard');
  return (v != null && !isNaN(v)) ? v : 0;
};


const benefitsToSalaries_weightedAverage = (data, name) => {

  const s11 = getSumOfArray(data.totalBenefit[name]);
  const s10 = getSumOfArray(data.totalSalaries[name]);

  return s11 / s10;
}

const totalContributionsPerGivingUnit_weightedAverage = (data, name, year) => {
  const yearKey = year ? year : 'total';
  
  // Safely access nested properties with fallback to empty arrays
  const s40 = data.totalContributions && data.totalContributions[name] && data.totalContributions[name][yearKey]
    ? getSumOfArray(data.totalContributions[name][yearKey])
    : 0;
  const s02 = data.givingUnits && data.givingUnits[name] && data.givingUnits[name][yearKey]
    ? getSumOfArray(data.givingUnits[name][yearKey])
    : 0;

  if (s02 === 0 || isNaN(s02)) {
    return 0;
  }

  return s40 / s02;
}



const contributionsWithoutDonorPerGivingUnit_weightedAverage = (data, name, year) => {
  const yearKey = year ? year : 'total';
  
  // Safely access nested properties with fallback to empty arrays
  const s39 = data.contributionWithoutDonor && data.contributionWithoutDonor[name] && data.contributionWithoutDonor[name][yearKey]
    ? getSumOfArray(data.contributionWithoutDonor[name][yearKey])
    : 0;
  const s02 = data.givingUnits && data.givingUnits[name] && data.givingUnits[name][yearKey]
    ? getSumOfArray(data.givingUnits[name][yearKey])
    : 0;

  if (s02 === 0 || isNaN(s02)) {
    return 0;
  }

  return s39 / s02;
}

/**
 * Calculate weighted average for contributionsWithoutDonorPerGivingUnit_standard
 * This is the weighted average of contributionsWithoutDonorPerGivingUnit multiplied by 2
 * @param {Object} data - The data object containing contribution and giving unit data
 * @param {string} name - The name key for accessing data (typically "contributionsWithoutDonorPerGivingUnit_standard")
 * @param {string|number} year - The year key or 'total' for all years
 * @returns {number} - The weighted average multiplied by 2
 */
const contributionsWithoutDonorPerGivingUnit_standard_weightedAverage = (data, name, year) => {
  // Use the same underlying data as contributionsWithoutDonorPerGivingUnit
  // but access it using the base name "contributionsWithoutDonorPerGivingUnit"
  const baseName = "contributionsWithoutDonorPerGivingUnit";
  const weightedAvg = contributionsWithoutDonorPerGivingUnit_weightedAverage(data, baseName, year);
  
  // Multiply by 2 as specified
  return weightedAvg * 2;
}

const debtPerGivingUnit_weightedAverage = (data, name, year) => {
  const yearKey = year ? year : 'total';
  
  // Safely access nested properties with fallback to empty arrays
  const s32 = data.totalDebt && data.totalDebt[name] && data.totalDebt[name][yearKey]
    ? getSumOfArray(data.totalDebt[name][yearKey])
    : 0;
  const s02 = data.givingUnits && data.givingUnits[name] && data.givingUnits[name][yearKey]
    ? getSumOfArray(data.givingUnits[name][yearKey])
    : 0;

  if (s02 === 0 || isNaN(s02)) {
    return 0;
  }

  return s32 / s02;
};


const debtToContributionsWithout_weightedAverage = (data, name, year) => {
  const yearKey = year ? year : 'total';
  
  // Safely access nested properties with fallback to empty arrays
  const s32 = data.totalDebt && data.totalDebt[name] && data.totalDebt[name][yearKey]
    ? getSumOfArray(data.totalDebt[name][yearKey])
    : 0;
  const s39 = data.contributionWithoutDonor && data.contributionWithoutDonor[name] && data.contributionWithoutDonor[name][yearKey]
    ? getSumOfArray(data.contributionWithoutDonor[name][yearKey])
    : 0;

  if (s39 === 0 || isNaN(s39)) {
    return 0;
  }

  return s32 / s39;
};

const daysOperatingCash_weightedAverage = (data, name, year) => {
  const yearKey = year ? year : 'total';
  
  // Safely access nested properties with fallback to empty arrays
  const s18 = data.totalCash && data.totalCash[name] && data.totalCash[name][yearKey]
    ? getSumOfArray(data.totalCash[name][yearKey])
    : 0;
  const s20 = data.nonEndowmentInvestment && data.nonEndowmentInvestment[name] && data.nonEndowmentInvestment[name][yearKey]
    ? getSumOfArray(data.nonEndowmentInvestment[name][yearKey])
    : 0;
  const s36 = data.netAssetWithDonorRestriction && data.netAssetWithDonorRestriction[name] && data.netAssetWithDonorRestriction[name][yearKey]
    ? getSumOfArray(data.netAssetWithDonorRestriction[name][yearKey])
    : 0;
  const s45 = data.totalExpense && data.totalExpense[name] && data.totalExpense[name][yearKey]
    ? getSumOfArray(data.totalExpense[name][yearKey])
    : 0;
  const s46 = data.totalDepreciationExpense && data.totalDepreciationExpense[name] && data.totalDepreciationExpense[name][yearKey]
    ? getSumOfArray(data.totalDepreciationExpense[name][yearKey])
    : 0;

  const denominator = s45 - s46;
  if (denominator === 0 || isNaN(denominator)) {
    return 0;
  }

  return (
    ((s18 + s20 - s36) / denominator) * 365
  );
};
