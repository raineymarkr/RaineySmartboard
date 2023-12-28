import React, { useState, useEffect } from 'react';

const UpcomingEvents = () => {
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGisLoaded, setIsGisLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [events, setEvents] = useState([]);
  const [buttonText, setButtonText] = useState('Authorize');

  const CLIENT_ID = "292381840802-8urm1vjdfo1qb48jrnd803el2k1fgppb.apps.googleusercontent.com"; // Replace with your actual client ID
  const API_KEY = "AIzaSyB6ZrtEKoHoa5XqF6oNNLedqQEDf-8Oox4"; // Replace with your actual API key
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  useEffect(() => {
    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);
    if (isGapiLoaded)
    {  // Check for existing token in local storage
      const existingToken = localStorage.getItem('gapi_token');
      if (existingToken) {
        window.gapi.client.setToken({ access_token: existingToken });
        setIsAuthorized(true);
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

      const intervalId = setInterval(fetchEvents, 3600000);

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
  
  const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  };
  
  const getStartOfTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  };
  
  async function listUpcomingEvents() {
    try {
      const calendarIds = await listAllCalendars();
      const allEvents = [];
      const timeMin = getStartOfToday();
      const timeMax = getStartOfTomorrow();
  
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
  
  

  return (
    <div>
        <center>
        <h2>Upcoming Events</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                    {typeof event === 'string' ? (
                        event
                    ) : (
                        <>
                        <h3>{event.summary}</h3>
                        <h4><i>
                            {' '}
                            {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {new Date(event.end.dateTime || event.end.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </i></h4>
                        {event.location && ` ${event.location}`}
                        </>
                    )}
                    </li>
                ))}
            </ul>

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
