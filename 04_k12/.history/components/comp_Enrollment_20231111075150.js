


const displayEnrollmentComponent = () => {
  const component = (`
    <div class='mb-4'>
    </div>
  `);

  const modal_studentAverageEnrollment = createDivChart_andModal('')
  
  document.querySelector('main').innerHTML = component;

  const savedData = localStorage.getItem('enrollmentData');
  const selectedYears = getSelectedYearsFromLocalStorage();

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
