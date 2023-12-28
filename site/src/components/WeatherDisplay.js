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
    const fetchWeather = () => {
      const apiKey = '87d88f77e2744a8c9a7195509232612';
      const query = '36609';
      const days = 1;
      const aqi = 'yes';
      const alerts = 'yes';
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=${days}&aqi=${aqi}&alerts=${alerts}`;

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
    };

    // Fetch weather data immediately and then set an interval
    fetchWeather();
    const intervalId = setInterval(fetchWeather, 3600000); // 3600000 milliseconds = 1 hour

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <center>
        <h2><b><u>Temperature High/Low</u></b></h2><h3> {weather.temp} °F / {weather.temp_low} °F</h3>
        <h2><b><u>Feels Like</u></b></h2> <h3>{weather.feelslike} °F</h3>
        <h2><b><u>Humidity</u></b></h2> <h3>{weather.humidity}%</h3>
        <h2>{weather.conditionText}</h2> {weather.conditionIcon && <img src={`https:${weather.conditionIcon}`} alt="Weather Condition" />}
      </center>
    </div>
  );
};

export default WeatherDisplay;
