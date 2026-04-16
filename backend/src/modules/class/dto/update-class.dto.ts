import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassDto {
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

  @ApiPropertyOptional({ description: '关联课程ID' })
  @IsOptional()
  @IsString()
  courseId?: string;
}
