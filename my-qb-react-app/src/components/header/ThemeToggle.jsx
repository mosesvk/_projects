// src/components/header/ThemeToggle.jsx
import { DarkModeIcon, LightModeIcon } from '../ui/SvgIcons';

function ThemeToggle() {
  // TODO: Add state and onClick handler for theme toggling
  // Will need to add/remove 'dark' class from <html> element

  return (
    <div className="flex items-center justify-start">
      <button
        id="theme-toggle"
        type="button"
        className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
      >
        <DarkModeIcon />
        <LightModeIcon /> {/* One of these will be hidden based on state later */}
      </button>
    </div>
  );
}

export default ThemeToggle;