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

const dropdownButton_cfiRatio = document.getElementById("dropdown_cfiRatio");
const detailsDiv_cfiRatio = document.getElementById("details_cfiRatio");
const arrowIcon_cfiRatio = document.getElementById("arrow_cfiRatio");

toggleDetails(dropdownButton_cfiRatio, detailsDiv_cfiRatio, arrowIcon_cfiRatio);

const dropdownButton_primaryReserveRatio = document.getElementById(
  "dropdown_primaryReserveRatio"
);
const detailsDiv_primaryReserveRatio = document.getElementById(
  "details_primaryReserveRatio"
);
const arrowIcon_primaryReserveRatio = document.getElementById(
  "arrow_primaryReserveRatio"
);

toggleDetails(
  dropdownButton_primaryReserveRatio,
  detailsDiv_primaryReserveRatio,
  arrowIcon_primaryReserveRatio
);

const dropdownButton_cfiNetIncomeOperationsRatio = document.getElementById(
  "dropdown_cfiNetIncomeOperationsRatio"
);
const detailsDiv_cfiNetIncomeOperationsRatio = document.getElementById(
  "details_cfiNetIncomeOperationsRatio"
);
const arrowIcon_cfiNetIncomeOperationsRatio = document.getElementById(
  "arrow_cfiNetIncomeOperationsRatio"
);

toggleDetails(
  dropdownButton_cfiNetIncomeOperationsRatio,
  detailsDiv_cfiNetIncomeOperationsRatio,
  arrowIcon_cfiNetIncomeOperationsRatio
);

const dropdownButton_returnOnNetAssets = document.getElementById(
  "dropdown_returnOnNetAssets"
);
const detailsDiv_returnOnNetAssets = document.getElementById(
  "details_returnOnNetAssets"
);
const arrowIcon_returnOnNetAssets = document.getElementById(
  "arrow_returnOnNetAssets"
);

toggleDetails(
  dropdownButton_returnOnNetAssets,
  detailsDiv_returnOnNetAssets,
  arrowIcon_returnOnNetAssets
);

const dropdownButton_cfiViabilityRatio = document.getElementById(
  "dropdown_cfiViabilityRatio"
);
const detailsDiv_cfiViabilityRatio = document.getElementById(
  "details_cfiViabilityRatio"
);
const arrowIcon_cfiViabilityRatio = document.getElementById(
  "arrow_cfiViabilityRatio"
);

toggleDetails(
  dropdownButton_cfiViabilityRatio,
  detailsDiv_cfiViabilityRatio,
  arrowIcon_cfiViabilityRatio
);

// FINANCIAL ANALYSIS
const displayFinancialAnalysisContentComponent = () => {
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

  const soiClientChart = new ApexCharts(
    document.querySelector("#sourceOfIncomeClient_chart"),
    getSoiClientChartOptions(parseData)
  );
  soiClientChart.render();
  document.addEventListener("dark-mode", function () {
    soiClientChart.updateOptions(getSoiClientChartOptions(parseData));
  });

  const soiPeerChart = new ApexCharts(
    document.querySelector("#sourceOfIncomePeer_chart"),
    getSoiPeerChartOptions(parseData)
  );
  soiPeerChart.render();
  document.addEventListener("dark-mode", function () {
    soiPeerChart.updateOptions(getSoiPeerChartOptions(parseData));
  });

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

const dropdownButton_sourceOfIncome = document.getElementById(
  "dropdown_sourceOfIncome"
);
const detailsDiv_sourceOfIncome = document.getElementById(
  "details_sourceOfIncome"
);
const arrowIcon_sourceOfIncome = document.getElementById(
  "arrow_sourceOfIncome"
);

toggleDetails(
  dropdownButton_sourceOfIncome,
  detailsDiv_sourceOfIncome,
  arrowIcon_sourceOfIncome
);

const dropdownButton_ffa = document.getElementById("dropdown_ffa");
const detailsDiv_ffa = document.getElementById("details_ffa");
const arrowIcon_ffa = document.getElementById("arrow_ffa");

toggleDetails(dropdownButton_ffa, detailsDiv_ffa, arrowIcon_ffa);

// FINANCIAL STATEMENT
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
};
