import { Router } from "express";
import {
  discoverMovies,
  searchMovies,
  movieDetails,
  movieGenres
} from "../controllers/movieController.js";

const router = Router();

router.get("/discover", discoverMovies);
router.get("/search", searchMovies);
router.get("/genres", movieGenres);
router.get("/:id", movieDetails);

export default router;
