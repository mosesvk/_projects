const displayCfiComponent = () => {
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
    "CFI Overall Ratio"
  );

  // cfi_primaryReserveRatio
  createChartFromParsedData(
    parseData,
    "cfi_primaryReserveRatio_chart",
    "primaryReserveRatio_peerAverage_Peer",
    "cfi_primaryReserveRatio_Client",
    "num",
    2,
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
    3,
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
    2,
    "cfi_viabilityRatio",
    1.25,
    "CFI Viability Ratio"
  );

  // Extract CFI data and render the HTML/CSS vertical bar chart
  const selectedYears = getSelectedYearsFromLocalStorage();
  const mostRecentYear = selectedYears[selectedYears.length - 1];
  const cfiValue = parseData.cfiRatio_Client[mostRecentYear]?.value;

  /** CFI color ranges: -4 to 10 scale */
  const CFI_COLOR_RANGES = [
    { min: -4, max: 1, color: '#D46D78', label: 'Assess viability to Survive' },
    { min: 1, max: 3, color: '#E39D5E', label: 'Re-Engineer the University' },
    { min: 3, max: 5, color: '#E0BD4D', label: 'Direct resources to allow transformation' },
    { min: 5, max: 7, color: '#b5de1f', label: 'Focus resources to compete in future state' },
    { min: 7, max: 9, color: '#91de2a', label: 'Allow experimentation with new initiatives' },
    { min: 9, max: 10, color: '#79b52b', label: 'Deploy resources to achieve robust mission' }
  ];
  const CFI_MIN = -4;
  const CFI_MAX = 10;
  const CFI_RANGE = CFI_MAX - CFI_MIN;

  /**
   * Builds and injects an HTML/CSS vertical bar chart for CFI Ratio
   * Gauge-style: segmented background, tick labels at exact values, center indicator bar with value on top
   * @param {number} value - Current CFI value for indicator position
   * @param {string} year - Year for caption
   */
  function buildCfiHtmlChart(value, year) {
    const container = document.getElementById('cfiCompositeHtml_Chart');
    if (!container) return;
    const displayYear = year || 'N/A';

    // Reverse order: 9-10 at top, -4 to 1 at bottom. Use flex for proportional heights (height:% fails in flex parents)
    const reversedRanges = [...CFI_COLOR_RANGES].reverse();
    const segmentsHtml = reversedRanges.map((range) => {
      const flexVal = range.max - range.min; // proportional share: 5,2,2,2,2,1
      return `<div class="cfi-segment" style="flex:${flexVal} 0 0;min-height:2px;background-color:${range.color};opacity:0.9" title="${range.label}"></div>`;
    }).join('');

    // Tick marks at color-range boundaries: -4, 1, 3, 5, 7, 9, 10
    const tickValues = [-4, 1, 3, 5, 7, 9, 10];
    const scaleTicksHtml = tickValues.map((tickVal) => {
      const bottomPct = ((tickVal - CFI_MIN) / CFI_RANGE) * 100;
      return `<div class="cfi-scale-tick" style="bottom:${bottomPct}%">
        <span class="cfi-tick-line"></span>
        <span class="cfi-tick-value">${tickVal}</span>
      </div>`;
    }).join('');

    const valuePosPct = value !== undefined && !isNaN(value)
      ? Math.min(100, Math.max(0, ((value - CFI_MIN) / CFI_RANGE) * 100))
      : null;

    const indicatorBarHtml = valuePosPct != null
      ? `<div class="cfi-indicator-bar-wrap" style="height:${valuePosPct}%">
          <div class="cfi-indicator-bar"></div>
          <span class="cfi-value-on-bar">${Number(value).toFixed(2)}</span>
        </div>`
      : '';

    container.innerHTML = `
      <div class="cfi-html-chart" style="width:200px;height:700px;position:relative;border:1px solid #e5e7eb;border-radius:4px;overflow:visible;display:flex;flex-direction:column;box-shadow:2px 2px 6px rgba(0,0,0,0.08)">
        <div class="cfi-chart-caption" style="text-align:center;font-weight:bold;font-size:16px;padding:8px 0;background:#f9fafb;flex-shrink:0;border-radius:4px 4px 0 0">
          CFI RATIO - ${displayYear}
        </div>
        <div class="cfi-chart-body" style="flex:1;display:flex;min-height:0;position:relative">
          <div class="cfi-scale-axis" style="width:36px;flex-shrink:0;position:relative;background:#f9fafb;border-right:1px solid #e5e7eb">
            ${scaleTicksHtml}
          </div>
          <div class="cfi-bar-stack" style="flex:1;display:flex;flex-direction:column;min-height:0;position:relative;justify-content:flex-end;align-items:stretch;padding:0 8px">
            ${segmentsHtml}
            <div class="cfi-indicator-container" style="position:absolute;left:50%;transform:translateX(-50%);bottom:0;top:0;width:56px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;pointer-events:none">
              ${indicatorBarHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders the CFI vertical HTML/CSS chart and updates labels
   */
  function renderCfiChart() {
    const chartContainer = document.getElementById('cfiCompositeHtml_Chart');
    const detailsSection = document.getElementById('details_cfiRatio');
    if (chartContainer && detailsSection && detailsSection.classList.contains('hidden')) {
      return;
    }
    buildCfiHtmlChart(cfiValue, mostRecentYear);
    updateCfiLabels(cfiValue);
  }
  
  /**
   * Updates the styling of CFI text labels - colors match bar segments, bold for active range
   * Label order in DOM: cfiLabel6 (9-10) top, down to cfiLabel1 (-4 to 1) bottom
   * @param {number} cfiValue - The current CFI ratio value
   */
  function updateCfiLabels(cfiValue) {
    const labelRanges = [
      { id: 'cfiLabel1', min: -4, max: 1, color: '#D46D78' },
      { id: 'cfiLabel2', min: 1, max: 3, color: '#E39D5E' },
      { id: 'cfiLabel3', min: 3, max: 5, color: '#E0BD4D' },
      { id: 'cfiLabel4', min: 5, max: 7, color: '#b5de1f' },
      { id: 'cfiLabel5', min: 7, max: 9, color: '#91de2a' },
      { id: 'cfiLabel6', min: 9, max: 10, color: '#79b52b' }
    ];

    labelRanges.forEach((range) => {
      const labelDiv = document.getElementById(range.id);
      const labelP = labelDiv?.querySelector('p');

      if (labelP) {
        const isActive = cfiValue >= range.min && cfiValue < range.max;
        labelP.style.color = range.color;
        labelP.className = isActive ? 'text-2xl font-bold' : 'text-base font-normal';
      }
    });
  }
  
  // Initial render
  renderCfiChart();
  
  // Make renderCfiChart globally accessible for toggle function
  window.renderCfiChart = renderCfiChart;
};

toggleDetailsByIdentifier("cfiRatio");
toggleDetailsByIdentifier("primaryReserveRatio");
toggleDetailsByIdentifier("cfiNetIncomeOperationsRatio");
toggleDetailsByIdentifier("returnOnNetAssets");
toggleDetailsByIdentifier("cfiViabilityRatio");

// DOE
const displayDoeComponent = () => {
  // console.log('displayCfiComponent()');
  const savedData = getStoredData("doeData");
  const parseData = parseStoredData(savedData);

  // cfiRatio
  createChartFromParsedData(
    parseData,
    "doeOverall_chart",
    "doeOverall_Peer",
    "doeOverall_Client",
    "num",
    1,
    "doeOverall",
    1.5,
    "US Department of Education Overall Composite Score"
  );
};

toggleDetailsByIdentifier("doeOverall");

// Financial ANALYSIS
const displayFinancialAnalysisContentComponent = async () => {
  const savedData = getStoredData("financialAnalysisData");
  const parseData = parseStoredData(savedData);

  FinancialPosition_chart = new ApexCharts(
    document.querySelector("#FinancialPosition_chart"),
    getFpaChartOptions(parseData)
  );
  FinancialPosition_chart.render();
  document.addEventListener("dark-mode", function () {
    FinancialPosition_chart.updateOptions(getFpaChartOptions(parseData));
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
    sourceOfIncomeClient_chart.updateOptions(
      getSourcesOfIncomeClientChartOptions(parseData)
    );
  });

  sourceOfIncomePeer_chart = new ApexCharts(
    document.querySelector("#sourceOfIncomePeer_chart"),
    getSourcesOfIncomePeerChartOptions(parseData)
  );
  sourceOfIncomePeer_chart.render();
  document.addEventListener("dark-mode", function () {
    sourceOfIncomePeer_chart.updateOptions(
      getSourcesOfIncomePeerChartOptions(parseData)
    );
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
  const storedData = getStoredData("financialStatementData");
  parsedData = parseStoredData(storedData);
  // console.log('displayFinancialStatementComponent',{ parsedData });

  createAndRenderFSChart(
    "#assets_chart",
    parsedData,
    "totalAssets_Client",
    "#FBD75A",
    "dollar",
    "Assets",
    "assets_dataPoint",
    [
      "cashAndCashEquivalents",
      "accountsReceivable",
      "studentLoansAndOtherReceivables",
      "contributionsReceivable",
      "prepaidExpensesAndOtherAssets",
      "financingLeasesRightOfUseAssets",
      "propertyAndEquipment",
      "investmentsHeldForLongTermPurposes",
      "investmentsHeldForShortTermPurposes",
      "totalAssets"
    ]
  );

  createAndRenderFSChart(
    "#liabilities_chart",
    parsedData,
    "totalLiabilities_Client",
    window.chartColors.blue,
    "dollar",
    "Liabilities",
    "liabilities_dataPoint",
    [
      "accountsPayableAndAccruedExpenses",
      "deferredRevenue",
      "postRetirementHealthBenefits",
      "annuityObligations",
      "financingLeasesRightOfUseLiabilities",
      "otherLiabilities",
      "interestRateSwapLiability",
      "bondsAndNotesPayable",
      "totalLiabilities"
    ]
  );

  createAndRenderFSChart(
    "#netAssets_chart",
    parsedData,
    "netAssets_Client",
    window.chartColors.yellow,
    "dollar",
    "Net Assets",
    "netAssets_dataPoint",
    [
      "withoutDonorRestrictions",
      "restrictedByTimeOrPurpose",
      "restrictedInPerpetuity",
      "netAssets"
    ]
  );

  createAndRenderFSChart(
    "#revenueAndSupport_chart",
    parsedData,
    "revenueAndSupport_Client",
    "#4EA79F",
    "dollar",
    "Revenue and Support",
    "revenueAndSupport_dataPoint",
    [
      "tuitionAndFees",
      "scholarshipsAndFinancialAid",
      "auxiliaryActivities",
      "revenueInvestmentIncome",
      "revenueEndowmentSpendingAppropriation",
      "revenueAndSupportOther",
      "contributionsLargeOneTimeGifts",
      "netAssetsReleasedFromRestriction",
      "totalRevenueContributions",
      "revenueAndSupport"
    ]
  );

  createAndRenderFSChart(
    "#educationalProgramExpenses_chart",
    parsedData,
    "educationalProgramExpenses_Client",
    "#F4982D",
    "dollar",
    "Educational Program Expenses",
    "educationalProgramExpenses_dataPoint",
    [
      "educationalProgramInstruction",
      "educationalProgramResearch",
      "educationalProgramAcademicSupport",
      "educationalProgramStudentServices", 
      "educationalProgramAuxiliaryActivities",
      "educationalProgramInstitutionalSupport",
      "educationalProgramPublicService",
      "educationalProgramFundraisingExpenses",
      "educationalProgramOther",
      "educationalProgramExpenses"
    ]
  );

  createAndRenderFSChart(
    "#nonOperatingActivities_chart",
    parsedData,
    "nonOperatingActivities_Client",
    window.chartColors.red,
    "dollar",
    "Non Operating Activities",
    "nonOperatingActivities_dataPoint",
    [
      "nonOperatingInvestmentIncome",
      "nonOperatingEndowmentSpendingPolicyAppropriation",
      "changeInValueOfInterestRateSwap",
      "adjustmentToPRBO",
      "contributionsAndOther",
      "nonOperatingActivities"
    ]
  );

  createAndRenderFSChart(
    "#changesInNetAssetsWithDR_chart",
    parsedData,
    "changesInNetAssetsWithDR_Client",
    "#C57FD7",
    "dollar",
    "Changes in Net Assets with Donor Restrictions",
    "changesInNetAssetsWithDR_dataPoint",
    [
      "contributions",
      "investmentIncomePlusEndowment",
      "endowmentSpendingPolicy",
      "netAssetsReleasedFromProgram",
      "temporarilyRestrictedNetChange",
      "permanentlyRestrictedContributions",
      "investmentIncome",
      "netAssetsReleased",
      "permanentlyRestrictedNetChange",
      "changesInNetAssetsWithDR"
    ]
  );

  createAndRenderFSChart(
    "#naturalExpenseCategories_chart",
    parsedData,
    "naturalExpenseCategories_Client",
    "#4F76D9",
    "dollar",
    "Natural Expense Categories",
    "naturalExpenseCategories_dataPoint",
    [
      "salariesAndWages",
      "employeeBenefits",
      "servicesSuppliesAndOther",
      "occupancyUtilitiesAndMaintenance",
      "depreciationAndAmortization",
      "interest",
      "naturalExpenseCategories"
    ]
  );

  createAndRenderFSChart(
    "#cashFlowsOperatingActivities_chart",
    parsedData,
    "cashFlowsOperatingActivities_Client",
    "#70B5CC",
    "dollar",
    "Cash Flows: Operating Activities",
    "cashFlowsOperatingActivities_dataPoint",
    [
      "depreciation",
      "adjustmentsGiftsAndGrantsRestrictedInPerpetuity",
      "gainOnInvestment",
      "derivativeCSLVIAmortBondCosts",
      "adjustmentsAccountsReceivable",
      "adjustmentsInventory",
      "adjustmentsPrepaidsAndOtherAssets",
      "cashFlowsAccountsPayableAndAccruedExpenses",
      "cashFlowsDeferredRevenue",
      "adjustmentsOtherLiabilities",
      "cashFlowsOperatingActivities"
    ]
  );

  createAndRenderFSChart(
    "#cashFlowsInvestingActivities_chart",
    parsedData,
    "cashFlowsInvestingActivities_Client",
    "#FFA726",
    "dollar",
    "Cash Flows: Investing Activities",
    "cashFlowsInvestingActivities_dataPoint",
    [
      "purchaseOfInvestments",
      "proceedsFromSaleOfInvestments",
      "purchaseOfPropertyAndEquipment",
      "studentLoanFund",
      "otherInvestingActivity",
      "cashFlowsInvestingActivities"
    ]
  );

  createAndRenderFSChart(
    "#cashFlowsFinancingActivities_chart",
    parsedData,
    "cashFlowsFinancingActivities_Client",
    "#FFCDD2",
    "dollar",
    "Cash Flows: Financing Activities",
    "cashFlowsFinancingActivities_dataPoint",
    [
      "proceedsFromNotesPayable",
      "principalPaymentsOnNotesPayable",
      "cashFlowsFinancingOther",
      "cashFlowsFinancingActivities"
    ]
  );

  createAndRenderFSChart(
    "#propertyAndEquipment_chart",
    parsedData,
    "propertyAndEquipment_Client",
    "#459B53",
    "dollar",
    "Property and Equipment",
    "propertyAndEquipment_dataPoint",
    [
      "landAndImprovements",
      "buildingAndImprovements",
      "furnitureAndEquipment",
      "cip",
      "totalPropertyAndEquipment",
      "accumulatedDepreciation",
      "propertyAndEquipmentLessDepreciation"
    ]
  );
};

// Financial Position
const displayFinancialPositionComponent = () => {
  // console.log('hit');

  const storedData = getStoredData("financialPositionData");
  parsedData = parseStoredData(storedData);
  // console.log(parsedData);

  // getCurrentRatioChartOptions(parsedData["currentRatioData"])

  currentRatio_chart = new ApexCharts(
    document.querySelector("#currentRatio_chart"),
    getCurrentRatioChartOptions(parsedData)
  );
  currentRatio_chart.render();
  document.addEventListener("dark-mode", function () {
    currentRatio_chart.updateOptions(getCurrentRatioChartOptions(parsedData));
  });

  // getLiquidityChartOptions
  //   const liquidityChart = new ApexCharts(
  //     document.querySelector("#liquidity_chart"),
  //     getLiquidityChartOptions(parsedData)
  //   );
  //   liquidityChart.render();
  //   document.addEventListener("dark-mode", function () {
  //     liquidityChart.updateOptions(
  //       getLiquidityChartOptions(parsedData)
  //     );
  //   });
};

// Revenue and Expense
const displayRevenueAndExpenseComponent = () => {
  const storedData = getStoredData("revenueExpenseData");
  parsedData = parseStoredData(storedData);

  // salariesAndBenefitsToTotalExpenseData
  salariesBenefitsToTotalExpense_chart = new ApexCharts(
    document.querySelector("#salariesBenefitsToTotalExpense_chart"),
    getSalariesAndBenefitsToTotalExpenseChartOptions(parsedData)
  );
  salariesBenefitsToTotalExpense_chart.render();
  document.addEventListener("dark-mode", function () {
    salariesBenefitsToTotalExpense_chart.updateOptions(
      getSalariesAndBenefitsToTotalExpenseChartOptions(parsedData)
    );
  });

  // averageEmployeeSalaryData
  // const averageEmployeeSalary_chart = new ApexCharts(
  //   document.querySelector("#averageEmployeeSalary_chart"),
  //   getAverageEmployeeSalaryChartOptions(
  //     parsedData]
  //   )
  // );
  // averageEmployeeSalary_chart.render();
  // document.addEventListener("dark-mode", function () {
  //   averageEmployeeSalary_chart.updateOptions(
  //     getAverageEmployeeSalaryChartOptions(
  //       parsedData]
  //     )
  //   );
  // });

  // getSalariesAndBenefitsPerNetTuitionChartOptions(parsedData)
  salariesBenefitsPerNetTuition_chart = new ApexCharts(
    document.querySelector("#salariesBenefitsPerNetTuition_chart"),
    getSalariesAndBenefitsPerNetTuitionChartOptions(parsedData)
  );
  salariesBenefitsPerNetTuition_chart.render();
  document.addEventListener("dark-mode", function () {
    salariesBenefitsPerNetTuition_chart.updateOptions(
      getSalariesAndBenefitsPerNetTuitionChartOptions(parsedData)
    );
  });

  // adminCostsPerStudent
  // getAdminCostsPerStudentChartOptions(parsedData)
  // const adminCostsPerStudent_chart = new ApexCharts(
  //   document.querySelector("#adminCostsPerStudent_chart"),
  //   getAdminCostsPerStudentChartOptions(parsedData)
  // );
  // adminCostsPerStudent_chart.render();
  // document.addEventListener("dark-mode", function () {
  //   adminCostsPerStudent_chart.updateOptions(
  //     getAdminCostsPerStudentChartOptions(
  //       parsedData
  //     )
  //   );
  // });

  // getMapChatOptions();

  // netEducationalExpensePerStudent
  netEducationalExpensePerStudent_chart = new ApexCharts(
    document.querySelector("#netEducationalExpensePerStudent_chart"),
    getNetEducationalExpensePerStudentChartOptions(parsedData)
  );
  netEducationalExpensePerStudent_chart.render();
  document.addEventListener("dark-mode", function () {
    netEducationalExpensePerStudent_chart.updateOptions(
      getNetEducationalExpensePerStudentChartOptions(parsedData)
    );
  });

  getNetTuitionPerStudentChartOptions(parsedData);


  getTuitionDependencyChartOptions(parsedData);
  tuitionDependency_chart = new ApexCharts(
    document.querySelector("#tuitionDependency_chart"),
      getTuitionDependencyChartOptions(parsedData)
  );
  tuitionDependency_chart.render();
  document.addEventListener("dark-mode", function () {
    tuitionDependency_chart.updateOptions(
      getTuitionDependencyChartOptions(parsedData)
    );
  });

  // getTuitionDiscountRateChartOptions(parsedData)
  tuitionDiscountRate_chart = new ApexCharts(
    document.querySelector("#tuitionDiscountRate_chart"),
    getTuitionDiscountRateChartOptions(parsedData)
  );
  tuitionDiscountRate_chart.render();
  document.addEventListener("dark-mode", function () {
    tuitionDiscountRate_chart.updateOptions(
      getTuitionDiscountRateChartOptions(parsedData)
    );
  });
};

toggleDetailsByIdentifier("salariesBenefitsToTotalExpense");
toggleDetailsByIdentifier("salariesBenefitsPerNetTuition");
toggleDetailsByIdentifier("netEducationalExpensePerStudent");
toggleDetailsByIdentifier("tuitionDependency");
toggleDetailsByIdentifier("tuitionDiscountRate");

// Debt and Endowment
const displayDebtAndEndowmentComponent = () => {
  const ltDebtPerTotalOperatingRevenueData = getStoredData("ltDebtPerTotalOperatingRevenueData");
  const ltDebtPerTotalOperatingRevenueParsedData = parseStoredData(ltDebtPerTotalOperatingRevenueData);

  // ltDebtPerTotalOperatingRevenue
  ltDebtPerTotalOperatingRevenue_chart = new ApexCharts(
    document.querySelector("#ltDebtPerTotalOperatingRevenue_chart"),
    getLtDebtPerTotalOperatingRevenueChartOptions(ltDebtPerTotalOperatingRevenueParsedData)
  );
  ltDebtPerTotalOperatingRevenue_chart.render();
  document.addEventListener("dark-mode", function () {
    ltDebtPerTotalOperatingRevenue_chart.updateOptions( 
      getLtDebtPerTotalOperatingRevenueChartOptions(ltDebtPerTotalOperatingRevenueParsedData)
    );
  });

  const debtServiceCoverageData = getStoredData("debtServiceCoverageRatioData");
  const debtServiceCoverageParsedData = parseStoredData(debtServiceCoverageData);
  // console.log("debtServiceCoverageParsedData", debtServiceCoverageParsedData);

  // debtServiceCoverageRatio
  getDebtServiceCoverageChartOptions(debtServiceCoverageParsedData);


  const debtBurdenRatioData = getStoredData("debtBurdenRatioData");
  const debtBurdenRatioParsedData = parseStoredData(debtBurdenRatioData);

  // debtBurdenRatio
  debtBurdenRatio_chart = new ApexCharts(
    document.querySelector("#debtBurdenRatio_chart"),
    getDebtBurdenRatioChartOptions(debtBurdenRatioParsedData)
  );
  debtBurdenRatio_chart.render();
  document.addEventListener("dark-mode", function () {
    debtBurdenRatio_chart.updateOptions(
      getDebtBurdenRatioChartOptions(debtBurdenRatioParsedData)
    );
  });

  const endowmentOperatingBudgetData = getStoredData("endowmentOperatingBudgetData");
  const endowmentOperatingBudgetParsedData = parseStoredData(endowmentOperatingBudgetData);

  // endowmentOperatingBudget
  getEndowmentOperatingChartOptions(endowmentOperatingBudgetParsedData);

  // endowmentAssetsPerStudentMap
  // getEndowmentAssetsPerStudentMapOptions();

  const endowmentAssetsPerStudentData = getStoredData("endowmentAssetsPerStudentData");
  const endowmentAssetsPerStudentParsedData = parseStoredData(endowmentAssetsPerStudentData);

  // endowmentAssetsPerStudentChart
  endowmentAssetsPerStudent_chart = new ApexCharts(
    document.querySelector("#endowmentAssetsPerStudent_chart"),
    getEndowmentAssetsPerStudentChartOptions(endowmentAssetsPerStudentParsedData)
  );
  endowmentAssetsPerStudent_chart.render();
  document.addEventListener("dark-mode", function () {
    endowmentAssetsPerStudent_chart.updateOptions(
      getEndowmentAssetsPerStudentChartOptions(endowmentAssetsPerStudentParsedData)
    );
  });
};

toggleDetailsByIdentifier("ltDebtPerTotalOperatingRevenue");
toggleDetailsByIdentifier("debtServiceCoverageRatio");
toggleDetailsByIdentifier("debtBurdenRatio");
toggleDetailsByIdentifier("endowmentOperatingBudget");
toggleDetailsByIdentifier("endowmentAssetsPerStudent");
