const displayEnrollmentComponent = () => {

  console.log('displayEnrollmentComponent()');

  const savedData = getStoredData();
  const parseData = parseStoredData(savedData);

  let chartComponents = '';
  let modalComponents = '';

  // Call createAndAppendComponent for the first chart/modal
  ({ chartComponents, modalComponents, modalId } = createAndAppendComponent(
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
  ));

  ({ chartComponents, modalComponents, modalId } = createAndAppendComponent(
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
  ));

  // Combine chart components into the final component string
  const chartComponent = `
    <div class='mb-4'>
      ${chartComponents}
    </div>
  `;

  document.querySelector('main').innerHTML = chartComponent;

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
