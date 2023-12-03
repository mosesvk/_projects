const getWeightedAverageOfArray = (data, name) => {
    console.log(data, name);
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
    default:
      return;
  }
};

const netCashUsedOperating_overUnderBenchmark_weightedAverage = (data, name) => {
    // [47] 05-01 Cash Flows from Operating Activities - [19] 02-07 Depreciation expense on 3 to 7 year assets only




}

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

    return ((numTotalUnrestricted - numIf) / (numTotalExpense - numTotalDepreciationExpense))

}

const cashAvailableDeferred_weightedAverage = (data, name) => {
    // ( ([21] 03-02 Total Cash  + [22] 03-03 Non-Endowment Investments - [29] 03-10 Deferred Revenue ) / [29] 03-10 Deferred Revenue

    let numTotalCash = getSumOfArray(data.totalCash[name]);
    let numNonEndowmentInvestments = getSumOfArray(data.nonEndowmentInvestments[name]);
    let numDeferredRevenue = getSumOfArray(data.deferredRevenue[name]);

    return (numTotalCash + numNonEndowmentInvestments - numDeferredRevenue) / numDeferredRevenue
}

const liquidityRatio_weightedAverage = (data, name) => {

    let numTotalCash = getSumOfArray(data.totalCash[name]);
    let numNonEndowmentInvestments = getSumOfArray(data.nonEndowmentInvestments[name]);
    let numCurrentLiabilities = getSumOfArray(data.currentLiabilities[name]);
    let numDeferredRevenue = getSumOfArray(data.deferredRevenue[name]);

    return (numTotalCash + numNonEndowmentInvestments) / (numCurrentLiabilities - numDeferredRevenue)

}