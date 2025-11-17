import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  StockMovementCreateParams,
  StockMovementListParams,
  StockMovementGetParams,
  StockMovementEntity,
  StockMovementListItem,
} from './stockMovementTypes';

/**
 * @summary
 * Creates a new stock movement (entry or exit) and updates current stock quantity
 *
 * @function stockMovementCreate
 * @module stockMovement
 *
 * @param {StockMovementCreateParams} params - Stock movement creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idProduct - Product identifier
 * @param {string} params.movementType - Movement type (ENTRY or EXIT)
 * @param {number} params.quantity - Quantity to add or remove
 * @param {string} [params.movementDate] - Movement date and time
 *
 * @returns {Promise<{idStockMovement: number, newQuantity: number}>} Created movement and new stock quantity
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementCreate(
  params: StockMovementCreateParams
): Promise<{ idStockMovement: number; newQuantity: number }> {
  const result = await dbRequest(
    '[functional].[spStockMovementCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idProduct: params.idProduct,
      movementType: params.movementType,
      quantity: params.quantity,
      movementDate: params.movementDate ?? null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves a paginated list of stock movements with filtering and sorting
 *
 * @function stockMovementList
 * @module stockMovement
 *
 * @param {StockMovementListParams} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} [params.filterIdProduct] - Filter by product
 * @param {string} [params.filterMovementType] - Filter by type
 * @param {string} [params.filterDateFrom] - Filter from date
 * @param {string} [params.filterDateTo] - Filter to date
 * @param {string} [params.sortBy='movementDate'] - Sort field
 * @param {string} [params.sortDirection='desc'] - Sort direction
 * @param {number} [params.pageNumber=1] - Page number
 * @param {number} [params.pageSize=50] - Items per page
 *
 * @returns {Promise<StockMovementListItem[]>} List of stock movements
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementList(
  params: StockMovementListParams
): Promise<StockMovementListItem[]> {
  const result = await dbRequest(
    '[functional].[spStockMovementList]',
    {
      idAccount: params.idAccount,
      filterIdProduct: params.filterIdProduct ?? null,
      filterMovementType: params.filterMovementType ?? null,
      filterDateFrom: params.filterDateFrom ?? null,
      filterDateTo: params.filterDateTo ?? null,
      sortBy: params.sortBy ?? 'movementDate',
      sortDirection: params.sortDirection ?? 'desc',
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 50,
    },
    ExpectedReturn.Multi
  );

  return result;
}

/**
 * @summary
 * Retrieves detailed information for a specific stock movement
 *
 * @function stockMovementGet
 * @module stockMovement
 *
 * @param {StockMovementGetParams} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idStockMovement - Stock movement identifier
 *
 * @returns {Promise<StockMovementEntity>} Stock movement details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When stock movement doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementGet(
  params: StockMovementGetParams
): Promise<StockMovementEntity> {
  const result = await dbRequest(
    '[functional].[spStockMovementGet]',
    {
      idAccount: params.idAccount,
      idStockMovement: params.idStockMovement,
    },
    ExpectedReturn.Single
  );

  return result;
}
