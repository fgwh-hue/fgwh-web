import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import type { CreateCourseDto } from './dto/create-course.dto';
import type { UpdateCourseDto } from './dto/update-course.dto';
import type { QueryCourseDto } from './dto/query-course.dto';
import type { CourseListResponse, CourseResponse } from './entities/course-response';

@Injectable()
export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async create(dto: CreateCourseDto): Promise<CourseResponse> {
    return this.courseRepository.create(dto);
  }

  async findAll(query: QueryCourseDto): Promise<CourseListResponse> {
    return this.courseRepository.findAll(query);
  }

  async findOne(id: string): Promise<CourseResponse> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException('课程不存在');
    }
    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseResponse> {
    const course = await this.courseRepository.update(id, dto);
    if (!course) {
      throw new NotFoundException('课程不存在');
    }
    return course;
  }

  async remove(id: string): Promise<{ message: string }> {
    const course = await this.courseRepository.delete(id);
    if (!course) {
      throw new NotFoundException('课程不存在');
    }
    return { message: '删除成功' };
  }
}
