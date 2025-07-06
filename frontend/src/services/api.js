const API_KEY = 'c926d8e911f03eacaa40267fd2685ca7';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const getNowPlayingMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getTopRatedMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getUpcomingMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query, filters = {}) => {
  const {year, genre, rating} = filters;
  let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}`;

  if (year) url += `&year=${year}`;
  if (genre) url += `&with_genres=${genre}`;
  if (rating) url += `&vote_average.gte=${rating}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (movieId) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
  );
  const data = await response.json();
  return data;
};

export const getMovieTrailers = async (movieId) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results.filter((video) => video.type === 'Trailer');
};

export const getGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.genres;
};

export const getMoviesByGenre = async (genreId) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  const data = await response.json();
  return data.results;
};
