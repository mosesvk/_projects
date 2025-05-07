// ChartDisplayComponents.js
// Module for displaying charts in different sections

// Components module for chart display
const ChartDisplayComponents = {
  // Display general component charts
  displayCfiComponent: function () {
    try {
      const cfiData = getStoredData("cfiData");
      const parsedData = parseStoredData(cfiData);

      if (!parsedData) {
        console.error("Unable to load CFI component data");
        return;
      }

      // Ensure we have the chart manager
      if (!window.chartManager) {
        console.error("Chart manager not initialized");
        return;
      }

      // cfiRatio
      chartManager.createChartFromParsedData(
        parsedData,
        "cfiRatio_chart",
        "cfiRatio_peerAverage_Peer",
        "cfiRatio_Client",
        "num",
        1,
        "cfiRatio",
        false,
        "CFI Overall Ratio",
        "line"
      );

      // // cfi_primaryReserveRatiod
      // chartManager.createChartFromParsedData(
      //   parsedData,
      //   "cfi_primaryReserveRatio_chart",
      //   "primaryReserveRatio_peerAverage_Peer",
      //   "cfi_primaryReserveRatio_Client",
      //   "num",
      //   2,
      //   "cfi_primaryReserveRatio",
      //   false,
      //   "CFI Primary Reserve Ratio",
      //   "line"
      // );

      // // cfi_netIncomeOperationsRatio
      // chartManager.createChartFromParsedData(
      //   parsedData,
      //   "cfi_netIncomeOperationsRatio_chart",
      //   "netIncomeOperationsRatio_peerAverage_Peer",
      //   "cfi_netIncomeOperationsRatio_Client",
      //   "percent",
      //   1,
      //   "cfi_netIncomeOperationsRatio",
      //   false,
      //   "CFI Net Income Operations Ratio",
      //   "line"
      // );

      // // cfi_returnOnNetAssets
      // chartManager.createChartFromParsedData(
      //   parsedData,
      //   "cfi_returnOnNetAssets_chart",
      //   "returnOnNetAssets_peerAverage_Peer",
      //   "cfi_returnOnNetAssets_Client",
      //   "percent",
      //   1,
      //   "cfi_returnOnNetAssets",
      //   false,
      //   "CFI Return on Net Assets",
      //   "line"
      // );

      // // cfi_viabilityRatio
      // chartManager.createChartFromParsedData(
      //   parsedData,
      //   "cfi_viabilityRatio_chart",
      //   "viabilityRatio_peerAverage_Peer",
      //   "cfi_viabilityRatio_Client",
      //   "num",
      //   2,
      //   "cfi_viabilityRatio",
      //   false,
      //   "CFI Viability Ratio",
      //   "line"
      // );

      console.log("CFI component charts displayed successfully");
    } catch (error) {
      console.error("Error displaying CFI component:", error);
    }
  },

  // displayDoeComponent: function () {
  //   try {
  //     const doeData = getStoredData("doeData");
  //     const parseData = parseStoredData(doeData);

  //     chartManager.createChartFromParsedData(
  //       parseData,
  //       "doeOverall_chart",
  //       null,
  //       "doeOverall_Client",
  //       "num",
  //       1,
  //       "doeOverall",
  //       1.5,
  //       "US Department of Education Overall Composite Score"
  //     );
  //   } catch (error) {
  //     console.error("Error displaying Doe component:", error);
  //   }
  // },

  // displayFinancialAnalysisComponent: function () {
  //   try {
  //     const financialAnalysisData = getStoredData("financialAnalysisData");
  //     const parseData = parseStoredData(financialAnalysisData);

  //     FinancialPosition_chart = new ApexCharts(
  //       document.querySelector("#FinancialPosition_chart"),
  //       getFpaChartOptions(parseData)
  //     );
  //     FinancialPosition_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       FinancialPosition_chart.updateOptions(getFpaChartOptions(parseData));
  //     });

  //     assetToLiabilities_chart = new ApexCharts(
  //       document.querySelector("#assetToLiabilities_chart"),
  //       getAtlChartOptions(parseData)
  //     );
  //     assetToLiabilities_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       assetToLiabilities_chart.updateOptions(getAtlChartOptions(parseData));
  //     });

  //     sourceOfIncomeClient_chart = new ApexCharts(
  //       document.querySelector("#sourceOfIncomeClient_chart"),
  //       getSourcesOfIncomeClientChartOptions(parseData)
  //     );
  //     sourceOfIncomeClient_chart.render();
  //     // console.log({soiClientChart});
  //     document.addEventListener("dark-mode", function () {
  //       sourceOfIncomeClient_chart.updateOptions(
  //         getSourcesOfIncomeClientChartOptions(parseData)
  //       );
  //     });

  //     sourceOfIncomePeer_chart = new ApexCharts(
  //       document.querySelector("#sourceOfIncomePeer_chart"),
  //       getSourcesOfIncomePeerChartOptions(parseData)
  //     );
  //     sourceOfIncomePeer_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       sourceOfIncomePeer_chart.updateOptions(
  //         getSourcesOfIncomePeerChartOptions(parseData)
  //       );
  //     });

  //     ffa_chart = new ApexCharts(
  //       document.querySelector("#ffa_chart"),
  //       getFfaChartOptions(parseData)
  //     );
  //     ffa_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       ffa_chart.updateOptions(getFfaChartOptions(parseData));
  //     });

  //     cashFlowsTrend_chart = new ApexCharts(
  //       document.querySelector("#cashFlowsTrend_chart"),
  //       getCashFlowTrendChartOptions(parseData)
  //     );
  //     cashFlowsTrend_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       cashFlowsTrend_chart.updateOptions(
  //         getCashFlowTrendChartOptions(parseData)
  //       );
  //     });
  //   } catch (error) {
  //     console.error("Error displaying Doe component:", error);
  //   }
  // },

  // displayFinancialStatementComponent: function () {
  //   try {
  //     const financialStatementData = getStoredData("financialStatementData");
  //     const parseData = parseStoredData(financialStatementData);

  //     // console.log('hit');
  //     const keys = [
  //       "totalAssetsData",
  //       "totalLiabilitiesData",
  //       "netAssetsData",
  //       "revenueAndSupportData",
  //       "educationalProgramData",
  //       "nonOperatingActivitiesData",
  //       "changesInNetAssetsWithDRData",
  //       "naturalExpenseCategoriesData",
  //       "cashFlowsOperatingData",
  //       "cashFlowsInvestingData",
  //       "cashFlowsFinancingData",
  //       "propertyAndEquipmentData",
  //     ];
  //     const parsedData = {};

  //     keys.forEach((key) => {
  //       const storedData = getStoredData(key);
  //       parsedData[key] = parseStoredData(storedData);
  //     });

  //     // console.log({ parsedData });

  //     createAndRenderFSChart(
  //       "#assets_chart",
  //       parsedData["totalAssetsData"],
  //       "totalAssets_Client",
  //       "#FBD75A",
  //       "dollar",
  //       "Assets",
  //       "assets_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#liabilities_chart",
  //       parsedData["totalLiabilitiesData"],
  //       "totalLiabilities_Client",
  //       window.chartColors.blue,
  //       "dollar",
  //       "Liabilities",
  //       "liabilities_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#netAssets_chart",
  //       parsedData["netAssetsData"],
  //       "netAssets_Client",
  //       window.chartColors.yellow,
  //       "dollar",
  //       "Net Assets",
  //       "netAssets_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#revenueAndSupport_chart",
  //       parsedData["revenueAndSupportData"],
  //       "revenueAndSupport_Client",
  //       "#4EA79F",
  //       "dollar",
  //       "Revenue and Support",
  //       "revenueAndSupport_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#educationalProgramExpenses_chart",
  //       parsedData["educationalProgramData"],
  //       "educationalProgramExpenses_Client",
  //       "#F4982D",
  //       "dollar",
  //       "Educational Program Expenses",
  //       "educationalProgramExpenses_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#nonOperatingActivities_chart",
  //       parsedData["nonOperatingActivitiesData"],
  //       "nonOperatingActivities_Client",
  //       window.chartColors.red,
  //       "dollar",
  //       "Non Operating Activities",
  //       "nonOperatingActivities_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#changesInNetAssetsWithDR_chart",
  //       parsedData["changesInNetAssetsWithDRData"],
  //       "changesInNetAssetsWithDR_Client",
  //       "#C57FD7",
  //       "dollar",
  //       "Changes in Net Assets with Donor Restrictions",
  //       "changesInNetAssetsWithDR_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#naturalExpenseCategories_chart",
  //       parsedData["naturalExpenseCategoriesData"],
  //       "naturalExpenseCategories_Client",
  //       "#4F76D9",
  //       "dollar",
  //       "Natural Expense Categories",
  //       "naturalExpenseCategories_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#cashFlowsOperatingActivities_chart",
  //       parsedData["cashFlowsOperatingData"],
  //       "cashFlowsOperatingActivities_Client",
  //       "#70B5CC",
  //       "dollar",
  //       "Cash Flows: Operating Activities",
  //       "cashFlowsOperatingActivities_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#cashFlowsInvestingActivities_chart",
  //       parsedData["cashFlowsInvestingData"],
  //       "cashFlowsInvestingActivities_Client",
  //       "#FFA726",
  //       "dollar",
  //       "Cash Flows: Investing Activities",
  //       "cashFlowsInvestingActivities_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#cashFlowsFinancingActivities_chart",
  //       parsedData["cashFlowsFinancingData"],
  //       "cashFlowsFinancingActivities_Client",
  //       "#FFCDD2",
  //       "dollar",
  //       "Cash Flows: Financing Activities",
  //       "cashFlowsFinancingActivities_dataPoint"
  //     );

  //     createAndRenderFSChart(
  //       "#propertyAndEquipment_chart",
  //       parsedData["propertyAndEquipmentData"],
  //       "propertyAndEquipment_Client",
  //       "#459B53",
  //       "dollar",
  //       "Property and Equipment",
  //       "propertyAndEquipment_dataPoint"
  //     );
  //   } catch (error) {
  //     console.error("Error displaying Doe component:", error);
  //   }
  // },

  // displayFinancialPositionComponent: function () {
  //   try {
  //     const keys = ["currentRatioData", "liquidityData"];
  //     const parsedData = {};

  //     keys.forEach((key) => {
  //       const storedData = getStoredData(key);
  //       parsedData[key] = parseStoredData(storedData);
  //     });

  //     // console.log(parsedData);

  //     // getCurrentRatioChartOptions(parsedData["currentRatioData"])

  //     currentRatio_chart = new ApexCharts(
  //       document.querySelector("#currentRatio_chart"),
  //       getCurrentRatioChartOptions(parsedData["currentRatioData"])
  //     );
  //     currentRatio_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       currentRatio_chart.updateOptions(
  //         getCurrentRatioChartOptions(parsedData["currentRatioData"])
  //       );
  //     });
  //   } catch (error) {
  //     console.error("Error displaying Doe component:", error);
  //   }
  // },

  // displayRevenueAndExpenseComponent: function () {
  //   try {
  //     const revenueAndExpenseData = getStoredData("revenueAndExpenseData");
  //     const parseData = parseStoredData(revenueAndExpenseData);

  //     const keys = [
  //       "salariesAndBenefitsToTotalExpenseData",
  //       "averageEmployeeSalaryData",
  //       "salariesAndBenefitsPerNetTuitionData",
  //       "adminCostsPerStudentData",
  //       "netEducationalExpensePerStudentData",
  //       "annualTraditionalNetTuitionPerStudentData",
  //       "tuitionDependencyData",
  //       "tuitionDiscountRateData",
  //     ];
  //     const parsedData = {};

  //     keys.forEach((key) => {
  //       const storedData = getStoredData(key);
  //       parsedData[key] = parseStoredData(storedData);
  //     });

  //     // salariesAndBenefitsToTotalExpenseData
  //     salariesBenefitsToTotalExpense_chart = new ApexCharts(
  //       document.querySelector("#salariesBenefitsToTotalExpense_chart"),
  //       getSalariesAndBenefitsToTotalExpenseChartOptions(
  //         parsedData["salariesAndBenefitsToTotalExpenseData"]
  //       )
  //     );
  //     salariesBenefitsToTotalExpense_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       salariesBenefitsToTotalExpense_chart.updateOptions(
  //         getSalariesAndBenefitsToTotalExpenseChartOptions(
  //           parsedData["salariesAndBenefitsToTotalExpenseData"]
  //         )
  //       );
  //     });

  //     // averageEmployeeSalaryData
  //     // const averageEmployeeSalary_chart = new ApexCharts(
  //     //   document.querySelector("#averageEmployeeSalary_chart"),
  //     //   getAverageEmployeeSalaryChartOptions(
  //     //     parsedData["averageEmployeeSalaryData"]
  //     //   )
  //     // );
  //     // averageEmployeeSalary_chart.render();
  //     // document.addEventListener("dark-mode", function () {
  //     //   averageEmployeeSalary_chart.updateOptions(
  //     //     getAverageEmployeeSalaryChartOptions(
  //     //       parsedData["averageEmployeeSalaryData"]
  //     //     )
  //     //   );
  //     // });

  //     // getSalariesAndBenefitsPerNetTuitionChartOptions(parsedData["salariesAndBenefitsPerNetTuitionData"])
  //     salariesBenefitsPerNetTuition_chart = new ApexCharts(
  //       document.querySelector("#salariesBenefitsPerNetTuition_chart"),
  //       getSalariesAndBenefitsPerNetTuitionChartOptions(
  //         parsedData["salariesAndBenefitsPerNetTuitionData"]
  //       )
  //     );
  //     salariesBenefitsPerNetTuition_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       salariesBenefitsPerNetTuition_chart.updateOptions(
  //         getSalariesAndBenefitsPerNetTuitionChartOptions(
  //           parsedData["salariesAndBenefitsPerNetTuitionData"]
  //         )
  //       );
  //     });

  //     // adminCostsPerStudent
  //     // getAdminCostsPerStudentChartOptions(parsedData["adminCostsPerStudentData"])
  //     // const adminCostsPerStudent_chart = new ApexCharts(
  //     //   document.querySelector("#adminCostsPerStudent_chart"),
  //     //   getAdminCostsPerStudentChartOptions(parsedData["adminCostsPerStudentData"])
  //     // );
  //     // adminCostsPerStudent_chart.render();
  //     // document.addEventListener("dark-mode", function () {
  //     //   adminCostsPerStudent_chart.updateOptions(
  //     //     getAdminCostsPerStudentChartOptions(
  //     //       parsedData["adminCostsPerStudentData"]
  //     //     )
  //     //   );
  //     // });

  //     // getMapChatOptions();

  //     // netEducationalExpensePerStudent
  //     netEducationalExpensePerStudent_chart = new ApexCharts(
  //       document.querySelector("#netEducationalExpensePerStudent_chart"),
  //       getNetEducationalExpensePerStudentChartOptions(
  //         parsedData["netEducationalExpensePerStudentData"]
  //       )
  //     );
  //     netEducationalExpensePerStudent_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       netEducationalExpensePerStudent_chart.updateOptions(
  //         getNetEducationalExpensePerStudentChartOptions(
  //           parsedData["netEducationalExpensePerStudentData"]
  //         )
  //       );
  //     });

  //     getAnualTraditionalNetTuitionPerStudentChartOptions(
  //       parsedData["annualTraditionalNetTuitionPerStudentData"]
  //     );

  //     getTuitionDependencyChartOptions(parsedData["tuitionDependencyData"]);
  //     tuitionDependency_chart = new ApexCharts(
  //       document.querySelector("#tuitionDependency_chart"),
  //       getTuitionDependencyChartOptions(parsedData["tuitionDependencyData"])
  //     );
  //     tuitionDependency_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       tuitionDependency_chart.updateOptions(
  //         getTuitionDependencyChartOptions(parsedData["tuitionDependencyData"])
  //       );
  //     });

  //     // getTuitionDiscountRateChartOptions(parsedData["tuitionDiscountRateData"])
  //     tuitionDiscountRate_chart = new ApexCharts(
  //       document.querySelector("#tuitionDiscountRate_chart"),
  //       getTuitionDiscountRateChartOptions(
  //         parsedData["tuitionDiscountRateData"]
  //       )
  //     );
  //     tuitionDiscountRate_chart.render();
  //     document.addEventListener("dark-mode", function () {
  //       tuitionDiscountRate_chart.updateOptions(
  //         getTuitionDiscountRateChartOptions(
  //           parsedData["tuitionDiscountRateData"]
  //         )
  //       );
  //     });
  //   } catch (error) {
  //     console.error("Error displaying Doe component:", error);
  //   }
  // },

  // displayDebtAndEndowmentComponent: function () {
  //   try {
  //     const debtAndEndowmentData = getStoredData("debtAndEndowmentData");
  //     const parseData = parseStoredData(debtAndEndowmentData);
  //   } catch (error) {
  //     console.error("Error displaying Doe component:", error);
  //   }
  // },
  // Display all components
  displayAllComponents: function () {
    try {
      this.displayCfiComponent();
      this.displayDoeComponent();
      this.displayFinancialAnalysisComponent();
      this.displayFinancialStatementComponent();
      this.displayFinancialPositionComponent();
      this.displayRevenueAndExpenseComponent();
      this.displayDebtAndEndowmentComponent();
      // console.log("All components displayed successfully");
    } catch (error) {
      console.error("Error displaying all components:", error);
    }
  },

  // Display specific component by name
  displayComponent: function (componentName) {
    switch (componentName.toLowerCase()) {
      case "cfi":
        this.displayCfiComponent();
        break;
      case "doe":
        this.displayDoeComponent();
        break;
      case "financialAnalysis":
        this.displayFinancialAnalysisComponent();
        break;
      case "financialStatement":
        this.displayFinancialStatementComponent();
        break;
      case "financialPosition":
        this.displayFinancialPositionComponent();
        break;
      case "revenueAndExpense":
        this.displayRevenueAndExpenseComponent();
        break;
      case "debtAndEndowment":
        this.displayDebtAndEndowmentComponent();
        break;
      default:
        console.error(`Unknown component: ${componentName}`);
    }
  },
};

