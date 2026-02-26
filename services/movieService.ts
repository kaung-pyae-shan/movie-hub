import { Credits } from "@/types/credits";
import { Genre } from "@/types/genre";
import { Movie } from "@/types/movie";
import { MovieDetail } from "@/types/movieDetail";
import { Trailer } from "@/types/trailer";
import { TMDB_CONFIG } from "./config";

// ==============================
// Types
// ==============================

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type ActorMovieResponse = {
  cast: Movie[];
};

// ==============================
// Core Fetch Helper (Reusable)
// ==============================

const fetchFromTMDB = async <T>(path: string): Promise<T> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}${path}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `TMDB Error ${response.status}: ${response.statusText} - ${errorText}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("TMDB Fetch Failed:", error);
    throw error;
  }
};

// ==============================
// Movie Endpoints
// ==============================

export const fetchTrendings = (page: number = 1) =>
  fetchFromTMDB<MovieResponse>(`/trending/all/day?page=${page}`);

export const fetchLatestMovies = (page: number = 1) =>
  fetchFromTMDB<MovieResponse>(
    `/discover/movie?vote_average.gte=1&vote_average.lte=9&primary_release_year=2026&page=${page}`,
  );

export const fetchTopRatedMovies = (page: number = 1) =>
  fetchFromTMDB<MovieResponse>(`/movie/top_rated?page=${page}`);

export const fetchPopularMovies = (page: number = 1) =>
  fetchFromTMDB<MovieResponse>(`/movie/popular?page=${page}`);

export const fetchMovieDetails = (movieId: string) =>
  fetchFromTMDB<MovieDetail>(`/movie/${movieId}`);

export const fetchMovieVideos = (movieId: string) =>
  fetchFromTMDB<Trailer>(`/movie/${movieId}/videos`);

export const fetchMoviesCasts = (movieId: string) =>
  fetchFromTMDB<Credits>(`/movie/${movieId}/credits`);

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const data = await fetchFromTMDB<{ genres: Genre[] }>(`/genre/movie/list`);
  return data.genres;
};

export const fetchMoviesByGenre = (genreId: number, page: number = 1) =>
  fetchFromTMDB<MovieResponse>(
    `/discover/movie?with_genres=${genreId}&page=${page}`,
  );

export const fetchActorSpecificMovies = (personId: string) =>
  fetchFromTMDB<ActorMovieResponse>(`/person/${personId}/movie_credits`);
