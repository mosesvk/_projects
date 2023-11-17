const displayEnrollmentComponent = () => {

  console.log('displayEnrollmentComponent()');

  const savedData = getStoredData();
  const parseData = parseStoredData(savedData);

  let chartComponents = '';
  let modalComponents = '';

  // Call createAndAppendComponent for the first chart/modal
  createAndAppendComponent(
    'studentsMain_chart',
    'studentsMain_modal',
    'Students - Average Enrollment',
    chartComponents,
    modalComponents,
    parseData, 
    'studentAverageEnrollment_Client',
    'studentAverageEnrollment_Peer',
    'studentsMain', 
    'number'
  )

createAndAppendComponent(
    'studentFacilityRatio_chart',
    'studentFacilityRatio_modal',
    'Student/Facility Ratio',
    chartComponents,
    modalComponents,
    parseData, 
    'studentFacilityRatio_Client',
    'studentFacilityRatio_Peer',
    'studentFacilityRatio', 
    'number'
  )


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


};
