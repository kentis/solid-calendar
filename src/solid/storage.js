import { saveFileInContainer, createContainerAt, getResourceInfo } from "@inrupt/solid-client";
import { v4 as uuidv4 } from "uuid";
import {
  getSolidDataset,
  getContainedResourceUrlAll,
  getFile
} from "@inrupt/solid-client";

function createICS({ summary, dtstart, dtend, description }) {
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${uuidv4()}
SUMMARY:${summary}
DESCRIPTION:${description}
DTSTART:${dtstart}
DTEND:${dtend}
END:VEVENT
END:VCALENDAR`;
}



export async function getEventsFromCalendar(session, calendarUrl) {
  const dataset = await getSolidDataset(calendarUrl, { fetch: session.fetch });
  const fileUrls = getContainedResourceUrlAll(dataset);
  console.log("Dataset", dataset);
  const events = [];

  for (const url of fileUrls) {
    if (!url.endsWith(".ics")) continue;

    const file = await getFile(url, { fetch: session.fetch });
    const text = await file.text();

    const event = parseICS(text);
    event.url = url;
    events.push(event);
  }

  console.log(events);
  return events;
}

function parseICS(icsText) {
  const lines = icsText.split("\n");
  const obj = {};
  for (const line of lines) {
    if (line.startsWith("SUMMARY:")) obj.summary = line.slice(8);
    if (line.startsWith("DTSTART:")) obj.dtstart = line.slice(8);
    if (line.startsWith("DTEND:")) obj.dtend = line.slice(6);
  }
  obj.icsText = icsText
  return obj;
}

export async function saveEventToPod({ session, containerUrl, eventData }) {
  const blob = new Blob([createICS(eventData)], { type: "text/calendar" });

  await saveFileInContainer(containerUrl, blob, {
    slug: `${eventData.summary.replace(/\s+/g, "_")}-${Date.now()}.ics`,
    contentType: "text/calendar",
    fetch: session.fetch,
  });
}


export async function ensureCalendarContainer(session, containerUrl) {
  try {
    await getResourceInfo(containerUrl, { fetch: session.fetch });
    // ✅ Folder exists, do nothing
  } catch (e) {
    if (e.statusCode === 404) {
      // 🚀 Folder does not exist, create it
      await createContainerAt(containerUrl, { fetch: session.fetch });
    } else {
      // Some other error
      throw e;
    }
  }
}
