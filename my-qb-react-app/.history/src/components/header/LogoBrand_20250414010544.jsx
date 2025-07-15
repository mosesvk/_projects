// src/components/header/LogoBrand.jsx
import logo from '../../assets/react.svg'; // Make sure logo exists

function LogoBrand() {
  return (
    <div className="flex ml-2">
      <img
        src={logo} // Use imported logo
        className="h-10 mr-3"
        alt="Capin Crouse Logo" // Add descriptive alt text
      />
      <span className="self-center text-3xl font-semibold whitespace-nowrap">
        Higher Education
      </span>
    </div>
  );
}

export default LogoBrand;