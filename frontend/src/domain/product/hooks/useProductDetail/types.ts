import type { Product } from '../../types';

export interface UseProductDetailOptions {
  id: number;
  enabled?: boolean;
}

export interface UseProductDetailReturn {
  product: Product | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
