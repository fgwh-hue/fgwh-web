import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ClassRepository } from './class.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ClassController],
  providers: [ClassService, ClassRepository],
  exports: [ClassService]
})
export class ClassModule {}
