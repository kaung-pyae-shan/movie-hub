// import { Credits } from "@/types/credits";
// import { Genre } from "@/types/genre";
// import { Serie } from "@/types/serie";
// import { SerieDetail } from "@/types/serieDetail";
// import { Trailer } from "@/types/trailer";
// import { TMDB_CONFIG } from "./config";

// type SerieResponse = {
//   page: number;
//   results: Serie[];
//   total_pages: number;
//   total_results: number;
// };

// type ActorSerieResponse = {
//   cast: Serie[];
// };

// export const fetchLatestSeries = async (
//   page: number = 1,
// ): Promise<SerieResponse> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/on_the_air?page=${page}`;

//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch series: ${response.statusText}`);
//   }

//   const data: SerieResponse = await response.json();
//   return data;
// };

// export const fetchTopRatedSeries = async (
//   page: number = 1,
// ): Promise<SerieResponse> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/top_rated?page=${page}`;

//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch series: ${response.statusText}`);
//   }

//   const data: SerieResponse = await response.json();
//   return data;
// };

// export const fetchPopularSeries = async (
//   page: number = 1,
// ): Promise<SerieResponse> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/popular?page=${page}`;

//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch series: ${response.statusText}`);
//   }

//   const data: SerieResponse = await response.json();
//   return data;
// };

// export const fetchSerieDetails = async (
//   serieId: string,
// ): Promise<SerieDetail> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${serieId}`;

//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch serie details: ${response.statusText}`);
//   }

//   const data: SerieDetail = await response.json();
//   return data;
// };

// export const fetchSerieVideos = async (serieId: string): Promise<Trailer> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${serieId}/videos`;
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch serie videos: ${response.statusText}`);
//   }

//   const data: Trailer = await response.json();
//   return data;
// };

// export const fetchSerieCasts = async (serieId: string): Promise<Credits> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${serieId}/credits`;
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch serie casts: ${response.statusText}`);
//   }

//   const data: Credits = await response.json();
//   return data;
// };

// export const fetchSerieGenres = async (): Promise<Genre[]> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/genre/tv/list`;
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch movie genres: ${response.statusText}`);
//   }

//   const data: { genres: Genre[] } = await response.json();
//   return data.genres;
// };

// export const fetchSeriesByGenre = async (
//   genreId: number,
//   page: number = 1,
// ): Promise<SerieResponse> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/tv?with_genres=${genreId}&page=${page}`;
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch series by genre: ${response.statusText}`);
//   }

//   const data: SerieResponse = await response.json();
//   return data;
// };

// export const fetchActorSpecificSeries = async (
//   personId: string,
// ): Promise<ActorSerieResponse> => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/person/${personId}/tv_credits`;

//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch series: ${response.statusText}`);
//   }

//   const data: ActorSerieResponse = await response.json();
//   return data;
// };

// export const fetchSeasonDetails = async (
//   serieId: string,
//   seasonNumber: number,
// ) => {
//   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${serieId}/season/${seasonNumber}`;
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) throw new Error("Failed to fetch season details");

//   return response.json();
// };

import { Credits } from "@/types/credits";
import { Genre } from "@/types/genre";
import { Serie } from "@/types/serie";
import { SerieDetail } from "@/types/serieDetail";
import { Trailer } from "@/types/trailer";
import { TMDB_CONFIG } from "./config";

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
  fetchFromTMDB<any>( // you can replace `any` with a SeasonDetail type if you have one
    `/tv/${serieId}/season/${seasonNumber}`,
  );
