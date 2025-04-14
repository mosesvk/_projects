// src/components/header/LowerHeader.jsx
import SidebarToggle from './SidebarToggle';
import NavOptions from './NavOptions';
import ThemeToggle from './ThemeToggle';

function LowerHeader() {
  return (
    <div className="flex items-center justify-between">
      <SidebarToggle />
      <NavOptions />
      <ThemeToggle />
    </div>
  );
}

export default LowerHeader;