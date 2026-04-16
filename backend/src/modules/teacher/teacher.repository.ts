import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { PrismaService } from '../../database/prisma.service';
import type { CreateTeacherDto } from './dto/create-teacher.dto';
import type { UpdateTeacherDto } from './dto/update-teacher.dto';
import type { QueryTeacherDto } from './dto/query-teacher.dto';

export interface TeacherResponse {
  id: string;
  teacherNo: string;
  teacherName: string;
  teacherGender: number | null;
  teacherPhone: string | null;
  teacherEmail: string | null;
  teacherTitle: string | null;
  teacherDepartment: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    nickname: string | null;
    avatar: string | null;
  };
}

export interface TeacherListResponse {
  records: TeacherResponse[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class TeacherRepository {
  constructor(private prisma: PrismaService) {}

  private transformTeacher(teacher: any): TeacherResponse {
    const genderMap: Record<string, number> = { 男: 1, 女: 2, M: 1, F: 2 };
    return {
      id: teacher.id,
      teacherNo: teacher.teacherNo,
      teacherName: teacher.name,
      teacherGender: genderMap[teacher.gender] ?? teacher.gender,
      teacherPhone: teacher.phone,
      teacherEmail: teacher.email,
      teacherTitle: teacher.title,
      teacherDepartment: teacher.department,
      status: teacher.user?.status === true ? 1 : teacher.user?.status === false ? 2 : 1,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      user: teacher.user
    };
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherResponse> {
    const teacher = await this.prisma.teacher.create({
      data: createTeacherDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            avatar: true,
            status: true
          }
        }
      }
    });
    return this.transformTeacher(teacher);
  }

  async findAll(queryTeacherDto: QueryTeacherDto): Promise<TeacherListResponse> {
    const page = queryTeacherDto.current || queryTeacherDto.page || 1;
    const pageSize = queryTeacherDto.size || queryTeacherDto.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const {
      teacherNo,
      name,
      teacherName,
      gender,
      teacherGender,
      title,
      department,
      teacherPhone,
      teacherEmail,
      status
    } = queryTeacherDto;

    const where: Prisma.TeacherWhereInput = {};
    if (teacherNo) where.teacherNo = { contains: teacherNo };
    if (name) where.name = { contains: name };
    if (teacherName) where.name = { contains: teacherName };
    if (gender) where.gender = gender;
    if (teacherGender) where.gender = teacherGender;
    if (title) where.title = { contains: title };
    if (department) where.department = { contains: department };
    if (teacherPhone) where.phone = { contains: teacherPhone };
    if (teacherEmail) where.email = { contains: teacherEmail };
    if (status) {
      const statusNum = Number(status);
      if (!isNaN(statusNum)) {
        where.user = { status: statusNum === 1 };
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              nickname: true,
              avatar: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.teacher.count({ where })
    ]);

    return {
      records: data.map(t => this.transformTeacher(t)),
      total,
      page,
      pageSize
    };
  }

  async findById(id: string): Promise<TeacherResponse | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            avatar: true,
            status: true
          }
        }
      }
    });
    return teacher ? this.transformTeacher(teacher) : null;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<TeacherResponse> {
    const teacher = await this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            avatar: true,
            status: true
          }
        }
      }
    });
    return this.transformTeacher(teacher);
  }

  async delete(id: string) {
    return this.prisma.teacher.delete({
      where: { id },
      select: {
        id: true,
        teacherNo: true,
        name: true
      }
    });
  }
}
