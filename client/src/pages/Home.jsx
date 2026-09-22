import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getDiscoverMovies,
  getGenres
} from "../services/api.js";
import MovieGrid from "../components/MovieGrid.jsx";
import SkeletonGrid from "../components/SkeletonGrid.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Pagination from "../components/Pagination.jsx";

const sortOptions = [
  ["popularity.desc", "Most Popular"],
  ["vote_average.desc", "Top Rated"],
  ["primary_release_date.desc", "Newest Releases"]
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadMovies = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getDiscoverMovies({ page, genre, sortBy });
      setMovies(response.data.data.results);
      setTotalPages(response.data.data.totalPages);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGenres()
      .then((response) => setGenres(response.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadMovies();
  }, [page, genre, sortBy]);

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="container-page relative py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">
              <Sparkles size={14} /> Curated movie discovery
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Find something worth
              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-200 to-white bg-clip-text text-transparent">
                watching tonight.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Explore popular releases, hidden gems and timeless favorites.
              Search, filter and save the movies you want to come back to.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/search?query="
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
              >
                <PlayCircle size={17} /> Explore movies
              </Link>
              <Link
                to="/wishlist"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold hover:bg-white/[0.08]"
              >
                My wishlist <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-300">DISCOVER</p>
            <h2 className="mt-1 text-2xl font-semibold">Movies for every mood</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <span className="sr-only">Genre</span>
              <select
                value={genre}
                onChange={changeFilter(setGenre)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-3 pr-9 text-sm text-zinc-300 outline-none sm:w-48"
              >
                <option value="">All genres</option>
                {genres.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 text-zinc-500" size={16} />
            </label>

            <label className="relative">
              <span className="sr-only">Sort movies</span>
              <select
                value={sortBy}
                onChange={changeFilter(setSortBy)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-3 pr-9 text-sm text-zinc-300 outline-none sm:w-48"
              >
                {sortOptions.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 text-zinc-500" size={16} />
            </label>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState onRetry={loadMovies} />
        ) : movies.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">No movies match these filters.</div>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
