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

  


  closeSidebarAfterSelectingOption('cash');

};
