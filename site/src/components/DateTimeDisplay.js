import React, { useState, useEffect } from 'react';
import Clock from 'react-clock'

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h2>Current Time and Date</h2>
      <Clock />
      <p>{currentDateTime.toLocaleString()}</p>
    </div>
  );
};

export default DateTimeDisplay;
