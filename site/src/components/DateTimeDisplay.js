import AnalogClock from './AnalogClock';

import React, { useState, useEffect } from 'react';
const   months = {
  1 : 'January',
  2 : 'February',
  3 : 'March',
  4 : 'April',
  5 : 'May',
  6 : 'June',
  7 : 'July',
  8 : 'August',
  9 : 'September',
  10 : 'October',
  11 : 'November',
  12 : 'December'
}

const DateTimeDisplay = () => {

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months start from 0
    const day = date.getDate();
    return `${months[month]} ${day < 10 ? `0${day}` : day},  ${year}`;
  };

  const getFormattedTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const [currentDate, setCurrentDate] = useState(getFormattedDate(new Date()));
  const [currentTime, setCurrentTime] = useState(getFormattedTime(new Date()));

  

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(getFormattedDate(now));
      setCurrentTime(getFormattedTime(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <center><h1>{currentDate}</h1></center>
      <AnalogClock />
    </div>
  );
};

export default DateTimeDisplay;
