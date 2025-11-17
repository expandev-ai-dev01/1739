/**
 * @interface ProductEntity
 * @description Represents a product entity in the system
 *
 * @property {number} idProduct - Unique product identifier
 * @property {string} code - Product code
 * @property {string} description - Product description
 * @property {number} idCategory - Category identifier
 * @property {string} categoryName - Category name
 * @property {string} categoryDescription - Category description
 * @property {number} idUnitOfMeasure - Unit of measure identifier
 * @property {string} unitOfMeasureCode - Unit of measure code
 * @property {string} unitOfMeasureName - Unit of measure name
 * @property {number} minimumStock - Minimum stock level
 * @property {number} active - Active status (0 or 1)
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface ProductEntity {
  idProduct: number;
  code: string;
  description: string;
  idCategory: number;
  categoryName: string;
  categoryDescription: string;
  idUnitOfMeasure: number;
  unitOfMeasureCode: string;
  unitOfMeasureName: string;
  minimumStock: number;
  active: number;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface ProductListItem
 * @description Represents a product in list view
 *
 * @property {number} idProduct - Product identifier
 * @property {string} code - Product code
 * @property {string} description - Product description
 * @property {number} idCategory - Category identifier
 * @property {string} categoryName - Category name
 * @property {number} idUnitOfMeasure - Unit of measure identifier
 * @property {string} unitOfMeasureCode - Unit of measure code
 * @property {string} unitOfMeasureName - Unit of measure name
 * @property {number} minimumStock - Minimum stock level
 * @property {number} active - Active status
 * @property {Date} dateCreated - Creation date
 * @property {Date} dateModified - Last modification date
 * @property {number} totalCount - Total count for pagination
 */
export interface ProductListItem {
  idProduct: number;
  code: string;
  description: string;
  idCategory: number;
  categoryName: string;
  idUnitOfMeasure: number;
  unitOfMeasureCode: string;
  unitOfMeasureName: string;
  minimumStock: number;
  active: number;
  dateCreated: Date;
  dateModified: Date;
  totalCount: number;
}

/**
 * @interface ProductCreateParams
 * @description Parameters for creating a new product
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} code - Product code
 * @property {string} description - Product description
 * @property {number} idCategory - Category identifier
 * @property {number} idUnitOfMeasure - Unit of measure identifier
 * @property {number} [minimumStock] - Minimum stock level
 * @property {number} [active] - Active status
 */
export interface ProductCreateParams {
  idAccount: number;
  idUser: number;
  code: string;
  description: string;
  idCategory: number;
  idUnitOfMeasure: number;
  minimumStock?: number;
  active?: number;
}

/**
 * @interface ProductListParams
 * @description Parameters for listing products
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [filterCode] - Filter by code
 * @property {string} [filterDescription] - Filter by description
 * @property {number} [filterIdCategory] - Filter by category
 * @property {number} [filterActive] - Filter by status
 * @property {string} [sortBy] - Sort field
 * @property {string} [sortDirection] - Sort direction
 * @property {number} [pageNumber] - Page number
 * @property {number} [pageSize] - Items per page
 */
