import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`CineScope API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

start();
