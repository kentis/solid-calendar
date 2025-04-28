import { useState, useEffect } from "react";
import LoginButton from "./components/LoginButton";
import EventForm from "./components/EventForm";
import CalendarView from "./components/CalendarView";
import { getPodUrlAll } from "@inrupt/solid-client";
import { ensureCalendarContainer, getEventsFromCalendar } from "./solid/storage";
function App() {
  const [session, setSession] = useState(null);

  // Replace with your pod base (this should ideally be discovered via WebID or UI)
  const [podUrl, setPodUrl] = useState("");
  const [calendars, setCalendars] = useState(["work", "personal"]);
  const [selectedCalendar, setSelectedCalendar] = useState("work");
  const [events, setEvents] = useState([]);
  const [podBaseUrl, setPodBaseUrl] = useState(null);

  const loadEvents = async () => {
    // const calendarUrl = `${podBaseUrl}/private/calendars/${selectedCalendar}/`;
    const loaded = await getEventsFromCalendar(session, podUrl);
    setEvents(loaded);
  };

  useEffect(() => {
    const loadPodBase = async () => {
      if (session?.info?.isLoggedIn && session.info.webId) {
        const podBase = await fetchPodBaseUrl(session);
        setPodBaseUrl(podBase);
        setPodUrl(`${podBase}/private/calendars/${selectedCalendar}/`)
      }
    };
    loadPodBase();
  }, [session]);

const fetchPodBaseUrl = async (session) => {
  const podUrls = await getPodUrlAll(session.info.webId, { fetch: session.fetch });
  await ensureCalendarContainer(session, `${podUrls[0]}/private/calendars/${selectedCalendar}/` )
  return podUrls[0]; // Use the first pod if multiple
};


  
  useEffect(() => {
    if (session) loadEvents();
  }, [session, selectedCalendar, podUrl]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Solid Calendar</h1>
      <LoginButton onLogin={(sess) => setSession(sess)} />
      {session && (
        <>
          <p>Storing events in: <code>{podUrl}</code></p>
          <EventForm
            session={session}
            podUrl={podUrl}
            onEventSaved={() => alert("Event saved!")}
          />
        </>
      )}
      {session && (
  <>
    <h2>Calendar: {selectedCalendar}</h2>
    <CalendarView events={events} />
  </>
)}
{JSON.stringify(events)}
    </div>
  );
}

export default App;

