import type { UpdateMinimumStockDto, UpdateMinimumStockResponse } from '../../types';

export interface UseUpdateMinimumStockReturn {
  updateMinimumStock: (
    id: number,
    data: UpdateMinimumStockDto
  ) => Promise<UpdateMinimumStockResponse>;
  isUpdating: boolean;
}
