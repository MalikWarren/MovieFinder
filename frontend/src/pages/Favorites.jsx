import {useMovieContext} from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import {useState} from 'react';
import '../css/Favorites.css';

function Favorites() {
  const {favorites} = useMovieContext();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  if (favorites.length === 0) {
    return (
      <div className='favorites-empty'>
        <div className='empty-icon'>❤️</div>
        <h2>No Favorite Movies Yet</h2>
        <p>Start adding movies to your favorites and they will appear here!</p>
        <div className='empty-features'>
          <div className='feature'>
            <span className='feature-icon'>🎬</span>
            <span>Browse movies and click the heart button</span>
          </div>
          <div className='feature'>
            <span className='feature-icon'>📱</span>
            <span>Access your favorites from any device</span>
          </div>
          <div className='feature'>
            <span className='feature-icon'>⭐</span>
            <span>Rate movies and track your preferences</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='favorites'>
      <div className='favorites-header'>
        <h1>My Favorites</h1>
        <div className='favorites-stats'>
          <span className='stat'>
            <span className='stat-number'>{favorites.length}</span>
            <span className='stat-label'>Movies</span>
          </span>
        </div>
      </div>

      <div className='movies-grid'>
        {favorites.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id}
            onMovieClick={handleMovieClick}
          />
        ))}
      </div>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Favorites;
