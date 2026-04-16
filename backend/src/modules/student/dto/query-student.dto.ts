import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class QueryStudentDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @IsNumber()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '页码(current别名)' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  current?: number;

  @ApiPropertyOptional({ description: '每页数量(size别名)' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  size?: number;

  @ApiPropertyOptional({ description: '学号' })
  @IsOptional()
  @IsString()
  studentNo?: string;

  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '姓名(别名)' })
  @IsOptional()
  @IsString()
  studentName?: string;

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: '性别(别名)' })
  @IsOptional()
  @IsString()
  studentGender?: string;

  @ApiPropertyOptional({ description: '专业' })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({ description: '专业(别名)' })
  @IsOptional()
  @IsString()
  studentMajor?: string;

  @ApiPropertyOptional({ description: '班级' })
  @IsOptional()
  @IsString()
  className?: string;

  @ApiPropertyOptional({ description: '班级(别名)' })
  @IsOptional()
  @IsString()
  studentClass?: string;

  @ApiPropertyOptional({ description: '昵称(忽略)' })
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiPropertyOptional({ description: '入学年份' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  enrollYear?: number;
}
