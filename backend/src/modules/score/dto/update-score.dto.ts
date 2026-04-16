import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { ScoreStatus } from '@prisma/client';

export class UpdateScoreDto {
  @ApiPropertyOptional({ description: '分数' })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiPropertyOptional({ description: '等级' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ description: '学期' })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({ description: '考试日期' })
  @IsOptional()
  examDate?: Date;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  status?: ScoreStatus;
}
