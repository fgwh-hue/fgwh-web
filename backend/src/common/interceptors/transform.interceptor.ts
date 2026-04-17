import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  code: string | number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          code: '0000',
          message: '操作成功',
          data,
          timestamp: new Date().toISOString()
        };
      })
    );
  }
}
