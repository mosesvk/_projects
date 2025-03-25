const getWeightedAverageOfArray = (data, name, year) => {
  // console.log(data, name);
  switch (name) {
    case "daysCashOnHand":
      return daysCashOnHand_weightedAverage(data, name, year);
    case "daysExpensesInUnrestrictedNA":
      return daysExpensesInUnrestrictedNA_weightedAverage(data, name, year);
    case "daysExpensesInUnrestrictedNA_excludingPPE":
      return daysExpensesInUnrestrictedNA_excludingPPE_weightedAverage(
        data,
        name,
        year
      );
    case "daysExpensesInNAwithDR":
      return daysExpensesInNAwithDR_weightedAverage(data, name, year);
    case "daysExpensesInNAwithDR_excludingPPE":
      return daysExpensesInNAwithDR_excludingPPE_weightedAverage(
        data,
        name,
        year
      );
    case "liquidityAssetsAvailableCover":
      return liquidityAssetsAvailableCover_weightedAverage(data, name, year);
    case "liquidityFundsAvailable":
      return liquidityFundsAvailable_weightedAverage(data, name, year);
    case "financialAssetsAvailableFY":
      return financialAssetsAvailableFY_weightedAverage(data, name, year);
    case "daysFinancialAssetsOnHand":
      return daysFinancialAssetsOnHand_weightedAverage(data, name, year);
    case "currentRatio":
      return currentRatio_weightedAverage(data, name, year);
    case "totalCoverageRatio":
      return totalCoverageRatio_weightedAverage(data, name, year);
    case "assetsWithoutPpeToLiabilitiesWithoutDebt":
      return assetsWithoutPpeToLiabilitiesWithoutDebt_weightedAverage(
        data,
        name,
        year
      );
    case "percentWithDR":
      return percentWithDR_weightedAverage(data, name, year);
    case "percentWithoutDR_excludingPPE":
      return percentWithoutDR_excludingPPE_weightedAverage(data, name, year);
    case "percentWithoutDR":
      return percentWithoutDR_weightedAverage(data, name, year);
    case "netIncomeRatio":
      return netIncomeRatio_weightedAverage(data, name, year);
    case "contributionsPercentWithoutDR":
      return contributionsPercentWithoutDR_weightedAverage(data, name, year);
    case "contributionsPercentWithDR":
      return contributionsPercentWithDR_weightedAverage(data, name, year);
    case "contributionsPerGivingUnit":
      return contributionsPerGivingUnit_weightedAverage(data, name, year);
    case "contributionsPerMissionaryUnit":
      return contributionsPerMissionaryUnit_weightedAverage(data, name, year);
    case "contributionsPerFullTimeEquivalent":
      return contributionsPerFullTimeEquivalent_weightedAverage(
        data,
        name,
        year
      );
    case "fundraisingAsPercentOfContributions":
      return fundraisingAsPercentOfContributions_weightedAverage(
        data,
        name,
        year
      );
    case "annualizedInvestmentReturn":
      return annualizedInvestmentReturn_weightedAverage(data, name, year);
    case "functionalExpensePercent_program":
      return functionalExpensePercent_program_weightedAverage(data, name, year);
    case "functionalExpensePercent_administrative":
      return functionalExpensePercent_administrative_weightedAverage(
        data,
        name,
        year
      );
    case "functionalExpensePercent_fundraising":
      return functionalExpensePercent_fundraising_weightedAverage(
        data,
        name,
        year
      );
    case "functionalExpensePercent_other":
      return functionalExpensePercent_other_weightedAverage(data, name, year);
    case "costOfContributions":
      return costOfContributions_weightedAverage(data, name, year);
    case "expensesPerGivingUnit":
      return expensesPerGivingUnit_weightedAverage(data, name, year);
    case "expensesPerMissionaryUnit":
      return expensesPerMissionaryUnit_weightedAverage(data, name, year);
    case "expensesPerFullTimeEquivalent":
      return expensesPerFullTimeEquivalent_weightedAverage(data, name, year);
    case "salariesAndBenefitsAsPercentOfTotalExpenses":
      return salariesAndBenefitsAsPercentOfTotalExpenses_weightedAverage(
        data,
        name,
        year
      );
    case "salariesAndBenefitsPerFTE":
      return salariesAndBenefitsPerFTE_weightedAverage(data, name, year);
    case "percentageAssessmentOnRestrictedGifts":
      return percentageAssessmentOnRestrictedGifts_weightedAverage(
        data,
        name,
        year
      );
    case "ageOfFacilities":
      return ageOfFacilities_weightedAverage(data, name, year);
    default:
      return;
  }
};

