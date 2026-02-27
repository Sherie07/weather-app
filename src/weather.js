import React, { useEffect, useState } from "react";

const API_KEY = "bcca9cf1fda9b7be14a59468d858c91b"; // put your OpenWeather key

function WeatherApp2() {
  const [city, setCity] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  // 🌍 Get weather by coordinates (current location)
  const fetchByCoords = (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then(setCurrent);

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        // pick one forecast per day (every 8th item ≈ 24h)
        const daily = data.list.filter((_, i) => i % 8 === 0);
        setForecast(daily);
      });
  };

  // 📍 Auto load current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => setError("Location access denied ❌")
    );
  }, []);

  // 🔍 Search by city
  const searchCity = () => {
    if (!city) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod !== 200) {
          setError("City not found ❌");
          return;
        }
        setCurrent(data);
        setError("");
        fetchByCoords(data.coord.lat, data.coord.lon);
      });
  };

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <h2>Weather App 🌤️</h2>

      <button onClick={() => setDark(!dark)}>
        {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="search">
        <input
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={searchCity}>Search</button>
      </div>

      {error && <p>{error}</p>}

      {current && (
        <div className="card">
          <h3>{current.name}</h3>
          <p>{current.main.temp}°C</p>
          <p>{current.weather[0].description}</p>
        </div>
      )}

      <div className="forecast">
        {forecast.map((day) => (
          <div key={day.dt} className="forecast-card">
            <p>{new Date(day.dt_txt).toDateString()}</p>
            <p>{day.main.temp}°C</p>
          </div>
        ))}
      </div>

      {/* quick styling */}
      <style>{`
        .app {
          min-height: 100vh;
          padding: 20px;
          font-family: sans-serif;
          background: #f4f4f4;
          color: #222;
        }
        .dark {
          background: #121212;
          color: #fff;
        }
        .search input {
          padding: 8px;
          margin-right: 8px;
        }
        button {
          padding: 8px 12px;
          cursor: pointer;
        }
        .card {
          margin-top: 20px;
          padding: 15px;
          background: #ddd;
          border-radius: 10px;
        }
        .dark .card {
          background: #1e1e1e;
        }
        .forecast {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .forecast-card {
          background: #ccc;
          padding: 10px;
          border-radius: 8px;
        }
        .dark .forecast-card {
          background: #2a2a2a;
        }
      `}</style>
    </div>
  );
}

export default WeatherApp2;
