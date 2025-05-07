import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="logo">
          <Link to="/">MovieBooking</Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li>
              <NavLink to="/movies" activeclassname="active">
                Movies
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/profile" activeclassname="active">
                  My Profile
                </NavLink>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <NavLink to="/admin" activeclassname="active">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="auth-buttons">
          {user ? (
            <>
              <span className="welcome">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;