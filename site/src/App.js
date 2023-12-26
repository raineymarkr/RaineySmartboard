import logo from './logo.svg';
import React from 'react';
import SchoolMenu from './components/SchoolMenu';
import WeatherDisplay from './components/WeatherDisplay';
import DateTimeDisplay from './components/DateTimeDisplay';
import PhotoDisplay from './components/PhotoDisplay';
import './App.css';

function App() {
  return (
    <div className="App">
      <DateTimeDisplay />
      <WeatherDisplay />
      <SchoolMenu />
      <PhotoDisplay />
    </div>
  );
}

export default App;



