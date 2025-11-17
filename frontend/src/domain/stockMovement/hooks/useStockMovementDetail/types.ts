import type { StockMovementDetail } from '../../types';

export interface UseStockMovementDetailOptions {
  id: number;
  enabled?: boolean;
}

export interface UseStockMovementDetailReturn {
  movement: StockMovementDetail | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
