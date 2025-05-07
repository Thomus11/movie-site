import { useState, useEffect } from 'react';
import { getSeatsForShowtime } from '../../api/showtimes';
import './SeatMap.css';

const SeatMap = ({ showtimeId, selectedSeats, onSeatSelect }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await getSeatsForShowtime(showtimeId);
        setSeats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (showtimeId) {
      fetchSeats();
    }
  }, [showtimeId]);

  if (loading) return <div>Loading seat map...</div>;
  if (error) return <div>Error loading seats: {error}</div>;

  // Group seats by row
  const rows = {};
  seats.forEach(seat => {
    if (!rows[seat.row]) {
      rows[seat.row] = [];
    }
    rows[seat.row].push(seat);
  });

  return (
    <div className="seat-map-container">
      <div className="screen">Screen</div>
      
      <div className="seat-map">
        {Object.entries(rows).map(([row, rowSeats]) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            {rowSeats.map(seat => (
              <button
                key={seat.id}
                className={`seat ${seat.is_reserved ? 'reserved' : ''} ${
                  selectedSeats.includes(seat.id) ? 'selected' : ''
                }`}
                onClick={() => !seat.is_reserved && onSeatSelect(seat.id)}
                disabled={seat.is_reserved}
                title={seat.is_reserved ? 'Already reserved' : `Seat ${seat.seat_number}`}
              >
                {seat.column}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat reserved"></div>
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;