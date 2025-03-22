function ensureAllModalsExist() {
  // List of all expected modal names
  const modalNames = [
    "daysCashOnHand",
    "daysExpensesInUnrestrictedNA",
    "daysExpensesInUnrestrictedNA_excludingPPE",
    "liquidityAssetsAvailableCover", 
    "totalCoverageRatio",
    "assetsWithoutPpeToLiabilitiesWithoutDebt",
    "contributionsTrend",
    "annualizedInvestmentReturn",
    "functionalExpensePercent_program",
    "functionalExpensePercent_administrative",
    "functionalExpensePercent_fundraising",
    "costOfContributionsDetailView",
    "costOfContributions",
    "functionalAllocation",
    "netAssetBreakdown", 
    "changeInNetAssets",
    "totalContributions",
    "contributionsWithoutDR",
    "cashFlowsTrend"
  ];

  modalNames.forEach(name => {
    const modalId = `${name}_modal`;
    if (!document.getElementById(modalId)) {
      console.log(`Creating missing modal container for ${name}`);
      
      // Create modal container
      const modal = document.createElement("div");
      modal.id = modalId;
      modal.className = "modal";
      
      // Create table structure
      const table = document.createElement("table");
      table.className = "w-full text-sm text-left text-gray-500 dark:text-gray-400";
      
      // Create thead and the header row
      const thead = document.createElement("thead");
      thead.className = "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400";
      
      const headerRow = document.createElement("tr");
      headerRow.id = `${name}_modal_row`;
      
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Create tbody
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);
      
      modal.appendChild(table);
      
      // Add to document - try to find a dedicated modal container, or append to body
      const modalContainer = document.querySelector("#modalContainer") || document.body;
      modalContainer.appendChild(modal);
    }
  });
}