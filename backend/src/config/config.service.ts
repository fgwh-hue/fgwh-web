import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  get port(): number {
    return parseInt(process.env.PORT || '3001', 10);
  }

  get databaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }

  get redisHost(): string {
    return process.env.REDIS_HOST || 'localhost';
  }

  get redisPort(): number {
    return parseInt(process.env.REDIS_PORT || '6379', 10);
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'default-secret';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '1d';
  }

  get jwtRefreshExpiresIn(): string {
    return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  get logLevel(): string {
    return process.env.LOG_LEVEL || 'info';
  }

  get logDir(): string {
    return process.env.LOG_DIR || './logs';
  }
}
