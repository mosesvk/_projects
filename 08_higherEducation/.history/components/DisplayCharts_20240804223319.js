displayCfiComponent = (data) => {
  // console.log('displayCfiComponent()');
  const savedData = getStoredData("cfiData");
  const parseData = parseStoredData(savedData);

  // cfiRatio
  createChartFromParsedData(
    parseData,
    "cfiRatio_chart",
    "cfiRatio_peerAverage_Peer",
    "cfiRatio_Client",
    "num",
    1,
    "cfiRatio",
    3,
    "CFI Ratio"
  );

  // cfi_primaryReserveRatiod
  createChartFromParsedData(
    parseData,
    "cfi_primaryReserveRatio_chart",
    "primaryReserveRatio_peerAverage_Peer",
    "cfi_primaryReserveRatio_Client",
    "num",
    1,
    "cfi_primaryReserveRatio",
    0.4,
    "CFI Primary Reserve Ratio"
  );

  // cfi_netIncomeOperationsRatio
  createChartFromParsedData(
    parseData,
    "cfi_netIncomeOperationsRatio_chart",
    "netIncomeOperationsRatio_peerAverage_Peer",
    "cfi_netIncomeOperationsRatio_Client",
    "percent",
    1,
    "cfi_netIncomeOperationsRatio",
    0,
    "CFI Net Income Operations Ratio"
  );

  // cfi_returnOnNetAssets
  createChartFromParsedData(
    parseData,
    "cfi_returnOnNetAssets_chart",
    "returnOnNetAssets_peerAverage_Peer",
    "cfi_returnOnNetAssets_Client",
    "percent",
    1,
    "cfi_returnOnNetAssets",
    6,
    "CFI Return on Net Assets"
  );

  // cfi_viabilityRatio
  createChartFromParsedData(
    parseData,
    "cfi_viabilityRatio_chart",
    "viabilityRatio_peerAverage_Peer",
    "cfi_viabilityRatio_Client",
    "num",
    1,
    "cfi_viabilityRatio",
    1.25,
    "CFI Viability Ratio"
  );
};

toggleDetailsByIdentifier("cfiRatio");
toggleDetailsByIdentifier("primaryReserveRatio");
toggleDetailsByIdentifier("cfiNetIncomeOperationsRatio");
toggleDetailsByIdentifier("returnOnNetAssets");
toggleDetailsByIdentifier("cfiViabilityRatio");

// Financial ANALYSIS
const displayFinancialAnalysisContentComponent = async () => {
  const savedData = getStoredData("financialAnalysisContentData");
  const parseData = parseStoredData(savedData);

  const fpaChart = new ApexCharts(
    document.querySelector("#FinancialAnalysisContent_chart"),
    getFpaChartOptions(parseData)
  );
  fpaChart.render();
  document.addEventListener("dark-mode", function () {
    fpaChart.updateOptions(getFpaChartOptions(parseData));
  });

  const atlChart = new ApexCharts(
    document.querySelector("#assetToLiabilities_chart"),
    getAtlChartOptions(parseData)
  );
  atlChart.render();
  document.addEventListener("dark-mode", function () {
    atlChart.updateOptions(getAtlChartOptions(parseData));
  });

  // const soiClientChart = new ApexCharts(
  //   document.querySelector("#sourceOfIncomeClient_chart"),
  //   getSoiClientChartOptions(parseData)
  // );
  // soiClientChart.render();
  // // console.log({soiClientChart});
  // document.addEventListener("dark-mode", function () {
  //   soiClientChart.updateOptions(getSoiClientChartOptions(parseData));
  // });

  // const soiPeerChart = new ApexCharts(
  //   document.querySelector("#sourceOfIncomePeer_chart"),
  //   getSoiPeerChartOptions(parseData)
  // );
  // soiPeerChart.render();
  // document.addEventListener("dark-mode", function () {
  //   soiPeerChart.updateOptions(getSoiPeerChartOptions(parseData));
  // });

  const ffaChart = new ApexCharts(
    document.querySelector("#ffa_chart"),
    getFfaChartOptions(parseData)
  );
  ffaChart.render();
  document.addEventListener("dark-mode", function () {
    ffaChart.updateOptions(getFfaChartOptions(parseData));
  });

  const cashFlowTrendChart = new ApexCharts(
    document.querySelector("#cashFlowsTrend_chart"),
    getCashFlowTrendChartOptions(parseData)
  );
  cashFlowTrendChart.render();
  document.addEventListener("dark-mode", function () {
    cashFlowTrendChart.updateOptions(getCashFlowTrendChartOptions(parseData));
  });
};

