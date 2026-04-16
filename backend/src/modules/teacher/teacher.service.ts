import { Injectable, NotFoundException } from '@nestjs/common';
import type { TeacherRepository } from './teacher.repository';
import type { CreateTeacherDto } from './dto/create-teacher.dto';
import type { UpdateTeacherDto } from './dto/update-teacher.dto';
import type { QueryTeacherDto } from './dto/query-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  async create(createTeacherDto: CreateTeacherDto) {
    return this.teacherRepository.create(createTeacherDto);
  }

  async findAll(queryTeacherDto: QueryTeacherDto) {
    return this.teacherRepository.findAll(queryTeacherDto);
  }

  async findOne(id: string) {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundException('教师不存在');
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teacherRepository.update(id, updateTeacherDto);
    if (!teacher) {
      throw new NotFoundException('教师不存在');
    }
    return teacher;
  }

  async remove(id: string) {
    const teacher = await this.teacherRepository.delete(id);
    if (!teacher) {
      throw new NotFoundException('教师不存在');
    }
    return { message: '删除成功' };
  }
}
