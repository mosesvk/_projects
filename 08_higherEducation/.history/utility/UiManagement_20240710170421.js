if (sidebar) {
  const toggleSidebarWidth = (sidebar) => {
    sidebar.classList.toggle("w-64");
    sidebar.classList.toggle("w-14");
    // Toggle ml-64 and ml-14 classes on main-content
    mainContent.classList.toggle("ml-64");
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
  const toggleSidebarMobileHamburger = document.getElementById(
    "toggleSidebarMobileHamburger"
  );
  const sidebarButtons = document.querySelectorAll("button[id$='Link']");
  const tabContents = document.querySelectorAll(".tab-content");
  const mainContent = document.getElementById("main-content"); // Get the main content element

  const handleSidebarButtonClick = () => {
    toggleSidebarWidth(sidebar);
    togglePopoverVisibility(); // Toggle visibility of popover divs
    updatePopoverText(); // Update the text content of the popover
    // toggleListItemsPadding(); // Toggle padding on sidebar list items
  };

  // Function to toggle the "hidden" class for popover divs
  const togglePopoverVisibility = () => {
    const popoverDivs = document.querySelectorAll("div[id^='popover']");
    popoverDivs.forEach((popoverDiv) => {
      if (popoverDiv.id !== "popoverToggleSidebar-hover") {
        popoverDiv.classList.toggle("hidden");
      }
    });
  };

  // Function to update the text content of the popover
  const updatePopoverText = () => {
    const popoverToggleSidebarHover = document.getElementById(
      "popoverToggleSidebar-hover"
    );
    const h3Element = popoverToggleSidebarHover.querySelector("h3");

    // console.log(sidebar.classList)

    if (sidebar.classList.contains("w-14")) {
      h3Element.textContent = "Show Sidebar";
    } else {
      h3Element.textContent = "Minimize Sidebar";
    }

    // console.log(h3Element.textContent);
  };

  updatePopoverText();

  const button = document.getElementById("toggleSidebarMobile");
  const popover = document.getElementById("popoverToggleSidebar-hover");

  button.addEventListener("mouseover", () => {
    popover.classList.remove("hidden", "invisible", "opacity-0");
    popover.classList.add("visible", "opacity-100");
  });

  button.addEventListener("mouseout", () => {
    popover.classList.remove("visible", "opacity-100");
    popover.classList.add("hidden", "invisible", "opacity-0");
  });

  const activateButton = (clickedIndex) => {
    const divMain = document.getElementById("optionsMain");
    const divFinancialStatement = document.getElementById(
      "optionsFinancialStatement"
    );

    if (clickedIndex === 3) {
      // Show financial statement options, hide main options
      divFinancialStatement.classList.remove("hidden");
      divMain.classList.add("hidden");
    } else {
      // Show main options, hide financial statement options
      divMain.classList.remove("hidden");
      divFinancialStatement.classList.add("hidden");
    }

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
      // Removed handleSidebarButtonClick() from here
    });
  });

  toggleSidebarMobileHamburger.addEventListener(
    "click",
    handleSidebarButtonClick
  );
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





// FINANCIAL STATEMENT FUNCTIONALITY
const FSbuttons = document.querySelectorAll('[id^="buttonFS-"]');
const FScontentDivs = document.querySelectorAll('[id$="Content"]');

FSbuttons.forEach(button => {
  button.addEventListener('click', () => {
      const id = button.id.replace('buttonFS-', '');
      const contentDiv = document.getElementById(`${id}Content`);

      FScontentDivs.forEach(div => {
          if (div === contentDiv) {
              div.classList.remove('hidden');
          } else {
              if (!div.classList.contains('hidden')) {
                  div.classList.add('hidden');
              }
          }
      });
  });
});
