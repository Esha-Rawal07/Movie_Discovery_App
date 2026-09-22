import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "CineScope API is running"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "cinescope-api"
  });
});

// Browsers request this automatically. Return an empty response instead of
// sending it through the API's JSON 404 handler.
app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.use("/api/movies", movieRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
