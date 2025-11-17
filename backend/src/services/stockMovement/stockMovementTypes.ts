/**
 * @interface StockMovementEntity
 * @description Represents a stock movement entity in the system
 *
 * @property {number} idStockMovement - Unique stock movement identifier
 * @property {number} idProduct - Product identifier
 * @property {string} productCode - Product code
 * @property {string} productDescription - Product description
 * @property {string} movementType - Movement type (ENTRY or EXIT)
 * @property {number} quantity - Quantity moved
 * @property {Date} movementDate - Movement date and time
 * @property {Date} dateCreated - Record creation timestamp
 * @property {number} currentQuantity - Current stock quantity after this movement
 */
export interface StockMovementEntity {
  idStockMovement: number;
  idProduct: number;
  productCode: string;
  productDescription: string;
  movementType: string;
  quantity: number;
  movementDate: Date;
  dateCreated: Date;
  currentQuantity: number;
}

/**
 * @interface StockMovementListItem
 * @description Represents a stock movement in list view
 *
 * @property {number} idStockMovement - Stock movement identifier
 * @property {number} idProduct - Product identifier
 * @property {string} productCode - Product code
 * @property {string} productDescription - Product description
 * @property {string} movementType - Movement type (ENTRY or EXIT)
 * @property {number} quantity - Quantity moved
 * @property {Date} movementDate - Movement date and time
 * @property {Date} dateCreated - Record creation date
 * @property {number} totalCount - Total count for pagination
 */
export interface StockMovementListItem {
  idStockMovement: number;
  idProduct: number;
  productCode: string;
  productDescription: string;
  movementType: string;
  quantity: number;
  movementDate: Date;
  dateCreated: Date;
  totalCount: number;
}

/**
 * @interface StockMovementCreateParams
 * @description Parameters for creating a new stock movement
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idProduct - Product identifier
 * @property {string} movementType - Movement type (ENTRY or EXIT)
 * @property {number} quantity - Quantity to add or remove
 * @property {string} [movementDate] - Movement date and time (ISO 8601 format)
 */
export interface StockMovementCreateParams {
  idAccount: number;
  idUser: number;
  idProduct: number;
  movementType: string;
  quantity: number;
  movementDate?: string;
}

/**
 * @interface StockMovementListParams
 * @description Parameters for listing stock movements
 *
 * @property {number} idAccount - Account identifier
 * @property {number} [filterIdProduct] - Filter by product
 * @property {string} [filterMovementType] - Filter by type (ENTRY or EXIT)
 * @property {string} [filterDateFrom] - Filter from date (YYYY-MM-DD)
 * @property {string} [filterDateTo] - Filter to date (YYYY-MM-DD)
 * @property {string} [sortBy] - Sort field
 * @property {string} [sortDirection] - Sort direction
 * @property {number} [pageNumber] - Page number
 * @property {number} [pageSize] - Items per page
 */
export interface StockMovementListParams {
  idAccount: number;
  filterIdProduct?: number;
  filterMovementType?: string;
  filterDateFrom?: string;
  filterDateTo?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * @interface StockMovementGetParams
 * @description Parameters for getting a stock movement
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idStockMovement - Stock movement identifier
 */
export interface StockMovementGetParams {
  idAccount: number;
  idStockMovement: number;
}
