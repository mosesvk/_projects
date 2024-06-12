displayCfiComponent = data => {
  const savedData = getStoredData ('cfiData');
  const parseData = parseStoredData (savedData);

  // cfiRatio
  createChartFromParsedData (
    parseData,
    'cfiRatio_chart',
    'cfiRatio_Peer',
    'cfiRatio_Client',
    'number',
    0,
    'cfiRatio'
  );
};

// displayIncomeComponent = (data) => {
//   const savedData = getStoredData("incomeData");
//   const parseData = parseStoredData(savedData);

//   // contributionsTrend
//   createChartFromParsedData(
//     parseData,
//     "contributionsTrend_chart",
//     "contributionsTrend_Peer",
//     "contributionsTrend_Client",
//     "currency",
//     0,
//     "contributionsTrend"
//   );

//   // annualizedInvestmentReturn
//   createChartFromParsedData(
//     parseData,
//     "annualizedInvestmentReturn_chart",
//     "annualizedInvestmentReturn_Peer",
//     "annualizedInvestmentReturn_Client",
//     "currency",
//     0,
//     "annualizedInvestmentReturn"
//   );
// };

// displayExpenseComponent = (data) => {
//   const savedData = getStoredData("expenseData");
//   const parseData = parseStoredData(savedData);

//   // functionalExpensePercent_program
//   createChartFromParsedData(
//     parseData,
//     "functionalExpensePercent_program_chart",
//     "functionalExpensePercent_program_Peer",
//     "functionalExpensePercent_program_Client",
//     "percent",
//     0,
//     "functionalExpensePercent_program"
//   );
//   // functionalExpensePercent_administrative
//   createChartFromParsedData(
//     parseData,
//     "functionalExpensePercent_administrative_chart",
//     "functionalExpensePercent_administrative_Peer",
//     "functionalExpensePercent_administrative_Client",
//     "percent",
//     0,
//     "functionalExpensePercent_administrative"
//   );
//   // functionalExpensePercent_fundraising
//   createChartFromParsedData(
//     parseData,
//     "functionalExpensePercent_fundraising_chart",
//     "functionalExpensePercent_fundraising_Peer",
//     "functionalExpensePercent_fundraising_Client",
//     "percent",
//     0,
//     "functionalExpensePercent_fundraising"
//   );
//   // functionalExpensePercent_other
//   createChartFromParsedData(
//     parseData,
//     "functionalExpensePercent_other_chart",
//     "functionalExpensePercent_other_Peer",
//     "functionalExpensePercent_other_Client",
//     "percent",
//     0,
//     "functionalExpensePercent_other"
//   );
//   // costOfContributions
//   createChartFromParsedData(
//     parseData,
//     "costOfContributions_chart",
//     "costOfContributions_Peer",
//     "costOfContributions_Client",
//     "currency",
//     0,
//     "costOfContributions"
//   );
// };
