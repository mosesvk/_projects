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
  const s18Array = data.totalCash && data.totalCash[name] && data.totalCash[name][yearKey] 
    ? data.totalCash[name][yearKey] 
    : [];
  const s20Array = data.nonEndowmentInvestment && data.nonEndowmentInvestment[name] && data.nonEndowmentInvestment[name][yearKey]
    ? data.nonEndowmentInvestment[name][yearKey]
    : [];
  const s36Array = data.netAssetWithDonorRestriction && data.netAssetWithDonorRestriction[name] && data.netAssetWithDonorRestriction[name][yearKey]
    ? data.netAssetWithDonorRestriction[name][yearKey]
    : [];
  const s45Array = data.totalExpense && data.totalExpense[name] && data.totalExpense[name][yearKey]
    ? data.totalExpense[name][yearKey]
    : [];
  const s46Array = data.totalDepreciationExpense && data.totalDepreciationExpense[name] && data.totalDepreciationExpense[name][yearKey]
    ? data.totalDepreciationExpense[name][yearKey]
    : [];

  const s18 = getSumOfArray(s18Array);
  const s20 = getSumOfArray(s20Array);
  const s36 = getSumOfArray(s36Array);
  const s45 = getSumOfArray(s45Array);
  const s46 = getSumOfArray(s46Array);

  // Detailed logging for debugging daysOperatingCash weighted average
  console.log("\n%c🔍 DAYS OPERATING CASH WEIGHTED AVERAGE DEBUG (Ratio 1)", "font-size: 14px; font-weight: bold; color: #7c3aed;");
  console.log(`  Name: ${name}, Year: ${yearKey}`);
  console.log(`  s18 (Total Cash) Array (${s18Array.length} values):`, s18Array);
  console.log(`  s18 Sum: $${s18.toLocaleString()}`);
  console.log(`  s20 (Non-Endowment Investment) Array (${s20Array.length} values):`, s20Array);
  console.log(`  s20 Sum: $${s20.toLocaleString()}`);
  console.log(`  s36 (Net Asset w/ Donor Restriction) Array (${s36Array.length} values):`, s36Array);
  console.log(`  s36 Sum: $${s36.toLocaleString()}`);
  console.log(`  s45 (Total Expense) Array (${s45Array.length} values):`, s45Array);
  console.log(`  s45 Sum: $${s45.toLocaleString()}`);
  console.log(`  s46 (Total Depreciation Expense) Array (${s46Array.length} values):`, s46Array);
  console.log(`  s46 Sum: $${s46.toLocaleString()}`);
  
  const numerator = s18 + s20 - s36;
  const denominator = s45 - s46;
  console.log(`  Numerator (s18 + s20 - s36): $${numerator.toLocaleString()}`);
  console.log(`  Denominator (s45 - s46): $${denominator.toLocaleString()}`);
  
  if (denominator === 0 || isNaN(denominator)) {
    console.warn("  ⚠️ Denominator is 0 or NaN - returning 0");
    return 0;
  }

  const result = ((numerator / denominator) * 365);
  console.log(`  Result: (${numerator.toLocaleString()} / ${denominator.toLocaleString()}) * 365 = ${result.toFixed(2)} days`);
  console.log("─".repeat(120));

  return result;
};
