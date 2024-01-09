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
    default:
      return;
  }
};

const netCashAvailability_standard_weightedAverage = (data, name) => {
  const s45 = getSumOfArray(data.totalExpense[name]);
  const s167 = getSumOfArray(data.amortizationFinanceLease[name]);
  const s168 = getSumOfArray(data.internetOnFinanceLease[name]);
  const s46 = getSumOfArray(data.totalDepreciationExpense[name]);

  return (s45 - s167 - s168 - s46) / 12;
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

  return s18 + s20 - (s26 - s166 - s31) - s36 + s21 + s30;
};

const netCashAvailability_weightedAverage = (data, name) => {
  const s18 = getSumOfArray(data.totalCash[name]);
  const s20 = getSumOfArray(data.nonEndowmentInvestment[name]);
  const s26 = getSumOfArray(data.currentLiabilities[name]);
  const s166 = getSumOfArray(data.futureMinimumLeasePayment[name]);
  const s31 = getSumOfArray(data.shortTermConstructionLineOfCredit[name]);
  const s36 = getSumOfArray(data.netAssetWithDonor[name]);
  const s21 = getSumOfArray(data.pledgeReceivable[name]);

  return s18 + s20 - (s26 - s166 - s31) - s36 + s21;
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
    (s49 + s318 + s320 - s336 + s321 + s30) /
    (s45 - s167 - s168 - s46 + (s154 - s166))
  ) * 365;
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

  return ((s35 + s34 )/ (s45 - s167 - s168 - s46)) * 365;
};

const attendeesToStaff_weightedAverage = (data, name) => {
  const s150 = getSumOfArray(data.totalAttendees[name]);
  const s151 = getSumOfArray(data.fullTimeEquivalents[name]);

  return s150 / s151;
};

const percentContributionsOnline_weightedAverage = (data, name) => {
  const s163 = getSumOfArray(data.totalContributionOnline[name]);
  const s40 = getSumOfArray(data.totalContributions[name]);

  return s163 / s40;
};
