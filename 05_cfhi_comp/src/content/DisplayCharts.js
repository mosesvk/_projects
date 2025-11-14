/**
 * Fix Unicode encoding issues in content, particularly apostrophes
 * @param {string} content - The content string to fix
 * @returns {string} - Content with properly encoded Unicode characters
 */
function fixUnicodeCharacters(content) {
  if (typeof content !== 'string') {
    return content;
  }

  // Replace common problematic Unicode characters that display as �
  const unicodeReplacements = {
    // Apostrophe variations that often cause encoding issues
    '\u2019': "'",     // Right single quotation mark (smart apostrophe)
    '\u2018': "'",     // Left single quotation mark  
    '\u00B4': "'",     // Acute accent
    '\u0060': "'",     // Grave accent
    '\u02BC': "'",     // Modifier letter apostrophe
    
    // Quote variations
    '\u201C': '"',     // Left double quotation mark
    '\u201D': '"',     // Right double quotation mark
    '\u201E': '"',     // Double low-9 quotation mark
    '\u201F': '"',     // Double high-reversed-9 quotation mark
    
    // Dash variations
    '\u2013': '-',     // En dash
    '\u2014': '--',    // Em dash
    '\u2015': '--',    // Horizontal bar
    
    // Other common problematic characters
    '\u2026': '...',   // Horizontal ellipsis
    '\u00A0': ' ',     // Non-breaking space
    '\uFFFD': "'",     // Unicode replacement character (often appears as �)
  };

  let fixedContent = content;

  // Apply each replacement
  Object.entries(unicodeReplacements).forEach(([problematic, replacement]) => {
    fixedContent = fixedContent.replace(new RegExp(problematic, 'g'), replacement);
  });

  // Additional cleanup for any remaining � characters that might be malformed apostrophes
  fixedContent = fixedContent.replace(/\uFFFD/g, "'");

  return fixedContent;
}

const displayDemoComponent = () => {
  const savedData = getStoredData("demoData");
  const parseData = parseStoredData(savedData);

  // console.log('displayDemoComponent hit');
  

  // givingUnits
  createChartFromParsedData(
    parseData,
    "givingUnits_chart",
    "givingUnits_Peer",
    "givingUnits_Client",
    "number",
    0,
    "givingUnits",
    getBenchmarksForField("givingUnits"),
    "Giving Units",
    null // no weighted average
  );
  // givingUnitsToStaff
  createChartFromParsedData(
    parseData,
    "givingUnitsToStaff_chart",
    "givingUnitsToStaff_Peer",
    "givingUnitsToStaff_Client",
    "number",
    0,
    "givingUnitsToStaff",
    getBenchmarksForField("givingUnitsToStaff"),
    "Giving Units to Staff",
    "wa" // use weighted average
  );


  closeSidebarAfterSelectingOption("demo");
};

const displayCashComponent = () => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);

  // daysExpendableNetAssets
  createChartFromParsedData(
    parseData,
    "daysExpendableNetAssets_chart",
    "daysExpendableNetAssets_Peer",
    "daysExpendableNetAssets_Client",
    "number",
    0,
    "daysExpendableNetAssets",
    getBenchmarksForField("daysExpendableNetAssets"),
    "Days Expendable Net Assets",
    "wa" // use weighted average
  );

  // daysOperatingCash
  createChartFromParsedData(
    parseData,
    "daysOperatingCash_chart",
    "daysOperatingCash_Peer",
    "daysOperatingCash_Client",
    "number",
    0,
    "daysOperatingCash",
    getBenchmarksForField("daysOperatingCash"),
    "Days Operating Cash",
    "wa" // use weighted average
  );

  // cashFlowsFromOperatingActivities
  createChartFromParsedData(
    parseData,
    "cashFlowsFromOperatingActivities_chart",
    "cashFlowsFromOperatingActivities_Peer",
    "cashFlowsFromOperatingActivities_Client",
    "dollar",
    0,
    "cashFlowsFromOperatingActivities",
    getBenchmarksForField("cashFlowsFromOperatingActivities"),
    "Cash Flows from Operating Activities",
    null // no weighted average
  );

  // liquidityRatio
  createChartFromParsedData(
    parseData,
    "liquidityRatio_chart",
    "liquidityRatio_Peer",
    "liquidityRatio_Client",
    "number",
    0,
    "liquidityRatio",
    getBenchmarksForField("liquidityRatio"),
    "Liquidity Ratio",
    "wa" // use weighted average
  );

  // netCashAvailability
  createChartFromParsedData(
    parseData,
    "netCashAvailability_chart",
    "netCashAvailability_Peer",
    "netCashAvailability_Client",
    "dollar",
    0,
    "netCashAvailability",
    getBenchmarksForField("netCashAvailability"),
    "Net Cash Availability",
    null // no weighted average
  );

  createBenchmark("daysExpendableNetAssets_benchmarkParagraph", "cashData", "row_daysExpendableNetAssets");
  createBenchmark("daysOperatingCash_benchmarkParagraph", "cashData", "row_daysOperatingCash");
  createBenchmark("cashFlowsFromOperatingActivities_benchmarkParagraph", "cashData", "row_cashFlowsFromOperatingActivities");
  createBenchmark("liquidityRatio_benchmarkParagraph", "cashData", "row_liquidityRatio");
  createBenchmark("netCashAvailability_benchmarkParagraph", "cashData", "row_netCashAvailability");

  closeSidebarAfterSelectingOption("cash");
};

