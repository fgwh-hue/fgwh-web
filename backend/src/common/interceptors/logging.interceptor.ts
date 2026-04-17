import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, body } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // 记录请求体（排除敏感信息）
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const sanitizedBody = { ...body };
      if (sanitizedBody.password) {
        sanitizedBody.password = '***';
      }
      this.logger.log(`${method} ${url} - Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - startTime;
          this.logger.log(`${method} ${url} ${response.statusCode} - ${duration}ms - ${ip} - ${userAgent}`);
        },
        error: error => {
          const duration = Date.now() - startTime;
          this.logger.error(`${method} ${url} ERROR - ${duration}ms - ${ip} - ${error.message}`);
          if (error.response) {
            this.logger.error(`Error details: ${JSON.stringify(error.response)}`);
          }
        }
      })
    );
  }
}
