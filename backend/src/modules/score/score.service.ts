import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ScoreRepository } from './score.repository';
import type { CreateScoreDto } from './dto/create-score.dto';
import type { UpdateScoreDto } from './dto/update-score.dto';
import type { QueryScoreDto } from './dto/query-score.dto';
import type { ScoreListResponse, ScoreResponse, ScoreStatistics } from './entities/score-response';

@Injectable()
export class ScoreService {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  async create(dto: CreateScoreDto & { createdBy?: string }): Promise<ScoreResponse> {
    try {
      return await this.scoreRepository.create(dto);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        throw new ConflictException('该学生的成绩记录已存在');
      }
      throw error;
    }
  }

  async findAll(query: QueryScoreDto): Promise<ScoreListResponse> {
    return this.scoreRepository.findAll(query);
  }

  async findOne(id: string): Promise<ScoreResponse> {
    const score = await this.scoreRepository.findById(id);
    if (!score) {
      throw new NotFoundException('成绩记录不存在');
    }
    return score;
  }

  async update(id: string, dto: UpdateScoreDto): Promise<ScoreResponse> {
    const score = await this.scoreRepository.update(id, dto);
    if (!score) {
      throw new NotFoundException('成绩记录不存在');
    }
    return score;
  }

  async remove(id: string): Promise<{ message: string }> {
    const score = await this.scoreRepository.delete(id);
    if (!score) {
      throw new NotFoundException('成绩记录不存在');
    }
    return { message: '删除成功' };
  }

  async getStatistics(courseId: string): Promise<ScoreStatistics> {
    return this.scoreRepository.getStatistics(courseId);
  }

  async batchCreateOrUpdate(
    scores: Array<CreateScoreDto & { createdBy?: string }>
  ): Promise<{ successCount: number; failCount: number }> {
    const results = await Promise.allSettled(scores.map(scoreDto => this.scoreRepository.create(scoreDto)));

    let successCount = 0;
    let failCount = 0;

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        successCount++;
      } else {
        failCount++;
      }
    });

    return { successCount, failCount };
  }
}
