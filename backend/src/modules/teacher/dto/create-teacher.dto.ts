import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: '工号' })
  @IsString()
  @IsNotEmpty({ message: '工号不能为空' })
  teacherNo: string;

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

  @ApiPropertyOptional({ description: '职称' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '院系' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: '关联的用户ID' })
  @IsOptional()
  @IsString()
  userId?: string;
}
