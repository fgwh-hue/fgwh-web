import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import type { CreateCourseDto } from './dto/create-course.dto';
import type { UpdateCourseDto } from './dto/update-course.dto';
import type { QueryCourseDto } from './dto/query-course.dto';

@Injectable()
export class CourseRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: dto,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            teacherNo: true
          }
        }
      }
    });
  }

  async findAll(query: QueryCourseDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: Prisma.CourseWhereInput = {};
    if (query.code) where.code = { contains: query.code };
    if (query.name) where.name = { contains: query.name };
    if (query.semester) where.semester = query.semester;
    if (query.academicYear) where.academicYear = query.academicYear;
    if (query.teacherId) where.teacherId = query.teacherId;
    if (query.status !== undefined) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              teacherNo: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.course.count({ where })
    ]);

    return {
      records: data,
      total,
      current: page,
      size: pageSize
    };
  }

  async findById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            teacherNo: true
          }
        },
        classes: true,
        _count: {
          select: { scores: true }
        }
      }
    });
  }

  async update(id: string, dto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: dto,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            teacherNo: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    return this.prisma.course.delete({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            teacherNo: true
          }
        }
      }
    });
  }
}
