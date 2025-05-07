import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ShowtimeSelector.css';

const ShowtimeSelector = ({ showtimes, movieId }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Group showtimes by date
  const showtimesByDate = showtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {});

  const dates = Object.keys(showtimesByDate);

  return (
    <div className="showtime-selector">
      <div className="date-selector">
        {dates.map(date => (
          <button
            key={date}
            className={`date-button ${selectedDate === date ? 'active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>
      
      <div className="time-slots">
        {selectedDate && showtimesByDate[selectedDate].map(showtime => (
          <Link
            key={showtime.id}
            to={`/movies/${movieId}/reserve/${showtime.id}`}
            className="time-slot"
          >
            {new Date(showtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowtimeSelector;