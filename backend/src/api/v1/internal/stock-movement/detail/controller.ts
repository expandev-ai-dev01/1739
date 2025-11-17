import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { stockMovementGet } from '@/services/stockMovement';

const securable = 'STOCK_MOVEMENT';

const getSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * @api {get} /api/v1/internal/stock-movement/:id Get Stock Movement
 * @apiName GetStockMovement
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific stock movement
 *
 * @apiParam {Number} id Stock movement identifier
 *
 * @apiSuccess {Object} data Stock movement details
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Stock movement not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, getSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await stockMovementGet({
      ...validated.credential,
      idStockMovement: validated.params.id,
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
