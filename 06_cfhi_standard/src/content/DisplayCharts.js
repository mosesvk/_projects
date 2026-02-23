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

// "What does this mean" text for daysOperatingCash
const daysOperatingCash_whatDoesThisMean = [
  `<p>To improve this ratio, operating cash and investments must increase at a rate greater than the denominator. Conversely, keeping operating cash and investments the same but cutting annual cash expenses will also have a positive impact on this ratio.</p>`
];

// "What does this mean" text for netCashAvailability
const netCashAvailability_whatDoesThisMean = [
  `<p>This measurement calculates the amount of cash available for other uses after the church has satisfied its current liabilities and set aside funds donors have restricted for specific uses. Any debt that is part of current liabilities but expected to be refinanced within the next year is excluded.</p>`,
  `<p>This may be one of the most important measures provided to your church leadership. Many churches today find that senior management (pastoral staff) and the governing board want to know how much cash the church has. The most important question is not &ldquo;How much do we have?&rdquo; but rather, &ldquo;Whose cash is it and how much of it can we spend?&rdquo; Those are typically two very different answers.&nbsp;</p>`,
  `<p>A net cash availability number factors in the cash required for the immediate future (less than 10 days) to determine what can safely be spent.&nbsp;</p>`,
  `<p>Net assets with donor restrictions are not to be expended for general operating purposes and therefore are excluded from the operating cash balance. Some churches have in essence &ldquo;borrowed&rdquo; from reserves with donor restrictions because they overspent in operations. This calculation will help management and the governing board identify if this is happening in your church, so it is crucial to provide this information to the decision makers.&nbsp;</p>`,
  `<p>To improve this figure, you must change one or a combination of the following factors:</p>`,
  `<ul>
	<li>Increase operating cash and investments&nbsp;</li>
	<li>Decrease current liabilities&nbsp;<br />
	&nbsp;</li>
</ul>`
];

// "What does this mean" text for debtToContributionsWithout
const debtToContributionsWithout_whatDoesThisMean = [
  `<p>This ratio measures how many times debt is greater than annual tithes and offerings without donor restrictions, which are the primary income source for most churches.</p>`,
  `<p>Lenders look at debt as funded by contributions without donor restrictions because those are the resources from which the church will be able to pay mandatory debt service payments. By looking at trends in various congregations, contributions without donor restrictions help the lender determine what debt load the church will be able to handle on top of other required expenditures (salaries, benefits, mission expenses, facility expenses, etc.).</p>`,
  `<p>The best way to improve this ratio is to decrease total debt. Another option is to increase contributions without donor restrictions. However, forecasting an increased revenue source is less certain than a careful plan that intentionally lowers the debt balance.</p>`
];

// "What does this mean" text for debtPerGivingUnit
const debtPerGivingUnit_whatDoesThisMean = [
  `<p>This measure introduces the concept of a giving unit. A giving unit is usually a group of family members that contribute jointly to the church. A giving unit is also defined as any recurring supporter of the ministry. This excludes the individual who may make a smaller one-time gift supporting an event, such as a shortterm mission trip. To identify just the regular recurring giving units, the measure only includes giving units that contribute more than $250 annually to the church.</p>`,
  `<p>This figure is calculated by dividing total debt by the number of giving units. It will vary significantly based on the philosophy, denomination, location, age, size, and demographics of the church. Each church will need to determine the level of debt it is comfortable maintaining or servicing. You will probably encounter varying opinions within your congregation. Some individuals believe that a church should not incur debt while others are very comfortable with a high debt load.</p>`,
  `<p>Lenders believe that debt will be funded by contributions without donor restrictions because these typically are the resources from which the church will be able to pay mandatory debt service payments. </p>`
];

// "What does this mean" text for contributionsWithoutDonorPerGivingUnit
const contributionsWithoutDonorPerGivingUnit_whatDoesThisMean = [
  `<p>This calculation can also be compared from year to year to see the trends and determine the impact on the church and budget. Another valuable comparison is to calculate what contributions would be if every giving unit made a certain amount (i.e., $50,000 a year) and tithed on that amount. The church could use this ratio to make the congregation aware of what the current giving per giving unit is, and what the projected giving would be if everyone participated.</p>`,
  `<p>Churches today have to look at contributions differently than at any time in the past. Contributions are down, and generational differences are very strong even in the way people contribute to their church. Young people, who are more cause-driven, tend to give to specific purposes and causes and are less interested in giving to general operations. This creates budgeting concerns.</p>`,
  `<p>Churches choose to communicate needs in various ways. Some annually communicate contributions per giving unit. Others may request contributions towards a specific need and tell the congregation what was received and how the funds were spent, and show pictures of the repairs or replacements.</p>`,
  `<p>All churches, especially those that receive large amounts of donor-restricted contributions, should consider adopting a gift acceptance policy. Such a policy would include what types of gifts would be received (cash, stock, etc.). It could also include what donor-restricted amounts the church will accept. If the church is never going to buy a bus, for example, there is no reason to accept funds for such a purpose.</p>`,
  `<p>The most obvious way to improve this calculation is to increase contributions without donor restrictions.&nbsp;</p>`
];

