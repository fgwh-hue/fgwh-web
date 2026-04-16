import { Module } from '@nestjs/common';
import { FileController } from './file.controller';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Module({
  controllers: [FileController]
})
export class FileModule {}
