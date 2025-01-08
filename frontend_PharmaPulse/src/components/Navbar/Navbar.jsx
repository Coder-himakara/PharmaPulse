import './Navbar.css';
import logo from '../../assets/logo.jpg';
import { FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <>
      <div className='navbar'>
        <div className='navbar-logo'>
          <img src={logo} alt='Logo' className='logo' />
          <span>Home</span>
        </div>

        <div className='navbar-profile'>
          <div className='user-info'>
            <span className='user-name'>John Doe</span>
            <br></br>
            <span className='user-role'>Admin</span>
          </div>
          <div className='dropdown'>
            <button className='dropdown-btn'>▼</button>
            <div className='dropdown-menu'>
              <a href='#dashboard' className='dropdown-item'>
                <FaTachometerAlt className='dropdown-item-icon' />
                 Dashboard
              </a>

              <a href='#profile' className='dropdown-item'>
                <FaUser className='dropdown-item-icon' />
                 Profile
              </a>

              <a href='#logout' className='dropdown-item'>
                <FaSignOutAlt className='dropdown-item-icon' />
                 Log Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
