<script>
  document.addEventListener("DOMContentLoaded", function () {
    // Get all button elements
    var buttons = document.querySelectorAll("button[id$='Link']");

    // Get all tab content elements
    var tabContents = document.querySelectorAll(".tab-content");

    // Get the sidebar element
    var sidebar = document.querySelector(".flex-1");

    // Add click event listener to each button
    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        // Check if the sidebar is visible in mobile mode
        var isSidebarVisible = window.getComputedStyle(sidebar).getPropertyValue("display") !== "none";

        // If the sidebar is visible in mobile mode, hide it
        if (isSidebarVisible) {
          sidebar.classList.add("hidden");
        }

        // Hide all tab contents
        tabContents.forEach(function (content) {
          content.classList.add("hidden");
        });

        // Show the corresponding tab content based on the button index
        tabContents[index].classList.remove("hidden");
      });
    });
  });
</script>
