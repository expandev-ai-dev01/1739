export interface StockMovement {
  idStockMovement: number;
  idProduct: number;
  productCode: string;
  productDescription: string;
  movementType: 'ENTRY' | 'EXIT';
  quantity: number;
  movementDate: string;
  userResponsible: string;
  totalCount?: number;
}

export interface StockMovementListParams {
  filterIdProduct?: number;
  filterMovementType?: 'ENTRY' | 'EXIT';
  filterDateFrom?: string;
  filterDateTo?: string;
  sortBy?: 'movementDate' | 'product' | 'quantity' | 'type';
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateStockMovementDto {
  idProduct: number;
  movementType: 'ENTRY' | 'EXIT';
  quantity: number;
  movementDate?: string;
}

export interface StockMovementDetail {
  idStockMovement: number;
  idProduct: number;
  productCode: string;
  productDescription: string;
  categoryName: string;
  unitOfMeasureName: string;
  movementType: 'ENTRY' | 'EXIT';
  quantity: number;
  movementDate: string;
  userResponsible: string;
  previousStock: number;
  newStock: number;
}
