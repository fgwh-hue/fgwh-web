import { Injectable, Logger } from '@nestjs/common';
import type { OperationLogRepository } from './operation-log.repository';
import type { QueryOperationLogDto } from './dto/query-operation-log.dto';
import type { OperationLogListResponse } from './entities/operation-log-response';

@Injectable()
export class OperationLogService {
  private readonly logger = new Logger(OperationLogService.name);

  constructor(private readonly operationLogRepository: OperationLogRepository) {}

  async log(params: {
    action: string;
    module: string;
    method: string;
    path: string;
    ip?: string;
    userAgent?: string;
    params?: string;
    result?: string;
    statusCode?: number;
    duration?: number;
    userId?: string;
  }) {
    try {
      await this.operationLogRepository.create(params);
    } catch (error) {
      this.logger.error(`Failed to log operation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(query: QueryOperationLogDto): Promise<OperationLogListResponse> {
    return this.operationLogRepository.findAll(query);
  }
}
