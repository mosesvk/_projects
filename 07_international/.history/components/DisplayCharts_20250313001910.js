displayGeneralComponent = (data) => {
  const savedData = getStoredData("cashData");
  const generalData = getStoredData("generalData");
  const parseData = parseStoredData(savedData);
  const generalParseData = parseStoredData(generalData);

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

  // netAssetBreakdown
  createChartFromParsedData(
    generalParseData,
    "netAssetBreakdown_chart",
    null,
    null,
    "dollar",
    0,
    "netAssetBreakdown"
  );

  // changeInNetAssets
  createChartFromParsedData(
    generalParseData,
    "changeInNetAssets_chart",
    null,
    "changeInNetAssets_Client",
    "dollar",
    0,
    "changeInNetAssets",
    false,
    null,
    "Change in Net Assets",
    "line"
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
    "wa"
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

  // liquidityAssetsAvailableCover
  createChartFromParsedData(
    parseData,
    "liquidityAssetsAvailableCover_chart",
    "liquidityAssetsAvailableCover_Peer",
    "liquidityAssetsAvailableCover_Client",
    "number",
    2,
    "liquidityAssetsAvailableCover",
    false,
    1,
    "Liquidity: Assets Available to Cover Liabilities and Net Assets with Donor Restrictions",
    "line"
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
    2,
    "assetsWithoutPpeToLiabilitiesWithoutDebt",
    false,
    1,
    "Assets Without PPE to Liabilities Without Debt",
    "line"
  );
};

displayIncomeComponent = (data) => {
  const savedData = getStoredData("incomeData");
  const parseData = parseStoredData(savedData);

  // totalContributions
  createChartFromParsedData(
    parseData,
    "totalContributions_chart",
    "totalContributions_Peer",
    "totalContributions_Client",
    "percent",
    0,
    "totalContributions"
  );

  // contributionsWithoutDR
  createChartFromParsedData(
    parseData,
    "contributionsWithoutDR_chart",
    "contributionsWithoutDR_Peer",
    "contributionsWithoutDR_Client",
    "percent",
    0,
    "contributionsWithoutDR"
  );

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

  // functionalAllocation - add this first
  createChartFromParsedData(
    parseData,
    "functionalAllocation_chart",
    "functionalExpensePercent_program_Peer",
    "functionalExpensePercent_program_Client",
    "percent",
    0,
    "functionalAllocation"
  );

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
  // costOfContributionsDetailView
  createChartFromParsedData(
    parseData,
    "costOfContributionsDetailView_chart",
    "costOfContributions_Peer",
    "costOfContributions_Client",
    "dollar",
    2,
    "costOfContributionsDetailView"
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
