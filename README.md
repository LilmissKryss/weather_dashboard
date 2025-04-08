# Weather Dashboard

A weather dashboard application that allows users to search for weather information for different cities. The application displays current weather conditions and a 5-day forecast.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Development](#development)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Search Functionality**: Search for weather by city name
- **Current Weather**: View current weather conditions including:
  - City name and date
  - Weather icon and description
  - Temperature in Fahrenheit
  - Wind speed
  - Humidity percentage
- **5-Day Forecast**: View weather predictions for the next 5 days
- **Search History**: Previously searched cities are saved between sessions
- **History Navigation**: Click on cities in search history to quickly view their weather again
- **History Management**: Delete cities from search history when no longer needed

## Technologies Used

- Frontend:
  - HTML, CSS, TypeScript
  - Vite for bundling
- Backend:
  - Node.js
  - Express.js
  - TypeScript
- APIs:
  - OpenWeather API

#

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the server directory with your OpenWeather API key:
   ```
   API_BASE_URL=https://api.openweathermap.org
   OPENWEATHER_API_KEY=your_api_key_here
   ```
4. Build the application:
   ```
   npm run build
   ```
5. Start the application:
   ```
   npm start
   ```

## Development

To run the application in development mode:

```
npm run dev
```

This will start both the client and server in development mode with hot reloading.

## API Reference

The application provides the following API endpoints:

### Get Search History

```http
GET /api/weather/history
```

Returns all saved cities as JSON.

### Search Weather for City

```http
POST /api/weather
```

### Delete City from History

```http
DELETE /api/weather/history/:id
```

Removes the specified city from search history.

## Deployment

This application is configured for deployment to Render. Follow these steps:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Add the environment variable `OPENWEATHER_API_KEY` with your API key

## License

MIT License
