import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'ai-web-super-secret-key-2024'
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('无效的访问令牌');
    }

    return {
      id: payload.sub,
      email: payload.email
    };
  }
}
