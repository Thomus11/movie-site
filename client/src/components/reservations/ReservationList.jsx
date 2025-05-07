import { useState, useEffect } from 'react';
import { getReservationsByUser } from '../../../api/reservations';
import ReservationCard from './ReservationCard';
import './ReservationList.css';

const ReservationList = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservationsByUser(userId);
        setReservations(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reservation-list">
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        reservations.map(reservation => (
          <ReservationCard 
            key={reservation.id} 
            reservation={reservation} 
          />
        ))
      )}
    </div>
  );
};

export default ReservationList;