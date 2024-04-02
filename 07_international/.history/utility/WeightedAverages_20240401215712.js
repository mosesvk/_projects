const getWeightedAverageOfArray = (data, name) => {
  // console.log(data, name);
  switch (name) {
    case 'daysCashOnHand':
        return daysCashOnHand_weightedAverage(data, name);
    case 'daysExpensesInUnrestrictedNA':
        return daysExpensesInUnrestrictedNA_weightedAverage(data, name);
    case 'daysExpensesInNAwithDR':
        return daysExpensesInNAwithDR_weightedAverage(data, name);
    case 'daysExpensesInNAwithDR_excludingPPE':
        return daysExpensesInNAwithDR_excludingPPE_weightedAverage(data, name);
    case 'liquidityFundsAvailable':
        return liquidityFundsAvailable_weightedAverage(data, name);
    case 'financialAssetsAvailableFY':
        return financialAssetsAvailableFY_weightedAverage(data, name);
    case 'daysFinancialAssetsOnHand':
        return daysFinancialAssetsOnHand_weightedAverage(data, name);
    case 'currentRatio':
        return currentRatio_weightedAverasge(data, name);
    case 'totalCoverageRatio':
        return totalCoverageRatio_weightedAverage(data, name);
    default:
      return;
  }
};

const totalCoverageRatio_weightedAverage = (data, name) => {
    // [01. 01Ass - 10 Total Assets] 
    // /
    // [01. 02Liab - 05 Total Liabilities]

    const totalAssets = getSumOfArray(data.totalAssets[name]);
    const totalLiabilities = getSumOfArray(data.totalLiabilities[name]);

    return totalAssets / totalLiabilities;
}

const currentRatio_weightedAverage = (data, name) => {
    // (
    //     [01. 01Ass - 10 Total Assets] -
    //     [01. 01Ass - 02 Cash & Cash Equivalents held for Long Term] - 
    //     [01. 01Ass - 03 Investments] - 
    //     [01. 01Ass - 09 Property, plant and equipment]
    // )
    
    // / 
    
    // (
    //     [01. 02Liab - 05 Total Liabilities] - 
    //     [01. 02Liab - 04 Long Term Liabilities] - 
    //     [01. 02Liab - 02 Notes Payable]
    // )

    const totalAssets = getSumOfArray(data.totalAssets[name]);
    const cashAndCashEquivalents = getSumOfArray(data.cashAndCashEquivalents[name]);
    const investments = getSumOfArray(data.investments[name]);
    const propertyPlantAndEquipment = getSumOfArray(data.propertyPlantAndEquipment[name]);
    const totalLiabilities = getSumOfArray(data.totalLiabilities[name]);
    const longTermLiabilities = getSumOfArray(data.longTermLiabilities[name]);
    const notesPayable = getSumOfArray(data.notesPayable[name]);

    return (totalAssets - cashAndCashEquivalents - investments - propertyPlantAndEquipment) / (totalLiabilities - longTermLiabilities - notesPayable);

}

const daysFinancialAssetsOnHand_weightedAverage = (data, name) => {
//     [05.01Liquid - 01 Financial Assets available per Liquidity FN]

// /

// (
//     [02.03Exp - 05 Total Expenses] / 365
// )

const financialAssetsAvailablePerLiquidity = getSumOfArray(data.financialAssetsAvailablePerLiquidity[name]);
const totalExpenses = getSumOfArray(data.totalExpenses[name]);

return financialAssetsAvailablePerLiquidity / (totalExpenses / 365);
}

const financialAssetsAvailableFY_weightedAverage = (data, name) => {
    // [05.01Liquid - 01 Financial Assets available per Liquidity FN]

    // /
    
    // [02.03Exp - 05 Total Expenses]

    const financialAssetsAvailablePerLiquidity = getSumOfArray(data.financialAssetsAvailablePerLiquidity[name]);
    const totalExpenses = getSumOfArray(data.totalExpenses[name]);

    return financialAssetsAvailablePerLiquidity / totalExpenses;
}

const liquidityFundsAvailable_weightedAverage = (data, name) => {
    // (
    //     [01. 01Ass - 10 Total Assets] -
    //     [01. 01Ass - 09 Property, plant and equipment]
    // )
    
    // /
    
    // [01. 02Liab - 05 Total Liabilities]

    const totalAssets = getSumOfArray(data.totalAssets[name]);
    const propertyPlantAndEquipment = getSumOfArray(data.propertyPlantAndEquipment[name]);
    const totalLiabilities = getSumOfArray(data.totalLiabilities[name]);

    return (totalAssets - propertyPlantAndEquipment) / totalLiabilities;
}

const daysExpensesInNAwithDR_excludingPPE_weightedAverage = (data, name) => {
    // (
    //     [01. 03NA - 04 Total Net Assets]-
    //     [01. 01Ass - 09 Property, plant and equipment]-
    //     [01. 02Liab - 02 Notes Payable]
    // )
    
    // /
    // (
    //     [02.03Exp - 05 Total Expenses] / 365
    // )

    const totalNetAssets = getSumOfArray(data.totalNetAssets[name]);
    const propertyPlantAndEquipment = getSumOfArray(data.propertyPlantAndEquipment[name]);
    const notesPayable = getSumOfArray(data.notesPayable[name]);
    const totalExpenses = getSumOfArray(data.totalExpenses[name]);

    return (totalNetAssets - propertyPlantAndEquipment - notesPayable) / (totalExpenses / 365);
}

const daysExpensesInNAwithDR_weightedAverage = (data, name) => {
    // (
    //     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] +
    //     [01. 03NA - 03 Net assets with donor restrictions in perpetuity]
    // )
    
    // /
    
    // (
    //     [02.03Exp - 05 Total Expenses]/365
    // )

    const netAssetsWithDRByPurposeOrTime = getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name]);
    const netAssetsWithDRInPerpetuity = getSumOfArray(data.netAssetsWithDRInPerpetuity[name]);
    const totalExpenses = getSumOfArray(data.totalExpenses[name]);

    return (netAssetsWithDRByPurposeOrTime + netAssetsWithDRInPerpetuity) / (totalExpenses / 365);
}

const daysExpensesInUnrestrictedNA_weightedAverage = (data, name) => {
    // [01. 03NA - 01 Net assets without donor restrictions]
    // /
    // (
    //     [02.03Exp - 05 Total Expenses]
    //     /
    //     365
    // )

    const netAssetsWithoutDR = getSumOfArray(data.netAssetsWithoutDR[name]);
    const totalExpenses = getSumOfArray(data.totalExpenses[name]);

    return netAssetsWithoutDR / (totalExpenses / 365);
}

const daysCashOnHand_weightedAverage = (data, name) => {
    // [01. 01Ass - 01 Cash and Cash Equivalents]
    // /
    // (
    //     ([02.03Exp - 05 Total Expenses]-[04.01FExp - 06 Depreciation and Amortization])
    //     /
    //     365
    // )
    
    const cashAndCashEquivalents = getSumOfArray(data.cashAndCashEquivalents[name]);
    const totalExpenses = getSumOfArray(data.totalExpenses[name]);
    const depreciationAndAmortization = getSumOfArray(data.depreciationAndAmortization[name]);

    return cashAndCashEquivalents / ((totalExpenses - depreciationAndAmortization) / 365);
}