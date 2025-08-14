import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ApiResponse<T = any> {
  success: true;
  data: T;
  metadata: {
    timestamp: string;
    path: string;
    method: string;
    version: string;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    
    return next.handle().pipe(
      map((data) => {
        // If data already has success field (legacy format), extract the actual data
        const responseData = data && typeof data === 'object' && 'success' in data 
          ? this.extractDataFromLegacyFormat(data)
          : data;

        return {
          success: true,
          data: responseData,
          metadata: {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            version: '1.0',
          },
        };
      }),
    );
  }

  private extractDataFromLegacyFormat(legacyResponse: any): any {
    // Handle different legacy response formats
    if (legacyResponse.success === true) {
      // If it has both message and data, combine them
      if (legacyResponse.message && legacyResponse.data) {
        return {
          message: legacyResponse.message,
          ...legacyResponse.data,
        };
      }
      
      // If it has message and other fields (like order, menu, stats)
      if (legacyResponse.message) {
        const { success, message, ...rest } = legacyResponse;
        return {
          message,
          ...rest,
        };
      }

      // If it only has data field
      if (legacyResponse.data) {
        return legacyResponse.data;
      }
    }

    // For other cases, return the whole response excluding success field
    const { success, ...rest } = legacyResponse;
    return rest;
  }
}