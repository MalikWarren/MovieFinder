import {Link} from 'react-router-dom';
import {useMovieContext} from '../contexts/MovieContext';
import '../css/Navbar.css';

function NavBar() {
  const {theme, toggleTheme, favorites, watchlist} = useMovieContext();

  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <Link
          to='/'
          className='brand-link'
        >
          <span className='brand-icon'>🎬</span>
          <span className='brand-text'>CineVerse</span>
        </Link>
      </div>

      <div className='navbar-links'>
        <Link
          to='/'
          className='nav-link'
        >
          <span className='nav-icon'>🏠</span>
          <span className='nav-text'>Home</span>
        </Link>
        <Link
          to='/favorites'
          className='nav-link'
        >
          <span className='nav-icon'>❤️</span>
          <span className='nav-text'>Favorites</span>
          {favorites.length > 0 && (
            <span className='badge'>{favorites.length}</span>
          )}
        </Link>
        <Link
          to='/watchlist'
          className='nav-link'
        >
          <span className='nav-icon'>📝</span>
          <span className='nav-text'>Watchlist</span>
          {watchlist.length > 0 && (
            <span className='badge'>{watchlist.length}</span>
          )}
        </Link>
        <button
          className='theme-toggle'
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
