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
    "Giving Units"
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
    "Giving Units to Staff"
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
    "Days Expendable Net Assets"
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
    "Days Operating Cash"
  );

  // cashFlowsFromOperatingActivities
  createChartFromParsedData(
    parseData,
    "cashFlowsFromOperatingActivities_chart",
    "cashFlowsFromOperatingActivities_Peer",
    "cashFlowsFromOperatingActivities_Client",
    "number",
    0,
    "cashFlowsFromOperatingActivities",
    getBenchmarksForField("cashFlowsFromOperatingActivities"),
    "Cash Flows from Operating Activities"
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
    "Liquidity Ratio"
  );

  // netCashAvailability
  createChartFromParsedData(
    parseData,
    "netCashAvailability_chart",
    "netCashAvailability_Peer",
    "netCashAvailability_Client",
    "number",
    0,
    "netCashAvailability",
    getBenchmarksForField("netCashAvailability"),
    "Net Cash Availability"
  );

  const daysExpendable_benchmark = [
    fixUnicodeCharacters("Days Expendable Benchmark"),
    fixUnicodeCharacters('We believe a reasonable benchmark for this ratio is 30 to 60 days of cash expenses on hand. Furthermore, a result of less than 30 days could be interpreted as a <span class="red">red flag</span>.'),
  ];
  createBenchmark(daysExpendable_benchmark, "row_daysExpendableNetAssets");

  const daysOperatingCash_benchmark = [
    fixUnicodeCharacters("Days Operating Cash Benchmark"),
    fixUnicodeCharacters("Some churches want to maintain a certain level of reserves. The reserves can be used for economic downturns or unexpected expenses, events, or new opportunities. Often, churches that try to build up reserves have a goal."),
    fixUnicodeCharacters('We believe an appropriate benchmark for this ratio is 40 to 80 days of annual cash expenditures on hand.  Furthermore, a result of less than 20 days could be interpreted as a  <span class="red">red flag</span>'),
  ];
  createBenchmark(daysOperatingCash_benchmark, "row_daysOperatingCash");

  const cashFlowsFromOperatingActivities_benchmark = [
    fixUnicodeCharacters("Cash Flows from Operating Activities Benchmark"),
    fixUnicodeCharacters("We believe the benchmark for this ratio is greater than or equal to 0."),
  ];
  createBenchmark(cashFlowsFromOperatingActivities_benchmark, "row_cashFlowsFromOperatingActivities");


  const liquidityRatio_benchmark = [
    fixUnicodeCharacters("Liquidity Ratio Benchmark"),
    fixUnicodeCharacters("Based on our experience, we have set the minimum benchmark for this ratio at greater than or equal to 5.0. Results less than this may indicate that the church is keeping fewer liquid reserves and is less likely to be able to handle unexpected operating expenses, events, or new opportunities that may come along."),
  ];
  createBenchmark(liquidityRatio_benchmark, "row_liquidityRatio");

  const netCashAvailability_benchmark = [
    fixUnicodeCharacters("Net Cash Availability Benchmark"),
    fixUnicodeCharacters('We believe the minimum benchmark for this number is at least one month\'s worth of cash expenses. Any positive amount less than this is in the warning range. Any negative amount indicates that the church is borrowing from funds with donor restrictions and could be interpreted as a <span class="red">red flag</span>. Also, a calculation that is positive only when amounts available on an operating line of credit are included could be interpreted as a <span class="red">red flag</span> because the church is still relying on short-term revolving debt to meet its immediate cash needs.'),
  ];
  createBenchmark(netCashAvailability_benchmark, "row_netCashAvailability");

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
    "Debt to Contributions Without"
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
    "Current Ratio"
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
    "Mandatory Debt Service to Contributions Without"
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
    "Debt Per Giving Unit"
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
    "Debt Coverage"
  );

  const debtToContributionsWithout_benchmark = [
    fixUnicodeCharacters("Debt to Contributions Without Donor Restrictions Benchmark"),
    fixUnicodeCharacters("We discussed this with several church lenders and concluded that the benchmark for this ratio should be less than or equal to 2.0."),
    fixUnicodeCharacters("Based on our experience with church clients across the country, we realize the lower this ratio is, the less strain debt will be on the church\'s budget.  We started with the lender-recommended benchmark as the maximum limit and have further broken it down as follows:"),
    fixUnicodeCharacters("A ratio less than or equal to 2.0 is within the benchmark."),
    fixUnicodeCharacters("Any ratio greater than 2.0 to 3.0 is in the warning range."),
    fixUnicodeCharacters('Any amount in excess of 3.0 could be interpreted as a <strong class="red">red flag.</strong>  A ratio result that high indicates that the church\'s debt levels are in excess of three times the support without donor restrictions, which places excessive burden on the budget. It also means that debt is at a level lenders consider too great for the church to support.'),
  ];
  createBenchmark(
    debtToContributionsWithout_benchmark,
    "row_debtToContributionsWithout"
  );

  const currentRatio_benchmark = [
    fixUnicodeCharacters("Current Ratio Benchmark"),
    fixUnicodeCharacters("We believe the benchmark for this ratio is a minimum of 2.0."),
  ];
  createBenchmark(currentRatio_benchmark, "row_currentRatio");

  const mandatoryDebtService_benchmark = [
    fixUnicodeCharacters("Mandatory Debt Service to Contributions Benchmark"),
    fixUnicodeCharacters("The benchmark was set based on our discussions with various church lenders, who had very consistent responses. We believe the benchmark for this ratio is less than 15% - 20% of contributions without donor restrictions. However, some lenders will allow up to 30% of contributions without donor restrictions as an acceptable benchmark. Results below the benchmark would allow room in the budget in case the church\'s interest rate increases."),
  ];
  createBenchmark(
    mandatoryDebtService_benchmark,
    "row_mandatoryDebtServiceToContributionsWithout"
  );

  // Removed: Debt Per Average Adult Attendee (ratio deleted)


  const debtCoverage_benchmark = [
    fixUnicodeCharacters("Debt Coverage Benchmark"),
    fixUnicodeCharacters("We believe the benchmark is a result greater than or equal to 1.15, based on our conversations with church lenders and our experience."),
  ];
  createBenchmark(debtCoverage_benchmark, "row_debtCoverage");

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
    "Net Income Ratio"
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
    "Contributions Without Donor Per Giving Unit"
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
    "Total Contributions Per Giving Unit"
  );

  const netIncome_benchmark = [
    fixUnicodeCharacters("Net Income Ratio Benchmark"),
    fixUnicodeCharacters("The benchmark for this ratio in any particular year is that it is positive. However, we understand there will be years the church invests in its ministry and the ratio may be negative because of a predetermined choice. A more important benchmark is for the average net income ratio to be an improving trend over the years."),
  ];
  createBenchmark(netIncome_benchmark, "row_netIncomeRatio");
  const netIncome_twoYrAvg_benchmark = [
    fixUnicodeCharacters("Net Income Ratio Two Year Average Benchmark"),
    fixUnicodeCharacters("The benchmark for this ratio in any particular year is that it is positive. However, we understand there will be years the church invests in its ministry and the ratio may be negative because of a predetermined choice. A more important benchmark is for the average net income ratio to be an improving trend over the years."),
  ];
  createBenchmark(netIncome_twoYrAvg_benchmark, "row_netIncomeRatio_twoYrAvg");



  const contrWithoutDonorPerGivingUnit_benchmark = [
    fixUnicodeCharacters("Contributions Without Donor Restrictions Per Giving Unit Benchmark"),
    fixUnicodeCharacters("An improving trend is the benchmark."),
  ];
  createBenchmark(
    contrWithoutDonorPerGivingUnit_benchmark,
    "row_contributionsWithoutDonorPerGivingUnit_percentChange"
  );


  const totalContributionsPerGivingUnit_benchmark = [
    fixUnicodeCharacters("Total Contributions Per Giving Unit Benchmark"),
    fixUnicodeCharacters("An improving trend is the benchmark."),
  ];
  createBenchmark(
    totalContributionsPerGivingUnit_benchmark,
    "row_totalContributionsPerGivingUnit_percentChange"
  );

  const localCounty_benchmark = [
    fixUnicodeCharacters(`Local County - Benchmark`),
    fixUnicodeCharacters("We believe that a reasonable benchmark is between 1.5% - 3% of the total giving."),
  ];
  createBenchmark(localCounty_benchmark, "row_localCounty");

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
    "Benefits to Salaries"
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
    "Salaries Benefits Including Outsourced Employees"
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
    "Personnel to Cash Expenditure"
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
    "Cash Expenditures Per Giving Unit"
  );

  // personnelIncludingToTotalCashExpenditures (wa = weighted average for Avg line; parseData supplies totalSalaries, totalExpense, etc.)
  createChartFromParsedData(
    parseData,
    "personnelIncludingToTotalCashExpenditures_chart",
    "personnelIncludingToTotalCashExpenditures_Peer",
    "personnelIncludingToTotalCashExpenditures_Client",
    "percent",
    0,
    "personnelIncludingToTotalCashExpenditures",
    getBenchmarksForField("personnelIncludingToTotalCashExpenditures"),
    "Personnel (Including Outsourced Personnel) to Total Cash Expenditures",
    "wa"
  );

  const personnelToCash_benchmark = [
    fixUnicodeCharacters("Personnel to Cash Expenditure Benchmark"),
    fixUnicodeCharacters("40% - 55%"),
  ];
  createBenchmark(personnelToCash_benchmark, "row_personnelToCashExpenditure");

  const mandatoryDebtToCashExpend_benchmark = [
    fixUnicodeCharacters("Mandatory Debt Service to Cash Expenditure Benchmark"),
    fixUnicodeCharacters("15% or less"),
  ];
  createBenchmark(
    mandatoryDebtToCashExpend_benchmark,
    "row_mandatoryDebtServiceToCashExpenditure"
  );

  const personnelIncludingToTotalCashExpenditures_benchmark = [
    fixUnicodeCharacters("Personnel Including Benefits to Total Cash Expenditures Benchmark"),
    fixUnicodeCharacters("An improving trend is the benchmark."),
  ];
  createBenchmark(
    personnelIncludingToTotalCashExpenditures_benchmark,
    "row_personnelIncludingToTotalCashExpenditures"
  );

  const totalGlobalAndLocalOutreachExpenses_benchmark = [
    fixUnicodeCharacters("Total Global and Local Outreach Expenses Benchmark"),
    fixUnicodeCharacters("10% - 25%"),
  ];
  createBenchmark(
    totalGlobalAndLocalOutreachExpenses_benchmark,
    "row_totalGlobalAndLocalOutreachExpenses"
  );

  // Removed facility expense and cost per square foot ratios per todo

  closeSidebarAfterSelectingOption("expense");
};
