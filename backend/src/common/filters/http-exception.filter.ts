import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  code: string | number;
  message: string;
  error?: {
    field?: string;
    message: string;
  };
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let errorInfo: ErrorResponse['error'];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, any>;
        message = resp.message || message;
        if (Array.isArray(resp.message)) {
          message = resp.message[0];
        }
        if (resp.field) {
          errorInfo = { field: resp.field, message };
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = exception as Prisma.PrismaClientKnownRequestError;
      if (prismaError.code === 'P2002') {
        status = HttpStatus.BAD_REQUEST;
        message = '学号已存在，请使用不同的学号';
      } else if (prismaError.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = '记录不存在';
      } else {
        message = `数据库错误: ${prismaError.code}`;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    }

    const errorResponse: ErrorResponse = {
      code: '0000',
      message,
      timestamp: new Date().toISOString(),
      path: request.url
    };

    if (errorInfo) {
      errorResponse.error = errorInfo;
    }

    response.status(status).json(errorResponse);
  }
}
