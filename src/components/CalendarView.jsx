import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import noNB from "date-fns/locale/nb";
import { useMemo, useState } from "react";
const locales = {
  "en-US": enUS,
  "no-Nb": noNB
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView({ events }) {
  const [view, setView] = useState("week");

  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      title: event.summary,
      start: parseISO(event.dtstart),
      end: parseISO(event.dtend),
      allDay: false,
    }));
  }, [events]);

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        view={view}
        onView={(newView) => setView(newView)} 
        views={["month", "week", "day"]}
        style={{ height: "100%" }}
      />
    </div>
  );
}

