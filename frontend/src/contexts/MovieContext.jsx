import {createContext, useState, useContext, useEffect} from 'react';

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [theme, setTheme] = useState('dark');

  // Load data from localStorage on mount
  useEffect(() => {
    const storedFavs = localStorage.getItem('favorites');
    const storedWatchlist = localStorage.getItem('watchlist');
    const storedRatings = localStorage.getItem('userRatings');
    const storedTheme = localStorage.getItem('theme');

    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
    if (storedRatings) setUserRatings(JSON.parse(storedRatings));
    if (storedTheme) setTheme(storedTheme);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addToFavorites = (movie) => {
    setFavorites((prev) => [...prev, movie]);
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => [...prev, movie]);
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const rateMovie = (movieId, rating) => {
    setUserRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  const getUserRating = (movieId) => {
    return userRatings[movieId] || 0;
  };

  const value = {
    favorites,
    watchlist,
    userRatings,
    theme,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    rateMovie,
    toggleTheme,
    isFavorite,
    isInWatchlist,
    getUserRating,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
