if (sidebar) {
  const toggleSidebarWidth = (sidebar) => {
    sidebar.classList.toggle("w-56");
    sidebar.classList.toggle("w-14");

    mainContent.classList.toggle("ml-56");
    mainContent.classList.toggle("ml-14");
  };
  
  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const toggleSidebarMobileHamburger = document.getElementById("toggleSidebarMobileHamburger");
  const toggleSidebarMobileClose = document.getElementById("toggleSidebarMobileClose");
  const sidebarButtons = document.querySelectorAll("button[id$='Link']");
  const tabContents = document.querySelectorAll(".tab-content");
  const mainContent = document.getElementById("main-content"); // Get the main content element

  const handleSidebarButtonClick = () => {
    toggleSidebarWidth(sidebar);
  };
  
  const activateButton = (clickedIndex) => {
    sidebarButtons.forEach((button, index) => {
      if (index === clickedIndex) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  };
  
  sidebarButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      tabContents.forEach((content) => {
        content.classList.add("hidden");
      });
      tabContents[index].classList.remove("hidden");
      activateButton(index);
      // handleSidebarButtonClick(); // Toggle sidebar width
    });
  });
  
  toggleSidebarMobileHamburger.addEventListener("click", handleSidebarButtonClick);
  toggleSidebarMobileClose.addEventListener("click", handleSidebarButtonClick);
  sidebarBackdrop.addEventListener("click", handleSidebarButtonClick);
  
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
