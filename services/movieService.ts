import { Credits } from "@/types/credits";
import { Genre } from "@/types/genre";
import { Movie } from "@/types/movie";
import { MovieDetail } from "@/types/movieDetail";
import { Trailer } from "@/types/trailer";
import { TMDB_CONFIG } from "./config";

type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

type ActorMovieResponse = {
  cast: Movie[];
};

export const fetchTrendings = async (
  page: number = 1,
): Promise<MovieResponse> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/trending/all/day?page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data: MovieResponse = await response.json();
  return data;
};

export const fetchLatestMovies = async (
  page: number = 1,
): Promise<MovieResponse> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?vote_average.gte=1&vote_average.lte=9&primary_release_year=2026&page=${page}`;
  //  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/now_playing?page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data: MovieResponse = await response.json();
  return data;
};

export const fetchTopRatedMovies = async (
  page: number = 1,
): Promise<MovieResponse> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/top_rated?page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data: MovieResponse = await response.json();
  return data;
};

export const fetchPopularMovies = async (
  page: number = 1,
): Promise<MovieResponse> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/popular?page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data: MovieResponse = await response.json();
  return data;
};

export const fetchMovieDetails = async (
  movieId: string,
): Promise<MovieDetail> => {
  //  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
  }

  const data: MovieDetail = await response.json();
  return data;
};

export const fetchMovieVideos = async (movieId: string): Promise<Trailer> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie videos: ${response.statusText}`);
  }

  const data: Trailer = await response.json();
  return data;
};

export const fetchMoviesCasts = async (movieId: string): Promise<Credits> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie casts: ${response.statusText}`);
  }

  const data: Credits = await response.json();
  return data;
};

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/genre/movie/list`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie genres: ${response.statusText}`);
  }

  const data: { genres: Genre[] } = await response.json();
  return data.genres;
};

export const fetchMoviesByGenre = async (
  genreId: number,
  page: number = 1,
): Promise<MovieResponse> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies by genre: ${response.statusText}`);
  }

  const data: MovieResponse = await response.json();
  return data;
};

export const fetchActorSpecificMovies = async (
  personId: string,
  page: number = 1,
): Promise<ActorMovieResponse> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/person/${personId}/movie_credits?page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data: ActorMovieResponse = await response.json();
  return data;
};
