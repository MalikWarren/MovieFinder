import {useState} from 'react';
import '../css/MovieCard.css';
import {useMovieContext} from '../contexts/MovieContext';

function MovieCard({movie, onMovieClick}) {
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    rateMovie,
    getUserRating,
  } = useMovieContext();

  const [isHovered, setIsHovered] = useState(false);
  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);
  const userRating = getUserRating(movie.id);

  function onFavoriteClick(e) {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  }

  function onWatchlistClick(e) {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  }

  function onRatingClick(e, rating) {
    e.stopPropagation();
    rateMovie(movie.id, rating);
  }

  function handleCardClick() {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        className={`star ${star <= userRating ? 'filled' : ''}`}
        onClick={(e) => onRatingClick(e, star)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        ★
      </button>
    ));
  };

  return (
    <div
      className='movie-card'
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='movie-poster'>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          loading='lazy'
        />
        <div className='movie-overlay'>
          <div className='overlay-top'>
            <button
              className={`action-btn favorite-btn ${favorite ? 'active' : ''}`}
              onClick={onFavoriteClick}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              ❤️
            </button>
            <button
              className={`action-btn watchlist-btn ${
                inWatchlist ? 'active' : ''
              }`}
              onClick={onWatchlistClick}
              title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              📝
            </button>
          </div>

          <div className='overlay-bottom'>
            <div className='movie-rating'>
              <span className='rating-label'>Rate:</span>
              <div className='stars-container'>{renderStars()}</div>
            </div>
            <button className='view-details-btn'>View Details</button>
          </div>
        </div>

        <div className='movie-badges'>
          {movie.vote_average && (
            <span className='rating-badge'>
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          )}
          {userRating > 0 && (
            <span className='user-rating-badge'>👤 {userRating}/5</span>
          )}
        </div>
      </div>

      <div className='movie-info'>
        <h3 className='movie-title'>{movie.title}</h3>
        <div className='movie-meta'>
          <span className='movie-year'>
            {movie.release_date?.split('-')[0] || 'N/A'}
          </span>
          {movie.genre_ids && movie.genre_ids.length > 0 && (
            <span className='movie-genre'>
              {movie.genre_ids.slice(0, 2).join(', ')}
            </span>
          )}
        </div>
        {movie.overview && (
          <p className='movie-overview'>
            {movie.overview.length > 100
              ? `${movie.overview.substring(0, 100)}...`
              : movie.overview}
          </p>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
