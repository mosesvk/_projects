displayCfiComponent = data => {
  // console.log('displayCfiComponent()');
  const savedData = getStoredData ('cfiData');
  const parseData = parseStoredData (savedData);

  // cfiRatio
  createChartFromParsedData (
    parseData,
    'cfiRatio_chart',
    'cfiRatio_peerAverage_Peer',
    'cfiRatio_Client',
    'number',
    1,
    'cfiRatio'
  );

  // cfi_primaryReserveRatio
  createChartFromParsedData (
    parseData,
    'cfi_primaryReserveRatio_chart',
    'cfi_primaryReserveRatio_peerAverage_Peer',
    'cfi_primaryReserveRatio_Client',
    'percent',
    2,
    'cfi_primaryReserveRatio',
    0.4
  );

  // cfi_netIncomeOperationsRatio
  createChartFromParsedData (
    parseData,
    'cfi_netIncomeOperationsRatio_chart',
    'cfi_netIncomeOperationsRatio_peerAverage_Peer',
    'cfi_netIncomeOperationsRatio_Client',
    'num',
    1,
    'cfi_netIncomeOperationsRatio'
  );

  // cfi_returnOnNetAssets
  createChartFromParsedData (
    parseData,
    'cfi_returnOnNetAssets_chart',
    'cfi_returnOnNetAssets_peerAverage_Peer',
    'cfi_returnOnNetAssets_Client',
    'num',
    1,
    'cfi_returnOnNetAssets'
  );

  // cfi_viabilityRatio
  createChartFromParsedData (
    parseData,
    'cfi_viabilityRatio_chart',
    'cfi_viabilityRatio_peerAverage_Peer',
    'cfi_viabilityRatio_Client',
    'num',
    2,
    'cfi_viabilityRatio'
  );
};

const dropdownButton_cfiRatio = document.getElementById ('dropdown_cfiRatio');
const detailsDiv_cfiRatio = document.getElementById ('details_cfiRatio');
const arrowIcon_cfiRatio = document.getElementById ('arrow_cfiRatio');

toggleDetails (
  dropdownButton_cfiRatio,
  detailsDiv_cfiRatio,
  arrowIcon_cfiRatio
);

const dropdownButton_primaryReserveRatio = document.getElementById (
  'dropdown_primaryReserveRatio'
);
const detailsDiv_primaryReserveRatio = document.getElementById (
  'details_primaryReserveRatio'
);
const arrowIcon_primaryReserveRatio = document.getElementById (
  'arrow_primaryReserveRatio'
);

toggleDetails (
  dropdownButton_primaryReserveRatio,
  detailsDiv_primaryReserveRatio,
  arrowIcon_primaryReserveRatio
);

const dropdownButton_cfiNetIncomeOperationsRatio = document.getElementById (
  'dropdown_cfiNetIncomeOperationsRatio'
);
const detailsDiv_cfiNetIncomeOperationsRatio = document.getElementById (
  'details_cfiNetIncomeOperationsRatio'
);
const arrowIcon_cfiNetIncomeOperationsRatio = document.getElementById (
  'arrow_cfiNetIncomeOperationsRatio'
);

toggleDetails (
  dropdownButton_cfiNetIncomeOperationsRatio,
  detailsDiv_cfiNetIncomeOperationsRatio,
  arrowIcon_cfiNetIncomeOperationsRatio
);

const dropdownButton_returnOnNetAssets = document.getElementById (
  'dropdown_returnOnNetAssets'
);
const detailsDiv_returnOnNetAssets = document.getElementById (
  'details_returnOnNetAssets'
);
const arrowIcon_returnOnNetAssets = document.getElementById (
  'arrow_returnOnNetAssets'
);

toggleDetails (
  dropdownButton_returnOnNetAssets,
  detailsDiv_returnOnNetAssets,
  arrowIcon_returnOnNetAssets
);

const dropdownButton_cfiViabilityRatio = document.getElementById (
  'dropdown_cfiViabilityRatio'
);
const detailsDiv_cfiViabilityRatio = document.getElementById (
  'details_cfiViabilityRatio'
);
const arrowIcon_cfiViabilityRatio = document.getElementById (
  'arrow_cfiViabilityRatio'
);

toggleDetails (
  dropdownButton_cfiViabilityRatio,
  detailsDiv_cfiViabilityRatio,
  arrowIcon_cfiViabilityRatio
);

const displayFinancialAnalysisContentComponent = () => {
  const savedData = getStoredData ('financialAnalysisContentData');
  const parseData = parseStoredData (savedData);

  const fpaChart = new ApexCharts (
    document.querySelector ('#FinancialAnalysisContent_chart'),
    getFpaChartOptions (parseData)
  );
  fpaChart.render ();
  document.addEventListener ('dark-mode', function () {
    fpaChart.updateOptions (getFpaChartOptions (parseData));
  });

  const atlChart = new ApexCharts (
    document.querySelector ('#assetToLiabilities_chart'),
    getAtlChartOptions (parseData)
  );
  atlChart.render ();
  document.addEventListener ('dark-mode', function () {
    atlChart.updateOptions (getAtlChartOptions (parseData));
  });

  const soiChart = new ApexCharts (
    document.getElementById ('sourceOfIncomeClient_chart'),
    getSoiClientChartOptions (parseData)
  );
  soiChart.render ();
  document.addEventListener ('dark-mode', function () {
    soiChart.updateOptions (getSoiClientChartOptions (parseData));
  });


};

const dropdownButton_assetToLiabilities = document.getElementById (
  'dropdown_assetToLiabilities'
);
const detailsDiv_assetToLiabilities = document.getElementById (
  'details_assetToLiabilities'
);
const arrowIcon_assetToLiabilities = document.getElementById (
  'arrow_assetToLiabilities'
);

toggleDetails (
  dropdownButton_assetToLiabilities,
  detailsDiv_assetToLiabilities,
  arrowIcon_assetToLiabilities
);

const dropdownButton_sourceOfIncome = document.getElementById (
  'dropdown_sourceOfIncome'
);
const detailsDiv_sourceOfIncome = document.getElementById (
  'details_sourceOfIncome'
);
const arrowIcon_sourceOfIncome = document.getElementById (
  'arrow_sourceOfIncome'
);

toggleDetails (
  dropdownButton_sourceOfIncome,
  detailsDiv_sourceOfIncome,
  arrowIcon_sourceOfIncome
);