// Export the component
const displayComponents = ChartDisplayComponents;

// Create global functions for backward compatibility
// These will allow the existing code to call our new module's functions
window.displayCfiComponent = function (data) {
  // console.log("Legacy displayGeneralComponent called");
  displayComponents.displayCfiComponent(data);
};

window.displayDoeComponent = function (data) {
  // console.log("Legacy displayDoeComponent called");
  displayComponents.displayDoeComponent(data);
};

window.displayFinancialAnalysisComponent = function (data) {
  // console.log("Legacy displayFinancialAnalysisComponent called");
  displayComponents.displayFinancialAnalysisComponent(data);
};

window.displayFinancialStatementComponent = function (data) {
  // console.log("Legacy displayFinancialStatementComponent called");
  displayComponents.displayFinancialStatementComponent(data);
};

window.displayFinancialPositionComponent = function (data) {
  // console.log("Legacy displayFinancialPositionComponent called");
  displayComponents.displayFinancialPositionComponent(data);
};

window.displayRevenueAndExpenseComponent = function (data) {
  // console.log("Legacy displayRevenueAndExpenseComponent called");
  displayComponents.displayRevenueAndExpenseComponent(data);
};

window.displayDebtAndEndowmentComponent = function (data) {
  // console.log("Legacy displayDebtAndEndowmentComponent called");
  displayComponents.displayDebtAndEndowmentComponent(data);
};