export interface ProductListParams {
  idAccount: number;
  filterCode?: string;
  filterDescription?: string;
  filterIdCategory?: number;
  filterActive?: number;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * @interface ProductGetParams
 * @description Parameters for getting a product
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduct - Product identifier
 */
export interface ProductGetParams {
  idAccount: number;
  idProduct: number;
}

/**
 * @interface ProductUpdateParams
 * @description Parameters for updating a product
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idProduct - Product identifier
 * @property {string} description - Product description
 * @property {number} idCategory - Category identifier
 * @property {number} idUnitOfMeasure - Unit of measure identifier
 * @property {number} minimumStock - Minimum stock level
 * @property {number} active - Active status
 */
export interface ProductUpdateParams {
  idAccount: number;
  idUser: number;
  idProduct: number;
  description: string;
  idCategory: number;
  idUnitOfMeasure: number;
  minimumStock: number;
  active: number;
}

/**
 * @interface ProductDeleteParams
 * @description Parameters for deleting a product
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idProduct - Product identifier
 */
export interface ProductDeleteParams {
  idAccount: number;
  idUser: number;
  idProduct: number;
}

/**
 * @interface ProductCriticalListItem
 * @description Represents a product in critical stock status
 *
 * @property {number} idProduct - Product identifier
 * @property {string} code - Product code
 * @property {string} description - Product description
 * @property {number} idCategory - Category identifier
 * @property {string} categoryName - Category name
 * @property {number} idUnitOfMeasure - Unit of measure identifier
 * @property {string} unitOfMeasureCode - Unit of measure code
 * @property {string} unitOfMeasureName - Unit of measure name
 * @property {number} minimumStock - Minimum stock level
 * @property {number} currentQuantity - Current stock quantity
 * @property {number} criticalStatus - Critical status flag
 * @property {number} zeroStock - Indicates if stock is completely depleted
 * @property {Date} lastUpdate - Last update timestamp
 */
export interface ProductCriticalListItem {
  idProduct: number;
  code: string;
  description: string;
  idCategory: number;
  categoryName: string;
  idUnitOfMeasure: number;
  unitOfMeasureCode: string;
  unitOfMeasureName: string;
  minimumStock: number;
  currentQuantity: number;
  criticalStatus: number;
  zeroStock: number;
  lastUpdate: Date;
}

/**
 * @interface ProductListCriticalParams
 * @description Parameters for listing critical products
 *
 * @property {number} idAccount - Account identifier
 * @property {number} [filterIdCategory] - Filter by category
 * @property {string} [sortBy] - Sort field
 * @property {string} [sortDirection] - Sort direction
 */
export interface ProductListCriticalParams {
  idAccount: number;
  filterIdCategory?: number;
  sortBy?: string;
  sortDirection?: string;
}

/**
 * @interface ProductCriticalHistoryItem
 * @description Represents a critical stock history record
 *
 * @property {number} idCriticalStockHistory - History record identifier
 * @property {Date} entryDate - Date product entered critical status
 * @property {Date | null} exitDate - Date product exited critical status
 * @property {number} minimumQuantity - Lowest quantity reached during period
 * @property {number | null} durationDays - Number of days in critical status
 * @property {number} isActive - Indicates if this is the current active period
 */
export interface ProductCriticalHistoryItem {
  idCriticalStockHistory: number;
  entryDate: Date;
  exitDate: Date | null;
  minimumQuantity: number;
  durationDays: number | null;
  isActive: number;
}

/**
 * @interface ProductCriticalHistoryInfo
 * @description Product information for critical history
 *
 * @property {number} idProduct - Product identifier
 * @property {string} code - Product code
 * @property {string} description - Product description
 * @property {number} minimumStock - Current minimum stock level
 * @property {number} criticalStatus - Current critical status
 */
export interface ProductCriticalHistoryInfo {
  idProduct: number;
  code: string;
  description: string;
  minimumStock: number;
  criticalStatus: number;
}

/**
 * @interface ProductCriticalHistoryResponse
 * @description Response containing product info and critical history
 *
 * @property {ProductCriticalHistoryInfo} productInfo - Product information
 * @property {ProductCriticalHistoryItem[]} criticalHistory - Critical history records
 */
export interface ProductCriticalHistoryResponse {
  productInfo: ProductCriticalHistoryInfo;
  criticalHistory: ProductCriticalHistoryItem[];
}

/**
 * @interface ProductCriticalHistoryGetParams
 * @description Parameters for getting product critical history
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduct - Product identifier
 */
export interface ProductCriticalHistoryGetParams {
  idAccount: number;
  idProduct: number;
}

/**
 * @interface ProductUpdateMinimumStockParams
 * @description Parameters for updating product minimum stock
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idProduct - Product identifier
 * @property {number} minimumStock - New minimum stock level
 */
export interface ProductUpdateMinimumStockParams {
  idAccount: number;
  idUser: number;
  idProduct: number;
  minimumStock: number;
}

/**
 * @interface ProductCheckCriticalStatusParams
 * @description Parameters for checking product critical status
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduct - Product identifier
 */
export interface ProductCheckCriticalStatusParams {
  idAccount: number;
  idProduct: number;
}

/**
 * @interface ProductCheckCriticalStatusResponse
 * @description Response from critical status check
 *
 * @property {number} idProduct - Product identifier
 * @property {number} criticalStatus - Current critical status
 * @property {number} currentQuantity - Current stock quantity
 * @property {number} minimumStock - Configured minimum stock level
 * @property {Date} verificationDate - Date and time of verification
 */
export interface ProductCheckCriticalStatusResponse {
  idProduct: number;
  criticalStatus: number;
  currentQuantity: number;
  minimumStock: number;
  verificationDate: Date;
}
