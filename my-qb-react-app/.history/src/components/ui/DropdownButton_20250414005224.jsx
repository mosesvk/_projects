// src/components/ui/DropdownButton.jsx
import { ChevronDownIcon } from './SvgIcons';

// Placeholder - Needs state/logic for dropdown visibility and options
function DropdownButton({ buttonId, buttonText, optionsId }) {
  // TODO: Add state for dropdown visibility
  // TODO: Add event handlers (onClick for button, onBlur, etc.)
  // TODO: Populate options list dynamically later

  return (
    <div className="relative"> {/* Added relative positioning for dropdown */}
      <button
        id={buttonId}
        className="text-sm mr-3 backgroundBlue font-semibold w-34 h-10 justify-center items-center rounded transition transform text-white dark:text-white hover:scale-105 hover:shadow-md hover:shadow-blue-300 opacity-75 hover:opacity-100 cursor:pointer"
        // Add onClick handler later
      >
        <div className="flex items-center justify-between dark:text-white px-3">
          <div className="px-2">{buttonText}</div>
          <ChevronDownIcon />
        </div>
      </button>
      {/* Dropdown List - visibility controlled by state */}
      <div
        id={optionsId}
        // className should be dynamic based on state, removing 'invisible'
        className="text-xl absolute left-0 top-full z-10 mt-2 w-fit colorBlue dark:text-gray-200 bg-white border shadow-2xl rounded-lg dark:border-gray-600 border-gray-300 dark:bg-gray-800 dark:shadow-md dark:shadow-capinGrey overflow-y-auto h-fit max-h-96 py-4 invisible" // Added top-full, max-h-96
      >
        {/* Options will be mapped here */}
        <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Option 1</div>
        <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Option 2</div>
      </div>
    </div>
  );
}

export default DropdownButton;