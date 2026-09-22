import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/api.js";
import MovieGrid from "../components/MovieGrid.jsx";
import SkeletonGrid from "../components/SkeletonGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("query") || "";
  const [input, setInput] = useState(query);
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const [data, setData] = useState({ results: [], totalPages: 1, totalResults: 0 });
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState(false);

  useEffect(() => {
    setInput(query);
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setData({ results: [], totalPages: 1, totalResults: 0 });
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await searchMovies(
          { query, page },
          controller.signal
        );
        setData(response.data.data);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, page]);

  const submit = (event) => {
    event.preventDefault();
    setParams(input.trim() ? { query: input.trim(), page: "1" } : {});
  };

  const heading = useMemo(
    () => query ? `Results for “${query}”` : "Search the library",
    [query]
  );

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-violet-300">SEARCH</p>
        <h1 className="mt-2 text-3xl font-semibold">{heading}</h1>

        <form onSubmit={submit} className="mt-6 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3">
            <SearchIcon size={18} className="text-zinc-500" />
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Try “Interstellar”, “comedy”, or a title..."
              className="w-full bg-transparent py-3 outline-none placeholder:text-zinc-600"
            />
          </div>
          <button className="rounded-xl bg-white px-5 font-semibold text-zinc-950 hover:bg-zinc-200">
            Search
          </button>
        </form>
      </div>

      <div className="mt-10">
        {!query ? (
          <EmptyState
            title="What are you in the mood for?"
            message="Search for a title to start exploring the movie library."
          />
        ) : loading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState onRetry={() => setParams({ query, page: String(page) })} />
        ) : data.results.length === 0 ? (
          <EmptyState
            title="No movies found"
            message={`We couldn't find a movie matching “${query}”. Try another title.`}
          />
        ) : (
          <>
            <p className="mb-5 text-sm text-zinc-500">
              {data.totalResults.toLocaleString()} results
            </p>
            <MovieGrid movies={data.results} />
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onChange={(nextPage) => {
                setPage(nextPage);
                setParams({ query, page: String(nextPage) });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