// "What does this mean" text for medianHouseholdIncome
const medianHouseholdIncome_whatDoesThisMean = [
  `<p>The purpose of this ratio is to see what percentage of the local median county household income giving units are contributing to your church.</p>`,
  `<p>This is calculated by dividing the total contributions (both with and without donor restrictions) per giving unit by the median household income in the local county where the majority of the church&rsquo;s giving units reside. The median income figure is obtained from the most recent U.S. Census data available, which is usually one year in arrears.</p>`,
  `<p>This allows your church to see the percentage of median household income your giving units contribute to your church. Trends between years in this data are very important. This percentage and the changes between years allow management and the board to see how much additional giving capacity the congregation has. It also is great feedback for the senior pastor to see changes in giving habits between years and in response to stewardship teaching and focus.</p>`,
  `<p>This ratio will improve as total contributions improve relative to the giving units. Because this ratio is a measure of the stewardship discipline of the congregation, however, the best way to improve it is to raise the level of stewardship awareness in the congregation.&nbsp;</p>`
];

// "What does this mean" text for cashExpendituresPerGivingUnit
const cashExpendituresPerGivingUnit_whatDoesThisMean = [
  `<p>Has your church ever wondered what your financial cost per giving unit is? This measure provides the answer. It takes cash expenses (excluding depreciation and amortization expense, which most churches on the cash or modified cash basis of accounting don&rsquo;t record), plus current-year debt principal, and divides that total by the number of giving units.</p>`,
  `<p>The power of this measure is in the peer group comparison. This allows your church to see if your expenses are high or low compared to your peers. It also shows the increases and decreases to this measure between years.</p>`,
  `<p>Another useful comparison is to determine what the net position is (per giving unit) when compared to the financial cost of total contributions received. By taking the net between this measure and Measurement 6, you get the information to know if your contributions are high enough to cover cash operations though current contributions received.&nbsp;</p>`
];

// "What does this mean" text for personnelIncludingToTotalCashExpenditures
const personnelInclude_whatDoesThisMean = [
  `<p>Many churches have moved to outsourcing certain key functions in their operations (such as custodial, information technology, and accounting functions, to name a few). Outsourcing allows churches to rely on vendors who specialize in a particular field and avoid hiring that expertise in-house, particularly when they don&rsquo;t need that skill on a full-time basis. This also reduces the associated recruiting and operational costs of these functions.</p>`,
  `<p>As many churches turn to outsourcing to take advantage of specialists with expertise and technical equipment, it&rsquo;s important to measure the cost of outsourcing when looking at personnel costs. This ratio incorporates those factors and calculates a fully loaded cost, including outsourced employees. This will allow the church to compare its total personnel cost with peers who may or may not outsource.&nbsp;</p>`
];

// "What does this mean" text for totalContributionsPerGivingUnit
const contrPerAvgAttAndGU_whatDoesThisMean = [
  `<p>The key difference between this result and Measurement 5 is that this is calculated on total contributions (both with and without donor restrictions).</p>`,
  `<p>When a church is in the midst of a specific campaign, it will likely receive some large one-time gifts. Since this measurement includes both gifts with and without donor restrictions, it is important that these are eliminated; otherwise, there could be large swings between years. As with Measurement 5, the power of this measurement is in analyzing trends in congregational giving habits between years. Keep in mind that during the period of a capital campaign, this figure may be inflated, even with the removal of large or one-time gifts, due to an increase in smaller gifts as well.</p>`,
  `<p>Again, the most apparent way to improve this calculation is to increase total contributions. &nbsp;</p>`
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
    "dollar",
    0,
    "contributionsWithoutDonorExcludingLargeGifts",
    getBenchmarksForField("contributionsWithoutDonorExcludingLargeGifts"),
    "Contributions Without Donor Excluding Large Gifts"
  );

  // Use hardcoded benchmark text (empty strings for metrics without benchmarks)
  createBenchmark("", "generalData", "row_givingUnits");
  createBenchmark("", "generalData", "row_contributionsWithoutDonorExcludingLargeGifts");

  // Display benchmarks above Expand Info buttons
  setTimeout(() => {
    displayBenchmarksAboveExpandInfo();
  }, 100);

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

  // Use hardcoded benchmark text
  createBenchmark("Good: > 90 days | Warning: 60 - 90 days | Action: < than 60 days", "cashData", "row_daysOperatingCash");
  createBenchmark("Good: > 1 month expenses  | Warning: > 0 and < 1 month expenses | Action: < 0", "cashData", "row_netCashAvailability");
  
  // Add "What does this mean?" content
  createWhatDoesThisMean(daysOperatingCash_whatDoesThisMean, "row_daysOperatingCash");
  createWhatDoesThisMean(netCashAvailability_whatDoesThisMean, "row_netCashAvailability");

  // Display benchmarks above Expand Info buttons
  setTimeout(() => {
    displayBenchmarksAboveExpandInfo();
  }, 100);

  closeSidebarAfterSelectingOption("cash");
};

