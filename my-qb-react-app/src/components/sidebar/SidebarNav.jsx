// src/components/sidebar/SidebarNav.jsx
import SidebarNavItem from './SidebarNavItem';
import {
    CfiIcon, DoeIcon, FinancialStatementIcon, FinancialPositionIcon,
    RevenueExpenseIcon, DebtEndowmentIcon
} from '../ui/SvgIcons';

function SidebarNav() {
  // TODO: Manage active link state
  return (
    <ul className="pb-2 space-y-2">
      <SidebarNavItem IconComponent={CfiIcon} label="CFI" isActive={true} /> {/* Example active state */}
      <hr className="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />
      <SidebarNavItem IconComponent={DoeIcon} label="DOE" />
      <hr className="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />
      <SidebarNavItem IconComponent={FinancialStatementIcon} label="Financial Statement" />
      <hr className="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />
      <SidebarNavItem IconComponent={FinancialPositionIcon} label="Financial Position" />
       <hr className="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />
      <SidebarNavItem IconComponent={RevenueExpenseIcon} label="Revenue & Expense" />
       <hr className="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />
      <SidebarNavItem IconComponent={DebtEndowmentIcon} label="Debt & Endowment" />
    </ul>
  );
}

export default SidebarNav;