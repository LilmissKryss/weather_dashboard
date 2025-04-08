import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const historyFilePath = path.join(__dirname, "../searchHistory.json");

// Define a City class with name and id properties
export interface City {
  id: string;
  name: string;
}

// Complete the HistoryService class
class HistoryService {
  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(historyFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, return empty array
      return [];
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(
      historyFilePath,
      JSON.stringify(cities, null, 2),
      "utf8"
    );
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<City> {
    const cities = await this.read();

    // Check if city already exists
    const existingCity = cities.find(
      (c) => c.name.toLowerCase() === city.toLowerCase()
    );
    if (existingCity) {
      return existingCity;
    }

    // Create new city with unique ID
    const newCity: City = {
      id: Date.now().toString(),
      name: city,
    };

    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
