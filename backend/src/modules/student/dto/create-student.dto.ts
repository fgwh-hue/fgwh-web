import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: '学号' })
  @IsString()
  @IsNotEmpty({ message: '学号不能为空' })
  studentNo: string;

  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

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

  @ApiPropertyOptional({ description: '关联的用户ID' })
  @IsOptional()
  @IsString()
  userId?: string;
}
