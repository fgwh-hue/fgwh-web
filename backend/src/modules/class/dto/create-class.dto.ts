import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ description: '班级编号' })
  @IsString()
  @IsNotEmpty({ message: '班级编号不能为空' })
  classNo: string;

  @ApiProperty({ description: '班级名称' })
  @IsString()
  @IsNotEmpty({ message: '班级名称不能为空' })
  name: string;

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
