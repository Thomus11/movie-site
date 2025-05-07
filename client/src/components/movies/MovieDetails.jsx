import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getShowtimes } from '../../api/movies';
import ShowtimeSelector from '../showtimes/ShowtimeSelector';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorModal from '../ui/ErrorModal';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          getMovieDetails(id),
          getShowtimes(id)
        ]);
        setMovie(movieRes.data);
        setShowtimes(showtimesRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorModal message={error} onClose={() => setError(null)} />;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="movie-detail">
      <div className="movie-header">
        <div className="poster-container">
          <img src={movie.poster_url} alt={movie.title} className="movie-poster" />
        </div>
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="genre">{movie.genre}</p>
          <p className="release-date">
            Release Date: {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <div className="actions">
            <button className="btn-favorite">Add to Favorites</button>
          </div>
        </div>
      </div>

      <div className="movie-content">
        <div className="movie-description">
          <h2>Overview</h2>
          <p>{movie.description}</p>
        </div>

        <div className="showtimes-section">
          <h2>Showtimes</h2>
          {showtimes.length > 0 ? (
            <ShowtimeSelector showtimes={showtimes} movieId={id} />
          ) : (
            <p>No showtimes available for this movie.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;