import { Link, NavLink, useNavigate } from "react-router-dom";
import { Film, Heart, Search, Sparkles } from "lucide-react";
import { useWishlist } from "../context/WishlistContext.jsx";

const linkClass = ({ isActive }) =>
  `text-sm transition ${isActive ? "text-white" : "text-zinc-400 hover:text-white"}`;

export default function Navbar() {
  const navigate = useNavigate();
  const { items } = useWishlist();

  const submitSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")?.trim();
    if (query) navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
            <Film size={19} />
          </span>
          <span className="hidden sm:inline">CineScope</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink to="/" className={linkClass}>Discover</NavLink>
          <NavLink to="/wishlist" className={linkClass}>Wishlist</NavLink>
        </nav>

        <form onSubmit={submitSearch} className="ml-auto flex min-w-0 max-w-md flex-1">
          <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3">
            <Search size={17} className="shrink-0 text-zinc-500" />
            <input
              name="query"
              aria-label="Search movies"
              placeholder="Search movies..."
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-zinc-600"
            />
          </div>
        </form>

        <Link
          to="/wishlist"
          className="relative rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Wishlist"
        >
          <Heart size={20} />
          {items.length > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white">
              {items.length}
            </span>
          )}
        </Link>

        <span className="hidden text-zinc-500 sm:block" title="Discovery powered by Watchmode">
          <Sparkles size={17} />
        </span>
      </div>
    </header>
  );
}
