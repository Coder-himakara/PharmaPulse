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
        className="grid w-full grid-cols-1 gap-2 px-4 mx-auto text-center max-w-7xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 md:flex md:justify-between md:items-center md:text-left tablet:grid-cols-2 tablet:gap-4 tablet:px-6 mobile:grid-cols-1 mobile:gap-2 mobile:px-2"
      >
        {/* Left Section - Logo (Forced to Start at Beginning) */}
        <div className="flex items-center justify-start gap-2 md:flex md:items-center md:justify-start tablet:flex tablet:items-center tablet:justify-start tablet:order-1 mobile:flex mobile:items-center mobile:justify-center mobile:order-1">
          <img src={logo} alt="Logo" className="h-6 sm:h-8 md:h-8 lg:h-8 xl:h-8 tablet:h-7 mobile:h-6" />
          <span className="text-xs font-semibold sm:text-sm md:text-sm lg:text-sm xl:text-sm tablet:text-sm mobile:text-xs whitespace-nowrap">
            PharmaPulse
          </span>
        </div>

        {/* Center Section - Copyright */}
        <div className="text-xs font-medium break-words sm:text-sm md:text-sm lg:text-sm xl:text-sm md:order-2 md:self-center tablet:text-sm tablet:order-2 tablet:self-center mobile:text-xs mobile:order-2 mobile:self-center">
          © {new Date().getFullYear()} A & K Agencies PharmaPulse.
          <span className="block sm:inline md:inline lg:inline xl:inline tablet:block tablet:ml-0 mobile:block mobile:ml-0"> All Rights Reserved.</span>
        </div>

        {/* Right Section - Developed By (Moved to End) */}
        <div className="flex items-center justify-end gap-2 md:flex md:items-center md:justify-end md:order-3 tablet:flex tablet:items-center tablet:justify-end tablet:order-3 mobile:flex mobile:items-center mobile:justify-center mobile:order-3">
          <span className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm tablet:text-sm mobile:text-xs">Developed by:</span>
          <span
            className={`font-semibold ${
              isDarkMode ? "text-green-400" : "text-green-600"
            } text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 
            tablet:text-sm mobile:text-xs`}
          >
            Team PharmaPulse
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;