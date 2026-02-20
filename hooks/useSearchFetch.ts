// hooks/useSearchFetch.ts

import { searchMulti, SearchResults } from "@/services/searchService";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 500;

type UseSearchFetchReturn = {
  results: SearchResults;
  loading: boolean;
  loadMore: () => void;
};

const emptyResults: SearchResults = { movies: [], series: [], actors: [] };

const dedupe = <T extends { id: number }>(arr: T[]): T[] =>
  arr.filter((item, i, self) => self.findIndex((x) => x.id === item.id) === i);

export default function useSearchFetch(query: string): UseSearchFetchReturn {
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeQuery = useRef(query);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!query.trim()) {
      setResults(emptyResults);
      setPage(1);
      setHasMore(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      activeQuery.current = query;
      fetchPage(query, 1, true);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const fetchPage = async (q: string, pageNumber: number, reset: boolean) => {
    setLoading(true);
    try {
      const { results: newResults, hasMore: more } = await searchMulti(q, pageNumber);

      if (q !== activeQuery.current) return;

      setResults((prev) =>
        reset
          ? newResults
          : {
              movies: dedupe([...prev.movies, ...newResults.movies]),
              series: dedupe([...prev.series, ...newResults.series]),
              actors: dedupe([...prev.actors, ...newResults.actors]),
            }
      );

      setPage(pageNumber);
      setHasMore(more);
    } catch (e) {
      console.error("Search fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (loading || !hasMore || !query.trim()) return;
    fetchPage(query, page + 1, false);
  };

  return { results, loading, loadMore };
}