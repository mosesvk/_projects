// src/components/header/Header.jsx
import UpperHeader from './UpperHeader';
import LowerHeader from './LowerHeader';

function Header() {
  // TODO: Add state/logic to handle fixed positioning/scroll behavior if needed
  return (
    <nav
      id="nav"
      className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="px-3 py-3 lg:px-5 lg:pl-3 flex flex-col">
        <UpperHeader />
        <LowerHeader />
      </div>
    </nav>
  );
}

export default Header;