import { Global, Module } from '@nestjs/common';
import { OperationLogController } from './operation-log.controller';
import { OperationLogService } from './operation-log.service';
import { OperationLogRepository } from './operation-log.repository';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Global()
@Module({
  controllers: [OperationLogController],
  providers: [OperationLogService, OperationLogRepository],
  exports: [OperationLogService]
})
export class OperationLogModule {}
