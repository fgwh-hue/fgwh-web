import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({ description: '课程名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '课程描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '学分' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  credit?: number;

  @ApiPropertyOptional({ description: '学期' })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({ description: '学年' })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({ description: '最大学生数' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxStudents?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
