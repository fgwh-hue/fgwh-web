import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserRepository } from './user.repository';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findAll(queryUserDto: QueryUserDto) {
    return this.userRepository.findAll(queryUserDto);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.delete(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return { message: '删除成功' };
  }
}
