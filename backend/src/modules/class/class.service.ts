import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import type { CreateClassDto } from './dto/create-class.dto';
import type { UpdateClassDto } from './dto/update-class.dto';
import type { QueryClassDto } from './dto/query-class.dto';
import type { ClassListResponse, ClassResponse } from './entities/class-response';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}

  async create(dto: CreateClassDto): Promise<ClassResponse> {
    return this.classRepository.create(dto);
  }

  async findAll(query: QueryClassDto): Promise<ClassListResponse> {
    return this.classRepository.findAll(query);
  }

  async findOne(id: string): Promise<ClassResponse> {
    const classEntity = await this.classRepository.findById(id);
    if (!classEntity) {
      throw new NotFoundException('班级不存在');
    }
    return classEntity;
  }

  async update(id: string, dto: UpdateClassDto): Promise<ClassResponse> {
    const classEntity = await this.classRepository.update(id, dto);
    if (!classEntity) {
      throw new NotFoundException('班级不存在');
    }
    return classEntity;
  }

  async remove(id: string): Promise<{ message: string }> {
    const classEntity = await this.classRepository.delete(id);
    if (!classEntity) {
      throw new NotFoundException('班级不存在');
    }
    return { message: '删除成功' };
  }
}
