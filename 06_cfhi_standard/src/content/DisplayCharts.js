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

// "What does this mean" text for personnelIncludingToTotalCashExpenditures
const personnelInclude_whatDoesThisMean = [
  `Salaries and benefits, interest, and debt service payments (which are not an expense but rather a reduction of a liability) represent the majority of resource outflows from the local church.`,
  `Therefore, it is essential to continually monitor these levels as a percentage of total cash expenditures. It is also important to promptly follow up on changes in trends or unusual variances from peers to ensure that your ministry resources are continually maximized.`,
  `This ratio allows your church to look at two of its largest cash outflows and determine the portion of the operating budget that will be used. Often a growth cycle results in an amount of debt the church anticipates being able to pay off as more people are able and encouraged to attend. However, the church needs to be able to pay the bills and provide the services that will attract new people with the current budget. Reviewing this ratio in advance of any major debt decisions will help you analyze the feasibility of your facility expansion goals.`
];

// "What does this mean" text for totalContributionsPerGivingUnit
const contrPerAvgAttAndGU_whatDoesThisMean = [
  `The key difference between this result and Measurement 12 is that this is calculated on total contributions (both with and without donor restrictions) and removes the effect of pledges, which are essentially a non-cash accrual, and all large one-time gifts.`,
  `When a church is in the midst of a specific campaign, it will likely receive some large one-time gifts. Since this ratio includes both gifts with and without donor restrictions, it is important that these are eliminated; otherwise, there could be large swings between years. As with Measurement 12, the power of this ratio is in analyzing trends in congregational giving habits between years. Keep in mind that during the period of a capital campaign this figure may be inflated even with the removal of large one-time gifts, because of an increase in smaller gifts as well.`,
  `Again, the most apparent way to improve this calculation is to increase total contributions.`,
];

const displayGeneralComponent = () => {
  const savedData = getStoredData("generalData");
  const parseData = parseStoredData(savedData);
  
  // Debug: Check what keys exist in parseData
  console.log("🔍 displayGeneralComponent - parseData keys:", parseData ? Object.keys(parseData) : "parseData is null");
  console.log("🔍 givingUnits_Client exists?", parseData?.givingUnits_Client ? "YES" : "NO");
  console.log("🔍 givingUnits_Peer exists?", parseData?.givingUnits_Peer ? "YES" : "NO");
  if (parseData?.givingUnits_Client) {
    console.log("🔍 givingUnits_Client structure:", parseData.givingUnits_Client);
  }

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

  // contributionsWithoutDonorExcludingLargeGifts
  createChartFromParsedData(
    parseData,
    "contributionsWithoutDonorExcludingLargeGifts_chart",
    "contributionsWithoutDonorExcludingLargeGifts_Peer",
    "contributionsWithoutDonorExcludingLargeGifts_Client",
    "number",
    0,
    "contributionsWithoutDonorExcludingLargeGifts",
    getBenchmarksForField("contributionsWithoutDonorExcludingLargeGifts"),
    "Contributions Without Donor Excluding Large Gifts"
  );

  // Use benchmark paragraph data from localStorage for general metrics
  createBenchmark("givingUnits_benchmarkParagraph", "generalData", "row_givingUnits");
  createBenchmark("contributionsWithoutDonorExcludingLargeGifts_benchmarkParagraph", "generalData", "row_contributionsWithoutDonorExcludingLargeGifts");

  closeSidebarAfterSelectingOption("general");
};

const displayCashComponent = () => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);

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
    "Net Cash Availability"
  );

  // Use benchmark paragraph data from localStorage
  createBenchmark("daysOperatingCash_benchmarkParagraph", "cashData", "row_daysOperatingCash");
  createBenchmark("netCashAvailability_benchmarkParagraph", "cashData", "row_netCashAvailability");

  closeSidebarAfterSelectingOption("cash");
};

const displayDebtComponent = () => {
  const savedData = getStoredData('debtData');
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

  // Use benchmark paragraph data from localStorage
  createBenchmark("debtToContributionsWithout_benchmarkParagraph", "debtData", "row_debtToContributionsWithout");
  createBenchmark("debtPerGivingUnit_benchmarkParagraph", "debtData", "row_debtPerGivingUnit");

  closeSidebarAfterSelectingOption("debt");
};

