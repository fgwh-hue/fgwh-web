import { Injectable, NotFoundException } from '@nestjs/common';
import type { StudentRepository } from './student.repository';
import type { CreateStudentDto } from './dto/create-student.dto';
import type { UpdateStudentDto } from './dto/update-student.dto';
import type { QueryStudentDto } from './dto/query-student.dto';
import type { StudentListResponse, StudentResponse } from './entities/student-response';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponse> {
    return this.studentRepository.create(createStudentDto);
  }

  async findAll(queryStudentDto: QueryStudentDto): Promise<StudentListResponse> {
    return this.studentRepository.findAll(queryStudentDto);
  }

  async findOne(id: string): Promise<StudentResponse> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new NotFoundException('学生不存在');
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentResponse> {
    const student = await this.studentRepository.update(id, updateStudentDto);
    if (!student) {
      throw new NotFoundException('学生不存在');
    }
    return student;
  }

  async remove(id: string): Promise<{ message: string }> {
    const student = await this.studentRepository.delete(id);
    if (!student) {
      throw new NotFoundException('学生不存在');
    }
    return { message: '删除成功' };
  }
}
