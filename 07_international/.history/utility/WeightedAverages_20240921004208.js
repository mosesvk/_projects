const getWeightedAverageOfArray = (data, name) => {
  // console.log(data, name);
  switch (name) {
    case "daysCashOnHand":
      return daysCashOnHand_weightedAverage(data, name);
    case "daysExpensesInUnrestrictedNA":
      return daysExpensesInUnrestrictedNA_weightedAverage(data, name);
    case "daysExpensesInUnrestrictedNA_excludingPPE":
      return daysExpensesInUnrestrictedNA_excludingPPE_weightedAverage(
        data,
        name
      );
    case "daysExpensesInNAwithDR":
      return daysExpensesInNAwithDR_weightedAverage(data, name);
    case "daysExpensesInNAwithDR_excludingPPE":
      return daysExpensesInNAwithDR_excludingPPE_weightedAverage(data, name);
    case "liquidityFundsAvailable":
      return liquidityFundsAvailable_weightedAverage(data, name);
    case "financialAssetsAvailableFY":
      return financialAssetsAvailableFY_weightedAverage(data, name);
    case "daysFinancialAssetsOnHand":
      return daysFinancialAssetsOnHand_weightedAverage(data, name);
    case "currentRatio":
      return currentRatio_weightedAverage(data, name);
    case "totalCoverageRatio":
      return totalCoverageRatio_weightedAverage(data, name);
    case "percentWithDR":
      return percentWithDR_weightedAverage(data, name);
    case "percentWithoutDR_excludingPPE":
      return percentWithoutDR_excludingPPE_weightedAverage(data, name);
    case "percentWithoutDR":
      return percentWithoutDR_weightedAverage(data, name);
    case "netIncomeRatio":
      return netIncomeRatio_weightedAverage(data, name);
    case "contributionsPercentWithoutDR":
      return contributionsPercentWithoutDR_weightedAverage(data, name);
    case "contributionsPercentWithDR":
      return contributionsPercentWithDR_weightedAverage(data, name);
    case "contributionsPerGivingUnit":
      return contributionsPerGivingUnit_weightedAverage(data, name);
    case "contributionsPerMissionaryUnit":
      return contributionsPerMissionaryUnit_weightedAverage(data, name);
    case "contributionsPerFullTimeEquivalent":
      return contributionsPerFullTimeEquivalent_weightedAverage(data, name);
    case "fundraisingAsPercentOfContributions":
      return fundraisingAsPercentOfContributions_weightedAverage(data, name);
    case "annualizedInvestmentReturn":
      return annualizedInvestmentReturn_weightedAverage(data, name);
    case "functionalExpensePercent_program":
      return functionalExpensePercent_program_weightedAverage(data, name);
    case "functionalExpensePercent_administrative":
      return functionalExpensePercent_administrative_weightedAverage(
        data,
        name
      );
    case "functionalExpensePercent_fundraising":
      return functionalExpensePercent_fundraising_weightedAverage(data, name);
    case "functionalExpensePercent_other":
      return functionalExpensePercent_other_weightedAverage(data, name);
    case "costOfContributions":
      return costOfContributions_weightedAverage(data, name);
    case "expensesPerGivingUnit":
      return expensesPerGivingUnit_weightedAverage(data, name);
    case "expensesPerMissionaryUnit":
      return expensesPerMissionaryUnit_weightedAverage(data, name);
    case "expensesPerFullTimeEquivalent":
      return expensesPerFullTimeEquivalent_weightedAverage(data, name);
    case "salariesAndBenefitsAsPercentOfTotalExpenses":
      return salariesAndBenefitsAsPercentOfTotalExpenses_weightedAverage(
        data,
        name
      );
    case "salariesAndBenefitsPerFTE":
      return salariesAndBenefitsPerFTE_weightedAverage(data, name);
    case "percentageAssessmentOnRestrictedGifts":
      return percentageAssessmentOnRestrictedGifts_weightedAverage(data, name);
    case "ageOfFacilities":
      return ageOfFacilities_weightedAverage(data, name);
    default:
      return;
  }
};

const ageOfFacilities_weightedAverage = (data, name) => {
  // [05.02Land - 06 Accumulated Depreciation]
  // /
  // [04.01FExp - 06 Depreciation and Amortization]

  const accumulatedDepreciation = getSumOfArray(
    data.accumulatedDepreciation[name]
  );
  const depreciationAndAmortization = getSumOfArray(
    data.depreciationAndAmortization[name]
  );

  return depreciationAndAmortization > 0
    ? accumulatedDepreciation / depreciationAndAmortization
    : 0;
};

