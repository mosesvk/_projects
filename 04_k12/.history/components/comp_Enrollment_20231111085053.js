const displayEnrollmentComponent = () => {
  const savedData = localStorage.getItem('enrollmentData');
  const selectedYears = getSelectedYearsFromLocalStorage();

  let chartComponents = ''; // Initialize an empty string for chart components
  let modalComponents = ''; // Initialize an empty string for modal components

  createDivChartandModal(
    'studentMain_chart',
    'studentMain_modal',
    'Students - Average Enrollment',
    chartComponents,
    modalComponents
  );

  const chartComponentscomponent = `
    <div class='mb-4'>
      ${chartComponents}
      ${modalComponents}
    </div>
  `;

  if (savedData && selectedYears) {
    const parsedData = JSON.parse(savedData);
    createChart(
      'studentsMain_chart',
      parsedData.studentAverageEnrollment_Peer,
      parsedData.studentAverageEnrollment_Client
    );
  }

  closeSidebarAfterSelectingOption('enrollment');
};
