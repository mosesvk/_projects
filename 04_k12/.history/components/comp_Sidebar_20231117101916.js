// comp_Sidebar.js
document.addEventListener("DOMContentLoaded", function () {
  // Get all button elements
  var buttons = document.querySelectorAll("button[id$='Link']");

  // Get all tab content elements
  var tabContents = document.querySelectorAll(".tab-content");

  // Add click event listener to each button
  buttons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      // Hide all tab contents
      tabContents.forEach(function (content) {
        content.classList.add("hidden");
      });

      // Show the corresponding tab content based on the button index
      tabContents[index].classList.remove("hidden");
    });
  });
});
