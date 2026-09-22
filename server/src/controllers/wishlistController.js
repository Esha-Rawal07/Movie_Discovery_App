import Wishlist from "../models/Wishlist.js";

export const listWishlist = async (_req, res, next) => {
  try {
    const movies = await Wishlist.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const {
      id,
      title,
      posterUrl,
      backdropUrl,
      releaseDate,
      rating,
      overview
    } = req.body;

    if (!id || !title) {
      return res.status(400).json({
        success: false,
        message: "Movie id and title are required"
      });
    }

    const movie = await Wishlist.findOneAndUpdate(
      { movieId: id },
      {
        movieId: id,
        title,
        posterUrl: posterUrl || null,
        backdropUrl: backdropUrl || null,
        releaseDate: releaseDate || null,
        rating: Number(rating || 0),
        overview: overview || ""
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie id"
      });
    }

    await Wishlist.deleteOne({ movieId });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
