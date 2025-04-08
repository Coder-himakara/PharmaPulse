/* eslint-disable prettier/prettier */
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../ThemeContext";
import logo from "../../assets/Logo.jpg";

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Function to check if any popups/modals are open
    const checkForPopups = () => {
      // Look for common popup/modal elements 
      const popups = document.querySelectorAll('.modal, .popup, .dialog, [role="dialog"]');
      const backdropElements = document.querySelectorAll('.modal-backdrop, .overlay, .backdrop');
      
      // Also check for elements with high z-index that might be popups
      const possiblePopups = document.querySelectorAll('[style*="z-index"]');
      const highZIndexElements = Array.from(possiblePopups).filter(el => {
        const style = window.getComputedStyle(el);
        const zIndex = parseInt(style.zIndex);
        return zIndex > 100 && el.offsetWidth > 0 && el.offsetHeight > 0;
      });
      
      setIsPopupOpen(popups.length > 0 || backdropElements.length > 0 || highZIndexElements.length > 0);
    };

    // Function to handle scroll and update footer visibility
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      checkForPopups(); // Check for popups on scroll
      
      // Always show footer if page content is short and no popup is open
      if (documentHeight <= windowHeight && !isPopupOpen) {
        setIsVisible(true);
      } else {
        // Show footer near bottom for longer content, but hide if popup is open
        setIsVisible(scrollPosition >= documentHeight - 50 && !isPopupOpen);
      }
    };

    // Initial check
    handleScroll();
    checkForPopups();
    
    // Setup listeners
    window.addEventListener("scroll", handleScroll);
    
    // Set up a MutationObserver to detect DOM changes that might indicate popups
    const observer = new MutationObserver(() => {
      checkForPopups();
      handleScroll();
    });
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isPopupOpen]); // Re-run if popup state changes

  return (
    <footer
      className={`
        relative w-full box-border transition-opacity duration-300
        ${isDarkMode ? "bg-neutral-600 text-neutral-500" : "bg-neutral-300 text-neutral-600"}
        ${isVisible && !isPopupOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        z-10
      `}
    >
      <div className="py-6 mx-4 md:py-8 md:mx-6 text-center">
        <div
          className={`max-w-10xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8 p-4 md:p-6 rounded-lg shadow-md
            ${isDarkMode
              ? "bg-neutral-700 border border-neutral-500"
              : "bg-slate-300 border border-neutral-200"
            }`}
        >
          {/* Logo and Title */}
          <div className="flex items-center transition-transform duration-300 hover:scale-105">
            <img
              src={logo}
              alt="PharmaPulse Logo"
              className="h-7 mr-2 sm:h-8 md:h-10 lg:h-12"
            />
            <span className="font-bold tracking-wide uppercase text-base sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap text-neutral-800 dark:text-neutral-100">
              PharmaPulse
            </span>
          </div>

          {/* Divider */}
          <div className="w-0.5 h-8 md:h-10 bg-neutral-500 dark:bg-neutral-400 rounded hidden sm:block"></div>

          {/* Developed By */}
          <div className="flex items-center transition-colors duration-300">
            <span className="mr-1 md:mr-2 text-xs sm:text-sm md:text-base text-neutral-500 dark:text-neutral-300">
              Developed by:
            </span>
            <a
              className={`font-semibold text-sm sm:text-base md:text-lg uppercase ${
                isDarkMode
                  ? "text-green-300 hover:text-green-200"
                  : "text-green-700 hover:text-green-600"
              }`}
              aria-label="Visit Team PharmaPulse website"
            >
              Team PharmaPulse
            </a>
          </div>

          {/* Divider */}
          <div className="w-0.5 h-8 md:h-10 bg-neutral-500 dark:bg-neutral-400 rounded hidden sm:block"></div>

          {/* Copyright */}
          <div className="text-xs sm:text-sm md:text-base">
            <span className="font-semibold text-neutral-800 dark:text-neutral-100">
              © {new Date().getFullYear()} A & K Agencies PharmaPulse
            </span>
            <span className="ml-1 md:ml-2 text-neutral-500 dark:text-neutral-300">
              All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