const displayDebtComponent = () => {
  const savedData = getStoredData("debtData");
  const parseData = parseStoredData(savedData);

  // debtToContributionsWithout
  createChartFromParsedData(
    parseData,
    "debtToContributionsWithout_chart",
    "debtToContributionsWithout_Peer",
    "debtToContributionsWithout_Client",
    "dollar",
    0,
    "debtToContributionsWithout",
    getBenchmarksForField("debtToContributionsWithout"),
    "Debt to Contributions Without",
    "wa" // use weighted average
  );

  // currentRatio
  createChartFromParsedData(
    parseData,
    "currentRatio_chart",
    "currentRatio_Peer",
    "currentRatio_Client",
    "number",
    0,
    "currentRatio",
    getBenchmarksForField("currentRatio"),
    "Current Ratio",
    "wa" // use weighted average
  );

  // mandatoryDebtServiceToContributionsWithout
  createChartFromParsedData(
    parseData,
    "mandatoryDebtServiceToContributionsWithout_chart",
    "mandatoryDebtServiceToContributionsWithout_Peer",
    "mandatoryDebtServiceToContributionsWithout_Client",
    "percent",
    0,
    "mandatoryDebtServiceToContributionsWithout",
    getBenchmarksForField("mandatoryDebtServiceToContributionsWithout"),
    "Mandatory Debt Service to Contributions Without",
    "wa" // use weighted average
  );

  // debtPerGivingUnit
  createChartFromParsedData(
    parseData,
    "debtPerGivingUnit_chart",
    "debtPerGivingUnit_Peer",
    "debtPerGivingUnit_Client",
    "dollar",
    0,
    "debtPerGivingUnit",
    getBenchmarksForField("debtPerGivingUnit"),
    "Debt Per Giving Unit",
    "wa" // use weighted average
  );

  // debtCoverage
  createChartFromParsedData(
    parseData,
    "debtCoverage_chart",
    "debtCoverage_Peer",
    "debtCoverage_Client",
    "dollar",
    0,
    "debtCoverage",
    getBenchmarksForField("debtCoverage"),
    "Debt Coverage",
    "wa" // use weighted average
  );

  createBenchmark("debtToContributionsWithout_benchmarkParagraph", "debtData", "row_debtToContributionsWithout");
  createBenchmark("currentRatio_benchmarkParagraph", "debtData", "row_currentRatio");
  createBenchmark("mandatoryDebtServiceToContributionsWithout_benchmarkParagraph", "debtData", "row_mandatoryDebtServiceToContributionsWithout");
  createBenchmark("debtPerGivingUnit_benchmarkParagraph", "debtData", "row_debtPerGivingUnit");
  createBenchmark("debtCoverage_benchmarkParagraph", "debtData", "row_debtCoverage");

  closeSidebarAfterSelectingOption("debt");
};

