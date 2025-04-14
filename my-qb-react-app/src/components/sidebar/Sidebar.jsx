// src/components/sidebar/Sidebar.jsx
import SidebarNav from './SidebarNav';

function Sidebar() {
  // TODO: Add state/logic for sidebar visibility (controlled by SidebarToggle in Header)
  // Classes like 'hidden', 'lg:flex', 'w-64' will need to be dynamic based on state
  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full pt-28 font-normal duration-75 lg:flex transition-width" // Removed explicit ease-in-out, Tailwind handles transitions
      // Add dynamic classes here based on visibility state
    >
      <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 pt-4 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <SidebarNav />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;