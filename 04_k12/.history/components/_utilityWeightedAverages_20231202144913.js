const getWeightedAverageOfArray = (name, data) => {
  switch (name) {
    case 'studentsFacilityRatio':
      return studentsFacilityRatio_weightedAverage(data);
    case 'expendableReserves_inDays':
      return expendableReservesInDays_weightedAverage(data);
    case 'expendableReserves_Percent':
        return expendableReservesPercent_weightedAverage(data);
    default:
      return;
  }
};

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

    // ([31] 03-12 Total Unrestricted Net Assets - (IF [27] 03-08 Land, Buildings and Equipment, net - [30] 03-11 Total Debt <0,0, [27] 03-08 Land, Buildings and Equipment, net - [30] 03-11 Total Debt) )/ 
    // ([41] 04-08 Total Expenses - [42] 04-09 Total Depreciation Expense)

    let numIf =
    numLandBuildingsEquipmentNet - numTotalDebt < 0
      ? 0
      : numLandBuildingsEquipmentNet - numTotalDebt;

    return ((numTotalUnrestricted - numIf) / (numTotalExpense - numTotalDepreciationExpense))

}
