// ChartDisplayComponents.js
// Module for displaying charts in different sections

// Components module for chart display
const ChartDisplayComponents = {
    // Display general component charts
    displayGeneralComponent: function() {
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
          "cashFlowsTrendTotal"
        ]
      );
  
      // Create the net asset breakdown chart
      chartManager.createChartFromParsedData(
        parsedGeneralData,
        "netAssetBreakdown_chart",
        null,
        null,
        "dollar",
        0,
        "netAssetBreakdown"
      );
  
      // Create the change in net assets chart
      chartManager.createChartFromParsedData(
        parsedGeneralData,
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
    },
  
    // Display cash component charts
    displayCashComponent: function() {
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
        "wa"
      );
  
      // Days Expenses in Unrestricted NA
      chartManager.createChartFromParsedData(
        parsedData,
        "daysExpensesInUnrestrictedNA_chart",
        "daysExpensesInUnrestrictedNA_Peer",
        "daysExpensesInUnrestrictedNA_Client",
        "number",
        0,
        "daysExpensesInUnrestrictedNA"
      );
  
      // Days Expenses in Unrestricted NA excluding PPE
      chartManager.createChartFromParsedData(
        parsedData,
        "daysExpensesInUnrestrictedNA_excludingPPE_chart",
        "daysExpensesInUnrestrictedNA_excludingPPE_Peer",
        "daysExpensesInUnrestrictedNA_excludingPPE_Client",
        "number",
        0,
        "daysExpensesInUnrestrictedNA_excludingPPE"
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
        false,
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
        0,
        "totalCoverageRatio"
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
        false,
        1,
        "Assets Without PPE to Liabilities Without Debt",
        "line"
      );
    },
  
    // Display income component charts
    displayIncomeComponent: function() {
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
        "totalContributions"
      );
  
      // Contributions Without DR
      chartManager.createChartFromParsedData(
        parsedData,
        "contributionsWithoutDR_chart",
        "contributionsWithoutDR_Peer",
        "contributionsWithoutDR_Client",
        "dollar",
        0,
        "contributionsWithoutDR"
      );
  
      // Contributions Trend
      chartManager.createChartFromParsedData(
        parsedData,
        "contributionsTrend_chart",
        "contributionsTrend_Peer",
        "contributionsTrend_Client",
        "percent",
        0,
        "contributionsTrend"
      );
  
      // Annualized Investment Return
      chartManager.createChartFromParsedData(
        parsedData,
        "annualizedInvestmentReturn_chart",
        "annualizedInvestmentReturn_Peer",
        "annualizedInvestmentReturn_Client",
        "percent",
        0,
        "annualizedInvestmentReturn"
      );
    },
  
    // Display expense component charts
    displayExpenseComponent: function() {
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
        "functionalAllocation"
      );
  
      // Program Expense Percentage
      chartManager.createChartFromParsedData(
        parsedData,
        "functionalExpensePercent_program_chart",
        "functionalExpensePercent_program_Peer",
        "functionalExpensePercent_program_Client",
        "percent",
        0,
        "functionalExpensePercent_program"
      );
  
      // Administrative Expense Percentage
      chartManager.createChartFromParsedData(
        parsedData,
        "functionalExpensePercent_administrative_chart",
        "functionalExpensePercent_administrative_Peer",
        "functionalExpensePercent_administrative_Client",
        "percent",
        0,
        "functionalExpensePercent_administrative"
      );
  
      // Fundraising Expense Percentage
      chartManager.createChartFromParsedData(
        parsedData,
        "functionalExpensePercent_fundraising_chart",
        "functionalExpensePercent_fundraising_Peer",
        "functionalExpensePercent_fundraising_Client",
        "percent",
        0,
        "functionalExpensePercent_fundraising"
      );
  
      // Cost of Contributions Detail View
      chartManager.createChartFromParsedData(
        parsedData,
        "costOfContributionsDetailView_chart",
        "costOfContributions_Peer",
        "costOfContributions_Client",
        "dollar",
        2,
        "costOfContributionsDetailView"
      );
  
      // Cost of Contributions
      chartManager.createChartFromParsedData(
        parsedData,
        "costOfContributions_chart",
        "costOfContributions_Peer",
        "costOfContributions_Client",
        "dollar",
        2,
        "costOfContributions"
      );
    },
  
    // Display all components
    displayAllComponents: function() {
      this.displayGeneralComponent();
      this.displayCashComponent();
      this.displayIncomeComponent();
      this.displayExpenseComponent();
    }
  };
  
  // Export the component
  const displayComponents = ChartDisplayComponents;