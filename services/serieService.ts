import { Credits } from "@/types/credits";
import { Genre } from "@/types/genre";
import { Serie } from "@/types/serie";
import { SerieDetail } from "@/types/serieDetail";
import { Trailer } from "@/types/trailer";
import { TMDB_CONFIG } from "./config";
import { Season } from "@/types/season";

// ==============================
// Types
// ==============================

export type SerieResponse = {
  page: number;
  results: Serie[];
  total_pages: number;
  total_results: number;
};

export type ActorSerieResponse = {
  cast: Serie[];
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
// TV Series Endpoints
// ==============================

export const fetchLatestSeries = (page: number = 1) =>
  fetchFromTMDB<SerieResponse>(`/tv/on_the_air?page=${page}`);

export const fetchTopRatedSeries = (page: number = 1) =>
  fetchFromTMDB<SerieResponse>(`/tv/top_rated?page=${page}`);

export const fetchPopularSeries = (page: number = 1) =>
  fetchFromTMDB<SerieResponse>(`/tv/popular?page=${page}`);

export const fetchSerieDetails = (serieId: string) =>
  fetchFromTMDB<SerieDetail>(`/tv/${serieId}`);

export const fetchSerieVideos = (serieId: string) =>
  fetchFromTMDB<Trailer>(`/tv/${serieId}/videos`);

export const fetchSerieCasts = (serieId: string) =>
  fetchFromTMDB<Credits>(`/tv/${serieId}/credits`);

export const fetchSerieGenres = async (): Promise<Genre[]> => {
  const data = await fetchFromTMDB<{ genres: Genre[] }>(`/genre/tv/list`);
  return data.genres;
};

export const fetchSeriesByGenre = (genreId: number, page: number = 1) =>
  fetchFromTMDB<SerieResponse>(
    `/discover/tv?with_genres=${genreId}&page=${page}`,
  );

export const fetchActorSpecificSeries = (personId: string) =>
  fetchFromTMDB<ActorSerieResponse>(`/person/${personId}/tv_credits`);

export const fetchSeasonDetails = (serieId: string, seasonNumber: number) =>
  fetchFromTMDB<Season>(`/tv/${serieId}/season/${seasonNumber}`);
