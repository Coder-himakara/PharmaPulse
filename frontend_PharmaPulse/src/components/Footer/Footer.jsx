/* eslint-disable prettier/prettier */
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import logo from "../../assets/Logo.jpg";

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const isVisible = true; // Assuming isVisible is defined for demonstration

  return (
    <footer
      className={`${
        isDarkMode
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800"
      } w-full transition-all duration-500 z-50 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="py-2 mx-auto text-center">
        <div
          className={`max-w-10xl mx-auto flex flex-wrap items-center justify-center gap-2 px-2 py-1 text-2xs`}
        >
          {/* Logo and Title */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-4 mr-1"
            />
            <span className="font-medium uppercase text-2xs whitespace-nowrap text-neutral-800 dark:text-neutral-200">
              PharmaPulse
            </span>
          </div>

          <span className="mx-1 text-neutral-400">•</span>

          {/* Developed By */}
          <div className="flex items-center">
            <span className="text-2xs text-neutral-500 dark:text-neutral-400">
              Developed By: 
            </span>
            <span className={`ml-1 text-2xs ${
              isDarkMode ? "text-green-300" : "text-green-700"
            }`}>
              Team PharmaPulse
            </span>
            <span className="ml-2">A&K Agencies</span>
          </div>

          <span className="mx-1 text-neutral-400">•</span>

          {/* Copyright */}
          <div className="text-2xs">
            <span className="text-neutral-800 dark:text-neutral-200">
              © {new Date().getFullYear()}
            </span>
            <span className="ml-1 text-neutral-500 dark:text-neutral-400">
             All Rights Reserved
            </span>
        
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;