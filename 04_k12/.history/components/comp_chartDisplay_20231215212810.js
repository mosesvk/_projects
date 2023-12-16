const displayEnrollmentComponent = () => {
  // console.log('displayEnrollmentComponent()');

  const savedData = getStoredData('enrollmentData');
  const parseData = parseStoredData(savedData);

  // studentAverageEnrollment
  createChartFromParsedData(
    parseData,
    'studentAverageEnrollment_chart',
    'studentAverageEnrollment_Peer',
    'studentAverageEnrollment_Client',
    'number',
    0,
    'studentAverageEnrollment'
  );
  // studentFacilityRatio
  createChartFromParsedData(
    parseData,
    'studentFacilityRatio_chart',
    'studentFacilityRatio_Peer',
    'studentFacilityRatio_Client',
    'number',
    1,
    'studentFacilityRatio'
  );

  closeSidebarAfterSelectingOption('enrollment');
};

const displayCashComponent = () => {
  const savedData = getStoredData('cashData');
  const parseData = parseStoredData(savedData);

  // expendableReserves_inDays
  createChartFromParsedData(
    parseData,
    'expendableReserves_inDays_chart',
    'expendableReserves_inDays_Peer',
    'expendableReserves_inDays_Client',
    'number',
    0,
    'expendableReserves_inDays'
  );

  // expendableReserves_Percent
  createChartFromParsedData(
    parseData,
    'expendableReserves_Percent_chart',
    'expendableReserves_Percent_Peer',
    'expendableReserves_Percent_Client',
    'percent',
    0,
    'expendableReserves_Percent'
  );

  // liquidityRatio
  createChartFromParsedData(
    parseData,
    'liquidityRatio_chart',
    'liquidityRatio_Peer',
    'liquidityRatio_Client',
    'number',
    1,
    'liquidityRatio'
  );

  closeSidebarAfterSelectingOption('cash');
};

const displayAssetComponent = () => {
  const savedData = getStoredData('assetData');
  const parseData = parseStoredData(savedData);

    // currentRatio
    createChartFromParsedData(
      parseData,
      'currentRatio_chart',
      'currentRatio_Peer',
      'currentRatio_Client',
      'number',
      1,
      'currentRatio'
    );

  closeSidebarAfterSelectingOption('asset');

}

const displayDebtComponent = () => {
  const savedData = getStoredData('debtData');
  const parseData = parseStoredData(savedData);

  // netTuitionARasPeÏrcentCurrentAssets
  createChartFromParsedData(
    parseData,
    'netTuitionARasPeÏrcentCurrentAssets_chart',
    'netTuitionARasPeÏrcentCurrentAssets_Peer',
    'netTuitionARasPeÏrcentCurrentAssets_Client',
    'number',
    1,
    'netTuitionARasPeÏrcentCurrentAssets'
  );

  closeSidebarAfterSelectingOption('debt');

}
