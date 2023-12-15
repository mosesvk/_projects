const displayEnrollmentComponent = () => {
  // console.log('displayEnrollmentComponent()');

  const savedData = getStoredData('enrollmentData');
  const parseData = parseStoredData(savedData);

  // console.log(parseData);

  // createChartFromParsedData(
  //   parseData,
  //   'studentAverageEnrollment_chart',
  //   'studentAverageEnrollment_Peer',
  //   'studentAverageEnrollment_Client',
  //   'number',
  //   0,
  //   'studentAverageEnrollment'
  // );

  // createChartFromParsedData(
  //   parseData,
  //   'studentFacilityRatio_chart',
  //   'studentFacilityRatio_Peer',
  //   'studentFacilityRatio_Client',
  //   'number',
  //   0,
  //   'studentFacilityRatio'
  // );


  closeSidebarAfterSelectingOption('enrollment');

};
