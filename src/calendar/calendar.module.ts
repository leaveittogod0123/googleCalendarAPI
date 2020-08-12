import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [ConfigModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
