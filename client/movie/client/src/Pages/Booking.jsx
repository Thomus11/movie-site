import React, { useEffect, useState } from 'react';

const BookingPage = ({ movieId }) => {
  const [movie, setMovie] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({ name: '', email: '' });
  const [step, setStep] = useState('location');

  useEffect(() => {
    fetch(`/api/movies/${movieId}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLocations(data.locations);
      });
  }, [movieId]);

  const handleLocationClick = (loc) => {
    setSelectedLocation(loc);
    setStep('showtime');
  };

  const handleShowtimeClick = (show) => {
    setSelectedShowtime(show);
    fetch(`/api/showtimes/${show.id}/seats`)
      .then(res => res.json())
      .then(data => {
        setSeats(data);
        setStep('seats');
      });
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleInputChange = (e) => {
    setBookingInfo({ ...bookingInfo, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = () => {
    const payload = {
      name: bookingInfo.name,
      email: bookingInfo.email,
      showtime_id: selectedShowtime.id,
      seat_ids: selectedSeats
    };
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        alert('Booking created! Proceeding to payment...');
        setStep('payment');
      });
  };

  return (
    <div className="booking-page">
      {movie && <h2>{movie.title}</h2>}

      {step === 'location' && (
        <>
          <h4>Select a location:</h4>
          {locations.map(loc => (
            <button key={loc.admin_id} onClick={() => handleLocationClick(loc)}>
              {loc.location}
            </button>
          ))}
        </>
      )}

      {step === 'showtime' && (
        <>
          <h4>Available showtimes at {selectedLocation.location}</h4>
          {selectedLocation.showtimes.map(show => (
            <button key={show.id} onClick={() => handleShowtimeClick(show)}>
              {new Date(show.start_time).toLocaleString()}
            </button>
          ))}
          <button onClick={() => setStep('location')}>Back</button>
        </>
      )}

      {step === 'seats' && (
        <>
          <h4>Select seats:</h4>
          <div className="seats-grid">
            {seats.map(seat => (
              <button
                key={seat.id}
                disabled={seat.is_reserved}
                className={selectedSeats.includes(seat.id) ? 'selected' : ''}
                onClick={() => toggleSeat(seat.id)}
              >
                {seat.row}{seat.column}
              </button>
            ))}
          </div>

          <h4>Booking Info</h4>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={bookingInfo.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={bookingInfo.email}
            onChange={handleInputChange}
            required
          />
          <button onClick={handleBookingSubmit}>Confirm Booking</button>
          <button onClick={() => setStep('showtime')}>Back</button>
        </>
      )}

      {step === 'payment' && (
        <div>
          <h3>Payment Modal Placeholder</h3>
          <p>Integrate Stripe, PayPal, or your custom gateway here.</p>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
