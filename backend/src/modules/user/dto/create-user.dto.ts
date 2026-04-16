import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleCode } from '../../role/entities/role.entity';

export class CreateUserDto {
  @ApiProperty({ description: '邮箱' })
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

  @ApiPropertyOptional({ description: '头像URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '角色', enum: RoleCode })
  @IsEnum(RoleCode)
  @IsNotEmpty({ message: '角色不能为空' })
  roleCode: RoleCode;

  @ApiProperty({ description: '状态', default: true })
  @IsOptional()
  status?: boolean = true;
}
