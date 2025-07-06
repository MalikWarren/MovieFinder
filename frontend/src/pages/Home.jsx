import {useState, useEffect} from 'react';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import {
  searchMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getGenres,
} from '../services/api';
import '../css/Home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    rating: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    {id: 'popular', name: 'Popular', icon: '🔥'},
    {id: 'now-playing', name: 'Now Playing', icon: '🎬'},
    {id: 'top-rated', name: 'Top Rated', icon: '⭐'},
    {id: 'upcoming', name: 'Upcoming', icon: '📅'},
  ];

  useEffect(() => {
    loadGenres();
    loadMovies();
  }, [selectedCategory]);

  const loadGenres = async () => {
    try {
      const genresData = await getGenres();
      setGenres(genresData);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      let moviesData;
      switch (selectedCategory) {
        case 'popular':
          moviesData = await getPopularMovies();
          break;
        case 'now-playing':
          moviesData = await getNowPlayingMovies();
          break;
        case 'top-rated':
          moviesData = await getTopRatedMovies();
          break;
        case 'upcoming':
          moviesData = await getUpcomingMovies();
          break;
        default:
          moviesData = await getPopularMovies();
      }
      setMovies(moviesData);
    } catch (err) {
      console.error(err);
      setError('Failed to load movies...');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadMovies();
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery, filters);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to search movies...');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setFilters({year: '', genre: '', rating: ''});
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({year: '', genre: '', rating: ''});
    if (searchQuery) {
      handleSearch({preventDefault: () => {}});
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const renderSkeletonCards = () => {
    return Array.from({length: 12}, (_, index) => (
      <div
        key={index}
        className='movie-card skeleton'
      >
        <div className='skeleton-poster'></div>
        <div className='skeleton-content'>
          <div className='skeleton-title'></div>
          <div className='skeleton-meta'></div>
        </div>
      </div>
    ));
  };

  return (
    <div className='home'>
      <div className='hero-section'>
        <h1 className='hero-title'>Discover Amazing Movies</h1>
        <p className='hero-subtitle'>
          Explore the latest releases, top-rated films, and upcoming
          blockbusters
        </p>
      </div>

      <div className='search-section'>
        <form
          onSubmit={handleSearch}
          className='search-form'
        >
          <div className='search-input-group'>
            <input
              type='text'
              placeholder='Search for movies...'
              className='search-input'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type='submit'
              className='search-button'
            >
              🔍 Search
            </button>
          </div>

          <button
            type='button'
            className='filter-toggle'
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </form>

        {showFilters && (
          <div className='filters-panel'>
            <div className='filter-group'>
              <label>Year:</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value=''>Any Year</option>
                {Array.from({length: 30}, (_, i) => 2024 - i).map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-group'>
              <label>Genre:</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <option value=''>Any Genre</option>
                {genres.map((genre) => (
                  <option
                    key={genre.id}
                    value={genre.id}
                  >
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-group'>
              <label>Min Rating:</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value=''>Any Rating</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
                  <option
                    key={rating}
                    value={rating}
                  >
                    {rating}+
                  </option>
                ))}
              </select>
            </div>

            <button
              type='button'
              className='clear-filters'
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className='categories-section'>
        <div className='categories-grid'>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory === category.id ? 'active' : ''
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className='category-icon'>{category.icon}</span>
              <span className='category-name'>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className='error-message'>
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div className='movies-grid'>{renderSkeletonCards()}</div>
      ) : (
        <>
          {movies.length > 0 ? (
            <div className='movies-grid'>
              {movies.map((movie) => (
                <MovieCard
                  movie={movie}
                  key={movie.id}
                  onMovieClick={handleMovieClick}
                />
              ))}
            </div>
          ) : (
            <div className='no-results'>
              <div className='no-results-icon'>🎬</div>
              <h3>No movies found</h3>
              <p>Try adjusting your search criteria or browse our categories</p>
            </div>
          )}
        </>
      )}

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

export default Home;
