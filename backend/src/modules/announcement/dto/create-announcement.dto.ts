import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @ApiPropertyOptional({ description: '类型', default: 'INFO' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: '优先级', default: 'NORMAL' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: '是否置顶', default: false })
  @IsOptional()
  @IsBoolean()
  isTop?: boolean;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
