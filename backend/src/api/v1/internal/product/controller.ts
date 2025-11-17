import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  productCreate,
  productList,
  productGet,
  productUpdate,
  productDelete,
} from '@/services/product';
import { zString, zFK, zBit, zNullableString, zNullableFK } from '@/utils/zodValidation';

const securable = 'PRODUCT';

const createSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9]+$/, 'Code must contain only uppercase letters and numbers'),
  description: z.string().min(5).max(200),
  idCategory: zFK,
  idUnitOfMeasure: zFK,
  minimumStock: z.number().int().min(0).optional().default(5),
  active: zBit.optional().default(1),
});

const listSchema = z.object({
  filterCode: z.string().max(20).optional(),
  filterDescription: z.string().max(200).optional(),
  filterIdCategory: zNullableFK.optional(),
  filterActive: zBit.optional(),
  sortBy: z.enum(['code', 'description', 'category', 'dateCreated']).optional().default('code'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('asc'),
  pageNumber: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((val) => [10, 25, 50, 100].includes(val))
    .optional()
    .default(25),
});

const getSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  description: z.string().min(5).max(200),
  idCategory: zFK,
  idUnitOfMeasure: zFK,
  minimumStock: z.number().int().min(0),
  active: zBit,
});

const deleteSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * @api {post} /api/v1/internal/product Create Product
 * @apiName CreateProduct
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new product in the inventory system
 *
 * @apiParam {String} code Product code (3-20 uppercase letters/numbers)
 * @apiParam {String} description Product description (5-200 characters)
 * @apiParam {Number} idCategory Category identifier
 * @apiParam {Number} idUnitOfMeasure Unit of measure identifier
 * @apiParam {Number} [minimumStock=5] Minimum stock level
 * @apiParam {Number} [active=1] Active status (0 or 1)
 *
 * @apiSuccess {Number} idProduct Created product identifier
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
    const data = await productCreate({
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
 * @api {get} /api/v1/internal/product List Products
 * @apiName ListProducts
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a paginated list of products with filtering and sorting
 *
 * @apiParam {String} [filterCode] Filter by product code
 * @apiParam {String} [filterDescription] Filter by description
 * @apiParam {Number} [filterIdCategory] Filter by category
 * @apiParam {Number} [filterActive] Filter by status
 * @apiParam {String} [sortBy=code] Sort field
 * @apiParam {String} [sortDirection=asc] Sort direction
 * @apiParam {Number} [pageNumber=1] Page number
 * @apiParam {Number} [pageSize=25] Items per page
 *
 * @apiSuccess {Array} data Product list
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
    const data = await productList({
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
