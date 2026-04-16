import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCourseDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: '课程代码' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '课程名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '学期' })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({ description: '学年' })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({ description: '教师ID' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
