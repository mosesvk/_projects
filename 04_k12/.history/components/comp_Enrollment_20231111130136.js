const displayEnrollmentComponent = () => {
  const savedData = getStoredData();

  let chartComponents = '';
  let modalComponents = '';

  // Call createAndAppendComponent for the first chart/modal
  ({ chartComponents, modalComponents } = createAndAppendComponent(
    'studentsMain_chart',
    'studentsMain_modal',
    'Students - Average Enrollment',
    chartComponents,
    modalComponents
  ));

  // Combine chart and modal components into the final component string
  const component = `
  <div class='mb-4'>
  ${chartComponents}
  ${modalComponents}
  </div>
  `;

  document.querySelector('main').innerHTML = component;

  createChartFromParsedData(
    parseStoredData(savedData),
    'studentsMain_chart',
    'studentAverageEnrollment_Peer',
    'studentAverageEnrollment_Client', 
    'number', 
    null
  );

  closeSidebarAfterSelectingOption('enrollment');
};
