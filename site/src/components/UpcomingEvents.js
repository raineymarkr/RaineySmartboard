import React, { useState, useEffect } from 'react';
import './UpcomingEvents.css'


const UpcomingEvents = () => {
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGisLoaded, setIsGisLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [events, setEvents] = useState([]);
  const [buttonText, setButtonText] = useState('Authorize');
  const [dateOffset, setDateOffset] = useState(0);
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_API_KEY;
  
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  useEffect(() => {
    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);
    if (isGapiLoaded)
    {  // Check for existing token in local storage
      const existingToken = localStorage.getItem('gapi_token');
      if (existingToken && isTokenValid()) {
        window.gapi.client.setToken({ access_token: existingToken });
        setIsAuthorized(true);
      } else if (existingToken) {
        // Token exists but is expired, handle re-authentication
        handleAuthClick();
      }

      const fetchEvents = async () => {
        if (isAuthorized && isTokenValid()) {
          await listUpcomingEvents();
        } else if (isAuthorized && !isTokenValid()) {
          // Token is expired. Handle re-authentication or token refresh.
          handleAuthClick(); // Example: Prompt for re-authentication
        }
      };

      if (isAuthorized) {
        fetchEvents();
      }

      const intervalId = setInterval(fetchEvents, 600000);

      return () => clearInterval(intervalId);}
  }, [isAuthorized, isGapiLoaded]);// Add isAuthorized to dependency array to re-run effect when authorization changes


  const loadScript = (url, callback) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.body.appendChild(script);
  };

  const gapiLoaded = () => {
    window.gapi.load('client', initializeGapiClient);
  };

  const gisLoaded = () => {
    setIsGisLoaded(true);
  };

  const initializeGapiClient = async () => {
    if (!window.gapi) {
      console.error("Google API script not loaded");
      return;
    }
  
    try {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      setIsGapiLoaded(true);
    } catch (error) {
      console.error("Error initializing Google API client:", error);
    }
  };

  const handleAuthClick = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.error !== undefined) {
          throw response;
        }
        const expiresAt = new Date().getTime() + response.expires_in * 1000;
        localStorage.setItem('gapi_token', response.access_token);
        localStorage.setItem('gapi_token_expires_at', expiresAt); // Save expiry time
        window.gapi.client.setToken(response);
        setIsAuthorized(true);
        setButtonText('Refresh');
        listUpcomingEvents();
      }
    });

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
  };
}

// Call this function before making an API call
const isTokenValid = () => {
  const expiresAt = localStorage.getItem('gapi_token_expires_at');
  return new Date().getTime() < expiresAt;
};    

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setIsAuthorized(false);
      setEvents([]);
      setButtonText('Authorize');
      localStorage.removeItem('gapi_token'); 
    }
  };

  async function listAllCalendars() {
    try {
      const response = await window.gapi.client.calendar.calendarList.list();
      return response.result.items.map(calendar => calendar.id);
    } catch (err) {
      console.error('Error fetching calendar list:', err);
      return [];
    }
  }
  
  const adjustDate = (days) => {
    setDateOffset(prevOffset => {
      let newOffset;
      const newDate = new Date();
  
      if (days === 0) {
        // Reset to current date
        newOffset = 0;
        newDate.setDate(newDate.getDate()); // This line actually doesn't change the date, so it's optional
      } else {
        // Adjust date by the specified number of days
        newOffset = prevOffset + days;
        newDate.setDate(newDate.getDate() + newOffset);
      }
  
      setCurrentDate(getFormattedDate(newDate));
      return newOffset;
    });
  };
  

  const getAdjustedDate = () => {
    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate() + dateOffset);
    return adjustedDate;
  };

  const getStartOfAdjustedDate = () => {
    const adjustedDate = getAdjustedDate();
    adjustedDate.setHours(0, 0, 0, 0);
    return adjustedDate.toISOString();
  };

  const getStartOfNextAdjustedDate = () => {
    const adjustedDate = getAdjustedDate();
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    adjustedDate.setHours(0, 0, 0, 0);
    return adjustedDate.toISOString();
  };

  async function listUpcomingEvents() {
    try {
      const calendarIds = await listAllCalendars();
      const allEvents = [];
      const timeMin = getStartOfAdjustedDate();
      const timeMax = getStartOfNextAdjustedDate();
  
      for (const calendarId of calendarIds) {
        const response = await window.gapi.client.calendar.events.list({
          'calendarId': calendarId,
          'timeMin': timeMin,
          'timeMax': timeMax,
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime',
        });
  
        allEvents.push(...response.result.items);
      }
  
      // Sort all events by start time
      allEvents.sort((a, b) => new Date(a.start.dateTime || a.start.date) - new Date(b.start.dateTime || b.start.date));
  
      setEvents(allEvents.length ? allEvents : ['No events found for today.']);
    } catch (err) {
      setEvents([`Error: ${err.message}`]);
    }
  }

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

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months start from 0
    const day = date.getDate();
    return `${months[month]} ${day < 10 ? `0${day}` : day},  ${year}`;
  };
  const [currentDate, setCurrentDate] = useState(getFormattedDate(new Date()));

  useEffect(() => {
    if (isAuthorized && isGapiLoaded) {
      listUpcomingEvents();
    }
  }, [dateOffset, isAuthorized, isGapiLoaded]);
  
  

  return (
    <div>
        <center>
        <h2><b><u>Upcoming Events</u></b></h2>
        <div class="date-navigation">
        <button onClick={() => adjustDate(0)}>⏺</button>
        <button onClick={() => adjustDate(-1)}>◀️</button>
        <h3><b><u>{currentDate}</u></b></h3>
        <button onClick={() => adjustDate(1)}>▶️</button>
        </div>
            <ol>
                {events.map((event, index) => (
                    <li key={index}>
                    {typeof event === 'string' ? (
                        event
                    ) : (
                        <div class="event">
                        <h4>{event.summary}</h4>
                        <i>
                            {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {new Date(event.end.dateTime || event.end.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </i>
                        {event.location && ` ${event.location}`}
                        </div>
                    )}
                    </li>
                ))}
            </ol>

      {isGapiLoaded && isGisLoaded && (
        <><br></br><br></br>
          <button onClick={handleAuthClick}>{buttonText}</button>
          {isAuthorized && <button onClick={handleSignoutClick}>Sign Out</button>}
        </>
      )}
      </center>
    </div>
  );
};

export default UpcomingEvents;
