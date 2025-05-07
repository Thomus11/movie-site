import { Link } from 'react-router-dom';
// import './ReservationCard.css';

const ReservationCard = ({ reservation }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className="reservation-card">
      <div className="reservation-header">
        <h3>{reservation.movie.title}</h3>
        <span className={`status-badge ${reservation.status}`}>
          {reservation.status}
        </span>
      </div>
      
      <div className="reservation-details">
        <div className="detail">
          <span className="label">Date:</span>
          <span>{formatDate(reservation.showtime.start_time)}</span>
        </div>
        <div className="detail">
          <span className="label">Time:</span>
          <span>{formatTime(reservation.showtime.start_time)}</span>
        </div>
        <div className="detail">
          <span className="label">Seats:</span>
          <span>{reservation.seats.map(s => s.seat_number).join(', ')}</span>
        </div>
        <div className="detail">
          <span className="label">Total:</span>
          <span>${(reservation.seats.length * 10).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="reservation-actions">
        <Link 
          to={`/reservations/${reservation.id}`} 
          className="view-button"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ReservationCard;