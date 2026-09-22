import {
  discoverMovies,
  searchMovies,
  getMovieDetails,
  getGenres
} from "./watchMode.js";
import { getCached, setCached } from "../utils/cache.js";

export const discover = async (params) => {
  const key = `discover:${JSON.stringify(params)}`;
  const cached = getCached(key);
  if (cached) return cached;

  const data = await discoverMovies(params);
  setCached(key, data, 45_000);
  return data;
};

export const search = async (query, page) => {
  const key = `search:${query.toLowerCase()}:${page}`;
  const cached = getCached(key);
  if (cached) return cached;

  const data = await searchMovies(query, page);
  setCached(key, data, 30_000);
  return data;
};

export const details = async (id) => {
  const key = `movie:${id}`;
  const cached = getCached(key);
  if (cached) return cached;

  const data = await getMovieDetails(id);
  setCached(key, data, 5 * 60_000);
  return data;
};

export const genres = async () => {
  const key = "genres";
  const cached = getCached(key);
  if (cached) return cached;

  const data = await getGenres();
  setCached(key, data, 24 * 60 * 60_000);
  return data;
};
