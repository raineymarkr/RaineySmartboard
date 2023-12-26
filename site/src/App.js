import React from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import SchoolMenu from './components/SchoolMenu';
import DateTimeDisplay from './components/DateTimeDisplay';
import UpcomingEvents from './components/UpcomingEvents';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="card col-md-6">
          <DateTimeDisplay />
        </div>
        <div className="card col-md-6">
          <WeatherDisplay />
        </div>
      </div>
      <div className="row mt-4">
        <div className="card col-md-6">
          <SchoolMenu />
        </div>
        <div className="card col-md-6">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

export default App;
