const displayEnrollmentComponent = () => {
  console.log('displayEnrollmentComponent()');

  const savedData = getStoredData();
  const parseData = parseStoredData(savedData);

  createChartFromParsedData(
    parseData,
    'studentsMain_chart',
    'studentsAverageEnrollment_Peer',
    'studentsAverageEnrollment_Client',
    'number',
    0,
    'studentsMain'
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
