const displayEnrollmentComponent = () => {
  console.log('displayEnrollmentComponent()');

  const savedData = getStoredData();
  const parseData = parseStoredData(savedData);

  console.log(parseData);

  createChartFromParsedData(
    parseData,
    'studentAverageEnrollment_chart',
    'studentsAverageEnrollment_Peer',
    'studentsAverageEnrollment_Client',
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
    'studentFacilityRatio'
  );

  closeSidebarAfterSelectingOption('enrollment');

};
