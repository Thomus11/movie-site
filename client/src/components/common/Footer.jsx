import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MovieBooking</h3>
          <p>Your premier destination for movie tickets and entertainment.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">My Account</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: info@moviebooking.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MovieBooking. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;