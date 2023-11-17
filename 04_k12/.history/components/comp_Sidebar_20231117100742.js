

// Add event listeners
document.getElementById('enrollmentButton').addEventListener('click', displayEnrollmentComponent);
document.getElementById('reportButton').addEventListener('click', displayReportComponent);

document.addEventListener("DOMContentLoaded", function () {
  const sidebarButtons = document.querySelectorAll('[sidebar-toggle-item]');

  sidebarButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Get the target content ID from the button's attribute
      const targetContentId = button.getAttribute('sidebar-toggle-item');

      // Hide all content divs
      const allContentDivs = document.querySelectorAll('.tab-content');
      allContentDivs.forEach((contentDiv) => {
        contentDiv.classList.add('hidden');
      });

      // Show the target content div
      const targetContent = document.getElementById(targetContentId);
      targetContent.classList.remove('hidden');
    });
  });
});