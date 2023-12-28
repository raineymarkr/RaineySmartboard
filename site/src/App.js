import React from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import SchoolMenu from './components/SchoolMenu';
import DateTimeDisplay from './components/DateTimeDisplay';
import UpcomingEvents from './components/UpcomingEvents';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <div className="container main mt-1">
      <div className="row">
        <div className="card col-md-6  bg-info">
          <DateTimeDisplay />
        </div>
        <div className="card col-md-6 bg-info">
          <WeatherDisplay />
        </div>
      </div>
      <div className="row mt-1">
        <div className="card col-md-6 bg-info">
          <SchoolMenu />
        </div>
        <div className="card col-md-6 bg-info">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

export default App;
