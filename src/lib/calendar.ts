import type { InvitationContent } from "./invitation-content";

export type CalendarLinks = { google: string; ics: string };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Content fields are free-text (admin-editable), so parse defensively and
// only surface calendar links when a date can be recovered.
export function buildCalendarLinks(content: InvitationContent): CalendarLinks | null {
  const date = content.eventDate.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!date) {
    return null;
  }

  const [, year, month, day] = date;
  let startHour = 9;
  let startMinute = 0;
  let endHour = 10;
  let endMinute = 0;

  const time = content.eventTime.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
  if (time) {
    startHour = Number(time[1]);
    startMinute = Number(time[2]);
    endHour = Number(time[3]);
    endMinute = Number(time[4]);
    if (/pm|下午/i.test(content.eventTime) && startHour < 12) {
      startHour += 12;
      endHour += 12;
    }
  }

  const day8 = `${year}${pad(Number(month))}${pad(Number(day))}`;
  const start = `${day8}T${pad(startHour)}${pad(startMinute)}00`;
  const end = `${day8}T${pad(endHour)}${pad(endMinute)}00`;
  const title = `${content.chapterName}｜${content.eventTitle}`;
  const details = content.description;
  const location = `${content.locationName} ${content.locationAddress}`.trim();

  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`;

  const icsBody = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BNI Invitation//TW//",
    "BEGIN:VEVENT",
    `UID:bni-${day8}@meetnuva.com`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(details)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsBody)}`;

  return { google, ics };
}
