import { useState } from 'react';
import { createMovie, updateMovie } from '../../api/movies';
import { uploadImage } from '../../api/upload';
import './MovieForm.css';

const MovieForm = ({ movie, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    genre: movie?.genre || '',
    release_date: movie?.release_date || '',
    poster_url: movie?.poster_url || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let posterUrl = formData.poster_url;
      
      if (imageFile) {
        const uploadResponse = await uploadImage(imageFile);
        posterUrl = uploadResponse.url;
      }

      const movieData = {
        ...formData,
        poster_url: posterUrl
      };

      if (movie) {
        await updateMovie(movie.id, movieData);
      } else {
        await createMovie(movieData);
      }

      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-form">
      <h2>{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="200"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            maxLength="50"
          />
        </div>

        <div className="form-group">
          <label>Release Date</label>
          <input
            type="date"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Poster Image</label>
          {formData.poster_url && (
            <div className="current-poster">
              <img src={formData.poster_url} alt="Current poster" width="100" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Movie'}
        </button>
      </form>
    </div>
  );
};

export default MovieForm;