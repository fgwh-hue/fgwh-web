import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';

@Module({
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
  exports: [StudentService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StudentModule {}
