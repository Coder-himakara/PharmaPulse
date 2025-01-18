import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import logo from '../../assets/Logo.jpg';

const DropdownLink = ({ to, icon: Icon, children, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 text-sm transition-all duration-300 ${
          isActive
            ? 'bg-[#2d6a6c] text-white'
            : 'bg-white text-black hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
        }`
      }
      onClick={onClick}
    >
      {Icon && <Icon className='w-5 h-5 mr-2' />}
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

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  return (
    <div className='flex justify-between items-center bg-[#1a5353] p-4 text-white fixed top-0 left-0 w-full z-10 h-[100px]'>
      <div className='flex items-center'>
        <img src={logo} alt='Logo' className='h-[40px] mr-9 ml-9' />
        <span className='text-lg font-bold'>Home</span>
      </div>

      <div className='flex items-center gap-2 relative mr-9'>
        <div>
          <span className='text-sm font-bold'>John Doe</span>
          <br />
          <span className='text-xs italic'>Admin</span>
        </div>
        <div className='relative ml-4 dropdown'>
          <button
            onClick={toggleDropdown}
            className='bg-transparent border-none text-white text-base cursor-pointer flex items-center hover:text-[#c3e4e5]'
          >
            ▼
          </button>
          {isDropdownVisible && (
            <ul className='absolute top-full right-0 bg-white text-[#333] border border-[#ddd] rounded-md min-w-[150px] shadow-lg z-10 list-none p-0'>
              <DropdownLink
                to='/dashboard'
                icon={FaTachometerAlt}
                onClick={closeDropdown}
              >
                Dashboard
              </DropdownLink>
              <DropdownLink
                to='/update-profile'
                icon={FaUser}
                onClick={closeDropdown}
              >
                Profile
              </DropdownLink>
              <DropdownLink
                to='/home'
                icon={FaSignOutAlt}
                onClick={closeDropdown}
              >
                Log Out
              </DropdownLink>
            </ul>
          )}
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className='text-white text-lg ml-4 flex items-center justify-center'
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
