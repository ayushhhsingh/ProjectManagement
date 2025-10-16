// src/index.js
import "./config/dotenv.js"; // Import and execute dotenv config first
import app from "./app.js";
import connectDB from "./db/database.js";

// Debugging line:
console.log("MONGODB_URI from env:", process.env.MONGO_URI);

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
