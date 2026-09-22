const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const headers = () => ({
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  accept: "application/json"
});

const request = async (path, params = {}) => {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    const error = new Error("TMDB_ACCESS_TOKEN is missing");
    error.status = 500;
    throw error;
  }

  const query = new URLSearchParams(params);
  const url = `${BASE_URL}${path}?${query.toString()}`;

  const response = await fetch(url, {
    headers: headers(),
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) {
    const error = new Error(`TMDB request failed with status ${response.status}`);
    error.status = response.status === 429 ? 503 : 502;
    throw error;
  }

  return response.json();
};

const posterUrl = (path, size = "w500") =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title || movie.original_title || "Untitled",
  overview: movie.overview || "No overview is available for this movie.",
  posterUrl: posterUrl(movie.poster_path),
  backdropUrl: posterUrl(movie.backdrop_path, "w1280"),
  releaseDate: movie.release_date || null,
  rating: Number(movie.vote_average || 0),
  voteCount: Number(movie.vote_count || 0),
  popularity: Number(movie.popularity || 0),
  genreIds: Array.isArray(movie.genre_ids) ? movie.genre_ids : []
});

export const discoverMovies = async (params) => {
  const data = await request("/discover/movie", {
    language: "en-US",
    include_adult: "false",
    page: String(params.page || 1),
    sort_by: params.sortBy || "popularity.desc",
    ...(params.genre ? { with_genres: params.genre } : {})
  });

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: (data.results || []).map(normalizeMovie)
  };
};

export const searchMovies = async (query, page = 1) => {
  const data = await request("/search/movie", {
    language: "en-US",
    include_adult: "false",
    query,
    page: String(page)
  });

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: (data.results || []).map(normalizeMovie)
  };
};

export const getMovieDetails = async (id) => {
  const movie = await request(`/movie/${id}`, {
    language: "en-US",
    append_to_response: "credits"
  });

  return {
    ...normalizeMovie(movie),
    tagline: movie.tagline || "",
    runtime: movie.runtime || null,
    genres: (movie.genres || []).map((genre) => ({
      id: genre.id,
      name: genre.name
    })),
    cast: (movie.credits?.cast || []).slice(0, 8).map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character || "",
      profileUrl: posterUrl(person.profile_path, "w185")
    }))
  };
};

export const getGenres = async () => {
  const data = await request("/genre/movie/list", {
    language: "en-US"
  });

  return data.genres || [];
};
