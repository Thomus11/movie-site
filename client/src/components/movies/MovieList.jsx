import { useState, useEffect } from 'react';
import { getMovies, searchMovies } from '../../api/movies';
import MovieCard from './MovieCard';
import SearchBar from '../ui/SearchBar';
import Pagination from '../ui/Pagination';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let response;
        if (searchTerm) {
          response = await searchMovies('', searchTerm);
          setMovies(response.data);
          setTotalPages(1);
        } else {
          response = await getMovies(currentPage);
          setMovies(response.data.movies);
          setTotalPages(response.data.total_pages);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="movie-list">
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {!searchTerm && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MovieList;