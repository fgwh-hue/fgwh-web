import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeacherDto {
  @ApiPropertyOptional({ description: '工号' })
  @IsOptional()
  @IsString()
  teacherNo?: string;

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

  @ApiPropertyOptional({ description: '职称' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '院系' })
  @IsOptional()
  @IsString()
  department?: string;
}
