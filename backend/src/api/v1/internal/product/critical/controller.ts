import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { productListCritical } from '@/services/product';
import { zNullableFK } from '@/utils/zodValidation';

const securable = 'PRODUCT';

const listSchema = z.object({
  filterIdCategory: zNullableFK.optional(),
  sortBy: z.enum(['quantity', 'code', 'description', 'category']).optional().default('quantity'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * @api {get} /api/v1/internal/product/critical List Critical Products
 * @apiName ListCriticalProducts
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a list of products in critical stock status
 *
 * @apiParam {Number} [filterIdCategory] Filter by category
 * @apiParam {String} [sortBy=quantity] Sort field (quantity, code, description, category)
 * @apiParam {String} [sortDirection=asc] Sort direction (asc or desc)
 *
 * @apiSuccess {Array} data Critical product list
 *
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, listSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await productListCritical({
      ...validated.credential,
      ...validated.params,
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
