const displayEnrollmentComponent = () => {
  const savedData = getStoredData();
  const parseData = parseStoredData(savedData);

  let chartComponents = '';
  let modalComponents = '';

  // Call createAndAppendComponent for the first chart/modal
  ({ chartComponents, modalComponents } = createAndAppendComponent(
    'studentsMain_chart',
    'studentsMain_modal',
    'Students - Average Enrollment',
    chartComponents,
    modalComponents,
    parseData, 
    'studentAverageEnrollment_Client',
    'studentAverageEnrollment_Peer'
  ));

  // Combine chart components into the final component string
  const chartComponent = `
    <div class='mb-4'>
      ${chartComponents}
    </div>
  `;

  document.querySelector('main').innerHTML = chartComponent;

  createEventListenersForModal('studentsMain')

  createChartFromParsedData(
    parseData,
    'studentsMain_chart',
    'studentAverageEnrollment_Peer',
    'studentAverageEnrollment_Client',
    'number',
    0
  );

  closeSidebarAfterSelectingOption('enrollment');

  // console.log(modalComponents)

  // Append modal components to the body
  appendModalsToBody(modalComponents);
};