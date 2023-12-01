const getWeightedAverageOfArray = (name, dataTable) => {
    const data =  parseStoredData(getStoredData(dataTable))
    // console.log(name, dataTable);
  switch (name) {
    case 'studentsFacilityRatio':
      return studentsFacilityRatio_weightedAverage(data);
    case 'expendableReserves_inDays':
      return expendableReservesInDays_weightedAverage(data);
    default:
      return;
  }
};

const studentsFacilityRatio_weightedAverage = (data) => {
    console.log(data);
  let numFullTime = getSumOfArray(data.fullTimeTeachers_Peer['total']);
  let numPartTime = getSumOfArray(data.partTimeTeachers_Peer['total']);
  let numStudents = getSumOfArray(data.studentAverageEnrollment_Main['total']);

  return (numFullTime + 0.5 * numPartTime) / numStudents;
};

const expendableReservesInDays_weightedAverage = (data) => {
  let numTotalUnrestricted = getSumOfArray(data.unrestrictedNetAssets['total']);
  let numLandBuildingsEquipmentNet = getSumOfArray(
    data.landBuildingsEquipmentNet['total']
  );
  let numTotalDebt = getSumOfArray(data.totalDebt['total']);
  let numTotalDepreciationExpense = getSumOfArray(
    data.totalDepreciationExpense['total']
  );
};
