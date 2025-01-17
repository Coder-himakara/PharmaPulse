import { useState } from "react";
import { FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import logo from "../../assets/Logo.jpg";

const Navbar = () => {
  // State to manage dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center bg-[#1a5353] p-4 text-white fixed top-0 left-0 w-full z-10 h-[100px]">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-[40px] mr-9 ml-9" />
        <span className="text-lg font-bold">Home</span>
      </div>

      <div className="flex items-center gap-2 relative mr-9">
        <div>
          <span className="text-sm font-bold">John Doe</span>
          <br />
          <span className="text-xs italic">Admin</span>
        </div>
        <div className="relative ml-4">
          <button
            onClick={toggleDropdown}
            className="bg-transparent border-none text-white text-base cursor-pointer flex items-center hover:text-[#c3e4e5]"
          >
            ▼
          </button>
          {/* Show dropdown if isDropdownVisible is true */}
          {isDropdownVisible && (
            <div className="absolute top-full right-0 bg-white text-[#333] border border-[#ddd] rounded-md min-w-[150px] shadow-lg z-10">
              <a
                href="#dashboard"
                className="flex items-center p-2 text-sm text-[#333] hover:bg-[#f1f1f1]"
              >
                <FaTachometerAlt className="w-5 h-5 mr-2" />
                Dashboard
              </a>
              <a
                href="#profile"
                className="flex items-center p-2 text-sm text-[#333] hover:bg-[#f1f1f1]"
              >
                <FaUser className="w-5 h-5 mr-2" />
                Profile
              </a>
              <a
                href="#logout"
                className="flex items-center p-2 text-sm text-[#333] hover:bg-[#f1f1f1]"
              >
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                Log Out
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