const percentageAssessmentOnRestrictedGifts_weightedAverage = (data, name) => {
  // [02.02Reclass - 01 Total Administrative Assessments]
  // /
  // [02.01SR - 02 Contributions with donor restrictions]

  const totalAdministrativeAssessments = getSumOfArray(
    data.totalAdministrativeAssessments[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);

  return contributionsWithDR > 0
    ? totalAdministrativeAssessments / contributionsWithDR
    : 0;
};

const salariesAndBenefitsPerFTE_weightedAverage = (data, name) => {
  // [04.01FExp - 03 Salaries & Benefits]
  // /
  // [06.01NonFin - 03 Number of Employees FTE]

  const salariesAndBenefits = getSumOfArray(data.salariesAndBenefits[name]);
  const numberOfEmployeesFTE = getSumOfArray(data.numberOfEmployeesFTE[name]);

  // console.log({salariesAndBenefits, numberOfEmployeesFTE});

  return numberOfEmployeesFTE > 0
    ? salariesAndBenefits / numberOfEmployeesFTE
    : 0;
};

const salariesAndBenefitsAsPercentOfTotalExpenses_weightedAverage = (
  data,
  name
) => {
  // [04.01FExp - 03 Salaries & Benefits]
  // /
  // [02.03Exp - 05 Total Expenses]

  const salariesAndBenefits = getSumOfArray(data.salariesAndBenefits[name]);
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  return totalExpenses ? salariesAndBenefits / totalExpenses : 0;
};

const expensesPerFullTimeEquivalent_weightedAverage = (data, name) => {
  // [02.03Exp - 05 Total Expenses]
  // /
  // [06.01NonFin - 03 Number of Employees FTE]

  const totalExpenses = getSumOfArray(data.totalExpenses[name]);
  const numberOfEmployeesFTE = getSumOfArray(data.numberOfEmployeesFTE[name]);

  return numberOfEmployeesFTE ? totalExpenses / numberOfEmployeesFTE : 0;
};

const expensesPerMissionaryUnit_weightedAverage = (data, name) => {
  // [02.03Exp - 05 Total Expenses]
  // /
  // [06.01NonFin - 01 Missionary Unit]

  const totalExpenses = getSumOfArray(data.totalExpenses[name]);
  const missionaryUnit = getSumOfArray(data.missionaryUnit[name]);

  return missionaryUnit > 0 ? totalExpenses / missionaryUnit : 0;
};

const expensesPerGivingUnit_weightedAverage = (data, name) => {
  // [02.03Exp - 05 Total Expenses]
  // /
  // [06.01NonFin - 02 Giving Unit]

  const totalExpenses = getSumOfArray(data.totalExpenses[name]);
  const givingUnit = getSumOfArray(data.givingUnit[name]);

  return givingUnit > 0 ? totalExpenses / givingUnit : 0;
};

const costOfContributions_weightedAverage = (data, name) => {
  // [02.03Exp - 03 Fundraising Expenses]

  // /

  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )

  const fundraisingExpenses = getSumOfArray(data.fundraisingExpenses[name]);
  const contributionsWithoutDR = getSumOfArray(
    data.contributionsWithoutDR[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? fundraisingExpenses / denominator : 0;
};

const functionalExpensePercent_other_weightedAverage = (data, name) => {
  //     [02.03Exp - 04 Other Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const otherExpenses = getSumOfArray(data.otherExpenses[name]);
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  return totalExpenses > 0 ? otherExpenses / totalExpenses : 0;
};

const functionalExpensePercent_fundraising_weightedAverage = (data, name) => {
  // [02.03Exp - 03 Fundraising Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const fundraisingExpenses = getSumOfArray(data.fundraisingExpenses[name]);
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  return totalExpenses > 0 ? fundraisingExpenses / totalExpenses : 0;
};

const functionalExpensePercent_administrative_weightedAverage = (
  data,
  name
) => {
  //     [02.03Exp - 02 Administrative Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const administrativeExpenses = getSumOfArray(
    data.administrativeExpenses[name]
  );
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  return totalExpenses > 0 ? administrativeExpenses / totalExpenses : 0;
};

const functionalExpensePercent_program_weightedAverage = (data, name) => {
  // [02.03Exp - 01 Program Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const programExpenses = getSumOfArray(data.programExpenses[name]);
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  return totalExpenses > 0 ? programExpenses / totalExpenses : 0;
};

const fundraisingAsPercentOfContributions_weightedAverage = (data, name) => {
  // [02.03Exp - 03 Fundraising Expenses]
  // /
  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )

  const fundraisingExpenses = getSumOfArray(data.fundraisingExpenses[name]);
  const contributionsWithoutDR = getSumOfArray(
    data.contributionsWithoutDR[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? fundraisingExpenses / denominator : 0;
};

const annualizedInvestmentReturn_weightedAverage = (data, name) => {
  // [02.01SR - 03 Investment Income]
  // /
  // (
  //     (
  //         [01. 01Ass - 03 Investments] +
  //         $previousValueNUMBER
  //     )
  //     /
  //     2
  // )

  const investmentIncome = getSumOfArray(data.investmentIncome[name]);
  const investments = getSumOfArray(data.investments[name]);

  return investments > 0 ? investmentIncome / investments : 0;
};

const contributionsPerFullTimeEquivalent_weightedAverage = (data, name) => {
  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )
  // /
  // [06.01NonFin - 03 Number of Employees FTE]

  const contributionsWithoutDR = getSumOfArray(
    data.contributionsWithoutDR[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);
  const numberOfEmployeesFTE = getSumOfArray(data.numberOfEmployeesFTE[name]);

  return numberOfEmployeesFTE > 0
    ? (contributionsWithoutDR + contributionsWithDR) / numberOfEmployeesFTE
    : 0;
};

const contributionsPerMissionaryUnit_weightedAverage = (data, name) => {
  // (
  //     [02.01SR - 01 Contributions without donor restrictions
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )
  // /
  // [06.01NonFin - 01 Missionary Unit]

  const contributionsWithoutDR = getSumOfArray(
    data.contributionsWithoutDR[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);
  const missionaryUnit = getSumOfArray(data.missionaryUnit[name]);

  return missionaryUnit > 0
    ? (contributionsWithoutDR + contributionsWithDR) / missionaryUnit
    : 0;
};

const contributionsPerGivingUnit_weightedAverage = (data, name) => {
  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )
  // /
  // [06.01NonFin - 02 Giving Unit]

  const contributionsWithoutDR = getSumOfArray(
    data.contributionsWithoutDR[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);
  const givingUnit = getSumOfArray(data.givingUnit[name]);

  return givingUnit > 0
    ? (contributionsWithoutDR + contributionsWithDR) / givingUnit
    : 0;
};

const contributionsPercentWithDR_weightedAverage = (data, name) => {
  // [02.01SR - 02 Contributions with donor restrictions]
  // /
  // (
  //    [02.01SR - 01 Contributions without donor restrictions] +
  //    [02.01SR - 02 Contributions with donor restrictions]
  // )

  const contributionsWithoutDR = getSumOfArray(
    data.contributionsWithoutDR[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? contributionsWithDR / denominator : 0;
};

const contributionsPercentWithoutDR_weightedAverage = (data, name) => {
  // [02.01SR - 01 Contributions without donor restrictions]
  // /
  // (
  //    [02.01SR - 01 Contributions without donor restrictions] +
  //    [02.01SR - 02 Contributions with donor restrictions]
  // )

  const contributionsWithoutDR = getSumOfArray(
    data.contributionsWithoutDR[name]
  );
  const contributionsWithDR = getSumOfArray(data.contributionsWithDR[name]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? contributionsWithoutDR / denominator : 0;
};

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

  const changeInNetAssetsWithoutDR = getSumOfArray(
    data.changeInNetAssetsWithoutDR[name]
  );
  const changeInNetAssetsWithDR = getSumOfArray(
    data.changeInNetAssetsWithDR[name]
  );
  const totalSupportAndRevenueWithoutDR = getSumOfArray(
    data.totalSupportAndRevenueWithoutDR[name]
  );
  const totalSupportAndRevenueWithDR = getSumOfArray(
    data.totalSupportAndRevenueWithDR[name]
  );

  const denominator =
    totalSupportAndRevenueWithoutDR + totalSupportAndRevenueWithDR;

  return denominator > 0
    ? (changeInNetAssetsWithoutDR + changeInNetAssetsWithDR) / denominator
    : 0;
};

const percentWithoutDR_weightedAverage = (data, name) => {
  // [01. 03NA - 01 Net assets without donor restrictions]d
  // /
  // [01. 03NA - 04 Total Net Assets]

  const netAssetsWithoutDR = getSumOfArray(data.ndetAssetsWithoutDR[name]);
  const totalNetAssets = getSumOfArray(data.totalNetAssets[name]);

  return totalNetAssets > 0 ? netAssetsWithoutDR / totalNetAssets : 0;
};

const percentWithoutDR_excludingPPE_weightedAverage = (data, name) => {
  // (
  //     [01. 03NA - 01 Net assets without donor restrictions] -
  //     [01. 01Ass - 09 Property, plant and equipment] -
  //     [01. 02Liab - 02 Notes Payable]
  // )
  // /
  // [01. 03NA - 04 Total Net Assets]

  const netAssetsWithoutDR = getSumOfArray(data.netAssetsWithoutDR[name]);
  const propertyPlantAndEquipment = getSumOfArray(
    data.propertyPlantAndEquipment[name]
  );
  const notesPayable = getSumOfArray(data.notesPayable[name]);
  const totalNetAssets = getSumOfArray(data.totalNetAssets[name]);

  return totalNetAssets > 0
    ? (netAssetsWithoutDR - propertyPlantAndEquipment - notesPayable) /
        totalNetAssets
    : 0;
};

const percentWithDR_weightedAverage = (data, name) => {
  // (
  //     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] +
  //     [01. 03NA - 03 Net assets with donor restrictions in perpetuity]
  // )
  // /
  // [01. 03NA - 04 Total Net Assets]

  const netAssetsWithDRByPurposeOrTime = getSumOfArray(
    data.netAssetsWithDRByPurposeOrTime[name]
  );
  const netAssetsWithDRInPerpetuity = getSumOfArray(
    data.netAssetsWithDRInPerpetuity[name]
  );
  const totalNetAssets = getSumOfArray(data.totalNetAssets[name]);

  return totalNetAssets > 0
    ? (netAssetsWithDRByPurposeOrTime + netAssetsWithDRInPerpetuity) /
        totalNetAssets
    : 0;
};

const totalCoverageRatio_weightedAverage = (data, name) => {
  // [01. 01Ass - 10 Total Assets]
  // /
  // [01. 02Liab - 05 Total Liabilities]

  const totalAssets = getSumOfArray(data.totalAssets[name]);
  const totalLiabilities = getSumOfArray(data.totalLiabilities[name]);

  return totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;
};

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
  const cashAndCashEquivalents = getSumOfArray(
    data.cashAndCashEquivalents[name]
  );
  const investments = getSumOfArray(data.investments[name]);
  const propertyPlantAndEquipment = getSumOfArray(
    data.propertyPlantAndEquipment[name]
  );
  const totalLiabilities = getSumOfArray(data.totalLiabilities[name]);
  const longTermLiabilities = getSumOfArray(data.longTermLiabilities[name]);
  const notesPayable = getSumOfArray(data.notesPayable[name]);

  const denominator = totalLiabilities - longTermLiabilities - notesPayable;

  return denominator > 0
    ? (totalAssets -
        cashAndCashEquivalents -
        investments -
        propertyPlantAndEquipment) /
        denominator
    : 0;
};

const daysFinancialAssetsOnHand_weightedAverage = (data, name) => {
  //     [05.01Liquid - 01 Financial Assets available per Liquidity FN]

  // /

  // (
  //     [02.03Exp - 05 Total Expenses] / 365
  // )

  const financialAssetsAvailablePerLiquidity = getSumOfArray(
    data.financialAssetsAvailablePerLiquidity[name]
  );
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  const denominator = totalExpenses / 365;

  return denominator > 0
    ? financialAssetsAvailablePerLiquidity / denominator
    : 0;
};

const financialAssetsAvailableFY_weightedAverage = (data, name) => {
  // [05.01Liquid - 01 Financial Assets available per Liquidity FN]

  // /

  // [02.03Exp - 05 Total Expenses]

  const financialAssetsAvailablePerLiquidity = getSumOfArray(
    data.financialAssetsAvailablePerLiquidity[name]
  );
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  return totalExpenses > 0
    ? financialAssetsAvailablePerLiquidity / totalExpenses
    : 0;
};

const liquidityFundsAvailable_weightedAverage = (data, name) => {
  // (
  //     [01. 01Ass - 10 Total Assets] -
  //     [01. 01Ass - 09 Property, plant and equipment]
  // )

  // /

  // [01. 02Liab - 05 Total Liabilities]

  const totalAssets = getSumOfArray(data.totalAssets[name]);
  const propertyPlantAndEquipment = getSumOfArray(
    data.propertyPlantAndEquipment[name]
  );
  const totalLiabilities = getSumOfArray(data.totalLiabilities[name]);

  return totalLiabilities > 0
    ? (totalAssets - propertyPlantAndEquipment) / totalLiabilities
    : 0;
};

const daysExpensesInNAwithDR_excludingPPE_weightedAverage = (data, name) => {
//   (
//     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] +
//     [01. 03NA - 03 Net assets with donor restrictions in perpetuity]-
//     [01. 01Ass - 09 Property, plant and equipment]-
//     [01. 02Liab - 02 Notes Payable]
// )

// /
// (
//     [02.03Exp - 05 Total Expenses] / 365
// )

  const netAssetsWithDRByPurposeOrTime = getSumOfArray(
    data.netAssetsWithDRByPurposeOrTime[name]
  );
  const netAssetsWithDRInPerpetuity = getSumOfArray(
    data.netAssetsWithDRInPerpetuity[name]
  );
  const propertyPlantAndEquipment = getSumOfArray(
    data.propertyPlantAndEquipment[name]
  );
  const notesPayable = getSumOfArray(data.notesPayable[name]);
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  const denominator = totalExpenses / 365;

  return denominator > 0
    ? (netAssetsWithDRByPurposeOrTime +
        netAssetsWithDRInPerpetuity -
        propertyPlantAndEquipment -
        notesPayable) /
        denominator
    : 0;
};

const daysExpensesInNAwithDR_weightedAverage = (data, name) => {
  // (
  //     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] +
  //     [01. 03NA - 03 Net assets with donor restrictions in perpetuity]
  // )

  // /

  // (
  //     [02.03Exp - 05 Total Expenses]/365
  // )

  const netAssetsWithDRByPurposeOrTime = getSumOfArray(
    data.netAssetsWithDRByPurposeOrTime[name]
  );
  const netAssetsWithDRInPerpetuity = getSumOfArray(
    data.netAssetsWithDRInPerpetuity[name]
  );
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  const denominator = totalExpenses / 365;

  return denominator > 0
    ? (netAssetsWithDRByPurposeOrTime + netAssetsWithDRInPerpetuity) /
        denominator
    : 0;
};

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

  const denominator = totalExpenses / 365;

  // console.log({netAssetsWithoutDR, totalExpenses, denominator});

  // return denominator > 0 ? netAssetsWithoutDR / denominator : 0;

  return netAssetsWithoutDR / (totalExpenses / 365);
};

const daysExpensesInUnrestrictedNA_excludingPPE_weightedAverage = (
  data,
  name
) => {
  //  (
  //     [01. 03NA - 01 Net assets without donor restrictions]-
  //     [01. 01Ass - 09 Property, plant and equipment]-
  //     [01. 02Liab - 02 Notes Payable]
  //  )
  // /
  // (
  //     [02.03Exp - 05 Total Expenses]
  //     /
  //     365
  // )

  const netAssetsWithoutDR = getSumOfArray(data.netAssetsWithoutDR[name]);
  const propertyPlantAndEquipment = getSumOfArray(
    data.propertyPlantAndEquipment[name]
  );
  const notesPayable = getSumOfArray(data.notesPayable[name]);
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);

  const denominator = totalExpenses / 365;

//   console.log({
//     netAssetsWithoutDR,
//     propertyPlantAndEquipment,
//     notesPayable,
//     totalExpenses,
//   });

  return denominator > 0
    ? (netAssetsWithoutDR -
        propertyPlantAndEquipment -
        notesPayable) /
        denominator
    : 0;
};

const daysCashOnHand_weightedAverage = (data, name) => {
  // [01. 01Ass - 01 Cash and Cash Equivalents
  // /
  // (
  //     ([02.03Exp - 05 Total Expenses]-[04.01FExp - 06 Depreciation and Amortization])
  //     /
  //     365
  // )

  const cashAndCashEquivalents = getSumOfArray(
    data.cashAndCashEquivalents[name]
  );
  const totalExpenses = getSumOfArray(data.totalExpenses[name]);
  const depreciationAndAmortization = getSumOfArray(
    data.depreciationAndAmortization[name]
  );

  // console.log({cashAndCashEquivalents, totalExpenses, depreciationAndAmortization});

  const denominator = (totalExpenses - depreciationAndAmortization) / 365;

  // return denominator > 0 ? cashAndCashEquivalents / denominator : 0;

  return (
    cashAndCashEquivalents /
    ((totalExpenses - depreciationAndAmortization) / 365)
  );
};
