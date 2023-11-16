const displayEnrollmentComponent = () => {

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
    'studentAverageEnrollment_Peer'
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

  closeSidebarAfterSelectingOption('enrollment');


  // Append modal components to the body
  appendModalsToBody(modalComponents, modalId);
};



document.body.addEventListener('click', (event) => {
  const target = event.target;

  // Check if the clicked element has the data-modal-recreate attribute
  if (target.matches('[data-modal-recreate]')) {
    const modalId = target.getAttribute('data-modal-recreate');
    
    // Remove the existing modal from the DOM
    const modalElement = document.getElementById(modalId);
    modalElement.parentNode.removeChild(modalElement);

    // Call the function to create and append the modal again
    appendModalsToBody(modalComponents, modalId);
  }
});