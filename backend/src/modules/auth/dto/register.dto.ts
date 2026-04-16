import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: '邮箱地址' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '密码', minLength: 6 })
  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname?: string;
}
