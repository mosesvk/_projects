// src/components/header/UpperHeader.jsx
import LogoBrand from './LogoBrand';
import FirmInfo from './FirmInfo';

function UpperHeader() {
  return (
    <div className="mb-4 flex items-center justify-between text-gray-600 dark:text-white relative"> {/* Added relative for FirmInfo positioning context */}
      <LogoBrand />
      <FirmInfo /> {/* Note: Fixed positioning might need adjustment in React layout */}
    </div>
  );
}

export default UpperHeader;