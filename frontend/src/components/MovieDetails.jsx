import {useState, useEffect} from 'react';
import {getMovieDetails, getMovieTrailers} from '../services/api';
import {useMovieContext} from '../contexts/MovieContext';
import '../css/MovieDetails.css';

function MovieDetails({movie, isOpen, onClose}) {
  const [details, setDetails] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  useEffect(() => {
    if (isOpen && movie) {
      loadMovieDetails();
    }
  }, [isOpen, movie]);

  const loadMovieDetails = async () => {
    setLoading(true);
    try {
      const [movieDetails, movieTrailers] = await Promise.all([
        getMovieDetails(movie.id),
        getMovieTrailers(movie.id),
      ]);
      setDetails(movieDetails);
      setTrailers(movieTrailers);
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleWatchlistClick = () => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleRatingClick = (rating) => {
    rateMovie(movie.id, rating);
  };

  const renderStars = () => {
    const userRating = getUserRating(movie.id);
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        className={`star ${star <= userRating ? 'filled' : ''}`}
        onClick={() => handleRatingClick(star)}
      >
        ★
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div
      className='modal-overlay'
      onClick={onClose}
    >
      <div
        className='modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className='loading-spinner'>Loading...</div>
        ) : details ? (
          <>
            <button
              className='close-btn'
              onClick={onClose}
            >
              ×
            </button>

            <div className='movie-header'>
              <div className='movie-poster'>
                <img
                  src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                  alt={details.title}
                />
              </div>

              <div className='movie-header-info'>
                <h1>{details.title}</h1>
                <div className='movie-meta'>
                  <span className='year'>
                    {details.release_date?.split('-')[0]}
                  </span>
                  <span className='runtime'>{details.runtime} min</span>
                  <span className='rating'>
                    ⭐ {details.vote_average?.toFixed(1)}
                  </span>
                </div>

                <div className='genres'>
                  {details.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className='genre-tag'
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className='action-buttons'>
                  <button
                    className={`action-btn ${
                      isFavorite(movie.id) ? 'active' : ''
                    }`}
                    onClick={handleFavoriteClick}
                  >
                    {isFavorite(movie.id) ? '❤️' : '🤍'} Favorites
                  </button>
                  <button
                    className={`action-btn ${
                      isInWatchlist(movie.id) ? 'active' : ''
                    }`}
                    onClick={handleWatchlistClick}
                  >
                    {isInWatchlist(movie.id) ? '📝' : '📄'} Watchlist
                  </button>
                </div>

                <div className='user-rating'>
                  <span>Your Rating:</span>
                  <div className='stars-container'>{renderStars()}</div>
                </div>
              </div>
            </div>

            <div className='movie-tabs'>
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === 'trailers' ? 'active' : ''}`}
                onClick={() => setActiveTab('trailers')}
              >
                Trailers
              </button>
              <button
                className={`tab ${activeTab === 'cast' ? 'active' : ''}`}
                onClick={() => setActiveTab('cast')}
              >
                Cast
              </button>
            </div>

            <div className='tab-content'>
              {activeTab === 'overview' && (
                <div className='overview-content'>
                  <p className='overview'>{details.overview}</p>
                  <div className='additional-info'>
                    <div className='info-item'>
                      <strong>Budget:</strong> $
                      {details.budget?.toLocaleString() || 'N/A'}
                    </div>
                    <div className='info-item'>
                      <strong>Revenue:</strong> $
                      {details.revenue?.toLocaleString() || 'N/A'}
                    </div>
                    <div className='info-item'>
                      <strong>Status:</strong> {details.status}
                    </div>
                    <div className='info-item'>
                      <strong>Original Language:</strong>{' '}
                      {details.original_language?.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trailers' && (
                <div className='trailers-content'>
                  {trailers.length > 0 ? (
                    <div className='trailers-grid'>
                      {trailers.map((trailer) => (
                        <div
                          key={trailer.key}
                          className='trailer-item'
                        >
                          <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title={trailer.name}
                            frameBorder='0'
                            allowFullScreen
                          />
                          <h4>{trailer.name}</h4>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No trailers available for this movie.</p>
                  )}
                </div>
              )}

              {activeTab === 'cast' && (
                <div className='cast-content'>
                  <div className='cast-grid'>
                    {details.credits?.cast?.slice(0, 10).map((actor) => (
                      <div
                        key={actor.id}
                        className='cast-member'
                      >
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                              : '/placeholder-avatar.png'
                          }
                          alt={actor.name}
                        />
                        <h4>{actor.name}</h4>
                        <p>{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='error-message'>Failed to load movie details</div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
