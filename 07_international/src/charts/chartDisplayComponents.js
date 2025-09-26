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
        1,
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
        1,
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
        "wa" // Add weighted average
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
        "wa" // Add weighted average
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
        "wa" // Add weighted average
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
        "wa" // Ensure weighted average
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

// Call this function after charts are rendered
document.addEventListener("chartsRendered", updateGlobalChartReferences);

// Also fix numType values after charts are rendered
document.addEventListener("chartsRendered", function() {
  // Give charts a moment to fully initialize their globals
  setTimeout(() => {
    console.log("Running chart numType fix...");
    if (chartManager && typeof chartManager.fixChartNumTypes === 'function') {
      chartManager.fixChartNumTypes();
    }
  }, 500);
});

// Also call it after the window loads
window.addEventListener("load", () => {
  // Give some time for charts to render
  setTimeout(updateGlobalChartReferences, 1000);
  
  // Also fix numType values
  setTimeout(() => {
    console.log("Running chart numType fix on window load...");
    if (chartManager && typeof chartManager.fixChartNumTypes === 'function') {
      chartManager.fixChartNumTypes();
    }
  }, 1500);
});