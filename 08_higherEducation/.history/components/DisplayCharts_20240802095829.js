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
    "totalAssets_Client",
    "totalLiabilities_Client",
    "netAssets_Client",
    "totalExpenses_Client",
    "totalNonOperatingExpenses_Client",
    "totalChangesInNetAssets_Client",
    "totalNaturalCategoryExpenses_Client",
    "cashFlows_operatingActivities_Client",
    "cashFlows_investingActivities_Client",
    "cashFlows_financingActivities_Client",
    "propertyAndEquipment_Client",
  ];
  const parsedData = {};

  keys.forEach((key) => {
    const storedData = getStoredData(key);
    parsedData[key] = parseStoredData(storedData);
  });

  // assets_chart
  assetsChart = new ApexCharts(
    document.querySelector("#assets_chart"),
    getFSchartOptions(
      parsedData,
      "totalAssets_Client",
      window.chartColors.green,
      "dollar",
      "Assets"
    )
  );
  assetsChart.render();
  // const assetsChartElement = assetsChart.paper().svg();
  // map_dataUri.set("totalAssets_Client", svgToBase64(assetsChartElement));
  document.addEventListener("dark-mode", function () {
    assetsChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "totalAssets_Client",
        window.chartColors.green,
        "dollar",
        "Assets"
      )
    );
  });

  // liabilities_chart
  const liabilitiesChart = new ApexCharts(
    document.querySelector("#liabilities_chart"),
    getFSchartOptions(
      parsedData,
      "totalLiabilities_Client",
      window.chartColors.blue,
      "dollar",
      "Liabilities"
    )
  );
  liabilitiesChart.render();
  // const liabilitiesChartElement = liabilitiesChart.paper().svg();
  // map_dataUri.set(
  //   "totalLiabilities_Client",
  //   svgToBase64(liabilitiesChartElement)
  // );
  document.addEventListener("dark-mode", function () {
    liabilitiesChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "totalLiabilities_Client",
        window.chartColors.blue,
        "dollar",
        "Liabilities"
      )
    );
  });

  // netAssets_chart
  const netAssetsChart = new ApexCharts(
    document.querySelector("#netAssets_chart"),
    getFSchartOptions(
      parsedData,
      "netAssets_Client",
      window.chartColors.yellow,
      "dollar",
      "Net Assets"
    )
  );
  netAssetsChart.render();
  // const netAssetsChartElement = netAssetsChart.paper().svg();
  // map_dataUri.set("totalNetAssets_Client", svgToBase64(netAssetsChartElement));
  document.addEventListener("dark-mode", function () {
    netAssetsChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "netAssets_Client",
        window.chartColors.yellow,
        "dollar",
        "Net Assets"
      )
    );
  });

  // revenueAndSupport_chart
  const revenueAndSupportChart = new ApexCharts(
    document.querySelector("#revenueAndSupport_chart"),
    getFSchartOptions(
      parsedData,
      "totalAssets_Client",
      window.chartColors.teal,
      "dollar",
      "Revenue and Support"
    )
  );
  revenueAndSupportChart.render();
  // const revenueAndSupportChartElement = revenueAndSupportChart.paper().svg();
  // map_dataUri.set(

  //   "revenueAndSupport_Client",
  //   svgToBase64(revenueAndSupportChartElement)
  // );
  document.addEventListener("dark-mode", function () {
    revenueAndSupportChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "totalAssets_Client",
        window.chartColors.teal,
        "dollar",
        "Revenue and Support"
      )
    );
  });

  // educationalProgramExpenses_chart
  const educationalProgramExpensesChart = new ApexCharts(
    document.querySelector("#educationalProgramExpenses_chart"),
    getFSchartOptions(
      parsedData,
      "totalExpenses_Client",
      window.chartColors.orange,
      "dollar",
      "Educational Program Expenses"
    )
  );
  educationalProgramExpensesChart.render();
  // const educationalProgramExpensesChartElement = educationalProgramExpensesChart
  //   .paper()
  //   .svg();
  // map_dataUri.set(
  //   "educationalProgramExpenses_Client",
  //   svgToBase64(educationalProgramExpensesChartElement)
  // );
  document.addEventListener("dark-mode", function () {
    educationalProgramExpensesChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "totalExpenses_Client",
        window.chartColors.orange,
        "dollar",
        "Educational Program Expenses"
      )
    );
  });

  const nonoperatingActivitiesChart = new ApexCharts(
    document.querySelector("#nonoperatingActivities_chart"),
    getFSchartOptions(
      parsedData,
      "totalNonOperatingExpenses_Client",
      window.chartColors.red,
      "dollar",
      "Educational Program Expenses"
    )
  );

  nonoperatingActivitiesChart.render();
  document.addEventListener("dark-mode", function () {
    nonoperatingActivitiesChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "totalNonOperatingExpenses_Client",
        window.chartColors.red,
        "dollar",
        "Educational Program Expenses"
      )
    );
  });

  // changeInNetAssetsWithDR_chart
  const changeInNetAssetsWithDRChart = new ApexCharts(
    document.querySelector("#changesInNetAssetsWithDR_chart"),
    getFSchartOptions(
      parsedData,
      "totalChangesInNetAssets_Client",
      window.chartColors.purple,
      "dollar",
      "Changes in Net Assets with Donor Restrictions"
    )
  );

  changeInNetAssetsWithDRChart.render();
  document.addEventListener("dark-mode", function () {
    changeInNetAssetsWithDRChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "totalChangesInNetAssets_Client",
        window.chartColors.purple,
        "dollar",
        "Changes in Net Assets with Donor Restrictions"
      )
    );
  });

  // naturalExpenseCategories_chart
  const naturalExpenseCategoriesChart = new ApexCharts(
    document.querySelector("#naturalExpenseCategories_chart"),
    getFSchartOptions(
      parsedData,
      "totalNaturalCategoryExpenses_Client",
      window.chartColors.blue,
      "dollar",
      "Natural Expense Categories"
    )
  );

  naturalExpenseCategoriesChart.render();
  document.addEventListener("dark-mode", function () {
    naturalExpenseCategoriesChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "totalNaturalCategoryExpenses_Client",
        window.chartColors.blue,
        "dollar",
        "Natural Expense Categories"
      )
    );
  });

  // CASH FLOWS  --------------------------------------------------
  // cashFlowsOperatingActivities_chart
  const cashFlows_operatingActivitiesChart = new ApexCharts(
    document.querySelector("#cashFlowsOperatingActivities_chart"),
    getFSchartOptions(
      parsedData,
      "cashFlows_operatingActivities_Client",
      window.chartColors.teal,
      "dollar",
      "Cash Flows: Operating Activities"
    )
  );

  cashFlows_operatingActivitiesChart.render();
  document.addEventListener("dark-mode", function () {
    cashFlows_operatingActivitiesChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "cashFlows_operatingActivities_Client",
        window.chartColors.teal,
        "dollar",
        "Cash Flows: Operating Activities"
      )
    );
  });
  // cashFlowsInvestingActivitiesChart
  const cashFlowsInvestingActivitiesChart = new ApexCharts(
    document.querySelector("#cashFlowsInvestingActivities_chart"),
    getFSchartOptions(
      parsedData,
      "cashFlows_investingActivities_Client",
      window.chartColors.orange,
      "dollar",
      "Cash Flows: Investing Activities"
    )
  );

  cashFlowsInvestingActivitiesChart.render();
  document.addEventListener("dark-mode", function () {
    cashFlowsInvestingActivitiesChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "cashFlows_investingActivities_Client",
        window.chartColors.orange,
        "dollar",
        "Cash Flows: Investing Activities"
      )
    );
  });
  // cashFlowsFinancingActivities_chart
  const cashFlowsFinancingActivities_chart = new ApexCharts(
    document.querySelector("#cashFlowsFinancingActivities_chart"),
    getFSchartOptions(
      parsedData,
      "cashFlows_financingActivities_Client",
      window.chartColors.teal,
      "dollar",
      "Cash Flows: Financing Activities"
    )
  );

  cashFlowsFinancingActivities_chart.render();
  document.addEventListener("dark-mode", function () {
    cashFlowsFinancingActivities_chart.updateOptions(
      getFSchartOptions(
        parsedData,
        "cashFlows_financingActivities_Client",
        window.chartColors.teal,
        "dollar",
        "Cash Flows: Financing Activities"
      )
    );
  });

  // PROPERTY AND EQUIPMENT ---------------------------------------
  // propertyAndEquipment_chart
  const propertyAndEquipmentChart = new ApexCharts(
    document.querySelector("#propertyAndEquipment_chart"),
    getFSchartOptions(
      parsedData,
      "propertyAndEquipment_Client",
      window.chartColors.green,
      "dollar",
      "Property and Equipment"
    )
  );

  propertyAndEquipmentChart.render();

  document.addEventListener("dark-mode", function () {
    propertyAndEquipmentChart.updateOptions(
      getFSchartOptions(
        parsedData,
        "propertyAndEquipment_Client",
        window.chartColors.green,
        "dollar",
        "Property and Equipment"
      )
    );
  });
};
