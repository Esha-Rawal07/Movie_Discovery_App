import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext.jsx";
import MovieGrid from "../components/MovieGrid.jsx";
import SkeletonGrid from "../components/SkeletonGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Wishlist() {
  const { items, loading } = useWishlist();

  return (
    <section className="container-page py-10 sm:py-14">
      <div>
        <p className="text-sm font-medium text-violet-300">YOUR COLLECTION</p>
        <h1 className="mt-2 text-3xl font-semibold">Wishlist</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Movies you saved for another night.
        </p>
      </div>

      <div className="mt-9">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
            <Heart className="mx-auto mb-4 text-zinc-600" size={42} />
            <h2 className="text-lg font-semibold">Your wishlist is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Save movies while exploring and they'll stay here even after you close the browser.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950"
            >
              Discover movies
            </Link>
          </div>
        ) : (
          <MovieGrid
            movies={items.map((item) => ({
              id: item.movieId,
              title: item.title,
              posterUrl: item.posterUrl,
              backdropUrl: item.backdropUrl,
              releaseDate: item.releaseDate,
              rating: item.rating,
              overview: item.overview
            }))}
          />
        )}
      </div>
    </section>
  );
}
