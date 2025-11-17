export interface Product {
  idProduct: number;
  code: string;
  description: string;
  idCategory: number;
  categoryName?: string;
  idUnitOfMeasure: number;
  unitOfMeasureName?: string;
  minimumStock: number;
  active: number;
  dateCreated: string;
  dateUpdated?: string;
  currentStock?: number;
  lastMovement?: string;
  isCritical?: boolean;
}

export interface ProductListParams {
  filterCode?: string;
  filterDescription?: string;
  filterIdCategory?: number;
  filterActive?: number;
  sortBy?: 'code' | 'description' | 'category' | 'dateCreated';
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateProductDto {
  code: string;
  description: string;
  idCategory: number;
  idUnitOfMeasure: number;
  minimumStock?: number;
  active?: number;
}

export interface UpdateProductDto {
  description: string;
  idCategory: number;
  idUnitOfMeasure: number;
  minimumStock: number;
  active: number;
}

export interface Category {
  idCategory: number;
  name: string;
}

export interface UnitOfMeasure {
  idUnitOfMeasure: number;
  name: string;
  abbreviation: string;
}

export interface CriticalProduct {
  idProduct: number;
  code: string;
  description: string;
  categoryName: string;
  currentStock: number;
  minimumStock: number;
  unitOfMeasureName: string;
}

export interface CriticalProductListParams {
  filterIdCategory?: number;
  sortBy?: 'quantity' | 'code' | 'description' | 'category';
  sortDirection?: 'asc' | 'desc';
}

export interface CriticalHistoryEntry {
  idHistory: number;
  dateEntered: string;
  dateExited?: string;
  minimumQuantity: number;
  durationDays?: number;
}

export interface ProductCriticalHistory {
  product: {
    idProduct: number;
    code: string;
    description: string;
    categoryName: string;
    minimumStock: number;
    currentStock: number;
  };
  history: CriticalHistoryEntry[];
}

export interface UpdateMinimumStockDto {
  minimumStock: number;
}

export interface UpdateMinimumStockResponse {
  idProduct: number;
  minimumStock: number;
  previousMinimumStock: number;
  isCritical: boolean;
  wasRevaluated: boolean;
}