const displayDebtComponent = () => {
  const savedData = getStoredData('debtData');
  const parseData = parseStoredData(savedData);

  // debtToContributionsWithout (fixedNum 1 so trend lines show decimals e.g. 1.5, 1.2)
  createChartFromParsedData(
    parseData,
    "debtToContributionsWithout_chart",
    "debtToContributionsWithout_Peer",
    "debtToContributionsWithout_Client",
    "number",
    1,
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

  // Use hardcoded benchmark text
  createBenchmark("Good: < 2 | Warning:  2 - 3 | Action:  > 3", "debtData", "row_debtToContributionsWithout");
  createBenchmark("Good: < 2x | Warning: 2x - 3x | Action: > 3x contributions w/o donor restrictions per giving unit", "debtData", "row_debtPerGivingUnit");
  
  // Add "What does this mean?" content
  createWhatDoesThisMean(debtToContributionsWithout_whatDoesThisMean, "row_debtToContributionsWithout");
  createWhatDoesThisMean(debtPerGivingUnit_whatDoesThisMean, "row_debtPerGivingUnit");

  // Display benchmarks above Expand Info buttons
  setTimeout(() => {
    displayBenchmarksAboveExpandInfo();
  }, 100);

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

  // Use hardcoded benchmark text
  createBenchmark("", "incomeData", "row_contributionsWithoutDonorPerGivingUnit");
  createBenchmark("Good: Improving Trend", "incomeData", "row_contributionsWithoutDonorPerGivingUnit_percentChange");
  createBenchmark("Good: > $4,500 | Warning: $3,000 - $4,500 | Action: < than $3,000", "incomeData", "row_totalContributionsPerGivingUnit");
  createBenchmark("Good: Improving Trend", "incomeData", "row_totalContributionsPerGivingUnit_percentChange");
  
  // Add "What does this mean?" content
  createWhatDoesThisMean(contributionsWithoutDonorPerGivingUnit_whatDoesThisMean, "row_contributionsWithoutDonorPerGivingUnit");
  createWhatDoesThisMean(contrPerAvgAttAndGU_whatDoesThisMean, "row_totalContributionsPerGivingUnit");
  
  // Median Household Income (no chart, just table row)
  createBenchmark("", "incomeData", "row_medianHouseholdIncome");
  createWhatDoesThisMean(medianHouseholdIncome_whatDoesThisMean, "row_medianHouseholdIncome");

  // Display benchmarks above Expand Info buttons
  setTimeout(() => {
    displayBenchmarksAboveExpandInfo();
  }, 100);

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

  // personnelIncludingToTotalCashExpenditures — pass parseData so weighted average (Avg line) gets totalSalaries, totalExpense, costOfOutsourcedEmployee, totalDepreciationExpense
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
    parseData
  );

  // Use hardcoded benchmark text
  createBenchmark("", "expenseData", "row_cashExpendituresPerGivingUnit");
  createBenchmark("Good: 40-55% | Warning: 35-40% or 55-59% | Action: < 35% or > 59%", "expenseData", "row_personnelIncludingToTotalCashExpenditures");
  
  // Add "What does this mean?" content
  createWhatDoesThisMean(cashExpendituresPerGivingUnit_whatDoesThisMean, "row_cashExpendituresPerGivingUnit");
  createWhatDoesThisMean(personnelInclude_whatDoesThisMean, "row_personnelIncludingToTotalCashExpenditures");

  // Display benchmarks above Expand Info buttons
  setTimeout(() => {
    displayBenchmarksAboveExpandInfo();
  }, 100);

  closeSidebarAfterSelectingOption("expense");
};

/**
 * Map of field names to their benchmark text for display above Expand Info buttons
 * Matches Comprehensive project where metrics are the same
 * @type {Object<string, string>}
 */
