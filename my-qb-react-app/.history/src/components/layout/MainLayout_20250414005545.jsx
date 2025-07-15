// src/components/layout/MainLayout.jsx
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';

function MainLayout({ children }) { // children prop for main content
  // TODO: Add state management for sidebar toggle passed down to Header/Sidebar

  return (
    <>
      <Header />
      <div className="flex pt-28 overflow-hidden bg-gray-50 dark:bg-gray-900"> {/* Adjusted padding-top based on header */}
        <Sidebar />
        {/* Main Content Area */}
        {/* TODO: Add logic for margin-left based on sidebar state */}
        <main id="main-content" className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"> {/* Added lg:ml-64 assuming sidebar is visible */}
          {children} {/* Render child components passed to the layout */}
           <div className="p-4"> {/* Example padding */}
             {/* Placeholder for page content */}
             <h1 className="text-2xl text-gray-900 dark:text-white">Main Content Area</h1>
             <p className="text-gray-600 dark:text-gray-400">Page content goes here...</p>
          </div>
        </main>
      </div>
    </>
  );
}

export default MainLayout;