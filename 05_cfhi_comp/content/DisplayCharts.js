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

  const attendToStaff_benchmark = [
    "Attendees to Staff Benchmark",
    "We believe that a reasonable benchmark is between 65 - 90 range.",
  ];
  createBenchmark(attendToStaff_benchmark, "row_attendeesToStaff");

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
    "daysExpendableNetAssets"
  );

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

  // availableDaysOfCashFlow
  createChartFromParsedData(
    parseData,
    "availableDaysOfCashFlow_chart",
    "availableDaysOfCashFlow_Peer",
    "availableDaysOfCashFlow_Client",
    "number",
    0,
    "availableDaysOfCashFlow"
  );

  // liquidityRatio
  createChartFromParsedData(
    parseData,
    "liquidityRatio_chart",
    "liquidityRatio_Peer",
    "liquidityRatio_Client",
    "number",
    0,
    "liquidityRatio"
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

  const daysExpendable_benchmark = [
    "Days Expendable Benchmark",
    'We believe a reasonable benchmark for this ratio is 30 to 60 days of cash expenses on hand. Furthermore, a result of less than 15 days could be interpreted as a <span class="red">red flag</span>.',
  ];
  createBenchmark(daysExpendable_benchmark, "row_daysExpendableNetAssets");

  const daysOperatingCash_benchmark = [
    "Days Operating Cash Benchmark",
    "Some churches want to maintain a certain level of reserves. The reserves can be used for economic downturns or unexpected expenses, events, or new opportunities. Often, churches that try to build up reserves have a goal.",
    'We believe an appropriate benchmark for this ratio is 40 to 80 days of annual cash expenditures on hand.  Furthermore, a result of less than 20 days could be interpreted as a  <span class="red">red flag</span>',
  ];
  createBenchmark(daysOperatingCash_benchmark, "row_daysOperatingCash");

  const availableDaysCash_benchmark = [
    "Available Days of Cash Flow Benchmark",
    'We believe a reasonable benchmark is 120 to 180 days worth of cash expenditures on hand. A result of less than 60 days could be interpreted as a <span class="red">red flag</span>',
  ];
  createBenchmark(availableDaysCash_benchmark, "row_availableDaysOfCashFlow");

  const liquidityRatio_benchmark = [
    "Liquidity Ratio Benchmark",
    "Based on our experience, we have set the minimum benchmark for this ratio at greater than or equal to 5.0. Results less than this may indicate that the church is keeping fewer liquid reserves and is less likely to be able to handle unexpected operating expenses, events, or new opportunities that may come along.",
  ];
  createBenchmark(liquidityRatio_benchmark, "row_liquidityRatio");

  const netCashAvailability_benchmark = [
    "Net Cash Availability Benchmark",
    'We believe the minimum benchmark for this number is at least one month’s worth of cash expenses. Any positive amount less than this is in the warning range. Any negative amount indicates that the church is borrowing from funds with donor restrictions and could be interpreted as a <span class="red">red flag</span>. Also, a calculation that is positive only when amounts available on an operating line of credit are included could be interpreted as a <span class="red">red flag</span> because the church is still relying on short-term revolving debt to meet its immediate cash needs.',
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

  const debtToContributionsWithout_benchmark = [
    "Debt to Contributions Without Donor Restrictions Benchmark",
    "We discussed this with several church lenders and concluded that the benchmark for this ratio should be less than or equal to 2.0.",
    "Based on our experience with church clients across the country, we realize the lower this ratio is, the less strain debt will be on the church’s budget.  We started with the lender-recommended benchmark as the maximum limit and have further broken it down as follows:",
    "A ratio less than or equal to 2.0 is within the benchmark.",
    "Any ratio greater than 2.0 to 3.0 is in the warning range.",
    'Any amount in excess of 3.0 could be interpreted as a <strong class="red">red flag.</strong>  A ratio result that high indicates that the church’s debt levels are in excess of three times the support without donor restrictions, which places excessive burden on the budget. It also means that debt is at a level lenders consider too great for the church to support.',
  ];
  createBenchmark(
    debtToContributionsWithout_benchmark,
    "row_debtToContributionsWithout"
  );

  const currentRatio_benchmark = [
    "Current Ratio Benchmark",
    "We believe the benchmark for this ratio is a minimum of 2.0.",
  ];
  createBenchmark(currentRatio_benchmark, "row_currentRatio");

  const mandatoryDebtService_benchmark = [
    "Mandatory Debt Service to Contributions Benchmark",
    "The benchmark was set based on our discussions with various church lenders, who had very consistent responses. We believe the benchmark for this ratio is less than 15% - 20% of contributions without donor restrictions. However, some lenders will allow up to 30% of contributions without donor restrictions as an acceptable benchmark. Results below the benchmark would allow room in the budget in case the church’s interest rate increases.",
  ];
  createBenchmark(
    mandatoryDebtService_benchmark,
    "row_mandatoryDebtServiceToContributionsWithout"
  );

  const debtPerAverageAttendeeBenchmarkPopup = [
    "Debt Per Average Adult Attendee Benchmark",
    "Within Benchmark: < or = 2.0 x contributions without donor restrictions Per Average Adult Attendee.",
  ];
  createBenchmark(
    debtPerAverageAttendeeBenchmarkPopup,
    "row_debtPerAverageAdultAttendee"
  );

  const debtPerGivingUnit_benchmark = [
    "Debt Per Giving Unit Benchmark",
    "In developing this benchmark, we looked at the RMA standards and had conversations with both lenders and churches. We determined that it was not possible to come up with a firm number because of the many factors that impact the levels of debt per adult attendee and giving unit a particular church is able to successfully carry.",
    "We decided that the benchmark should be set by the revenue stream lenders consider for repayment, or by contributions without donor restrictions. Because giving varies so much from church to church, we decided it is not possible to set a fixed amount for this benchmark. Rather, the benchmark should be determined by the level of giving without donor restrictions per adult attendee or giving unit.",
    'Setting the range of maximum debt per adult attendee or giving unit is another way of looking at Ratio 6 because the maximum debt per attendee or giving unit times total adult attendees or giving units must correspond with the benchmark set for debt to contributions without donor restrictions. Using the same benchmark set for Ratio 6 tells us that we must multiply no more than 2.0 times the contributions without donor restrictions per adult attendee or giving unit (calculated in Measurement 12) to be within the benchmark. An amount between 2.0 and 3.0 times contributions without donor restrictions per adult attendee or giving unit is in the warning range. Any amount in excess of 3.0 could be interpreted as a <strong class="red"> red flag </strong>for the reasons stated in Ratio 6 above.',
    "The best way to improve this measure is to lower total debt through consistent payments and additional principal reductions, when funds allow. Increasing the number of adult attendees and giving units will also have the same positive effect on the measure, but may be harder to prove as outside parties will require the use of an adult attendee or giving unit number developed over an extended period of time.",
  ];
  createBenchmark(debtPerGivingUnit_benchmark, "row_debtPerGivingUnit");

  const debtCoverage_benchmark = [
    "Debt Coverage Benchmark",
    "We believe the benchmark is a result greater than or equal to 1.15, based on our conversations with church lenders and our experience.",
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

  const netIncome_benchmark = [
    "Net Income Ratio Benchmark",
    "The benchmark for this ratio in any particular year is that it is positive. However, we understand there will be years the church invests in its ministry and the ratio may be negative because of a predetermined choice. A more important benchmark is for the average net income ratio to be an improving trend over the years.",
  ];
  createBenchmark(netIncome_benchmark, "row_netIncomeRatio");
  const netIncome_twoYrAvg_benchmark = [
    "Net Income Ratio Two Year Average Benchmark",
    "The benchmark for this ratio in any particular year is that it is positive. However, we understand there will be years the church invests in its ministry and the ratio may be negative because of a predetermined choice. A more important benchmark is for the average net income ratio to be an improving trend over the years.",
  ];
  createBenchmark(netIncome_twoYrAvg_benchmark, "row_netIncomeRatio_twoYrAvg");

  const totalContrPerAAA_benchmark = [
    "Total Contributions Per Average Adult Attendee Benchmark",
    "Good: >$2,000",
    "Above Average: >$2,500",
    "Strong: >=$3,000",
  ];
  createBenchmark(
    totalContrPerAAA_benchmark,
    "row_totalContributionsPerAverageAdultAttendee"
  );

  const contrWithoutAverageAdultAttendee_benchmark = [
    "Contributions Without Donor Restrictions Per Average Adult Attendee Benchmark",
    "An improving trend is the benchmark.",
  ];
  createBenchmark(
    contrWithoutAverageAdultAttendee_benchmark,
    "row_contributionsWithoutDonorPerAverageAdultAttendee_percentChange"
  );

  const contrWithoutDonorPerGivingUnit_benchmark = [
    "Contributions Without Donor Restrictions Per Giving Unit Benchmark",
    "An improving trend is the benchmark.",
  ];
  createBenchmark(
    contrWithoutDonorPerGivingUnit_benchmark,
    "row_contributionsWithoutDonorPerGivingUnit_percentChange"
  );

  const totalContributtionsPerAverageAdultAttendee_benchmark = [
    "Total Contributions Per Average Adult Attendee Benchmark",
    "An improving trend is the benchmark.",
  ];
  createBenchmark(
    totalContributtionsPerAverageAdultAttendee_benchmark,
    "row_totalContributionsPerAverageAdultAttendee_percentChange"
  );

  const totalContributionsPerGivingUnit_benchmark = [
    "Total Contributions Per Giving Unit Benchmark",
    "An improving trend is the benchmark.",
  ];
  createBenchmark(
    totalContributionsPerGivingUnit_benchmark,
    "row_totalContributionsPerGivingUnit_percentChange"
  );

  const localCounty_benchmark = [
    `Local County - Benchmark`,
    "We believe that a reasonable benchmark is between 1.5% - 3% of the total giving.",
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

  const personnelToCash_benchmark = [
    "Personnel to Cash Expenditure Benchmark",
    "40% - 55%",
  ];
  createBenchmark(personnelToCash_benchmark, "row_personnelToCashExpenditure");

  const mandatoryDebtToCashExpend_benchmark = [
    "Mandatory Debt Service to Cash Expenditure Benchmark",
    "15% or less",
  ];
  createBenchmark(
    mandatoryDebtToCashExpend_benchmark,
    "row_mandatoryDebtServiceToCashExpenditure"
  );

  const personnelIncludingToTotalCashExpenditures_benchmark = [
    "Personnel Including Benefits to Total Cash Expenditures Benchmark",
    "An improving trend is the benchmark.",
  ];
  createBenchmark(
    personnelIncludingToTotalCashExpenditures_benchmark,
    "row_personnelIncludingToTotalCashExpenditures"
  );

  const totalGlobalAndLocalOutreachExpenses_benchmark = [
    "Total Global and Local Outreach Expenses Benchmark",
    "10% - 25%",
  ];
  createBenchmark(
    totalGlobalAndLocalOutreachExpenses_benchmark,
    "row_totalGlobalAndLocalOutreachExpenses"
  );

  const facilitiesExpenseToTotalCashExpenditures_benchmark = [
    "Facilities Expense to Total Cash Expenditures Benchmark",
    "20% - 30%",
  ];
  createBenchmark(
    facilitiesExpenseToTotalCashExpenditures_benchmark,
    "row_facilitiesExpenseToTotalCashExpenditures_lessThanTen"
  );

  closeSidebarAfterSelectingOption("expense");
};
