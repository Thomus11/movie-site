import { useState, useEffect, useContext } from 'react';
import { getAdminReport, getAllReservations } from '../../api/admin';
import { AuthContext } from '../../contexts/AuthContext';
import MovieForm from './MovieForm';
import ShowtimeForm from './ShowtimeForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [report, setReport] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, reservationsRes] = await Promise.all([
          getAdminReport(),
          getAllReservations()
        ]);
        setReport(reportRes.data);
        setReservations(reservationsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.username}</p>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'movies' ? 'active' : ''}
          onClick={() => setActiveTab('movies')}
        >
          Manage Movies
        </button>
        <button 
          className={activeTab === 'showtimes' ? 'active' : ''}
          onClick={() => setActiveTab('showtimes')}
        >
          Manage Showtimes
        </button>
        <button 
          className={activeTab === 'reservations' ? 'active' : ''}
          onClick={() => setActiveTab('reservations')}
        >
          View Reservations
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'dashboard' && report && (
          <div className="dashboard-report">
            <h2>System Overview</h2>
            <div className="report-cards">
              <div className="report-card">
                <h3>Total Reservations</h3>
                <p>{report.total_reservations}</p>
              </div>
              <div className="report-card">
                <h3>Capacity Utilization</h3>
                <p>{report.capacity_utilization} seats</p>
              </div>
              <div className="report-card">
                <h3>Total Revenue</h3>
                <p>${report.revenue}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'movies' && <MovieForm />}
        {activeTab === 'showtimes' && <ShowtimeForm />}
        
        {activeTab === 'reservations' && (
          <div className="reservations-list">
            <h2>All Reservations</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Showtime</th>
                  <th>Seats</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.reservation_id}>
                    <td>{res.reservation_id}</td>
                    <td>{res.user_id}</td>
                    <td>{res.showtime}</td>
                    <td>{res.seats.join(', ')}</td>
                    <td>${res.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;