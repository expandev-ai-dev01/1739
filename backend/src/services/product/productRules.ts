import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  ProductCreateParams,
  ProductListParams,
  ProductGetParams,
  ProductUpdateParams,
  ProductDeleteParams,
  ProductEntity,
  ProductListItem,
  ProductListCriticalParams,
  ProductCriticalListItem,
  ProductCriticalHistoryGetParams,
  ProductCriticalHistoryResponse,
  ProductUpdateMinimumStockParams,
  ProductCheckCriticalStatusParams,
  ProductCheckCriticalStatusResponse,
} from './productTypes';

/**
 * @summary
 * Creates a new product in the inventory system
 *
 * @function productCreate
 * @module product
 *
 * @param {ProductCreateParams} params - Product creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.code - Product code
 * @param {string} params.description - Product description
 * @param {number} params.idCategory - Category identifier
 * @param {number} params.idUnitOfMeasure - Unit of measure identifier
 * @param {number} [params.minimumStock=5] - Minimum stock level
 * @param {number} [params.active=1] - Active status
 *
 * @returns {Promise<{idProduct: number}>} Created product identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function productCreate(params: ProductCreateParams): Promise<{ idProduct: number }> {
  const result = await dbRequest(
    '[functional].[spProductCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      code: params.code,
      description: params.description,
      idCategory: params.idCategory,
      idUnitOfMeasure: params.idUnitOfMeasure,
      minimumStock: params.minimumStock ?? 5,
      active: params.active ?? 1,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves a paginated list of products with filtering and sorting
 *
 * @function productList
 * @module product
 *
 * @param {ProductListParams} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.filterCode] - Filter by code
 * @param {string} [params.filterDescription] - Filter by description
 * @param {number} [params.filterIdCategory] - Filter by category
 * @param {number} [params.filterActive] - Filter by status
 * @param {string} [params.sortBy='code'] - Sort field
 * @param {string} [params.sortDirection='asc'] - Sort direction
 * @param {number} [params.pageNumber=1] - Page number
 * @param {number} [params.pageSize=25] - Items per page
 *
 * @returns {Promise<ProductListItem[]>} List of products
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function productList(params: ProductListParams): Promise<ProductListItem[]> {
  const result = await dbRequest(
    '[functional].[spProductList]',
    {
      idAccount: params.idAccount,
      filterCode: params.filterCode ?? null,
      filterDescription: params.filterDescription ?? null,
      filterIdCategory: params.filterIdCategory ?? null,
      filterActive: params.filterActive ?? null,
      sortBy: params.sortBy ?? 'code',
      sortDirection: params.sortDirection ?? 'asc',
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 25,
    },
    ExpectedReturn.Multi
  );

  return result;
}

/**
 * @summary
 * Retrieves detailed information for a specific product
 *
 * @function productGet
 * @module product
 *
 * @param {ProductGetParams} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idProduct - Product identifier
 *
 * @returns {Promise<ProductEntity>} Product details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When product doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function productGet(params: ProductGetParams): Promise<ProductEntity> {
  const result = await dbRequest(
    '[functional].[spProductGet]',
    {
      idAccount: params.idAccount,
      idProduct: params.idProduct,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Updates an existing product
 *
 * @function productUpdate
 * @module product
 *
 * @param {ProductUpdateParams} params - Update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idProduct - Product identifier
 * @param {string} params.description - Product description
 * @param {number} params.idCategory - Category identifier
 * @param {number} params.idUnitOfMeasure - Unit of measure identifier
 * @param {number} params.minimumStock - Minimum stock level
 * @param {number} params.active - Active status
 *
 * @returns {Promise<{idProduct: number}>} Updated product identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When product doesn't exist
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function productUpdate(params: ProductUpdateParams): Promise<{ idProduct: number }> {
  const result = await dbRequest(
    '[functional].[spProductUpdate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idProduct: params.idProduct,
      description: params.description,
      idCategory: params.idCategory,
      idUnitOfMeasure: params.idUnitOfMeasure,
      minimumStock: params.minimumStock,
      active: params.active,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Deletes a product (soft delete)
 *
 * @function productDelete
 * @module product
 *
 * @param {ProductDeleteParams} params - Delete parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idProduct - Product identifier
 *
 * @returns {Promise<{idProduct: number}>} Deleted product identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When product doesn't exist
 * @throws {BusinessRuleError} When product has dependencies
 * @throws {DatabaseError} When database operation fails
 */
