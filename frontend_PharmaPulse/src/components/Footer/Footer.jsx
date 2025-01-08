import "./Footer.css";
import logo from "../../assets/Logo.jpg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="footer-left">
          <p>&copy; A &amp; K Agencies PharmaPulse. All Rights Reserved.</p>
        </div>
        <div className="footer-right">Developed by: Team PharmaPulse</div>
      </div>
    </footer>
  );
};

export default Footer;