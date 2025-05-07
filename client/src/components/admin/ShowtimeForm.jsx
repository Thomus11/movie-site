import { useState, useEffect } from 'react';
import { getMovies } from '../../api/movies';
import { createShowtime, updateShowtime } from '../../api/showtime';
import './ShowtimeForm.css';

const ShowtimeForm = ({ showtime, onSuccess }) => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    movie_id: showtime?.movie_id || '',
    start_time: showtime?.start_time || '',
    duration: showtime?.duration || 120
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getMovies();
        setMovies(response.data.movies);
      } catch (err) {
        setError('Failed to load movies');
      }
    };

    fetchMovies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (showtime) {
        await updateShowtime(showtime.id, formData);
      } else {
        await createShowtime(formData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save showtime');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="showtime-form">
      <h2>{showtime ? 'Edit Showtime' : 'Add New Showtime'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Movie</label>
          <select
            name="movie_id"
            value={formData.movie_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a movie</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="60"
            max="300"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Showtime'}
        </button>
      </form>
    </div>
  );
};

export default ShowtimeForm;