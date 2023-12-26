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
      <h2>Weather</h2>
      <p>Temperature High/Low: {weather.temp} °F / {weather.temp_low} °F</p>
      <p>Feels Like: {weather.feelslike} °F</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Condition: {weather.conditionText}</p>
      {weather.conditionIcon && <img src={`https:${weather.conditionIcon}`} alt="Weather Condition" />}
    </div>
  );
};

export default WeatherDisplay;
