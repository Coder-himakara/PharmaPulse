import React from "react";
import "./Footer.css";
import logo from "../../assets/Logo.jpg";

function Footer() {
  return (
    <footer className="footer">
      <img src={logo} alt="Logo" className="footer-logo" />
      <div className="footer-left">
        &copy; A &amp; K Agencies PharmaPulse. All Rights Reserved.
      </div>
      <div className="footer-right">Developed by: Team PharmaPulse</div>
    </footer>
  );
}

export default Footer;
