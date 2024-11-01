displayCfiComponent = (data) => {
  console.log('displayCfiComponent()');
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
    "percentNumber",
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
    "percentNumber",
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

  FinancialPosition_chart = new ApexCharts(
    document.querySelector("#FinancialPosition_chart"),
    getFpaChartOptions(parseData)
  );
  FinancialPosition_chart.render();
  document.addEventListener("dark-mode", function () {
    FinancialPosition_chart.updateOptions(
      getFpaChartOptions(parseData)
    );
  });

  assetToLiabilities_chart = new ApexCharts(
    document.querySelector("#assetToLiabilities_chart"),
    getAtlChartOptions(parseData)
  );
  assetToLiabilities_chart.render();
  document.addEventListener("dark-mode", function () {
    assetToLiabilities_chart.updateOptions(getAtlChartOptions(parseData));
  });

  sourceOfIncomeClient_chart = new ApexCharts(
    document.querySelector("#sourceOfIncomeClient_chart"),
    getSourcesOfIncomeClientChartOptions(parseData)
  );
  sourceOfIncomeClient_chart.render();
  // console.log({soiClientChart});
  document.addEventListener("dark-mode", function () {
    sourceOfIncomeClient_chart.updateOptions(getSourcesOfIncomeClientChartOptions(parseData));
  });

  sourceOfIncomePeer_chart = new ApexCharts(
    document.querySelector("#sourceOfIncomePeer_chart"),
    getSourcesOfIncomePeerChartOptions(parseData)
  );
  sourceOfIncomePeer_chart.render();
  document.addEventListener("dark-mode", function () {
    sourceOfIncomePeer_chart.updateOptions(getSourcesOfIncomePeerChartOptions(parseData));
  });

  ffa_chart = new ApexCharts(
    document.querySelector("#ffa_chart"),
    getFfaChartOptions(parseData)
  );
  ffa_chart.render();
  document.addEventListener("dark-mode", function () {
    ffa_chart.updateOptions(getFfaChartOptions(parseData));
  });

  cashFlowsTrend_chart = new ApexCharts(
    document.querySelector("#cashFlowsTrend_chart"),
    getCashFlowTrendChartOptions(parseData)
  );
  cashFlowsTrend_chart.render();
  document.addEventListener("dark-mode", function () {
    cashFlowsTrend_chart.updateOptions(getCashFlowTrendChartOptions(parseData));
  });
};

toggleDetailsByIdentifier("sourceOfIncome");
toggleDetailsByIdentifier("fpa");
toggleDetailsByIdentifier("currentRatio");
// toggleDetailsByIdentifier("d");
toggleDetailsByIdentifier("cashFlowsTrend");
toggleDetailsByIdentifier("ffa");

