/* eslint-disable prettier/prettier */
import { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaSun, FaMoon } from 'react-icons/fa';
import logo from '../../assets/Logo.jpg';
import { ThemeContext } from '../../ThemeContext';

const DropdownLink = ({ to, icon: Icon, children, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 text-sm rounded-md transition-all duration-300 ${
          isActive
            ? 'bg-teal-700 text-white'
            : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-teal-700 hover:text-teal-300'
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

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  return (
    <div
      className={`flex justify-between items-center px-6 py-4 fixed top-0 left-0 w-full z-10 h-[100px] transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-teal-800 text-white'
      }`}
    >
      {/* Logo and Home */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-4" />
        <span className="text-lg font-bold">Home</span>
      </div>

      {/* User and Dropdown */}
      <div className="relative flex items-center gap-4">
        <div>
          <span className="text-sm font-bold">John Doe</span>
          <br />
          <span className="text-xs italic">Admin</span>
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
                isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'
              }`}
            >
              <DropdownLink to="/dashboard" icon={FaTachometerAlt} onClick={closeDropdown}>
                Dashboard
              </DropdownLink>
              <DropdownLink to="/update-profile" icon={FaUser} onClick={closeDropdown}>
                Profile
              </DropdownLink>
              <DropdownLink to="/home" icon={FaSignOutAlt} onClick={closeDropdown}>
                Log Out
              </DropdownLink>
            </ul>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <FaSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FaMoon className="w-5 h-5 text-blue-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
