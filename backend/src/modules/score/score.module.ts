import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { ScoreRepository } from './score.repository';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Module({
  controllers: [ScoreController],
  providers: [ScoreService, ScoreRepository],
  exports: [ScoreService]
})
export class ScoreModule {}
