import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TeacherRepository } from './teacher.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository],
  exports: [TeacherService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TeacherModule {}
