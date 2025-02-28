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
      } 
      p-4 w-full box-border flex items-center z-50 h-[70px] 
      relative md:fixed bottom-0 left-0`}
    >
      <div
        className="flex flex-col items-center justify-between w-full px-4 mx-auto max-w-7xl md:flex-row sm:px-6 lg:px-8"
      >
        {/* Left Section - Logo */}
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <img src={logo} alt="Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14" />
          <span className="text-xs font-semibold sm:text-sm md:text-base lg:text-lg xl:text-xl whitespace-nowrap">
            PharmaPulse
          </span>
        </div>

        {/* Center Section - Copyright */}
        <div className="mt-2 text-xs font-medium text-center sm:text-sm md:text-base lg:text-lg xl:text-lg md:mt-0">
          © {new Date().getFullYear()} A & K Agencies PharmaPulse.  
          <span className="block md:inline"> All Rights Reserved.</span>
        </div>

        {/* Right Section - Developed By */}
        <div className="flex items-center justify-center gap-2 mt-2 md:justify-end md:mt-0">
          <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg">Developed by:</span>
          <span
            className={`font-semibold ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            Team PharmaPulse
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
