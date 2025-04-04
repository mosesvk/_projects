// ChartDisplayComponents.js
// Module for displaying charts in different sections

// Components module for chart display
const ChartDisplayComponents = {
  // Display general component charts
  displayGeneralComponent: function () {
    try {
      const cashData = getStoredData("cashData");
      const generalData = getStoredData("generalData");
      const parsedCashData = parseStoredData(cashData);
      const parsedGeneralData = parseStoredData(generalData);

      if (!parsedCashData || !parsedGeneralData) {
        console.error("Unable to load general component data");
        return;
      }

      // Create the statement of cash flows chart
      chartManager.createCashFlowChart(
        "statementCashFlows_chart",
        parsedCashData,
        [
          "cashFlowsTrendFinancing",
          "cashFlowsTrendInvesting",
          "cashFlowsTrendOperating",
          "cashFlowsTrendTotal",
        ]
      );

      // For netAssetBreakdown_chart
      chartManager.createChartFromParsedData(
        parsedGeneralData,
        "netAssetBreakdown_chart",
        "netAssetsWithDonorRestrictionsSum_Peer", // Correct peer data reference
        "netAssetsWithDonorRestrictionsSum_Client", // Correct client data reference
        "dollar",
        0,
        "netAssetBreakdown",
        "wa"
      );

      // For changeInNetAssets_chart
      chartManager.createChartFromParsedData(
        parsedGeneralData,
        "changeInNetAssets_chart",
        "null", 
        "changeInNetAssets_Client",
        "dollar",
        0,
        "changeInNetAssets",
        "wa",
        null,
        "Change in Net Assets",
        "line"
      );

      // console.log("General component displayed successfully");
    } catch (error) {
      console.error("Error displaying general component:", error);
    }
  },

  // Display cash component charts
  displayCashComponent: function () {
    try {
      const savedData = getStoredData("cashData");
      const parsedData = parseStoredData(savedData);

      if (!parsedData) {
        console.error("Unable to load cash component data");
        return;
      }

      // Days Cash on Hand
      chartManager.createChartFromParsedData(
        parsedData,
        "daysCashOnHand_chart",
        "daysCashOnHand_Peer",
        "daysCashOnHand_Client",
        "number",
        0,
        "daysCashOnHand",
        "wa" // Already has weighted average
      );

      // Days Expenses in Unrestricted NA
      chartManager.createChartFromParsedData(
        parsedData,
        "daysExpensesInUnrestrictedNA_chart",
        "daysExpensesInUnrestrictedNA_Peer",
        "daysExpensesInUnrestrictedNA_Client",
        "number",
        0,
        "daysExpensesInUnrestrictedNA",
        "wa" // Add weighted average
      );

      // Days Expenses in Unrestricted NA excluding PPE
      chartManager.createChartFromParsedData(
        parsedData,
        "daysExpensesInUnrestrictedNA_excludingPPE_chart",
        "daysExpensesInUnrestrictedNA_excludingPPE_Peer",
        "daysExpensesInUnrestrictedNA_excludingPPE_Client",
        "number",
        0,
        "daysExpensesInUnrestrictedNA_excludingPPE",
        "wa" // Add weighted average
      );

      // Liquidity Assets Available Cover
      chartManager.createChartFromParsedData(
        parsedData,
        "liquidityAssetsAvailableCover_chart",
        "liquidityAssetsAvailableCover_Peer",
        "liquidityAssetsAvailableCover_Client",
        "number",
        2,
        "liquidityAssetsAvailableCover",
        "wa", // Add weighted average
        1,
        "Liquidity: Assets Available to Cover Liabilities and Net Assets with Donor Restrictions",
        "line"
      );

      // Total Coverage Ratio
      chartManager.createChartFromParsedData(
        parsedData,
        "totalCoverageRatio_chart",
        "totalCoverageRatio_Peer",
        "totalCoverageRatio_Client",
        "number",
        1,
        "totalCoverageRatio",
        "wa" // Add weighted average
      );

      // Assets Without PPE to Liabilities Without Debt
      chartManager.createChartFromParsedData(
        parsedData,
        "assetsWithoutPpeToLiabilitiesWithoutDebt_chart",
        "assetsWithoutPpeToLiabilitiesWithoutDebt_Peer",
        "assetsWithoutPpeToLiabilitiesWithoutDebt_Client",
        "number",
        2,
        "assetsWithoutPpeToLiabilitiesWithoutDebt",
        "wa", // Add weighted average
        1,
        "Assets Without PPE to Liabilities Without Debt",
        "line"
      );

      // console.log("Cash component displayed successfully");
    } catch (error) {
      console.error("Error displaying cash component:", error);
    }
  },

  // Display income component charts
  displayIncomeComponent: function () {
    try {
      const savedData = getStoredData("incomeData");
      const parsedData = parseStoredData(savedData);

      if (!parsedData) {
        console.error("Unable to load income component data");
        return;
      }

      // Total Contributions
      chartManager.createChartFromParsedData(
        parsedData,
        "totalContributions_chart",
        "totalContributions_Peer",
        "totalContributions_Client",
        "dollar",
        0,
        "totalContributions",
        null 
      );

      // Contributions Without DR
      chartManager.createChartFromParsedData(
        parsedData,
        "contributionsWithoutDR_chart",
        "contributionsWithoutDR_Peer",
        "contributionsWithoutDR_Client",
        "dollar",
        0,
        "contributionsWithoutDR",
        null // Add weighted average
      );

      // Contributions Trend
      chartManager.createChartFromParsedData(
        parsedData,
        "contributionsTrend_chart",
        "contributionsTrend_Peer",
        "contributionsTrend_Client",
        "percent",
        0,
        "contributionsTrend",
        null // Add weighted average
      );

      // Annualized Investment Return
      chartManager.createChartFromParsedData(
        parsedData,
        "annualizedInvestmentReturn_chart",
        "annualizedInvestmentReturn_Peer",
        "annualizedInvestmentReturn_Client",
        "percent",
        0,
        "annualizedInvestmentReturn",
        "wa" // Add weighted average
      );

      // console.log("Income component displayed successfully");
    } catch (error) {
      console.error("Error displaying income component:", error);
    }
  },

  // Display expense component charts
  displayExpenseComponent: function () {
    try {
      const savedData = getStoredData("expenseData");
      const parsedData = parseStoredData(savedData);

      if (!parsedData) {
        console.error("Unable to load expense component data");
        return;
      }

      // Functional Allocation
      chartManager.createChartFromParsedData(
        parsedData,
        "functionalAllocation_chart",
        "functionalExpensePercent_program_Peer",
        "functionalExpensePercent_program_Client",
        "percent",
        0,
        "functionalAllocation",
        "wa" // Add weighted average
      );

      // Program Expense Percentage
      chartManager.createChartFromParsedData(
        parsedData,
        "functionalExpensePercent_program_chart",
        "functionalExpensePercent_program_Peer",
        "functionalExpensePercent_program_Client",
        "percent",
        0,
        "functionalExpensePercent_program",
        "wa" // Add weighted average
      );

      // Administrative Expense Percentage
      chartManager.createChartFromParsedData(
        parsedData,
        "functionalExpensePercent_administrative_chart",
        "functionalExpensePercent_administrative_Peer",
        "functionalExpensePercent_administrative_Client",
        "percent",
        0,
        "functionalExpensePercent_administrative",
        "wa" // Add weighted average
      );

      // Fundraising Expense Percentage
      chartManager.createChartFromParsedData(
        parsedData,
        "functionalExpensePercent_fundraising_chart",
        "functionalExpensePercent_fundraising_Peer",
        "functionalExpensePercent_fundraising_Client",
        "percent",
        0,
        "functionalExpensePercent_fundraising",
        "wa" // Add weighted average
      );

      // Cost of Contributions Detail View
      chartManager.createChartFromParsedData(
        parsedData,
        "costOfContributionsDetailView_chart",
        "costOfContributions_Peer",
        "costOfContributions_Client",
        "dollar",
        2,
        "costOfContributionsDetailView",
        "wa" // Add weighted average
      );

      // Cost of Contributions
      chartManager.createChartFromParsedData(
        parsedData,
        "costOfContributions_chart",
        "costOfContributions_Peer",
        "costOfContributions_Client",
        "dollar",
        2,
        "costOfContributions",
        "wa" // Add weighted average
      );

      // console.log("Expense component displayed successfully");
    } catch (error) {
      console.error("Error displaying expense component:", error);
    }
  },

  // Display all components
  displayAllComponents: function () {
    try {
      this.displayGeneralComponent();
      this.displayCashComponent();
      this.displayIncomeComponent();
      this.displayExpenseComponent();
      // console.log("All components displayed successfully");
    } catch (error) {
      console.error("Error displaying all components:", error);
    }
  },

  // Display specific component by name
  displayComponent: function (componentName) {
    switch (componentName.toLowerCase()) {
      case "general":
        this.displayGeneralComponent();
        break;
      case "cash":
        this.displayCashComponent();
        break;
      case "income":
        this.displayIncomeComponent();
        break;
      case "expense":
        this.displayExpenseComponent();
        break;
      case "all":
        this.displayAllComponents();
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
window.displayGeneralComponent = function (data) {
  // console.log("Legacy displayGeneralComponent called");
  displayComponents.displayGeneralComponent(data);
};

window.displayCashComponent = function (data) {
  // console.log("Legacy displayCashComponent called");
  displayComponents.displayCashComponent(data);
};

window.displayIncomeComponent = function (data) {
  // console.log("Legacy displayIncomeComponent called");
  displayComponents.displayIncomeComponent(data);
};

window.displayExpenseComponent = function (data) {
  // console.log("Legacy displayExpenseComponent called");
  displayComponents.displayExpenseComponent(data);
};

window.displayReportComponent = function (data) {
  // This is likely handled by another script but we provide a stub for compatibility
  // console.log("Legacy displayReportComponent called");
  if (typeof originalDisplayReportComponent === "function") {
    originalDisplayReportComponent(data);
  }
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

// Helper function to make the global chart references point to chart instances
function updateGlobalChartReferences() {
  // This function updates the global variables to point to actual chart instances
  const chartIds = [
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
