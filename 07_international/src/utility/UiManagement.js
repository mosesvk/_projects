if (sidebar) {
  const toggleSidebarWidth = (sidebar) => {
    sidebar.classList.toggle("w-56");
    sidebar.classList.toggle("w-14");
    // Toggle ml-64 and ml-14 classes on main-content
    mainContent.classList.toggle("ml-56");
    mainContent.classList.toggle("ml-14");

  };

  const toggleListItemsPadding = () => {
    const sidebarListItems = document.querySelectorAll("#sidebar li button");
    sidebarListItems.forEach((item) => {
      item.classList.toggle("p-2");
      item.classList.toggle("py-2");
      item.classList.toggle("pl-1");
    });
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
    togglePopoverVisibility(); // Toggle visibility of popover divs

    // toggleListItemsPadding(); // Toggle padding on sidebar list items
  };

  // Function to toggle the "hidden" class for popover divs
  const togglePopoverVisibility = () => {
    const popoverDivs = document.querySelectorAll("div[id^='popover']");
    popoverDivs.forEach((popoverDiv) => {
      popoverDiv.classList.toggle("hidden");
    });
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
      
      // Scroll to top when switching tabs (smooth scroll)
      const scrollToTop = () => {
        // Scroll main-content container (primary scrollable element) - smooth only
        if (mainContent) {
          mainContent.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        
        // Fallback: scroll window - smooth only
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      };
      
      // Scroll immediately with smooth animation
      scrollToTop();
      
      // Also scroll after a delay to catch any DOM updates or async content
      requestAnimationFrame(() => {
        setTimeout(scrollToTop, 50);
      });
    });
  });

  toggleSidebarMobileClose.addEventListener("click", () => {
    handleSidebarButtonClick(); // Toggle sidebar width and main content margin-left
  });
  toggleSidebarMobileHamburger.addEventListener("click", handleSidebarButtonClick);
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

// if (userThemePreference === "dark") {
//   document.documentElement.classList.add("dark");
//   themeToggleDarkIcon.classList.add("hidden");
//   themeToggleLightIcon.classList.remove("hidden");
// } else if (userThemePreference === "light") {
//   document.documentElement.classList.remove("dark");
//   themeToggleDarkIcon.classList.remove("hidden");
//   themeToggleLightIcon.classList.add("hidden");
// } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
//   // Use system preference if no user preference is set
//   document.documentElement.classList.add("dark");
//   themeToggleDarkIcon.classList.add("hidden");
//   themeToggleLightIcon.classList.remove("hidden");
// } else {
//   document.documentElement.classList.remove("dark");
//   themeToggleDarkIcon.classList.remove("hidden");
//   themeToggleLightIcon.classList.add("hidden");
// }

// Add click event listener to toggle button
themeToggleBtn.addEventListener("click", toggleTheme);
