import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAnnouncementDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: '标题' })
  @IsOptional()
  @IsString()
  title?: string;

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

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
