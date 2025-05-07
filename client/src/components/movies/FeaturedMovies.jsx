import { useState, useEffect } from 'react';
import { getMovies } from '../../api/movies';
import MovieCard from './MovieCard';
import './FeaturedMovies.css';

const FeaturedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const response = await getMovies(1, 4); // Get first 4 movies
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Error fetching featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  if (loading) return <div>Loading featured movies...</div>;

  return (
    <div className="featured-movies-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default FeaturedMovies;