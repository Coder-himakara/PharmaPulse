/* eslint-disable prettier/prettier */
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../ThemeContext";
import logo from "../../assets/Logo.jpg";

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(true); // Default to true for short content

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // If content is shorter than or equal to the viewport height, always show footer
      if (documentHeight <= windowHeight) {
        setIsVisible(true);
      } else {
        // For scrollable content, show footer only when scrolled near the bottom
        setIsVisible(scrollPosition >= documentHeight - 50);
      }
    };

    // Check initial state
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  return (
    <footer
      className={`${
        isDarkMode
          ? "bg-neutral-600 text-neutral-200"
          : "bg-neutral-100 text-neutral-600"
      } w-full box-border transition-opacity duration-300 z-50 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="py-8 mx-6 text-center">
        <div
          className={`max-w-10xl mx-auto flex flex-wrap items-center justify-center gap-8 p-6 rounded-lg shadow-md ${
            isDarkMode
              ? "bg-neutral-700 border border-neutral-500"
              : "bg-white border border-neutral-200"
          }`}
        >
          {/* Logo and Title (Emphasized) */}
          <div className="flex items-center transition-transform duration-300 hover:scale-105">
            <img
              src={logo}
              alt="PharmaPulse Logo"
              className="h-8 mr-3 sm:h-10 md:h-12"
            />
            <span className="text-2xl font-bold tracking-wide uppercase sm:text-3xl md:text-4xl whitespace-nowrap text-neutral-800 dark:text-neutral-100">
              PharmaPulse
            </span>
          </div>

          {/* Divider (More Prominent) */}
          <div className="w-0.5 h-10 bg-neutral-500 dark:bg-neutral-400 rounded"></div>

          {/* Developed By (Emphasized) */}
          <div className="flex items-center transition-colors duration-300">
            <span className="mr-2 text-sm sm:text-base md:text-lg text-neutral-500 dark:text-neutral-300">
              Developed by:
            </span>
            <a
              href="https://teampharmapulse.example.com" // Replace with actual URL or remove
              className={`font-bold text-base sm:text-lg md:text-xl uppercase ${
                isDarkMode
                  ? "text-green-300 hover:text-green-200"
                  : "text-green-700 hover:text-green-600"
              }`}
              aria-label="Visit Team PharmaPulse website"
            >
              Team PharmaPulse
            </a>
          </div>

          {/* Divider (More Prominent) */}
          <div className="w-0.5 h-10 bg-neutral-500 dark:bg-neutral-400 rounded"></div>

          {/* Copyright (Emphasized) */}
          <div className="text-sm sm:text-base md:text-lg">
            <span className="font-bold text-neutral-800 dark:text-neutral-100">
              © {new Date().getFullYear()} A & K Agencies PharmaPulse
            </span>
            <span className="ml-2 text-neutral-500 dark:text-neutral-300">
              All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;