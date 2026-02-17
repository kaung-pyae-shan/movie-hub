export type Serie = {
  id: number;
  name: string;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};