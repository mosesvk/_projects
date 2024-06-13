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


};

const dropdownButton = document.getElementById('dropdown_cfiRatio');
const detailsDiv = document.getElementById('details_cfiRatio');
const arrowIcon = document.getElementById('arrow_cfiRatio');

toggleDetails(dropdownButton, detailsDiv, arrowIcon);
