import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, createReservation } from '../../api/movies';
import { getShowtimes } from '../../api/showtimes';
import SeatMap from './SeatMap';
import { AuthContext } from '../../context/AuthContext';
import './ReservationForm.css';

const ReservationForm = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          getMovieDetails(movieId),
          getShowtimes(movieId)
        ]);
        setMovie(movieRes.data);
        setShowtimes(showtimesRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleShowtimeSelect = (showtimeId) => {
    setSelectedShowtime(showtimeId);
    setSelectedSeats([]);
  };

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId) 
        : [...prev, seatId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShowtime || selectedSeats.length === 0) {
      setError('Please select a showtime and at least one seat');
      return;
    }

    try {
      await createReservation({
        user_id: user.id,
        showtime_id: selectedShowtime,
        seat_ids: selectedSeats
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Reservation failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="reservation-form">
      <h2>Reserve Seats for {movie.title}</h2>
      
      <div className="showtime-selection">
        <h3>Select Showtime</h3>
        <div className="showtime-buttons">
          {showtimes.map(st => (
            <button
              key={st.id}
              className={selectedShowtime === st.id ? 'active' : ''}
              onClick={() => handleShowtimeSelect(st.id)}
            >
              {new Date(st.start_time).toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {selectedShowtime && (
        <>
          <SeatMap 
            showtimeId={selectedShowtime} 
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
          
          <div className="reservation-summary">
            <h3>Your Selection</h3>
            <p>Movie: {movie.title}</p>
            <p>Showtime: {new Date(
              showtimes.find(st => st.id === selectedShowtime).start_time
            ).toLocaleString()}</p>
            <p>Seats: {selectedSeats.length}</p>
            <p>Total: ${selectedSeats.length * 10}</p>
            
            <button 
              onClick={handleSubmit}
              disabled={selectedSeats.length === 0}
            >
              Confirm Reservation
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationForm;