import { useState } from 'react';
import MovieList from '../components/movies/MovieList';
import GenreFilter from '../components/movies/GenreFilter';
import './MoviesPage.css';

const MoviesPage = () => {
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller'
  ];

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>Our Movies</h1>
        <GenreFilter 
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
      </div>
      
      <MovieList genre={selectedGenre} />
    </div>
  );
};

export default MoviesPage;