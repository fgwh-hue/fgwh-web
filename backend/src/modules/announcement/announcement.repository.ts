import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { PrismaService } from '../../database/prisma.service';
import type { CreateAnnouncementDto } from './dto/create-announcement.dto';
import type { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import type { QueryAnnouncementDto } from './dto/query-announcement.dto';

@Injectable()
export class AnnouncementRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnnouncementDto & { authorId: string }) {
    return this.prisma.announcement.create({
      data: dto,
      include: {
        author: {
          select: {
            id: true,
            nickname: true
          }
        }
      }
    });
  }

  async findAll(query: QueryAnnouncementDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: Prisma.AnnouncementWhereInput = {};
    if (query.title) where.title = { contains: query.title };
    if (query.type) where.type = query.type;
    if (query.priority) where.priority = query.priority;
    if (query.isTop !== undefined) where.isTop = query.isTop;
    if (query.status !== undefined) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          author: {
            select: {
              id: true,
              nickname: true
            }
          }
        },
        orderBy: [{ isTop: 'desc' }, { createdAt: 'desc' }]
      }),
      this.prisma.announcement.count({ where })
    ]);

    return {
      records: data,
      total,
      current: page,
      size: pageSize
    };
  }

  async findById(id: string) {
    return this.prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            nickname: true
          }
        }
      }
    });
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    return this.prisma.announcement.update({
      where: { id },
      data: dto,
      include: {
        author: {
          select: {
            id: true,
            nickname: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    return this.prisma.announcement.delete({
      where: { id }
    });
  }

  async incrementViewCount(id: string) {
    await this.prisma.announcement.update({
      where: { id },
      data: {
        viewCount: { increment: 1 }
      }
    });
  }
}
