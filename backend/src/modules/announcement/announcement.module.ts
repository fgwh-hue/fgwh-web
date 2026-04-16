import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { AnnouncementRepository } from './announcement.repository';

/* eslint-disable @typescript-eslint/no-empty-class */
@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementService, AnnouncementRepository],
  exports: [AnnouncementService]
})
export class AnnouncementModule {}
