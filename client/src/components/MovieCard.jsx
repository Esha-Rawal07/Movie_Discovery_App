import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";

const year = (date) => date ? new Date(date).getFullYear() : "—";

export default function MovieCard({ movie }) {
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(movie.id);

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await toggleWishlist(movie);
    } catch (error) {
      console.error("Wishlist update failed:", error);
    }
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative block min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center px-5 text-center text-sm text-zinc-600">
            Poster unavailable
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex justify-end p-3">
          <button
            onClick={handleWishlist}
            className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition ${
              saved
                ? "border-violet-400/40 bg-violet-500 text-white"
                : "border-white/15 bg-black/40 text-white hover:bg-black/70"
            }`}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="space-y-2 p-3.5">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-zinc-100">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{year(movie.releaseDate)}</span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Star size={13} fill="currentColor" className="text-amber-400" />
            {movie.rating ? movie.rating.toFixed(1) : "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}
