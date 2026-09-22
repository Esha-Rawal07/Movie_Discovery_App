const BASE_URL = "https://api.watchmode.com/v1";

const getApiKey = () =>
  process.env.Watch_MODE_API ||
  process.env.WATCH_MODE_API ||
  process.env.WATCHMODE_API_KEY ||
  "";

const request = async (path, params = {}) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    const error = new Error("Watchmode API key is missing");
    error.status = 500;
    throw error;
  }

  const query = new URLSearchParams({
    apiKey,
    ...Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    )
  });

  const response = await fetch(`${BASE_URL}${path}?${query.toString()}`, {
    headers: {
      accept: "application/json"
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    let message = `Watchmode request failed with status ${response.status}`;

    try {
      const body = await response.json();
      message = body?.message || body?.error || message;
    } catch {
      // Keep the default message when the API does not return JSON.
    }

    const error = new Error(message);
    error.status = response.status === 429 ? 503 : 502;
    throw error;
  }

  return response.json();
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const normalizeGenre = (genre, index) => {
  if (typeof genre === "string") {
    return {
      id: genre.toLowerCase().replace(/\s+/g, "-"),
      name: genre
    };
  }

  if (genre && typeof genre === "object") {
    return {
      id: firstValue(genre.id, genre.genre_id, index),
      name: firstValue(genre.name, genre.genre_name, "Unknown")
    };
  }

  return {
    id: index,
    name: "Unknown"
  };
};

const normalizeGenres = (movie) => {
  const genres =
    movie.genres ||
    movie.genre_names ||
    movie.genre_ids ||
    [];

  if (!Array.isArray(genres)) return [];

  return genres.map(normalizeGenre);
};

const normalizeMovie = (movie) => {
  const genres = normalizeGenres(movie);

  return {
    id: toNumber(movie.id, movie.id),
    title: firstValue(movie.name, movie.title, "Untitled"),
    overview: firstValue(
      movie.plot_overview,
      movie.overview,
      movie.plot_synopsis,
      "No overview is available for this movie."
    ),
    posterUrl: firstValue(
      movie.poster,
      movie.poster_url,
      movie.posterUrl,
      movie.image_url,
      movie.imageUrl,
      movie.thumbnail,
      movie.thumbnail_url,
      null
    ),
    backdropUrl: firstValue(
      movie.backdrop,
      movie.backdrop_url,
      movie.backdropUrl,
      movie.backdrop_image,
      movie.backdrop_image_url,
      null
    ),
    releaseDate: firstValue(
      movie.release_date,
      movie.releaseDate,
      movie.year ? `${movie.year}-01-01` : null,
      null
    ),
    rating: toNumber(
      firstValue(movie.user_rating, movie.rating, movie.critic_score, 0)
    ),
    voteCount: toNumber(
      firstValue(movie.user_ratings_count, movie.vote_count, 0)
    ),
    popularity: toNumber(
      firstValue(
        movie.popularity,
        movie.relevance_percentile,
        movie.relevance_percentile_90,
        0
      )
    ),
    genreIds: genres.map((genre) => genre.id),
    genres
  };
};

const enrichWithDetails = async (movies) => {
  const enriched = [...movies];
  const concurrency = 5;

  for (let start = 0; start < enriched.length; start += concurrency) {
    const batch = enriched.slice(start, start + concurrency);

    const detailed = await Promise.all(
      batch.map(async (movie) => {
        if (movie.posterUrl || movie.backdropUrl) return movie;

        try {
          const details = await request(`/title/${encodeURIComponent(movie.id)}/details/`);
          return {
            ...movie,
            posterUrl: firstValue(
              details.poster,
              details.poster_url,
              details.posterUrl,
              details.image_url,
              details.imageUrl,
              details.thumbnail,
              details.thumbnail_url,
              null
            ),
            backdropUrl: firstValue(
              details.backdrop,
              details.backdrop_url,
              details.backdropUrl,
              details.backdrop_image,
              details.backdrop_image_url,
              null
            ),
            overview: firstValue(
              details.plot_overview,
              details.overview,
              movie.overview
            ),
            releaseDate: firstValue(
              details.release_date,
              details.releaseDate,
              movie.releaseDate
            ),
            rating: toNumber(
              firstValue(details.user_rating, details.rating, details.critic_score, movie.rating),
              movie.rating
            )
          };
        } catch (error) {
          console.warn(`Could not load images for movie ${movie.id}: ${error.message}`);
          return movie;
        }
      })
    );

    enriched.splice(start, batch.length, ...detailed);
  }

  return enriched;
};

const sortMovies = (movies, sortBy) => {
  const sorted = [...movies];

  if (sortBy === "vote_average.desc") {
    return sorted.sort((a, b) => b.rating - a.rating);
  }

  if (sortBy === "primary_release_date.desc") {
    return sorted.sort(
      (a, b) =>
        new Date(b.releaseDate || 0).getTime() -
        new Date(a.releaseDate || 0).getTime()
    );
  }

  return sorted.sort((a, b) => b.popularity - a.popularity);
};

export const discoverMovies = async (params = {}) => {
  const page = Math.max(1, Number(params.page) || 1);

  const data = await request("/list-titles/", {
    types: "movie",
    page,
    limit: 20
  });

  let results = (data.titles || []).map(normalizeMovie);
  results = await enrichWithDetails(results);

  if (params.genre) {
    const genreValue = String(params.genre).toLowerCase();

    results = results.filter((movie) =>
      movie.genreIds.some(
        (id) => String(id).toLowerCase() === genreValue
      )
    );
  }

  results = sortMovies(results, params.sortBy);

  return {
    page,
    totalPages: Math.max(1, Number(data.total_pages) || 1),
    totalResults: Number(data.total_results) || results.length,
    results
  };
};

export const searchMovies = async (query, page = 1) => {
  const data = await request("/search/", {
    search_field: "name",
    search_value: query,
    types: "movie"
  });

  let allResults = (data.title_results || [])
    .filter((movie) => !movie.type || movie.type === "movie")
    .map(normalizeMovie);

  allResults = await enrichWithDetails(allResults.slice(0, 20));

  const pageSize = 20;
  const currentPage = Math.max(1, Number(page) || 1);
  const start = (currentPage - 1) * pageSize;

  return {
    page: currentPage,
    totalPages: Math.max(1, Math.ceil(allResults.length / pageSize)),
    totalResults: allResults.length,
    results: allResults.slice(start, start + pageSize)
  };
};

export const getMovieDetails = async (id) => {
  const movie = await request(`/title/${encodeURIComponent(id)}/details/`, {
    append_to_response: "sources"
  });

  const normalized = normalizeMovie(movie);

  return {
    ...normalized,
    tagline: firstValue(movie.tagline, ""),
    runtime: toNumber(firstValue(movie.runtime_minutes, movie.runtime, 0), 0) || null,
    genres: normalizeGenres(movie),
    cast: Array.isArray(movie.cast)
      ? movie.cast.slice(0, 8).map((person, index) => ({
          id: firstValue(person.id, person.person_id, index),
          name: firstValue(person.name, "Unknown"),
          character: firstValue(
            person.character,
            person.role,
            person.character_name,
            ""
          ),
          profileUrl: firstValue(
            person.headshot,
            person.headshot_url,
            person.profile_url,
            null
          )
        }))
      : [],
    sources: Array.isArray(movie.sources)
      ? movie.sources.map((source) => ({
          sourceId: source.source_id,
          name: source.name,
          type: source.type,
          region: source.region,
          webUrl: source.web_url || source.webUrl || null
        }))
      : []
  };
};

export const getGenres = async () => {
  const data = await request("/genres/");
  return Array.isArray(data) ? data : data.genres || [];
};