window.displayComponents = function (componentName) {
  // console.log("Legacy displayComponents called with:", componentName);
  if (componentName) {
    displayComponents.displayComponent(componentName);
  } else {
    displayComponents.displayAllComponents();
  }
};

// Any other global functions from displayCharts.js that might be needed
// Add them here to ensure full backward compatibility

// Ensure chart instances are available globally
window.cfiRatio_chart = null;
window.cfi_primaryReserveRatio_chart = null;
window.cfi_netIncomeOperationsRatio_chart = null;
window.cfi_returnOnNetAssets_chart = null;
window.cfi_viabilityRatio_chart = null;

window.doeOverall_chart = null;
window.financialPosition_chart = null;
window.assetsToLiabilities_chart = null;
window.sourceOfIncomeClient_chart = null;
window.sourceOfIncomePeer_chart = null;
window.ffa_chart = null;

window.daysCashOnHand_chart = null;
window.daysExpensesInUnrestrictedNA_chart = null;
window.daysExpensesInUnrestrictedNA_excludingPPE_chart = null;
window.liquidityAssetsAvailableCover_chart = null;
window.totalCoverageRatio_chart = null;
window.assetsWithoutPpeToLiabilitiesWithoutDebt_chart = null;

window.contributionsTrend_chart = null;
window.annualizedInvestmentReturn_chart = null;
window.functionalExpensePercent_program_chart = null;
window.functionalExpensePercent_administrative_chart = null;
window.functionalExpensePercent_fundraising_chart = null;

