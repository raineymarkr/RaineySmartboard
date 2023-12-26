
import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';

const UpcomingEvents = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const clientId = "878017870557-5hrui1i1f6efnskq9m59eeb7kkk1sglg.apps.googleusercontent.com";
  useEffect(() => {
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', initGoogleSignIn);
    };
    document.body.appendChild(script);
  }, []);

  const initGoogleSignIn = () => {
    window.gapi.client.init({
      clientId: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
    });
  };

  const handleLogin = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then(googleUser => {
      const token = googleUser.getAuthResponse().id_token;
      setIsLoggedIn(true);
      getEvents(token);
    }).catch(error => {
      console.error('Login failed:', error);
      alert('Failed to login.');
    });
  };

  const getEvents = (accessToken) => {
    const today = new Date().toISOString();
    fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${today}&singleEvents=true&orderBy=startTime`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setEvents(data.items); // Store the events in the state
    })
    .catch(error => console.error('Error fetching events', error));
  };

  return (
    <div>
      {!isLoggedIn ? (
         <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <div>
          <h2>Your Events</h2>
          <ul>
            {events.map(event => (
              <li key={event.id}>{event.summary} - {new Date(event.start.dateTime).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
