const displayEnrollmentComponent = () => {
  const savedData = getStoredData();
  const selectedYears = getSelectedYearsFromLocalStorage();

  let chartComponents = '';
  let modalComponents = '';

  // Call createAndAppendComponent for the first chart/modal
  ({ chartComponents, modalComponents } = createAndAppendComponent(
    'studentMain_chart',
    'studentMain_modal',
    'Students - Average Enrollment',
    chartComponents,
    modalComponents
  ));

  console.log(chartComponents)


  // Combine chart and modal components into the final component string
  const component = `
    <div class='mb-4'>
      ${chartComponents}
      ${modalComponents}
    </div>
  `;

  displayComponent(component);
  createChartFromParsedData(parseStoredData(savedData, studentAverageEnrollment_Peer, studentAverageEnrollment_Client));

  closeSidebarAfterSelectingOption('enrollment');
};
