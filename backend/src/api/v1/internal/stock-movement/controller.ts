import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { stockMovementCreate, stockMovementList } from '@/services/stockMovement';
import { zFK, zNullableFK } from '@/utils/zodValidation';

const securable = 'STOCK_MOVEMENT';

const createSchema = z.object({
  idProduct: zFK,
  movementType: z.enum(['ENTRY', 'EXIT']),
  quantity: z.number().int().positive(),
  movementDate: z
    .string()
    .datetime()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return date <= new Date();
      },
      { message: 'Movement date cannot be in the future' }
    ),
});

const listSchema = z.object({
  filterIdProduct: zNullableFK.optional(),
  filterMovementType: z.enum(['ENTRY', 'EXIT']).optional(),
  filterDateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  filterDateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sortBy: z
    .enum(['movementDate', 'product', 'quantity', 'type'])
    .optional()
    .default('movementDate'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  pageNumber: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((val) => [10, 25, 50, 100].includes(val))
    .optional()
    .default(50),
});

/**
 * @api {post} /api/v1/internal/stock-movement Create Stock Movement
 * @apiName CreateStockMovement
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new stock movement (entry or exit) and updates current stock
 *
 * @apiParam {Number} idProduct Product identifier
 * @apiParam {String} movementType Movement type (ENTRY or EXIT)
 * @apiParam {Number} quantity Quantity to add or remove
 * @apiParam {String} [movementDate] Movement date and time (ISO 8601 format)
 *
 * @apiSuccess {Number} idStockMovement Created movement identifier
 * @apiSuccess {Number} newQuantity New current stock quantity
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await stockMovementCreate({
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

/**
 * @api {get} /api/v1/internal/stock-movement List Stock Movements
 * @apiName ListStockMovements
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a paginated list of stock movements with filtering and sorting
 *
 * @apiParam {Number} [filterIdProduct] Filter by product
 * @apiParam {String} [filterMovementType] Filter by type (ENTRY or EXIT)
 * @apiParam {String} [filterDateFrom] Filter from date (YYYY-MM-DD)
 * @apiParam {String} [filterDateTo] Filter to date (YYYY-MM-DD)
 * @apiParam {String} [sortBy=movementDate] Sort field
 * @apiParam {String} [sortDirection=desc] Sort direction
 * @apiParam {Number} [pageNumber=1] Page number
 * @apiParam {Number} [pageSize=50] Items per page
 *
 * @apiSuccess {Array} data Stock movement list
 * @apiSuccess {Object} metadata Pagination metadata
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
    const data = await stockMovementList({
      ...validated.credential,
      ...validated.params,
    });

    const totalCount = data.length > 0 ? data[0].totalCount : 0;
    const pageSize = validated.params.pageSize;
    const pageNumber = validated.params.pageNumber;

    res.json(
      successResponse(data, {
        page: pageNumber,
        pageSize: pageSize,
        total: totalCount,
        hasNext: pageNumber * pageSize < totalCount,
        hasPrevious: pageNumber > 1,
      })
    );
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
