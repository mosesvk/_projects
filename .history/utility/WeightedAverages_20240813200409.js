const getWeightedAverageOfArray = (data, name, year) => {
  // console.log(data, name);
  switch (name) {
    case "adminCostsPerStudent":
      return adminCostsPerStudent_weightedAverage(data, year);
    default:
      return;
  }
};

const adminCostsPerStudent_weightedAverage = (data, year) => {
// ( 
// [C201 sal admin asst]+[C203 FICA admin asst] +[C204 health admin asst]+[C205 disability admin asst] 
// +[C206 retirement admin asst]+[C207 housing admin asst]+[C208 other admin asst]) 
// / 
// ([G025 cTotal Student FTE]+[G035 cTotal Student UHC]) 

const salAdminAsst = getSumOfArray(data.salAdminAsst_Peer[year]);
const ficaAdminAsst = getSumOfArray(data.ficaAdminAsst_Peer[year]);
const healthAdminAsst = getSumOfArray(data.healthAdminAsst_Peer[year]);
const disabilityAdminAsst = getSumOfArray(data.disabilityAdminAsst_Peer[year]);
const retirementAdminAsst = getSumOfArray(data.retirementAdminAsst_Peer[year]);
const housingAdminAsst = getSumOfArray(data.housingAdminAsst_Peer[year]);
const otherAdminAsst = getSumOfArray(data.otherAdminAsst_Peer[year]);
const totalStudentFTE = getSumOfArray(data.totalStudentFTE_Peer[year]);
const totalStudentUHC = getSumOfArray(data.totalStudentUHC_Peer[year]);

return (salAdminAsst + ficaAdminAsst + healthAdminAsst + disabilityAdminAsst + retirementAdminAsst + housingAdminAsst + otherAdminAsst) / (totalStudentFTE + totalStudentUHC);


}

const ageOfFacilities_weightedAverage = (data, name) => {
    // [05.02Land - 06 Accumulated Depreciation]
    // /
    // [04.01FExp - 06 Depreciation and Amortization]

    const accumulatedDepreciation = getSumOfArray(data.accumulatedDepreciation[name]);
    const depreciationAndAmortization = getSumOfArray(data.depreciationAndAmortization[name]);

    return depreciationAndAmortization > 0 ? accumulatedDepreciation / depreciationAndAmortization : 0;
}
