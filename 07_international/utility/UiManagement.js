if (sidebar) {
    const toggleSidebarMobile = (
      sidebar,
      sidebarBackdrop,
      toggleSidebarMobileHamburger,
      toggleSidebarMobileClose
    ) => {
      sidebar.classList.toggle("hidden");
      sidebarBackdrop.classList.toggle("hidden");
      toggleSidebarMobileHamburger.classList.toggle("hidden");
      toggleSidebarMobileClose.classList.toggle("hidden");
    };
  
    const sidebar = document.getElementById("sidebar");
    // console.log("sidebar", sidebar);
  
  
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");
    const toggleSidebarMobileHamburger = document.getElementById(
      "toggleSidebarMobileHamburger"
    );
    const toggleSidebarMobileClose = document.getElementById(
      "toggleSidebarMobileClose"
    );
    const sidebarButtons = document.querySelectorAll("button[id$='Link']");
  
    const tabContents = document.querySelectorAll(".tab-content");
  
    const handleSidebarButtonClick = () => {
      toggleSidebarMobile(
        sidebar,
        sidebarBackdrop,
        toggleSidebarMobileHamburger,
        toggleSidebarMobileClose
      );
    };
  
    const activateButton = (clickedIndex) => {
      sidebarButtons.forEach((button, index) => {
        if (index === clickedIndex) {
          button.classList.add("active"); // Add a class to the clicked button
        } else {
          button.classList.remove("active"); // Remove the class from other buttons
        }
      });
    };
  
    toggleSidebarMobileHamburger.addEventListener(
      "click",
      handleSidebarButtonClick
    );
    toggleSidebarMobileClose.addEventListener("click", handleSidebarButtonClick);
    sidebarBackdrop.addEventListener("click", handleSidebarButtonClick);
  
    sidebarButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        // Hide all tab contents
        tabContents.forEach((content) => {
          content.classList.add("hidden");
        });
  
        // Show the corresponding tab content based on the button index
        tabContents[index].classList.remove("hidden");
  
        // Activate the clicked button
        activateButton(index);
  
        // Hide the sidebar and backdrop
        sidebar.classList.add("hidden");
        sidebarBackdrop.classList.add("hidden");
  
        // Update the toggleSidebarMobile icon
        toggleSidebarMobileHamburger.classList.remove("hidden");
        toggleSidebarMobileClose.classList.add("hidden");
      });
    });
  }
  
  // DARK MODE FUNCTIONALITY
  const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
  const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
  const themeToggleBtn = document.getElementById("theme-toggle");
  
  // Function to toggle the theme
  function toggleTheme() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      themeToggleDarkIcon.classList.remove("hidden");
      themeToggleLightIcon.classList.add("hidden");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      themeToggleDarkIcon.classList.add("hidden");
      themeToggleLightIcon.classList.remove("hidden");
    }
  
    document.dispatchEvent(new Event("dark-mode"));
  }
  
  // Check if the user's preference is stored in local storage
  const userThemePreference = localStorage.getItem("color-theme");
  
  if (userThemePreference === "dark") {
    document.documentElement.classList.add("dark");
    themeToggleDarkIcon.classList.add("hidden");
    themeToggleLightIcon.classList.remove("hidden");
  } else if (userThemePreference === "light") {
    document.documentElement.classList.remove("dark");
    themeToggleDarkIcon.classList.remove("hidden");
    themeToggleLightIcon.classList.add("hidden");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // Use system preference if no user preference is set
    document.documentElement.classList.add("dark");
    themeToggleDarkIcon.classList.add("hidden");
    themeToggleLightIcon.classList.remove("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    themeToggleDarkIcon.classList.remove("hidden");
    themeToggleLightIcon.classList.add("hidden");
  }
  
  // Add click event listener to toggle button
  themeToggleBtn.addEventListener("click", toggleTheme);
  