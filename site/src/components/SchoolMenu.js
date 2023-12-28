import React, { useState, useEffect } from 'react';
import './SchoolMenu.css'; // Import the CSS file

const SchoolMenu = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Update the date to the current date
      setDate(new Date());
    }, 86400000); // Update date every 24 hours (adjust as needed)

    // Initial menu load
    fetchMenu();

    return () => clearInterval(timer);
  }, []);

  const fetchMenu = () => {
    // Format the current date to yyyy-mm-dd
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // Construct file paths for today's menu
    const breakfastImagePath = `./breakfast/${formattedDate}.png`;
    const lunchImagePath = `./lunch/${formattedDate}.png`;

    // Fetch the menu images or perform any necessary rendering
    // Example: you can set these paths in the state or render them directly
    console.log('Breakfast Menu Path:', breakfastImagePath);
    console.log('Lunch Menu Path:', lunchImagePath);
  };

  return (
    <div>
      <div className="menu-container">
        <div>
          <center>
            <h3>Breakfast</h3>
          </center>
          {/* You can render the menu images here if needed */}
        </div>
        <div>
          <center>
            <h3>Lunch</h3>
          </center>
          {/* You can render the menu images here if needed */}
        </div>
      </div>
    </div>
  );
};

export default SchoolMenu;
