export type Movie = {
  id: number;
  title: string;
  name: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  media_type: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};