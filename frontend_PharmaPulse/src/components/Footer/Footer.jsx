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
        ${isDarkMode ? "bg-neutral-700" : "bg-slate-300"}
        ${isVisible && !isPopupOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        z-10 py-4 md:py-5
      `}
    >
      <div
        className={`max-w-10xl mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-6 px-4 py-2`}
      >
        {/* Logo and Title */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="PharmaPulse Logo"
            className="h-6 mr-2 sm:h-7 md:h-8 lg:h-9"
          />
          <span className="text-base font-bold tracking-wide uppercase sm:text-lg md:text-xl whitespace-nowrap text-neutral-800 dark:text-neutral-100">
            PharmaPulse
          </span>
        </div>

        {/* Divider */}
        <div className="w-0.5 h-6 md:h-8 bg-neutral-500 dark:bg-neutral-400 rounded hidden sm:block"></div>

        {/* Developed By */}
        <div className="flex items-center">
          <span className="mr-1 text-xs md:mr-2 sm:text-sm md:text-base text-neutral-700 dark:text-neutral-300">
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
        <div className="w-0.5 h-6 md:h-8 bg-neutral-500 dark:bg-neutral-400 rounded hidden sm:block"></div>

        {/* Copyright */}
        <div className="text-xs sm:text-sm md:text-base">
          <span className="font-semibold text-neutral-800 dark:text-neutral-100">
            © {new Date().getFullYear()} A & K Agencies PharmaPulse
          </span>
          <span className="ml-1 md:ml-2 text-neutral-700 dark:text-neutral-300">
            All Rights Reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
