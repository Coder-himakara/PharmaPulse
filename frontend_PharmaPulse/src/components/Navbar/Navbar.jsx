//import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.jpg'; // Updated path to the logo
import viewProfileIcon from '../../assets/Navbar/Profile.png'; // Image for "View Profile" option
import viewLogOutIcon from '../../assets/Navbar/Arrow.png'; // Image for "View Logout" option
import viewDashboardIcon from '../../assets/Navbar/Dash.png'; // Image for "View Dashboard" option


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
            <span className='user-role'>Admin</span>
          </div>
          <div className='dropdown'>
            <button className='dropdown-btn'>▼</button>
            <div className='dropdown-menu'>
            <a href='#dashboard' className='dropdown-item'>
                <img
                  src={viewDashboardIcon}
                  alt='View Dashboard'
                  className='dropdown-item-icon'
                />
               Dashboard
              </a>
             
              <a href='#profile' className='dropdown-item'>
                <img
                  src={viewProfileIcon}
                  alt='View Profile'
                  className='dropdown-item-icon'
                />
                Profile
              </a>
             

              <a href='#logout' className='dropdown-item'>
                <img
                  src={viewLogOutIcon}
                  alt='Logout'
                  className='dropdown-item-icon'
                />
                Log Out
              </a>
            </div>
          </div>
        </div>
      </div>

      <main>
        <h1>Welcome to MyApp</h1>
        <p>Your content goes here.</p>
      </main>
    </>
  );
};

export default Navbar;
