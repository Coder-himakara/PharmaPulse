/* eslint-disable prettier/prettier */
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import logo from "../../assets/Logo.jpg";

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <footer
      className={`${
        isDarkMode
          ? "bg-neutral-600 text-neutral-500"
          : "bg-neutral-300 text-neutral-600"
      } w-full box-border z-50 fixed bottom-0 left-0 right-0`}
    >
      <div className="py-1 mx-auto text-center">
        <div
          className={`max-w-10xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1 sm:p-2 ${
            isDarkMode
              ? "bg-neutral-700"
              : "bg-slate-300"
          }`}
        >
          {/* Logo and Title */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="PharmaPulse Logo"
              className="h-4 mr-1 sm:h-5"
            />
            <span className="text-xs font-bold uppercase whitespace-nowrap text-neutral-800 dark:text-neutral-100">
              PharmaPulse
            </span>
          </div>

          {/* Simple divider */}
          <span className="hidden mx-1 text-neutral-500 sm:inline">|</span>

          {/* Developed By */}
          <div className="flex items-center">
            <span className="mr-1 text-xs text-neutral-500 dark:text-neutral-300">
              Developed by:
            </span>
            <span className={`text-xs font-medium ${
              isDarkMode
                ? "text-green-300"
                : "text-green-700"
            }`}>
              Team PharmaPulse
            </span>
          </div>

          {/* Simple divider */}
          <span className="hidden mx-1 text-neutral-500 sm:inline">|</span>

          {/* Copyright */}
          <div className="text-xs">
            <span className="text-neutral-800 dark:text-neutral-100">
              © {new Date().getFullYear()} A & K Agencies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;