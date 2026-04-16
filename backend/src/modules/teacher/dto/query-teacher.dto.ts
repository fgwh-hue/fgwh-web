import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class QueryTeacherDto {
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

  @ApiPropertyOptional({ description: '工号' })
  @IsOptional()
  @IsString()
  teacherNo?: string;

  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '姓名(别名)' })
  @IsOptional()
  @IsString()
  teacherName?: string;

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: '性别(别名)' })
  @IsOptional()
  @IsString()
  teacherGender?: string;

  @ApiPropertyOptional({ description: '职称' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '院系' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  teacherPhone?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  teacherEmail?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}
