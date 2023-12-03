const getWeightedAverageOfArray = (name, data) => {
  switch (name) {
    case 'studentsFacilityRatio':
      return studentsFacilityRatio_weightedAverage(data);
    case 'expendableReserves_inDays':
      return expendableReservesInDays_weightedAverage(data);
    case 'expendableReserves_Percent':
        return expendableReservesPercent_weightedAverage(data);
    case 'cashAvailableDeferred':
        return cashAvailableDeferred_weightedAverage(data);
    case 'liquidityRatio':
        return liquidityRatio_weightedAverage(data);
    case 'netCashUsedOperating_overUnderBench':
        return netCashUsedOperating_overUnderBenchmark_weightedAverage(data);
    default:
      return;
  }
};

const netCashUsedOperating_overUnderBenchmark_weightedAverage = (data) => {
    // [47] 05-01 Cash Flows from Operating Activities - [19] 02-07 Depreciation expense on 3 to 7 year assets only


}

const studentsFacilityRatio_weightedAverage = (data) => {
  // console.log(data);
  let numFullTime = getSumOfArray(data.fullTimeTeachers_Peer['total']);
  let numPartTime = getSumOfArray(data.partTimeTeachers_Peer['total']);
  let numStudents = getSumOfArray(data.studentAverageEnrollment_Main['total']);

  return (numFullTime + 0.5 * numPartTime) / numStudents;
};

const expendableReservesInDays_weightedAverage = (data) => {
//   console.log(data);
  let numTotalUnrestricted = getSumOfArray(data.unrestrictedNetAssets['total']);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet['total']
  );
  let numTotalDebt = getSumOfArray(data.totalDebt['total']);
  let numTotalExpense = getSumOfArray(data.totalExpense['total']);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense['total']
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

const expendableReservesPercent_weightedAverage = (data) => {
    let numTotalUnrestricted = getSumOfArray(data.unrestrictedNetAssets['total']);
    let numLandBuildingsEquipmentNet = getSumOfArray(
      data.landBuildingsEquipmentNet['total']
    );
    let numTotalDebt = getSumOfArray(data.totalDebt['total']);
    let numTotalExpense = getSumOfArray(data.totalExpense['total']);
    let numTotalDepreciationExpense = getSumOfArray(
      data.totalDepreciationExpense['total']
    );

    let numIf =
    numLandBuildingsEquipmentNet - numTotalDebt < 0
      ? 0
      : numLandBuildingsEquipmentNet - numTotalDebt;

    return ((numTotalUnrestricted - numIf) / (numTotalExpense - numTotalDepreciationExpense))

}

const cashAvailableDeferred_weightedAverage = (data) => {
    // ( ([21] 03-02 Total Cash  + [22] 03-03 Non-Endowment Investments - [29] 03-10 Deferred Revenue ) / [29] 03-10 Deferred Revenue

    let numTotalCash = getSumOfArray(data.totalCash['total']);
    let numNonEndowmentInvestments = getSumOfArray(data.nonEndowmentInvestments['total']);
    let numDeferredRevenue = getSumOfArray(data.deferredRevenue['total']);

    return (numTotalCash + numNonEndowmentInvestments - numDeferredRevenue) / numDeferredRevenue
}

const liquidityRatio_weightedAverage = (data) => {

    let numTotalCash = getSumOfArray(data.totalCash['total']);
    let numNonEndowmentInvestments = getSumOfArray(data.nonEndowmentInvestments['total']);
    let numCurrentLiabilities = getSumOfArray(data.currentLiabilities['total']);
    let numDeferredRevenue = getSumOfArray(data.deferredRevenue['total']);

    return (numTotalCash + numNonEndowmentInvestments) / (numCurrentLiabilities - numDeferredRevenue)

}