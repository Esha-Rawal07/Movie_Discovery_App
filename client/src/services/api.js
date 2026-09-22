import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000
});

export const getDiscoverMovies = (params = {}, signal) =>
  api.get("/movies/discover", { params, signal });

export const searchMovies = (params = {}, signal) =>
  api.get("/movies/search", { params, signal });

export const getMovie = (id) => api.get(`/movies/${id}`);
export const getGenres = () => api.get("/movies/genres");

export const getWishlist = () => api.get("/wishlist");
export const addWishlist = (movie) => api.post("/wishlist", movie);
export const removeWishlist = (id) => api.delete(`/wishlist/${id}`);
