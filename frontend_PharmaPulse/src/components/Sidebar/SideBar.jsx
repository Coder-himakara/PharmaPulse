//import React from 'react';
import './Sidebar.css'; // Import the CSS file for styling

function Sidebar() {
  return (
    <div className='sidebar'>
      <ul className='sidebar-menu'>
        <li>
          <a href='#dashboard'>Dashboard</a>
        </li>
        <li>
          <a href='#profile'>Profile</a>
        </li>
        <li>
          <a href='#settings'>Settings</a>
        </li>
        <li>
          <a href='#help'>Help</a>
        </li>
        <li>
          <a href='#logout'>Logout</a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