export async function productDelete(params: ProductDeleteParams): Promise<{ idProduct: number }> {
  const result = await dbRequest(
    '[functional].[spProductDelete]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idProduct: params.idProduct,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves a list of products in critical stock status
 *
 * @function productListCritical
 * @module product
 *
 * @param {ProductListCriticalParams} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} [params.filterIdCategory] - Filter by category
 * @param {string} [params.sortBy='quantity'] - Sort field
 * @param {string} [params.sortDirection='asc'] - Sort direction
 *
 * @returns {Promise<ProductCriticalListItem[]>} List of critical products
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function productListCritical(
  params: ProductListCriticalParams
): Promise<ProductCriticalListItem[]> {
  const result = await dbRequest(
    '[functional].[spProductListCritical]',
    {
      idAccount: params.idAccount,
      filterIdCategory: params.filterIdCategory ?? null,
      sortBy: params.sortBy ?? 'quantity',
      sortDirection: params.sortDirection ?? 'asc',
    },
    ExpectedReturn.Multi
  );

  return result;
}

/**
 * @summary
 * Retrieves the complete history of critical stock periods for a product
 *
 * @function productCriticalHistoryGet
 * @module product
 *
 * @param {ProductCriticalHistoryGetParams} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idProduct - Product identifier
 *
 * @returns {Promise<ProductCriticalHistoryResponse>} Product info and critical history
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When product doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function productCriticalHistoryGet(
  params: ProductCriticalHistoryGetParams
): Promise<ProductCriticalHistoryResponse> {
  const result = await dbRequest(
    '[functional].[spProductCriticalHistoryGet]',
    {
      idAccount: params.idAccount,
      idProduct: params.idProduct,
    },
    ExpectedReturn.Multi,
    undefined,
    ['productInfo', 'criticalHistory']
  );

  return {
    productInfo: result.productInfo[0],
    criticalHistory: result.criticalHistory,
  };
}

/**
 * @summary
 * Updates the minimum stock level for a product and re-evaluates critical status
 *
 * @function productUpdateMinimumStock
 * @module product
 *
 * @param {ProductUpdateMinimumStockParams} params - Update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idProduct - Product identifier
 * @param {number} params.minimumStock - New minimum stock level
 *
 * @returns {Promise<ProductCheckCriticalStatusResponse>} Updated status information
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When product doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function productUpdateMinimumStock(
  params: ProductUpdateMinimumStockParams
): Promise<ProductCheckCriticalStatusResponse> {
  const result = await dbRequest(
    '[functional].[spProductUpdateMinimumStock]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idProduct: params.idProduct,
      minimumStock: params.minimumStock,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Checks and updates the critical status of a product
 *
 * @function productCheckCriticalStatus
 * @module product
 *
 * @param {ProductCheckCriticalStatusParams} params - Check parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idProduct - Product identifier
 *
 * @returns {Promise<ProductCheckCriticalStatusResponse>} Critical status information
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When product doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function productCheckCriticalStatus(
  params: ProductCheckCriticalStatusParams
): Promise<ProductCheckCriticalStatusResponse> {
  const result = await dbRequest(
    '[functional].[spProductCheckCriticalStatus]',
    {
      idAccount: params.idAccount,
      idProduct: params.idProduct,
    },
    ExpectedReturn.Single
  );

  return result;
}
