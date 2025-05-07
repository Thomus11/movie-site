import { useState, useEffect } from 'react';
import { getAdminReport } from '../../../api/admin';
import './AdminStats.css';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminReport();
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="admin-stats">
      <div className="stat-card">
        <h3>Total Reservations</h3>
        <p className="stat-value">{stats.total_reservations}</p>
        <p className="stat-label">All Time</p>
      </div>
      
      <div className="stat-card">
        <h3>Seats Reserved</h3>
        <p className="stat-value">{stats.capacity_utilization}</p>
        <p className="stat-label">Total Capacity</p>
      </div>
      
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <p className="stat-value">${stats.revenue.toFixed(2)}</p>
        <p className="stat-label">Gross Income</p>
      </div>
    </div>
  );
};

export default AdminStats;