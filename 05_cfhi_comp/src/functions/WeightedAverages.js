/**
 * Return a weighted average for a given metric name and year.
 * @param {object} data - Parsed peer/client data object.
 * @param {string} name - Metric name (e.g., "givingUnitsToStaff").
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average value or null when missing.
 */
const getWeightedAverageOfArray = (data, name, year) => {
  // console.log(data, name, year);
  if (!data || !name) return null;
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

/**
 * Safely return a metric array by key/name/year.
 * @param {object} data - Parsed data object.
 * @param {string} metricKey - Top-level metric key on data.
 * @param {string} name - Metric name key on metricKey.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {Array|null} Metric array or null when missing.
 */
const getMetricArray = (data, metricKey, name, year) => {
  const yearKey = year ? year : "total";
  if (!data || !data[metricKey] || !data[metricKey][name]) return null;
  return data[metricKey][name][yearKey] ?? null;
};

/**
 * Safely divide numerator by denominator.
 * @param {number} numerator - Numerator value.
 * @param {number} denominator - Denominator value.
 * @returns {number|null} Result or null when denominator is falsy.
 */
const safeDivide = (numerator, denominator) => {
  if (!denominator) return null;
  return numerator / denominator;
};

// Facility and IT helper functions removed per todo

/**
 * Calculate expenses per accounting FTE weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const expensesPerAccountingFTE_weightedAverage = (data, name, year) => {
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s158 = getSumOfArray(
    getMetricArray(data, "averageAnnualAccountingDepartment", name, year)
  );
  const s159 = getSumOfArray(
    getMetricArray(data, "accountingDepartmentPartTimeEmployee", name, year)
  );
  const s160 = getSumOfArray(
    getMetricArray(data, "accountingDepartmentVolunteer", name, year)
  );
  const s94 = getSumOfArray(
    getMetricArray(data, "accountingDeptOutsourcedLabor", name, year)
  );

  const denominator = s158 + s159 + s160 + s94;
  return safeDivide(s45, denominator);
};

/**
 * Calculate contributions per accounting FTE weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const contributionsPerAccountingFTE_weightedAverage = (data, name, year) => {
  const s40 = getSumOfArray(getMetricArray(data, "totalContributions", name, year));
  const s152 = getSumOfArray(
    getMetricArray(data, "largeOneTimeGiftWithoutDonor", name, year)
  );
  const s153 = getSumOfArray(
    getMetricArray(data, "largeOneTimeGiftWithDonor", name, year)
  );
  const s158 = getSumOfArray(
    getMetricArray(data, "averageAnnualAccountingDepartment", name, year)
  );
  const s159 = getSumOfArray(
    getMetricArray(data, "accountingDepartmentPartTimeEmployee", name, year)
  );
  const s160 = getSumOfArray(
    getMetricArray(data, "accountingDepartmentVolunteer", name, year)
  );
  const s94 = getSumOfArray(
    getMetricArray(data, "accountingDeptOutsourcedLabor", name, year)
  );

  const numerator = s40 - (s152 + s153);
  const denominator = s158 + s159 + s160 + s94;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate cash expenditures per giving unit weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const cashExpendituresPerGivingUnit_weightedAverage = (data, name, year) => {
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );
  const s02 = getSumOfArray(getMetricArray(data, "givingUnits", name, year));

  const numerator = (s45 - s167) + (s154 + s90 - s164) - s46;
  return safeDivide(numerator, s02);
};

/**
 * Calculate total global and local outreach expenses weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const totalGlobalAndLocalOutreachExpenses_weightedAverage = (
  data,
  name,
  year
) => {
  const s14 = getSumOfArray(
    getMetricArray(data, "localOutreachExpense", name, year)
  );
  const s15 = getSumOfArray(
    getMetricArray(data, "globalOutreachExpense", name, year)
  );
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );

  const numerator = s14 + s15;
  const denominator = (s45 - s167) + (s154 + s90 - s164) - s46;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate personnel including outsourced to total cash expenditures.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const personnelIncludingToTotalCashExpenditures_weightedAverage = (
  data,
  name,
  year
) => {
  const s11 = getSumOfArray(getMetricArray(data, "totalBenefit", name, year));
  const s10 = getSumOfArray(getMetricArray(data, "totalSalaries", name, year));
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );
  const s162 = getSumOfArray(
    getMetricArray(data, "costOfOutsourcedEmployee", name, year)
  );

  const numerator = s11 + s10 + s162;
  const denominator = (s45 - s167) + (s154 + s90 - s164) - s46;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate mandatory debt service to cash expenditure.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const mandatoryDebtServiceToCashExpenditure_weightedAverage = (
  data,
  name,
  year
) => {
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );
  const s47 = getSumOfArray(
    getMetricArray(data, "cyInterestExpense", name, year)
  );
  const s51 = getSumOfArray(
    getMetricArray(data, "capitalizedInterest", name, year)
  );
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );

  const numerator = (s154 + s90 - s164) + s47 + s51;
  const denominator = s45 - s167 + (s154 + s90 - s164) - s46;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate personnel to cash expenditure.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const personnelToCashExpenditure_weightedAverage = (data, name, year) => {
  const s11 = getSumOfArray(getMetricArray(data, "totalBenefit", name, year));
  const s10 = getSumOfArray(getMetricArray(data, "totalSalaries", name, year));
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );

  const numerator = s11 + s10;
  const denominator = s45 - s167 + (s154 + s90 - s164) - s46;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate salaries and benefits including outsourced employees.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const salariesBenefitsIncludingOutsourcedEmployees_weightedAverage = (
  data,
  name,
  year
) => {
  const s10 = getSumOfArray(getMetricArray(data, "totalSalaries", name, year));
  const s11 = getSumOfArray(getMetricArray(data, "totalBenefit", name, year));
  const s162 = getSumOfArray(
    getMetricArray(data, "costOfOutsourcedEmployee", name, year)
  );
  const s151 = getSumOfArray(
    getMetricArray(data, "fullTimeEquivalent", name, year)
  );
  const s157 = getSumOfArray(
    getMetricArray(data, "totalOutsourcedEmployee", name, year)
  );

  const numerator = s10 + s11 + s162;
  const denominator = s151 + s157;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate salaries and benefits weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const salariesBenefits_weightedAverage = (data, name, year) => {
  const s10 = getSumOfArray(getMetricArray(data, "totalSalaries", name, year));
  const s11 = getSumOfArray(getMetricArray(data, "totalBenefit", name, year));
  const s151 = getSumOfArray(
    getMetricArray(data, "fullTimeEquivalent", name, year)
  );

  const numerator = s10 + s11;
  return safeDivide(numerator, s151);
};

/**
 * Calculate benefits weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const benefits_weightedAverage = (data, name, year) => {
  const s11 = getSumOfArray(getMetricArray(data, "totalBenefit", name, year));
  const s151 = getSumOfArray(
    getMetricArray(data, "fullTimeEquivalent", name, year)
  );

  return safeDivide(s11, s151);
};

/**
 * Calculate salaries weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const salaries_weightedAverage = (data, name, year) => {
  const s10 = getSumOfArray(getMetricArray(data, "totalSalaries", name, year));
  const s151 = getSumOfArray(
    getMetricArray(data, "fullTimeEquivalent", name, year)
  );

  return safeDivide(s10, s151);
};

/**
 * Calculate benefits to salaries weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const benefitsToSalaries_weightedAverage = (data, name, year) => {
  const s11 = getSumOfArray(getMetricArray(data, "totalBenefit", name, year));
  const s10 = getSumOfArray(getMetricArray(data, "totalSalaries", name, year));

  return safeDivide(s11, s10);
};

/**
 * Calculate total contributions per giving unit weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const totalContributionsPerGivingUnit_weightedAverage = (data, name, year) => {
  const s40 = getSumOfArray(getMetricArray(data, "totalContributions", name, year));
  const s152 = getSumOfArray(
    getMetricArray(data, "largeOneTimeGiftWithoutDonor", name, year)
  );
  const s153 = getSumOfArray(
    getMetricArray(data, "largeOneTimeGiftWithDonor", name, year)
  );
  const s02 = getSumOfArray(getMetricArray(data, "givingUnits", name, year));

  const numerator = s40 - (s152 + s153);
  return safeDivide(numerator, s02);
};

/**
 * Calculate contributions without donor per giving unit weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const contributionsWithoutDonorPerGivingUnit_weightedAverage = (
  data,
  name,
  year
) => {
  const s39 = getSumOfArray(
    getMetricArray(data, "contributionWithoutDonor", name, year)
  );
  const s152 = getSumOfArray(
    getMetricArray(data, "largeOneTimeGiftWithoutDonor", name, year)
  );
  const s02 = getSumOfArray(getMetricArray(data, "givingUnits", name, year));

  const numerator = s39 - s152;
  return safeDivide(numerator, s02);
};

/**
 * Calculate net income ratio weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const netIncomeRatio_weightedAverage = (data, name, year) => {
  const s48 = getSumOfArray(
    getMetricArray(data, "changeInNetAssetWithout", name, year)
  );
  const s41 = getSumOfArray(
    getMetricArray(data, "totalContributionWithout", name, year)
  );

  return safeDivide(s48, s41);
};

/**
 * Calculate debt per giving unit standard weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const debtPerGivingUnit_standard_weightedAverage = (data, name, year) => {
  const s39 = getSumOfArray(
    getMetricArray(data, "contributionWithoutDonor", name, year)
  );
  const s152 = getSumOfArray(
    getMetricArray(data, "largeOneTimeGiftWithoutDonor", name, year)
  );
  const s02 = getSumOfArray(getMetricArray(data, "givingUnits", name, year));
  const baseRatio = safeDivide(s39 - s152, s02);

  return baseRatio === null ? null : baseRatio * 2;
};

/**
 * Calculate debt per giving unit weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const debtPerGivingUnit_weightedAverage = (data, name, year) => {
  const s155 = getSumOfArray(getMetricArray(data, "totalDebt", name, year));
  const s02 = getSumOfArray(getMetricArray(data, "givingUnits", name, year));

  return safeDivide(s155, s02);
};

/**
 * Calculate mandatory debt service to contributions without donor.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const mandatoryDebtServiceToContributionsWithout_weightedAverage = (
  data,
  name,
  year
) => {
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s47 = getSumOfArray(
    getMetricArray(data, "cyInterestExpense", name, year)
  );
  const s51 = getSumOfArray(
    getMetricArray(data, "capitalizedInterest", name, year)
  );
  const s39 = getSumOfArray(
    getMetricArray(data, "contributionWithoutDonor", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );

  const numerator = (s154 + s90 - s164) + s47 + s51;
  return safeDivide(numerator, s39);
};

/**
 * Calculate current ratio weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const currentRatio_weightedAverage = (data, name, year) => {
  const s17 = getSumOfArray(getMetricArray(data, "currentAssets", name, year));
  const s26 = getSumOfArray(
    getMetricArray(data, "currentLiabilities", name, year)
  );

  return safeDivide(s17, s26);
};

/**
 * Calculate debt to contributions without donor weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const debtToContributionsWithout_weightedAverage = (data, name, year) => {
  const s155 = getSumOfArray(getMetricArray(data, "totalDebt", name, year));
  const s152 = getSumOfArray(
    getMetricArray(data, "largeOneTimeGiftWithoutDonor", name, year)
  );
  const s39 = getSumOfArray(
    getMetricArray(data, "contributionWithoutDonor", name, year)
  );

  return safeDivide(s155, s39 - s152);
};

/**
 * Calculate debt coverage weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const debtCoverage_weightedAverage = (data, name, year) => {
  const s48 = getSumOfArray(
    getMetricArray(data, "changeInNetAssetWithout", name, year)
  );
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s47 = getSumOfArray(
    getMetricArray(data, "cyInterestExpense", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );

  const numerator = (s48 + s167) + (s47 + s46);
  const denominator = (s154 + s90 - s164) + s47;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate liquidity ratio weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const liquidityRatio_weightedAverage = (data, name, year) => {
  const s18 = getSumOfArray(getMetricArray(data, "totalCash", name, year));
  const s20 = getSumOfArray(
    getMetricArray(data, "nonEndowmentInvestment", name, year)
  );
  const s36 = getSumOfArray(
    getMetricArray(data, "netAssetWithDonor", name, year)
  );
  const s21 = getSumOfArray(getMetricArray(data, "pledgeReceivable", name, year));
  const s26 = getSumOfArray(
    getMetricArray(data, "currentLiabilities", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );
  const s29 = getSumOfArray(
    getMetricArray(data, "deferredRevenue", name, year)
  );
  const s31 = getSumOfArray(
    getMetricArray(data, "shortTermConstructionLineOfCredit", name, year)
  );
  const s91 = getSumOfArray(
    getMetricArray(data, "accountsReceivable", name, year)
  );

  const numerator = s18 + s20 + s91 - s36 + s21;
  const denominator = s26 - s31 - s29 - s164;
  return safeDivide(numerator, denominator);
};

/**
 * Calculate days operating cash weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const daysOperatingCash_weightedAverage = (data, name, year) => {
  const s18 = getSumOfArray(getMetricArray(data, "totalCash", name, year));
  const s20 = getSumOfArray(
    getMetricArray(data, "nonEndowmentInvestment", name, year)
  );
  const s36 = getSumOfArray(getMetricArray(data, "netAssetWithDonor", name, year));
  const s21 = getSumOfArray(getMetricArray(data, "pledgeReceivable", name, year));
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s51 = getSumOfArray(
    getMetricArray(data, "capitalizedInterest", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );
  const s154 = getSumOfArray(
    getMetricArray(data, "requiredMinimumDebtPrinciple", name, year)
  );
  const s90 = getSumOfArray(
    getMetricArray(data, "nextFiscalYearsRefinancedLoanPayments", name, year)
  );
  const s164 = getSumOfArray(
    getMetricArray(data, "oneTimePayoffDebtDueNextYear", name, year)
  );

  const denominator = (s45 - s167 + (s51 - s46) + (s154 + s90 - s164));
  if (!denominator) return null;

  return (((s18 + s20 - s36 + s21) / denominator) * 365);
};

/**
 * Calculate days expendable net assets weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const daysExpendableNetAssets_weightedAverage = (data, name, year) => {
  const s34 = getSumOfArray(
    getMetricArray(data, "netAssetWithoutDonorRestriction", name, year)
  );
  const s92 = getSumOfArray(
    getMetricArray(data, "totalPropertyPlantAndEquipmentNet", name, year)
  );
  const s155 = getSumOfArray(getMetricArray(data, "totalDebt", name, year));
  const s45 = getSumOfArray(getMetricArray(data, "totalExpense", name, year));
  const s167 = getSumOfArray(
    getMetricArray(data, "amortizationFinanceLease", name, year)
  );
  const s46 = getSumOfArray(
    getMetricArray(data, "totalDepreciationExpense", name, year)
  );

  const denominator = (s45 - s167) - s46;
  if (!denominator) return null;

  return (((s34 - s92 + s155) / denominator) * 365);
};

/**
 * Calculate giving units to staff weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const givingUnitsToStaff_weightedAverage = (data, name, year) => {
  // console.log('givingUnitsToStaff_weightedAverage', data, name);
  const s02 = getSumOfArray(getMetricArray(data, "givingUnits", name, year));
  const s151 = getSumOfArray(
    getMetricArray(data, "fullTimeEquivalent", name, year)
  );

  if (!s151) return null;
  return s02 / s151;
};

/**
 * Calculate percent contributions online weighted average.
 * @param {object} data - Parsed data object.
 * @param {string} name - Metric name key.
 * @param {string|number} year - Year key or falsy to use "total".
 * @returns {number|null} Weighted average or null when missing/invalid.
 */
const percentContributionsOnline_weightedAverage = (data, name, year) => {
  const s163 = getSumOfArray(
    getMetricArray(data, "totalContributionOnline", name, year)
  );
  const s40 = getSumOfArray(getMetricArray(data, "totalContributions", name, year));

  return safeDivide(s163, s40);
};
