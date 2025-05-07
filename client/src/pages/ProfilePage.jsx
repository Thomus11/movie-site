import { useState, useEffect, useContext } from 'react';
import { getReservationsByUser } from '../api/reservation';
import { AuthContext } from '../contexts/AuthContext';
import ReservationCard from '../components/reservations/ReservationCard';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservationsByUser(user.id);
        setReservations(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  if (loading) return <div className="loading">Loading your profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Welcome, {user.username}</h1>
        <p>Email: {user.email}</p>
      </div>

      <div className="reservations-section">
        <h2>Your Reservations</h2>
        {reservations.length === 0 ? (
          <p>You don't have any reservations yet.</p>
        ) : (
          <div className="reservations-grid">
            {reservations.map(reservation => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;