window.costOfContributionsDetailView_chart = null;
window.costOfContributions_chart = null;
window.functionalAllocation_chart = null;
window.netAssetBreakdown_chart = null;
window.changeInNetAssets_chart = null;

window.totalContributions_chart = null;
window.contributionsWithoutDR_chart = null;
window.statementCashFlows_chart = null;

window.currentRatio_chart = null;
window.tuitionDependency_chart = null;
window.tuitionDiscountRate_chart = null;

window.salariesBenefitsToTotalExpense_chart = null;
window.salariesBenefitsPerNetTuition_chart = null;
window.adminCostsPerStudent_chart = null;
window.netEducationalExpensePerStudent_chart = null;
window.annualTraditionalNetTuitionPerStudent_chart = null;

window.debtAndEndowment_chart = null; 


// Helper function to make the global chart references point to chart instances
function updateGlobalChartReferences() {
  // This function updates the global variables to point to actual chart instances
  const chartIds = [
    "cfiRatio_chart",
    "cfi_primaryReserveRatio_chart",
    "cfi_netIncomeOperationsRatio_chart",
    "cfi_returnOnNetAssets_chart",
    "cfi_viabilityRatio_chart",
    "doeOverall_chart",
    "financialPosition_chart",
    "assetsToLiabilities_chart",
    "sourceOfIncomeClient_chart",
    "sourceOfIncomePeer_chart",
    "ffa_chart",
    "daysCashOnHand_chart",
    "daysExpensesInUnrestrictedNA_chart",
    "daysExpensesInUnrestrictedNA_excludingPPE_chart",
    "liquidityAssetsAvailableCover_chart",
    "totalCoverageRatio_chart",
    "assetsWithoutPpeToLiabilitiesWithoutDebt_chart",
    "contributionsTrend_chart",
    "annualizedInvestmentReturn_chart",
    "functionalExpensePercent_program_chart",
    "functionalExpensePercent_administrative_chart",
    "functionalExpensePercent_fundraising_chart",
    "costOfContributionsDetailView_chart",
    "costOfContributions_chart",
    "functionalAllocation_chart",
    "netAssetBreakdown_chart",
    "changeInNetAssets_chart",
    "totalContributions_chart",
    "contributionsWithoutDR_chart",
    "statementCashFlows_chart",
    "currentRatio_chart",
    "tuitionDependency_chart",
    "tuitionDiscountRate_chart",
    "salariesBenefitsToTotalExpense_chart",
    "salariesBenefitsPerNetTuition_chart",
    "adminCostsPerStudent_chart",
    "netEducationalExpensePerStudent_chart",
    "annualTraditionalNetTuitionPerStudent_chart",
    "debtAndEndowment_chart",
  ];

  chartIds.forEach((id) => {
    const chart = chartManager.getChart(id);
    if (chart) {
      window[id] = chart;
    }
  });
}

// Call this function after charts are rendered
document.addEventListener("chartsRendered", updateGlobalChartReferences);

// Also call it after the window loads
window.addEventListener("load", () => {
  // Give some time for charts to render
  setTimeout(updateGlobalChartReferences, 1000);
});
