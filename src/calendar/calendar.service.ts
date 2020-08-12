import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

@Injectable()
export class CalendarService {
  refresh_token: string;
  client_id: string;
  client_secret: string;
  constructor(private configService: ConfigService) {
    this.refresh_token = this.configService.get<string>('REFRESH_TOKEN');
    this.client_id = this.configService.get<string>('CLIENT_ID');
    this.client_secret = this.configService.get<string>('CLIENT_SECRET');
  }

  setCalendar(): Promise<void> {
    const oAuth2Client = new OAuth2Client(this.client_id, this.client_secret);

    oAuth2Client.setCredentials({
      refresh_token: this.refresh_token,
    });

    console.log(process.env.CLIENT_ID);
    console.log(process.env.REFRESH_TOKEN);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const eventStartTime = new Date();

    eventStartTime.setDate(eventStartTime.getDate() + 2);
    eventStartTime.setMinutes(eventStartTime.getMinutes());

    const eventEndTime = new Date();
    eventEndTime.setDate(eventEndTime.getDate() + 2);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

    const event = {
      summary: '강남 교보문고 가서 책보기',
      location: '서울 서초구 강남대로 465 교보타워',
      description: '강남 교보문고 가서 구글 클라우드 플랫폼 책 찾아보자',
      start: {
        dateTime: eventStartTime.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      end: {
        dateTime: eventEndTime.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      colorId: 1,
    };

    return calendar.freebusy
      .query({
        resource: {
          timeMin: eventStartTime.toISOString(),
          timeMax: eventEndTime.toISOString(),
          timeZone: 'Asia/Seoul',
          items: [{ id: 'primary' }],
        },
      })
      .then(result => {
        console.log(result.data);
        const busy = result.data.calendars[`primary`].busy;
        const errors = result.data.calendars[`primary`].errors;
        if (undefined !== errors) {
          console.error(
            'Check this this calendar has public free busy visibility',
          );
        } else if (busy.length !== 0) {
          console.log('Busy');
        } else {
          return calendar.events.insert(
            { calendarId: 'primary', resource: event },
            err => {
              if (err)
                return console.error('Calendar Event Creation Error:', err);

              return console.log('Calendar Event Created.');
            },
          );
        }
      })
      .catch(e => {
        console.error(e);
      });
  }
}
