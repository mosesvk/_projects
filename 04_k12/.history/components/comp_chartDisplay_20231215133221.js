const displayEnrollmentComponent = () => {
  // console.log('displayEnrollmentComponent()');

  const savedData = getStoredData('enrollmentData');
  const parseData = parseStoredData(savedData);

  // console.log(parseData);

  createChartFromParsedData(
    parseData,
    'studentAverageEnrollment_chart',
    'studentAverageEnrollment_Peer',
    'studentAverageEnrollment_Client',
    'number',
    0,
    'studentAverageEnrollment'
  );

  createChartFromParsedData(
    parseData,
    'studentsFacilityRatio_chart',
    'studentsFacilityRatio_Peer',
    'studentsFacilityRatio_Client',
    'number',
    0,
    'studentsFacilityRatio'
  );


  closeSidebarAfterSelectingOption('enrollment');

};
