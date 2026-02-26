const IMAGE_BASE = "https://image.tmdb.org/t/p/";

// Get the full image url
export const getPoster = (path: string | null) => `${IMAGE_BASE}w500${path}`;
