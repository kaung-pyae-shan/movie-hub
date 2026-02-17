const IMAGE_BASE = "https://image.tmdb.org/t/p/";

export const getPoster = (path: string | null) => `${IMAGE_BASE}w500${path}`;