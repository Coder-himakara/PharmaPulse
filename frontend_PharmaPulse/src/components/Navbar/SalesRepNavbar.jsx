/* eslint-disable prettier/prettier */
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import logo from "../../assets/Logo.jpg";
import { ThemeContext } from "../../ThemeContext";
import { MegaMenu } from "primereact/megamenu";


const DropdownLink = ({ to, icon: Icon, children, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 text-sm rounded-md transition-all duration-300 ${
          isActive
            ? "bg-teal-700 text-white"
            : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-teal-700 hover:text-teal-300"
        }`
      }
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </NavLink>
  </li>
);

DropdownLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  const handleMenuClick = (event) => {
    if (event.item.url) {
      navigate(event.item.url);
    }
  };
  const SalesRepNavbarSections=
  [
    
    {
      "label": "Options",
      "icon": "pi pi-dollar text-white",
      "items": [
        [
          {
            "label": "Options",
            "items": [
              { "label": "Price List", "url": "price-list-view" },
              { "label": "Order Creation", "url": "order-creation" }
            ]
          }
        ]
      ]
    }
    
  ]
  
  

  return (
    <div
      className={`flex justify-between items-center px-6 py-4 fixed top-0 left-0 w-full z-10 h-[100px] transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-teal-800 text-white"
      }`}
    >
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-4" />
        <span className="text-lg font-bold">Home</span>
      </div>

      {/* Mega Menu (Icons & Text White) */}
      <div className="hidden md:block">
        <MegaMenu
         model={SalesRepNavbarSections}
         MenuItemClick={handleMenuClick}
          breakpoint="960px"
          pt={{
            root: {
              className: `${isDarkMode ? "bg-gray-900 text-white" : "bg-teal-800 text-black"} border-none`,
            },
            menu: {
              className: "bg-transparent gap-2 border-none shadow-md",
            },
            submenu: {
              className: `${isDarkMode ? "text-white" : "text-black"} border-none`,
            },
            content: {
              className: `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-teal-700"} border-none`,
            },

            // Make only navbar main items (Partners, Products, etc.) white
            label: {
              className: `${isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white active:bg-gray-700 active:text-white " : "text-gray-400 hover:bg-teal-700 hover:text-white active:bg-teal-700 active:text-white"} border-none`,
            },
            icon: { className: "text-white font-bold" },

            // Keep dropdown menu text black
            menuitem: {
              className: "hover:bg-transparent text-black",
            },
            action: {
              className: "hover:bg-transparent text-black",
            },
            link: {
              className: "hover:bg-transparent text-black",
            },
            submenuitem: {
              className: "hover:bg-transparent text-black",
            },
          }}
        />
      </div>

      <div className="relative flex items-center gap-4">
        <div>
          <span className="text-sm font-bold ">Nimal</span>
          <br />
          <span className="text-xs italic">Sales Rep</span>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-base text-white bg-transparent border-none cursor-pointer hover:text-teal-300"
          >
            ▼
          </button>
          {isDropdownVisible && (
            <ul
              className={`absolute top-full right-0 mt-2 border rounded-md min-w-[150px] shadow-lg z-10 list-none ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <DropdownLink
                to="/dashboard"
                icon={FaTachometerAlt}
                onClick={closeDropdown}
              >
                Dashboard
              </DropdownLink>
              <DropdownLink
                to="/update-profile"
                icon={FaUser}
                onClick={closeDropdown}
              >
                Profile
              </DropdownLink>
              <DropdownLink
                to="/home"
                icon={FaSignOutAlt}
                onClick={closeDropdown}
              >
                Log Out
              </DropdownLink>
            </ul>
          )}
        </div>

        <button
          className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <FaSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FaMoon className="w-5 h-5 text-teal-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
