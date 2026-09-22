import * as movieService from "../services/movieService.js";

export const discoverMovies = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const genre = req.query.genre || "";
    const sortBy = req.query.sortBy || "popularity.desc";

    const data = await movieService.discover({ page, genre, sortBy });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const searchMovies = async (req, res, next) => {
  try {
    const query = String(req.query.query || "").trim();
    const page = Math.max(1, Number(req.query.page) || 1);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const data = await movieService.search(query, page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const movieDetails = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie id"
      });
    }

    const data = await movieService.details(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const movieGenres = async (_req, res, next) => {
  try {
    const data = await movieService.genres();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
