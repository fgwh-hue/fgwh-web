import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { PrismaService } from '../../database/prisma.service';
import type { CreateClassDto } from './dto/create-class.dto';
import type { UpdateClassDto } from './dto/update-class.dto';
import type { QueryClassDto } from './dto/query-class.dto';

@Injectable()
export class ClassRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClassDto) {
    return this.prisma.class.create({
      data: dto,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        _count: {
          select: { students: true }
        }
      }
    });
  }

  async findAll(query: QueryClassDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ClassWhereInput = {};
    if (query.classNo) where.classNo = { contains: query.classNo };
    if (query.name) where.name = { contains: query.name };
    if (query.grade) where.grade = query.grade;
    if (query.major) where.major = { contains: query.major };
    if (query.teacherId) where.teacherId = query.teacherId;
    if (query.courseId) where.courseId = query.courseId;

    const [data, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          course: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          _count: {
            select: { students: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.class.count({ where })
    ]);

    return {
      records: data,
      total,
      current: page,
      size: pageSize
    };
  }

  async findById(id: string) {
    return this.prisma.class.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        _count: {
          select: { students: true }
        }
      }
    });
  }

  async update(id: string, dto: UpdateClassDto) {
    return this.prisma.class.update({
      where: { id },
      data: dto,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        _count: {
          select: { students: true }
        }
      }
    });
  }

  async delete(id: string) {
    return this.prisma.class.delete({
      where: { id }
    });
  }
}
