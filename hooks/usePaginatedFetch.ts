import { useEffect, useState } from "react";

type PaginatedResponse<T> = {
   page: number;
   results: T[];
   total_pages: number;
};

export default function usePaginatedFetch<T>(
   fetchFn: (page: number) => Promise<PaginatedResponse<T>>,
) {
   const [data, setData] = useState<T[]>([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);
   const [hasMore, setHasMore] = useState(true);

   const load = async (pageNumber: number) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
         const res = await fetchFn(pageNumber);

         setData((prev) => {
            const map = new Map<string, T>();

            [...prev, ...res.results].forEach((item: any) => {
               const key = `${item.media_type}-${item.id}`;
               map.set(key, item);
            });

            return Array.from(map.values());
         });

         setHasMore(pageNumber < res.total_pages);
         setPage(pageNumber);
      } catch (err) {
         setError(err as Error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      load(1);
   }, []);

   const loadMore = () => {
      if (hasMore && !loading) {
         load(page + 1);
      }
   };

   return { data, loading, error, loadMore };
}