const ageOfFacilities_weightedAverage = (data, name, year) => {
  // [05.02Land - 06 Accumulated Depreciation]
  // /
  // [04.01FExp - 06 Depreciation and Amortization]

  const accumulatedDepreciation = year
    ? getSumOfArray(data.accumulatedDepreciation[name][year])
    : getSumOfArray(data.accumulatedDepreciation[name]["total"]);

  const depreciationAndAmortization = year
    ? getSumOfArray(data.depreciationAndAmortization[name][year])
    : getSumOfArray(data.depreciationAndAmortization[name]["total"]);

  return depreciationAndAmortization > 0
    ? accumulatedDepreciation / depreciationAndAmortization
    : 0;
};

const percentageAssessmentOnRestrictedGifts_weightedAverage = (
  data,
  name,
  year
) => {
  // [02.02Reclass - 01 Total Administrative Assessments]
  // /
  // [02.01SR - 02 Contributions with donor restrictions]

  const totalAdministrativeAssessments = year
    ? getSumOfArray(data.totalAdministrativeAssessments[name][year])
    : getSumOfArray(data.totalAdministrativeAssessments[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  return contributionsWithDR > 0
    ? totalAdministrativeAssessments / contributionsWithDR
    : 0;
};

const salariesAndBenefitsPerFTE_weightedAverage = (data, name, year) => {
  // [04.01FExp - 03 Salaries & Benefits]
  // /
  // [06.01NonFin - 03 Number of Employees FTE]

  const salariesAndBenefits = year
    ? getSumOfArray(data.salariesAndBenefits[name][year])
    : getSumOfArray(data.salariesAndBenefits[name]["total"]);

  const numberOfEmployeesFTE = year
    ? getSumOfArray(data.numberOfEmployeesFTE[name][year])
    : getSumOfArray(data.numberOfEmployeesFTE[name]["total"]);

  return numberOfEmployeesFTE > 0
    ? salariesAndBenefits / numberOfEmployeesFTE
    : 0;
};

const salariesAndBenefitsAsPercentOfTotalExpenses_weightedAverage = (
  data,
  name,
  year
) => {
  // [04.01FExp - 03 Salaries & Benefits]
  // /
  // [02.03Exp - 05 Total Expenses]

  const salariesAndBenefits = year
    ? getSumOfArray(data.salariesAndBenefits[name][year])
    : getSumOfArray(data.salariesAndBenefits[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  return totalExpenses ? salariesAndBenefits / totalExpenses : 0;
};

const expensesPerFullTimeEquivalent_weightedAverage = (data, name, year) => {
  // [02.03Exp - 05 Total Expenses]
  // /
  // [06.01NonFin - 03 Number of Employees FTE]

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const numberOfEmployeesFTE = year
    ? getSumOfArray(data.numberOfEmployeesFTE[name][year])
    : getSumOfArray(data.numberOfEmployeesFTE[name]["total"]);

  return numberOfEmployeesFTE ? totalExpenses / numberOfEmployeesFTE : 0;
};

const expensesPerMissionaryUnit_weightedAverage = (data, name, year) => {
  // [02.03Exp - 05 Total Expenses]
  // /
  // [06.01NonFin - 01 Missionary Unit]

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const missionaryUnit = year
    ? getSumOfArray(data.missionaryUnit[name][year])
    : getSumOfArray(data.missionaryUnit[name]["total"]);

  return missionaryUnit > 0 ? totalExpenses / missionaryUnit : 0;
};

const expensesPerGivingUnit_weightedAverage = (data, name, year) => {
  // [02.03Exp - 05 Total Expenses]
  // /
  // [06.01NonFin - 02 Giving Unit]

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const givingUnit = year
    ? getSumOfArray(data.givingUnit[name][year])
    : getSumOfArray(data.givingUnit[name]["total"]);

  return givingUnit > 0 ? totalExpenses / givingUnit : 0;
};

const costOfContributions_weightedAverage = (data, name, year) => {
  // [02.03Exp - 03 Fundraising Expenses]
  // /
  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )

  const fundraisingExpenses = year
    ? getSumOfArray(data.fundraisingExpenses[name][year])
    : getSumOfArray(data.fundraisingExpenses[name]["total"]);

  const contributionsWithoutDR = year
    ? getSumOfArray(data.contributionsWithoutDR[name][year])
    : getSumOfArray(data.contributionsWithoutDR[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? fundraisingExpenses / denominator : 0;
};

const functionalExpensePercent_other_weightedAverage = (data, name, year) => {
  // [02.03Exp - 04 Other Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const otherExpenses = year
    ? getSumOfArray(data.otherExpenses[name][year])
    : getSumOfArray(data.otherExpenses[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  return totalExpenses > 0 ? otherExpenses / totalExpenses : 0;
};

const functionalExpensePercent_fundraising_weightedAverage = (
  data,
  name,
  year
) => {
  // [02.03Exp - 03 Fundraising Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const fundraisingExpenses = year
    ? getSumOfArray(data.fundraisingExpenses[name][year])
    : getSumOfArray(data.fundraisingExpenses[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  return totalExpenses > 0 ? fundraisingExpenses / totalExpenses : 0;
};

const functionalExpensePercent_administrative_weightedAverage = (
  data,
  name,
  year
) => {
  // [02.03Exp - 02 Administrative Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const administrativeExpenses = year
    ? getSumOfArray(data.administrativeExpenses[name][year])
    : getSumOfArray(data.administrativeExpenses[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  return totalExpenses > 0 ? administrativeExpenses / totalExpenses : 0;
};

const functionalExpensePercent_program_weightedAverage = (data, name, year) => {
  // [02.03Exp - 01 Program Expenses]
  // /
  // [02.03Exp - 05 Total Expenses]

  const programExpenses = year
    ? getSumOfArray(data.programExpenses[name][year])
    : getSumOfArray(data.programExpenses[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  return totalExpenses > 0 ? programExpenses / totalExpenses : 0;
};

const fundraisingAsPercentOfContributions_weightedAverage = (
  data,
  name,
  year
) => {
  // [02.03Exp - 03 Fundraising Expenses]
  // /
  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )

  const fundraisingExpenses = year
    ? getSumOfArray(data.fundraisingExpenses[name][year])
    : getSumOfArray(data.fundraisingExpenses[name]["total"]);

  const contributionsWithoutDR = year
    ? getSumOfArray(data.contributionsWithoutDR[name][year])
    : getSumOfArray(data.contributionsWithoutDR[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? fundraisingExpenses / denominator : 0;
};

const annualizedInvestmentReturn_weightedAverage = (data, name, year) => {
  // console.log('annualizedInvestmentReturn_weightedAverage', {data, name, year});

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

  const investmentIncome = year
    ? getSumOfArray(data.investmentIncome[name][year])
    : getSumOfArray(data.investmentIncome[name]["total"]);

  const investments = year
    ? getSumOfArray(data.investments[name][year])
    : getSumOfArray(data.investments[name]["total"]);

  return investments > 0 ? investmentIncome / investments : 0;
};

const contributionsPerFullTimeEquivalent_weightedAverage = (
  data,
  name,
  year
) => {
  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )
  // /
  // [06.01NonFin - 03 Number of Employees FTE]

  const contributionsWithoutDR = year
    ? getSumOfArray(data.contributionsWithoutDR[name][year])
    : getSumOfArray(data.contributionsWithoutDR[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  const numberOfEmployeesFTE = year
    ? getSumOfArray(data.numberOfEmployeesFTE[name][year])
    : getSumOfArray(data.numberOfEmployeesFTE[name]["total"]);

  return numberOfEmployeesFTE > 0
    ? (contributionsWithoutDR + contributionsWithDR) / numberOfEmployeesFTE
    : 0;
};

const contributionsPerMissionaryUnit_weightedAverage = (data, name, year) => {
  // (
  //     [02.01SR - 01 Contributions without donor restrictions
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )
  // /
  // [06.01NonFin - 01 Missionary Unit]

  const contributionsWithoutDR = year
    ? getSumOfArray(data.contributionsWithoutDR[name][year])
    : getSumOfArray(data.contributionsWithoutDR[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  const missionaryUnit = year
    ? getSumOfArray(data.missionaryUnit[name][year])
    : getSumOfArray(data.missionaryUnit[name]["total"]);

  return missionaryUnit > 0
    ? (contributionsWithoutDR + contributionsWithDR) / missionaryUnit
    : 0;
};

const contributionsPerGivingUnit_weightedAverage = (data, name, year) => {
  // (
  //     [02.01SR - 01 Contributions without donor restrictions] +
  //     [02.01SR - 02 Contributions with donor restrictions]
  // )
  // /
  // [06.01NonFin - 02 Giving Unit]

  const contributionsWithoutDR = year
    ? getSumOfArray(data.contributionsWithoutDR[name][year])
    : getSumOfArray(data.contributionsWithoutDR[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  const givingUnit = year
    ? getSumOfArray(data.givingUnit[name][year])
    : getSumOfArray(data.givingUnit[name]["total"]);

  return givingUnit > 0
    ? (contributionsWithoutDR + contributionsWithDR) / givingUnit
    : 0;
};

const contributionsPercentWithDR_weightedAverage = (data, name, year) => {
  // [02.01SR - 02 Contributions with donor restrictions]
  // /
  // (
  //    [02.01SR - 01 Contributions without donor restrictions] +
  //    [02.01SR - 02 Contributions with donor restrictions]
  // )

  const contributionsWithoutDR = year
    ? getSumOfArray(data.contributionsWithoutDR[name][year])
    : getSumOfArray(data.contributionsWithoutDR[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? contributionsWithDR / denominator : 0;
};

const contributionsPercentWithoutDR_weightedAverage = (data, name, year) => {
  // [02.01SR - 01 Contributions without donor restrictions]
  // /
  // (
  //    [02.01SR - 01 Contributions without donor restrictions] +
  //    [02.01SR - 02 Contributions with donor restrictions]
  // )

  const contributionsWithoutDR = year
    ? getSumOfArray(data.contributionsWithoutDR[name][year])
    : getSumOfArray(data.contributionsWithoutDR[name]["total"]);

  const contributionsWithDR = year
    ? getSumOfArray(data.contributionsWithDR[name][year])
    : getSumOfArray(data.contributionsWithDR[name]["total"]);

  const denominator = contributionsWithoutDR + contributionsWithDR;

  return denominator > 0 ? contributionsWithoutDR / denominator : 0;
};

const netIncomeRatio_weightedAverage = (data, name, year) => {
  // (
  //     [02.04Change - 01 Change in Net Assets without Donor Restriction] +
  //     [02.04Change - 02 Change in Net Assets with Donor Restriction]
  // )
  // /
  // (
  //     [02.01SR - 08 Total Support and Revenue without Donor Restrictions] +
  //     [02.01SR - 09 Total Support and Revenue with Donor Restrictions]
  // )

  const changeInNetAssetsWithoutDR = year
    ? getSumOfArray(data.changeInNetAssetsWithoutDR[name][year])
    : getSumOfArray(data.changeInNetAssetsWithoutDR[name]["total"]);

  const changeInNetAssetsWithDR = year
    ? getSumOfArray(data.changeInNetAssetsWithDR[name][year])
    : getSumOfArray(data.changeInNetAssetsWithDR[name]["total"]);

  const totalSupportAndRevenueWithoutDR = year
    ? getSumOfArray(data.totalSupportAndRevenueWithoutDR[name][year])
    : getSumOfArray(data.totalSupportAndRevenueWithoutDR[name]["total"]);

  const totalSupportAndRevenueWithDR = year
    ? getSumOfArray(data.totalSupportAndRevenueWithDR[name][year])
    : getSumOfArray(data.totalSupportAndRevenueWithDR[name]["total"]);

  const denominator =
    totalSupportAndRevenueWithoutDR + totalSupportAndRevenueWithDR;

  return denominator > 0
    ? (changeInNetAssetsWithoutDR + changeInNetAssetsWithDR) / denominator
    : 0;
};

const percentWithoutDR_weightedAverage = (data, name, year) => {
  // [01. 03NA - 01 Net assets without donor restrictions]
  // /
  // [01. 03NA - 04 Total Net Assets]

  const netAssetsWithoutDR = year
    ? getSumOfArray(data.netAssetsWithoutDR[name][year])
    : getSumOfArray(data.netAssetsWithoutDR[name]["total"]);

  const totalNetAssets = year
    ? getSumOfArray(data.totalNetAssets[name][year])
    : getSumOfArray(data.totalNetAssets[name]["total"]);

  return totalNetAssets > 0 ? netAssetsWithoutDR / totalNetAssets : 0;
};

const percentWithoutDR_excludingPPE_weightedAverage = (data, name, year) => {
  // (
  //     [01. 03NA - 01 Net assets without donor restrictions] -
  //     [01. 01Ass - 09 Property, plant and equipment] -
  //     [01. 02Liab - 02 Notes Payable]
  // )
  // /
  // [01. 03NA - 04 Total Net Assets]

  const netAssetsWithoutDR = year
    ? getSumOfArray(data.netAssetsWithoutDR[name][year])
    : getSumOfArray(data.netAssetsWithoutDR[name]["total"]);

  const propertyPlantAndEquipment = year
    ? getSumOfArray(data.propertyPlantAndEquipment[name][year])
    : getSumOfArray(data.propertyPlantAndEquipment[name]["total"]);

  const notesPayable = year
    ? getSumOfArray(data.notesPayable[name][year])
    : getSumOfArray(data.notesPayable[name]["total"]);

  const totalNetAssets = year
    ? getSumOfArray(data.totalNetAssets[name][year])
    : getSumOfArray(data.totalNetAssets[name]["total"]);

  return totalNetAssets > 0
    ? (netAssetsWithoutDR - propertyPlantAndEquipment - notesPayable) /
        totalNetAssets
    : 0;
};

const percentWithDR_weightedAverage = (data, name, year) => {
  // (
  //     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] +
  //     [01. 03NA - 03 Net assets with donor restrictions in perpetuity]
  // )
  // /
  // [01. 03NA - 04 Total Net Assets]

  const netAssetsWithDRByPurposeOrTime = year
    ? getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name][year])
    : getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name]["total"]);

  const netAssetsWithDRInPerpetuity = year
    ? getSumOfArray(data.netAssetsWithDRInPerpetuity[name][year])
    : getSumOfArray(data.netAssetsWithDRInPerpetuity[name]["total"]);

  const totalNetAssets = year
    ? getSumOfArray(data.totalNetAssets[name][year])
    : getSumOfArray(data.totalNetAssets[name]["total"]);

  return totalNetAssets > 0
    ? (netAssetsWithDRByPurposeOrTime + netAssetsWithDRInPerpetuity) /
        totalNetAssets
    : 0;
};

const totalCoverageRatio_weightedAverage = (data, name, year) => {
  // [01. 01Ass - 10 Total Assets]
  // /
  // [01. 02Liab - 05 Total Liabilities]

  const totalAssets = year
    ? getSumOfArray(data.totalAssets[name][year])
    : getSumOfArray(data.totalAssets[name]["total"]);

  const totalLiabilities = year
    ? getSumOfArray(data.totalLiabilities[name][year])
    : getSumOfArray(data.totalLiabilities[name]["total"]);

  return totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;
};

const assetsWithoutPpeToLiabilitiesWithoutDebt_weightedAverage = (
  data,
  name,
  year
) => {
  // if (!year) console.log('!!!!!!', {data, name});

  // [01. 01Ass - 10 Total Assets] - [01. 01Ass - 09 Property, plant and equipment]
  // /
  // [01. 02Liab - 05 Total Liabilities] - [01. 02Liab - 02 Notes Payable]

  const totalAssets = year
    ? getSumOfArray(data.totalAssets[name][year])
    : getSumOfArray(data.totalAssets[name]["total"]);
  const propertyPlantAndEquipment = year
    ? getSumOfArray(data.propertyPlantAndEquipment[name][year])
    : getSumOfArray(data.propertyPlantAndEquipment[name]["total"]);

  const totalLiabilities = year
    ? getSumOfArray(data.totalLiabilities[name][year])
    : getSumOfArray(data.totalLiabilities[name]["total"]);

  const notesPayable = year
    ? getSumOfArray(data.notesPayable[name][year])
    : getSumOfArray(data.notesPayable[name]["total"]);

  let above = totalAssets - propertyPlantAndEquipment;
  let below = totalLiabilities - notesPayable;
  // if (!year)
  //   console.log("!!!!!!", {
  //     totalAssets,
  //     propertyPlantAndEquipment,
  //     above,
  //     totalLiabilities,
  //     notesPayable,
  //     below,
  //   });

  return totalLiabilities > 0
    ? (totalAssets - propertyPlantAndEquipment) /
        (totalLiabilities - notesPayable)
    : 0;
};

const currentRatio_weightedAverage = (data, name, year) => {
  console.log({data, name, year});
  
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

  const totalAssets = year
    ? getSumOfArray(data.totalAssets[name][year])
    : getSumOfArray(data.totalAssets[name]["total"]);

  const cashAndCashEquivalents = year
    ? getSumOfArray(data.cashAndCashEquivalents[name][year])
    : getSumOfArray(data.cashAndCashEquivalents[name]["total"]);

  const investments = year
    ? getSumOfArray(data.investments[name][year])
    : getSumOfArray(data.investments[name]["total"]);

  const propertyPlantAndEquipment = year
    ? getSumOfArray(data.propertyPlantAndEquipment[name][year])
    : getSumOfArray(data.propertyPlantAndEquipment[name]["total"]);

  const totalLiabilities = year
    ? getSumOfArray(data.totalLiabilities[name][year])
    : getSumOfArray(data.totalLiabilities[name]["total"]);

  const longTermLiabilities = year
    ? getSumOfArray(data.longTermLiabilities[name][year])
    : getSumOfArray(data.longTermLiabilities[name]["total"]);

  const notesPayable = year
    ? getSumOfArray(data.notesPayable[name][year])
    : getSumOfArray(data.notesPayable[name]["total"]);

  const denominator = totalLiabilities - longTermLiabilities - notesPayable;

  return denominator > 0
    ? (totalAssets -
        cashAndCashEquivalents -
        investments -
        propertyPlantAndEquipment) /
        denominator
    : 0;
};

const daysFinancialAssetsOnHand_weightedAverage = (data, name, year) => {
  // [05.01Liquid - 01 Financial Assets available per Liquidity FN]
  // /
  // (
  //     [02.03Exp - 05 Total Expenses] / 365
  // )

  const financialAssetsAvailablePerLiquidity = year
    ? getSumOfArray(data.financialAssetsAvailablePerLiquidity[name][year])
    : getSumOfArray(data.financialAssetsAvailablePerLiquidity[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const denominator = totalExpenses / 365;

  return denominator > 0
    ? financialAssetsAvailablePerLiquidity / denominator
    : 0;
};

const financialAssetsAvailableFY_weightedAverage = (data, name, year) => {
  // [05.01Liquid - 01 Financial Assets available per Liquidity FN]
  // /
  // [02.03Exp - 05 Total Expenses]

  const financialAssetsAvailablePerLiquidity = year
    ? getSumOfArray(data.financialAssetsAvailablePerLiquidity[name][year])
    : getSumOfArray(data.financialAssetsAvailablePerLiquidity[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  return totalExpenses > 0
    ? financialAssetsAvailablePerLiquidity / totalExpenses
    : 0;
};

const liquidityFundsAvailable_weightedAverage = (data, name, year) => {
  // (
  //     [01. 01Ass - 10 Total Assets] -
  //     [01. 01Ass - 09 Property, plant and equipment]
  // )
  // /
  // [01. 02Liab - 05 Total Liabilities]

  const totalAssets = year
    ? getSumOfArray(data.totalAssets[name][year])
    : getSumOfArray(data.totalAssets[name]["total"]);

  const propertyPlantAndEquipment = year
    ? getSumOfArray(data.propertyPlantAndEquipment[name][year])
    : getSumOfArray(data.propertyPlantAndEquipment[name]["total"]);

  const totalLiabilities = year
    ? getSumOfArray(data.totalLiabilities[name][year])
    : getSumOfArray(data.totalLiabilities[name]["total"]);

  return totalLiabilities > 0
    ? (totalAssets - propertyPlantAndEquipment) / totalLiabilities
    : 0;
};

const liquidityAssetsAvailableCover_weightedAverage = (data, name, year) => {
  console.log({ data, name, year });

  // ([01. 01Ass - 10 Total Assets] - [1. 01Ass - 09 Property, plant and equipment])
  // /
  // ([01. 02Liab - 05 Total Liabilities] + [01. 03NA - 03a Net assets with donor restrictions SUM])

  //   ([01. 01Ass - 10 Total Assets]-[01. 01Ass - 09 Property, plant and equipment])
  // /
  // ([01. 02Liab - 05 Total Liabilities]+
  // [01. 03NA - 02 Net assets with donor restrictions by purpose or time]+
  // [01. 03NA - 03 Net assets with donor restrictions in perpetuity])

  const totalAssets = year
    ? getSumOfArray(data.totalAssets[name][year])
    : getSumOfArray(data.totalAssets[name]["total"]);

  const propertyPlantAndEquipment = year
    ? getSumOfArray(data.propertyPlantAndEquipment[name][year])
    : getSumOfArray(data.propertyPlantAndEquipment[name]["total"]);

  const totalLiabilities = year
    ? getSumOfArray(data.totalLiabilities[name][year])
    : getSumOfArray(data.totalLiabilities[name]["total"]);

  const netAssetsWithDRByPurposeOrTime = year
    ? getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name][year])
    : getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name]["total"]);

  const netAssetsWithDRInPerpetuity = year
    ? getSumOfArray(data.netAssetsWithDRInPerpetuity[name][year])
    : getSumOfArray(data.netAssetsWithDRInPerpetuity[name]["total"]);

  const netAssetsWithDonorRestrictionsSum = year
    ? getSumOfArray(data.netAssetsWithDonorRestrictionsSum[name][year])
    : getSumOfArray(data.netAssetsWithDonorRestrictionsSum[name]["total"]);

  const denominator =
    totalLiabilities +
    netAssetsWithDRByPurposeOrTime +
    netAssetsWithDRInPerpetuity;

  return denominator > 0
    ? (totalAssets - propertyPlantAndEquipment) / denominator
    : 0;
};

const daysExpensesInNAwithDR_excludingPPE_weightedAverage = (
  data,
  name,
  year
) => {
  // (
  //     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] +
  //     [01. 03NA - 03 Net assets with donor restrictions in perpetuity] -
  //     [01. 01Ass - 09 Property, plant and equipment] -
  //     [01. 02Liab - 02 Notes Payable]
  // )
  // /
  // (
  //     [02.03Exp - 05 Total Expenses] / 365
  // )

  const netAssetsWithDRByPurposeOrTime = year
    ? getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name][year])
    : getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name]["total"]);

  const netAssetsWithDRInPerpetuity = year
    ? getSumOfArray(data.netAssetsWithDRInPerpetuity[name][year])
    : getSumOfArray(data.netAssetsWithDRInPerpetuity[name]["total"]);

  const propertyPlantAndEquipment = year
    ? getSumOfArray(data.propertyPlantAndEquipment[name][year])
    : getSumOfArray(data.propertyPlantAndEquipment[name]["total"]);

  const notesPayable = year
    ? getSumOfArray(data.notesPayable[name][year])
    : getSumOfArray(data.notesPayable[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const denominator = totalExpenses / 365;

  return denominator > 0
    ? (netAssetsWithDRByPurposeOrTime +
        netAssetsWithDRInPerpetuity -
        propertyPlantAndEquipment -
        notesPayable) /
        denominator
    : 0;
};

const daysExpensesInNAwithDR_weightedAverage = (data, name, year) => {
  // (
  //     [01. 03NA - 02 Net assets with donor restrictions by purpose or time] +
  //     [01. 03NA - 03 Net assets with donor restrictions in perpetuity]
  // )
  // /
  // (
  //     [02.03Exp - 05 Total Expenses] / 365
  // )

  const netAssetsWithDRByPurposeOrTime = year
    ? getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name][year])
    : getSumOfArray(data.netAssetsWithDRByPurposeOrTime[name]["total"]);

  const netAssetsWithDRInPerpetuity = year
    ? getSumOfArray(data.netAssetsWithDRInPerpetuity[name][year])
    : getSumOfArray(data.netAssetsWithDRInPerpetuity[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const denominator = totalExpenses / 365;

  return denominator > 0
    ? (netAssetsWithDRByPurposeOrTime + netAssetsWithDRInPerpetuity) /
        denominator
    : 0;
};

const daysExpensesInUnrestrictedNA_weightedAverage = (data, name, year) => {
  // [01. 03NA - 01 Net assets without donor restrictions]
  // /
  // (
  //     [02.03Exp - 05 Total Expenses] / 365
  // )

  const netAssetsWithoutDR = year
    ? getSumOfArray(data.netAssetsWithoutDR[name][year])
    : getSumOfArray(data.netAssetsWithoutDR[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const denominator = totalExpenses / 365;

  return netAssetsWithoutDR / denominator;
};

const daysExpensesInUnrestrictedNA_excludingPPE_weightedAverage = (
  data,
  name,
  year
) => {
  // console.log('daysExpensesInUnrestrictedNA_excludingPPE_weightedAverage',{data, name, year});
  // (
  //     [01. 03NA - 01 Net assets without donor restrictions] -
  //     [01. 01Ass - 09 Property, plant and equipment] -
  //     [01. 02Liab - 02 Notes Payable]
  // )
  // /
  // (
  //     [02.03Exp - 05 Total Expenses] / 365
  // )

  const netAssetsWithoutDR = year
    ? getSumOfArray(data.netAssetsWithoutDR[name][year])
    : getSumOfArray(data.netAssetsWithoutDR[name]["total"]);

  const propertyPlantAndEquipment = year
    ? getSumOfArray(data.propertyPlantAndEquipment[name][year])
    : getSumOfArray(data.propertyPlantAndEquipment[name]["total"]);

  const notesPayable = year
    ? getSumOfArray(data.notesPayable[name][year])
    : getSumOfArray(data.notesPayable[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  // console.log({
  //   netAssetsWithoutDR,
  //   propertyPlantAndEquipment,
  //   notesPayable,
  //   totalExpenses
  // })
  const denominator = totalExpenses / 365;

  return denominator > 0
    ? (netAssetsWithoutDR - propertyPlantAndEquipment - notesPayable) /
        denominator
    : 0;
};

const daysCashOnHand_weightedAverage = (data, name, year) => {
  // [01. 01Ass - 01 Cash and Cash Equivalents]
  // /
  // (
  //     ([02.03Exp - 05 Total Expenses] - [04.01FExp - 06 Depreciation and Amortization]) / 365
  // )

  const cashAndCashEquivalents = year
    ? getSumOfArray(data.cashAndCashEquivalents[name][year])
    : getSumOfArray(data.cashAndCashEquivalents[name]["total"]);

  const totalExpenses = year
    ? getSumOfArray(data.totalExpenses[name][year])
    : getSumOfArray(data.totalExpenses[name]["total"]);

  const depreciationAndAmortization = year
    ? getSumOfArray(data.depreciationAndAmortization[name][year])
    : getSumOfArray(data.depreciationAndAmortization[name]["total"]);

  const denominator = (totalExpenses - depreciationAndAmortization) / 365;

  return cashAndCashEquivalents / denominator;
};
