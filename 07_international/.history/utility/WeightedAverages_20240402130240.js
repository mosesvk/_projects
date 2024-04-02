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
        return currentRatio_weightedAverage(data, name);
    case 'totalCoverageRatio':
        return totalCoverageRatio_weightedAverage(data, name);
    case 'percentWithDR':
        return percentWithDR_weightedAverage(data, name);
    case 'percentWithoutDR_excludingPPE':
        return percentWithoutDR_excludingPPE_weightedAverage(data, name);
    case 'percentWithoutDR':
        return percentWithoutDR_weightedAverage(data, name);
    case 'netIncomeRatio':
        return netIncomeRatio_weightedAverage(data, name);
    case 'contributionsPercentWithoutDR':
        return contributionsPercentWithoutDR_weightedAverage(data, name);
    case 'contributionsPercentWithDR':
        return contributionsPercentWithDR_weightedAverage(data, name);
    case 'contributionsPerGivingUnit':
        return contributionsPerGivingUnit_weightedAverage(data, name);
    case 'contributionsPerMissionaryUnit':
        return contributionsPerMissionaryUnit_weightedAverage(data, name);
    case 'contributionsPerFullTimeEquivalent':
        return contributionsPerFullTimeEquivalent_weightedAverage(data, name);
    case 'fundraisingAsPercentOfContributions':
        return fundraisingAsPercentOfContributions_weightedAverage(data, name);
    default:
      return;
  }
};

const fundraisingAsPercentOfContributions_weightedAverage = (data, name) => {
    // [02.03Exp - 03 Fundraising Expenses]
    // /
    // (
    //     [02.01SR - 01 Contributions without donor restrictions] +
    //     [02.01SR - 02 Contributions with donor restrictions]
    // )

    const fundraisingExpenses = getSumOfArray(data.fundraisingExpenses[name]);
    const contributionsWithoutDR = getSumOfArray(data.contributionsWithoutDR[name]);
    const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);

    return fundraisingExpenses / (contributionsWithoutDR + contributionsWithDR);
}

const contributionsPerFullTimeEquivalent_weightedAverage = (data, name) => {
    // (
    //     [02.01SR - 01 Contributions without donor restrictions] +
    //     [02.01SR - 02 Contributions with donor restrictions]
    // )
    // /
    // [06.01NonFin - 03 Number of Employees FTE]

    const contributionsWithoutDR = getSumOfArray(data.contributionsWithoutDR[name]);
    const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);
    const numberOfEmployeesFTE = getSumOfArray(data.numberOfEmployeesFTE[name]);

    return (contributionsWithoutDR + contributionsWithDR) / numberOfEmployeesFTE;
}

const contributionsPerMissionaryUnit_weightedAverage = (data, name) => {
    // (
    //     [02.01SR - 01 Contributions without donor restrictions] +
    //     [02.01SR - 02 Contributions with donor restrictions]
    // )
    // /
    // [06.01NonFin - 01 Missionary Unit]

    const contributionsWithoutDR = getSumOfArray(data.contributionsWithoutDR[name]);
    const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);
    const missionaryUnit = getSumOfArray(data.missionaryUnit[name]);

    return (contributionsWithoutDR + contributionsWithDR) / missionaryUnit;
}

const contributionsPerGivingUnit_weightedAverage = (data, name) => {
    // (
    //     [02.01SR - 01 Contributions without donor restrictions] +
    //     [02.01SR - 02 Contributions with donor restrictions]
    // )
    // /
    // [06.01NonFin - 02 Giving Unit]

    const contributionsWithoutDR = getSumOfArray(data.contributionsWithoutDR[name]);
    const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);
    const givingUnit = getSumOfArray(data.givingUnit[name]);

    return (contributionsWithoutDR + contributionsWithDR) / givingUnit;
}

