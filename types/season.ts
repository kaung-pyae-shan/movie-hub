export type Season = {
  name: string;
  air_date: string;
  episode_count: number;
  overview: string | null;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
  episodes: Episode[];
};

export type Episode = {
  id: number;
  episode_number: number;
  name: string;
  runtime: number;
  overview: string | null;
};
