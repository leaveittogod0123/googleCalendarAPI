import { Controller, Get } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}
  @Get()
  async getCalendar(): Promise<void> {
    return this.calendarService.setCalendar();
  }
}
