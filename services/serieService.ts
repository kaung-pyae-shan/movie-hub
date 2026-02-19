import { Serie } from "@/types/serie";
import { TMDB_CONFIG } from "./config";
import { SerieDetail } from "@/types/serieDetail";
import { Credits } from "@/types/credits";
import { Trailer } from "@/types/trailer";
import { Genre } from "@/types/genre";

type SerieResponse = {
   page: number;
   results: Serie[];
   total_pages: number;
   total_results: number;
};

export const fetchLatestSeries = async (
   page: number = 1,
): Promise<SerieResponse> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/on_the_air?page=${page}`;

   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch series: ${response.statusText}`);
   }

   const data: SerieResponse = await response.json();
   return data;
};

export const fetchTopRatedSeries = async (
   page: number = 1,
): Promise<SerieResponse> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/top_rated?page=${page}`;

   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch series: ${response.statusText}`);
   }

   const data: SerieResponse = await response.json();
   return data;
};

export const fetchPopularSeries = async (
   page: number = 1,
): Promise<SerieResponse> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/popular?page=${page}`;

   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch series: ${response.statusText}`);
   }

   const data: SerieResponse = await response.json();
   return data;
};

export const fetchSerieDetails = async (
   serieId: string,
): Promise<SerieDetail> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${serieId}`;

   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch serie details: ${response.statusText}`);
   }

   const data: SerieDetail = await response.json();
   return data;
};

export const fetchSerieVideos = async (
   serieId: string,
): Promise<Trailer> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${serieId}/videos`;
   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch serie videos: ${response.statusText}`);
   }

   const data: Trailer = await response.json();
   return data;
};

export const fetchSerieCasts = async (
   serieId: string,
): Promise<Credits> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${serieId}/credits`;
   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch serie casts: ${response.statusText}`);
   }

   const data: Credits = await response.json();
   return data;
};

export const fetchSerieGenres = async (): Promise<Genre[]> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/genre/tv/list`;
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

export const fetchSeriesByGenre = async (genreId: number, page: number = 1): Promise<SerieResponse> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/tv?with_genres=${genreId}&page=${page}`;
   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch series by genre: ${response.statusText}`);
   }

   const data: SerieResponse = await response.json();
   return data;
};