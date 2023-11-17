
if (sidebar) {
    const toggleSidebarMobile = (sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose) => {
        sidebar.classList.toggle('hidden');
        sidebarBackdrop.classList.toggle('hidden');
        toggleSidebarMobileHamburger.classList.toggle('hidden');
        toggleSidebarMobileClose.classList.toggle('hidden');
    }
    
    const toggleSidebarMobileEl = document.getElementById('toggleSidebarMobile');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const toggleSidebarMobileHamburger = document.getElementById('toggleSidebarMobileHamburger');
    
    toggleSidebarMobileEl.addEventListener('click', () => {
        toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });
    
    sidebarBackdrop.addEventListener('click', () => {
        toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });
}

// DARK MODE FUNCTIONALITY
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById(
  'theme-toggle-light-icon'
);
const themeToggleBtn = document.getElementById('theme-toggle');

// Function to toggle the theme
function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
    themeToggleDarkIcon.classList.remove('hidden');
    themeToggleLightIcon.classList.add('hidden');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
    themeToggleDarkIcon.classList.add('hidden');
    themeToggleLightIcon.classList.remove('hidden');
  }

  document.dispatchEvent(new Event('dark-mode'));
}

// Check if the user's preference is stored in local storage
const userThemePreference = localStorage.getItem('color-theme');

if (userThemePreference === 'dark') {
  document.documentElement.classList.add('dark');
  themeToggleDarkIcon.classList.add('hidden');
  themeToggleLightIcon.classList.remove('hidden');
} else if (userThemePreference === 'light') {
  document.documentElement.classList.remove('dark');
  themeToggleDarkIcon.classList.remove('hidden');
  themeToggleLightIcon.classList.add('hidden');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // Use system preference if no user preference is set
  document.documentElement.classList.add('dark');
  themeToggleDarkIcon.classList.add('hidden');
  themeToggleLightIcon.classList.remove('hidden');
} else {
  document.documentElement.classList.remove('dark');
  themeToggleDarkIcon.classList.remove('hidden');
  themeToggleLightIcon.classList.add('hidden');
}

// Add click event listener to toggle button
themeToggleBtn.addEventListener('click', toggleTheme);
