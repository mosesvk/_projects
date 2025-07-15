// src/components/header/NavOptions.jsx
import DropdownButton from '../ui/DropdownButton';
import { OptionsIcon, RunIcon } from '../ui/SvgIcons';

function NavOptions() {
  // TODO: Add state for toggling between main and FS options
  // TODO: Add logic for 'Other Options' modal
  // TODO: Add onClick handler for 'Run' button

  return (
    <>
      {/* Main Options */}
      <div id="optionsMain" className="flex items-center justify-start">
        <DropdownButton buttonId="custom-select-year" buttonText="Years" optionsId="options-list-year" />
        <DropdownButton buttonId="custom-select-region" buttonText="Regions" optionsId="options-list-region" />
        <DropdownButton buttonId="custom-select-state" buttonText="State" optionsId="options-list-state" />

        <button
          id="custom-select-other"
          // data-modal-target="otherOptions-modal" // Handle modal logic in React
          // data-modal-toggle="otherOptions-modal"
          className="flex items-center text-sm mr-3 backgroundBlue font-semibold py-2 px-4 rounded transition transform text-white dark:text-white hover:scale-105 hover:shadow-md hover:shadow-blue-300 opacity-75 hover:opacity-100 cursor:pointer"
          type="button"
        >
          <span className="mr-2">Options</span>
          <OptionsIcon />
        </button>

        <button
          id="run"
          className="flex items-center mr-3 backgroundGreen font-semibold py-2 px-4 rounded transition transform text-white dark:text-white hover:scale-105 hover:shadow-md hover:shadow-green-300 opacity-75 hover:opacity-100 cursor:pointer" // Changed shadow color
        >
          <span className="mr-2">Run</span>
          <RunIcon />
        </button>
      </div>

      {/* Financial Statement Options (conditionally rendered later) */}
      <div
        id="optionsFinancialStatement"
        className="flex items-center justify-start hidden" // Class 'hidden' controls visibility
      >
         {/* Add Dropdown buttons for BS, IS, CF, P&E similarly */}
         <DropdownButton buttonId="buttonFS-balanceSheet" buttonText="Balance Sheet" optionsId="options-list-balanceSheet" />
         <DropdownButton buttonId="buttonFS-incomeStatement" buttonText="Income Statement" optionsId="options-list-incomeStatement" />
         <DropdownButton buttonId="buttonFS-cashFlows" buttonText="Cash Flows" optionsId="options-list-cashFlows" />
         <DropdownButton buttonId="buttonFS-propertyAndEquipment" buttonText="Property & Equipment" optionsId="options-list-propertyAndEquipment" />
      </div>
    </>
  );
}

export default NavOptions;