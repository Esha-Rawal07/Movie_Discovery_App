import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addWishlist, getWishlist, removeWishlist } from "../services/api.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await getWishlist();
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Wishlist load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const isSaved = (id) => items.some((item) => item.movieId === Number(id));

  const toggleWishlist = async (movie) => {
    if (isSaved(movie.id)) {
      await removeWishlist(movie.id);
      setItems((current) => current.filter((item) => item.movieId !== Number(movie.id)));
      return false;
    }

    const response = await addWishlist(movie);
    setItems((current) => [
      response.data.data,
      ...current.filter((item) => item.movieId !== Number(movie.id))
    ]);
    return true;
  };

  const value = useMemo(
    () => ({ items, loading, isSaved, toggleWishlist }),
    [items, loading]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
