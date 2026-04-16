import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: '旧密码' })
  @IsString()
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', minLength: 8 })
  @IsString()
  @MinLength(8, { message: '密码至少8个字符' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: '密码必须包含大小写字母和数字'
  })
  newPassword: string;
}
