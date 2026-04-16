import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRepository } from './course.repository';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  exports: [CourseService]
})
export class CourseModule {}
