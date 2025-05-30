import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router, Request, Response } from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Route to serve index.html for all routes
router.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
});

export default router;
