import React, { useEffect, useState } from 'react';

const WeatherDisplay = () => {
  const [weather, setWeather] = useState({
    feelslike: null,
    temp: null,
    temp_low: null,
    humidity: null,
    conditionIcon: null,
    conditionText: null
  });

  useEffect(() => {
    const apiKey = '87d88f77e2744a8c9a7195509232612';
    const query = '36609';
    const days = 1;
    const aqi = 'yes';
    const alerts = 'yes';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=${days}&aqi=${aqi}&alerts=${alerts}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setWeather({
          feelslike: data.current.feelslike_f,
          temp: data.forecast.forecastday[0].day.maxtemp_f,
          temp_low: data.forecast.forecastday[0].day.mintemp_f,
          humidity: data.current.humidity,
          conditionIcon: data.current.condition.icon,
          conditionText: data.current.condition.text
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  return (
    <div>
      <center>
      <h2>Weather</h2>
      <p><h3>Temperature High/Low</h3><h4> {weather.temp} °F / {weather.temp_low} °F</h4></p>
      <p><h3>Feels Like</h3> <h4>{weather.feelslike} °F</h4></p>
      <p><h3>Humidity</h3> <h4>{weather.humidity}%</h4></p>
      <p><h3>{weather.conditionText}</h3> {weather.conditionIcon && <img src={`https:${weather.conditionIcon}`} alt="Weather Condition" />}</p>
      </center>
    </div>
  );
};

export default WeatherDisplay;
