import type { CreateStockMovementDto } from '../../types';

export interface UseStockMovementCreateReturn {
  create: (
    data: CreateStockMovementDto
  ) => Promise<{ idStockMovement: number; newQuantity: number }>;
  isCreating: boolean;
}
