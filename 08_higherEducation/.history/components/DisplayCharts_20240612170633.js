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


};

const dropdownButton_cfiRatio = document.getElementById('dropdown_cfiRatio');
const detailsDiv_cfiRatio = document.getElementById('details_cfiRatio');
const arrowIcon_cfiRatio = document.getElementById('arrow_cfiRatio');

toggleDetails(dropdownButton, detailsDiv, arrowIcon);
