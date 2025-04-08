import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
}

// Define a class for the Weather object
interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

// Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseURL = "https://api.openweathermap.org/data/2.5";
  private geocodeURL = "https://api.openweathermap.org/geo/1.0";
  private apiKey = process.env.OPENWEATHER_API_KEY || "";
  private cityName = "";

  // Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geocodeQuery = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeQuery);
    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.statusText}`);
    }
    return await response.json();
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error("No location data found");
    }
    const { lat, lon, name } = locationData[0];
    return { lat, lon, name };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.geocodeURL}/direct?q=${encodeURIComponent(
      query
    )}&limit=1&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(
    city: string
  ): Promise<Coordinates> {
    const locationData = (await this.fetchLocationData(city)) as any[];
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return await response.json();
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any, cityName: string): Weather {
    const currentWeather = response.list[0];
    const date = new Date(currentWeather.dt * 1000).toLocaleDateString();

    return {
      city: cityName,
      date,
      icon: currentWeather.weather[0].icon,
      iconDescription: currentWeather.weather[0].description,
      tempF: Math.round(currentWeather.main.temp),
      windSpeed: Math.round(currentWeather.wind.speed),
      humidity: currentWeather.main.humidity,
    };
  }

  // Complete buildForecastArray method
  private buildForecastArray(
    currentWeather: Weather,
    weatherData: any
  ): Weather[] {
    const forecastArray: Weather[] = [currentWeather];

    // Get one forecast per day for the next 5 days
    const dailyForecasts = new Map<string, any>();

    // Start from index 1 to skip the current day's forecast
    for (let i = 1; i < weatherData.list.length; i++) {
      const forecast = weatherData.list[i];
      const forecastDate = new Date(forecast.dt * 1000);
      const dateString = forecastDate.toLocaleDateString();

      // Only take the first forecast for each day
      if (
        !dailyForecasts.has(dateString) &&
        forecastDate.getDate() !== new Date().getDate()
      ) {
        dailyForecasts.set(dateString, forecast);
      }

      // Stop once we have 5 days
      if (dailyForecasts.size >= 5) {
        break;
      }
    }

    // Convert the map to an array of Weather objects
    dailyForecasts.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();

      forecastArray.push({
        city: currentWeather.city,
        date,
        icon: forecast.weather[0].icon,
        iconDescription: forecast.weather[0].description,
        tempF: Math.round(forecast.main.temp),
        windSpeed: Math.round(forecast.wind.speed),
        humidity: forecast.main.humidity,
      });
    });

    return forecastArray;
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      console.log(`Getting weather for city: ${city}`);
      console.log(
        `API Key: ${this.apiKey.substring(0, 3)}...${this.apiKey.substring(
          this.apiKey.length - 3
        )}`
      );

      this.cityName = city;
      console.log("Fetching location data...");
      const coordinates = await this.fetchAndDestructureLocationData(city);
      console.log(`Location data: ${JSON.stringify(coordinates)}`);

      console.log("Fetching weather data...");
      const weatherData = await this.fetchWeatherData(coordinates);
      console.log("Weather data received");

      const currentWeather = this.parseCurrentWeather(
        weatherData,
        coordinates.name
      );
      console.log(`Current weather: ${JSON.stringify(currentWeather)}`);

      return this.buildForecastArray(currentWeather, weatherData);
    } catch (error) {
      console.error("Error getting weather data:", error);
      throw error;
    }
  }
}

export default new WeatherService();
