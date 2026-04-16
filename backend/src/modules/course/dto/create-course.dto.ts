import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: '课程代码' })
  @IsString()
  @IsNotEmpty({ message: '课程代码不能为空' })
  code: string;

  @ApiProperty({ description: '课程名称' })
  @IsString()
  @IsNotEmpty({ message: '课程名称不能为空' })
  name: string;

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

  @ApiProperty({ description: '教师ID' })
  @IsString()
  @IsNotEmpty({ message: '教师ID不能为空' })
  teacherId: string;
}
