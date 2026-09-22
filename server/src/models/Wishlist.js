import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    movieId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    posterUrl: {
      type: String,
      default: null
    },
    backdropUrl: {
      type: String,
      default: null
    },
    releaseDate: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      default: 0
    },
    overview: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
