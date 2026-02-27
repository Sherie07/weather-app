import React, { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState("");
  const [error, setError] = useState("");

  const API_KEY = "bcca9cf1fda9b7be14a59468d858c91b";

  const getWeather = () => {
    if (!city) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "404") {
          setError("City not found ❌");
          setTemp(null);
        } else {
          setTemp(data.main.temp);
          setError("");
        }
      });
  };

  return (
    <div>
      <h2>Weather App 🌤️</h2>

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>Search</button>

      {temp && <h3>Temperature: {temp}°C</h3>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Weather;
