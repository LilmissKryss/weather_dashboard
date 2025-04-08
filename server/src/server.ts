import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import the routes
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Add request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, "../../client/dist")));
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to connect the routes
app.use(routes);
// Start the server on the port
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
  console.log(`Environment variables:`);
  console.log(`API_BASE_URL: ${process.env.API_BASE_URL}`);
  console.log(
    `OPENWEATHER_API_KEY: ${
      process.env.OPENWEATHER_API_KEY ? "Set" : "Not set"
    }`
  );
});
