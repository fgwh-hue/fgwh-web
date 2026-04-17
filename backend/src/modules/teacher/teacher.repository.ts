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
    let status = 1;
    if (teacher.user?.status === false) {
      status = 2;
    }
    return {
      id: teacher.id,
      teacherNo: teacher.teacherNo,
      teacherName: teacher.name,
      teacherGender: genderMap[teacher.gender] ?? teacher.gender,
      teacherPhone: teacher.phone,
      teacherEmail: teacher.email,
      teacherTitle: teacher.title,
      teacherDepartment: teacher.department,
      status,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      user: teacher.user
    };
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherResponse> {
    const data: Prisma.TeacherCreateInput = {
      teacherNo: createTeacherDto.teacherNo,
      name: createTeacherDto.name,
      gender: createTeacherDto.gender,
      phone: createTeacherDto.phone,
      email: createTeacherDto.email,
      title: createTeacherDto.title,
      department: createTeacherDto.department,
      ...(createTeacherDto.userId && {
        user: { connect: { id: createTeacherDto.userId } }
      })
    };

    const teacher = await this.prisma.teacher.create({
      data,
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
    const page = Number(queryTeacherDto.page || queryTeacherDto.current || 1);
    const pageSize = Number(queryTeacherDto.pageSize || queryTeacherDto.size || 10);
    const skip = (page - 1) * pageSize;

    console.log('Teacher findAll params:', { page, pageSize, skip, queryTeacherDto });

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
    const data: Prisma.TeacherUpdateInput = {
      ...(updateTeacherDto.teacherNo && { teacherNo: updateTeacherDto.teacherNo }),
      ...(updateTeacherDto.name && { name: updateTeacherDto.name }),
      ...(updateTeacherDto.gender !== undefined && { gender: updateTeacherDto.gender }),
      ...(updateTeacherDto.phone !== undefined && { phone: updateTeacherDto.phone }),
      ...(updateTeacherDto.email !== undefined && { email: updateTeacherDto.email }),
      ...(updateTeacherDto.title !== undefined && { title: updateTeacherDto.title }),
      ...(updateTeacherDto.department !== undefined && { department: updateTeacherDto.department })
    };

    const teacher = await this.prisma.teacher.update({
      where: { id },
      data,
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
