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

// "What does this mean" text for contributionsWithoutDonorPerGivingUnit
const contrWithoutPerAvgAttAndGU_whatDoesThisMean = [
  `This calculation, which removes the effect of large one-time (unusual) gifts without donor restrictions, can be compared from year to year to see the trends and determine the impact on the church and budget. Another valuable comparison is to calculate what contributions would be if every giving unit made a certain amount (i.e., $50,000 a year) and tithed on that amount. The church could use this measurement to make the congregation aware of what the current giving per adult attendee and giving unit is, and what the projected giving would be if everyone participated.`,
  `Churches today have to look at contributions differently than at any time in the past. Contributions are down, and generational differences are very strong even in the way people contribute to their church. Young people, who are more cause-driven, tend to give to specific purposes and causes and are less interested in giving to general operations. This creates budgeting concerns.`,
  `Churches choose to communicate these needs in various ways. Some list them in the bulletin. Some annually communicate contributions per adult attendee or giving unit. Others may request contributions towards a specific need and tell the congregation what was received and how the funds were spent, and show pictures of the repairs or replacements.`,
  `All churches, especially those that receive large amounts of donor-restricted contributions, should consider adopting a gift acceptance policy. Such a policy would include what types of gifts would be received (cash, stock, etc.). It could also include what donor-restricted amounts the church will accept. If the church is never going to buy a bus, for example, there is no reason to accept funds for such a purpose.`,
  `The most obvious way to improve this calculation is to increase contributions without donor restrictions.`,
];

// "What does this mean" text for cashExpendituresPerGivingUnit
const totalCashExpendExcludePerGU_whatDoesThisMean = [
  `Has your church ever wondered what your cash financial cost per adult attendee and giving unit is? This measure provides the answer. First, it takes total expenses and subtracts out the largest non-cash expense, which is depreciation. Next, it adds back the largest cash outflow (which is not an expense) or current debt principal. The purpose of this is to approximate total annual cash expenditures for your church. Then it divides that total by the adult attendees or giving units.`,
  `The power of this measure is in the peer group comparison. This allows your church to see if your total cash expenditures are high or low compared to your peers. It also shows the increases and decreases to this measure between years.`,
];

const displayGeneralComponent = () => {
  const savedData = getStoredData("generalData");
  const parseData = parseStoredData(savedData);
  
  // Debug: Check what keys exist in parseData
  // console.log("🔍 displayGeneralComponent - parseData keys:", parseData ? Object.keys(parseData) : "parseData is null");
  // console.log("🔍 givingUnits_Client exists?", parseData?.givingUnits_Client ? "YES" : "NO");
  // console.log("🔍 givingUnits_Peer exists?", parseData?.givingUnits_Peer ? "YES" : "NO");
  if (parseData?.givingUnits_Client) {
    // console.log("🔍 givingUnits_Client structure:", parseData.givingUnits_Client);
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
  createBenchmark("Good: Improving Trend", "incomeData", "row_contributionsWithoutDonorPerGivingUnit_percentChange");
  // Use hardcoded benchmark text for totalContributionsPerGivingUnit (matches comp project)
  createBenchmark("Good: > 4,500 | Warning: 3,000 - 4,500 | Action: < 3,000", "incomeData", "row_totalContributionsPerGivingUnit");
  createBenchmark("Good: Improving Trend", "incomeData", "row_totalContributionsPerGivingUnit_percentChange");
  
  // Add "What does this mean?" content
  createWhatDoesThisMean(contrWithoutPerAvgAttAndGU_whatDoesThisMean, "row_contributionsWithoutDonorPerGivingUnit");
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
  createWhatDoesThisMean(totalCashExpendExcludePerGU_whatDoesThisMean, "row_cashExpendituresPerGivingUnit");
  createWhatDoesThisMean(personnelInclude_whatDoesThisMean, "row_personnelIncludingToTotalCashExpenditures");

  closeSidebarAfterSelectingOption("expense");
};
