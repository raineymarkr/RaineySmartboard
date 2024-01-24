import React, { useState, useEffect } from 'react';
import './DateTimeDisplay.css';

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
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
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
      <br></br><br></br>
      <center><h1 className='clock'>{currentTime}</h1></center>
    </div>
  );
};

export default DateTimeDisplay;