toggleDetailsByIdentifier("sourceOfIncome");
toggleDetailsByIdentifier("ffa");

// Financial STATEMENT
const displayFinancialStatementComponent = () => {
  const keys = [
    "totalAssetsData",
    "totalLiabilitiesData",
    "netAssetsData",
    "totalExpensesData",
    "nonOperatingActivitiesData",
    "changesInNetAssetsWithDRData",
    "naturalExpenseCategoriesData",
    "cashFlowsOperatingData",
    "cashFlowsInvestingData",
    "cashFlowsFinancingData",
    "propertyAndEquipmentData",
  ];
  const parsedData = {};

  keys.forEach((key) => {
    const storedData = getStoredData(key);
    parsedData[key] = parseStoredData(storedData);
  });

  createAndRenderChart(
    "#assets_chart",
    parsedData,
    "totalAssets_Client",
    window.chartColors.green,
    "dollar",
    "Assets"
  );

  createAndRenderChart(
    "#liabilities_chart",
    parsedData,
    "totalLiabilities_Client",
    window.chartColors.blue,
    "dollar",
    "Liabilities"
  );

  createAndRenderChart(
    "#netAssets_chart",
    parsedData,
    "netAssets_Client",
    window.chartColors.yellow,
    "dollar",
    "Net Assets"
  );

  createAndRenderChart(
    "#revenueAndSupport_chart",
    parsedData,
    "totalAssets_Client",
    window.chartColors.teal,
    "dollar",
    "Revenue and Support"
  );

  createAndRenderChart(
    "#educationalProgramExpenses_chart",
    parsedData,
    "totalExpenses_Client",
    window.chartColors.orange,
    "dollar",
    "Educational Program Expenses"
  );

  createAndRenderChart(
    "#nonoperatingActivities_chart",
    parsedData,
    "totalNonOperatingExpenses_Client",
    window.chartColors.red,
    "dollar",
    "Educational Program Expenses"
  );

  createAndRenderChart(
    "#changesInNetAssetsWithDR_chart",
    parsedData,
    "totalChangesInNetAssets_Client",
    window.chartColors.purple,
    "dollar",
    "Changes in Net Assets with Donor Restrictions"
  );

  createAndRenderChart(
    "#naturalExpenseCategories_chart",
    parsedData,
    "totalNaturalCategoryExpenses_Client",
    window.chartColors.blue,
    "dollar",
    "Natural Expense Categories"
  );

  createAndRenderChart(
    "#cashFlowsOperatingActivities_chart",
    parsedData,
    "cashFlows_operatingActivities_Client",
    window.chartColors.teal,
    "dollar",
    "Cash Flows: Operating Activities"
  );

  createAndRenderChart(
    "#cashFlowsInvestingActivities_chart",
    parsedData,
    "cashFlows_investingActivities_Client",
    window.chartColors.orange,
    "dollar",
    "Cash Flows: Investing Activities"
  );

  createAndRenderChart(
    "#cashFlowsFinancingActivities_chart",
    parsedData,
    "cashFlows_financingActivities_Client",
    window.chartColors.teal,
    "dollar",
    "Cash Flows: Financing Activities"
  );

  createAndRenderChart(
    "#propertyAndEquipment_chart",
    parsedData,
    "propertyAndEquipment_Client",
    window.chartColors.green,
    "dollar",
    "Property and Equipment"
  );
};
