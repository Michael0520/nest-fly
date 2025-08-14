import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: string;
    path: string;
    method: string;
    correlationId: string;
  };
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const correlationId = this.generateCorrelationId();
    
    const exceptionResponse = exception.getResponse();
    const errorMessage = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : (exceptionResponse as any)?.message || 'Internal server error';

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: this.getErrorCode(status, exception),
        message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        details: typeof exceptionResponse === 'object' ? exceptionResponse : undefined,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        correlationId,
      },
    };

    // Log the error based on severity
    this.logError(exception, request, correlationId, status);

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number, exception: HttpException): string {
    const statusCodeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      500: 'INTERNAL_SERVER_ERROR',
    };

    return statusCodeMap[status] || `HTTP_${status}`;
  }

  private logError(
    exception: HttpException,
    request: Request,
    correlationId: string,
    status: number,
  ) {
    const logContext = {
      correlationId,
      method: request.method,
      url: request.url,
      statusCode: status,
      userAgent: request.get('user-agent'),
      ip: request.ip,
    };

    if (status >= 500) {
      this.logger.error(
        `Internal server error: ${exception.message}`,
        {
          ...logContext,
          stack: exception.stack,
          body: request.body,
        }
      );
    } else if (status >= 400) {
      this.logger.warn(
        `Client error: ${exception.message}`,
        logContext
      );
    }
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}