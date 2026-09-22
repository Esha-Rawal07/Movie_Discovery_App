import { Router } from "express";
import {
  listWishlist,
  addToWishlist,
  removeFromWishlist
} from "../controllers/wishlistController.js";

const router = Router();

router.get("/", listWishlist);
router.post("/", addToWishlist);
router.delete("/:movieId", removeFromWishlist);

export default router;
