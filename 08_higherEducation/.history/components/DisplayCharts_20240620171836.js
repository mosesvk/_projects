displayCfiComponent = data => {
  const savedData = getStoredData ('cfiData');
  const parseData = parseStoredData (savedData);

  // cfiRatio
  createChartFromParsedData (
    parseData,
    'cfiRatio_chart',
    'cfiRatio_Peer',
    'cfiRatio_Client',
    'number',
    1,
    'cfiRatio'
  );
  
  // cfi_primaryReserveRatio
  createChartFromParsedData (
    parseData,
    'cfi_primaryReserveRatio_chart',
    'cfi_primaryReserveRatio_Peer',
    'cfi_primaryReserveRatio_Client',
    'percent',
    2,
    'cfi_primaryReserveRatio'
  );
  
  // cfi_netIncomeOperationsRatio
  createChartFromParsedData (
    parseData,
    'cfi_netIncomeOperationsRatio_chart',
    'cfi_netIncomeOperationsRatio_Peer',
    'cfi_netIncomeOperationsRatio_Client',
    'num',
    1,
    'cfi_netIncomeOperationsRatio'
  );

  // cfi_returnOnNetAssets
  createChartFromParsedData (
    parseData,
    'cfi_returnOnNetAssets_chart',
    'cfi_returnOnNetAssets_Peer',
    'cfi_returnOnNetAssets_Client',
    'num',
    1,
    'cfi_returnOnNetAssets'
  );

  // cfi_viabilityRatio
  createChartFromParsedData (
    parseData,
    'cfi_viabilityRatio_chart',
    'cfi_viabilityRatio_Peer',
    'cfi_viabilityRatio_Client',
    'num',
    2,
    'cfi_viabilityRatio'
  );


};

const dropdownButton_cfiRatio = document.getElementById('dropdown_cfiRatio');
const detailsDiv_cfiRatio = document.getElementById('details_cfiRatio');
const arrowIcon_cfiRatio = document.getElementById('arrow_cfiRatio');

toggleDetails(dropdownButton_cfiRatio, detailsDiv_cfiRatio, arrowIcon_cfiRatio);

const dropdownButton_primaryReserveRatio = document.getElementById('dropdown_primaryReserveRatio');
const detailsDiv_primaryReserveRatio = document.getElementById('details_primaryReserveRatio');
const arrowIcon_primaryReserveRatio = document.getElementById('arrow_primaryReserveRatio');

toggleDetails(dropdownButton_primaryReserveRatio, detailsDiv_primaryReserveRatio, arrowIcon_primaryReserveRatio);

const dropdownButton_cfiNetIncomeOperationsRatio = document.getElementById('dropdown_cfiNetIncomeOperationsRatio');
const detailsDiv_cfiNetIncomeOperationsRatio = document.getElementById('details_cfiNetIncomeOperationsRatio');
const arrowIcon_cfiNetIncomeOperationsRatio = document.getElementById('arrow_cfiNetIncomeOperationsRatio');

toggleDetails(dropdownButton_cfiNetIncomeOperationsRatio, detailsDiv_cfiNetIncomeOperationsRatio, arrowIcon_cfiNetIncomeOperationsRatio);

const dropdownButton_cfiReturnOnNetAssets = document.getElementById('dropdown_cfiReturnOnNetAssets');
const detailsDiv_cfiReturnOnNetAssets = document.getElementById('details_cfiReturnOnNetAssets');
const arrowIcon_cfiReturnOnNetAssets = document.getElementById('arrow_cfiReturnOnNetAssets');

toggleDetails(dropdownButton_cfiReturnOnNetAssets, detailsDiv_cfiReturnOnNetAssets, arrowIcon_cfiReturnOnNetAssets);

const dropdownButton_cfiViabilityRatio = document.getElementById('dropdown_cfiViabilityRatio');
const detailsDiv_cfiViabilityRatio = document.getElementById('details_cfiViabilityRatio');
const arrowIcon_cfiViabilityRatio = document.getElementById('arrow_cfiViabilityRatio');

toggleDetails(dropdownButton_cfiViabilityRatio, detailsDiv_cfiViabilityRatio, arrowIcon_cfiViabilityRatio);
