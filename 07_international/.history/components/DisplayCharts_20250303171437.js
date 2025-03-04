
displayGeneralComponent = (data) => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);

  // cashFlowsTrend
  statementCashFlows_chart = new ApexCharts(
    document.getElementById("statementCashFlows_chart"),
    getCashFlowChartOptions(parseData, [
      "cashFlowsTrendFinancing",
      "cashFlowsTrendInvesting",
      "cashFlowsTrendOperating",
      "cashFlowsTrendTotal",
    ])
  );

  statementCashFlows_chart.render();

  updateCashFlowModal("cashFlowsTrend", parseData, [
    "cashFlowsTrendFinancing",
    "cashFlowsTrendInvesting",
    "cashFlowsTrendOperating",
    "cashFlowsTrendTotal",
  ]);

  // init magain when toggling dark mode
  document.addEventListener("dark-mode", function () {
    statementCashFlows_chart.updateOptions(
      getCashFlowChartOptions(parseData, [
        "cashFlowsTrendFinancing",
        "cashFlowsTrendInvesting",
        "cashFlowsTrendOperating",
        "cashFlowsTrendTotal",
      ])
    );
  });
};

displayCashComponent = (data) => {
  const savedData = getStoredData("cashData");
  const parseData = parseStoredData(savedData);

  // daysCashOnHand
  createChartFromParsedData(
    parseData,
    "daysCashOnHand_chart",
    "daysCashOnHand_Peer",
    "daysCashOnHand_Client",
    "number",
    0,
    "daysCashOnHand", 
    'wa'
  );

  // daysExpensesInUnrestrictedNA
  createChartFromParsedData(
    parseData,
    "daysExpensesInUnrestrictedNA_chart",
    "daysExpensesInUnrestrictedNA_Peer",
    "daysExpensesInUnrestrictedNA_Client",
    "number",
    0,
    "daysExpensesInUnrestrictedNA"
  );

  // daysExpensesInUnrestrictedNA_excludingPPE
  createChartFromParsedData(
    parseData,
    "daysExpensesInUnrestrictedNA_excludingPPE_chart",
    "daysExpensesInUnrestrictedNA_excludingPPE_Peer",
    "daysExpensesInUnrestrictedNA_excludingPPE_Client",
    "number",
    0,
    "daysExpensesInUnrestrictedNA_excludingPPE"
  );

  // totalCoverageRatio
  createChartFromParsedData(
    parseData,
    "totalCoverageRatio_chart",
    "totalCoverageRatio_Peer",
    "totalCoverageRatio_Client",
    "number",
    0,
    "totalCoverageRatio"
  );

  // assetsWithoutPpeToLiabilitiesWithoutDebt
  createChartFromParsedData(
    parseData,
    "assetsWithoutPpeToLiabilitiesWithoutDebt_chart",
    "assetsWithoutPpeToLiabilitiesWithoutDebt_Peer",
    "assetsWithoutPpeToLiabilitiesWithoutDebt_Client",
    "number",
    0,
    "assetsWithoutPpeToLiabilitiesWithoutDebt", 
    'line'
  );
};

displayIncomeComponent = (data) => {
  const savedData = getStoredData("incomeData");
  const parseData = parseStoredData(savedData);

  // contributionsTrend
  createChartFromParsedData(
    parseData,
    "contributionsTrend_chart",
    "contributionsTrend_Peer",
    "contributionsTrend_Client",
    "percent",
    0,
    "contributionsTrend"
  );

  // annualizedInvestmentReturn
  createChartFromParsedData(
    parseData,
    "annualizedInvestmentReturn_chart",
    "annualizedInvestmentReturn_Peer",
    "annualizedInvestmentReturn_Client",
    "percent",
    0,
    "annualizedInvestmentReturn"
  );
};

displayExpenseComponent = (data) => {
  const savedData = getStoredData("expenseData");
  const parseData = parseStoredData(savedData);

  // functionalExpensePercent_program
  createChartFromParsedData(
    parseData,
    "functionalExpensePercent_program_chart",
    "functionalExpensePercent_program_Peer",
    "functionalExpensePercent_program_Client",
    "percent",
    0,
    "functionalExpensePercent_program"
  );
  // functionalExpensePercent_administrative
  createChartFromParsedData(
    parseData,
    "functionalExpensePercent_administrative_chart",
    "functionalExpensePercent_administrative_Peer",
    "functionalExpensePercent_administrative_Client",
    "percent",
    0,
    "functionalExpensePercent_administrative"
  );
  // functionalExpensePercent_fundraising
  createChartFromParsedData(
    parseData,
    "functionalExpensePercent_fundraising_chart",
    "functionalExpensePercent_fundraising_Peer",
    "functionalExpensePercent_fundraising_Client",
    "percent",
    0,
    "functionalExpensePercent_fundraising"
  );
  // costOfContributions
  createChartFromParsedData(
    parseData,
    "costOfContributions_chart",
    "costOfContributions_Peer",
    "costOfContributions_Client",
    "dollar",
    2,
    "costOfContributions"
  );
};
