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
    "givingUnits"
  );
  // attendeesToStaff
  createChartFromParsedData(
    parseData,
    "attendeesToStaff_chart",
    "attendeesToStaff_Peer",
    "attendeesToStaff_Client",
    "number",
    0,
    "attendeesToStaff"
  );

  let attendToStaff_benchmark = [
    "Attendees to Staff Benchmark",
    "We believe that a reasonable benchmark is between 65 - 90 range.",
  ];
  createBenchmark(attendToStaff_benchmark, "row_attendeesToStaff");

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
    "daysOperatingCash"
  );

  // netCashAvailability
  createChartFromParsedData(
    parseData,
    "netCashAvailability_chart",
    "netCashAvailability_Peer",
    "netCashAvailability_Client",
    "number",
    0,
    "netCashAvailability"
  );

  let daysExpendable_benchmark = [
    'Days Expendable Benchmark',
    'We believe a reasonable benchmark for this ratio is 30 to 60 days of cash expenses on hand. Furthermore, a result of less than 15 days could be interpreted as a <span class="red">red flag</span>.',
  ];
  createBenchmark(daysExpendable_benchmark, "row_daysExpendableNetAssets");

  let daysOperatingCash_benchmark = [
    'Days Operating Cash Benchmark',
    'Some churches want to maintain a certain level of reserves. The reserves can be used for economic downturns or unexpected expenses, events, or new opportunities. Often, churches that try to build up reserves have a goal.',
    'We believe an appropriate benchmark for this ratio is 40 to 80 days of annual cash expenditures on hand.  Furthermore, a result of less than 20 days could be interpreted as a  <span class="red">red flag</span>',
    ]
  createBenchmark(daysOperatingCash_benchmark, "row_daysOperatingCash");

  let availableDaysCash_benchmark = [
    'Available Days of Cash Flow Benchmark',
    'We believe a reasonable benchmark is 120 to 180 days worth of cash expenditures on hand. A result of less than 60 days could be interpreted as a <span class="red">red flag</span>',
    ]
  createBenchmark(availableDaysCash_benchmark, "row_availableDaysOfCashFlow");

  let liquidityRatio_benchmark = [
    'Liquidity Ratio Benchmark',
    'Based on our experience, we have set the minimum benchmark for this ratio at greater than or equal to 5.0. Results less than this may indicate that the church is keeping fewer liquid reserves and is less likely to be able to handle unexpected operating expenses, events, or new opportunities that may come along.',
    ]
  createBenchmark(liquidityRatio_benchmark, "row_liquidityRatio");

  let netCashAvailability_benchmark = [
    'Net Cash Availability Benchmark',
    'We believe the minimum benchmark for this number is at least one month’s worth of cash expenses. Any positive amount less than this is in the warning range. Any negative amount indicates that the church is borrowing from funds with donor restrictions and could be interpreted as a <span class="red">red flag</span>. Also, a calculation that is positive only when amounts available on an operating line of credit are included could be interpreted as a <span class="red">red flag</span> because the church is still relying on short-term revolving debt to meet its immediate cash needs.',
    ]
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
    "debtToContributionsWithout"
  );

  // currentRatio
  createChartFromParsedData(
    parseData,
    "currentRatio_chart",
    "currentRatio_Peer",
    "currentRatio_Client",
    "number",
    0,
    "currentRatio"
  );

  // mandatoryDebtServiceToContributionsWithout
  createChartFromParsedData(
    parseData,
    "mandatoryDebtServiceToContributionsWithout_chart",
    "mandatoryDebtServiceToContributionsWithout_Peer",
    "mandatoryDebtServiceToContributionsWithout_Client",
    "percent",
    0,
    "mandatoryDebtServiceToContributionsWithout"
  );

  // debtPerGivingUnit
  createChartFromParsedData(
    parseData,
    "debtPerGivingUnit_chart",
    "debtPerGivingUnit_Peer",
    "debtPerGivingUnit_Client",
    "dollar",
    0,
    "debtPerGivingUnit"
  );

  // debtCoverage
  createChartFromParsedData(
    parseData,
    "debtCoverage_chart",
    "debtCoverage_Peer",
    "debtCoverage_Client",
    "dollar",
    0,
    "debtCoverage"
  );

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
    "netIncomeRatio"
  );

  // contributionsWithoutDonorPerGivingUnit
  createChartFromParsedData(
    parseData,
    "contributionsWithoutDonorPerGivingUnit_chart",
    "contributionsWithoutDonorPerGivingUnit_Peer",
    "contributionsWithoutDonorPerGivingUnit_Client",
    "dollar",
    1,
    "contributionsWithoutDonorPerGivingUnit"
  );

  // totalContributionsPerGivingUnit
  createChartFromParsedData(
    parseData,
    "totalContributionsPerGivingUnit_chart",
    "totalContributionsPerGivingUnit_Peer",
    "totalContributionsPerGivingUnit_Client",
    "dollar",
    1,
    "totalContributionsPerGivingUnit"
  );

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
    "benefitsToSalaries"
  );

  // salariesBenefitsIncludingOutsourcedEmployees
  createChartFromParsedData(
    parseData,
    "salariesBenefitsIncludingOutsourcedEmployees_chart",
    "salariesBenefitsIncludingOutsourcedEmployees_Peer",
    "salariesBenefitsIncludingOutsourcedEmployees_Client",
    "number",
    1,
    "salariesBenefitsIncludingOutsourcedEmployees"
  );

  // personnelToCashExpenditure
  createChartFromParsedData(
    parseData,
    "personnelToCashExpenditure_chart",
    "personnelToCashExpenditure_Peer",
    "personnelToCashExpenditure_Client",
    "number",
    1,
    "personnelToCashExpenditure"
  );

  // cashExpendituresPerGivingUnit
  createChartFromParsedData(
    parseData,
    "cashExpendituresPerGivingUnit_chart",
    "cashExpendituresPerGivingUnit_Peer",
    "cashExpendituresPerGivingUnit_Client",
    "number",
    1,
    "cashExpendituresPerGivingUnit"
  );

  closeSidebarAfterSelectingOption("expense");
};
