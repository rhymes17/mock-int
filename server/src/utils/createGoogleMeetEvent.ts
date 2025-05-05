import { google } from "googleapis";
import { UserType } from "../Models/User";

export const createGoogleMeetEvent = async ({
  organizer,
  summary,
  interviewTime,
  interviewer,
  interviewee,
}: {
  organizer: UserType;
  summary: string;
  interviewTime: Date;
  interviewer: UserType;
  interviewee: UserType;
}) => {
  const REDIRECT_URI = "http://localhost:8000/api/auth/callback/google";
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: REDIRECT_URI,
  });
  oauth2Client.setCredentials({
    refresh_token: organizer.refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startTime = new Date(interviewTime);
  const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

  const event = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees: [{ email: interviewer.email }, { email: interviewee.email }],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const meetLink = event.data.hangoutLink;
  return meetLink;
};
