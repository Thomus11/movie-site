import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/movies', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setMovies)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Movies</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {movies.map(movie => (
          <div
            key={movie.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 16,
              width: 200,
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/book/${movie.id}`)}
          >
            <h3>{movie.title}</h3>
            <p>{movie.genre}</p>
            <p>Time: {movie.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
