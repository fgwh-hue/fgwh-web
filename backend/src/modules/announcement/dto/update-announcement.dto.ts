import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({ description: '标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '内容' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: '类型' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: '优先级' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: '是否置顶' })
  @IsOptional()
  @IsBoolean()
  isTop?: boolean;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
