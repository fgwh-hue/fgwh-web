import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { PrismaService } from '../../database/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname: nickname || email.split('@')[0]
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        roleCode: true,
        createdAt: true
      }
    });

    const tokens = await this.generateTokens(user.id, user.email, user.roleCode);

    return {
      user,
      ...tokens
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { student: true, teacher: true }
    });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    if (!user.status) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.roleCode);

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        roleCode: user.roleCode,
        student: user.student,
        teacher: user.teacher
      },
      ...tokens
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'default-secret'
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('无效的刷新令牌');
      }

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken }
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('刷新令牌已过期');
      }

      await this.prisma.refreshToken.delete({
        where: { token: refreshToken }
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user || !user.status) {
        throw new UnauthorizedException('用户不存在或已被禁用');
      }

      return this.generateTokens(user.id, user.email, user.roleCode);
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效');
    }
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId }
    });

    return { message: '退出登录成功' };
  }

  private async generateTokens(userId: string, email: string, roleCode: string) {
    const payload = { sub: userId, email, type: 'access' };

    const accessToken = this.jwtService.sign(payload);

    const refreshPayload = { sub: userId, email, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d'
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt
      }
    });

    return {
      accessToken,
      refreshToken
    };
  }
}
