import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import type { PrismaService } from '../../database/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        roleCode: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findAll(queryUserDto: QueryUserDto) {
    const { page = 1, pageSize = 10, email, nickname, roleCode, status } = queryUserDto;
    const skip = (page - 1) * pageSize;

    const where: Prisma.UserWhereInput = {};
    if (email) where.email = { contains: email };
    if (nickname) where.nickname = { contains: nickname };
    if (roleCode) where.roleCode = roleCode as any;
    if (status !== undefined) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          email: true,
          nickname: true,
          avatar: true,
          roleCode: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        roleCode: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        student: true,
        teacher: true
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    const data: Prisma.UserUpdateInput = { ...rest };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        roleCode: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true
      }
    });
  }
}
