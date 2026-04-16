import { ApiProperty } from '@nestjs/swagger';

export class BatchImportResultDto {
  @ApiProperty({ description: '成功导入数量' })
  successCount: number;

  @ApiProperty({ description: '失败数量' })
  failCount: number;

  @ApiProperty({ description: '失败详情' })
  failedRecords: Array<{
    studentNo?: string;
    name?: string;
    error: string;
  }>;
}
