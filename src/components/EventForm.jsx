import { useState } from "react";
import { saveEventToPod } from "../solid/storage";

export default function EventForm({ session, podUrl, onEventSaved }) {
  const [summary, setSummary] = useState("");
  const [dtstart, setDtstart] = useState("");
  const [dtend, setDtend] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveEventToPod({
      session,
      containerUrl: podUrl,
      eventData: {
        summary,
        dtstart,
        dtend,
        description: "",
      },
    });
    setSummary("");
    setDtstart("");
    setDtend("");
    onEventSaved();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Event title"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={dtstart}
        onChange={(e) => setDtstart(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={dtend}
        onChange={(e) => setDtend(e.target.value)}
        required
      />
      <button type="submit">Add Event</button>
    </form>
  );
}