const contributionsPercentWithDR_weightedAverage = (data, name) => {
    // [02.01SR - 02 Contributions with donor restrictions]
    // /
    // (
    //    [02.01SR - 01 Contributions without donor restrictions] +
    //    [02.01SR - 02 Contributions with donor restrictions]
    // )

    const contributionsWithoutDR = getSumOfArray(data.contributionsWithoutDR[name]);
    const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);
        
    return contributionsWithDR / (contributionsWithoutDR + contributionsWithDR);

}

const contributionsPercentWithoutDR_weightedAverage = (data, name) => {
    // [02.01SR - 01 Contributions without donor restrictions]
    // /
    // (
    //    [02.01SR - 01 Contributions without donor restrictions] +
    //    [02.01SR - 02 Contributions with donor restrictions]
    // )

    const contributionsWithoutDR = getSumOfArray(data.contributionsWithoutDR[name]);
    const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);

    return contributionsWithoutDR / (contributionsWithoutDR + contributionsWithDR);
}

const netIncomeRatio_weightedAverage = (data, name) => {
    // (
    //     [02.04Change - 01 Change in Net Assets without Donor Restriction] +
    //     [02.04Change - 02 Change in Net Assets with Donor Restriction]
    // )
    // /
    // (
    //     [02.01SR - 08 Total Support and Revenue without Donor Restrictions] +
    //     [02.01SR - 09 Total Support and Revenue with Donor Restrictions]
    // )

    const changeInNetAssetsWithoutDR = getSumOfArray(data.changeInNetAssetsWithoutDR[name]);
    const changeInNetAssetsWithDR = getSumOfArray(data.changeInNetAssetsWithDR[name]);
    const totalSupportAndRevenueWithoutDR = getSumOfArray(data.totalSupportAndRevenueWithoutDR[name]);
    const totalSupportAndRevenueWithDR = getSumOfArray(data.totalSupportAndRevenueWithDR[name]);

    return (changeInNetAssetsWithoutDR + changeInNetAssetsWithDR) / (totalSupportAndRevenueWithoutDR + totalSupportAndRevenueWithDR);
}

const percentWithoutDR_weightedAverage = (data, name) => {
    // [01. 03NA - 01 Net assets without donor restrictions]
    // /
    // [01. 03NA - 04 Total Net Assets]

    const netAssetsWithoutDR = getSumOfArray(data.netAssetsWithoutDR[name]);
    const totalNetAssets = getSumOfArray(data.totalNetAssets[name]);

    return netAssetsWithoutDR / totalNetAssets;
}

const percentWithoutDR_excludingPPE_weightedAverage = (data, name) => {
    // (
    //     [01. 03NA - 01 Net assets without donor restrictions] - 
    //     [01. 01Ass - 09 Property, plant and equipment] - 
    //     [01. 02Liab - 02 Notes Payable]
    // )
    // /
    // [01. 03NA - 04 Total Net Assets]

    const netAssetsWithoutDR = getSumOfArray(data.netAssetsWithoutDR[name]);
    const propertyPlantAndEquipment = getSumOfArray(data.propertyPlantAndEquipment[name]);
    const notesPayable = getSumOfArray(data.notesPayable[name]);
    const totalNetAssets = getSumOfArray(data.totalNetAssets[name]);

    return (netAssetsWithoutDR - propertyPlantAndEquipment - notesPayable) / totalNetAssets;
}

const percentWithDR_weightedAverage = (data, name) => {
    // (
    //     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] + 
    //     [01. 03NA - 03 Net assets with donor restrictions in perpetuity]
    // )
    // /
    // [01. 03NA - 04 Total Net Assets]

    const netAssetsWithDRByPurposeOrTime = getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name]);
    const netAssetsWithDRInPerpetuity = getSumOfArray(data.netAssetsWithDRInPerpetuity[name]);
    const totalNetAssets = getSumOfArray(data.totalNetAssets[name]);

    return (netAssetsWithDRByPurposeOrTime + netAssetsWithDRInPerpetuity) / totalNetAssets;
}

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