import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryOperationLogDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: '用户ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: '操作模块' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ description: '操作类型' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
