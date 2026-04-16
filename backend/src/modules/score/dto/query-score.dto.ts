import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { ScoreStatus } from '@prisma/client';

export class QueryScoreDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: '学生ID' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ description: '课程ID' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ description: '学期' })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  status?: ScoreStatus;
}