// Financial STATEMENT
const displayFinancialStatementComponent = () => {
  // console.log('hit');
  const keys = [
    "totalAssetsData",
    "totalLiabilitiesData",
    "netAssetsData",
    "revenueAndSupportData",
    "educationalProgramData",
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

  // console.log({ parsedData });

  createAndRenderFSChart(
    "#assets_chart",
    parsedData["totalAssetsData"],
    "totalAssets_Client",
    "#FBD75A",
    "dollar",
    "Assets",
    "assets_dataPoint"
  );

  createAndRenderFSChart(
    "#liabilities_chart",
    parsedData["totalLiabilitiesData"],
    "totalLiabilities_Client",
    window.chartColors.blue,
    "dollar",
    "Liabilities",
    "liabilities_dataPoint"
  );

  createAndRenderFSChart(
    "#netAssets_chart",
    parsedData["netAssetsData"],
    "netAssets_Client",
    window.chartColors.yellow,
    "dollar",
    "Net Assets",
    "netAssets_dataPoint"
  );

  createAndRenderFSChart(
    "#revenueAndSupport_chart",
    parsedData["revenueAndSupportData"],
    "revenueAndSupport_Client",
    "#4EA79F",
    "dollar",
    "Revenue and Support",
    "revenueAndSupport_dataPoint"
  );

  createAndRenderFSChart(
    "#educationalProgramExpenses_chart",
    parsedData["educationalProgramData"],
    "educationalProgramExpenses_Client",
    "#F4982D",
    "dollar",
    "Educational Program Expenses",
    "educationalProgramExpenses_dataPoint"
  );

  createAndRenderFSChart(
    "#nonOperatingActivities_chart",
    parsedData["nonOperatingActivitiesData"],
    "nonOperatingActivities_Client",
    window.chartColors.red,
    "dollar",
    "Non-Operating Activities"
  );

  createAndRenderFSChart(
    "#changesInNetAssetsWithDR_chart",
    parsedData["changesInNetAssetsWithDRData"],
    "changesInNetAssetsWithDR_Client",
    "#C57FD7",
    "dollar",
    "Changes in Net Assets with Donor Restrictions",
    "changesInNetAssetsWithDR_dataPoint"
  );

  createAndRenderFSChart(
    "#naturalExpenseCategories_chart",
    parsedData["naturalExpenseCategoriesData"],
    "naturalExpenseCategories_Client",
    "#4F76D9",
    "dollar",
    "Natural Expense Categories",
    "naturalExpenseCategories_dataPoint"
  );

  createAndRenderFSChart(
    "#cashFlowsOperatingActivities_chart",
    parsedData["cashFlowsOperatingData"],
    "cashFlowsOperatingActivities_Client",
    "#70B5CC",
    "dollar",
    "Cash Flows: Operating Activities",
    "cashFlowsOperatingActivities_dataPoint"
  );

  createAndRenderFSChart(
    "#cashFlowsInvestingActivities_chart",
    parsedData["cashFlowsInvestingData"],
    "cashFlowsInvestingActivities_Client",
    "#FFA726",
    "dollar",
    "Cash Flows: Investing Activities",
    "cashFlowsInvestingActivities_dataPoint"
  );

  createAndRenderFSChart(
    "#cashFlowsFinancingActivities_chart",
    parsedData["cashFlowsFinancingData"],
    "cashFlowsFinancingActivities_Client",
    "#FFCDD2",
    "dollar",
    "Cash Flows: Financing Activities",
    "cashFlowsFinancingActivities_dataPoint"
  );

  createAndRenderFSChart(
    "#propertyAndEquipment_chart",
    parsedData["propertyAndEquipmentData"],
    "propertyAndEquipment_Client",
    "#459B53",
    "dollar",
    "Property and Equipment",
    "propertyAndEquipment_dataPoint"
  );
};

// Financial Position
const displayFinancialPositionComponent = () => {
  // console.log('hit');
  const keys = ["currentRatioData", "liquidityData"];
  const parsedData = {};

  keys.forEach((key) => {
    const storedData = getStoredData(key);
    parsedData[key] = parseStoredData(storedData);
  });

  // console.log(parsedData);


  // getCurrentRatioChartOptions(parsedData["currentRatioData"])

  currentRatio_chart = new ApexCharts(
    document.querySelector("#currentRatio_chart"),
    getCurrentRatioChartOptions(parsedData["currentRatioData"])
  );
  currentRatio_chart.render();
  document.addEventListener("dark-mode", function () {
    currentRatio_chart.updateOptions(
      getCurrentRatioChartOptions(parsedData["currentRatioData"])
    );
  });

  // getLiquidityChartOptions
//   const liquidityChart = new ApexCharts(
//     document.querySelector("#liquidity_chart"),
//     getLiquidityChartOptions(parsedData["liquidityData"])
//   );
//   liquidityChart.render();
//   document.addEventListener("dark-mode", function () {
//     liquidityChart.updateOptions(
//       getLiquidityChartOptions(parsedData["liquidityData"])
//     );
//   });
};

// Revenue and Expense
const displayRevenueAndExpenseComponent = () => {
  const keys = [
    "salariesAndBenefitsToTotalExpenseData",
    "averageEmployeeSalaryData",
    "salariesAndBenefitsPerNetTuitionData",
    "adminCostsPerStudentData",
    "netEducationalExpensePerStudentData",
    "annualTraditionalNetTuitionPerStudentData",
    "tuitionDependencyData",
    "tuitionDiscountRateData",
  ];
  const parsedData = {};

  keys.forEach((key) => {
    const storedData = getStoredData(key);
    parsedData[key] = parseStoredData(storedData);
  });

  // salariesAndBenefitsToTotalExpenseData
  const salariesBenefitsToTotalExpense_chart = new ApexCharts(
    document.querySelector("#salariesBenefitsToTotalExpense_chart"),
    getSalariesAndBenefitsToTotalExpenseChartOptions(
      parsedData["salariesAndBenefitsToTotalExpenseData"]
    )
  );
  salariesBenefitsToTotalExpense_chart.render();
  document.addEventListener("dark-mode", function () {
    salariesBenefitsToTotalExpense_chart.updateOptions(
      getSalariesAndBenefitsToTotalExpenseChartOptions(
        parsedData["salariesAndBenefitsToTotalExpenseData"]
      )
    );
  });

  // averageEmployeeSalaryData
  // const averageEmployeeSalary_chart = new ApexCharts(
  //   document.querySelector("#averageEmployeeSalary_chart"),
  //   getAverageEmployeeSalaryChartOptions(
  //     parsedData["averageEmployeeSalaryData"]
  //   )
  // );
  // averageEmployeeSalary_chart.render();
  // document.addEventListener("dark-mode", function () {
  //   averageEmployeeSalary_chart.updateOptions(
  //     getAverageEmployeeSalaryChartOptions(
  //       parsedData["averageEmployeeSalaryData"]
  //     )
  //   );
  // });

  // getSalariesAndBenefitsPerNetTuitionChartOptions(parsedData["salariesAndBenefitsPerNetTuitionData"])
  const salariesBenefitsPerNetTuition_chart = new ApexCharts(
    document.querySelector("#salariesBenefitsPerNetTuition_chart"),
    getSalariesAndBenefitsPerNetTuitionChartOptions(
      parsedData["salariesAndBenefitsPerNetTuitionData"]
    )
  );
  salariesBenefitsPerNetTuition_chart.render();
  document.addEventListener("dark-mode", function () {
    salariesBenefitsPerNetTuition_chart.updateOptions(
      getSalariesAndBenefitsPerNetTuitionChartOptions(
        parsedData["salariesAndBenefitsPerNetTuitionData"]
      )
    );
  });

  // adminCostsPerStudent
  // getAdminCostsPerStudentChartOptions(parsedData["adminCostsPerStudentData"])
  // const adminCostsPerStudent_chart = new ApexCharts(
  //   document.querySelector("#adminCostsPerStudent_chart"),
  //   getAdminCostsPerStudentChartOptions(parsedData["adminCostsPerStudentData"])
  // );
  // adminCostsPerStudent_chart.render();
  // document.addEventListener("dark-mode", function () {
  //   adminCostsPerStudent_chart.updateOptions(
  //     getAdminCostsPerStudentChartOptions(
  //       parsedData["adminCostsPerStudentData"]
  //     )
  //   );
  // });

  // getMapChatOptions();

  // netEducationalExpensePerStudent
  const netEducationalExpensePerStudent_chart = new ApexCharts(
    document.querySelector("#netEducationalExpensePerStudent_chart"),
    getNetEducationalExpensePerStudentChartOptions(
      parsedData["netEducationalExpensePerStudentData"]
    )
  );
  netEducationalExpensePerStudent_chart.render();
  document.addEventListener("dark-mode", function () {
    netEducationalExpensePerStudent_chart.updateOptions(
      getNetEducationalExpensePerStudentChartOptions(
        parsedData["netEducationalExpensePerStudentData"]
      )
    );
  });

  getAnualTraditionalNetTuitionPerStudentChartOptions(parsedData["annualTraditionalNetTuitionPerStudentData"]);

  getTuitionDependencyChartOptions(parsedData["tuitionDependencyData"]);
  const tuitionDependency_chart = new ApexCharts(
    document.querySelector("#tuitionDependency_chart"),
    getTuitionDependencyChartOptions(parsedData["tuitionDependencyData"])
  );
  tuitionDependency_chart.render();
  document.addEventListener("dark-mode", function () {
    tuitionDependency_chart.updateOptions(
      getTuitionDependencyChartOptions(parsedData["tuitionDependencyData"])
    );
  });

  // getTuitionDiscountRateChartOptions(parsedData["tuitionDiscountRateData"])
  const tuitionDiscountRate_chart = new ApexCharts(
    document.querySelector("#tuitionDiscountRate_chart"),
    getTuitionDiscountRateChartOptions(parsedData["tuitionDiscountRateData"])
  );
  tuitionDiscountRate_chart.render();
  document.addEventListener("dark-mode", function () {
    tuitionDiscountRate_chart.updateOptions(
      getTuitionDiscountRateChartOptions(parsedData["tuitionDiscountRateData"])
    );
  });
};

toggleDetailsByIdentifier("salariesBenefitsToTotalExpense");
toggleDetailsByIdentifier("salariesBenefitsPerNetTuition");
toggleDetailsByIdentifier("netEducationalExpensePerStudent");
toggleDetailsByIdentifier("annualTraditionalNetTuitionPerStudent");
toggleDetailsByIdentifier("tuitionDependency");
toggleDetailsByIdentifier("tuitionDiscountRate");

// Debt and Endowment
const displayDebtAndEndowmentComponent = () => {
  const keys = [
    "ltDebtPerTotalOperatingRevenueData",
    "debtServiceCoverageRatioData",
    "debtBurdenRatioData",
    "endowmentOperatingBudgetData",
    "endowmentAssetsPerStudentData",
  ];
  const parsedData = {};

  keys.forEach((key) => {
    const storedData = getStoredData(key);
    parsedData[key] = parseStoredData(storedData);
  });

  // ltDebtPerTotalOperatingRevenue
  const ltDebtPerTotalOperatingRevenue_chart = new ApexCharts(
    document.querySelector("#ltDebtPerTotalOperatingRevenue_chart"),
    getLtDebtPerTotalOperatingRevenueChartOptions(
      parsedData["ltDebtPerTotalOperatingRevenueData"]
    )
  );
  ltDebtPerTotalOperatingRevenue_chart.render();
  document.addEventListener("dark-mode", function () {
    ltDebtPerTotalOperatingRevenue_chart.updateOptions(
      getLtDebtPerTotalOperatingRevenueChartOptions(
        parsedData["ltDebtPerTotalOperatingRevenueData"]
      )
    );
  });

  // debtServiceCoverageRatio
  getDebtServiceCoverageChartOptions(parsedData["debtServiceCoverageRatioData"]);

  // debtBurdenRatio
  const debtBurdenRatio_chart = new ApexCharts(
    document.querySelector("#debtBurdenRatio_chart"),
    getDebtBurdenRatioChartOptions(parsedData["debtBurdenRatioData"])
  );
  debtBurdenRatio_chart.render();
  document.addEventListener("dark-mode", function () {
    debtBurdenRatio_chart.updateOptions(
      getDebtBurdenRatioChartOptions(parsedData["debtBurdenRatioData"])
    );
  });

  // endowmentOperatingBudget
  getEndowmentOperatingChartOptions(parsedData["endowmentOperatingBudgetData"]);


  // endowmentAssetsPerStudentMap
  // getEndowmentAssetsPerStudentMapOptions();

  // endowmentAssetsPerStudentChart
  const endowmentAssetsPerStudent_chart = new ApexCharts(
    document.querySelector("#endowmentAssetsPerStudent_chart"),
    getEndowmentAssetsPerStudentChartOptions(
      parsedData["endowmentAssetsPerStudentData"]
    )
  );
  endowmentAssetsPerStudent_chart.render();
  document.addEventListener("dark-mode", function () {
    endowmentAssetsPerStudent_chart.updateOptions(
      getEndowmentAssetsPerStudentChartOptions(
        parsedData["endowmentAssetsPerStudentData"]
      )
    );
  });
};

toggleDetailsByIdentifier("ltDebtPerTotalOperatingRevenue");
toggleDetailsByIdentifier("debtServiceCoverageRatio");
toggleDetailsByIdentifier("debtBurdenRatio");
toggleDetailsByIdentifier("endowmentOperatingBudget");
toggleDetailsByIdentifier("endowmentAssetsPerStudent");
