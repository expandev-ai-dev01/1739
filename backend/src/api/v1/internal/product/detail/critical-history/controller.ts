import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { productCriticalHistoryGet } from '@/services/product';

const securable = 'PRODUCT';

const getSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * @api {get} /api/v1/internal/product/:id/critical-history Get Product Critical History
 * @apiName GetProductCriticalHistory
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves the complete history of critical stock periods for a product
 *
 * @apiParam {Number} id Product identifier
 *
 * @apiSuccess {Object} data Product info and critical history
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Product not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, getSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await productCriticalHistoryGet({
      ...validated.credential,
      idProduct: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
