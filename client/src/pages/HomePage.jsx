import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import FeaturedMovies from '../components/movies/FeaturedMovies';
import './HomePage.css';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MovieBooking</h1>
          <p>Book tickets for the latest movies in theaters</p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="featured-movies">
        <h2>Now Showing</h2>
        <FeaturedMovies />
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choose a Movie</h3>
            <p>Browse our collection of current and upcoming movies</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Pick a Showtime</h3>
            <p>Select a convenient date and time for your movie</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Select Seats</h3>
            <p>Choose your preferred seats from our interactive seat map</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Confirm & Pay</h3>
            <p>Complete your booking with our secure payment system</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;