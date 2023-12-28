import React, { useState, useEffect } from 'react';
import './SchoolMenu.css'; // Import the CSS file

const SchoolMenu = () => {
  // Get the current date and format it to yyyy-mm-dd
  const date = new Date();
  // Format the current date to yyyy-mm-dd
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;


  // Construct file paths for today's menu
  const breakfastImagePath = `./breakfast/${formattedDate}.png`;
  const lunchImagePath = `./lunch/${formattedDate}.png`;

  return (
    <div>
      <div className="menu-container">
        <div>
          <center>
            <h3>Breakfast</h3>
          </center>
          <img src={breakfastImagePath} className="img-fluid p-4" alt="Breakfast Menu" />
        </div>
        <div>
          <center>
            <h3>Lunch</h3>
          </center>
          <img src={lunchImagePath} className="img-fluid p-4" alt="Lunch Menu" />
        </div>
      </div>
    </div>
  );
};

export default SchoolMenu;