const displayIncomeComponent = () => {
  const savedData = getStoredData("incomeData");
  const parseData = parseStoredData(savedData);

  // netIncomeRatio
  createChartFromParsedData(
    parseData,
    "netIncomeRatio_chart",
    "netIncomeRatio_Peer",
    "netIncomeRatio_Client",
    "percent",
    1,
    "netIncomeRatio",
    getBenchmarksForField("netIncomeRatio"),
    "Net Income Ratio",
    "wa" // use weighted average
  );

  // contributionsWithoutDonorPerGivingUnit
  createChartFromParsedData(
    parseData,
    "contributionsWithoutDonorPerGivingUnit_chart",
    "contributionsWithoutDonorPerGivingUnit_Peer",
    "contributionsWithoutDonorPerGivingUnit_Client",
    "dollar",
    1,
    "contributionsWithoutDonorPerGivingUnit",
    getBenchmarksForField("contributionsWithoutDonorPerGivingUnit"),
    "Contributions Without Donor Per Giving Unit",
    null // no weighted average
  );

  // totalContributionsPerGivingUnit
  createChartFromParsedData(
    parseData,
    "totalContributionsPerGivingUnit_chart",
    "totalContributionsPerGivingUnit_Peer",
    "totalContributionsPerGivingUnit_Client",
    "dollar",
    1,
    "totalContributionsPerGivingUnit",
    getBenchmarksForField("totalContributionsPerGivingUnit"),
    "Total Contributions Per Giving Unit",
    null // no weighted average
  );

  createBenchmark("netIncomeRatio_benchmarkParagraph", "incomeData", "row_netIncomeRatio");
  createBenchmark("netIncomeRatio_twoYrAvg_benchmarkParagraph", "incomeData", "row_netIncomeRatio_twoYrAvg");
  createBenchmark("contributionsWithoutDonorPerGivingUnit_benchmarkParagraph", "incomeData", "row_contributionsWithoutDonorPerGivingUnit_percentChange");
  createBenchmark("totalContributionsPerGivingUnit_benchmarkParagraph", "incomeData", "row_totalContributionsPerGivingUnit");
  createBenchmark("totalContributionsPerGivingUnit_percentChange_benchmarkParagraph", "incomeData", "row_totalContributionsPerGivingUnit_percentChange");
  createBenchmark("localCounty_benchmarkParagraph", "incomeData", "row_localCounty");

  closeSidebarAfterSelectingOption("income");
};

const displayExpenseComponent = () => {
  const savedData = getStoredData("expenseData");
  const parseData = parseStoredData(savedData);

  // benefitsToSalaries
  createChartFromParsedData(
    parseData,
    "benefitsToSalaries_chart",
    "benefitsToSalaries_Peer",
    "benefitsToSalaries_Client",
    "number",
    1,
    "benefitsToSalaries",
    null,
    "Benefits to Salaries",
    "wa" // use weighted average
  );

  // salariesBenefitsIncludingOutsourcedEmployees
  createChartFromParsedData(
    parseData,
    "salariesBenefitsIncludingOutsourcedEmployees_chart",
    "salariesBenefitsIncludingOutsourcedEmployees_Peer",
    "salariesBenefitsIncludingOutsourcedEmployees_Client",
    "number",
    1,
    "salariesBenefitsIncludingOutsourcedEmployees",
    null,
    "Salaries Benefits Including Outsourced Employees",
    "wa" // use weighted average
  );

  // personnelToCashExpenditure
  createChartFromParsedData(
    parseData,
    "personnelToCashExpenditure_chart",
    "personnelToCashExpenditure_Peer",
    "personnelToCashExpenditure_Client",
    "number",
    1,
    "personnelToCashExpenditure",
    null,
    "Personnel to Cash Expenditure",
    "wa" // use weighted average
  );

  // cashExpendituresPerGivingUnit
  createChartFromParsedData(
    parseData,
    "cashExpendituresPerGivingUnit_chart",
    "cashExpendituresPerGivingUnit_Peer",
    "cashExpendituresPerGivingUnit_Client",
    "number",
    1,
    "cashExpendituresPerGivingUnit",
    null,
    "Cash Expenditures Per Giving Unit",
    "wa" // use weighted average
  );

  createBenchmark("personnelToCashExpenditure_benchmarkParagraph", "expenseData", "row_personnelToCashExpenditure");
  createBenchmark("mandatoryDebtServiceToCashExpenditure_benchmarkParagraph", "expenseData", "row_mandatoryDebtServiceToCashExpenditure");
  createBenchmark("personnelIncludingToTotalCashExpenditures_benchmarkParagraph", "expenseData", "row_personnelIncludingToTotalCashExpenditures");
  createBenchmark("totalGlobalAndLocalOutreachExpenses_benchmarkParagraph", "expenseData", "row_totalGlobalAndLocalOutreachExpenses");

  // Removed facility expense and cost per square foot ratios per todo

  closeSidebarAfterSelectingOption("expense");
};
