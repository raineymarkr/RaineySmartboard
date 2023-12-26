import React, { useState, useEffect } from 'react';
import './SchoolMenu.css'; // Import the CSS file

const SchoolMenu = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 86400000); // Update date every 24 hours
    return () => clearInterval(timer);
  }, []);

  // Format the date to yyyy-mm-dd
  const formattedDate = date.toISOString().split('T')[0];

  // Construct file paths
  const breakfastImagePath = `./breakfast/${formattedDate}.png`;
  const lunchImagePath = `./lunch/${formattedDate}.png`;

  return (
    <div>
      <div className="menu-container">
        <div>
          <center>
          <h3>Breakfast</h3>
          </center>
          <img src={breakfastImagePath} alt="Breakfast Menu" />
        </div>
        <div>
          <center>
          <h3>Lunch</h3>
          </center>
          <img src={lunchImagePath} alt="Lunch Menu" />
        </div>
      </div>
    </div>
  );
};

export default SchoolMenu;
