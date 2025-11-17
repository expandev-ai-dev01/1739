import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { productUpdateMinimumStock } from '@/services/product';

const securable = 'PRODUCT';

const patchSchema = z.object({
  id: z.coerce.number().int().positive(),
  minimumStock: z.number().int().min(0),
});

/**
 * @api {patch} /api/v1/internal/product/:id/minimum-stock Update Product Minimum Stock
 * @apiName UpdateProductMinimumStock
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates the minimum stock level for a product and re-evaluates critical status
 *
 * @apiParam {Number} id Product identifier
 * @apiParam {Number} minimumStock New minimum stock level
 *
 * @apiSuccess {Object} data Updated status information
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Product not found
 * @apiError {String} ServerError Internal server error
 */
export async function patchHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.update(req, patchSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await productUpdateMinimumStock({
      ...validated.credential,
      idProduct: validated.params.id,
      minimumStock: validated.params.minimumStock,
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
