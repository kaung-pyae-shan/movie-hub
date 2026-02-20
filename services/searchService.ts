// services/searchService.ts

import { Movie } from "@/types/movie";
import { Person } from "@/types/person";
import { Serie } from "@/types/serie";
import { TMDB_CONFIG } from "./config";

export type SearchResults = {
  movies: Movie[];
  series: Serie[];
  actors: Person[];
};

export type SearchResponse = {
  results: SearchResults;
  hasMore: boolean;
};

export const searchMulti = async (
  query: string,
  page: number = 1
): Promise<SearchResponse> => {
  if (!query.trim()) {
    return { results: { movies: [], series: [], actors: [] }, hasMore: false };
  }

  const endpoint = `${TMDB_CONFIG.BASE_URL}/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();
  const items = data.results ?? [];

  return {
    results: {
      movies: items.filter((r: any) => r.media_type === "movie"),
      series: items.filter((r: any) => r.media_type === "tv"),
      actors: items.filter((r: any) => r.media_type === "person"),
    },
    hasMore: page < data.total_pages,
  };
};