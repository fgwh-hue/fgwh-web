import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiPropertyOptional({ description: '学号' })
  @IsOptional()
  @IsString()
  studentNo?: string;

  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: '专业' })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({ description: '班级' })
  @IsOptional()
  @IsString()
  className?: string;

  @ApiPropertyOptional({ description: '入学年份' })
  @IsOptional()
  @IsNumber()
  enrollYear?: number;
}
