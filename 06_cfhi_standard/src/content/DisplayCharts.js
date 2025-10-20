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

  closeSidebarAfterSelectingOption("demo");
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
    "number",
    0,
    "netCashAvailability",
    getBenchmarksForField("netCashAvailability"),
    "Net Cash Availability"
  );

  const daysOperatingCash_benchmark = [
    fixUnicodeCharacters("Days Operating Cash Benchmark"),
    fixUnicodeCharacters("Some churches want to maintain a certain level of reserves. The reserves can be used for economic downturns or unexpected expenses, events, or new opportunities. Often, churches that try to build up reserves have a goal."),
    fixUnicodeCharacters('We believe an appropriate benchmark for this ratio is 40 to 80 days of annual cash expenditures on hand.  Furthermore, a result of less than 20 days could be interpreted as a  <span class="red">red flag</span>'),
  ];
  createBenchmark(daysOperatingCash_benchmark, "row_daysOperatingCash");

  const netCashAvailability_benchmark = [
    fixUnicodeCharacters("Net Cash Availability Benchmark"),
    fixUnicodeCharacters('We believe the minimum benchmark for this number is at least one month\'s worth of cash expenses. Any positive amount less than this is in the warning range. Any negative amount indicates that the church is borrowing from funds with donor restrictions and could be interpreted as a <span class="red">red flag</span>. Also, a calculation that is positive only when amounts available on an operating line of credit are included could be interpreted as a <span class="red">red flag</span> because the church is still relying on short-term revolving debt to meet its immediate cash needs.'),
  ];
  createBenchmark(netCashAvailability_benchmark, "row_netCashAvailability");

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

  const debtPerGivingUnit_benchmark = [
    fixUnicodeCharacters("Debt Per Giving Unit Benchmark"),
    fixUnicodeCharacters("In developing this benchmark, we looked at the RMA standards and had conversations with both lenders and churches. We determined that it was not possible to come up with a firm number because of the many factors that impact the levels of debt per adult attendee and giving unit a particular church is able to successfully carry."),
    fixUnicodeCharacters("We decided that the benchmark should be set by the revenue stream lenders consider for repayment, or by contributions without donor restrictions. Because giving varies so much from church to church, we decided it is not possible to set a fixed amount for this benchmark. Rather, the benchmark should be determined by the level of giving without donor restrictions per adult attendee or giving unit."),
    fixUnicodeCharacters('Setting the range of maximum debt per adult attendee or giving unit is another way of looking at Ratio 6 because the maximum debt per attendee or giving unit times total adult attendees or giving units must correspond with the benchmark set for debt to contributions without donor restrictions. Using the same benchmark set for Ratio 6 tells us that we must multiply no more than 2.0 times the contributions without donor restrictions per adult attendee or giving unit (calculated in Measurement 12) to be within the benchmark. An amount between 2.0 and 3.0 times contributions without donor restrictions per adult attendee or giving unit is in the warning range. Any amount in excess of 3.0 could be interpreted as a <strong class="red"> red flag </strong>for the reasons stated in Ratio 6 above.'),
    fixUnicodeCharacters("The best way to improve this measure is to lower total debt through consistent payments and additional principal reductions, when funds allow. Increasing the number of adult attendees and giving units will also have the same positive effect on the measure, but may be harder to prove as outside parties will require the use of an adult attendee or giving unit number developed over an extended period of time."),
  ];
  createBenchmark(debtPerGivingUnit_benchmark, "row_debtPerGivingUnit");

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
    1,
    'contributionsWithoutDonorPerGivingUnit',
    getBenchmarksForField('contributionsWithoutDonorPerGivingUnit'),
    'Contributions Without Donor Per Giving Unit'
  );

  // totalContributionsPerGivingUnit
  createChartFromParsedData(
    parseData,
    'totalContributionsPerGivingUnit_chart',
    'totalContributionsPerGivingUnit_Peer',
    'totalContributionsPerGivingUnit_Client',
    'dollar',
    1,
    'totalContributionsPerGivingUnit',
    getBenchmarksForField('totalContributionsPerGivingUnit'),
    'Total Contributions Per Giving Unit'
  );

  const contributionsWithoutDonorPerGivingUnit_percentChange_benchmark = [
    fixUnicodeCharacters("Contributions Without Donor Restrictions per Giving Unit [Percent Change] - Benchmark"),
    fixUnicodeCharacters("Improving Trend is the Benchmark")
  ];
  createBenchmark(
    contributionsWithoutDonorPerGivingUnit_percentChange_benchmark,
    "row_contributionsWithoutDonorPerGivingUnit_percentChange"
  );

  
  const totalContributionsPerGivingUnit_percentChange_benchmark = [
    fixUnicodeCharacters("Total Contributions per Giving Unit [Percent Change] - Benchmark"),
    fixUnicodeCharacters("Improving Trend is the Benchmark")
  ];
  createBenchmark(
    totalContributionsPerGivingUnit_percentChange_benchmark,
    "row_totalContributionsPerGivingUnit_percentChange"
  );

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
    'number',
    1,
    'cashExpendituresPerGivingUnit',
    getBenchmarksForField('cashExpendituresPerGivingUnit'),
    'Cash Expenditures Per Giving Unit'
  );

  closeSidebarAfterSelectingOption("expense");
};
