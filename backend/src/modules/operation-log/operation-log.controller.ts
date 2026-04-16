import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../role/entities/role.entity';
import type { OperationLogService } from './operation-log.service';
import type { QueryOperationLogDto } from './dto/query-operation-log.dto';
import type { OperationLogListResponse } from './entities/operation-log-response';

@ApiTags('操作日志')
@Controller('operation-logs')
@ApiBearerAuth()
@Roles(RoleCode.SUPER_ADMIN, RoleCode.ADMIN)
export class OperationLogController {
  constructor(private readonly operationLogService: OperationLogService) {}

  @Get()
  @ApiOperation({ summary: '获取操作日志列表' })
  findAll(@Query() queryOperationLogDto: QueryOperationLogDto): Promise<OperationLogListResponse> {
    return this.operationLogService.findAll(queryOperationLogDto);
  }
}
