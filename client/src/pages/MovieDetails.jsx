import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock3, Heart, Star } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMovie } from "../services/api.js";
import { useWishlist } from "../context/WishlistContext.jsx";

const formatRuntime = (minutes) => {
  if (!minutes) return "Runtime unavailable";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleWishlist } = useWishlist();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);

    getMovie(id)
      .then((response) => {
        if (active) setMovie(response.data.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container-page py-16">
        <div className="h-[520px] animate-pulse rounded-3xl bg-white/5" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold">Movie unavailable</h1>
        <p className="mt-2 text-zinc-500">We couldn't load this movie right now.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950"
        >
          Go back
        </button>
      </div>
    );
  }

  const saved = isSaved(movie.id);

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        {movie.backdropUrl && (
          <img
            src={movie.backdropUrl}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/65" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />

        <div className="container-page py-8 sm:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={16} /> Back to discover
          </Link>

          <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={`${movie.title} poster`} className="aspect-[2/3] w-full object-cover" />
              ) : (
                <div className="grid aspect-[2/3] place-items-center text-zinc-600">Poster unavailable</div>
              )}
            </div>

            <div className="flex max-w-3xl flex-col justify-end">
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <span key={genre.id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    {genre.name}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{movie.title}</h1>
              {movie.tagline && <p className="mt-3 text-lg italic text-zinc-400">“{movie.tagline}”</p>}

              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-200">
                  <Star size={16} fill="currentColor" className="text-amber-400" />
                  {movie.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> {movie.releaseDate || "Release date unavailable"}</span>
                <span className="flex items-center gap-1.5"><Clock3 size={16} /> {formatRuntime(movie.runtime)}</span>
              </div>

              <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300">
                {movie.overview}
              </p>

              <button
                onClick={() => toggleWishlist(movie)}
                className={`mt-8 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  saved
                    ? "bg-violet-500 text-white hover:bg-violet-400"
                    : "bg-white text-zinc-950 hover:bg-zinc-200"
                }`}
              >
                <Heart size={17} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved to wishlist" : "Add to wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {movie.cast?.length > 0 && (
        <section className="container-page py-12">
          <h2 className="text-xl font-semibold">Top cast</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {movie.cast.map((person) => (
              <div key={person.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="aspect-[3/4] bg-zinc-900">
                  {person.profileUrl && <img src={person.profileUrl} alt={person.name} className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-medium">{person.name}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{person.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
