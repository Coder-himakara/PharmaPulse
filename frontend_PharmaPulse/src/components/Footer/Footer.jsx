/* eslint-disable prettier/prettier */
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import logo from "../../assets/Logo.jpg";

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <footer
      className={`${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-green-200 text-gray-800"
      } p-4 w-full box-border flex items-center z-50 h-[70px] 
      relative md:fixed bottom-0 left-0`}
    >
      <div className="grid w-full grid-cols-1 gap-2 px-4 mx-auto text-center max-w-7xl md:px-6 md:flex md:justify-between md:items-center md:text-left">
        
        {/* Left Section - Logo */}
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <img src={logo} alt="Logo" className="h-8" />
          <span className="text-sm font-semibold whitespace-nowrap">
            PharmaPulse
          </span>
        </div>

        {/* Center Section - Copyright */}
        <div className="text-sm font-medium break-words">
          &copy; {new Date().getFullYear()} A & K Agencies PharmaPulse. 
          <span className="block md:inline"> All Rights Reserved.</span>
        </div>

        {/* Right Section - Developed By */}
        <div className="flex items-center justify-center gap-2 md:justify-end">
          <span>Developed by:</span>
          <span className={`font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
            Team PharmaPulse
          </span>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
