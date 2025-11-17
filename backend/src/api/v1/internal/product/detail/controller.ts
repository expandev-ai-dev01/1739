import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { productGet, productUpdate, productDelete } from '@/services/product';
import { zFK, zBit } from '@/utils/zodValidation';

const securable = 'PRODUCT';

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
 * @api {get} /api/v1/internal/product/:id Get Product
 * @apiName GetProduct
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific product
 *
 * @apiParam {Number} id Product identifier
 *
 * @apiSuccess {Object} data Product details
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
    const data = await productGet({
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

/**
 * @api {put} /api/v1/internal/product/:id Update Product
 * @apiName UpdateProduct
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing product
 *
 * @apiParam {Number} id Product identifier
 * @apiParam {String} description Product description (5-200 characters)
 * @apiParam {Number} idCategory Category identifier
 * @apiParam {Number} idUnitOfMeasure Unit of measure identifier
 * @apiParam {Number} minimumStock Minimum stock level
 * @apiParam {Number} active Active status (0 or 1)
 *
 * @apiSuccess {Number} idProduct Updated product identifier
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Product not found
 * @apiError {String} ServerError Internal server error
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.update(req, updateSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await productUpdate({
      ...validated.credential,
      idProduct: validated.params.id,
      description: validated.params.description,
      idCategory: validated.params.idCategory,
      idUnitOfMeasure: validated.params.idUnitOfMeasure,
      minimumStock: validated.params.minimumStock,
      active: validated.params.active,
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
 * @api {delete} /api/v1/internal/product/:id Delete Product
 * @apiName DeleteProduct
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a product (soft delete)
 *
 * @apiParam {Number} id Product identifier
 *
 * @apiSuccess {Number} idProduct Deleted product identifier
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} NotFoundError Product not found
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const [validated, error] = await operation.delete(req, deleteSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await productDelete({
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
