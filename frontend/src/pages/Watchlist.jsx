import {useMovieContext} from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import {useState} from 'react';
import '../css/Watchlist.css';

function Watchlist() {
  const {watchlist} = useMovieContext();
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

  if (watchlist.length === 0) {
    return (
      <div className='watchlist-empty'>
        <div className='empty-icon'>📝</div>
        <h2>Your Watchlist is Empty</h2>
        <p>Start adding movies to your watchlist and they will appear here!</p>
        <div className='empty-features'>
          <div className='feature'>
            <span className='feature-icon'>🎬</span>
            <span>Browse movies and click the watchlist button</span>
          </div>
          <div className='feature'>
            <span className='feature-icon'>📱</span>
            <span>Access your watchlist from any device</span>
          </div>
          <div className='featurer'>
            <span className='feature-icon'>⭐</span>
            <span>Rate movies and track your favorites</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='watchlist'>
      <div className='watchlist-header'>
        <h1>My Watchlist</h1>
        <div className='watchlist-stats'>
          <span className='stat'>
            <span className='stat-number'>{watchlist.length}</span>
            <span className='stat-label'>Movies</span>
          </span>
        </div>
      </div>

      <div className='movies-grid'>
        {watchlist.map((movie) => (
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

export default Watchlist;