const displayIncomeComponent = () => {
  const savedData = getStoredData('incomeData');
  const parseData = parseStoredData(savedData);

  // contributionsWithoutDonorPerGivingUnit
  createChartFromParsedData(
    parseData,
    'contributionsWithoutDonorPerGivingUnit_chart',
    'contributionsWithoutDonorPerGivingUnit_Peer',
    'contributionsWithoutDonorPerGivingUnit_Client',
    'dollar',
    0,
    'contributionsWithoutDonorPerGivingUnit',
    getBenchmarksForField('contributionsWithoutDonorPerGivingUnit'),
    'Contributions without donor restrictions Per Giving Unit'
  );

  // totalContributionsPerGivingUnit
  createChartFromParsedData(
    parseData,    
    'totalContributionsPerGivingUnit_chart',
    'totalContributionsPerGivingUnit_Peer',
    'totalContributionsPerGivingUnit_Client',
    'dollar',
    0,
    'totalContributionsPerGivingUnit',
    getBenchmarksForField('totalContributionsPerGivingUnit'),
    'Total Contributions Per Giving Unit'
  );

  // Use benchmark paragraph data from localStorage for income metrics
  createBenchmark("contributionsWithoutDonorPerGivingUnit_benchmarkParagraph", "incomeData", "row_contributionsWithoutDonorPerGivingUnit");
  // Use hardcoded benchmark text for totalContributionsPerGivingUnit (matches comp project)
  createBenchmark("Good: > 4,500 | Warning: 3,000 - 4,500 | Action: < 3,000", "incomeData", "row_totalContributionsPerGivingUnit");
  createBenchmark("Good: Improving Trend", "incomeData", "row_totalContributionsPerGivingUnit_percentChange");
  
  // Add "What does this mean?" content
  createWhatDoesThisMean(contrPerAvgAttAndGU_whatDoesThisMean, "row_totalContributionsPerGivingUnit");

  closeSidebarAfterSelectingOption("income");
};

const displayExpenseComponent = () => {
  const savedData = getStoredData('expenseData');
  const parseData = parseStoredData(savedData);

  // cashExpendituresPerGivingUnit
  createChartFromParsedData(
    parseData,
    'cashExpendituresPerGivingUnit_chart',
    'cashExpendituresPerGivingUnit_Peer',
    'cashExpendituresPerGivingUnit_Client',
    'dollar',
    0,
    'cashExpendituresPerGivingUnit',
    getBenchmarksForField('cashExpendituresPerGivingUnit'),
    'Cash Expenditures Per Giving Unit'
  );

  // personnelIncludingToTotalCashExpenditures
  createChartFromParsedData(
    parseData,
    'personnelIncludingToTotalCashExpenditures_chart',
    'personnelIncludingToTotalCashExpenditures_Peer',
    'personnelIncludingToTotalCashExpenditures_Client',
    'percent',
    0,
    'personnelIncludingToTotalCashExpenditures',
    getBenchmarksForField('personnelIncludingToTotalCashExpenditures'),
    'Personnel (Including Outsourced Personnel) to Total Cash Expenditures',
    'wa',
    savedData
  );

  // Use benchmark paragraph data from localStorage
  createBenchmark("cashExpendituresPerGivingUnit_benchmarkParagraph", "expenseData", "row_cashExpendituresPerGivingUnit");
  // Use hardcoded benchmark text for personnelIncludingToTotalCashExpenditures (matches personnelToCashExpenditure in comp project)
  createBenchmark("Good: 40-55 | Warning: 35-40 or 55-59 | Action: < 35 or > 59", "expenseData", "row_personnelIncludingToTotalCashExpenditures");
  
  // Add "What does this mean?" content
  createWhatDoesThisMean(personnelInclude_whatDoesThisMean, "row_personnelIncludingToTotalCashExpenditures");

  closeSidebarAfterSelectingOption("expense");
};
