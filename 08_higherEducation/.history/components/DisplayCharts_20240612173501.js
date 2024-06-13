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
    0,
    'cfiRatio'
  );
  
  // primaryReserveRatio
  createChartFromParsedData (
    parseData,
    'primaryReserveRatio_chart',
    'primaryReserveRatio_Peer',
    'primaryReserveRatio_Client',
    'number',
    0,
    'primaryReserveRatio'
  );
  
  // cfiNetIncomeOperationsRatio
  createChartFromParsedData (
    parseData,
    'cfiNetIncomeOperationsRatio_chart',
    'cfiNetIncomeOperationsRatio_Peer',
    'cfiNetIncomeOperationsRatio_Client',
    'number',
    0,
    'cfiNetIncomeOperationsRatio'
  );

  // cfiReturnOnNetAssets
  createChartFromParsedData (
    parseData,
    'cfiReturnOnNetAssets_chart',
    'cfiReturnOnNetAssets_Peer',
    'cfiReturnOnNetAssets_Client',
    'number',
    0,
    'cfiReturnOnNetAssets'
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
