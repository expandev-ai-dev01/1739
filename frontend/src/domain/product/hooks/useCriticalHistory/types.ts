import type { ProductCriticalHistory } from '../../types';

export interface UseCriticalHistoryOptions {
  id: number;
  enabled?: boolean;
}

export interface UseCriticalHistoryReturn {
  data: ProductCriticalHistory | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
