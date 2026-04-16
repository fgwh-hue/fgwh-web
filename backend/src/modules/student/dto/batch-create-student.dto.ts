import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class BatchCreateStudentDto {
  @ApiProperty({ description: '学生列表', type: [CreateStudentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[];
}
