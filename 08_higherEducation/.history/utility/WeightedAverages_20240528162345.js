const getWeightedAverageOfArray = (data, name) => {
  // console.log(data, name);
  switch (name) {
    default:
      return;
  }
};

const ageOfFacilities_weightedAverage = (data, name) => {
    // [05.02Land - 06 Accumulated Depreciation]
    // /
    // [04.01FExp - 06 Depreciation and Amortization]

    const accumulatedDepreciation = getSumOfArray(data.accumulatedDepreciation[name]);
    const depreciationAndAmortization = getSumOfArray(data.depreciationAndAmortization[name]);

    return depreciationAndAmortization > 0 ? accumulatedDepreciation / depreciationAndAmortization : 0;
}
