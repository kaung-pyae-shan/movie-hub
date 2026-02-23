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
  page: number = 1,
): Promise<SearchResponse> => {
  if (!query.trim()) {
    return { results: { movies: [], series: [], actors: [] }, hasMore: false };
  }

  const encoded = encodeURIComponent(query);
  const opts = { method: "GET", headers: TMDB_CONFIG.headers };

  const [moviesRes, seriesRes, actorsRes] = await Promise.all([
    fetch(
      `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encoded}&page=${page}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      },
    ),
    fetch(`${TMDB_CONFIG.BASE_URL}/search/tv?query=${encoded}&page=${page}`, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }),
    fetch(
      `${TMDB_CONFIG.BASE_URL}/search/person?query=${encoded}&page=${page}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      },
    ),
  ]);

  if (!moviesRes.ok || !seriesRes.ok || !actorsRes.ok) {
    throw new Error("One or more search requests failed");
  }

  const [moviesData, seriesData, actorsData] = await Promise.all([
    moviesRes.json(),
    seriesRes.json(),
    actorsRes.json(),
  ]);

  const hasMore =
    page < moviesData.total_pages ||
    page < seriesData.total_pages ||
    page < actorsData.total_pages;

  return {
    results: {
      movies: moviesData.results ?? [],
      series: seriesData.results ?? [],
      actors: actorsData.results ?? [],
    },
    hasMore,
  };
};
