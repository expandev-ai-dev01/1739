import type { CriticalProduct, CriticalProductListParams } from '../../types';

export interface UseCriticalProductsOptions {
  filters?: CriticalProductListParams;
  enabled?: boolean;
}

export interface UseCriticalProductsReturn {
  data: CriticalProduct[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
