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

  // cfi_primaryReserveRatio
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
const displayFinancialAnalysisContentComponent = () => {
  const savedData = getStoredData("financialAnalysisContentData");
  const parseData = parseStoredData(savedData);

  const fpaChart = new ApexCharts(
    document.querySelector("#FinancialAnalysisContent_chart"),
    getFpaChartOptions(parseData)
  );
  // fpaChart.render();
  fpaChart.render().then(() => {
    window.setTimeout(function () {
      fpaChart.dataURI().then((uri) => {
        console.log(uri);
      });
    }, 1000);
  });
  // const fpaChartElement = fpaChart.paper().svg();
  // map_dataUri.set("financialAnalysisContent", svgToBase64(fpaChartElement));
  document.addEventListener("dark-mode", function () {
    fpaChart.updateOptions(getFpaChartOptions(parseData));
  });

  const atlChart = new ApexCharts(
    document.querySelector("#assetToLiabilities_chart"),
    getAtlChartOptions(parseData)
  );
  atlChart.render();
  const atlChartElement = atlChart.paper().svg();
  map_dataUri.set("assetToLiabilities", svgToBase64(atlChartElement));
  document.addEventListener("dark-mode", function () {
    atlChart.updateOptions(getAtlChartOptions(parseData));
  });

  const soiClientChart = new ApexCharts(
    document.querySelector("#sourceOfIncomeClient_chart"),
    getSoiClientChartOptions(parseData)
  );
  soiClientChart.render();
  const soiClientChartElement = soiClientChart.paper().svg();
  map_dataUri.set("sourceOfIncomeClient", svgToBase64(soiClientChartElement));
  document.addEventListener("dark-mode", function () {
    soiClientChart.updateOptions(getSoiClientChartOptions(parseData));
  });

  const soiPeerChart = new ApexCharts(
    document.querySelector("#sourceOfIncomePeer_chart"),
    getSoiPeerChartOptions(parseData)
  );
  soiPeerChart.render();
  const soiPeerChartElement = soiPeerChart.paper().svg();
  map_dataUri.set("sourceOfIncomePeer", svgToBase64(soiPeerChartElement));
  document.addEventListener("dark-mode", function () {
    soiPeerChart.updateOptions(getSoiPeerChartOptions(parseData));
  });

  const ffaChart = new ApexCharts(
    document.querySelector("#ffa_chart"),
    getFfaChartOptions(parseData)
  );
  ffaChart.render();
  const ffaChartElement = ffaChart.paper().svg();
  map_dataUri.set("ffa", svgToBase64(ffaChartElement));
  document.addEventListener("dark-mode", function () {
    ffaChart.updateOptions(getFfaChartOptions(parseData));
  });

  const cashFlowTrendChart = new ApexCharts(
    document.querySelector("#cashFlowsTrend_chart"),
    getCashFlowTrendChartOptions(parseData)
  );
  cashFlowTrendChart.render();
  const cashFlowsTrendChartElement = cashFlowTrendChart.paper().svg();
  map_dataUri.set("cashFlowsTrend", svgToBase64(cashFlowsTrendChartElement));
  document.addEventListener("dark-mode", function () {
    cashFlowTrendChart.updateOptions(getCashFlowTrendChartOptions(parseData));
  });
};

toggleDetailsByIdentifier("sourceOfIncome");
toggleDetailsByIdentifier("ffa");

// Financial STATEMENT
const displayFinancialStatementComponent = () => {
  const savedData = getStoredData("financialStatementContentData");
  const parseData = parseStoredData(savedData);

  // assets_chart
  const assetsChart = new ApexCharts(
    document.querySelector("#assets_chart"),
    getFSchartOptions(
      parseData,
      "totalAssets_Client",
      window.chartColors.green,
      "dollar",
      "Assets"
    )
  );
  assetsChart.render();
  const assetsChartElement = assetsChart.paper().svg();
  map_dataUri.set("totalAssets_Client", svgToBase64(assetsChartElement));
  document.addEventListener("dark-mode", function () {
    assetsChart.updateOptions(
      getFSchartOptions(
        parseData,
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
      parseData,
      "totalLiabilities_Client",
      window.chartColors.blue,
      "dollar",
      "Liabilities"
    )
  );
  liabilitiesChart.render();
  const liabilitiesChartElement = liabilitiesChart.paper().svg();
  map_dataUri.set(
    "totalLiabilities_Client",
    svgToBase64(liabilitiesChartElement)
  );
  document.addEventListener("dark-mode", function () {
    liabilitiesChart.updateOptions(
      getFSchartOptions(
        parseData,
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
      parseData,
      "netAssets_Client",
      window.chartColors.yellow,
      "dollar",
      "Net Assets"
    )
  );
  netAssetsChart.render();
  const netAssetsChartElement = netAssetsChart.paper().svg();
  map_dataUri.set("totalNetAssets_Client", svgToBase64(netAssetsChartElement));
  document.addEventListener("dark-mode", function () {
    netAssetsChart.updateOptions(
      getFSchartOptions(
        parseData,
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
      parseData,
      "totalAssets_Client",
      window.chartColors.teal,
      "dollar",
      "Revenue and Support"
    )
  );
  revenueAndSupportChart.render();
  const revenueAndSupportChartElement = revenueAndSupportChart.paper().svg();
  map_dataUri.set(
    "revenueAndSupport_Client",
    svgToBase64(revenueAndSupportChartElement)
  );
  document.addEventListener("dark-mode", function () {
    revenueAndSupportChart.updateOptions(
      getFSchartOptions(
        parseData,
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
      parseData,
      "totalExpenses_Client",
      window.chartColors.orange,
      "dollar",
      "Educational Program Expenses"
    )
  );
  educationalProgramExpensesChart.render();
  const educationalProgramExpensesChartElement = educationalProgramExpensesChart
    .paper()
    .svg();
  map_dataUri.set(
    "educationalProgramExpenses_Client",
    svgToBase64(educationalProgramExpensesChartElement)
  );
  document.addEventListener("dark-mode", function () {
    educationalProgramExpensesChart.updateOptions(
      getFSchartOptions(
        parseData,
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
      parseData,
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
        parseData,
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
      parseData,
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
        parseData,
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
      parseData,
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
        parseData,
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
      parseData,
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
        parseData,
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
      parseData,
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
        parseData,
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
      parseData,
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
        parseData,
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
      parseData,
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
        parseData,
        "propertyAndEquipment_Client",
        window.chartColors.green,
        "dollar",
        "Property and Equipment"
      )
    );
  });
};
