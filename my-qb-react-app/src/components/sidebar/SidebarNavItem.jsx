// src/components/sidebar/SidebarNavItem.jsx

function SidebarNavItem({ IconComponent, label, isActive = false }) {
    // TODO: Handle popover logic
    // TODO: Handle active state styling
    const activeClasses = isActive ? 'bg-gray-300 dark:bg-gray-700' : '';
  
    return (
      <li>
        <button
          // id={...} // Maybe pass ID as prop if needed
          // data-popover-target={...} // Handle popover logic in React
          // data-popover-trigger="hover"
          // data-popover-placement="right"
          type="button" // Good practice for buttons not submitting forms
          className={`flex items-center w-full py-2 pl-1 text-black transition duration-75 rounded-lg group hover:bg-gray-300 dark:text-white dark:hover:bg-gray-700 ${activeClasses}`}
        >
          <IconComponent />
          <span
            className="flex-1 ml-4 text-left text-lg font-semibold tracking-wide whitespace-nowrap"
            // sidebar-toggle-item="" // This attribute might be for specific JS, remove or handle in React state
          >
            {label}
          </span>
        </button>
         {/* Popover structure - will need React state/library later */}
         {/* <div data-popover id={`popover-${label.toLowerCase()}-hover`} ...> ... </div> */}
      </li>
    );
  }
  
  export default SidebarNavItem;