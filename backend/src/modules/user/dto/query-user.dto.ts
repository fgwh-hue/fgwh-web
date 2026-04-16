import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RoleCode } from '../../role/entities/role.entity';

export class QueryUserDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: '角色', enum: RoleCode })
  @IsOptional()
  @IsEnum(RoleCode)
  roleCode?: RoleCode;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
