export type SerieDetail = {
  adult: boolean;
  backdrop_path: string | null;
  episode_run_time: number[];
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  name: string;
  overview: string | null;
  poster_path: string | null;
  seasons: {
    air_date: string;
    episode_count: number;
    overview: string | null;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
  vote_average: number;
  vote_count: number;
}