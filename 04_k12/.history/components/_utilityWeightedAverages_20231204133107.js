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
    default:
      return;
  }
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
  // console.log(data);
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
