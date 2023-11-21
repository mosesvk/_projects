const displayEnrollmentComponent = () => {

  // console.log('displayEnrollmentComponent()');

  const savedData = getStoredData();
  const parseData = parseStoredData(savedData);

  createChartFromParsedData(
    parseData,
    'studentsMain_chart',
    'studentAverageEnrollment_Peer',
    'studentAverageEnrollment_Client',
    'number',
    0
  );

  createChartFromParsedData(
    parseData,
    'studentFacilityRatio_chart',
    'studentFacilityRatio_Peer',
    'studentFacilityRatio_Client',
    'number',
    0
  );

  closeSidebarAfterSelectingOption('enrollment');


    const selectedYears =  getSelectedYearsFromLocalStorage()

    console.log(selectedYears);
};
