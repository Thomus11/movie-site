import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import MovieForm from '../components/admin/MovieForm';
import ShowtimeForm from '../components/admin/ShowtimeForm';
import AdminReferenceList from '../components/admin/AdminReferenceList';
import './AdminPage.css';

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setActiveTab('movies');
  };

  const handleEditShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setActiveTab('showtimes');
  };

  const handleFormSuccess = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setActiveTab('dashboard');
  };

  if (user?.role !== 'admin') {
    return null; // Or a loading spinner
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.username}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'movies' ? 'active' : ''}
          onClick={() => {
            setSelectedMovie(null);
            setActiveTab('movies');
          }}
        >
          Movies
        </button>
        <button
          className={activeTab === 'showtimes' ? 'active' : ''}
          onClick={() => {
            setSelectedShowtime(null);
            setActiveTab('showtimes');
          }}
        >
          Showtimes
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'references' ? 'active' : ''}
          onClick={() => setActiveTab('references')}
        >
          References
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <AdminDashboard 
            onEditMovie={handleEditMovie}
            onEditShowtime={handleEditShowtime}
          />
        )}

        {activeTab === 'movies' && (
          <div className="movie-management">
            <h2>{selectedMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
            <MovieForm 
              movie={selectedMovie} 
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {activeTab === 'showtimes' && (
          <div className="showtime-management">
            <h2>{selectedShowtime ? 'Edit Showtime' : 'Add New Showtime'}</h2>
            <ShowtimeForm 
              showtime={selectedShowtime} 
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-management">
            <h2>User Management</h2>
            <AdminUserManagement />
          </div>
        )}

        {activeTab === 'references' && (
          <div className="reference-management">
            <h2>Admin References</h2>
            <AdminReferenceList adminId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;