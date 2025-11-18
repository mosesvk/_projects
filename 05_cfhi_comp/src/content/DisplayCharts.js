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

  createBenchmark("Good: > 60 | Warning: 30-60 | Action: < 30", "cashData", "row_daysExpendableNetAssets");
  createBenchmark("Good: > 90 | Warning: 60-90 | Action: < 60", "cashData", "row_daysOperatingCash");
  createBenchmark("Good: > 0 | Warning: 1 year of negative results  Action:  2+ years of negative results", "cashData", "row_cashFlowsFromOperatingActivities");
  createBenchmark("Good: > 4 | Warning: 1-4 | Action: < 1", "cashData", "row_liquidityRatio");
  createBenchmark("Good: > 1 month expenses  Warning: > 0 and < 1 month expenses | Action: < 0", "cashData", "row_netCashAvailability");

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

  createBenchmark("Good: < 2 | Warning: 2-3 | Action: > 3", "debtData", "row_debtToContributionsWithout");
  createBenchmark("Good: > 2 | Warning: 1-2 | Action: < 1", "debtData", "row_currentRatio");
  createBenchmark("Good: < 15 | Warning: 15-20 | Action: > 20", "debtData", "row_mandatoryDebtServiceToContributionsWithout");
  createBenchmark("Good: < 2x | Warning: 2x - 3x | Action: > 3x contributions w/o donor restrictions", "debtData", "row_debtPerGivingUnit");
  createBenchmark("Good: > 1.25 | Warning: 1 - 1.25 | Action: < 1", "debtData", "row_debtCoverage");

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

  createBenchmark("Good: > 0 | Warning: = 0 | Action: < 0", "incomeData", "row_netIncomeRatio");
  createBenchmark("Good: Improving Trend", "incomeData", "row_netIncomeRatio_twoYrAvg");
  createBenchmark("Good: Improving Trend", "incomeData", "row_contributionsWithoutDonorPerGivingUnit_percentChange");
  createBenchmark("Good: > 4,500 | Warning: 3,000 - 4,500 | Action: < 3,000", "incomeData", "row_totalContributionsPerGivingUnit");
  createBenchmark("Good: Improving Trend", "incomeData", "row_totalContributionsPerGivingUnit_percentChange");
  createBenchmark("Good: > 4 | Warning: 3-4 | Action: < 3", "incomeData", "row_localCounty");

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

  createBenchmark("Good: 40-55 | Warning: 35-40 or 55-59 | Action: < 35 or > 59", "expenseData", "row_personnelToCashExpenditure");
  createBenchmark("Good: < 15 | Warning: 15-19 | Action: > 19", "expenseData", "row_mandatoryDebtServiceToCashExpenditure");
  createBenchmark("Good: 40-55 | Warning: 35-40 or 55-59 | Action: < 35 or > 59", "expenseData", "row_personnelIncludingToTotalCashExpenditures");
  createBenchmark("Good: > 10 | Warning: 5-10 | Action: < 5", "expenseData", "row_totalGlobalAndLocalOutreachExpenses");

  // Removed facility expense and cost per square foot ratios per todo

  closeSidebarAfterSelectingOption("expense");
};
