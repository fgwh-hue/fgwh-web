import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import type { CreateScoreDto } from './dto/create-score.dto';
import type { UpdateScoreDto } from './dto/update-score.dto';
import type { QueryScoreDto } from './dto/query-score.dto';

@Injectable()
export class ScoreRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScoreDto & { createdBy?: string }) {
    return this.prisma.score.create({
      data: dto,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentNo: true
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
  }

  async findAll(query: QueryScoreDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ScoreWhereInput = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.courseId) where.courseId = query.courseId;
    if (query.semester) where.semester = query.semester;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.score.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true
            }
          },
          course: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.score.count({ where })
    ]);

    return {
      records: data,
      total,
      current: page,
      size: pageSize
    };
  }

  async findById(id: string) {
    return this.prisma.score.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentNo: true
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
  }

  async update(id: string, dto: UpdateScoreDto) {
    return this.prisma.score.update({
      where: { id },
      data: dto,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentNo: true
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    return this.prisma.score.delete({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentNo: true
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
  }

  async getStatistics(courseId: string) {
    const scores = await this.prisma.score.findMany({
      where: {
        courseId,
        status: 'PUBLISHED',
        score: { not: null }
      },
      select: {
        score: true,
        grade: true
      }
    });

    if (scores.length === 0) {
      return {
        totalCount: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passCount: 0,
        failCount: 0,
        passRate: 0,
        gradeDistribution: []
      };
    }

    const validScores = scores.filter(s => s.score !== null) as { score: number; grade: string | null }[];
    const scores_only = validScores.map(s => s.score);
    const averageScore = scores_only.reduce((a, b) => a + b, 0) / scores_only.length;
    const gradeDistributionMap = new Map<string, number>();

    validScores.forEach(s => {
      if (s.grade) {
        gradeDistributionMap.set(s.grade, (gradeDistributionMap.get(s.grade) || 0) + 1);
      }
    });

    const passCount = validScores.filter(s => s.score >= 60).length;
    const failCount = validScores.filter(s => s.score < 60).length;

    return {
      totalCount: scores_only.length,
      averageScore: Math.round(averageScore * 100) / 100,
      highestScore: Math.max(...scores_only),
      lowestScore: Math.min(...scores_only),
      passCount,
      failCount,
      passRate: Math.round((passCount / scores_only.length) * 10000) / 100,
      gradeDistribution: Array.from(gradeDistributionMap.entries()).map(([grade, count]) => ({
        grade,
        count
      }))
    };
  }
}
