import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.id}`}>
        <div className="movie-poster">
          <img src={movie.poster_url} alt={movie.title} />
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p className="genre">{movie.genre}</p>
          <p className="release-date">
            Released: {new Date(movie.release_date).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;