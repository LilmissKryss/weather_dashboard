import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: "City name is required" });
    }

    // Save city to search history
    await HistoryService.addCity(cityName);

    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    res.json(weatherData);
  } catch (error) {
    console.error("Error in POST /api/weather:", error);
    res.status(500).json({ error: "Failed to retrieve weather data" });
  }
});

// GET search history
router.get("/history", async (req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error("Error in GET /api/weather/history:", error);
    res.status(500).json({ error: "Failed to retrieve search history" });
  }
});

// DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(200).json({ message: "City removed from history" });
  } catch (error) {
    console.error("Error in DELETE /api/weather/history/:id:", error);
    res.status(500).json({ error: "Failed to delete city from history" });
  }
});

export default router;
