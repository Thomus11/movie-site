// import './GenreFilter.css';

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }) => {
  return (
    <div className="genre-filter">
      <select
        value={selectedGenre}
        onChange={(e) => onSelectGenre(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map(genre => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;