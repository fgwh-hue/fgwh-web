import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryClassDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: '班级编号' })
  @IsOptional()
  @IsString()
  classNo?: string;

  @ApiPropertyOptional({ description: '班级名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '年级' })
  @IsOptional()
  @IsNumber()
  grade?: number;

  @ApiPropertyOptional({ description: '专业' })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({ description: '班主任ID' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ description: '课程ID' })
  @IsOptional()
  @IsString()
  courseId?: string;
}
