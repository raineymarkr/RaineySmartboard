import React, { useState, useEffect } from 'react';
import './SchoolMenu.css'; // Import the CSS file

const SchoolMenu = () => {
  const [date, setDate] = useState(new Date());
  const [breakfastImagePath, setBreakfastImagePath] = useState('');
  const [lunchImagePath, setLunchImagePath] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      // Update the date to the current date
      setDate(new Date());
    }, 1800000); // Update date every 24 hours (adjust as needed)

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
    const newBreakfastImagePath = `./breakfast/${formattedDate}.png`;
    const newLunchImagePath = `./lunch/${formattedDate}.png`;

    // Set the menu paths in state
    setBreakfastImagePath(newBreakfastImagePath);
    setLunchImagePath(newLunchImagePath);
  };

  return (
    <div>
      <div className="menu-container">
        <div>
          <center>
            <h3>Breakfast</h3>
          <img src={breakfastImagePath} className="menu-image p-4" alt="Breakfast Menu" />
          </center>
        </div>
        <div>
          <center>
            <h3>Lunch</h3>

          <img src={lunchImagePath} className="menu-image p-4" alt="Lunch Menu" />
          </center>
        </div>
      </div>
    </div>
  );
};

export default SchoolMenu;
