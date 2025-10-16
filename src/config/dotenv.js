// filepath: src/config/dotenv.js
import dotenv from "dotenv";
import path from "path";

// process.cwd() gives the root directory where you run the 'node' command
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
