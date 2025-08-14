import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

interface ApiDocumentationOptions {
  operation: string;
  success?: {
    status?: number;
    description: string;
    type?: any;
  };
  errors?: {
    status: number;
    description: string;
  }[];
}

export function ApiDocumentation(options: ApiDocumentationOptions) {
  const decorators = [
    ApiOperation({ summary: options.operation }),
  ];

  // Add success response
  if (options.success) {
    decorators.push(
      ApiResponse({
        status: options.success.status || 200,
        description: options.success.description,
        type: options.success.type,
        schema: options.success.type ? undefined : {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            metadata: {
              type: 'object',
              properties: {
                timestamp: { type: 'string', format: 'date-time' },
                path: { type: 'string' },
                method: { type: 'string' },
                version: { type: 'string' },
              },
            },
          },
        },
      }),
    );
  }

  // Add error responses
  if (options.errors) {
    options.errors.forEach((error) => {
      decorators.push(
        ApiResponse({
          status: error.status,
          description: error.description,
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                  details: { type: 'object' },
                },
              },
              metadata: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                  method: { type: 'string' },
                  correlationId: { type: 'string' },
                },
              },
            },
          },
        }),
      );
    });
  }

  return applyDecorators(...decorators);
}

// Convenience decorators for common response patterns
export const ApiSuccessResponse = (description: string, type?: any) =>
  ApiDocumentation({
    operation: '',
    success: { description, type },
  });

export const ApiNotFoundResponse = () =>
  ApiResponse({
    status: 404,
    description: 'Resource not found',
  });

export const ApiBadRequestResponse = () =>
  ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  });

export const ApiValidationErrorResponse = () =>
  ApiResponse({
    status: 422,
    description: 'Validation failed',
  });