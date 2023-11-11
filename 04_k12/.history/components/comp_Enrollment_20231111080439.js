
const displayEnrollmentComponent = () => {
  const savedData = localStorage.getItem('enrollmentData');
  const selectedYears = getSelectedYearsFromLocalStorage();

  const component = (`
    <div class='mb-4'>
    </div>
  `);

  const modal_studentAverageEnrollment = createDivChart_andModal('studentMain_chart', 'studentMain_modal', 'Students - Average Enrollment', component)

  document.querySelector('main').innerHTML = component;



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
