import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import type { QueryOperationLogDto } from './dto/query-operation-log.dto';
import type { OperationLogListResponse, OperationLogResponse } from './entities/operation-log-response';

@Injectable()
export class OperationLogRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    action: string;
    module: string;
    method: string;
    path: string;
    ip?: string;
    userAgent?: string;
    params?: string;
    result?: string;
    statusCode?: number;
    duration?: number;
    userId?: string;
  }): Promise<OperationLogResponse> {
    return this.prisma.operationLog.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            nickname: true
          }
        }
      }
    }) as Promise<OperationLogResponse>;
  }

  async findAll(query: QueryOperationLogDto): Promise<OperationLogListResponse> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.OperationLogWhereInput = {};
    if (query.userId) where.userId = query.userId;
    if (query.module) where.module = query.module;
    if (query.action) where.action = { contains: query.action };
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.operationLog.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              nickname: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.operationLog.count({ where })
    ]);

    return {
      records: data as OperationLogResponse[],
      total,
      current: page,
      size: pageSize
    };
  }
}
