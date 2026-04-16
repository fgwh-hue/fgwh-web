import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleCode } from '../../role/entities/role.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '角色', enum: RoleCode })
  @IsOptional()
  @IsEnum(RoleCode)
  roleCode?: RoleCode;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({ description: '新密码' })
  @IsOptional()
  @IsString()
  password?: string;
}
