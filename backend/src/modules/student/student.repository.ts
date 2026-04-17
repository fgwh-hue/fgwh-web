import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { PrismaService } from '../../database/prisma.service';
import type { CreateStudentDto } from './dto/create-student.dto';
import type { UpdateStudentDto } from './dto/update-student.dto';
import type { QueryStudentDto } from './dto/query-student.dto';
import type { StudentListResponse, StudentResponse } from './entities/student-response';

@Injectable()
export class StudentRepository {
  constructor(private prisma: PrismaService) {}

  private transformStudent(student: any): StudentResponse {
    const genderMap: Record<string, number> = { 男: 1, 女: 2, M: 1, F: 2 };
    let status = 1;
    if (student.user?.status === false) {
      status = 2;
    }
    return {
      id: student.id,
      studentNo: student.studentNo,
      studentName: student.name,
      studentGender: genderMap[student.gender] ?? student.gender,
      studentPhone: student.phone,
      studentEmail: student.email,
      studentMajor: student.major,
      studentClass: student.className,
      enrollYear: student.enrollYear,
      status,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      user: student.user
    };
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponse> {
    const student = await this.prisma.student.create({
      data: createStudentDto,
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
    return this.transformStudent(student);
  }

  async findAll(queryStudentDto: QueryStudentDto): Promise<StudentListResponse> {
    const page = queryStudentDto.current || queryStudentDto.page || 1;
    const pageSize = queryStudentDto.size || queryStudentDto.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const {
      studentNo,
      name,
      studentName,
      gender,
      studentGender,
      major,
      studentMajor,
      className,
      studentClass,
      enrollYear
    } = queryStudentDto;

    const where: Prisma.StudentWhereInput = {};
    if (studentNo) where.studentNo = { contains: studentNo };
    if (name) where.name = { contains: name };
    if (studentName) where.name = { contains: studentName };
    if (gender) where.gender = gender;
    if (studentGender) where.gender = studentGender;
    if (major) where.major = { contains: major };
    if (studentMajor) where.major = { contains: studentMajor };
    if (className) where.className = { contains: className };
    if (studentClass) where.className = { contains: studentClass };
    if (enrollYear) where.enrollYear = enrollYear;

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
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
      this.prisma.student.count({ where })
    ]);

    return {
      records: data.map(s => this.transformStudent(s)),
      total,
      page,
      pageSize
    };
  }

  async findById(id: string): Promise<StudentResponse | null> {
    const student = await this.prisma.student.findUnique({
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
    return student ? this.transformStudent(student) : null;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentResponse> {
    const student = await this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
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
    return this.transformStudent(student);
  }

  async delete(id: string) {
    const student = await this.prisma.student.delete({
      where: { id },
      select: {
        id: true,
        studentNo: true,
        name: true
      }
    });
    return student;
  }
}
