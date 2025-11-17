import { Request } from 'express';
import { z } from 'zod';
import { createError } from '@/middleware/error';

export interface SecurityRule {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidatedRequest {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

export class CrudController {
  private rules: SecurityRule[];

  constructor(rules: SecurityRule[]) {
    this.rules = rules;
  }

  private async validateSecurity(
    req: Request,
    permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  ): Promise<{ idAccount: number; idUser: number }> {
    const idAccount = parseInt(req.headers['x-account-id'] as string);
    const idUser = parseInt(req.headers['x-user-id'] as string);

    if (!idAccount || !idUser) {
      throw createError('authenticationRequired', 401, 'UNAUTHORIZED');
    }

    return { idAccount, idUser };
  }

  private async validateParams<T extends z.ZodTypeAny>(
    req: Request,
    schema: T
  ): Promise<z.infer<T>> {
    try {
      const params = {
        ...req.params,
        ...req.query,
        ...req.body,
      };
      return await schema.parseAsync(params);
    } catch (error: any) {
      throw createError('validationFailed', 422, 'VALIDATION_ERROR', error.errors);
    }
  }

  async create<T extends z.ZodTypeAny>(
    req: Request,
    schema: T
  ): Promise<[ValidatedRequest | null, any]> {
    try {
      const credential = await this.validateSecurity(req, 'CREATE');
      const params = await this.validateParams(req, schema);
      return [{ credential, params }, null];
    } catch (error) {
      return [null, error];
    }
  }

  async read<T extends z.ZodTypeAny>(
    req: Request,
    schema: T
  ): Promise<[ValidatedRequest | null, any]> {
    try {
      const credential = await this.validateSecurity(req, 'READ');
      const params = await this.validateParams(req, schema);
      return [{ credential, params }, null];
    } catch (error) {
      return [null, error];
    }
  }

  async update<T extends z.ZodTypeAny>(
    req: Request,
    schema: T
  ): Promise<[ValidatedRequest | null, any]> {
    try {
      const credential = await this.validateSecurity(req, 'UPDATE');
      const params = await this.validateParams(req, schema);
      return [{ credential, params }, null];
    } catch (error) {
      return [null, error];
    }
  }

  async delete<T extends z.ZodTypeAny>(
    req: Request,
    schema: T
  ): Promise<[ValidatedRequest | null, any]> {
    try {
      const credential = await this.validateSecurity(req, 'DELETE');
      const params = await this.validateParams(req, schema);
      return [{ credential, params }, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export function successResponse<T>(data: T, metadata?: any) {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

export function errorResponse(message: string, code?: string, details?: any) {
  return {
    success: false,
    error: {
      code: code || 'ERROR',
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

export const StatusGeneralError = createError(
  'An unexpected error occurred',
  500,
  'INTERNAL_SERVER_ERROR'
);