const fieldBenchmarkMap = {
  givingUnits: "", // No benchmark text
  contributionsWithoutDonorExcludingLargeGifts: "", // No benchmark text
  daysOperatingCash: "Good: > 90 days | Warning: 60 - 90 days | Action: < than 60 days",
  netCashAvailability: "Good: > 1 month expenses  | Warning: > 0 and < 1 month expenses | Action: < 0",
  debtToContributionsWithout: "Good: < 2 | Warning:  2 - 3 | Action:  > 3",
  debtPerGivingUnit: "Good: < 2x | Warning: 2x - 3x | Action: > 3x contributions w/o donor restrictions per giving unit",
  contributionsWithoutDonorPerGivingUnit: "", // No benchmark text
  contributionsWithoutDonorPerGivingUnit_percentChange: "Good: Improving Trend",
  totalContributionsPerGivingUnit: "Good: > $4,500 | Warning: $3,000 - $4,500 | Action: < than $3,000",
  totalContributionsPerGivingUnit_percentChange: "Good: Improving Trend",
  cashExpendituresPerGivingUnit: "", // No benchmark text
  personnelIncludingToTotalCashExpenditures: "Good: 40-55% | Warning: 35-40% or 55-59% | Action: < 35% or > 59%",
};

// Make fieldBenchmarkMap accessible globally for use in Utility.js
if (typeof window !== 'undefined') {
  window.fieldBenchmarkMap = fieldBenchmarkMap;
}

/**
 * Display benchmark text above the Expand Info button for charts that have benchmarks
 * This function should be called after charts are displayed
 * Ensures "Expand Info" button is always aligned to the right, even when no benchmark text exists
 */
const displayBenchmarksAboveExpandInfo = () => {
  // Find ALL Expand Info buttons (those with data-modal-target ending in "_modal")
  const allExpandInfoButtons = document.querySelectorAll(
    'button[data-modal-target$="_modal"]'
  );

  allExpandInfoButtons.forEach((button) => {
    // Extract field name from modal target (e.g., "givingUnits_modal" -> "givingUnits")
    const modalTarget = button.getAttribute("data-modal-target");
    if (!modalTarget || !modalTarget.endsWith("_modal")) {
      return;
    }

    const fieldName = modalTarget.replace("_modal", "");

    // Skip non-chart modals (like options_modal, print_modal)
    if (fieldName === "options" || fieldName === "print") {
      return;
    }

    // Get benchmark text from map (undefined if not in map)
    const benchmarkText = fieldBenchmarkMap[fieldName];

    // Find the parent container with the flex layout (match by border-t class)
    let flexContainer = button.parentElement;
    while (flexContainer && !flexContainer.classList.contains("border-t")) {
      flexContainer = flexContainer.parentElement;
    }

    if (!flexContainer) {
      // console.warn(`Flex container not found for ${fieldName}`);
      return;
    }

    // Find the flex-shrink-0 div that contains the button
    const buttonContainer = button.closest(".flex-shrink-0");

    if (!buttonContainer) {
      // console.warn(`Button container not found for ${fieldName}`);
      return;
    }

    // Check if benchmark text already exists
    const existingBenchmark = flexContainer.querySelector(
      `[data-benchmark-field="${fieldName}"]`
    );

    // Handle benchmark text
    if (benchmarkText && benchmarkText.trim() !== "") {
      // We have benchmark text to display
      if (existingBenchmark) {
        // Update existing benchmark text
        existingBenchmark.textContent = benchmarkText;
      } else {
        // Create the paragraph element with benchmark text
        const benchmarkP = document.createElement("p");
        benchmarkP.className =
          "mb-2 text-sm font-medium text-gray-500 dark:text-white";
        benchmarkP.textContent = benchmarkText;
        benchmarkP.setAttribute("data-benchmark-field", fieldName);

        // Insert the benchmark text as a sibling before the button container
        buttonContainer.parentNode.insertBefore(benchmarkP, buttonContainer);
      }
      
      // Remove ml-auto from button container if it exists (benchmark text will push it right via justify-between)
      if (buttonContainer.classList.contains("ml-auto")) {
        buttonContainer.classList.remove("ml-auto");
      }
    } else {
      // No benchmark text - ensure button is pushed to the right
      if (existingBenchmark) {
        // Remove existing empty benchmark text
        existingBenchmark.remove();
      }
      
      // Add ml-auto to button container to push it to the right when no benchmark text exists
      if (!buttonContainer.classList.contains("ml-auto")) {
        buttonContainer.classList.add("ml-auto");
      }
    }
  });
};
