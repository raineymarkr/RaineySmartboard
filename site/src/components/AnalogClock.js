import './AnalogClock.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function AnalogClock(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hour = date.getHours() * 30 + 180;
  const minute = date.getMinutes() * 6 + 180;
  const second = date.getSeconds() * 6 + 180;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-auto">
          <div className="analog-clock-container d-flex justify-content-center">
            <div className="clock">
              <div
                className="hour-hand"
                style={{ transform: 'rotate(' + hour + 'deg)' }}
              />
              <div
                className="minute-hand"
                style={{ transform: 'rotate(' + minute + 'deg)' }}
              />
              <div
                className="second-hand"
                style={{ transform: 'rotate(' + second + 'deg)' }}
              />
              <div className="brand" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalogClock;
